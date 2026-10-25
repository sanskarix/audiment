import React from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  getAllDocs,
  getDocBySlug,
  getDocTOC,
} from '@/lib/docs';
import { AudimentDocDetailClient } from '@/components/docs/AudimentDocDetailClient';
import {
  CapaLifecycleIllustration,
  CapaResolutionModalIllustration,
  AuditLifecycleIllustration,
  OperationalPillarsIllustration,
  RoleHierarchyIllustration,
  BlueprintBuilderIllustration,
  CameraCaptureIllustration,
  GeoVerificationIllustration,
  FlashVerificationIllustration,
  SurpriseAuditIllustration,
  RecurringScheduleIllustration,
  ComplianceDashboardIllustration,
  PdfReportIllustration,
  AdminOnboardingIllustration,
  ManagerRoutineIllustration,
  CapaTicketStepsIllustration,
  AuditorLifecycleIllustration,
  AuditorInspectionEngineIllustration,
  ScoringFormulaIllustration,
} from '@/components/docs/DocIllustrations';

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug);
  if (!doc) return {};

  const displayTitle = doc.metaTitle || `${doc.title} | Audiment Docs`;

  return {
    title: { absolute: displayTitle },
    description: doc.description,
    alternates: {
      canonical: `https://audiment.in/docs/${resolvedParams.slug}`,
    },
    openGraph: {
      title: displayTitle,
      description: doc.description,
      url: `https://audiment.in/docs/${resolvedParams.slug}`,
      type: 'article',
      images: [{ url: 'https://audiment.in/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: doc.description,
    },
    keywords: doc.tags,
  };
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  const toc = getDocTOC(doc.content);

  const allDocs = getAllDocs();
  const relatedDocs = allDocs
    .filter((d) => d.slug !== doc.slug)
    .slice(0, 3)
    .map((d) => ({
      slug: d.slug,
      title: d.title,
      description: d.description,
      category: d.category,
      date: d.lastModified || '2026-10-24',
      readingTime: d.readingTime,
    }));

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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
        name: 'Docs',
        item: 'https://audiment.in/docs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: doc.title,
        item: `https://audiment.in/docs/${doc.slug}`,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.description,
    image: 'https://audiment.in/opengraph-image.png',
    datePublished: doc.lastModified || '2026-10-24',
    dateModified: doc.lastModified || '2026-10-24',
    author: {
      '@type': 'Organization',
      '@id': 'https://audiment.in/#organization',
      name: 'Audiment Product Team',
      url: 'https://audiment.in/about',
    },
    publisher: {
      '@id': 'https://audiment.in/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://audiment.in/docs/${doc.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <AudimentDocDetailClient
        title={doc.title}
        description={doc.description}
        category={doc.category}
        author="Audiment Product Team"
        date={doc.lastModified || '2026-10-24'}
        readingTime={doc.readingTime}
        slug={doc.slug}
        toc={toc}
        relatedDocs={relatedDocs}
      >
        <MDXRemote
          source={doc.content.replace(/<script\b[\s\S]*?(?:<\/script>|\/>)/gi, '')}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
          components={{
            h1: () => null,
            h2: ({ children, ...props }: any) => {
              const getText = (node: any): string => {
                if (!node) return '';
                if (typeof node === 'string') return node;
                if (Array.isArray(node)) return node.map(getText).join('');
                if (node.props?.children) return getText(node.props.children);
                return '';
              };
              const text = getText(children);
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
              return (
                <h2 id={id} {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }: any) => {
              const getText = (node: any): string => {
                if (!node) return '';
                if (typeof node === 'string') return node;
                if (Array.isArray(node)) return node.map(getText).join('');
                if (node.props?.children) return getText(node.props.children);
                return '';
              };
              const text = getText(children);
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
              return (
                <h3 id={id} {...props}>
                  {children}
                </h3>
              );
            },
            table: (props: any) => (
              <div className="aud-table-container">
                <table className="aud-prose-table" {...props} />
              </div>
            ),
            div: ({ className, children, ...props }: any) => {
              if (className && (className.includes('shadow-') || className.includes('rounded-2xl') || className.includes('rounded-xl'))) {
                const sanitized = className
                  .replace(/\bshadow-(?:sm|md|lg|xl|2xl)\b/g, '')
                  .replace(/\brounded-(?:xl|2xl|3xl)\b/g, 'rounded-none')
                  .trim();
                return <div className={sanitized} {...props}>{children}</div>;
              }
              return <div className={className} {...props}>{children}</div>;
            },
            CapaLifecycleIllustration,
            CapaResolutionModalIllustration,
            AuditLifecycleIllustration,
            OperationalPillarsIllustration,
            RoleHierarchyIllustration,
            BlueprintBuilderIllustration,
            CameraCaptureIllustration,
            GeoVerificationIllustration,
            FlashVerificationIllustration,
            SurpriseAuditIllustration,
            RecurringScheduleIllustration,
            ComplianceDashboardIllustration,
            PdfReportIllustration,
            AdminOnboardingIllustration,
            ManagerRoutineIllustration,
            CapaTicketStepsIllustration,
            AuditorLifecycleIllustration,
            AuditorInspectionEngineIllustration,
            ScoringFormulaIllustration,
          }}
        />
      </AudimentDocDetailClient>
    </>
  );
}
