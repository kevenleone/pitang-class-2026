import z from 'zod';
import crypto from 'crypto';

export const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    email: z.string(),
    bornDate: z.string(),
});

export const postSchema = z
    .object({
        body: z.string().max(5000),
        title: z.string().max(255),
        slug: z.string().optional(),
        tags: z.array(z.string()).max(5),
    })
    .transform((post) => {
        return {
            ...post,
            slug:
                post.title
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-') +
                `-${crypto.randomUUID().split('-')[0]}`,
        };
    });

export const paginationQuery = z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().max(100).default(20),
    sort: z.enum(['asc', 'desc']).default('asc'),
});
