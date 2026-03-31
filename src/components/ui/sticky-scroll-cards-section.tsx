"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Eye, Video, AlertTriangle, BarChart3, MapPin, TrendingDown, WifiOff } from 'lucide-react';

// --- Data for the feature cards ---
const features = [
  {
    icon: Calendar,
    label: "Feature 01",
    title: "Scheduled & Recurring Audits",
    heading: "Consistency on autopilot.",
    description: "Set a template to repeat daily, weekly, or monthly. The system creates the audit automatically and notifies the manager. If the manager doesn't assign an auditor within 2 hours, a delay alert is sent.\n\nNo one \"forgets\" to check a branch. Hygiene and safety become a habit, not an event.",
    imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
  {
    icon: Eye,
    label: "Feature 02",
    title: "Surprise Audits (Stealth Publishing)",
    heading: "See how branches run when no one's watching.",
    description: "Publish an audit on-demand. It stays invisible on the manager's dashboard until the auditor is already at the door. A 6-hour same-day deadline prevents last-minute cleanup or calling in extra staff.\n\nThis is how you find systemic problems – not staged performances.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white",
    textColor: "text-neutral-600"
  },
  {
    icon: Video,
    label: "Feature 03",
    title: "Flashmob Audits™ (Live Video Recording)",
    heading: "20 seconds of uneditable truth.",
    description: "The auditor records a 20-second video directly inside the Audiment interface. No gallery uploads. No editing. The video is immediately uploaded with GPS coordinates. A selfie of the auditor is captured simultaneously to prevent proxy auditing.\n\nYou cannot fake a live video of a messy kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-600"
  },
  {
    icon: AlertTriangle,
    label: "Feature 04",
    title: "Corrective Action Engine",
    heading: "Failures don't stay as reports. They become tasks.",
    description: "When an auditor marks a critical item as failed, the system instantly creates a corrective action. The manager is alerted. They must fix the issue, upload an \"after\" photo, and wait for admin approval.\n\nAdmins see the \"before\" and \"after\" side by side. No issue is closed until it's actually fixed.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
  {
    icon: BarChart3,
    label: "Feature 05",
    title: "Weighted Scoring",
    heading: "Not all failures are equal.",
    description: "Questions are scored by severity: Low (×1) for items like correct uniform, Medium (×1.5) for items like clean floors, and Critical (×5 + Auto-Fail) for things like evidence of pest activity.\n\nA branch can pass 95% of questions but still get flagged as \"High Risk\" if they fail one critical item. This forces attention to the things that actually matter.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white",
    textColor: "text-neutral-600"
  },
  {
    icon: MapPin,
    label: "Feature 06",
    title: "GPS & Timestamp Verification",
    heading: "Proof they were actually there.",
    description: "Every answer submission captures the auditor's GPS coordinates. If they're more than 50 meters from the registered branch location, the response is flagged with a \"Location Mismatch\" warning.\n\nTimestamps are server-side – even if someone changes their phone clock, the database records the real time.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-600"
  },
  {
    icon: TrendingDown,
    label: "Feature 07",
    title: "Trend Analysis & Escalation Alerts",
    heading: "Catch declining branches before they fail.",
    description: "The system monitors the last 3–5 audits per location. If a category score drops by more than 10% across consecutive audits, it triggers an alert with tiered escalation: first the branch manager, then the regional manager, then directly to the owner via SMS/email.\n\nYou intervene before it becomes a health inspection failure or a viral customer complaint.",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600"
  },
  {
    icon: WifiOff,
    label: "Feature 08",
    title: "Offline Mode",
    heading: "Works without internet. Syncs when connected.",
    description: "Auditors in basements, rural locations, or areas with poor connectivity can complete audits fully offline. All data syncs automatically the moment the device reconnects.\n\nNo audit gets skipped because of a bad signal.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white",
    textColor: "text-neutral-600"
  },
];

// --- Custom Hook for Scroll Animation ---
const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

// --- Header Component ---
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
                Every feature exists to solve a trust or operations problem.
            </h2>
            <p 
                ref={pRef}
                className={`text-lg md:text-xl text-neutral-600 mt-6 transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
                      <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{feature.label}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-semibold mb-3 text-neutral-900 tracking-tight">{feature.title}</h3>
                    <p className="text-lg font-semibold text-neutral-700 mb-4 italic">{feature.heading}</p>
                    {feature.description.split('\n\n').map((para, i) => (
                      <p key={i} className={`${feature.textColor} text-base leading-relaxed mb-3`}>{para}</p>
                    ))}
                  </div>
                  
                  <div className="image-wrapper mt-8 md:mt-0 relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/50 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={feature.imageUrl} 
                        alt={feature.title}
                        loading="lazy"
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found"; }}
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
