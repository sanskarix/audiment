'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '@/lib/auth';
import NotificationBell from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
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
  User2,
  Calendar
} from 'lucide-react';

interface DashboardShellProps {
  role: 'Admin' | 'Manager' | 'Auditor';
  children: React.ReactNode;
}

const NAV_ITEMS = {
  Admin: [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard/admin' },
    { title: 'Users', icon: Users, href: '/dashboard/admin/users' },
    { title: 'Locations', icon: MapPin, href: '/dashboard/admin/locations' },
    { title: 'Templates', icon: FileText, href: '/dashboard/admin/templates' },
    { title: 'Audits', icon: CheckSquare, href: '/dashboard/admin/audits' },
    { title: 'Reports', icon: BarChart, href: '/dashboard/admin/reports' },
    { title: 'Flashmob', icon: Video, href: '/dashboard/admin/flashmob' },
  ],
  Manager: [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard/manager' },
    { title: 'Audits', icon: CheckSquare, href: '/dashboard/manager/audits' },
    { title: 'Calendar', icon: Calendar, href: '/dashboard/manager/calendar' },
    { title: 'Auditors', icon: Users, href: '/dashboard/manager/auditors' },
    { title: 'Corrective Actions', icon: ClipboardList, href: '/dashboard/manager/corrective-actions' },
    { title: 'Reports', icon: BarChart, href: '/dashboard/manager/reports' },
  ],
  Auditor: [
    { title: 'My Audits', icon: CheckSquare, href: '/dashboard/auditor' },
    { title: 'History', icon: History, href: '/dashboard/auditor/history' },
    { title: 'Flashmob', icon: Video, href: '/dashboard/auditor/flashmob' },
  ],
};

const ROLE_COLOURS: Record<string, string> = {
  Admin: 'bg-primary shadow-primary/20',
  Manager: 'bg-indigo-500 shadow-indigo-500/20',
  Auditor: 'bg-emerald-500 shadow-emerald-500/20',
};

export default function DashboardShell({ role, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userState, setUserState] = useState<{ name: string; email: string } | null>(null);

  const [hasFlashmobAccess, setHasFlashmobAccess] = useState(false);

  useEffect(() => {
    // Read the session details from cookie on client mount
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setUserState({ name: data.name, email: data.email });

        // For auditors, subscribe to their user doc to check flashmob access
        if (role === 'Auditor' && data.uid) {
          const unsub = onSnapshot(doc(db, 'users', data.uid), (snap) => {
            setHasFlashmobAccess(snap.data()?.hasFlashmobAccess === true);
          });
          return unsub;
        }
      } catch (e) {
        // ignore
      }
    }
  }, [role]);

  async function handleLogout() {
    await logoutUser();
    router.push('/login');
  }

  // Filter flashmob from auditor nav if they don't have access
  const baseNav = NAV_ITEMS[role] ?? [];
  const navItems = role === 'Auditor'
    ? baseNav.filter(item => item.href !== '/dashboard/auditor/flashmob' || hasFlashmobAccess)
    : baseNav;
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
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.href}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium transition-all duration-200"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
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

      <SidebarInset className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/50 backdrop-blur-md px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-sm font-medium tracking-tight text-muted-foreground">
              <span className="text-foreground font-semibold">{role}</span> Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-4 mx-1" />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
