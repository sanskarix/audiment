import React from 'react';
import Script from 'next/script';
import {
  AudimentUseCaseDetailClient,
  UseCaseDetailProps,
} from '@/components/use-cases/AudimentUseCaseDetailClient';

interface Props {
  title: string;
  heroH1: string;
  heroSubheadline: string;
  primaryKeyword: string;
  features: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  operationalScenario?: {
    title: string;
    before: string;
    after: string;
  };
  path: string;
}

export default function UseCaseTemplate({
  title,
  heroH1,
  heroSubheadline,
  primaryKeyword,
  features,
  benefits,
  faqs,
  operationalScenario,
  path,
}: Props) {
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
    name: `Audiment – ${title}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    url: `https://audiment.in${path}`,
    description: heroSubheadline,
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
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://audiment.in/use-cases' },
      { '@type': 'ListItem', position: 3, name: title, item: `https://audiment.in${path}` },
    ],
  };

  const pathKey = path.replace(/[^a-zA-Z0-9]/g, '-');

  return (
    <>
      <Script
        id={`faq-schema-${pathKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id={`software-schema-${pathKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${pathKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AudimentUseCaseDetailClient
        title={title}
        heroH1={heroH1}
        heroSubheadline={heroSubheadline}
        primaryKeyword={primaryKeyword}
        features={features}
        benefits={benefits}
        faqs={faqs}
        operationalScenario={operationalScenario}
        path={path}
      />
    </>
  );
}
