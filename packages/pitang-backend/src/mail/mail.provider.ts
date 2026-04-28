import nodemailer from 'nodemailer';

import { environment } from '../core/EnvVars';

export const mailProvider = nodemailer.createTransport({
    auth: {
        user: environment.SMTP_AUTH_USER,
        pass: environment.SMTP_AUTH_PASSWORD,
    },
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
});
