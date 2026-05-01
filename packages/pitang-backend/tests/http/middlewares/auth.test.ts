import { describe, expect, it, mock } from 'bun:test';
import jsonwebtoken from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

const JWT_SECRET = 'test-secret';

mock.module('../../core/EnvVars', () => ({
    environment: { JWT_SECRET },
}));

const { authMiddleware } =
    await import('../../../src/http/middlewares/auth.middleware');

const validToken = jsonwebtoken.sign(
    { email: 'test@example.com', id: 'user-1' },
    JWT_SECRET,
    { expiresIn: '30minutes' },
);

function createMocks(overrides: Partial<Request> = {}) {
    const request = {
        headers: {},
        method: 'GET',
        path: '/api/protected',
        ...overrides,
    } as Request;

    const response = {
        json: mock(() => response),
        status: mock((code: number) => {
            (response as Record<string, unknown>)._statusCode = code;

            return response;
        }),
    } as unknown as Response;

    const next = mock(() => {}) as NextFunction;

    return { next, request, response };
}

describe('authMiddleware', () => {
    it('allows public GET paths without auth', () => {
        const { next, request, response } = createMocks({
            method: 'GET',
            path: '/',
        });

        authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    it('allows POST /api/login without auth', () => {
        const { next, request, response } = createMocks({
            method: 'POST',
            path: '/api/login',
        });

        authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    it('allows POST /api/users without auth', () => {
        const { next, request, response } = createMocks({
            method: 'POST',
            path: '/api/users',
        });

        authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    it('allows GET /api/post/* without auth', () => {
        const { next, request, response } = createMocks({
            method: 'GET',
            path: '/api/post/my-post-slug',
        });

        authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    it('returns 401 when Authorization header is missing on protected route', () => {
        const { next, request, response } = createMocks({
            method: 'DELETE',
            path: '/api/users/123',
        });

        authMiddleware(request, response, next);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Authorization is missing',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 for invalid token', () => {
        const { next, request, response } = createMocks({
            headers: { authorization: 'Bearer invalid-token' },
            method: 'DELETE',
            path: '/api/users/123',
        });

        authMiddleware(request, response, next);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Not authorized',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next and sets loggedUser for valid token', () => {
        const { next, request, response } = createMocks({
            headers: { authorization: `Bearer ${validToken}` },
            method: 'DELETE',
            path: '/api/users/123',
        });

        authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
        expect(request.loggedUser).toMatchObject({
            email: 'test@example.com',
            id: 'user-1',
        });
    });
});
