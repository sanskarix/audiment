'use client';

import * as React from 'react';
import {
  Popover,
  Tooltip,
  Menu,
  Button,
  IconButton,
  IconMessageCircle,
  IconInfoCircle,
  IconFilter,
  IconDownload,
  IconShare,
  IconCheck,
  IconDotsVertical,
  IconShield,
} from '@/components/twenty';

export function PopoversSection() {
  const [menuAction, setMenuAction] = React.useState<string | null>(null);

  return (
    <div id="popovers" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconMessageCircle size={15} /> Category 10
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Popovers and Tooltips
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Contextual floating surfaces: interactive filter popovers, accessible micro-tooltips, and multi-level context action menus.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          3 components
        </span>
      </div>

      {/* 1. Popover Component */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Floating Popover (`Popover`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive anchored card popup supporting embedded inputs, filters, action triggers, and close buttons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <Popover.Root>
            <Popover.Trigger render={<Button variant="outline" startIcon={<IconFilter size={14} />}>Audit Quick Filter Popover</Button>} />
            <Popover.Portal>
              <Popover.Positioner side="bottom" align="start" sideOffset={8}>
                <Popover.Popup className="z-50 w-72 rounded-xl border bg-white dark:bg-slate-900 p-4 shadow-xl text-slate-900 dark:text-slate-100 space-y-3">
                  <div className="flex items-start justify-between border-b pb-2">
                    <div>
                      <Popover.Title className="text-xs font-medium">Filter Store Records</Popover.Title>
                      <Popover.Description className="text-[11px] text-slate-500">
                        Select date window & score thresholds
                      </Popover.Description>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                      <span>Passed Audits (&gt; 90%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                      <span>Flagged Violations</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded accent-blue-600" />
                      <span>Unassigned Stores</span>
                    </label>
                  </div>

                  <div className="flex justify-end pt-2 border-t">
                    <Popover.Close render={<Button size="sm" variant="solid" color="accent">Apply Filter</Button>} />
                  </div>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {/* 2. Tooltip Primitives */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Hover Tooltips (`Tooltip`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lightweight, high-performance tooltips with automatic positioning, collision avoidance, and delay timing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Tooltip content="Audits conform to ISO-22000 Food Safety Standard" side="top">
            <Button variant="outline" size="sm" startIcon={<IconShield size={14} className="text-emerald-500" />}>
              Hover for Standard Info
            </Button>
          </Tooltip>

          <IconButton
            size="md"
            aria-label="Download inspection log"
            tooltip="Instantly download complete inspection log as signed PDF"
          >
            <IconDownload size={15} />
          </IconButton>

          <IconButton
            size="md"
            aria-label="Share audit report link"
            tooltip="Share audit report link with regional store manager"
          >
            <IconShare size={15} />
          </IconButton>

          <Tooltip content="Geo-verified inspection coordinates: 28.4952° N, 77.0891° E" side="bottom">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 cursor-help">
              <IconInfoCircle size={13} /> Geo-Stamp
            </span>
          </Tooltip>
        </div>
      </div>

      {/* 3. Base UI Menu Surface */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Action Context Menu (`Menu`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Headless Base-UI Menu popup with option groups, action items, and keyboard accessibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <Menu.Root>
            <Menu.Trigger render={<Button variant="outline" endIcon={<IconDotsVertical size={14} />}>Store Row Context Menu</Button>} />
            <Menu.Popup className="z-50 min-w-[200px] rounded-lg border bg-white dark:bg-slate-900 p-1.5 shadow-xl text-xs space-y-1">
              <Menu.Group>
                <Menu.GroupLabel className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                  Inspection Actions
                </Menu.GroupLabel>
                <Menu.Item
                  className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMenuAction('View Store History')}
                >
                  View Historical Audits
                </Menu.Item>
                <Menu.Item
                  className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMenuAction('Schedule Re-Audit')}
                >
                  Schedule Re-Audit
                </Menu.Item>
              </Menu.Group>
              <Menu.Separator className="my-1 border-t border-slate-200 dark:border-slate-800" />
              <Menu.Group>
                <Menu.Item
                  className="px-2 py-1.5 rounded cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={() => setMenuAction('Deactivate Store')}
                >
                  Deactivate Store
                </Menu.Item>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Root>

          {menuAction && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <IconCheck size={14} /> Triggered menu action: &quot;{menuAction}&quot;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
