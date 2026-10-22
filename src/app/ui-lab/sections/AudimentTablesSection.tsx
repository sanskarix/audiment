'use client';

import * as React from 'react';
import {
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';
import {
  UniversalTable,
  UniversalTableHeader,
  UniversalTableBody,
  UniversalTableRow,
  UniversalTableHead,
  UniversalTableCell,
  UniversalBadge,
  UniversalButton,
} from '@/components/universal';

export function AudimentTablesSection() {
  const auditRows = [
    {
      id: 'AUD-9021',
      title: 'Store #104 — Cold Chain & Fresh Hygiene',
      location: 'Connaught Place, New Delhi',
      score: '96%',
      status: 'completed' as const,
      auditor: 'Rajesh Sharma',
      date: 'Today, 11:30 AM',
    },
    {
      id: 'AUD-9022',
      title: 'Store #208 — Fire Safety & Electrical Audit',
      location: 'Indiranagar, Bangalore',
      score: '78%',
      status: 'inProgress' as const,
      auditor: 'Priya Patel',
      date: 'Today, 09:15 AM',
    },
    {
      id: 'AUD-9023',
      title: 'Store #315 — QSR Operational Compliance',
      location: 'Bandra West, Mumbai',
      score: '62%',
      status: 'assigned' as const,
      auditor: 'Anand Verma',
      date: 'Yesterday',
    },
  ];

  return (
    <div id="tables" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <TableIcon size={15} /> Category 6
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Data Tables & Grids
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal data table consolidated from decisions: Standard Entity Grid, merged Report Table, and merged Users Table.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          UniversalTable
        </span>
      </div>

      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                Live Audit Ledger Table
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                VAR-TBL-STANDARD (Consolidated)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unified row layout with zebra hover, status badges, and inline actions.
            </p>
          </div>
        </div>

        <UniversalTable>
          <UniversalTableHeader>
            <UniversalTableRow>
              <UniversalTableHead className="w-28">Audit ID</UniversalTableHead>
              <UniversalTableHead>Inspection & Location</UniversalTableHead>
              <UniversalTableHead>Score</UniversalTableHead>
              <UniversalTableHead>Status</UniversalTableHead>
              <UniversalTableHead>Lead Auditor</UniversalTableHead>
              <UniversalTableHead className="text-right">Actions</UniversalTableHead>
            </UniversalTableRow>
          </UniversalTableHeader>
          <UniversalTableBody>
            {auditRows.map((row) => (
              <UniversalTableRow key={row.id}>
                <UniversalTableCell className="font-mono text-[11px] font-medium text-primary">
                  {row.id}
                </UniversalTableCell>
                <UniversalTableCell>
                  <div className="font-medium text-foreground">{row.title}</div>
                  <div className="text-[11px] text-muted-foreground">{row.location}</div>
                </UniversalTableCell>
                <UniversalTableCell>
                  <span className="font-semibold tabular-nums text-foreground">{row.score}</span>
                </UniversalTableCell>
                <UniversalTableCell>
                  <UniversalBadge variant={row.status} size="sm">
                    {row.status === 'completed'
                      ? 'Completed'
                      : row.status === 'inProgress'
                      ? 'In Progress'
                      : 'Assigned'}
                  </UniversalBadge>
                </UniversalTableCell>
                <UniversalTableCell>
                  <div className="text-foreground">{row.auditor}</div>
                  <div className="text-[10px] text-muted-foreground">{row.date}</div>
                </UniversalTableCell>
                <UniversalTableCell className="text-right">
                  <UniversalButton variant="ghost" size="icon-sm">
                    <ExternalLink size={13} />
                  </UniversalButton>
                </UniversalTableCell>
              </UniversalTableRow>
            ))}
          </UniversalTableBody>
        </UniversalTable>
      </div>
    </div>
  );
}
