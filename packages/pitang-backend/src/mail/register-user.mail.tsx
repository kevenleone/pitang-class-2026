import { render } from 'react-email';
import { loggerWorker } from '../core/Logger';
import { mailProvider } from './mail.provider';
import { RegisterUserTemplate } from './templates/RegisterUserTemplate';
import type { User } from '../generated/prisma/client';

export async function registerUserEmail(user: User) {
    const info = await mailProvider.sendMail({
        from: '"Pitang Team" <welcome@pitang.com>',
        html: await render(<RegisterUserTemplate {...user} />),
        subject: 'Welcome to Pitang Onboarding',
        to: user.email,
    });

    loggerWorker.info('Message sent: ' + info.messageId);
}
