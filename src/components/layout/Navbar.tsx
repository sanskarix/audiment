'use client'
import React from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const menuItems = [
    { name: 'Restaurant Audits', href: '/solutions/restaurant-operations' },
    { name: 'Retail Audits', href: '/solutions/retail-operations' },
    { name: 'Franchise Compliance', href: '/solutions/franchise-operations' },
    { name: 'Features', href: '/#features' },
    { name: 'Blog', href: '/blog' },
]

export const Navbar = () => {
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
                className="fixed group z-50 w-full px-2 top-0">
                <div className={cn('mx-auto mt-2 max-w-7xl px-4 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/80 max-w-5xl rounded-2xl border border-border/50 backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex items-center justify-between py-3 lg:py-4">
                        <div className="flex items-center gap-8">
                            <Link href="/" aria-label="home" className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <ul className="hidden lg:flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.href} className="text-muted-text hover:text-heading transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex items-center gap-3">
                                <ThemeToggle />
                                <Link href="/login" className="text-sm font-medium text-muted-text hover:text-heading px-4">
                                    Login
                                </Link>
                                <Button asChild size="sm" className="rounded-full shadow-lg shadow-primary/20">
                                    <Link href="#contact">Book a call</Link>
                                </Button>
                            </div>

                            <div className="lg:hidden flex items-center gap-2">
                                <ThemeToggle />
                                <Button asChild size="sm" className="h-9 px-4 rounded-full text-xs font-bold">
                                    <Link href="#contact">Book a call</Link>
                                </Button>
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    className="p-2 text-muted-text hover:text-heading transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    {menuState ? <X className="size-6" /> : <Menu className="size-6" />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Overlay */}
                        {menuState && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-background border border-border/50 rounded-3xl shadow-2xl lg:hidden animate-in slide-in-from-top-2 duration-200">
                                <ul className="space-y-4 mb-6">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setMenuState(false)}
                                                className="text-lg font-medium text-heading block py-2 border-b border-border/10"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" asChild className="rounded-2xl h-11 font-bold">
                                        <Link href="/login" onClick={() => setMenuState(false)}>Login</Link>
                                    </Button>
                                    <Button asChild className="rounded-2xl h-11 font-bold shadow-lg shadow-primary/20">
                                        <Link href="#contact" onClick={() => setMenuState(false)}>Book a call</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <span className={cn("text-2xl font-medium tracking-tighter text-heading", className)}>
            Audiment
        </span>
    )
}
