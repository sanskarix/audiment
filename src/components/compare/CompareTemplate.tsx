import React from 'react';
import Script from 'next/script';
import {
  AudimentCompareDetailClient,
  CompareDetailProps,
  RelatedResource,
  RelatedComparison,
} from '@/components/compare/AudimentCompareDetailClient';
import { getCompareResources } from './compareResources';

interface CompareProps {
  competitor: string;
  heroH1: string;
  heroSubtext?: string;
  quickVerdict?: {
    verdictSummary: string;
    audimentBestFor: string;
    competitorBestFor: string;
  };
  lastUpdated?: string;
  competitorCategory?: string;
  whereAudimentWins: { title: string; text: string }[];
  whoShouldChooseCompetitor: { title: string; text: string }[];
  migrationReality?: {
    timeline: string;
    effort: string;
    support: string;
  };
  operationalDifferences: {
    area: string;
    audiment: string;
    competitor: string;
  }[];
  operationalOutcomeDifference?: {
    title: string;
    text: string;
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
  path: string;
  variant?: 'clean' | 'default';
  relatedGuides?: RelatedResource[];
  relatedComparisons?: RelatedComparison[];
}

export default function CompareTemplate({
  competitor,
  heroH1,
  heroSubtext,
  quickVerdict,
  lastUpdated = 'October 2026',
  competitorCategory,
  whereAudimentWins,
  whoShouldChooseCompetitor,
  migrationReality,
  operationalDifferences,
  operationalOutcomeDifference,
  faqs: customFaqs,
  path,
  variant = 'clean',
  relatedGuides: customRelatedGuides,
  relatedComparisons: customRelatedComparisons,
}: CompareProps) {
  const defaultResources = getCompareResources(path, competitor);
  const finalGuides = customRelatedGuides && customRelatedGuides.length > 0 ? customRelatedGuides : defaultResources.relatedGuides;
  const finalComparisons = customRelatedComparisons && customRelatedComparisons.length > 0 ? customRelatedComparisons : defaultResources.relatedComparisons;
  const defaultFaqs = [
    {
      question: `Is Audiment a direct alternative to ${competitor}?`,
      answer: `Yes. Both serve multi-location audit management. The differences are in how each platform handles accountability workflows, evidence collection, and rollout complexity – which is what matters most during day-to-day operations.`,
    },
    {
      question: 'How does the migration process work?',
      answer:
        'Our onboarding team digitizes your existing checklists and imports your location hierarchy. Most teams are running their first audits on Audiment within 1-2 weeks, often in parallel with their existing system.',
    },
    {
      question: 'Can we run a trial in a few locations first?',
      answer:
        'Yes, and we recommend it. Most teams start with 3-5 locations to validate the workflow, then expand once managers are comfortable with the interface.',
    },
  ];

  const activeFaqs = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://audiment.in${path}/#faq`,
    isPartOf: {
      '@id': 'https://audiment.in/#website',
    },
    mainEntity: activeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://audiment.in${path}/#webpage`,
    url: `https://audiment.in${path}`,
    name: `${heroH1} – Software Comparison & In-Depth Review`,
    headline: heroH1,
    description:
      heroSubtext ||
      `Evaluating ${competitor}? Here's a practical comparison focused on operational outcomes, rollout realities, and how each platform handles accountability.`,
    inLanguage: 'en-US',
    datePublished: '2025-01-15T00:00:00+05:30',
    dateModified: '2026-10-22T00:00:00+05:30',
    isPartOf: {
      '@id': 'https://audiment.in/#website',
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: 'Audiment',
        url: 'https://audiment.in',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
      },
      {
        '@type': 'SoftwareApplication',
        name: competitor,
        applicationCategory: competitorCategory || 'BusinessApplication',
      },
    ],
    publisher: {
      '@id': 'https://audiment.in/#organization',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `https://audiment.in${path}/#software`,
    name: `Audiment – ${heroH1}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    url: `https://audiment.in${path}`,
    description:
      heroSubtext ||
      `Evaluating ${competitor}? Here's a practical comparison focused on operational outcomes, rollout realities, and how each platform handles accountability.`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Transparent per-location pricing with unlimited users per branch',
    },
    isSimilarTo: {
      '@type': 'SoftwareApplication',
      name: competitor,
    },
    featureList: [
      'Proof-Based Live Photo Verification',
      'GPS Geofenced Auditor Presence Check',
      'Automated Corrective Actions (CAPA) with SLA Deadlines',
      'Multi-Location Operational Drift Analytics',
      'Unlimited Users Per Location Pricing Model',
      '100% BYOD Browser Compatibility with Full Offline Execution',
    ],
    publisher: { '@id': 'https://audiment.in/#organization' },
    provider: { '@id': 'https://audiment.in/#organization' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `https://audiment.in${path}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://audiment.in/compare' },
      { '@type': 'ListItem', position: 3, name: heroH1, item: `https://audiment.in${path}` },
    ],
  };

  return (
    <>
      <Script
        id={`webpage-schema-${path.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id={`faq-schema-${path.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id={`software-schema-${path.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${path.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentCompareDetailClient
        competitor={competitor}
        heroH1={heroH1}
        heroSubtext={heroSubtext}
        quickVerdict={quickVerdict}
        lastUpdated={lastUpdated}
        whereAudimentWins={whereAudimentWins}
        whoShouldChooseCompetitor={whoShouldChooseCompetitor}
        migrationReality={migrationReality}
        operationalDifferences={operationalDifferences}
        operationalOutcomeDifference={operationalOutcomeDifference}
        faqs={activeFaqs}
        path={path}
        variant={variant}
        relatedGuides={finalGuides}
        relatedComparisons={finalComparisons}
      />
    </>
  );
}
