import { describe, expect, it } from 'vitest';

import { fetchProducts } from './api';

describe('API', () => {
    it('fetchProducts', async () => {
        const response = await fetchProducts();

        expect(response.limit).toBe(10);
    });
});
