import type { User } from '../generated/prisma/client';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
    loggedUser: User;
}

export function getLoggedUser(request: Request): User {
    return (request as AuthenticatedRequest).loggedUser;
}
