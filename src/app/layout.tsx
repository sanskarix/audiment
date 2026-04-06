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
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Audiment",
    title: "Audiment – Audit Management Software for Multi-Location Compliance",
    description:
      "Audiment is an enterprise-grade audit management platform for distributed locations. Photo evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards for admins, managers, and field auditors.",
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
      "Audiment is an enterprise-grade audit management platform for distributed locations. Photo evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards for admins, managers, and field auditors.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const schemaJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Audiment",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "description": "Enterprise-grade audit management platform for multi-location businesses with photo evidence enforcement, automated corrective actions, and real-time compliance intelligence.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Audiment",
    "url": "https://audiment.com",
    "description": "Audit management software for multi-location compliance"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is audit management software?", "acceptedAnswer": { "@type": "Answer", "text": "Audit management software is a digital platform that enables businesses to create, assign, execute, and track compliance and operational audits. It replaces paper checklists with structured digital workflows that include photo evidence, scoring, corrective action tracking, and real-time reporting." } },
      { "@type": "Question", "name": "How does Audiment ensure auditors actually visit the location?", "acceptedAnswer": { "@type": "Answer", "text": "Audiment uses Flash Verification – auditors record a 20-second video from the field combined with a geo-tagged selfie. Every audit submission is automatically stamped with GPS coordinates and a timestamp, creating tamper-proof proof of presence." } },
      { "@type": "Question", "name": "Can I customize audit checklists for my industry?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Audiment includes a Blueprint Builder that lets admins create fully custom audit templates with questions, scoring logic, and severity levels. FSSAI-ready compliance templates are also available with one click." } },
      { "@type": "Question", "name": "Does Audiment support FSSAI compliance audits?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Audiment includes pre-built FSSAI compliance audit templates that can be loaded with one click. Every question supports mandatory photo evidence enforcement, creating a complete audit trail for FSSAI inspections." } },
      { "@type": "Question", "name": "How does the corrective action workflow work?", "acceptedAnswer": { "@type": "Answer", "text": "When an auditor fails a critical severity question, Audiment automatically generates a corrective action task assigned to the location manager with a 48-hour SLA. The manager must submit a resolution note and photo proof before the action can be closed." } },
      { "@type": "Question", "name": "Can I export audit reports as PDF?", "acceptedAnswer": { "@type": "Answer", "text": "Every completed audit in Audiment can be exported as a high-fidelity PDF report that includes all questions, answers, photo evidence, scores, and corrective action status." } },
      { "@type": "Question", "name": "What industries is Audiment built for?", "acceptedAnswer": { "@type": "Answer", "text": "Audiment is built for QSR and restaurant chains, retail chains, hotels and hospitality, franchise operations, food and beverage companies, manufacturing facilities, and facility management companies." } },
      { "@type": "Question", "name": "How is Audiment different from iAuditor or SafetyCulture?", "acceptedAnswer": { "@type": "Answer", "text": "Audiment differentiates through mandatory photo and video evidence enforcement per question, Flash Verification with geo-tagged identity video, automated corrective action loops with 48-hour SLA, trend detection after three consecutive poor audits, and FSSAI-ready templates built for the Indian market." } },
      { "@type": "Question", "name": "Is there a mobile app for field auditors?", "acceptedAnswer": { "@type": "Answer", "text": "Audiment is fully mobile-optimised as a progressive web application. Auditors access it through any phone browser with no installation required. The interface supports offline execution with automatic sync when connectivity returns." } },
      { "@type": "Question", "name": "What happens when an audit score is too low?", "acceptedAnswer": { "@type": "Answer", "text": "Audiment automatically sends instant alerts to the relevant manager and admin when an audit score falls below the configured threshold. If a location scores poorly on three consecutive audits, a trend alert is triggered flagging the location as consistently underperforming." } }
    ]
  }
];

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
