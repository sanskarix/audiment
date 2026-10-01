import { getAllPosts } from '@/lib/blog'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  
  const blogUrls = posts.map(post => ({
    url: `https://audiment.in/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  return [
    // Core pages
    { url: 'https://audiment.in', lastModified: new Date('2026-07-01'), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://audiment.in/about', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/blog', lastModified: new Date('2026-07-01'), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://audiment.in/solutions', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/restaurant-audit-software', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.9 },
    // Use Cases
    { url: 'https://audiment.in/use-cases', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/corrective-action-tracking', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.7 },
    // Comparisons
    { url: 'https://audiment.in/compare', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-safetyculture', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.7 },
    // Platform features
    { url: 'https://audiment.in/platform/proof-based-audits', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Operational problem pages
    { url: 'https://audiment.in/operational-drift', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Commercial / landing pages
    { url: 'https://audiment.in/multi-location-audit-software', lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.9 },
    // Legal
    { url: 'https://audiment.in/privacy-policy', lastModified: new Date('2026-04-11'), changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://audiment.in/cookie-policy', lastModified: new Date('2026-04-11'), changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://audiment.in/terms-of-service', lastModified: new Date('2026-04-11'), changeFrequency: 'yearly', priority: 0.2 },
    ...blogUrls,
  ]
}
