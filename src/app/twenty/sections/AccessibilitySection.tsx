'use client';

import * as React from 'react';
import {
  VisuallyHidden,
  handleClickableElementKeyDown,
  IconEyeOff,
  IconCheck,
  IconFileCheck,
  Button,
} from '@/components/twenty';

export function AccessibilitySection() {
  const [interactiveCount, setInteractiveCount] = React.useState(0);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  const handleCustomClick = (source: string) => {
    setInteractiveCount((c) => c + 1);
    setLastAction(`Triggered via ${source} at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <div id="accessibility" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconEyeOff size={15} /> Category 15
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Accessibility Helpers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accessible screen-reader utilities and keyboard event normalization helpers for WCAG 2.1 AA compliance.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          2 utilities
        </span>
      </div>

      {/* 1. VisuallyHidden */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Screen Reader Announcement (`VisuallyHidden`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hides decorative or auxiliary text visually while preserving full accessibility trees for assistive technologies (screen readers like VoiceOver, NVDA, and JAWS).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Visual card */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Visible Audit Card</div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium">Store #104 - Connaught Place</span>
              </div>
              <div className="text-xs text-slate-500">
                <span>94% Score</span>
                {/* Screen readers will announce the full context */}
                <VisuallyHidden> - Food Safety FSSAI Inspection: Satisfactory Rating</VisuallyHidden>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Visual UI shows only concise badge; assistive technology reads the hidden detailed status label.
            </p>
          </div>

          {/* Code Inspection */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Rendered DOM Inspection</div>
            <div className="text-[11px] font-mono p-2.5 rounded bg-slate-900 text-slate-200 overflow-x-auto">
              {'<div className="text-xs text-slate-500">\n  <span>94% Score</span>\n  <VisuallyHidden>\n    {" - Food Safety FSSAI Inspection: Satisfactory Rating"}\n  </VisuallyHidden>\n</div>'}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-2">
              <IconCheck size={13} /> Tested screen reader accessible without altering visual flex layouts.
            </p>
          </div>
        </div>
      </div>

      {/* 2. handleClickableElementKeyDown */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Keyboard Event Normalizer (`handleClickableElementKeyDown`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standardizes keyboard navigation (Enter and Space key behavior) on non-button interactive elements like custom clickable rows, cards, or metric tiles.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">
              Interactive Keyboard Target (Tab into element and press Space or Enter)
            </div>
            {lastAction && (
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                {lastAction}
              </span>
            )}
          </div>

          <div
            tabIndex={0}
            role="button"
            aria-label="Audit checklist item: Cold Storage Temperature verification"
            onClick={() => handleCustomClick('Click/Pointer')}
            onKeyDown={handleClickableElementKeyDown}
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <IconFileCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Cold Storage Deep Freezer Temperature Check
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target threshold: -18°C · Audited by Inspector A. Sharma
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Trigger count: {interactiveCount}
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                [Space / Enter]
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Simulates standard button activation for elements with <code className="text-[11px] bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">role=&quot;button&quot;</code>.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setInteractiveCount(0);
                setLastAction(null);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
