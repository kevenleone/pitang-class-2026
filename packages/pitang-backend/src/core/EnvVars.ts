import z from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z
    .string()
    .startsWith("postgres://", "Postgres connection URL is not defined"),

  JWT_SECRET: z.string(),

  NODE_ENV: z.string().default("development"),

  HTTP_PORT: z.coerce.number().default(3131),
});

export const environment = environmentSchema.parse(Bun.env);
