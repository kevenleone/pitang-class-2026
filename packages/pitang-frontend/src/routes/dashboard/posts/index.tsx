import Page from "@/components/page";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useSWR from "swr";
import type { ApiResponse, Post } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/posts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data } = useSWR<ApiResponse<Post, "posts">>("/posts");

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <b>{row.getValue("id")}</b>,
    },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "body",
      header: "Body",
      cell: ({ row }) => row.getValue("body")?.substring(0, 40) + "...",
    },
    { accessorKey: "views", header: "Views" },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate({ to: `/dashboard/posts/${row.getValue("id")}` })
                }
              >
                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: `/dashboard/posts/${row.getValue("id")}/edit`,
                  })
                }
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  if (!confirm("Are you sure you want to delete this post?")) {
                    return;
                  }

                  toast.info(`Post "${row.getValue("title")}" is deleted`);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const posts = data?.posts ?? [];

  return (
    <Page title="Posts" subtitle="Manage your Blog Posts">
      <DataTable columns={columns} data={posts} />
    </Page>
  );
}

//  <Page title="Posts" subtitle="Manage your Blog Posts">
//       <Table
//         rows={posts}
//         columns=}
//         caption="A list of your recent posts."
//       />
//     </Page>
