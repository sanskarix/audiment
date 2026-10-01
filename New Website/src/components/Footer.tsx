import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCalAttributes, CalServiceType } from '../lib/cal';

interface FooterProps {
  isErpPage?: boolean;
  service?: CalServiceType;
}

export const Footer: React.FC<FooterProps> = ({ isErpPage = false, service }) => {
  const [copied, setCopied] = useState(false);

  let currentService: CalServiceType = service || 'general';
  if (!service && typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('development')) {
      currentService = 'customDev';
    } else if (path.includes('erp')) {
      currentService = 'erp';
    } else if (path.includes('growth')) {
      currentService = 'growth';
    }
  }
  const calAttrs = getCalAttributes(currentService);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('hello@asellus.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="site-footer">
      {/* Signature Thick Light Moving Stripes Background */}
      <div className="footer-moving-stripes" aria-hidden="true" />

      <div className="footer-inner">
        {/* Top CTA Card */}
        <div className="footer-cta-card">
          <div className="footer-cta-left">

            <h2 className="footer-cta-heading">
              Have something worth <i>building?</i>
            </h2>
            <p className="footer-cta-subtext">
              Tell us about your operational bottlenecks or custom product goals. We'll help you engineer the right system.
            </p>
          </div>

          <div className="footer-cta-right">
            <div className="footer-action-box">
              <div className="email-copy-wrapper">
                <div className="email-interactive-bar">
                  <a href="mailto:hello@asellus.in" className="email-address">
                    hello@asellus.in
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    title="Copy email to clipboard"
                  >
                    {copied ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <a
                className="footer-cta-button"
                href="javascript:void(0);"
                {...calAttrs}
              >
                <span>Talk to us</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Main Navigation Grid */}
        <div className="footer-main-grid">
          {/* Brand & Studio Meta */}
          <div className="footer-col footer-col--brand">
            <a className="brand" href="/">
              <img src="/logos/Asellus_white.svg" alt="Asellus" className="brand-logo-img" loading="lazy" decoding="async" />
            </a>
            <p className="footer-desc">
              A technology and design studio engineering custom digital products, business systems, and scalable operations around what businesses actually need.
            </p>
          </div>

          {/* Development Column */}
          <div className="footer-col">
            <h5 className="footer-col-title">
              <span>Development</span>
            </h5>
            <ul className="footer-links-list">
              <li><a href="/development#dev-websites">Websites</a></li>
              <li><a href="/development#dev-software">Custom Software</a></li>
              <li><a href="/development#dev-software">Internal Tools &amp; PMS</a></li>
              <li><a href="/development#dev-tech">Technical Stack</a></li>
              <li><a href="/development#dev-work">Our Work</a></li>
            </ul>
          </div>

          {/* ERP Column */}
          <div className="footer-col">
            <h5 className="footer-col-title">
              <span>ERP</span>
            </h5>
            <ul className="footer-links-list">
              <li><a href="/erp">ERP Overview</a></li>
              <li><a href="/erp#system">Connected Modules</a></li>
              <li><a href="/erp#problem">Operational Bottlenecks</a></li>
              <li><a href="/erp#differentiators">Key Guarantees</a></li>
              <li><a href="/erp#faq">ERP FAQ</a></li>
            </ul>
          </div>

          {/* Growth Column */}
          <div className="footer-col">
            <h5 className="footer-col-title">
              <span>Growth</span>
            </h5>
            <ul className="footer-links-list">
              <li><a href="/growth#gr-mechanism">AI Visibility</a></li>
              <li><a href="/growth#gr-branding">Branding &amp; Positioning</a></li>
              <li><a href="/growth#gr-capabilities">Growth Capabilities</a></li>
              <li><a href="/growth#gr-outcomes">Results &amp; Outcomes</a></li>
              <li><a href="#contact">Talk to us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Header-Style Screen-Wide Brand Section */}
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
                filter: 'drop-shadow(0 0 0px rgba(255, 84, 0, 0))'
              },
              visible: { 
                webkitTextStrokeColor: 'rgba(255, 84, 0, 0.65)',
                filter: 'drop-shadow(0 0 28px rgba(255, 84, 0, 0.35))',
                transition: { duration: 1.4, ease: [0.215, 0.61, 0.355, 1] as any }
              }
            }}
          >
            ASELLUS
          </motion.span>
        </div>
      </motion.div>
    </footer>
  );
};
