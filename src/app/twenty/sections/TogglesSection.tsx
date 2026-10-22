'use client';

import * as React from 'react';
import {
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  SegmentedControl,
  IconCheckbox,
  IconCheck,
  IconAlertTriangle,
  IconX,
} from '@/components/twenty';

export function TogglesSection() {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({
    item1: true,
    item2: false,
    item3: true,
  });
  const [radioRating, setRadioRating] = React.useState('pass');
  const [geoFenceSwitch, setGeoFenceSwitch] = React.useState(true);
  const [photoRequiredSwitch, setPhotoRequiredSwitch] = React.useState(true);
  const [autoEscalateSwitch, setAutoEscalateSwitch] = React.useState(false);
  const [frequency, setFrequency] = React.useState('weekly');

  return (
    <div id="toggles" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconCheckbox size={15} /> Category 5
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Checkboxes, Radio Buttons and Toggles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit evaluation toggles, compliance rating radio groups, configuration switches, and segmented period selectors.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          4 components
        </span>
      </div>

      {/* 1. Checkboxes */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Checkboxes (`Checkbox`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sizes (`sm`, `md`), colors (`accent`, `neutral`), shapes (`rounded`, `squared`), and indeterminate / disabled states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Interactive Checklist */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Inspection Verification Checklist</div>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                <Checkbox
                  checked={checkedItems.item1}
                  onCheckedChange={(val) => setCheckedItems((p) => ({ ...p, item1: !!val }))}
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Fire extinguisher inspection tag is valid within 12 months
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                <Checkbox
                  checked={checkedItems.item2}
                  onCheckedChange={(val) => setCheckedItems((p) => ({ ...p, item2: !!val }))}
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Staff hand-wash station soap dispenser is operational & filled
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                <Checkbox
                  checked={checkedItems.item3}
                  onCheckedChange={(val) => setCheckedItems((p) => ({ ...p, item3: !!val }))}
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Raw and cooked food segregation followed in refrigerator
                </span>
              </label>
            </div>
          </div>

          {/* Variants and States */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Checkbox Variants & States</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <Checkbox checked size="sm" />
                <span className="text-slate-600 dark:text-slate-400">Small Size (size=&quot;sm&quot;)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Checkbox checked indeterminate />
                <span className="text-slate-600 dark:text-slate-400">Indeterminate State (Partial Pass)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Checkbox disabled checked />
                <span className="text-slate-400">Disabled Checked State</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Checkbox disabled />
                <span className="text-slate-400">Disabled Unchecked State</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Radio & RadioGroup */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Radio Evaluation Group (`RadioGroup`, `Radio`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exclusive choice selection for audit item conformance rating and severity classification.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Audit Conformance Finding for Criterion #14 (Cold Storage Compliance)
          </div>

          <RadioGroup
            value={radioRating}
            onValueChange={(val) => setRadioRating(val)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1"
          >
            <label className={`p-3 rounded-lg border cursor-pointer transition-all ${radioRating === 'pass' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-white dark:bg-slate-900'}`}>
              <div className="flex items-center gap-2">
                <Radio value="pass" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <IconCheck size={13} /> Compliant (Pass)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Meets all statutory FSSAI and SOP parameters.
              </p>
            </label>

            <label className={`p-3 rounded-lg border cursor-pointer transition-all ${radioRating === 'minor' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : 'bg-white dark:bg-slate-900'}`}>
              <div className="flex items-center gap-2">
                <Radio value="minor" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <IconAlertTriangle size={13} /> Minor Deviation
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Minor flaw. 48-hour remediation required.
              </p>
            </label>

            <label className={`p-3 rounded-lg border cursor-pointer transition-all ${radioRating === 'critical' ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'bg-white dark:bg-slate-900'}`}>
              <div className="flex items-center gap-2">
                <Radio value="critical" />
                <span className="text-xs font-medium text-red-700 dark:text-red-400 flex items-center gap-1">
                  <IconX size={13} /> Critical Violation
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Immediate escalation to Regional Ops VP.
              </p>
            </label>

            <label className={`p-3 rounded-lg border cursor-pointer transition-all ${radioRating === 'na' ? 'border-slate-400 bg-slate-100/50 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-900'}`}>
              <div className="flex items-center gap-2">
                <Radio value="na" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Not Applicable (N/A)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Equipment not present at this location.
              </p>
            </label>
          </RadioGroup>
        </div>
      </div>

      {/* 3. Switch Toggles & SegmentedControl */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Switches and Segmented Controls (`Switch`, `SegmentedControl`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive binary toggles and equal-width segmented frequency tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Switches */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Inspection Policy Switches</div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Enforce Auditor Geo-Fencing
                </div>
                <div className="text-[11px] text-slate-500">
                  Auditor must be within 100m of store coordinates to begin inspection.
                </div>
              </div>
              <Switch checked={geoFenceSwitch} onCheckedChange={setGeoFenceSwitch} />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Require Photo Proof on Violations
                </div>
                <div className="text-[11px] text-slate-500">
                  Form prevents submission without attached image evidence.
                </div>
              </div>
              <Switch checked={photoRequiredSwitch} onCheckedChange={setPhotoRequiredSwitch} />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Real-Time Manager Escalation
                </div>
                <div className="text-[11px] text-slate-500">
                  Send WhatsApp & SMS alert immediately when a critical item fails.
                </div>
              </div>
              <Switch checked={autoEscalateSwitch} onCheckedChange={setAutoEscalateSwitch} />
            </div>
          </div>

          {/* SegmentedControl */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Segmented Frequency Control</div>
            <div>
              <SegmentedControl
                aria-label="Audit Cadence"
                value={frequency}
                onValueChange={(val) => setFrequency(val)}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                ]}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-2">
              Scheduled inspection cadence: <strong className="text-blue-600 dark:text-blue-400 uppercase">{frequency}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
