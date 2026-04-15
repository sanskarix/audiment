'use client'
import React from 'react'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

interface SolutionsHeroProps {
    title: string | React.ReactNode;
    subtitle: string;
    description: string;
    ctaText?: string;
    ctaHref?: string;
}

export function SolutionsHero({
    title,
    subtitle,
    description,
    ctaText = "Get Started",
    ctaHref = "/#contact"
}: SolutionsHeroProps) {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-neutral-100/50 to-transparent pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="max-w-4xl">
                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                        delayChildren: 0.2,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}
                    >
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-8">
                            {title}
                        </h1>

                        <p className="text-xl text-neutral-600 leading-relaxed mb-12 max-w-3xl">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base bg-neutral-900 text-white hover:bg-neutral-800">
                                <Link href={ctaHref}>
                                    {ctaText}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                                <Link href="/#how-it-works">See How It Works</Link>
                            </Button>
                        </div>
                    </AnimatedGroup>
                </div>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neutral-100 rounded-full blur-[120px] -mr-64 -mb-64 pointer-events-none" />
        </section>
    )
}
