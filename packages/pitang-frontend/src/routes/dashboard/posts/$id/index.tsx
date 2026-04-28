import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/dashboard/posts/$id/')({
    component: RouteComponent,
});

function RouteComponent() {
    const post = useLoaderData({ from: '/dashboard/posts/$id' });

    return (
        <div className="mx-auto max-w-3xl p-6">
            <Link
                className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm"
                to="/dashboard/posts"
            >
                ← Back to posts
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <CardDescription>By User {post.userId}</CardDescription>
                    <CardAction>
                        <Button
                            render={
                                <Link
                                    params={{ id: post.id.toString() }}
                                    to="/dashboard/posts/$id/edit"
                                >
                                    Edit
                                </Link>
                            }
                            size="sm"
                        />
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div>
                        <p className="leading-7">{post.body}</p>
                    </div>

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

                    <div className="text-muted-foreground flex items-center gap-6 text-sm">
                        <span>👍 {post.reactions?.likes} likes</span>
                        <span>👎 {post.reactions?.dislikes} dislikes</span>
                        <span>👁️ {post.views} views</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
