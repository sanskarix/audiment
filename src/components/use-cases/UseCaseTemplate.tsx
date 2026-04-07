import Link from 'next/link'

interface Props {
  title: string
  heroH1: string
  heroSubheadline: string
  primaryKeyword: string
  features: { title: string, description: string }[]
  benefits: { title: string, description: string }[]
  faqs: { question: string, answer: string }[]
}

export default function UseCaseTemplate({
  title,
  heroH1,
  heroSubheadline,
  primaryKeyword,
  features,
  benefits,
  faqs,
}: Props) {
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
      <section className="pt-32 pb-20 bg-gradient-to-br from-secondary/10 via-background to-background border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            {heroH1}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            {heroSubheadline}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/#contact" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
              Start Free Trial
            </Link>
            <Link href="/blog" className="px-8 py-4 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all">
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-heading">Core {primaryKeyword} Capabilities</h2>
          <p className="text-muted-foreground text-lg">Everything you need to execute perfectly.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 relative overflow-hidden h-[400px] flex items-center justify-center isolate group">
              <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-background to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-center z-10 p-8 glass rounded-2xl shadow-lg border border-white/10 dark:border-white/5">
                <h3 className="text-2xl font-bold mb-3 text-heading">Automated Workflows</h3>
                <p className="text-muted-foreground">Driven by powerful conditional logic.</p>
              </div>
           </div>
           <div className="space-y-8">
            {features.map((opt, idx) => (
              <div key={idx} className="flex gap-6">
                 <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xl">0{idx + 1}</div>
                 <div>
                   <h3 className="font-bold text-xl mb-2 text-heading">{opt.title}</h3>
                   <p className="text-muted-foreground leading-relaxed">{opt.description}</p>
                 </div>
              </div>
            ))}
           </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-heading">Why Choose Audiment</h2>
            <p className="text-lg text-muted-foreground">The strategic advantages of our platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((point, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <h4 className="text-xl font-bold mb-3 text-heading">{point.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-3xl font-bold mb-12 text-center text-heading">Frequently Asked Questions</h2>
         <div className="grid gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border p-8 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-heading">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6 text-white">Upgrade Your Operations Today</h2>
          <p className="text-primary-foreground/80 text-xl mb-10">Stop relying on outdated manual systems. Try Audiment and see the difference immediately.</p>
          <Link href="/#contact" className="inline-flex items-center px-10 py-5 rounded-xl bg-white text-primary font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
             Book a Demo 
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  )
}
