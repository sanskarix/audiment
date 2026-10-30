"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/app-ui/tooltip";

const AuthProvider = dynamic(
  () => import("@/components/AuthProvider").then((mod) => mod.AuthProvider),
  { ssr: false }
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-white focus:text-neutral-900 focus:font-semibold focus:text-sm focus:rounded-md focus:shadow-2xl focus:border focus:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
        >
          Skip to content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
