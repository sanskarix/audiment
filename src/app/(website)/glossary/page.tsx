import React from 'react';
import Script from 'next/script';
import { buildPageMeta } from '@/lib/seo';
import { AudimentGlossaryClient } from '@/components/glossary/AudimentGlossaryClient';

export const metadata = buildPageMeta({
  title: 'Multi-Location Operations & Audit Glossary',
  description: 'Authoritative B2B glossary defining operational drift, proof-based audits, CAPA tracking, FSSAI compliance, QSR checklists, and geo-verified field audits.',
  path: '/glossary',
  keywords: [
    'audit glossary',
    'operational drift definition',
    'proof-based audit',
    'FSSAI compliance audit',
    'CAPA tracking',
    'QSR operational checklist',
    'geo-verified audit'
  ],
});

const definedTermSetSchema = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': 'https://audiment.in/glossary/#definedtermset',
  name: 'Multi-Location Operations & Audit Glossary',
  url: 'https://audiment.in/glossary',
  description: 'Industry glossary of audit management, food safety compliance, and operational execution terms.',
  publisher: {
    '@id': 'https://audiment.in/#organization',
  },
  hasDefinedTerm: [
    {
      '@type': 'DefinedTerm',
      name: 'Operational Drift',
      description: 'The subtle, unmonitored decay of operational standards across distributed locations over time.',
      url: 'https://audiment.in/glossary#operational-drift'
    },
    {
      '@type': 'DefinedTerm',
      name: 'Proof-Based Audits',
      description: 'An inspection workflow requiring mandatory photo, video, or sensor evidence for critical checklist items.',
      url: 'https://audiment.in/glossary#proof-based-audits'
    },
    {
      '@type': 'DefinedTerm',
      name: 'Corrective Actions (CAPA)',
      termCode: 'CAPA',
      description: 'Automated workflow that transforms audit failures into trackable, deadline-bound resolution tasks.',
      url: 'https://audiment.in/glossary#corrective-action-tracking-capa'
    },
    {
      '@type': 'DefinedTerm',
      name: 'FSSAI Compliance Audit',
      termCode: 'FSSAI',
      description: 'Standardized food safety and hygiene inspection adhering to the Food Safety and Standards Authority of India mandates.',
      url: 'https://audiment.in/glossary#fssai-compliance-audit'
    },
    {
      '@type': 'DefinedTerm',
      name: 'Geo-Verified Field Audit',
      termCode: 'GPS Audit',
      description: 'Audit execution backed by mobile GPS geolocation and timestamp validation to confirm auditor presence.',
      url: 'https://audiment.in/glossary#geo-verified-field-audit'
    }
  ]
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://audiment.in/glossary/#breadcrumb',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://audiment.in/glossary' },
  ],
};

export default function GlossaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentGlossaryClient />
    </>
  );
}
