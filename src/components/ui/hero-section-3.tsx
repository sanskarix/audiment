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
import { motion, useScroll, useTransform } from 'motion/react'

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

export function HeroSection({ userRole }: { userRole?: string | null }) {
    // Track window scroll progress — no target needed, works reliably with overflow-hidden
    const { scrollY } = useScroll()
    // Map raw scroll pixels to a small upward drift — 60px scroll = -8px image shift
    const imageY = useTransform(scrollY, [0, 300], [0, -24])

    return (
        <>
            <HeroHeader userRole={userRole} />

            <main>
                <section id="hero">
                    <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-0 lg:pt-40">
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
                                    Audit management software<br />
                                    <span className="text-neutral-400">for every location you run</span>
                                </h1>

                                <p className="mx-auto mt-6 max-w-5xl text-pretty text-lg text-neutral-600">
                                    Enforce photo evidence, verify auditor presence, and turn failed checks into automated actions across every branch.
                                </p>

                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    {userRole ? (
                                        <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                                            <Link href={
                                                userRole === 'admin' ? '/dashboard/admin' :
                                                    userRole === 'manager' ? '/dashboard/manager' :
                                                        userRole === 'auditor' ? '/dashboard/auditor' : '/login'
                                            }>Go to app</Link>
                                        </Button>
                                    ) : (
                                        <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                                            <Link href="#contact">Book a call</Link>
                                        </Button>
                                    )}
                                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                                        <Link href="#contact">See it in action</Link>
                                    </Button>
                                </div>
                                <span className="sr-only">Built for restaurant chains, retail brands, hotel groups, franchise operations, and multi-location businesses across India and globally.</span>

                                <motion.div
                                    aria-hidden
                                    style={{ y: imageY }}
                                    className="relative mx-auto mt-10 max-w-6xl px-4"
                                >
                                    <Image
                                        src="/landing/mockup.svg"
                                        alt="Audiment Dashboard Overview"
                                        width={1600}
                                        height={1200}
                                        className="relative z-10 w-full h-auto drop-shadow-[0_24px_48px_rgba(0,0,0,0.10)]"
                                        priority
                                    />
                                </motion.div>
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

export const HeroHeader = ({ userRole }: { userRole?: string | null }) => {
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
                                {userRole ? (
                                    <Button asChild size="sm" className={cn(!isScrolled && 'lg:inline-flex')}>
                                        <Link href={
                                            userRole === 'admin' ? '/dashboard/admin' :
                                                userRole === 'manager' ? '/dashboard/manager' :
                                                    userRole === 'auditor' ? '/dashboard/auditor' : '/login'
                                        }>
                                            <span>Go to app</span>
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
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
                                    </>
                                )}
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
                            <div className="flex h-36 items-center justify-center">
                                <Image
                                    className="h-full w-auto max-w-none dark:invert object-contain"
                                    src="/logos/aster.svg"
                                    alt="Aster Logo"
                                    height={160}
                                    width={450}
                                    unoptimized
                                    priority
                                />
                            </div>
                            <div className="flex h-36 items-center justify-center">
                                <Image
                                    className="h-full w-auto max-w-none dark:invert object-contain"
                                    src="/logos/ayatana.svg"
                                    alt="Ayatana Logo"
                                    height={160}
                                    width={450}
                                    unoptimized
                                />
                            </div>
                            <div className="flex h-36 items-center justify-center">
                                <Image
                                    className="h-full w-auto max-w-none dark:invert object-contain"
                                    src="/logos/bw.svg"
                                    alt="BW Logo"
                                    height={160}
                                    width={450}
                                    unoptimized
                                />
                            </div>
                            <div className="flex h-36 items-center justify-center">
                                <Image
                                    className="h-full w-auto max-w-none dark:invert object-contain"
                                    src="/logos/motherhood.svg"
                                    alt="Motherhood Logo"
                                    height={160}
                                    width={450}
                                    unoptimized
                                />
                            </div>
                            <div className="flex h-36 items-center justify-center">
                                <Image
                                    className="h-full w-auto max-w-none dark:invert object-contain"
                                    src="/logos/tom-and-chee.svg"
                                    alt="Tom & Chee Logo"
                                    height={160}
                                    width={450}
                                    unoptimized
                                />
                            </div>
                            <div className="flex h-36 items-center justify-center">
                                <Image
                                    className="h-full w-auto max-w-none dark:invert object-contain"
                                    src="/logos/vrl.svg"
                                    alt="VRL Logo"
                                    height={160}
                                    width={450}
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
