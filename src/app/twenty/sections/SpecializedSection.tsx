'use client';

import * as React from 'react';
import {
  SettingsRow,
  Slider,
  Autocomplete,
  MAIN_COLOR_NAMES,
  Button,
  IconSettings,
  IconBell,
  IconShield,
  IconFileCheck,
  IconSearch,
  IconInfoCircle,
} from '@/components/twenty';

export function SpecializedSection() {
  // SettingsRow state
  const [strictLogging, setStrictLogging] = React.useState(true);
  const [autoEscalate, setAutoEscalate] = React.useState(false);
  const [fssaiComplianceMode, setFssaiComplianceMode] = React.useState(true);

  // Slider state
  const [passingGrade, setPassingGrade] = React.useState<number>(85);
  const [criticalDays, setCriticalDays] = React.useState<number>(3);

  // Autocomplete state
  const [searchQuery, setSearchQuery] = React.useState('');
  const stores = [
    { id: '101', name: 'Store #101 - Mumbai BKC Outlet', region: 'West' },
    { id: '102', name: 'Store #102 - Bangalore Koramangala Hub', region: 'South' },
    { id: '103', name: 'Store #103 - Pune Viman Nagar', region: 'West' },
    { id: '104', name: 'Store #104 - Connaught Place Flagship', region: 'North' },
    { id: '105', name: 'Store #105 - Hyderabad Hitec City', region: 'South' },
  ];

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="specialized" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconSettings size={15} /> Category 16
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Other Eligible Components & Specialized Primitives
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compound settings rows, continuous range sliders, autocomplete search filters, system palette tokens, and dependency boundary reports.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          4 primitives + audit notes
        </span>
      </div>

      {/* 1. SettingsRow */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Settings Row Primitives (`SettingsRow`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compound configuration row with built-in Switch, start icon/badge slot, title, and descriptive subtitle.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          <SettingsRow
            checked={strictLogging}
            onCheckedChange={setStrictLogging}
            startElement={
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <IconShield size={18} />
              </div>
            }
            description="Require high-resolution photo proof and GPS geofence match for all checklist answers."
          >
            Strict Audit Evidence Logging
          </SettingsRow>

          <SettingsRow
            checked={autoEscalate}
            onCheckedChange={setAutoEscalate}
            startElement={
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <IconBell size={18} />
              </div>
            }
            description="Trigger priority notification to Regional Quality Director if corrective action remains unresolved past 48 hours."
          >
            Auto-Escalate Overdue Corrective Actions
          </SettingsRow>

          <SettingsRow
            checked={fssaiComplianceMode}
            onCheckedChange={setFssaiComplianceMode}
            startElement={
              <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <IconFileCheck size={18} />
              </div>
            }
            description="Apply Indian FSSAI Schedule 4 hygiene standards and statutory inspection question weights."
          >
            Statutory FSSAI Compliance Protocol
          </SettingsRow>
        </div>
      </div>

      {/* 2. Slider */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Continuous & Stepped Sliders (`Slider`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accessible range slider primitive with Track, Indicator, and Thumb controls built on Base UI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Slider 1: Audit Passing Grade */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Minimum Passing Grade Threshold</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {passingGrade}%
              </span>
            </div>

            <Slider.Root
              value={passingGrade}
              onValueChange={(val) => {
                const num = Array.isArray(val) ? val[0] : val;
                if (typeof num === 'number') setPassingGrade(num);
              }}
              min={50}
              max={100}
              step={5}
            >
              <Slider.Control className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer">
                <Slider.Track className="relative bg-slate-200 dark:bg-slate-800 grow rounded-full h-1.5">
                  <Slider.Indicator className="absolute bg-blue-600 rounded-full h-full" />
                  <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow hover:scale-110 focus:outline-none transition-transform" />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50% (Lenient)</span>
              <span>85% (Recommended)</span>
              <span>100% (Zero Tolerance)</span>
            </div>
          </div>

          {/* Slider 2: Action Resolution SLA */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Critical Action SLA Limit</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                {criticalDays} {criticalDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            <Slider.Root
              value={criticalDays}
              onValueChange={(val) => {
                const num = Array.isArray(val) ? val[0] : val;
                if (typeof num === 'number') setCriticalDays(num);
              }}
              min={1}
              max={14}
              step={1}
            >
              <Slider.Control className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer">
                <Slider.Track className="relative bg-slate-200 dark:bg-slate-800 grow rounded-full h-1.5">
                  <Slider.Indicator className="absolute bg-amber-500 rounded-full h-full" />
                  <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow hover:scale-110 focus:outline-none transition-transform" />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 day (Urgent)</span>
              <span>7 days (Standard)</span>
              <span>14 days (Extended)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Autocomplete */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Autocomplete Filter (`Autocomplete`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search combobox primitive with query input group, item popover, and empty state fallback.
          </p>
        </div>

        <div className="max-w-md p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-3">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Store Filter Autocomplete</div>

          <Autocomplete.Root>
            <Autocomplete.InputGroup className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <IconSearch size={15} />
              </span>
              <Autocomplete.Input
                placeholder="Search audit locations..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 h-10 text-[14px] rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </Autocomplete.InputGroup>

            <div className="mt-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <Autocomplete.List className="py-1 max-h-48 overflow-y-auto">
                {filteredStores.length === 0 ? (
                  <Autocomplete.Empty className="px-3 py-2 text-xs text-slate-400 text-center">
                    No matching audit locations found
                  </Autocomplete.Empty>
                ) : (
                  filteredStores.map((store) => (
                    <Autocomplete.Item
                      key={store.id}
                      onClick={() => setSearchQuery(store.name)}
                      className="px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-medium">{store.name}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {store.region}
                      </span>
                    </Autocomplete.Item>
                  ))
                )}
              </Autocomplete.List>
            </div>
          </Autocomplete.Root>
        </div>
      </div>

      {/* 4. MAIN_COLOR_NAMES Swatches */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            System Color Swatches (`MAIN_COLOR_NAMES`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The 25 curated system color tokens defined by Twenty UI for tags, pills, statuses, and icon tiles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 pt-1">
          {MAIN_COLOR_NAMES.map((c) => (
            <div
              key={c}
              className="flex items-center gap-2 p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
            >
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: `var(--twenty-color-${c}, currentColor)` }}
              />
              <span className="text-[11px] font-mono capitalize truncate">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
