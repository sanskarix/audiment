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
  title: 'Compare Audit Software | Audiment vs Alternatives',
  description: 'See how Audiment compares to SafetyCulture, GoAudits, Zenput, Jolt, and generic checklist apps. Detailed feature-by-feature comparison for multi-location operations teams.',
  path: '/compare',
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Audit Software Comparisons",
  "itemListElement": comparisons.map((c, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": c.title,
    "url": `https://audiment.in${c.href}`,
  })),
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
        id="compare-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
