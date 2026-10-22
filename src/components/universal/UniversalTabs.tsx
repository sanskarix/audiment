import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Universal Tabs & Navigation Strip
 * Consolidated from decisions:
 * - VAR-NAV-UNDERLINE-TAB (Underline Tab Strip)
 * - Merged VAR-NAV-SEGMENT-PILL -> VAR-NAV-UNDERLINE-TAB
 */

export interface UniversalTabItem {
  id: string
  label: string
  count?: number | string
  disabled?: boolean
}

export interface UniversalTabsProps {
  items: UniversalTabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function UniversalTabs({
  items,
  activeId,
  onChange,
  className,
}: UniversalTabsProps) {
  return (
    <div className={cn("border-b border-border/40 w-full flex items-center gap-6 text-xs", className)}>
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={cn(
              "pb-2.5 font-medium transition-all relative flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
