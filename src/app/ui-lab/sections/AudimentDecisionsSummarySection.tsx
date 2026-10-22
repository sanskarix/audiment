'use client';

import * as React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  GitMerge,
  Layers,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import variantDecisionsData from '@/../docs/ui-inventory/decisions/variant_decisions.json';

export function AudimentDecisionsSummarySection() {
  const decisions = Object.values(variantDecisionsData.decisions || {});
  const mergedCount = decisions.filter((d: any) => d.decisionType === 'merge').length;
  const keepSeparateCount = decisions.filter((d: any) => d.decisionType === 'keep_separate').length;

  return (
    <div id="decisions-report" className="scroll-mt-24 space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ShieldCheck size={18} />
            <span>Audiment Universal Standardization Registry</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-primary/10 text-primary font-mono font-medium">
            28 Decisions Evaluated
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          This UI Lab showcases the official universal component system defined from your 28 variant decisions.
          Every component family has been consolidated to prevent fragmented, page-specific UI across the Audiment platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/40 bg-card space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers size={13} className="text-primary" /> Total Audited Variants
            </div>
            <div className="text-2xl font-bold tabular-nums text-foreground">{decisions.length}</div>
            <div className="text-[11px] text-muted-foreground">Across 14 Component Families</div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/40 bg-card space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GitMerge size={13} className="text-amber-500" /> Merged Variants
            </div>
            <div className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">{mergedCount}</div>
            <div className="text-[11px] text-muted-foreground">Unified into core primitives</div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/40 bg-card space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" /> Preserved Separate
            </div>
            <div className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{keepSeparateCount}</div>
            <div className="text-[11px] text-muted-foreground">Retained for dedicated roles</div>
          </div>
        </div>
      </div>
    </div>
  );
}
