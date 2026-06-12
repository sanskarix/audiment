import React from 'react'
import Link from 'next/link'
import { ArrowRight, ClipboardCheck, Search, MapPin, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { CalButton } from '@/components/ui/cal-button'
import { buildPageMeta } from '@/lib/seo'

const useCases = [
    {
        title: 'Digital Audit Checklists',
        description: 'Replace paper checklists with photo-verified, conditional-logic forms that show you what actually happened – not what someone claims happened.',
        href: '/use-cases/audit-checklist-software',
        icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Inspection Management',
        description: 'Schedule, execute, and track inspections across all locations. GPS verification and live photo evidence confirm on-site execution.',
        href: '/use-cases/inspection-management-software',
        icon: <Search className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Multi-Location Compliance',
        description: 'Get verified compliance data from every branch without being there. Dashboards, corrective actions, and trend alerts keep you on top of standards.',
        href: '/use-cases/multi-location-compliance',
        icon: <MapPin className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Corrective Action Tracking',
        description: 'Auto-generated tasks with SLA deadlines and photo-proof closure keep every issue on track from detection to resolution.',
        href: '/use-cases/corrective-action-tracking',
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
]

export const metadata = buildPageMeta({
    title: 'Use Cases | Audit Management Software for Operations Teams',
    description: 'Explore how multi-location operations teams use Audiment for digital audit checklists, inspection management, compliance tracking, and corrective action workflows.',
    path: '/use-cases',
})

export default function UseCasesHub() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main id="main-content" className="flex-1">
                <section className="pt-32 pb-20 border-b border-border bg-muted/10">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-6xl">
                            How operations teams use Audiment
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                            Every multi-location business faces the same challenge: maintaining consistent standards at scale. These use cases show how Audiment solves the specific operational problems that get worse as you add locations.
                        </p>
                    </div>
                </section>
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2">
                            {useCases.map((useCase) => (
                                <Link href={useCase.href} key={useCase.title} className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                                    <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-heading">
                                        {useCase.icon}
                                        {useCase.title}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                        <p className="flex-auto">{useCase.description}</p>
                                        <p className="mt-6 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                                            Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                        </p>
                                    </dd>
                                </Link>
                            ))}
                        </dl>
                    </div>
                </section>

                <section className="py-24 bg-neutral-950 text-white text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">See Audiment in action</h2>
                        <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">Tell us your operational challenge. We&apos;ll show you exactly how Audiment solves it for your team.</p>
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
                "name": "Audit Management Use Cases",
                "itemListElement": useCases.map((uc, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": uc.title,
                    "url": `https://audiment.in${uc.href}`
                }))
            }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://audiment.in" },
                    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://audiment.in/use-cases" }
                ]
            }) }} />
        </div>
    )
}
