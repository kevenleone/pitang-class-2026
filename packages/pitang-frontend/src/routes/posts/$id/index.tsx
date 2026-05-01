import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import fetcher from '@/lib/fetcher';

import type { Post } from '@/types';

export const Route = createFileRoute('/posts/$id/')({
    component: RouteComponent,
    loader: async ({ params: { id } }) => {
        const post = await fetcher<Post>(`/api/post/${id}`);

        return post;
    },
});

function RouteComponent() {
    const post = useLoaderData({ from: '/posts/$id' });

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <Link
                className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
                to="/"
            >
                ← Back to posts
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <CardDescription>
                        {post.user
                            ? `By ${post.user.firstName} ${post.user.lastName}`
                            : `By User ${post.userId}`}{' '}
                        · {post.views} views
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <p className="leading-7">{post.body}</p>

                    <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag: string) => (
                            <span
                                className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                key={tag}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
