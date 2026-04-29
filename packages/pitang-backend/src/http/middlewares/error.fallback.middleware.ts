import { environment } from '../../core/EnvVars';
import { logger } from '../../core/Logger';

import type { NextFunction, Request, Response } from 'express';

export function errorFallbackMiddleware(
    error: Error,
    request: Request,
    response: Response,
    _next: NextFunction,
) {
    logger.error(error);

    if (environment.NODE_ENV === 'development') {
        return response
            .status(400)
            .json({ message: 'Something went wrong', stack: error });
    }

    response.status(400).json({ message: 'Something went wrong' });
}
