import React from 'react';
import Script from 'next/script';
import { buildPageMeta } from '@/lib/seo';
import { AudimentCompareClient } from '@/components/compare/AudimentCompareClient';

const comparisons = [
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
    title: 'Audiment vs Checklist Apps',
    href: '/compare/audiment-vs-checklist-apps',
  },
];

export const metadata = buildPageMeta({
  title: 'Compare Audit Software | Audiment vs Top Alternatives 2026',
  description: 'Compare Audiment to SafetyCulture, GoAudits, Zenput, Jolt, and generic checklist apps. Detailed feature-by-feature operational breakdown for multi-location operations teams.',
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
  "name": "Compare Audit Software | Audiment vs Top Alternatives 2026",
  "headline": "Compare Audit Software: Audiment vs Top Alternatives",
  "description": "See how Audiment compares to SafetyCulture, GoAudits, Zenput, Jolt, and generic checklist apps on evidence verification, CAPA workflows, and multi-location oversight.",
  "inLanguage": "en-US",
  "datePublished": "2025-01-15T00:00:00+05:30",
  "dateModified": "2026-10-22T00:00:00+05:30",
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
      <Script
        id="compare-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="compare-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="compare-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubFaqSchema) }}
      />
      <Script
        id="compare-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentCompareClient />
    </>
  );
}
