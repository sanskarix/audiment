'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { FAQSection } from '@/components/website/FAQSection';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

// ─── Inline SVG Line-Art Icons ───────────────────────────────────────────────

const IconSVG: React.FC<{ index?: number; className?: string }> = ({ index = 0, className = 'w-5 h-5' }) => {
  switch (index % 4) {
    case 0:
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case 1:
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 2:
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
    default:
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
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

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface UseCaseDetailProps {
  title: string;
  heroH1: string;
  heroSubheadline: string;
  primaryKeyword: string;
  features: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  operationalScenario?: {
    title: string;
    before: string;
    after: string;
  };
  path: string;
}

export function AudimentUseCaseDetailClient({
  title,
  heroH1,
  heroSubheadline,
  primaryKeyword,
  features,
  benefits,
  faqs,
  operationalScenario,
}: UseCaseDetailProps) {
  const cal = getCalAttributes('general');

  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let t1: ReturnType<typeof setTimeout> | undefined;

    const onLoad = () => ScrollTrigger.refresh();

    const initHeavy = () => {
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      ticker = (time: number) => {
        if (lenis) lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      observeDotBorderButtons();
      observeAnimations();
      initCalEmbed();

      t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
      window.addEventListener('load', onLoad);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHeavy, { timeout: 1200 });
    } else {
      setTimeout(initHeavy, 300);
    }

    return () => {
      if (t1) clearTimeout(t1);
      window.removeEventListener('load', onLoad);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Fixed vertical guide lines matching Asellus ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
      <Header activeNav="use-cases" ctaId="aud-uc-nav-cta" />


      <main id="main-content" tabIndex={-1}>
        {/* ── §1 Hero Section ── */}
        <section className="hero">
          <h1>
            {heroH1.includes(' – ') ? (
              <>
                {heroH1.split(' – ')[0]} <span className="muted">– {heroH1.split(' – ').slice(1).join(' – ')}</span>
              </>
            ) : heroH1.includes(' - ') ? (
              <>
                {heroH1.split(' - ')[0]} <span className="muted">- {heroH1.split(' - ').slice(1).join(' - ')}</span>
              </>
            ) : (
              heroH1
            )}
          </h1>
          <p>{heroSubheadline}</p>
          <div className="actions">
            <DotBtn id="aud-uc-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
            <a className="button" href="#capabilities" style={{ textDecoration: 'none' }}>
              Explore capabilities
            </a>
          </div>
        </section>

        {/* ── §2 Core Capabilities ── */}
        <section className="intro" id="capabilities">
          <div>
            <h2>
              How Audiment handles<br />
              <span className="aud-text-orange">{primaryKeyword}.</span>
            </h2>
            <p>
              The operational capabilities that make the difference between knowing what happened and guessing.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {features.map((opt, idx) => (
              <article key={idx} className="work-card" style={{ padding: '36px 32px', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    background: '#faf9f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ink)',
                  }}>
                    <IconSVG index={idx} />
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--orange)' }}>
                    0{idx + 1} // CAPABILITY
                  </span>
                </div>
                <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
                  {opt.title}
                </h3>
                <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.7, color: 'var(--muted)' }}>
                  {opt.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── §3 Operational Scenario (Before & After) ── */}
        {operationalScenario && (
          <>
            <section className="intro">
              <div>
                <h2>
                  Operational scenario<br />
                  &amp; verified <span className="aud-text-orange">impact.</span>
                </h2>
                <p>
                  {operationalScenario.title}
                </p>
              </div>
            </section>

            <section className="patterned" style={{ padding: '32px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
                maxWidth: '1200px',
                margin: '0 auto',
              }}>
                {/* Without Audiment */}
                <article className="work-card" style={{
                  padding: '40px 36px',
                  background: '#fafafa',
                  borderLeft: '3px solid #dc2626',
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#dc2626',
                    marginBottom: '16px',
                  }}>
                    Without Audiment
                  </span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: '#444' }}>
                    {operationalScenario.before}
                  </p>
                </article>

                {/* With Audiment */}
                <article className="work-card" style={{
                  padding: '40px 36px',
                  background: '#fff',
                  borderLeft: '3px solid var(--orange)',
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--orange)',
                    marginBottom: '16px',
                  }}>
                    With Audiment
                  </span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'var(--ink)' }}>
                    {operationalScenario.after}
                  </p>
                </article>
              </div>
            </section>
          </>
        )}

        {/* ── §4 Benefits Section ── */}
        <section className="intro">
          <div>
            <h2>
              The operational<br />
              <span className="aud-text-orange">advantage.</span>
            </h2>
            <p>
              What changes when you move from checking boxes to verifying execution.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {benefits.map((point, idx) => (
              <article key={idx} className="work-card" style={{ padding: '36px 32px', background: '#fff' }}>
                <span style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: '14px',
                }}>
                  0{idx + 1} // OPERATIONAL OUTCOME
                </span>
                <h3 style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
                  {point.title}
                </h3>
                <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--muted)' }}>
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── §5 FAQ Section (Universal Component) ── */}
        {faqs && faqs.length > 0 && (
          <FAQSection
            id="faq"
            style={{ borderTop: 'none' }}
            subtitle={<>Clear, honest answers about {primaryKeyword}.</>}
            faqs={faqs}
          />
        )}

        {/* ── §6 Final CTA Section ── */}
        <section className="center-head" style={{ borderTop: '1px solid var(--line)', padding: '110px 32px 120px' }}>
          <h2>See how this works for your operation</h2>
          <p style={{ marginTop: 14 }}>
            Walk through a live demo with our team. We&apos;ll map your current workflow and show you exactly where Audiment fits.
          </p>
          <div className="actions">
            <DotBtn id="aud-uc-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer service="general" hideCta />
    </>
  );
}
