import jsonwebtoken from 'jsonwebtoken';

import { environment } from '../../core/EnvVars';

import type { NextFunction, Request, Response } from 'express';

const allowedPaths = {
    GET: ['/', '/api/post/*', '/admin/queues/*', '/admin/queues'],
    POST: ['/api/login', '/api/users'],
    PUT: ['/admin/queues/*', '/admin/queues'],
} as const;

function matchPath(path: string, pattern: string): boolean {
    if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -1);
        return path.startsWith(prefix);
    }

    return path === pattern;
}

export function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const paths =
        allowedPaths[request.method as keyof typeof allowedPaths] ?? [];

    if (paths.some((path) => matchPath(request.path, path))) {
        return next();
    }

    const {
        headers: { authorization },
    } = request;

    if (!authorization) {
        return response
            .status(401)
            .json({ message: 'Authorization is missing' });
    }

    const [, token = ''] = authorization.split(' ');

    try {
        request.loggedUser = jsonwebtoken.verify(token, environment.JWT_SECRET);

        next();
    } catch (error) {
        response.status(401).json({ message: 'Not authorized' });
    }
}
