'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/website/Header';
import { Footer } from '@/components/website/Footer';
import { FAQSection } from '@/components/website/FAQSection';
import { getCalAttributes, initCalEmbed } from '@/lib/cal';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';

// ─── SVG Icon helper ─────────────────────────────────────────────────────────

const SVG: React.FC<{ d: string | string[]; size?: number; className?: string }> = ({ d, size = 16, className }) => {
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
      aria-hidden="true"
    >
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
};

const checkPath = 'M20 6 9 17l-5-5';
const arrowRight = ['M5 12h14', 'M12 5l7 7-7 7'];
const userIcon = ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'];
const buildingIcon = ['M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16', 'M10 12h4', 'M10 8h4', 'M10 16h4'];

// ─── Animation helpers ───────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const stagger = (delay = 0.08): any => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

// ─── DotBtn ──────────────────────────────────────────────────────────────────

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

// ─── Plan Data ───────────────────────────────────────────────────────────────

const freeHighlights = [
  '1 physical location included',
  'Up to 3 auditor logins',
  '25 audits per month',
  'Live in-app photo & video proof',
  'GPS-verified presence check',
  'Corrective action task tracking',
];

const paidHighlights = [
  'Unlimited locations & branches',
  'Unlimited auditors & users (Zero seat tax)',
  'Unlimited monthly audits & checklists',
  'Automated 48-hour SLA corrective actions',
  'Multi-branch score rollups & trend alerts',
  'Dedicated onboarding & priority SLA support',
];

// ─── Grouped Comparison Table Data (Canva style) ─────────────────────────────

type TableRow = {
  label: string;
  free: { sym: string; label: string; dim?: boolean };
  paid: { sym: string; label: string };
};

type TableCategory = {
  category: string;
  rows: TableRow[];
};

const comparisonCategories: TableCategory[] = [
  {
    category: 'Capacity & Operational Limits',
    rows: [
      { label: 'Physical locations', free: { sym: '—', label: '1 location', dim: true }, paid: { sym: '✓', label: 'Unlimited' } },
      { label: 'Auditors & user logins', free: { sym: '—', label: 'Up to 3 users', dim: true }, paid: { sym: '✓', label: 'Unlimited (Zero seat tax)' } },
      { label: 'Monthly audits allowance', free: { sym: '—', label: '25 audits / month', dim: true }, paid: { sym: '✓', label: 'Unlimited' } },
      { label: 'Audit templates', free: { sym: '—', label: '3 templates', dim: true }, paid: { sym: '✓', label: 'Unlimited' } },
      { label: 'Photo & video storage', free: { sym: '✓', label: 'Standard' }, paid: { sym: '✓', label: 'Unlimited high-res media' } },
    ],
  },
  {
    category: 'Field Execution & Evidence',
    rows: [
      { label: 'Mobile web app (no app download)', free: { sym: '✓', label: 'Included' }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Offline audit execution', free: { sym: '✓', label: 'Included' }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Live in-app photo & video proof', free: { sym: '✓', label: 'Included' }, paid: { sym: '✓', label: 'Included' } },
      { label: 'GPS submission verification', free: { sym: '✓', label: 'Included' }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Unannounced surprise audit mode', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included (hidden until arrival)' } },
    ],
  },
  {
    category: 'Accountability & Corrective Actions (CAPA)',
    rows: [
      { label: 'Issue & corrective action logging', free: { sym: '✓', label: 'Manual creation' }, paid: { sym: '✓', label: 'Automated 48h SLA workflows' } },
      { label: 'Proactive 6-hour cron alerts', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Mandatory photo proof of fix', free: { sym: '✓', label: 'Included' }, paid: { sym: '✓', label: 'Included' } },
    ],
  },
  {
    category: 'Multi-Location Intelligence',
    rows: [
      { label: 'Centralized multi-store overview', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Cross-branch benchmark scoring', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: '3-consecutive low-score trend alerts', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Branch manager role scoping (RBAC)', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included (Admin / Manager / Auditor)' } },
    ],
  },
  {
    category: 'Compliance, Export & Support',
    rows: [
      { label: 'Pre-built FSSAI hygiene checklists', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: 'One-click branded PDF compliance reports', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: 'REST API & data export', free: { sym: '—', label: 'Not included', dim: true }, paid: { sym: '✓', label: 'Included' } },
      { label: 'Onboarding & technical support', free: { sym: '—', label: 'Self-serve', dim: true }, paid: { sym: '✓', label: 'Dedicated onboarding & priority support' } },
    ],
  },
];

// ─── Competitor Comparisons ──────────────────────────────────────────────────

const competitorComparisons = [
  {
    name: 'SafetyCulture (iAuditor)',
    model: 'Per-User / Seat Licensing',
    summary: 'Charges $19–$29/user/month. Rolling out to 30 branches with store managers, kitchen leads, and auditors can easily cost $2,000–$3,500/month in seat penalties.',
    vsText: 'Charges per location with unlimited users. Zero frontline per-seat tax.',
    link: '/compare/audiment-vs-safetyculture',
  },
  {
    name: 'GoAudits',
    model: 'Per-User / Device Licensing',
    summary: 'Charges per user or device monthly. Suitable for independent inspectors generating single PDF checklists, but seat fees multiply quickly across multi-branch networks.',
    vsText: 'Includes multi-location rollups, automated 48-hour CAPAs, and unlimited seats.',
    link: '/compare/audiment-vs-goaudits',
  },
  {
    name: 'Zenput / MaintainX',
    model: 'Enterprise Venue Tiering',
    summary: 'Complex tiered annual contracts with strict user caps and enterprise minimums that lock teams into rigid multi-year agreements.',
    vsText: 'Transparent pricing scaled to your location count with dedicated onboarding support.',
    link: '/compare/audiment-vs-zenput',
  },
];

// ─── Frequently Asked Questions ──────────────────────────────────────────────

const faqs = [
  {
    q: 'Can I use Audiment for free?',
    a: 'Yes. Audiment Free is completely free forever with no credit card required. It is designed for single-location operations to run proof-based audits, capture photo evidence, and verify standards with up to 3 auditors and 25 audits per month.',
  },
  {
    q: 'How is the Paid plan priced?',
    a: 'The Paid plan is priced on a flat rate per location per month, with volume discounts applied as your network scales. You get unlimited users, auditors, audits, and templates across all your branches with no per-seat fees.',
  },
  {
    q: 'Does Audiment charge per user or per location?',
    a: 'Audiment charges per location, not per user. You can invite all your branch managers, assistant managers, field inspectors, and HQ leadership without paying extra per-seat fees.',
  },
  {
    q: 'What happens when our business grows beyond 1 location?',
    a: 'When you are ready to expand to multiple locations, you can upgrade to the Paid plan with a quick call. All your existing templates, audit histories, and photo proof transfer seamlessly with zero downtime.',
  },
  {
    q: 'What is included in "Get a quote"?',
    a: 'A 20-minute operational walkthrough with our team. We review your branch count, team structure, and compliance checklists, and deliver a tailored proposal within the same business day.',
  },
  {
    q: 'Are there any hidden setup fees or storage surcharges?',
    a: 'No. There are no setup fees, no onboarding surcharges, and no media storage overage charges. High-resolution photo and video evidence storage is included in your plan.',
  },
  {
    q: 'How does Audiment pricing compare to SafetyCulture (iAuditor)?',
    a: 'SafetyCulture charges $19 to $29 per user per month. For a 30-location brand with 3 users per store, SafetyCulture can cost $2,000 to $3,500+ every month. Audiment charges a predictable rate per location with unlimited users, typically reducing software spend by 50% to 70%.',
  },
  {
    q: 'Can we test the Paid plan across our team before committing?',
    a: 'Yes. You can start immediately on the Free plan for 1 location. For multi-unit businesses evaluating the Paid plan, our team provides an assisted trial across selected branches during your onboarding walkthrough.',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PricingClient() {
  const calQuote = getCalAttributes('demo');

  useEffect(() => {
    const timer = setTimeout(() => {
      observeDotBorderButtons();
      observeAnimations();
      initCalEmbed();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="page-lines" />
      <Header activeNav="pricing" />

      <main id="top">

        {/* ── §1 Hero Section (Audiment Asellus Studio Native Hero) ── */}
        <section className="aud-hero--pricing">
          <div>
            <h1>
              Plans and <span className="muted">pricing</span>
            </h1>
            <p>
              Start for free on your first location, or unlock unlimited scale across all your branches.
              No per-seat penalties, no hidden fees.
            </p>
          </div>
        </section>

        {/* ── §2 Two Plan Cards (Audiment Design Language Native 2-Tier Grid) ── */}
        <section id="plans" className="aud-pricing-section">
          <div className="aud-inner">
            <div className="aud-pricing-cards-grid">

              {/* Free Card */}
              <div className="aud-pricing-card">
                <div className="aud-pricing-card-header">
                  <h2 className="aud-pricing-title">Free</h2>

                  <p className="aud-pricing-desc">
                    Run proof-based audits on your first branch. No credit card required.
                  </p>

                  <div className="aud-pricing-price-wrap">
                    <div className="aud-pricing-amount">₹0</div>
                    <div className="aud-pricing-cadence">Free forever for 1 location</div>
                  </div>

                  <div className="aud-pricing-cta-wrap">
                    <DotBtn id="pricing-free-cta" label="Try for Free" href="/signup" />
                  </div>
                </div>

                <div className="aud-pricing-card-perks">
                  <div className="sidebar-label">What&apos;s included in Free</div>
                  <ul className="aud-pricing-perks-list">
                    {freeHighlights.map((item) => (
                      <li key={item} className="aud-pricing-perk-item">
                        <SVG d={checkPath} size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Paid Card */}
              <div className="aud-pricing-card aud-pricing-card--pro">
                <div className="aud-pricing-card-header">
                  <h2 className="aud-pricing-title">Paid</h2>

                  <p className="aud-pricing-desc">
                    Scale operational consistency across all your branches with zero per-seat fees.
                  </p>

                  <div className="aud-pricing-price-wrap">
                    <div className="aud-pricing-amount aud-pricing-amount--orange">Custom</div>
                    <div className="aud-pricing-cadence">Flat rate per location / month</div>
                  </div>

                  <div className="aud-pricing-cta-wrap">
                    <DotBtn id="pricing-pro-cta" label="Get a quote" variant="orange" calAttrs={calQuote} />
                  </div>
                </div>

                <div className="aud-pricing-card-perks">
                  <div className="sidebar-label" style={{ color: 'var(--orange)' }}>Everything in Free, plus</div>
                  <ul className="aud-pricing-perks-list">
                    {paidHighlights.map((item) => (
                      <li key={item} className="aud-pricing-perk-item">
                        <SVG d={checkPath} size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── §3 Compare Features Table (Canva-style structured categories) ── */}
        <section className="aud-section aud-section--stone">
          <div className="aud-inner">
            <motion.div
              className="aud-head"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <h2>Compare features</h2>
              <p style={{ marginTop: 12 }}>See a detailed breakdown of what each plan includes.</p>
            </motion.div>

            <motion.div
              className="pricing-cmp-table"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={fadeUp}
            >
              {/* Table Top Header */}
              <div className="pricing-cmp-head">
                <div>Feature</div>
                <div>Free</div>
                <div className="pricing-cmp-pro-col">Paid</div>
              </div>

              {/* Grouped Category Sections */}
              {comparisonCategories.map((group) => (
                <React.Fragment key={group.category}>
                  <div className="pricing-table-category-row">
                    {group.category}
                  </div>

                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className="pricing-cmp-row"
                    >
                      <div>
                        <span className="pricing-cmp-feature-name">{row.label}</span>
                      </div>
                      <div>
                        {row.free.sym === '✓' ? (
                          <SVG d={checkPath} size={15} className="pricing-cmp-check pricing-cmp-check--ink" />
                        ) : (
                          <span className="pricing-cmp-dash">–</span>
                        )}
                        <span className={`pricing-cmp-val${row.free.dim ? ' pricing-cmp-val--dim' : ' pricing-cmp-val--good'}`}>
                          {row.free.label}
                        </span>
                      </div>
                      <div className="pricing-cmp-pro-col">
                        <SVG d={checkPath} size={15} className="pricing-cmp-check pricing-cmp-check--orange" />
                        <span className="pricing-cmp-val pricing-cmp-val--good">
                          {row.paid.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── §4 Competitor Pricing Comparison ──────────────────────────────── */}
        <section className="aud-section aud-section--paper">
          <div className="aud-inner">
            <motion.div
              className="aud-head"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <h2>
                How our pricing compares to <span className="muted">legacy alternatives</span>
              </h2>
              <p style={{ marginTop: 12 }}>
                Most inspection software charges per user seat, penalizing multi-unit businesses as more frontline staff join. Audiment is built differently.
              </p>
            </motion.div>

            <motion.div
              className="pricing-competitors-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger(0.1)}
            >
              {competitorComparisons.map((c) => (
                <motion.div key={c.name} className="pricing-competitor-card" variants={fadeUp}>
                  <div>
                    <span className="pricing-competitor-model">{c.model}</span>
                    <h3>{c.name}</h3>
                    <p className="pricing-competitor-summary">{c.summary}</p>
                  </div>
                  <div>
                    <div className="pricing-competitor-vs">
                      <strong>Audiment difference</strong>
                      <span>{c.vsText}</span>
                    </div>
                    <Link
                      href={c.link}
                      className="pricing-competitor-link"
                    >
                      <span>Read full breakdown</span>
                      <SVG d={arrowRight} size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── §5 FAQ (universal FAQSection component) ───────────────────────── */}
        <FAQSection
          title={<>Frequently asked<br />questions.</>}
          subtitle={<>Everything you need to know<br />about Audiment plans and pricing.</>}
          faqs={faqs}
          id="pricing-faq"
        />

        {/* ── §6 Bottom CTA (site-prefooter-cta pattern) ───────────────────── */}
        <section className="site-prefooter-cta" aria-label="Get started with Audiment">
          <div className="site-prefooter-cta-inner">
            <div className="prefooter-cta-left">
              <h2 className="prefooter-cta-heading">
                Ready to see what&apos;s actually happening at your{' '}
                <i>branches?</i>
              </h2>
              <p className="prefooter-cta-subtext">
                Book a 20-minute operational walkthrough with our team.
              </p>
            </div>

            <div className="prefooter-cta-right" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                className="prefooter-cta-button"
                href="/signup"
                id="pricing-bottom-free"
              >
                <span>Try for Free</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <a
                className="prefooter-cta-button prefooter-cta-button--secondary"
                href="javascript:void(0);"
                id="pricing-bottom-quote"
                {...calQuote}
              >
                <span>Get a quote</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer service="demo" hideCta />
    </>
  );
}
