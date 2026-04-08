import React from "react";
import Script from "next/script";
import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSessionFromCookie } from "@/lib/auth";
import {
  ArrowRight, CheckCircle2, Globe2, Shield, Zap, RefreshCw, Crown, Users, ClipboardList,
  Lock, Database, Smartphone, Wifi, Building2, UtensilsCrossed,
  Check, X, AlertTriangle, MapPin as MapPinIcon, FileText, UserCheck, Camera as CameraIcon, Wrench, FileBarChart, UtensilsCrossed as UtensilsIcon, ShoppingBag as ShoppingBagIcon, Building2 as BuildingIcon, Settings, GraduationCap, Heart, Truck, Coffee, FileCheck2
} from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-3";
import { Footer } from "@/components/ui/modem-animated-footer";
import { StickyFeatureSection } from "@/components/ui/sticky-scroll-cards-section";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import { ContactSection } from "@/components/ui/contact-section";

export const metadata: Metadata = {
  title: 'Audiment | High-Trust Audit Software for Multi-Location Operations',
  description: 'Stop pencil-whipping. Audiment is the operations and audit platform that enforces photo evidence, verifies auditor locations, and turns failures into automated corrective actions.',
  keywords: ['audit management software', 'restaurant brand standard audit app', 'software to prevent fake audits', 'franchise quality control software', 'CAPA software'],
  openGraph: {
    title: 'Audiment | Ground-Truth Visibility for Franchises',
    description: 'Enforce photo evidence, track corrective actions, and monitor scores across every location.',
    url: 'https://audiment.com',
    siteName: 'Audiment',
    type: 'website',
  },
};

function StructuredData() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Audiment",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Mobile",
        "description": "High-trust audit and operations platform for multi-unit franchises, featuring Flash Verification, photo evidence enforcement, and automated corrective actions.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Organization",
        "name": "Audiment",
        "url": "https://audiment.com",
        "logo": "https://audiment.com/logo.png",
        "sameAs": [
          "https://www.linkedin.com/company/audiment"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Audiment prevent fake field audits?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Audiment uses Flash Verification, which requires auditors to capture a geo-tagged, 1-minute environmental video and a verified selfie to prove they are physically on-site."
            }
          },
          {
            "@type": "Question",
            "name": "How are corrective actions handled?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When a critical standard fails, Audiment automatically generates a corrective action task for the location manager with a mandatory 48-hour SLA and requires photo proof of the resolution."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// ─── How It Works Steps (6 steps per user request) ───────────────────────────
const steps = [
  {
    number: "01",
    title: "Create audit blueprints",
    desc: "Admin builds a standardized audit template with questions, scoring logic, and severity levels.",
  },
  {
    number: "02",
    title: "Define locations and assign managers",
    desc: "Create your branch network, assign managers to locations, and configure your organizational structure.",
  },
  {
    number: "03",
    title: "Schedule and assign audits",
    desc: "Publish scheduled or surprise audits to specific branches and assign them to field auditors.",
  },
  {
    number: "04",
    title: "Execute with photo evidence",
    desc: "Auditors complete audits on their phones with mandatory photo evidence enforced per question.",
  },
  {
    number: "05",
    title: "Resolve corrective actions",
    desc: "Critical failures auto-generate tasks for managers with 48-hour deadlines and mandatory resolution proof.",
  },
  {
    number: "06",
    title: "Export stakeholder-ready reports",
    desc: "Generate high-fidelity PDF audit reports with scores, evidence, and corrective action status.",
  },
];

// ─── Comparison Table Data (§8) ───────────────────────────────────────────────
const comparisonRows = [
  {
    capability: "Mandatory photo evidence",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "Optional" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "Enforced per question" },
  },
  {
    capability: "Geo-tagged verification",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "With Flash video" },
  },
  {
    capability: "Auto corrective actions",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "48-hour SLA" },
  },
  {
    capability: "Trend detection & alerts",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "3-audit pattern alerts" },
  },
  {
    capability: "FSSAI-ready templates",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "One-click load" },
  },
  {
    capability: "PDF reports",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "Basic export" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "High-fidelity export" },
  },
];

// ─── Use Cases (8 per user request) ─────────────────────────────────────────
const useCases = [
  {
    icon: UtensilsIcon,
    title: "QSR and restaurant chains",
    desc: "Enforce food safety, hygiene standards, and brand compliance across every outlet. FSSAI-ready templates included.",
  },
  {
    icon: ShoppingBagIcon,
    title: "Retail chains",
    desc: "Standardize store compliance, visual merchandising standards, and operational audits across your entire retail network.",
  },
  {
    icon: BuildingIcon,
    title: "Hotels and hospitality",
    desc: "Maintain guest experience standards, safety compliance, and housekeeping quality across every property.",
  },
  {
    icon: Settings,
    title: "Facility management",
    desc: "Run systematic audits across managed facilities with full evidence trails and automated corrective action workflows.",
  },
  {
    icon: GraduationCap,
    title: "Schools and campuses",
    desc: "Ensure classroom safety, canteen hygiene, and facility standards are met consistently across all campuses.",
  },
  {
    icon: Heart,
    title: "Healthcare clinics",
    desc: "Maintain hygiene protocols and safety compliance across multiple clinic locations without manual oversight.",
  },
  {
    icon: Truck,
    title: "Logistics and warehouses",
    desc: "Audit safety equipment, storage conditions, and operational standards across distribution centres.",
  },
  {
    icon: Coffee,
    title: "Quick service restaurants",
    desc: "Enforce brand standards, food safety, and cleanliness across every franchise location at scale.",
  },
  {
    icon: Wrench,
    title: "Manufacturing and production",
    desc: "Audit safety compliance, equipment checks, and production floor standards across multiple facilities with full evidence trails.",
  },
];

// ─── Technical Features ───────────────────────────────────────────────────────
const techFeatures = [
  { icon: Zap, title: "Fast", desc: "Real-time data across all branches. Instant alerts, live dashboards, and no delays in reporting." },
  { icon: Shield, title: "Secure", desc: "Role-based access ensures everyone sees only what they need. Organisation-level data isolation protects every client." },
  { icon: Smartphone, title: "Any device", desc: "Works on any phone or desktop browser. No app installation required for your field auditors." },
];

export default async function Home() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('audiment_session')?.value;
  const session = sessionCookie ? getSessionFromCookie(`audiment_session=${sessionCookie}`) : null;
  const userRole = session?.role || null;

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <StructuredData />
      {/* Hero + Nav */}
      <HeroSection userRole={userRole} />

      {/* ── Problem Section (§2) ──────────────────────────────────────────── */}
      <section id="problem" className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15] mb-6">
              Why multi-location<br />
              <span className="text-neutral-400">audits break down</span>
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed">
              When you ran one location, you saw everything. Now you have 5, 20, or 50 – and you rely on managers to tell you the truth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPinIcon,
                title: "You can't be at every branch",
                desc: "With multiple outlets, you rely on managers to report accurately. But without a system, you only hear what they want you to hear.",
              },
              {
                icon: FileText,
                title: "Checklists that nobody reviews",
                desc: "Checklists get lost, forgotten, or filled in after the fact. There is no way to know if an audit actually happened.",
              },
              {
                icon: Shield,
                title: "No accountability trail",
                desc: "When something goes wrong, there is no record of who checked what, when, and what was done about it.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors duration-300"              >
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
              Audiment gives you<br />
              <span className="text-neutral-400">ground truth.</span>
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Live photos, GPS location, and server-verified timestamps on every audit. Nothing can be faked – every failure becomes a task that must be closed with proof.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CameraIcon,
                title: "Evidence-based audits",
                desc: 'Photos, videos, and notes attached to every question. No more "trust me, it looked fine."',
              },
              {
                icon: MapPinIcon,
                title: "Location-verified",
                desc: "GPS confirms the auditor was physically at the branch. Not in their living room.",
              },
              {
                icon: RefreshCw,
                title: "Failures become tasks",
                desc: "Every failed item creates a corrective action. Managers must fix it and upload proof. Admins verify before closing.",
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

      {/* ── How It Works Section (§3 – 7 steps) ──────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-neutral-50 px-6 border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              From blueprint to resolution –<br />
              <span className="text-neutral-400">the full audit lifecycle</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-8 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-200/30 transition-all duration-300 group ${i === 6 ? "md:col-span-2 lg:col-span-3 xl:col-span-1" : ""}`}
              >
                <span className="text-5xl font-bold text-neutral-100 group-hover:text-neutral-200 transition-colors duration-300 tracking-tighter block mb-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role-Based Architecture Section (§6) ──────────────────────────── */}
      <section className="py-24 md:pt-32 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              One platform,<br />
              <span className="text-neutral-400">three powerful interfaces</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Crown,
                role: "Admin",
                subtitle: "Owner / head office",
                color: "bg-neutral-900",
                items: [
                  "Full visibility across all locations",
                  "Create and manage audit blueprints with scoring logic",
                  "Add users, manage branches and team assignments",
                  "View trend reports and comparative location performance",
                  "Approve or reject corrective action resolutions",
                ],
              },
              {
                icon: Users,
                role: "Manager",
                subtitle: "Branch / regional level",
                color: "bg-neutral-700",
                items: [
                  "Receives published audits and assigns them to auditors",
                  "Responsible for fixing failed items with photo proof",
                  "Tracks auditor progress and scores for their locations",
                  "Resolves corrective actions within the 48-hour SLA",
                ],
              },
              {
                icon: ClipboardList,
                role: "Auditor",
                subtitle: "Field level",
                color: "bg-neutral-500",
                items: [
                  "Mobile-first interface, one question at a time",
                  "Captures mandatory photos, videos, GPS, and notes",
                  "Flash Verification for identity and location proof",
                  "Works fully offline – syncs automatically when back online",
                ],
              },
            ].map((role, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:shadow-neutral-200/30 transition-all duration-300"
              >
                <div className={`${role.color} p-8`}>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{role.role}</h3>
                  <p className="text-white/60 text-sm mt-1">{role.subtitle}</p>
                </div>
                <div className="bg-white p-8">
                  <ul className="space-y-3">
                    {role.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-neutral-600 text-base leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Features Section (§4) ─────────────────────────────────────── */}
      <StickyFeatureSection />

      {/* ── Industry Use Cases Section (§5 – 6 cards) ────────────────────── */}
      <section id="use-cases" className="py-24 md:py-32 bg-neutral-50 px-6 border-y border-neutral-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Built for every<br />
              <span className="text-neutral-400">multi-location operation</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-200/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <uc.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">{uc.title}</h3>
                </div>
                <p className="text-neutral-500 leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table (§8) ─────────────────────────────────────────── */}
      <section id="comparison" className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Audiment vs.<br />
              <span className="text-neutral-400">the old way</span>
            </h2>
            <p className="text-lg text-neutral-400">
              See exactly what you gain by moving from paper, WhatsApp, and spreadsheets to a platform built for verified compliance.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] bg-white/5 border-b border-white/10">
              <div className="px-6 py-4 text-sm font-semibold text-neutral-400 tracking-widest">Capability</div>
              <div className="px-6 py-4 text-sm font-semibold text-neutral-400 tracking-widest border-l border-white/10 text-center">Paper / Excel</div>
              <div className="px-6 py-4 text-sm font-semibold text-neutral-400 tracking-widest border-l border-white/10 text-center">Generic Tools</div>
              <div className="px-6 py-4 text-sm font-semibold text-emerald-400 tracking-widest border-l border-white/10 text-center">Audiment</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[2fr_1fr_1fr_1.5fr] border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-200 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
              >
                <div className="px-6 py-5 text-base text-neutral-300 leading-relaxed font-medium">{row.capability}</div>
                <div className="px-6 py-5 text-sm text-neutral-400 border-l border-white/5 text-center">
                  <span className="block mb-1">{row.paper.icon}</span>
                  <span className="text-sm">{row.paper.label}</span>
                </div>
                <div className="px-6 py-5 text-sm text-neutral-400 border-l border-white/5 text-center">
                  <span className="block mb-1">{row.generic.icon}</span>
                  <span className="text-sm">{row.generic.label}</span>
                </div>
                <div className="px-6 py-5 text-sm text-emerald-400 border-l border-white/5 text-center font-semibold">
                  <span className="block mb-1">{row.audiment.icon}</span>
                  <span className="text-sm">{row.audiment.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance / Archive Section (Hidden per §7) ──────────────────── */}
      <section className="hidden py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-8">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-8">
            Every audit is permanently<br />
            <span className="text-neutral-400">stored and searchable.</span>
          </h2>
          <p className="text-xl text-neutral-500 leading-relaxed max-w-3xl mx-auto mb-8">
            Need to pull up inspection records for an FSSAI audit? An ISO review? A franchise compliance check? Every completed audit – with all photos, videos, scores, timestamps, GPS data, and corrective action history – lives in a searchable archive.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
            {["Nothing is deleted.", "Nothing is editable after submission.", "Fully searchable archive."].map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-neutral-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical Summary Section ─────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50 border-b border-neutral-200/60 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Designed for the field<br />
              <span className="text-neutral-400">Ready on day one.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: "No app download",
                desc: "Field auditors open a browser link and they're in. No app store approvals, no device management, no IT setup – works on any phone.",
              },
              {
                icon: Wifi,
                title: "Works offline too",
                desc: "Auditors can complete inspections in low-connectivity environments. Progress saves locally and syncs automatically when back online.",
              },
              {
                icon: Shield,
                title: "Your data stays yours",
                desc: "Organisation-level data isolation enforced at the database layer. Each client's data is fully separated – no cross-tenant access, ever.",
              },
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-200/30 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-4 text-neutral-900">
                  <tech.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">{tech.title}</h4>
                <p className="text-base text-neutral-500 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof Section (§7) ──────────────────────────────────────── */}
      <section className="py-24 border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-4">
              Why operations leaders<br />
              <span className="text-neutral-400">choose Audiment</span>
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">Real numbers from live deployments across multi-location businesses.</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200/60 pb-4">
            {[
              { value: "1,240+", label: "Audits completed on the platform" },
              { value: "860+", label: "Corrective actions resolved with proof" },
              { value: "70+", label: "Locations managed across industries" },
              { value: "3.2h", label: "Avg. time from failure to resolution" },
            ].map((stat) => (
              <div key={stat.label} className="pt-8 md:pt-0 flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-semibold tracking-tighter text-neutral-900 mb-3">
                  {stat.value}
                </div>
                <p className="text-neutral-500 font-medium text-base text-balance max-w-[160px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated Testimonial Columns (§7) ─────────────────────────────── */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* ── Case Study Snapshots ───────────────────────────────────────────── */}
      <section className="py-16 border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                industry: "QSR chain",
                metric: "60%",
                metricLabel: "reduction in corrective action close time",
                story: "A 30-outlet QSR brand replaced weekly paper audits with Audiment. Within 8 weeks, average issue resolution time dropped from 5 days to 48 hours. Critical failures now trigger instant manager alerts.",
              },
              {
                industry: "Retail chain",
                metric: "4×",
                metricLabel: "increase in audit completion rate",
                story: "A fashion retailer with 45 stores went from completing 25% of planned audits (paper) to 100% digital completion. Managers no longer have missing reports to hide behind.",
              },
              {
                industry: "Hotel group",
                metric: "0",
                metricLabel: "failed FSSAI inspections since deployment",
                story: "A hotel group used Audiment's FSSAI-ready templates to build a daily compliance routine. Twelve months later, every property passed its regulatory inspection on the first attempt.",
              },
            ].map((cs, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors duration-300"
              >
                <span className="text-sm font-semibold tracking-widest text-neutral-400 block mb-4">{cs.industry}</span>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white tracking-tighter">{cs.metric}</span>
                  <p className="text-neutral-400 text-sm mt-1">{cs.metricLabel}</p>
                </div>
                <p className="text-base text-neutral-300 leading-relaxed">{cs.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section (§9 – 10 Q&As) ───────────────────────────────────── */}
      <section id="faq" className="py-24 md:py-32 bg-neutral-50 px-6 border-b border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Frequently asked questions
            </h2>
            <p className="text-lg text-neutral-500">Everything you need to know before getting started.</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ── Final CTA Section (§10) ───────────────────────────────────────── */}
      <section id="final-cta" className="relative overflow-hidden py-32 md:py-48 px-6 bg-neutral-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
            Stop auditing on paper.{" "}
            <span className="text-neutral-400">Start auditing with proof.</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Set up your first audit template in minutes. Know exactly what&apos;s happening at every branch – with tamper-proof evidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            {userRole ? (
                <Link
                  href={
                      userRole === 'admin' ? '/dashboard/admin' :
                      userRole === 'manager' ? '/dashboard/manager' :
                      userRole === 'auditor' ? '/dashboard/auditor' : '/login'
                  }
                  className="inline-flex h-14 items-center gap-2 px-10 bg-white hover:bg-neutral-100 text-neutral-900 text-base font-semibold rounded-full transition-all hover:scale-[1.02] shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                >
                  Go to app
                  <ArrowRight className="w-5 h-5" />
                </Link>
            ) : (
                <Link
                  href="#contact"
                  className="inline-flex h-14 items-center gap-2 px-10 bg-white hover:bg-neutral-100 text-neutral-900 text-base font-semibold rounded-full transition-all hover:scale-[1.02] shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                >
                  Book a Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
            )}
            <Link
              href="#contact"
              className="inline-flex h-14 items-center gap-2 px-10 border border-white/20 hover:border-white/40 text-white text-base font-medium rounded-full transition-all duration-300"
            >
              See It In Action
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-500 font-medium pt-2">
            <CheckCircle2 className="w-5 h-5 text-neutral-600" />
            <span>Setup takes less than 10 minutes</span>
          </div>
        </div>
      </section>

      {/* Contact Section (§2) */}
      <ContactSection />

      {/* Footer */}
      <Footer
        brandName="Audiment"
        socialLinks={[]}
        navLinks={[
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#how-it-works" },
          { label: "Use cases", href: "#use-cases" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "#contact" },
          { label: "Privacy policy", href: "#" },
          { label: "Terms of service", href: "#" },
        ]}
      />
    </div>
  );
}