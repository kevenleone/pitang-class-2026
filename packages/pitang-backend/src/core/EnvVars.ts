import z from 'zod';

const environmentSchema = z.object({
    DATABASE_URL: z
        .string()
        .startsWith('postgres://', 'Postgres connection URL is not defined'),

    JWT_SECRET: z.string(),

    HTTP_PORT: z.coerce.number().default(3131),

    NODE_ENV: z.string().default('development'),

    FRONTEND_URL: z.string().default('http://localhost:3000'),

    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(2525),
    SMTP_AUTH_USER: z.string().optional(),
    SMTP_AUTH_PASSWORD: z.string().optional(),

    REDIS_URL: z.string(),
});

export const environment = environmentSchema.parse(Bun.env);
