import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Universal Card & Metric Widget Component
 * Consolidated from decisions:
 * - VAR-CRD-SURFACE (Standard Card Container)
 * - VAR-CRD-KPI-HERO (Hero KPI Stat Display: .stat-number)
 */

export function UniversalCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="universal-card"
      className={cn(
        "rounded-2xl border border-border/40 bg-card p-5 text-card-foreground shadow-2xs transition-all",
        className
      )}
      {...props}
    />
  )
}

export function UniversalCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="universal-card-header"
      className={cn("flex flex-col space-y-1 pb-3", className)}
      {...props}
    />
  )
}

export function UniversalCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="universal-card-title"
      className={cn("text-sm font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

export function UniversalCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="universal-card-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export interface UniversalMetricCardProps {
  label: string
  value: string | number
  trend?: {
    value: string
    isPositive?: boolean
  }
  subtext?: string
  className?: string
}

export function UniversalMetricCard({
  label,
  value,
  trend,
  subtext,
  className,
}: UniversalMetricCardProps) {
  return (
    <UniversalCard className={cn("p-4.5 space-y-2", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground block">
        {label}
      </span>
      <div className="text-3xl font-bold tracking-[-0.03em] tabular-nums text-foreground">
        {value}
      </div>
      {(trend || subtext) && (
        <div className="flex items-center gap-2 pt-0.5 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold text-[11px] px-1.5 py-0.2 rounded-md",
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-[11px] text-muted-foreground">{subtext}</span>}
        </div>
      )}
    </UniversalCard>
  )
}
