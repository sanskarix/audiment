'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

// ─── Inline SVG Line-Art Icons ───────────────────────────────────────────────

const IconSVG: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'scale':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case 'barChart':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      );
    case 'zap':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'wrench':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'fileText':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      );
    case 'utensils':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
          <path d="M15 2v18" />
          <path d="M7 2v20" />
          <path d="M4 2v4a3 3 0 0 0 3 3" />
        </svg>
      );
    case 'store':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
        </svg>
      );
    case 'shieldCheck':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'cog':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case 'building':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
          <path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M12 10h.01" />
          <path d="M8 14h.01" /><path d="M16 14h.01" /><path d="M12 14h.01" />
        </svg>
      );
    case 'lock':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'dna':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 15 6-6" /><path d="m9 22 3-3" /><path d="m2 9 3-3" /><path d="m15 2 3 3" />
          <path d="m15 22 7-7" /><path d="m22 9-6-6" />
          <path d="m8 10 8 8" /><path d="m10 6 8 8" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
};

// ─── Asellus Dot-Border Button ───────────────────────────────────────────────

const DotBtn: React.FC<{
  label: React.ReactNode;
  variant?: 'default' | 'orange' | 'dark';
  href?: string;
  calAttrs?: Record<string, string>;
  id?: string;
}> = ({ label, variant = 'default', href, calAttrs, id }) => {
  const wrapClass = `btn-wrapper${variant === 'orange' ? ' btn-wrapper--orange' : variant === 'dark' ? ' btn-wrapper--dark' : ''}`;
  const btnClass = `button${variant === 'orange' ? ' button--orange' : ''}`;
  const inner = (
    <>
      <span className="dot top left" />
      <span className="dot top right" />
      <span className="dot bottom left" />
      <span className="dot bottom right" />
      <span className="line horizontal top" />
      <span className="line horizontal bottom" />
      <span className="line vertical left" />
      <span className="line vertical right" />
    </>
  );
  if (calAttrs) {
    return (
      <div className={wrapClass}>
        {inner}
        <a className={btnClass} href="javascript:void(0);" id={id} {...calAttrs}>{label}</a>
      </div>
    );
  }
  return (
    <div className={wrapClass}>
      {inner}
      <a className={btnClass} href={href ?? '#'} id={id}>{label}</a>
    </div>
  );
};

// ─── Comparisons Data (All 32 Categories & Guides) ──────────────────────────

export type CategoryKey = 'all' | 'frontline' | 'grc' | 'qms';

interface ComparisonItem {
  num: string;
  title: string;
  categoryKey: 'frontline' | 'grc' | 'qms';
  categoryLabel: string;
  description: string;
  href: string;
  iconKey: string;
}

const comparisonsData: ComparisonItem[] = [
  // ── Category 1: Frontline & Multi-Unit Operations (16) ──
  {
    num: '01',
    title: 'Audiment vs SafetyCulture (iAuditor)',
    categoryKey: 'frontline',
    categoryLabel: 'Frontline Inspection',
    description: 'How Audiment compares on live photo verification, 48-hour automated CAPA SLAs, and flat per-location pricing.',
    href: '/compare/audiment-vs-safetyculture',
    iconKey: 'scale',
  },
  {
    num: '02',
    title: 'Audiment vs GoAudits',
    categoryKey: 'frontline',
    categoryLabel: 'Hospitality Audits',
    description: 'Compare evidence collection, corrective action accountability, and audit reliability for multi-location operations.',
    href: '/compare/audiment-vs-goaudits',
    iconKey: 'barChart',
  },
  {
    num: '03',
    title: 'Audiment vs Zenput (Crunchtime)',
    categoryKey: 'frontline',
    categoryLabel: 'Restaurant Ops',
    description: 'Deployment speed, FSSAI compliance support, and execution verification for APAC and US operations.',
    href: '/compare/audiment-vs-zenput',
    iconKey: 'zap',
  },
  {
    num: '04',
    title: 'Audiment vs Jolt',
    categoryKey: 'frontline',
    categoryLabel: 'Kitchen Task Management',
    description: 'Hardware requirements, multi-location scope, and corrective action escalation workflows compared.',
    href: '/compare/audiment-vs-jolt',
    iconKey: 'wrench',
  },
  {
    num: '05',
    title: 'Audiment vs MeazureUp',
    categoryKey: 'frontline',
    categoryLabel: 'Restaurant Audits',
    description: 'Multi-unit restaurant audits, live-camera anti-pencil-whipping, 48-hour auto-CAPA SLAs, and transparent per-location pricing.',
    href: '/compare/audiment-vs-meazureup',
    iconKey: 'utensils',
  },
  {
    num: '06',
    title: 'Audiment vs Bindy (Compliantia)',
    categoryKey: 'frontline',
    categoryLabel: 'Retail Standards',
    description: 'Retail brand standards, audit lock time-windows, weighted critical failure scoring, and multi-branch trend detection.',
    href: '/compare/audiment-vs-bindy',
    iconKey: 'store',
  },
  {
    num: '07',
    title: 'Audiment vs Lumiform',
    categoryKey: 'frontline',
    categoryLabel: 'Mobile Checklists',
    description: 'Per-location vs €100/seat frontline pricing, photo gallery blocking, and multi-location operational drift tracking.',
    href: '/compare/audiment-vs-lumiform',
    iconKey: 'shieldCheck',
  },
  {
    num: '08',
    title: 'Audiment vs MaintainX',
    categoryKey: 'frontline',
    categoryLabel: 'Facility CMMS',
    description: 'Operational brand audits vs CMMS work orders: anti-fraud presence, surprise audits, and frontline pricing.',
    href: '/compare/audiment-vs-maintainx',
    iconKey: 'cog',
  },
  {
    num: '09',
    title: 'Audiment vs Checklist Apps',
    categoryKey: 'frontline',
    categoryLabel: 'Basic Checklists',
    description: 'Why generic checklist apps break at scale and how proof-based audits create operational accountability.',
    href: '/compare/audiment-vs-checklist-apps',
    iconKey: 'fileText',
  },
  {
    num: '10',
    title: 'Audiment vs Checkbuster',
    categoryKey: 'frontline',
    categoryLabel: 'Safety & ISO Audits',
    description: 'Mobile safety forms vs proof-based store audits with live camera enforcement, GPS gating, and 48-hour CAPA SLAs.',
    href: '/compare/audiment-vs-checkbuster',
    iconKey: 'clipboard',
  },
  {
    num: '11',
    title: 'Audiment vs Form.com (Diversified Logix)',
    categoryKey: 'frontline',
    categoryLabel: 'Enterprise Mobile Forms',
    description: 'Heavy legacy enterprise form builders vs modern store operational accountability with automated CAPA escalation.',
    href: '/compare/audiment-vs-form-com',
    iconKey: 'clipboard',
  },
  {
    num: '12',
    title: 'Audiment vs DeviceMagic',
    categoryKey: 'frontline',
    categoryLabel: 'Field Data Collection',
    description: 'Mobile data dispatch forms vs structured multi-location store audit scoring, anti-cheating, and trend detection.',
    href: '/compare/audiment-vs-devicemagic',
    iconKey: 'clipboard',
  },
  {
    num: '13',
    title: 'Audiment vs ProntoForms (TrueContext)',
    categoryKey: 'frontline',
    categoryLabel: 'Field Service Workflows',
    description: 'Heavy field engineering dispatch vs agile retail/restaurant store walk audits with zero per-seat penalty.',
    href: '/compare/audiment-vs-prontoforms',
    iconKey: 'wrench',
  },
  {
    num: '14',
    title: 'Audiment vs Fluix',
    categoryKey: 'frontline',
    categoryLabel: 'Document Workflow & E-Sign',
    description: 'PDF form routing and signature capture vs proof-driven physical store audits, live camera gating, and automated CAPA.',
    href: '/compare/audiment-vs-fluix',
    iconKey: 'fileText',
  },
  {
    num: '15',
    title: 'Audiment vs Fulcrum',
    categoryKey: 'frontline',
    categoryLabel: 'GIS Field Mapping',
    description: 'Geospatial utility mapping vs commercial retail and restaurant brand standards, hygiene checks, and branch benchmarking.',
    href: '/compare/audiment-vs-fulcrum',
    iconKey: 'scale',
  },
  {
    num: '16',
    title: 'Audiment vs MyFieldAudits',
    categoryKey: 'frontline',
    categoryLabel: 'Hospitality Auditing',
    description: 'Hospitality quality checklists vs automated 48-hour CAPA SLAs, Audit Lock Guard, and Flashmob mass inspections.',
    href: '/compare/audiment-vs-myfieldaudits',
    iconKey: 'utensils',
  },

  // ── Category 2: Corporate Internal Audit, SOX & GRC (10) ──
  {
    num: '17',
    title: 'Audiment vs AuditBoard',
    categoryKey: 'grc',
    categoryLabel: 'Corporate SOX & GRC',
    description: 'Frontline physical store walkthroughs vs corporate financial SOX 404 testing and audit committee governance.',
    href: '/compare/audiment-vs-auditboard',
    iconKey: 'building',
  },
  {
    num: '18',
    title: 'Audiment vs Hyperproof',
    categoryKey: 'grc',
    categoryLabel: 'IT Security Compliance',
    description: 'Physical store hygiene and brand audits vs cloud IT security compliance (SOC 2, ISO 27001, HIPAA).',
    href: '/compare/audiment-vs-hyperproof',
    iconKey: 'lock',
  },
  {
    num: '19',
    title: 'Audiment vs SAP Audit Management',
    categoryKey: 'grc',
    categoryLabel: 'Enterprise ERP Auditing',
    description: 'Lightweight smartphone store inspections vs heavyweight corporate SAP ERP internal audit engagements.',
    href: '/compare/audiment-vs-sap-audit-management',
    iconKey: 'building',
  },
  {
    num: '20',
    title: 'Audiment vs TeamMate+ (Wolters Kluwer)',
    categoryKey: 'grc',
    categoryLabel: 'Internal Audit Management',
    description: 'Retail store walk-throughs and 48-hour SLAs vs annual internal audit charters, workpapers, and board oversight.',
    href: '/compare/audiment-vs-teammate',
    iconKey: 'building',
  },
  {
    num: '21',
    title: 'Audiment vs Diligent HighBond',
    categoryKey: 'grc',
    categoryLabel: 'Enterprise GRC & Risk',
    description: 'Store floor operational execution vs corporate enterprise risk management (ERM), ACL analytics, and board portals.',
    href: '/compare/audiment-vs-diligent-highbond',
    iconKey: 'shieldCheck',
  },
  {
    num: '22',
    title: 'Audiment vs Onspring',
    categoryKey: 'grc',
    categoryLabel: 'No-Code GRC & Governance',
    description: 'No-code corporate vendor risk databases vs purpose-built store audit scoring, live camera proof, and GPS gating.',
    href: '/compare/audiment-vs-onspring',
    iconKey: 'building',
  },
  {
    num: '23',
    title: 'Audiment vs LogicGate Risk Cloud',
    categoryKey: 'grc',
    categoryLabel: 'Corporate Risk Cloud',
    description: 'Enterprise risk quantification and vendor risk vs multi-unit restaurant and retail branch operational drift prevention.',
    href: '/compare/audiment-vs-logicgate',
    iconKey: 'shieldCheck',
  },
  {
    num: '24',
    title: 'Audiment vs MetricStream',
    categoryKey: 'grc',
    categoryLabel: 'Global Enterprise GRC',
    description: 'Global corporate governance matrices vs fast, mobile-first store floor audits with zero complex IT implementation.',
    href: '/compare/audiment-vs-metricstream',
    iconKey: 'building',
  },
  {
    num: '25',
    title: 'Audiment vs Resolver',
    categoryKey: 'grc',
    categoryLabel: 'Enterprise Risk & Security',
    description: 'Corporate incident management and enterprise risk vs daily store hygiene, visual merchandising, and 48-hour CAPA SLAs.',
    href: '/compare/audiment-vs-resolver',
    iconKey: 'shieldCheck',
  },
  {
    num: '26',
    title: 'Audiment vs Fastpath',
    categoryKey: 'grc',
    categoryLabel: 'ERP Access & SOD',
    description: 'Physical store walk audits vs ERP Segregation of Duties (SOD), user provisioning, and financial access controls.',
    href: '/compare/audiment-vs-fastpath',
    iconKey: 'lock',
  },

  // ── Category 3: Life Sciences & Quality Management (QMS) (6) ──
  {
    num: '27',
    title: 'Audiment vs Firstify (formerly Intellect)',
    categoryKey: 'qms',
    categoryLabel: 'Configurable QMS',
    description: 'Regulated manufacturing QMS and ISO 14001 vs commercial retail and restaurant store audits with instant PWA deployment.',
    href: '/compare/audiment-vs-firstify',
    iconKey: 'cog',
  },
  {
    num: '28',
    title: 'Audiment vs QT9 QMS',
    categoryKey: 'qms',
    categoryLabel: 'Manufacturing Quality QMS',
    description: 'Factory calibration and document control vs multi-location retail brand standards, food safety, and branch drift alerts.',
    href: '/compare/audiment-vs-qt9-qms',
    iconKey: 'cog',
  },
  {
    num: '29',
    title: 'Audiment vs Greenlight Guru',
    categoryKey: 'qms',
    categoryLabel: 'MedTech & ISO 13485 QMS',
    description: 'Medical device design controls and FDA 21 CFR 820 vs physical commercial store operational inspections and rapid CAPA.',
    href: '/compare/audiment-vs-greenlight-guru',
    iconKey: 'dna',
  },
  {
    num: '30',
    title: 'Audiment vs Veeva Vault Quality',
    categoryKey: 'qms',
    categoryLabel: 'Life Sciences GxP QMS',
    description: 'Pharmaceutical clinical trials and FDA 21 CFR Part 11 batch records vs multi-branch food hygiene and store walk audits.',
    href: '/compare/audiment-vs-veeva-vault',
    iconKey: 'dna',
  },
  {
    num: '31',
    title: 'Audiment vs ComplianceQuest',
    categoryKey: 'qms',
    categoryLabel: 'Salesforce-Native QMS',
    description: 'Salesforce-based manufacturing QMS/EHS suites vs agile, lightweight mobile store audits with flat per-location pricing.',
    href: '/compare/audiment-vs-compliancequest',
    iconKey: 'shieldCheck',
  },
  {
    num: '32',
    title: 'Audiment vs MasterControl Quality Excellence',
    categoryKey: 'qms',
    categoryLabel: 'Pharma & Biotech QMS',
    description: 'Life sciences electronic batch records (EBR) vs frontline store audits, live camera anti-cheating, and 48-hour CAPA SLAs.',
    href: '/compare/audiment-vs-mastercontrol',
    iconKey: 'dna',
  },
];

export function AudimentCompareClient() {
  const cal = getCalAttributes('general');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComparisons = comparisonsData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.categoryKey === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let t1: ReturnType<typeof setTimeout> | undefined;

    const onLoad = () => ScrollTrigger.refresh();

    const initHeavy = () => {
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      ticker = (time: number) => {
        if (lenis) lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      observeDotBorderButtons();
      observeAnimations();
      initCalEmbed();

      t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
      window.addEventListener('load', onLoad);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHeavy, { timeout: 1200 });
    } else {
      setTimeout(initHeavy, 300);
    }

    return () => {
      if (t1) clearTimeout(t1);
      window.removeEventListener('load', onLoad);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Fixed vertical guide lines matching Asellus ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
      <Header ctaId="aud-compare-nav-cta" />

      <main id="main-content" tabIndex={-1}>
        {/* ── §1 Hero Section (Exact Asellus .hero) ── */}
        <section className="hero">
          <h1>Compare <span className="muted">audit software</span></h1>
          <p>
            Every audit platform claims to digitize inspections. But operational outcomes hinge on physical evidence integrity, presence verification, automated CAPA SLAs, and flat pricing. Explore detailed comparisons below.
          </p>
          <div className="actions">
            <DotBtn id="aud-compare-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
          </div>
        </section>

        {/* ── §2 Category Filter & Search Bar ── */}
        <section
          style={{
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            background: 'var(--bg, #fbfbfb)',
            padding: '28px 32px',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { key: 'all', label: `All Comparisons (${comparisonsData.length})` },
                { key: 'frontline', label: 'Frontline & Retail / Food (16)' },
                { key: 'grc', label: 'Corporate Internal Audit & GRC (10)' },
                { key: 'qms', label: 'Life Sciences & QMS (6)' },
              ].map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key as CategoryKey)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      border: isActive ? '1px solid var(--orange, #ff5c00)' : '1px solid var(--line, #e5e5e5)',
                      background: isActive ? 'var(--orange, #ff5c00)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--ink, #1a1a1a)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div style={{ position: 'relative', minWidth: 260, flex: '1 1 240px', maxWidth: 360 }}>
              <input
                type="text"
                placeholder="Search competitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 36px',
                  borderRadius: 8,
                  fontSize: '13.5px',
                  border: '1px solid var(--line, #e5e5e5)',
                  background: '#ffffff',
                  color: 'var(--ink, #1a1a1a)',
                  outline: 'none',
                }}
              />
              <svg
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 15,
                  height: 15,
                  color: '#9a9a9a',
                  pointerEvents: 'none',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9a9a9a',
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── §3 Comparison Cards Grid (Asellus .work-grid.patterned) ── */}
        <section className="work-grid patterned" id="comparisons" style={{ borderBottom: '1px solid var(--line)' }}>
          {filteredComparisons.length === 0 ? (
            <div style={{ padding: '80px 32px', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '18px', color: 'var(--muted)', margin: '0 0 16px' }}>
                No comparisons found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  background: 'var(--ink, #1a1a1a)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredComparisons.map((comp) => (
              <Link
                key={comp.title}
                href={comp.href}
                className="work-card three-areas-card-wrapper"
                style={{
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <div>
                  {/* Top: Index + Category Tag + Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#9a9a9a', fontSize: '12px', letterSpacing: '0.04em', fontWeight: 600 }}>
                        {comp.num}
                      </span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(0,0,0,0.04)',
                          color: '#666',
                          fontWeight: 500,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {comp.categoryLabel}
                      </span>
                    </div>
                    <div style={{ color: 'var(--orange)', display: 'flex', alignItems: 'center' }}>
                      <IconSVG type={comp.iconKey} className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    margin: '0 0 14px',
                    fontSize: '21px',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.25,
                    color: 'var(--ink)',
                  }}>
                    {comp.title}
                  </h2>

                  {/* Description */}
                  <p style={{
                    margin: '0 0 28px',
                    color: 'var(--muted)',
                    fontSize: '14.5px',
                    lineHeight: 1.68,
                  }}>
                    {comp.description}
                  </p>
                </div>

                {/* Asellus ThreeAreas link */}
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <span className="service-link three-areas-link" style={{ margin: 0 }}>
                    Read Comparison →
                  </span>
                </div>
              </Link>
            ))
          )}
        </section>

        {/* ── §3.5 Industry-Specific Audit Software Guides ── */}
        <section style={{ padding: '80px 24px', background: '#faf9f6', borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '36px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>
                Industry Evaluations • 2026 Editions
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)', margin: '0 0 12px' }}>
                Industry-Specific Audit Software Guides
              </h2>
              <p style={{ margin: 0, fontSize: '15.5px', color: 'var(--muted)', maxWidth: '680px', lineHeight: 1.6 }}>
                Every sector operates under distinct compliance mandates and physical inspection workflows. Explore our in-depth evaluations across 15 operating industries.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                {
                  sector: 'Food Service',
                  title: 'Multi-Unit Restaurants & QSRs',
                  href: '/blog/best-restaurant-audit-software-multi-unit',
                  desc: 'FSSAI hygiene templates, temperature probe tracking, and live-camera anti-cheating.',
                },
                {
                  sector: 'Retail Chains',
                  title: 'Retail Stores & Visual Merchandising',
                  href: '/blog/best-retail-store-audit-software-chains',
                  desc: 'Planogram verification, promotional campaign rollouts, and store manager CAPAs.',
                },
                {
                  sector: 'Franchising',
                  title: 'Franchise Networks & Brand Standards',
                  href: '/blog/best-franchise-audit-software-brand-standards',
                  desc: 'Contractual cure-period tracking, dispute-free photo proof, and territory benchmarks.',
                },
                {
                  sector: 'Hospitality',
                  title: 'Hotels, Resorts & Serviced Apts',
                  href: '/blog/best-hotel-inspection-audit-software-hospitality',
                  desc: 'Housekeeping QA, Forbes/AAA standards, and instant engineering maintenance tickets.',
                },
                {
                  sector: 'Healthcare',
                  title: 'Hospitals & Healthcare Facilities',
                  href: '/blog/best-hospital-healthcare-inspection-software',
                  desc: 'Infection prevention, biomedical waste compliance, and continuous NABH/JCI readiness.',
                },
                {
                  sector: 'Life Sciences',
                  title: 'Pharmaceutical Plants & Cleanrooms',
                  href: '/blog/best-pharmaceutical-quality-audit-software-gxp',
                  desc: 'GxP plant floor inspections, cleanroom line clearances, and anti-backdating controls.',
                },
                {
                  sector: 'MedTech',
                  title: 'Medical Device Manufacturing (ISO 13485)',
                  href: '/blog/best-medical-device-quality-audit-software',
                  desc: 'Shop floor assembly audits, supplier site visits, and automated ISO 13485 CAPA loops.',
                },
                {
                  sector: 'Industrial',
                  title: 'Manufacturing Plants & 5S Safety',
                  href: '/blog/best-manufacturing-plant-audit-software-5s',
                  desc: '5S discipline, Total Productive Maintenance (TPM), and shop-floor safety rounds.',
                },
                {
                  sector: 'Food Manufacturing',
                  title: 'Food Processing & HACCP Plants',
                  href: '/blog/best-food-processing-haccp-audit-software',
                  desc: 'Critical Control Point monitoring, sanitary swab logging, and BRCGS audit readiness.',
                },
                {
                  sector: 'Logistics',
                  title: 'Warehouses, 3PLs & Distribution Hubs',
                  href: '/blog/best-warehouse-logistics-inspection-software',
                  desc: 'Pallet racking structural safety (EN 15635), dock checks, and MHE pre-shift audits.',
                },
                {
                  sector: 'Construction',
                  title: 'Construction Sites & Infrastructure',
                  href: '/blog/best-construction-site-inspection-software',
                  desc: 'OSHA 1926 safety inspections, QA/QC punch lists, and trade subcontractor verification.',
                },
                {
                  sector: 'Energy',
                  title: 'Energy, Oil, Gas & Remote Utilities',
                  href: '/blog/best-energy-utility-field-inspection-software',
                  desc: 'Offline remote asset inspections, pipeline safety, and GPS coordinate geofencing.',
                },
                {
                  sector: 'Corporate Governance',
                  title: 'Corporate Internal Audit & SOX Compliance',
                  href: '/blog/best-corporate-internal-audit-sox-software',
                  desc: 'Physical branch internal controls, fixed asset verification, and dual-custody cash testing.',
                },
                {
                  sector: 'Enterprise Risk',
                  title: 'Enterprise Risk Management (ERM) & Security',
                  href: '/blog/best-enterprise-risk-management-audit-software',
                  desc: 'Data center physical security, operational risk testing, and multi-site heatmaps.',
                },
                {
                  sector: 'Real Estate',
                  title: 'Commercial Facility & Property Management',
                  href: '/blog/best-commercial-facility-inspection-software',
                  desc: 'BOMA property standards, tenant turnover inspections, and vendor SLA enforcement.',
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="work-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px 20px',
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--orange)', marginBottom: '8px' }}>
                    {item.sector}
                  </span>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, margin: '0 0 8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                    {item.desc}
                  </p>
                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                    <span>Read Guide</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── §4 Bottom CTA Section (Exact Asellus .center-head) ── */}
        <section className="center-head" style={{ borderTop: 'none', padding: '110px 32px 120px' }}>
          <h2>Ready to see how Audiment works?</h2>
          <p style={{ marginTop: 14 }}>
            Book a discovery call and we&apos;ll walk you through how Audiment fits your specific operations.
          </p>
          <div className="actions">
            <DotBtn id="aud-compare-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer service="general" hideCta />
    </>
  );
}
