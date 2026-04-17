'use client';

import Link from 'next/link';
import { LucideIcon, ChevronRight, LogOut } from 'lucide-react';
import { MobileAppBar } from './MobileAppBar';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface MoreItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}

interface MobileMorePageProps {
  title: string;
  sections: {
    title?: string;
    items: MoreItem[];
  }[];
}

export function MobileMorePage({ title, sections }: MobileMorePageProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-20">
      <MobileAppBar title={title} />
      
      <div className="flex flex-col gap-6 p-4">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            {section.title && (
              <h2 className="text-xs font-semibold text-muted-text uppercase tracking-wider px-1">
                {section.title}
              </h2>
            )}
            <div className="bg-background border border-border/80 rounded-xl overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const isLast = itemIdx === section.items.length - 1;
                const Component = item.href ? Link : 'button';
                
                return (
                  <Component
                    key={item.label}
                    href={item.href as any}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 active:bg-accent/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.destructive ? 'bg-destructive/10 text-destructive' : 'bg-primary/5 text-primary'}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className={`text-sm font-medium ${item.destructive ? 'text-destructive' : 'text-heading'}`}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${item.destructive ? 'text-destructive/50' : 'text-muted-text/30'}`} />
                  </Component>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Logout Section */}
        <div className="mt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive font-semibold active:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
