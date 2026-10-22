'use client';

import * as React from 'react';
import {
  Card,
  Dialog,
  AlertDialog,
  Button,
  IconAppWindow,
  IconAlertTriangle,
  IconTrash,
  IconCheck,
} from '@/components/twenty';

export function SurfacesSection() {
  const [dialogStatus, setDialogStatus] = React.useState<string | null>(null);

  return (
    <div id="surfaces" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconAppWindow size={15} /> Category 9
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Cards, Surfaces, Dialogs and Modals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compound card containers with dividers, accessible modal dialogs with backdrop filters, and destructive confirmation alert dialogs.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          3 components
        </span>
      </div>

      {/* 1. Card Compound Primitives */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Card Container (`Card.Root`, `Card.Header`, `Card.Content`, `Card.Footer`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Structural card primitive with optional dividers and clean header/footer layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Card 1: Facility Audit Card */}
          <Card.Root className="border rounded-xl bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
            <Card.Header className="p-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    DLF CyberHub Store #104
                  </h4>
                  <p className="text-xs text-slate-500">Scheduled Audit · Sector 24, Gurugram</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  96.2% Score
                </span>
              </div>
            </Card.Header>
            <Card.Content className="p-4 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Standard Checklist:</span>
                <strong className="text-slate-800 dark:text-slate-200">FSSAI QSR Hygiene v4.2</strong>
              </div>
              <div className="flex justify-between">
                <span>Lead Auditor:</span>
                <strong className="text-slate-800 dark:text-slate-200">Priya Sharma</strong>
              </div>
              <div className="flex justify-between">
                <span>Critical Deviations:</span>
                <strong className="text-emerald-600">0 (Zero Non-Conformances)</strong>
              </div>
            </Card.Content>
            <Card.Footer className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Synced 12m ago</span>
              <Button size="sm" variant="outline">
                View Full Audit
              </Button>
            </Card.Footer>
          </Card.Root>

          {/* Card 2: Corrective Action Plan */}
          <Card.Root className="border rounded-xl bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
            <Card.Header className="p-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    CAPA Remediation Notice #18
                  </h4>
                  <p className="text-xs text-slate-500">Aerocity Outlet · Refrigerator Temp</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  24h Deadline
                </span>
              </div>
            </Card.Header>
            <Card.Content className="p-4 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p className="leading-relaxed">
                Walk-in refrigerator unit recorded 9.2°C at 14:30. Store manager assigned technician ticket #ENG-491. Photo evidence re-submission required before closing ticket.
              </p>
            </Card.Content>
            <Card.Footer className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
              <Button size="sm" variant="ghost">Dismiss</Button>
              <Button size="sm" variant="solid" color="accent">Upload Verification Photo</Button>
            </Card.Footer>
          </Card.Root>
        </div>
      </div>

      {/* 2. Dialog & AlertDialog Modals */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Interactive Modals (`Dialog`, `AlertDialog`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Base-UI powered modal dialogs with backdrop blur, focus trapping, ESC key dismiss, and confirmation flows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          {/* Standard Dialog */}
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="solid" color="accent">Open Store Assignment Dialog</Button>} />
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
              <Dialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-xl border bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
                <Dialog.Header>
                  <Dialog.Title className="text-base font-normal">
                    Assign Quality Auditor to DLF CyberHub Store
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select a certified lead auditor and inspection date for the upcoming FSSAI Food Hygiene audit.
                  </Dialog.Description>
                </Dialog.Header>

                <Dialog.Body className="space-y-3 py-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Store Outlet:</span>
                      <strong className="text-slate-800 dark:text-slate-200">DLF CyberHub Store #104</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inspection Window:</span>
                      <strong className="text-slate-800 dark:text-slate-200">Oct 14 – Oct 16, 2026</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Auditor Selected:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">Priya Sharma (Lead ISO-22000)</strong>
                    </div>
                  </div>
                </Dialog.Body>

                <Dialog.Footer className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Dialog.Close render={<Button variant="outline" size="sm">Cancel</Button>} />
                  <Dialog.Close
                    render={
                      <Button
                        variant="solid"
                        color="accent"
                        size="sm"
                        onClick={() => setDialogStatus('Auditor assigned to store #104 successfully')}
                      >
                        Confirm Assignment
                      </Button>
                    }
                  />
                </Dialog.Footer>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Destructive AlertDialog */}
          <AlertDialog.Root>
            <AlertDialog.Trigger render={<Button variant="outline" color="danger" startIcon={<IconTrash size={14} />}>Archive Audit Checklist</Button>} />
            <AlertDialog.Portal>
              <AlertDialog.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
              <AlertDialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
                <AlertDialog.Header>
                  <AlertDialog.Title className="text-base font-normal text-red-600 dark:text-red-400 flex items-center gap-2">
                    <IconAlertTriangle size={18} /> Confirm Inspection Deletion
                  </AlertDialog.Title>
                  <AlertDialog.Description className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Are you sure you want to delete draft inspection <strong>#AUD-NCR-8841</strong>? This action cannot be undone. All recorded notes, temperature stamps, and non-conformance logs will be permanently deleted.
                  </AlertDialog.Description>
                </AlertDialog.Header>

                <AlertDialog.Footer className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <AlertDialog.Close render={<Button variant="outline" size="sm">Keep Inspection</Button>} />
                  <AlertDialog.Close
                    render={
                      <Button
                        variant="solid"
                        color="danger"
                        size="sm"
                        onClick={() => setDialogStatus('Draft inspection checklist deleted')}
                      >
                        Yes, Delete Inspection
                      </Button>
                    }
                  />
                </AlertDialog.Footer>
              </AlertDialog.Popup>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>

        {dialogStatus && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
            <IconCheck size={14} /> Result: &quot;{dialogStatus}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
