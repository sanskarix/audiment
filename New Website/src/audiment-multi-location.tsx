/**
 * Audiment Use Case / Topic Page — Multi-Location Audit Software
 * /audiment/multi-location-audit-software
 * Minimal, clean, and aligned editorial redesign adhering strictly to Asellus & Audiment Design Language.
 * Verbatim content sourced 100% from audiment-public-website/src/app/multi-location-audit-software/page.tsx
 * Implements `.aud-editorial-rows` for deep-dive text sections.
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

// ─── Data Objects (100% Verbatim) ─────────────────────────────────────────────

const sections = [
  {
    title: 'What multi-location audit software does',
    content: 'It standardizes audits. It captures proof and tracks issue resolution across all sites from one system.'
  },
  {
    title: 'Why operations teams need it',
    content: 'As locations increase, manual oversight weakens. Tracking issues across sites becomes harder.'
  },
  {
    title: 'What fails without it',
    content: 'Operational drift grows. Compliance becomes reactive. Accountability depends on manual follow-up.'
  },
  {
    title: 'How Audiment solves it',
    content: 'Audiment combines proof-based audits, issue tracking, and corrective actions. This creates reliable execution signals and clear follow-through.'
  },
  {
    title: 'Operational outcome',
    content: 'Teams keep standards consistent across locations. They detect issues earlier and verify corrective actions.'
  }
];

const faqs = [
  {
    question: 'Who is this built for?',
    answer: 'It is built for multi-location businesses. It helps manage quality and compliance across distributed teams.'
  },
  {
    question: 'Can we start with a subset of locations?',
    answer: 'Yes. Most teams begin with a pilot group. They expand after verifying the workflow.'
  },
  {
    question: 'How is this different from basic checklist apps?',
    answer: 'Audiment focuses on proof-based execution, tracking issues, and corrective-action accountability at scale.'
  }
];

const relatedLinks = [
  { tag: 'Platform', title: 'Proof-Based Audits', href: '/audiment/platform/proof-based-audits', description: 'Verify audit evidence across locations.' },
  { tag: 'Topic', title: 'Operational Drift', href: '/audiment/operational-drift', description: 'Why standards weaken silently at scale.' },
  { tag: 'Compare', title: 'Audiment vs Checklist Apps', href: '/audiment/compare/audiment-vs-checklist-apps', description: 'Why basic checklist tools break at scale.' }
];

// ─── Component Implementation ────────────────────────────────────────────────

function MultiLocationAuditPage() {
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
            <a href="/audiment/use-cases">Use cases</a>
            <a href="/audiment/solutions">Solutions</a>
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
              <a href="/audiment/use-cases">Use Cases</a>
              <span>/</span>
              <span className="current">Multi-Location Audit Software</span>
            </nav>
          </div>
        </div>
      </div>

      <main id="top">

        {/* ── §1 Hero Section (Spacious & Clean) ── */}
        <section className="aud-sol-detail-hero">
          <div className="aud-inner">
            <InView immediate>
              <div className="aud-sol-detail-hero-content">
                <h1>Audit Software for Multi-Location Operations</h1>
                <p className="aud-sol-detail-hero-sub">
                  Audiment helps distributed teams maintain quality consistency and accountability as location count grows.
                </p>

                <div className="actions" style={{ justifyContent: 'flex-start', gap: 16 }}>
                  <DotBtn id="aud-sol-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
                </div>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §2 Editorial Rows (Deep Dive Content) ── */}
        <section className="aud-sol-detail-section aud-sol-detail-section--paper">
          <div className="aud-inner">
            <div className="aud-editorial-rows">
              {sections.map((section, idx) => (
                <InView key={idx}>
                  <div className="aud-editorial-row">
                    <div className="aud-editorial-row-sticky">
                      <h3>{section.title}</h3>
                    </div>
                    <div className="aud-editorial-row-content">
                      <p>{section.content}</p>
                    </div>
                  </div>
                </InView>
              ))}
            </div>
          </div>
        </section>

        {/* ── §3 FAQ Section (100% Identical to Homepage .faq Structure) ── */}
        <section className="faq" id="faq" style={{ marginTop: 0, borderTop: 'none', borderBottom: '1px solid var(--border)', paddingBottom: 120 }}>
          <div className="faq-left">
            <h2>Frequently asked<br />questions.</h2>
            <p>Clear, honest answers<br />about multi-location audits.</p>
          </div>
          <div className="accordions">
            {faqs.map((item, i) => (
              <details key={i}>
                <summary>
                  <span>{item.question}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── §4 CTA & Related Topics (Spacious & Aligned) ── */}
        <section className="aud-sol-detail-section">
          <div className="aud-inner">

            {/* CTA Box */}
            <InView>
              <div className="aud-article-cta-box" style={{ marginBottom: 80, padding: '72px 48px' }}>
                <h3>Ready to standardize audits across your locations?</h3>
                <p style={{ marginTop: 12, marginBottom: 32 }}>Book a discovery call to see how Audiment runs proof-based audits across every site.</p>
                <div className="cta-btn-center">
                  <DotBtn id="aud-sol-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
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
  root.render(<MultiLocationAuditPage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
