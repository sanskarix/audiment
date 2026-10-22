'use client';

import * as React from 'react';
import {
  Collapsible,
  Section,
  Separator,
  ResizeHandle,
  AnimatedIconCrossfade,
  DirectionProvider,
  Button,
  IconLayout,
  IconChevronDown,
  IconCheck,
  IconClock,
  IconPlus,
} from '@/components/twenty';

export function LayoutSection() {
  const [crossfadeActive, setCrossfadeActive] = React.useState(true);
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr');

  return (
    <div id="layout" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconLayout size={15} /> Category 13
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Layout Primitives, Spacing and Resizing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section headers, animated collapsibles, structural separators, split-pane resize handles, and icon crossfades.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          6 components
        </span>
      </div>

      {/* 1. Section Header Primitives */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Section Container (`Section.Root`, `Section.Header`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard section header primitive with title, description, and action button slot.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
          <Section.Root>
            <Section.Header
              title="Regional Store Inspection Schedule"
              description="Managing monthly compliance visits across 42 QSR outlets in Delhi NCR & Bangalore."
              actions={
                <Button size="sm" variant="solid" color="accent" startIcon={<IconPlus size={13} />}>
                  Schedule Audit
                </Button>
              }
            />
            <div className="pt-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 mt-3">
              Section content renders below the header divider with standardized spacing.
            </div>
          </Section.Root>
        </div>
      </div>

      {/* 2. Collapsible Panels */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Expandable Panels (`Collapsible`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accessible accordion container with smooth height animation for expanding checklist sections.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 max-w-lg">
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
              <span>Section 1: Dry Storage & Chemical Segregation (Click to toggle)</span>
              <IconChevronDown size={14} className="text-slate-400" />
            </Collapsible.Trigger>
            <Collapsible.Panel className="p-3 text-xs text-slate-600 dark:text-slate-400 space-y-2 border-t mt-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Pest control traps placed at 3-meter intervals along perimeter walls.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>All chemical cleaning agents stored in locked steel cabinet #B.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Pallets stacked 15cm above floor level (needs verification).</span>
              </div>
            </Collapsible.Panel>
          </Collapsible.Root>
        </div>
      </div>

      {/* 3. Separator, ResizeHandle & AnimatedIconCrossfade */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Separators, Resize Handles & Animated Icon Crossfade
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dividers, interactive split-pane resizers, and icon state morphing transitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Separator */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Separator Primitives</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div>Top Content Item</div>
              <Separator />
              <div>Middle Content Item</div>
              <Separator />
              <div>Bottom Content Item</div>
            </div>
          </div>

          {/* ResizeHandle */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">ResizeHandle (Split View)</div>
            <p className="text-[11px] text-slate-500">
              Draggable divider used between auditor checklist panels and evidence photos.
            </p>
            <div className="h-16 rounded border bg-white dark:bg-slate-900 flex items-center justify-center">
              <ResizeHandle axis="x" />
            </div>
          </div>

          {/* AnimatedIconCrossfade */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">AnimatedIconCrossfade</div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border bg-white dark:bg-slate-900">
                <AnimatedIconCrossfade
                  isActive={crossfadeActive}
                  activeIcon={<IconCheck size={18} className="text-emerald-500" />}
                  inactiveIcon={<IconClock size={18} className="text-amber-500" />}
                />
              </div>
              <Button size="sm" variant="outline" onClick={() => setCrossfadeActive(!crossfadeActive)}>
                Toggle State ({crossfadeActive ? 'Active' : 'Pending'})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DirectionProvider (RTL / LTR) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Layout Direction Provider (`DirectionProvider`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            LTR and RTL direction support for international audit operations.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={direction === 'ltr' ? 'solid' : 'outline'}
              onClick={() => setDirection('ltr')}
            >
              LTR Mode (English)
            </Button>
            <Button
              size="sm"
              variant={direction === 'rtl' ? 'solid' : 'outline'}
              onClick={() => setDirection('rtl')}
            >
              RTL Mode (Arabic / UAE Outlets)
            </Button>
          </div>

          <DirectionProvider direction={direction}>
            <div className="p-3 bg-white dark:bg-slate-900 rounded border text-xs">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {direction === 'rtl' ? 'تدقيق سلامة الأغذية — فرع دبي مول' : 'Food Safety Audit — Dubai Mall Branch'}
              </span>
              <p className="text-slate-500 mt-1">
                {direction === 'rtl' ? 'تم التحقق من مطابقة معايير النظافة' : 'Verified compliance against regional food safety protocols.'}
              </p>
            </div>
          </DirectionProvider>
        </div>
      </div>
    </div>
  );
}
