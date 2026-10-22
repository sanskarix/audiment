'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/website/Header';
import { Footer } from '@/components/website/Footer';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

export interface GlossaryTerm {
  slug: string;
  term: string;
  acronym?: string;
  category: string;
  shortDefinition: string;
  fullExplanation: string;
  keyTakeaways: string[];
  relatedLinks: { title: string; href: string }[];
}

const terms: GlossaryTerm[] = [
  {
    slug: 'operational-drift',
    term: 'Operational Drift',
    category: 'Operations Management',
    shortDefinition: 'The subtle, unmonitored decay of operational standards across distributed locations over time.',
    fullExplanation: 'Operational drift occurs when individual branch or store managers make uncoordinated micro-adjustments under daily shift pressure. Without proof-based verification, these small deviations compound across weeks, leading to brand inconsistency, lower customer satisfaction, and hidden compliance vulnerabilities.',
    keyTakeaways: [
      'Occurs naturally when audit checklists rely on unverified self-reporting.',
      'Hidden until a major customer complaint or regulatory failure surfaces.',
      'Preventable through proof-based audits, photo evidence, and trend analytics.'
    ],
    relatedLinks: [
      { title: 'Understanding Operational Drift', href: '/operational-drift' },
      { title: 'Maintaining Standards Across Locations', href: '/maintaining-standards-across-locations' }
    ]
  },
  {
    slug: 'proof-based-audits',
    term: 'Proof-Based Audits',
    category: 'Audit Methodology',
    shortDefinition: 'An inspection workflow requiring mandatory photo, video, or sensor evidence for critical checklist items.',
    fullExplanation: 'Unlike paper checklists or simple pass/fail digital forms where auditors can mark items complete from memory, proof-based audits enforce high-fidelity accountability. Critical questions require a live photo or video recorded on-site, complete with embedded metadata.',
    keyTakeaways: [
      'Eliminates ghost-auditing and pencil-whipping.',
      'Provides indisputable visual records for management review.',
      'Accelerates corrective action resolution with visual context.'
    ],
    relatedLinks: [
      { title: 'Proof-Based Audits Platform', href: '/platform/proof-based-audits' },
      { title: 'Hidden Operational Issues', href: '/hidden-operational-issues' }
    ]
  },
  {
    slug: 'corrective-action-tracking-capa',
    term: 'Corrective Actions (CAPA)',
    acronym: 'CAPA',
    category: 'Quality & Compliance',
    shortDefinition: 'Automated workflow that transforms audit failures into trackable, deadline-bound resolution tasks.',
    fullExplanation: 'Corrective and Preventive Actions (CAPA) ensure that failed audit checks do not end with a report. When an auditor flags a critical defect (e.g., broken refrigeration unit or missing safety signage), Audiment automatically generates a corrective task assigned to the responsible manager.',
    keyTakeaways: [
      'Auto-assigned upon audit completion based on severity thresholds.',
      'Requires photo proof of resolution before task closure.',
      'Tracks mean-time-to-resolution (MTTR) across regions.'
    ],
    relatedLinks: [
      { title: 'Corrective Actions Feature', href: '/platform/corrective-actions' },
      { title: 'Corrective Action Tracking Use Case', href: '/use-cases/corrective-action-tracking' }
    ]
  },
  {
    slug: 'fssai-compliance-audit',
    term: 'FSSAI Compliance Audit',
    acronym: 'FSSAI',
    category: 'Food Safety',
    shortDefinition: 'Standardized food safety and hygiene inspection adhering to the Food Safety and Standards Authority of India mandates.',
    fullExplanation: 'FSSAI compliance requires commercial food operations, Quick Service Restaurants (QSRs), and hotels to maintain strict hygiene records, temperature logs, pest control documentation, and staff health certificates. Digital FSSAI audits store tamper-proof historical logs for regulatory inspections.',
    keyTakeaways: [
      'Mandatory pre-built checklists for Indian food service operators.',
      'Stores photo evidence of temperature logs and sanitation stations.',
      'Prevents license revocation through continuous compliance tracking.'
    ],
    relatedLinks: [
      { title: 'FSSAI Audit Software Solution', href: '/fssai-audit-software' },
      { title: 'Food Safety Audit Software', href: '/solutions/food-safety-audit-software' }
    ]
  },
  {
    slug: 'geo-verified-field-audit',
    term: 'Geo-Verified Field Audit',
    acronym: 'GPS Audit',
    category: 'Field Operations',
    shortDefinition: 'Audit execution backed by mobile GPS geolocation and timestamp validation to confirm auditor presence.',
    fullExplanation: 'Geo-verification cross-references the mobile device geolocation with the registered latitude and longitude of the store or branch. If an inspection is attempted outside the geofence perimeter, the system flags the audit for supervisory review.',
    keyTakeaways: [
      'Guarantees physical on-site presence during inspections.',
      'Eliminates off-site remote checklist completions.',
      'Provides verifiable audit trail for third-party compliance.'
    ],
    relatedLinks: [
      { title: 'Geo-Verified Audits Feature', href: '/platform/geo-verified-audits' },
      { title: 'Multi-Location Audit Software', href: '/multi-location-audit-software' }
    ]
  },
  {
    slug: 'qsr-operational-audits',
    term: 'QSR Operational Audits',
    acronym: 'QSR',
    category: 'Restaurant Operations',
    shortDefinition: 'High-frequency quality, speed-of-service, and hygiene checklists tailored for Quick Service Restaurant chains.',
    fullExplanation: 'QSR chains operate on tight margins and high footfall. QSR operational audits measure opening/closing readiness, food holding temperatures, drive-thru speed standards, and brand consistency across high-volume franchise outlets.',
    keyTakeaways: [
      'Fast 5-to-10 minute shift checklists optimized for mobile web.',
      'Auto-escalates repeated food safety failures to area coaches.',
      'Standardizes quality across corporate and franchised outlets.'
    ],
    relatedLinks: [
      { title: 'QSR Audit Software', href: '/solutions/qsr-audit-software' },
      { title: 'Restaurant Audit Software', href: '/solutions/restaurant-audit-software' }
    ]
  },
  {
    slug: 'haccp-critical-control-points',
    term: 'HACCP Control Points',
    acronym: 'HACCP',
    category: 'Food Safety',
    shortDefinition: 'Hazard Analysis Critical Control Point methodology applied to multi-location food preparation and distribution.',
    fullExplanation: 'HACCP is an international management system in which food safety is addressed through the analysis and control of biological, chemical, and physical hazards from raw material production, procurement and handling, to manufacturing, distribution and consumption.',
    keyTakeaways: [
      'Focuses audit attention on high-risk process steps.',
      'Requires precise logging of critical limits (e.g., cooking temperatures).',
      'Provides systematic evidence for health inspector reviews.'
    ],
    relatedLinks: [
      { title: 'Food Safety & FSSAI Solutions', href: '/solutions/food-safety-audit-software' },
      { title: 'Staying Ahead of Compliance', href: '/staying-ahead-of-compliance' }
    ]
  }
];

export function AudimentGlossaryClient() {
  const cal = getCalAttributes('general');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let t1: ReturnType<typeof setTimeout> | undefined;

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
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHeavy, { timeout: 1200 });
    } else {
      setTimeout(initHeavy, 300);
    }

    return () => {
      if (t1) clearTimeout(t1);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) lenis.destroy();
    };
  }, []);

  const categories = ['All', ...Array.from(new Set(terms.map((t) => t.category)))];

  const filteredTerms = terms.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDefinition.toLowerCase().includes(search.toLowerCase()) ||
      (item.acronym && item.acronym.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="page-lines" />
      <Header activeNav="solutions" ctaId="aud-glossary-nav-cta" />

      <main id="top">
        {/* ── §1 Hero Section ── */}
        <section className="aud-hero" style={{ paddingBottom: '3rem' }}>
          <div className="aud-inner" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
            <span className="aud-blog-tag active" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              B2B Knowledge Base
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.15, marginBottom: '1.2rem' }}>
              Multi-Location Operations &amp; Audit Glossary
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Authoritative definitions for operational terms, food safety compliance standards, audit methodologies, and quality control metrics.
            </p>
          </div>
        </section>

        {/* ── §2 Filter & Search Bar ── */}
        <section className="aud-section" style={{ paddingTop: 0, paddingBottom: '2rem' }}>
          <div className="aud-inner" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <input
                type="text"
                placeholder="Search operational terms (e.g. FSSAI, Operational Drift, CAPA)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? 'var(--orange, #ff5400)' : 'rgba(255, 255, 255, 0.12)',
                      backgroundColor: selectedCategory === cat ? 'rgba(255, 84, 0, 0.15)' : 'transparent',
                      color: selectedCategory === cat ? '#ff5400' : 'var(--muted)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── §3 Terms List ── */}
            <div style={{ display: 'grid', gap: '2rem' }}>
              {filteredTerms.length > 0 ? (
                filteredTerms.map((item) => (
                  <article
                    key={item.slug}
                    id={item.slug}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                        {item.term} {item.acronym && <span style={{ color: '#ff5400', fontSize: '1.1rem' }}>({item.acronym})</span>}
                      </h2>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.06)', color: 'var(--muted)' }}>
                        {item.category}
                      </span>
                    </div>

                    <p style={{ fontSize: '1.05rem', color: '#ff5400', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                      {item.shortDefinition}
                    </p>

                    <p style={{ fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, margin: 0 }}>
                      {item.fullExplanation}
                    </p>

                    <div style={{ marginTop: '0.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '1.2rem', borderRadius: '10px', borderLeft: '3px solid #ff5400' }}>
                      <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                        Key Takeaways:
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {item.keyTakeaways.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    {item.relatedLinks && item.relatedLinks.length > 0 && (
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Related Resources:</span>
                        {item.relatedLinks.map((link, idx) => (
                          <Link
                            key={idx}
                            href={link.href}
                            style={{ fontSize: '0.85rem', color: '#ff5400', textDecoration: 'underline' }}
                          >
                            {link.title} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '1.2rem' }}>No terms match your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer service="demo" />
    </>
  );
}
