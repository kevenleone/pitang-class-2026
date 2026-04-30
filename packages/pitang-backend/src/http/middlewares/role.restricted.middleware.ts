import { getLoggedUser } from '../../util/get-logged-user';

import type { Role } from '../../generated/prisma/enums';
import type { NextFunction, Request, Response } from 'express';

export function roleRestrictedMiddleware(roles: Role[]) {
    return function (request: Request, response: Response, next: NextFunction) {
        const { role } = getLoggedUser(request);

        if (roles.includes(role)) {
            return next();
        }

        response.status(400).json({ message: 'Not allowed' });
    };
}
