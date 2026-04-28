import {
    Button,
    Container,
    Heading,
    Html,
    Link,
    Section,
    Text,
} from 'react-email';

import { environment } from '../../core/EnvVars';

import type { User } from '../../generated/prisma/client';

const brand = {
    background: '#f8f9fa',
    border: '#e9ecef',
    primary: '#333333',
    textLight: '#666666',
};

type RegisterUserTemplateProps = User;

export function RegisterUserTemplate(props: RegisterUserTemplateProps) {
    const activationLink = `${environment.FRONTEND_URL}/activate?token=${props.verificationToken}`;

    return (
        <Html lang="en">
            <Section
                style={{ background: brand.background, padding: '40px 0' }}
            >
                <Container
                    style={{
                        background: '#ffffff',
                        border: `1px solid ${brand.border}`,
                        borderRadius: '12px',
                        maxWidth: '500px',
                        padding: '40px',
                    }}
                >
                    <Heading
                        style={{
                            color: brand.primary,
                            fontSize: '28px',
                            fontWeight: '800',
                            letterSpacing: '-0.5px',
                            marginBottom: '24px',
                        }}
                    >
                        Pitang
                    </Heading>
                    <Text style={{ fontSize: '18px', lineHeight: '28px' }}>
                        Welcome, {props.firstName}!
                    </Text>
                    <Text
                        style={{ color: brand.textLight, lineHeight: '24px' }}
                    >
                        We're excited to have you join our community. To get
                        started, please verify your email address by clicking
                        the button below.
                    </Text>
                    <Button
                        href={activationLink}
                        style={{
                            background: brand.primary,
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: '600',
                            marginTop: '8px',
                            padding: '14px 28px',
                        }}
                    >
                        Activate my account
                    </Button>
                    <Text style={{ color: brand.textLight, marginTop: '24px' }}>
                        Or copy and paste this link in your browser:
                        <br />
                        <Link href={activationLink}>{activationLink}</Link>
                    </Text>
                    <Text
                        style={{
                            color: brand.textLight,
                            fontSize: '14px',
                            marginTop: '32px',
                        }}
                    >
                        This link will expire in 24 hours. If you didn't create
                        an account, you can safely ignore this email.
                    </Text>
                    <Text
                        style={{
                            color: brand.textLight,
                            fontSize: '14px',
                            marginTop: '24px',
                        }}
                    >
                        Best,
                        <br />
                        The Pitang Team
                    </Text>
                </Container>
            </Section>
        </Html>
    );
}
