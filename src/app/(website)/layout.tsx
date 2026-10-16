import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/styles/website.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { WebsiteProviders } from "@/components/WebsiteProviders";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const SITE_URL = "https://audiment.in";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://audiment.in/#organization",
  "name": "Audiment",
  "url": "https://audiment.in",
  "logo": {
    "@type": "ImageObject",
    "@id": "https://audiment.in/#logo",
    "url": "https://audiment.in/icon.svg",
    "width": 512,
    "height": 512
  },
  "description": "Audit management software for multi-location businesses. Run proof-based audits with corrective action tracking across every location.",
  "foundingDate": "2024",
  "legalName": "Asellus LLP",
  "email": "hello@audiment.in",
  "sameAs": [
    "https://www.linkedin.com/company/audiment",
    "https://twitter.com/audiment"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "hello@audiment.in",
    "availableLanguage": "English"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://audiment.in/#website",
  "name": "Audiment",
  "url": "https://audiment.in",
  "description": "Audit management software for multi-location businesses.",
  "publisher": {
    "@id": "https://audiment.in/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://audiment.in/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

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

export default function WebsiteRootLayout({
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
        <Script id="google-consent-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NQQHZHFNKZ');
          `}
        </Script>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-NQQHZHFNKZ"
        />
        <Script id="cal-embed" strategy="lazyOnload">
          {`
            (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
            Cal("init", "demo", {origin:"https://app.cal.com"});
            Cal.config = Cal.config || {};
            Cal.config.forwardQueryParams = true;
            Cal.ns.demo("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
            if (!window.__audimentCalListenersAdded) {
              window.__audimentCalListenersAdded = true;
              Cal.ns.demo("on", {
                action: "navigatedToBooker",
                callback: function () {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "booking_start",
                    booking_method: "cal_booking",
                    page_path: window.location.pathname
                  });
                }
              });
              Cal.ns.demo("on", {
                action: "bookingSuccessfulV2",
                callback: function () {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "generate_lead",
                    booking_method: "cal_booking",
                    page_path: window.location.pathname
                  });
                }
              });
            }
          `}
        </Script>
        <WebsiteProviders>{children}</WebsiteProviders>
      </body>
    </html>
  );
}
