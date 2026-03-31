'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '@/lib/auth';
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
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  CheckSquare,
  BarChart,
  ClipboardList,
  Video,
  History as HistoryIcon,
  LogOut,
  ChevronUp,
  User2,
  Calendar,
  Settings,
  Sun,
  Moon
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
    { title: 'History', icon: HistoryIcon, href: '/dashboard/auditor/history' },
    { title: 'Flashmob', icon: Video, href: '/dashboard/auditor/flashmob' },
  ],
};

export default function DashboardShell({ role, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
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

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="border-r border-border/50">
        <SidebarHeader className="h-24 flex flex-row items-center justify-center">
          <span className="text-2xl font-medium tracking-tighter text-heading leading-none">
            Audiment
          </span>
        </SidebarHeader>

        <SidebarContent className="px-3">
          <SidebarMenu className="gap-0.5">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="h-10 text-muted-text hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary/5 data-[active=true]:text-primary data-[active=true]:font-medium transition-all duration-200 px-3 rounded-lg"
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-[13px] font-normal tracking-tight text-body">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-lg h-12">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 font-medium text-primary">
                    <User2 className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-left ml-2">
                  <span className="font-medium truncate text-sm text-body">{userState?.name || 'Loading...'}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-text/50 truncate">
                    {role}
                  </span>
                </div>
                <ChevronUp className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width] min-w-56" align="end">
              <DropdownMenuLabel className="font-normal flex flex-col space-y-1">
                <span className="text-sm font-medium text-heading">{userState?.name}</span>
                <span className="text-xs text-muted-text">{userState?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <div className="relative mr-2 h-4 w-4 flex items-center justify-center">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-0 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer font-medium">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="typography-scope flex flex-col flex-1 h-screen overflow-hidden bg-background">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1440px] h-full">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
