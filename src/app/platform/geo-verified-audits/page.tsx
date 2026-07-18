import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Geo-Verified Audits | On-Site Audit Verification | Audiment',
  description: 'Geo-verified audits confirm auditors were physically on-site before the audit is accepted. Eliminate remote check-ins and proxy reporting across all locations.',
  path: '/platform/geo-verified-audits',
  keywords: ['geo-verified audits', 'on-site audit verification', 'field audit software', 'location-based audits', 'remote audit prevention'],
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment \u2013 Geo-Verified Audits',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/geo-verified-audits',
  description: 'Geo-verified audit software that confirms auditors are physically on-site before accepting audit submissions. Eliminates remote check-ins and proxy reporting in multi-location operations.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/geo-verified-audits' },
    { '@type': 'ListItem', position: 3, name: 'Geo-Verified Audits', item: 'https://audiment.in/platform/geo-verified-audits' },
  ],
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        heroH1="Geo-Verified Audits for On-Site Accountability"
        heroSubheadline="Verify that audits happen at the right place, at the right time, with the right evidence."
        sections={[
          {
            title: 'What is a geo-verified audit?',
            content: 'A geo-verified audit confirms that the auditor was physically present at the target location when the audit was completed. The system captures the auditor\'s GPS coordinates at the time of submission and cross-checks them against the registered address of the location being audited. If the auditor is not within the geofenced area, the audit cannot be submitted.',
          },
          {
            title: 'Why it matters in distributed operations',
            content: 'As you add locations, the gap between reported audits and actual on-site audits widens. Area managers covering multiple locations may be tempted to complete audits from memory or from a previous visit rather than conducting a fresh on-site inspection. Without geo-verification, there is no way to distinguish between an audit completed on-site and one completed from a desk or a car.',
          },
          {
            title: 'What fails without geo verification',
            content: 'Checklists can be completed off-site and submitted as if they were on-site audits. The data looks fine in dashboards and reports, but it doesn\'t reflect what\'s actually happening at the branch. Over time, this creates a false baseline: leadership believes locations are being regularly audited when in practice, many audits are based on memory and assumption rather than observation.',
          },
          {
            title: 'How Audiment handles it',
            content: 'Audiment confirms the auditor was physically present using GPS location verification and combines that with timestamped photo evidence on critical checks. Every audit submission carries a location record that can be verified. Audits completed outside the geofenced area are flagged for review before they are counted in location scores.',
          },
          {
            title: 'Operational outcome',
            content: 'Higher trust in audit data, clearer accountability for area managers, and fewer audits completed from someone\'s car. When leadership knows audit data is geo-verified, they can rely on it to make resourcing and intervention decisions with confidence.',
          },
        ]}
        faqs={[
          {
            question: 'Does geo verification replace photo evidence?',
            answer: 'No. Geo verification confirms presence, while photo evidence confirms execution quality. Both are required for a fully verified audit. An auditor can be on-site but still submit low-quality evidence — geo-verification and proof requirements work together.',
          },
          {
            question: 'Can geo-verified audits work with offline use?',
            answer: 'Yes. Audit workflows can continue offline and sync when connectivity is restored. The GPS timestamp is captured at the time of audit completion and verified when the submission syncs.',
          },
          {
            question: 'Why is this important for area managers?',
            answer: 'It confirms that reported results came from someone who was actually at the branch on the day of the audit. Area managers covering large territories benefit from the accountability structure — it creates a consistent record of site visits that can be referenced in performance reviews.',
          },
          {
            question: 'Can I set the geofence radius for each location?',
            answer: 'Yes. Geofence radius can be configured per location to account for site size, parking distance, or other practical factors that affect where an auditor would physically be during an inspection.',
          },
        ]}
        relatedLinks={[
          { tag: 'Platform', title: 'Proof-Based Audits', href: '/platform/proof-based-audits', description: 'Combine location verification with execution evidence.' },
          { tag: 'Topic', title: 'Improving Accountability', href: '/improving-accountability', description: 'How verification supports accountability systems.' },
          { tag: 'Solutions', title: 'Retail Audit Software', href: '/solutions/retail-audit-software', description: 'Distributed store audits with verified presence.' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
