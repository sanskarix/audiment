import { Metadata } from 'next'

const SITE_URL = 'https://audiment.in'
const SITE_NAME = 'Audiment'
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image.png`

/**
 * Build a complete Metadata object with consistent OG + Twitter tags.
 * Use this on every public page to avoid falling back to the layout defaults.
 */
export function buildPageMeta({
  title,
  description,
  path,
  keywords,
  type = 'website',
  ogImage,
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: 'website' | 'article'
  ogImage?: string
  noIndex?: boolean
}): Metadata {
  const url = `${SITE_URL}${path}`
  const image = ogImage || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  }
}
