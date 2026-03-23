'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  CheckSquare,
  BarChart,
  ClipboardList,
  Video,
  History,
  LogOut,
  ChevronUp,
  User2
} from 'lucide-react';

interface DashboardShellProps {
  role: 'Admin' | 'Manager' | 'Auditor';
  children: React.ReactNode;
}

const NAV_ITEMS = {
  Admin: [
    { title: 'Overview', icon: LayoutDashboard },
    { title: 'Users', icon: Users },
    { title: 'Locations', icon: MapPin },
    { title: 'Templates', icon: FileText },
    { title: 'Audits', icon: CheckSquare },
    { title: 'Reports', icon: BarChart },
  ],
  Manager: [
    { title: 'Overview', icon: LayoutDashboard },
    { title: 'Audits', icon: CheckSquare },
    { title: 'Auditors', icon: Users },
    { title: 'Corrective Actions', icon: ClipboardList },
    { title: 'Reports', icon: BarChart },
  ],
  Auditor: [
    { title: 'My Audits', icon: CheckSquare },
    { title: 'History', icon: History },
    { title: 'Flashmob', icon: Video },
  ],
};

const ROLE_COLOURS: Record<string, string> = {
  Admin: 'bg-violet-600',
  Manager: 'bg-blue-600',
  Auditor: 'bg-emerald-600',
};

export default function DashboardShell({ role, children }: DashboardShellProps) {
  const router = useRouter();
  const [userState, setUserState] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Read the session details from cookie on client mount
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setUserState({ name: data.name, email: data.email });
      } catch (e) {
        // ignore
      }
    }
  }, []);

  async function handleLogout() {
    await logoutUser();
    router.push('/login');
  }

  const navItems = NAV_ITEMS[role] ?? [];
  const roleColour = ROLE_COLOURS[role] ?? 'bg-zinc-600';

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r">
        <SidebarHeader className="h-16 flex items-center px-4">
          <div className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <div className={`h-6 w-6 rounded-md flex items-center justify-center text-white ${roleColour}`}>
              {role.charAt(0)}
            </div>
            <span className="text-lg tracking-tight">Audiment</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 pt-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10">
                    <User2 className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-left">
                  <span className="font-medium truncate">{userState?.name || 'Loading...'}</span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">{userState?.email || ''}</span>
                </div>
                <ChevronUp className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width] min-w-56" align="end">
              <DropdownMenuLabel className="font-normal flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">{userState?.name}</span>
                <span className="text-xs text-muted-foreground leading-none">{userState?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col flex-1 h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-semibold">{role} Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-muted/20 p-6 md:p-8">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
