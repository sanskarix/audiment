'use client';

import * as React from 'react';
import { Layers, CheckCircle, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  UniversalCard,
  UniversalCardHeader,
  UniversalCardTitle,
  UniversalCardDescription,
  UniversalMetricCard,
  UniversalBadge,
} from '@/components/universal';

export function AudimentCardsSection() {
  return (
    <div id="cards" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Layers size={15} /> Category 7
          </div>
          <h2 className="text-xl font-medium tracking-tight mt-1 text-foreground">
            Cards & KPI Dashboards
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal card containers and metric hero widgets consolidated from VAR-CRD-SURFACE and VAR-CRD-KPI-HERO.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono">
          UniversalCard
        </span>
      </div>

      {/* 1. Hero KPI Metric Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            KPI Metric Stat Cards (`UniversalMetricCard`)
          </h3>
          <p className="text-xs text-muted-foreground">
            Standardized hero statistic cards with percentage trends and secondary indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UniversalMetricCard
            label="Overall Compliance"
            value="94.8%"
            trend={{ value: "+3.2%", isPositive: true }}
            subtext="Across 128 branches"
          />

          <UniversalMetricCard
            label="Open Corrective Actions"
            value="18"
            trend={{ value: "-5 items", isPositive: true }}
            subtext="4 pending verification"
          />

          <UniversalMetricCard
            label="Critical Flag Violations"
            value="3"
            trend={{ value: "+1 today", isPositive: false }}
            subtext="Immediate review required"
          />
        </div>
      </div>

      {/* 2. Structured Card Containers */}
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Standard Surface Card (`UniversalCard`)
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard card containers with headers, dividers, and content sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UniversalCard>
            <UniversalCardHeader>
              <div className="flex items-center justify-between">
                <UniversalCardTitle>Branch Hygiene Verification</UniversalCardTitle>
                <UniversalBadge variant="completed" size="sm">Passed</UniversalBadge>
              </div>
              <UniversalCardDescription>
                Audited by Rajesh Sharma at 10:45 AM today
              </UniversalCardDescription>
            </UniversalCardHeader>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                All 42 checklist points verified with geo-fencing timestamp and photo proof attached. No critical infractions found in cold storage.
              </p>
            </div>
          </UniversalCard>

          <UniversalCard>
            <UniversalCardHeader>
              <div className="flex items-center justify-between">
                <UniversalCardTitle>Escalated Corrective Action</UniversalCardTitle>
                <UniversalBadge variant="highSeverity" size="sm">Urgent</UniversalBadge>
              </div>
              <UniversalCardDescription>
                Fire exit obstruction observed at Sector 18 warehouse
              </UniversalCardDescription>
            </UniversalCardHeader>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Emergency exit doors blocked with surplus carton packaging. Immediate resolution required within 4 hours.
              </p>
            </div>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
