import React from "react";
import { Metadata } from "next";
import { Footer } from "@/components/ui/modem-animated-footer";
import { HeroHeader } from "@/components/ui/hero-section-3";

export const metadata: Metadata = {
  title: "Terms of Service — Audiment",
  description: "Terms and conditions governing your use of the Audiment platform.",
  robots: "index, follow",
};

export default function TermsOfServicePage() {
  return (
    <main id="main-content" className="relative text-neutral-900 bg-white font-sans selection:bg-neutral-900 selection:text-white">
      <HeroHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-24 bg-neutral-50 border-b border-neutral-200/60 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-neutral-500">
            Last updated: April 11, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Agreement preamble */}
          <section className="scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">Agreement to our Legal Terms</span>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We are <strong className="font-semibold text-neutral-900">Asellus LLP</strong>, doing business as{" "}
              <strong className="font-semibold text-neutral-900">Audiment</strong>, a company registered in India at
              82 A Galaxy Homes, Indore, Madhya Pradesh 452007, India.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We operate the website{" "}
              <a href="https://www.audiment.io" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                https://www.audiment.io
              </a>{" "}
              ("Site"), as well as any other related products and services that refer or link to these legal terms
              (collectively, the "Services").
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Audiment is a cloud-based audit management platform designed for multi-location businesses. It enables
              organizations to create, assign, and track operational audits across multiple branches and locations.
              Users can manage audit templates, assign auditors, monitor compliance status, and generate reports — all
              from a centralized dashboard.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              You can contact us by phone at{" "}
              <a href="tel:+918962630767" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">+91 8962630767</a>,
              email at{" "}
              <a href="mailto:support@audiment.io" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">support@audiment.io</a>,
              or by mail to 82 A Galaxy Homes, Indore, Madhya Pradesh 452007, India.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              These Legal Terms constitute a legally binding agreement between you (personally or on behalf of an entity)
              and Asellus LLP. By accessing the Services, you confirm you have read, understood, and agreed to be bound
              by these Legal Terms.{" "}
              <strong className="font-semibold text-neutral-900">
                IF YOU DO NOT AGREE, YOU MUST DISCONTINUE USE IMMEDIATELY.
              </strong>
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              The Services are intended for users who are at least 18 years old.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">01</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Our Services</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              The information provided when using the Services is not intended for distribution to any person or entity
              where such use would be contrary to law or regulation. Users who access the Services from other locations
              do so on their own initiative and are solely responsible for compliance with local laws.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">02</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Intellectual Property Rights</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We own or are licensed to use all intellectual property rights in our Services, including source code,
              databases, functionality, software, website designs, text, and graphics ("Content"), as well as
              trademarks, service marks, and logos ("Marks"). Our Content and Marks are protected by copyright and
              trademark laws around the world and are provided "AS IS" for your internal business purpose only.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Subject to compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable
              license to access the Services solely for your internal business purpose.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              No part of the Services, Content, or Marks may be copied, reproduced, republished, uploaded, transmitted,
              distributed, sold, or otherwise exploited for any commercial purpose without our express prior written
              permission. Requests may be sent to{" "}
              <a href="mailto:support@audiment.io" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">support@audiment.io</a>.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Any breach of these Intellectual Property Rights will constitute a material breach and your right to use
              the Services will terminate immediately.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              <strong className="font-semibold text-neutral-900">Submissions:</strong> By sending us any question,
              comment, suggestion, or feedback ("Submissions"), you assign to us all intellectual property rights in
              such Submission. We may use Submissions for any lawful purpose without compensation.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">03</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">User Representations</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-4">
              By using the Services, you represent and warrant that:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>You have the legal capacity to agree to these Legal Terms</li>
              <li>You are at least 18 years of age</li>
              <li>You will not access the Services through automated or non-human means</li>
              <li>You will not use the Services for any illegal or unauthorized purpose</li>
              <li>Your use of the Services will not violate any applicable law or regulation</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">04</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Purchases and Payment</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-4">
              We accept the following forms of payment:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>Bank Transfer (NEFT/IMPS)</li>
              <li>UPI</li>
            </ul>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              All payments must be made in Indian Rupees (INR). You agree to provide accurate and complete purchase and
              account information. We reserve the right to refuse any order placed through the Services.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">05</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Subscriptions</h2>
            <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-3">Billing and Renewal</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Subscriptions are billed on a periodic basis as agreed at the time of purchase. Subscriptions can be
              renewed by contacting our team at{" "}
              <a href="mailto:support@audiment.io" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">support@audiment.io</a>.
              Upon receiving a renewal request, we will extend the subscription validity and send a confirmation with
              the updated terms.
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-3">Cancellation</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              You may cancel your subscription at any time by contacting us at{" "}
              <a href="mailto:support@audiment.io" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">support@audiment.io</a>.
              Cancellation will take effect at the end of the current paid term.
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-3">Fee Changes</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We may modify subscription fees at any time. Fee changes will be communicated to you in advance and will
              take effect at the start of the next subscription period.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              All purchases are non-refundable.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">06</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Prohibited Activities</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-4">
              You may not access or use the Services for any purpose other than that for which we make the Services
              available. Prohibited activities include but are not limited to:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>Sell or otherwise transfer your profile or account credentials to another person or entity</li>
              <li>Attempt to reverse engineer, decompile, or extract the source code of the platform or any of its components</li>
              <li>Use the platform to store, process, or transmit data belonging to any organization other than your own registered business entity without explicit written authorization from Audiment</li>
              <li>Systematically retrieve data from the Services to create a collection or database without our written permission</li>
              <li>Trick, defraud, or mislead us or other users</li>
              <li>Circumvent, disable, or interfere with security-related features of the Services</li>
              <li>Use the Services in a manner inconsistent with any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">07</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">User Generated Contributions</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              The Services may allow you to submit or upload content ("Contributions"). By submitting Contributions,
              you grant us a license to use, reproduce, and distribute such content in connection with operating the
              Services. You are solely responsible for your Contributions and confirm they do not violate any
              third-party rights or applicable law.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">08</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Contribution License</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              By submitting Contributions, you grant Audiment a non-exclusive, royalty-free, worldwide license to use,
              host, store, reproduce, modify, and display your Contributions solely for the purpose of providing and
              improving the Services.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">09</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Services Management</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>Monitor the Services for violations of these Legal Terms</li>
              <li>Take appropriate legal action against violators</li>
              <li>Restrict or deny access to the Services at our sole discretion</li>
              <li>Remove or disable any content that is excessive or burdensome</li>
              <li>Manage the Services to protect our rights and property</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">10</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Privacy Policy</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We care about data privacy and security. Please review our{" "}
              <a href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                Privacy Policy
              </a>. By using the Services, you agree to be bound by our Privacy Policy. The Services are hosted in
              the United States and India.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">11</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Term and Termination</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              These Legal Terms remain in full force while you use the Services. We reserve the right to deny access
              to or use of the Services, without notice, to anyone for any reason, including violation of these Legal
              Terms.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              If your account is terminated, you are prohibited from registering a new account under your name or a
              third party's name. In addition to terminating your account, we reserve the right to take appropriate
              legal action.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">12</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Modifications and Interruptions</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We reserve the right to change, modify, or remove the contents of the Services at any time without
              notice. We will not be liable for any modification, suspension, or discontinuation of the Services.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We cannot guarantee the Services will be available at all times. We may experience hardware, software,
              or maintenance issues. We are not liable for any loss or inconvenience caused by unavailability of
              the Services.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">13</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Governing Law</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              These Legal Terms are governed by the laws of India. Asellus LLP and you irrevocably consent to the
              exclusive jurisdiction of the courts in Indore, Madhya Pradesh, India to resolve any disputes.
            </p>
          </section>

          {/* Section 14 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">14</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Dispute Resolution</h2>
            <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-3">Informal Negotiations</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Before initiating arbitration, parties agree to attempt to resolve any dispute informally for at least
              30 days by contacting us at{" "}
              <a href="mailto:support@audiment.io" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">support@audiment.io</a>.
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-3">Binding Arbitration</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              If informal negotiations fail, disputes shall be resolved through binding arbitration under the
              Arbitration and Conciliation Act, 1996. The arbitration shall take place in Indore, India. One (1)
              arbitrator shall preside. Proceedings shall be conducted in English.
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-3">Restrictions</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Arbitration shall be limited to the dispute between parties individually. Class actions and
              representative proceedings are not permitted.
            </p>
          </section>

          {/* Section 15 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">15</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Corrections</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              There may be information on the Services that contains typographical errors, inaccuracies, or omissions.
              We reserve the right to correct any errors and to update information at any time without prior notice.
            </p>
          </section>

          {/* Section 16 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">16</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Disclaimer</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6 uppercase tracking-wide text-sm">
              The services are provided on an as-is and as-available basis. Your use of the services is at your sole
              risk. We disclaim all warranties, express or implied, including warranties of merchantability, fitness
              for a particular purpose, and non-infringement. We do not warrant that the services will be
              uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          {/* Section 17 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">17</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Limitations of Liability</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6 uppercase tracking-wide text-sm">
              To the fullest extent permitted by law, in no event shall Asellus LLP or its directors, employees, or
              agents be liable for any indirect, incidental, special, or consequential damages arising from your use
              of the services.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6 uppercase tracking-wide text-sm">
              Our total liability to you for all claims arising from use of the services shall not exceed the amount
              paid by you to us in the six (6) months prior to the event giving rise to the claim. Any claim must be
              brought within one (1) year of the date the cause of action arose.
            </p>
          </section>

          {/* Section 18 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">18</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Indemnification</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              You agree to defend, indemnify, and hold harmless Asellus LLP and its officers, directors, employees,
              and agents from any claims, liabilities, damages, or expenses arising from: (1) your use of the
              Services; (2) your breach of these Legal Terms; (3) your Contributions; or (4) your violation of any
              third-party rights.
            </p>
          </section>

          {/* Section 19 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">19</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">User Data</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              We will maintain certain data you transmit to the Services for the purpose of managing the Services.
              You are solely responsible for all data you transmit. We shall have no liability for any loss or
              corruption of such data.
            </p>
          </section>

          {/* Section 20 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">20</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Electronic Communications, Transactions, and Signatures</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              Visiting the Services, sending emails, and completing online forms constitute electronic communications.
              You consent to receive electronic communications and agree that all agreements and notices provided
              electronically satisfy any legal requirement that such communications be in writing.
            </p>
          </section>

          {/* Section 21 */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">21</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Miscellaneous</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              These Legal Terms constitute the entire agreement between you and Asellus LLP regarding your use of
              the Services. Our failure to exercise any right under these Legal Terms shall not constitute a waiver
              of such right. If any provision is found to be unenforceable, the remaining provisions will continue
              in full force. We may assign our rights and obligations to others at any time.
            </p>
          </section>

          {/* Section 22 — Contact */}
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">22</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Contact Us</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">
              To resolve a complaint or receive further information regarding use of the Services, please contact us:
            </p>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-4">Audiment — Legal Team</h3>
              <div className="space-y-2 text-base text-neutral-600">
                <div><strong className="font-semibold text-neutral-900">Company</strong> &nbsp;Asellus LLP (doing business as Audiment)</div>
                <div><strong className="font-semibold text-neutral-900">Address</strong> &nbsp;82 A Galaxy Homes, Indore, Madhya Pradesh 452007, India</div>
                <div><strong className="font-semibold text-neutral-900">Phone</strong> &nbsp;<a href="tel:+918962630767" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">+91 8962630767</a></div>
                <div>
                  <strong className="font-semibold text-neutral-900">Email</strong> &nbsp;
                  <a href="mailto:support@audiment.io" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                    support@audiment.io
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
