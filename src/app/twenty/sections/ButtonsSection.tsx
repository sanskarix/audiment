'use client';

import * as React from 'react';
import {
  Button,
  ButtonGroup,
  IconButton,
  LightButton,
  LightIconButton,
  MainButton,
  IconClick,
  IconPlus,
  IconCheck,
  IconTrash,
  IconDownload,
  IconFilter,
  IconDotsVertical,
  IconCalendar,
  IconChevronRight,
  IconRefresh,
} from '@/components/twenty';

export function ButtonsSection() {
  const [loadingDemo, setLoadingDemo] = React.useState(false);
  const [auditActionCount, setAuditActionCount] = React.useState(0);
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'pending' | 'flagged'>('all');

  const triggerAuditAction = () => {
    setLoadingDemo(true);
    setTimeout(() => {
      setLoadingDemo(false);
      setAuditActionCount((c) => c + 1);
    }, 1200);
  };

  return (
    <div id="buttons" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconClick size={15} /> Category 2
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Buttons and Actions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete button suite with audited 14px default control scale, loading spinners, attached groups, and icon-only triggers.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          6 components
        </span>
      </div>

      {/* 1. Core Button Variants */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Primary Button Variants (`Button`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Variants: `solid`, `outline`, `soft`, `ghost` across `accent`, `neutral`, and `danger` color palettes.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {/* Accent Color */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              Accent Color (Brand Actions)
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="solid" color="accent" startIcon={<IconPlus size={15} />}>
                Solid Accent
              </Button>
              <Button variant="outline" color="accent">
                Outline Accent
              </Button>
              <Button variant="soft" color="accent">
                Soft Accent
              </Button>
              <Button variant="ghost" color="accent">
                Ghost Accent
              </Button>
            </div>
          </div>

          {/* Neutral Color */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              Neutral Color (Secondary Workflows)
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="solid" color="neutral">
                Solid Neutral
              </Button>
              <Button variant="outline" color="neutral" startIcon={<IconDownload size={15} />}>
                Export PDF
              </Button>
              <Button variant="soft" color="neutral">
                Soft Neutral
              </Button>
              <Button variant="ghost" color="neutral">
                Ghost Neutral
              </Button>
            </div>
          </div>

          {/* Danger Color */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              Danger Color (Destructive Actions)
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="solid" color="danger" startIcon={<IconTrash size={15} />}>
                Delete Inspection
              </Button>
              <Button variant="outline" color="danger">
                Outline Danger
              </Button>
              <Button variant="soft" color="danger">
                Soft Danger
              </Button>
              <Button variant="ghost" color="danger">
                Ghost Danger
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Button Sizes and States */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Control Sizes, Icons, and Loading States
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard 14px size (`md`), compact 13px size (`sm`), end-icons, disabled state, and interactive loading simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Button size="md" variant="solid" color="accent">
            Standard Size (14px md)
          </Button>
          <Button size="sm" variant="outline">
            Compact Size (13px sm)
          </Button>
          <Button variant="solid" color="accent" endIcon={<IconChevronRight size={15} />}>
            Next Checklist Step
          </Button>
          <Button disabled variant="outline">
            Disabled State
          </Button>

          {/* Interactive Loading Button */}
          <Button
            variant="solid"
            color="accent"
            loading={loadingDemo}
            loadingPosition="start"
            startIcon={<IconRefresh size={15} />}
            onClick={triggerAuditAction}
          >
            {loadingDemo ? 'Submitting...' : 'Run Sync Inspection'}
          </Button>
        </div>

        {auditActionCount > 0 && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
            <IconCheck size={14} /> Action triggered successfully {auditActionCount} time{auditActionCount > 1 ? 's' : ''}!
          </div>
        )}
      </div>

      {/* 3. ButtonGroup */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Button Group (`ButtonGroup`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Connected control group for segmenting views, filter modes, or audit periods (`attached` and `framed` modes).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Attached Group (View Filter):</span>
            <ButtonGroup attached>
              <Button
                variant={selectedFilter === 'all' ? 'solid' : 'outline'}
                color={selectedFilter === 'all' ? 'accent' : 'neutral'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All Audits (124)
              </Button>
              <Button
                variant={selectedFilter === 'pending' ? 'solid' : 'outline'}
                color={selectedFilter === 'pending' ? 'accent' : 'neutral'}
                size="sm"
                onClick={() => setSelectedFilter('pending')}
              >
                Pending (18)
              </Button>
              <Button
                variant={selectedFilter === 'flagged' ? 'solid' : 'outline'}
                color={selectedFilter === 'flagged' ? 'accent' : 'neutral'}
                size="sm"
                onClick={() => setSelectedFilter('flagged')}
              >
                Flagged (4)
              </Button>
            </ButtonGroup>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Date Selector Group:</span>
            <ButtonGroup attached>
              <Button variant="outline" size="sm" startIcon={<IconCalendar size={13} />}>
                Oct 2026
              </Button>
              <Button variant="outline" size="sm">
                Nov 2026
              </Button>
              <Button variant="outline" size="sm">
                Q4 Summary
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      {/* 4. Specialized Buttons: IconButton, LightButton, MainButton */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Specialized Action Controls (`IconButton`, `LightButton`, `MainButton`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Icon-only controls with integrated floating tooltip, low-emphasis light triggers, and high-prominence main CTA buttons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* IconButtons */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">IconButton with Tooltip</div>
            <div className="flex items-center gap-2">
              <IconButton aria-label="Filter Active Stores" tooltip="Filter Active Stores" size="md">
                <IconFilter size={15} />
              </IconButton>
              <IconButton aria-label="Download Inspection Sheet" tooltip="Download Inspection Sheet" size="md">
                <IconDownload size={15} />
              </IconButton>
              <IconButton aria-label="More Actions" tooltip="More Actions" size="md">
                <IconDotsVertical size={15} />
              </IconButton>
              <IconButton aria-label="Remove" tooltip="Remove" size="sm">
                <IconTrash size={13} />
              </IconButton>
            </div>
          </div>

          {/* LightButton & LightIconButton */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">LightButton Primitives</div>
            <div className="flex flex-wrap items-center gap-2">
              <LightButton emphasis="subtle">Subtle</LightButton>
              <LightButton emphasis="standard">Standard</LightButton>
              <LightIconButton aria-label="Quick Add" tooltip="Quick Add">
                <IconPlus size={14} />
              </LightIconButton>
            </div>
          </div>

          {/* MainButton */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">MainButton (Hero Action)</div>
            <MainButton fullWidth variant="solid" color="accent" startIcon={<IconPlus size={16} />}>
              Start New Audit Inspection
            </MainButton>
          </div>
        </div>
      </div>
    </div>
  );
}
