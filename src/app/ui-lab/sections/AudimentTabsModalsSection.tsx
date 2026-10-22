'use client';

import * as React from 'react';
import { Columns, Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import {
  UniversalTabs,
  UniversalModal,
  UniversalButton,
} from '@/components/universal';

export function AudimentTabsModalsSection() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const tabItems = [
    { id: 'all', label: 'All Audits', count: 148 },
    { id: 'pending', label: 'Pending Review', count: 12 },
    { id: 'completed', label: 'Completed', count: 136 },
    { id: 'flagged', label: 'Critical Non-Compliance', count: 3 },
  ];

  return (
    <div id="tabs-modals" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Columns size={15} /> Category 8
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Navigation Tabs & Overlay Modals
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal underline tabs (merging segment pills) and universal modal dialogs (merging confirmation alerts and sheets).
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          UniversalTabs & UniversalModal
        </span>
      </div>

      {/* 1. Universal Underline Tabs */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">
              Navigation Tab Strip (`UniversalTabs`)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Merged VAR-NAV-SEGMENT-PILL → VAR-NAV-UNDERLINE-TAB
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Single unified tab component with active underline indicators and count tags.
          </p>
        </div>

        <div className="pt-1">
          <UniversalTabs
            items={tabItems}
            activeId={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* 2. Universal Modals & Overlays */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">
              Modal Dialogs (`UniversalModal`)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Merged VAR-MOD-ALERT & VAR-MOD-SHEET → VAR-MOD-MODAL
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unified modal with backdrop blur, keyboard escape dismissal, and configurable action footers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <UniversalButton variant="outline" onClick={() => setIsModalOpen(true)}>
            <Eye size={14} />
            <span>Open Audit Details Modal</span>
          </UniversalButton>

          <UniversalButton variant="destructive" onClick={() => setIsAlertOpen(true)}>
            <AlertTriangle size={14} />
            <span>Trigger Confirmation Alert Dialog</span>
          </UniversalButton>
        </div>

        {/* Standard Modal Demo */}
        <UniversalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Inspection Checklist Review"
          description="Store #1042 — Cold Storage Temperature Protocol"
          footer={
            <>
              <UniversalButton variant="outline" onClick={() => setIsModalOpen(false)}>
                Dismiss
              </UniversalButton>
              <UniversalButton variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm Verification
              </UniversalButton>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Reviewing logged temperature variance readings between 08:00 AM and 12:00 PM. All logged readings remained within the safe threshold of 2°C to 4°C.
            </p>
            <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs">
              <strong>Timestamp:</strong> 2026-10-13 11:42 AM IST · Verified by Rajesh S.
            </div>
          </div>
        </UniversalModal>

        {/* Alert Dialog Demo (Merged into UniversalModal) */}
        <UniversalModal
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          title="Are you absolutely sure?"
          description="This action cannot be undone."
          maxWidth="sm"
          footer={
            <>
              <UniversalButton variant="outline" onClick={() => setIsAlertOpen(false)}>
                Cancel
              </UniversalButton>
              <UniversalButton variant="destructive" onClick={() => setIsAlertOpen(false)}>
                Confirm Rejection
              </UniversalButton>
            </>
          }
        >
          <p className="text-xs text-muted-foreground">
            Rejecting this audit report will flag the facility for an unscheduled re-inspection and notify the regional operations director immediately.
          </p>
        </UniversalModal>
      </div>
    </div>
  );
}
