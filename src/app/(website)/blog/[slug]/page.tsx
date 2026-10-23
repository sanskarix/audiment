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
} from '@/components/blog/AudimentBlogPostClient';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function cleanBlogTitle(title: string): string {
  const separators = ['?', ':', '(', '-'];
  let clean = title;

  let firstSepIdx = -1;
  let matchingSep = '';
  for (const sep of separators) {
    const idx = clean.indexOf(sep);
    if (idx !== -1 && (firstSepIdx === -1 || idx < firstSepIdx)) {
      firstSepIdx = idx;
      matchingSep = sep;
    }
  }

  if (firstSepIdx !== -1) {
    clean = clean.substring(0, firstSepIdx).trim();
    if (matchingSep === '?') {
      clean += '?';
    }
  }

  clean = clean
    .replace(/\bfor Multi-Location Businesses\b/gi, '')
    .replace(/\bfor Multi-Outlet Restaurants\b/gi, '')
    .replace(/\bAcross Multiple Locations\b/gi, '')
    .replace(/\bAcross Locations\b/gi, '')
    .trim();

  return clean;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  const displayTitle = post.metaTitle || cleanBlogTitle(post.title);
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

function getTOC(content: string): TOCItem[] {
  const headings = content.match(/^##\s+(.*)/gm);
  if (!headings) return [];
  return headings.map((h) => {
    const rawText = h.replace(/^##\s+/, '');
    const cleanText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { text: cleanText, id };
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const toc = getTOC(post.content);

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

  return (
    <>
      <BlogMetadataPublisher category={post.category} slug={post.slug} />
      <Script
        id={`article-schema-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
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
      >
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
          components={{
            h1: () => null,
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
            table: (props: any) => (
              <div className="aud-table-container">
                <table className="aud-prose-table" {...props} />
              </div>
            ),
          }}
        />
      </AudimentBlogPostClient>
    </>
  );
}
