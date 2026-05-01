import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import fetcher from '@/lib/fetcher';
import FetcherError from '@/lib/FetcherError';

import type { LoginSchema, RegisterSchema } from '@/zodSchemas';

function getCookie(cookieName: string) {
    return document.cookie
        .split('; ')
        .find((c) => c.startsWith(`${cookieName}=`))
        ?.split('=')[1];
}

export function useAuth() {
    const navigate = useNavigate();

    async function getAuthenticatedUser() {
        return fetcher('/api/me', {
            headers: {
                Authorization: `Bearer ${getCookie('@pitang/accessToken')}`,
            },
        });
    }

    async function handleLogout() {
        document.cookie = '@pitang/accessToken=; path=/; Max-Age=0';

        navigate({ to: '/login' });
    }

    async function handleLogin(data: LoginSchema) {
        try {
            const response = await fetcher.post('/api/login', {
                email: data.email,
                password: data.password,
            });

            toast.success('Welcome...');

            document.cookie = `@pitang/accessToken=${response.token}; path=/; Max-Age=86400`;

            navigate({ to: '/dashboard' });
        } catch (error) {
            if (error instanceof FetcherError) {
                toast.error(error.info.message);
            }
        }
    }

    async function handleRegister(data: RegisterSchema) {
        try {
            await fetcher.post('/api/users', {
                bornDate: data.bornDate,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
            });

            toast.success('Account created! You can now login.');

            navigate({ to: '/login' });
        } catch (error) {
            if (error instanceof FetcherError) {
                toast.error(error.info.message);
            }
        }
    }

    return {
        getAuthenticatedUser,
        handleLogin,
        handleLogout,
        handleRegister,
    };
}
