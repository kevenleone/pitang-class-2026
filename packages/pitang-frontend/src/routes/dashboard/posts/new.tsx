import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/posts/new')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/dashboard/posts/new"!</div>;
}
