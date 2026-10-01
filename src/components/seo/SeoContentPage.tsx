import React from 'react';
import Script from 'next/script';
import {
  AudimentSeoContentClient,
  SeoContentClientProps,
} from '@/components/seo/AudimentSeoContentClient';

type Section = { title: string; content: string };
type Faq = { question: string; answer: string };
type RelatedLink = { title: string; href: string; description: string; tag?: string };

interface Props {
  heroH1: string;
  heroSubheadline: string;
  sections: Section[];
  faqs: Faq[];
  relatedLinks: RelatedLink[];
  path?: string;
  categoryTag?: string;
}

export default function SeoContentPage({
  heroH1,
  heroSubheadline,
  sections,
  faqs,
  relatedLinks,
  path,
  categoryTag,
}: Props) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(path && {
      '@id': `https://audiment.in${path}/#faq`,
      isPartOf: {
        '@id': 'https://audiment.in/#website',
      },
    }),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const pathKey = (path || heroH1).replace(/[^a-zA-Z0-9]/g, '-');

  return (
    <>
      <Script
        id={`faq-schema-${pathKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AudimentSeoContentClient
        heroH1={heroH1}
        heroSubheadline={heroSubheadline}
        sections={sections}
        faqs={faqs}
        relatedLinks={relatedLinks}
        path={path}
        categoryTag={categoryTag}
      />
    </>
  );
}
