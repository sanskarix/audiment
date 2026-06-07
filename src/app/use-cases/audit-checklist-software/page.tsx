import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Audit Checklist Software | Maintain Consistent Standards Across Locations',
  description: 'Audiment is audit management software for multi-location businesses. Digital audit forms with conditional logic, photo evidence, and weighted scoring replace paper checklists that hide problems.',
  path: '/use-cases/audit-checklist-software',
})

export default function AuditChecklistSoftware() {
  return (
    <UseCaseTemplate
      title="Digital Audit Checklist Software"
      heroH1="Digital Audit Checklist Software – Build, Assign and Track Checklists at Scale"
      heroSubheadline="Paper checklists tell you everything passed. Digital checklists with photo evidence show you what actually happened. There's a difference."
      primaryKeyword="digital audit checklists"
      operationalScenario={{
        title: "The gap between a checked box and a verified standard",
        before: "Your opening checklist has 25 items. The kitchen manager checks all 25 in 3 minutes – without leaving the office. The paper says 'pass'. The walk-in freezer has been at -12°C instead of -18°C for a week. You find out when inventory spoils.",
        after: "The same checklist now requires a live photo of the freezer thermometer. The manager can't submit without it. When the photo shows -12°C, a corrective action is auto-created with a 24-hour SLA. You see the issue the same morning – not when it becomes a write-off."
      }}
      features={[
        {
          title: "Conditional Logic Builders",
          description: "Build dynamic workflows where questions adapt based on previous answers. If a fridge fails a temp check, the checklist expands to trigger the spoilage reporting protocol automatically."
        },
        {
          title: "Evidence-Mandatory Questions",
          description: "Mark high-risk items as photo-required. The audit cannot be submitted without a live, timestamped photo proving the physical state of that specific checkpoint."
        },
        {
          title: "Server-Verified Timestamps",
          description: "Every interaction is logged against server time and GPS coordinates, creating a reliable accountability trail that shows exactly when and where each check was performed."
        }
      ]}
      benefits={[
        {
          title: "Actionable Data, Not Dead Forms",
          description: "Paper checklists go into a cabinet and stay there. Digital checklists feed live dashboards showing you where the same failures keep recurring."
        },
        {
          title: "Instant Root-Cause Identification",
          description: "Stop guessing why customer complaints rise on weekends. Cross-reference shift audit scores with performance data to see the pattern immediately."
        },
        {
          title: "Frictionless Staff Adoption",
          description: "Front-line employees don't need training sessions. The mobile interface guides them step-by-step through the exact operational standard required. Tap pass or fail, take a photo, move on."
        }
      ]}
      faqs={[
        {
          question: "How do we import our existing Excel sheets or PDFs?",
          answer: "Our onboarding team routinely digitizes legacy spreadsheets and paper checklists into smart Audiment templates, usually within 48 hours of kickoff."
        },
        {
          question: "Can we prevent staff from uploading old photos?",
          answer: "Yes. Gallery uploads are blocked by default. Auditors must use the live in-app camera, ensuring the evidence represents the current state."
        },
        {
          question: "Does it support offline audit runs?",
          answer: "Yes. Audits continue offline and sync automatically once the device reconnects."
        },
        {
          question: "How does scoring work?",
          answer: "You assign custom weights to each question. The software aggregates responses into a percentage score, flagging critical compliance failures separately from minor issues."
        },
        {
          question: "Can reports be shared with supervisors or health inspectors?",
          answer: "Yes. Completed audits instantly generate a PDF report containing all photos, notes, timestamps, and locations, ready to export or share."
        }
      ]}
    />
  )
}
