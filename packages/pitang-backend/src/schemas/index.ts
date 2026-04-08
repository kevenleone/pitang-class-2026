import z from "zod";

export const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  email: z.string(),
  bornDate: z.string(),
});
