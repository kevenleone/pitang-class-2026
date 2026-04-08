import bcrypt from "bcryptjs";
import express from "express";
import jsonwebtoken from "jsonwebtoken";
import z from "zod";

import { prisma } from "../core/PrismaClient";
import { userSchema } from "../schemas";
import { environment } from "../core/EnvVars";

const userRouter = express.Router();

userRouter.post("/login", async (request, response) => {
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
});

userRouter.get("/users", async (request, response) => {
  const users = await prisma.user.findMany({
    omit: { password: true },
  });

  response.json(users);
});

userRouter.get("/users/:id", async (request, response) => {
  const id = request.params.id;

  const user = await prisma.user.findUnique({
    omit: { password: true },
    where: { id },
  });

  if (!user) {
    return response.status(404).json({ message: "User not exists" });
  }

  response.json(user);
});

userRouter.post("/users", async (request, response) => {
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

  user = await prisma.user.create({ data });

  response.status(201).json(user);
});

userRouter.put("/users/:id", async (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const user = await prisma.user.update({
    data: body,
    where: { id },
  });

  response.json(user);
});

userRouter.delete("/users/:id", async (request, response) => {
  await prisma.user.delete({ where: { id: request.params.id } });

  response.status(204).send();
});

export default userRouter;
