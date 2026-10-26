import React from 'react';
import Script from 'next/script';
import { buildPageMeta } from '@/lib/seo';
import { AudimentCompareClient } from '@/components/compare/AudimentCompareClient';

const comparisons = [
  // Frontline & Multi-Unit Audit Software
  {
    title: 'Audiment vs SafetyCulture (iAuditor)',
    href: '/compare/audiment-vs-safetyculture',
  },
  {
    title: 'Audiment vs GoAudits',
    href: '/compare/audiment-vs-goaudits',
  },
  {
    title: 'Audiment vs Zenput (Crunchtime)',
    href: '/compare/audiment-vs-zenput',
  },
  {
    title: 'Audiment vs Jolt',
    href: '/compare/audiment-vs-jolt',
  },
  {
    title: 'Audiment vs MeazureUp',
    href: '/compare/audiment-vs-meazureup',
  },
  {
    title: 'Audiment vs Bindy (Compliantia)',
    href: '/compare/audiment-vs-bindy',
  },
  {
    title: 'Audiment vs Lumiform',
    href: '/compare/audiment-vs-lumiform',
  },
  {
    title: 'Audiment vs MaintainX',
    href: '/compare/audiment-vs-maintainx',
  },
  {
    title: 'Audiment vs Checklist Apps',
    href: '/compare/audiment-vs-checklist-apps',
  },
  {
    title: 'Audiment vs Checkbuster',
    href: '/compare/audiment-vs-checkbuster',
  },
  {
    title: 'Audiment vs Form.com (Diversified Logix)',
    href: '/compare/audiment-vs-form-com',
  },
  {
    title: 'Audiment vs DeviceMagic',
    href: '/compare/audiment-vs-devicemagic',
  },
  {
    title: 'Audiment vs ProntoForms (TrueContext)',
    href: '/compare/audiment-vs-prontoforms',
  },
  {
    title: 'Audiment vs Fluix',
    href: '/compare/audiment-vs-fluix',
  },
  {
    title: 'Audiment vs Fulcrum',
    href: '/compare/audiment-vs-fulcrum',
  },
  {
    title: 'Audiment vs MyFieldAudits',
    href: '/compare/audiment-vs-myfieldaudits',
  },
  // Corporate Internal Audit, SOX & GRC
  {
    title: 'Audiment vs AuditBoard',
    href: '/compare/audiment-vs-auditboard',
  },
  {
    title: 'Audiment vs Hyperproof',
    href: '/compare/audiment-vs-hyperproof',
  },
  {
    title: 'Audiment vs SAP Audit Management',
    href: '/compare/audiment-vs-sap-audit-management',
  },
  {
    title: 'Audiment vs TeamMate+ (Wolters Kluwer)',
    href: '/compare/audiment-vs-teammate',
  },
  {
    title: 'Audiment vs Diligent HighBond',
    href: '/compare/audiment-vs-diligent-highbond',
  },
  {
    title: 'Audiment vs Onspring',
    href: '/compare/audiment-vs-onspring',
  },
  {
    title: 'Audiment vs LogicGate Risk Cloud',
    href: '/compare/audiment-vs-logicgate',
  },
  {
    title: 'Audiment vs MetricStream',
    href: '/compare/audiment-vs-metricstream',
  },
  {
    title: 'Audiment vs Resolver',
    href: '/compare/audiment-vs-resolver',
  },
  {
    title: 'Audiment vs Fastpath',
    href: '/compare/audiment-vs-fastpath',
  },
  // Life Sciences & Manufacturing QMS
  {
    title: 'Audiment vs Firstify (formerly Intellect)',
    href: '/compare/audiment-vs-firstify',
  },
  {
    title: 'Audiment vs QT9 QMS',
    href: '/compare/audiment-vs-qt9-qms',
  },
  {
    title: 'Audiment vs Greenlight Guru',
    href: '/compare/audiment-vs-greenlight-guru',
  },
  {
    title: 'Audiment vs Veeva Vault Quality',
    href: '/compare/audiment-vs-veeva-vault',
  },
  {
    title: 'Audiment vs ComplianceQuest',
    href: '/compare/audiment-vs-compliancequest',
  },
  {
    title: 'Audiment vs MasterControl Quality Excellence',
    href: '/compare/audiment-vs-mastercontrol',
  },
];

export const metadata = buildPageMeta({
  title: 'Compare Audit Software | Audiment vs 30+ Alternatives 2026',
  description: 'In-depth operational comparisons of Audiment against 30+ audit platforms, frontline inspection apps, corporate GRC software, and life sciences QMS suites. Unbiased breakdowns on evidence integrity, scoring math, presence verification, CAPA SLAs, and frontline pricing.',
  path: '/compare',
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Audit Software Commercial Comparisons",
  "itemListElement": comparisons.map((c, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": c.title,
    "url": `https://audiment.in${c.href}`,
  })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://audiment.in/compare/#webpage",
  "url": "https://audiment.in/compare",
  "name": "Compare Audit Software | Audiment vs 30+ Alternatives 2026",
  "headline": "Compare Audit Software: Audiment vs Top Alternatives",
  "description": "See how Audiment compares to SafetyCulture, GoAudits, Zenput, AuditBoard, Veeva Vault, MaintainX, ProntoForms, Fluix, and 25+ other platforms on evidence verification, CAPA workflows, and multi-location oversight.",
  "inLanguage": "en-US",
  "datePublished": "2025-01-15T00:00:00+05:30",
  "dateModified": "2026-10-26T00:00:00+05:30",
  "isPartOf": {
    "@id": "https://audiment.in/#website"
  },
  "publisher": {
    "@id": "https://audiment.in/#organization"
  }
};

const hubFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://audiment.in/compare/#faq",
  "isPartOf": {
    "@id": "https://audiment.in/#website"
  },
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How should multi-location operations teams evaluate audit management software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multi-location teams should evaluate audit platforms on four operational criteria: 1) Evidence integrity (live camera enforcement vs gallery uploads), 2) Auditor presence verification (GPS geofencing), 3) Corrective action follow-through (automated SLA task generation and photo-verified closure), and 4) Cost scalability (per-location pricing with unlimited users vs per-seat licensing)."
      }
    },
    {
      "@type": "Question",
      "name": "Why do traditional checklist apps fail at scale across 20+ locations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Traditional checklist apps rely on self-reported checkmarks without verifying physical presence or live photo proof, leading to rampant 'pencil-whipping'. Furthermore, they lack automated CAPA escalation, leaving compliance failures untracked in static spreadsheets."
      }
    },
    {
      "@type": "Question",
      "name": "How does Audiment pricing compare to competitor platforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most competitors charge per user or seat, which penalizes companies as they roll out access to shift managers and frontline staff. Audiment charges a flat, predictable per-location fee with unlimited users per branch, encouraging full team adoption without escalating software bills."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to migrate from an existing inspection platform to Audiment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most multi-location brands complete migration in 1 to 2 weeks. Audiment's dedicated onboarding team digitizes existing checklists, sets up branch hierarchies, and trains managers in a parallel trial before full rollout."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
    { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://audiment.in/compare" },
  ],
};

export default function CompareHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentCompareClient />
    </>
  );
}
