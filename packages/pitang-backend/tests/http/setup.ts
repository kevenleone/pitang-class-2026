import { mock } from 'bun:test';

mock.module('../../x/queues/register.mail.queue', () => ({
    connection: { url: '' },
    REGISTER_EMAIL_JOB: 'register-email',
    registerMailQueue: {
        add: () => {
            console.log('Here.');
        },
        close: async () => {},
        name: 'register-mail-queue',
    },
}));

const { app } = await import('../../src/app');

export { app };
