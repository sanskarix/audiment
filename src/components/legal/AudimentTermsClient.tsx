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
  { id: 'agreement', title: 'Agreement to Terms' },
  { id: 'section-01', title: '01. Our Services' },
  { id: 'section-02', title: '02. Intellectual Property' },
  { id: 'section-03', title: '03. User Representations' },
  { id: 'section-04', title: '04. Purchases & Payment' },
  { id: 'section-05', title: '05. Subscriptions' },
  { id: 'section-06', title: '06. Prohibited Activities' },
  { id: 'section-07', title: '07. Contributions' },
  { id: 'section-08', title: '08. Contribution License' },
  { id: 'section-09', title: '09. Services Management' },
  { id: 'section-10', title: '10. Privacy Policy' },
  { id: 'section-11', title: '11. Term & Termination' },
  { id: 'section-12', title: '12. Modifications' },
  { id: 'section-13', title: '13. Governing Law' },
  { id: 'section-14', title: '14. Dispute Resolution' },
  { id: 'section-15', title: '15. Corrections' },
  { id: 'section-16', title: '16. Disclaimer' },
  { id: 'section-17', title: '17. Limitations of Liability' },
  { id: 'section-18', title: '18. Indemnification' },
  { id: 'section-19', title: '19. User Data' },
  { id: 'section-20', title: '20. Electronic Comms' },
  { id: 'section-21', title: '21. Miscellaneous' },
  { id: 'section-22', title: '22. Contact Us' },
];

// ─── Component Implementation ────────────────────────────────────────────────

export function AudimentTermsClient() {
  const cal = getCalAttributes('general');
  const [activeId, setActiveId] = useState<string>('agreement');

  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let t1: ReturnType<typeof setTimeout> | undefined;

    const onLoad = () => ScrollTrigger.refresh();

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
      window.addEventListener('load', onLoad);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHeavy, { timeout: 1200 });
    } else {
      setTimeout(initHeavy, 300);
    }

    return () => {
      if (t1) clearTimeout(t1);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', handleScroll);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="page-lines" />

      {/* Global Header */}
      <Header ctaId="aud-terms-nav-cta" />


      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section className="aud-sol-detail-hero" style={{ paddingBottom: 48 }}>
          <div className="aud-inner">
            <div className="aud-sol-detail-hero-content">
              <h1>Terms of Service</h1>
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
              
              {/* Agreement preamble */}
              <section id="agreement" className="aud-legal-section">
                <span className="aud-legal-num">Agreement to our Legal Terms</span>
                <p>
                  We are <strong>Asellus LLP</strong>, doing business as{' '}
                  <strong>Audiment</strong>, a company registered in India at
                  82 A Galaxy Homes, Indore, Madhya Pradesh 452007, India.
                </p>
                <p>
                  We operate the website{' '}
                  <a href="https://audiment.in" target="_blank" rel="noopener noreferrer">
                    https://audiment.in
                  </a>{' '}
                  (&quot;Site&quot;), as well as any other related products and services that refer or link to these legal terms
                  (collectively, the &quot;Services&quot;).
                </p>
                <p>
                  Audiment is a cloud-based audit management platform designed for multi-location businesses. It enables
                  organizations to create, assign, and track operational audits across multiple branches and locations.
                  Users can manage audit templates, assign auditors, monitor compliance status, and generate reports, all
                  from a centralized dashboard.
                </p>
                <p>
                  You can contact us by phone at{' '}
                  <a href="tel:+918962630767">+91 8962630767</a>,
                  email at{' '}
                  <a href="mailto:support@audiment.io">support@audiment.io</a>,
                  or by mail to 82 A Galaxy Homes, Indore, Madhya Pradesh 452007, India.
                </p>
                <p>
                  These Legal Terms constitute a legally binding agreement between you (personally or on behalf of an entity)
                  and Asellus LLP. By accessing the Services, you confirm you have read, understood, and agreed to be bound
                  by these Legal Terms.{' '}
                  <strong>
                    IF YOU DO NOT AGREE, YOU MUST DISCONTINUE USE IMMEDIATELY.
                  </strong>
                </p>
                <p>
                  The Services are intended for users who are at least 18 years old.
                </p>
              </section>

              {/* Section 01 */}
              <section id="section-01" className="aud-legal-section">
                <span className="aud-legal-num">01</span>
                <h2>Our Services</h2>
                <p>
                  The information provided when using the Services is not intended for distribution to any person or entity
                  where such use would be contrary to law or regulation. Users who access the Services from other locations
                  do so on their own initiative and are solely responsible for compliance with local laws.
                </p>
              </section>

              {/* Section 02 */}
              <section id="section-02" className="aud-legal-section">
                <span className="aud-legal-num">02</span>
                <h2>Intellectual Property Rights</h2>
                <p>
                  We own or are licensed to use all intellectual property rights in our Services, including source code,
                  databases, functionality, software, website designs, text, and graphics (&quot;Content&quot;), as well as
                  trademarks, service marks, and logos (&quot;Marks&quot;). Our Content and Marks are protected by copyright and
                  trademark laws around the world and are provided &quot;AS IS&quot; for your internal business purpose only.
                </p>
                <p>
                  Subject to compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable
                  license to access the Services solely for your internal business purpose.
                </p>
                <p>
                  No part of the Services, Content, or Marks may be copied, reproduced, republished, uploaded, transmitted,
                  distributed, sold, or otherwise exploited for any commercial purpose without our express prior written
                  permission. Requests may be sent to{' '}
                  <a href="mailto:support@audiment.io">support@audiment.io</a>.
                </p>
                <p>
                  Any breach of these Intellectual Property Rights will constitute a material breach and your right to use
                  the Services will terminate immediately.
                </p>
                <p>
                  <strong>Submissions:</strong> By sending us any question,
                  comment, suggestion, or feedback (&quot;Submissions&quot;), you assign to us all intellectual property rights in
                  such Submission. We may use Submissions for any lawful purpose without compensation.
                </p>
              </section>

              {/* Section 03 */}
              <section id="section-03" className="aud-legal-section">
                <span className="aud-legal-num">03</span>
                <h2>User Representations</h2>
                <p>By using the Services, you represent and warrant that:</p>
                <ul>
                  <li>You have the legal capacity to agree to these Legal Terms</li>
                  <li>You are at least 18 years of age</li>
                  <li>You will not access the Services through automated or non-human means</li>
                  <li>You will not use the Services for any illegal or unauthorized purpose</li>
                  <li>Your use of the Services will not violate any applicable law or regulation</li>
                </ul>
              </section>

              {/* Section 04 */}
              <section id="section-04" className="aud-legal-section">
                <span className="aud-legal-num">04</span>
                <h2>Purchases and Payment</h2>
                <p>We accept the following forms of payment:</p>
                <ul>
                  <li>Bank Transfer (NEFT/IMPS)</li>
                  <li>UPI</li>
                </ul>
                <p>
                  All payments must be made in Indian Rupees (INR). You agree to provide accurate and complete purchase and
                  account information. We reserve the right to refuse any order placed through the Services.
                </p>
              </section>

              {/* Section 05 */}
              <section id="section-05" className="aud-legal-section">
                <span className="aud-legal-num">05</span>
                <h2>Subscriptions</h2>
                <h3>Billing and Renewal</h3>
                <p>
                  Subscriptions are billed on a periodic basis as agreed at the time of purchase. Subscriptions can be
                  renewed by contacting our team at{' '}
                  <a href="mailto:support@audiment.io">support@audiment.io</a>.
                  Upon receiving a renewal request, we will extend the subscription validity and send a confirmation with
                  the updated terms.
                </p>
                <h3>Cancellation</h3>
                <p>
                  You may cancel your subscription at any time by contacting us at{' '}
                  <a href="mailto:support@audiment.io">support@audiment.io</a>.
                  Cancellation will take effect at the end of the current paid term.
                </p>
                <h3>Fee Changes</h3>
                <p>
                  We may modify subscription fees at any time. Fee changes will be communicated to you in advance and will
                  take effect at the start of the next subscription period.
                </p>
                <p>All purchases are non-refundable.</p>
              </section>

              {/* Section 06 */}
              <section id="section-06" className="aud-legal-section">
                <span className="aud-legal-num">06</span>
                <h2>Prohibited Activities</h2>
                <p>
                  You may not access or use the Services for any purpose other than that for which we make the Services
                  available. Prohibited activities include but are not limited to:
                </p>
                <ul>
                  <li>Sell or otherwise transfer your profile or account credentials to another person or entity</li>
                  <li>Attempt to reverse engineer, decompile, or extract the source code of the platform or any of its components</li>
                  <li>Use the platform to store, process, or transmit data belonging to any organization other than your own registered business entity without explicit written authorization from Audiment</li>
                  <li>Systematically retrieve data from the Services to create a collection or database without our written permission</li>
                  <li>Trick, defraud, or mislead us or other users</li>
                  <li>Circumvent, disable, or interfere with security-related features of the Services</li>
                  <li>Use the Services in a manner inconsistent with any applicable laws or regulations</li>
                </ul>
              </section>

              {/* Section 07 */}
              <section id="section-07" className="aud-legal-section">
                <span className="aud-legal-num">07</span>
                <h2>User Generated Contributions</h2>
                <p>
                  The Services may allow you to submit or upload content (&quot;Contributions&quot;). By submitting Contributions,
                  you grant us a license to use, reproduce, and distribute such content in connection with operating the
                  Services. You are solely responsible for your Contributions and confirm they do not violate any
                  third-party rights or applicable law.
                </p>
              </section>

              {/* Section 08 */}
              <section id="section-08" className="aud-legal-section">
                <span className="aud-legal-num">08</span>
                <h2>Contribution License</h2>
                <p>
                  By submitting Contributions, you grant Audiment a non-exclusive, royalty-free, worldwide license to use,
                  host, store, reproduce, modify, and display your Contributions solely for the purpose of providing and
                  improving the Services.
                </p>
              </section>

              {/* Section 09 */}
              <section id="section-09" className="aud-legal-section">
                <span className="aud-legal-num">09</span>
                <h2>Services Management</h2>
                <p>We reserve the right to:</p>
                <ul>
                  <li>Monitor the Services for violations of these Legal Terms</li>
                  <li>Take appropriate legal action against violators</li>
                  <li>Restrict or deny access to the Services at our sole discretion</li>
                  <li>Remove or disable any content that is excessive or burdensome</li>
                  <li>Manage the Services to protect our rights and property</li>
                </ul>
              </section>

              {/* Section 10 */}
              <section id="section-10" className="aud-legal-section">
                <span className="aud-legal-num">10</span>
                <h2>Privacy Policy</h2>
                <p>
                  We care about data privacy and security. Please review our{' '}
                  <a href="/privacy-policy">Privacy Policy</a>. By using the Services, you agree to be bound by our Privacy Policy. The Services are hosted in
                  the United States and India.
                </p>
              </section>

              {/* Section 11 */}
              <section id="section-11" className="aud-legal-section">
                <span className="aud-legal-num">11</span>
                <h2>Term and Termination</h2>
                <p>
                  These Legal Terms remain in full force while you use the Services. We reserve the right to deny access
                  to or use of the Services, without notice, to anyone for any reason, including violation of these Legal
                  Terms.
                </p>
                <p>
                  If your account is terminated, you are prohibited from registering a new account under your name or a
                  third party&apos;s name. In addition to terminating your account, we reserve the right to take appropriate
                  legal action.
                </p>
              </section>

              {/* Section 12 */}
              <section id="section-12" className="aud-legal-section">
                <span className="aud-legal-num">12</span>
                <h2>Modifications and Interruptions</h2>
                <p>
                  We reserve the right to change, modify, or remove the contents of the Services at any time without
                  notice. We will not be liable for any modification, suspension, or discontinuation of the Services.
                </p>
                <p>
                  We cannot guarantee the Services will be available at all times. We may experience hardware, software,
                  or maintenance issues. We are not liable for any loss or inconvenience caused by unavailability of
                  the Services.
                </p>
              </section>

              {/* Section 13 */}
              <section id="section-13" className="aud-legal-section">
                <span className="aud-legal-num">13</span>
                <h2>Governing Law</h2>
                <p>
                  These Legal Terms are governed by the laws of India. Asellus LLP and you irrevocably consent to the
                  exclusive jurisdiction of the courts in Indore, Madhya Pradesh, India to resolve any disputes.
                </p>
              </section>

              {/* Section 14 */}
              <section id="section-14" className="aud-legal-section">
                <span className="aud-legal-num">14</span>
                <h2>Dispute Resolution</h2>
                <h3>Informal Negotiations</h3>
                <p>
                  Before initiating arbitration, parties agree to attempt to resolve any dispute informally for at least
                  30 days by contacting us at{' '}
                  <a href="mailto:support@audiment.io">support@audiment.io</a>.
                </p>
                <h3>Binding Arbitration</h3>
                <p>
                  If informal negotiations fail, disputes shall be resolved through binding arbitration under the
                  Arbitration and Conciliation Act, 1996. The arbitration shall take place in Indore, India. One (1)
                  arbitrator shall preside. Proceedings shall be conducted in English.
                </p>
                <h3>Restrictions</h3>
                <p>
                  Arbitration shall be limited to the dispute between parties individually. Class actions and
                  representative proceedings are not permitted.
                </p>
              </section>

              {/* Section 15 */}
              <section id="section-15" className="aud-legal-section">
                <span className="aud-legal-num">15</span>
                <h2>Corrections</h2>
                <p>
                  There may be information on the Services that contains typographical errors, inaccuracies, or omissions.
                  We reserve the right to correct any errors and to update information at any time without prior notice.
                </p>
              </section>

              {/* Section 16 */}
              <section id="section-16" className="aud-legal-section">
                <span className="aud-legal-num">16</span>
                <h2>Disclaimer</h2>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '14px', lineHeight: 1.7, color: '#555555' }}>
                  The services are provided on an as-is and as-available basis. Your use of the services is at your sole
                  risk. We disclaim all warranties, express or implied, including warranties of merchantability, fitness
                  for a particular purpose, and non-infringement. We do not warrant that the services will be
                  uninterrupted, error-free, or free of viruses or other harmful components.
                </p>
              </section>

              {/* Section 17 */}
              <section id="section-17" className="aud-legal-section">
                <span className="aud-legal-num">17</span>
                <h2>Limitations of Liability</h2>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '14px', lineHeight: 1.7, color: '#555555' }}>
                  To the fullest extent permitted by law, in no event shall Asellus LLP or its directors, employees, or
                  agents be liable for any indirect, incidental, special, or consequential damages arising from your use
                  of the services.
                </p>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '14px', lineHeight: 1.7, color: '#555555' }}>
                  Our total liability to you for all claims arising from use of the services shall not exceed the amount
                  paid by you to us in the six (6) months prior to the event giving rise to the claim. Any claim must be
                  brought within one (1) year of the date the cause of action arose.
                </p>
              </section>

              {/* Section 18 */}
              <section id="section-18" className="aud-legal-section">
                <span className="aud-legal-num">18</span>
                <h2>Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Asellus LLP and its officers, directors, employees,
                  and agents from any claims, liabilities, damages, or expenses arising from: (1) your use of the
                  Services; (2) your breach of these Legal Terms; (3) your Contributions; or (4) your violation of any
                  third-party rights.
                </p>
              </section>

              {/* Section 19 */}
              <section id="section-19" className="aud-legal-section">
                <span className="aud-legal-num">19</span>
                <h2>User Data</h2>
                <p>
                  We will maintain certain data you transmit to the Services for the purpose of managing the Services.
                  You are solely responsible for all data you transmit. We shall have no liability for any loss or
                  corruption of such data.
                </p>
              </section>

              {/* Section 20 */}
              <section id="section-20" className="aud-legal-section">
                <span className="aud-legal-num">20</span>
                <h2>Electronic Communications, Transactions, and Signatures</h2>
                <p>
                  Visiting the Services, sending emails, and completing online forms constitute electronic communications.
                  You consent to receive electronic communications and agree that all agreements and notices provided
                  electronically satisfy any legal requirement that such communications be in writing.
                </p>
              </section>

              {/* Section 21 */}
              <section id="section-21" className="aud-legal-section">
                <span className="aud-legal-num">21</span>
                <h2>Miscellaneous</h2>
                <p>
                  These Legal Terms constitute the entire agreement between you and Asellus LLP regarding your use of
                  the Services. Our failure to exercise any right under these Legal Terms shall not constitute a waiver
                  of such right. If any provision is found to be unenforceable, the remaining provisions will continue
                  in full force. We may assign our rights and obligations to others at any time.
                </p>
              </section>

              {/* Section 22 */}
              <section id="section-22" className="aud-legal-section">
                <span className="aud-legal-num">22</span>
                <h2>Contact Us</h2>
                <p>
                  To resolve a complaint or receive further information regarding use of the Services, please contact us:
                </p>
                <div className="aud-legal-card">
                  <h3 className="aud-legal-card-title">Audiment Legal Team</h3>
                  <div className="aud-legal-contact-list">
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Company:</span>
                      <span>Asellus LLP (doing business as Audiment)</span>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Address:</span>
                      <span>82 A Galaxy Homes, Indore, Madhya Pradesh 452007, India</span>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Phone:</span>
                      <a href="tel:+918962630767">+91 8962630767</a>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Email:</span>
                      <a href="mailto:support@audiment.io">support@audiment.io</a>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </section>
      </main>

      {/* Global Asellus Footer */}
      <Footer service="general" />
    </>
  );
}

