import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * Universal Button Component
 * Consolidated from decisions:
 * - VAR-BTN-PRIMARY (Primary Solid Button)
 * - VAR-BTN-OUTLINE (Outline Bordered Button)
 * - VAR-BTN-GHOST (Ghost Button)
 * - VAR-BTN-FILTER-TOOLBAR (Filter Toolbar Button: variant='filter')
 * - Merged VAR-BTN-SETTINGS-NAV -> VAR-BTN-PRIMARY (variant='settings-nav')
 */
const universalButtonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs rounded-lg",
        outline: "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg shadow-2xs",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg shadow-2xs",
        filter: "h-11 px-4 gap-2 font-medium text-[13px] border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shadow-2xs active:scale-[0.98]",
        "settings-nav": "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left bg-transparent text-foreground hover:bg-accent data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4 text-[13px] [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 gap-1.5 px-3 text-[12px] rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 px-6 text-[14px] rounded-xl [&_svg:not([class*='size-'])]:size-4.5",
        icon: "h-9 w-9 rounded-lg [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "h-7 w-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5 active:scale-90",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface UniversalButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof universalButtonVariants> {
  asChild?: boolean
  isActive?: boolean
}

export function UniversalButton({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  isActive,
  ...props
}: UniversalButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="universal-button"
      data-variant={variant}
      data-size={size}
      data-active={isActive}
      className={cn(universalButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
