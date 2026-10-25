import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getCalAttributes, CalServiceType } from '@/lib/cal';

interface FooterProps {
  service?: CalServiceType;
  hideCta?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ service = 'demo', hideCta = false }) => {
  const calAttrs = getCalAttributes(service);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {!hideCta && (
        <section className="site-prefooter-cta" aria-label="Book an operational demo">
          <div className="site-prefooter-cta-inner">
            <div className="prefooter-cta-left">
              <h2 className="prefooter-cta-heading">
                Ready to see what&apos;s actually happening at your <span className="aud-text-orange">branches?</span>
              </h2>
              <p className="prefooter-cta-subtext">
                Book a 20-minute operational walkthrough with our team.
              </p>
            </div>

            <div className="prefooter-cta-right">
              <a
                className="prefooter-cta-button"
                href="javascript:void(0);"
                {...calAttrs}
              >
                <span>Book a Demo</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

      <footer id="contact" className="site-footer">
        {/* Signature Thick Light Moving Stripes Background */}
        <div className="footer-moving-stripes" aria-hidden="true" />
        <div className="footer-glow-backdrop" aria-hidden="true" />

        <div className="footer-inner">
          {/* 4-Column Main Navigation Grid */}
          <div className="footer-main-grid">
            {/* Brand & Studio Meta */}
            <div className="footer-col footer-col--brand">
              <Link className="brand" href="/">
                <Image src="/logos/audiment-white.svg" alt="Audiment" className="brand-logo-img" width={120} height={28} loading="lazy" />
              </Link>
              <p className="footer-desc">
                Audit management software and operational compliance engine for multi-location businesses.
                Run proof-based audits, verify on-site execution with GPS proof, and track corrective actions to resolution.
              </p>
              <div>
              </div>
            </div>

            {/* Column 1: Solutions */}
            <div className="footer-col">
              <h5 className="footer-col-title">
                <span className="col-num">01 /</span>
                <span>Solutions</span>
              </h5>
              <ul className="footer-links-list">
                <li><Link href="/solutions/restaurant-audit-software">Restaurant Audit</Link></li>
                <li><Link href="/solutions/retail-audit-software">Retail Store Audit</Link></li>
                <li><Link href="/solutions/franchise-audit-software">Franchise Consistency</Link></li>
                <li><Link href="/solutions/hotel-audit-software">Hotel &amp; Hospitality</Link></li>
                <li><Link href="/solutions/qsr-audit-software">QSR &amp; Food Chains</Link></li>
                <li><Link href="/solutions/food-safety-audit-software">Food Safety &amp; FSSAI</Link></li>
                <li><Link href="/solutions/manufacturing-audit-software">Manufacturing Audit</Link></li>
                <li><Link href="/solutions">View All Solutions</Link></li>
              </ul>
            </div>

            {/* Column 2: Platform & Use Cases */}
            <div className="footer-col">
              <h5 className="footer-col-title">
                <span className="col-num">02 /</span>
                <span>Platform</span>
              </h5>
              <ul className="footer-links-list">
                <li><Link href="/platform/proof-based-audits">Proof-Based Audits</Link></li>
                <li><Link href="/platform/corrective-actions">Corrective Actions</Link></li>
                <li><Link href="/use-cases/corrective-action-tracking">Action Tracking</Link></li>
                <li><Link href="/platform/geo-verified-audits">Geo-Verified Field Audits</Link></li>
                <li><Link href="/platform/operational-dashboards">Operational Dashboards</Link></li>
                <li><Link href="/use-cases/multi-location-compliance">Multi-Location Compliance</Link></li>
                <li><Link href="/use-cases/inspection-management-software">Inspection Management</Link></li>
                <li><Link href="/use-cases/audit-checklist-software">Audit Checklist Software</Link></li>
              </ul>
            </div>

            {/* Column 3: Compare & Company */}
            <div className="footer-col">
              <h5 className="footer-col-title">
                <span className="col-num">03 /</span>
                <span>Compare &amp; Legal</span>
              </h5>
              <ul className="footer-links-list">
                <li><Link href="/compare">All Comparisons</Link></li>
                <li><Link href="/compare/audiment-vs-safetyculture">vs SafetyCulture</Link></li>
                <li><Link href="/compare/audiment-vs-goaudits">vs GoAudits</Link></li>
                <li><Link href="/compare/audiment-vs-jolt">vs Jolt</Link></li>
                <li><Link href="/compare/audiment-vs-zenput">vs Zenput</Link></li>
                <li><Link href="/about">About Audiment</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/blog">Operational Blog</Link></li>
                <li><Link href="/glossary">Operations Glossary</Link></li>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service">Terms of Service</Link></li>
                <li><Link href="/cookie-policy">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Screen-Wide Brand Section with Glowing Hollow Text */}
        <motion.div
          className="footer-brand-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          onClick={scrollToTop}
          title="Scroll to top"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToTop();
            }
          }}
        >
          <div className="footer-brand-inner">
            <motion.span
              className="hollow-brand-text"
              variants={{
                hidden: {
                  webkitTextStrokeColor: 'rgba(255, 255, 255, 0.14)',
                  filter: 'drop-shadow(0 0 0px rgba(255, 84, 0, 0))',
                },
                visible: {
                  webkitTextStrokeColor: 'rgba(255, 84, 0, 0.65)',
                  filter: 'drop-shadow(0 0 28px rgba(255, 84, 0, 0.35))',
                  transition: { duration: 1.4, ease: [0.215, 0.61, 0.355, 1] as any },
                },
              }}
            >
              AUDIMENT
            </motion.span>
          </div>
        </motion.div>
      </footer>
    </>
  );
};
