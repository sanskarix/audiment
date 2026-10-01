import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Issue Tracking Software | From Detection to Closure | Audiment',
  description: 'Track every failed audit check from detection to verified closure with clear ownership, SLA deadlines, and photo proof. Built for multi-location operations.',
  path: '/platform/issue-tracking',
  keywords: ['issue tracking software', 'corrective action tracking', 'audit issue management', 'multi-location issue tracking', 'operations management software'],
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment \u2013 Issue Tracking',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/issue-tracking',
  description: 'Issue tracking software for multi-location operations. Every failed audit check becomes a tracked issue with an owner, due date, severity classification, and closure proof requirement.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/issue-tracking' },
    { '@type': 'ListItem', position: 3, name: 'Issue Tracking', item: 'https://audiment.in/platform/issue-tracking' },
  ],
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        heroH1="Issue Tracking Across Every Location"
        heroSubheadline="Track issues from detection to verified closure with accountability built in."
        sections={[
          {
            title: 'What is issue tracking in operations?',
            content: 'Issue tracking records a failed standard, assigns it to a named owner, sets a deadline based on severity, and confirms resolution with photographic proof. The issue lifecycle moves from detection to assignment to closure – with every step documented and visible to central teams. This is what separates a tracked failure from a verbal note that gets forgotten.',
          },
          {
            title: 'Why it matters in multi-location operations',
            content: 'Without a single issue tracking workflow, failed checks disappear into WhatsApp messages and phone calls. Leaders can\'t see what\'s open across their network, what\'s overdue, or which locations have the same failures recurring. The result is that high-risk issues sit alongside low-priority observations in the same informal queue – with no visibility into which are actually resolved.',
          },
          {
            title: 'What fails without it',
            content: 'Recurring issues stay open because no system tracks them to verified closure. Accountability weakens because nobody can see what\'s assigned to whom. High-risk failures get treated like low-priority tasks because everything looks equal without severity classification. Over time, the same issues appear in audit after audit at the same locations – until they escalate into customer complaints or compliance incidents.',
          },
          {
            title: 'How Audiment handles it',
            content: 'Audiment creates corrective actions automatically from failed audit checks – no manual creation required. Each issue is routed to a named owner, given a severity-appropriate due date, and tracked until closure is verified with photo evidence. Central teams see open issues, overdue actions, and repeat failures across all locations in a single dashboard view.',
          },
          {
            title: 'Operational outcome',
            content: 'Teams resolve issues faster because every failure has a clear owner and a deadline. Central teams see exactly what\'s overdue at each location without waiting for status updates. Standards hold more consistently as you scale because the issue tracking system provides the accountability structure that informal follow-up cannot.',
          },
        ]}
        faqs={[
          {
            question: 'Can issue tracking handle recurring failures?',
            answer: 'Yes. Teams can identify repeated failures by location, checklist area, and timeline. When the same issue recurs two or more times at the same location, it is flagged for pattern review so managers can investigate root cause rather than just closing the symptom.',
          },
          {
            question: 'How do managers know what is overdue?',
            answer: 'Audiment shows open and overdue corrective actions in one view with clear ownership and days overdue. Area managers receive notifications when critical issues approach or pass their SLA deadline without closure.',
          },
          {
            question: 'Is issue tracking separate from audits?',
            answer: 'No. Issue tracking is connected directly to audit outcomes so failed standards immediately become accountable actions. There is no manual step between detecting a failure and creating a tracked issue.',
          },
          {
            question: 'What does closure verification look like?',
            answer: 'Issue closure requires a photo of the resolved state – a cleaned surface, a restocked station, a repaired piece of equipment. The closure photo is timestamped and attached to the issue record, creating a documented resolution trail that can be referenced if the issue recurs.',
          },
        ]}
        relatedLinks={[
          { tag: 'Platform', title: 'Corrective Actions', href: '/platform/corrective-actions', description: 'How issue ownership and deadlines are enforced.' },
          { tag: 'Topic', title: 'Improving Accountability', href: '/improving-accountability', description: 'Why accountability systems fail without clear ownership.' },
          { tag: 'Solutions', title: 'Franchise Audit Software', href: '/solutions/franchise-audit-software', description: 'Issue tracking across distributed outlets.' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
