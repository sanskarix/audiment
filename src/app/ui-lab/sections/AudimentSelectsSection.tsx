'use client';

import * as React from 'react';
import { SlidersHorizontal, ChevronDown, Check, UserCheck, ShieldAlert, MapPin } from 'lucide-react';
import { UniversalSelect } from '@/components/universal';

export function AudimentSelectsSection() {
  const [selectedAuditType, setSelectedAuditType] = React.useState('hygiene');
  const [selectedSeverity, setSelectedSeverity] = React.useState('high');

  const auditTypeOptions = [
    { value: 'hygiene', label: 'FSSAI Hygiene & Sanitation Audit', icon: <UserCheck size={14} className="text-emerald-500" /> },
    { value: 'safety', label: 'Occupational Safety & Fire Compliance', icon: <ShieldAlert size={14} className="text-rose-500" /> },
    { value: 'inventory', label: 'Cold-Chain & Fresh Inventory Verification', icon: <MapPin size={14} className="text-blue-500" /> },
  ];

  const severityOptions = [
    { value: 'low', label: 'Low Severity (Observation Only)' },
    { value: 'medium', label: 'Medium Severity (48h Resolution)' },
    { value: 'high', label: 'High Severity (Immediate Escalation)' },
    { value: 'critical', label: 'Critical Violation (Stop Operations)' },
  ];

  return (
    <div id="selects" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <SlidersHorizontal size={15} /> Category 4
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Selects, Dropdowns & Menus
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal select component consolidated from VAR-SEL-FORM-PICKER and merged VAR-SEL-DROPDOWN-MENU.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          UniversalSelect
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Picker */}
        <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                Audit Category Selector (`UniversalSelect`)
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                VAR-SEL-FORM-PICKER
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Form picker with custom leading icon badges and active states.
            </p>
          </div>

          <UniversalSelect
            label="Audit Checklist Standard"
            options={auditTypeOptions}
            value={selectedAuditType}
            onChange={setSelectedAuditType}
          />
        </div>

        {/* Severity Picker */}
        <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                Action Menu / Dropdown (`UniversalSelect`)
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Merged VAR-SEL-DROPDOWN-MENU
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consolidated dropdown picker with clean borders and subtle overlay blur.
            </p>
          </div>

          <UniversalSelect
            label="Violation Severity Tier"
            options={severityOptions}
            value={selectedSeverity}
            onChange={setSelectedSeverity}
          />
        </div>
      </div>
    </div>
  );
}
