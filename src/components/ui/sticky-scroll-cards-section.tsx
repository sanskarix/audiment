"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Eye, Video, AlertTriangle, BarChart3, MapPin,
  TrendingDown, WifiOff, LayoutTemplate, FileCheck2, Camera
} from 'lucide-react';

// ─── Feature Cards (10 per §4 guidelines) ─────────────────────────────────────
const features = [
  {
    icon: Camera,
    label: "Feature 01",
    title: "Photo & Video Evidence Enforcement",
    heading: "No evidence, no completion.",
    description: "Every audit question can require a live photo or video before the auditor moves on — captured in-app, gallery uploads blocked.\n\nTimestamped, GPS-tagged media is locked to each response the moment it's submitted.",
    imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
  {
    icon: AlertTriangle,
    label: "Feature 02",
    title: "Automated Corrective Action Tracking",
    heading: "Failed items become assigned tasks — instantly.",
    description: "A critical failure auto-creates a corrective action assigned to the branch manager with a 48-hour SLA.\n\nManagers upload \"after\" photos as proof. Admins approve before closure. Nothing is marked resolved without verification.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white",
    textColor: "text-neutral-600"
  },
  {
    icon: TrendingDown,
    label: "Feature 03",
    title: "Instant Low-Score & Trend Alerts",
    heading: "Catch declining branches before they become a problem.",
    description: "A score drop of 10%+ across 3 consecutive audits triggers tiered escalation — branch manager, then regional, then owner.\n\nIntervene before it becomes a health inspection failure.",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-600"
  },
  {
    icon: Video,
    label: "Feature 04",
    title: "Flash Verification — Prove Your Auditor Was There",
    heading: "20 seconds of uneditable truth.",
    description: "A 20-second live video recorded inside the app — no gallery uploads, no editing — uploaded immediately with GPS coordinates and an auditor selfie.\n\nYou cannot fake a live video of a messy kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
  {
    icon: LayoutTemplate,
    label: "Feature 05",
    title: "Standardised Audit Blueprints",
    heading: "Build once. Deploy to every location.",
    description: "Full control over questions, severity levels, weighted scoring, and per-question photo requirements — deployed across all branches simultaneously.\n\nEvery location measured against the same standard. No gaps.",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white",
    textColor: "text-neutral-600"
  },
  {
    icon: FileCheck2,
    label: "Feature 06",
    title: "FSSAI-Ready Compliance Templates",
    heading: "Pass your next inspection on the first attempt.",
    description: "Load pre-built FSSAI audit templates with one click. Every inspection creates a permanent, GPS-tagged, timestamped record that satisfies regulatory audit trail requirements.\n\nCompliance built into the daily routine — not scrambled before an inspection.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-600"
  },
  {
    icon: Eye,
    label: "Feature 07",
    title: "Scheduled & Surprise Audits",
    heading: "See how branches run when no one's watching.",
    description: "Recurring schedules or on-demand surprise audits — invisible to managers until the auditor is already at the door.\n\nThis is how you find real problems, not staged performances.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
  {
    icon: MapPin,
    label: "Feature 08",
    title: "GPS & Timestamp Verification",
    heading: "Proof they were actually there.",
    description: "Every submission captures GPS coordinates. If the auditor is 50+ metres from the branch, the response is flagged with a Location Mismatch warning.\n\nTimestamps are server-side — phone clock changes don't matter.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white",
    textColor: "text-neutral-600"
  },
  {
    icon: BarChart3,
    label: "Feature 09",
    title: "Dashboards for Admins, Managers & Auditors",
    heading: "The right data for the right person.",
    description: "Admins see cross-location trends. Managers see their location's open actions. Auditors see only their assigned audits — one question at a time.\n\nAccess is enforced server-side. No one sees what they shouldn't.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-600"
  },
  {
    icon: WifiOff,
    label: "Feature 10",
    title: "Mobile-First Audit Execution",
    heading: "Any phone. No app store. No signal needed.",
    description: "Open the link in any browser, log in, and audit — no download required. Complete audits fully offline; everything syncs the moment connectivity returns.\n\nNo audit ever gets skipped because of a bad signal.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
];

// ─── Custom Hook for Scroll Animation ─────────────────────────────────────────
const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setInView(entry.isIntersecting); },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

// ─── Animated Section Header ───────────────────────────────────────────────────
const AnimatedHeader = () => {
  const [headerRef, headerInView] = useScrollAnimation();
  const [pRef, pInView] = useScrollAnimation();

  return (
    <div className="text-center max-w-3xl mx-auto mb-20 px-6">
      <h2
        ref={headerRef}
        className={`text-4xl md:text-5xl font-semibold tracking-tight transition-all duration-700 ease-out text-neutral-900 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        Everything You Need for<br />
        <span className="text-neutral-400">Compliant, Auditable Operations</span>
      </h2>
      <p
        ref={pRef}
        className={`text-lg text-neutral-600 mt-6 transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        Built specifically for multi-branch businesses, every feature addresses a real gap in how inspections and accountability work today.
      </p>
    </div>
  );
};

export function StickyFeatureSection() {
  return (
    <div id="features" className="bg-white font-sans relative z-10">
      <div className="px-6">
        <div className="max-w-6xl mx-auto">
          <section className="py-24 md:py-32 flex flex-col items-center">
            <AnimatedHeader />
            <div className="w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`${feature.bgColor} grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 p-8 md:p-12 rounded-[2rem] border border-neutral-200/50 mb-16 shadow-lg shadow-neutral-900/5 sticky`}
                  style={{ top: '150px' }}
                >
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold tracking-widest text-neutral-400">{feature.label}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-semibold mb-3 text-neutral-900 tracking-tight">{feature.title}</h3>
                    <p className="text-lg font-semibold text-neutral-700 mb-4 italic">{feature.heading}</p>
                    {feature.description.split('\n\n').map((para, i) => (
                      <p key={i} className={`${feature.textColor} text-base leading-relaxed mb-3`}>{para}</p>
                    ))}
                  </div>
                  <div className="mt-8 md:mt-0 relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/50 shadow-sm">
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
