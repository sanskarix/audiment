'use client';

import * as React from 'react';
import {
  Select,
  Dropdown,
  MenuPicker,
  CountrySelect,
  CurrencyPicker,
  PhoneCountryPicker,
  Button,
  IconCheck,
  IconChevronDown,
  IconLayoutGrid,
  IconList,
  IconFileExport,
  IconTrash,
  IconCopy,
  IconFilter,
  IconWorld,
} from '@/components/twenty';

const AUDIMENT_LOCATIONS = [
  { value: 'dlf-cyberhub', label: 'DLF CyberHub Store #104' },
  { value: 'aerocity', label: 'Aerocity Flagship Outlet' },
  { value: 'khan-market', label: 'Khan Market QSR Hub' },
  { value: 'indiranagar', label: 'Indiranagar 100ft Rd Facility' },
  { value: 'bandra-kurla', label: 'BKC Corporate Dining Hall' },
];

const SAMPLE_COUNTRIES = [
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'AE', label: 'United Arab Emirates', flag: '🇦🇪' },
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
];

const SAMPLE_CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'AED', name: 'UAE Dirham (د.إ)' },
];

const SAMPLE_PHONE_COUNTRIES = [
  { value: 'IN', label: 'India', callingCode: '+91', flag: '🇮🇳' },
  { value: 'US', label: 'United States', callingCode: '+1', flag: '🇺🇸' },
  { value: 'GB', label: 'United Kingdom', callingCode: '+44', flag: '🇬🇧' },
  { value: 'AE', label: 'United Arab Emirates', callingCode: '+971', flag: '🇦🇪' },
  { value: 'SG', label: 'Singapore', callingCode: '+65', flag: '🇸🇬' },
];

export function PickersSection() {
  const [selectedLocation, setSelectedLocation] = React.useState('dlf-cyberhub');
  const [selectedCountry, setSelectedCountry] = React.useState('IN');
  const [selectedCurrency, setSelectedCurrency] = React.useState('INR');
  const [selectedPhoneCountry, setSelectedPhoneCountry] = React.useState('IN');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [dropdownLastAction, setDropdownLastAction] = React.useState<string | null>(null);

  const currentPhoneCountry = SAMPLE_PHONE_COUNTRIES.find((c) => c.value === selectedPhoneCountry);

  return (
    <div id="pickers" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconWorld size={15} /> Category 4
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Selects, Dropdowns and Pickers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compound Base-UI Select menus, searchable dropdown popups, country pickers, currency selectors, and view mode switchers.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          6 components
        </span>
      </div>

      {/* 1. Base UI Select */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Select Primitives (`Select`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Headless accessible select compound with custom popup, option groups, separators, and trigger values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Store Inspection Branch Select
            </label>
            <Select.Root
              value={selectedLocation}
              onValueChange={(val) => val && setSelectedLocation(val)}
            >
              <Select.Trigger className="w-full h-10 px-3 flex items-center justify-between rounded-lg border bg-white dark:bg-slate-900 text-xs">
                <Select.Value placeholder="Select inspection branch" />
              </Select.Trigger>
              <Select.Popup className="z-50 min-w-[240px] rounded-lg border bg-white dark:bg-slate-900 p-1 shadow-lg text-xs">
                <Select.Group>
                  <Select.GroupLabel className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">
                    Delhi NCR Region
                  </Select.GroupLabel>
                  <Select.Item value="dlf-cyberhub" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    DLF CyberHub Store #104
                  </Select.Item>
                  <Select.Item value="aerocity" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    Aerocity Flagship Outlet
                  </Select.Item>
                  <Select.Item value="khan-market" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    Khan Market QSR Hub
                  </Select.Item>
                </Select.Group>
                <Select.Separator className="my-1 border-t border-slate-200 dark:border-slate-800" />
                <Select.Group>
                  <Select.GroupLabel className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">
                    Other Regions
                  </Select.GroupLabel>
                  <Select.Item value="indiranagar" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    Indiranagar 100ft Rd Facility (Bangalore)
                  </Select.Item>
                  <Select.Item value="bandra-kurla" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    BKC Corporate Dining Hall (Mumbai)
                  </Select.Item>
                </Select.Group>
              </Select.Popup>
            </Select.Root>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Active value: <code className="font-mono text-blue-600 dark:text-blue-400">{selectedLocation}</code>
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Audit Standard & Template
            </label>
            <Select.Root defaultValue="fssai">
              <Select.Trigger className="w-full h-10 px-3 flex items-center justify-between rounded-lg border bg-white dark:bg-slate-900 text-xs">
                <Select.Value placeholder="Select standard" />
              </Select.Trigger>
              <Select.Popup className="z-50 min-w-[240px] rounded-lg border bg-white dark:bg-slate-900 p-1 shadow-lg text-xs">
                <Select.Item value="fssai" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  FSSAI Food Safety & Hygiene Audit
                </Select.Item>
                <Select.Item value="haccp" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  HACCP Critical Control Point Audit
                </Select.Item>
                <Select.Item value="iso22000" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  ISO 22000 Food Safety Management
                </Select.Item>
                <Select.Item value="fire-safety" className="px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  Fire & Emergency Equipment Protocol
                </Select.Item>
              </Select.Popup>
            </Select.Root>
          </div>
        </div>
      </div>

      {/* 2. Twenty Dropdown Component */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Searchable Action Dropdown (`Dropdown`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rich dropdown supporting nested sections, search filtering, action buttons, and keyboard navigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <Dropdown.Root type="menu">
            <Dropdown.Trigger render={<Button variant="solid" color="accent" endIcon={<IconChevronDown size={14} />}>Audit Actions Menu</Button>} />
            <Dropdown.Content className="z-50 min-w-[220px] rounded-lg border bg-white dark:bg-slate-900 p-1.5 shadow-xl text-xs">
              <Dropdown.Header className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                Audit Management
              </Dropdown.Header>
              <Dropdown.ActionItem
                startIcon={<IconFileExport size={14} />}
                onClick={() => setDropdownLastAction('Export PDF Report')}
              >
                Export PDF Audit Report
              </Dropdown.ActionItem>
              <Dropdown.ActionItem
                startIcon={<IconCopy size={14} />}
                onClick={() => setDropdownLastAction('Duplicate Checklist')}
              >
                Duplicate Checklist Template
              </Dropdown.ActionItem>
              <Dropdown.Separator className="my-1 border-t border-slate-200 dark:border-slate-800" />
              <Dropdown.Header className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                Danger Zone
              </Dropdown.Header>
              <Dropdown.ActionItem
                startIcon={<IconTrash size={14} className="text-red-500" />}
                onClick={() => setDropdownLastAction('Archive Audit Records')}
              >
                Archive Audit Records
              </Dropdown.ActionItem>
            </Dropdown.Content>
          </Dropdown.Root>

          {dropdownLastAction && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <IconCheck size={14} /> Fired: &quot;{dropdownLastAction}&quot;
            </span>
          )}
        </div>
      </div>

      {/* 3. Country, Currency, and Phone Pickers */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Geographic & Currency Pickers (`CountrySelect`, `CurrencyPicker`, `PhoneCountryPicker`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pre-built pickers for multi-location national compliance, local currency assessment, and SMS dispatch dial codes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* CountrySelect */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              CountrySelect
            </label>
            <CountrySelect
              countries={SAMPLE_COUNTRIES}
              value={selectedCountry}
              onValueChange={(c) => setSelectedCountry(c)}
              label="Select country jurisdiction"
            />
          </div>

          {/* CurrencyPicker */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              CurrencyPicker (Penalty Unit)
            </label>
            <Dropdown.Root type="picker">
              <CurrencyPicker.Trigger value={selectedCurrency} />
              <Dropdown.Content className="z-50 min-w-[200px] rounded-lg border bg-white dark:bg-slate-900 p-1 shadow-xl text-xs">
                <CurrencyPicker.Options
                  currencies={SAMPLE_CURRENCIES}
                  value={selectedCurrency}
                  onValueChange={(code) => setSelectedCurrency(code)}
                />
              </Dropdown.Content>
            </Dropdown.Root>
          </div>

          {/* PhoneCountryPicker */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              PhoneCountryPicker (Auditor SMS)
            </label>
            <Dropdown.Root type="picker">
              <PhoneCountryPicker.Trigger
                country={currentPhoneCountry}
                aria-label="Select country phone dialing code"
              />
              <Dropdown.Content className="z-50 min-w-[200px] rounded-lg border bg-white dark:bg-slate-900 p-1 shadow-xl text-xs">
                <PhoneCountryPicker.Options
                  countries={SAMPLE_PHONE_COUNTRIES}
                  value={selectedPhoneCountry}
                  onValueChange={(code) => setSelectedPhoneCountry(code)}
                />
              </Dropdown.Content>
            </Dropdown.Root>
          </div>
        </div>
      </div>

      {/* 4. MenuPicker (View Mode Switcher) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            View Picker (`MenuPicker`)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quick icon/item picker button for toggling layout modes and display perspectives.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <MenuPicker
            id="view-grid"
            icon={IconLayoutGrid}
            label="Grid View"
            selected={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          />
          <MenuPicker
            id="view-list"
            icon={IconList}
            label="Table View"
            selected={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          />
          <span className="text-xs text-slate-500 ml-2">
            Current layout: <strong className="text-slate-700 dark:text-slate-200 uppercase">{viewMode}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
