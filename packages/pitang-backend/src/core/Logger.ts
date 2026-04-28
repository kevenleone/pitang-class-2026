import pino from 'pino';

function createTransport(loggerName: string) {
    return pino.transport({
        targets: [
            {
                level: 'info',
                options: { destination: `logs/${loggerName}.log` },
                target: 'pino/file',
            },
            { level: 'info', options: {}, target: 'pino-pretty' },
        ],
    });
}

export const logger = pino(
    {
        msgPrefix: '[SERVER] ',
        redact: { paths: ['password', 'verificationToken'] },
    },
    createTransport('app'),
);

export const loggerWorker = pino(
    { msgPrefix: '[WORKER] ' },
    createTransport('worker'),
);
