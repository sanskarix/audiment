'use client';

import * as React from 'react';
import {
  useToast,
  Banner,
  InlineBanner,
  Callout,
  Button,
  IconBell,
  IconCheck,
  IconAlertTriangle,
} from '@/components/twenty';

export function FeedbackSection() {
  const { enqueueToast } = useToast();

  const fireSuccessToast = () => {
    enqueueToast({
      children: 'Audit Inspection Submitted',
      description: 'Store #104 (DLF CyberHub) passed with a compliance score of 96.2%.',
      duration: 4000,
    });
  };

  const fireCriticalToast = () => {
    enqueueToast({
      children: 'Critical Non-Conformance Flagged',
      description: 'Immediate remediation ticket #CAPA-91 issued to regional facility manager.',
      duration: 5000,
    });
  };

  return (
    <div id="feedback" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconBell size={15} /> Category 11
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Notifications, Toasts, Banners and Feedback
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global toast notifications, prominent system banners, inline panels, and structured callouts for auditor alerts.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          4 components
        </span>
      </div>

      {/* 1. Global Toast Notifications */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Interactive Toast Notifications (`useToast`, `Toaster`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fires non-blocking floating notifications with custom titles, descriptions, and duration control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            variant="solid"
            color="accent"
            onClick={fireSuccessToast}
            startIcon={<IconCheck size={14} />}
          >
            Fire Compliance Toast
          </Button>

          <Button
            variant="outline"
            color="danger"
            onClick={fireCriticalToast}
            startIcon={<IconAlertTriangle size={14} />}
          >
            Fire Violation Alert Toast
          </Button>
        </div>
      </div>

      {/* 2. Banner Component */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Full-Width Notification Banner (`Banner`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Status banners (`info`, `warning`, `danger`, `success`) for system updates, offline synchronization, or overdue audits.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <Banner status="info">
            Auditor Offline Sync: 4 inspection drafts queued locally. Device will automatically sync when network re-establishes.
          </Banner>

          <Banner status="warning">
            FSSAI License Renewal Due: 3 store locations in Delhi NCR have compliance licenses expiring within 14 days.
          </Banner>
        </div>
      </div>

      {/* 3. InlineBanner Component */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Inline Contextual Banner (`InlineBanner`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compact embedded alert banner for forms, cards, and modal bodies.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <InlineBanner>
            Standard operating temperatures must be measured using calibrated probe thermometers only.
          </InlineBanner>
        </div>
      </div>

      {/* 4. Callout Component */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Structured Callouts (`Callout`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rich callout panel featuring icons, title headings, detailed descriptions, and actionable button slots.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <Callout
            status="info"
            title="Geo-Verification Enforced on Food Safety Audits"
            description="Auditors must verify location coordinates via mobile device GPS before starting section 2 of the SOP inspection checklist."
          />

          <Callout
            status="warning"
            title="Immediate Remediation Protocol Triggered"
            description="A critical failure on Cold Storage will automatically freeze the store's compliance score until photo verification is uploaded."
          />
        </div>
      </div>
    </div>
  );
}
