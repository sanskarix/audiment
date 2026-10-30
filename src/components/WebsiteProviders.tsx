"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicGtm } from "@/components/PublicGtm";
import { ConsentProvider } from "@/components/ConsentProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PublicPageviewTracker } from "@/components/PublicPageviewTracker";

export function WebsiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ConsentProvider>
        <PublicGtm />
        <PublicPageviewTracker />
        <ConsentBanner />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-white focus:text-neutral-900 focus:font-semibold focus:text-sm focus:rounded-md focus:shadow-2xl focus:border focus:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
        >
          Skip to content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </ConsentProvider>
    </ThemeProvider>
  );
}
