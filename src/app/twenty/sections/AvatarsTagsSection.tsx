'use client';

import * as React from 'react';
import {
  Avatar,
  AvatarGroup,
  Chip,
  Tag,
  Pill,
  Status,
  ColorSample,
  NotificationCounter,
  IconUser,
  IconCheck,
  IconAlertTriangle,
  IconMap,
  IconClock,
  IconPhoto,
} from '@/components/twenty';

export function AvatarsTagsSection() {
  const [chips, setChips] = React.useState([
    'High Risk',
    'Pending Review',
    'Cold Storage',
    'Store #104',
  ]);

  const removeChip = (toRemove: string) => {
    setChips((prev) => prev.filter((c) => c !== toRemove));
  };

  return (
    <div id="avatars-tags" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconUser size={15} /> Category 8
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Avatars, Chips, Tags and Status Indicators
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auditor profile avatars, stacked team groupings, interactive filter chips, status tags, and notification counters.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          8 components
        </span>
      </div>

      {/* 1. Avatars & AvatarGroup */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Auditor Avatars & Team Stacks (`Avatar`, `AvatarGroup`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sizes from `xxs` to `xl`, initials calculation, color seeds, pulsing presence rings, and grouped avatar stacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Avatar Sizes */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Avatar Scale & Fallbacks</div>
            <div className="flex items-center gap-3">
              <Avatar.Root size="xl" name="Priya Sharma">
                <Avatar.Fallback />
              </Avatar.Root>
              <Avatar.Root size="lg" name="Rohit Verma">
                <Avatar.Fallback />
              </Avatar.Root>
              <Avatar.Root size="md" name="Anita Desai" pulsing>
                <Avatar.Fallback />
              </Avatar.Root>
              <Avatar.Root size="sm" name="Vikram Singh">
                <Avatar.Fallback />
              </Avatar.Root>
              <Avatar.Root size="xs" name="Karan Mehra">
                <Avatar.Fallback />
              </Avatar.Root>
            </div>
            <p className="text-[11px] text-slate-500">
              Middle avatar features `pulsing={'{true}'}` denoting an auditor currently in-progress on a live store inspection.
            </p>
          </div>

          {/* AvatarGroup */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">
              AvatarGroup (Inspection Team Stack)
            </div>
            <div className="flex items-center gap-4">
              <AvatarGroup
                maxVisible={3}
                avatars={[
                  <Avatar key="1" name="Priya Sharma" />,
                  <Avatar key="2" name="Rohit Verma" />,
                  <Avatar key="3" name="Anita Desai" />,
                  <Avatar key="4" name="Vikram Singh" />,
                  <Avatar key="5" name="Karan Mehra" />,
                ]}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                5 Regional Quality Auditors Assigned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Chips & Tags */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Interactive Filter Chips & Status Tags (`Chip`, `Tag`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clickable filter chips with dismiss handlers and severity-colored status tags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Dismissible Chips */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Interactive Filter Chips</div>
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((chipText) => (
                <Chip
                  key={chipText}
                  clickable
                  onClick={() => removeChip(chipText)}
                >
                  {chipText} ✕
                </Chip>
              ))}
              {chips.length === 0 && (
                <button
                  type="button"
                  onClick={() => setChips(['High Risk', 'Pending Review', 'Cold Storage', 'Store #104'])}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Reset sample chips
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Click any chip above to test interactive removal.
            </span>
          </div>

          {/* Severity Tags */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Color-Coded Status Tags</div>
            <div className="flex flex-wrap items-center gap-2">
              <Tag color="green" startIcon={<IconCheck size={12} />}>
                Passed (100%)
              </Tag>
              <Tag color="red" startIcon={<IconAlertTriangle size={12} />}>
                Critical Failure
              </Tag>
              <Tag color="yellow">
                Pending Verification
              </Tag>
              <Tag color="blue">
                Scheduled Next
              </Tag>
              <Tag color="gray">
                Archived
              </Tag>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pills, Status Indicators, ColorSample & NotificationCounter */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Indicators and Badges (`Pill`, `Status`, `ColorSample`, `NotificationCounter`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compact presence indicators, notification counter bubbles, and color swatch indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Pills */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Pill Components</div>
            <div className="flex flex-col gap-2">
              <Pill label="Geo-Verified" Icon={IconMap} />
              <Pill label="Photo Attached" Icon={IconPhoto} />
              <Pill label="On-Time Audit" Icon={IconClock} />
            </div>
          </div>

          {/* Status */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Status Indicator Dots</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Status color="green">Auditor Online</Status>
              </div>
              <div className="flex items-center gap-2">
                <Status color="yellow" loading>Auditing Store</Status>
              </div>
              <div className="flex items-center gap-2">
                <Status color="red">Disconnected</Status>
              </div>
            </div>
          </div>

          {/* ColorSample */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">ColorSample Swatches</div>
            <div className="flex items-center gap-3">
              <ColorSample colorName="green" />
              <ColorSample colorName="blue" />
              <ColorSample colorName="amber" />
              <ColorSample colorName="red" />
              <ColorSample colorName="purple" />
            </div>
          </div>

          {/* NotificationCounter */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Notification Counter</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span>Critical:</span>
                <NotificationCounter count={3} variant="primary" />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>Alerts:</span>
                <NotificationCounter count={14} variant="secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
