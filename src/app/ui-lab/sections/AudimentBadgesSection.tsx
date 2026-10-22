'use client';

import * as React from 'react';
import { Tag, Check, AlertTriangle, Clock, Info } from 'lucide-react';
import { UniversalBadge } from '@/components/universal';

export function AudimentBadgesSection() {
  return (
    <div id="badges" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Tag size={15} /> Category 5
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Status Badges & Chips
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Standardized status tags consolidated from decisions: Completed, In-Progress, Severity Tiers, and Informational.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          UniversalBadge
        </span>
      </div>

      {/* 1. Audit Lifecycle States */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Audit Lifecycle Indicators
          </h3>
          <p className="text-xs text-muted-foreground">
            Standardized status badges for audit workflows: Completed, In Progress, and Assigned.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <UniversalBadge variant="completed" showIcon>
            Completed
          </UniversalBadge>

          <UniversalBadge variant="inProgress" showIcon>
            In Progress
          </UniversalBadge>

          <UniversalBadge variant="assigned">
            Assigned
          </UniversalBadge>

          <UniversalBadge variant="neutral">
            Draft
          </UniversalBadge>
        </div>
      </div>

      {/* 2. Violation Severity Tiers */}
      <div className="rounded-xl border border-border/50 p-5 bg-card space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Severity & Risk Badges
          </h3>
          <p className="text-xs text-muted-foreground">
            Color-coded tags for corrective actions and non-conformance classification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <UniversalBadge variant="highSeverity" showIcon>
            Critical Non-Compliance
          </UniversalBadge>

          <UniversalBadge variant="mediumSeverity">
            Medium Severity (48h)
          </UniversalBadge>

          <UniversalBadge variant="lowSeverity">
            Low Severity (Notice)
          </UniversalBadge>

          <UniversalBadge variant="informational">
            Internal Note
          </UniversalBadge>
        </div>
      </div>
    </div>
  );
}
