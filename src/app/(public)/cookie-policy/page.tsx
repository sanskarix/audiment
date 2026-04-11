import React from "react";
import { Metadata } from "next";
import { Footer } from "@/components/ui/modem-animated-footer";
import { HeroHeader } from "@/components/ui/hero-section-3";

export const metadata: Metadata = {
  title: "Cookie Policy – Audiment",
  description: "How Audiment uses cookies and tracking technologies on its website.",
  robots: "index, follow",
};

export default function CookiePolicyPage() {
  return (
    <main id="main-content" className="relative text-neutral-900 bg-white font-sans selection:bg-neutral-900 selection:text-white">
      <HeroHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-24 bg-neutral-50 border-b border-neutral-200/60 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-6">
            Cookie Policy
          </h1>
          <p className="text-lg text-neutral-500">
            Last updated: April 11, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Introduction */}
          <section className="scroll-mt-24">
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              This Cookie Policy explains how <strong className="font-semibold text-neutral-900">Asellus LLP</strong> ("Company," "we," "us," and "our")
              uses cookies and similar technologies to recognize you when you visit our website
              at <a href="https://audiment.vercel.app" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">audiment.vercel.app</a>. It explains what these technologies are and why we use them,
              as well as your rights to control our use of them.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              In some cases we may use cookies to collect personal information, or that becomes
              personal information if we combine it with other information.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">01</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">What are cookies?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website.
              Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
              as well as to provide reporting information.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Cookies set by the website owner (in this case, Asellus LLP) are called "first-party cookies." Cookies set
              by parties other than the website owner are called "third-party cookies." Third-party cookies enable
              third-party features or functionality to be provided on or through the website (e.g., advertising,
              interactive content, and analytics). The parties that set these third-party cookies can recognize your
              computer both when it visits the website in question and also when it visits certain other websites.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">02</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Why do we use cookies?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons
              in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
              Other cookies also enable us to track and target the interests of our users to enhance the experience on our
              Online Properties. Third parties serve cookies through our Website for analytics and other purposes.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">03</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How can I control cookies?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              You have the right to decide whether to accept or reject cookies. Essential cookies cannot be rejected as
              they are strictly necessary to provide you with services.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              You may also set or amend your web browser controls to accept or refuse cookies. If you choose to reject
              cookies, you may still use our Website though your access to some functionality and areas of our Website
              may be restricted. The following links show how to manage cookie settings in the most common browsers:
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Browser Cookie Settings</h3>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-8 text-base text-neutral-600 marker:text-emerald-500">
              <li>
                <a href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Chrome
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Internet Explorer
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Edge
                </a>
              </li>
              <li>
                <a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Opera
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Opt Out of Targeted Advertising</h3>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>
                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Digital Advertising Alliance
                </a>
              </li>
              <li>
                <a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  Digital Advertising Alliance of Canada
                </a>
              </li>
              <li>
                <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  European Interactive Digital Advertising Alliance
                </a>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">04</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">What about other tracking technologies, like web beacons?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Cookies are not the only way to recognize or track visitors to a website. We may use other, similar
              technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs").
              These are tiny graphics files that contain a unique identifier that enables us to recognize when someone
              has visited our Website or opened an email including them. This allows us to monitor traffic patterns,
              deliver or communicate with cookies, understand whether you have come to the website from an online
              advertisement, improve site performance, and measure the success of email marketing campaigns. In many
              instances, these technologies are reliant on cookies to function properly, and so declining cookies will
              impair their functioning.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">05</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Do you serve targeted advertising?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Third parties may serve cookies on your computer or mobile device to serve advertising through our Website.
              These companies may use information about your visits to this and other websites in order to provide
              relevant advertisements about goods and services that you may be interested in. They may also employ
              technology that is used to measure the effectiveness of advertisements. The information collected through
              this process does not enable us or them to identify your name, contact details, or other details that
              directly identify you unless you choose to provide these.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">06</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How often will you update this Cookie Policy?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or
              for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly
              to stay informed about our use of cookies and related technologies. The date at the top of this Cookie
              Policy indicates when it was last updated.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">07</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Where can I get further information?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              If you have any questions about our use of cookies or other technologies, please email us at{" "}
              <a href="mailto:privacy@audiment.io" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                privacy@audiment.io
              </a>{" "}
              or by post to:
            </p>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-4">Audiment – Privacy Team</h3>
              <div className="space-y-2 text-base text-neutral-600">
                <div><strong className="font-semibold text-neutral-900">Company</strong> &nbsp;Asellus LLP (doing business as Audiment)</div>
                <div><strong className="font-semibold text-neutral-900">Address</strong> &nbsp;Indore, Madhya Pradesh 452007, India</div>
                <div><strong className="font-semibold text-neutral-900">Phone</strong> &nbsp;+91 8962630767</div>
                <div>
                  <strong className="font-semibold text-neutral-900">Email</strong> &nbsp;
                  <a href="mailto:privacy@audiment.io" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                    privacy@audiment.io
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>

      <Footer
        brandName="Audiment"
        socialLinks={[]}
        navLinks={[
          { label: "Features", href: "/#features" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Use cases", href: "/#use-cases" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Cookie policy", href: "/cookie-policy" },
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />
    </main>
  );
}
