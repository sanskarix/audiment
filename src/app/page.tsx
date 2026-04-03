import React from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Globe2, Shield, Zap,
  Camera, MapPin, RefreshCw, Crown, Users, ClipboardList,
  Utensils, ShoppingBag, Hotel, Warehouse,
  Lock, Database, Smartphone, Wifi, Building2, UtensilsCrossed
} from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-3";
import { Footer } from "@/components/ui/modem-animated-footer";
import { StickyFeatureSection } from "@/components/ui/sticky-scroll-cards-section";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";

// ─── How It Works Steps (7 steps per guidelines §3) ───────────────────────────
const steps = [
  {
    number: "01",
    title: "Create Audit Blueprints",
    desc: "Build templates with custom questions, severity levels (Low / Medium / Critical), weighted scoring, and mandatory photo or video requirements per question.",
  },
  {
    number: "02",
    title: "Define Locations & Assign Managers",
    desc: "Register each branch with GPS coordinates. Assign managers so they only see audits relevant to their locations.",
  },
  {
    number: "03",
    title: "Schedule or Publish",
    desc: "Set recurring schedules or push a surprise audit — invisible to managers until the auditor is at the door.",
  },
  {
    number: "04",
    title: "Auditors Execute with Evidence",
    desc: "One question at a time on mobile. Live photos, videos, and GPS captured and locked on submission. Works fully offline.",
  },
  {
    number: "05",
    title: "System Auto-Scores & Alerts",
    desc: "Weighted scores calculated instantly. Critical failures escalate automatically. GPS mismatches flagged without manual review.",
  },
  {
    number: "06",
    title: "Managers Resolve with Proof",
    desc: "Managers upload \"after\" photos as corrective action proof. Admins review before and after. Nothing is closed without verification.",
  },
  {
    number: "07",
    title: "Export PDF Reports",
    desc: "One-click PDF with all responses, photos, scores, GPS, and corrective action history — ready for FSSAI or franchise compliance reviews.",
  },
];

// ─── Comparison Table Data (§8) ───────────────────────────────────────────────
const comparisonRows = [
  {
    capability: "Mandatory photo evidence",
    paper: { icon: "❌", label: "None" },
    generic: { icon: "⚠️", label: "Optional" },
    audiment: { icon: "✅", label: "Enforced per question" },
  },
  {
    capability: "Geo-tagged verification",
    paper: { icon: "❌", label: "None" },
    generic: { icon: "❌", label: "None" },
    audiment: { icon: "✅", label: "With Flash video" },
  },
  {
    capability: "Auto corrective actions",
    paper: { icon: "❌", label: "None" },
    generic: { icon: "❌", label: "None" },
    audiment: { icon: "✅", label: "48-hour SLA" },
  },
  {
    capability: "Trend detection & alerts",
    paper: { icon: "❌", label: "None" },
    generic: { icon: "❌", label: "None" },
    audiment: { icon: "✅", label: "3-audit pattern alerts" },
  },
  {
    capability: "FSSAI-ready templates",
    paper: { icon: "❌", label: "None" },
    generic: { icon: "❌", label: "None" },
    audiment: { icon: "✅", label: "One-click load" },
  },
  {
    capability: "PDF reports",
    paper: { icon: "❌", label: "None" },
    generic: { icon: "⚠️", label: "Basic export" },
    audiment: { icon: "✅", label: "High-fidelity export" },
  },
];

// ─── Use Cases (6 per guidelines §5) ─────────────────────────────────────────
const useCases = [
  {
    icon: Utensils,
    title: "QSR & Restaurant Chains",
    desc: "Run daily pre-opening audits across every outlet. Freezer temperature failures trigger immediate alerts — not end-of-week reports.",
    checks: "Kitchen hygiene, food storage temperatures, staff grooming, equipment status, FSSAI compliance.",
  },
  {
    icon: ShoppingBag,
    title: "Retail & Grocery Chains",
    desc: "Verify nationwide branding consistency with photo evidence. Any store that breaks the standard gets an auto-assigned corrective action.",
    checks: "Store layout, branding consistency, inventory presentation, staff uniform, signage compliance.",
  },
  {
    icon: Hotel,
    title: "Hotels & Hospitality",
    desc: "Housekeeping, lobby standards, and room readiness checked with GPS-verified photo evidence. Surprise audits show the real picture.",
    checks: "Room cleanliness, amenity restocking, common area maintenance, safety equipment, guest-facing standards.",
  },
  {
    icon: Warehouse,
    title: "Manufacturing & Warehousing",
    desc: "Safety checks, fire exit clearance, and pest control on recurring schedules. Critical failures escalate instantly — not the next audit cycle.",
    checks: "Fire safety, pest control, equipment maintenance, PPE compliance, loading dock organisation.",
  },
  {
    icon: Building2,
    title: "Franchise Operations",
    desc: "Enforce brand standards across every franchisee from a single dashboard. See exactly which locations are compliant and which aren't.",
    checks: "Brand standard compliance, operational consistency, franchisee accountability, multi-location benchmarking.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & Beverage (FSSAI)",
    desc: "Load FSSAI-ready templates with one click. Every inspection produces a GPS-tagged, timestamped record that satisfies regulatory requirements.",
    checks: "FSSAI compliance, food storage, hygiene standards, pest control records, staff food handler certifications.",
  },
];

// ─── Technical Features ───────────────────────────────────────────────────────
const techFeatures = [
  { icon: Smartphone, title: "Mobile-optimised web app", desc: "No app store download needed. Works on any phone browser. PWA-ready." },
  { icon: Zap, title: "Real-time sync", desc: "Data updates instantly across all dashboards." },
  { icon: Shield, title: "Role-based access control", desc: "Auditors only see their assigned audits. Managers only see their locations. Admins see everything." },
  { icon: Wifi, title: "Offline capable", desc: "Audits sync automatically when connectivity is restored." },
  { icon: Lock, title: "Secure by design", desc: "Server-side security rules. No client-side data manipulation possible." },
];

const problemCards = [
  {
    number: "01",
    title: "Paper checklists that nobody reviews",
    desc: "Easy to fake, impossible to verify. No photos, no proof, no follow-up.",
  },
  {
    number: "02",
    title: "No proof the auditor was actually there",
    desc: "Without GPS verification and live evidence, you're auditing on trust.",
  },
  {
    number: "03",
    title: "Corrective actions lost in email threads",
    desc: "A failure gets noted. An email is sent. The same issue appears next audit.",
  },
  {
    number: "04",
    title: "No visibility into patterns across locations",
    desc: "A branch declining over 5 audits is a systemic problem. You'd never see it in a spreadsheet.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Hero + Nav */}
      <HeroSection />

      {/* ── Problem Section (§2) ──────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15] mb-6">
              Why Multi-Location<br />
              <span className="text-neutral-400">Audits Break Down</span>
            </h2>
            <p className="text-xl text-neutral-400 leading-relaxed">
              When you ran one location, you saw everything. Now you have 5, 20, or 50 – and you rely on managers to tell you the truth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {problemCards.map((card, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden group"
              >
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                <span className="text-xs font-semibold tracking-[0.15em] text-red-500/60 mb-5 block">{card.number}</span>
                <h3 className="text-[17px] font-semibold text-white mb-3 leading-snug">{card.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-[15px]">{card.desc}</p>
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
            <p className="text-xl text-neutral-500 leading-relaxed">
              Live photos, GPS location, and server-verified timestamps on every audit. Nothing can be faked — every failure becomes a task that must be closed with proof.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                icon: Camera,
                title: "Evidence-based audits",
                desc: 'Photos, videos, and notes attached to every question. No more "trust me, it looked fine."',
              },
              {
                icon: MapPin,
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
                className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                  <pillar.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[18px] font-semibold text-neutral-900 mb-3">{pillar.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-[15px]">{pillar.desc}</p>
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
              From Blueprint to Resolution –<br />
              <span className="text-neutral-400">The Full Audit Lifecycle</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-8 border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group ${i === 6 ? "md:col-span-2 lg:col-span-3 xl:col-span-1" : ""}`}
              >
                <span className="text-[3.5rem] font-bold text-neutral-100 group-hover:text-neutral-150 transition-colors duration-300 tracking-tighter block mb-4 leading-none tabular-nums">
                  {step.number}
                </span>
                <h3 className="text-[17px] font-semibold text-neutral-900 mb-3 leading-snug">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-[15px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role-Based Architecture Section (§6) ──────────────────────────── */}
      <section className="py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              One Platform,<br />
              <span className="text-neutral-400">Three Powerful Interfaces</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Crown,
                role: "Admin",
                subtitle: "Owner / Head Office",
                gradient: "bg-gradient-to-br from-neutral-900 to-neutral-800",
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
                subtitle: "Branch / Regional Level",
                gradient: "bg-gradient-to-br from-neutral-700 to-neutral-600",
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
                subtitle: "Field Level",
                gradient: "bg-gradient-to-br from-neutral-500 to-neutral-400",
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
                className="rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className={`${role.gradient} p-8`}>
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <role.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{role.role}</h3>
                  <p className="text-white/55 text-sm mt-1">{role.subtitle}</p>
                </div>
                <div className="bg-white p-8">
                  <ul className="space-y-3">
                    {role.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-neutral-600 text-[15px] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-0.5" />
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
              Built for Every<br />
              <span className="text-neutral-400">Multi-Location Operation</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                    <uc.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-neutral-900 leading-snug">{uc.title}</h3>
                </div>
                <p className="text-neutral-500 leading-relaxed mb-6 text-[15px]">{uc.desc}</p>
                <div className="pt-5 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-neutral-400 block mb-2">Key Checks</span>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">{uc.checks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table (§8) ─────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Audiment vs.<br />
              <span className="text-neutral-400">The Old Way</span>
            </h2>
            <p className="text-lg text-neutral-400">
              See exactly what you gain by moving from paper, WhatsApp, and spreadsheets to a platform built for verified compliance.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] border-b border-white/10">
              <div className="px-6 py-4 text-[11px] font-semibold text-neutral-500 tracking-[0.12em] uppercase">Capability</div>
              <div className="px-6 py-4 text-[11px] font-semibold text-neutral-500 tracking-[0.12em] uppercase border-l border-white/10 text-center">Paper / Excel</div>
              <div className="px-6 py-4 text-[11px] font-semibold text-neutral-500 tracking-[0.12em] uppercase border-l border-white/10 text-center">Generic Tools</div>
              <div className="px-6 py-4 text-[11px] font-semibold text-emerald-400 tracking-[0.12em] uppercase border-l border-white/10 text-center bg-emerald-500/[0.05]">Audiment</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[2fr_1fr_1fr_1.5fr] border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors duration-200 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
              >
                <div className="px-6 py-5 text-[15px] text-neutral-300 leading-relaxed font-medium">{row.capability}</div>
                <div className="px-6 py-5 text-sm text-neutral-400 border-l border-white/5 text-center">
                  <span className="block text-lg mb-1">{row.paper.icon}</span>
                  <span className="text-[13px]">{row.paper.label}</span>
                </div>
                <div className="px-6 py-5 text-sm text-neutral-400 border-l border-white/5 text-center">
                  <span className="block text-lg mb-1">{row.generic.icon}</span>
                  <span className="text-[13px]">{row.generic.label}</span>
                </div>
                <div className="px-6 py-5 text-sm text-emerald-400 border-l border-white/5 text-center font-semibold bg-emerald-500/[0.03]">
                  <span className="block text-lg mb-1">{row.audiment.icon}</span>
                  <span className="text-[13px]">{row.audiment.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance / Archive Section ──────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-8 shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
            <Database className="w-7 h-7 text-white" />
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
              <div key={i} className="flex items-center gap-2 text-neutral-600 font-medium text-[15px]">
                <CheckCircle2 className="w-4 h-4 text-neutral-400 flex-shrink-0" />
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
              Fast. Secure.<br />
              <span className="text-neutral-400">Works on any device.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {techFeatures.map((tech, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                  <tech.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[15px] font-semibold text-neutral-900 mb-2 leading-snug">{tech.title}</h4>
                <p className="text-[14px] text-neutral-500 leading-relaxed">{tech.desc}</p>
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
              Why Operations Leaders<br />
              <span className="text-neutral-400">Choose Audiment</span>
            </h2>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto">Real numbers from live deployments across multi-location businesses.</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100 pb-4">
            {[
              { value: "1,240+", label: "Audits Completed on the Platform" },
              { value: "860+", label: "Corrective Actions Resolved with Proof" },
              { value: "70+", label: "Locations Managed Across Industries" },
              { value: "3.2h", label: "Avg. Time from Failure to Resolution" },
            ].map((stat) => (
              <div key={stat.label} className="pt-8 md:pt-0 flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-semibold tracking-tighter text-neutral-900 mb-3 tabular-nums">
                  {stat.value}
                </div>
                <p className="text-neutral-400 font-medium text-[14px] text-balance max-w-[160px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated Testimonial Columns (§7) ─────────────────────────────── */}
      <TestimonialsSection />

      {/* ── Case Study Snapshots ───────────────────────────────────────────── */}
      <section className="py-16 border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                industry: "QSR Chain",
                metric: "60%",
                metricLabel: "reduction in corrective action close time",
                story: "A 30-outlet QSR brand replaced weekly paper audits with Audiment. Within 8 weeks, average issue resolution time dropped from 5 days to 48 hours. Critical failures now trigger instant manager alerts.",
              },
              {
                industry: "Retail Chain",
                metric: "4×",
                metricLabel: "increase in audit completion rate",
                story: "A fashion retailer with 45 stores went from completing 25% of planned audits (paper) to 100% digital completion. Managers no longer have missing reports to hide behind.",
              },
              {
                industry: "Hotel Group",
                metric: "0",
                metricLabel: "failed FSSAI inspections since deployment",
                story: "A hotel group used Audiment's FSSAI-ready templates to build a daily compliance routine. Twelve months later, every property passed its regulatory inspection on the first attempt.",
              },
            ].map((cs, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-neutral-500 block mb-5">{cs.industry}</span>
                <div className="mb-5">
                  <span className="text-[3.25rem] font-bold text-white tracking-tighter leading-none tabular-nums">{cs.metric}</span>
                  <p className="text-neutral-500 text-[13px] mt-1.5 leading-snug">{cs.metricLabel}</p>
                </div>
                <p className="text-[14px] text-neutral-400 leading-relaxed">{cs.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section (§9 – 10 Q&As) ───────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-neutral-50 px-6 border-b border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-500">Everything you need to know before getting started.</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ── Final CTA Section (§10) ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-neutral-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
            Stop Auditing on Paper.{" "}
            <span className="text-neutral-400">Start Auditing with Proof.</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Set up your first audit template in minutes. Know exactly what&apos;s happening at every branch – with tamper-proof evidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
            <Link
              href="/login"
              className="inline-flex h-14 items-center gap-2 px-10 bg-white hover:bg-neutral-50 text-neutral-900 text-[15px] font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_rgba(255,255,255,0.12)]"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex h-14 items-center gap-2 px-10 border border-white/15 hover:border-white/35 hover:bg-white/5 text-white text-[15px] font-medium rounded-full transition-all duration-300"
            >
              Book a Demo
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-500 font-medium pt-2 text-[14px]">
            <CheckCircle2 className="w-4 h-4 text-neutral-600" />
            <span>No credit card required</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        brandName="Audiment"
        brandDescription="Audit Smarter. Manage Better."
        socialLinks={[
          {
            icon: <Globe2 className="h-5 w-5" />,
            href: "https://audiment.com",
            label: "Website",
          },
        ]}
        navLinks={[
          { label: "Product", href: "#" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ]}
      />
    </div>
  );
}
