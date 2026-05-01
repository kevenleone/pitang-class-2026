import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import fetcher from '@/lib/fetcher';
import { postSchema, type PostSchema } from '@/zodSchemas';

export const Route = createFileRoute('/dashboard/posts/new')({
    component: RouteComponent,
});

function TagsInput({
    onChange,
    value,
}: {
    value: string[];
    onChange: (tags: string[]) => void;
}) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = input.trim();
            if (tag && !value.includes(tag)) {
                onChange([...value, tag]);
                setInput('');
            }
        } else if (e.key === 'Backspace' && !input && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((t) => t !== tagToRemove));
    };

    return (
        <div className="border-input bg-background flex min-h-[40px] flex-wrap gap-2 rounded-md border p-2">
            {value.map((tag) => (
                <span
                    className="bg-muted text-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium"
                    key={tag}
                >
                    {tag}
                    <button
                        className="hover:bg-muted-foreground/20 ml-1.5 inline-flex size-4 items-center justify-center rounded-full"
                        onClick={() => removeTag(tag)}
                        type="button"
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                className="min-w-[100px] flex-1 bg-transparent text-sm outline-none"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? 'Add tags...' : ''}
                value={input}
            />
        </div>
    );
}

function RouteComponent() {
    const navigate = useNavigate();

    const { control, handleSubmit, register } = useForm<PostSchema>({
        defaultValues: {
            body: '',
            tags: [],
            title: '',
        },
        resolver: zodResolver(postSchema),
    });

    async function onSubmit(data: PostSchema) {
        try {
            const post = await fetcher.post('/api/post', data);

            toast.success('Post created successfully');

            navigate({ to: `/dashboard/posts/${post.slug}` });
        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    return (
        <div className="mx-auto max-w-3xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>New Post</CardTitle>
                    <CardDescription>
                        Create a new blog post
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Post title"
                                {...register('title')}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="body">Body</Label>
                            <textarea
                                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                id="body"
                                placeholder="Post content"
                                {...register('body')}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tags</Label>
                            <Controller
                                control={control}
                                name="tags"
                                render={({ field }) => (
                                    <TagsInput
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit">Create Post</Button>
                            <Link
                                className="border-input bg-background shadow-xs ring-foreground/10 hover:bg-muted hover:text-foreground inline-flex h-9 items-center justify-center rounded-md border px-2.5 text-sm font-medium ring-1"
                                to="/dashboard/posts"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
