import { Queue } from 'bullmq';

import { environment } from '../core/EnvVars';

export const connection = {
    url: environment.REDIS_URL,
};

export const registerMailQueue = new Queue('register-mail-queue', {
    connection,
});

export const REGISTER_EMAIL_JOB = 'register-email';
