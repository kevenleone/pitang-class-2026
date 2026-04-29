import { describe, expect, it } from 'bun:test';

import { paginationQuery, postSchema, userSchema } from '../../src/schemas';

describe('userSchema', () => {
    it('accepts valid user data', () => {
        const result = userSchema.safeParse({
            bornDate: '1990-01-01',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'secret123',
        });

        expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
        const result = userSchema.safeParse({ email: 'john@example.com' });

        expect(result.success).toBe(false);
    });
});

describe('postSchema', () => {
    it('accepts valid post data and generates slug', () => {
        const result = postSchema.safeParse({
            body: 'Post content here',
            tags: ['javascript', 'typescript'],
            title: 'My First Post',
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.slug).toStartWith('my-first-post-');
        }
    });

    it('rejects title longer than 255 characters', () => {
        const result = postSchema.safeParse({
            body: 'content',
            tags: [],
            title: 'a'.repeat(256),
        });

        expect(result.success).toBe(false);
    });

    it('rejects body longer than 5000 characters', () => {
        const result = postSchema.safeParse({
            body: 'a'.repeat(5001),
            tags: [],
            title: 'Valid Title',
        });

        expect(result.success).toBe(false);
    });

    it('rejects more than 5 tags', () => {
        const result = postSchema.safeParse({
            body: 'content',
            tags: ['a', 'b', 'c', 'd', 'e', 'f'],
            title: 'Valid Title',
        });

        expect(result.success).toBe(false);
    });

    it('creates URL-safe slug from title', () => {
        const result = postSchema.safeParse({
            body: 'content',
            tags: [],
            title: 'Hello World & Special! Chars',
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.slug).toStartWith('hello-world-special-chars-');
        }
    });

    it('normalizes accented characters in slug', () => {
        const result = postSchema.safeParse({
            body: 'content',
            tags: [],
            title: 'Olá Mundo',
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.slug).toStartWith('ola-mundo-');
        }
    });
});

describe('paginationQuery', () => {
    it('applies default values when no query provided', () => {
        const result = paginationQuery.safeParse({});

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ page: 1, pageSize: 20, sort: 'asc' });
    });

    it('coerces string numbers', () => {
        const result = paginationQuery.safeParse({ page: '3', pageSize: '10' });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.page).toBe(3);
            expect(result.data.pageSize).toBe(10);
        }
    });

    it('rejects pageSize greater than 100', () => {
        const result = paginationQuery.safeParse({ pageSize: '101' });

        expect(result.success).toBe(false);
    });

    it('rejects invalid sort value', () => {
        const result = paginationQuery.safeParse({ sort: 'invalid' });

        expect(result.success).toBe(false);
    });
});
