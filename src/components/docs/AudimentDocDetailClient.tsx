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
import { DocTOCItem } from '@/lib/docs';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

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

export interface RelatedDoc {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime?: string;
}

export interface DocDetailClientProps {
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readingTime?: string;
  slug: string;
  toc: DocTOCItem[];
  relatedDocs: RelatedDoc[];
  children: React.ReactNode;
}

export function AudimentDocDetailClient({
  title,
  description,
  category,
  author,
  date,
  readingTime,
  toc,
  relatedDocs,
  children,
}: DocDetailClientProps) {
  const cal = getCalAttributes('general');
  const [activeSection, setActiveSection] = useState<string>(toc[0]?.id || '');

  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    // TOC active-section tracking is lightweight — init immediately
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = toc.length - 1; i >= 0; i--) {
        const item = toc[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Defer heavy Lenis/GSAP/ScrollTrigger init to idle time
    // so the main thread is unblocked during FCP→TTI
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
      initCalEmbed();

      setTimeout(() => ScrollTrigger.refresh(), 300);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHeavy, { timeout: 1500 });
    } else {
      setTimeout(initHeavy, 400);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) lenis.destroy();
    };
  }, [toc]);

  return (
    <>
      <div className="page-lines" />

      {/* Global Header */}
      <Header activeNav="docs" ctaId="aud-article-nav-cta" />

      <main id="top">
        {/* ── §2 Article Header Section ── */}
        <section className="aud-article-header-section">
          <div className="aud-inner">
            <div className="aud-article-header-wrap">
              <div className="aud-article-tag-wrap">
                <span className="aud-blog-tag active">{category}</span>
              </div>
              <h1 className="aud-article-main-title">{title}</h1>
              {description && (
                <p className="aud-article-lead">
                  {description}
                </p>
              )}
              <div className="aud-article-meta-bar">
                <div className="meta-left">
                  <span>Written by <strong className="author-name">{author}</strong></span>
                  <span>•</span>
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {readingTime && (
                    <>
                      <span>•</span>
                      <span>{readingTime}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dual Grid Layout */}
        <section className="aud-article-body-section">
          <div className="aud-inner">
            <div className="aud-article-dual-grid">
              {/* Left Sticky Sidebar Table of Contents */}
              {toc && toc.length > 0 ? (
                <aside className="aud-article-sidebar">
                  <div className="aud-toc-box">
                    <span className="aud-toc-label">Table of Contents</span>
                    <nav className="aud-toc-list">
                      {toc.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`aud-toc-item-wrap ${isActive ? 'active' : ''}`}
                          >
                            <a
                              href={`#${item.id}`}
                              className={`aud-toc-link ${isActive ? 'active' : ''}`}
                            >
                              {item.text}
                            </a>
                          </div>
                        );
                      })}
                    </nav>
                  </div>
                </aside>
              ) : (
                <div />
              )}

              {/* Right Prose Content Column */}
              <div className="aud-article-main-col">
                <article className="aud-article-prose">
                  {children}
                </article>

                {/* Author & Editorial Trust Box */}
                <div className="aud-article-author-box">
                  <div className="author-avatar">AT</div>
                  <div className="author-text">
                    <h4>Written by the Audiment Product Team</h4>
                    <p>
                      Audiment is built by Asellus LLP to help multi-location restaurant, retail, hotel, and healthcare operators eliminate operational drift. We publish practical, research-backed guides on audit management, proof-based verification, and corrective action workflows.
                    </p>
                    <div className="author-links">
                      <Link href="/about">About Audiment</Link>
                      <span>•</span>
                      <Link href="/docs">All Documentation</Link>
                      <span>•</span>
                      <Link href="/solutions">Industry Solutions</Link>
                      <span>•</span>
                      <Link href="/compare">Software Comparisons</Link>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Box */}
                <div className="aud-article-cta-box">
                  <h3>Ready to digitize your audit process?</h3>
                  <p>
                    See how multi-location teams use proof-based audits and corrective actions to stay on top of quality and compliance.
                  </p>
                  <div className="cta-btn-center">
                    <DotBtn id="aud-article-bottom-cta" label="Book a Discovery Call" variant="orange" calAttrs={cal} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Documents Section */}
        {relatedDocs && relatedDocs.length > 0 && (
          <section className="aud-related-posts-section">
            <div className="aud-inner">
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>
                  Related Guides
                </span>
                <h2 className="aud-related-title" style={{ textAlign: 'left', margin: 0 }}>
                  More from our documentation
                </h2>
              </div>

              <div className="aud-blog-clean-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {relatedDocs.map((rd) => (
                  <Link
                    key={rd.slug}
                    href={`/docs/${rd.slug}`}
                    className="aud-blog-clean-card"
                  >
                    <div className="aud-blog-card-thumb">
                      <span className="aud-blog-tag">{rd.category}</span>
                      {rd.readingTime && (
                        <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600, background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                          {rd.readingTime}
                        </span>
                      )}
                    </div>
                    <div className="aud-blog-card-body">
                      <h3>{rd.title}</h3>
                      <p>{rd.description}</p>
                    </div>
                    <div className="aud-blog-card-footer">
                      <div className="aud-blog-card-meta">
                        <span>{rd.date}</span>
                      </div>
                      <span className="aud-blog-card-link">
                        Read Guide <ArrowRightIcon />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer service="general" hideCta />
    </>
  );
}
