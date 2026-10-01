/**
 * Audiment Platform Page — Proof-Based Audits
 * /platform/proof-based-audits & /audiment/platform/proof-based-audits
 * Minimal, clean, and aligned editorial redesign adhering strictly to Asellus & Audiment Design Language.
 * Verbatim content sourced 100% from audiment-public-website/src/app/platform/proof-based-audits/page.tsx
 * Optimized for maximum reading comfort with 65-character line length, orange lead highlights, and clean paragraph breaks.
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

// ─── Data Objects (100% Verbatim Sourced from page.tsx) ───────────────────────

const heroData = {
  tag: 'PLATFORM FEATURE',
  title: 'Proof-Based Audits Across Every Location',
  subheadline: 'Every critical check requires evidence. No more trusting that a checklist means the work was done.',
};

const highlights = [
  { label: 'Verification', val: '100% Evidence-Backed' },
  { label: 'Camera Mode', val: 'Live Capture Only' },
  { label: 'Accountability', val: 'Automatic Task SLA' },
  { label: 'Field Ready', val: 'Zero App Download' },
];

const articleSections = [
  {
    num: '01',
    title: 'What is a proof-based audit?',
    lead: 'A proof-based audit requires evidence – live photos, timestamps, or on-site verification – on critical checks before they can be marked complete.',
    body: 'This means a completed checklist reflects what actually happened at the location, not what a manager assumed or remembered. Evidence is captured in the moment, linked to the specific check, and attached to the audit record for review and reference.',
    takeaways: [
      { title: 'In-the-Moment Capture', desc: 'Photos & timestamps recorded live during the audit walk.' },
      { title: 'Linked to Specific Check', desc: 'Evidence is permanently attached to the audit record for review.' },
    ],
  },
  {
    num: '02',
    title: 'Why it matters at scale',
    lead: 'At one or two locations, management can personally verify most standards. As you add locations, that direct oversight becomes impossible.',
    body: 'Without evidence requirements, reported compliance and actual compliance diverge – often gradually and invisibly. Standards drift while audit scores stay stable. Proof-based audits close that gap by making evidence a requirement, not an option.',
    takeaways: [
      { title: 'Impossible Oversight', desc: 'Direct personal management fails past 3+ locations.' },
      { title: 'Invisible Drift', desc: 'Reported scores stay 100% high while ground reality slips.' },
    ],
  },
  {
    num: '03',
    title: 'What fails without it',
    lead: 'Teams can mark tasks complete without doing the work – not necessarily out of dishonesty, but because self-reported checklists under time pressure tend toward optimism.',
    body: 'Issues stay hidden until a customer complaint or a failed inspection surfaces them. By that point, the drift has often been building for months across multiple locations.',
    takeaways: [
      { title: 'Unverified Optimism', desc: 'Time pressure forces staff to check boxes without doing the work.' },
      { title: 'Lagging Detection', desc: 'Drift builds for months before a complaint or inspection surfaces it.' },
    ],
  },
  {
    num: '04',
    title: 'How Audiment handles it',
    lead: 'Audiment requires live photo or video evidence on critical checks – captured through the app, not uploaded from a photo library.',
    body: 'Failed checks automatically generate tracked issues with assigned owners and due dates. Every audit creates a verifiable trail by location, auditor, and date that can be reviewed by area managers and leadership without site visits.',
    takeaways: [
      { title: 'Live Camera Capture', desc: 'No photo gallery uploads accepted for critical checks.' },
      { title: 'Automated Issue SLAs', desc: 'Failed checks create tracked tasks with assigned owners & deadlines.' },
    ],
  },
  {
    num: '05',
    title: 'Operational outcome',
    lead: 'Proof-based audits give you data you can trust.',
    body: 'Reliable data shows you where issues are recurring – so you catch problems before they escalate. Leadership can make resourcing and intervention decisions based on what is actually happening at each location rather than what is being reported.',
    takeaways: [
      { title: 'Early Risk Mitigation', desc: 'Identify recurring failures before they escalate into crisis.' },
      { title: 'Fact-Based Leadership', desc: 'Allocate resources based on verified ground reality.' },
    ],
  },
];

const faqs = [
  {
    q: 'Do proof-based audits slow teams down?',
    a: 'No. Evidence is required only on critical checks – typically 5–15% of checklist items. For a 50-item audit, that means approximately 5–8 photos. Most teams complete this in under 2 additional minutes. The efficiency impact is minimal; the accountability impact is significant.',
  },
  {
    q: 'Can staff upload old photos?',
    a: 'No. Audiment requires live camera capture – photos taken through the app at the time of the audit. Uploads from photo libraries are not accepted for critical checks. This prevents backdating and ensures evidence reflects the actual inspection moment.',
  },
  {
    q: 'Who uses proof-based audit data?',
    a: 'Store managers, area managers, and leadership use it at different levels. Store managers see their own audit performance. Area managers review evidence quality and recurring failures across their territory. Leadership uses aggregated data to identify systemic issues and allocation priorities.',
  },
  {
    q: 'What types of checks require evidence?',
    a: 'Evidence requirements are configured per checklist template. Typically, food safety temperatures, cleaning standards, safety compliance checks, and brand-critical execution require evidence. Routine administrative confirmations can remain as yes/no responses.',
  },
];

const relatedLinks = [
  { tag: 'Topic', title: 'Operational Drift', href: '/audiment/operational-drift', description: 'How standards drift silently without reliable audit data.' },
  { tag: 'Platform', title: 'Issue Tracking', href: '/audiment/platform/issue-tracking', description: 'What happens after issues are detected.' },
  { tag: 'Solutions', title: 'Restaurant Audit Software', href: '/audiment/solutions/restaurant-audit-software', description: 'Proof-based workflows for restaurant chains.' },
];

// ─── Component Implementation ────────────────────────────────────────────────

function ProofBasedAuditsPage() {
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
            <a href="/audiment/solutions">Solutions</a>
            <a href="/audiment/about">About</a>
            <a href="/audiment/blog">Blog</a>
            <a href="/audiment#faq">FAQ</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DotBtn id="aud-proof-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
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
              <a href="/audiment">Platform</a>
              <span>/</span>
              <span className="current">Proof-Based Audits</span>
            </nav>
            <a href="/audiment" className="aud-back-link">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      <main id="top">

        {/* ── §1 Hero Section ── */}
        <section className="aud-sol-detail-hero">
          <div className="aud-inner">
            <InView immediate>
              <div className="aud-sol-detail-hero-content">
                <h1>{heroData.title}</h1>
                <p className="aud-sol-detail-hero-sub">
                  {heroData.subheadline}
                </p>

                <div className="actions" style={{ justifyContent: 'flex-start', gap: 16 }}>
                  <DotBtn id="aud-proof-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
                  <a className="button" href="#article-start" style={{ textDecoration: 'none' }}>
                    Read Overview
                  </a>
                </div>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §2 Asellus 4-Item Highlights Bar ── */}
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

        {/* ── §3 Master 2-Column Split Editorial Grid (Maximum Readability) ── */}
        <section className="aud-sol-detail-section" id="article-start" style={{ background: 'var(--paper)', padding: '100px 32px' }}>
          <div className="aud-inner">

            <div className="aud-editorial-rows">
              {articleSections.map((sec) => (
                <InView key={sec.num}>
                  <div className="aud-editorial-row">
                    
                    {/* Left Sticky Column */}
                    <div className="aud-editorial-left">
                      <span className="aud-editorial-num">{sec.num}</span>
                      <h2>{sec.title}</h2>
                    </div>

                    {/* Right Content Column */}
                    <div className="aud-editorial-right">
                      <p className="aud-editorial-lead">{sec.lead}</p>
                      <p className="aud-editorial-body">{sec.body}</p>
                    </div>

                  </div>
                </InView>
              ))}
            </div>

          </div>
        </section>

        {/* ── §4 FAQ Section (100% Homepage Style) ── */}
        <section className="faq" id="faq" style={{ marginTop: 0, borderTop: 'none' }}>
          <div className="faq-left">
            <h2>Frequently asked<br />questions.</h2>
            <p>Clear, honest answers<br />about proof-based audits.</p>
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

        {/* ── §5 Cross-Industry Dark CTA Box ── */}
        <section className="aud-solutions-cta-section">
          <div className="aud-inner">
            <InView>
              <div className="aud-solutions-cta-box">
                <div className="aud-solutions-cta-content">
                  <h2>Ready to verify execution across your locations?</h2>
                  <p>
                    Book a discovery call to see how Audiment runs proof-based audits across every team.
                  </p>
                  <div className="aud-solutions-cta-btn-wrap">
                    <DotBtn
                      id="aud-proof-cta-btn"
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

        {/* ── §6 Platform & Related Topics Links ── */}
        <section className="aud-sol-detail-section aud-sol-detail-section--paper">
          <div className="aud-inner">
            <InView>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>
                  Platform & Related Topics
                </h3>
              </div>
            </InView>

            {/* 3 Related Links Row */}
            <motion.div
              className="aud-sol-links-row"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              variants={stagger(0.06)}
            >
              {relatedLinks.map((item) => (
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
  root.render(<ProofBasedAuditsPage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
