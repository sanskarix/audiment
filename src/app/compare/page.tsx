import React from 'react'
import Link from 'next/link'
import { ArrowRight, Scale, BarChart3, Zap, Wrench, FileText } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { CalButton } from '@/components/ui/cal-button'
import { buildPageMeta } from '@/lib/seo'

const comparisons = [
    {
        title: 'Audiment vs SafetyCulture (iAuditor)',
        description: 'How Audiment compares on evidence verification, corrective action workflows, and multi-location audit oversight.',
        href: '/compare/audiment-vs-safetyculture',
        icon: <Scale className="w-7 h-7 text-primary" />,
    },
    {
        title: 'Audiment vs GoAudits',
        description: 'Compare evidence collection, corrective action accountability, and audit reliability for multi-location operations.',
        href: '/compare/audiment-vs-goaudits',
        icon: <BarChart3 className="w-7 h-7 text-primary" />,
    },
    {
        title: 'Audiment vs Zenput (Crunchtime)',
        description: 'Deployment speed, FSSAI compliance support, and execution verification for APAC operations.',
        href: '/compare/audiment-vs-zenput',
        icon: <Zap className="w-7 h-7 text-primary" />,
    },
    {
        title: 'Audiment vs Jolt',
        description: 'Hardware requirements, multi-location scope, and corrective action escalation workflows compared.',
        href: '/compare/audiment-vs-jolt',
        icon: <Wrench className="w-7 h-7 text-primary" />,
    },
    {
        title: 'Audiment vs Checklist Apps',
        description: 'Why generic checklist apps break at scale and how proof-based audits create operational accountability.',
        href: '/compare/audiment-vs-checklist-apps',
        icon: <FileText className="w-7 h-7 text-primary" />,
    },
]

export const metadata = buildPageMeta({
    title: 'Compare Audit Software | Audiment vs Alternatives',
    description: 'See how Audiment compares to SafetyCulture, GoAudits, Zenput, Jolt, and generic checklist apps. Detailed feature-by-feature comparison for multi-location operations teams.',
    path: '/compare',
})

export default function CompareHub() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main id="main-content" className="flex-1">
                <section className="pt-32 pb-20 border-b border-border bg-muted/10">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-6xl">
                            Compare audit software
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                            Every audit platform handles checklists. The differences that matter are in evidence quality, corrective action accountability, and multi-location visibility. See how Audiment compares.
                        </p>
                    </div>
                </section>
                <section className="py-24">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6">
                            {comparisons.map((comp) => (
                                <Link href={comp.href} key={comp.title} className="flex items-start gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                                    <div className="shrink-0 mt-1">{comp.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-bold text-heading group-hover:text-primary transition-colors">
                                            {comp.title}
                                        </h2>
                                        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                                            {comp.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1.5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-neutral-950 text-white text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to see how Audiment works?</h2>
                        <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">Book a discovery call and we&apos;ll walk you through how Audiment fits your specific operations.</p>
                        <CalButton className="inline-flex items-center px-10 py-5 rounded-xl bg-white text-neutral-900 font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
                            Book a Discovery Call
                        </CalButton>
                    </div>
                </section>
            </main>
            <Footer
                brandName="Audiment"
                navLinks={[
                    { label: "Features", href: "/#features" },
                    { label: "How it works", href: "/#how-it-works" },
                    { label: "Solutions", href: "/solutions" },
                    { label: "Blog", href: "/blog" },
                    { label: "Contact", href: "/#contact" },
                    { label: "Privacy policy", href: "/privacy-policy" },
                    { label: "Cookie policy", href: "/cookie-policy" },
                    { label: "Terms of service", href: "/terms-of-service" },
                ]}
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Audit Software Comparisons",
                "itemListElement": comparisons.map((c, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": c.title,
                    "url": `https://audiment.in${c.href}`
                }))
            }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
                    { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://audiment.in/compare" }
                ]
            }) }} />
        </div>
    )
}
