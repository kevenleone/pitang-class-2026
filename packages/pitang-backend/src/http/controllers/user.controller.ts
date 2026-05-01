import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import z from 'zod';

import { environment } from '../../core/EnvVars';
import { logger } from '../../core/Logger';
import { prisma } from '../../core/PrismaClient';
import { Role } from '../../generated/prisma/enums';
import {
    REGISTER_EMAIL_JOB,
    registerMailQueue,
} from '../../queues/register.mail.queue';
import { userSchema } from '../../schemas';
import { getLoggedUser } from '../../util/get-logged-user';

import type { User } from '../../generated/prisma/client';
import type { Request, Response } from 'express';

export async function getUsers(_request: Request, response: Response) {
    const users = await prisma.user.findMany({
        omit: { password: true },
    });

    response.json(users);
}

export async function postUser(request: Request, response: Response) {
    const { data, error } = userSchema.safeParse(request.body);

    if (error) {
        return response.status(400).json(z.treeifyError(error).properties);
    }

    let user = await prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
        logger.error({ emailAddress: data.email }, 'User already registered');

        return response
            .status(409)
            .json({ message: 'User already registered' });
    }

    const salt = bcrypt.genSaltSync(10);

    data.password = await bcrypt.hashSync(data.password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    user = await prisma.user.create({
        data: { ...data, bornDate: new Date(data.bornDate), verificationToken },
    });

    await registerMailQueue.add(REGISTER_EMAIL_JOB, user, {
        attempts: 3,
        backoff: 10000,
    });

    logger.info(user, 'User registered');

    delete (user as Partial<User>).password;

    response.status(201).json(user);
}

export async function getUser(request: Request, response: Response) {
    const id = request.params.id as string;

    const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { id },
    });

    if (!user) {
        return response.status(404).json({ message: 'User not exists' });
    }

    response.json(user);
}

export async function patchUser(request: Request, response: Response) {
    const loggedUser = getLoggedUser(request);

    const {
        body,
        params: { id },
    } = request;

    if (loggedUser.role === Role.USER) {
        if (loggedUser.id !== id) {
            return response
                .status(400)
                .json({ message: 'You only edit yourself.' });
        }

        delete body.role;
    }

    const user = await prisma.user.update({
        data: body,
        omit: { password: true, verificationToken: true },
        where: { id: id as string },
    });

    response.json(user);
}

export async function deleteUser(request: Request, response: Response) {
    await prisma.user.delete({ where: { id: request.params.id as string } });

    response.status(204).send();
}

export async function me(request: Request, response: Response) {
    const user = getLoggedUser(request);

    delete (user as Partial<User>).password;
    delete (user as Partial<User>).verificationToken;

    response.json(user);
}

export async function login(request: Request, response: Response) {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: 'Invalid credentials' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return response.status(400).json({ message: 'User not found' });
    }

    if (bcrypt.compareSync(password, user.password)) {
        delete (user as Partial<User>).password;

        return response.status(200).json({
            token: jsonwebtoken.sign(user, environment.JWT_SECRET, {
                expiresIn: '30minutes',
            }),
        });
    }

    response.status(400).json({ message: 'Invalid password' });
}
