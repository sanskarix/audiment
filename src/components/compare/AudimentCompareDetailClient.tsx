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

export interface RelatedResource {
  title: string;
  href: string;
  category?: string;
  description?: string;
}

export interface RelatedComparison {
  title: string;
  href: string;
}

export interface CompareDetailProps {
  competitor: string;
  heroH1: string;
  heroSubtext?: string;
  quickVerdict?: {
    verdictSummary: string;
    audimentBestFor: string;
    competitorBestFor: string;
  };
  lastUpdated?: string;
  whereAudimentWins: { title: string; text: string }[];
  whoShouldChooseCompetitor: { title: string; text: string }[];
  migrationReality?: {
    timeline: string;
    effort: string;
    support: string;
  };
  operationalDifferences: {
    area: string;
    audiment: string;
    competitor: string;
  }[];
  operationalOutcomeDifference?: {
    title: string;
    text: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  path: string;
  variant?: 'clean' | 'default';
  relatedGuides?: RelatedResource[];
  relatedComparisons?: RelatedComparison[];
}

export function AudimentCompareDetailClient({
  competitor,
  heroH1,
  heroSubtext,
  quickVerdict,
  lastUpdated = 'October 2026',
  whereAudimentWins,
  whoShouldChooseCompetitor,
  migrationReality,
  operationalDifferences,
  operationalOutcomeDifference,
  faqs,
  variant = 'clean',
  relatedGuides,
  relatedComparisons,
}: CompareDetailProps) {
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
      <Header ctaId="aud-comp-nav-cta" />

      <main id="main-content" tabIndex={-1}>
        {/* ── §1 Hero Section (Exact Asellus .hero) ── */}
        <section className="hero">
          {variant !== 'clean' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 84, 0, 0.08)',
              border: '1px solid rgba(255, 84, 0, 0.22)',
              padding: '5px 12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--orange)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} />
              <span>VERIFIED COMPARISON • UPDATED {lastUpdated.toUpperCase()}</span>
            </div>
          )}
          <h1>
            {variant === 'clean' ? (
              <>
                Audiment vs <span className="muted">{competitor}</span>
              </>
            ) : heroH1.includes(' – ') ? (
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
          <p>
            {heroSubtext || `Evaluating ${competitor}? Here's a practical comparison focused on operational outcomes, rollout realities, and how each platform handles accountability.`}
          </p>
          <div className="actions">
            <DotBtn id="aud-comp-hero-cta" label="Book a Comparison Call" variant="orange" calAttrs={cal} />
            {quickVerdict && (
              <a className="button" href="#verdict" style={{ textDecoration: 'none' }}>
                Quick verdict
              </a>
            )}
            <a className="button" href="#differences" style={{ textDecoration: 'none' }}>
              See differences
            </a>
          </div>
        </section>

        {/* ── §1.5 Quick Verdict / Executive Summary (Direct Answer for Users & AEO) ── */}
        {quickVerdict && (
          <>
            <section className="intro" id="verdict">
              <div>
                <h2>
                  {variant === 'clean' ? (
                    <>
                      Executive summary <span className="muted">&amp; quick verdict</span>
                    </>
                  ) : (
                    <>
                      Executive summary<br />
                      &amp; quick <span className="aud-text-orange">verdict.</span>
                    </>
                  )}
                </h2>
                <p>
                  A direct comparison for operations directors evaluating {competitor} against Audiment for multi-location standards.
                </p>
              </div>
            </section>

            <section className="patterned" style={{ padding: '32px 24px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <article className="work-card" style={{ padding: '36px 32px', background: '#fff', marginBottom: '24px' }}>
                  {variant === 'clean' ? (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ color: 'var(--orange)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                        The Core Distinction
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ color: 'var(--orange)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                        // THE CORE DISTINCTION
                      </span>
                      <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 500 }}>
                        AI &amp; Search Consensus Guide
                      </span>
                    </div>
                  )}
                  <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)', margin: 0, fontWeight: 450 }}>
                    {quickVerdict.verdictSummary}
                  </p>
                </article>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                }}>
                  {/* Audiment Card */}
                  <article className="work-card" style={{
                    padding: '32px 28px',
                    background: '#faf9f6',
                    border: variant === 'clean' ? '1px solid var(--line)' : undefined,
                    borderLeft: variant === 'clean' ? '1px solid var(--line)' : '4px solid var(--orange)',
                  }}>
                    <span style={{ color: 'var(--orange)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                      Choose Audiment If
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--ink)' }}>
                      {quickVerdict.audimentBestFor}
                    </p>
                  </article>

                  {/* Competitor Card */}
                  <article className="work-card" style={{
                    padding: '32px 28px',
                    background: '#ffffff',
                    border: variant === 'clean' ? '1px solid var(--line)' : undefined,
                    borderLeft: variant === 'clean' ? '1px solid var(--line)' : '4px solid #888',
                  }}>
                    <span style={{ color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                      Choose {competitor} If
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--ink)' }}>
                      {quickVerdict.competitorBestFor}
                    </p>
                  </article>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── §2 Migration Reality (What switching actually looks like) ── */}
        {migrationReality && (
          <>
            <section className="intro" id="migration">
              <div>
                <h2>
                  {variant === 'clean' ? (
                    <>
                      What switching <span className="muted">actually looks like</span>
                    </>
                  ) : (
                    <>
                      What switching<br />
                      actually <span className="aud-text-orange">looks like.</span>
                    </>
                  )}
                </h2>
                <p>
                  Migrating to Audiment is fast and structured. Our team handles checklist conversion and location setup so you can run in parallel without downtime.
                </p>
              </div>
            </section>

            <section className="patterned" style={{ padding: '32px 24px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                maxWidth: '1200px',
                margin: '0 auto',
              }}>
                <article className="work-card" style={{
                  padding: '32px 24px',
                  background: '#fff',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '135px',
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.25,
                    color: 'var(--ink)',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    {migrationReality.timeline}
                  </span>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>
                    Typical rollout timeline
                  </p>
                </article>

                <article className="work-card" style={{
                  padding: '32px 24px',
                  background: '#fff',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '135px',
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.25,
                    color: 'var(--ink)',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    {migrationReality.effort}
                  </span>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>
                    Internal effort required
                  </p>
                </article>

                <article className="work-card" style={{
                  padding: '32px 24px',
                  background: '#fff',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '135px',
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.25,
                    color: 'var(--orange)',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    {migrationReality.support}
                  </span>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>
                    Onboarding support
                  </p>
                </article>
              </div>
            </section>
          </>
        )}

        {/* ── §3 How They Differ in Practice ── */}
        <section className="intro" id="differences">
          <div>
            <h2>
              {variant === 'clean' ? (
                <>
                  How they differ <span className="muted">in practice</span>
                </>
              ) : (
                <>
                  How they differ<br />
                  in <span className="aud-text-orange">practice.</span>
                </>
              )}
            </h2>
            <p>
              A side-by-side breakdown of how each platform handles the operational workflows that matter most to multi-location teams.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px 24px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Semantic Comparison Table */}
            <div style={{
              overflowX: 'auto',
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              marginBottom: '16px',
              boxShadow: variant === 'clean' ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.03)',
            }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
                {variant !== 'clean' && (
                  <caption style={{
                    textAlign: 'left',
                    padding: '12px 24px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    background: '#faf9f6',
                    borderBottom: '1px solid var(--line)',
                  }}>
                    Feature &amp; Operational Matrix: Audiment vs {competitor}
                  </caption>
                )}
                <thead>
                  <tr style={{ background: '#f7f6f3', borderBottom: '1px solid var(--line)' }}>
                    <th scope="col" style={{ padding: '20px 24px', fontWeight: 600, fontSize: '14.5px', color: 'var(--ink)', width: '25%', verticalAlign: 'middle' }}>
                      Operational Area
                    </th>
                    <th scope="col" style={{ padding: '20px 24px', fontWeight: 600, fontSize: '14.5px', color: 'var(--orange)', width: '37.5%', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Audiment</span>
                        <span style={{
                          background: 'rgba(255, 84, 0, 0.1)',
                          color: 'var(--orange)',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '3px'
                        }}>
                          Our Platform
                        </span>
                      </div>
                    </th>
                    <th scope="col" style={{ padding: '20px 24px', fontWeight: 600, fontSize: '14.5px', color: 'var(--ink)', width: '37.5%', verticalAlign: 'middle' }}>
                      {competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operationalDifferences.map((diff, i) => (
                    <tr key={i} style={{ borderBottom: i === operationalDifferences.length - 1 ? 'none' : '1px solid var(--line)' }}>
                      <th scope="row" style={{
                        padding: '24px 24px',
                        fontWeight: 600,
                        fontSize: '14.5px',
                        letterSpacing: '-0.01em',
                        color: 'var(--ink)',
                        verticalAlign: 'top',
                        lineHeight: 1.45,
                        background: '#faf9f6',
                        textAlign: 'left'
                      }}>
                        {diff.area}
                      </th>
                      <td style={{
                        padding: '24px 24px',
                        color: 'var(--ink)',
                        fontSize: '14.5px',
                        fontWeight: 400,
                        verticalAlign: 'top',
                        lineHeight: 1.68,
                        background: 'rgba(255, 84, 0, 0.025)'
                      }}>
                        {diff.audiment}
                      </td>
                      <td style={{
                        padding: '24px 24px',
                        color: 'var(--ink)',
                        fontSize: '14.5px',
                        fontWeight: 400,
                        verticalAlign: 'top',
                        lineHeight: 1.68,
                        background: '#ffffff'
                      }}>
                        {diff.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detailed Cards Breakdown */}
            {operationalDifferences.map((diff, i) => (
              <article
                key={diff.area}
                className="work-card"
                style={{ padding: '36px 32px', background: '#fff' }}
              >
                {variant === 'clean' ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                      {diff.area}
                    </h3>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ color: '#9a9a9a', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                      0{i + 1} // OPERATIONAL AREA
                    </span>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                      {diff.area}
                    </h3>
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}>
                  {/* Audiment Side */}
                  <div style={{
                    padding: '24px 24px',
                    background: '#faf9f6',
                    border: '1px solid var(--line)',
                    borderLeftWidth: variant === 'clean' ? '1px' : '3px',
                    borderLeftColor: variant === 'clean' ? 'var(--line)' : 'var(--orange)',
                  }}>
                    <span style={{ color: 'var(--orange)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Audiment
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--ink)' }}>
                      {diff.audiment}
                    </p>
                  </div>

                  {/* Competitor Side */}
                  <div style={{
                    padding: '24px 24px',
                    background: '#f8f8f8',
                    border: '1px solid var(--line)',
                    borderLeftWidth: variant === 'clean' ? '1px' : '3px',
                    borderLeftColor: variant === 'clean' ? 'var(--line)' : '#999',
                  }}>
                    <span style={{ color: '#444', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      {competitor}
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--ink)' }}>
                      {diff.competitor}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── §4 Operational Strengths & Fit ── */}
        <section className="intro">
          <div>
            <h2>
              {variant === 'clean' ? (
                <>
                  Operational strengths <span className="muted">&amp; platform fit</span>
                </>
              ) : (
                <>
                  Operational strengths<br />
                  &amp; platform <span className="aud-text-orange">fit.</span>
                </>
              )}
            </h2>
            <p>
              Choose the tool built for your operating model. Here is an honest appraisal of where each platform leads.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px 24px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Where Audiment is stronger */}
            <article className="work-card" style={{ padding: '40px 36px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255, 84, 0, 0.1)',
                  color: 'var(--orange)',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {variant === 'clean' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    '✓'
                  )}
                </span>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                  Where Audiment is stronger
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                {whereAudimentWins.map((win, idx) => (
                  <div key={idx}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                      {win.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--muted)' }}>
                      {win.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* When Competitor may be a better fit */}
            <article className="work-card" style={{ padding: '40px 36px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#f0f0f0',
                  color: '#555',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {variant === 'clean' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  ) : (
                    'ℹ'
                  )}
                </span>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                  When {competitor} may be a better fit
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                {whoShouldChooseCompetitor.map((con, idx) => (
                  <div key={idx}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                      {con.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: 'var(--muted)' }}>
                      {con.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* ── §5 Operational Outcome Difference (if present) ── */}
        {operationalOutcomeDifference && (
          <section style={{ padding: '80px 24px', background: '#fff', borderBottom: '1px solid var(--line)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <article className="work-card" style={{
                padding: '40px 36px',
                background: '#faf9f6',
                border: variant === 'clean' ? '1px solid var(--line)' : undefined,
                borderLeft: variant === 'clean' ? '1px solid var(--line)' : '4px solid var(--orange)',
              }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                  {operationalOutcomeDifference.title}
                </h3>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'var(--ink)' }}>
                  {operationalOutcomeDifference.text}
                </p>
              </article>
            </div>
          </section>
        )}

        {/* ── §6 Frequently Asked Questions (Universal Component) ── */}
        {faqs && faqs.length > 0 && (
          <FAQSection
            id="faq"
            style={{ borderTop: 'none' }}
            subtitle={<>Common questions when comparing Audiment to {competitor}.</>}
            faqs={faqs}
          />
        )}

        {/* ── §6.5 Related Industry Guides & Alternative Comparisons ── */}
        {((relatedGuides && relatedGuides.length > 0) || (relatedComparisons && relatedComparisons.length > 0)) && (
          <section style={{ padding: '80px 24px', background: '#faf9f6', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '30px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: '10px' }}>
                  Related Industry Guides &amp; Comparisons
                </h2>
                <p style={{ margin: 0, fontSize: '15.5px', color: 'var(--muted)', maxWidth: '680px', lineHeight: 1.6 }}>
                  Explore industry-specific inspection checklists, operational benchmarks, and alternative platform evaluations.
                </p>
              </div>

              {relatedGuides && relatedGuides.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: relatedComparisons && relatedComparisons.length > 0 ? '36px' : '0' }}>
                  {relatedGuides.map((guide, idx) => (
                    <a
                      key={idx}
                      href={guide.href}
                      className="work-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '24px 20px',
                        background: '#ffffff',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s ease, transform 0.2s ease',
                      }}
                    >
                      {guide.category && (
                        <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--orange)', marginBottom: '8px' }}>
                          {guide.category}
                        </span>
                      )}
                      <h3 style={{ fontSize: '16.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, margin: '0 0 8px' }}>
                        {guide.title}
                      </h3>
                      {guide.description && (
                        <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                          {guide.description}
                        </p>
                      )}
                      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                        <span>Read In-Depth Guide</span>
                        <span>→</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {relatedComparisons && relatedComparisons.length > 0 && (
                <div style={{ paddingTop: '28px', borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', display: 'block', marginBottom: '14px' }}>
                    Compare Other Alternatives to {competitor}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {relatedComparisons.map((comp, idx) => (
                      <a
                        key={idx}
                        href={comp.href}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '8px 14px',
                          background: '#ffffff',
                          border: '1px solid var(--line)',
                          borderRadius: '4px',
                          fontSize: '13.5px',
                          fontWeight: 500,
                          color: 'var(--ink)',
                          textDecoration: 'none',
                          transition: 'border-color 0.2s ease, color 0.2s ease',
                        }}
                      >
                        {comp.title} →
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── §7 Final CTA (Exact Asellus .center-head) ── */}
        <section className="center-head" style={{ borderTop: '1px solid var(--line)', padding: '110px 32px 120px' }}>
          <h2>See how they compare in your workflow</h2>
          <p style={{ marginTop: 14 }}>
            Walk through a live demo with our team. We&apos;ll map your existing audit process and show you exactly where the operational differences show up.
          </p>
          <div className="actions">
            <DotBtn id="aud-comp-bottom-cta" label="Book a Comparison Call" variant="orange" calAttrs={cal} />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer service="general" hideCta />
    </>
  );
}
