'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations, initScrollReveals } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

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

export interface BlogPostItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags?: string[];
  readingTime?: string;
  featured?: boolean;
}

export interface BlogHubProps {
  posts: BlogPostItem[];
  initialCategory?: string;
  initialSearchQuery?: string;
  semanticCategories: string[];
}

export function AudimentBlogHubClient({
  posts,
  initialCategory,
  initialSearchQuery = '',
  semanticCategories,
}: BlogHubProps) {
  const cal = getCalAttributes('general');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All topics');
  const [visibleCount, setVisibleCount] = useState(24);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const tabsNavRef = React.useRef<HTMLElement>(null);
  const lenisRef = React.useRef<Lenis | null>(null);

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

  // Recalculate scroll dimensions whenever visible posts or categories change
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
    const counts: Record<string, number> = { 'All topics': posts.length };
    posts.forEach((p) => {
      const cat = p.category || 'Audit Management';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All topics' || (p.category || 'Audit Management') === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t && t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = useMemo(() => {
    if (searchQuery || selectedCategory !== 'All topics') return null;
    return posts.find((p) => p.featured) || posts[0];
  }, [posts, searchQuery, selectedCategory]);

  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const paginatedPosts = useMemo(() => {
    if (searchQuery || selectedCategory !== 'All topics') {
      return gridPosts;
    }
    return gridPosts.slice(0, visibleCount);
  }, [gridPosts, searchQuery, selectedCategory, visibleCount]);

  const allCategories = ['All topics', ...semanticCategories];

  const trendingTags = [
    { label: 'FSSAI Compliance', query: 'FSSAI' },
    { label: 'SafetyCulture vs Audiment', query: 'SafetyCulture' },
    { label: 'CAPA Tracking', query: 'CAPA' },
    { label: 'Restaurant Checklists', query: 'Restaurant' },
    { label: 'Pencil-Whipping', query: 'Prevent Fake Audits' },
  ];

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
      <Header activeNav="blog" ctaId="aud-blog-nav-cta" />

      <main id="main-content" tabIndex={-1}>
        {/* ── §1 Hero Section ── */}
        <section className="aud-blog-hero">
          <div className="aud-inner">
            <h1>Audiment <span className="muted">Blog</span></h1>
            <p className="aud-blog-hero-sub">
              Field guides and operational insights for multi-location teams.
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
                  placeholder="Search articles, guides, comparisons..."
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
        {featuredPost && (
          <section className="aud-blog-featured-section">
            <div className="aud-inner">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="aud-blog-featured-card-clean"
              >
                {/* Left: Content */}
                <div className="aud-blog-featured-left">
                  <div className="aud-blog-card-tags">
                    <span className="aud-blog-tag featured-badge">★ Featured Article</span>
                    <span className="aud-blog-tag">{featuredPost.category}</span>
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.description}</p>
                  <div className="aud-blog-featured-footer">
                    <div className="aud-blog-author-block">
                      <div className="aud-blog-author-avatar">AT</div>
                      <div className="aud-blog-meta-col">
                        <span className="aud-blog-meta-author">{featuredPost.author}</span>
                        <span className="aud-blog-meta-sub">
                          {featuredPost.date} {featuredPost.readingTime ? `• ${featuredPost.readingTime}` : ''}
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
                    <span className="aud-blog-preview-badge">Operational Intelligence Matrix</span>
                    <span className="aud-blog-preview-live">Live Audit Status</span>
                  </div>
                  <div className="aud-blog-preview-stats">
                    <div className="aud-blog-pstat">
                      <div className="aud-blog-pstat-num">98.4%</div>
                      <div className="aud-blog-pstat-lbl">Proof Compliance</div>
                    </div>
                    <div className="aud-blog-pstat">
                      <div className="aud-blog-pstat-num">48 / 48</div>
                      <div className="aud-blog-pstat-lbl">Branches Audited</div>
                    </div>
                    <div className="aud-blog-pstat">
                      <div className="aud-blog-pstat-num">12m</div>
                      <div className="aud-blog-pstat-lbl">Mean CAPA Closure</div>
                    </div>
                  </div>
                  <div className="aud-blog-preview-checklist">
                    <div className="aud-blog-preview-chk-item">
                      <span className="aud-blog-chk-icon">✓</span>
                      <span>Geo-verified on-premises timestamp confirmation</span>
                    </div>
                    <div className="aud-blog-preview-chk-item">
                      <span className="aud-blog-chk-icon">✓</span>
                      <span>Mandatory photo proof &amp; thermal sensor logs</span>
                    </div>
                    <div className="aud-blog-preview-chk-item">
                      <span className="aud-blog-chk-icon">✓</span>
                      <span>Real-time issue escalation to area management</span>
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
                  href="/blog/outlet-audit-software"
                  className="aud-blog-spotlight-card"
                >
                  <div className="spotlight-icon">
                    <ClipboardIcon />
                  </div>
                  <h4>Outlet &amp; Retail Audit Execution</h4>
                  <p>
                    Frameworks for scheduling, mobile field audits, scoring systems, and modern SaaS evaluations for distributed chains.
                  </p>
                  <span className="aud-blog-spotlight-link">
                    Explore Guide <ArrowRightIcon />
                  </span>
                </Link>

                <Link
                  href="/blog/fssai-compliance-guide"
                  className="aud-blog-spotlight-card"
                >
                  <div className="spotlight-icon">
                    <ShieldIcon />
                  </div>
                  <h4>Food Safety &amp; FSSAI Compliance</h4>
                  <p>
                    Digital checklists, hygiene audits, temperature monitoring, and audit-readiness protocols for multi-outlet restaurants.
                  </p>
                  <span className="aud-blog-spotlight-link">
                    Explore Guide <ArrowRightIcon />
                  </span>
                </Link>

                <Link
                  href="/platform/proof-based-audits"
                  className="aud-blog-spotlight-card"
                >
                  <div className="spotlight-icon">
                    <ZapIcon />
                  </div>
                  <h4>Proof-Based Audits &amp; CAPA</h4>
                  <p>
                    How to eliminate pencil-whipping with photo proof, geo-stamps, and automated corrective action tracking across locations.
                  </p>
                  <span className="aud-blog-spotlight-link">
                    Explore Platform <ArrowRightIcon />
                  </span>
                </Link>
              </div>

              {/* Curated Field Guides & Checklists Strip */}
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px 22px',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px 18px',
                }}
              >
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#64748b',
                  }}
                >
                  Featured Guides:
                </span>
                <Link
                  href="/blog/outlet-retail-audit-execution-compliance-analytics"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Outlet Audit Execution &amp; Analytics →
                </Link>
                <Link
                  href="/blog/quality-audit-software-selection-analytics"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Quality Audit Software &amp; Selection →
                </Link>
                <Link
                  href="/blog/how-multi-location-businesses-stay-in-control-as-they-scale"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Multi-Location Control Framework →
                </Link>
                <Link
                  href="/blog/restaurant-hotel-industry-inspection-checklists"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Hospitality &amp; Restaurant Checklists →
                </Link>
                <Link
                  href="/blog/retail-store-audit-reports-compliance-checklists"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Retail Store Audit Reports →
                </Link>
                <Link
                  href="/blog/workplace-operational-safety-inspection-checklists"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Workplace Safety Checklists →
                </Link>
                <Link
                  href="/blog/audit-tracking-software"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Audit Tracking Software →
                </Link>
                <Link
                  href="/blog/inspection-checklist-software-features"
                  style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-[var(--orange)]"
                >
                  Checklist Software Features →
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
                  ? 'All Field Guides & Articles'
                  : `${selectedCategory} Articles`}
              </h3>
              <span style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 500 }}>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            {gridPosts.length === 0 ? (
              <div className="aud-blog-empty">
                <h3>No articles found</h3>
                <p>Try adjusting your search query or selected topic filter.</p>
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
                  {paginatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="aud-blog-clean-card"
                    >
                      {/* Editorial Visual Thumbnail */}
                      <div className="aud-blog-card-thumb">
                        <span className="aud-blog-tag">{post.category}</span>
                        {post.readingTime && (
                          <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600, background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                            {post.readingTime}
                          </span>
                        )}
                      </div>
                      <div className="aud-blog-card-body">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                      </div>
                      <div className="aud-blog-card-footer">
                        <div className="aud-blog-card-meta">
                          <span>{post.date}</span>
                        </div>
                        <span className="aud-blog-card-link">
                          Read Article <ArrowRightIcon />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {!searchQuery && selectedCategory === 'All topics' && visibleCount < gridPosts.length && (
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
                      Load More Articles ({gridPosts.length - visibleCount} remaining)
                    </button>
                    <span className="aud-blog-loadmore-count">
                      Showing {Math.min(visibleCount, gridPosts.length)} of {gridPosts.length} field guides
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
            <span className="aud-blog-newsletter-badge">Weekly Digest</span>
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
