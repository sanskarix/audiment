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

// ─── Inline SVG Line-Art Icons ───────────────────────────────────────────────

const IconSVG: React.FC<{ type?: string; index?: number; className?: string }> = ({ type, index = 0, className = 'w-5 h-5' }) => {
  const iconType = type || (index === 0 ? 'utensils' : index === 1 ? 'shieldCheck' : 'eye');

  switch (iconType) {
    case 'utensils':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
          <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15zm0 0 7 7" />
          <path d="m2.1 21.8 6.4-6.3" />
          <path d="m19 5-7 7" />
        </svg>
      );
    case 'shieldCheck':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'eye':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'store':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
          <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" />
          <path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
        </svg>
      );
    case 'checkSquare':
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    default:
      return (
        <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
};

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
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

// ─── Interface ───────────────────────────────────────────────────────────────

export interface SolutionDetailClientProps {
  industry: string;
  heroH1: string;
  heroSubheadline: string;
  painPoints: { title: string; description: string }[];
  features: { title: string; description: string }[];
  sampleChecklist: { area: string; question: string }[];
  faqs: { question: string; answer: string }[];
  relatedBlogLink?: string;
  relatedBlogTitle?: string;
  relatedIndustryLinks?: { title: string; href: string }[];
  workflowSteps?: { title: string; description: string }[];
  operationalBottlenecks?: string[];
  breadcrumbLabel?: string;
  canonicalPath?: string;
  crossLinks?: { title: string; href: string; description: string; tag?: string }[];
}

export function AudimentSolutionDetailClient({
  industry,
  heroH1,
  heroSubheadline,
  painPoints,
  features,
  sampleChecklist,
  faqs,
  relatedBlogLink,
  relatedBlogTitle,
  relatedIndustryLinks,
  workflowSteps,
  operationalBottlenecks,
  breadcrumbLabel,
  crossLinks,
}: SolutionDetailClientProps) {
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
      <Header activeNav="solutions" ctaId="aud-sol-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section ── */}
        <section className="aud-sol-detail-hero">
          <div className="aud-inner">
            <div className="aud-sol-detail-hero-content">
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
              <p className="aud-sol-detail-hero-sub">
                {heroSubheadline}
              </p>

              <div className="actions" style={{ justifyContent: 'flex-start', gap: 16 }}>
                <DotBtn id="aud-sol-hero-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
                {sampleChecklist && sampleChecklist.length > 0 && (
                  <a className="button" href="#sample-checklist" style={{ textDecoration: 'none' }}>
                    View Sample Checklist
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── §2 Core Capabilities (Operational Challenges & Audiment Solutions) ── */}
        <section className="aud-sol-detail-section">
          <div className="aud-inner">
            <div className="aud-sol-detail-head">
              <h2>Operational challenges &amp; how Audiment solves them</h2>
              <p>Scaling {industry.toLowerCase()} operations without proof-based controls creates hidden risk in daily operations.</p>
            </div>

            <div className="aud-sol-pillars-grid">
              {painPoints.map((item, idx) => {
                const solution = features[idx] || features[0];
                return (
                  <div key={idx} className="aud-sol-pillar-item">
                    <div className="aud-sol-pillar-top">
                      <span className="aud-sol-category">CHALLENGE 0{idx + 1}</span>
                      <span className="aud-sol-num">0{idx + 1}</span>
                    </div>

                    <div className="aud-sol-pillar-challenge">
                      <h3>{item.title}</h3>
                      <p className="problem">{item.description}</p>
                    </div>

                    {solution && (
                      <div className="aud-sol-pillar-solution">
                        <span className="aud-sol-category" style={{ color: 'var(--orange)', marginBottom: 8, display: 'block' }}>
                          HOW AUDIMENT SOLVES IT
                        </span>
                        <h4>{solution.title}</h4>
                        <p>{solution.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── §3 Operational Bottlenecks & Workflow Resolution (Asellus Editorial Grid) ── */}
        {(operationalBottlenecks || workflowSteps) && (
          <section className="aud-sol-detail-section aud-sol-detail-section--striped">
            <div className="aud-inner">
              <div className="aud-sol-duo-grid">
                {/* Left Column: Bottlenecks Removed */}
                {operationalBottlenecks && operationalBottlenecks.length > 0 && (
                  <div className="aud-sol-duo-card">
                    <div className="aud-sol-duo-card-head">
                      <span className="aud-sol-category">ELIMINATED FRICTION</span>
                      <h3>Operational Bottlenecks Removed</h3>
                    </div>
                    <div className="aud-sol-rows-list">
                      {operationalBottlenecks.map((item, idx) => (
                        <div key={idx} className="aud-sol-row">
                          <span className="aud-sol-dash">–</span>
                          <p className="aud-sol-row-text">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Right Column: Workflow Resolution Steps */}
                {workflowSteps && workflowSteps.length > 0 && (
                  <div className="aud-sol-duo-card">
                    <div className="aud-sol-duo-card-head">
                      <span className="aud-sol-category" style={{ color: 'var(--orange)' }}>RESOLUTION WORKFLOW</span>
                      <h3>How an Audit Resolution Flow Works</h3>
                    </div>
                    <div className="aud-sol-rows-list">
                      {workflowSteps.map((step, idx) => (
                        <div key={step.title || idx} className="aud-sol-row aud-sol-row--step">
                          <span className="aud-sol-num">0{idx + 1}</span>
                          <div className="aud-sol-step-body">
                            <h4>{step.title}</h4>
                            <p>{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── §4 Sample Checklist Table ── */}
        {sampleChecklist && sampleChecklist.length > 0 && (
          <section className="aud-sol-detail-section" id="sample-checklist">
            <div className="aud-inner">
              <div className="aud-sol-detail-head">
                <h2>Sample {industry} Audit Checklist</h2>
                <p>What an audit looks like inside Audiment for {industry.toLowerCase()} teams.</p>
              </div>

              <table className="aud-checklist-clean-table">
                <thead>
                  <tr>
                    <th style={{ width: '28%' }}>Area / Focus</th>
                    <th>Audit Question &amp; Inspection Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleChecklist.map((item, idx) => (
                    <tr key={idx}>
                      <td className="aud-checklist-tag">{item.area}</td>
                      <td>{item.question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── §5 FAQ Section (Exact Asellus /audiment .faq Structure) ── */}
        {faqs && faqs.length > 0 && (
          <section className="faq" id="faq" style={{ marginTop: 0, borderTop: 'none' }}>
            <div className="faq-left">
              <h2>Frequently asked<br />questions.</h2>
              <p>Clear, honest answers<br />about {industry.toLowerCase()} audit software.</p>
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
        )}

        {/* ── §6 CTA & Related Platform Topics ── */}
        <section className="aud-sol-detail-section aud-sol-detail-section--paper">
          <div className="aud-inner">
            {/* CTA Box */}
            <div className="aud-article-cta-box" style={{ marginBottom: 80, padding: '72px 48px' }}>
              <h3>Ready to standardize audits across your {industry.toLowerCase()} operations?</h3>
              <p style={{ marginTop: 12, marginBottom: 32 }}>
                Book a discovery call to see how Audiment runs proof-based audits across every location.
              </p>
              <div className="cta-btn-center">
                <DotBtn id="aud-sol-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
              </div>
            </div>

            {/* Recommended Guide & Related Solutions */}
            {(relatedBlogLink || (relatedIndustryLinks && relatedIndustryLinks.length > 0)) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, marginBottom: 64, paddingTop: 16 }}>
                {relatedBlogLink && relatedBlogTitle && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                      Recommended Guide
                    </span>
                    <Link href={relatedBlogLink} className="aud-link-underline" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5 }}>
                      {relatedBlogTitle}
                    </Link>
                  </div>
                )}
                {relatedIndustryLinks && relatedIndustryLinks.length > 0 && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                      Other Industry Solutions
                    </span>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {relatedIndustryLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="aud-link-underline" style={{ fontSize: 15, fontWeight: 500 }}>
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Platform & Related Topics Cross-Links */}
            {crossLinks && crossLinks.length > 0 && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>
                    Platform &amp; Related Topics
                  </h3>
                </div>

                <div className="aud-sol-links-row">
                  {crossLinks.map((item) => (
                    <Link key={item.title} href={item.href} className="aud-sol-link-item">
                      {item.tag && <span className="aud-sol-link-tag">{item.tag}</span>}
                      <h4>
                        <span>{item.title}</span>
                        <ArrowRightIcon />
                      </h4>
                      <p>{item.description}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer service="general" />
    </>
  );
}
