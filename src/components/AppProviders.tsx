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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm"
        >
          Skip to content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
