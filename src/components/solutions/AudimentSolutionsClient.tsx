'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

// ─── Inline SVG Icon Component (Crisp Line Art matching Asellus) ─────────────

const IconSVG: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'utensils':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
          <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15zm0 0 7 7" />
          <path d="m2.1 21.8 6.4-6.3" />
          <path d="m19 5-7 7" />
        </svg>
      );
    case 'coffee':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      );
    case 'shieldCheck':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'shoppingBag':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 10a4 4 0 0 1-8 0" />
          <path d="M3.103 6.034h17.794" />
          <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
        </svg>
      );
    case 'store':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
          <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
          <path d="M18 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
          <path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
          <path d="M10 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
          <path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
        </svg>
      );
    case 'building':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      );
    case 'factory':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z" />
          <path d="M17 18h1" />
          <path d="M12 18h1" />
          <path d="M7 18h1" />
        </svg>
      );
    default:
      return null;
  }
};

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const stagger = (delay = 0.07): any => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

const InView: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
  immediate?: boolean;
}> = ({ children, className, style, amount = 0.08, immediate = false }) => (
  <motion.div
    initial="hidden"
    animate={immediate ? 'visible' : undefined}
    whileInView={immediate ? undefined : 'visible'}
    viewport={{ once: true, amount }}
    variants={fadeUp}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

// ─── Asellus Dot-Border Button ───────────────────────────────────────────────

const DotBtn: React.FC<{
  label: React.ReactNode;
  variant?: 'default' | 'orange' | 'dark';
  href?: string;
  calAttrs?: Record<string, string>;
  id?: string;
}> = ({ label, variant = 'default', href, calAttrs, id }) => {
  const wrapClass = `btn-wrapper${variant === 'orange' ? ' btn-wrapper--orange' : variant === 'dark' ? ' btn-wrapper--dark' : ''}`;
  const btnClass = `button${variant === 'orange' ? ' button--orange' : ''}`;
  const inner = (
    <>
      <span className="dot top left" />
      <span className="dot top right" />
      <span className="dot bottom left" />
      <span className="dot bottom right" />
      <span className="line horizontal top" />
      <span className="line horizontal bottom" />
      <span className="line vertical left" />
      <span className="line vertical right" />
    </>
  );
  if (calAttrs) {
    return (
      <div className={wrapClass}>
        {inner}
        <a className={btnClass} href="javascript:void(0);" id={id} {...calAttrs}>{label}</a>
      </div>
    );
  }
  return (
    <div className={wrapClass}>
      {inner}
      <a className={btnClass} href={href ?? '#'} id={id}>{label}</a>
    </div>
  );
};

// ─── Verbatim Content Sourced from audiment-public-website/src/app/solutions/page.tsx ────

const solutionsData = [
  {
    num: '01',
    category: 'RESTAURANTS & KITCHENS',
    title: 'Restaurant Audit Software',
    description: 'Run hygiene, safety, and brand standard audits across every location with FSSAI-ready templates. Area managers see which kitchens are passing and which need attention.',
    tags: ['FSSAI-ready templates', 'Kitchen hygiene', 'Area manager view'],
    href: '/solutions/restaurant-audit-software',
    iconKey: 'utensils',
    isWide: false,
  },
  {
    num: '02',
    category: 'QUICK SERVICE RESTAURANTS',
    title: 'QSR Audit Software',
    description: 'Shift-by-shift compliance checks for high-volume QSR operations. Opening checklists, temperature logs, and brand standard audits run consistently – even with high staff turnover.',
    tags: ['Shift-by-shift checks', 'Opening checklists', 'Temperature logs'],
    href: '/solutions/qsr-audit-software',
    iconKey: 'coffee',
    isWide: false,
  },
  {
    num: '03',
    category: 'COMPLIANCE & FSSAI',
    title: 'Food Safety Audit Software',
    description: 'FSSAI-mapped audit templates with mandatory photo evidence and automatic non-conformance alerts. Build an inspection-ready compliance record before the inspector arrives.',
    tags: ['FSSAI-mapped', 'Mandatory photos', 'Non-conformance alerts'],
    href: '/solutions/food-safety-audit-software',
    iconKey: 'shieldCheck',
    isWide: false,
  },
  {
    num: '04',
    category: 'RETAIL & MULTI-STORE',
    title: 'Retail Audit Software',
    description: 'Audit visual merchandising, promotional displays, and store presentation against corporate guidelines. See which districts are executing well and which are falling behind.',
    tags: ['Visual merchandising', 'Store presentation', 'District scorecards'],
    href: '/solutions/retail-audit-software',
    iconKey: 'shoppingBag',
    isWide: false,
  },
  {
    num: '05',
    category: 'FRANCHISE NETWORKS',
    title: 'Franchise Audit Software',
    description: 'Give corporate teams proof of what\'s actually happening at franchisee locations. Objective scorecards, photo-evidenced audits, and compliance data that supports performance conversations.',
    tags: ['Corporate proof', 'Photo-evidenced', 'Objective scorecards'],
    href: '/solutions/franchise-audit-software',
    iconKey: 'store',
    isWide: false,
  },
  {
    num: '06',
    category: 'HOTELS & HOSPITALITY',
    title: 'Hotel Audit Software',
    description: 'Standardize housekeeping, F&B safety, and guest experience audits across properties. When an inspection finds a maintenance issue, the fix routes to engineering automatically.',
    tags: ['Housekeeping checks', 'F&B safety', 'Auto engineering tickets'],
    href: '/solutions/hotel-audit-software',
    iconKey: 'building',
    isWide: false,
  },
  {
    num: '07',
    category: 'MANUFACTURING & PLANTS',
    title: 'Manufacturing Audit Software',
    description: 'Run safety walks, equipment inspections, and quality control audits across production facilities. Photo-evidenced shift handovers ensure nothing gets missed between teams.',
    tags: ['Safety walks', 'Equipment checks', 'Shift handovers'],
    href: '/solutions/manufacturing-audit-software',
    iconKey: 'factory',
    isWide: true,
  },
];

const highlights = [
  { label: 'Scale Ready', val: '10–500+ Locations' },
  { label: 'Offline Execution', val: 'Works 100% Offline' },
  { label: 'FSSAI Mapped', val: 'Pre-built Blueprints' },
  { label: 'Verification', val: 'GPS & Photo Evidence' },
];

export function AudimentSolutionsClient() {
  const cal = getCalAttributes('general');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    observeDotBorderButtons();
    observeAnimations();
    initCalEmbed();

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      clearTimeout(t1);
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Signature vertical guide lines matching Asellus UI */}
      <div className="page-lines" />

      {/* Global Navigation Header */}
      <Header activeNav="solutions" ctaId="aud-solutions-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section (Asellus Editorial Style) ── */}
        <section className="aud-solutions-hero">
          <div className="aud-inner">
            <InView immediate>
              <div className="aud-solutions-hero-head">
                <h1>
                  Audit software built<br />
                  <span className="muted">for your industry.</span>
                </h1>
                <p className="aud-solutions-hero-sub">
                  Every multi-location business needs reliable audits. But a QSR shift check is fundamentally different from a hotel room inspection or a factory safety walk. Each solution below is configured for the audit workflows, compliance requirements, and management structure of your industry.
                </p>

                <div className="actions" style={{ justifyContent: 'center', marginTop: 36, marginBottom: 0 }}>
                  <DotBtn id="aud-solutions-hero-cta" label="Book a call" variant="orange" calAttrs={cal} />
                  <a className="button" href="#solutions-list" style={{ textDecoration: 'none' }}>
                    Explore 7 solutions
                  </a>
                </div>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §2 Highlights Bar ── */}
        <section className="aud-solutions-highlights-bar">
          <div className="aud-inner">
            <div className="aud-highlights-grid">
              {highlights.map((h) => (
                <div key={h.label} className="aud-highlight-item">
                  <span className="aud-hl-val">{h.val}</span>
                  <span className="aud-hl-label">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── §3 Section Intro ── */}
        <section className="intro" id="solutions-list">
          <div>
            <h2>
              Tailored audit workflows<br />
              configured for <span className="aud-text-orange">your operating model.</span>
            </h2>
            <p>
              Configured for the specific audit workflows, compliance requirements, and management structure of your industry.
            </p>
          </div>
        </section>

        {/* ── §4 Industry Solutions Grid Section (Exact Asellus .work-grid.patterned) ── */}
        <section className="work-grid patterned" id="solutions" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {solutionsData.map((sol) => (
            <Link
              key={sol.title}
              href={sol.href}
              className={`work-card ${sol.isWide ? 'work-card--wide' : ''} three-areas-card-wrapper`}
              style={{
                padding: sol.isWide ? '48px 44px' : '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div>
                {/* Top: Index + Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ color: '#9a9a9a', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {sol.num} // {sol.category}
                  </span>
                  <div style={{ color: 'var(--orange)', display: 'flex', alignItems: 'center' }}>
                    <IconSVG type={sol.iconKey} className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h2 style={{
                  margin: '0 0 14px',
                  fontSize: sol.isWide ? '26px' : '21px',
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.25,
                  color: 'var(--ink)',
                }}>
                  {sol.title}
                </h2>

                {/* Description */}
                <p style={{
                  margin: '0 0 20px',
                  color: 'var(--muted)',
                  fontSize: sol.isWide ? '16px' : '14.5px',
                  lineHeight: 1.68,
                  maxWidth: sol.isWide ? '820px' : '100%',
                }}>
                  {sol.description}
                </p>

                {/* Capability Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 24 }}>
                  {sol.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: '#faf9f6',
                        border: '1px solid var(--line)',
                        borderRadius: '3px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--ink)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Asellus ThreeAreas link */}
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <span className="service-link three-areas-link" style={{ margin: 0 }}>
                  Explore Solution →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* ── §5 Bottom CTA Section (Exact Asellus .center-head) ── */}
        <section className="center-head" style={{ borderTop: 'none', padding: '110px 32px 120px' }}>
          <h2>Not sure which solution fits your operations?</h2>
          <p style={{ marginTop: 14 }}>
            Tell us what you audit today. We&apos;ll walk you through how Audiment maps to your operating model.
          </p>
          <div className="actions">
            <DotBtn id="aud-solutions-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer service="general" hideCta />
    </>
  );
}
