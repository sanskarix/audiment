'use client';

import * as React from 'react';
import {
  ListItem,
  OverflowingList,
  MetricRow,
  JsonTree,
  CommandBlock,
  TintedIconTile,
  Chip,
  IconTable,
  IconCheck,
  IconAlertTriangle,
  IconShield,
  IconGauge,
  IconLock,
  IconSparkles,
  IconInfoCircle,
} from '@/components/twenty';

const AUDIT_JSON_PAYLOAD = {
  auditId: 'AUD-NCR-2026-10-8841',
  template: 'FSSAI Food Safety & Cleanliness v4.2',
  facility: {
    id: 'STORE-104',
    name: 'DLF CyberHub Store #104',
    region: 'Delhi NCR',
    geoCoordinates: { lat: 28.4952, lng: 77.0891 },
  },
  scores: {
    overall: 94.2,
    hygiene: 96.0,
    equipmentSafety: 91.5,
    coldStorage: 95.0,
  },
  findings: [
    { code: 'CRIT-01', severity: 'low', item: 'Secondary thermometer recalibration due in 3 days' },
  ],
  status: 'passed',
  auditor: {
    id: 'USR-291',
    name: 'Priya Sharma',
    license: 'ISO-22000-LEAD-AUDITOR',
  },
};

export function DataDisplaySection() {
  return (
    <div id="data-display" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconTable size={15} /> Category 7
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Tables, Lists and Data Display
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Progress metrics, interactive JSON inspectors, overflowing list counters, tinted category badges, and structured checklist items.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          6 components
        </span>
      </div>

      {/* Licensing & Architecture Notice */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <IconInfoCircle size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold">Licensing & Architecture Note on Tables</div>
          <p className="text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
            Twenty&apos;s full CRM grid/table engine lives in the AGPL-licensed <code className="font-mono bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded">twenty-front</code> application and is intentionally excluded to preserve Audiment&apos;s commercial SaaS safety. The verified MIT package provides list primitives (`ListItem`, `MetricRow`, `OverflowingList`), which Audiment pairs with native lightweight HTML tables and tokens below.
          </p>
        </div>
      </div>

      {/* 1. MetricRow */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Audit Metric Progress Rows (`MetricRow`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key metric performance rows with built-in progress bars, value indicators, and start icons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <MetricRow
              startIcon={<IconShield size={16} className="text-emerald-500" />}
              value="96.2%"
              progress={96}
              progressColor="#10b981"
            >
              Food Safety Compliance
            </MetricRow>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <MetricRow
              startIcon={<IconGauge size={16} className="text-blue-500" />}
              value="91.5%"
              progress={91}
              progressColor="#3b82f6"
            >
              Cold Storage Temperature
            </MetricRow>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <MetricRow
              startIcon={<IconAlertTriangle size={16} className="text-amber-500" />}
              value="18 / 20"
              progress={90}
              progressColor="#f59e0b"
            >
              CAPA Resolved on Time
            </MetricRow>
          </div>
        </div>
      </div>

      {/* 2. ListItem & OverflowingList */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Checklist List Items & Overflowing Tags (`ListItem`, `OverflowingList`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rich list items with descriptions and indicators, alongside automatic horizontal tag collapse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* ListItems */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Structured Checklist Items</div>
            <div className="space-y-1.5">
              <ListItem
                startIcon={<IconCheck size={15} className="text-emerald-500" />}
                description="Cold chain maintained at 3.2°C (Protocol #FSSAI-04)"
              >
                Deep Freezer Temperature Log
              </ListItem>
              <ListItem
                startIcon={<IconCheck size={15} className="text-emerald-500" />}
                description="Pest control certificate renewed on Oct 4, 2026"
              >
                Pest & Rodent Exclusion Audit
              </ListItem>
              <ListItem
                startIcon={<IconAlertTriangle size={15} className="text-amber-500" />}
                description="Minor grease accumulation behind exhaust grill #2"
              >
                Kitchen Ventilation Exhaust Cleaning
              </ListItem>
            </div>
          </div>

          {/* OverflowingList */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">
              OverflowingList (Max 3 Inline Tags)
            </div>
            <p className="text-xs text-slate-500">
              Tags that exceed `maxInlineCount={3}` automatically collapse into a badge.
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border">
              <OverflowingList maxInlineCount={3}>
                <Chip size="sm">FSSAI Hygiene</Chip>
                <Chip size="sm">Cold Chain</Chip>
                <Chip size="sm">Fire Safety</Chip>
                <Chip size="sm">Staff Uniforms</Chip>
                <Chip size="sm">Pest Control</Chip>
                <Chip size="sm">Cash Reconciliation</Chip>
              </OverflowingList>
            </div>
          </div>
        </div>
      </div>

      {/* 3. JsonTree & CommandBlock */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Interactive JSON Inspector & Command Snippet (`JsonTree`, `CommandBlock`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Collapsible JSON tree viewer for inspection payloads and CLI automation command block.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* JsonTree */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Audit Payload Inspector</div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border font-mono text-xs overflow-auto max-h-56">
              <JsonTree
                value={AUDIT_JSON_PAYLOAD}
                emptyStringLabel="empty string"
                emptyArrayLabel="empty array"
                emptyObjectLabel="empty object"
                arrowButtonCollapsedLabel="Expand node"
                arrowButtonExpandedLabel="Collapse node"
              />
            </div>
          </div>

          {/* CommandBlock & TintedIconTile */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1.5">CLI Command Block</div>
              <CommandBlock
                commands={[
                  'npx @audiment/cli audit run --store-id=104 --standard=fssai',
                  'audiment sync --auto-escalate',
                ]}
              />
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-400 mb-2">TintedIconTile Primitives</div>
              <div className="flex items-center gap-3">
                <TintedIconTile
                  icon={<IconShield size={16} />}
                  color="green"
                />
                <TintedIconTile
                  icon={<IconGauge size={16} />}
                  color="blue"
                />
                <TintedIconTile
                  icon={<IconAlertTriangle size={16} />}
                  color="amber"
                />
                <TintedIconTile
                  icon={<IconLock size={16} />}
                  color="red"
                />
                <TintedIconTile
                  icon={<IconSparkles size={16} />}
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Structured Audiment Data Table Preview */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Audiment Inspection Log Table (Rendered with 14px Scale)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-world inspection log table styled with Twenty UI design tokens and typography.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Inspection ID</th>
                <th className="px-4 py-3">Store Location</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">Auditor</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">AUD-NCR-8841</td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">DLF CyberHub #104</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">FSSAI Hygiene v4</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Priya Sharma</td>
                <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">96.2%</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <IconCheck size={11} /> Passed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">AUD-NCR-8840</td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">Aerocity Flagship</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cold Chain Audit</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rohit Verma</td>
                <td className="px-4 py-3 font-medium text-amber-600 dark:text-amber-400">76.0%</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <IconAlertTriangle size={11} /> Flagged
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">AUD-NCR-8839</td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">Khan Market Outlet</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fire & Emergency SOP</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Anita Desai</td>
                <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">99.0%</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <IconCheck size={11} /> Passed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
