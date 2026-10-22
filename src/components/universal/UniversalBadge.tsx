import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Clock, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Universal Badge & Status Indicator Component
 * Consolidated from decisions:
 * - VAR-BDG-COMPLETED (.badge-completed)
 * - VAR-BDG-IN-PROGRESS (.badge-in-progress)
 * - VAR-BDG-INFORMATIONAL (Generic tag)
 */
const universalBadgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium border-none whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        completed: "h-6 px-2.5 rounded-full text-[12px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tracking-[0.02em]",
        inProgress: "h-6 px-2.5 rounded-full text-[12px] bg-primary/10 text-primary tracking-[0.02em]",
        assigned: "h-6 px-2.5 rounded-full text-[12px] bg-amber-500/10 text-amber-600 dark:text-amber-400 tracking-[0.02em]",
        highSeverity: "px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 tracking-[0.025em]",
        mediumSeverity: "px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 tracking-[0.025em]",
        lowSeverity: "px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 tracking-[0.025em]",
        informational: "px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground",
        neutral: "px-2.5 py-0.5 rounded-full text-[11px] bg-muted/60 text-foreground",
      },
      size: {
        default: "text-[11px]",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-[12px] h-6 px-3",
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
)

export interface UniversalBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof universalBadgeVariants> {
  showIcon?: boolean
}

export function UniversalBadge({
  className,
  variant = "neutral",
  size,
  showIcon = false,
  children,
  ...props
}: UniversalBadgeProps) {
  return (
    <span
      data-slot="universal-badge"
      data-variant={variant}
      className={cn(universalBadgeVariants({ variant, size, className }))}
      {...props}
    >
      {showIcon && variant === "completed" && <Check className="h-3 w-3" />}
      {showIcon && variant === "inProgress" && <Clock className="h-3 w-3 animate-spin" />}
      {showIcon && variant === "highSeverity" && <AlertTriangle className="h-3 w-3" />}
      {children}
    </span>
  )
}
