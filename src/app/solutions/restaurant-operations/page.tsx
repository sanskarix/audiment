import React from "react";
import Script from "next/script";
import { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  X,
  AlertTriangle,
  Camera as CameraIcon,
  MapPin as MapPinIcon,
  RefreshCw,
  FileCheck2,
  Smartphone,
} from "lucide-react";
import { Footer } from "@/components/ui/modem-animated-footer";
import { ContactSection } from "@/components/ui/contact-section";
import { HeroRestaurant } from "@/components/ui/hero-restaurant";

export const metadata: Metadata = {
  title: "Restaurant audit software | Stop fake store walks",
  description: "Audiment is the high-trust operational execution platform for multi-location restaurants. Enforce photo evidence and 48-hour corrective actions.",
  keywords: [
    "restaurant audit software",
    "QSR operational execution platform",
    "FSSAI compliance software",
    "prevent fake restaurant audits",
  ],
  alternates: { canonical: 'https://audiment.com/solutions/restaurant-operations' },
  openGraph: {
    title: "Restaurant audit software | Stop fake store walks",
    description: "Audiment is the high-trust operational execution platform for multi-location restaurants. Enforce photo evidence and 48-hour corrective actions.",
    url: 'https://audiment.com/solutions/restaurant-operations',
    type: 'website',
    images: [{ url: 'https://audiment.com/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Restaurant audit software | Stop fake store walks",
    description: "Audiment is the high-trust operational execution platform for multi-location restaurants. Enforce photo evidence and 48-hour corrective actions.",
  },
};

function StructuredData() {
  const qsrSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is restaurant audit software?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Restaurant audit software digitizes food safety, FSSAI compliance, and brand standard checklists. Modern platforms like Audiment require photo and video evidence to ensure audits are accurate.",
        },
      },
      {
        "@type": "Question",
        name: "How do you stop fake restaurant audits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Audiment stops fake audits (pencil-whipping) using Flash Verification, which requires the auditor to upload a geo-tagged selfie and a 1-minute video of the restaurant environment before starting.",
        },
      },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Audiment",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "description": "Verified field audit software for multi-location restaurant operators. Photo evidence, CAPA tracking, and ground-truth compliance visibility.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "priceSpecification": "Contact for pricing"
    },
    "url": "https://audiment.com/solutions/restaurant-operations"
  };

  return (
    <>
      <Script
        id="structured-data-qsr"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qsrSchema) }}
      />
      <Script
        id="structured-data-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
    </>
  );
}

// ─── Comparison Table Data ───────────────────────────────────────────────
const comparisonRows = [
  {
    capability: "Mandatory photo evidence",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "No" },
    generic: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "Optional" },
    audiment: { icon: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, label: "Enforced per question" },
  },
  {
    capability: "Auditor location verification",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "No" },
    generic: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "GPS only (can be spoofed)" },
    audiment: { icon: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, label: "Flash video + Geo-tag" },
  },
  {
    capability: "Automated CAPA SLAs",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "No" },
    generic: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "No" },
    audiment: { icon: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, label: "48-hour enforced loop" },
  },
  {
    capability: "FSSAI hygiene blueprints",
    paper: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "Manual" },
    generic: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "Manual build" },
    audiment: { icon: <Check className="w-4 h-4 text-emerald-500 mx-auto" />, label: "One-click deployment" },
  },
];

export default function RestaurantOperationsPage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <StructuredData />
      <HeroRestaurant />

      {/* ── Problem Section ──────────────────────────────────────────── */}
      <section id="problem" className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15] mb-6">
              Why traditional restaurant<br />
              <span className="text-neutral-400">audits fail at scale</span>
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed">
              When you rely on trust instead of proof, quality slips. Area managers check boxes, store issues persist, and you fall out of compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPinIcon,
                title: "The Fake Audit",
                desc: "Area managers filling out hygiene checklists from the parking lot. You have no way of knowing if they were actually inside the kitchen.",
              },
              {
                icon: Smartphone,
                title: "The WhatsApp Black Hole",
                desc: "Store issues reported in scattered group chats that never actually get fixed. No accountability loop to enforce repairs or improvements.",
              },
              {
                icon: AlertTriangle,
                title: "FSSAI/Health Risks",
                desc: "Failing a surprise health inspection because standard operating procedures weren't visually enforced or taken seriously day-to-day.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution Section ───────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.15] mb-6">
              Built for high-trust<br />
              <span className="text-neutral-400">restaurant execution</span>
            </h2>
            <p className="text-xl text-neutral-500 leading-relaxed">
              Every audit on our platform captures ground truth. No upload-from-gallery hacks. We force accountability at the station level across your entire franchise network.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CameraIcon,
                title: "Flash Verification",
                desc: "Require a 1-minute environmental video and verified selfie to prove the auditor is physically inside the kitchen before starting.",
              },
              {
                icon: FileCheck2,
                title: "FSSAI-ready templates",
                desc: "Deploy standard food safety and hygiene blueprints to 50+ locations in one click to stay compliant with state bodies.",
              },
              {
                icon: RefreshCw,
                title: "48-hour SLA resolution",
                desc: "When a critical food safety standard fails, the system automatically assigns a task to the store manager. They must upload a photo proving it is fixed within 48 hours.",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center mb-6">
                  <pillar.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{pillar.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────────── */}
      <section id="comparison" className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Audiment vs.<br />
              <span className="text-neutral-400">Legacy restaurant checklists</span>
            </h2>
            <p className="text-lg text-neutral-400">
              See how conventional apps fall short and how our execution platform enforces real multi-location accountability.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-sm font-semibold text-neutral-400 tracking-widest whitespace-nowrap">Capability</th>
                  <th className="px-6 py-4 text-sm font-semibold text-neutral-400 tracking-widest border-l border-white/10 text-center whitespace-nowrap">Paper & Excel</th>
                  <th className="px-6 py-4 text-sm font-semibold text-neutral-400 tracking-widest border-l border-white/10 text-center whitespace-nowrap">Legacy Apps</th>
                  <th className="px-6 py-4 text-sm font-semibold text-emerald-400 tracking-widest border-l border-white/10 text-center whitespace-nowrap">Audiment</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-200 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="px-6 py-5 text-base text-neutral-300 leading-relaxed font-medium align-middle">{row.capability}</td>
                    <td className="px-6 py-5 text-sm text-neutral-400 border-l border-white/5 text-center align-middle">
                      <span className="block mb-1">{row.paper.icon}</span>
                      <span className="text-sm">{row.paper.label}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-400 border-l border-white/5 text-center align-middle">
                      <span className="block mb-1">{row.generic.icon}</span>
                      <span className="text-sm">{row.generic.label}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-emerald-400 border-l border-white/5 text-center font-semibold align-middle">
                      <span className="block mb-1">{row.audiment.icon}</span>
                      <span className="text-sm">{row.audiment.label}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer
        brandName="Audiment"
        socialLinks={[]}
        navLinks={[
          { label: "Features", href: "/#features" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Use cases", href: "/#use-cases" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Cookie policy", href: "/cookie-policy" },
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />
    </main>
  );
}
