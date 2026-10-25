import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import { getAllDocs, getDocsGroupedByCategory } from '@/lib/docs';
import { AudimentDocsHubClient } from '@/components/docs/AudimentDocsHubClient';

export const metadata: Metadata = {
  title: 'Audiment docs | Official product guides and specifications',
  description:
    'Comprehensive documentation, role handbooks, and feature guides for Audiment. Learn how to author checklists, run surprise audits, and automate 48-hour CAPAs.',
  alternates: {
    canonical: 'https://audiment.in/docs',
  },
  openGraph: {
    title: 'Audiment docs | Official product guides and specifications',
    description:
      'Comprehensive documentation, role handbooks, and feature guides for Audiment. Learn how to author checklists, run surprise audits, and automate 48-hour CAPAs.',
    url: 'https://audiment.in/docs',
    type: 'website',
    images: [{ url: 'https://audiment.in/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audiment docs | Official product guides and specifications',
    description:
      'Comprehensive documentation, role handbooks, and feature guides for Audiment. Learn how to author checklists, run surprise audits, and automate 48-hour CAPAs.',
  },
  keywords: [
    'audit documentation',
    'multi-location audit software docs',
    'FSSAI audit template',
    'CAPA tracking guide',
    'field inspection handbook',
    'Audiment user manual',
  ],
};

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; c?: string }>;
}) {
  const docs = getAllDocs();
  const categoryGroups = getDocsGroupedByCategory();
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || '';
  const categoryQuery = resolvedSearchParams?.c || '';

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://audiment.in/docs/#collection',
    name: 'Audiment Documentation',
    url: 'https://audiment.in/docs',
    description:
      'Comprehensive documentation, role handbooks, and feature guides for Audiment multi-location audit software.',
    publisher: {
      '@id': 'https://audiment.in/#organization',
    },
    hasPart: docs.map((doc) => ({
      '@type': 'TechArticle',
      name: doc.title,
      description: doc.description,
      url: `https://audiment.in/docs/${doc.slug}`,
    })),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': 'https://audiment.in/docs/#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://audiment.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Documentation',
        item: 'https://audiment.in/docs',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <AudimentDocsHubClient
        docs={docs.map(({ content, ...rest }) => ({ ...rest, content: '' }))}
        categoryGroups={categoryGroups.map((cg) => ({
          ...cg,
          docs: cg.docs.map(({ content, ...rest }) => ({ ...rest, content: '' })),
        }))}
        initialCategory={categoryQuery}
        initialSearchQuery={searchQuery}
      />
    </>
  );
}
