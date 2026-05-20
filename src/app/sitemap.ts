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
    { url: 'https://audiment.in/solutions', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
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
    { url: 'https://audiment.in/use-cases/audit-checklist-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/inspection-management-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/multi-location-compliance', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Comparisons
    { url: 'https://audiment.in/compare/audiment-vs-safetyculture', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-goaudits', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-zenput', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-jolt', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/compare/audiment-vs-checklist-apps', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Platform
    { url: 'https://audiment.in/platform/proof-based-audits', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/issue-tracking', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/corrective-actions', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/operational-dashboards', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/geo-verified-audits', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Operational problem pages
    { url: 'https://audiment.in/operational-drift', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/hidden-operational-issues', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/maintaining-standards-across-locations', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/staying-ahead-of-compliance', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/improving-accountability', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Missing commercial pages
    { url: 'https://audiment.in/multi-location-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://audiment.in/fssai-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/healthcare-audit-software', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Legal
    { url: 'https://audiment.in/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://audiment.in/cookie-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://audiment.in/terms-of-service', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...blogUrls,
  ]
}
