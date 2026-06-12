import { Navbar } from '@/components/ui/navbar'
import { SolutionsHero } from '@/components/ui/solutions-hero'
import Link from 'next/link'
import { Footer } from '@/components/ui/modem-animated-footer'
import { CalButton } from '@/components/ui/cal-button'

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

interface WorkflowStep {
  title: string
  description: string
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
  workflowSteps?: WorkflowStep[]
  operationalBottlenecks?: string[]
  breadcrumbLabel?: string
  canonicalPath?: string
  crossLinks?: { title: string; href: string; description: string; tag?: string }[]
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
  workflowSteps,
  operationalBottlenecks,
  breadcrumbLabel,
  canonicalPath,
  crossLinks,
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

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
      { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://audiment.in/solutions" },
      { "@type": "ListItem", "position": 3, "name": breadcrumbLabel || `${industry} Audit Software`, "item": canonicalPath ? `https://audiment.in${canonicalPath}` : "https://audiment.in/solutions" }
    ]
  };

  // HowTo schema
  const howToSchema = workflowSteps && workflowSteps.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to manage and resolve issues in ${industry.toLowerCase()} operations`,
    "description": `A step-by-step workflow guide to managing operations, identifying issues, and tracking corrective actions in ${industry.toLowerCase()}.`,
    "step": workflowSteps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.title,
      "text": step.description
    })),
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Audiment Platform"
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <SolutionsHero 
        subtitle={industry}
        title={heroH1}
        description={heroSubheadline}
      />

      {/* Pain Points */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-heading">The operational challenges you&apos;re dealing with</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">These are the problems that get worse as you add locations – not better.</p>
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
              <h2 className="text-3xl font-bold mb-6 text-heading">How Audiment addresses this</h2>
              <p className="text-xl text-muted-foreground mb-10">The specific capabilities that close the gap between what you expect and what actually happens on the floor.</p>
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
                 <p className="text-muted-foreground">Conditional logic, mandatory photos, and verified presence.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Bottlenecks & Workflows */}
      {(operationalBottlenecks || workflowSteps) && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {operationalBottlenecks && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-heading">The bottlenecks this removes</h2>
                <ul className="space-y-4">
                  {operationalBottlenecks.map((bottleneck, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                      <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">!</div>
                      <p className="text-muted-foreground leading-relaxed font-medium">{bottleneck}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {workflowSteps && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-heading">The issue → resolution workflow</h2>
                <div className="space-y-6">
                  {workflowSteps.map((step, idx) => (
                    <div key={idx} className="relative pl-8 border-l-2 border-border last:border-transparent pb-6 last:pb-0">
                      <div className="absolute w-4 h-4 rounded-full bg-primary -left-[9px] top-1"></div>
                      <h4 className="font-bold text-lg mb-2 text-heading">{step.title}</h4>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sample Checklist */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-heading">Sample {industry} audit checklist</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">A preview of the kind of operational standards you can digitize and track with Audiment.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-5 px-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Area</th>
                <th className="py-5 px-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Checklist Item</th>
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
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Frequently asked questions</h2>
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
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-heading tracking-tight">See how this works for {industry.toLowerCase()} operations</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">Walk through a live demo mapped to your specific workflow. Our team will show you exactly how Audiment fits your operation.</p>
        <CalButton className="inline-flex items-center px-12 py-5 rounded-2xl font-bold text-lg shadow-xl mb-20">
          Book a Discovery Call
        </CalButton>
        
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

      {/* Cross-links: Platform pages + Operational problem pages */}
      {crossLinks && crossLinks.length > 0 && (
        <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Platform &amp; related topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crossLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all"
              >
                {link.tag && (
                  <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    {link.tag}
                  </span>
                )}
                <h3 className="font-semibold text-sm mb-1 text-heading group-hover:text-primary transition-colors leading-snug">
                  {link.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer
        brandName="Audiment"
        navLinks={[
          { label: "Features", href: "/#features" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Use cases", href: "/#use-cases" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Cookie policy", href: "/cookie-policy" },
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
    </div>
  )
}
