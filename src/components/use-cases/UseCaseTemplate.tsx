import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { CalButton } from '@/components/ui/cal-button'

interface Props {
  title: string
  heroH1: string
  heroSubheadline: string
  primaryKeyword: string
  features: { title: string, description: string }[]
  benefits: { title: string, description: string }[]
  faqs: { question: string, answer: string }[]
  operationalScenario?: {
    title: string
    before: string
    after: string
  }
  path: string
}

export default function UseCaseTemplate({
  title,
  heroH1,
  heroSubheadline,
  primaryKeyword,
  features,
  benefits,
  faqs,
  operationalScenario,
  path,
}: Props) {
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
    "name": `Audiment \u2013 ${title}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "url": `https://audiment.in${path}`,
    "description": heroSubheadline,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Contact for pricing" },
    "publisher": { "@id": "https://audiment.in/#organization" },
    "provider": { "@id": "https://audiment.in/#organization" }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-secondary/10 via-background to-background border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            {heroH1}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            {heroSubheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CalButton className="px-8 py-4 rounded-xl font-bold shadow-lg">
              Book a Demo
            </CalButton>
            <Link href="/solutions" className="px-8 py-4 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all">
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-heading">How Audiment handles {primaryKeyword}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">The operational capabilities that make the difference between knowing what happened and guessing.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 relative overflow-hidden h-[400px] flex items-center justify-center isolate group">
              <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-background to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-center z-10 p-8 glass rounded-2xl shadow-lg border border-white/10 dark:border-white/5">
                <h3 className="text-2xl font-bold mb-3 text-heading">Automated Workflows</h3>
                <p className="text-muted-foreground">Driven by conditional logic and operational context.</p>
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

      {/* Operational Scenario – Before/After */}
      {operationalScenario && (
        <section className="py-24 bg-neutral-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">{operationalScenario.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-sm font-semibold tracking-widest text-red-400 block mb-4">WITHOUT AUDIMENT</span>
                <p className="text-neutral-300 leading-relaxed">{operationalScenario.before}</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-emerald-500/20">
                <span className="text-sm font-semibold tracking-widest text-emerald-400 block mb-4">WITH AUDIMENT</span>
                <p className="text-neutral-300 leading-relaxed">{operationalScenario.after}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-heading">The operational advantage</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">What changes when you move from checking boxes to verifying execution.</p>
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
      <section className="py-24 text-center bg-neutral-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">See how this works for your operation</h2>
          <p className="text-neutral-400 text-xl mb-10 max-w-2xl mx-auto">Walk through a live demo with our team. We&apos;ll map your current workflow and show you exactly where Audiment fits.</p>
          <CalButton className="inline-flex items-center px-10 py-5 rounded-xl font-bold text-lg shadow-xl">
             Book a Demo 
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
          { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://audiment.in/use-cases" },
          { "@type": "ListItem", "position": 3, "name": title, "item": `https://audiment.in${path}` }
        ]
      }) }} />
    </div>
  )
}
