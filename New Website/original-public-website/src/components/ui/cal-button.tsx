'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'
import { pushAnalyticsEvent, getPageTaxonomyContext } from '@/lib/dataLayer'

interface CalButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: React.ReactNode
    className?: string
}

export const CalButton = ({
    children,
    className,
    size,
    variant,
    onClick,
    ...props
}: CalButtonProps) => {
    const pathname = usePathname()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (pathname) {
            const taxonomy = getPageTaxonomyContext(pathname)
            pushAnalyticsEvent({
                event: 'cta_click',
                cta_name: 'book_demo',
                page_path: pathname,
                page_type: taxonomy.page_type,
            })
        }
        if (onClick) {
            onClick(e)
        }
    }

    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            data-cal-namespace="demo"
            data-cal-link="sanskarix/demo"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    )
}

