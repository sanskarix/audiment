import { getAllPosts } from '@/lib/blog'
import { getAllDocs } from '@/lib/docs'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const docs = getAllDocs()
  
  const blogUrls = posts.map(post => ({
    url: `https://audiment.in/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const docUrls = docs.map(doc => ({
    url: `https://audiment.in/docs/${doc.slug}`,
    lastModified: new Date(doc.lastModified || '2026-10-24'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    // Core pages
    { url: 'https://audiment.in', changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://audiment.in/docs', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://audiment.in/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/glossary', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/blog', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://audiment.in/solutions', changeFrequency: 'monthly', priority: 0.8 },
    // Solutions
    { url: 'https://audiment.in/solutions/restaurant-audit-software', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://audiment.in/solutions/retail-audit-software', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/hotel-audit-software', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/franchise-audit-software', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/food-safety-audit-software', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/qsr-audit-software', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/solutions/manufacturing-audit-software', changeFrequency: 'monthly', priority: 0.7 },
    // Use Cases
    { url: 'https://audiment.in/use-cases', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/corrective-action-tracking', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/audit-checklist-software', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/inspection-management-software', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/use-cases/multi-location-compliance', changeFrequency: 'monthly', priority: 0.7 },
    // Comparisons
    { url: 'https://audiment.in/compare', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-safetyculture', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-goaudits', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-zenput', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-jolt', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-meazureup', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-bindy', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-lumiform', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-maintainx', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-checklist-apps', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-checkbuster', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-form-com', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-devicemagic', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-prontoforms', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-fluix', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-fulcrum', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-myfieldaudits', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-auditboard', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-hyperproof', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-sap-audit-management', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-teammate', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-diligent-highbond', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-onspring', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-logicgate', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-metricstream', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-resolver', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-fastpath', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-firstify', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-qt9-qms', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-greenlight-guru', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-veeva-vault', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-compliancequest', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/compare/audiment-vs-mastercontrol', changeFrequency: 'monthly', priority: 0.8 },
    // Platform features
    { url: 'https://audiment.in/platform/proof-based-audits', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/issue-tracking', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/corrective-actions', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/operational-dashboards', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/platform/geo-verified-audits', changeFrequency: 'monthly', priority: 0.8 },
    // Operational problem pages
    { url: 'https://audiment.in/operational-drift', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/hidden-operational-issues', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://audiment.in/maintaining-standards-across-locations', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/staying-ahead-of-compliance', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://audiment.in/improving-accountability', changeFrequency: 'monthly', priority: 0.8 },
    // Commercial / landing pages
    { url: 'https://audiment.in/multi-location-audit-software', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://audiment.in/fssai-audit-software', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://audiment.in/healthcare-audit-software', changeFrequency: 'monthly', priority: 0.8 },
    // Legal (indexed but low priority)
    { url: 'https://audiment.in/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://audiment.in/cookie-policy', changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://audiment.in/terms-of-service', changeFrequency: 'yearly', priority: 0.2 },
    ...docUrls,
    ...blogUrls,
  ]
}
