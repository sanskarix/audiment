'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowUp,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ThemeProvider,
  Button,
  Input,
  Toaster,
  ToastProvider,
} from '@/components/twenty';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/app-ui/card';
import { Label } from '@/components/app-ui/label';

// Category Section Imports
import { AuditLicenseReport } from './sections/AuditLicenseReport';
import { TypographySection } from './sections/TypographySection';
import { ButtonsSection } from './sections/ButtonsSection';
import { InputsSection } from './sections/InputsSection';
import { PickersSection } from './sections/PickersSection';
import { TogglesSection } from './sections/TogglesSection';
import { NavigationSection } from './sections/NavigationSection';
import { DataDisplaySection } from './sections/DataDisplaySection';
import { AvatarsTagsSection } from './sections/AvatarsTagsSection';
import { SurfacesSection } from './sections/SurfacesSection';
import { PopoversSection } from './sections/PopoversSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { LoadingSection } from './sections/LoadingSection';
import { LayoutSection } from './sections/LayoutSection';
import { IconsSection } from './sections/IconsSection';
import { AccessibilitySection } from './sections/AccessibilitySection';
import { SpecializedSection } from './sections/SpecializedSection';
import { AudimentAlternativesSection } from './sections/AudimentAlternativesSection';

interface CategoryNavItem {
  id: string;
  num: number;
  title: string;
  count: string;
}

const CATEGORIES: CategoryNavItem[] = [
  { id: 'typography', num: 1, title: 'Typography and text', count: '4 components' },
  { id: 'buttons', num: 2, title: 'Buttons and actions', count: '5 components' },
  { id: 'inputs', num: 3, title: 'Text inputs and form controls', count: '6 components' },
  { id: 'pickers', num: 4, title: 'Selects, dropdowns and pickers', count: '5 components' },
  { id: 'toggles', num: 5, title: 'Checkboxes, radio and toggles', count: '4 components' },
  { id: 'navigation', num: 6, title: 'Navigation, tabs and menus', count: '5 components' },
  { id: 'data-display', num: 7, title: 'Tables, lists and data display', count: '6 components' },
  { id: 'avatars-tags', num: 8, title: 'Avatars, chips and tags', count: '7 components' },
  { id: 'surfaces', num: 9, title: 'Cards, surfaces and dialogs', count: '3 components' },
  { id: 'popovers', num: 10, title: 'Popovers and tooltips', count: '3 components' },
  { id: 'feedback', num: 11, title: 'Notifications, toasts and banners', count: '4 components' },
  { id: 'loading', num: 12, title: 'Loading states and skeletons', count: '5 components' },
  { id: 'layout', num: 13, title: 'Layout primitives and resizing', count: '5 components' },
  { id: 'icons', num: 14, title: 'Icons and icon utilities', count: '3 collections' },
  { id: 'accessibility', num: 15, title: 'Accessibility helpers', count: '2 utilities' },
  { id: 'specialized', num: 16, title: 'Specialized & boundary report', count: '4 primitives' },
];

function LoginFormReference() {
  return (
    <Card className="w-full max-w-[380px] mx-auto border-border/50 shadow-md backdrop-blur-sm bg-card/80">
      <CardHeader className="space-y-1.5 pb-5">
        <CardTitle className="text-lg font-normal text-heading">
          Sign in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[14px] font-normal text-body">
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="name@company.com"
              defaultValue="auditor@audiment.com"
              className="h-10 bg-background/50 text-[14px]"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[14px] font-normal text-body">
                Password
              </Label>
              <span className="text-[13px] text-primary hover:underline cursor-pointer font-normal">
                Forgot?
              </span>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              defaultValue="samplepass"
              className="h-10 bg-background/50 text-[14px]"
            />
          </div>

          <Button
            type="button"
            fullWidth
            variant="solid"
            color="accent"
            className="h-10 text-[14px] font-normal mt-2"
          >
            Sign in to Dashboard
          </Button>
        </form>

        <p className="text-center text-[14px] text-muted-text mt-4">
          Don&apos;t have an account?{' '}
          <span className="text-primary hover:underline cursor-pointer font-normal">
            Contact your administrator
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default function TwentyShowcasePage() {
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
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    Twenty UI Showcase
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck size={11} /> MIT Safe
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                    twenty-ui@2.46.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Proprietary SaaS Reusable Component Explorer · 16 Categories · 70+ Primitives
                </p>
              </div>
            </div>

            {/* Quick Actions & Theme Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="hidden md:inline-flex text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-2.5 py-1.5 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                Dashboard
              </Link>

              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(activeScheme === 'dark' ? 'light' : 'dark')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
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
                    {filteredCategories.length} / 16
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
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Navigation Links */}
                <nav className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 text-xs">
                  <a
                    href="#legal-audit"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={13} /> Legal Audit Report
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 px-1.5 py-0.2 rounded">
                      MIT
                    </span>
                  </a>

                  <a
                    href="#agpl-alternatives"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-800 dark:text-amber-300 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={13} /> High-Risk Alternatives
                    </span>
                    <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-900 px-1.5 py-0.2 rounded font-bold">
                      6 Safe
                    </span>
                  </a>

                  <a
                    href="#living-reference"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={13} className="text-amber-500" /> 14px Standard Card
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Spec</span>
                  </a>

                  <div className="pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5">
                    Component Inventory
                  </div>

                  {filteredCategories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#${cat.id}`}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <span className="truncate flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400 group-hover:text-blue-500">
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
                className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <ArrowUp size={13} /> Back to Top
              </button>
            </aside>

            {/* Main Showcase Feed */}
            <main className="lg:col-span-9 space-y-12">
              {/* Hero Banner */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/60 dark:to-blue-950/20 shadow-xs space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete Twenty UI Component Explorer
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-slate-900 dark:text-slate-100">
                    Twenty UI Reusable Component Showcase
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                    Interactive component laboratory containing all eligible primitives from <code className="text-xs bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">twenty-ui@2.46.0</code>. Verified safe for Audiment&apos;s proprietary commercial SaaS with 14px standardized inputs, Geist typography, and zero AGPL contamination.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">16 Categories</div>
                    <div className="text-[11px] text-slate-500">Fully implemented</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">MIT Licensed</div>
                    <div className="text-[11px] text-slate-500">Commercial safe</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">14px Standard</div>
                    <div className="text-[11px] text-slate-500">Harmonized tokens</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Zero AGPL</div>
                    <div className="text-[11px] text-slate-500">Isolated barrel</div>
                  </div>
                </div>
              </div>

              {/* Legal License Audit Report Card */}
              <div id="legal-audit" className="scroll-mt-24">
                <AuditLicenseReport />
              </div>

              {/* High-Risk AGPL Patterns vs. Audiment Safe Proprietary Alternatives */}
              <AudimentAlternativesSection />

              {/* Preserved Living UI Reference Standard */}
              <section id="living-reference" className="scroll-mt-24 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900/50 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-1">
                      <Sparkles className="w-3 h-3" /> Preserved 14px Living Reference Standard
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Harmonized Login Form Reference (14px Standard)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Title (18px font-normal) · Description (14px) · Labels (14px) · Inputs (14px / h-10) · Action Button (14px / h-10)
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    Living Ref
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
                  <div className="rounded-xl border border-slate-200 p-6 bg-slate-50/60 text-slate-900 shadow-xs">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">
                      Light Theme Reference (14px)
                    </div>
                    <ThemeProvider colorScheme="light" applyToRoot={false}>
                      <LoginFormReference />
                    </ThemeProvider>
                  </div>
                  <div className="rounded-xl border border-slate-800 p-6 bg-slate-950 text-slate-100 shadow-xs">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
                      Dark Theme Reference (14px)
                    </div>
                    <ThemeProvider colorScheme="dark" applyToRoot={false}>
                      <LoginFormReference />
                    </ThemeProvider>
                  </div>
                </div>
              </section>

              {/* All 16 Category Sections */}
              <div className="space-y-16">
                {/* 1. Typography */}
                <TypographySection />

                {/* 2. Buttons */}
                <ButtonsSection />

                {/* 3. Inputs */}
                <InputsSection />

                {/* 4. Pickers */}
                <PickersSection />

                {/* 5. Toggles */}
                <TogglesSection />

                {/* 6. Navigation */}
                <NavigationSection />

                {/* 7. Data Display */}
                <DataDisplaySection />

                {/* 8. Avatars, Chips & Tags */}
                <AvatarsTagsSection />

                {/* 9. Cards, Surfaces & Dialogs */}
                <SurfacesSection />

                {/* 10. Popovers & Tooltips */}
                <PopoversSection />

                {/* 11. Feedback & Toasts */}
                <FeedbackSection />

                {/* 12. Loading & Progress */}
                <LoadingSection />

                {/* 13. Layout & Resizing */}
                <LayoutSection />

                {/* 14. Icons */}
                <IconsSection />

                {/* 15. Accessibility Helpers */}
                <AccessibilitySection />

                {/* 16. Specialized Primitives & Boundaries */}
                <SpecializedSection />
              </div>
            </main>
          </div>
        </div>

        {/* Global Toaster for Twenty UI notifications */}
        <Toaster />
      </div>
    </ToastProvider>
  );
}
