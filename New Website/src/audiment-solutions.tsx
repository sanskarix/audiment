/**
 * Audiment Solutions Page — /audiment/solutions
 * Redesigned to strictly adhere to the Asellus Design System:
 * - Minimalist line-art SVG icons in 1px bordered icon boxes (.aud-card-icon)
 * - Verbatim content from audiment-public-website/src/app/solutions/page.tsx
 * - Numbered index tags (01..07), capability chips, and Asellus typography
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Footer } from './components/Footer';
import { observeDotBorderButtons } from './lib/dotBorder';
import { observeAnimations } from './lib/animations';
import { initCalEmbed, getCalAttributes } from './lib/cal';
import './style.css';
import './audiment.css';

// ─── Inline SVG Icon Component (Crisp Line Art matching Asellus) ─────────────

const IconSVG: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'utensils':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
          <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15zm0 0 7 7" />
          <path d="m2.1 21.8 6.4-6.3" />
          <path d="m19 5-7 7" />
        </svg>
      );
    case 'coffee':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      );
    case 'shieldCheck':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'shoppingBag':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 10a4 4 0 0 1-8 0" />
          <path d="M3.103 6.034h17.794" />
          <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
        </svg>
      );
    case 'store':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
    href: '/audiment/solutions/restaurant-audit-software',
    iconKey: 'utensils',
  },
  {
    num: '02',
    category: 'QUICK SERVICE RESTAURANTS',
    title: 'QSR Audit Software',
    description: 'Shift-by-shift compliance checks for high-volume QSR operations. Opening checklists, temperature logs, and brand standard audits run consistently – even with high staff turnover.',
    tags: ['Shift-by-shift checks', 'Opening checklists', 'Temperature logs'],
    href: '/audiment/solutions/qsr-audit-software',
    iconKey: 'coffee',
  },
  {
    num: '03',
    category: 'COMPLIANCE & FSSAI',
    title: 'Food Safety Audit Software',
    description: 'FSSAI-mapped audit templates with mandatory photo evidence and automatic non-conformance alerts. Build an inspection-ready compliance record before the inspector arrives.',
    tags: ['FSSAI-mapped', 'Mandatory photos', 'Non-conformance alerts'],
    href: '/audiment/solutions/food-safety-audit-software',
    iconKey: 'shieldCheck',
  },
  {
    num: '04',
    category: 'RETAIL & MULTI-STORE',
    title: 'Retail Audit Software',
    description: 'Audit visual merchandising, promotional displays, and store presentation against corporate guidelines. See which districts are executing well and which are falling behind.',
    tags: ['Visual merchandising', 'Store presentation', 'District scorecards'],
    href: '/audiment/solutions/retail-audit-software',
    iconKey: 'shoppingBag',
  },
  {
    num: '05',
    category: 'FRANCHISE NETWORKS',
    title: 'Franchise Audit Software',
    description: 'Give corporate teams proof of what\'s actually happening at franchisee locations. Objective scorecards, photo-evidenced audits, and compliance data that supports performance conversations.',
    tags: ['Corporate proof', 'Photo-evidenced', 'Objective scorecards'],
    href: '/audiment/solutions/franchise-audit-software',
    iconKey: 'store',
  },
  {
    num: '06',
    category: 'HOTELS & HOSPITALITY',
    title: 'Hotel Audit Software',
    description: 'Standardize housekeeping, F&B safety, and guest experience audits across properties. When an inspection finds a maintenance issue, the fix routes to engineering automatically.',
    tags: ['Housekeeping checks', 'F&B safety', 'Auto engineering tickets'],
    href: '/audiment/solutions/hotel-audit-software',
    iconKey: 'building',
  },
  {
    num: '07',
    category: 'MANUFACTURING & PLANTS',
    title: 'Manufacturing Audit Software',
    description: 'Run safety walks, equipment inspections, and quality control audits across production facilities. Photo-evidenced shift handovers ensure nothing gets missed between teams.',
    tags: ['Safety walks', 'Equipment checks', 'Shift handovers'],
    href: '/audiment/solutions/manufacturing-audit-software',
    iconKey: 'factory',
  },
];

const highlights = [
  { label: 'Scale Ready', val: '10–500+ Locations' },
  { label: 'Offline Execution', val: 'Works 100% Offline' },
  { label: 'FSSAI Mapped', val: 'Pre-built Blueprints' },
  { label: 'Verification', val: 'GPS & Photo Evidence' },
];

// ─── Audiment Solutions Page Component ───────────────────────────────────────

function AudimentSolutionsPage() {
  const cal = getCalAttributes('general');

  return (
    <>
      {/* Signature vertical guide lines matching Asellus UI */}
      <div className="page-lines" />

      {/* Global Navigation Header */}
      <header>
        <div className="header-inner">
          <a className="brand" href="/audiment">
            Audiment
          </a>
          <nav>
            <a href="/audiment#how-it-works">How it works</a>
            <a href="/audiment#features">Features</a>
            <a href="/audiment/use-cases">Use cases</a>
            <a href="/audiment/solutions" className="active" style={{ color: 'var(--ink)', fontWeight: 600 }}>Solutions</a>
            <a href="/audiment/about">About</a>
            <a href="/audiment/blog">Blog</a>
            <a href="/audiment#faq">FAQ</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DotBtn id="aud-solutions-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
          </div>
          <button
            className="menu"
            aria-label="Open menu"
            onClick={() => document.querySelector('header')?.classList.toggle('open')}
          >
            ☰
          </button>
        </div>
      </header>

      <main id="top">

        {/* ── §1 Hero Section (Asellus Editorial Style) ── */}
        <section className="aud-solutions-hero">
          <div className="aud-inner">
            <InView immediate>
              <div className="aud-solutions-hero-head">
                <h1>
                  Audit software built for <i>your industry.</i>
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

        {/* ── §3 Industry Solutions Grid Section ── */}
        <section className="aud-solutions-section" id="solutions-list">
          <div className="aud-inner">

            <InView>
              <div className="aud-head" style={{ marginBottom: 48 }}>
                <h2>
                  Tailored audit workflows <br />
                  <span className="muted">configured for your operating model</span>
                </h2>
              </div>
            </InView>

            <motion.div
              className="aud-solutions-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              variants={stagger(0.06)}
            >
              {solutionsData.map((sol) => (
                <motion.a
                  key={sol.title}
                  href={sol.href}
                  className="aud-sol-card"
                  variants={fadeUp}
                >
                  {/* Card Header: Asellus .aud-card-icon + Numbered index */}
                  <div className="aud-sol-card-header">
                    <div className="aud-card-icon">
                      <IconSVG type={sol.iconKey} />
                    </div>
                    <span className="aud-sol-num">{sol.num}</span>
                  </div>

                  {/* Category Tag Pill */}
                  <span className="aud-sol-category">{sol.category}</span>

                  {/* Title */}
                  <h3>{sol.title}</h3>

                  {/* Verbatim Description */}
                  <p className="aud-sol-desc">{sol.description}</p>

                  {/* Capability Chips */}
                  <div className="aud-sol-tags">
                    {sol.tags.map((t) => (
                      <span key={t} className="aud-sol-tag-chip">{t}</span>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <div className="aud-sol-link">
                    <span>Learn more</span>
                    <ArrowRightIcon />
                  </div>
                </motion.a>
              ))}
            </motion.div>

          </div>
        </section>

        {/* ── §4 Cross-Industry Discovery CTA ── */}
        <section className="aud-solutions-cta-section">
          <div className="aud-inner">
            <InView>
              <div className="aud-solutions-cta-box">
                <div className="aud-solutions-cta-content">
                  <h2>Not sure which solution fits?</h2>
                  <p>
                    Tell us what you audit today. We'll show you how Audiment fits your operation.
                  </p>
                  <div className="aud-solutions-cta-btn-wrap">
                    <DotBtn
                      id="aud-solutions-cta-btn"
                      label="Book a Discovery Call"
                      variant="orange"
                      calAttrs={cal}
                    />
                  </div>
                </div>
              </div>
            </InView>
          </div>
        </section>

      </main>

      {/* Global Footer */}
      <Footer service="general" />
    </>
  );
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const appEl = document.querySelector<HTMLElement>('#app');
if (appEl) {
  const root = createRoot(appEl);
  root.render(<AudimentSolutionsPage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
