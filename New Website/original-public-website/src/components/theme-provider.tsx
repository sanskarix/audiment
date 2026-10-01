"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { usePathname } from "next/navigation"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname() || ""

  const isDashboard = pathname.startsWith('/dashboard')
  const isBlog = pathname.startsWith('/blog')
  
  const allowDarkMode = isDashboard || isBlog

  return (
    <NextThemesProvider {...props} forcedTheme={allowDarkMode ? undefined : "light"}>
      {children}
    </NextThemesProvider>
  )
}
