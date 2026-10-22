'use client';

import * as React from 'react';
import {
  Button,
  Input,
  Dropdown,
  Select,
  Tag,
  Avatar,
  Card,
  Shortcut,
  IconTable,
  IconFilter,
  IconLayoutKanban,
  IconLayoutSidebarRight,
  IconHistory,
  IconSearch,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconChevronRight,
  IconShield,
  IconClock,
  IconUser,
  IconEye,
  IconFileText,
  IconArrowRight,
  IconDownload,
} from '@/components/twenty';

export function AudimentAlternativesSection() {
  // 1. Table filter & sorting state
  const [tableSearch, setTableSearch] = React.useState('');
  const [selectedAuditRow, setSelectedAuditRow] = React.useState<string | null>('AUD-NCR-01');

  // 2. Filter Popover state
  const [filterRegion, setFilterRegion] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterMinScore, setFilterMinScore] = React.useState(0);

  // 3. Kanban state
  const [kanbanTasks, setKanbanTasks] = React.useState([
    { id: 'CA-101', title: 'Deep freezer temperature high (-12°C vs -18°C)', store: 'Store #104 CP', stage: 'open', severity: 'red' as const },
    { id: 'CA-102', title: 'Pest control log missing June endorsement', store: 'Store #101 BKC', stage: 'in-progress', severity: 'yellow' as const },
    { id: 'CA-103', title: 'Food contact surface sanitization validated', store: 'Store #102 Koramangala', stage: 'closed', severity: 'green' as const },
  ]);

  const moveKanbanTask = (id: string, newStage: string) => {
    setKanbanTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, stage: newStage } : t))
    );
  };

  // 4. Side Peek Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // 5. Command Palette state
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [cmdSearch, setCmdSearch] = React.useState('');

  // Sample Audit Data
  const auditRecords = [
    { id: 'AUD-NCR-01', store: 'Store #104 - Connaught Place', template: 'FSSAI Food Hygiene v4', score: 94, status: 'Passed', date: 'Oct 12, 2026', auditor: 'Amit S.' },
    { id: 'AUD-BLR-02', store: 'Store #102 - Koramangala Hub', template: 'QSR Daily Operations', score: 78, status: 'Action Required', date: 'Oct 11, 2026', auditor: 'Priya M.' },
    { id: 'AUD-MUM-03', store: 'Store #101 - Mumbai BKC Outlet', template: 'Cold Chain Compliance', score: 98, status: 'Passed', date: 'Oct 10, 2026', auditor: 'Rohan V.' },
    { id: 'AUD-HYD-04', store: 'Store #105 - Hitec City Kitchen', template: 'Equipment Safety Audit', score: 62, status: 'Critical', date: 'Oct 09, 2026', auditor: 'Kavita D.' },
  ];

  const filteredRecords = auditRecords.filter((r) =>
    r.store.toLowerCase().includes(tableSearch.toLowerCase()) ||
    r.id.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div id="agpl-alternatives" className="scroll-mt-24 space-y-10">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <IconShield size={15} /> Legal Boundary & Architectural Protection
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            High-Risk AGPL Patterns vs. Audiment Safe Alternatives
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            In Twenty CRM, these 6 composite patterns live in <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">twenty-front</code> under <strong>AGPL-3.0</strong>. Copying them directly into Audiment would trigger copyleft obligations. Below, each pattern is matched with <strong>Audiment&apos;s safe proprietary implementation</strong> built using our code and clean <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">twenty-ui</code> MIT primitives.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-medium">
          6 Live Alternatives
        </span>
      </div>

      {/* 1. Data Table / Spreadsheet Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <IconTable size={16} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                1. Audit Records Table Engine
              </h3>
              <p className="text-[11px] text-slate-500">
                For inspecting store audits, checklist results, and scores.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ Twenty AGPL: <code className="font-mono">twenty-front</code> grid engine
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              🛡️ Audiment: MIT Safe Custom Table
            </span>
          </div>
        </div>

        {/* Live Alternative Preview */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <Input
                size="sm"
                placeholder="Search audit records or stores..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing {filteredRecords.length} audit records
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Audit ID</th>
                  <th className="py-2.5 px-3">Store Location</th>
                  <th className="py-2.5 px-3">Template</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Auditor</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[12px]">
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedAuditRow(r.id)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                      selectedAuditRow === r.id ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">
                      {r.id}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {r.store}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {r.template}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span className={r.score >= 90 ? 'text-emerald-600' : r.score >= 75 ? 'text-amber-600' : 'text-red-600'}>
                        {r.score}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <Tag color={r.status === 'Passed' ? 'green' : r.status === 'Critical' ? 'red' : 'yellow'}>
                        {r.status}
                      </Tag>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {r.auditor}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAuditRow(r.id);
                          setIsDrawerOpen(true);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Filter Builder Popover */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <IconFilter size={16} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                2. Audit Criteria Filter Popover
              </h3>
              <p className="text-[11px] text-slate-500">
                For multi-rule audit filtering (*Where Status = Overdue AND Store = CP*).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ Twenty AGPL: <code className="font-mono">twenty-front</code> query builder
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              🛡️ Audiment: Clean Dropdown/Select Filter
            </span>
          </div>
        </div>

        {/* Live Filter Bar Alternative */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Active Filters:</div>

            {/* Region Dropdown */}
            <Dropdown.Root type="menu">
              <Dropdown.Trigger
                render={
                  <Button variant="outline" size="sm" startIcon={<IconFilter size={13} />}>
                    Region: {filterRegion === 'all' ? 'All Regions' : filterRegion}
                  </Button>
                }
              />
              <Dropdown.Content className="z-50 min-w-[180px] rounded-lg border bg-white dark:bg-slate-900 p-1.5 shadow-xl text-xs">
                <Dropdown.ActionItem onClick={() => setFilterRegion('all')}>All Regions</Dropdown.ActionItem>
                <Dropdown.ActionItem onClick={() => setFilterRegion('North NCR')}>North NCR</Dropdown.ActionItem>
                <Dropdown.ActionItem onClick={() => setFilterRegion('South Bangalore')}>South Bangalore</Dropdown.ActionItem>
                <Dropdown.ActionItem onClick={() => setFilterRegion('West Mumbai')}>West Mumbai</Dropdown.ActionItem>
              </Dropdown.Content>
            </Dropdown.Root>

            {/* Status Dropdown */}
            <Dropdown.Root type="menu">
              <Dropdown.Trigger
                render={
                  <Button variant="outline" size="sm">
                    Status: {filterStatus === 'all' ? 'All Statuses' : filterStatus}
                  </Button>
                }
              />
              <Dropdown.Content className="z-50 min-w-[180px] rounded-lg border bg-white dark:bg-slate-900 p-1.5 shadow-xl text-xs">
                <Dropdown.ActionItem onClick={() => setFilterStatus('all')}>All Statuses</Dropdown.ActionItem>
                <Dropdown.ActionItem onClick={() => setFilterStatus('Passed')}>Passed (90%+)</Dropdown.ActionItem>
                <Dropdown.ActionItem onClick={() => setFilterStatus('Action Required')}>Action Required</Dropdown.ActionItem>
                <Dropdown.ActionItem onClick={() => setFilterStatus('Critical')}>Critical Violations</Dropdown.ActionItem>
              </Dropdown.Content>
            </Dropdown.Root>

            {(filterRegion !== 'all' || filterStatus !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterRegion('all');
                  setFilterStatus('all');
                }}
                startIcon={<IconX size={12} />}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <IconCheck size={13} className="text-emerald-500" />
            Filtered query state managed safely in Audiment without AGPL view-state serialization.
          </div>
        </div>
      </div>

      {/* 3. Corrective Action Kanban Board */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <IconLayoutKanban size={16} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                3. Corrective Action Stage Pipeline
              </h3>
              <p className="text-[11px] text-slate-500">
                For tracking corrective actions across lifecycle stages (*Identified → In Progress → Closed*).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ Twenty AGPL: <code className="font-mono">twenty-front</code> Kanban board
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              🛡️ Audiment: Proprietary Action Board
            </span>
          </div>
        </div>

        {/* Live Kanban Alternative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Column 1: Open / Identified */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                1. Open Identified
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold">
                {kanbanTasks.filter((t) => t.stage === 'open').length}
              </span>
            </div>
            <div className="space-y-2">
              {kanbanTasks
                .filter((t) => t.stage === 'open')
                .map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{task.id}</span>
                      <Tag color="red">Critical</Tag>
                    </div>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">{task.store}</span>
                      <Button
                        size="sm"
                        variant="soft"
                        color="accent"
                        onClick={() => moveKanbanTask(task.id, 'in-progress')}
                      >
                        Start Fix →
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                2. In Progress / Evidence
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                {kanbanTasks.filter((t) => t.stage === 'in-progress').length}
              </span>
            </div>
            <div className="space-y-2">
              {kanbanTasks
                .filter((t) => t.stage === 'in-progress')
                .map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{task.id}</span>
                      <Tag color="yellow">Under Review</Tag>
                    </div>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">{task.store}</span>
                      <Button
                        size="sm"
                        variant="solid"
                        color="accent"
                        onClick={() => moveKanbanTask(task.id, 'closed')}
                      >
                        Approve & Close
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 3: Closed / Resolved */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                3. Resolved & Closed
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {kanbanTasks.filter((t) => t.stage === 'closed').length}
              </span>
            </div>
            <div className="space-y-2">
              {kanbanTasks
                .filter((t) => t.stage === 'closed')
                .map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{task.id}</span>
                      <Tag color="green">Resolved</Tag>
                    </div>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 line-through text-slate-400">{task.title}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">{task.store}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveKanbanTask(task.id, 'open')}
                      >
                        Re-open
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Side Peek / Slide-Over Detail Drawer */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <IconLayoutSidebarRight size={16} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                4. Inspection Slide-Over Detail Drawer
              </h3>
              <p className="text-[11px] text-slate-500">
                For inspecting audit checklist answers and photo proof without navigating away.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ Twenty AGPL: <code className="font-mono">twenty-front</code> record peek
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              🛡️ Audiment: Clean Drawer Wrapper
            </span>
          </div>
        </div>

        {/* Live Drawer Trigger & Simulated Drawer */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
              Store Inspection Deep Dive Viewer
            </div>
            <p className="text-[11px] text-slate-500">
              Click trigger to open slide-over inspection findings panel for {selectedAuditRow}.
            </p>
          </div>
          <Button
            variant="solid"
            color="accent"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            startIcon={<IconEye size={14} />}
          >
            Open Audit Drawer
          </Button>
        </div>

        {/* Slide-over Drawer Modal */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                      INSPECTION DOSSIER
                    </span>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Store #104 - Connaught Place
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <IconX size={18} />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border space-y-1">
                    <div className="text-slate-500 text-[11px]">Audit Protocol</div>
                    <div className="font-medium">FSSAI Food Hygiene Schedule 4 Audit</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border space-y-1">
                    <div className="text-slate-500 text-[11px]">Auditor Notes</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Raw food storage temperature logged at -19°C. Hand hygiene stations fully stocked with antimicrobial wash. Verified by Inspector Amit S.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border space-y-1">
                    <div className="text-slate-500 text-[11px]">Photo Evidence</div>
                    <div className="h-28 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-mono text-[11px]">
                      [Geo-tagged Photo Proof Verified]
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
                  Close Drawer
                </Button>
                <Button variant="solid" color="accent" size="sm" onClick={() => setIsDrawerOpen(false)}>
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Activity Timeline & Resolution Feed */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <IconHistory size={16} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                5. Corrective Action Resolution Timeline Feed
              </h3>
              <p className="text-[11px] text-slate-500">
                For chronologically tracking violation logs, photo uploads, and manager approvals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ Twenty AGPL: <code className="font-mono">twenty-front</code> activity feed
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              🛡️ Audiment: Clean Vertical Timeline
            </span>
          </div>
        </div>

        {/* Live Timeline Alternative */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {/* Event 1 */}
            <div className="relative space-y-1">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Violation Flagged by Auditor</span>
                <span className="text-[11px] text-slate-400 font-mono">10:14 AM</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Freezer temperature measured at -12°C, violating minimum threshold (-18°C).
              </p>
            </div>

            {/* Event 2 */}
            <div className="relative space-y-1">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Store Manager Uploaded Corrective Proof</span>
                <span className="text-[11px] text-slate-400 font-mono">11:30 AM</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Compressor filter cleaned and thermostat recalibrated to -20°C. Digital thermometer photo attached.
              </p>
            </div>

            {/* Event 3 */}
            <div className="relative space-y-1">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100">QA Director Approved & Closed</span>
                <span className="text-[11px] text-slate-400 font-mono">12:05 PM</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Evidence verified compliant with FSSAI regulations. Corrective action marked resolved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Global Command Palette (`Cmd+K`) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <IconSearch size={16} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                6. Global Command Palette (`Cmd+K`)
              </h3>
              <p className="text-[11px] text-slate-500">
                For fast keyboard navigation across stores, audit checklists, and locations.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ Twenty AGPL: <code className="font-mono">twenty-front</code> search palette
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              🛡️ Audiment: Clean Shortcut + Modal
            </span>
          </div>
        </div>

        {/* Live Command Palette Trigger */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">Quick Navigation Trigger:</span>
            <Shortcut shortcut={['⌘', 'K']} />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCommandOpen(true)}
            startIcon={<IconSearch size={13} />}
          >
            Open Command Palette
          </Button>
        </div>

        {/* Command Palette Modal */}
        {isCommandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <IconSearch size={16} className="text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search stores, templates, or audits..."
                  value={cmdSearch}
                  onChange={(e) => setCmdSearch(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsCommandOpen(false)}
                  className="text-xs px-1.5 py-0.5 rounded border text-slate-400"
                >
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-1 px-2 text-[10px] font-semibold text-slate-400 uppercase">
                  Suggested Audiment Actions
                </div>
                <div
                  onClick={() => setIsCommandOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium">Go to Store #104 - Connaught Place</span>
                  <span className="text-[11px] text-slate-400">Store</span>
                </div>
                <div
                  onClick={() => setIsCommandOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium">Start New FSSAI Food Hygiene Audit</span>
                  <span className="text-[11px] text-slate-400">Action</span>
                </div>
                <div
                  onClick={() => setIsCommandOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium">Review Critical Corrective Action CA-101</span>
                  <span className="text-[11px] text-slate-400">Violation</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
