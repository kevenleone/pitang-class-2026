import { describe, expect, it, mock } from 'bun:test';

import type { Request, Response } from 'express';

mock.module('../../core/Logger', () => ({
    logger: { error: mock(() => {}) },
}));

const { errorFallbackMiddleware } =
    await import('../../../src/http/middlewares/error.fallback.middleware');

describe('errorFallbackMiddleware', () => {
    it('returns generic error message in non-development mode', () => {
        const request = {} as Request;
        const response = {
            json: mock(() => response),
            status: mock((code: number) => response),
        } as unknown as Response;
        const error = new Error('Test error');

        errorFallbackMiddleware(error, request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Something went wrong',
        });
    });
});
