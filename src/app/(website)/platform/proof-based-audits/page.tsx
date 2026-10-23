import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Proof-Based Audits | Live Camera Evidence & Verification | Audiment',
  description:
    'Require live photographic evidence on critical audit checks so you know what is actually happening at every location. Eliminate checklist pencil-whipping with verified operational proof.',
  path: '/platform/proof-based-audits',
  keywords: [
    'proof-based audits',
    'evidence-based audit software',
    'photo audit software',
    'audit verification',
    'live camera audit',
    'checklist fraud prevention'
  ]
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment – Proof-Based Audits',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/platform/proof-based-audits',
  description:
    'Proof-based audit software requiring live photo evidence on critical checklist items. Eliminates trust-based self-reporting and verifies actual physical execution across multi-location operations.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Platform', item: 'https://audiment.in/platform/proof-based-audits' },
    { '@type': 'ListItem', position: 3, name: 'Proof-Based Audits', item: 'https://audiment.in/platform/proof-based-audits' }
  ]
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        path="/platform/proof-based-audits"
        categoryTag="Audit Verification"
        heroH1="Proof-Based Audits Across Every Location"
        heroSubheadline="Every critical check requires evidence. Eliminate trust-based checklist completion with live in-app camera capture and verified field proof."
        sections={[
          {
            title: 'What is a proof-based audit and why does it matter?',
            content:
              'In traditional operations management, field checklists rely entirely on trust. An auditor or shift supervisor walks past a food preparation station or storage area, taps "Passed" on a mobile form or clipboard, and submits the inspection. When staff are pressed for time, this self-reporting model inevitably leads to "pencil-whipping" — marking tasks complete without verifying actual physical conditions.\n\nA proof-based audit eliminates passive self-reporting by requiring verifiable visual evidence before a critical check can be completed. When a checklist item is flagged as requiring proof, the inspector cannot submit the audit until they capture live visual evidence directly within the application, binding ground reality to the digital inspection record.'
          },
          {
            title: 'How photographic evidence is captured during an audit',
            content:
              'Audiment integrates evidence collection directly into the inspection execution workflow:\n\n1. Question-Level Photo Requirements: When administrators build audit blueprints, they can toggle mandatory photo evidence on critical checkpoints — such as refrigeration temperature gauges, sanitization chemical test strips, grease trap cleanouts, or fire safety exits.\n\n2. Live Viewfinder Engagement: When the auditor reaches an evidence-required item, the interface prompts them to open the camera. Audiment accesses the device\'s media stream (utilizing the rear-facing environment camera) so the inspector views the physical object in real time.\n\n3. Instant Capture & Cloud Storage: When the inspector taps the capture button, the video frame is drawn onto an in-browser canvas, converted into a high-resolution JPEG blob, and securely uploaded to cloud storage. The image URL is permanently attached to that question response.\n\n4. Submission Gate: If a checklist item mandates photographic evidence, the audit navigation blocks final submission until at least one valid photo is captured and uploaded.'
          },
          {
            title: 'What live camera capture can and cannot enforce',
            content:
              'To design an effective operational compliance strategy, operations leaders must understand the practical capabilities and boundaries of live photo capture:\n\nWhat It Enforces:\n• It forces inspectors to physically walk up to equipment, stations, and prep lines with their device camera active.\n• It eliminates rapid bulk checkbox ticking by creating a tangible verification step on high-risk checks.\n• It attaches visual records directly to individual audit questions, allowing area coaches and corporate directors to inspect actual store conditions remotely.\n• It provides indisputable visual context when an auditor documents a critical defect.\n\nWhat It Cannot Enforce:\n• It cannot physically stop a dishonest user from pointing their camera at a pre-existing photo displayed on another screen or printed paper.\n• It does not autonomously evaluate image content without human supervisory review.\n\nProof-based auditing is an operational accountability and deterrence system, not an infallible cryptographic anti-fraud guarantee. It shifts the burden from blind trust to transparent, reviewable visual artifacts.'
          },
          {
            title: 'Submission timestamps and GPS location verification',
            content:
              'Photographic evidence is paired with location and time verification to ensure inspections reflect genuine store visits:\n\n• Server-Authoritative Timestamps: Every audit submission, response record, and corrective action uses server-generated timestamps recorded directly in the cloud database, preventing manipulation of device clocks.\n\n• Geolocation Capture on Submission: When the auditor submits the completed audit report, Audiment queries the device\'s browser Geolocation API with high accuracy enabled. The latitude, longitude, and capture status are stored alongside the audit record. If location permissions are denied or unavailable, the system displays an error prompt halting final submission until coordinates are captured.\n\nFor multi-unit networks seeking to verify physical presence against registered store addresses, review our dedicated guide to Geo-Verified Audits.'
          },
          {
            title: 'Understanding current evidence limitations and fraud deterrence',
            content:
              'Audiment believes in absolute clarity regarding product capabilities and technical limitations:\n\n1. Gallery Uploads: While the primary auditor inspection workflow triggers live camera access, web browsers and mobile operating systems handle file access permissions differently. Furthermore, secondary workflows (such as manager corrective action resolutions) utilize standard file upload pickers where staff can select photos from their library.\n\n2. Duplicate Image Detection: Audiment does not currently perform automated perceptual hashing or duplicate-photo comparison across past audits.\n\n3. EXIF Data Handling: Because in-app camera snapshots are rendered via HTML5 canvas for reliable cross-platform browser support, device EXIF headers are not preserved in the uploaded image file. Instead, verified server timestamps and GPS submission coordinates provide the authoritative audit trail.\n\nThese capabilities provide powerful operational accountability that deters casual non-compliance and gives regional managers concrete visual evidence to review across dozens of locations.'
          }
        ]}
        faqs={[
          {
            question: 'What is the difference between a traditional checklist and a proof-based audit?',
            answer:
              'A traditional checklist relies on self-reported yes/no checkboxes that can easily be completed from memory or without inspecting the physical station. A proof-based audit mandates live visual evidence — such as photos of temperature gauges, sanitized surfaces, or safety equipment — before critical checkpoints can be marked complete and submitted.'
          },
          {
            question: 'How does live camera capture work within the Audiment audit interface?',
            answer:
              'When an auditor reaches a checklist item requiring proof, tapping "Take Photo" activates the device camera via browser media APIs. The auditor frames the physical subject, captures the image, and the system automatically renders, compresses, and uploads the photo to secure cloud storage, attaching it directly to the response record.'
          },
          {
            question: 'Can staff upload old photos from their device camera roll?',
            answer:
              'In the primary auditor inspection interface, the system directly invokes the live camera stream for capturing checklist evidence. However, depending on browser settings and mobile operating system permissions, some devices may offer file selection options, and manager resolution forms allow file uploads. Audiment does not claim universal gallery locking across all mobile browser environments.'
          },
          {
            question: 'Does Audiment detect duplicate photos or validate EXIF timestamps?',
            answer:
              'No. Audiment does not perform automated duplicate-image hashing or EXIF timestamp analysis. Because in-app camera captures are processed through an HTML5 canvas to ensure universal mobile web compatibility, original camera EXIF headers are stripped. Audiment relies on server-authoritative submission timestamps and device GPS coordinates for verification.'
          },
          {
            question: 'Does capturing photos slow down store audits?',
            answer:
              'No. Evidence requirements are typically configured only on high-risk critical checks — such as cold-chain temperatures, raw protein storage, or fire exit clearance — which usually represent 10% to 20% of an audit. Capturing 4 to 8 targeted photos adds only a couple of minutes to an inspection while dramatically increasing data reliability.'
          },
          {
            question: 'What happens when an evidence photo reveals an operational failure?',
            answer:
              'If the photo confirms a failed critical standard, the auditor marks the question as failed. Upon audit submission, Audiment’s scoring engine automatically generates a Corrective Action task assigned to the location manager with an enforceable 48-hour deadline and automated deadline reminders.'
          }
        ]}
        relatedLinks={[
          {
            tag: 'Platform',
            title: 'Corrective Actions',
            href: '/platform/corrective-actions',
            description: 'Convert failed evidence checks into owned remediation tasks with 48-hour SLAs.'
          },
          {
            tag: 'Platform',
            title: 'Geo-Verified Audits',
            href: '/platform/geo-verified-audits',
            description: 'Confirm field auditors and managers are physically on-site when submitting audits.'
          },
          {
            tag: 'Platform',
            title: 'Issue Tracking',
            href: '/platform/issue-tracking',
            description: 'Track open, overdue, and resolved non-compliances across every store in your network.'
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
            description: 'Why multi-unit standards silently slip when inspections lack visual verification.'
          }
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
