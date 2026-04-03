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
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Audiment – Audit Management Software for Multi-Location Compliance",
    template: "%s | Audiment",
  },
  description:
    "Replace paper checklists and Excel trackers with a single platform for audits, evidence, corrective actions, and real-time compliance intelligence across every location.",
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
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Audiment",
    title: "Audiment – Audit Management Software for Multi-Location Compliance",
    description:
      "Replace paper checklists, scattered WhatsApp photos, and Excel trackers with a single platform for audits, evidence, corrective actions, and real-time compliance intelligence across every location.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Audiment – Audit Management Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audiment – Audit Management Software for Multi-Location Compliance",
    description:
      "Replace paper checklists and Excel trackers with a single platform for audits, evidence, corrective actions, and real-time compliance intelligence.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Audiment",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Mobile",
      url: SITE_URL,
      description:
        "Audit management software for multi-location compliance with mandatory photo evidence, corrective action tracking, FSSAI templates, geo-tagged verification, and real-time dashboards.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Photo & Video Evidence Enforcement",
        "Automated Corrective Action Tracking",
        "Flash Verification – Geo-tagged Audits",
        "FSSAI-Ready Compliance Templates",
        "One-Click PDF Audit Reports",
        "Dashboards for Admins, Managers & Auditors",
        "Mobile-First Audit Execution",
        "Pattern Detection Across Locations",
        "Scheduled & Surprise Audits",
        "Offline Mode with Auto-Sync",
      ],
    },
    {
      "@type": "Organization",
      name: "Audiment",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: [],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is audit management software?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Audit management software is a platform for creating, executing, tracking, and analysing audits across locations. It replaces paper checklists and Excel sheets with digital workflows that enforce evidence collection, auto-calculate scores, trigger corrective actions, and generate reports.",
          },
        },
        {
          "@type": "Question",
          name: "How does Audiment ensure auditors actually visit the location?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Audiment uses Flash Verification – a mandatory 20-second live video recorded inside the app – combined with GPS geo-tagging. If the auditor is more than 50 metres from the registered branch, the audit is flagged. A selfie is also captured to prevent proxy auditing.",
          },
        },
        {
          "@type": "Question",
          name: "Can I customize audit checklists?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Admins create templates from scratch using the Blueprint builder. Set your own questions, choose severity levels (Low, Medium, Critical), require photos or videos on specific questions, and set recurrence schedules.",
          },
        },
        {
          "@type": "Question",
          name: "Does Audiment support FSSAI compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Audiment includes FSSAI-ready audit templates that can be loaded instantly. All audit records – with photos, GPS, timestamps, and corrective actions – are stored permanently for regulatory review.",
          },
        },
        {
          "@type": "Question",
          name: "How does the corrective action workflow work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When a question is failed, the system auto-creates a corrective action and alerts the manager. The manager must fix the issue and upload before/after photo proof within a 48-hour SLA. The admin reviews and approves or rejects before the action is closed.",
          },
        },
        {
          "@type": "Question",
          name: "Can I export audit reports as PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Audiment generates high-fidelity, one-click PDF reports that include all question responses, photos, scores, corrective actions, and timestamps. Suitable for stakeholder presentations and regulatory submissions.",
          },
        },
        {
          "@type": "Question",
          name: "What industries does Audiment support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Audiment is built for any multi-location operation: QSR & restaurant chains, retail & grocery chains, hotels & hospitality, manufacturing & warehousing, franchise operations, and food & beverage businesses requiring FSSAI compliance.",
          },
        },
        {
          "@type": "Question",
          name: "How is Audiment different from iAuditor or generic tools?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unlike generic tools, Audiment enforces mandatory photo evidence per question, includes Flash Verification with live geo-tagged video to confirm auditor presence, automatically creates corrective actions with a 48-hour SLA, detects declining trends across the last 3 audits, and includes FSSAI-ready templates out of the box.",
          },
        },
        {
          "@type": "Question",
          name: "Does Audiment have a mobile app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Audiment is a mobile-first web app – no app store download required. Open the link in any phone browser, log in, and start auditing. It also supports offline mode: complete the entire audit without internet and it syncs automatically when reconnected.",
          },
        },
        {
          "@type": "Question",
          name: "What happens when an audit score is low?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Critical failures auto-escalate immediately and corrective actions are created. The system also monitors trends – if a location's score drops 10% or more across the last 3 audits, a tiered escalation alert is sent to the branch manager, regional manager, and owner.",
          },
        },
      ],
    },
  ],
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
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
