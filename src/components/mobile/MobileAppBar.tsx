'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileAppBarProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export function MobileAppBar({ 
  title, 
  showBack = false, 
  backHref, 
  rightElement,
  className 
}: MobileAppBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full h-14 px-4 flex items-center justify-between",
        "bg-background/80 backdrop-blur-md border-b border-border/80",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-9 w-9 -ml-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="font-semibold text-lg text-heading tracking-tight truncate max-w-[200px]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {rightElement}
      </div>
    </header>
  );
}
