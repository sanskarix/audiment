/**
 * Audiment Solution Detail Page — Restaurant Audit Software
 * /solutions/restaurant-audit-software & /audiment/solutions/restaurant-audit-software
 * Minimal, clean, and aligned editorial redesign adhering strictly to Asellus & Audiment Design Language.
 * Verbatim content sourced 100% from audiment-public-website/src/app/solutions/restaurant-audit-software/page.tsx
 * FAQ section uses exact homepage styling (<section className="faq" id="faq"> with interactive <details>/<summary> accordion).
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

// ─── Inline SVG Line-Art Icons ───────────────────────────────────────────────

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
    case 'shieldCheck':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'eye':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return null;
  }
};

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const stagger = (delay = 0.06): any => ({
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

// ─── Data Objects (100% Verbatim) ─────────────────────────────────────────────

const pillarsData = [
  {
    num: '01',
    iconKey: 'utensils',
    title: 'Inconsistent Hygiene Standards',
    problem: 'Without daily checks that produce evidence, back-of-house hygiene slips. One food safety lapse can mean a health violation or a damaging review.',
    solutionTitle: 'Mandatory Photo Evidence',
    solutionDesc: "Staff take live photos of clean stations, temperature gauges, and correctly stored inventory during the audit. You see what's happening in your kitchens – not a summary from memory.",
  },
  {
    num: '02',
    iconKey: 'shieldCheck',
    title: 'FSSAI Compliance Pressure',
    problem: 'Keeping paper records for temperature logs and pest control leaves you vulnerable during unannounced regulatory inspections. Documents get lost or faked.',
    solutionTitle: 'Automated FSSAI-Ready Reports',
    solutionDesc: 'Generate FSSAI-compliant audit trails on demand. When the inspector arrives, show them a complete history of daily checks with photos and timestamps.',
  },
  {
    num: '03',
    iconKey: 'eye',
    title: 'Subjective Area Management',
    problem: "Area managers check boxes without walking the floor properly. When a real equipment failure happens, corporate doesn't know until a customer complains.",
    solutionTitle: 'Corrective Action Tracking',
    solutionDesc: 'When an audit fails, a task is created with a deadline. If a fridge temperature is too high, the responsible manager has a set window to fix it and upload proof.',
  },
];

const operationalBottlenecks = [
  'Store managers covering up equipment failures to avoid scrutiny from corporate.',
  'Area managers completing audits from their cars without walking the floor.',
  'Paper checklists getting lost before the FSSAI inspector arrives.',
  'Corporate finding out about hygiene failures through customer reviews instead of internal systems.',
];

const workflowSteps = [
  { num: 'STEP 1', title: 'Standard Fails', description: 'Auditor marks the walk-in freezer temperature as non-compliant.' },
  { num: 'STEP 2', title: 'Evidence Captured', description: 'Auditor takes a mandatory live photo of the thermometer reading.' },
  { num: 'STEP 3', title: 'Manager Alerted', description: 'The branch manager receives an instant notification with a 24-hour SLA to fix it.' },
  { num: 'STEP 4', title: 'Resolution Verified', description: 'Manager logs the fix and uploads a new photo of the corrected temperature.' },
];

const sampleChecklist = [
  { area: 'Kitchen Hygiene', question: 'Are absolutely all food contact surfaces sanitized, clean, and free of food debris from the previous shift?' },
  { area: 'Food Storage', question: 'Is the freezer temperature maintained stably at or below -18°C? Check internal thermometer.' },
  { area: 'Staff Grooming', question: 'Are all food handlers wearing clean uniforms, hairnets without exception, and maintaining short fingernails?' },
  { area: 'Washroom Cleanliness', question: 'Are customer and staff washrooms thoroughly clean, odor-free, and stocked with approved soap and towels?' },
  { area: 'Pest Control', question: 'Are fly catchers operational and is there total absence of any signs of vermin or pest activity near storage?' },
];

const faqs = [
  {
    q: 'Can we use our existing paper checklists in Audiment?',
    a: 'Yes. You can replicate and enhance your current paper forms using the digital builder – adding photo requirements and conditional logic.',
  },
  {
    q: 'Will this slow down my kitchen staff during opening/closing?',
    a: 'No. A digitized checklist on mobile is significantly faster. Staff tap Pass or Fail rather than writing logs by hand – saving 15–20 minutes daily.',
  },
  {
    q: 'Do managers need an internet connection in the freezer?',
    a: 'Audits continue offline and sync automatically once the device reconnects.',
  },
  {
    q: 'Can FSSAI inspectors view these logs?',
    a: 'Yes. Digital records are highly respected by regulatory bodies because they include timestamps and photo evidence, making them far more credible than paper.',
  },
  {
    q: 'How do we stop staff from taking photos of old, clean equipment?',
    a: 'Audiment requires live camera capture. Staff cannot upload images from their gallery, so evidence always reflects the actual moment.',
  },
];

const crossLinks = [
  { tag: 'Platform', title: 'Proof-Based Audits', href: '/audiment/platform/proof-based-audits', description: 'How photo evidence replaces self-reported summaries across your outlets.' },
  { tag: 'Platform', title: 'Corrective Actions', href: '/audiment/platform/corrective-actions', description: 'Auto-generated tasks with deadlines when a standard fails at any location.' },
  { tag: 'Platform', title: 'Issue Tracking', href: '/audiment/platform/issue-tracking', description: 'Track every failed check from detection to verified closure.' },
  { tag: 'Topic', title: 'Operational Drift', href: '/audiment/operational-drift', description: 'How restaurant standards drift silently as you scale and how to stop it.' },
  { tag: 'Topic', title: 'Staying Ahead of Compliance', href: '/audiment/staying-ahead-of-compliance', description: 'Proactive FSSAI compliance vs. scrambling before inspections.' },
  { tag: 'Topic', title: 'Maintaining Standards Across Locations', href: '/audiment/maintaining-standards-across-locations', description: 'The core consistency challenge for restaurant chains.' },
];

// ─── Component Implementation ────────────────────────────────────────────────

function RestaurantAuditSoftwarePage() {
  const cal = getCalAttributes('general');

  return (
    <>
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
            <a href="/audiment#use-cases">Use cases</a>
            <a href="/audiment/solutions" className="active" style={{ color: 'var(--ink)', fontWeight: 600 }}>Solutions</a>
            <a href="/audiment/about">About</a>
            <a href="/audiment/blog">Blog</a>
            <a href="/audiment#faq">FAQ</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DotBtn id="aud-sol-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
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

      {/* Sub-Header Breadcrumbs Bar */}
      <div className="aud-article-nav-bar" style={{ paddingTop: 104, paddingBottom: 24, paddingLeft: 32, paddingRight: 32 }}>
        <div className="aud-inner">
          <div className="aud-article-nav-content">
            <nav className="aud-breadcrumbs" aria-label="Breadcrumb">
              <a href="/audiment">Home</a>
              <span>/</span>
              <a href="/audiment/solutions">Solutions</a>
              <span>/</span>
              <span className="current">Restaurant Audit Software</span>
            </nav>
            <a href="/audiment/solutions" className="aud-back-link">
              ← Back to Solutions
            </a>
          </div>
        </div>
      </div>

      <main id="top">

        {/* ── §1 Hero Section (Spacious & Clean) ── */}
        <section className="aud-sol-detail-hero">
          <div className="aud-inner">
            <InView immediate>
              <div className="aud-sol-detail-hero-content">
                <h1>Restaurant Audits You Can Actually Trust</h1>
                <p className="aud-sol-detail-hero-sub">
                  Replace scattered paper checklists with digital audits built for multi-location restaurant operators. Know what's actually happening in every kitchen.
                </p>

                <div className="actions" style={{ justifyContent: 'flex-start', gap: 16 }}>
                  <DotBtn id="aud-sol-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
                  <a className="button" href="#sample-checklist" style={{ textDecoration: 'none' }}>
                    View Sample Checklist
                  </a>
                </div>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §2 Core Capabilities (Unified 3-Column Minimal Grid) ── */}
        <section className="aud-sol-detail-section">
          <div className="aud-inner">
            <InView>
              <div className="aud-sol-detail-head">
                <h2>Operational challenges & how Audiment solves them</h2>
                <p>Scaling restaurant operations without proof-based controls creates hidden risk in back-of-house hygiene.</p>
              </div>
            </InView>

            <motion.div
              className="aud-sol-pillars-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger(0.06)}
            >
              {pillarsData.map((item) => (
                <motion.div key={item.num} className="aud-sol-pillar-item" variants={fadeUp}>
                  <div className="aud-sol-pillar-top">
                    <div className="aud-card-icon">
                      <IconSVG type={item.iconKey} />
                    </div>
                    <span className="aud-sol-pillar-num">{item.num}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="problem">{item.problem}</p>

                  <div className="aud-sol-pillar-solution">
                    <h4>{item.solutionTitle}</h4>
                    <p>{item.solutionDesc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── §3 Operational Bottlenecks & Workflow Flow (Clean Editorial 2-Col Split) ── */}
        <section className="aud-sol-detail-section aud-sol-detail-section--paper">
          <div className="aud-inner">
            <div className="aud-sol-duo-clean">

              {/* Left Column: Bottlenecks Removed */}
              <InView>
                <div className="aud-sol-duo-clean-col">
                  <h3>Operational Bottlenecks Removed</h3>
                  <ul className="aud-sol-clean-list">
                    {operationalBottlenecks.map((item, idx) => (
                      <li key={idx}>
                        <span className="aud-sol-dash">–</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </InView>

              {/* Right Column: Workflow Resolution Steps */}
              <InView>
                <div className="aud-sol-duo-clean-col">
                  <h3>How an Audit Resolution Flow Works</h3>
                  <div className="aud-sol-workflow-clean-list">
                    {workflowSteps.map((step) => (
                      <div key={step.title} className="aud-sol-workflow-clean-item">
                        <span className="aud-workflow-num-pill">{step.num}</span>
                        <div className="aud-workflow-clean-text">
                          <h4>{step.title}</h4>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </InView>

            </div>
          </div>
        </section>

        {/* ── §4 Sample Checklist Table ── */}
        <section className="aud-sol-detail-section" id="sample-checklist">
          <div className="aud-inner">
            <InView>
              <div className="aud-sol-detail-head">
                <h2>Sample Restaurant Audit Checklist</h2>
                <p>What an audit looks like inside Audiment for kitchen teams.</p>
              </div>
            </InView>

            <InView>
              <table className="aud-checklist-clean-table">
                <thead>
                  <tr>
                    <th style={{ width: '28%' }}>Area / Focus</th>
                    <th>Audit Question & Inspection Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleChecklist.map((item) => (
                    <tr key={item.area}>
                      <td className="aud-checklist-tag">{item.area}</td>
                      <td>{item.question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InView>
          </div>
        </section>

        {/* ── §5 FAQ Section (100% Identical to Homepage .faq Structure) ── */}
        <section className="faq" id="faq" style={{ marginTop: 0, borderTop: 'none' }}>
          <div className="faq-left">
            <h2>Frequently asked<br />questions.</h2>
            <p>Clear, honest answers<br />about restaurant audit software.</p>
          </div>
          <div className="accordions">
            {faqs.map((item, i) => (
              <details key={i}>
                <summary>
                  <span>{item.q}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── §6 CTA & Related Platform Topics (Spacious & Aligned) ── */}
        <section className="aud-sol-detail-section aud-sol-detail-section--paper">
          <div className="aud-inner">

            {/* CTA Box */}
            <InView>
              <div className="aud-article-cta-box" style={{ marginBottom: 80, padding: '72px 48px' }}>
                <h3>Ready to standardize audits across your restaurants?</h3>
                <p style={{ marginTop: 12, marginBottom: 32 }}>Book a discovery call to see how Audiment runs proof-based audits across every kitchen.</p>
                <div className="cta-btn-center">
                  <DotBtn id="aud-sol-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
                </div>
              </div>
            </InView>

            {/* Recommended Guide & Related Solutions */}
            <InView>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, marginBottom: 64, paddingTop: 16 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                    Recommended Guide
                  </span>
                  <a href="/audiment/blog/restaurant-audit-guide" className="aud-link-underline" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5 }}>
                    The Complete Guide to Restaurant Audits (2026)
                  </a>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                    Other Industry Solutions
                  </span>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <a href="/audiment/solutions/qsr-audit-software" className="aud-link-underline" style={{ fontSize: 15, fontWeight: 500 }}>
                      QSR Audit Software
                    </a>
                    <a href="/audiment/solutions/food-safety-audit-software" className="aud-link-underline" style={{ fontSize: 15, fontWeight: 500 }}>
                      Food Safety Software
                    </a>
                  </div>
                </div>
              </div>
            </InView>

            {/* Platform & Related Topics Cross-Links (Clean 3-Column Links Row) */}
            <InView>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>
                  Platform & Related Topics
                </h3>
              </div>
            </InView>

            <motion.div
              className="aud-sol-links-row"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              variants={stagger(0.06)}
            >
              {crossLinks.map((item) => (
                <motion.a key={item.title} href={item.href} className="aud-sol-link-item" variants={fadeUp}>
                  <span className="aud-sol-link-tag">{item.tag}</span>
                  <h4>
                    <span>{item.title}</span>
                    <ArrowRightIcon />
                  </h4>
                  <p>{item.description}</p>
                </motion.a>
              ))}
            </motion.div>

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
  root.render(<RestaurantAuditSoftwarePage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
