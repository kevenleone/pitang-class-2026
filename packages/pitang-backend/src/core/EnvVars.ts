import z from 'zod';

const environmentSchema = z.object({
    DATABASE_URL: z
        .string()
        .startsWith('postgres://', 'Postgres connection URL is not defined'),

    FRONTEND_URL: z.string().default('http://localhost:3000'),

    HTTP_PORT: z.coerce.number().default(3131),

    JWT_SECRET: z.string(),

    NODE_ENV: z.string().default('development'),

    REDIS_URL: z.string(),
    SMTP_AUTH_PASSWORD: z.string().optional(),
    SMTP_AUTH_USER: z.string().optional(),
    SMTP_HOST: z.string().optional(),

    SMTP_PORT: z.coerce.number().default(2525),
});

export const environment = environmentSchema.parse(Bun.env);
