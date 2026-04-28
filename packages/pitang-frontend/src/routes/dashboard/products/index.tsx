import {
    createFileRoute,
    useLocation,
    useNavigate,
} from '@tanstack/react-router';
import { GridIcon, ListIcon } from 'lucide-react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { fetchProducts } from '@/lib/api';

export const Route = createFileRoute('/dashboard/products/')({
    component: ProductsPage,
});

const limit = 12;

function ProductsPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const viewMode = (search as { viewMode?: string }).viewMode || 'grid';
    const page = Number((search as { page?: string }).page) || 1;

    const { data, isLoading: loading } = useSWR(
        `/products?page=${page}&limit=${limit}`,
        () => fetchProducts(page, limit),
    );

    const total = data?.total || 0;
    const products = data?.products;

    const totalPages = Math.ceil(total / limit);

    const getPageNumbers = () => {
        const pages: ('ellipsis' | number)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            navigate({
                                search: { ...search, viewMode: 'grid' },
                                to: '/dashboard/products',
                            });
                        }}
                        size="icon"
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                    >
                        <GridIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => {
                            navigate({
                                search: { ...search, viewMode: 'table' },
                                to: '/dashboard/products',
                            });
                        }}
                        size="icon"
                        variant={viewMode === 'table' ? 'default' : 'outline'}
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Card className="overflow-hidden" key={product.id}>
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                    src={product.thumbnail}
                                />
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="line-clamp-1 text-sm">
                                    {product.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-xs">
                                    {product.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold">
                                        ${product.price}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {product.stock} in stock
                                    </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    <span className="bg-secondary rounded px-2 py-1 text-xs">
                                        {product.category}
                                    </span>
                                    <span className="bg-secondary rounded px-2 py-1 text-xs">
                                        {product.brand}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button
                                    className="w-full"
                                    size="sm"
                                    variant="outline"
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img
                                        alt={product.title}
                                        className="h-12 w-12 rounded object-cover"
                                        src={product.thumbnail}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {product.title}
                                </TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="text-right">
                                    ${product.price}
                                </TableCell>
                                <TableCell className="text-right">
                                    {product.stock}
                                </TableCell>
                                <TableCell className="text-right">
                                    {product.rating}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={
                                page === 1
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                            onClick={() =>
                                navigate({
                                    search: { ...search, page: page - 1 },
                                    to: '/dashboard/products',
                                })
                            }
                        />
                    </PaginationItem>
                    {getPageNumbers().map((pageNum, idx) =>
                        pageNum === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    className="cursor-pointer"
                                    isActive={page === pageNum}
                                    onClick={() =>
                                        navigate({
                                            search: {
                                                ...search,
                                                page: pageNum,
                                            },
                                            to: '/dashboard/products',
                                        })
                                    }
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}
                    <PaginationItem>
                        <PaginationNext
                            className={
                                page === totalPages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                            onClick={() =>
                                navigate({
                                    search: { ...search, page: page + 1 },
                                    to: '/dashboard/products',
                                })
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
