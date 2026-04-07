import Link from 'next/link'

interface CompareProps {
  competitor: string
  heroH1: string
  whereAudimentWins: { title: string, text: string }[]
  whoShouldChooseCompetitor: { title: string, text: string }[]
  features: {
    audiment: {
      photoEvidence: string
      geoTagged: string
      autoCA: string
      trendDetection: string
      fssaiReady: string
      pdfReports: string
      offline: string
      roleBased: string
      pricing: string
    }
    competitor: {
      photoEvidence: string
      geoTagged: string
      autoCA: string
      trendDetection: string
      fssaiReady: string
      pdfReports: string
      offline: string
      roleBased: string
      pricing: string
    }
  }
}

export default function CompareTemplate({
  competitor,
  heroH1,
  whereAudimentWins,
  whoShouldChooseCompetitor,
  features
}: CompareProps) {
  const faqs = [
    {
      question: `Is Audiment a direct alternative to ${competitor}?`,
      answer: `Yes, Audiment is designed as a more modern, compliance-focused alternative to ${competitor}, particularly for multi-location food, retail, and manufacturing enterprises.`
    },
    {
      question: "How easy is the migration process?",
      answer: "We offer dedicated onboarding specialists who can instantly digitize your existing checklists and import your operational hierarchy into Audiment."
    },
    {
      question: "Can we run a parallel trial?",
      answer: "Absolutely. We encourage operations teams to run Audiment simultaneously in a few locations to physically compare interface speed and reporting capabilities."
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted/20 border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6 uppercase tracking-wide text-sm border border-primary/20">
            Compare Software
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            {heroH1}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 text-balance">
            Looking for {competitor} alternatives? Here is a transparent, feature-by-feature comparison demonstrating how Audiment provides unparalleled field operational oversight.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5">
              Book a Strategy Call
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-muted/40">
                <th className="py-6 px-8 font-bold text-lg text-heading w-1/3 border-b border-border">Feature Capabilities</th>
                <th className="py-6 px-8 font-bold text-xl text-primary bg-primary/5 border-b border-l border-border w-1/3">Audiment</th>
                <th className="py-6 px-8 font-bold text-xl text-heading w-1/3 border-b border-l border-border">{competitor}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <Row title="Mandatory Photo Evidence" aud={features.audiment.photoEvidence} comp={features.competitor.photoEvidence} />
              <Row title="Geo-Tagged Verification" aud={features.audiment.geoTagged} comp={features.competitor.geoTagged} />
              <Row title="Auto Corrective Actions" aud={features.audiment.autoCA} comp={features.competitor.autoCA} />
              <Row title="Trend Detection Analytics" aud={features.audiment.trendDetection} comp={features.competitor.trendDetection} />
              <Row title="FSSAI-Ready Templates" aud={features.audiment.fssaiReady} comp={features.competitor.fssaiReady} />
              <Row title="Offline Execution" aud={features.audiment.offline} comp={features.competitor.offline} />
              <Row title="Role-Based Access" aud={features.audiment.roleBased} comp={features.competitor.roleBased} />
              <Row title="PDF Reports Export" aud={features.audiment.pdfReports} comp={features.competitor.pdfReports} />
              <Row title="Pricing Model" aud={features.audiment.pricing} comp={features.competitor.pricing} />
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros & Cons Sections */}
      <section className="py-24 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16">
          <div className="bg-card p-10 rounded-3xl border border-border shadow-lg">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6 text-2xl font-bold">✓</div>
             <h2 className="text-3xl font-bold mb-8 text-heading">Where Audiment Wins</h2>
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
             <h2 className="text-3xl font-bold mb-8 text-heading">Who Should Choose {competitor}?</h2>
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

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-6 text-heading tracking-tight">Make the Switch Today</h2>
          <p className="text-xl text-muted-foreground mb-10">Stop paying for legacy platforms that don't prevent pencil-whipping. Start using Audiment.</p>
          <Link href="/#contact" className="inline-flex items-center px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1">
             Request Migration Audit
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  )
}

function Row({ title, aud, comp }: { title: string, aud: string, comp: string }) {
  return (
    <tr className="hover:bg-muted/10 transition-colors">
      <td className="py-5 px-8 font-semibold text-heading border-border">{title}</td>
      <td className="py-5 px-8 bg-primary/[0.02] border-l border-border font-medium text-foreground">{aud}</td>
      <td className="py-5 px-8 border-l border-border text-muted-foreground">{comp}</td>
    </tr>
  )
}
