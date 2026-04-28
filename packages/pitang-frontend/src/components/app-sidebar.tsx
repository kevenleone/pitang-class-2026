import {
    FrameIcon,
    MapIcon,
    PackageIcon,
    PieChartIcon,
    TerminalIcon,
} from 'lucide-react';
import { useContext } from 'react';

import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/use-auth';

const data = {
    navMain: [],
    navSecondary: [],
    projects: [
        {
            icon: <PieChartIcon />,
            name: 'Dashboard',
            url: '/dashboard',
        },
        {
            icon: <PackageIcon />,
            name: 'Products',
            url: '/dashboard/products',
        },
        {
            icon: <MapIcon />,
            name: 'Users',
            url: '/dashboard/users',
        },
        {
            icon: <FrameIcon />,
            name: 'Posts',
            url: '/dashboard/posts',
        },
    ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { handleLogout } = useAuth();
    const [{ loggedUser }] = useContext(AppContext);

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="#" />} size="lg">
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <TerminalIcon className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {loggedUser?.company?.name}
                                </span>
                                <span className="truncate text-xs">
                                    {loggedUser?.company?.title}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={data.projects} />
                <NavSecondary className="mt-auto" items={data.navSecondary} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    handleLogout={handleLogout}
                    user={{
                        avatar: loggedUser?.image || '',
                        email: loggedUser?.email || '',
                        name: `${loggedUser?.firstName} ${loggedUser?.lastName}`,
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
