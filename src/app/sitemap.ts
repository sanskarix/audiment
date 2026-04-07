import { getAllPosts } from '@/lib/blog'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  
  const blogUrls = posts.map(post => ({
    url: `https://audiment.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  return [
    { url: 'https://audiment.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://audiment.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/restaurant-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/retail-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/hotel-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/franchise-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/food-safety-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/qsr-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/fssai-compliance-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/solutions/manufacturing-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.com/use-cases/corrective-action-tracking', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/use-cases/field-audit-app', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/use-cases/audit-checklist-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/use-cases/inspection-management-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/use-cases/mobile-audit-app', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/use-cases/multi-location-compliance', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/compare/audiment-vs-safetyculture', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/compare/audiment-vs-goaudits', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/compare/audiment-vs-zenput', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.com/compare/audiment-vs-jolt', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...blogUrls,
  ]
}
