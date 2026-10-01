import SeoContentPage from '@/components/seo/SeoContentPage'
import { buildPageMeta } from '@/lib/seo'

export const metadata = buildPageMeta({
  title: 'Healthcare Audit Software | Quality Consistency Across Facilities | Audiment',
  description: 'Audiment is audit and inspection software for multi-location healthcare businesses. Proof-based audits, issue tracking, and corrective actions maintain consistency and accountability across facilities.',
  path: '/healthcare-audit-software',
  keywords: ['healthcare audit software', 'hospital inspection software', 'healthcare compliance software', 'clinic audit app', 'healthcare quality management'],
})

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Audiment \u2013 Healthcare Audit Software',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://audiment.in/healthcare-audit-software',
  description: 'Audit and inspection software for multi-location healthcare businesses. Standardize quality checks across facilities with proof-based audits, corrective action tracking, and compliance dashboards.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Contact for pricing' },
  provider: { '@type': 'Organization', name: 'Audiment', url: 'https://audiment.in' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
    { '@type': 'ListItem', position: 2, name: 'Healthcare Audit Software', item: 'https://audiment.in/healthcare-audit-software' },
  ],
}

export default function Page() {
  return (
    <>
      <SeoContentPage
        heroH1="Healthcare Audit Software for Multi-Location Quality Control"
        heroSubheadline="Maintain quality consistency and accountability across healthcare facilities with proof-based audit workflows."
        sections={[
          {
            title: 'What healthcare audit software does',
            content: 'Healthcare audit software standardizes quality and compliance checks across facilities so that operations leaders can see execution evidence directly \u2013 without relying on self-reported data from individual sites. It converts compliance requirements into digital audit workflows with photo evidence requirements on critical checks, automatic corrective action creation for failures, and central dashboards that give operations leadership visibility across all facilities simultaneously.',
          },
          {
            title: 'Why this matters in healthcare operations',
            content: 'High standards must be maintained consistently across every facility, despite staffing variation, shift pressure, and the distance that comes with managing multiple locations. Patient safety, regulatory compliance, and institutional reputation all depend on standards that hold regardless of which facility, which shift, or which staff member is involved. Without a verification system, consistency depends on individual diligence \u2013 which is not scalable.',
          },
          {
            title: 'What fails without a structured audit system',
            content: 'Audits become inconsistent across facilities because without standardized templates and evidence requirements, different sites apply standards differently. Delayed follow-up on failed checks creates quality risks and weakens accountability. Central teams learn about recurring issues only when they escalate to complaints or regulatory notices rather than catching them during routine operations.',
          },
          {
            title: 'How Audiment handles it',
            content: 'Audiment enforces proof-based checks on critical quality and safety standards \u2013 requiring photo evidence before critical items can be marked complete. Failed checks automatically generate corrective actions with assigned owners, severity-appropriate deadlines, and closure proof requirements. Central teams can track open issues, overdue actions, and quality trends across all facilities in real time without manual reporting.',
          },
          {
            title: 'Operational outcome',
            content: 'Healthcare teams resolve issues faster because every failure has a named owner, a deadline, and a required resolution proof. Accountability improves across facilities because the tracking system makes performance visible centrally. Standards stay consistent even during staffing changes and high-pressure periods because the audit system structures what gets checked and how.',
          },
        ]}
        faqs={[
          {
            question: 'Can this be used across multiple facilities?',
            answer: 'Yes. Audiment is designed for multi-location operations. You can monitor performance centrally across all facilities while tracking execution details at each individual site. Area managers and central quality teams get different levels of visibility appropriate to their role.',
          },
          {
            question: 'How does it improve accountability?',
            answer: 'Failed checks become owned corrective actions with named owners, due dates, and closure proof requirements. This creates accountability at every level \u2013 the team member who owns the fix, the manager who oversees it, and the central team that tracks overall completion rates.',
          },
          {
            question: 'Is this only for compliance teams?',
            answer: 'No. It supports frontline managers who run audits, area operations teams who review performance across facilities, and central leadership who need visibility into quality trends. The same platform serves all three levels with role-appropriate access.',
          },
          {
            question: 'Can audit templates be customized per facility type?',
            answer: 'Yes. Audit templates can be configured to match the specific requirements of different facility types \u2013 for example, different checklists for outpatient clinics, diagnostic centers, and inpatient facilities \u2013 while keeping all results visible in the same central dashboard.',
          },
        ]}
        relatedLinks={[
          { tag: 'Topic', title: 'Maintaining Standards Across Locations', href: '/maintaining-standards-across-locations', description: 'Core consistency challenge in distributed operations.' },
          { tag: 'Platform', title: 'Operational Dashboards', href: '/platform/operational-dashboards', description: 'Track quality trends across facilities.' },
          { tag: 'Platform', title: 'Issue Tracking', href: '/platform/issue-tracking', description: 'Track issues from detection to closure for quality teams.' },
          { tag: 'Platform', title: 'Corrective Actions', href: '/platform/corrective-actions', description: 'Assign and close failures with verified proof.' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
