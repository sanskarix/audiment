'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Search,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
  ArrowUp,
  SlidersHorizontal,
  MousePointerClick,
  TextCursorInput,
  Tag,
  Table as TableIcon,
  Layers,
  Columns,
  Type,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

// Audiment Universal Category Section Imports
import { AudimentDecisionsSummarySection } from './sections/AudimentDecisionsSummarySection';
import { AudimentTypographySection } from './sections/AudimentTypographySection';
import { AudimentButtonsSection } from './sections/AudimentButtonsSection';
import { AudimentInputsSection } from './sections/AudimentInputsSection';
import { AudimentSelectsSection } from './sections/AudimentSelectsSection';
import { AudimentBadgesSection } from './sections/AudimentBadgesSection';
import { AudimentTablesSection } from './sections/AudimentTablesSection';
import { AudimentCardsSection } from './sections/AudimentCardsSection';
import { AudimentTabsModalsSection } from './sections/AudimentTabsModalsSection';

interface CategoryNavItem {
  id: string;
  num: number;
  title: string;
  count: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryNavItem[] = [
  { id: 'typography', num: 1, title: 'Typography and Text', count: '5 scale tokens', icon: <Type size={14} /> },
  { id: 'buttons', num: 2, title: 'Buttons and Actions', count: 'UniversalButton', icon: <MousePointerClick size={14} /> },
  { id: 'inputs', num: 3, title: 'Text Inputs & Search', count: '3 components', icon: <TextCursorInput size={14} /> },
  { id: 'selects', num: 4, title: 'Selects, Menus & Pickers', count: 'UniversalSelect', icon: <SlidersHorizontal size={14} /> },
  { id: 'badges', num: 5, title: 'Status Badges & Chips', count: 'UniversalBadge', icon: <Tag size={14} /> },
  { id: 'tables', num: 6, title: 'Data Tables & Grids', count: 'UniversalTable', icon: <TableIcon size={14} /> },
  { id: 'cards', num: 7, title: 'Cards & KPI Widgets', count: 'UniversalCard', icon: <Layers size={14} /> },
  { id: 'tabs-modals', num: 8, title: 'Tabs & Modals', count: '2 components', icon: <Columns size={14} /> },
];

export default function UiLabPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [searchFilter, setSearchFilter] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeScheme: 'light' | 'dark' =
    resolvedTheme === 'dark' || theme === 'dark' ? 'dark' : 'light';

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    cat.num.toString().includes(searchFilter)
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Audiment UI Lab
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck size={11} /> Universal System
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                  audiment-ui@1.0.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Unified Universal Component Explorer · 8 Standardized Categories · 28 Decisions Verified
              </p>
            </div>
          </div>

          {/* Quick Actions & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/admin"
              className="hidden md:inline-flex text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-2.5 py-1.5 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-800 items-center gap-1"
            >
              <span>Dashboard</span>
              <ExternalLink size={12} />
            </Link>

            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(activeScheme === 'dark' ? 'light' : 'dark')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                aria-label="Toggle theme color scheme"
              >
                {activeScheme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-3 sticky top-24 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <LayoutGrid size={13} /> Categories
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {filteredCategories.length} / 8
                </span>
              </div>

              {/* Search / Filter Input */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter components..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Navigation Links */}
              <nav className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 text-xs">
                <a
                  href="#decisions-report"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 transition-colors font-medium"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={13} /> Decision Registry
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 px-1.5 py-0.2 rounded">
                    28
                  </span>
                </a>

                <div className="pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5">
                  Universal Components
                </div>

                {filteredCategories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <span className="truncate flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400 group-hover:text-primary">
                        {cat.num.toString().padStart(2, '0')}.
                      </span>
                      <span className="truncate">{cat.title}</span>
                    </span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-slate-400 shrink-0 transition-opacity" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Jump to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowUp size={13} /> Back to Top
            </button>
          </aside>

          {/* Main Showcase Feed */}
          <main className="lg:col-span-9 space-y-12">
            {/* Hero Banner */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/60 dark:to-blue-950/20 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <Sparkles size={13} />
                <span>Unified Audiment Application Component System</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Universal Component Explorer
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Replaces fragmented, page-specific UI across Audiment with single-source universal primitives.
                Explore live interactive examples, states, props, and variant decisions.
              </p>
            </div>

            {/* 1. Decisions Summary & System Architecture */}
            <AudimentDecisionsSummarySection />

            {/* 2. Typography & Text Styles */}
            <AudimentTypographySection />

            {/* 3. Universal Buttons */}
            <AudimentButtonsSection />

            {/* 4. Universal Form Inputs & Search */}
            <AudimentInputsSection />

            {/* 5. Universal Selects & Menus */}
            <AudimentSelectsSection />

            {/* 6. Universal Status Badges */}
            <AudimentBadgesSection />

            {/* 7. Universal Data Tables */}
            <AudimentTablesSection />

            {/* 8. Universal Cards & KPI Hero Widgets */}
            <AudimentCardsSection />

            {/* 9. Universal Tabs & Modals */}
            <AudimentTabsModalsSection />
          </main>
        </div>
      </div>
    </div>
  );
}
