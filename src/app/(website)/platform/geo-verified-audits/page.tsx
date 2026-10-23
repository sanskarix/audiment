import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Geo-Verified Audits | Location & Timestamp Verification | Audiment',
  description:
    'Capture device GPS coordinates and server timestamps upon audit submission. Verify field visits, deter off-site checklist completion, and support operational accountability across multi-location networks.',
  path: '/platform/geo-verified-audits',
  keywords: [
    'geo-verified audits',
    'location-verified audit software',
    'field audit GPS verification',
    'timestamped audit inspections',
    'multi-location field audits',
    'couch auditing prevention'
  ]
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment – Geo-Verified Audits',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/geo-verified-audits',
  description:
    'Geo-verified audit software for multi-location businesses. Captures device GPS coordinates and server-authoritative timestamps on final audit submission, ensuring verifiable field activity across all locations.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/geo-verified-audits' },
    { '@type': 'ListItem', position: 3, name: 'Geo-Verified Audits', item: 'https://audiment.in/platform/geo-verified-audits' }
  ]
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        path="/platform/geo-verified-audits"
        categoryTag="Field Verification"
        heroH1="Geo-Verified Audits for Multi-Location Operations"
        heroSubheadline="Capture device GPS coordinates and server-authoritative timestamps on final audit submission. Verify field visits, deter off-site checklist completion, and strengthen operational accountability across your network."
        sections={[
          {
            title: 'What is a geo-verified audit?',
            content:
              'In distributed multi-outlet operations, head office relies on field consultants, area coaches, and store supervisors to conduct regular on-site inspections. However, when checklists are managed through spreadsheets or generic digital forms, there is no technical check to ensure the inspector actually visited the outlet.\n\nA geo-verified audit captures the mobile device’s geographic coordinates (latitude and longitude) alongside a server-authoritative timestamp at the exact moment the completed audit is submitted. This creates a documented record of where and when the inspection was finalized, deterring off-site "couch auditing" and establishing a verifiable baseline for field operations.'
          },
          {
            title: 'How location capture and server timestamps work',
            content:
              'Audiment integrates location and time verification directly into the final submission routine:\n\n1. High-Accuracy Coordinate Capture: When the auditor clicks "Submit Audit", the application queries the browser Geolocation API with high accuracy enabled. The device retrieves the current latitude, longitude, and accuracy status.\n\n2. Mandatory Location Gate: Successful location capture is mandatory to submit the audit. If the browser denies location permissions, or if device location services are switched off, Audiment halts the submission process and displays an on-screen dialog prompting the user to grant location access before the report can be committed.\n\n3. Cloud Server Timestamps: Rather than relying on the device clock—which could be modified or inaccurate—Audiment records the final completion time using server-generated timestamps directly in the database. The coordinates and submission timestamp are stored on the permanent audit record for corporate review.'
          },
          {
            title: 'How location records help managers review field activity',
            content:
              'For operations directors managing 20 to 100 locations, personal verification of every store walk is impossible. Geo-verification gives leadership an objective audit trail to evaluate field oversight:\n\n• Verifiable Field Activity: Corporate administrators and regional directors can view the recorded submission coordinates and completion timestamp in every audit report, allowing them to confirm that inspections correspond to scheduled branch visits.\n\n• Deterring Proxy and Retrospective Reporting: When inspectors know that submission coordinates are logged, the temptation to complete audits from memory—at home, in transit, or from a central office—is significantly diminished.\n\n• Objective Operational Oversight: Location data provides documented supporting evidence during performance reviews with field consultants and area managers, replacing anecdotal trust with verifiable activity logs.'
          },
          {
            title: 'How geo-verification complements photo evidence and CAPAs',
            content:
              'Geo-verification is one layer in Audiment’s broader operational accountability system:\n\n1. Location Verification + Proof-Based Audits: Capturing GPS coordinates confirms where the inspection report was finalized, but it does not evaluate physical quality. Audiment pairs location verification with mandatory photo evidence on critical checklist items (such as walk-in cooler thermometers or clean prep stations), ensuring visual proof matches location presence.\n\n2. Automatic Corrective Actions: If an on-site audit surfaces a critical failure, Audiment automatically generates a Corrective Action task assigned to the branch manager with an enforceable 48-hour SLA deadline.\n\n3. Centralized Multi-Location Dashboards: Corporate administrators review aggregated audit scores, photo evidence, and submission records across the entire store network, tracking compliance trends over time.'
          },
          {
            title: 'Technical boundaries: What geo-verification does and does not prove',
            content:
              'Audiment maintains strict transparency regarding what location verification can and cannot technically enforce:\n\nWhat It Provides:\n• It captures device GPS coordinates and cloud-server timestamps at the exact moment of final audit submission.\n• It halts final submission if location capture is blocked or unavailable.\n• It creates a documented operational record that can be reviewed against store addresses.\n\nWhat It Does Not Guarantee:\n• It does not prove the personal identity of the individual operating the device (authentication verifies user account credentials, not biometric identity).\n• It does not prevent sophisticated operating-system-level GPS spoofing or mock-location developer tools.\n• It does not prove how long an auditor spent walking the floor prior to pressing submit.\n• It is an operational accountability and deterrence tool, not a cryptographic or forensic guarantee.\n\nNetwork Requirement: Submitting completed audits and uploading high-resolution evidence photos requires an active internet connection. Offline operation and automatic offline background synchronization are not supported.'
          }
        ]}
        faqs={[
          {
            question: 'How are location coordinates captured during an audit in Audiment?',
            answer:
              'When the auditor finishes inspecting checklist items and taps "Submit Audit", the web application invokes the browser Geolocation API with high accuracy enabled. The device captures current latitude and longitude coordinates, which are transmitted to the cloud database alongside server-generated timestamps.'
          },
          {
            question: 'What happens if an auditor denies browser location permissions?',
            answer:
              'If location access is denied or unavailable on the device, Audiment halts the submission process and displays an error dialog. The audit report cannot be submitted or scored until location permissions are enabled and coordinates are successfully captured.'
          },
          {
            question: 'Does Audiment prove physical presence or prevent GPS spoofing?',
            answer:
              'No. Device geolocation provides strong operational evidence of where the audit was finalized, but it cannot prevent intentional OS-level GPS spoofing or prove how long the person remained on-site. Audiment frames geo-verification as an operational deterrence and review mechanism rather than an infallible anti-tamper guarantee.'
          },
          {
            question: 'Does geo-verification work offline in basements without signal?',
            answer:
              'No. Audiment requires an active internet connection to submit completed audits, commit location records, upload photo evidence, and trigger automated corrective actions. Offline audit synchronization is not supported.'
          },
          {
            question: 'How do managers and head office review captured location records?',
            answer:
              'Organization administrators and regional managers can view the recorded latitude, longitude, and submission timestamp directly within the audit report header and activity overview in the central dashboard.'
          },
          {
            question: 'Why should teams combine geo-verification with photo-based audits?',
            answer:
              'GPS coordinates confirm submission location, but cannot reveal whether a prep table is clean or an ingredient is expired. Requiring live photo evidence on critical checks ensures that on-site presence is backed by visual ground reality.'
          }
        ]}
        relatedLinks={[
          {
            tag: 'Platform',
            title: 'Proof-Based Audits',
            href: '/platform/proof-based-audits',
            description: 'Enforce live photographic evidence on critical checklist items to verify ground reality.'
          },
          {
            tag: 'Platform',
            title: 'Corrective Actions',
            href: '/platform/corrective-actions',
            description: 'Convert failed audit checks into owned remediation tasks with 48-hour SLAs.'
          },
          {
            tag: 'Platform',
            title: 'Issue Tracking',
            href: '/platform/issue-tracking',
            description: 'Track open, overdue, and resolved non-compliances across every store in your network.'
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
            description: 'Operational audit workflows designed for multi-outlet restaurant chains and cloud kitchens.'
          },
          {
            tag: 'Solution',
            title: 'Franchise Audit Software',
            href: '/solutions/franchise-audit-software',
            description: 'Protect brand standards and verify field consultant visits across franchised units.'
          }
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
