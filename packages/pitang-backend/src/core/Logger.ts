import pino from 'pino'

function createTransport(loggerName: string) {
    return pino.transport({
        targets: [
            {
                level: "info",
                target: "pino/file",
                options: { destination: `logs/${loggerName}.log` },
            },
            { level: "info", target: "pino-pretty", options: {} },
        ],
    })
}

export const logger = pino({
    msgPrefix: "[SERVER] ",
    redact: { paths: ["password", "verificationToken"] },
}, createTransport("app"))

export const loggerWorker = pino({ msgPrefix: "[WORKER] " }, createTransport("worker"))