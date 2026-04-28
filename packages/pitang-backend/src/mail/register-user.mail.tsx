import { render } from 'react-email';
import type { User } from '../generated/prisma/client';

import { mailProvider } from './mail.provider';
import { RegisterUserTemplate } from './templates/RegisterUserTemplate';
import { loggerWorker } from '../core/Logger';

export async function registerUserEmail(user: User) {
    const info = await mailProvider.sendMail({
        from: '"Pitang Team" <welcome@pitang.com>',
        to: user.email,
        subject: 'Welcome to Pitang Onboarding',
        html: await render(<RegisterUserTemplate {...user} />),
    });

    loggerWorker.info('Message sent: ' + info.messageId);
}
