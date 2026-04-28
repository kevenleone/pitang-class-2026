import fetcher from './fetcher';
import type { Product, ProductsResponse } from '@/types';

export async function fetchProducts(
    page: number = 1,
    limit: number = 10,
): Promise<ProductsResponse> {
    const skip = (page - 1) * limit;

    return fetcher(`products?limit=${limit}&skip=${skip}`);
}

export async function fetchProductById(id: number): Promise<Product> {
    return fetcher(`products/${id}`);
}
