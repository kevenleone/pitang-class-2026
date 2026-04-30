import bcrypt from 'bcryptjs';

import { prisma } from '../src/core/PrismaClient';
import { Role } from '../src/generated/prisma/enums';

function hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
}

const users = [
    {
        bornDate: new Date('2000-03-15'),
        email: 'joao.silva@email.com',
        firstName: 'João',
        lastName: 'Silva',
        password: hashPassword('123456'),
        role: Role.ADMIN,
    },
    {
        bornDate: new Date('1999-07-22'),
        email: 'maria.santos@email.com',
        firstName: 'Maria',
        lastName: 'Santos',
        password: hashPassword('123456'),
        role: Role.COLLABORATOR,
    },
    {
        bornDate: new Date('2001-01-10'),
        email: 'pedro.oliveira@email.com',
        firstName: 'Pedro',
        lastName: 'Oliveira',
        password: hashPassword('123456'),
    },
];

async function main() {
    console.log('Iniciando seed de usuários...');

    for (const user of users) {
        const existing = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (existing) {
            console.log(`Usuário ${user.email} já existe, pulando...`);
            continue;
        }

        await prisma.user.create({ data: user });
        console.log(`Usuário ${user.email} criado`);
    }

    console.log('Seed concluído');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
