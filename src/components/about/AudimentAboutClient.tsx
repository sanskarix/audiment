'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/new-website/Header';
import { Footer } from '@/components/new-website/Footer';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

// ─── Inline SVG helper & Icons for visual presentation ─────────────────────────

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
  camera: ['M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z', 'M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  alertTriangle: ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3', 'M12 9v4', 'M12 17h.01'],
  check: 'M20 6 9 17l-5-5',
  trendingDown: ['M22 17L13.5 8.5 8.5 13.5 2 7', 'M16 17h6v-6'],
  wifi: ['M12 20h.01', 'M2 8.82a15 15 0 0 1 20 0', 'M5 12.859a10 10 0 0 1 14 0', 'M8.5 16.429a5 5 0 0 1 7 0'],
  mapPin: ['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0', 'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  utensils: ['m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8', 'M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15zm0 0 7 7', 'm2.1 21.8 6.4-6.3', 'm19 5-7 7'],
  shoppingBag: ['M16 10a4 4 0 0 1-8 0', 'M3.103 6.034h17.794', 'M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z'],
  building2: ['M10 12h4', 'M10 8h4', 'M14 21v-3a2 2 0 0 0-4 0v3', 'M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0-2-2h-2', 'M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M16 3.128a4 4 0 0 1 0 7.744', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0'],
  shield: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  settings: ['M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915', 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  heart: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
  truck: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10', 'M17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z',
};

// ─── Motion helpers ─────────────────────────────────────────────────────────────

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

export function AudimentAboutClient() {
  useEffect(() => {
    observeDotBorderButtons();
    observeAnimations();
    initCalEmbed();
  }, []);

  return (
    <>
      <div className="page-lines" />
      <Header />

      <main id="top">
        {/* ── § Hero Section (Verbatim Copy from Git) ── */}
        <section className="aud-hero">
          <InView immediate>
            <h1>About <span className="muted">Audiment</span></h1>
            <p>
              Audit management software for multi-location businesses.
            </p>
          </InView>
        </section>

        {/* ── § Problem Section (Verbatim Headings & Paragraphs from Git) ── */}
        <section className="aud-about-section patterned" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
          <div className="aud-inner">
            <motion.div
              className="aud-about-duo-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger(0.12)}
            >
              {/* Card 1 */}
              <motion.div className="aud-about-duo-col aud-about-prose" variants={fadeUp}>
                <h2>Why multi-location operations break as they scale</h2>
                <p>
                  When you had one or two locations, you could see everything yourself. At 20 or 200, you can't. Standards drift, managers self-report, issues stay hidden, and problems surface too late.
                </p>
                <p>
                  The companies that maintain quality consistency at scale don't do it through more oversight or more reports. They do it by building execution systems that verify standards are being met – not trust-based systems that assume they are.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div className="aud-about-duo-col aud-about-prose" variants={fadeUp}>
                <h2>Why self-reporting fails in distributed teams</h2>
                <p>
                  A completed checklist doesn't prove a standard was actually met. Without photo evidence and tracked follow-through, reports can look healthy while quality is slipping. This isn't a motivation problem – it's a system problem.
                </p>
                <p>
                  Under shift pressure, managers make rational short-term decisions. They complete audits from memory. They mark checks done that they believe were done. Over weeks and months, these small inaccuracies compound into a significant gap between reported performance and actual performance.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── § Capabilities Section (Verbatim List items from Git) ── */}
        <section id="solution" className="aud-solution-section">
          <div className="aud-inner">
            <div className="aud-solution-header">
              <h2>What Audiment is built to do</h2>
              <p>
                Audiment helps you run audits across every location with proof, tracking, and accountability.
              </p>
            </div>

            <motion.div
              className="aud-solution-cards"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger()}
            >
              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.camera} size={20} /></div>
                <h3>Proof-based audits:</h3>
                <p>Critical checks require photo or video evidence before they can be marked complete.</p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.alertTriangle} size={20} /></div>
                <h3>Issue tracking:</h3>
                <p>Failed standards become tracked issues so you can see what's broken and where.</p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.check} size={20} /></div>
                <h3>Corrective actions:</h3>
                <p>Every failure becomes an assigned task with a deadline and proof of closure.</p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.trendingDown} size={20} /></div>
                <h3>Trend detection:</h3>
                <p>See which locations keep scoring low and where the same issues keep recurring.</p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.wifi} size={20} /></div>
                <h3>Offline audits:</h3>
                <p>Audits run offline and sync automatically when the device reconnects.</p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.mapPin} size={20} /></div>
                <h3>Geo-verification:</h3>
                <p>Confirm that auditors were physically on-site when audits were completed.</p>
              </motion.div>
            </motion.div>

            {/* Verbatim Links Paragraph from Git */}
            <div className="aud-about-clean-context" style={{ textAlign: 'center', marginTop: '40px' }}>
              <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
                For deeper context, see <Link href="/operational-drift" className="aud-link-underline">operational drift</Link>, <Link href="/platform/proof-based-audits" className="aud-link-underline">proof-based audits</Link>, and <Link href="/platform/corrective-actions" className="aud-link-underline">corrective actions</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* ── § Who It Is For Section (Verbatim Copy from Git) ── */}
        <section className="aud-about-section">
          <div className="aud-inner">
            <InView>
              <div className="aud-head--center" style={{ marginBottom: '48px' }}>
                <h2>Who it is for</h2>
              </div>
            </InView>

            <motion.div
              className="aud-solution-cards"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger(0.1)}
            >
              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.building2} size={20} /></div>
                <p>
                  Audiment is built for founders and operations teams who run multi-location businesses and need to know what's actually happening on the ground.
                </p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.users} size={20} /></div>
                <p>
                  The strongest fit is businesses with 10–500+ locations that can't rely on paper checklists and WhatsApp threads to maintain standards.
                </p>
              </motion.div>

              <motion.div className="aud-solution-card" variants={fadeUp}>
                <div className="aud-solution-icon"><SVG d={I.shield} size={20} /></div>
                <p>
                  Operations leaders, area managers, quality teams, and compliance managers use Audiment to standardize what gets audited, verify that it's actually done, and close issues before they escalate.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── § Industries Served Section (Verbatim Copy from Git) ── */}
        <section id="use-cases" className="aud-about-section patterned" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
          <div className="aud-inner">
            <InView>
              <div className="aud-solution-header" style={{ marginBottom: '40px' }}>
                <h2>Industries served</h2>
              </div>
            </InView>

            <motion.div
              className="aud-about-industry-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              variants={stagger(0.06)}
            >
              {[
                { title: 'Quick service restaurants (QSR) and restaurant chains', icon: I.utensils },
                { title: 'Retail chains and multi-store operations', icon: I.shoppingBag },
                { title: 'Hotels and hospitality groups', icon: I.building2 },
                { title: 'Franchise networks', icon: I.users },
                { title: 'Food safety and FSSAI compliance', icon: I.shield },
                { title: 'Manufacturing and production facilities', icon: I.settings },
                { title: 'Healthcare and multi-facility quality management', icon: I.heart },
                { title: 'Logistics, warehousing, and supply chain networks', icon: I.truck },
                { title: 'Automotive dealerships and service operations', icon: I.wrench },
              ].map((item) => (
                <motion.div key={item.title} className="aud-about-industry-card" variants={fadeUp}>
                  <div className="aud-card-icon">
                    <SVG d={item.icon} size={18} />
                  </div>
                  <h3>{item.title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── § Built by Asellus LLP & Get in Touch (Verbatim Copy from Git) ── */}
        <section id="comparison" className="aud-about-section" style={{ paddingTop: '100px', paddingBottom: '160px' }}>
          <div className="aud-inner">
            <motion.div
              className="aud-about-footer-info-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger()}
            >
              {/* Built by Asellus LLP */}
              <motion.div className="aud-about-info-col" variants={fadeUp}>
                <h2>Built by Asellus LLP</h2>
                <p>
                  Audiment is developed by Asellus LLP, an India-based technology company focused on operational software for distributed businesses. The platform runs in any mobile browser with no app download required – designed for field teams who need to run audits quickly and reliably across locations.
                </p>
              </motion.div>

              {/* Get in touch */}
              <motion.div className="aud-about-info-col" variants={fadeUp}>
                <h2>Get in touch</h2>
                <p>
                  For inquiries, demos, or partnership discussions:<br />
                  <strong>Email:</strong> <a href="mailto:hello@audiment.com" className="aud-contact-email-link">hello@audiment.com</a>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
