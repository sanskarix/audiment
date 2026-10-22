import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Universal Data Table Component
 * Consolidated from decisions:
 * - VAR-TBL-STANDARD (Standard Entity Data Table)
 * - Merged VAR-TBL-REPORT (Report Summary Data Table) -> VAR-TBL-STANDARD
 * - Merged VAR-TBL-USERS (User Management Directory Table) -> VAR-TBL-STANDARD
 */

export function UniversalTable({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-border/40 bg-card shadow-2xs">
      <table
        data-slot="universal-table"
        className={cn("w-full caption-bottom text-[13px] text-foreground", className)}
        {...props}
      />
    </div>
  )
}

export function UniversalTableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="universal-table-header"
      className={cn("bg-muted/40 border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider [&_tr]:border-b-0", className)}
      {...props}
    />
  )
}

export function UniversalTableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="universal-table-body"
      className={cn("[&_tr:last-child]:border-0 divide-y divide-border/20", className)}
      {...props}
    />
  )
}

export function UniversalTableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="universal-table-row"
      className={cn(
        "border-b border-border/20 transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

export function UniversalTableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="universal-table-head"
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

export function UniversalTableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="universal-table-cell"
      className={cn(
        "p-4 align-middle text-[13px] text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}
