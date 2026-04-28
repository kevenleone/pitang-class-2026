import nodemailer from 'nodemailer';

import { environment } from '../core/EnvVars';

export const mailProvider = nodemailer.createTransport({
    auth: {
        pass: environment.SMTP_AUTH_PASSWORD,
        user: environment.SMTP_AUTH_USER,
    },
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
});
