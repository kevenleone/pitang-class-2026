import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import request from 'supertest';

import { cleanDb, createTestUser } from '../../helpers';
import { app } from '../setup';

describe('User Controller (HTTP)', () => {
    beforeAll(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    });

    describe('POST /api/users', () => {
        it('creates a new user', async () => {
            const response = await request(app).post('/api/users').send({
                bornDate: '1990-01-01',
                email: 'john@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'secret123',
            });

            expect(response.status).toBe(201);
            expect(response.body.email).toBe('john@example.com');
            expect(response.body).not.toHaveProperty('password');
        });

        it('returns 409 for duplicate email', async () => {
            await request(app).post('/api/users').send({
                bornDate: '1990-01-01',
                email: 'duplicate@example.com',
                firstName: 'First',
                lastName: 'Last',
                password: 'secret123',
            });

            const response = await request(app).post('/api/users').send({
                bornDate: '1990-01-01',
                email: 'duplicate@example.com',
                firstName: 'Another',
                lastName: 'User',
                password: 'secret123',
            });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('User already registered');
        });

        it('returns 400 for invalid data', async () => {
            const response = await request(app).post('/api/users').send({
                email: 'not-valid',
            });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/users', () => {
        it('lists all users without passwords', async () => {
            const { token } = await createTestUser({ email: 'user1@example.com' });
            await createTestUser({ email: 'user2@example.com' });

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeArrayOfSize(2);

            for (const user of response.body) {
                expect(user).not.toHaveProperty('password');
            }
        });

        it('returns empty array when no users exist', async () => {
            const { token } = await createTestUser();

            await cleanDb();

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('GET /api/users/:id', () => {
        it('returns a user by id', async () => {
            const { token, user } = await createTestUser();

            const response = await request(app)
                .get(`/api/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(user.id);
            expect(response.body).not.toHaveProperty('password');
        });

        it('returns 404 for non-existent user', async () => {
            const { token } = await createTestUser();

            const response = await request(app)
                .get('/api/users/non-existent-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not exists');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('deletes a user when authorized', async () => {
            const { token, user } = await createTestUser();

            const response = await request(app)
                .delete(`/api/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        });

        it('returns 401 without auth token', async () => {
            const response = await request(app).delete('/api/users/some-id');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/login', () => {
        it('returns a token for valid credentials', async () => {
            const { user } = await createTestUser();

            const response = await request(app).post('/api/login').send({
                email: user.email,
                password: 'password123',
            });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeString();
        });

        it('returns 400 for invalid password', async () => {
            const { user } = await createTestUser();

            const response = await request(app).post('/api/login').send({
                email: user.email,
                password: 'wrongpassword',
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid password');
        });

        it('returns 400 for non-existent user', async () => {
            const response = await request(app).post('/api/login').send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

            expect(response.status).toBe(400);
        });

        it('returns 400 when credentials are missing', async () => {
            const response = await request(app).post('/api/login').send({});

            expect(response.status).toBe(400);
        });
    });
});
