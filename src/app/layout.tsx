import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

const SITE_URL = "https://audiment.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Audiment – Audit Management Software for Multi-Location Compliance",
  description:
    "Audiment is an enterprise-grade audit management platform for distributed locations. Photo evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards for admins, managers, and field auditors.",
  keywords: [
    "audit management software",
    "multi-location compliance",
    "field audit app",
    "corrective action tracking",
    "FSSAI audit software",
    "evidence-based audit",
    "mobile audit app",
    "compliance dashboard",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Audiment",
    title: "Audiment – Audit Management Software for Multi-Location Compliance",
    description:
      "Audiment is an enterprise-grade audit management platform for distributed locations. Photo evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards for admins, managers, and field auditors.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audiment – Audit Management Software for Multi-Location Compliance",
    description:
      "Audiment is an enterprise-grade audit management platform for distributed locations. Photo evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards for admins, managers, and field auditors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <head>

      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm">
            Skip to content
          </a>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
