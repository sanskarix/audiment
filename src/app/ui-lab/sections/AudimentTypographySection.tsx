'use client';

import * as React from 'react';
import { Type, Hash, Sparkles } from 'lucide-react';

export function AudimentTypographySection() {
  return (
    <div id="typography" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Type size={15} /> Category 1
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Typography and Text Styles
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Audiment typography hierarchy: page headings, metric numerals, section labels, and tabular monospace numbers.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          5 scale tokens
        </span>
      </div>

      {/* 1. Heading Hierarchy */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Page & Section Headings
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard semantic headings used across Admin, Manager, and Auditor dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/40">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Scale & Weight</div>
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Page Title (24px Bold)</h1>
                <p className="text-[11px] text-muted-foreground font-mono">text-2xl font-bold tracking-tight</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Section Header (18px SemiBold)</h2>
                <p className="text-[11px] text-muted-foreground font-mono">text-lg font-semibold tracking-tight</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Card Title (14px SemiBold)</h3>
                <p className="text-[11px] text-muted-foreground font-mono">text-sm font-semibold</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/40">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Body & Subtext Hierarchy</div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-foreground">Standard Body Text (14px Regular) — Used for descriptive audit content.</p>
                <p className="text-[11px] text-muted-foreground font-mono">text-sm text-foreground</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Secondary Helper Text (12px Muted) — Used for timestamps and metadata.</p>
                <p className="text-[11px] text-muted-foreground font-mono">text-xs text-muted-foreground</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Caps Label (11px Semibold Tracking Wider)</p>
                <p className="text-[11px] text-muted-foreground font-mono">text-[11px] uppercase tracking-wider</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Numeric & KPI Metric Typography */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Hero Numeric Stats (`tabular-nums`)
          </h3>
          <p className="text-xs text-muted-foreground">
            Standardized numeric display for KPI summaries, audit compliance rates, and completion counters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border/40 bg-background/50 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Audit Compliance</div>
            <div className="text-3xl font-bold tracking-tight tabular-nums text-foreground">98.4%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+2.1% vs last month</div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-background/50 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Audits</div>
            <div className="text-3xl font-bold tracking-tight tabular-nums text-foreground">1,248</div>
            <div className="text-[11px] text-primary font-medium">42 pending review</div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-background/50 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Critical Flags</div>
            <div className="text-3xl font-bold tracking-tight tabular-nums text-rose-600 dark:text-rose-400">7</div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Requires immediate action</div>
          </div>
        </div>
      </div>
    </div>
  );
}
