import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { environment } from '../src/core/EnvVars';
import { prisma } from '../src/core/PrismaClient';

export async function cleanDb() {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
}

export async function createTestUser(
    overrides: Partial<{
        email: string;
        firstName: string;
        lastName: string;
        password: string;
    }> = {},
) {
    const password = overrides.password ?? 'password123';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
        data: {
            bornDate: new Date('1990-01-01'),
            email: overrides.email ?? 'test@example.com',
            firstName: overrides.firstName ?? 'Test',
            lastName: overrides.lastName ?? 'User',
            password: hashedPassword,
        },
    });

    const token = jsonwebtoken.sign(
        { email: user.email, id: user.id },
        environment.JWT_SECRET,
        { expiresIn: '30minutes' },
    );

    return { token, user };
}
