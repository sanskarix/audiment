import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Proof-Based Audits | Evidence-Backed Audits Across Locations | Audiment',
  description: 'Proof-based audits require live photo evidence on critical checks so you know what\'s actually happening at every location. Stop trusting checklists – verify execution.',
  path: '/platform/proof-based-audits',
  keywords: ['proof-based audits', 'evidence-based audit software', 'photo audit app', 'audit verification', 'checklist audit software'],
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment \u2013 Proof-Based Audits',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/proof-based-audits',
  description: 'Proof-based audit software that requires live photo evidence on critical checks. Eliminate trust-based checklist completion and verify actual execution across all locations.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/proof-based-audits' },
    { '@type': 'ListItem', position: 3, name: 'Proof-Based Audits', item: 'https://audiment.in/platform/proof-based-audits' },
  ],
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        heroH1="Proof-Based Audits Across Every Location"
        heroSubheadline="Every critical check requires evidence. No more trusting that a checklist means the work was done."
        sections={[
          {
            title: 'What is a proof-based audit?',
            content: 'A proof-based audit requires evidence \u2013 live photos, timestamps, or on-site verification \u2013 on critical checks before they can be marked complete. This means a completed checklist reflects what actually happened at the location, not what a manager assumed or remembered. Evidence is captured in the moment, linked to the specific check, and attached to the audit record for review and reference.',
          },
          {
            title: 'Why it matters at scale',
            content: 'At one or two locations, management can personally verify most standards. As you add locations, that direct oversight becomes impossible. Without evidence requirements, reported compliance and actual compliance diverge \u2013 often gradually and invisibly. Standards drift while audit scores stay stable. Proof-based audits close that gap by making evidence a requirement, not an option.',
          },
          {
            title: 'What fails without it',
            content: 'Teams can mark tasks complete without doing the work \u2013 not necessarily out of dishonesty, but because self-reported checklists under time pressure tend toward optimism. Issues stay hidden until a customer complaint or a failed inspection surfaces them. By that point, the drift has often been building for months across multiple locations.',
          },
          {
            title: 'How Audiment handles it',
            content: 'Audiment requires live photo or video evidence on critical checks \u2013 captured through the app, not uploaded from a photo library. Failed checks automatically generate tracked issues with assigned owners and due dates. Every audit creates a verifiable trail by location, auditor, and date that can be reviewed by area managers and leadership without site visits.',
          },
          {
            title: 'Operational outcome',
            content: 'Proof-based audits give you data you can trust. Reliable data shows you where issues are recurring \u2013 so you catch problems before they escalate. Leadership can make resourcing and intervention decisions based on what is actually happening at each location rather than what is being reported.',
          },
        ]}
        faqs={[
          {
            question: 'Do proof-based audits slow teams down?',
            answer: 'No. Evidence is required only on critical checks \u2013 typically 5\u201315% of checklist items. For a 50-item audit, that means approximately 5\u20138 photos. Most teams complete this in under 2 additional minutes. The efficiency impact is minimal; the accountability impact is significant.',
          },
          {
            question: 'Can staff upload old photos?',
            answer: 'No. Audiment requires live camera capture \u2013 photos taken through the app at the time of the audit. Uploads from photo libraries are not accepted for critical checks. This prevents backdating and ensures evidence reflects the actual inspection moment.',
          },
          {
            question: 'Who uses proof-based audit data?',
            answer: 'Store managers, area managers, and leadership use it at different levels. Store managers see their own audit performance. Area managers review evidence quality and recurring failures across their territory. Leadership uses aggregated data to identify systemic issues and allocation priorities.',
          },
          {
            question: 'What types of checks require evidence?',
            answer: 'Evidence requirements are configured per checklist template. Typically, food safety temperatures, cleaning standards, safety compliance checks, and brand-critical execution require evidence. Routine administrative confirmations can remain as yes/no responses.',
          },
        ]}
        relatedLinks={[
          { tag: 'Topic', title: 'Operational Drift', href: '/operational-drift', description: 'How standards drift silently without reliable audit data.' },
          { tag: 'Platform', title: 'Issue Tracking', href: '/platform/issue-tracking', description: 'What happens after issues are detected.' },
          { tag: 'Solutions', title: 'Restaurant Audit Software', href: '/solutions/restaurant-audit-software', description: 'Proof-based workflows for restaurant chains.' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
