import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './ui/button';

describe('Button', () => {
    it('renders a button with children', () => {
        render(<Button>Click me</Button>);

        expect(
            screen.getByRole('button', { name: 'Click me' }),
        ).toBeInTheDocument();
    });

    it('applies the default variant classes', () => {
        render(<Button>Default</Button>);

        const button = screen.getByRole('button', { name: 'Default' });
        expect(button).toHaveAttribute('data-slot', 'button');
        expect(button.className).toContain('bg-primary');
    });
});
