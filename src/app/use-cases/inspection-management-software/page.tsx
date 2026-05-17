import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'

export const metadata = {
  title: 'Audiment | Inspection management that schedules, verifies, and closes the loop',
  description: 'Audiment manages the full inspection lifecycle – automated scheduling, GPS-verified execution, SLA-tracked corrective actions, and predictive analytics across every branch.',
  alternates: { canonical: 'https://audiment.in/use-cases/inspection-management-software' }
}

export default function InspectionManagementSoftware() {
  return (
    <UseCaseTemplate
      title="Inspection Management Software"
      heroH1="Inspection Management Software – Schedule, Execute and Track Every Inspection"
      heroSubheadline="Schedule recurring checks, enforce proof-of-presence, and automatically assign follow-ups. Build an inspection workflow that actually guarantees standards are met at every outlet."
      primaryKeyword="inspection management software"
      features={[
        {
          title: "Rigid Execution Scheduling",
          description: "Auto-deploy daily opening checklists, weekly hygiene runs, and monthly deep-dives directly to the correct role. Prevent essential checks from being skipped."
        },
        {
          title: "Mandatory Evidence Capture",
          description: "Inspections require live, geo-tagged photo proof per question. You can't just check a box from the back office without physically verifying the equipment."
        },
        {
          title: "Dynamic Escalation Paths",
          description: "If a fire safety inspection fails, the system bypasses the store manager and alerts facilities maintenance instantly to resolve the high-risk hazard."
        }
      ]}
      benefits={[
        {
          title: "Enforce Physical Presence",
          description: "Stop paying area managers to fill out forms in their car. Force physical presence and objective verification on the actual store floor."
        },
        {
          title: "Track Resolution Realities",
          description: "See exactly how long it takes a specific branch to fix a critical failure after the inspection is submitted, identifying slow operational responses."
        },
        {
          title: "Scale Audit Capabilities",
          description: "Run 10x more routine inspections using your front-line staff without sacrificing the integrity of the compliance data sent to corporate."
        }
      ]}
      faqs={[
        {
          question: "How does the software verify that inspections actually happened on-site?",
          answer: "Audiment logs hardware GPS coordinates, server-locked timestamps, and disables gallery uploads. Auditors must physically stand at the location and take live photos/videos."
        },
        {
          question: "Can we use this for third-party auditing partners?",
          answer: "Yes. You can create restricted auditor accounts for external consultants, allowing them to log their official findings directly into your dashboard."
        },
        {
          question: "What happens if a critical inspection is missed?",
          answer: "If a mandatory scheduled check is missed, the system automatically triggers an alert to the Area Manager or Regional Director, preventing silent drifts in compliance."
        },
        {
          question: "Can I customize the corrective action workflow?",
          answer: "Absolutely. You can define specific SLA resolution windows, escalation pathways, and the exact photo proof required for different severity levels."
        },
        {
          question: "Does it help pass government regulatory inspections?",
          answer: "Yes. Keeping a digital, timestamped log of FSSAI temperature checks, clean kitchen sweeps, and fire safety logs proves consistent daily execution to government health inspectors."
        }
      ]}
    />
  )
}
