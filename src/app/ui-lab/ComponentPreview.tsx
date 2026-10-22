'use client';

import * as React from 'react';
import {
  Check,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  FileText,
  Sliders,
  Calendar,
  Eye,
  Camera,
  Trash2,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface ComponentPreviewProps {
  id: string;
  categoryCode: string;
  name: string;
  variant: string;
  classes?: string;
  spec?: any;
  large?: boolean;
}

export function ComponentPreview({
  id,
  categoryCode,
  name,
  variant,
  classes = '',
  spec,
  large = false
}: ComponentPreviewProps) {
  // Label helper to indicate faithful reproduction without executing destructive actions
  const reproductionBadge = (
    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted-foreground/70 uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/30">
      <Info className="h-2.5 w-2.5" /> Faithful Mock Preview
    </span>
  );

  // 1. Buttons and Actions
  if (categoryCode === 'BTN') {
    if (variant.includes('Filter Toolbar Button') || classes.includes('filter-btn')) {
      return (
        <div className="flex flex-col items-center gap-1.5 w-full">
          <button
            type="button"
            className="h-11 px-4 gap-2 font-medium text-[13px] border border-border/50 text-muted-foreground rounded-lg inline-flex items-center bg-white dark:bg-[#1E1E1E] shadow-2xs hover:bg-muted/40 transition-all duration-150 active:scale-[0.98]"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>Filter Audits</span>
            <ChevronDown className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
          </button>
          {large && reproductionBadge}
        </div>
      );
    }
    if (variant.includes('Icon Action Button') || classes.includes('icon-action-btn')) {
      return (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 active:scale-90 border border-border/20 bg-muted/20"
              title="More Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 active:scale-90 border border-border/20 bg-muted/20"
              title="Refresh Record"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          {large && reproductionBadge}
        </div>
      );
    }
    if (variant.includes('Tactile Spring Button') || classes.includes('apple-press')) {
      return (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground font-medium text-xs rounded-lg shadow-sm transition-transform duration-100 ease-out active:scale-[0.975] active:opacity-95 flex items-center gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tactile Spring Action</span>
          </button>
          {large && reproductionBadge}
        </div>
      );
    }
    if (variant.includes('Settings Nav Item') || classes.includes('settings-nav-btn')) {
      return (
        <div className="flex flex-col items-center gap-1.5 w-full max-w-[220px]">
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 w-full text-left bg-primary/5 text-primary border border-primary/20"
          >
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Profile & Security Settings</span>
          </button>
          {large && reproductionBadge}
        </div>
      );
    }
    if (variant.includes('Destructive')) {
      return (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            className="px-3.5 py-1.5 bg-destructive text-destructive-foreground font-medium text-xs rounded-lg shadow-xs hover:bg-destructive/90 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Record</span>
          </button>
          {large && reproductionBadge}
        </div>
      );
    }
    if (variant.includes('Outline')) {
      return (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            className="px-3.5 py-1.5 border border-border font-medium text-xs rounded-lg bg-background hover:bg-muted/50 transition-colors text-foreground flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Export Report</span>
          </button>
          {large && reproductionBadge}
        </div>
      );
    }
    if (variant.includes('Ghost')) {
      return (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            className="px-3.5 py-1.5 font-medium text-xs rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            Dismiss Action
          </button>
          {large && reproductionBadge}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          className="px-3.5 py-1.5 bg-primary text-primary-foreground font-medium text-xs rounded-lg shadow-xs hover:bg-primary/90 transition-colors"
        >
          Primary Button
        </button>
        {large && reproductionBadge}
      </div>
    );
  }

  // 2. Badges and Status Indicators
  if (categoryCode === 'BDG') {
    if (variant.includes('Completed') || classes.includes('badge-completed')) {
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border-none text-[12px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tracking-[0.02em]">
          <Check className="h-3 w-3" /> Completed
        </span>
      );
    }
    if (variant.includes('In Progress') || classes.includes('badge-in-progress')) {
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border-none text-[12px] font-medium bg-primary/10 text-primary tracking-[0.02em]">
          <Clock className="h-3 w-3 animate-spin" /> In Progress
        </span>
      );
    }
    if (variant.includes('Assigned') || classes.includes('badge-assigned')) {
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border-none text-[12px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 tracking-[0.02em]">
          Assigned
        </span>
      );
    }
    if (variant.includes('Missed') || variant.includes('Overdue') || variant.includes('High Severity') || classes.includes('badge-high')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border-none text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 tracking-[0.025em]">
          <AlertTriangle className="h-3 w-3" /> High Severity / Missed
        </span>
      );
    }
    if (variant.includes('Medium Severity') || classes.includes('badge-medium')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-none text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 tracking-[0.025em]">
          Medium Severity
        </span>
      );
    }
    if (variant.includes('Low Severity') || classes.includes('badge-low')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-none text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 tracking-[0.025em]">
          Low Severity
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
        Active Tag Indicator
      </span>
    );
  }

  // 3. Filters and Search Bars
  if (categoryCode === 'FIL') {
    if (variant.includes('Live Text Search Input') || variant.includes('Search Bar')) {
      return (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            readOnly
            value="Search audits by title, auditor or tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/60 bg-background text-foreground/80 cursor-default select-none shadow-2xs"
          />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 px-3 rounded-lg border border-border/60 bg-background text-xs font-medium flex items-center justify-between gap-4 text-foreground/80 shadow-2xs">
          <span className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>All Statuses (Completed, Assigned, Missed)</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  // 4. Form Controls and Inputs
  if (categoryCode === 'INP') {
    if (variant.includes('Multiline Textarea')) {
      return (
        <div className="w-full">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Corrective Action Plan / Observations
          </label>
          <textarea
            readOnly
            rows={2}
            value="Re-inspect cold storage thermostat; replace temperature log sensor within 48h."
            className="w-full p-2 text-xs rounded-lg border border-border/60 bg-background text-foreground/80 cursor-default resize-none shadow-2xs"
          />
        </div>
      );
    }
    return (
      <div className="w-full max-w-sm">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
          Store Location Identifier
        </label>
        <input
          type="text"
          readOnly
          value="Outlet #1042 — Mumbai Central Terminal"
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-border/60 bg-background text-foreground cursor-default shadow-2xs"
        />
      </div>
    );
  }

  // 5. Selects, Menus & Pickers
  if (categoryCode === 'SEL') {
    return (
      <div className="w-full max-w-xs border border-border/50 rounded-lg p-2 bg-background shadow-2xs text-xs">
        <div className="flex items-center justify-between text-muted-foreground pb-1.5 border-b border-border/30">
          <span className="font-medium text-foreground">Select Manager / Auditor</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
        <div className="mt-1.5 space-y-1 text-[11px]">
          <div className="p-1 rounded bg-primary/10 text-primary font-medium flex items-center justify-between">
            <span>Rajesh Kumar (Lead Auditor)</span>
            <Check className="h-3 w-3" />
          </div>
          <div className="p-1 text-muted-foreground hover:bg-muted/40 rounded">
            <span>Ananya Sharma (Safety Officer)</span>
          </div>
        </div>
      </div>
    );
  }

  // 6. Data Grids & Tables
  if (categoryCode === 'TBL') {
    return (
      <div className="w-full border border-border/40 rounded-lg overflow-hidden bg-background text-[11px] shadow-2xs">
        <div className="grid grid-cols-4 bg-muted/40 p-2 font-semibold text-muted-foreground border-b border-border/30">
          <div>Audit Title</div>
          <div>Location</div>
          <div>Status</div>
          <div className="text-right">Score</div>
        </div>
        <div className="grid grid-cols-4 p-2 border-b border-border/20 items-center">
          <div className="font-medium text-foreground">Food Safety Q3</div>
          <div className="text-muted-foreground truncate">Connaught Place</div>
          <div>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-medium">Passed</span>
          </div>
          <div className="text-right text-emerald-600 font-semibold">96.5%</div>
        </div>
        <div className="grid grid-cols-4 p-2 items-center bg-muted/5">
          <div className="font-medium text-foreground">Fire Safety Protocol</div>
          <div className="text-muted-foreground truncate">Indiranagar Outlet</div>
          <div>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-600 font-medium">Flagged</span>
          </div>
          <div className="text-right text-rose-600 font-semibold">72.0%</div>
        </div>
      </div>
    );
  }

  // 7. Cards and KPI Widgets
  if (categoryCode === 'CRD') {
    if (variant.includes('KPI Metric Display Card') || classes.includes('stat-number')) {
      return (
        <div className="p-3.5 rounded-xl border border-border/40 bg-background shadow-2xs w-full">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground block">
            Audit Compliance Rate
          </span>
          <div className="text-3xl font-bold tracking-[-0.03em] tabular-nums text-foreground mt-0.5">
            94.8%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
            <span>+2.4% vs previous 30 days</span>
          </div>
        </div>
      );
    }
    return (
      <div className="p-3.5 rounded-xl border border-border/40 bg-background shadow-2xs w-full">
        <div className="text-xs font-semibold text-foreground">Scheduled Verification Tasks</div>
        <div className="text-[11px] text-muted-foreground mt-1">
          4 audits assigned for today across 2 regional zones
        </div>
      </div>
    );
  }

  // 8. Dialogs, Modals, and Drawers
  if (categoryCode === 'MOD') {
    return (
      <div className="p-3.5 border border-border/50 rounded-xl bg-background shadow-sm max-w-sm w-full">
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <span className="text-xs font-semibold text-foreground">Resolve Non-Conformance Action</span>
          <span className="text-[10px] text-muted-foreground">Esc to close</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Confirm resolution for Flagged Item #CA-204? Photo proof has been attached and verified.
        </p>
        <div className="mt-3.5 flex justify-end gap-2">
          <button type="button" className="px-2.5 py-1 rounded text-[11px] border border-border text-muted-foreground">Cancel</button>
          <button type="button" className="px-2.5 py-1 rounded text-[11px] bg-primary text-primary-foreground font-medium shadow-2xs">Confirm Resolution</button>
        </div>
      </div>
    );
  }

  // 9. Tabs and Navigation
  if (categoryCode === 'NAV') {
    if (variant.includes('Segment Switcher Pill') || classes.includes('segment-btn')) {
      return (
        <div className="bg-muted/40 p-1 rounded-lg inline-flex gap-1 border border-border/20">
          <div className="px-3 py-1 rounded-md text-[11px] font-medium bg-background text-foreground shadow-2xs">
            Overview
          </div>
          <div className="px-3 py-1 rounded-md text-[11px] font-medium text-muted-foreground">
            Audit History
          </div>
          <div className="px-3 py-1 rounded-md text-[11px] font-medium text-muted-foreground">
            Analytics & Reports
          </div>
        </div>
      );
    }
    return (
      <div className="flex border-b border-border/40 gap-6 text-xs">
        <span className="border-b-2 border-primary text-primary font-medium pb-1.5">Active Audits</span>
        <span className="text-muted-foreground pb-1.5">Flagged Issues (3)</span>
        <span className="text-muted-foreground pb-1.5">Archived History</span>
      </div>
    );
  }

  // 10. Skeletons and Loading Indicators
  if (categoryCode === 'SKL') {
    return (
      <div className="space-y-2 w-full max-w-[200px]">
        <div className="h-4 bg-muted/80 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
        <div className="h-3 bg-muted/40 rounded animate-pulse w-5/6" />
      </div>
    );
  }

  // 11. Empty and Error States
  if (categoryCode === 'EMP') {
    return (
      <div className="p-4 rounded-xl border border-dashed border-border/70 bg-muted/10 text-center w-full max-w-sm">
        <div className="h-8 w-8 rounded-full bg-muted/50 mx-auto flex items-center justify-center text-muted-foreground mb-1.5">
          <Search className="h-4 w-4" />
        </div>
        <div className="text-xs font-semibold text-foreground">No Audits Found</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          Try resetting your date range or role filters
        </div>
      </div>
    );
  }

  // 12. Charts and Visualizations
  if (categoryCode === 'CHT') {
    return (
      <div className="p-3 border border-border/40 rounded-xl bg-background w-full max-w-sm flex flex-col gap-2">
        <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
          <span>Weekly Compliance Trend</span>
          <span className="text-emerald-600 font-bold">Avg 92.4%</span>
        </div>
        <div className="flex items-end gap-2 h-16 w-full pt-2">
          <div className="flex-1 bg-primary/20 h-8 rounded-t" />
          <div className="flex-1 bg-primary/40 h-10 rounded-t" />
          <div className="flex-1 bg-primary/60 h-14 rounded-t" />
          <div className="flex-1 bg-primary h-16 rounded-t" />
          <div className="flex-1 bg-primary/80 h-12 rounded-t" />
          <div className="flex-1 bg-primary/90 h-15 rounded-t" />
        </div>
      </div>
    );
  }

  // 13. Specialized Audit Execution Components
  if (categoryCode === 'SPU') {
    return (
      <div className="p-3 border border-primary/25 bg-primary/5 rounded-xl w-full max-w-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
            1
          </div>
          <span className="text-xs font-semibold text-foreground">Geo-Tagged Live Camera Verification</span>
        </div>
        <div className="mt-2.5 h-12 rounded-lg border border-dashed border-primary/40 bg-background/80 flex items-center justify-center gap-2 text-xs text-primary font-medium">
          <Camera className="h-4 w-4" />
          <span>Tap to capture mandatory photo proof</span>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs text-muted-foreground font-mono">
      {variant || name}
    </div>
  );
}
