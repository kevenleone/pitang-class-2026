import z from 'zod';

const passwordSchema = z
    .string()
    .min(8, { message: 'Password should have minimum length of 8' })
    .max(15, 'Password is too long')
    .regex(/^(?=.*[A-Z]).{8,}$/, {
        message:
            'Should Contain at least one uppercase letter and have a minimum length of 8 characters.',
    });

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerSchema = z
    .object({
        bornDate: z.string().min(1, 'Born date is required'),
        confirmPassword: passwordSchema,
        email: z.string().email(),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        password: passwordSchema,
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords do not match',
                path: ['confirmPassword'],
            });
        }
    });

export const postSchema = z.object({
    body: z.string().min(3).max(1000),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    title: z.string().min(3),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type PostSchema = z.infer<typeof postSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
