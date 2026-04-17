'use client';

import { cn } from "@/lib/utils";

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileCard({ children, className, onClick }: MobileCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-background border border-border/80 rounded-xl p-4 transition-all active:scale-[0.98] active:bg-accent/50",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MobileCardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 mb-3", className)}>
      {children}
    </div>
  );
}

export function MobileCardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-semibold text-heading leading-tight", className)}>
      {children}
    </h3>
  );
}

export function MobileCardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs text-muted-text leading-normal", className)}>
      {children}
    </p>
  );
}

export function MobileCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {children}
    </div>
  );
}

export function MobileCardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-4 pt-3 border-t border-border/50 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}
