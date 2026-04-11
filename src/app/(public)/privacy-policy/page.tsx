import React from "react";
import { Metadata } from "next";
import { Footer } from "@/components/ui/modem-animated-footer";
import { HeroHeader } from "@/components/ui/hero-section-3";
import { MapPinIcon, CameraIcon, RefreshCw, FileCheck2, Shield, Smartphone, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy – Audiment",
  description: "How Audiment collects, uses, and protects your personal information.",
  robots: "index, follow"
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="relative text-neutral-900 bg-white font-sans selection:bg-neutral-900 selection:text-white">
      <HeroHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-24 bg-neutral-50 border-b border-neutral-200/60 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-neutral-500">
            Last updated: April 11, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <section className="mt-16 scroll-mt-24">
            <p className="text-base text-neutral-500 leading-relaxed mb-6">This Privacy Notice for <strong className="font-semibold text-neutral-900">Asellus LLP</strong> (doing business as <strong className="font-semibold text-neutral-900">Audiment</strong>) – referred
              to as "we," "us," or "our" – describes how and why we access, collect, store, use, and share your personal
              information when you use our services, including when you:</p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>Visit our website at <a href="https://www.audiment.vercel.app" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">audiment.vercel.app</a> or any website of ours that links to this Privacy Notice
              </li>
              <li>Use our audit management platform</li>
              <li>Engage with us in other related ways, including marketing or events</li>
            </ul>
            <p className="text-base text-neutral-500 leading-relaxed mb-6"><strong className="font-semibold text-neutral-900">Questions or concerns?</strong> Reading this Privacy Notice will help you
              understand your privacy rights and choices. If you do not agree with our policies and practices, please do not
              use our Services. For questions, contact us at <a href="mailto:privacy@audiment.io" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">privacy@audiment.io</a>.
            </p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">Summary</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Key Points</h2>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li><strong className="font-semibold text-neutral-900">What we collect:</strong> Personal information you provide when registering or using our services
              </li>
              <li><strong className="font-semibold text-neutral-900">Sensitive info:</strong> We do not process sensitive personal information</li>
              <li><strong className="font-semibold text-neutral-900">Third parties:</strong> We do not collect information from third parties</li>
              <li><strong className="font-semibold text-neutral-900">Why we process:</strong> To provide, improve, and secure our services, and to comply with law</li>
              <li><strong className="font-semibold text-neutral-900">Who we share with:</strong> Specific service providers (Firebase, Google Cloud, Vercel) under
                contract</li>
              <li><strong className="font-semibold text-neutral-900">Your rights:</strong> Depending on your location, you may review, change, or delete your data at
                any time</li>
              <li><strong className="font-semibold text-neutral-900">How to exercise rights:</strong> Submit a data subject access request or contact <a
                href="mailto:privacy@audiment.io">privacy@audiment.io</a></li>
            </ul>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">01</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">What Information Do We Collect?</h2>
            <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Personal information you disclose to us</h3>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We collect personal information that you provide to us.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We collect personal information you voluntarily provide when you register on the Services, express an
              interest in our products, participate in activities on the Services, or otherwise contact us. The personal
              information we collect may include:</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Names</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Email addresses</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Phone numbers</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Job titles</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Usernames</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Passwords</span>
            </div>
            <p className="text-base text-neutral-500 leading-relaxed mb-6"><strong className="font-semibold text-neutral-900">Sensitive Information.</strong> We do not process sensitive information.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">All personal information you provide must be true, complete, and accurate. Please notify us of any changes.
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Information automatically collected</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We automatically collect certain information when you visit, use, or navigate the Services – such as IP
              address, browser and device characteristics, operating system, language preferences, referring URLs, and
              information about how you interact with our Services. This data does not reveal your specific identity but may
              include device and usage information.</p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Google API</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">Our use of information received from Google APIs will adhere to the <a
              href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank"
              rel="noopener noreferrer">Google API Services User Data Policy</a>, including the <a
                href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" target="_blank"
                rel="noopener noreferrer">Limited Use requirements</a>.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">02</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How Do We Process Your Information?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We process your information to provide, improve, and administer our
              Services, communicate with you, for security and fraud prevention, and to comply with law.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We process your personal information for a variety of reasons, depending on how you interact with our
              Services, including:</p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li><strong className="font-semibold text-neutral-900">Account creation and authentication:</strong> To create and manage your account and keep it in
                working order</li>
              <li><strong className="font-semibold text-neutral-900">Service delivery:</strong> To provide the features and functionality of our audit management
                platform</li>
              <li><strong className="font-semibold text-neutral-900">Communication:</strong> To respond to your inquiries and send service-related notifications</li>
              <li><strong className="font-semibold text-neutral-900">Security and fraud prevention:</strong> To identify and prevent fraudulent activity and protect
                the security of our Services</li>
              <li><strong className="font-semibold text-neutral-900">Usage trends:</strong> To understand how our Services are used so we can improve them</li>
              <li><strong className="font-semibold text-neutral-900">Legal compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">03</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">When and With Whom Do We Share Your Information?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We may share information in specific situations and with the following
              third parties.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We have contracts in place with all third parties, designed to help safeguard your personal information. They
              cannot use your personal information unless we have instructed them to do so.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Google Cloud Platform</p>
                <p >Cloud Computing</p>
              </div>
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Cloud Firestore</p>
                <p className="text-sm text-neutral-500 mt-1">Database Infrastructure</p>
              </div>
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Cloud Storage for Firebase</p>
                <p className="text-sm text-neutral-500 mt-1">File Storage</p>
              </div>
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Firebase Auth</p>
                <p className="text-sm text-neutral-500 mt-1">Authentication</p>
              </div>
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Google Analytics (GA4)</p>
                <p className="text-sm text-neutral-500 mt-1">Analytics</p>
              </div>
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Vercel</p>
                <p className="text-sm text-neutral-500 mt-1">Website Hosting</p>
              </div>
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="font-semibold text-neutral-900">Firebase Crash Reporting</p>
                <p className="text-sm text-neutral-500 mt-1">Performance Monitoring</p>
              </div>
            </div>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We may also share your information in connection with any merger, sale of company assets, financing, or
              acquisition of all or a portion of our business.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">04</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Do We Use Cookies and Other Tracking Technologies?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We may use cookies and other tracking technologies to collect and store
              your information.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We use cookies and similar tracking technologies (such as web beacons and pixels) to gather information when
              you interact with our Services. These help us maintain security, prevent crashes, fix bugs, save your
              preferences, and assist with basic site functions.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We also permit service providers to use online tracking technologies on our Services for analytics purposes,
              including Google Analytics GA4, to help us understand usage patterns and improve our Services.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">Specific information about how we use cookies and how you can manage them is set out in our <a
              href="#">Cookie Policy</a>.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">05</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How Long Do We Keep Your Information?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We keep your information for as long as necessary to fulfill the purposes
              outlined in this Privacy Notice, unless otherwise required by law.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We will only keep your personal information for as long as it is necessary for the purposes set out in this
              Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or
              other legal requirements).</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">When we have no ongoing legitimate business need to process your personal information, we will either delete
              or anonymize it. If deletion is not immediately possible (for example, because your information has been
              stored in backup archives), we will securely store your information and isolate it from further processing
              until deletion is possible.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">06</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How Do We Keep Your Information Safe?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We aim to protect your personal information through a system of
              organizational and technical security measures.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We have implemented appropriate and reasonable technical and organizational security measures designed to
              protect the security of any personal information we process, including:</p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>TLS encryption for all data in transit</li>
              <li>Encryption at rest via Firebase (ISO 27001, SOC 1/2/3 certified infrastructure)</li>
              <li>Role-based access control – admin, manager, and auditor roles with scoped permissions</li>
              <li>Firebase Authentication with session cookies and protected middleware</li>
              <li>Rate limiting on authentication endpoints (10 attempts per 15 minutes per IP)</li>
              <li>Content Security Policy (CSP) headers against XSS attacks</li>
            </ul>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">However, no electronic transmission over the Internet or information storage technology can be guaranteed to
              be 100% secure. You should only access the Services within a secure environment.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">07</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Do We Collect Information from Minors?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: We do not knowingly collect data from or market to children under 18
              years of age.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we
              knowingly sell such personal information. By using the Services, you represent that you are at least 18 years
              of age.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">If we learn that personal information from users less than 18 years of age has been collected, we will
              deactivate the account and take reasonable measures to promptly delete such data. If you become aware of any
              data we may have collected from children under age 18, please contact us at <a
                href="mailto:support@audiment.io">support@audiment.io</a>.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">08</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">What Are Your Privacy Rights?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: You may review, change, or terminate your account at any time, depending
              on your country, province, or state of residence.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6"><strong className="font-semibold text-neutral-900">Withdrawing your consent:</strong> If we are relying on your consent to process your personal
              information, you have the right to withdraw your consent at any time by contacting us using the details in the
              Contact Us section below. Note that withdrawing consent will not affect the lawfulness of processing before
              its withdrawal.</p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Account Information</h3>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">If you would like to review or change the information in your account or terminate your account, you can:</p>
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-base text-neutral-600 marker:text-emerald-500">
              <li>Log in to your account settings and update your user account</li>
              <li>Contact us using the contact information provided</li>
            </ul>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">Upon your request to terminate your account, we will deactivate or delete your account and information from
              our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot
              problems, assist with investigations, enforce our legal terms, or comply with applicable legal requirements.
            </p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6"><strong className="font-semibold text-neutral-900">Cookies and similar technologies:</strong> Most web browsers are set to accept cookies by default.
              You can usually choose to set your browser to remove or reject cookies, though this may affect certain
              features or services.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">If you have questions or comments about your privacy rights, email us at <a
              href="mailto:privacy@audiment.io">privacy@audiment.io</a>.</p>

            <div >
              <div >
                <h3>Exercise Your Data Rights</h3>
                <p className="text-base text-neutral-500 leading-relaxed mb-6">Submit a data subject access request to view, edit, or delete your personal information stored by
                  Audiment.</p>
              </div>
              <a href="mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A" target="_blank"
                rel="noopener noreferrer" >
                Email a Data Request
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">09</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Controls for Do-Not-Track Features</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature you can activate
              to signal your privacy preference not to have data about your online browsing activities monitored and
              collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been
              finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that
              automatically communicates your choice not to be tracked online.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">10</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">Do We Make Updates to This Notice?</h2>
            <p className="text-base text-neutral-600 mb-6 italic"><em>In short: Yes, we will update this notice as necessary to stay compliant with
              relevant laws.</em></p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
              "Last updated" date at the top of this Privacy Notice. If we make material changes, we may notify you either
              by prominently posting a notice of such changes or by directly sending you a notification.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your
              information.</p>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">11</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How Can You Contact Us About This Notice?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">If you have questions or comments about this notice, you may contact us:</p>
            <div >
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-4">Audiment – Privacy Team</h3>
              <div ><strong className="font-semibold text-neutral-900">Company</strong> Asellus LLP (doing business as Audiment)</div>
              <div ><strong className="font-semibold text-neutral-900">Email</strong> <a href="mailto:privacy@audiment.io" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">privacy@audiment.io</a>
              </div>
              <div ><strong className="font-semibold text-neutral-900">Website</strong> <a href="https://www.audiment.vercel.app" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">audiment.vercel.app</a></div>
            </div>
          </section>
          <section className="mt-16 scroll-mt-24">
            <span className="text-xs font-bold tracking-widest text-emerald-600 block mb-3 uppercase">12</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">How Can You Review, Update, or Delete the Data We Collect From You?</h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">Based on the applicable laws of your country, you may have the right to request access to the personal
              information we collect from you, details about how we have processed it, correct inaccuracies, or delete your
              personal information.</p>
            <p className="text-base text-neutral-500 leading-relaxed mb-6">To request to review, update, or delete your personal information, please submit a data subject access
              request via the button below or email us directly at <a
                href="mailto:privacy@audiment.io">privacy@audiment.io</a>.</p>
            <a href="mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A" target="_blank"
              rel="noopener noreferrer" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Email a Data Request
            </a>
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
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />
    </main>
  );
}
