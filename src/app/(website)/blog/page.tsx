import React from 'react';
import Script from 'next/script';
import { getAllPosts } from '@/lib/blog';
import { AudimentBlogHubClient } from '@/components/blog/AudimentBlogHubClient';

export const metadata = {
  title: 'Audiment blog | Audit insights for operations leaders',
  description:
    'Operator-focused field guides on multi-location audit management, operational consistency, FSSAI compliance, corrective actions, and proof-based audits.',
  alternates: { canonical: 'https://audiment.in/blog' },
  openGraph: {
    title: 'Audiment blog | Audit insights for operations leaders',
    description:
      'Operator-focused field guides on multi-location audit management, operational consistency, FSSAI compliance, corrective actions, and proof-based audits.',
    url: 'https://audiment.in/blog',
    type: 'website',
    images: [{ url: 'https://audiment.in/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audiment blog | Audit insights for operations leaders',
    description:
      'Operator-focused field guides on multi-location audit management, operational consistency, FSSAI compliance, corrective actions, and proof-based audits.',
  },
  keywords: ['audit software', 'restaurant compliance', 'field audits', 'multi-location operations'],
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; c?: string }>;
}) {
  const posts = getAllPosts();
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || '';
  const categoryQuery = resolvedSearchParams?.c || '';

  const semanticOrder = [
    'Audit Management',
    'Operational Drift',
    'Quality Consistency',
    'Accountability',
    'Compliance',
    'Corrective Actions',
    'Proof-Based Audits',
  ];
  const availableCategories = Array.from(new Set(posts.map((p) => p.category)));
  const semanticCategories = semanticOrder.filter((c) => availableCategories.includes(c));

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Audiment Blog',
    url: 'https://audiment.in/blog',
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <AudimentBlogHubClient
        posts={posts}
        initialCategory={categoryQuery}
        initialSearchQuery={searchQuery}
        semanticCategories={semanticCategories}
      />
    </>
  );
}
