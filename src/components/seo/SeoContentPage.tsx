import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'

type Section = { title: string; content: string }
type Faq = { question: string; answer: string }
type RelatedLink = { title: string; href: string; description: string; tag?: string }

interface Props {
  heroH1: string
  heroSubheadline: string
  sections: Section[]
  faqs: Faq[]
  relatedLinks: RelatedLink[]
}

export default function SeoContentPage({ heroH1, heroSubheadline, sections, faqs, relatedLinks }: Props) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-16 border-b border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-heading">{heroH1}</h1>
          <p className="text-[15px] text-muted-foreground">{heroSubheadline}</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-[20px] font-semibold tracking-tight mb-3 text-heading">{section.title}</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </section>

      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Related Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedLinks.map((link, i) => (
            <Link key={i} href={link.href} className="group p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all">
              {link.tag && <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-1">{link.tag}</span>}
              <h3 className="font-semibold text-[15px] mb-1 text-heading group-hover:text-primary transition-colors">{link.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-8 text-center text-heading">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card border border-border p-5 rounded-xl">
              <h3 className="font-semibold text-base mb-2 text-heading">{faq.question}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer brandName="Audiment" navLinks={[{ label: 'Features', href: '/#features' }, { label: 'How it works', href: '/#how-it-works' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '/#contact' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  )
}
