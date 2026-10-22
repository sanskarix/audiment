import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Universal Form Input & Textarea Component
 * Consolidated from decisions:
 * - VAR-INP-TEXT (Standard Text Input Field)
 * - Merged VAR-INP-TEXTAREA (Multiline Form Textarea) -> VAR-INP-TEXT
 */

export interface UniversalInputProps
  extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  helperText?: string
}

export const UniversalInput = React.forwardRef<HTMLInputElement, UniversalInputProps>(
  ({ className, type = "text", label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            {label}
          </label>
        )}
        <input
          type={type}
          data-slot="universal-input"
          ref={ref}
          className={cn(
            "h-10 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-2xs",
            error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[10px] text-destructive font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
UniversalInput.displayName = "UniversalInput"

export interface UniversalTextareaProps
  extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
  helperText?: string
}

export const UniversalTextarea = React.forwardRef<HTMLTextAreaElement, UniversalTextareaProps>(
  ({ className, label, error, helperText, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            {label}
          </label>
        )}
        <textarea
          data-slot="universal-textarea"
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-lg border border-border/60 bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-2xs resize-y",
            error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[10px] text-destructive font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
UniversalTextarea.displayName = "UniversalTextarea"

/**
 * Universal Search Input
 * Consolidated from decision:
 * - VAR-SEARCH-ICON-INPUT (Standard Icon Search Bar)
 */
export interface UniversalSearchInputProps
  extends React.ComponentProps<"input"> {
  onClear?: () => void
}

export const UniversalSearchInput = React.forwardRef<HTMLInputElement, UniversalSearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          data-slot="universal-search-input"
          ref={ref}
          value={value}
          className={cn(
            "h-10 w-full pl-9.5 pr-8 rounded-lg border border-border/60 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs",
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 top-3 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)
UniversalSearchInput.displayName = "UniversalSearchInput"
