import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Universal Select & Action Menu Component
 * Consolidated from decisions:
 * - VAR-SEL-FORM-PICKER (Form Select Picker)
 * - Merged VAR-SEL-DROPDOWN-MENU (Context Action Dropdown Menu) -> VAR-SEL-FORM-PICKER
 */

export interface UniversalSelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface UniversalSelectProps {
  label?: string
  placeholder?: string
  options: UniversalSelectOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export function UniversalSelect({
  label,
  placeholder = "Select an option...",
  options,
  value,
  onChange,
  error,
  className,
}: UniversalSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-full space-y-1.5", className)}>
      {label && (
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs text-foreground flex items-center justify-between gap-2 shadow-2xs hover:bg-muted/20 transition-all",
          error && "border-destructive",
          isOpen && "ring-2 ring-primary/20 border-primary"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground/60")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-border/60 bg-background p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-3 py-2 text-left rounded-lg text-xs flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
              </button>
            )
          })}
        </div>
      )}

      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  )
}
