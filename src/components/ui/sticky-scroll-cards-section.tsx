"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Eye, Video, AlertTriangle, MapPin,
  TrendingDown, LayoutTemplate, FileCheck2, Camera
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    category: "Evidence",
    title: "Photo and video evidence enforcement",
    heading: "No evidence, no submission.",
    description: "Every audit question can require mandatory photo or video proof before the auditor can proceed. No evidence, no submission.",
    imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: AlertTriangle,
    category: "Corrective Actions",
    title: "Automated corrective action tracking",
    heading: "Failed items become assigned tasks – instantly.",
    description: "Critical failures automatically generate assigned resolution tasks with 48-hour SLAs, mandatory notes, and photo proof of resolution.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: TrendingDown,
    category: "Alerts",
    title: "Instant low-score and trend alerts",
    heading: "Catch declining branches before they become a problem.",
    description: "Automatic alerts when a branch scores below threshold. Trend detection flags locations that score poorly on three consecutive audits.",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: Video,
    category: "Verification",
    title: "Flash verification – prove your auditor was there",
    heading: "20 seconds of uneditable truth.",
    description: "Auditors record a 20-second geo-tagged video and verified selfie from the field. Tamper-proof proof of presence at every location.",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: LayoutTemplate,
    category: "Templates",
    title: "Standardized audit blueprints",
    heading: "Build once. Deploy to every location.",
    description: "Build reusable audit templates with custom questions, scoring weights, and severity levels. Share blueprints across your entire organization.",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: FileCheck2,
    category: "Compliance",
    title: "FSSAI-ready compliance templates",
    heading: "Pass your next inspection on the first attempt.",
    description: "Pre-built FSSAI hygiene and safety audit templates load with one click. Purpose-built for food businesses under Indian compliance standards.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: Eye,
    category: "Reporting",
    title: "One-click PDF audit reports",
    heading: "See how branches run when no one's watching.",
    description: "Export complete audit reports as high-fidelity PDFs including all questions, answers, photo evidence, scores, and corrective action status.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: MapPin,
    category: "Audit Trail",
    title: "Permanent audit trail",
    heading: "Proof they were actually there.",
    description: "Every audit, photo, score, and corrective action is permanently stored and searchable. Full compliance history at your fingertips.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2070&auto=format&fit=crop",
  },
];

const STICKY_OFFSET = 80;
const STICKY_GAP = 8;
const getStickyTop = (i: number) => STICKY_OFFSET + i * STICKY_GAP;

// ─── Hook: fires once when element enters view ─────────────────────────────────
const useInView = (threshold = 0.1) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
};

// ─── Section Header ────────────────────────────────────────────────────────────
const AnimatedHeader = () => {
  const [h2Ref, h2In] = useInView();
  const [pRef, pIn] = useInView();
  return (
    <div className="text-center max-w-3xl mx-auto mb-20 px-6">
      <h2
        ref={h2Ref}
        className={`text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900
          transition-all duration-700 ease-out
          ${h2In ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        Everything you need for<br />
        <span className="text-neutral-400">compliant, auditable operations</span>
      </h2>
      <p
        ref={pRef}
        className={`text-lg text-neutral-500 mt-6 transition-all duration-700 ease-out delay-150
          ${pIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        Built specifically for multi-branch businesses, every feature addresses a real gap
        in how inspections and accountability work today.
      </p>
    </div>
  );
};

// ─── Feature Card ──────────────────────────────────────────────────────────────
interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  depth: number;
}

// forwardRef so the parent's cardRefs[i] lands on the actual sticky div
const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ feature, index, depth }, forwardedRef) => {
    const Icon = feature.icon;
    const inViewRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    // Merge forwardedRef + inViewRef onto the same element
    const setRefs = (el: HTMLDivElement | null) => {
      inViewRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    };

    useEffect(() => {
      const el = inViewRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setInView(true); },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    const scale = Math.max(1 - depth * 0.015, 0.93);
    const overlayOpacity = Math.min(depth * 0.04, 0.16);
    const shadowOpacity = Math.min(depth * 0.07, 0.16);

    return (
      <div
        ref={setRefs}
        className={`sticky rounded-3xl overflow-hidden border border-neutral-200 bg-white
          ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{
          top: `${getStickyTop(index)}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          boxShadow: depth > 0
            ? `0 -8px 24px rgba(0,0,0,${shadowOpacity.toFixed(3)}), 0 -1px 0 rgba(0,0,0,0.06)`
            : 'none',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, opacity 0.7s ease',
          willChange: 'transform',
        }}
      >
        {/* Depth overlay */}
        <div
          className="absolute inset-0 bg-neutral-900 pointer-events-none z-10 rounded-3xl"
          style={{ opacity: overlayOpacity, transition: 'opacity 0.4s ease' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">

          {/* ── Text column ── */}
          <div className="flex flex-col justify-center px-10 py-12 md:py-14 relative z-0">
            <div
              className={`flex items-center gap-2.5 mb-6 transition-all duration-500 ease-out delay-100
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
              <span className="text-xs font-semibold tracking-[0.14em] uppercase text-neutral-400">
                {feature.category}
              </span>
            </div>

            <h3
              className={`text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight leading-snug mb-3
                transition-all duration-500 ease-out delay-150
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {feature.title}
            </h3>

            <p
              className={`text-sm font-medium text-neutral-400 italic mb-5 leading-relaxed
                transition-all duration-500 ease-out delay-200
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {feature.heading}
            </p>

            <p
              className={`text-base text-neutral-500 leading-relaxed max-w-[42ch]
                transition-all duration-500 ease-out delay-[250ms]
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {feature.description}
            </p>
          </div>

          {/* ── Image column ── */}
          <div
            className={`relative min-h-[260px] md:min-h-full transition-all duration-700 ease-out delay-100
              ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
          >
            <Image
              src={feature.imageUrl}
              alt={feature.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
          </div>

        </div>
      </div>
    );
  }
);
FeatureCard.displayName = 'FeatureCard';

// ─── Main Export ───────────────────────────────────────────────────────────────
export function StickyFeatureSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stackDepths, setStackDepths] = useState<number[]>(
    new Array(features.length).fill(0)
  );

  useEffect(() => {
    const handleScroll = () => {
      // Check which cards are currently pinned at their sticky top
      const isSticky = cardRefs.current.map((el, i) => {
        if (!el) return false;
        return el.getBoundingClientRect().top <= getStickyTop(i) + 2;
      });

      // depth[i] = number of cards j > i that are also pinned (stacked on top)
      setStackDepths(
        features.map((_, i) =>
          isSticky.slice(i + 1).filter(Boolean).length
        )
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="features" className="bg-white font-sans relative z-10">
      <div className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <section className="py-24 md:py-32 flex flex-col items-center">
            <AnimatedHeader />
            <div className="w-full space-y-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  feature={feature}
                  index={index}
                  depth={stackDepths[index]}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}