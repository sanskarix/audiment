import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Universal Modal Dialog & Overlay Component
 * Consolidated from decisions:
 * - VAR-MOD-MODAL (Standard Interactive Modal Window)
 * - Merged VAR-MOD-ALERT (Confirmation Alert Dialog) -> VAR-MOD-MODAL
 * - Merged VAR-MOD-SHEET (Slide-over Drawer Sheet) -> VAR-MOD-MODAL
 */

export interface UniversalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
}

export function UniversalModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  className,
}: UniversalModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={cn(
          "relative w-full rounded-2xl border border-border/50 bg-background p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150",
          maxWidthMap[maxWidth],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border/30">
          <div>
            <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="text-xs text-foreground space-y-3">{children}</div>

        {/* Action Footer */}
        {footer && (
          <div className="pt-3 border-t border-border/30 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
