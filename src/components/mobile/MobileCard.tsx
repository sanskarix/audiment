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
        "bg-background border border-border/60 rounded-xl p-3 transition-all active:scale-[0.98] active:bg-accent/50",
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
    <div className={cn("flex flex-col gap-0.5 mb-2", className)}>
      {children}
    </div>
  );
}

export function MobileCardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-bold text-heading leading-tight", className)}>
      {children}
    </h3>
  );
}

export function MobileCardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] text-muted-text leading-tight", className)}>
      {children}
    </p>
  );
}

export function MobileCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {children}
    </div>
  );
}

export function MobileCardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}
