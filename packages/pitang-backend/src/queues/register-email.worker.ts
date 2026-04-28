import { Worker } from 'bullmq';
import type { User } from '../generated/prisma/client';
import { registerUserEmail } from '../mail/register-user.mail';
import {
    connection,
    registerMailQueue,
    REGISTER_EMAIL_JOB,
} from './register.mail.queue';
import { loggerWorker } from '../core/Logger';

export const registerEmailWorker = new Worker(
    registerMailQueue.name,
    async (job) => {
        if (job.name === REGISTER_EMAIL_JOB) {
            const user = job.data as User;
            await registerUserEmail(user);
        }
    },
    { connection },
);

registerEmailWorker.on('completed', (job) => {
    loggerWorker.info(`Job ${job.id} completed`);
});

registerEmailWorker.on('failed', (job, err) => {
    loggerWorker.error(`Job ${job?.id} failed:` + err);
});
