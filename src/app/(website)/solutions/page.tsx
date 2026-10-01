import React from 'react';
import Script from 'next/script';
import { buildPageMeta } from '@/lib/seo';
import { AudimentSolutionsClient } from '@/components/solutions/AudimentSolutionsClient';

const solutions = [
  {
    title: 'Restaurant Audit Software',
    href: '/solutions/restaurant-audit-software',
  },
  {
    title: 'QSR Audit Software',
    href: '/solutions/qsr-audit-software',
  },
  {
    title: 'Food Safety Audit Software',
    href: '/solutions/food-safety-audit-software',
  },
  {
    title: 'Retail Audit Software',
    href: '/solutions/retail-audit-software',
  },
  {
    title: 'Franchise Audit Software',
    href: '/solutions/franchise-audit-software',
  },
  {
    title: 'Hotel Audit Software',
    href: '/solutions/hotel-audit-software',
  },
  {
    title: 'Manufacturing Audit Software',
    href: '/solutions/manufacturing-audit-software',
  },
];

export const metadata = buildPageMeta({
  title: 'Audit Management Software by Industry | Audiment Solutions',
  description: 'Audit management software configured for restaurants, QSR, retail, hotels, franchises, and manufacturing. Proof-based audits, issue tracking, and corrective actions for every industry.',
  path: '/solutions',
  keywords: ['audit management software', 'industry audit software', 'restaurant audit', 'hotel audit', 'retail compliance software', 'QSR audit'],
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Audit Software by Industry",
  "description": "Audit management software solutions for different industries",
  "itemListElement": solutions.map((s, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": s.title,
    "url": `https://audiment.in${s.href}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
    { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://audiment.in/solutions" },
  ],
};

export default function SolutionsHub() {
  return (
    <>
      <Script
        id="solutions-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="solutions-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentSolutionsClient />
    </>
  );
}
