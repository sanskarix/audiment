'use client';

import * as React from 'react';
import { TextCursorInput, Search } from 'lucide-react';
import {
  UniversalInput,
  UniversalTextarea,
  UniversalSearchInput,
} from '@/components/universal';

export function AudimentInputsSection() {
  const [searchValue, setSearchValue] = React.useState('');
  const [inputValue, setInputValue] = React.useState('Store #1042 - North Campus');
  const [errorInput, setErrorInput] = React.useState('');

  return (
    <div id="inputs" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <TextCursorInput size={15} /> Category 3
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Form Inputs & Search Controls
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal text inputs, multiline notes, and search bars unified from decisions.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          3 components
        </span>
      </div>

      {/* 1. Universal Search Input */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">
              Standard Search Bar (`UniversalSearchInput`)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              VAR-SEARCH-ICON-INPUT
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            40px icon-prefixed search input with automated clear button.
          </p>
        </div>

        <div className="pt-1 max-w-md">
          <UniversalSearchInput
            placeholder="Search audits, locations, auditors..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
          />
        </div>
      </div>

      {/* 2. Text Input & Error States */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Text Field (`UniversalInput`)
          </h3>
          <p className="text-xs text-muted-foreground">
            Label, helper text, and validation error states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <UniversalInput
            label="Location Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText="Enter the registered operational branch identifier"
          />

          <UniversalInput
            label="Audit Score Threshold (%)"
            type="number"
            value={errorInput}
            onChange={(e) => setErrorInput(e.target.value)}
            placeholder="e.g. 85"
            error={!errorInput ? 'Threshold is required for automated escalation' : undefined}
          />
        </div>
      </div>

      {/* 3. Universal Textarea (Merged) */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">
              Multiline Textarea (`UniversalTextarea`)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Merged VAR-INP-TEXTAREA → VAR-INP-TEXT
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consolidated multiline text component sharing identical design tokens and focus states.
          </p>
        </div>

        <div className="pt-1 max-w-xl">
          <UniversalTextarea
            label="Audit Observation Notes"
            rows={3}
            placeholder="Add detailed corrective action instructions or verification notes..."
            helperText="Markdown formatting is supported in audit observation summaries"
          />
        </div>
      </div>
    </div>
  );
}
