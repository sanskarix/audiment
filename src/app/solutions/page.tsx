import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, ShieldCheck, ShoppingBag, Store, Building, Factory } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'

const solutions = [
    {
        title: 'Restaurant Audit Software',
        description: 'Run hygiene, safety, and brand standard audits across every location with FSSAI-ready templates. Area managers see which kitchens are passing and which need attention.',
        href: '/solutions/restaurant-audit-software',
        icon: <Utensils className="w-8 h-8 text-primary" />,
    },
    {
        title: 'QSR Audit Software',
        description: 'Shift-by-shift compliance checks for high-volume QSR operations. Opening checklists, temperature logs, and brand standard audits run consistently – even with high staff turnover.',
        href: '/solutions/qsr-audit-software',
        icon: <Coffee className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Food Safety Audit Software',
        description: 'FSSAI-mapped audit templates with mandatory photo evidence and automatic non-conformance alerts. Build an inspection-ready compliance record before the inspector arrives.',
        href: '/solutions/food-safety-audit-software',
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Retail Audit Software',
        description: 'Audit visual merchandising, promotional displays, and store presentation against corporate guidelines. See which districts are executing well and which are falling behind.',
        href: '/solutions/retail-audit-software',
        icon: <ShoppingBag className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Franchise Audit Software',
        description: 'Give corporate teams proof of what\u0027s actually happening at franchisee locations. Objective scorecards, photo-evidenced audits, and compliance data that supports performance conversations.',
        href: '/solutions/franchise-audit-software',
        icon: <Store className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Hotel Audit Software',
        description: 'Standardize housekeeping, F&B safety, and guest experience audits across properties. When an inspection finds a maintenance issue, the fix routes to engineering automatically.',
        href: '/solutions/hotel-audit-software',
        icon: <Building className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Manufacturing Audit Software',
        description: 'Run safety walks, equipment inspections, and quality control audits across production facilities. Photo-evidenced shift handovers ensure nothing gets missed between teams.',
        href: '/solutions/manufacturing-audit-software',
        icon: <Factory className="w-8 h-8 text-primary" />,
    },
]

export const metadata: Metadata = {
    title: { absolute: 'Audit Software by Industry | Audiment' },
    description: 'Audit management software configured for restaurants, QSR, retail, hotels, franchises, and manufacturing. Each solution matches the specific audit workflows of your industry.',
    alternates: { canonical: 'https://audiment.in/solutions' },
}

export default function SolutionsHub() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main id="main-content" className="flex-1">
                <section className="pt-32 pb-20 border-b border-border bg-muted/10">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-6xl">
                            Audit software built for your industry
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                            Every multi-location business needs reliable audits. But a QSR shift check is fundamentally different from a hotel room inspection or a factory safety walk. Each solution below is configured for the audit workflows, compliance requirements, and management structure of your industry.
                        </p>
                    </div>
                </section>
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
                            {solutions.map((solution) => (
                                <Link href={solution.href} key={solution.title} className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                                    <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-heading">
                                        {solution.icon}
                                        {solution.title}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                        <p className="flex-auto">{solution.description}</p>
                                        <p className="mt-6 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                                            Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                        </p>
                                    </dd>
                                </Link>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* Cross-Industry CTA */}
                <section className="py-24 bg-neutral-950 text-white text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Not sure which solution fits?</h2>
                        <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">Tell us what you audit today. We&apos;ll show you how Audiment fits your operation.</p>
                        <Link href="/#contact" className="inline-flex items-center px-10 py-5 rounded-xl bg-white text-neutral-900 font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
                            Book a Discovery Call
                        </Link>
                    </div>
                </section>
            </main>
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
        </div>
    )
}
