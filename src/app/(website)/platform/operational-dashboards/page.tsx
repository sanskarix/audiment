import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Operational Dashboards | Audit Scores Across All Locations | Audiment',
  description: 'See which branches are failing and why. Audit scores, overdue corrective actions, and recurring failures across every location \u2013 in one real-time view.',
  path: '/platform/operational-dashboards',
  keywords: ['audit dashboard', 'operational dashboard software', 'multi-location audit reporting', 'branch performance dashboard', 'audit analytics'],
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment \u2013 Operational Dashboards',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/operational-dashboards',
  description: 'Real-time audit dashboards for multi-location operations. Track audit scores, overdue corrective actions, and recurring failures across every branch and region from a single view.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/operational-dashboards' },
    { '@type': 'ListItem', position: 3, name: 'Operational Dashboards', item: 'https://audiment.in/platform/operational-dashboards' },
  ],
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        heroH1="See which branches are failing \u2013 and why"
        heroSubheadline="Audit scores, overdue fixes, and recurring failures across every location \u2013 in one view."
        sections={[
          {
            title: 'What are audit dashboards?',
            content: 'Audit dashboards aggregate scores, open issues, and trend data by location, region, and checklist area – giving operations teams and leadership a single-screen view of where standards are holding and where they are eroding. Instead of receiving weekly reports from individual managers, leadership can see the state of all locations in real time, drill into specific branches, and identify where corrective action is most urgent.',
          },
          {
            title: 'Why they matter at scale',
            content: 'Without a central audit view, operations leaders react to one-off incidents instead of catching patterns before they escalate. A location with a declining audit score over three consecutive weeks is a signal that something systemic is wrong. Without dashboards that surface that trend, the decline goes unnoticed until it produces a customer complaint, a failed inspection, or a brand audit failure.',
          },
          {
            title: 'What fails without them',
            content: 'Leaders spend time chasing updates via WhatsApp and calls – one manager at a time, one location at a time. Recurring failures at the same location or in the same category don\'t get flagged because nobody is looking at aggregated data across the network. The management review becomes a process of compiling information rather than acting on it.',
          },
          {
            title: 'How Audiment handles it',
            content: 'Audiment dashboards show which locations scored low in the last audit cycle, which corrective actions are overdue, and where the same issues keep recurring across multiple branches. Area managers and regional leaders get location-level and roll-up views without needing to request reports or consolidate data manually.',
          },
          {
            title: 'Operational outcome',
            content: 'Management attention goes to the branches that need it most – identified by data rather than by the loudest complaint. Declining locations get flagged before they become crises. Patterns of recurring failure get addressed at the system level rather than being managed as isolated incidents at each location.',
          },
        ]}
        faqs={[
          {
            question: 'Can dashboards show branch and region views?',
            answer: 'Yes. You can view by individual branch or roll up by region. This lets area managers focus on their territory while regional leadership sees the aggregate view across multiple area managers.',
          },
          {
            question: 'Do dashboards include corrective action status?',
            answer: 'Yes. Open, overdue, and resolved corrective actions show alongside audit scores. This gives managers one place to see both the audit result and the follow-through status for each location.',
          },
          {
            question: 'Who benefits most from these dashboards?',
            answer: 'Area managers and leadership. They see which branches need attention without waiting for someone to report it. Branch managers can also use dashboards to track their own performance trends and identify patterns before an area manager visit.',
          },
          {
            question: 'How current is the data in the dashboard?',
            answer: 'Dashboard data updates in real time as audits are submitted. There is no end-of-day batch process or manual refresh required. When an audit is completed, the scores and any resulting issues are immediately visible in the dashboard.',
          },
        ]}
        relatedLinks={[
          { tag: 'Topic', title: 'Maintaining Standards Across Locations', href: '/maintaining-standards-across-locations', description: 'Why consistency requires reliable audit data.' },
          { tag: 'Platform', title: 'Proof-Based Audits', href: '/platform/proof-based-audits', description: 'Evidence-backed audits that make dashboard data trustworthy.' },
          { tag: 'Solutions', title: 'Multi-Location Audit Software', href: '/multi-location-audit-software', description: 'Category page for distributed operations.' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
