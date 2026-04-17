'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CheckSquare, 
  Users, 
  Video, 
  ClipboardList, 
  BarChart, 
  History, 
  Menu,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface MobileBottomNavProps {
  role: 'admin' | 'manager' | 'auditor';
}

const NAV_CONFIG: Record<string, NavItem[]> = {
  admin: [
    { label: 'Home', icon: Home, href: '/dashboard/admin' },
    { label: 'Audits', icon: CheckSquare, href: '/dashboard/admin/audits' },
    { label: 'Users', icon: Users, href: '/dashboard/admin/users' },
    { label: 'Flashmob', icon: Video, href: '/dashboard/admin/flashmob' },
  ],
  manager: [
    { label: 'Home', icon: Home, href: '/dashboard/manager' },
    { label: 'Audits', icon: CheckSquare, href: '/dashboard/manager/audits' },
    { label: 'Actions', icon: ClipboardList, href: '/dashboard/manager/corrective-actions' },
    { label: 'Reports', icon: BarChart, href: '/dashboard/manager/reports' },
  ],
  auditor: [
    { label: 'Home', icon: Home, href: '/dashboard/auditor' },
    { label: 'Audits', icon: CheckSquare, href: '/dashboard/auditor/audits' }, // Note: spec says Audits, but usually it's the home list. I'll point to home if necessary or specific /audits path.
    { label: 'History', icon: History, href: '/dashboard/auditor/history' },
    { label: 'Flashmob', icon: Video, href: '/dashboard/auditor/flashmob' },
  ],
};

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();
  const items = NAV_CONFIG[role] || [];
  
  const moreHref = `/dashboard/${role}/more`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-t border-border/80 flex items-center justify-between px-2 pb-safe">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
              isActive ? "text-primary" : "text-muted-text hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all",
              isActive ? "bg-primary/10" : "bg-transparent"
            )}>
              <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
            </div>
            <span className="text-[10px] font-medium leading-none truncate w-full text-center">
              {item.label}
            </span>
          </Link>
        );
      })}
      
      {/* More item */}
      <Link
        href={moreHref}
        className={cn(
          "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
          pathname === moreHref ? "text-primary" : "text-muted-text hover:text-foreground"
        )}
      >
        <div className={cn(
          "p-1.5 rounded-xl transition-all",
          pathname === moreHref ? "bg-primary/10" : "bg-transparent"
        )}>
          <Menu className={cn("h-5 w-5", pathname === moreHref ? "stroke-[2.5px]" : "stroke-[2px]")} />
        </div>
        <span className="text-[10px] font-medium leading-none truncate w-full text-center">
          More
        </span>
      </Link>
    </nav>
  );
}
