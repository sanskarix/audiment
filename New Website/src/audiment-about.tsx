/**
 * Audiment About Page — /audiment/about
 * Content sourced verbatim from audiment-public-website:
 * - src/app/about/page.tsx
 * Minimal, clean, and spacious styling consistent with Asellus design system.
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Footer } from './components/Footer';
import { observeDotBorderButtons } from './lib/dotBorder';
import { observeAnimations } from './lib/animations';
import { initCalEmbed, getCalAttributes } from './lib/cal';
import './style.css';
import './audiment.css';

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1] },
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

// ─── Dot-border button ────────────────────────────────────────────────────────

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

// ─── Data (100% Verbatim from audiment-public-website) ─────────────────────────

const whatAudimentDoes = [
  {
    num: '01',
    title: 'Proof-based audits',
    desc: 'Critical checks require photo or video evidence before they can be marked complete.',
  },
  {
    num: '02',
    title: 'Issue tracking',
    desc: 'Failed standards become tracked issues so you can see what\'s broken and where.',
  },
  {
    num: '03',
    title: 'Corrective actions',
    desc: 'Every failure becomes an assigned task with a deadline and proof of closure.',
  },
  {
    num: '04',
    title: 'Trend detection',
    desc: 'See which locations keep scoring low and where the same issues keep recurring.',
  },
  {
    num: '05',
    title: 'Offline audits',
    desc: 'Audits run offline and sync automatically when the device reconnects.',
  },
  {
    num: '06',
    title: 'Geo-verification',
    desc: 'Confirm that auditors were physically on-site when audits were completed.',
  },
];

const industries = [
  'Quick service restaurants (QSR) and restaurant chains',
  'Retail chains and multi-store operations',
  'Hotels and hospitality groups',
  'Franchise networks',
  'Food safety and FSSAI compliance',
  'Manufacturing and production facilities',
  'Healthcare and multi-facility quality management',
];

// ─── Audiment About Page Component ───────────────────────────────────────────

function AudimentAboutPage() {
  const cal = getCalAttributes('general');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('hello@audiment.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      {/* ── Vertical guide lines matching Asellus ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
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
            <a href="/audiment/about" className="active" style={{ color: 'var(--ink)', fontWeight: 600 }}>About</a>
            <a href="/audiment/blog">Blog</a>
            <a href="/audiment#faq">FAQ</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DotBtn id="aud-about-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
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

        {/* ── §1 Hero Section (Minimal & Spacious) ── */}
        <section className="aud-about-hero-clean">
          <div className="aud-inner">
            <InView immediate>
              <h1>About Audiment</h1>
              <p className="aud-about-hero-sub">
                Audit management software for multi-location businesses.
              </p>
            </InView>
          </div>
        </section>

        {/* ── §2 Why Operations Break & Why Self-Reporting Fails (Editorial 2-Col Grid) ── */}
        <section className="aud-about-section">
          <div className="aud-inner">
            <div className="aud-about-duo-grid">

              <InView>
                <div className="aud-about-duo-col">
                  <h2>Why multi-location operations break as they scale</h2>
                  <div className="aud-about-prose">
                    <p>
                      When you had one or two locations, you could see everything yourself. At 20 or 200, you can't. Standards drift, managers self-report, issues stay hidden, and problems surface too late.
                    </p>
                    <p>
                      The companies that maintain quality consistency at scale don't do it through more oversight or more reports. They do it by building execution systems that verify standards are being met – not trust-based systems that assume they are.
                    </p>
                  </div>
                </div>
              </InView>

              <InView>
                <div className="aud-about-duo-col">
                  <h2>Why self-reporting fails in distributed teams</h2>
                  <div className="aud-about-prose">
                    <p>
                      A completed checklist doesn't prove a standard was actually met. Without photo evidence and tracked follow-through, reports can look healthy while quality is slipping. This isn't a motivation problem – it's a system problem.
                    </p>
                    <p>
                      Under shift pressure, managers make rational short-term decisions. They complete audits from memory. They mark checks done that they believe were done. Over weeks and months, these small inaccuracies compound into a significant gap between reported performance and actual performance.
                    </p>
                  </div>
                </div>
              </InView>

            </div>
          </div>
        </section>

        {/* ── §3 What Audiment is built to do (Clean Minimalist Grid) ── */}
        <section className="aud-about-section aud-about-section--alt" id="what-it-does">
          <div className="aud-inner">
            <InView>
              <div className="aud-about-head">
                <h2>What Audiment is built to do</h2>
                <p>
                  Audiment helps you run audits across every location with proof, tracking, and accountability.
                </p>
              </div>
            </InView>

            {/* Unified 3-column minimal grid */}
            <motion.div
              className="aud-about-pillars-clean"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger(0.06)}
            >
              {whatAudimentDoes.map((item) => (
                <motion.div
                  key={item.num}
                  className="aud-about-pillar-clean-item"
                  variants={fadeUp}
                >
                  <span className="aud-pillar-num">{item.num}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Deeper Context Note */}
            <InView>
              <div className="aud-about-clean-context">
                <p>
                  For deeper context, see{' '}
                  <a href="/audiment#features" className="aud-link-underline">operational drift</a>,{' '}
                  <a href="/audiment#features" className="aud-link-underline">proof-based audits</a>, and{' '}
                  <a href="/audiment#features" className="aud-link-underline">corrective actions</a>.
                </p>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §4 Who it is for & Industries served (Balanced 2-Column Section) ── */}
        <section className="aud-about-section">
          <div className="aud-inner">
            <div className="aud-about-split-grid">

              {/* Left Column: Who it is for */}
              <InView>
                <div className="aud-about-split-col">
                  <h2>Who it is for</h2>
                  <div className="aud-about-prose">
                    <p>
                      Audiment is built for founders and operations teams who run multi-location businesses and need to know what's actually happening on the ground.
                    </p>
                    <div className="aud-about-highlight-callout">
                      <p>
                        The strongest fit is businesses with <strong>10–500+ locations</strong> that can't rely on paper checklists and WhatsApp threads to maintain standards.
                      </p>
                    </div>
                    <p>
                      Operations leaders, area managers, quality teams, and compliance managers use Audiment to standardize what gets audited, verify that it's actually done, and close issues before they escalate.
                    </p>
                  </div>
                </div>
              </InView>

              {/* Right Column: Industries served */}
              <InView>
                <div className="aud-about-split-col">
                  <h2>Industries served</h2>
                  <ul className="aud-about-industry-clean-list">
                    {industries.map((ind, i) => (
                      <li key={i}>
                        <span className="aud-bullet-dash">–</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </InView>

            </div>
          </div>
        </section>

        {/* ── §5 Built by Asellus LLP & Get in touch ── */}
        <section className="aud-about-section aud-about-section--alt">
          <div className="aud-inner">
            <div className="aud-about-footer-info-grid">

              {/* Pedigree note */}
              <InView>
                <div className="aud-about-info-col">
                  <h2>Built by Asellus LLP</h2>
                  <p>
                    Audiment is developed by Asellus LLP, an India-based technology company focused on operational software for distributed businesses. The platform runs in any mobile browser with no app download required – designed for field teams who need to run audits quickly and reliably across locations.
                  </p>
                </div>
              </InView>

              {/* Contact card */}
              <InView>
                <div className="aud-about-info-col">
                  <h2>Get in touch</h2>
                  <p>
                    For inquiries, demos, or partnership discussions:
                  </p>
                  <div className="aud-about-contact-simple">
                    <div className="aud-contact-row">
                      <span className="aud-contact-label">Email:</span>
                      <a href="mailto:hello@audiment.in" className="aud-contact-email-link">
                        hello@audiment.in
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className={`aud-simple-copy-btn ${copied ? 'copied' : ''}`}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <DotBtn
                        id="aud-about-cta-simple"
                        label="Book a Demo"
                        variant="orange"
                        calAttrs={cal}
                      />
                    </div>
                  </div>
                </div>
              </InView>

            </div>
          </div>
        </section>

      </main>

      {/* ── Global Footer ── */}
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
  root.render(<AudimentAboutPage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
