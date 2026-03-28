"use client";

import React, { useState, useEffect, useRef } from 'react';

// --- Data for the feature cards ---
const features = [
  {
    title: "Real-Time Outlet Monitoring",
    description: "Gain complete visibility into every branch without leaving your desk. Access live metrics, hygiene statuses, and staff punch-ins tracked in real-time.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    bgColor: "bg-neutral-100 dark:bg-neutral-900",
    textColor: "text-neutral-600 dark:text-neutral-400"
  },
  {
    title: "Centralized Reports & Analytics",
    description: "Instantly view daily performance, ingredient consumption, and operational reports all consolidated in a single beautifully designed dashboard.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-white dark:bg-black",
    textColor: "text-neutral-600 dark:text-neutral-400"
  },
  {
    title: "100% FSSAI Compliance",
    description: "Automate temperature logs, daily hygiene checklists, and expiry tracking to keep every outlet audit-ready and compliant at all times.",
    imageUrl: "https://images.unsplash.com/photo-1581577789498-8ec0949ed8cf?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-neutral-50 dark:bg-neutral-950",
    textColor: "text-neutral-600 dark:text-neutral-400"
  },
  {
    title: "Instant Incident Resolution",
    description: "Flag operational issues, create corrective tickets, and assign them directly to branch managers. Track resolution times seamlessly.",
    imageUrl: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1964&auto=format&fit=crop",
    bgColor: "bg-neutral-100 dark:bg-neutral-900",
    textColor: "text-neutral-600 dark:text-neutral-400"
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
                className={`text-4xl md:text-5xl font-semibold tracking-tight transition-all duration-700 ease-out text-neutral-900 dark:text-white ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                Uncover Insights, Leave Nothing to Chance
            </h2>
            <p 
                ref={pRef}
                className={`text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mt-6 transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                Designed specifically for multi-branch environments, Audiment brings the reality of your operations directly to you.
            </p>
        </div>
    );
};

export function StickyFeatureSection() {
  return (
    <div className="bg-white dark:bg-black font-sans relative z-10">
      <div className="px-6">
        <div className="max-w-6xl mx-auto">
          <section className="py-24 md:py-32 flex flex-col items-center">
            
            <AnimatedHeader />

            <div className="w-full">
              {features.map((feature, index) => (
                <div
                    key={index}
                    className={`${feature.bgColor} grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 p-8 md:p-12 rounded-[2rem] border border-neutral-200/50 dark:border-white/10 mb-16 shadow-lg shadow-neutral-900/5 sticky`}
                    style={{ top: '150px' }}
                >
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-semibold mb-6 text-neutral-900 dark:text-white tracking-tight">{feature.title}</h3>
                    <p className={`${feature.textColor} text-lg leading-relaxed`}>{feature.description}</p>
                  </div>
                  
                  <div className="image-wrapper mt-8 md:mt-0 relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-white/10 shadow-sm">
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
