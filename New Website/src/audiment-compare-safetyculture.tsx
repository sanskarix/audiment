/**
 * Audiment vs SafetyCulture (iAuditor) Comparison
 * /compare/audiment-vs-safetyculture & /audiment/compare/audiment-vs-safetyculture
 * Verbatim content sourced 100% from audiment-public-website.
 * Styled strictly with the Asellus & Audiment UI design system (style.css).
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Footer } from './components/Footer';
import { observeDotBorderButtons } from './lib/dotBorder';
import { observeAnimations } from './lib/animations';
import { initCalEmbed, getCalAttributes } from './lib/cal';
import './style.css';
import './audiment.css';

// ─── Asellus Dot-Border Button (Identical to Home & /audiment) ────────────────

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

// ─── Verbatim Data (100% sourced from audiment-public-website) ─────────────────

const heroH1 = 'Audiment vs SafetyCulture (iAuditor)';
const heroSubtext = "SafetyCulture is a strong, established platform with broad industry coverage. If you're running 20+ food, retail, or franchise locations, here's how the two platforms differ in practice when it comes to accountability and evidence.";

const migrationReality = {
  timeline: '1–2 weeks',
  effort: 'Minimal',
  support: 'Dedicated onboarding',
};

const operationalDifferences = [
  {
    area: 'Evidence collection',
    audiment: "Photo evidence is mandatory per question – auditors must use the live camera. Gallery uploads are blocked by default. This means you see what actually happened in the moment, not a stock photo uploaded from someone's phone gallery last week.",
    competitor: 'Photo evidence is supported but often optional depending on configuration. Auditors can skip photo items or upload from their gallery, which reduces the reliability of the evidence and opens the door to pencil-whipping.',
  },
  {
    area: 'Auditor presence verification',
    audiment: "GPS-verified presence checks require a geo-tagged interaction from the location itself. If the auditor isn't physically on-site, the system flags it and can block submission entirely. This ensures area managers are actually visiting branches.",
    competitor: 'GPS tagging is available for records, but audits can often still be submitted from off-site locations without blocking the workflow. This leaves a gap in verifying actual presence.',
  },
  {
    area: 'Corrective action workflow',
    audiment: 'Failed items auto-generate tasks with severity-based SLA deadlines. The system escalates unresolved issues automatically – first to the branch manager, then regionally, and requires photo-proof of resolution before closure.',
    competitor: 'Corrective actions are available but typically require manual assignment and follow-up. Escalation paths need additional configuration and may not mandate visual proof of closure natively.',
  },
  {
    area: 'Multi-location tracking',
    audiment: "Dashboards are built around branch-level comparison, regional trends, and repeat-failure detection across your entire network. It's designed explicitly for operations directors managing 20–500 location networks who need to see systemic drift.",
    competitor: 'Analytics are strong but generalized across all industries. Multi-location ranking, specific regional trending, and pattern detection across distinct locations may require more custom report building rather than being out-of-the-box.',
  },
  {
    area: 'Pricing structure',
    audiment: 'Audiment offers per-location pricing – meaning unlimited users per location. Adding a new shift manager or an entire frontline team doesn\'t change your cost. This encourages full team adoption.',
    competitor: 'Typically relies on per-user pricing. Costs increase as you onboard more frontline staff, which can scale unpredictably and discourage giving access to the full operational team.',
  },
];

const whereAudimentWins = [
  {
    title: 'Execution verification, not just data collection',
    text: 'SafetyCulture excels at broad data collection across massive organizations. Audiment goes further by verifying that the person actually walked the floor. GPS-based presence checks and mandatory live photos confirm the auditor was at the location and did the work.',
  },
  {
    title: 'Built for multi-location operations',
    text: "Audiment's dashboard is designed specifically for operations directors managing distributed networks. Comparative ranking, regional trend lines, and branch-level scoring are native to the interface, allowing you to spot failing branches before they become a crisis.",
  },
  {
    title: 'Predictable cost at scale',
    text: 'Per-location pricing means you can give every shift manager and team member access without worrying about seat costs scaling unexpectedly. This removes the financial friction of rolling out quality control to your entire frontline.',
  },
];

const whoShouldChooseCompetitor = [
  {
    title: 'Heavy industrial or aviation operations',
    text: "SafetyCulture has deep roots in construction, mining, and aviation with specific sensor integrations, IoT hardware, and compliance frameworks that fall outside Audiment's primary focus areas of food, retail, and hospitality.",
  },
  {
    title: 'Single-location teams',
    text: "If you manage one or two locations with a small team, SafetyCulture's free tier may be perfectly sufficient. Audiment is designed to solve the complexity of managing compliance and consistency across many distributed locations.",
  },
];

const operationalOutcomeDifference = {
  title: 'Operational Outcome Difference',
  text: 'Generic checklist systems are strong at collecting responses, but weaker at creating reliable audit data and accountable issue closure across locations. Proof-based audits and corrective-action enforcement in Audiment improve issue tracking, reduce operational drift, and strengthen accountability over time.',
};

const faqs = [
  {
    question: 'Is Audiment a direct alternative to SafetyCulture (iAuditor)?',
    answer: 'Yes. Both serve multi-location audit management. The differences are in how each platform handles accountability workflows, evidence collection, and rollout complexity – which is what matters most during day-to-day operations.',
  },
  {
    question: 'How does the migration process work?',
    answer: 'Our onboarding team digitizes your existing checklists and imports your location hierarchy. Most teams are running their first audits on Audiment within 1-2 weeks, often in parallel with their existing system.',
  },
  {
    question: 'Can we run a trial in a few locations first?',
    answer: 'Yes, and we recommend it. Most teams start with 3-5 locations to validate the workflow, then expand once managers are comfortable with the interface.',
  },
];

// ─── Component Implementation ────────────────────────────────────────────────

function CompareSafetyCulturePage() {
  const cal = getCalAttributes('general');

  return (
    <>
      {/* ── Fixed vertical guide lines matching Asellus ── */}
      <div className="page-lines" />

      {/* ── Global Header (Exact match to /audiment) ── */}
      <header>
        <div className="header-inner">
          <a className="brand" href="/audiment">
            Audiment
          </a>
          <nav>
            <a href="/audiment#how-it-works">How it works</a>
            <a href="/audiment#features">Features</a>
            <a href="/audiment/use-cases">Use cases</a>
            <a href="/audiment/solutions">Solutions</a>
            <a href="/audiment/about">About</a>
            <a href="/audiment/blog">Blog</a>
            <a href="/audiment#faq">FAQ</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DotBtn id="aud-nav-cta" label="Book a call" variant="orange" calAttrs={cal} />
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

        {/* ── §1 Hero Section (Exact Asellus .hero) ── */}
        <section className="hero">
          <h1>{heroH1}</h1>
          <p>{heroSubtext}</p>
          <div className="actions">
            <DotBtn id="aud-comp-hero-cta" label="Book a Comparison Call" variant="orange" calAttrs={cal} />
            <DotBtn id="aud-comp-hero-diff" label="See differences" href="#differences" />
          </div>
        </section>

        {/* ── §2 Migration Reality (What switching actually looks like) ── */}
        <section className="intro" id="migration">
          <div>
            <h2>
              What switching<br />
              actually <i>looks like.</i>
            </h2>
            <p>
              Migrating from SafetyCulture to Audiment is fast and structured. Our team handles checklist conversion and location setup so you can run in parallel without downtime.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <article className="work-card" style={{ padding: '36px 32px', background: '#fff', textAlign: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>
                {migrationReality.timeline}
              </span>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14.5px', fontWeight: 500 }}>
                Typical rollout timeline
              </p>
            </article>

            <article className="work-card" style={{ padding: '36px 32px', background: '#fff', textAlign: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>
                {migrationReality.effort}
              </span>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14.5px', fontWeight: 500 }}>
                Internal effort required
              </p>
            </article>

            <article className="work-card" style={{ padding: '36px 32px', background: '#fff', textAlign: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>
                {migrationReality.support}
              </span>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14.5px', fontWeight: 500 }}>
                Onboarding support
              </p>
            </article>
          </div>
        </section>

        {/* ── §3 How They Differ in Practice ── */}
        <section className="intro" id="differences">
          <div>
            <h2>
              How they differ<br />
              in <i>practice.</i>
            </h2>
            <p>
              A side-by-side breakdown of how each platform handles the operational workflows that matter most to multi-location teams.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
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
                    borderLeft: '3px solid var(--orange)',
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
                    borderLeftColor: '#bbb',
                  }}>
                    <span style={{ color: '#777', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      SafetyCulture (iAuditor)
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.68, color: '#555' }}>
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
              & platform <i>fit.</i>
            </h2>
            <p>
              Choose the tool built for your operating model. Here is an honest appraisal of where each platform leads.
            </p>
          </div>
        </section>

        <section className="patterned" style={{ padding: '32px', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Where Audiment is stronger */}
            <article className="work-card" style={{ padding: '40px 36px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
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
                }}>
                  ✓
                </span>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                  Where Audiment is stronger
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {whereAudimentWins.map((win, idx) => (
                  <div key={idx}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                      {win.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, color: 'var(--muted)' }}>
                      {win.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* When SafetyCulture may be a better fit */}
            <article className="work-card" style={{ padding: '40px 36px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#f0f0f0',
                  color: '#666',
                  fontWeight: 700,
                  fontSize: '14px',
                }}>
                  ℹ
                </span>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                  When SafetyCulture may be a better fit
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {whoShouldChooseCompetitor.map((con, idx) => (
                  <div key={idx}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                      {con.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, color: 'var(--muted)' }}>
                      {con.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* ── §5 Operational Outcome Difference ── */}
        <section style={{ padding: '80px 32px', background: '#fff', borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <article className="work-card" style={{ padding: '44px 40px', background: '#faf9f6', borderLeft: '4px solid var(--orange)' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
                {operationalOutcomeDifference.title}
              </h3>
              <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.7, color: '#4a4a4a' }}>
                {operationalOutcomeDifference.text}
              </p>
            </article>
          </div>
        </section>

        {/* ── §6 Frequently Asked Questions (Exact Asellus /audiment .faq style) ── */}
        <section className="faq" id="faq" style={{ borderTop: 'none' }}>
          <div className="faq-left">
            <h2>Frequently asked<br />questions.</h2>
            <p>Common questions when comparing Audiment to SafetyCulture.</p>
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

        {/* ── §7 Verbatim Final CTA (Exact Asellus .center-head) ── */}
        <section className="center-head" style={{ borderTop: '1px solid var(--line)', padding: '110px 32px 120px' }}>
          <h2>See how they compare in your workflow</h2>
          <p style={{ marginTop: 14 }}>
            Walk through a live demo with our team. We'll map your existing audit process and show you exactly where the operational differences show up.
          </p>
          <div className="actions">
            <DotBtn id="aud-comp-bottom-cta" label="Book a Comparison Call" variant="orange" calAttrs={cal} />
          </div>
        </section>

      </main>

      {/* Global Footer */}
      <Footer service="general" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://audiment.in' },
              { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://audiment.in/compare' },
              { '@type': 'ListItem', position: 3, name: heroH1, item: 'https://audiment.in/compare/audiment-vs-safetyculture' },
            ],
          }),
        }}
      />
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
  root.render(<CompareSafetyCulturePage />);
}

observeDotBorderButtons();
observeAnimations();
initCalEmbed();

setTimeout(() => ScrollTrigger.refresh(), 300);
window.addEventListener('load', () => ScrollTrigger.refresh());
