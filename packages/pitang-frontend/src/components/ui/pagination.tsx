import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Pagination = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'nav'>
>(({ className, ...props }, ref) => (
    <nav
        aria-label="pagination"
        className={cn('flex w-full justify-center', className)}
        ref={ref}
        role="navigation"
        {...props}
    />
));
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => (
    <ul
        className={cn('flex flex-row items-center gap-1', className)}
        ref={ref}
        {...props}
    />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
    <li className={cn('', className)} ref={ref} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = React.ComponentPropsWithoutRef<'a'> & {
    isActive?: boolean;
};

const PaginationLink = ({
    className,
    isActive,
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? 'page' : undefined}
        className={cn(
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-clip-padding text-sm font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            isActive
                ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                : 'bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
            className,
        )}
        {...props}
    />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        className={cn('gap-1 pl-2.5', className)}
        {...props}
    >
        <ChevronLeftIcon className="size-4" />
        <span>Previous</span>
    </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        className={cn('gap-1 pr-2.5', className)}
        {...props}
    >
        <span>Next</span>
        <ChevronRightIcon className="size-4" />
    </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'span'>) => (
    <span
        aria-hidden
        className={cn('flex size-9 items-center justify-center', className)}
        {...props}
    >
        <MoreHorizontalIcon className="size-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
