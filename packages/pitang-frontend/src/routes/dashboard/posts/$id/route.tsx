import { createFileRoute, Outlet } from '@tanstack/react-router';
import fetcher from '@/lib/fetcher';
import type { Post } from '@/types';

export const Route = createFileRoute('/dashboard/posts/$id')({
    component: RouteComponent,
    loader: async ({ params: { id } }) => {
        const post = await fetcher<Post>(`/posts/${id}`);

        return post;
    },
    staleTime: 60 * 1000,
});

function RouteComponent() {
    return <Outlet />;
}
