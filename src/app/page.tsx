"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Globe2, Shield, Zap, LayoutTemplate,
  Camera, MapPin, RefreshCw, Crown, Users, ClipboardList,
  Utensils, ShoppingBag, Hotel, Warehouse, ChevronDown, ChevronUp,
  Lock, Database, Smartphone, Wifi
} from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-3";
import { Footer } from "@/components/ui/modem-animated-footer";
import { StickyFeatureSection } from "@/components/ui/sticky-scroll-cards-section";

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Do my auditors need to download an app?",
    a: "No. Audiment is a web app optimized for mobile browsers. Open the link, log in, and start auditing. No app store needed.",
  },
  {
    q: "What happens if the auditor doesn't have internet during an audit?",
    a: "They can complete the entire audit offline. All data — including photos and videos — syncs automatically once they're back online.",
  },
  {
    q: "Can managers see surprise audits before the auditor arrives?",
    a: "No. Surprise audits are invisible on the manager's dashboard until the auditor begins the inspection. Managers cannot prepare in advance.",
  },
  {
    q: "How is this different from using Google Forms or a spreadsheet?",
    a: "Google Forms can't verify GPS location, force live photo/video capture, auto-calculate weighted risk scores, trigger corrective actions, or escalate declining trends. Audiment is built specifically for verified, accountable audits across multiple locations.",
  },
  {
    q: "Can I customize the audit templates?",
    a: "Yes. Admins create templates from scratch. Set your own questions, choose severity levels (Low, Medium, Critical), require photos or videos on specific questions, and set recurrence schedules.",
  },
  {
    q: "Who can see what?",
    a: "Admins see all locations and all data. Managers see only their assigned locations. Auditors see only the audits assigned to them. Access is enforced at the server level.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Data is stored in Firebase with server-side security rules. Role-based access is enforced at the database level, not just the UI. No one can access data they're not authorized to see.",
  },
  {
    q: "What industries is this for?",
    a: "Any business operating multiple physical locations where consistent standards matter — restaurants, retail chains, hotels, warehouses, healthcare facilities, franchise operations, facility management companies.",
  },
];

// ─── FAQ Item Component ───────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: open ? "#fafafa" : "#fff" }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-lg font-semibold text-neutral-900">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-neutral-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── How It Works Steps ───────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Create",
    desc: "Admin builds an audit template in the dashboard. Set questions, assign severity levels, add photo/video requirements.",
  },
  {
    number: "02",
    title: "Schedule or Publish",
    desc: "Set it to recur (every Monday at 9 AM) or publish it as a surprise — invisible to managers until the auditor arrives.",
  },
  {
    number: "03",
    title: "Assign",
    desc: "Manager receives the audit and assigns it to an available auditor at the right location.",
  },
  {
    number: "04",
    title: "Audit",
    desc: "Auditor completes the inspection on their phone. One question at a time. Photos, videos, and notes captured in real-time. Works offline too.",
  },
  {
    number: "05",
    title: "Score & Flag",
    desc: "The system calculates a weighted score instantly. Critical failures trigger automatic alerts. No manual review needed to raise a red flag.",
  },
  {
    number: "06",
    title: "Resolve & Archive",
    desc: "Manager fixes the issue, uploads \"after\" photos. Admin compares before vs. after and approves. The audit is permanently stored for compliance records.",
  },
];

// ─── Tamper-Proof Data ────────────────────────────────────────────────────────
const tamperRows = [
  {
    threat: "Auditor fills out the audit from home",
    prevention: "GPS mismatch flag if >50m from registered branch location",
  },
  {
    threat: "Auditor uploads old/staged photos",
    prevention: "Photos and videos must be captured live inside the app. No gallery uploads.",
  },
  {
    threat: "Someone else does the audit (proxy)",
    prevention: "Selfie verification captured alongside Flashmob video recordings",
  },
  {
    threat: "Manager hides problems from owner",
    prevention: "Critical failures auto-escalate. Admin sees everything across all locations.",
  },
  {
    threat: 'Audit gets "forgotten"',
    prevention: "Recurring schedules auto-publish. Delay alerts fire if no auditor is assigned within 2 hours.",
  },
  {
    threat: "Timestamps are manipulated",
    prevention: "Server-side timestamps. Phone clock changes don't affect recorded times.",
  },
  {
    threat: "Corrective actions are ignored",
    prevention: "Open issues remain flagged until resolved with photo proof and admin approval.",
  },
];

// ─── Use Cases ────────────────────────────────────────────────────────────────
const useCases = [
  {
    icon: Utensils,
    title: "Restaurants & Café Chains",
    desc: "A QSR chain with 20 outlets pushes a \"Pre-Opening Audit\" every morning at 8 AM. The manager confirms all equipment is on and staff is present within 30 minutes. Auditors perform freezer temperature checks — anything above 4°C triggers an immediate maintenance alert.",
    checks: "Kitchen hygiene, food storage temperatures, staff grooming, equipment status, FSSAI compliance.",
  },
  {
    icon: ShoppingBag,
    title: "Retail Chains",
    desc: 'A fashion brand with 50 stores runs weekly visual audits. Auditors photograph window displays to verify that the nationwide "Summer Sale" branding is consistent. If a mannequin is missing an accessory, a corrective action is created for the store decorator to fix by end of day.',
    checks: "Store layout, branding consistency, inventory presentation, staff uniform, signage compliance.",
  },
  {
    icon: Hotel,
    title: "Hotels & Hospitality",
    desc: "Housekeeping quality, lobby cleanliness, room readiness — all checked with photo evidence and GPS verification. Surprise audits catch the real state of operations, not the version prepared for announced inspections.",
    checks: "Room cleanliness, amenity restocking, common area maintenance, safety equipment, guest-facing standards.",
  },
  {
    icon: Warehouse,
    title: "Facility Management & Warehouses",
    desc: "Safety equipment checks, fire exit clearance, pest control verification — all on recurring schedules with critical-severity scoring. A blocked fire exit doesn't get lost in a spreadsheet. It triggers an immediate escalation.",
    checks: "Fire safety, pest control, equipment maintenance, PPE compliance, loading dock organization.",
  },
];

// ─── Technical Features ───────────────────────────────────────────────────────
const techFeatures = [
  { icon: Smartphone, title: "Mobile-optimized web app", desc: "No app store download needed. Works on any phone browser. PWA-ready." },
  { icon: Zap, title: "Real-time sync", desc: "Data updates instantly across all dashboards." },
  { icon: Shield, title: "Role-based access control", desc: "Auditors only see their assigned audits. Managers only see their locations. Admins see everything." },
  { icon: Wifi, title: "Offline capable", desc: "Audits sync automatically when connectivity is restored." },
  { icon: Lock, title: "Secure by design", desc: "Server-side security rules. No client-side data manipulation possible." },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Hero + Nav */}
      <HeroSection />

      {/* ── Problem Section ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15] mb-6">
              You can&apos;t be everywhere.<br />
              <span className="text-neutral-400">That&apos;s the problem.</span>
            </h2>
            <p className="text-xl text-neutral-400 leading-relaxed">
              When you ran one location, you saw everything. Now you have 5, 20, or 50 — and you rely on managers to tell you the truth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Paper audits are worthless",
                desc: "They're easy to fake, impossible to track, and they sit in a drawer. No photos. No proof. No accountability.",
              },
              {
                title: "Managers filter information",
                desc: "Not always on purpose. But by the time a problem reaches you, it's either sugarcoated or a full-blown crisis.",
              },
              {
                title: "One branch can sink the brand",
                desc: "A hygiene violation, a safety hazard, a terrible customer experience — it only takes one location to destroy years of reputation. And you didn't even know.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                  <span className="text-red-400 font-bold text-sm">!</span>
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
            <p className="text-xl text-neutral-500 leading-relaxed">
              Every audit is backed by live photos, videos, GPS location, and server-verified timestamps. Nothing can be faked. Nothing gets lost. Every failure becomes a task that must be resolved with proof.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* ── How It Works Section ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-neutral-50 px-6 border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              From template to resolution<br />
              <span className="text-neutral-400">in 6 steps.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-200/30 transition-all duration-300 group"
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

      {/* ── Role-Based Architecture Section ──────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Three roles.<br />
              <span className="text-neutral-400">Clear accountability.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Crown,
                role: "Admin",
                subtitle: "Owner / Head Office",
                color: "bg-neutral-900",
                items: [
                  "Full visibility across all locations",
                  "Create and manage audit templates",
                  "Add users, manage branches",
                  "View trend reports and comparative performance",
                  "Approve or reject corrective action resolutions",
                ],
              },
              {
                icon: Users,
                role: "Manager",
                subtitle: "Branch / Regional Level",
                color: "bg-neutral-700",
                items: [
                  "Receives published audits, assigns them to auditors",
                  "Responsible for fixing failed items with photo proof",
                  "Tracks auditor progress and scores for their locations",
                ],
              },
              {
                icon: ClipboardList,
                role: "Auditor",
                subtitle: "Field Level",
                color: "bg-neutral-500",
                items: [
                  "Mobile-first interface, one question at a time",
                  "Captures photos, videos, GPS, and notes during audits",
                  "Works offline — syncs automatically when back online",
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
                      <li key={j} className="flex items-start gap-3 text-neutral-600 text-sm leading-relaxed">
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

      {/* ── Sticky Scroll Features Section ───────────────────────────────── */}
      <StickyFeatureSection />

      {/* ── Use Cases Section ─────────────────────────────────────────────── */}
      <section id="use-cases" className="py-24 md:py-32 bg-neutral-50 px-6 border-y border-neutral-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Built for businesses that operate<br />
              <span className="text-neutral-400">across multiple locations.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-neutral-500 leading-relaxed mb-6">{uc.desc}</p>
                <div className="pt-5 border-t border-neutral-100">
                  <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">Key Checks</span>
                  <p className="text-sm text-neutral-600">{uc.checks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Tamper-Proof Section ──────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Designed so no one can<br />
              <span className="text-neutral-400">game the system.</span>
            </h2>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[1fr_1.5fr] bg-white/5 border-b border-white/10">
              <div className="px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-widest">Threat</div>
              <div className="px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-widest border-l border-white/10">How Audiment Prevents It</div>
            </div>
            {tamperRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_1.5fr] border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-200 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
              >
                <div className="px-6 py-5 text-sm text-neutral-300 leading-relaxed">{row.threat}</div>
                <div className="px-6 py-5 text-sm text-neutral-200 leading-relaxed border-l border-white/5 font-medium">{row.prevention}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance Section ────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-8">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-8">
            Every audit is permanently<br />
            <span className="text-neutral-400">stored and searchable.</span>
          </h2>
          <p className="text-xl text-neutral-500 leading-relaxed max-w-3xl mx-auto mb-8">
            Need to pull up inspection records for an FSSAI audit? An ISO review? A franchise compliance check? Every completed audit — with all photos, videos, scores, timestamps, GPS data, and corrective action history — lives in a searchable archive.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
            {[
              "Nothing is deleted.",
              "Nothing is editable after submission.",
              "Fully searchable archive.",
            ].map((point, i) => (
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
              Fast. Secure.<br />
              <span className="text-neutral-400">Works on any device.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {techFeatures.map((tech, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-200/30 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-4 text-neutral-900">
                  <tech.icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-neutral-900 mb-2">{tech.title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">Numbers that matter.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200/60">
            {[
              { value: "1,240+", label: "Audits Completed on the Platform" },
              { value: "860+", label: "Corrective Actions Resolved with Proof" },
              { value: "70+", label: "Locations Managed Across Industries" },
              { value: "3.2h", label: "Avg. Time from Failure to Resolution" },
            ].map((stat) => (
              <div key={stat.label} className="pt-8 md:pt-0 flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-semibold tracking-tighter text-neutral-900 mb-3">
                  {stat.value}
                </div>
                <p className="text-neutral-500 font-medium text-base text-balance max-w-[160px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ──────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "We recently integrated this system into our 50+ locations, and it's an easy quick win. By providing real-time oversight, it increases compliance and reduces operational friction.",
                author: "Ananya S.",
                role: "Operations Manager @BiryaniBlues",
              },
              {
                quote: "Providing consistent quality and decision-making support is a key priority. The results of the first quarter have fully lived up to our expectations, and we have great ambitions for deploying across upcoming sites.",
                author: "Vikram R.",
                role: "Head of Growth @WowMomo",
              },
              {
                quote: "We are at the very beginning of our journey with Audiment, yet we can already see its transformative potential in reshaping how we monitor our outlets. A true game-changer.",
                author: "Neha K.",
                role: "Regional Director @Theobroma",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-6 p-8 rounded-3xl bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-200/20 transition-all duration-300"
              >
                <div className="flex gap-1 text-neutral-300">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto pt-4 flex flex-col">
                  <span className="font-semibold text-neutral-900">{testimonial.author}</span>
                  <span className="text-sm text-neutral-500">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white px-6 border-b border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-6">
              Common questions.
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-neutral-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
            Stop guessing.{" "}
            <span className="text-neutral-400">Start seeing.</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Set up your first audit template in minutes. Know exactly what&apos;s happening at every branch — with proof.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="/login"
              className="inline-flex h-14 items-center gap-2 px-10 bg-white hover:bg-neutral-100 text-neutral-900 text-lg font-semibold rounded-full transition-all hover:scale-[1.02] shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex h-14 items-center gap-2 px-10 border border-white/20 hover:border-white/40 text-white text-lg font-medium rounded-full transition-all duration-300"
            >
              Book a Demo
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-500 font-medium pt-2">
            <CheckCircle2 className="w-5 h-5 text-neutral-600" />
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