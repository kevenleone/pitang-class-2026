import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";
import { postSchema, type PostSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/dashboard/posts/$id/edit")({
  component: EditPost,
});

function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
        setInput("");
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-input bg-background p-2 min-h-[40px]">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[100px] bg-transparent outline-none text-sm"
        placeholder={value.length === 0 ? "Add tags..." : ""}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function EditPost() {
  const navigate = useNavigate();
  const post = useLoaderData({ from: "/dashboard/posts/$id" });

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

      toast.success("Post updated successfully");

      navigate({ to: `/dashboard/posts/${post.id}` });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>Update the post details below</CardDescription>
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
                {...register("title")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="body">Body</Label>
              <textarea
                id="body"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Post content"
                {...register("body")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tags</Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit">Save Changes</Button>
              <Link
                to=".."
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-2.5 text-sm font-medium shadow-xs ring-1 ring-foreground/10 hover:bg-muted hover:text-foreground"
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
