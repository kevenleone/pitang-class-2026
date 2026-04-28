import {
    createFileRoute,
    useLoaderData,
    useNavigate,
} from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import fetcher from '@/lib/fetcher';
import { toast } from 'sonner';
import { postSchema, type PostSchema } from '@/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';

export const Route = createFileRoute('/dashboard/posts/$id/edit')({
    component: EditPost,
});

function TagsInput({
    value,
    onChange,
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
                    key={tag}
                    className="bg-muted text-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted-foreground/20 ml-1.5 inline-flex size-4 items-center justify-center rounded-full"
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                className="min-w-[100px] flex-1 bg-transparent text-sm outline-none"
                placeholder={value.length === 0 ? 'Add tags...' : ''}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

function EditPost() {
    const navigate = useNavigate();
    const post = useLoaderData({ from: '/dashboard/posts/$id' });

    const { control, handleSubmit, register } = useForm<PostSchema>({
        defaultValues: {
            body: post.body,
            tags: post.tags || [],
            title: post.title,
        },
        resolver: zodResolver(postSchema),
    });

    async function onSubmit(data: PostSchema) {
        try {
            await fetcher.patch(`/posts/${post.id}`, data);

            toast.success('Post updated successfully');

            navigate({ to: `/dashboard/posts/${post.id}` });
        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    return (
        <div className="mx-auto max-w-3xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Post</CardTitle>
                    <CardDescription>
                        Update the post details below
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
                                placeholder="Post title"
                                id="title"
                                {...register('title')}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="body">Body</Label>
                            <textarea
                                id="body"
                                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Post content"
                                {...register('body')}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tags</Label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <TagsInput
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit">Save Changes</Button>
                            <Link
                                to=".."
                                className="border-input bg-background shadow-xs ring-foreground/10 hover:bg-muted hover:text-foreground inline-flex h-9 items-center justify-center rounded-md border px-2.5 text-sm font-medium ring-1"
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
