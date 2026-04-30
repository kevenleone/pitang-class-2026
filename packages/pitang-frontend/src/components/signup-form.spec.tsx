import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, vitest } from 'vitest';

import { SignupForm } from './signup-form';

vi.mock('@tanstack/react-router', () => ({
    Link: ({
        children,
        ...props
    }: {
        children: React.ReactNode;
        to: string;
    }) => (
        <a href={props.to} {...props}>
            {children}
        </a>
    ),
}));

describe('SignupForm', () => {
    it('renders', () => {
        const { baseElement } = render(<SignupForm />);

        expect(baseElement).toMatchSnapshot();
    });

    it('renders the form with heading', () => {
        const { queryByText } = render(<SignupForm />);

        expect(queryByText('Create your account')).toBeTruthy();
    });

    it('renders all input fields', () => {
        render(<SignupForm />);

        expect(screen.getByLabelText('User Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('renders with form validations', async () => {
        const onSubmitMock = vitest.fn();

        const { getByLabelText, queryByText } = render(
            <SignupForm handleRegister={onSubmitMock} />,
        );

        const createAccountButton = queryByText(
            'Create Account',
        ) as HTMLButtonElement;

        const userNameInput = getByLabelText('User Name') as HTMLInputElement;
        const emailInput = getByLabelText('Email') as HTMLInputElement;
        const passwordInput = getByLabelText('Password') as HTMLInputElement;
        const confirmPasswordInput = getByLabelText(
            'Confirm Password',
        ) as HTMLInputElement;

        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(userNameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
        expect(confirmPasswordInput.value).toBe('');
        expect(createAccountButton).toBeDisabled();

        fireEvent.change(userNameInput, { target: { value: 'kevenleone' } });
        fireEvent.change(emailInput, {
            target: { value: 'kevenleone@pit.com' },
        });
        fireEvent.change(passwordInput, { target: { value: '12345678K' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: '12345678K' },
        });

        expect(userNameInput.value).toBe('kevenleone');
        expect(emailInput.value).toBe('kevenleone@pit.com');
        expect(passwordInput.value).toBe('12345678K');
        expect(confirmPasswordInput.value).toBe('12345678K');

        await act(() => {
            fireEvent.blur(confirmPasswordInput);
        });

        expect(createAccountButton).toBeEnabled();

        await act(() => {
            fireEvent.click(createAccountButton);
        });

        expect(onSubmitMock).toHaveBeenCalledTimes(1);

        expect(onSubmitMock.mock.calls[0][0]).toMatchObject({
            confirmPassword: '12345678K',
            email: 'kevenleone@pit.com',
            password: '12345678K',
            username: 'kevenleone',
        });
    });
});
