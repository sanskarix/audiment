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
  { id: 'section-01', title: '01. What are cookies?' },
  { id: 'section-02', title: '02. Why do we use cookies?' },
  { id: 'section-03', title: '03. How can I control cookies?' },
  { id: 'section-04', title: '04. Tracking technologies' },
  { id: 'section-05', title: '05. Targeted advertising' },
  { id: 'section-06', title: '06. Policy updates' },
  { id: 'section-07', title: '07. Further information' },
];

// ─── Component Implementation ────────────────────────────────────────────────

export function AudimentCookieClient() {
  const cal = getCalAttributes('general');
  const [activeId, setActiveId] = useState<string>('overview');

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
      <Header ctaId="aud-cookie-nav-cta" />


      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section className="aud-sol-detail-hero" style={{ paddingBottom: 48 }}>
          <div className="aud-inner">
            <div className="aud-sol-detail-hero-content">
              <h1>Cookie Policy</h1>
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
                  This Cookie Policy explains how <strong>Asellus LLP</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; and &quot;our&quot;)
                  uses cookies and similar technologies to recognize you when you visit our website
                  at <a href="https://audiment.in" target="_blank" rel="noopener noreferrer">audiment.in</a>. It explains what these technologies are and why we use them,
                  as well as your rights to control our use of them.
                </p>
                <p>
                  In some cases we may use cookies to collect personal information, or that becomes
                  personal information if we combine it with other information.
                </p>
              </section>

              {/* Section 01 */}
              <section id="section-01" className="aud-legal-section">
                <span className="aud-legal-num">01</span>
                <h2>What are cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                  Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
                  as well as to provide reporting information.
                </p>
                <p>
                  Cookies set by the website owner (in this case, Asellus LLP) are called &quot;first-party cookies.&quot; Cookies set
                  by parties other than the website owner are called &quot;third-party cookies.&quot; Third-party cookies enable
                  third-party features or functionality to be provided on or through the website (e.g., advertising,
                  interactive content, and analytics). The parties that set these third-party cookies can recognize your
                  computer both when it visits the website in question and also when it visits certain other websites.
                </p>
              </section>

              {/* Section 02 */}
              <section id="section-02" className="aud-legal-section">
                <span className="aud-legal-num">02</span>
                <h2>Why do we use cookies?</h2>
                <p>
                  We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons
                  in order for our Website to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies.
                  Other cookies also enable us to track and target the interests of our users to enhance the experience on our
                  Online Properties. Third parties serve cookies through our Website for analytics and other purposes.
                </p>
              </section>

              {/* Section 03 */}
              <section id="section-03" className="aud-legal-section">
                <span className="aud-legal-num">03</span>
                <h2>How can I control cookies?</h2>
                <p>
                  You have the right to decide whether to accept or reject cookies. Essential cookies cannot be rejected as
                  they are strictly necessary to provide you with services.
                </p>
                <p>
                  You may also set or amend your web browser controls to accept or refuse cookies. If you choose to reject
                  cookies, you may still use our Website though your access to some functionality and areas of our Website
                  may be restricted. The following links show how to manage cookie settings in the most common browsers:
                </p>

                <h3>Browser Cookie Settings</h3>
                <ul>
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" target="_blank" rel="noopener noreferrer">
                      Chrome
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">
                      Internet Explorer
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">
                      Firefox
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                      Safari
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer">
                      Edge
                    </a>
                  </li>
                  <li>
                    <a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer">
                      Opera
                    </a>
                  </li>
                </ul>

                <h3>Opt Out of Targeted Advertising</h3>
                <ul>
                  <li>
                    <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                      Digital Advertising Alliance
                    </a>
                  </li>
                  <li>
                    <a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer">
                      Digital Advertising Alliance of Canada
                    </a>
                  </li>
                  <li>
                    <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">
                      European Interactive Digital Advertising Alliance
                    </a>
                  </li>
                </ul>
              </section>

              {/* Section 04 */}
              <section id="section-04" className="aud-legal-section">
                <span className="aud-legal-num">04</span>
                <h2>What about other tracking technologies, like web beacons?</h2>
                <p>
                  Cookies are not the only way to recognize or track visitors to a website. We may use other, similar
                  technologies from time to time, like web beacons (sometimes called &quot;tracking pixels&quot; or &quot;clear gifs&quot;).
                  These are tiny graphics files that contain a unique identifier that enables us to recognize when someone
                  has visited our Website or opened an email including them. This allows us to monitor traffic patterns,
                  deliver or communicate with cookies, understand whether you have come to the website from an online
                  advertisement, improve site performance, and measure the success of email marketing campaigns. In many
                  instances, these technologies are reliant on cookies to function properly, and so declining cookies will
                  impair their functioning.
                </p>
              </section>

              {/* Section 05 */}
              <section id="section-05" className="aud-legal-section">
                <span className="aud-legal-num">05</span>
                <h2>Do you serve targeted advertising?</h2>
                <p>
                  Third parties may serve cookies on your computer or mobile device to serve advertising through our Website.
                  These companies may use information about your visits to this and other websites in order to provide
                  relevant advertisements about goods and services that you may be interested in. They may also employ
                  technology that is used to measure the effectiveness of advertisements. The information collected through
                  this process does not enable us or them to identify your name, contact details, or other details that
                  directly identify you unless you choose to provide these.
                </p>
              </section>

              {/* Section 06 */}
              <section id="section-06" className="aud-legal-section">
                <span className="aud-legal-num">06</span>
                <h2>How often will you update this Cookie Policy?</h2>
                <p>
                  We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or
                  for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly
                  to stay informed about our use of cookies and related technologies. The date at the top of this Cookie
                  Policy indicates when it was last updated.
                </p>
              </section>

              {/* Section 07 */}
              <section id="section-07" className="aud-legal-section">
                <span className="aud-legal-num">07</span>
                <h2>Where can I get further information?</h2>
                <p>
                  If you have any questions about our use of cookies or other technologies, please email us at{' '}
                  <a href="mailto:privacy@audiment.io">privacy@audiment.io</a> or by post to:
                </p>
                <div className="aud-legal-card">
                  <h3 className="aud-legal-card-title">Audiment Privacy Team</h3>
                  <div className="aud-legal-contact-list">
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Company:</span>
                      <span>Asellus LLP (doing business as Audiment)</span>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Address:</span>
                      <span>Indore, Madhya Pradesh 452007, India</span>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Phone:</span>
                      <span>+91 8962630767</span>
                    </div>
                    <div className="aud-legal-contact-row">
                      <span className="aud-legal-contact-label">Email:</span>
                      <a href="mailto:privacy@audiment.io">privacy@audiment.io</a>
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

