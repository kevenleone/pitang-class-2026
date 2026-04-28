import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/product/$id')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/product/$id"!</div>;
}
