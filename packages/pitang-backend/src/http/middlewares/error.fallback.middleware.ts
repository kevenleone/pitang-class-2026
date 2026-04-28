import type { Request, Response } from 'express';
import { environment } from '../../core/EnvVars';
import { logger } from '../../core/Logger';

export function errorFallbackMiddleware(
    error: Error,
    request: Request,
    response: Response,
) {
    logger.error(error);

    if (environment.NODE_ENV === 'development') {
        return response
            .status(400)
            .json({ message: 'Something went wrong', stack: error });
    }

    response.status(400).json({ message: 'Something went wrong' });
}
