import React from 'react'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, ShieldCheck, ShoppingBag, Store, Building, Factory } from 'lucide-react'

const solutions = [
    {
        title: 'Restaurant Audit Software',
        description: 'Ensure hygiene, safety, and brand standards across every location.',
        href: '/solutions/restaurant-audit-software',
        icon: <Utensils className="w-8 h-8 text-primary" />,
    },
    {
        title: 'QSR Audit Software',
        description: 'Maintain speed, consistency, and cleanliness in high-volume quick-service restaurants.',
        href: '/solutions/qsr-audit-software',
        icon: <Coffee className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Food Safety Audit Software',
        description: 'Automate HACCP checks, temp logs, and daily compliance to prevent incidents.',
        href: '/solutions/food-safety-audit-software',
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Retail Audit Software',
        description: 'Verify merchandising, store presentation, and operational execution.',
        href: '/solutions/retail-audit-software',
        icon: <ShoppingBag className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Franchise Audit Software',
        description: 'Protect brand equity and ensure franchisees follow operational playbooks.',
        href: '/solutions/franchise-audit-software',
        icon: <Store className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Hotel Audit Software',
        description: 'Standardize housekeeping, maintenance, and guest experience across properties.',
        href: '/solutions/hotel-audit-software',
        icon: <Building className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Manufacturing Audit Software',
        description: 'Digitize safety walks, 5S audits, and quality control inspections.',
        href: '/solutions/manufacturing-audit-software',
        icon: <Factory className="w-8 h-8 text-primary" />,
    },
]

export const metadata = {
    title: 'Solutions Hub | Audiment',
    description: 'Explore Audiment’s proof-based audit solutions for restaurants, retail, hotels, and multi-location businesses.',
}

export default function SolutionsHub() {
    return (
        <main id="main-content" className="flex-1 bg-white">
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Operational Visibility Built for Your Industry
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Whether you run five locations or five hundred, operations break down at scale without visibility. While the core need for truth is universal, a QSR speed-of-service audit requires fundamentally different workflows than a deep-dive manufacturing safety inspection. Select your operational environment below to see how we close the loop.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {solutions.map((solution) => (
                                <Link href={solution.href} key={solution.title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow group">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                        {solution.icon}
                                        {solution.title}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{solution.description}</p>
                                        <p className="mt-6 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                                            View Solution <ArrowRight className="ml-1 w-4 h-4" />
                                        </p>
                                    </dd>
                                </Link>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </main>
    )
}
