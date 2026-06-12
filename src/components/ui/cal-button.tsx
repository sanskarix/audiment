'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'

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
    ...props
}: CalButtonProps) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            data-cal-namespace="demo"
            data-cal-link="sanskarix/demo"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            {...props}
        >
            {children}
        </button>
    )
}
