import { mock } from 'bun:test';

mock.module('../../queues/register.mail.queue', () => ({
    connection: { url: '' },
    REGISTER_EMAIL_JOB: 'register-email',
    registerMailQueue: {
        add: async () => ({ id: 'mock-job' }),
        close: async () => {},
        name: 'register-mail-queue',
    },
}));

const { app } = await import('../../src/app');

export { app };
