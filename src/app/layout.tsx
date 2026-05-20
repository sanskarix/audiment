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
import { AuthProvider } from "@/components/AuthProvider";

const SITE_URL = "https://audiment.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Audiment',
  title: 'Audit and Inspection Software for Multi-Location Businesses | Audiment',
  description:
    'Audiment is audit and inspection software for multi-location businesses. Stay on top of quality and compliance across locations through proof-based audits, issue tracking, and corrective actions.',
  keywords: [
    'audit and inspection software',
    'multi-location audit software',
    'quality consistency',
    'operational consistency',
    'proof-based audits',
    'corrective action tracking',
    'FSSAI audit software',
    'field audit app',
    'multi-location compliance',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Audiment',
    title: 'Audit and Inspection Software for Multi-Location Businesses | Audiment',
    description:
      'Audiment is audit and inspection software for multi-location businesses. Stay on top of quality and compliance across locations through proof-based audits, issue tracking, and corrective actions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audit and Inspection Software for Multi-Location Businesses | Audiment',
    description:
      'Audiment is audit and inspection software for multi-location businesses. Stay on top of quality and compliance across locations through proof-based audits, issue tracking, and corrective actions.',
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
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <head>

      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="silence-abort-error" strategy="beforeInteractive">
          {`
            (function() {
              const originalError = console.error;
              console.error = function(...args) {
                const msg = args.join(' ');
                if (
                  msg.includes('AbortError') || 
                  msg.includes('signal is aborted') || 
                  msg.includes('signal was aborted') ||
                  msg.includes('The user aborted a request')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };
            })();
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm">
            Skip to content
          </a>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
