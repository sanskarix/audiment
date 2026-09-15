"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicGtm } from "@/components/PublicGtm";
import { ConsentProvider } from "@/components/ConsentProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PublicPageviewTracker } from "@/components/PublicPageviewTracker";

const AuthProvider = dynamic(
  () => import("@/components/AuthProvider").then((mod) => mod.AuthProvider),
  { ssr: false }
);

function shouldMountAuthProvider(pathname: string | null) {
  if (!pathname) return false;

  return pathname.startsWith("/dashboard");
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const content = shouldMountAuthProvider(pathname) ? (
    <AuthProvider>{children}</AuthProvider>
  ) : (
    children
  );

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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm"
        >
          Skip to content
        </a>
        <TooltipProvider>{content}</TooltipProvider>
      </ConsentProvider>
    </ThemeProvider>
  );
}
