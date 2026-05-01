import { createFileRoute, Link } from '@tanstack/react-router';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import type { Post } from '@/types';

interface PostsResponse {
    items: Post[];
    lastPage: boolean;
    page: number;
    pageSize: number;
    totalCount: number;
}

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data } = useSWR<PostsResponse>('/api/post');

    const posts = data?.items ?? [];

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                    <Link className="flex items-center gap-2 font-bold text-lg" to="/">
                        Pitang Class
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden border-b">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="mx-auto max-w-5xl px-4 py-24 md:py-32">
                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <h1 className="font-extrabold text-4xl tracking-tight md:text-6xl">
                            Welcome to{' '}
                            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Pitang Class
                            </span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
                            A plataforma de aprendizado colaborativo. Explore artigos,
                            tutoriais e compartilhe conhecimento com a comunidade.
                        </p>
                        <div className="flex gap-3">
                            <Link to="/register">
                                <Button size="lg">Get Started</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Posts Section */}
            <section className="mx-auto max-w-5xl px-4 py-16">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="font-bold text-3xl tracking-tight">
                            Latest Posts
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {data?.totalCount ?? 0} articles published
                        </p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-muted-foreground py-20 text-center">
                        <p className="text-lg">No posts yet.</p>
                        <p className="text-sm">Check back soon for new content.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                className="group"
                                params={{ id: post.slug }}
                                to="/posts/$id"
                            >
                                <Card className="hover:border-primary/50 h-full transition-colors">
                                    <CardHeader>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {post.tags?.slice(0, 3).map((tag) => (
                                                <span
                                                    className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs"
                                                    key={tag}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <CardTitle className="group-hover:text-primary transition-colors">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {post.body.length > 120
                                                ? post.body.substring(0, 120) + '...'
                                                : post.body}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground flex items-center gap-4 text-xs">
                                            <span>{post.views} views</span>
                                            {post.user && (
                                                <span>
                                                    {post.user.firstName}{' '}
                                                    {post.user.lastName}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t">
                <div className="text-muted-foreground mx-auto max-w-5xl px-4 py-8 text-center text-sm">
                    &copy; {new Date().getFullYear()} Pitang Class. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
