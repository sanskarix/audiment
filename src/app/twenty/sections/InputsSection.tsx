'use client';

import * as React from 'react';
import {
  Input,
  InputGroup,
  SearchInput,
  Textarea,
  Field,
  NumberStepper,
  ImageInput,
  IconEdit,
  IconSearch,
  IconMail,
  Shortcut,
  IconBuildingSkyscraper,
} from '@/components/twenty';

export function InputsSection() {
  const [stepperScore, setStepperScore] = React.useState<number | null>(85);
  const [searchVal, setSearchVal] = React.useState('');
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const fakeUrl = URL.createObjectURL(file);
    setPhotoPreview(fakeUrl);
  };

  return (
    <div id="inputs" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconEdit size={15} /> Category 3
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Text Inputs and Form Controls
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard 14px inputs, prefix/suffix element groupings, multi-line notes, validation fields, steppers, and photo evidence uploaders.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          7 components
        </span>
      </div>

      {/* 1. Standard Inputs & Sizes */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Text Inputs (`Input`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audiment standard 14px height (`h-10`) alongside compact 13px control size (`size="sm"`), disabled, and readonly states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Standard 14px Input
            </label>
            <Input
              className="h-10 text-[14px]"
              placeholder="Store branch name"
              defaultValue="DLF CyberHub Store #104"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Compact Size (`size="sm"`)
            </label>
            <Input
              size="sm"
              placeholder="Batch ID"
              defaultValue="BATCH-Q4-883"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Disabled State
            </label>
            <Input
              disabled
              defaultValue="Audit Completed — Locked for Edits"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Email Input
            </label>
            <Input
              type="email"
              placeholder="auditor@audiment.com"
              defaultValue="senior.auditor@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Password Input
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              defaultValue="encryptedSecretKey"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Read-Only Audit Code
            </label>
            <Input
              readOnly
              defaultValue="AUD-NCR-2026-10-8841"
              className="bg-slate-50 dark:bg-slate-900/80 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. InputGroup (Prefix & Suffix Elements) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Input Group with Start and End Elements (`InputGroup`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adorns inputs with icons, currency units, or keyboard shortcut badges for rich UX affordance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Icon Start + Shortcut End
            </label>
            <InputGroup
              startElement={<IconSearch size={15} className="text-slate-400" />}
              endElement={<Shortcut shortcut={['⌘', 'F']} />}
            >
              <Input placeholder="Find checklist item..." />
            </InputGroup>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Email Icon Prefix
            </label>
            <InputGroup
              startElement={<IconMail size={15} className="text-slate-400" />}
            >
              <Input type="email" placeholder="manager@retailbrand.com" />
            </InputGroup>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Location Store Prefix
            </label>
            <InputGroup
              startElement={<IconBuildingSkyscraper size={15} className="text-slate-400" />}
            >
              <Input placeholder="Enter outlet code" defaultValue="IND-DEL-104" />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* 3. SearchInput & Textarea */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Dedicated Search & Multi-Line Notes (`SearchInput`, `Textarea`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search inputs with filter integration and multi-line textareas for non-conformance auditor notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                SearchInput (Live Querying)
              </label>
              <SearchInput
                placeholder="Search audits by auditor, store, or tag..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Filtering for: &quot;{searchVal}&quot;
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                SearchInput with Filter Dropdown Trigger
              </label>
              <SearchInput
                placeholder="Filter locations..."
                filterButtonAriaLabel="Filter stores"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Textarea (Auditor Remarks & Corrective Action Plan)
            </label>
            <Textarea
              rows={4}
              placeholder="Describe observation, evidence details, root cause, and agreed timeline for remediation..."
              defaultValue="Observed loose electrical wiring in back kitchen refrigeration rack. Facility manager notified and issued immediate 24-hour remediation notice (SOP #SEC-14)."
              className="text-xs leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 4. Field Compound Primitive (Validation States) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Compound Form Field (`Field`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Structured form grouping with label, control, helper description, and accessible error message slots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Normal Field */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <Field.Root>
              <Field.Label className="text-xs font-medium text-slate-800 dark:text-slate-200 mb-1 block">
                Store Temperature Log (°C)
              </Field.Label>
              <Field.Control render={<Input placeholder="e.g. 3.5" defaultValue="3.8" />} />
              <Field.Description className="text-[11px] text-slate-500 mt-1 block">
                Must be maintained between 0.0°C and 4.0°C per Cold Chain Protocol.
              </Field.Description>
            </Field.Root>
          </div>

          {/* Error Field */}
          <div className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
            <Field.Root invalid>
              <Field.Label className="text-xs font-medium text-red-900 dark:text-red-300 mb-1 block">
                Auditor Government License ID
              </Field.Label>
              <Field.Control render={<Input defaultValue="AUD-INVALID" className="border-red-500 focus:border-red-600" />} />
              <Field.Error className="text-[11px] text-red-600 dark:text-red-400 mt-1 block font-medium">
                License format must match ISO-AUD-XXXXX. Verification failed.
              </Field.Error>
            </Field.Root>
          </div>
        </div>
      </div>

      {/* 5. NumberStepper & ImageInput */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Numeric Stepper & Photo Evidence (`NumberStepper`, `ImageInput`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Precision score stepping controls and file upload previews for proof-based inspections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* NumberStepper */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">NumberStepper (Audit Score)</div>
            <div className="flex items-center gap-4">
              <NumberStepper
                value={stepperScore}
                onValueChange={(val) => setStepperScore(val)}
                min={0}
                max={100}
                step={5}
                showButtons
                className="max-w-[180px]"
              />
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                Score: {stepperScore} / 100
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Steppers provide min/max boundaries and accessible keyboard arrow controls.
            </p>
          </div>

          {/* ImageInput */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400">ImageInput (Photo Proof Upload)</div>
            <ImageInput
              src={photoPreview}
              uploadLabel="Attach Audit Photo Proof"
              helperText="Upload JPG/PNG photo evidence of inspection finding (max 5MB)"
              onFileSelect={handleFileSelect}
              onRemove={() => setPhotoPreview(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
