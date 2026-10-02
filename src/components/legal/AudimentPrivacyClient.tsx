'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

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

// ─── Table of Contents Items ────────────────────────────────────────────────

const tocItems = [
  { id: 'overview', title: 'Overview' },
  { id: 'summary', title: 'Summary Key Points' },
  { id: 'section-01', title: '01. Information We Collect' },
  { id: 'section-02', title: '02. How We Process Info' },
  { id: 'section-03', title: '03. Sharing Information' },
  { id: 'section-04', title: '04. Cookies & Tracking' },
  { id: 'section-05', title: '05. Data Retention' },
  { id: 'section-06', title: '06. Security & Safety' },
  { id: 'section-07', title: '07. Information from Minors' },
  { id: 'section-08', title: '08. Your Privacy Rights' },
  { id: 'section-09', title: '09. Do-Not-Track Controls' },
  { id: 'section-10', title: '10. Notice Updates' },
  { id: 'section-11', title: '11. Contact Us' },
  { id: 'section-12', title: '12. Review or Delete Data' },
];

const thirdParties = [
  { name: 'Google Cloud Platform', desc: 'Cloud Computing' },
  { name: 'Cloud Firestore', desc: 'Database Infrastructure' },
  { name: 'Cloud Storage for Firebase', desc: 'File Storage' },
  { name: 'Firebase Auth', desc: 'Authentication' },
  { name: 'Google Analytics (GA4)', desc: 'Analytics' },
  { name: 'Vercel', desc: 'Website Hosting' },
  { name: 'Firebase Crash Reporting', desc: 'Performance Monitoring' },
];

export function AudimentPrivacyClient() {
  const cal = getCalAttributes('general');
  const [activeId, setActiveId] = useState<string>('overview');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    observeDotBorderButtons();
    observeAnimations();
    initCalEmbed();

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      clearTimeout(t1);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', handleScroll);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="page-lines" />

      {/* Global Header */}
      <Header ctaId="aud-privacy-nav-cta" />


      <main id="top">
        {/* Hero Section */}
        <section className="aud-sol-detail-hero" style={{ paddingBottom: 48 }}>
          <div className="aud-inner">
            <div className="aud-sol-detail-hero-content">
              <h1>Privacy Policy</h1>
              <p className="aud-sol-detail-hero-sub" style={{ maxWidth: 640 }}>
                Last updated: April 11, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Legal Body Section with Sticky TOC */}
        <section className="aud-legal-body-section">
          <div className="aud-legal-dual-grid">
            {/* Left Sidebar Table of Contents */}
            <aside className="aud-legal-sidebar">
              <div className="aud-legal-toc-box">
                <span className="aud-legal-toc-label">Table of Contents</span>
                <ul className="aud-legal-toc-list">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`aud-legal-toc-link ${activeId === item.id ? 'active' : ''}`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Right Editorial Legal Content (100% Verbatim) */}
            <div className="aud-legal-prose">
              {/* Introduction / Overview */}
              <section id="overview" className="aud-legal-section">
                <p>
                  This Privacy Notice for <strong>Asellus LLP</strong> (doing business as <strong>Audiment</strong>) referred
                  to as &quot;we,&quot; &quot;us,&quot; or &quot;our&quot; describes how and why we access, collect, store, use, and share your personal
                  information when you use our services, including when you:
                </p>
                <ul>
                  <li>
                    Visit our website at <a href="https://audiment.in" target="_blank" rel="noopener noreferrer">audiment.in</a> or any website of ours that links to this Privacy Notice
                  </li>
                  <li>Use our audit management platform</li>
                  <li>Engage with us in other related ways, including marketing or events</li>
                </ul>
                <p>
                  <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you
                  understand your privacy rights and choices. If you do not agree with our policies and practices, please do not
                  use our Services. For questions, contact us at <a href="mailto:privacy@audiment.io">privacy@audiment.io</a>.
                </p>
              </section>

              {/* Summary Key Points */}
              <section id="summary" className="aud-legal-section">
                <span className="aud-legal-num">Summary</span>
                <h2>Key Points</h2>
                <div className="aud-legal-card" style={{ marginTop: 12 }}>
                  <ul style={{ marginBottom: 0 }}>
                    <li><strong>What we collect:</strong> Personal information you provide when registering or using our services</li>
                    <li><strong>Sensitive info:</strong> We do not process sensitive personal information</li>
                    <li><strong>Third parties:</strong> We do not collect information from third parties</li>
                    <li><strong>Why we process:</strong> To provide, improve, and secure our services, and to comply with law</li>
                    <li><strong>Who we share with:</strong> Specific service providers (Firebase, Google Cloud, Vercel) under contract</li>
                    <li><strong>Your rights:</strong> Depending on your location, you may review, change, or delete your data at any time</li>
                    <li><strong>How to exercise rights:</strong> Submit a data subject access request or contact <a href="mailto:privacy@audiment.io">privacy@audiment.io</a></li>
                  </ul>
                </div>
              </section>

              {/* Section 01 */}
              <section id="section-01" className="aud-legal-section">
                <span className="aud-legal-num">01</span>
                <h2>What Information Do We Collect?</h2>
                <h3>Personal information you disclose to us</h3>
                <p><em>In short: We collect personal information that you provide to us.</em></p>
                <p>
                  We collect personal information you voluntarily provide when you register on the Services, express an
                  interest in our products, participate in activities on the Services, or otherwise contact us. The personal
                  information we collect may include:
                </p>
                <div className="aud-legal-pills">
                  <span className="aud-legal-pill">Names</span>
                  <span className="aud-legal-pill">Email addresses</span>
                  <span className="aud-legal-pill">Phone numbers</span>
                  <span className="aud-legal-pill">Job titles</span>
                  <span className="aud-legal-pill">Usernames</span>
                  <span className="aud-legal-pill">Passwords</span>
                </div>
                <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
                <p>
                  All personal information you provide must be true, complete, and accurate. Please notify us of any changes.
                </p>

                <h3>Information automatically collected</h3>
                <p>
                  We automatically collect certain information when you visit, use, or navigate the Services – such as IP
                  address, browser and device characteristics, operating system, language preferences, referring URLs, and
                  information about how you interact with our Services. This data does not reveal your specific identity but may
                  include device and usage information.
                </p>

                <h3>Google API</h3>
                <p>
                  Our use of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" target="_blank" rel="noopener noreferrer">Limited Use requirements</a>.
                </p>
              </section>

              {/* Section 02 */}
              <section id="section-02" className="aud-legal-section">
                <span className="aud-legal-num">02</span>
                <h2>How Do We Process Your Information?</h2>
                <p><em>In short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em></p>
                <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
                <ul>
                  <li><strong>Account creation and authentication:</strong> To create and manage your account and keep it in working order</li>
                  <li><strong>Service delivery:</strong> To provide the features and functionality of our audit management platform</li>
                  <li><strong>Communication:</strong> To respond to your inquiries and send service-related notifications</li>
                  <li><strong>Security and fraud prevention:</strong> To identify and prevent fraudulent activity and protect the security of our Services</li>
                  <li><strong>Usage trends:</strong> To understand how our Services are used so we can improve them</li>
                  <li><strong>Legal compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              {/* Section 03 */}
              <section id="section-03" className="aud-legal-section">
                <span className="aud-legal-num">03</span>
                <h2>When and With Whom Do We Share Your Information?</h2>
                <p><em>In short: We may share information in specific situations and with the following third parties.</em></p>
                <p>
                  We have contracts in place with all third parties, designed to help safeguard your personal information. They
                  cannot use your personal information unless we have instructed them to do so.
                </p>

                <div className="aud-legal-grid-2">
                  {thirdParties.map((tp, idx) => (
                    <div key={idx} className="aud-legal-grid-item">
                      <p style={{ fontWeight: 600, color: 'var(--ink)' }}>{tp.name}</p>
                      <p style={{ fontSize: '13.5px', color: '#666666', marginTop: 4 }}>{tp.desc}</p>
                    </div>
                  ))}
                </div>

                <p>
                  We may also share your information in connection with any merger, sale of company assets, financing, or
                  acquisition of all or a portion of our business.
                </p>
              </section>

              {/* Section 04 */}
              <section id="section-04" className="aud-legal-section">
                <span className="aud-legal-num">04</span>
                <h2>Do We Use Cookies and Other Tracking Technologies?</h2>
                <p><em>In short: We may use cookies and other tracking technologies to collect and store your information.</em></p>
                <p>
                  We use cookies and similar tracking technologies (such as web beacons and pixels) to gather information when
                  you interact with our Services. These help us maintain security, prevent crashes, fix bugs, save your
                  preferences, and assist with basic site functions.
                </p>
                <p>
                  We also permit service providers to use online tracking technologies on our Services for analytics purposes,
                  including Google Analytics GA4, to help us understand usage patterns and improve our Services.
                </p>
                <p>
                  Specific information about how we use cookies and how you can manage them is set out in our <Link href="/cookie-policy">Cookie Policy</Link>.
                </p>
              </section>

              {/* Section 05 */}
              <section id="section-05" className="aud-legal-section">
                <span className="aud-legal-num">05</span>
                <h2>How Long Do We Keep Your Information?</h2>
                <p><em>In short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice, unless otherwise required by law.</em></p>
                <p>
                  We will only keep your personal information for as long as it is necessary for the purposes set out in this
                  Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or
                  other legal requirements).
                </p>
                <p>
                  When we have no ongoing legitimate business need to process your personal information, we will either delete
                  or anonymize it. If deletion is not immediately possible (for example, because your information has been
                  stored in backup archives), we will securely store your information and isolate it from further processing
                  until deletion is possible.
                </p>
              </section>

              {/* Section 06 */}
              <section id="section-06" className="aud-legal-section">
                <span className="aud-legal-num">06</span>
                <h2>How Do We Keep Your Information Safe?</h2>
                <p><em>In short: We aim to protect your personal information through a system of organizational and technical security measures.</em></p>
                <p>
                  We have implemented appropriate and reasonable technical and organizational security measures designed to
                  protect the security of any personal information we process, including:
                </p>
                <ul>
                  <li>TLS encryption for all data in transit</li>
                  <li>Encryption at rest via Firebase (ISO 27001, SOC 1/2/3 certified infrastructure)</li>
                  <li>Role-based access control – admin, manager, and auditor roles with scoped permissions</li>
                  <li>Firebase Authentication with session cookies and protected middleware</li>
                  <li>Rate limiting on authentication endpoints (10 attempts per 15 minutes per IP)</li>
                  <li>Content Security Policy (CSP) headers against XSS attacks</li>
                </ul>
                <p>
                  However, no electronic transmission over the Internet or information storage technology can be guaranteed to
                  be 100% secure. You should only access the Services within a secure environment.
                </p>
              </section>

              {/* Section 07 */}
              <section id="section-07" className="aud-legal-section">
                <span className="aud-legal-num">07</span>
                <h2>Do We Collect Information from Minors?</h2>
                <p><em>In short: We do not knowingly collect data from or market to children under 18 years of age.</em></p>
                <p>
                  We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we
                  knowingly sell such personal information. By using the Services, you represent that you are at least 18 years
                  of age.
                </p>
                <p>
                  If we learn that personal information from users less than 18 years of age has been collected, we will
                  deactivate the account and take reasonable measures to promptly delete such data. If you become aware of any
                  data we may have collected from children under age 18, please contact us at <a href="mailto:support@audiment.io">support@audiment.io</a>.
                </p>
              </section>

              {/* Section 08 */}
              <section id="section-08" className="aud-legal-section">
                <span className="aud-legal-num">08</span>
                <h2>What Are Your Privacy Rights?</h2>
                <p><em>In short: You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em></p>
                <p>
                  <strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal
                  information, you have the right to withdraw your consent at any time by contacting us using the details in the
                  Contact Us section below. Note that withdrawing consent will not affect the lawfulness of processing before
                  its withdrawal.
                </p>

                <h3>Account Information</h3>
                <p>If you would like to review or change the information in your account or terminate your account, you can:</p>
                <ul>
                  <li>Log in to your account settings and update your user account</li>
                  <li>Contact us using the contact information provided</li>
                </ul>
                <p>
                  Upon your request to terminate your account, we will deactivate or delete your account and information from
                  our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot
                  problems, assist with investigations, enforce our legal terms, or comply with applicable legal requirements.
                </p>
                <p>
                  <strong>Cookies and similar technologies:</strong> Most web browsers are set to accept cookies by default.
                  You can usually choose to set your browser to remove or reject cookies, though this may affect certain
                  features or services.
                </p>
                <p>
                  If you have questions or comments about your privacy rights, email us at <a href="mailto:privacy@audiment.io">privacy@audiment.io</a>.
                </p>

                {/* Data Rights Action Card */}
                <div className="aud-legal-cta-banner">
                  <div>
                    <h3>Exercise Your Data Rights</h3>
                    <p>Submit a data subject access request to view, edit, or delete your personal information stored by Audiment.</p>
                  </div>
                  <a
                    href="mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-btn"
                  >
                    <span>Email a Data Request</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </section>

              {/* Section 09 */}
              <section id="section-09" className="aud-legal-section">
                <span className="aud-legal-num">09</span>
                <h2>Controls for Do-Not-Track Features</h2>
                <p>
                  Most web browsers and some mobile operating systems include a Do-Not-Track (&quot;DNT&quot;) feature you can activate
                  to signal your privacy preference not to have data about your online browsing activities monitored and
                  collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been
                  finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that
                  automatically communicates your choice not to be tracked online.
                </p>
              </section>

              {/* Section 10 */}
              <section id="section-10" className="aud-legal-section">
                <span className="aud-legal-num">10</span>
                <h2>Do We Make Updates to This Notice?</h2>
                <p><em>In short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></p>
                <p>
                  We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
                  &quot;Last updated&quot; date at the top of this Privacy Notice. If we make material changes, we may notify you either
                  by prominently posting a notice of such changes or by directly sending you a notification.
                </p>
                <p>
                  We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your
                  information.
                </p>
              </section>

              {/* Section 11 */}
              <section id="section-11" className="aud-legal-section">
                <span className="aud-legal-num">11</span>
                <h2>How Can You Contact Us About This Notice?</h2>
                <p>If you have questions or comments about this notice, you may contact us:</p>
                <div className="aud-legal-card">
                  <h3 className="aud-legal-card-title">Audiment Privacy Team</h3>
                  <div className="aud-legal-contact-list">
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Company:</span>
                      <span>Asellus LLP (doing business as Audiment)</span>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Email:</span>
                      <a href="mailto:privacy@audiment.io">privacy@audiment.io</a>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Website:</span>
                      <a href="https://audiment.in" target="_blank" rel="noopener noreferrer">audiment.in</a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 12 */}
              <section id="section-12" className="aud-legal-section">
                <span className="aud-legal-num">12</span>
                <h2>How Can You Review, Update, or Delete the Data We Collect From You?</h2>
                <p>
                  Based on the applicable laws of your country, you may have the right to request access to the personal
                  information we collect from you, details about how we have processed it, correct inaccuracies, or delete your
                  personal information.
                </p>
                <p>
                  To request to review, update, or delete your personal information, please submit a data subject access
                  request via the button below or email us directly at <a href="mailto:privacy@audiment.io">privacy@audiment.io</a>.
                </p>
                <div style={{ marginTop: 20 }}>
                  <a
                    href="mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--orange)',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: 4,
                      fontSize: '13.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Email a Data Request</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer service="general" />
    </>
  );
}
