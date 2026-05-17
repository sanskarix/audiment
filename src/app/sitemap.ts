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
    { url: 'https://audiment.in', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://audiment.in/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    // Solutions
    { url: 'https://audiment.in/solutions/restaurant-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://audiment.in/solutions/retail-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/hotel-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/franchise-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/food-safety-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/qsr-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/manufacturing-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Use Cases
    { url: 'https://audiment.in/use-cases/corrective-action-tracking', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/field-audit-app', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/audit-checklist-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/inspection-management-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/multi-location-compliance', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Comparisons
    { url: 'https://audiment.in/compare/audiment-vs-safetyculture', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-goaudits', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-zenput', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-jolt', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Legal
    { url: 'https://audiment.in/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://audiment.in/cookie-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://audiment.in/terms-of-service', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...blogUrls,
  ]
}
