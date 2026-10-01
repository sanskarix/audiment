import React from 'react';
import Script from 'next/script';
import {
  AudimentCompareDetailClient,
  CompareDetailProps,
} from '@/components/compare/AudimentCompareDetailClient';

interface CompareProps {
  competitor: string;
  heroH1: string;
  heroSubtext?: string;
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
  path: string;
}

export default function CompareTemplate({
  competitor,
  heroH1,
  heroSubtext,
  whereAudimentWins,
  whoShouldChooseCompetitor,
  migrationReality,
  operationalDifferences,
  operationalOutcomeDifference,
  path,
}: CompareProps) {
  const faqs = [
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://audiment.in${path}/#faq`,
    isPartOf: {
      '@id': 'https://audiment.in/#website',
    },
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
      description: 'Contact for pricing',
    },
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
        whereAudimentWins={whereAudimentWins}
        whoShouldChooseCompetitor={whoShouldChooseCompetitor}
        migrationReality={migrationReality}
        operationalDifferences={operationalDifferences}
        operationalOutcomeDifference={operationalOutcomeDifference}
        faqs={faqs}
        path={path}
      />
    </>
  );
}
