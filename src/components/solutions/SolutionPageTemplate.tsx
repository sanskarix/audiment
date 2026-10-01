import React from 'react';
import Script from 'next/script';
import {
  AudimentSolutionDetailClient,
  SolutionDetailClientProps,
} from '@/components/solutions/AudimentSolutionDetailClient';

interface PainPoint {
  title: string;
  description: string;
}

interface SolutionFeature {
  title: string;
  description: string;
}

interface ChecklistItem {
  area: string;
  question: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface WorkflowStep {
  title: string;
  description: string;
}

interface Props {
  industry: string;
  heroH1: string;
  heroSubheadline: string;
  painPoints: PainPoint[];
  features: SolutionFeature[];
  sampleChecklist: ChecklistItem[];
  faqs: FAQ[];
  relatedBlogLink: string;
  relatedBlogTitle: string;
  relatedIndustryLinks: { title: string; href: string }[];
  workflowSteps?: WorkflowStep[];
  operationalBottlenecks?: string[];
  breadcrumbLabel?: string;
  canonicalPath?: string;
  crossLinks?: { title: string; href: string; description: string; tag?: string }[];
}

export default function SolutionPageTemplate({
  industry,
  heroH1,
  heroSubheadline,
  painPoints,
  features,
  sampleChecklist,
  faqs,
  relatedBlogLink,
  relatedBlogTitle,
  relatedIndustryLinks,
  workflowSteps,
  operationalBottlenecks,
  breadcrumbLabel,
  canonicalPath,
  crossLinks,
}: Props) {
  // Schema for FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://audiment.in${canonicalPath || ''}/#faq`,
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

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `https://audiment.in${canonicalPath || ''}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://audiment.in/solutions' },
      {
        '@type': 'ListItem',
        position: 3,
        name: breadcrumbLabel || `${industry} Audit Software`,
        item: canonicalPath ? `https://audiment.in${canonicalPath}` : 'https://audiment.in/solutions',
      },
    ],
  };

  // HowTo schema
  const howToSchema =
    workflowSteps && workflowSteps.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          '@id': `https://audiment.in${canonicalPath || ''}/#howto`,
          isPartOf: {
            '@id': 'https://audiment.in/#website',
          },
          publisher: {
            '@id': 'https://audiment.in/#organization',
          },
          name: `How to manage and resolve issues in ${industry.toLowerCase()} operations`,
          description: `A step-by-step workflow guide to managing operations, identifying issues, and tracking corrective actions in ${industry.toLowerCase()}.`,
          step: workflowSteps.map((step, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: step.title,
            text: step.description,
          })),
          tool: [
            {
              '@type': 'HowToTool',
              name: 'Audiment Platform',
            },
          ],
        }
      : null;

  const pathKey = (canonicalPath || industry).replace(/[^a-zA-Z0-9]/g, '-');

  return (
    <>
      <Script
        id={`faq-schema-${pathKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${pathKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {howToSchema && (
        <Script
          id={`howto-schema-${pathKey}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <AudimentSolutionDetailClient
        industry={industry}
        heroH1={heroH1}
        heroSubheadline={heroSubheadline}
        painPoints={painPoints}
        features={features}
        sampleChecklist={sampleChecklist}
        faqs={faqs}
        relatedBlogLink={relatedBlogLink}
        relatedBlogTitle={relatedBlogTitle}
        relatedIndustryLinks={relatedIndustryLinks}
        workflowSteps={workflowSteps}
        operationalBottlenecks={operationalBottlenecks}
        breadcrumbLabel={breadcrumbLabel}
        canonicalPath={canonicalPath}
        crossLinks={crossLinks}
      />
    </>
  );
}
