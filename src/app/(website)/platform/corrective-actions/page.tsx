import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Corrective Action Software (CAPA) | 48-Hour SLAs & Photo Proof | Audiment',
  description:
    'Convert failed audit checks into owned corrective actions with 48-hour deadlines, automated deadline reminders, photo verification, and corporate escalation.',
  path: '/platform/corrective-actions',
  keywords: [
    'corrective action software',
    'CAPA software',
    'corrective action tracking',
    'restaurant corrective actions',
    'audit issue management',
    'operational compliance SLA'
  ]
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment – Corrective Actions (CAPA)',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/corrective-actions',
  description:
    'Automated corrective action software for multi-location operations. Automatically routes failed checklist items into owned tasks with 48-hour SLAs, deadline reminder notifications, and mandatory photo verification.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/corrective-actions' },
    { '@type': 'ListItem', position: 3, name: 'Corrective Actions', item: 'https://audiment.in/platform/corrective-actions' }
  ]
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        path="/platform/corrective-actions"
        categoryTag="CAPA & Remediation"
        heroH1="Corrective Actions That Actually Close"
        heroSubheadline="Convert failed audit standards into owned remediation tasks with 48-hour SLAs, automated deadline reminders, and verified photo proof."
        sections={[
          {
            title: 'What happens when an audit check fails',
            content:
              'In traditional multi-location operations, an audit failure is recorded on a clipboard or spreadsheet and promptly forgotten. The store manager promises to fix it verbally, but with no formal ownership or tracking, the violation remains unresolved until the next scheduled visit.\n\nAudiment replaces informal verbal promises with an automated failure-to-task pipeline. When an auditor completes an inspection and marks any critical question as failed, Audiment’s scoring engine automatically generates an independent Corrective Action (CAPA) record tied to that specific outlet, question, and auditor note.'
          },
          {
            title: 'How ownership and the 48-hour SLA deadline work',
            content:
              'Every corrective action created by the system has three non-negotiable operational properties:\n\n1. A Designated Location Manager: The corrective action is automatically assigned to the manager mapped to that location node in the organization directory. If regional oversight requires reassignment, corporate administrators can reassign the task directly from the central console.\n\n2. An Enforceable 48-Hour Deadline: The system automatically calculates a fixed deadline exactly 48 hours from the moment the completed audit is submitted. This creates a standard, predictable remediation window across all branches rather than arbitrary open-ended to-do lists.\n\n3. Evidence-Backed Resolution Requirements: An action cannot be closed by simply toggling a checkbox. The branch manager must provide detailed resolution notes and can attach fresh photographic proof demonstrating that the root cause has been corrected.'
          },
          {
            title: 'How automated deadline reminders operate',
            content:
              'To ensure operational failures are addressed before they lapse, Audiment runs an automated background cron routine scheduled every hour.\n\nRather than flooding managers with repetitive messages, the system specifically evaluates open and in-progress corrective actions entering their final six hours before the 48-hour deadline (between current time and current time plus 6 hours). If a deadline reminder has not yet been dispatched, the cron sends a targeted in-app notification to the assigned location manager warning that remediation is due in less than 6 hours. The record is then marked as reminded to prevent duplicate alerts while maintaining urgent visibility.'
          },
          {
            title: 'The 6-step corrective action lifecycle',
            content:
              'Step 1: Failure Detection — During an on-site inspection, the auditor marks a critical checklist item (such as an out-of-range refrigerator or blocked fire exit) as failed and records field notes.\n\nStep 2: Automated Record Generation — Upon final audit submission, the scoring engine identifies the critical failure and writes an open Corrective Action record with location metadata, question text, and failure severity.\n\nStep 3: Assignment & 48-Hour Clock — The task appears in the assigned location manager\'s active queue with a deadline timestamp set exactly 48 hours forward.\n\nStep 4: Hourly Cron & 6-Hour Alert — An automated hourly cron checks for approaching deadlines. As the task enters its final 6 hours, a single high-priority notification prompts the manager to take action.\n\nStep 5: Manager Remediation & Evidence Submission — The branch manager carries out physical repairs, logs explanatory notes, uploads verification photos, and submits the task as completed.\n\nStep 6: Head-Office Verification & Closure — Corporate administrators review submitted evidence in the central dashboard. Administrators approve and resolve the action or reject it back to the branch manager if the submitted proof is inadequate.'
          },
          {
            title: 'Multi-location visibility and recurring failure detection',
            content:
              'For operations directors managing 20 to 100 locations, individual fixes matter less than systemic trends. Audiment centralizes all corrective actions across the network into unified admin dashboards.\n\nLeadership can filter tasks by location, status (open, in progress, completed, resolved), or assigned manager to identify which units consistently resolve issues on time and which allow violations to drag out. When a branch logs three consecutive low-scoring audits, the platform triggers an automated trend alert, enabling regional leaders to intervene before isolated defects become chronic operational failures.'
          }
        ]}
        faqs={[
          {
            question: 'What triggers the creation of a corrective action in Audiment?',
            answer:
              'A corrective action is automatically generated whenever an auditor marks a checklist item classified as "critical" as failed during a completed audit. The scoring engine evaluates the inspection upon submission and immediately creates a dedicated task in the database.'
          },
          {
            question: 'How is the 48-hour deadline calculated?',
            answer:
              'The deadline is established automatically at the exact timestamp of audit submission, set forward by 48 hours (Date.now() + 48 hours). This gives location managers a concrete, consistent timeframe to investigate and resolve critical non-compliances.'
          },
          {
            question: 'How do deadline reminders work?',
            answer:
              'Audiment runs a background cron endpoint every hour to check for open or in-progress corrective actions. When a task enters its final 6 hours before the 48-hour deadline (and has not previously received an alert), the system issues a single notification to the assigned manager warning that the deadline is approaching.'
          },
          {
            question: 'Can administrators reassign corrective actions or adjust deadlines?',
            answer:
              'Yes. While tasks are automatically routed to the location manager assigned to that outlet, organization administrators can manually reassign the action to a different manager or update the scheduled deadline from the admin corrective actions console.'
          },
          {
            question: 'What proof is required to resolve and close a corrective action?',
            answer:
              'To submit an action for completion, the responsible manager must provide detailed remediation notes and upload photographic proof showing the corrected condition. Organization administrators can then review the submitted photos and notes to formally mark the task as resolved or reject it back to in-progress if standards are not met.'
          },
          {
            question: 'How does head office track unresolved actions across multiple branches?',
            answer:
              'Head office administrators access an organization-wide Corrective Actions overview displaying open, in-progress, and resolved tasks across all branches. The dashboard supports location-level filtering and search, allowing operations leaders to identify delayed fixes and spot recurring operational weaknesses across store clusters.'
          }
        ]}
        relatedLinks={[
          {
            tag: 'Platform',
            title: 'Proof-Based Audits',
            href: '/platform/proof-based-audits',
            description: 'Require live photographic evidence on critical checklist items to verify ground reality.'
          },
          {
            tag: 'Platform',
            title: 'Issue Tracking',
            href: '/platform/issue-tracking',
            description: 'Track open, overdue, and resolved non-compliances across every store in your network.'
          },
          {
            tag: 'Platform',
            title: 'Geo-Verified Audits',
            href: '/platform/geo-verified-audits',
            description: 'Confirm field auditors and managers are physically on-site before audits can be submitted.'
          },
          {
            tag: 'Solution',
            title: 'Restaurant Audit Software',
            href: '/solutions/restaurant-audit-software',
            description: 'Food safety, kitchen cleanliness, and cold-chain compliance management for restaurant chains.'
          },
          {
            tag: 'Solution',
            title: 'QSR Audit Software',
            href: '/solutions/qsr-audit-software',
            description: 'Shift-by-shift compliance management built for high-volume fast-food chains.'
          },
          {
            tag: 'Topic',
            title: 'Operational Drift',
            href: '/operational-drift',
            description: 'Why multi-unit standards silently slip when corrective action follow-through is missing.'
          }
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
