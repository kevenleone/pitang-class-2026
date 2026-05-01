import z from 'zod';

import { prisma } from '../../core/PrismaClient';
import { paginationQuery, postSchema } from '../../schemas';
import { getLoggedUser } from '../../util/get-logged-user';

import type { Request, Response } from 'express';

export async function getPost(request: Request, response: Response) {
    const { slug } = request.params;

    const [post] = await prisma.post.updateManyAndReturn({
        data: { views: { increment: 1 } },
        include: { user: { omit: { bornDate: true, password: true } } },
        where: { slug: slug as string },
    });

    response.json(post);
}

export async function getPosts(request: Request, response: Response) {
    const { data: pagination, error } = paginationQuery.safeParse(
        request.query,
    );

    if (error) {
        return response.status(400).json(z.treeifyError(error).properties);
    }

    const [totalCount, posts] = await Promise.all([
        prisma.post.count(),
        prisma.post.findMany({
            orderBy: { id: pagination.sort },
            skip: (pagination.page - 1) * pagination.pageSize,
            take: pagination.pageSize,
        }),
    ]);

    response.json({
        items: posts,
        lastPage:
            Math.ceil(totalCount / pagination.pageSize) === pagination.page,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
    });
}

export async function postPost(request: Request, response: Response) {
    const { data, error } = postSchema.safeParse(request.body);

    if (error) {
        return response.status(400).json(error);
    }

    const loggedUser = getLoggedUser(request);

    const post = await prisma.post.create({
        data: {
            ...data,
            userId: loggedUser.id,
        },
    });

    response.status(201).json(post);
}

export async function patchPost(request: Request, response: Response) {
    const { slug } = request.params;

    const { data, error } = postSchema.partial().safeParse(request.body);

    if (error) {
        return response.status(400).json(error);
    }

    const post = await prisma.post.update({
        data,
        where: { slug: slug as string },
    });

    response.json(post);
}

export async function deletePost(request: Request, response: Response) {
    const { slug } = request.params;

    await prisma.post.delete({ where: { slug: slug as string } });

    response.status(204).send();
}
