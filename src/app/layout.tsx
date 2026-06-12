import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { AppProviders } from "@/components/AppProviders";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://audiment.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Audiment',
    default: 'Multi-Location Audit & Inspection Software | Audiment',
  },
  description:
    'Run audits across every location with proof, tracking, and corrective actions. Audiment is audit management software built for multi-location businesses.',
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
    title: 'Multi-Location Audit & Inspection Software | Audiment',
    description:
      'Run audits across every location with proof, tracking, and corrective actions. Audiment is audit management software built for multi-location businesses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Location Audit & Inspection Software | Audiment',
    description:
      'Run audits across every location with proof, tracking, and corrective actions. Audiment is audit management software built for multi-location businesses.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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
        <Script id="cal-embed" strategy="afterInteractive">
          {`
            (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
            Cal("init", "demo", {origin:"https://app.cal.com"});
            Cal.config = Cal.config || {};
            Cal.config.forwardQueryParams = true;
            Cal.ns.demo("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
          `}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
