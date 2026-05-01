import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';

import { AppSidebar } from '@/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';

function getCookie(cookieName: string) {
    return document.cookie
        .split('; ')
        .find((c) => c.startsWith(`${cookieName}=`))
        ?.split('=')[1];
}

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        if (!getCookie('@pitang/accessToken')) {
            throw redirect({ to: '/login' });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const location = useLocation();

    const paths = location.pathname.split('/').filter(Boolean);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            className="mr-2 data-[orientation=vertical]:h-4"
                            orientation="vertical"
                        />

                        <Breadcrumb>
                            <BreadcrumbList>
                                {paths.map((path, index) => {
                                    const lastPath = index + 1 === paths.length;

                                    return (
                                        <Fragment>
                                            <BreadcrumbItem>
                                                <BreadcrumbPage
                                                    className={`capitalize ${lastPath ? 'font-bold' : ''}`}
                                                >
                                                    {path}
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>

                                            {!lastPath && (
                                                <BreadcrumbSeparator className="hidden md:block" />
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
