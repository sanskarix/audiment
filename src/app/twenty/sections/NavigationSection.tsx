'use client';

import * as React from 'react';
import {
  Tabs,
  Breadcrumb,
  TabButton,
  ListItemButton,
  MenuItem,
  IconCompass,
  IconBuildingSkyscraper,
  IconCheck,
  IconFileText,
  IconUser,
  IconSettings,
  IconSparkles,
} from '@/components/twenty';

export function NavigationSection() {
  const [activeTabButton, setActiveTabButton] = React.useState('overview');
  const [selectedListItem, setSelectedListItem] = React.useState('item-1');

  return (
    <div id="navigation" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconCompass size={15} /> Category 6
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Navigation, Tabs, Menus and Links
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compound tab views with badges, breadcrumbs, standalone tab buttons, interactive list items, and rich menu entries.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          5 components
        </span>
      </div>

      {/* 1. Breadcrumbs */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Hierarchical Breadcrumbs (`Breadcrumb`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Semantic breadcrumb navigation with links and accessible separators for deep multi-location audit trails.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
          <Breadcrumb
            links={[
              { children: 'Enterprise Dashboard', href: '#dashboard' },
              { children: 'Stores & Facilities', href: '#stores' },
              { children: 'DLF CyberHub Store #104', href: '#cyberhub' },
              { children: 'FSSAI Hygiene Inspection #8821' },
            ]}
          />
        </div>
      </div>

      {/* 2. Compound Tabs */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Compound Tab Panels (`Tabs`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compound tab container with start icons, badge counts, and synchronized panel switching.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
          <Tabs.Root defaultValue="checklist">
            <Tabs.List className="border-b border-slate-200 dark:border-slate-800 pb-2 flex gap-2">
              <Tabs.Tab
                value="checklist"
                startIcon={<IconFileText size={14} />}
                badge="18"
              >
                Inspection Checklist
              </Tabs.Tab>
              <Tabs.Tab
                value="violations"
                startIcon={<IconBuildingSkyscraper size={14} />}
                badge="3"
                highlighted
              >
                Violations & CAPA
              </Tabs.Tab>
              <Tabs.Tab
                value="auditor"
                startIcon={<IconUser size={14} />}
              >
                Auditor & Geo-Stamp
              </Tabs.Tab>
              <Tabs.Tab
                value="settings"
                startIcon={<IconSettings size={14} />}
              >
                Template Config
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="checklist" className="pt-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-1.5">
                <div className="font-medium text-slate-800 dark:text-slate-200">
                  Active Checklist: Food Safety Standard Walkthrough (18 Criteria)
                </div>
                <p>15 items verified compliant · 3 items pending temperature verification · Score: 83.3%</p>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="violations" className="pt-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-1.5">
                <div className="font-medium text-amber-700 dark:text-amber-400">
                  Corrective Actions Required (3 open items)
                </div>
                <p>#1 Refrigerator temp 9.2°C · #2 Sanitizer dispenser empty · #3 Pest trap missing sticker</p>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="auditor" className="pt-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-1.5">
                <div className="font-medium text-slate-800 dark:text-slate-200">Auditor Metadata</div>
                <p>Inspected by: Priya Sharma (Senior Food Safety Lead) · Geo-verified at 28.4952° N, 77.0891° E</p>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="settings" className="pt-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-1.5">
                <div className="font-medium text-slate-800 dark:text-slate-200">Template Specifications</div>
                <p>Template ID: FSSAI-REST-V4.2 · Strict scoring enabled · Negative weighting applied</p>
              </div>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      </div>

      {/* 3. Standalone TabButton & ListItemButton */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Tab Buttons & List Item Buttons (`TabButton`, `ListItemButton`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive buttons with selection states, description lines, notification pills, and shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* TabButtons */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Standalone TabButtons</div>
            <div className="flex flex-wrap items-center gap-2">
              <TabButton
                active={activeTabButton === 'overview'}
                onClick={() => setActiveTabButton('overview')}
                startIcon={<IconBuildingSkyscraper size={14} />}
              >
                Store Overview
              </TabButton>
              <TabButton
                active={activeTabButton === 'audits'}
                onClick={() => setActiveTabButton('audits')}
                badge="12"
              >
                Recent Audits
              </TabButton>
              <TabButton
                active={activeTabButton === 'alerts'}
                onClick={() => setActiveTabButton('alerts')}
                badge="2"
              >
                Alerts
              </TabButton>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Active tab: <strong className="text-slate-700 dark:text-slate-200 uppercase">{activeTabButton}</strong>
            </span>
          </div>

          {/* ListItemButtons */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Interactive ListItemButtons</div>
            <div className="space-y-1">
              <ListItemButton
                selected={selectedListItem === 'item-1'}
                onClick={() => setSelectedListItem('item-1')}
                description="DLF CyberHub · Score 94% · Passed"
                startIcon={<IconCheck size={14} className="text-emerald-500" />}
                shortcut={['⌘', '1']}
              >
                Store #104 Inspection
              </ListItemButton>

              <ListItemButton
                selected={selectedListItem === 'item-2'}
                onClick={() => setSelectedListItem('item-2')}
                description="Aerocity Outlet · Score 76% · 2 Critical"
                startIcon={<IconSparkles size={14} className="text-amber-500" />}
                shortcut={['⌘', '2']}
              >
                Store #108 Inspection
              </ListItemButton>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MenuItem */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Rich Menu Items (`MenuItem`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Composable menu items with icon containers, contextual badges, shortcuts, and focus indicators.
          </p>
        </div>

        <div className="max-w-md p-2 rounded-lg border bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <MenuItem
            text="Assign Inspection Auditor"
            LeftIcon={IconUser}
            contextualText="Senior"
            shortcut={['⌘', 'A']}
          />
          <MenuItem
            text="Download Audit Report (PDF)"
            LeftIcon={IconFileText}
            shortcut={['⌘', 'D']}
          />
          <MenuItem
            text="Audit Template Settings"
            LeftIcon={IconSettings}
            contextualText="Admin"
          />
        </div>
      </div>
    </div>
  );
}
