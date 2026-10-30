'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations, initScrollReveals } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';
import { DocItem, DocCategoryGroup } from '@/lib/docs';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

interface DocsHubClientProps {
  docs: DocItem[];
  categoryGroups: DocCategoryGroup[];
  initialCategory?: string;
  initialSearchQuery?: string;
}

export function AudimentDocsHubClient({
  docs,
  categoryGroups,
  initialCategory,
  initialSearchQuery = '',
}: DocsHubClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All topics');
  const [visibleCount, setVisibleCount] = useState(12);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const tabsNavRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const handleScrollRight = () => {
    if (tabsNavRef.current) {
      tabsNavRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let t1: ReturnType<typeof setTimeout> | undefined;
    let resizeObserver: ResizeObserver | null = null;

    const onLoad = () => {
      lenis?.resize();
      ScrollTrigger.refresh();
    };

    const initHeavy = () => {
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      ticker = (time: number) => {
        if (lenis) lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      observeDotBorderButtons();
      observeAnimations();
      initCalEmbed();

      if (typeof ResizeObserver !== 'undefined' && typeof document !== 'undefined' && document.body) {
        resizeObserver = new ResizeObserver(() => {
          lenis?.resize();
          ScrollTrigger.refresh();
        });
        resizeObserver.observe(document.body);
      }

      t1 = setTimeout(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      }, 300);
      window.addEventListener('load', onLoad);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHeavy, { timeout: 1200 });
    } else {
      setTimeout(initHeavy, 300);
    }

    return () => {
      if (t1) clearTimeout(t1);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('load', onLoad);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // Recalculate scroll dimensions whenever visible docs or categories change
  useEffect(() => {
    const refreshDimensions = () => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
      initScrollReveals();
    };

    refreshDimensions();
    const t1 = setTimeout(refreshDimensions, 60);
    const t2 = setTimeout(refreshDimensions, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visibleCount, searchQuery, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All topics': docs.length };
    docs.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [docs]);

  const allCategories = useMemo(() => {
    return ['All topics', ...categoryGroups.map((g) => g.category)];
  }, [categoryGroups]);

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const matchesCategory =
        selectedCategory === 'All topics' || d.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [docs, searchQuery, selectedCategory]);

  const featuredDoc = useMemo(() => {
    if (searchQuery || selectedCategory !== 'All topics') return null;
    return docs.find((d) => d.slug === 'overview') || docs[0];
  }, [docs, searchQuery, selectedCategory]);

  const gridDocs = useMemo(() => {
    if (featuredDoc) {
      return filteredDocs.filter((d) => d.slug !== featuredDoc.slug);
    }
    return filteredDocs;
  }, [filteredDocs, featuredDoc]);

  const paginatedDocs = useMemo(() => {
    if (searchQuery || selectedCategory !== 'All topics') {
      return gridDocs;
    }
    return gridDocs.slice(0, visibleCount);
  }, [gridDocs, searchQuery, selectedCategory, visibleCount]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribedSuccess(true);
    }
  };

  return (
    <>
      <div className="page-lines" />

      {/* Global Header */}
      <Header activeNav="docs" ctaId="aud-docs-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section ── */}
        <section className="aud-blog-hero">
          <div className="aud-inner">
            <h1>
              Audiment <span className="muted">Docs</span>
            </h1>
            <p className="aud-blog-hero-sub">
              Field guides, operational manuals, and architecture references for multi-location teams.
            </p>

            {/* Search Box */}
            <div className="aud-blog-search-wrapper">
              <div className="aud-blog-search-box">
                <span className="search-icon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  className="aud-blog-search-input"
                  placeholder="Search documentation, handbooks, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="aud-blog-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Single-line sleek category tabs bar with signature stripes */}
          <div className="aud-blog-tabs-container">
            <div className="aud-inner aud-blog-tabs-wrapper">
              <nav className="aud-blog-tabs-nav" ref={tabsNavRef}>
                {allCategories.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`aud-blog-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setVisibleCount(12);
                      }}
                    >
                      <span>{cat}</span>
                      <span className="count">{count}</span>
                    </button>
                  );
                })}
              </nav>
              <button
                type="button"
                className="aud-blog-tabs-scroll-btn"
                onClick={handleScrollRight}
                aria-label="Scroll topics right"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </section>

        {/* ── §2 Featured Post Showcase (Split 2-Column Editorial Card) ── */}
        {featuredDoc && (
          <section className="aud-blog-featured-section">
            <div className="aud-inner">
              <Link
                href={`/docs/${featuredDoc.slug}`}
                className="aud-blog-featured-card-clean"
              >
                {/* Left: Content */}
                <div className="aud-blog-featured-left">
                  <div className="aud-blog-card-tags">
                    <span className="aud-blog-tag featured-badge">★ Featured Guide</span>
                    <span className="aud-blog-tag">{featuredDoc.category}</span>
                  </div>
                  <h2>{featuredDoc.title}</h2>
                  <p>{featuredDoc.description}</p>
                  <div className="aud-blog-featured-footer">
                    <div className="aud-blog-author-block">
                      <div className="aud-blog-author-avatar">AT</div>
                      <div className="aud-blog-meta-col">
                        <span className="aud-blog-meta-author">Audiment Product Team</span>
                        <span className="aud-blog-meta-sub">
                          {featuredDoc.lastModified} {featuredDoc.readingTime ? `• ${featuredDoc.readingTime}` : ''}
                        </span>
                      </div>
                    </div>
                    <span className="aud-blog-read-action">
                      Read Full Guide <ArrowRightIcon />
                    </span>
                  </div>
                </div>

                {/* Right: Operational Preview Widget */}
                <div className="aud-blog-featured-preview">
                  <div className="aud-blog-preview-top">
                    <span className="aud-blog-preview-badge">Operational Verification Matrix</span>
                    <span className="aud-blog-preview-live">Live Verification Engine</span>
                  </div>
                  <div className="aud-blog-preview-stats">
                    <div className="aud-blog-pstat">
                      <div className="aud-blog-pstat-num">100%</div>
                      <div className="aud-blog-pstat-lbl">GPS Accuracy Lock</div>
                    </div>
                    <div className="aud-blog-pstat">
                      <div className="aud-blog-pstat-num">48h</div>
                      <div className="aud-blog-pstat-lbl">CAPA Resolution SLA</div>
                    </div>
                    <div className="aud-blog-pstat">
                      <div className="aud-blog-pstat-num">20s</div>
                      <div className="aud-blog-pstat-lbl">Flash Video Sweep</div>
                    </div>
                  </div>
                  <div className="aud-blog-preview-checklist">
                    <div className="aud-blog-preview-chk-item">
                      <span className="aud-blog-chk-icon">✓</span>
                      <span>High-accuracy geolocation presence verification</span>
                    </div>
                    <div className="aud-blog-preview-chk-item">
                      <span className="aud-blog-chk-icon">✓</span>
                      <span>Mandatory photo proof &amp; front/rear mirror correction</span>
                    </div>
                    <div className="aud-blog-preview-chk-item">
                      <span className="aud-blog-chk-icon">✓</span>
                      <span>Automated corrective action generation on critical fail</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── §3 Core Pillars Spotlight (Only on default view) ── */}
        {!searchQuery && selectedCategory === 'All topics' && (
          <section className="aud-blog-spotlight-section">
            <div className="aud-inner">
              <div className="aud-blog-spotlight-grid">
                <Link
                  href="/docs/admin-handbook"
                  className="aud-blog-spotlight-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="spotlight-icon">
                    <ClipboardIcon />
                  </div>
                  <h4>Admin Operational Handbook</h4>
                  <p>
                    Manage organizational branches, provision user directories, author master blueprints, schedule recurring audits, and monitor compliance health.
                  </p>
                  <span className="aud-blog-spotlight-link">
                    Read Admin Handbook <ArrowRightIcon />
                  </span>
                </Link>

                <Link
                  href="/docs/manager-handbook"
                  className="aud-blog-spotlight-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="spotlight-icon">
                    <ShieldIcon />
                  </div>
                  <h4>Manager Operational Handbook</h4>
                  <p>
                    Supervise assigned locations, delegate inspections to field auditors, resolve 48-hour CAPAs with required photo proof, and review branch calendars.
                  </p>
                  <span className="aud-blog-spotlight-link">
                    Read Manager Handbook <ArrowRightIcon />
                  </span>
                </Link>

                <Link
                  href="/docs/auditor-handbook"
                  className="aud-blog-spotlight-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="spotlight-icon">
                    <ZapIcon />
                  </div>
                  <h4>Auditor Field Inspection Handbook</h4>
                  <p>
                    Mobile field workflow: question navigation, in-app camera controls, photo requirements, offline draft auto-save, and GPS-verified final submission.
                  </p>
                  <span className="aud-blog-spotlight-link">
                    Read Auditor Handbook <ArrowRightIcon />
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── §4 Grid of Articles ── */}
        <section className="aud-blog-grid-section">
          <div className="aud-inner">
            <div className="aud-blog-grid-title">
              <h3>
                {selectedCategory === 'All topics'
                  ? 'All Documentation Guides'
                  : `${selectedCategory} Guides`}
              </h3>
              <span style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 500 }}>
                {filteredDocs.length} {filteredDocs.length === 1 ? 'guide' : 'guides'}
              </span>
            </div>

            {gridDocs.length === 0 ? (
              <div className="aud-blog-empty">
                <h3>No documentation found</h3>
                <p>Try adjusting your search query or selected category filter.</p>
                <button
                  type="button"
                  className="aud-blog-reset-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All topics');
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                <div className="aud-blog-clean-grid">
                  {paginatedDocs.map((doc) => (
                    <Link
                      key={doc.slug}
                      href={`/docs/${doc.slug}`}
                      className="aud-blog-clean-card"
                    >
                      {/* Editorial Visual Thumbnail */}
                      <div className="aud-blog-card-thumb">
                        <span className="aud-blog-tag">{doc.category}</span>
                        {doc.readingTime && (
                          <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600, background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                            {doc.readingTime}
                          </span>
                        )}
                      </div>
                      <div className="aud-blog-card-body">
                        <h3>{doc.title}</h3>
                        <p>{doc.description}</p>
                      </div>
                      <div className="aud-blog-card-footer">
                        <div className="aud-blog-card-meta">
                          <span>{doc.lastModified}</span>
                        </div>
                        <span className="aud-blog-card-link">
                          Read Guide <ArrowRightIcon />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {!searchQuery && selectedCategory === 'All topics' && visibleCount < gridDocs.length && (
                  <div className="aud-blog-loadmore-row">
                    <button
                      type="button"
                      className="aud-blog-loadmore-btn"
                      onClick={() => {
                        setVisibleCount((prev) => prev + 12);
                        requestAnimationFrame(() => {
                          lenisRef.current?.resize();
                          ScrollTrigger.refresh();
                        });
                      }}
                    >
                      Load More Guides ({gridDocs.length - visibleCount} remaining)
                    </button>
                    <span className="aud-blog-loadmore-count">
                      Showing {Math.min(visibleCount, gridDocs.length)} of {gridDocs.length} guides
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── §5 Operations Digest Newsletter Section ── */}
        <section className="aud-blog-newsletter-section">
          <div className="aud-blog-newsletter-inner">
            <span className="aud-blog-newsletter-badge">Operational Digest</span>
            <h2>The Multi-Location Operations Digest</h2>
            <p>
              Join 2,400+ operations leaders, franchise directors, and quality managers receiving our weekly breakdown of audit systems, compliance playbooks, and field execution strategies.
            </p>
            {subscribedSuccess ? (
              <div style={{ color: '#10b981', fontWeight: 600, fontSize: '15px', padding: '12px' }}>
                ✓ You&apos;re subscribed! Check your inbox for the latest audit checklists.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="aud-blog-newsletter-form">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  className="aud-blog-newsletter-input"
                />
                <button type="submit" className="aud-blog-newsletter-btn">
                  Subscribe Free
                </button>
              </form>
            )}
            <span className="aud-blog-newsletter-sub">
              Zero spam. High-signal operator frameworks only. Unsubscribe anytime.
            </span>
          </div>
        </section>
      </main>

      <Footer service="general" hideCta />
    </>
  );
}
