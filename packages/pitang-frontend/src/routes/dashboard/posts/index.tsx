import Page from "@/components/page";
import { createFileRoute } from "@tanstack/react-router";
import Table from "@/components/table";
import useSWR from "swr";
import type { ApiResponse, Post } from "@/types";

export const Route = createFileRoute("/dashboard/posts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSWR<ApiResponse<Post, "posts">>("/posts");

  const posts = data?.posts ?? [];

  return (
    <Page title="Posts" subtitle="Manage your Blog Posts">
      <Table
        rows={posts}
        columns={[
          { id: "id", title: "ID", render: (id) => <b>{id}</b> },
          { id: "title", title: "Title" },
          {
            id: "body",
            title: "Body",
            render: (body: string) => body.substring(0, 40) + "...",
          },
          {
            id: "tags",
            title: "Tags",
            render: (tags: string[]) =>
              tags.map((tag) => (
                <span className="bg-slate-500 mx-1 px-2 py-1 text-white rounded-full">
                  {tag}
                </span>
              )),
          },
          {
            id: "reactions",
            title: "Reactions",
            render: (reactions: any) => (
              <div>
                Likes: {reactions.likes} &ensp; Dislikes: {reactions.dislikes}
              </div>
            ),
          },
          { id: "views", title: "Views" },
        ]}
        caption="A list of your recent posts."
      />
    </Page>
  );
}
