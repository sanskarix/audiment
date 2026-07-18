import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Corrective Action Tracking Software | Resolve Audit Failures Faster',
  description: 'Audiment is audit management software for multi-location businesses. Stop losing track of audit failures. Auto-generate tasks, set SLA deadlines, and require photo proof of closure.',
  path: '/use-cases/corrective-action-tracking',
})

export default function CorrectiveActionTracking() {
  return (
    <UseCaseTemplate
      path="/use-cases/corrective-action-tracking"
      title="Corrective Action Tracking Software"
      heroH1="Corrective Action Tracking – Stop Losing Track of Audit Failures"
      heroSubheadline="An audit only identifies the problem. If the follow-up happens in a chaotic WhatsApp group, the problem rarely gets fixed. Centralize accountability with automated tracking."
      primaryKeyword="corrective action tracking"
      operationalScenario={{
        title: "The difference between logging an issue and resolving it",
        before: "An area manager finds a blocked fire exit during a monthly visit. They note it on a paper form and tell the branch manager to fix it. Next month, the area manager returns. The exit is still blocked. The company was liable for 30 days without anyone realizing it.",
        after: "The area manager logs the blocked exit in Audiment. A corrective action task is instantly assigned to the branch manager with a 24-hour SLA. If it's not fixed by tomorrow, the regional director gets an automated escalation alert. The exit gets cleared."
      }}
      features={[
        {
          title: "SLA-Driven Task Generation",
          description: "When an audit standard fails, the system immediately generates a specific task. You define the Service Level Agreement (SLA) based on the severity—a burnt out bulb might get 72 hours, while a food safety violation gets 4 hours."
        },
        {
          title: "Proof of Closure Requirements",
          description: "Managers cannot simply tap 'Done' to clear a task from their queue. For critical issues, they must upload a live, time-stamped photo showing the resolved condition, ensuring the fix actually happened."
        },
        {
          title: "Multi-Tier Escalation Workflows",
          description: "If an SLA deadline passes, the system doesn't just send a reminder to the person who ignored it. It escalates up the chain of command automatically, notifying area managers or facilities teams that a compliance risk is sitting unresolved."
        }
      ]}
      benefits={[
        {
          title: "Eliminate Communication Silos",
          description: "Stop relying on disjointed email threads, lost WhatsApp messages, and forgotten sticky notes. Every failure is tracked centrally from the moment it is detected until the moment visual proof of closure is submitted and verified."
        },
        {
          title: "Measure Resolution Velocity",
          description: "Gain clear visibility into which branches resolve issues quickly and which ones consistently let problems linger. This data allows you to manage performance based on accountability, not just audit scores."
        },
        {
          title: "Reduce Operational Liability",
          description: "Unresolved issues are risks. By ensuring that every identified problem has a clear owner and a strict deadline, you drastically reduce the window of time your business is exposed to compliance, safety, or quality liabilities."
        }
      ]}
      faqs={[
        {
          question: "Can I assign a corrective action to someone outside the branch?",
          answer: "Yes. Depending on the logic you set, a failed refrigeration check can automatically create a task assigned directly to your external maintenance team rather than the branch manager."
        },
        {
          question: "How are users notified of new tasks?",
          answer: "Assignees receive push notifications and email alerts immediately when a task is created, and again as the SLA deadline approaches."
        },
        {
          question: "Can we track recurring failures?",
          answer: "Yes. The dashboard highlights if a specific location is repeatedly failing the same standard and generating the same corrective actions week over week."
        },
        {
          question: "Is photo proof always required to close a task?",
          answer: "You can configure this per question. Minor issues might only require a sign-off, while critical compliance issues mandate photo proof."
        },
        {
          question: "What happens if a task is never closed?",
          answer: "It remains on the active issues log, continuing to trigger escalation paths and appearing as an unresolved liability on the regional dashboard until addressed."
        }
      ]}
    />
  )
}
