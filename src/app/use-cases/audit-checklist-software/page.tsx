import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'

export const metadata = {
  title: 'Audiment | Digital audit checklists that enforce photo evidence, not just tick-boxes',
  description: 'Audiment replaces paper checklists with smart digital audit forms – conditional logic, mandatory photo requirements, weighted scoring, and instant distribution to every location.',
  alternates: { canonical: 'https://audiment.in/use-cases/audit-checklist-software' }
}

export default function AuditChecklistSoftware() {
  return (
    <UseCaseTemplate
      title="Digital Audit Checklist Software"
      heroH1="Digital Audit Checklist Software – Build, Assign and Track Checklists at Scale"
      heroSubheadline="Retire paper clipboards permanently. Build, distribute, and track digital audit checklists that enforce photo evidence and prove physical presence."
      primaryKeyword="digital audit checklist software"
      features={[
        {
          title: "Operational Logic Builders",
          description: "Build dynamic workflows. If a fridge fails a temp check, the checklist automatically expands to trigger the spoilage reporting protocol."
        },
        {
          title: "Proof-Enforced Questions",
          description: "Mark high-risk items as evidence-mandatory. The audit cannot be submitted without a live, timestamped photo proving the physical state."
        },
        {
          title: "Tamper-Proof Timestamps",
          description: "Every interaction is logged against server time and GPS coordinates, creating an airtight accountability trail that cannot be pencil-whipped."
        }
      ]}
      benefits={[
        {
          title: "Actionable Data, Not Dead Forms",
          description: "Paper checklists go into a cabinet to die. Digital checklists feed live trend dashboards showing you exactly where systemic failures occur."
        },
        {
          title: "Instant Root-Cause Identification",
          description: "Stop guessing why customer complaints are rising on weekends. Cross-reference shift audit scores with performance data instantly."
        },
        {
          title: "Frictionless Staff Adoption",
          description: "Front-line employees don't need extensive training. The mobile interface guides them step-by-step through the exact operational standard required."
        }
      ]}
      faqs={[
        {
          question: "How do we import our existing Excel sheets or PDFs?",
          answer: "Our onboarding team routinely imports legacy spreadsheets and paper checklists, digitizing them into smart, interactive Audiment templates in under 48 hours."
        },
        {
          question: "Can we block managers from using their gallery images?",
          answer: "Yes. Gallery uploads are completely blocked by default. Auditors must use the live in-app camera to prove the audit is happening in real time."
        },
        {
          question: "Does it support offline audit runs?",
          answer: "Absolutely. Auditors can carry out full checklist runs without cell service or Wi-Fi. The device pings the internal clock and hardware GPS, syncing once online."
        },
        {
          question: "How does scoring work?",
          answer: "You can assign custom weights to each question. The software aggregates individual responses into a clean percentage score, flagging critical compliance failures."
        },
        {
          question: "Can reports be shared with supervisors or health inspectors?",
          answer: "Yes. Completed checklist runs instantly generate a clean PDF report containing all photos, notes, timestamps, and locations, ready to export or print."
        }
      ]}
    />
  )
}
