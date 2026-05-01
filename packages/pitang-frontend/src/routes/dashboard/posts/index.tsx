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
import fetcher from '@/lib/fetcher';

import type { Post } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

interface PostsResponse {
    items: Post[];
    lastPage: boolean;
    page: number;
    pageSize: number;
    totalCount: number;
}

export const Route = createFileRoute('/dashboard/posts/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { data, mutate } = useSWR<PostsResponse>('/api/post?page=1&pageSize=20');

    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: 'id',
            cell: ({ row }) => <b>#{row.getValue('id')}</b>,
            header: 'ID',
        },
        { accessorKey: 'title', header: 'Title' },
        {
            accessorKey: 'body',
            cell: ({ row }) => (row.getValue('body') as string).substring(0, 40) + '...',
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
                                        to: `/dashboard/posts/${row.original.slug}`,
                                    })
                                }
                            >
                                View
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigate({
                                        to: `/dashboard/posts/${row.original.slug}/edit`,
                                    })
                                }
                            >
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={async () => {
                                    if (
                                        !confirm(
                                            'Are you sure you want to delete this post?',
                                        )
                                    ) {
                                        return;
                                    }

                                    await fetcher.delete(`/api/post/${row.original.slug}`);

                                    toast.info(
                                        `Post "${row.getValue('title')}" deleted`,
                                    );

                                    mutate();
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

    const posts = data?.items ?? [];

    return (
        <Page subtitle="Manage your Blog Posts" title="Posts">
            <DataTable columns={columns} data={posts} />
        </Page>
    );
}
