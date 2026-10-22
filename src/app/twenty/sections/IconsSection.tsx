'use client';

import * as React from 'react';
import {
  IconSearch,
  IconCheck,
  IconSparkles,
  IconTwentyStar,
  IconTwentyStarFilled,
  IconSparkle2,
  IllustrationIconArray,
  IllustrationIconCalendarEvent,
  IllustrationIconCalendarTime,
  IllustrationIconCurrency,
  IllustrationIconFile,
  IllustrationIconJson,
  IllustrationIconLink,
  IllustrationIconMail,
  IllustrationIconManyToMany,
  IllustrationIconMap,
  IllustrationIconNumbers,
  IllustrationIconOneToMany,
  IllustrationIconOneToOne,
  IllustrationIconPhone,
  IllustrationIconSetting,
  IllustrationIconStar,
  IllustrationIconTag,
  IllustrationIconTags,
  IllustrationIconText,
  IllustrationIconToggle,
  IllustrationIconUid,
  IllustrationIconUser,
  // Key Tabler Icons
  IconShield,
  IconAlertTriangle,
  IconBuildingSkyscraper,
  IconCalendar,
  IconClock,
  IconFileText,
  IconDownload,
  IconFilter,
  IconTrash,
  IconEdit,
  IconUser,
  IconUserPin,
  IconMap,
  IconPhoto,
  IconGauge,
  IconLock,
  IconRefresh,
  IconBell,
  IconLayoutDashboard,
  IconSettings,
  IconListCheck,
  IconChartBar,
} from '@/components/twenty';

const POPULAR_TABLER_ICONS = [
  { name: 'IconShield', Icon: IconShield, category: 'Compliance' },
  { name: 'IconCheck', Icon: IconCheck, category: 'Actions' },
  { name: 'IconAlertTriangle', Icon: IconAlertTriangle, category: 'Violations' },
  { name: 'IconBuildingSkyscraper', Icon: IconBuildingSkyscraper, category: 'Facilities' },
  { name: 'IconCalendar', Icon: IconCalendar, category: 'Scheduling' },
  { name: 'IconClock', Icon: IconClock, category: 'Time' },
  { name: 'IconFileText', Icon: IconFileText, category: 'Reports' },
  { name: 'IconDownload', Icon: IconDownload, category: 'Actions' },
  { name: 'IconFilter', Icon: IconFilter, category: 'Actions' },
  { name: 'IconTrash', Icon: IconTrash, category: 'Actions' },
  { name: 'IconEdit', Icon: IconEdit, category: 'Actions' },
  { name: 'IconUser', Icon: IconUser, category: 'Auditor' },
  { name: 'IconUserPin', Icon: IconUserPin, category: 'Auditor' },
  { name: 'IconMap', Icon: IconMap, category: 'Location' },
  { name: 'IconPhoto', Icon: IconPhoto, category: 'Evidence' },
  { name: 'IconGauge', Icon: IconGauge, category: 'Metrics' },
  { name: 'IconLock', Icon: IconLock, category: 'Security' },
  { name: 'IconRefresh', Icon: IconRefresh, category: 'Actions' },
  { name: 'IconBell', Icon: IconBell, category: 'Alerts' },
  { name: 'IconLayoutDashboard', Icon: IconLayoutDashboard, category: 'Navigation' },
  { name: 'IconSettings', Icon: IconSettings, category: 'Settings' },
  { name: 'IconListCheck', Icon: IconListCheck, category: 'Checklists' },
  { name: 'IconChartBar', Icon: IconChartBar, category: 'Analytics' },
];

const ILLUSTRATION_ICONS = [
  { name: 'IllustrationIconFile', Icon: IllustrationIconFile },
  { name: 'IllustrationIconCalendarEvent', Icon: IllustrationIconCalendarEvent },
  { name: 'IllustrationIconCalendarTime', Icon: IllustrationIconCalendarTime },
  { name: 'IllustrationIconCurrency', Icon: IllustrationIconCurrency },
  { name: 'IllustrationIconJson', Icon: IllustrationIconJson },
  { name: 'IllustrationIconLink', Icon: IllustrationIconLink },
  { name: 'IllustrationIconMail', Icon: IllustrationIconMail },
  { name: 'IllustrationIconMap', Icon: IllustrationIconMap },
  { name: 'IllustrationIconNumbers', Icon: IllustrationIconNumbers },
  { name: 'IllustrationIconPhone', Icon: IllustrationIconPhone },
  { name: 'IllustrationIconSetting', Icon: IllustrationIconSetting },
  { name: 'IllustrationIconStar', Icon: IllustrationIconStar },
  { name: 'IllustrationIconTag', Icon: IllustrationIconTag },
  { name: 'IllustrationIconTags', Icon: IllustrationIconTags },
  { name: 'IllustrationIconText', Icon: IllustrationIconText },
  { name: 'IllustrationIconToggle', Icon: IllustrationIconToggle },
  { name: 'IllustrationIconUid', Icon: IllustrationIconUid },
  { name: 'IllustrationIconUser', Icon: IllustrationIconUser },
  { name: 'IllustrationIconArray', Icon: IllustrationIconArray },
  { name: 'IllustrationIconManyToMany', Icon: IllustrationIconManyToMany },
  { name: 'IllustrationIconOneToMany', Icon: IllustrationIconOneToMany },
  { name: 'IllustrationIconOneToOne', Icon: IllustrationIconOneToOne },
];

export function IconsSection() {
  const [copiedIcon, setCopiedIcon] = React.useState<string | null>(null);
  const [filterQuery, setFilterQuery] = React.useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIcon(text);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const filteredIcons = POPULAR_TABLER_ICONS.filter(
    (item) =>
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div id="icons" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <IconSparkles size={15} /> Category 14
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Icons and Icon Utilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Over 300+ MIT Tabler icons, custom Twenty stars, and 22 visual illustration icons exported directly from the verified package.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
          300+ icons
        </span>
      </div>

      {/* 1. Custom Twenty Icons */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Custom Twenty UI Icons
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bespoke brand and decorative stars provided in the MIT bundle.
          </p>
        </div>

        <div className="flex items-center gap-6 pt-1">
          <button
            type="button"
            onClick={() => copyToClipboard('IconTwentyStar')}
            className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/60 hover:border-blue-500 transition-colors flex items-center gap-3 text-xs"
          >
            <span className="text-amber-500"><IconTwentyStar size={20} /></span>
            <span className="font-mono">IconTwentyStar</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard('IconTwentyStarFilled')}
            className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/60 hover:border-blue-500 transition-colors flex items-center gap-3 text-xs"
          >
            <span className="text-amber-500"><IconTwentyStarFilled size={20} /></span>
            <span className="font-mono">IconTwentyStarFilled</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard('IconSparkle2')}
            className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/60 hover:border-blue-500 transition-colors flex items-center gap-3 text-xs"
          >
            <span className="text-indigo-500"><IconSparkle2 size={20} /></span>
            <span className="font-mono">IconSparkle2</span>
          </button>
        </div>
      </div>

      {/* 2. Twenty Illustration Icons */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Illustration Icons (22 Schema & Field Types)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rich dual-tone illustration icons used for inspection field types, entities, and data models. Click to copy name.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
          {ILLUSTRATION_ICONS.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => copyToClipboard(name)}
              className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/60 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center gap-2 text-center group"
            >
              <div className="p-2 rounded bg-white dark:bg-slate-900 shadow-2xs group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate w-full">
                {name.replace('IllustrationIcon', '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Searchable Tabler Icons */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Core Tabler Icons for Audiment Workflows
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any icon to copy its JSX component tag to your clipboard.
            </p>
          </div>
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search icons..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full text-xs h-8 pl-8 pr-3 rounded-lg border bg-white dark:bg-slate-900"
            />
            <IconSearch size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
          {filteredIcons.map(({ name, Icon, category }) => (
            <button
              key={name}
              type="button"
              onClick={() => copyToClipboard(`<${name} size={16} />`)}
              className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/60 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center gap-2 text-center group"
            >
              <div className="p-2 rounded bg-white dark:bg-slate-900 shadow-2xs text-slate-700 dark:text-slate-300 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                <Icon size={18} />
              </div>
              <div className="w-full">
                <span className="text-[11px] font-mono text-slate-800 dark:text-slate-200 truncate block">
                  {name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {category}
                </span>
              </div>
            </button>
          ))}
        </div>

        {copiedIcon && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-2">
            <IconCheck size={14} /> Copied to clipboard: <code className="font-mono">{copiedIcon}</code>
          </div>
        )}
      </div>
    </div>
  );
}
