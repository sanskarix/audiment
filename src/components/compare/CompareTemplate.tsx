import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { CalButton } from '@/components/ui/cal-button'

interface CompareProps {
  competitor: string
  heroH1: string
  heroSubtext?: string
  whereAudimentWins: { title: string, text: string }[]
  whoShouldChooseCompetitor: { title: string, text: string }[]
  migrationReality?: {
    timeline: string
    effort: string
    support: string
  }
  operationalDifferences: {
    area: string
    audiment: string
    competitor: string
  }[]
  operationalOutcomeDifference?: {
    title: string
    text: string
  }
  path: string
}

export default function CompareTemplate({
  competitor,
  heroH1,
  heroSubtext,
  whereAudimentWins,
  whoShouldChooseCompetitor,
  migrationReality,
  operationalDifferences,
  operationalOutcomeDifference,
  path,
}: CompareProps) {
  const faqs = [
    {
      question: `Is Audiment a direct alternative to ${competitor}?`,
      answer: `Yes. Both serve multi-location audit management. The differences are in how each platform handles accountability workflows, evidence collection, and rollout complexity – which is what matters most during day-to-day operations.`
    },
    {
      question: "How does the migration process work?",
      answer: "Our onboarding team digitizes your existing checklists and imports your location hierarchy. Most teams are running their first audits on Audiment within 1-2 weeks, often in parallel with their existing system."
    },
    {
      question: "Can we run a trial in a few locations first?",
      answer: "Yes, and we recommend it. Most teams start with 3-5 locations to validate the workflow, then expand once managers are comfortable with the interface."
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://audiment.in${path}/#faq`,
    "isPartOf": {
      "@id": "https://audiment.in/#website"
    },
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `https://audiment.in${path}/#software`,
    "name": `Audiment \u2013 ${heroH1}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "url": `https://audiment.in${path}`,
    "description": heroSubtext || `Evaluating ${competitor}? Here's a practical comparison focused on operational outcomes, rollout realities, and how each platform handles accountability.`,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Contact for pricing" },
    "publisher": { "@id": "https://audiment.in/#organization" },
    "provider": { "@id": "https://audiment.in/#organization" }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted/20 border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6 uppercase tracking-wide text-sm border border-primary/20">
            Comparison
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            {heroH1}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 text-balance max-w-2xl mx-auto">
            {heroSubtext || `Evaluating ${competitor}? Here's a practical comparison focused on operational outcomes, rollout realities, and how each platform handles accountability.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CalButton className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold shadow-lg">
              Book a Comparison Call
            </CalButton>
          </div>
        </div>
      </section>

      {/* Operational Differences – Structured Table + Detailed Breakdown */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-heading">How they differ in practice</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A side-by-side breakdown of how each platform handles the operational workflows that matter most to multi-location teams.</p>
        </div>

        {/* Structured Semantic Comparison Table for AI and quick scanning */}
        <div className="mb-14 overflow-x-auto rounded-2xl border border-border shadow-md bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-4 font-bold text-heading w-1/4">Operational Area</th>
                <th className="px-6 py-4 font-bold text-primary w-3/8 bg-primary/5">Audiment</th>
                <th className="px-6 py-4 font-bold text-muted-foreground w-3/8">{competitor}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {operationalDifferences.map((diff, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-heading align-top">{diff.area}</td>
                  <td className="px-6 py-4 text-foreground bg-primary/5 align-top leading-relaxed">{diff.audiment}</td>
                  <td className="px-6 py-4 text-muted-foreground align-top leading-relaxed">{diff.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          {operationalDifferences.map((diff, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-heading">{diff.area}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="text-sm font-semibold text-primary block mb-2">Audiment</span>
                  <p className="text-foreground leading-relaxed">{diff.audiment}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <span className="text-sm font-semibold text-muted-foreground block mb-2">{competitor}</span>
                  <p className="text-muted-foreground leading-relaxed">{diff.competitor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Operational Strengths */}
      <section className="py-24 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16">
          <div className="bg-card p-10 rounded-3xl border border-border shadow-lg">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6 text-2xl font-bold">✓</div>
             <h2 className="text-3xl font-bold mb-8 text-heading">Where Audiment is stronger</h2>
             <ul className="space-y-8">
               {whereAudimentWins.map((win, i) => (
                 <li key={i}>
                   <h4 className="font-bold text-lg mb-2 text-heading">{win.title}</h4>
                   <p className="text-muted-foreground leading-relaxed">{win.text}</p>
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="p-10 rounded-3xl border border-border bg-background">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted text-muted-foreground mb-6 text-2xl font-bold">ℹ</div>
             <h2 className="text-3xl font-bold mb-8 text-heading">When {competitor} may be a better fit</h2>
             <ul className="space-y-8">
               {whoShouldChooseCompetitor.map((con, i) => (
                 <li key={i}>
                   <h4 className="font-bold text-lg mb-2 text-heading">{con.title}</h4>
                   <p className="text-muted-foreground leading-relaxed">{con.text}</p>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      {/* Operational Outcome Difference */}
      {operationalOutcomeDifference && (
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-4 text-heading">{operationalOutcomeDifference.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{operationalOutcomeDifference.text}</p>
          </div>
        </section>
      )}

      {/* Migration Reality */}
      {migrationReality && (
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-heading">What switching actually looks like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-card border border-border text-center">
                <span className="text-4xl font-bold text-heading block mb-3">{migrationReality.timeline}</span>
                <p className="text-muted-foreground font-medium">Typical rollout timeline</p>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border text-center">
                <span className="text-4xl font-bold text-heading block mb-3">{migrationReality.effort}</span>
                <p className="text-muted-foreground font-medium">Internal effort required</p>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border text-center">
                <span className="text-4xl font-bold text-heading block mb-3">{migrationReality.support}</span>
                <p className="text-muted-foreground font-medium">Onboarding support</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-24 bg-muted/10 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Common questions when comparing</h2>
          <div className="grid gap-6 md:grid-cols-1">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border p-8 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-heading">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-6 text-heading tracking-tight">See how they compare in your workflow</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Walk through a live demo with our team. We&apos;ll map your existing audit process and show you exactly where the operational differences show up.</p>
          <CalButton className="inline-flex items-center px-12 py-5 rounded-2xl font-bold text-lg shadow-xl">
             Book a Comparison Call
          </CalButton>
        </div>
      </section>

      <Footer
        brandName="Audiment"
        navLinks={[
          { label: "Features", href: "/#features" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Use cases", href: "/#use-cases" },
          { label: "Blog", href: "/blog" },
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Cookie policy", href: "/cookie-policy" },
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `https://audiment.in${path}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
          { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://audiment.in/compare" },
          { "@type": "ListItem", "position": 3, "name": heroH1, "item": `https://audiment.in${path}` }
        ]
      }) }} />
    </div>
  )
}
