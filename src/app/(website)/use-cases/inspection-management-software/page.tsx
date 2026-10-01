import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Inspection Management Software | Standardize and Verify Inspections',
  description: 'Audiment is audit management software for multi-location businesses. Schedule, execute, and track inspections with GPS verification and live photo evidence.',
  path: '/use-cases/inspection-management-software',
})

export default function InspectionManagementSoftware() {
  return (
    <UseCaseTemplate
      path="/use-cases/inspection-management-software"
      title="Inspection Management Software"
      heroH1="Inspection Management Software – Verified Data from the Field"
      heroSubheadline="Inspections only matter if they actually happened. Stop relying on trust and paper trails. Capture GPS-verified, photo-proofed inspection data from every location in real time."
      primaryKeyword="inspection management software"
      operationalScenario={{
        title: "The difference between an assumed inspection and a verified one",
        before: "Your safety protocol requires a daily perimeter check. The logs show it was completed at 6:00 AM every day this week. On Friday, a security incident occurs. Security camera footage reveals the inspector never left their desk all week; they just signed the logbook.",
        after: "The perimeter check is managed in Audiment. The inspector is required to take a live photo of three specific checkpoints. The app geo-tags their location to ensure they walked the route. You have verifiable proof the inspection occurred exactly as recorded."
      }}
      features={[
        {
          title: "Automated Scheduling and Deployment",
          description: "Deploy daily opening checklists, weekly hygiene runs, and monthly deep-dives directly to the correct role at each location automatically. Managers don't need to remember what to check–the software ensures essential checks appear in their queue and cannot be skipped."
        },
        {
          title: "Verified Execution via Geo-Tagging",
          description: "Inspections require live, geo-tagged photo evidence per critical question. The inspector must physically verify the condition on-site rather than checking a box from memory or a desk, drastically reducing the chance of falsified data."
        },
        {
          title: "Dynamic Escalation Paths",
          description: "If a severe issue like a fire safety inspection fails, the system can automatically bypass the local store manager and alert regional facilities maintenance directly, ensuring the response matches the severity of the hazard."
        }
      ]}
      benefits={[
        {
          title: "Verified On-Site Execution",
          description: "GPS checks, timestamping, and on-site camera restrictions confirm the inspector actually walked the floor. You can trust that the inspections in your dashboard reflect real physical conditions, not just recalled observations or guesswork."
        },
        {
          title: "Track Resolution Speed",
          description: "See exactly how long it takes each branch to fix a critical failure after an inspection is submitted. Identifying locations that consistently respond slowly allows you to address the root culture problem, not just the symptom."
        },
        {
          title: "Scale Without Sacrificing Quality",
          description: "Enable front-line staff to run routine daily inspections autonomously while reserving area managers for complex, high-level audits. Because of the strict evidence requirements, the data quality remains consistent regardless of who conducts the check."
        }
      ]}
      faqs={[
        {
          question: "How does the software verify that inspections actually happened on-site?",
          answer: "GPS location is checked against the registered branch address. Photos must be taken live on-site – gallery uploads are disabled. If the auditor isn't at the location, the system flags it."
        },
        {
          question: "Can we use this for third-party auditing partners?",
          answer: "Yes. You can create restricted auditor accounts for external consultants, giving them access to log findings directly into your system."
        },
        {
          question: "What happens if a critical inspection is missed?",
          answer: "The system triggers an alert to the Area Manager or Regional Director. Missed mandatory checks don't disappear – they show as overdue until completed."
        },
        {
          question: "Can I customize the corrective action workflow?",
          answer: "Yes. You define resolution windows, escalation pathways, and evidence requirements for different severity levels."
        },
        {
          question: "Does it help with regulatory inspections?",
          answer: "Yes. A digital, timestamped log of daily compliance checks – with photo evidence – demonstrates consistent execution to government inspectors far more convincingly than paper records."
        }
      ]}
    />
  )
}
