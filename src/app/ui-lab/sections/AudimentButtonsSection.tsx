'use client';

import * as React from 'react';
import {
  MousePointerClick,
  Plus,
  Download,
  Filter,
  Trash2,
  Check,
  Settings,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { UniversalButton } from '@/components/universal';

export function AudimentButtonsSection() {
  const [loading, setLoading] = React.useState(false);
  const [activeSettingsNav, setActiveSettingsNav] = React.useState('general');

  const handleSimulateClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div id="buttons" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <MousePointerClick size={15} /> Category 2
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Buttons and Actions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal button suite consolidated from decisions: Primary, Outline, Ghost, Filter Toolbar, and merged Settings-Nav.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          UniversalButton
        </span>
      </div>

      {/* 1. Core Button Variants */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Primary Variants (`variant=&quot;primary&quot; | &quot;outline&quot; | &quot;ghost&quot; | &quot;secondary&quot; | &quot;destructive&quot;`)
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard action controls with tactile micro-interaction press effects and focus rings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <UniversalButton variant="primary">
            <Plus size={14} />
            <span>New Inspection</span>
          </UniversalButton>

          <UniversalButton variant="outline">
            <Download size={14} />
            <span>Export Report</span>
          </UniversalButton>

          <UniversalButton variant="ghost">
            <span>Ghost Action</span>
          </UniversalButton>

          <UniversalButton variant="secondary">
            <span>Secondary Button</span>
          </UniversalButton>

          <UniversalButton variant="destructive">
            <Trash2 size={14} />
            <span>Delete Record</span>
          </UniversalButton>

          <UniversalButton
            variant="primary"
            onClick={handleSimulateClick}
            disabled={loading}
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            <span>{loading ? 'Processing...' : 'Simulate State'}</span>
          </UniversalButton>
        </div>
      </div>

      {/* 2. Specialized Variants: Filter Button & Settings Nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Filter Toolbar Button */}
        <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                Filter Toolbar Trigger (`variant=&quot;filter&quot;`)
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                VAR-BTN-FILTER-TOOLBAR
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standard 44px height table toolbar trigger with icon and label.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <UniversalButton variant="filter">
              <Filter size={14} />
              <span>Status: All Active</span>
            </UniversalButton>

            <UniversalButton variant="filter">
              <Filter size={14} />
              <span>Location: HQ North</span>
            </UniversalButton>
          </div>
        </div>

        {/* Merged Settings Nav Button */}
        <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                Settings Nav Item (`variant=&quot;settings-nav&quot;`)
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Merged VAR-BTN-SETTINGS-NAV
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unified settings sidebar button with active highlight state.
            </p>
          </div>

          <div className="space-y-1.5 pt-1 max-w-xs">
            <UniversalButton
              variant="settings-nav"
              isActive={activeSettingsNav === 'general'}
              onClick={() => setActiveSettingsNav('general')}
            >
              <Settings size={15} />
              <span>General Organization</span>
            </UniversalButton>
            <UniversalButton
              variant="settings-nav"
              isActive={activeSettingsNav === 'notifications'}
              onClick={() => setActiveSettingsNav('notifications')}
            >
              <RefreshCw size={15} />
              <span>Audit Automation</span>
            </UniversalButton>
          </div>
        </div>
      </div>

      {/* 3. Button Sizes */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Button Sizes (`size=&quot;sm&quot; | &quot;default&quot; | &quot;lg&quot; | &quot;icon&quot; | &quot;icon-sm&quot;`)
          </h3>
          <p className="text-xs text-muted-foreground">
            Consistent scale hierarchy across compact table rows up to hero actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <UniversalButton size="sm">Small (32px)</UniversalButton>
          <UniversalButton size="default">Default (40px)</UniversalButton>
          <UniversalButton size="lg">Large (48px)</UniversalButton>
          <UniversalButton size="icon" aria-label="Icon default">
            <Plus size={16} />
          </UniversalButton>
          <UniversalButton size="icon-sm" variant="outline" aria-label="Icon small">
            <Settings size={14} />
          </UniversalButton>
        </div>
      </div>
    </div>
  );
}
