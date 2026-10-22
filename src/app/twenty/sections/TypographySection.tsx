'use client';

import * as React from 'react';
import {
  Heading,
  Text,
  Shortcut,
  OverflowingTextWithTooltip,
  IconTypography,
} from '@/components/twenty';

export function TypographySection() {
  return (
    <div id="typography" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconTypography size={15} /> Category 1
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Typography and Text
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Twenty UI text primitives with optical hierarchy, automated overflow tooltips, and keyboard shortcut tokens.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          4 components
        </span>
      </div>

      {/* 1. Headings */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Heading Primitives (`Heading`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configurable heading levels (h1–h6), responsive sizes (`sm`, `md`, `lg`, `xl`), and semantic colors (`primary`, `secondary`, `tertiary`).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Heading Levels</div>
            <div className="space-y-2">
              <Heading level={1} size="lg">Level 1 (lg) — Store Audit #4029</Heading>
              <Heading level={2} size="lg">Level 2 (lg) — FSSAI Hygiene Inspection</Heading>
              <Heading level={3} size="md">Level 3 (md) — Cold Storage Temperature Log</Heading>
              <Heading level={4} size="sm">Level 4 (sm) — Immediate Corrective Action</Heading>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Color Semantics</div>
            <div className="space-y-2">
              <Heading level={3} size="md" color="primary">Primary Color Heading (High Contrast)</Heading>
              <Heading level={3} size="md" color="secondary">Secondary Color Heading (Subtle)</Heading>
              <Heading level={3} size="md" color="tertiary">Tertiary Color Heading (Muted)</Heading>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Text */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Body and Truncation Text (`Text`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard paragraph text supporting single-line truncation, multi-line clamps, and custom rendering tags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Standard & Truncated Text</div>
            <Text className="text-sm text-slate-700 dark:text-slate-300">
              Regular body text explaining non-conformance findings during store walk-through.
            </Text>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1">With truncate={'{true}'}:</span>
              <div className="max-w-xs p-2 rounded bg-white dark:bg-slate-900 border text-xs">
                <Text truncate>
                  Critical Violation: Hand-wash sink obstructed by cardboard boxes in dry storage room #2.
                </Text>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Multi-line Clamp (`lineClamp=2`)</div>
            <div className="p-3 rounded bg-white dark:bg-slate-900 border text-xs leading-relaxed">
              <Text lineClamp={2}>
                The auditor inspected the walk-in refrigerator unit at 14:30 IST. Ambient temperature measured 9.2°C exceeding the critical threshold of 4.0°C. Raw meat products were immediately relocated to auxiliary chiller #1 pending technician repair verification.
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Keyboard Shortcuts */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Keyboard Shortcuts (`Shortcut`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Platform-aware shortcut tokens for power-user auditor interactions and navigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950/50 text-xs">
            <span className="text-slate-600 dark:text-slate-300">Command Palette:</span>
            <Shortcut shortcut={['⌘', 'K']} />
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950/50 text-xs">
            <span className="text-slate-600 dark:text-slate-300">New Audit:</span>
            <Shortcut shortcut={['Shift', 'N']} />
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950/50 text-xs">
            <span className="text-slate-600 dark:text-slate-300">Mark Compliant:</span>
            <Shortcut shortcut={['Space']} />
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950/50 text-xs">
            <span className="text-slate-600 dark:text-slate-300">Quick Filter:</span>
            <Shortcut shortcut={['⌥', 'F']} />
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950/50 text-xs">
            <span className="text-slate-600 dark:text-slate-300">Dismiss Modal:</span>
            <Shortcut shortcut={['Esc']} />
          </div>
        </div>
      </div>

      {/* 4. Overflowing Text with Tooltip */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Overflowing Text with Tooltip (`OverflowingTextWithTooltip`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatically calculates text overflow and provides a built-in floating tooltip when the content exceeds the container width. Hover over the container below to see the tooltip in action.
          </p>
        </div>

        <div className="max-w-md p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/60 text-xs">
          <OverflowingTextWithTooltip text="Standard Operating Procedure Checklist — Multi-Store Hazard Analysis & Critical Control Point Inspection (NCR Region, Batch Q4-2026)" />
        </div>
      </div>
    </div>
  );
}
