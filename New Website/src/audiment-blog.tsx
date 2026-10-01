/**
 * Audiment Blog Page — /audiment/blog
 * Content sourced verbatim from audiment-public-website:
 * - src/app/blog/page.tsx
 * - content/blog/best-audit-management-software.mdx
 * Styled with the Asellus & Audiment design system (style.css + audiment.css)
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from './components/Footer';
import { observeDotBorderButtons } from './lib/dotBorder';
import { observeAnimations } from './lib/animations';
import { initCalEmbed, getCalAttributes } from './lib/cal';
import './style.css';
import './audiment.css';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

const SVG: React.FC<{ d: string | string[]; size?: number; className?: string }> = ({ d, size = 18, className }) => {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
};

const I = {
  search: ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
  arrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const stagger = (delay = 0.06): any => ({
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

// ─── Dot-border button ────────────────────────────────────────────────────────

const DotBtn: React.FC<{
  label: React.ReactNode;
  variant?: 'default' | 'orange' | 'dark';
  href?: string;
  calAttrs?: Record<string, string>;
  id?: string;
  onClick?: () => void;
}> = ({ label, variant = 'default', href, calAttrs, id, onClick }) => {
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
      <a className={btnClass} href={href ?? '#'} id={id} onClick={onClick}>{label}</a>
    </div>
  );
};

// ─── Data: Posts & Categories (Verbatim from audiment-public-website) ───────

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
}

const semanticCategories = [
  'All topics',
  'Audit Management',
  'Operational Drift',
  'Quality Consistency',
  'Accountability',
  'Compliance',
  'Corrective Actions',
  'Proof-Based Audits',
];

const posts: BlogPost[] = [
  {
    slug: 'best-audit-management-software',
    title: 'Best Audit Management Software in 2026: Compared for Multi-Location Teams',
    description: 'A practical comparison of the best audit management software for multi-location businesses – covering verified audits, corrective actions, mobile execution, and accountability.',
    date: 'June 17, 2026',
    author: 'Audiment Team',
    category: 'Audit Management',
    tags: ['best audit management software', 'audit management software', 'best internal audit management software', 'compliance audit management software', 'audit management tools', 'multi-location business'],
    readingTime: '8 min read',
    featured: true,
  },
  {
    slug: 'why-self-reporting-fails-in-multi-location-operations',
    title: 'Why Self-Reporting Fails in Multi-Location Operations',
    description: 'How trust-based checklists create operational drift across distributed branches, and why proof-backed systems restore execution integrity.',
    date: 'May 24, 2026',
    author: 'Audiment Team',
    category: 'Operational Drift',
    tags: ['operational drift', 'self-reporting', 'multi-location', 'audit verification'],
    readingTime: '5 min read',
    featured: false,
  },
  {
    slug: 'closing-the-loop-on-corrective-actions-48-hour-slas',
    title: 'Closing the Loop on Corrective Actions: 48-Hour SLAs',
    description: 'How to convert audit failures into trackable resolution tickets with strict SLAs and photographic proof of closure.',
    date: 'May 12, 2026',
    author: 'Audiment Team',
    category: 'Corrective Actions',
    tags: ['corrective action tracking', 'SLA', 'resolution proof', 'audit compliance'],
    readingTime: '6 min read',
    featured: false,
  },
  {
    slug: 'fssai-compliance-guide-for-multi-outlet-restaurants',
    title: 'FSSAI Compliance Guide for Multi-Outlet Restaurants',
    description: 'A complete guide to digital hygiene logs, temperature monitoring, and audit trails for Indian FSSAI safety inspections.',
    date: 'April 29, 2026',
    author: 'Audiment Team',
    category: 'Compliance',
    tags: ['FSSAI compliance', 'food safety', 'QSR audits', 'hygiene logs'],
    readingTime: '7 min read',
    featured: false,
  },
  {
    slug: 'eliminating-paper-checklists-across-retail-chains',
    title: 'Eliminating Paper Checklists Across Retail Chains',
    description: 'Why paper binders hide ground-level issues and how mobile-web audits standardize visual merchandising across store networks.',
    date: 'April 15, 2026',
    author: 'Audiment Team',
    category: 'Quality Consistency',
    tags: ['retail audit', 'store merchandising', 'paperless audits', 'brand standards'],
    readingTime: '5 min read',
    featured: false,
  },
  {
    slug: 'gps-verified-auditor-presence-stopping-ghost-audits',
    title: 'GPS-Verified Auditor Presence: Stopping Ghost Audits',
    description: 'How geo-fenced check-ins and selfie verification ensure field auditors are physically present at every branch inspection.',
    date: 'March 30, 2026',
    author: 'Audiment Team',
    category: 'Proof-Based Audits',
    tags: ['geo-verification', 'ghost audits', 'field presence', 'GPS audit'],
    readingTime: '4 min read',
    featured: false,
  },
];

// ─── Audiment Blog Page Component ────────────────────────────────────────────

function AudimentBlogPage() {
  const cal = getCalAttributes('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All topics');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = selectedCategory === 'All topics' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = useMemo(() => {
    if (searchQuery || selectedCategory !== 'All topics') return null;
    return posts.find((p) => p.featured) || posts[0];
  }, [searchQuery, selectedCategory]);

  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const activePost = useMemo(() => {
    if (!activeSlug) return null;
    return posts.find((p) => p.slug === activeSlug) || null;
  }, [activeSlug]);

  return (
    <>
      {/* ── Fixed vertical guide lines ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
      <header>
        <div className="header-inner">
          <a className="brand" href="/audiment">
            Audiment
          </a>
          <nav>
            <a href="/audiment#how-it-works">How it works</a>
            <a href="/audiment#features">Features</a>
            <a href="/audiment#use-cases">Use cases</a>
            <a href="/audiment/about">About</a>
            <a href="/audiment/blog" className="active" style={{ color: 'var(--ink)', fontWeight: 600 }}>Blog</a>
            <a href="/audiment#faq">FAQ</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DotBtn id="aud-blog-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
          </div>
          <button
            className="menu"
            aria-label="Open menu"
            onClick={() => document.querySelector('header')?.classList.toggle('open')}
          >
            ☰
          </button>
        </div>
      </header>

      <main id="top">

        {/* Article Detail Overlay Modal */}
        <AnimatePresence>
          {activePost && (
            <motion.div
              className="aud-blog-reader-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="aud-blog-reader-container">
                <button
                  type="button"
                  className="aud-blog-reader-close"
                  onClick={() => setActiveSlug(null)}
                  title="Close article"
                >
                  <SVG d={I.x} size={18} />
                </button>

                <div className="aud-blog-reader-header">
                  <span className="aud-blog-tag active">{activePost.category}</span>
                  <h1>{activePost.title}</h1>
                  <div className="aud-blog-meta-row">
                    <span><strong>{activePost.author}</strong></span>
                    <span>•</span>
                    <span>{activePost.date}</span>
                    <span>•</span>
                    <span>{activePost.readingTime}</span>
                  </div>
                </div>

                <div className="aud-blog-reader-body">
                  <p className="aud-blog-lead">
                    {activePost.description}
                  </p>

                  <h2>What Is Audit Management Software?</h2>
                  <p>
                    Audit management software is a platform that replaces manual audit processes – paper checklists, WhatsApp sign-offs, spreadsheet tracking – with a structured digital system for planning, running, verifying, and following through on audits.
                  </p>
                  <p>
                    The core job of an audit management system is not just to digitise your checklist. It is to create a verifiable record of what was checked, what was found, and what was done about it. For multi-location businesses, this means scheduling audits across branches, capturing evidence at the point of inspection, flagging failures automatically, assigning corrective actions to named people, and tracking those actions to resolution with proof.
                  </p>

                  <h2>What Should You Look for in Audit Management Software?</h2>
                  <p>
                    The most important features in audit management software are not the most commonly advertised ones. The distinction that matters is between tools that make it easy to submit a checklist and tools that make it impossible to fake one.
                  </p>

                  <div className="aud-blog-table-wrap">
                    <table className="aud-blog-table">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Why It Matters</th>
                          <th>What Weak Tools Do Instead</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Mobile-first execution</strong></td>
                          <td>Auditors are on-site, not at a desk. A system that requires a laptop means audits happen after the fact.</td>
                          <td>Offer a mobile app as an afterthought; primary workflow is browser-based.</td>
                        </tr>
                        <tr>
                          <td><strong>Photo &amp; evidence capture</strong></td>
                          <td>Geo-tagged, time-stamped photos taken at the point of inspection prove an auditor was on-site.</td>
                          <td>Allow optional photo uploads from camera roll; no geo-tag or timestamp.</td>
                        </tr>
                        <tr>
                          <td><strong>Corrective action tracking</strong></td>
                          <td>A failed checklist item that does not trigger an assigned, tracked task is information that goes nowhere.</td>
                          <td>Generate a PDF report; corrective action tracking left to the operator.</td>
                        </tr>
                        <tr>
                          <td><strong>Multi-location reporting</strong></td>
                          <td>Pattern detection across branches requires aggregated data, not branch-by-branch reports.</td>
                          <td>Per-branch reports only; cross-location view requires manual export and spreadsheet work.</td>
                        </tr>
                        <tr>
                          <td><strong>Role-based access</strong></td>
                          <td>Auditors, managers, and HQ users need different views. A flat permission model creates noise at every level.</td>
                          <td>All users see all data; no role differentiation.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2>Best Audit Management Software for Multi-Location Businesses in 2026</h2>

                  <h3>Audiment</h3>
                  <p>
                    Audiment is an audit management system built specifically for multi-location businesses – restaurant chains, franchise networks, and retail operations. The core product is built around a single problem: ensuring that audits actually happened, not just that someone submitted a form.
                  </p>
                  <p>
                    The defining feature is what Audiment calls Flash Verification – a geo-verification step that confirms an auditor was physically on-site at the time of submission. Photos taken during the audit are geo-tagged and time-stamped at the moment of capture, and the system does not allow uploading images from a camera roll.
                  </p>

                  <h3>SafetyCulture</h3>
                  <p>
                    SafetyCulture (formerly iAuditor) is one of the most widely deployed inspection platforms in the world. It grew from a safety compliance background and now covers a broad range of audit, inspection, and training use cases across industries.
                  </p>

                  <h3>Zenput</h3>
                  <p>
                    Zenput is an operational compliance platform built specifically for restaurant chains and food service operators. It supports multi-location visibility and is designed for enterprise deployment.
                  </p>

                  <div className="aud-blog-author-box">
                    <div className="author-avatar">A</div>
                    <div className="author-text">
                      <h4>Written by the Audiment Editorial Team</h4>
                      <p>
                        Audiment is built by Asellus LLP to help multi-location restaurant, retail, hotel, and healthcare operators eliminate operational drift. We publish practical, research-backed guides on audit management, proof-based verification, and corrective action workflows.
                      </p>
                    </div>
                  </div>

                  <div className="aud-blog-cta-box">
                    <h3>Ready to digitize your audit process?</h3>
                    <p>
                      See how multi-location teams use proof-based audits and corrective actions to stay on top of quality and compliance.
                    </p>
                    <DotBtn id="aud-reader-cal-cta" label="Book a call with Audiment" variant="orange" calAttrs={cal} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── §1 Hero Section (Audiment Blog) ── */}
        <section className="aud-blog-hero">
          <div className="aud-inner">
            <InView immediate>
              <h1>Audiment blog</h1>
              <p className="aud-blog-hero-sub">
                Insights on audit management, quality consistency, and staying ahead of compliance for multi-location businesses.
              </p>
            </InView>

            {/* Centered Minimalist Search Input */}
            <InView>
              <div className="aud-blog-search-wrapper">
                <div className="aud-blog-search-box">
                  <SVG d={I.search} size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search articles and guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="aud-blog-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="aud-blog-search-clear"
                      title="Clear search"
                    >
                      <SVG d={I.x} size={16} />
                    </button>
                  )}
                </div>
              </div>
            </InView>
          </div>
        </section>

        {/* ── §2 Topic Categories Filter Section ── */}
        <section className="aud-blog-filter-section">
          <div className="aud-inner">
            <InView>
              <span className="aud-blog-cat-label">EXPLORE BY TOPIC</span>
              <div className="aud-blog-cat-chips">
                {semanticCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`aud-blog-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </InView>
          </div>
        </section>

        {/* ── §3 Featured Article Card ── */}
        {featuredPost && (
          <section className="aud-blog-featured-section">
            <div className="aud-inner">
              <InView>
                <div
                  className="aud-blog-featured-card-clean"
                  onClick={() => window.location.href = `/audiment/blog/${featuredPost.slug}`}
                >
                  <div className="aud-blog-card-tags">
                    <span className="aud-blog-tag active">FEATURED ARTICLE</span>
                    <span className="aud-blog-tag">{featuredPost.category}</span>
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.description}</p>
                  <div className="aud-blog-featured-footer">
                    <div className="aud-blog-meta-row">
                      <span><strong>{featuredPost.author}</strong></span>
                      <span>•</span>
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readingTime}</span>
                    </div>
                    <div className="aud-blog-read-action">
                      <span>Read article</span>
                      <SVG d={I.arrowRight} size={15} />
                    </div>
                  </div>
                </div>
              </InView>
            </div>
          </section>
        )}

        {/* ── §4 Articles Grid ── */}
        <section className="aud-blog-grid-section">
          <div className="aud-inner">
            <InView>
              <h2 className="aud-blog-grid-title">
                {searchQuery || selectedCategory !== 'All topics' ? 'Filtered Articles' : 'Latest Articles'}
              </h2>
            </InView>

            {gridPosts.length > 0 ? (
              <motion.div
                className="aud-blog-clean-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                variants={stagger(0.06)}
              >
                {gridPosts.map((post) => (
                  <motion.div
                    key={post.slug}
                    className="aud-blog-clean-card"
                    variants={fadeUp}
                    onClick={() => window.location.href = `/audiment/blog/${post.slug}`}
                  >
                    <div className="aud-blog-card-top-row">
                      <span className="aud-blog-tag">{post.category}</span>
                    </div>
                    <div className="aud-blog-card-body">
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                    </div>
                    <div className="aud-blog-card-footer">
                      <div className="aud-blog-card-meta">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <div className="aud-blog-card-link">
                        <span>Read article</span>
                        <SVG d={I.arrowRight} size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="aud-blog-empty">
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or selecting another topic.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All topics'); }}
                  className="aud-blog-reset-btn"
                >
                  View all articles
                </button>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* ── Global Footer ── */}
      <Footer service="general" />
    </>
  );
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const appEl = document.querySelector<HTMLElement>('#app');
if (appEl) {
  const root = createRoot(appEl);
  root.render(<AudimentBlogPage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
