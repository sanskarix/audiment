import React from 'react';
import Script from 'next/script';
import { getPostBySlug, getAllPosts, getPostsByCategory } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { BlogMetadataPublisher } from '@/components/blog/BlogMetadataPublisher';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  AudimentBlogPostClient,
  TOCItem,
  RelatedPost,
  FAQItem,
} from '@/components/blog/AudimentBlogPostClient';
import { WorkflowIllustration } from '@/components/blog/WorkflowIllustration';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  const displayTitle = post.metaTitle || post.title;
  const metaTitle = displayTitle;

  return {
    title: { absolute: metaTitle },
    description: post.description,
    alternates: {
      canonical: `https://audiment.in/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: displayTitle,
      description: post.description,
      url: `https://audiment.in/blog/${resolvedParams.slug}`,
      type: 'article',
      images: [{ url: 'https://audiment.in/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: post.description,
    },
    keywords: post.tags,
  };
}

function extractFAQsAndClean(content: string): {
  faqs: FAQItem[];
  cleanContent: string;
} {
  const pattern = /(##\s+Frequently Asked Questions[\s\S]*?)(?=\n##\s+|$)/i;
  const match = content.match(pattern);
  const faqs: FAQItem[] = [];
  let cleanContent = content;

  if (match) {
    const faqText = match[1];
    const detailsMatches = faqText.matchAll(
      /<details[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi
    );
    for (const m of detailsMatches) {
      const q = m[1].replace(/<[^>]+>/g, '').trim();
      const a = m[2].replace(/<[^>]+>/g, '').trim();
      if (q && a) {
        faqs.push({ question: q, answer: a });
      }
    }

    if (faqs.length === 0) {
      const h3Matches = faqText.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi);
      for (const m of h3Matches) {
        const q = m[1].replace(/<[^>]+>/g, '').trim();
        const a = m[2].replace(/<[^>]+>/g, '').trim();
        if (q && a) {
          faqs.push({ question: q, answer: a });
        }
      }
    }

    cleanContent =
      content.slice(0, match.index) + content.slice((match.index || 0) + match[0].length);
  }

  return { faqs, cleanContent };
}

function getTOC(content: string, hasFaqs: boolean): TOCItem[] {
  const headings = content.match(/^##\s+(.*)/gm);
  const items: TOCItem[] = [];
  if (headings) {
    for (const h of headings) {
      const rawText = h.replace(/^##\s+/, '');
      const cleanText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
      const id = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      if (cleanText.toLowerCase() !== 'frequently asked questions') {
        items.push({ text: cleanText, id });
      }
    }
  }
  if (hasFaqs) {
    items.push({ text: 'Frequently Asked Questions', id: 'frequently-asked-questions' });
  }
  return items;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const { faqs, cleanContent } = extractFAQsAndClean(post.content);
  const toc = getTOC(cleanContent, faqs.length > 0);

  const relatedPosts: RelatedPost[] = getPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category,
      date: p.date,
      readingTime: p.readingTime,
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
        name: 'Blog',
        item: 'https://audiment.in/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://audiment.in/blog/${post.slug}`,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: 'https://audiment.in/opengraph-image.png',
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    author: {
      '@type': 'Organization',
      '@id': 'https://audiment.in/#organization',
      name: post.author,
      url: 'https://audiment.in/about',
    },
    publisher: {
      '@id': 'https://audiment.in/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://audiment.in/blog/${post.slug}`,
    },
  };

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <AudimentBlogPostClient
        title={post.title}
        description={post.description}
        category={post.category}
        author={post.author}
        date={post.date}
        readingTime={post.readingTime}
        slug={post.slug}
        toc={toc}
        relatedPosts={relatedPosts}
        faqs={faqs}
      >
        <MDXRemote
          source={cleanContent.replace(/<script\b[\s\S]*?(?:<\/script>|\/>)/gi, '')}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
          components={{
            h1: () => null,
            script: () => null,
            BlogCTA: () => null,
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
            pre: ({ children }: any) => {
              let rawText = '';
              const extract = (node: any): string => {
                if (!node) return '';
                if (typeof node === 'string') return node;
                if (Array.isArray(node)) return node.map(extract).join('');
                if (node.props?.children) return extract(node.props.children);
                return '';
              };
              rawText = extract(children);

              return <WorkflowIllustration rawText={rawText} />;
            },
            table: (props: any) => (
              <div className="aud-table-container">
                <table className="aud-prose-table" {...props} />
              </div>
            ),
            div: ({ className, children, ...props }: any) => {
              if (
                className &&
                (className.includes('shadow-') ||
                  className.includes('rounded-2xl') ||
                  className.includes('rounded-xl'))
              ) {
                const sanitized = className
                  .replace(/\bshadow-(?:sm|md|lg|xl|2xl)\b/g, '')
                  .replace(/\brounded-(?:xl|2xl|3xl)\b/g, 'rounded-none')
                  .trim();
                return <div className={sanitized} {...props}>{children}</div>;
              }
              return <div className={className} {...props}>{children}</div>;
            },
          }}
        />
      </AudimentBlogPostClient>
    </>
  );
}
