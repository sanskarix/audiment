'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/new-website/Footer';
import { Header } from '@/components/new-website/Header';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

// ─── Inline SVG Line-Art Icons ───────────────────────────────────────────────

const IconSVG: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'scale':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case 'barChart':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      );
    case 'zap':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'wrench':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'fileText':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      );
    default:
      return null;
  }
};

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

// ─── Verbatim Comparisons Data (From origin/main compare/page.tsx) ──────────

const comparisonsData = [
  {
    num: '01',
    title: 'Audiment vs SafetyCulture (iAuditor)',
    description: 'How Audiment compares on evidence verification, corrective action workflows, and multi-location audit oversight.',
    href: '/compare/audiment-vs-safetyculture',
    iconKey: 'scale',
    isWide: false,
  },
  {
    num: '02',
    title: 'Audiment vs GoAudits',
    description: 'Compare evidence collection, corrective action accountability, and audit reliability for multi-location operations.',
    href: '/compare/audiment-vs-goaudits',
    iconKey: 'barChart',
    isWide: false,
  },
  {
    num: '03',
    title: 'Audiment vs Zenput (Crunchtime)',
    description: 'Deployment speed, FSSAI compliance support, and execution verification for APAC operations.',
    href: '/compare/audiment-vs-zenput',
    iconKey: 'zap',
    isWide: false,
  },
  {
    num: '04',
    title: 'Audiment vs Jolt',
    description: 'Hardware requirements, multi-location scope, and corrective action escalation workflows compared.',
    href: '/compare/audiment-vs-jolt',
    iconKey: 'wrench',
    isWide: false,
  },
  {
    num: '05',
    title: 'Audiment vs Checklist Apps',
    description: 'Why generic checklist apps break at scale and how proof-based audits create operational accountability.',
    href: '/compare/audiment-vs-checklist-apps',
    iconKey: 'fileText',
    isWide: true,
  },
];

export function AudimentCompareClient() {
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
      {/* ── Fixed vertical guide lines matching Asellus ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
      <Header ctaId="aud-compare-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section (Exact Asellus .hero) ── */}
        <section className="hero">
          <h1>Compare <span className="muted">audit software</span></h1>
          <p>
            Every audit platform handles checklists. The differences that matter are in evidence quality, corrective action accountability, and multi-location visibility. See how Audiment compares.
          </p>
          <div className="actions">
            <DotBtn id="aud-compare-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
          </div>
        </section>

        {/* ── §2 Comparison Cards Grid (Asellus .work-grid.patterned) ── */}
        <section className="work-grid patterned" id="comparisons" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {comparisonsData.map((comp) => (
            <Link
              key={comp.title}
              href={comp.href}
              className={`work-card ${comp.isWide ? 'work-card--wide' : ''} three-areas-card-wrapper`}
              style={{
                padding: comp.isWide ? '48px 44px' : '40px 36px',
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
                    {comp.num} // COMPARE
                  </span>
                  <div style={{ color: 'var(--orange)', display: 'flex', alignItems: 'center' }}>
                    <IconSVG type={comp.iconKey} className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h2 style={{
                  margin: '0 0 14px',
                  fontSize: comp.isWide ? '26px' : '21px',
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.25,
                  color: 'var(--ink)',
                }}>
                  {comp.title}
                </h2>

                {/* Verbatim Description */}
                <p style={{
                  margin: '0 0 28px',
                  color: 'var(--muted)',
                  fontSize: comp.isWide ? '16px' : '14.5px',
                  lineHeight: 1.68,
                  maxWidth: comp.isWide ? '820px' : '100%',
                }}>
                  {comp.description}
                </p>
              </div>

              {/* Asellus ThreeAreas link */}
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <span className="service-link three-areas-link" style={{ margin: 0 }}>
                  Read Comparison →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* ── §3 Bottom CTA Section (Exact Asellus .center-head) ── */}
        <section className="center-head" style={{ borderTop: 'none', padding: '110px 32px 120px' }}>
          <h2>Ready to see how Audiment works?</h2>
          <p style={{ marginTop: 14 }}>
            Book a discovery call and we&apos;ll walk you through how Audiment fits your specific operations.
          </p>
          <div className="actions">
            <DotBtn id="aud-compare-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer service="general" hideCta />
    </>
  );
}
