import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Issue Tracking Software | Audit Non-Conformances & Resolution | Audiment',
  description:
    'Track operational non-conformances across multi-location networks. Review audit findings by severity, automate 48-hour corrective actions for critical failures, and detect recurring branch trends.',
  path: '/platform/issue-tracking',
  keywords: [
    'issue tracking software',
    'audit issue management',
    'operational non-conformance tracking',
    'corrective action issue tracking',
    'multi-location issue tracking',
    'audit finding reports',
    'recurring operational failure tracking'
  ]
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment – Issue Tracking',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/issue-tracking',
  description:
    'Operational issue tracking software for multi-location businesses. Surfaces audit findings by severity, routes critical checklist failures into 48-hour corrective action tasks with photo proof, and identifies recurring low-score trends across branch networks.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/issue-tracking' },
    { '@type': 'ListItem', position: 3, name: 'Issue Tracking', item: 'https://audiment.in/platform/issue-tracking' }
  ]
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        path="/platform/issue-tracking"
        categoryTag="Operational Accountability"
        heroH1="Issue Tracking Across Every Location"
        heroSubheadline="Capture inspection non-conformances, distinguish routine findings from critical failures, and track high-risk corrective actions to verified closure across your entire branch network."
        sections={[
          {
            title: 'How inspection issues are surfaced across locations',
            content:
              'In multi-unit operations, field inspections uncover a wide range of operational issues—from minor cosmetic oversights (such as an unaligned marketing poster) to high-risk food safety hazards (such as an out-of-temperature walk-in cooler). When audits rely on paper binders or chat messages, non-conformances get mixed together without clear severity classification or resolution ownership.\n\nAudiment structures every inspection finding into a digital record. When an auditor completes an inspection, responses are saved per question with assigned severity levels (critical, high, medium, low), auditor notes, and attached photographic proof. Central teams and location managers can review comprehensive audit reports, filtering findings to understand exactly where execution broke down.'
          },
          {
            title: 'General audit findings vs. automated corrective actions',
            content:
              'An essential operational distinction within Audiment is how general inspection findings differ from automated corrective actions:\n\n1. General Audit Findings (All Questions): Every failed check across an audit is recorded in the permanent audit report. Non-critical failures (such as minor housekeeping issues or low-severity observations) factor into the location\'s overall score percentage and grade, and are preserved in downloadable PDF reports for supervisory review. However, non-critical findings do not trigger urgent task escalation.\n\n2. Automated Corrective Actions (Critical Failures Only): When an auditor marks a checklist item classified as "critical" as failed (such as raw meat cross-contamination or an unmonitored cold-chain unit), the scoring engine automatically creates an independent Corrective Action (CAPA) document. This generates an assigned task in the branch manager\'s queue with an enforceable 48-hour deadline and requires documented notes and photographic proof before corporate closure.'
          },
          {
            title: 'How managers and head office review issue status and proof',
            content:
              'Audiment provides role-based interfaces to monitor issues from initial detection through to closure:\n\n• Location Manager Console: Branch managers view corrective actions assigned to their specific outlet. They can transition an action to "in progress" while remediation is underway. To submit an action for completion, the manager must input detailed resolution notes and upload fresh photographic proof showing the corrected condition.\n\n• Corporate Administrator Dashboard: Head office administrators access a network-wide Corrective Actions overview with real-time search (by location name, issue text, or manager name) and status filtering. Administrators review the manager\'s submitted notes and photos. If the fix meets corporate standards, the admin marks the task as formally "resolved"; if the proof is inadequate, the admin can reject the action back to "in progress".\n\n• PDF Audit Reports: Full inspection reports—including all passed, failed, and critical findings with full notes and embedded photos—can be exported directly to branded PDF documents for official records or stakeholder reviews.'
          },
          {
            title: 'Centralized dashboards and low-score trend alerts',
            content:
              'Managing 20 to 100 locations requires identifying systemic weaknesses before they result in customer complaints or compliance audits:\n\n• Central Performance Dashboards: Operations leaders track overall organization compliance percentages, individual outlet score averages, and score distributions over time using interactive trend charts.\n\n• Color-Coded Branch Scoring: Audiment automatically categorizes branch performance using clear visual tiers: green for high-performing units (90% and above), blue for acceptable operations (70% to 89%), and red for substandard compliance (below 70%).\n\n• Automated 3-Consecutive Low-Score Trend Alerts: When an individual branch records three consecutive low-scoring audits, Audiment’s monitoring engine automatically triggers a trend alert notification to corporate administrators, spotlighting chronic operational failure so regional coaches can intervene with targeted operational support.'
          },
          {
            title: 'The operational outcome: Closed-loop accountability',
            content:
              'By establishing a clear technical boundary between routine observations and critical corrective actions, Audiment prevents alert fatigue while guaranteeing rigorous follow-through on high-risk violations:\n\n• Focus on High-Risk Non-Conformances: Store teams are not overwhelmed by dozens of trivial action items; instead, automated 48-hour timers focus attention on genuine operational risks.\n\n• Defensible Verification Trail: Every resolved critical issue carries before-and-after photographic evidence, timestamped notes, and administrative approval.\n\n• Data-Driven Interventions: Multi-location leaders allocate training and field support based on verifiable compliance trends rather than subjective impressions.'
          }
        ]}
        faqs={[
          {
            question: 'Does every failed audit check automatically create a corrective action?',
            answer:
              'No. Audiment specifically reserves automated corrective action generation for checklist items classified as "critical". Non-critical failures (such as minor housekeeping or cosmetic observations) are tracked in the comprehensive audit report and affect the overall score percentage, but do not spawn 48-hour corrective action tasks.'
          },
          {
            question: 'What statuses exist for tracking corrective actions?',
            answer:
              'Corrective actions move through four distinct statuses: "open" (created upon audit submission), "in_progress" (acknowledged by the location manager during remediation), "completed" (remediation submitted by the manager with notes and photo proof), and "resolved" (reviewed and officially approved by an organization administrator). If evidence is insufficient, an administrator can reject a completed task back to "in_progress".'
          },
          {
            question: 'How are corrective actions assigned to owners?',
            answer:
              'When a critical failure occurs, the task is automatically assigned to the location manager mapped to that specific outlet node in the organizational directory. Organization administrators can also manually reassign the action to a different manager or adjust the scheduled deadline from the admin console.'
          },
          {
            question: 'How does head office identify recurring failures across branch clusters?',
            answer:
              'Corporate administrators view an organization-wide compliance matrix that color-codes locations (green for 90%+, blue for 70%–89%, and red for below 70%). Furthermore, if any location records three consecutive low-scoring audits, Audiment automatically triggers a trend alert notification to corporate administrators to flag chronic operational drift.'
          },
          {
            question: 'Can audit finding reports be exported for external review?',
            answer:
              'Yes. Completed audit reports—including all passed checks, non-critical failures, critical failures, auditor notes, and photo evidence—can be exported directly to standardized PDF files from the report detail view.'
          },
          {
            question: 'How do deadline reminders work for open corrective actions?',
            answer:
              'Audiment runs an automated background cron routine every hour. When an open or in-progress corrective action enters its final 6 hours before its 48-hour deadline (and has not already received an alert), the system issues a single targeted in-app notification to the assigned manager warning that remediation is due soon.'
          }
        ]}
        relatedLinks={[
          {
            tag: 'Platform',
            title: 'Corrective Actions',
            href: '/platform/corrective-actions',
            description: 'Deep dive into 48-hour SLAs, automated cron reminders, and photo-backed resolution.'
          },
          {
            tag: 'Platform',
            title: 'Proof-Based Audits',
            href: '/platform/proof-based-audits',
            description: 'Enforce live photographic evidence on critical checkpoints to verify ground reality.'
          },
          {
            tag: 'Platform',
            title: 'Geo-Verified Audits',
            href: '/platform/geo-verified-audits',
            description: 'Capture device GPS coordinates and server timestamps upon final audit submission.'
          },
          {
            tag: 'Core Use',
            title: 'Multi-Location Audit Software',
            href: '/multi-location-audit-software',
            description: 'Maintain quality consistency and operational accountability across distributed outlets.'
          },
          {
            tag: 'Solution',
            title: 'Restaurant Audit Software',
            href: '/solutions/restaurant-audit-software',
            description: 'Food safety, kitchen cleanliness, and cold-chain compliance management for restaurant chains.'
          },
          {
            tag: 'Solution',
            title: 'Franchise Audit Software',
            href: '/solutions/franchise-audit-software',
            description: 'Protect brand standards and track non-conformances across independently operated franchise units.'
          }
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
