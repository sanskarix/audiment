'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { FAQSection } from '@/components/website/FAQSection';
import { initSmoothScroll } from '@/lib/smoothScroll';
import { getCalAttributes } from '@/lib/cal';

// ─── Inline SVG Line-Art Icons ───────────────────────────────────────────────

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
      <Link className={btnClass} href={href ?? '#'} id={id}>{label}</Link>
    </div>
  );
};

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface SeoContentClientProps {
  heroH1: string;
  heroSubheadline: string;
  sections: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { title: string; href: string; description: string; tag?: string }[];
  path?: string;
  categoryTag?: string;
}

export function AudimentSeoContentClient({
  heroH1,
  heroSubheadline,
  sections,
  faqs,
  relatedLinks,
  path,
  categoryTag,
}: SeoContentClientProps) {
  const cal = getCalAttributes('general');

  useEffect(() => {
    return initSmoothScroll({ idleTimeout: 1200 });
  }, []);

  const parentHref = path?.startsWith('/platform/') ? '/#features' : '/use-cases';
  const parentLabel = path?.startsWith('/platform/') ? 'Platform' : 'Topic';

  return (
    <>
      {/* ── Fixed vertical guide lines matching Asellus ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
      <Header ctaId="aud-seo-nav-cta" />


      <main id="top">
        {/* ── §1 Hero Section (Spacious & Clean) ── */}
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
                ) : (
                  heroH1
                )}
              </h1>
              <p className="aud-sol-detail-hero-sub">
                {heroSubheadline}
              </p>

              <div className="actions" style={{ justifyContent: 'flex-start', gap: 16 }}>
                <DotBtn id="aud-seo-hero-signup" label="Try for Free" variant="orange" href="/signup" />
                <DotBtn id="aud-seo-hero-cta" label="Book a Discovery Call" calAttrs={cal} />
                <a className="button" href="#content-sections" style={{ textDecoration: 'none' }}>
                  Read overview
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── §2 Editorial Rows (Deep Dive Content) ── */}
        <section className="aud-sol-detail-section aud-sol-detail-section--paper" id="content-sections">
          <div className="aud-inner">
            <div className="aud-editorial-rows">
              {sections.map((section, idx) => (
                <div key={idx} className="aud-editorial-row">
                  <div className="aud-editorial-left">
                    <h2>{section.title}</h2>
                  </div>
                  <div className="aud-editorial-right">
                    <p className="aud-editorial-body" style={{ whiteSpace: 'pre-line' }}>
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── §3 FAQ Section (Universal Component) ── */}
        {faqs && faqs.length > 0 && (
          <FAQSection
            id="faq"
            style={{ marginTop: 0, borderTop: 'none', borderBottom: '1px solid var(--line)', paddingBottom: 120 }}
            subtitle={<>Clear, honest answers about our operational approach.</>}
            faqs={faqs}
          />
        )}

        {/* ── §4 CTA & Related Topics ── */}
        <section className="aud-sol-detail-section">
          <div className="aud-inner">
            {/* CTA Box */}
            <div className="aud-article-cta-box" style={{ marginBottom: 80, padding: '72px 48px' }}>
              <h3>Ready to eliminate operational issues across your locations?</h3>
              <p style={{ marginTop: 12, marginBottom: 32 }}>
                Book a discovery call to see how Audiment runs proof-based audits across every site.
              </p>
              <div className="cta-btn-center">
                <DotBtn id="aud-seo-bottom-signup" label="Try for Free" variant="orange" href="/signup" />
                <DotBtn id="aud-seo-bottom-cta" label="Book a Discovery Call" calAttrs={cal} />
              </div>
            </div>

            {/* Platform & Related Topics Cross-Links */}
            {relatedLinks && relatedLinks.length > 0 && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>
                    Related Topics &amp; Platform Pages
                  </h3>
                </div>

                <div className="aud-sol-links-row">
                  {relatedLinks.map((item) => (
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
      <Footer service="general" hideCta />
    </>
  );
}
