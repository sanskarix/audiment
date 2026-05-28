import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'

export const metadata = {
  title: 'Inspection Management Software | Schedule, Execute, and Track Every Inspection',
  description: 'Audiment is audit management software for multi-location businesses. Scheduled, evidence-backed inspections with full lifecycle tracking show you what\'s actually happening at every location.',
  alternates: { canonical: 'https://audiment.in/use-cases/inspection-management-software' }
}

export default function InspectionManagementSoftware() {
  return (
    <UseCaseTemplate
      title="Inspection Management Software"
      heroH1="Inspection Management Software – Schedule, Execute and Track Every Inspection"
      heroSubheadline="An inspection only has value if it was actually done on-site, recorded honestly, and followed by action. Audiment manages all three."
      primaryKeyword="inspection management"
      operationalScenario={{
        title: "When inspections stop being a formality",
        before: "Your area manager is scheduled for 8 store visits this week. They visit 5, spend 15 minutes each, and complete the other 3 inspections from the regional office based on last week's memory. You receive 8 green reports. Three of those stores haven't actually been inspected.",
        after: "Each inspection requires GPS-verified presence and live photo evidence. You can see exactly which locations were physically visited, when the auditor arrived and left, and what they actually found. The 3 unvisited stores show as incomplete – not as false passes."
      }}
      features={[
        {
          title: "Automated Scheduling",
          description: "Deploy daily opening checklists, weekly hygiene runs, and monthly deep-dives to the correct role at each location automatically. Essential checks can't be skipped or forgotten."
        },
        {
          title: "Verified Execution",
          description: "Inspections require live, geo-tagged photo evidence per question. The inspector must physically verify the condition – not just check a box from memory."
        },
        {
          title: "Dynamic Escalation Paths",
          description: "If a fire safety inspection fails, the system can bypass the store manager and alert facilities maintenance directly, matching the severity to the right response team."
        }
      ]}
      benefits={[
        {
          title: "Verified On-Site Execution",
          description: "GPS checks and on-site evidence confirm the inspector actually walked the floor. Inspections reflect real conditions, not recalled observations."
        },
        {
          title: "Track Resolution Speed",
          description: "See exactly how long it takes each branch to fix a critical failure after the inspection is submitted. Identify which locations consistently respond slowly."
        },
        {
          title: "Scale Without Sacrificing Quality",
          description: "Enable front-line staff to run routine inspections while area managers focus on complex audits. The evidence quality remains consistent regardless of who conducts the inspection."
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
