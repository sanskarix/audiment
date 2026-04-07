import Link from 'next/link'

interface PainPoint {
  title: string
  description: string
}

interface SolutionFeature {
  title: string
  description: string
}

interface ChecklistItem {
  area: string
  question: string
}

interface FAQ {
  question: string
  answer: string
}

interface Props {
  industry: string
  heroH1: string
  heroSubheadline: string
  painPoints: PainPoint[]
  features: SolutionFeature[]
  sampleChecklist: ChecklistItem[]
  faqs: FAQ[]
  relatedBlogLink: string
  relatedBlogTitle: string
  relatedIndustryLinks: { title: string, href: string }[]
}

export default function SolutionPageTemplate({
  industry,
  heroH1,
  heroSubheadline,
  painPoints,
  features,
  sampleChecklist,
  faqs,
  relatedBlogLink,
  relatedBlogTitle,
  relatedIndustryLinks,
}: Props) {
  // Schema for FAQ
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
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/10 to-background border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6 uppercase tracking-wide text-sm border border-primary/20 shadow-sm">
            Audiment for {industry}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            {heroH1}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            {heroSubheadline}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/#contact" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
              Book a Call
            </Link>
            <Link href="/" className="px-8 py-4 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-heading">The challenges holding your operations back</h2>
          <p className="text-muted-foreground text-lg">Traditional systems fail when subjected to the reality of scale.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive font-bold text-2xl mb-6 shadow-inner">0{idx + 1}</div>
              <h3 className="text-xl font-bold mb-4 text-heading">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Audiment Solves It */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-heading">How Audiment solves it</h2>
              <p className="text-lg text-muted-foreground mb-10">We've built the ultimate platform to transform your field execution and guarantee compliance standards everywhere.</p>
              <div className="space-y-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-6">
                     <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center shrink-0">✓</div>
                     <div>
                       <h4 className="font-bold text-xl mb-2 text-heading">{feature.title}</h4>
                       <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 relative overflow-hidden h-[500px] flex items-center justify-center isolate group">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-secondary/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="text-center z-10 p-8 glass rounded-2xl shadow-lg border border-white/10 dark:border-white/5">
                 <h3 className="text-2xl font-bold mb-3 text-heading">Interactive Checklists</h3>
                 <p className="text-muted-foreground">Automated logic, mandatory photos, & flash verification.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Checklist */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-heading">Sample {industry} Audit Checklist</h2>
          <p className="text-muted-foreground text-lg">Transform static PDFs into powerful digital workflows mapped to standard operating procedures.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-5 px-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Area / Category</th>
                <th className="py-5 px-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Checklist Item Verification</th>
              </tr>
            </thead>
            <tbody>
              {sampleChecklist.map((item, idx) => (
                <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/5 transition-colors">
                  <td className="py-5 px-6 font-semibold whitespace-nowrap text-heading">{item.area}</td>
                  <td className="py-5 px-6 text-muted-foreground leading-relaxed">{item.question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-3 text-heading">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Internal Links */}
      <section className="py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-balance">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-heading tracking-tight">Ready to digitize your {industry.toLowerCase()} audits?</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">Stop managing compliance with paper. Join top operators ensuring impeccable execution across every location.</p>
        <Link href="/#contact" className="inline-flex items-center px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 mb-20 hover:-translate-y-1">
          Book a Discovery Call
        </Link>
        
        <div className="border-t border-border pt-16 flex flex-col md:flex-row gap-12 justify-center text-sm">
           <div className="text-left flex-1 md:text-right">
             <span className="font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Recommended Reading</span>
             <Link href={relatedBlogLink} className="text-primary hover:text-primary/80 font-semibold block text-base transition-colors">
               Read: {relatedBlogTitle} →
             </Link>
           </div>
           <div className="hidden md:block w-px bg-border"></div>
           <div className="text-left flex-1">
             <span className="font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Other Industries</span>
             <ul className="space-y-3">
               {relatedIndustryLinks.map(link => (
                 <li key={link.href}>
                   <Link href={link.href} className="text-foreground hover:text-primary font-medium transition-colors text-base">
                     {link.title}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  )
}
