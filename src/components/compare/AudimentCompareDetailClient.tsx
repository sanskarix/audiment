'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
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

export interface CompareDetailProps {
  competitor: string;
  heroH1: string;
  heroSubtext?: string;
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
}

export function AudimentCompareDetailClient({
  competitor,
  heroH1,
  heroSubtext,
  whereAudimentWins,
  whoShouldChooseCompetitor,
  migrationReality,
  operationalDifferences,
  operationalOutcomeDifference,
  faqs,
}: CompareDetailProps) {
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
      <Header ctaId="aud-comp-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section (Exact Asellus .hero) ── */}
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
            ) : heroH1.split(' ').length > 2 ? (
              <>
                {heroH1.split(' ').slice(0, Math.ceil(heroH1.split(' ').length / 2)).join(' ')}{' '}
                <span className="muted">{heroH1.split(' ').slice(Math.ceil(heroH1.split(' ').length / 2)).join(' ')}</span>
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
            <a className="button" href="#differences" style={{ textDecoration: 'none' }}>
              See differences
            </a>
          </div>
        </section>

        {/* ── §2 Migration Reality (What switching actually looks like) ── */}
        {migrationReality && (
          <>
            <section className="intro" id="migration">
              <div>
                <h2>
                  What switching<br />
                  actually <span className="aud-text-orange">looks like.</span>
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
              How they differ<br />
              in <span className="aud-text-orange">practice.</span>
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
            {/* Semantic Comparison Table for AI Search Crawlers & Rapid Scanning */}
            <div style={{
              overflowX: 'auto',
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              marginBottom: '16px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
            }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
                <thead>
                  <tr style={{ background: '#f7f6f3', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: '14.5px', color: 'var(--ink)', width: '25%', verticalAlign: 'middle' }}>
                      Operational Area
                    </th>
                    <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: '14.5px', color: 'var(--orange)', width: '37.5%', verticalAlign: 'middle' }}>
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
                    <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: '14.5px', color: 'var(--ink)', width: '37.5%', verticalAlign: 'middle' }}>
                      {competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operationalDifferences.map((diff, i) => (
                    <tr key={i} style={{ borderBottom: i === operationalDifferences.length - 1 ? 'none' : '1px solid var(--line)' }}>
                      <td style={{
                        padding: '24px 24px',
                        fontWeight: 600,
                        fontSize: '14.5px',
                        letterSpacing: '-0.01em',
                        color: 'var(--ink)',
                        verticalAlign: 'top',
                        lineHeight: 1.45,
                        background: '#faf9f6'
                      }}>
                        {diff.area}
                      </td>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#9a9a9a', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                    0{i + 1} // OPERATIONAL AREA
                  </span>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                    {diff.area}
                  </h3>
                </div>

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
                    borderLeftWidth: '3px',
                    borderLeftColor: 'var(--orange)',
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
                    borderLeftWidth: '3px',
                    borderLeftColor: '#999',
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
              Operational strengths<br />
              &amp; platform <span className="aud-text-orange">fit.</span>
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
                  ✓
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
                  ℹ
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
              <article className="work-card" style={{ padding: '40px 36px', background: '#faf9f6', borderLeft: '4px solid var(--orange)' }}>
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

        {/* ── §6 Frequently Asked Questions (Exact Asellus /audiment .faq style) ── */}
        <section className="faq" id="faq" style={{ borderTop: 'none' }}>
          <div className="faq-left">
            <h2>Frequently asked<br />questions.</h2>
            <p>Common questions when comparing Audiment to {competitor}.</p>
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
