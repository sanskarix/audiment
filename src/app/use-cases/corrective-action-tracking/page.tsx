import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'

export const metadata = {
  title: 'Corrective Action Tracking | Improve Accountability Across Locations',
  description: 'Audiment is audit and inspection software for multi-location businesses. Issues get detected but rarely resolved without a tracking system. Auto-generated corrective action tasks, SLA deadlines, photo-proof closure, and escalation keep accountability clear at every location.',
  alternates: { canonical: 'https://audiment.in/use-cases/corrective-action-tracking' }
}

export default function CorrectiveActionTracking() {
  return (
    <UseCaseTemplate
      title="Corrective Action Tracking"
      heroH1="Corrective Action Tracking – Close the Loop on Every Audit Failure"
      heroSubheadline="Finding a problem during an audit is easy. Making sure it actually gets fixed – with proof – is where most operations fall apart. Audiment closes that gap."
      primaryKeyword="corrective action tracking"
      operationalScenario={{
        title: "The difference between logging a failure and resolving it",
        before: "Tuesday's audit finds a broken handwash station at Branch 12. The area manager sends a WhatsApp message to the branch manager. By Thursday, the message is buried under 40 other chats. The station stays broken for 2 weeks. Nobody follows up because nobody remembers.",
        after: "The same audit flags the broken station. A corrective action task is auto-created with a 48-hour deadline. The branch manager gets a notification. If they don't upload a photo of the repaired station within 48 hours, the task auto-escalates to the regional director. Average resolution time drops from 14 days to 31 hours."
      }}
      features={[
        {
          title: "Automated Task Creation",
          description: "When an auditor marks 'Fail' on a critical item, a corrective action task is instantly created and assigned to the responsible branch manager. No manual follow-up required."
        },
        {
          title: "SLA Deadline Management",
          description: "Apply strict resolution windows. If an issue isn't fixed within the SLA – typically 48 hours for critical items – it automatically escalates to the next level of management."
        },
        {
          title: "Mandatory Resolution Evidence",
          description: "Managers cannot close a task by simply checking a box. They must upload a photo proving the repair or correction has been made. The closure is timestamped and geo-tagged."
        }
      ]}
      benefits={[
        {
          title: "Nothing Gets Lost",
          description: "Unlike emails or WhatsApp messages that get buried, a structured tracking system maintains a persistent, visible pipeline of active operational issues until they're resolved."
        },
        {
          title: "Identify Systemic Patterns",
          description: "Aggregated corrective action data shows you which equipment, protocols, or locations are failing repeatedly – so you can fix the root cause, not just the symptom."
        },
        {
          title: "Clear Accountability Chain",
          description: "Every step of the resolution lifecycle is tracked, timestamped, and tied to a specific person. When leadership asks 'who was responsible?', there's a clear answer."
        }
      ]}
      faqs={[
        {
          question: "What is corrective action tracking software?",
          answer: "It's a system that logs, assigns, and monitors the resolution of issues identified during audits. The goal is ensuring identified problems are actually fixed – not just documented."
        },
        {
          question: "How does it improve compliance?",
          answer: "By ensuring issues are resolved with evidence. Demonstrating a closed-loop corrective action process is a strong positive signal during FSSAI or ISO inspections."
        },
        {
          question: "Can I assign a corrective action to a third-party vendor?",
          answer: "Yes. You can generate temporary access links for contractors or maintenance vendors to submit photo-proof of their resolution without needing a full system account."
        },
        {
          question: "Does it support preventive actions?",
          answer: "Yes. You can assign root-cause analysis tasks, schedule training follow-ups, or flag protocol revisions as preventive actions within the same workflow."
        },
        {
          question: "Can I view all open actions across all branches?",
          answer: "Yes. The leadership dashboard shows real-time counts of open, aging, and critical actions across every location in your network."
        }
      ]}
    />
  )
}
