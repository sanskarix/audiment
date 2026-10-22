'use client';

import * as React from 'react';
import {
  Loader,
  ThinkingOrbitLoaderIcon,
  ProgressBar,
  ProgressRing,
  Skeleton,
  IconLoader,
  IconRefresh,
} from '@/components/twenty';

export function LoadingSection() {
  const [progressVal, setProgressVal] = React.useState(72);

  return (
    <div id="loading" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconLoader size={15} /> Category 12
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Loading States, Skeletons and Progress Indicators
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Activity spinners, AI orbit loaders, animated progress bars, circular rings, and skeleton content placeholders.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          5 components
        </span>
      </div>

      {/* 1. Loaders & ThinkingOrbitLoaderIcon */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Activity Loaders (`Loader`, `ThinkingOrbitLoaderIcon`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard indeterminate spinner and custom Twenty AI orbit animation used for assistant analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Loader */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Standard Loader</div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs">
                <Loader />
                <span>Default Loader</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <Loader color="blue" />
                <span>Blue Loader</span>
              </div>
            </div>
          </div>

          {/* ThinkingOrbitLoaderIcon */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">
              AI Reasoning Orbit Loader (`ThinkingOrbitLoaderIcon`)
            </div>
            <div className="flex items-center gap-4">
              <ThinkingOrbitLoaderIcon size={28} />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <div className="font-medium">AI Audit Assistant Reasoning...</div>
                <div className="text-[11px] text-slate-500">Cross-checking photo evidence against FSSAI food safety SOPs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ProgressBar & ProgressRing */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Linear and Circular Progress (`ProgressBar`, `ProgressRing`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive visual gauges for checklist completion rates and compliance scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* ProgressBar */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Audit Completion: {progressVal}%</span>
              <button
                type="button"
                onClick={() => setProgressVal((p) => (p >= 100 ? 25 : p + 25))}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <IconRefresh size={12} /> Cycle value
              </button>
            </div>
            <ProgressBar value={progressVal} withGrowIn withBorderRadius />
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] text-slate-500">Critical Checkpoint: 100%</div>
              <ProgressBar value={100} barColor="#10b981" />
            </div>
          </div>

          {/* ProgressRing */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Circular Rings (`ProgressRing`)</div>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-1.5">
                <ProgressRing value={96} size="md" barColor="#10b981">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">96%</span>
                </ProgressRing>
                <span className="text-[11px] text-slate-500">Hygiene Score</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <ProgressRing value={75} size="md" barColor="#3b82f6">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">75%</span>
                </ProgressRing>
                <span className="text-[11px] text-slate-500">Completed</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <ProgressRing value={40} size="md" barColor="#f59e0b">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">40%</span>
                </ProgressRing>
                <span className="text-[11px] text-slate-500">CAPA Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Skeleton Loaders */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Skeleton Content Placeholders (`Skeleton`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Animated shimmer placeholders for cards, avatars, titles, and text rows during network loads.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 max-w-lg space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton width={42} height={42} borderRadius={9999} animated />
            <div className="space-y-1.5 flex-1">
              <Skeleton width="60%" height={14} animated />
              <Skeleton width="40%" height={10} animated />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton width="100%" height={12} animated />
            <Skeleton width="90%" height={12} animated />
            <Skeleton width="75%" height={12} animated />
          </div>
        </div>
      </div>
    </div>
  );
}
