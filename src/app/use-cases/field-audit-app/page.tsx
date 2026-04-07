import UseCaseTemplate from '@/components/use-cases/UseCaseTemplate'

export const metadata = {
  title: 'Field Audit App – Mobile Audits with Photo Evidence | Audiment',
  description: 'Audiment is the ultimate field audit app. Replace clipboard inspections with mobile-first, photo-verified checklists from any smartphone.',
  alternates: { canonical: 'https://audiment.com/use-cases/field-audit-app' }
}

export default function FieldAuditApp() {
  return (
    <UseCaseTemplate
      title="Field Audit App"
      heroH1="Field Audit App – Run Audits from Any Phone, Anywhere"
      heroSubheadline="Transform any smart device into a powerful inspection tool. Empower your field teams to execute complex compliance audits rapidly, seamlessly, and securely."
      primaryKeyword="field audit app"
      features={[
        {
          title: "Offline-First Execution",
          description: "Don't let remote locations or patchy Wi-Fi stall your audits. Complete entire checks offline, and safely cached data will auto-sync later."
        },
        {
          title: "Hardware-Enforced Checks",
          description: "Force inspectors to use the native camera for capturing issues to eradicate the upload of falsified, archived photography."
        },
        {
          title: "Action Item Delegation",
          description: "Immediately trigger issue notifications directly out of the app. Fixes can be managed by field workers on the spot."
        }
      ]}
      benefits={[
        {
          title: "Boost Field Efficiency",
          description: "Speed up inspections by 40%. Smart-logic fields adapt dynamically depending on prior answers to cut out unnecessary steps."
        },
        {
          title: "Real-World Proof",
          description: "Definitive geo-located and time-stamped visual proof confirms that a trained inspector was on site when they submitted the results."
        },
        {
          title: "No Specialized Hardware",
          description: "Designed extensively to run perfectly on everyday iOS and Android smartphones, mitigating exorbitant capital outlays for industrial tablets."
        }
      ]}
      faqs={[
        {
          question: "Can our contractors use the field audit app?",
          answer: "Yes, you can issue temporary or constrained-access credentials for third-party inspectors to execute their assigned tasks efficiently."
        },
        {
          question: "Does the app consume heavy mobile data?",
          answer: "It is extremely efficient. Images undergo intelligent edge-compression before being transmitted over cellular networks, drastically lowering bandwidth costs."
        },
        {
          question: "How long does the app take to deploy?",
          answer: "Once checklists are mapped onto the central dashboard, the app synchronizes instantly allowing remote teams to begin auditing the next morning."
        },
        {
          question: "Is signature capture supported?",
          answer: "Yes, our mobile interface supports real-time biometric-style digital signature capture for signing-off on highly sensitive field events."
        },
        {
          question: "What if the auditor’s battery dies mid-audit?",
          answer: "Continuous background caching guarantees no data loss. If power fails, simply restart the app and resume precisely where you left off."
        }
      ]}
    />
  )
}
