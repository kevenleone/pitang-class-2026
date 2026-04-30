import type { User } from '../generated/prisma/client';
import type { Request } from 'express';

export function getLoggedUser(request: Request) {
    return (request as any).loggedUser as User;
}
