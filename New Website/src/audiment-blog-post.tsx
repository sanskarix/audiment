/**
 * Audiment Blog Article Page — /audiment/blog/[slug]
 * Content sourced verbatim from audiment-public-website:
 * - src/app/blog/[slug]/page.tsx
 * - content/blog/best-audit-management-software.mdx
 * Styled with the Asellus & Audiment design system (style.css + audiment.css)
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
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
  arrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  arrowLeft: ['M19 12H5', 'M12 19l-7-7 7-7'],
  check: ['M20 6L9 17l-5-5'],
  chevronDown: ['M6 9l6 6 6-6'],
};

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

// ─── Data & Types ────────────────────────────────────────────────────────────

interface TOCItem {
  id: string;
  title: string;
}

const tocItems: TOCItem[] = [
  { id: 'what-is-audit-management-software', title: 'What Is Audit Management Software?' },
  { id: 'what-should-you-look-for', title: 'What Should You Look for?' },
  { id: 'best-audit-management-software', title: 'Best Audit Management Software in 2026' },
  { id: 'flash-verification', title: 'Audiment Flash Verification' },
  { id: 'how-much-does-it-cost', title: 'How Much Does It Cost?' },
  { id: 'role-based-access-audit-trails', title: 'Role-Based Access & Audit Trails' },
  { id: 'multi-language-support', title: 'Multi-Language & International Standards' },
  { id: 'faq', title: 'Frequently Asked Questions' },
];

const relatedArticles = [
  {
    slug: 'why-self-reporting-fails-in-multi-location-operations',
    title: 'Why Self-Reporting Fails in Multi-Location Operations',
    description: 'How trust-based checklists create operational drift across distributed branches, and why proof-backed systems restore execution integrity.',
    date: 'May 24, 2026',
    category: 'Operational Drift',
    readingTime: '5 min read',
  },
  {
    slug: 'closing-the-loop-on-corrective-actions-48-hour-slas',
    title: 'Closing the Loop on Corrective Actions: 48-Hour SLAs',
    description: 'How to convert audit failures into trackable resolution tickets with strict SLAs and photographic proof of closure.',
    date: 'May 12, 2026',
    category: 'Corrective Actions',
    readingTime: '6 min read',
  },
  {
    slug: 'fssai-compliance-guide-for-multi-outlet-restaurants',
    title: 'FSSAI Compliance Guide for Multi-Outlet Restaurants',
    description: 'A complete guide to digital hygiene logs, temperature monitoring, and audit trails for Indian FSSAI safety inspections.',
    date: 'April 29, 2026',
    category: 'Compliance',
    readingTime: '7 min read',
  },
];

// ─── Audiment BlogPost Component ─────────────────────────────────────────────

function AudimentBlogPostPage() {
  const cal = getCalAttributes('general');
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(tocItems[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed vertical guide lines */}
      <div className="page-lines" />

      {/* Global Header */}
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
            <DotBtn id="aud-article-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
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

        {/* ── §1 Breadcrumbs & Back Navigation ── */}
        <section className="aud-article-nav-bar">
          <div className="aud-inner">
            <div className="aud-article-nav-content">
              <nav aria-label="Breadcrumb" className="aud-breadcrumbs">
                <a href="/audiment">Home</a>
                <span>/</span>
                <a href="/audiment/blog">Blog</a>
                <span>/</span>
                <span className="current">Audit Management</span>
              </nav>

              <a href="/audiment/blog" className="aud-back-link">
                <SVG d={I.arrowLeft} size={15} />
                <span>Back to all articles</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── §2 Article Header Section ── */}
        <section className="aud-article-header-section">
          <div className="aud-inner">
            <div className="aud-article-header-wrap">
              <div className="aud-article-tag-wrap">
                <span className="aud-blog-tag active">AUDIT MANAGEMENT</span>
              </div>
              <h1 className="aud-article-main-title">
                Best Audit Management Software in 2026: Compared for Multi-Location Teams
              </h1>
              <p className="aud-article-lead">
                A practical comparison of the best audit management software for multi-location businesses – covering verified audits, corrective actions, mobile execution, and accountability.
              </p>
              <div className="aud-article-meta-bar">
                <div className="meta-left">
                  <span className="author-name">Audiment Team</span>
                  <span className="sep">•</span>
                  <span className="pub-date">June 17, 2026</span>
                  <span className="sep">•</span>
                  <span className="read-time">8 min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── §3 Main Editorial Layout (Sidebar TOC + Article Body) ── */}
        <section className="aud-article-body-section">
          <div className="aud-inner">
            <div className="aud-article-dual-grid">

              {/* Sticky Sidebar Table of Contents */}
              <aside className="aud-article-sidebar">
                <div className="aud-toc-box">
                  <span className="aud-toc-label">CONTENTS</span>
                  <nav className="aud-toc-list">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`aud-toc-link ${activeSection === item.id ? 'active' : ''}`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Verbatim Article Content */}
              <article className="aud-article-prose">
                <p>
                  Most multi-location businesses do not have a visibility problem. They have a verification problem. This is why many organizations implement audit software to standardize their operations.
                </p>
                <p>
                  Managers submit their daily audits. Checklists come back clean. Regional reports show green across the board. And then a compliance visit, a customer complaint, or a failed health inspection reveals what the reports could not: that audits were filled in from a desk, photos were reused from previous visits, and corrective actions raised three months ago were never followed through.
                </p>
                <p>
                  The gap between what gets reported and what actually happened is not usually a people problem. It is a systems problem. Most audit tools are designed around form submission – they make it easy to complete a checklist, but they do not make it possible to verify that the checklist reflects reality.
                </p>
                <p>
                  For businesses running five, fifteen, or fifty locations, the tools available range from purpose-built field audit platforms to enterprise GRC suites to mobile inspection apps that never quite fit the use case. This comparison focuses on what matters for multi-location operators: verified evidence, accountable corrective actions, and visibility across locations that does not rely on self-reported data.
                </p>
                <p>
                  The tools covered here are Audiment, SafetyCulture, GoAudits, Zenput, and Jolt. Each has a distinct approach. The right choice depends on what your operations actually need.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 1 */}
                <h2 id="what-is-audit-management-software">What Is Audit Management Software?</h2>
                <p>
                  Audit management software is a platform that replaces manual audit processes – paper checklists, WhatsApp sign-offs, spreadsheet tracking – with a structured digital system for planning, running, verifying, and following through on audits.
                </p>
                <p>
                  The core job of an audit management system is not just to digitise your checklist. It is to create a verifiable record of what was checked, what was found, and what was done about it. For multi-location businesses, this means scheduling audits across branches, capturing evidence at the point of inspection, flagging failures automatically, assigning corrective actions to named people, and tracking those actions to resolution with proof.
                </p>
                <p>
                  Audit management software sits between the operations team and the locations they cannot physically visit every day. It replaces the question "have audits been completed?" with a more useful one: "do we have verified evidence that audits actually happened, and that any issues found were resolved?"
                </p>
                <p>
                  The best tools in this space are built for field conditions – mobile-first, capable of working offline, requiring evidence at the point of capture rather than after the fact. Tools that operate only in the browser or treat photo upload as optional are solving a different problem. A well-designed inspection checklist is the foundation, but it only delivers value when it is backed by verified execution.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 2 */}
                <h2 id="what-should-you-look-for">What Should You Look for in Audit Management Software?</h2>
                <p>
                  The most important features in audit management software are not the most commonly advertised ones. The distinction that matters is between tools that make it easy to submit a checklist and tools that make it impossible to fake one.
                </p>

                {/* Feature Comparison Table */}
                <div className="aud-table-container">
                  <table className="aud-prose-table">
                    <thead>
                      <tr>
                        <th style={{ width: '24%' }}>Feature</th>
                        <th style={{ width: '38%' }}>Why It Matters</th>
                        <th style={{ width: '38%' }}>What Weak Tools Do Instead</th>
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
                      <tr>
                        <td><strong>Automated reminders</strong></td>
                        <td>An overdue audit or unresolved corrective action should escalate automatically, without manual chasing.</td>
                        <td>Reminders are manual; overdue tracking requires someone to monitor a dashboard.</td>
                      </tr>
                      <tr>
                        <td><strong>Audit trails</strong></td>
                        <td>A verifiable record of who audited what, when, and from where – essential for compliance and dispute resolution.</td>
                        <td>Submissions logged with no geo or time verification; trail can be fabricated after the fact.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  The difference between a capable platform and a checklist app is not interface design. It is whether the system produces evidence that something actually happened, or just a record that someone pressed submit.
                </p>
                <p>
                  For multi-location businesses, this distinction is significant. An operations head managing fifteen branches cannot physically verify every audit. The system has to do that work. If it cannot confirm when, where, and by whom an audit was completed – with evidence – it is producing self-reported data at scale.
                </p>
                <p>
                  Evidence capture and corrective action closure are not optional features. They are the reason audit management software exists.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 3 */}
                <h2 id="best-audit-management-software">Best Audit Management Software for Multi-Location Businesses in 2026</h2>
                <p>
                  The platforms below are the most commonly evaluated by multi-location teams considering a move away from manual or spreadsheet-based audit processes. Each has a different origin: some grew from safety compliance roots, others from restaurant operations, others from enterprise GRC. That origin shapes what they do well and where they fall short.
                </p>

                {/* Software Comparison Table */}
                <div className="aud-table-container">
                  <table className="aud-prose-table">
                    <thead>
                      <tr>
                        <th>Tool</th>
                        <th>Best For</th>
                        <th>Key Differentiator</th>
                        <th>Pricing Model</th>
                        <th>Multi-Location Support</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Audiment</strong></td>
                        <td>Restaurant chains, franchise networks, retail operations</td>
                        <td>Geo-verified audits with mandatory photo evidence and corrective action automation</td>
                        <td>Per location</td>
                        <td>Built for multi-location from the ground up</td>
                      </tr>
                      <tr>
                        <td><strong>SafetyCulture</strong></td>
                        <td>Safety-focused organisations, large enterprises</td>
                        <td>Extensive template library and broad integration ecosystem</td>
                        <td>Per user / seat-based</td>
                        <td>Yes, with enterprise plan</td>
                      </tr>
                      <tr>
                        <td><strong>GoAudits</strong></td>
                        <td>Small to mid-size teams needing quick deployment</td>
                        <td>Ease of setup; simple checklist builder</td>
                        <td>Per user</td>
                        <td>Yes, with higher-tier plans</td>
                      </tr>
                      <tr>
                        <td><strong>Zenput</strong></td>
                        <td>Restaurant and food service chains</td>
                        <td>Task management and operational compliance workflows</td>
                        <td>Enterprise, custom quote</td>
                        <td>Yes, built for chains</td>
                      </tr>
                      <tr>
                        <td><strong>Jolt</strong></td>
                        <td>Quick-service restaurants, smaller chains</td>
                        <td>Employee scheduling and daily task management combined</td>
                        <td>Per location</td>
                        <td>Yes, with enterprise plan</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Audiment</h3>
                <p>
                  Audiment is an audit management system built specifically for multi-location businesses – restaurant chains, franchise networks, and retail operations. The core product is built around a single problem: ensuring that audits actually happened, not just that someone submitted a form.
                </p>

                <h3 id="flash-verification">Flash Verification</h3>
                <p>
                  Flash Verification is Audiment's term for the geo-verification step that confirms an auditor was physically at the right location at the time of an audit. The system uses geo-data captured during the audit to confirm on-site presence automatically, without requiring the auditor to do anything additional. This changes what an audit submission means: it is no longer an assertion but a verified record.
                </p>
                <p>
                  For operations teams managing locations they cannot visit in person, this is the difference between knowing something happened and hoping it did.
                </p>

                <h3>Mandatory Photo Evidence</h3>
                <p>
                  Audiment requires photo evidence to be captured directly through the app at the relevant checklist item. The camera opens automatically, and the photo is geo-tagged and time-stamped at the moment of capture. There is no option to upload a saved image from a previous visit.
                </p>
                <p>
                  This single requirement removes the most common form of audit fabrication in multi-location operations: reusing photos, submitting old evidence, or marking items as complete without physical verification. The audit record reflects what was actually observed, not what a manager chose to report.
                </p>

                <h3>48-Hour Corrective Action Automation</h3>
                <p>
                  When a checklist item fails, Audiment automatically creates a corrective action: a named owner, a deadline, and a requirement for photo evidence of resolution. For most operational failures, a 48-hour resolution window is the default – short enough to prevent issues from compounding, realistic enough that managers can act on it without operational disruption.
                </p>
                <p>
                  Escalation is automatic if the deadline passes. The operations team does not have to chase manually; the system surfaces overdue actions and alerts supervisors. When an action is marked resolved, evidence is required – a manager cannot simply tick a box and move on.
                </p>

                <h3>SafetyCulture</h3>
                <p>
                  SafetyCulture (formerly iAuditor) is one of the most widely deployed inspection platforms in the world. It grew from a safety compliance background and now covers a broad range of audit, inspection, and training use cases across industries including construction, manufacturing, hospitality, and retail.
                </p>
                <p>
                  The platform has an extensive library of pre-built templates, strong integrations with third-party systems, and a capable mobile app with offline support. For larger enterprises, SafetyCulture offers workflow tools, training modules, and issue management functionality.
                </p>

                <h3>GoAudits</h3>
                <p>
                  GoAudits is a mobile audit and inspection platform that positions itself on ease of setup and straightforward functionality. It is designed for teams that need to get from a paper or spreadsheet process to a digital audit system quickly.
                </p>

                <h3>Zenput</h3>
                <p>
                  Zenput is an operational compliance platform built specifically for restaurant chains and food service operators. It was acquired by Crunchtime in 2022 and is designed to support large, complex food service organisations.
                </p>

                <h3>Jolt</h3>
                <p>
                  Jolt is an operations platform aimed at quick-service restaurants and smaller chains. It combines employee scheduling, daily task management, and digital food safety logs in a single product.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 4 */}
                <h2 id="how-much-does-it-cost">How Much Does Audit Management Software Cost?</h2>
                <p>
                  Audit management software is priced in several models, and the right model depends on the size of your operation and how it is structured.
                </p>
                <p>
                  Per-user pricing charges based on the number of people with access to the system. Per-location pricing charges based on the number of sites being audited rather than the number of users. For multi-location businesses, per-location pricing is often more cost-effective and scales naturally.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 5 */}
                <h2 id="role-based-access-audit-trails">Which Audit Management Software Offers Role-Based Access and Audit Trails?</h2>
                <p>
                  Role-based access controls who sees what. An auditor conducting inspections at a single branch should not have visibility into results from other locations. A regional head needs visibility across their zone. An HQ or admin user needs to see across all locations.
                </p>
                <p>
                  Audit trails create a verifiable, time-ordered record of every audit conducted, every issue flagged, every corrective action assigned and resolved. Audiment maintains full audit histories with submission timestamps, geo-data, and attached evidence.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 6 */}
                <h2 id="multi-language-support">What Audit Management Software Supports Multi-Language and International Standards?</h2>
                <p>
                  For businesses operating across regions with different languages, the ability to run audits in multiple languages is a practical requirement. Audiment is designed specifically for operations where English, Hindi, and regional language contexts are relevant.
                </p>

                <hr className="aud-prose-divider" />

                {/* Section 7 - FAQ */}
                <h2 id="faq">Frequently Asked Questions</h2>
                <div className="aud-faq-stack">
                  <div className="aud-faq-item">
                    <h4>What is the best audit management software for small businesses?</h4>
                    <p>For small businesses with fewer than five locations, GoAudits or Jolt offer fast setup. For businesses that expect to grow, Audiment is priced per location and works seamlessly as you scale.</p>
                  </div>
                  <div className="aud-faq-item">
                    <h4>What are the leading audit management SaaS providers?</h4>
                    <p>The most widely used audit management SaaS platforms for operational compliance in 2026 are SafetyCulture, GoAudits, Zenput, Jolt, and Audiment.</p>
                  </div>
                  <div className="aud-faq-item">
                    <h4>Which audit management software offers mobile-friendly interfaces for field auditors?</h4>
                    <p>Audiment, SafetyCulture, and GoAudits all support photo capture directly within the mobile checklist workflow and offline operation for environments with unreliable connectivity.</p>
                  </div>
                  <div className="aud-faq-item">
                    <h4>What audit management software supports automated audit trail generation?</h4>
                    <p>SafetyCulture and Audiment both generate complete audit trails automatically – submission timestamps, auditor details, attached evidence, and corrective action records.</p>
                  </div>
                </div>

                {/* Editorial Author Trust Box */}
                <div className="aud-article-author-box">
                  <div className="author-avatar">A</div>
                  <div className="author-text">
                    <h4>Written by the Audiment Editorial Team</h4>
                    <p>
                      Audiment is built by Asellus LLP to help multi-location restaurant, retail, hotel, and healthcare operators eliminate operational drift. We publish practical, research-backed guides on audit management, proof-based verification, and corrective action workflows.
                    </p>
                    <div className="author-links">
                      <a href="/audiment/about">About Audiment</a>
                      <span>•</span>
                      <a href="/audiment/solutions">Industry Solutions</a>
                      <span>•</span>
                      <a href="/audiment/blog">Software Comparisons</a>
                    </div>
                  </div>
                </div>

                {/* Book A Call CTA Box */}
                <div className="aud-article-cta-box">
                  <h3>Ready to digitize your audit process?</h3>
                  <p>
                    See how multi-location teams use proof-based audits and corrective actions to stay on top of quality and compliance.
                  </p>
                  <div className="cta-btn-center">
                    <DotBtn id="aud-post-cal-cta" label="Book a call with Audiment" variant="orange" calAttrs={cal} />
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* ── §4 Related Posts Section ── */}
        <section className="aud-related-posts-section">
          <div className="aud-inner">
            <h2 className="aud-related-title">More from our blog</h2>
            <div className="aud-blog-clean-grid">
              {relatedArticles.map((post) => (
                <div
                  key={post.slug}
                  className="aud-blog-clean-card"
                  onClick={() => window.location.href = `/audiment/blog`}
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
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Global Footer */}
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
  root.render(<AudimentBlogPostPage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
