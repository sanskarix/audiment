import React from "react";
import Script from "next/script";
import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSessionFromCookie } from "@/lib/auth";
import {
  ArrowRight, CheckCircle2, Globe2, Shield, Zap, RefreshCw, Crown, Users, ClipboardList,
  Lock, Database, Smartphone, Wifi, Building2, UtensilsCrossed,
  Check, X, AlertTriangle, MapPin as MapPinIcon, FileText, UserCheck, Camera as CameraIcon, Wrench, FileBarChart, UtensilsCrossed as UtensilsIcon, ShoppingBag as ShoppingBagIcon, Building2 as BuildingIcon, Settings, Heart, Truck, FileCheck2
} from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-3";
import { Footer } from "@/components/ui/modem-animated-footer";
import { StickyFeatureSection } from "@/components/ui/sticky-scroll-cards-section";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import { ContactSection } from "@/components/ui/contact-section";

export const metadata: Metadata = {
  title: 'Audit and Inspection Software for Multi-Location Businesses | Audiment',
  description: 'Audiment is audit and inspection software for multi-location businesses. Maintain quality consistency across locations through proof-based audits, issue tracking, corrective actions, and accountability systems.',
  keywords: ['audit and inspection software', 'multi-location audit software', 'proof-based audits', 'quality consistency', 'operational consistency', 'corrective action tracking', 'FSSAI audit software', 'field audit app India'],
  alternates: { canonical: 'https://audiment.in' },
  openGraph: {
    title: 'Audit and Inspection Software for Multi-Location Businesses | Audiment',
    description: 'Audiment is audit and inspection software for multi-location businesses. Stay on top of quality and consistency across locations through proof-based audits, issue tracking, and corrective actions.',
    url: 'https://audiment.in',
    siteName: 'Audiment',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audit and Inspection Software for Multi-Location Businesses | Audiment',
    description: 'Audiment is audit and inspection software for multi-location businesses. Stay on top of quality and consistency across locations through proof-based audits, issue tracking, and corrective actions.',
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
        "description": "Audiment is audit and inspection software for multi-location businesses. Proof-based audits, issue tracking, corrective actions, and accountability systems help businesses maintain quality consistency and stay on top of operations across every location.",
        "keywords": "multi-location audit software, inspection software, proof-based audits, quality consistency, operational consistency, corrective action tracking"
      },
      {
        "@type": "WebSite",
        "name": "Audiment",
        "url": "https://audiment.in",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://audiment.in/blog?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "Audiment",
        "url": "https://audiment.in",
        "logo": "https://audiment.in/icon.svg",
        "description": "Audiment is audit and inspection software for multi-location businesses.",
        "sameAs": [
          "https://www.linkedin.com/company/audiment"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is audit management software?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Software for creating, running, and tracking audits across locations. It replaces paper checklists with digital workflows that collect evidence, score results, trigger follow-up tasks, and generate reports."
            }
          },
          {
            "@type": "Question",
            "name": "Do my auditors need to download an app?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Audiment runs in the browser. Open the link, log in, start auditing. Works on any phone."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if the auditor doesn't have internet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Audits continue offline and sync automatically once the device reconnects."
            }
          },
          {
            "@type": "Question",
            "name": "Can managers see surprise audits before the auditor arrives?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Surprise audits stay hidden on the manager's dashboard until the auditor begins the inspection."
            }
          },
          {
            "@type": "Question",
            "name": "How does Audiment verify that the auditor was on-site?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A short geo-tagged video and selfie are captured at the location. If the auditor is outside the registered location's GPS range, the system flags it."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customise the audit templates?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Build templates from scratch – set your own questions, severity levels, photo requirements, and recurrence schedules."
            }
          },
          {
            "@type": "Question",
            "name": "Does Audiment support FSSAI compliance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Pre-built FSSAI templates can be loaded instantly. All records – photos, GPS data, timestamps, corrective action history – are stored for regulatory review."
            }
          },
          {
            "@type": "Question",
            "name": "How is Audiment different from iAuditor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Audiment is built specifically for multi-location operations where accountability matters. Photo evidence is required (not optional), auditor presence is verified, corrective actions auto-generate with deadlines, and the system flags declining trends across locations."
            }
          },
          {
            "@type": "Question",
            "name": "Who can see what?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Admins see all locations. Managers see only their assigned branches. Auditors see only their assigned audits. Access is enforced at the server level."
            }
          },
          {
            "@type": "Question",
            "name": "What happens when an audit score is low?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Critical failures create corrective action tasks immediately. If a location's score drops across consecutive audits, alerts escalate to regional management and then leadership."
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
    title: "Audit scheduled & assigned",
    desc: "HQ automatically deploys a new FSSAI or operational checklist. Branch managers are instantly notified.",
  },
  {
    number: "02",
    title: "Audit executed on-site",
    desc: "Field managers walk the floor, completing the audit on mobile with offline-first support.",
  },
  {
    number: "03",
    title: "Evidence captured & verified",
    desc: "Critical questions require photo evidence taken on-site. The evidence is geo-tagged and timestamped automatically.",
  },
  {
    number: "04",
    title: "Issues detected instantly",
    desc: "When a standard fails–like a missed temp log–the system flags it immediately.",
  },
  {
    number: "05",
    title: "Corrective action generated",
    desc: "An SLA-bound task is automatically created and assigned to the branch manager for resolution.",
  },
  {
    number: "06",
    title: "Resolution & leadership visibility",
    desc: "Manager uploads proof of the fix. HQ sees the exact trend and resolution time across the region.",
  },
];

// ─── Comparison Table Data (§8) ───────────────────────────────────────────────
const comparisonRows = [
  {
    capability: "Mandatory photo evidence",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />, label: "Optional" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "Required per question" },
  },
  {
    capability: "Geo-tagged verification",
    paper: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    generic: { icon: <X className="w-4 h-4 text-red-400 mx-auto" />, label: "None" },
    audiment: { icon: <Check className="w-4 h-4 text-green-500 mx-auto" />, label: "GPS-verified" },
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
    desc: "Run daily hygiene audits, track temperature compliance, and ensure every outlet maintains the same brand standard – whether it's location 5 or location 50.",
  },
  {
    icon: ShoppingBagIcon,
    title: "Retail chains",
    desc: "Verify that visual merchandising, promotional displays, and store presentation match corporate guidelines across every location. Area managers see which stores are falling behind.",
  },
  {
    icon: BuildingIcon,
    title: "Hotels and hospitality",
    desc: "Standardize housekeeping, F&B safety, and guest experience checks across properties. When a room inspection finds a maintenance issue, the task goes to engineering automatically.",
  },
  {
    icon: Settings,
    title: "Facility management",
    desc: "Run systematic audits across managed facilities with photo evidence trails. Track maintenance issues from discovery to resolution with clear accountability.",
  },
  {
    icon: Heart,
    title: "Healthcare clinics",
    desc: "Maintain hygiene protocols and infection control standards across multiple clinic locations. Digital records provide inspection-ready documentation.",
  },
  {
    icon: Truck,
    title: "Logistics and warehouses",
    desc: "Audit safety equipment, storage conditions, and dock compliance across distribution centres. Track corrective actions for hazards with strict resolution deadlines.",
  },
  {
    icon: Wrench,
    title: "Manufacturing and production",
    desc: "Digitize safety walks, equipment checks, and quality control inspections across facilities. Shift handovers include verified evidence of the outgoing shift's compliance status.",
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
    <main id="main-content" className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
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
                title: "WhatsApp reporting chaos",
                desc: "Photos scattered across group chats, impossible to track, and instantly lost. No way to verify when or where the photo was actually taken.",
              },
              {
                icon: FileText,
                title: "Inconsistent manager reporting",
                desc: "Area managers develop blind spots – scoring locations generously or skipping over real problems. Corporate finds out through customer complaints, not through internal data.",
              },
              {
                icon: Shield,
                title: "Unresolved corrective actions",
                desc: "Finding the issue is step one. Without a system to track the fix, critical failures are forgotten by the next shift.",
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

      {/* ── Concept Chain Section ──────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-950 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {[
              { label: "Proof-based audits", sub: "Reliable operational inputs" },
              { label: "Operational patterns", sub: "Issues identified earlier" },
              { label: "Corrective actions", sub: "Accountability enforced" },
              { label: "Operational control", sub: "Consistency across locations" },
            ].map((item, i, arr) => (
              <>
                <div key={i} className="flex flex-col items-center text-center px-6 py-4">
                  <span className="text-white font-semibold text-base">{item.label}</span>
                  <span className="text-neutral-500 text-sm mt-1">{item.sub}</span>
                </div>
                {i < arr.length - 1 && (
                  <span key={`arrow-${i}`} className="text-neutral-600 text-2xl hidden md:block select-none">→</span>
                )}
              </>
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
              <span className="text-neutral-400">operational clarity.</span>
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Know what's actually happening at every branch. When an audit uncovers an issue, it becomes a tracked task that must be resolved with evidence – not just marked as done.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CameraIcon,
                title: "Execution consistency",
                desc: 'Standardize operations across 5 or 500 branches. When your opening checklist is the same everywhere, quality stops depending on which manager is on shift.',
              },
              {
                icon: MapPinIcon,
                title: "Branch-level visibility",
                desc: "See which locations are consistently underperforming and where issues keep recurring – without waiting for the monthly area visit.",
              },
              {
                icon: RefreshCw,
                title: "Issue resolution, not just detection",
                desc: "Finding a problem is step one. Audiment tracks the fix – who resolved it, when, and with what evidence – so issues don't just get logged and forgotten.",
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
                role: "Leadership",
                subtitle: "Corporate / Executive",
                color: "bg-neutral-900",
                items: [
                  "Cross-location trend tracking and risk visibility",
                  "Standardize operational blueprints network-wide",
                  "Identify systemic bottlenecks and repeat failures",
                ],
              },
              {
                icon: Users,
                role: "Branch Managers",
                subtitle: "Multi-Unit Leaders",
                color: "bg-neutral-700",
                items: [
                  "Monitor branch-level execution across their territory",
                  "Review and approve corrective action resolutions",
                  "Track compliance scores and auditor performance",
                ],
              },
              {
                icon: ClipboardList,
                role: "Auditors",
                subtitle: "Field Execution",
                color: "bg-neutral-500",
                items: [
                  "Execute daily/weekly audits with mandatory evidence",
                  "Receive automated corrective action tasks",
                  "Fix issues and submit photo proof before the SLA expires",
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

      {/* ── Operational Failures Section (§5) ─────────────────────────────── */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              The problems Audiment<br />
              <span className="text-neutral-400">is built to solve</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Temperature logs skipped during the morning rush",
              "Opening checklists ignored until the end of the day",
              "Critical SOP violations in food prep areas",
              "Repeat hygiene failures across specific regions",
              "Corrective actions marked as 'done' without actual fixes",
              "Outdated promotional materials left on the floor"
            ].map((failure, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-xl bg-neutral-50 border border-neutral-100">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <span className="text-lg text-neutral-700 font-medium">{failure}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              What changes when you<br />
              <span className="text-neutral-400">digitize your audits</span>
            </h2>
            <p className="text-lg text-neutral-400">
              The difference between paper-based reporting and structured operational audits – across the capabilities that matter most.
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
                desc: "Audits continue offline and sync automatically once the device reconnects.",
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
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">From restaurant chains and retail brands to hotel groups and franchise networks.</p>
          </div>
        </div>
      </section>

      {/* ── Animated Testimonial Columns (§7) ─────────────────────────────── */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* ── Operational Scenarios ───────────────────────────────────────────── */}
      <section className="py-16 border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                industry: "QSR chain – 30 outlets",
                headline: "From 5-day fixes to same-day resolution",
                story: "Before Audiment, corrective actions were tracked in WhatsApp groups and weekly reports. Most issues took 3–5 days to resolve because nobody had clear ownership. After switching to auto-assigned tasks with SLA deadlines, critical issues now get resolved within 48 hours.",
              },
              {
                industry: "Retail chain – 45 stores",
                headline: "Planned audits actually getting completed",
                story: "Paper-based audits were routinely skipped or backdated. With digital scheduling and photo evidence, area managers can see exactly which stores have completed their checks – and which haven't. Audit completion went from inconsistent to reliable.",
              },
              {
                industry: "Hotel group – 6 properties",
                headline: "Inspection-ready compliance, every day",
                story: "Daily FSSAI-mapped checklists replaced the old monthly paper audit. When a health inspector visited, the operations team pulled up 90 days of timestamped, photo-backed records in under a minute. No scrambling, no missing documentation.",
              },
            ].map((cs, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors duration-300"
              >
                <span className="text-sm font-semibold tracking-widest text-neutral-400 block mb-4">{cs.industry}</span>
                <h3 className="text-xl font-semibold text-white mb-4">{cs.headline}</h3>
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
            Ready to see what&apos;s actually{" "}
            <span className="text-neutral-400">happening at your branches?</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Walk through a live demo with our team. We&apos;ll map your current audit workflow and show you where Audiment fits.
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
                Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="#contact"
                className="inline-flex h-14 items-center gap-2 px-10 bg-white hover:bg-neutral-100 text-neutral-900 text-base font-semibold rounded-full transition-all hover:scale-[1.02] shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
              >
                Book a Demo
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
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Cookie policy", href: "/cookie-policy" },
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />
    </main>
  );
}
