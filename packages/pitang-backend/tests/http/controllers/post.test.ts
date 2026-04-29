import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import request from 'supertest';

import { cleanDb, createTestUser } from '../../helpers';
import { app } from '../setup';

describe('Post Controller (HTTP)', () => {
    beforeAll(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    });

    describe('POST /api/post', () => {
        it('creates a post when authorized', async () => {
            const { token } = await createTestUser();

            const response = await request(app)
                .post('/api/post')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    body: 'Post content',
                    tags: ['javascript', 'testing'],
                    title: 'Test Post',
                });

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('Test Post');
            expect(response.body.slug).toStartWith('test-post-');
        });

        it('returns 401 without auth token', async () => {
            const response = await request(app).post('/api/post').send({
                body: 'content',
                tags: [],
                title: 'No Auth Post',
            });

            expect(response.status).toBe(401);
        });

        it('returns 400 for invalid post data', async () => {
            const { token } = await createTestUser();

            const response = await request(app)
                .post('/api/post')
                .set('Authorization', `Bearer ${token}`)
                .send({ body: 'Missing title' });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/post', () => {
        it('lists posts', async () => {
            const { token } = await createTestUser();

            await request(app)
                .post('/api/post')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    body: 'First post',
                    tags: ['a'],
                    title: 'First Post',
                });

            await request(app)
                .post('/api/post')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    body: 'Second post',
                    tags: ['b'],
                    title: 'Second Post',
                });

            const response = await request(app)
                .get('/api/post')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.items).toBeArrayOfSize(2);
            expect(response.body.totalCount).toBe(2);
            expect(response.body.page).toBe(1);
        });

        it('returns empty list when no posts exist', async () => {
            const { token } = await createTestUser();

            const response = await request(app)
                .get('/api/post')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.items).toEqual([]);
            expect(response.body.totalCount).toBe(0);
        });
    });

    describe('GET /api/post/:slug', () => {
        it('returns a post by slug', async () => {
            const { token } = await createTestUser();

            const created = await request(app)
                .post('/api/post')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    body: 'Some content',
                    tags: ['test'],
                    title: 'Slug Test',
                });

            const response = await request(app).get(
                `/api/post/${created.body.slug}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Slug Test');
        });
    });
});
