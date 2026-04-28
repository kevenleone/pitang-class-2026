import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
import Page from '@/components/page';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ApiResponse, Post } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/dashboard/posts/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { data } = useSWR<ApiResponse<Post, 'posts'>>('/posts');

    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: 'id',
            cell: ({ row }) => <b>{row.getValue('id')}</b>,
            header: 'ID',
        },
        { accessorKey: 'title', header: 'Title' },
        {
            accessorKey: 'body',
            cell: ({ row }) => row.getValue('body')?.substring(0, 40) + '...',
            header: 'Body',
        },
        { accessorKey: 'views', header: 'Views' },
        {
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className="h-8 w-8 p-0" variant="ghost">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    navigate({
                                        to: `/dashboard/posts/${row.getValue('id')}`,
                                    })
                                }
                            >
                                View
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigate({
                                        to: `/dashboard/posts/${row.getValue('id')}/edit`,
                                    })
                                }
                            >
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    if (
                                        !confirm(
                                            'Are you sure you want to delete this post?',
                                        )
                                    ) {
                                        return;
                                    }

                                    toast.info(
                                        `Post "${row.getValue('title')}" is deleted`,
                                    );
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            id: 'actions',
        },
    ];

    const posts = data?.posts ?? [];

    return (
        <Page subtitle="Manage your Blog Posts" title="Posts">
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
