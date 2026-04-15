'use client'
import React from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

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

export function HeroRestaurant({ title }: { title?: React.ReactNode }) {
    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden">
                <section id="hero">
                    <div className="relative mx-auto max-w-7xl px-6 pt-32 lg:pb-16 lg:pt-48">
                        <div className="relative z-10 mx-auto max-w-6xl text-center">
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                            >
                                <h1
                                    className="text-balance text-5xl font-semibold sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                                    {title || (
                                        <>
                                            Restaurant audit software<br />
                                            <span className="text-neutral-400">that actually proves they were there.</span>
                                        </>
                                    )}
                                </h1>

                                <p className="mx-auto mt-6 max-w-5xl text-pretty text-lg text-neutral-600">
                                    Stop relying on pencil-whipped paper checklists. Get ground-truth visibility across every QSR location with mandatory photo evidence, geo-tagged selfies, and automated corrective actions.
                                </p>

                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                                        <Link href="/login">Start Free</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                                        <Link href="#contact">See a Flash Audit in Action</Link>
                                    </Button>
                                </div>
                                <span className="sr-only">Restaurant audit software for QSRs and multi-unit food brands.</span>

                                <div
                                    aria-hidden
                                    className="relative mx-auto mt-24 max-w-5xl"
                                >
                                    <div className="relative z-10 overflow-hidden rounded-[2rem] border border-border/50 bg-background/50 p-2 backdrop-blur-xl shadow-2xl shadow-primary/10 transition-all duration-700 hover:shadow-primary/20">
                                        <div className="overflow-hidden rounded-[1.5rem] border border-border/50 shadow-inner bg-white">
                                            <Image 
                                                src="/landing/hero-main.png" 
                                                alt="Audiment Dashboard Overview" 
                                                width={1600} 
                                                height={1200} 
                                                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.01]"
                                                priority
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -inset-4 z-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl opacity-50" />
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Use cases', href: '#use-cases' },
    { name: 'Blog', href: '/blog' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed group z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-5xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-text hover:text-heading block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-text hover:text-heading block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="/login">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#contact">
                                        <span>Book a call</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="#contact">
                                        <span>Book a call</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const LogoCloud = () => {
    return (
        <section className="bg-background pb-16 md:pb-32">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">Trusted Across Industries</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            durationOnHover={20}
                            duration={40}
                            gap={112}>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height={20}
                                    width={100}
                                    unoptimized
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height={16}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height={16}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height={20}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height={20}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height={16}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-7 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height={28}
                                    width={100}
                                    unoptimized
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-6 w-fit dark:invert object-contain"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height={24}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <span className={cn("text-2xl font-medium tracking-tighter text-heading", className)}>
            Audiment
        </span>
    )
}
