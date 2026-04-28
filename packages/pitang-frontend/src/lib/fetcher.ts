import FetcherError from './FetcherError';

const HOST = 'https://dummyjson.com';

function changeResource(resource: RequestInfo) {
    if (resource.toString().startsWith('http')) {
        return resource;
    }

    return `${HOST}/${resource}`;
}

const fetcher = async <T = any>(
    resource: RequestInfo,
    options?: RequestInit,
): Promise<T> => {
    // await sleep();
    const response = await fetch(changeResource(resource), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = new FetcherError(
            'An error occurred while fetching the data.',
        );

        error.info = await response.json();
        error.status = response.status;
        throw error;
    }

    if (
        options?.method === 'DELETE' ||
        response.status === 204 ||
        response.headers.get('Content-Length') === '0'
    ) {
        return {} as T;
    }

    return response.json();
};

fetcher.delete = (resource: RequestInfo) =>
    fetcher(resource, {
        method: 'DELETE',
    });

fetcher.patch = <T = any>(
    resource: RequestInfo,
    data: unknown,
    options?: RequestInit,
) =>
    fetcher<T>(resource, {
        ...options,
        body: JSON.stringify(data),
        method: 'PATCH',
    });

fetcher.post = <T = any>(
    resource: RequestInfo,
    data?: unknown,
    options?: RequestInit & { shouldStringify?: boolean },
) =>
    fetcher<T>(resource, {
        ...options,
        body:
            (options?.shouldStringify ?? true)
                ? data
                    ? JSON.stringify(data)
                    : null
                : (data as BodyInit),
        method: 'POST',
    }) as Promise<T>;

fetcher.put = (resource: RequestInfo, data: unknown, options?: RequestInit) =>
    fetcher(resource, {
        ...options,
        body: JSON.stringify(data),
        method: 'PUT',
    });

export default fetcher;
