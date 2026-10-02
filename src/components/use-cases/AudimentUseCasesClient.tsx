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

// ─── Inline SVG Line-Art Icons (Crisp, Fixed 20x20 matching Asellus) ────────

const IconSVG: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'clipboardCheck':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case 'search':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'mapPin':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'shieldCheck':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
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
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const stagger = (delay = 0.08): any => ({
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

// ─── Verbatim Data (100% sourced from audiment-public-website use-cases/page.tsx) ───

const useCasesData = [
  {
    num: '01',
    title: 'Digital Audit Checklists',
    description: 'Replace paper checklists with photo-verified, conditional-logic forms that show you what actually happened – not what someone claims happened.',
    href: '/use-cases/audit-checklist-software',
    iconKey: 'clipboardCheck',
  },
  {
    num: '02',
    title: 'Inspection Management',
    description: 'Schedule, execute, and track inspections across all locations. GPS verification and live photo evidence confirm on-site execution.',
    href: '/use-cases/inspection-management-software',
    iconKey: 'search',
  },
  {
    num: '03',
    title: 'Multi-Location Compliance',
    description: 'Get verified compliance data from every branch without being there. Dashboards, corrective actions, and trend alerts keep you on top of standards.',
    href: '/use-cases/multi-location-compliance',
    iconKey: 'mapPin',
  },
  {
    num: '04',
    title: 'Corrective Action Tracking',
    description: 'Auto-generated tasks with SLA deadlines and photo-proof closure keep every issue on track from detection to resolution.',
    href: '/use-cases/corrective-action-tracking',
    iconKey: 'shieldCheck',
  },
];

export function AudimentUseCasesClient() {
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
      <Header activeNav="use-cases" ctaId="aud-usecases-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section (Identical to Audiment Solutions & About Hero) ── */}
        <section className="aud-solutions-hero">
          <div className="aud-inner">
            <InView immediate>
              <div className="aud-solutions-hero-head">
                <h1>
                  How operations teams<br />
                  <span className="muted">use Audiment.</span>
                </h1>
                <p className="aud-solutions-hero-sub">
                  Every multi-location business faces the same challenge: maintaining consistent standards at scale. These use cases show how Audiment solves the specific operational problems that get worse as you add locations.
                </p>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §2 4 Core Use Cases Grid (Connected Asellus Architectural Grid) ── */}
        <section className="aud-solutions-section" style={{ background: 'var(--paper)', borderBottom: 'none', padding: '90px 32px 110px' }}>
          <div className="aud-inner">
            <motion.div
              className="aud-usecases-grid-connected"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              variants={stagger(0.08)}
            >
              {useCasesData.map((useCase) => (
                <motion.div
                  key={useCase.title}
                  variants={fadeUp}
                  style={{ display: 'flex' }}
                >
                  <Link
                    href={useCase.href}
                    className="aud-usecases-grid-cell"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    {/* Top Bar: Icon + Number */}
                    <div className="aud-usecases-grid-cell-top">
                      <div className="aud-card-icon">
                        <IconSVG type={useCase.iconKey} />
                      </div>
                      <span className="aud-usecase-num">{useCase.num}</span>
                    </div>

                    {/* Title */}
                    <h3>{useCase.title}</h3>

                    {/* Verbatim Description */}
                    <p>{useCase.description}</p>

                    {/* Learn More Link */}
                    <div className="aud-usecase-link">
                      <span>Learn more</span>
                      <ArrowRightIcon />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── §3 Verbatim CTA Section (Asellus .aud-solutions-cta-box) ── */}
        <section className="aud-solutions-cta-section">
          <div className="aud-inner">
            <InView>
              <div className="aud-solutions-cta-box">
                <div className="aud-solutions-cta-content">
                  <h2>See Audiment in action</h2>
                  <p>
                    Tell us your operational challenge. We&apos;ll show you exactly how Audiment solves it for your team.
                  </p>
                  <div className="aud-solutions-cta-btn-wrap">
                    <DotBtn
                      id="aud-usecases-cta-bottom"
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
      <Footer service="general" hideCta />
    </>
  );
}
