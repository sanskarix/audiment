import React from 'react';
import Script from 'next/script';
import { buildPageMeta } from '@/lib/seo';
import { AudimentUseCasesClient } from '@/components/use-cases/AudimentUseCasesClient';

const useCases = [
  {
    title: 'Digital Audit Checklists',
    href: '/use-cases/audit-checklist-software',
  },
  {
    title: 'Inspection Management',
    href: '/use-cases/inspection-management-software',
  },
  {
    title: 'Multi-Location Compliance',
    href: '/use-cases/multi-location-compliance',
  },
  {
    title: 'Corrective Action Tracking',
    href: '/use-cases/corrective-action-tracking',
  },
];

export const metadata = buildPageMeta({
  title: 'Use Cases | Audit Management Software for Operations Teams',
  description: 'Explore how multi-location operations teams use Audiment for digital audit checklists, inspection management, compliance tracking, and corrective action workflows.',
  path: '/use-cases',
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Audit Management Use Cases",
  "itemListElement": useCases.map((uc, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": uc.title,
    "url": `https://audiment.in${uc.href}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://audiment.in/use-cases" },
  ],
};

export default function UseCasesHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentUseCasesClient />
    </>
  );
}
