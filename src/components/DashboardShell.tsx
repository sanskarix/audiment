'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
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
  Moon,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import NotificationBell from './NotificationBell';
import { useAuthSync } from './AuthProvider';

interface DashboardShellProps {
  role: 'admin' | 'manager' | 'auditor';
  children: React.ReactNode;
}

const NAV_ITEMS = {
  admin: [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard/admin' },
    { title: 'Users', icon: Users, href: '/dashboard/admin/users' },
    { title: 'Locations', icon: MapPin, href: '/dashboard/admin/locations' },
    { title: 'Templates', icon: FileText, href: '/dashboard/admin/templates' },
    { title: 'Audits', icon: CheckSquare, href: '/dashboard/admin/audits' },
    { title: 'Reports', icon: BarChart, href: '/dashboard/admin/reports' },
    { title: 'Flashmob', icon: Video, href: '/dashboard/admin/flashmob' },
  ],
  manager: [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard/manager' },
    { title: 'Audits', icon: CheckSquare, href: '/dashboard/manager/audits' },
    { title: 'Calendar', icon: Calendar, href: '/dashboard/manager/calendar' },
    { title: 'Auditors', icon: Users, href: '/dashboard/manager/auditors' },
    { title: 'Corrective actions', icon: ClipboardList, href: '/dashboard/manager/corrective-actions' },
    { title: 'Reports', icon: BarChart, href: '/dashboard/manager/reports' },
  ],
  auditor: [
    { title: 'My audits', icon: CheckSquare, href: '/dashboard/auditor' },
    { title: 'History', icon: HistoryIcon, href: '/dashboard/auditor/history' },
    { title: 'Flashmob', icon: Video, href: '/dashboard/auditor/flashmob' },
  ],
};

const EXTRA_NAV_ITEMS = [
  { title: 'Notifications', icon: Bell, href: '#notifications', component: NotificationBell }
];

export default function DashboardShell({ role, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [userState, setUserState] = useState<{ name: string; email: string; photoUrl?: string } | null>(null);
  const [hasFlashmobAccess, setHasFlashmobAccess] = useState(false);
  const { isSynced, uid } = useAuthSync();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isSynced || !uid) return;
    
    let unsubUser: any;
    unsubUser = onSnapshot(doc(db, 'users', uid), (snap) => {
      const uData = snap.data();
      if (uData) {
        if (uData.isActive === false) {
          logoutUser().then(() => {
            router.push('/login?error=' + encodeURIComponent('Your account has been deactivated. Contact your administrator.'));
          });
          return;
        }
        setUserState(prev => prev ? { ...prev, ...uData } : { name: uData.name, email: uData.email, photoUrl: uData.photoUrl });
        if (role === 'auditor') setHasFlashmobAccess(uData.hasFlashmobAccess === true);
      }
    }, (err) => {
      console.error('[DashboardShell] User snapshot error:', err);
    });

    return () => { if (unsubUser) unsubUser(); };
  }, [role, isSynced, uid]);

  async function handleLogout() {
    await logoutUser();
    router.push('/login');
  }

  const baseNav = NAV_ITEMS[role] ?? [];
  const navItems = role === 'auditor'
    ? baseNav.filter(item => item.href !== '/dashboard/auditor/flashmob' || hasFlashmobAccess)
    : baseNav;

  // Bottom nav items for mobile (limit to 5 total)
  const mobileNavItems = [...navItems.slice(0, 4), ...EXTRA_NAV_ITEMS];

  return (
    <>
      {/* ── Desktop layout (sidebar) ─────────────────────── */}
      <div className="hidden md:flex h-screen w-full overflow-hidden">
        <SidebarProvider>
          <Sidebar collapsible="none" className="border-r border-border/80 shrink-0">
            <SidebarHeader className="h-24 flex flex-row items-center justify-center">
              <span className="font-semibold tracking-tighter text-heading leading-none" style={{ fontSize: '22px' }}>
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
              <div className="mt-auto">
                <NotificationBell variant="sidebar-card" userRole={role} />
              </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/80 p-3 bg-muted/5">
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton size="lg" className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-lg h-12 px-2">
                        <Avatar className="h-8 w-8 rounded-full border border-border/50 overflow-hidden relative">
                          {userState?.photoUrl ? (
                            <Image
                              src={userState.photoUrl}
                              alt="User"
                              width={32}
                              height={32}
                              priority={false}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="rounded-full bg-primary/10 font-medium text-primary">
                              <User2 className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-left ml-2">
                          <span className="font-medium truncate text-sm text-body">{userState?.name || 'Loading...'}</span>
                          <span className="text-[10px] font-medium text-muted-text/50 truncate uppercase tracking-widest">{role}</span>
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
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link
                          href={
                            role === 'admin' ? '/dashboard/admin/settings' :
                              role === 'manager' ? '/dashboard/manager/settings' :
                                '/dashboard/auditor/settings'
                          }
                          className="flex items-center w-full"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        <div className="relative mr-2 h-4 w-4 flex items-center justify-center">
                          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-4 w-4 rotate-0 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                        <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer font-medium">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-auto">
              <div className="mx-auto w-full max-w-[1440px] h-full">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* ── Mobile layout ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col h-[100dvh] bg-background typography-scope">

        {/* Mobile top bar */}
        <header className="shrink-0 h-14 px-4 border-b border-border/80 flex items-center justify-between bg-background z-20">
          <span className="font-semibold tracking-tighter text-heading" style={{ fontSize: '20px' }}>Audiment</span>
          <div className="flex items-center gap-2">
            {/* Removed mobile top bar notification bell */}
            {/* Avatar / profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full border border-border/50 flex items-center justify-center bg-primary/10 shrink-0 overflow-hidden relative">
                  {userState?.photoUrl ? (
                    <Image
                      src={userState.photoUrl}
                      alt="User"
                      width={32}
                      height={32}
                      priority={false}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <User2 className="h-4 w-4 text-primary" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="min-w-52">
                <DropdownMenuLabel className="font-normal flex flex-col space-y-0.5">
                  <span className="text-sm font-medium text-heading">{userState?.name}</span>
                  <span className="text-xs text-muted-text">{userState?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link
                    href={
                      role === 'admin' ? '/dashboard/admin/settings' :
                        role === 'manager' ? '/dashboard/manager/settings' :
                          '/dashboard/auditor/settings'
                    }
                    className="flex items-center w-full"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                  <div className="relative mr-2 h-4 w-4 flex items-center justify-center">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-0 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                  <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer font-medium">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Bottom navigation bar */}
        <nav className="shrink-0 fixed bottom-0 left-0 right-0 z-30 h-16 bg-background border-t border-border/80 flex items-center justify-around px-2">
          {mobileNavItems.map((item: any) => {
            const isActive = pathname === item.href;

            if (item.component) {
              const Comp = item.component;
              return (
                <div key={item.title} className="flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-xl transition-colors text-muted-text/60">
                  <div className="h-10 w-12 flex items-center justify-center">
                    <Comp variant="sidebar-item" userRole={role} />
                  </div>
                  <span className="text-[10px] font-medium leading-none">{item.title}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-muted-text/60 hover:text-muted-text"
                )}
              >
                <div className={cn(
                  "h-8 w-12 rounded-2xl flex items-center justify-center transition-all",
                  isActive ? "bg-primary/10" : ""
                )}>
                  <item.icon className={cn("h-5 w-5 transition-all", isActive ? "text-primary" : "")} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-primary" : "text-muted-text/60"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
