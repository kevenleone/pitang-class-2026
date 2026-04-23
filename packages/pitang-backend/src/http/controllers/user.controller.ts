import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import crypto from "crypto";
import z from "zod";

import { environment } from "../../core/EnvVars";
import { prisma } from "../../core/PrismaClient";
import { userSchema } from "../../schemas";
import jsonwebtoken from "jsonwebtoken";
import {
  registerMailQueue,
  REGISTER_EMAIL_JOB,
} from "../../queues/register.mail.queue";

export async function getUsers(request: Request, response: Response) {
  const users = await prisma.user.findMany({
    omit: { password: true },
  });

  response.json(users);
}

export async function postUser(request: Request, response: Response) {
  const { error, data } = userSchema.safeParse(request.body);

  if (error) {
    return response.status(400).json(z.treeifyError(error).properties);
  }

  let user = await prisma.user.findUnique({ where: { email: data.email } });

  if (user) {
    return response.status(409).json({ message: "User already registered" });
  }

  const salt = bcrypt.genSaltSync(10);

  data.password = await bcrypt.hashSync(data.password, salt);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  user = await prisma.user.create({
    data: { ...data, verificationToken },
  });

  await registerMailQueue.add(REGISTER_EMAIL_JOB, user, {attempts: 3, backoff: 10000});

  response.status(201).json(user);
}

export async function getUser(request: Request, response: Response) {
  const id = request.params.id as string;

  const user = await prisma.user.findUnique({
    omit: { password: true },
    where: { id },
  });

  if (!user) {
    return response.status(404).json({ message: "User not exists" });
  }

  response.json(user);
}

export async function patchUser(request: Request, response: Response) {
  const {
    body,
    params: { id },
  } = request;

  const user = await prisma.user.update({
    data: body,
    where: { id: id as string },
  });

  response.json(user);
}

export async function deleteUser(request: Request, response: Response) {
  await prisma.user.delete({ where: { id: request.params.id as string } });

  response.status(204).send();
}

export async function login(request: Request, response: Response) {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "Invalid credentials" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return response.status(400).json({ message: "User not found" });
  }

  if (bcrypt.compareSync(password, user.password)) {
    delete (user as any).password;

    return response.status(200).json({
      token: jsonwebtoken.sign(user, environment.JWT_SECRET, {
        expiresIn: "30minutes",
      }),
    });
  }

  response.status(400).json({ message: "Invalid password" });
}
