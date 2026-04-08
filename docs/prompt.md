This is the most important rule: ALL visible text content on this page must be server-side rendered. No important copy should be behind client-only hydration. Use React Server Component where possible. Only interactive elements like the contact form and navbar scroll behaviour need use client.

RULE: Preserve every existing meta tag, schema markup, and structured data already on the page. Only add to them – never remove.

STEP 1 – Update head metadata

Set these exactly:

html
Title: Audiment – Audit Management Software for Multi-Location Compliance
Meta description: Audiment is an enterprise-grade audit management platform for distributed locations. Photo evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards for admins, managers, and field auditors.

Canonical: https://audiment.com
OG title: Audiment – Audit Management Software for Multi-Location Compliance
OG description: Same as meta description
OG type: website
Add or update these schema markup blocks in the page head:

json
SoftwareApplication schema:
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Audiment",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "description": "Enterprise-grade audit management platform for multi-location businesses with photo evidence enforcement, automated corrective actions, and real-time compliance intelligence.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
}

Organization schema:
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Audiment",
  "url": "https://audiment.com",
  "logo": "https://audiment.com/logo.png",
  "description": "Audit management software for multi-location compliance"
}
Add FAQPage schema with these exact Q&As:

json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is audit management software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Audit management software is a digital platform that enables businesses to create, assign, execute, and track compliance and operational audits. It replaces paper checklists with structured digital workflows that include photo evidence, scoring, corrective action tracking, and real-time reporting."
      }
    },
    {
      "@type": "Question",
      "name": "How does Audiment ensure auditors actually visit the location?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Audiment uses Flash Verification – auditors record a 20-second video from the field combined with a geo-tagged selfie. Every audit submission is automatically stamped with GPS coordinates and a timestamp, creating tamper-proof proof of presence."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize audit checklists for my industry?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Audiment includes a Blueprint Builder that lets admins create fully custom audit templates with questions, scoring logic, and severity levels. FSSAI-ready compliance templates are also available with one click."
      }
    },
    {
      "@type": "Question",
      "name": "Does Audiment support FSSAI compliance audits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Audiment includes pre-built FSSAI compliance audit templates that can be loaded with one click. Every question supports mandatory photo evidence enforcement, creating a complete audit trail for FSSAI inspections."
      }
    },
    {
      "@type": "Question",
      "name": "How does the corrective action workflow work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When an auditor fails a critical severity question, Audiment automatically generates a corrective action task assigned to the location manager with a 48-hour SLA. The manager must submit a resolution note and photo proof before the action can be closed."
      }
    },
    {
      "@type": "Question",
      "name": "Can I export audit reports as PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every completed audit in Audiment can be exported as a high-fidelity PDF report that includes all questions, answers, photo evidence, scores, and corrective action status."
      }
    },
    {
      "@type": "Question",
      "name": "What industries is Audiment built for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Audiment is built for any multi-location business including QSR and restaurant chains, retail chains, hotels and hospitality, franchise operations, food and beverage companies, manufacturing facilities, and facility management companies."
      }
    },
    {
      "@type": "Question",
      "name": "How is Audiment different from iAuditor or SafetyCulture?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Audiment differentiates through mandatory photo and video evidence enforcement per question, Flash Verification with geo-tagged identity video, automated corrective action loops with 48-hour SLA, trend detection after three consecutive poor audits, and FSSAI-ready templates built for the Indian market."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a mobile app for field auditors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Audiment is fully mobile-optimised as a progressive web application. Auditors access it through any phone browser with no installation required. The interface supports offline execution with automatic sync when connectivity returns."
      }
    },
    {
      "@type": "Question",
      "name": "What happens when an audit score is too low?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Audiment automatically sends instant alerts to the relevant manager and admin when an audit score falls below the configured threshold. If a location scores poorly on three consecutive audits, a trend alert is triggered flagging the location as consistently underperforming."
      }
    }
  ]
}
STEP 2 – Create robots.txt at public/robots.txt

User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://audiment.com/sitemap.xml
STEP 3 – Create llms.txt at public/llms.txt

# Audiment

## About
Audiment is an enterprise-grade audit management platform for multi-location businesses. It enables compliance, quality, and safety audits with photo and video evidence enforcement, automated corrective action workflows, geo-tagged field verification, real-time scoring and alerts, and role-based dashboards.

## Key Features
- Photo and video evidence enforcement per audit question
- Automated corrective action loop with 48-hour SLA
- Trend detection – alerts after 3 consecutive poor audits
- Flash verification with geo-tagging and identity video
- FSSAI compliance template loader
- Role-based dashboards for Admin, Manager, and Auditor
- High-fidelity PDF report exports
- Mobile-optimised audit execution with offline support
- Surprise audit scheduling
- Blueprint-based audit framework

## Industries Served
- QSR and Restaurant Chains
- Retail Chains
- Hotels and Hospitality
- Manufacturing and Warehousing
- Franchise Operations
- Food and Beverage (FSSAI)
- Facility Management
- Schools and Campuses

## Competitors and Alternatives
Audiment is an alternative to SafetyCulture (iAuditor), GoAudits, Zenput, Jolt, and paper or Excel-based audit processes.

## Links
- Website: https://audiment.com
- Blog: https://audiment.com/blog
STEP 4 – Rebuild the page sections in this exact order following the SEO blueprint

The H1 of the page must be exactly: "Audit Management Software Built for Multi-Location Compliance"

SECTION 1 – HERO Semantic HTML: <header> wrapping a <section>

H1: Audit Management Software Built for Multi-Location Compliance

Subheadline: Replace paper checklists, scattered WhatsApp photos, and Excel trackers with a single platform for audits, evidence, corrective actions, and real-time compliance intelligence across every location.

Two buttons: "Book a Call" (primary) and "See It In Action" (ghost) – both route to /#contact

Below buttons – visually hidden for SEO but readable by crawlers using sr-only:
<span class="sr-only">Built for restaurant chains, retail brands, hotel groups, franchise operations, and multi-location businesses across India and globally.</span>
Remove any text that appears visually below the buttons. Keep it only as sr-only.

SECTION 2 – PROBLEM STATEMENT Semantic HTML: <section aria-labelledby="problem-heading"> Dark background.

H2 id="problem-heading": Why Multi-Location Audits Break Down

Four cards – use these exact headings and descriptions:

Card 1: Icon: MapPin
H3: "You can't be at every branch"
Description: "With multiple outlets, you rely on managers to report accurately. But without a system, you only hear what they want you to hear."

Card 2: Icon: FileX  
H3: "Paper checklists that nobody reviews"
Description: "Checklists get lost, forgotten, or filled in after the fact. There is no way to know if an audit actually happened."

Card 3: Icon: EyeOff
H3: "Problems stay hidden until it's too late"
Description: "A hygiene issue or safety risk at one branch can go unnoticed for weeks – until it becomes a serious problem for your brand."

Card 4: Icon: ShieldOff
H3: "No accountability trail"
Description: "When something goes wrong, there is no record of who checked what, when, and what was done about it."
Remove shiny or glowing borders – use simple border border-white/10. Replace any ! icons with the lucide icons specified.

SECTION 3 – HOW IT WORKS Semantic HTML: <section aria-labelledby="how-it-works-heading"> Light background.

H2 id="how-it-works-heading": From Blueprint to Resolution – The Full Audit Lifecycle

Six steps in a 3x2 grid (grid-cols-1 md:grid-cols-3 gap-6):

Step 1 – Icon: FileText – "Create audit blueprints"
"Admin builds a standardized audit template with questions, scoring logic, and severity levels."

Step 2 – Icon: MapPin – "Define locations and assign managers"  
"Create your branch network, assign managers to locations, and configure your organizational structure."

Step 3 – Icon: UserCheck – "Schedule and assign audits"
"Publish scheduled or surprise audits to specific branches and assign them to field auditors."

Step 4 – Icon: Camera – "Execute with photo and video evidence"
"Auditors complete audits on their phones with mandatory photo evidence enforced per question."

Step 5 – Icon: Wrench – "Resolve corrective actions"
"Critical failures auto-generate tasks for managers with 48-hour deadlines and mandatory resolution proof."

Step 6 – Icon: FileBarChart – "Export stakeholder-ready reports"
"Generate high-fidelity PDF audit reports with scores, evidence, and corrective action status."
SECTION 4 – KEY FEATURES Semantic HTML: <section aria-labelledby="features-heading"> Dark background.

H2 id="features-heading": Everything You Need for Compliant, Auditable Operations

Ten feature cards – use these exact H3 headings (these are keyword-mapped):

1. H3: "Photo and Video Evidence Enforcement"
Icon: Camera
Description: "Every audit question can require mandatory photo or video proof before the auditor can proceed. No evidence, no submission."
Keywords embedded: audit with photo evidence, evidence-based audit

2. H3: "Automated Corrective Action Tracking"
Icon: CheckSquare  
Description: "Critical failures automatically generate assigned resolution tasks with 48-hour SLAs, mandatory notes, and photo proof of resolution."
Keywords embedded: corrective action tracking software, CAPA

3. H3: "Instant Low-Score and Trend Alerts"
Icon: Bell
Description: "Automatic alerts when a branch scores below threshold. Trend detection flags locations that score poorly on three consecutive audits."
Keywords embedded: automated audit alerts, compliance monitoring

4. H3: "Flash Verification – Prove Your Auditor Was There"
Icon: Video
Description: "Auditors record a 20-second geo-tagged video and verified selfie from the field. Tamper-proof proof of presence at every location."
Keywords embedded: auditor identity verification, geo-tagged audits

5. H3: "Standardized Audit Blueprints"
Icon: Layout
Description: "Build reusable audit templates with custom questions, scoring weights, and severity levels. Share blueprints across your entire organization."
Keywords embedded: audit template builder, audit checklist creator

6. H3: "FSSAI-Ready Compliance Templates"
Icon: ShieldCheck
Description: "Pre-built FSSAI hygiene and safety audit templates load with one click. Purpose-built for food businesses operating under Indian compliance standards."
Keywords embedded: FSSAI audit software, food safety compliance

7. H3: "One-Click PDF Audit Reports"
Icon: FileText
Description: "Export complete audit reports as high-fidelity PDFs including all questions, answers, photo evidence, scores, and corrective action status."
Keywords embedded: audit reporting software, automated audit reports

8. H3: "Dashboards for Admins, Managers and Auditors"
Icon: LayoutDashboard
Description: "Three purpose-built role-based dashboards give each user exactly the information and actions they need – nothing more, nothing less."
Keywords embedded: audit management dashboard, compliance dashboard

9. H3: "Mobile-First Audit Execution"
Icon: Smartphone
Description: "Auditors work entirely from their phone browser. Supports offline execution with automatic sync when connectivity returns. No app installation required."
Keywords embedded: mobile audit app, field audit app

10. H3: "Pattern Detection Across Locations"
Icon: TrendingDown
Description: "Audiment monitors performance trends across all branches and surfaces insights that would be invisible in a spreadsheet or paper system."
Keywords embedded: compliance trend analysis, multi-location analytics
SECTION 5 – INDUSTRY USE CASES Semantic HTML: <section aria-labelledby="industries-heading"> Light background.

H2 id="industries-heading": Built for Every Multi-Location Operation

Eight industry cards in grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.
Remove all "Key checks" subsections – each card has only icon, H3, and two-line description:

1. Icon: UtensilsCrossed – H3: "QSR and restaurant chains" – "Enforce food safety, hygiene standards, and brand compliance across every outlet. FSSAI-ready templates included."

2. Icon: ShoppingBag – H3: "Retail chains" – "Standardize store compliance, visual merchandising standards, and operational audits across your entire retail network."

3. Icon: Building2 – H3: "Hotels and hospitality" – "Maintain guest experience standards, safety compliance, and housekeeping quality across every property."

4. Icon: Settings – H3: "Facility management" – "Run systematic audits across managed facilities with full evidence trails and automated corrective action workflows."

5. Icon: GraduationCap – H3: "Schools and campuses" – "Ensure classroom safety, canteen hygiene, and facility standards are met consistently across all campuses."

6. Icon: Heart – H3: "Healthcare clinics" – "Maintain hygiene protocols and safety compliance across multiple clinic locations without manual oversight."

7. Icon: Truck – H3: "Logistics and warehouses" – "Audit safety equipment, storage conditions, and operational standards across distribution centres."

8. Icon: Coffee – H3: "Quick service restaurants" – "Enforce brand standards, food safety, and cleanliness across every franchise location at scale."
SECTION 6 – THREE ROLES Semantic HTML: <section aria-labelledby="roles-heading"> Dark background.

H2 id="roles-heading": One Platform, Three Powerful Interfaces

Three cards for Admin, Manager, Auditor.
The top portion of each card (icon + role title + subtitle) must be centered: flex flex-col items-center text-center
Bullet points below remain left-aligned.

Admin card:
Icon: Shield (centered)
H3: "Admin" (centered)
Subtitle: "The governance engine" (centered, muted)
Bullets:
- Build and manage audit blueprints
- Define locations and assign managers
- Publish scheduled and surprise audits
- View compliance intelligence across all branches
- Export PDF reports for stakeholders

Manager card:
Icon: Users (centered)
H3: "Manager" (centered)
Subtitle: "The resolution hub" (centered, muted)
Bullets:
- Assign audits to field auditors
- Monitor auditor activity and performance
- Resolve corrective actions with photo proof
- Track location scores and trend alerts
- View upcoming audits on the calendar

Auditor card:
Icon: ClipboardCheck (centered)
H3: "Auditor" (centered)
Subtitle: "The evidence tool" (centered, muted)
Bullets:
- Complete audits on any phone browser
- Submit mandatory photo evidence per question
- Save progress and resume offline
- Conduct flash verification audits
- Track personal performance and history
SECTION 7 – COMPARISON TABLE Semantic HTML: <section aria-labelledby="comparison-heading"> Light background.

H2 id="comparison-heading": Audiment vs. The Old Way

Comparison table with these exact rows and columns:
Columns: Capability | Paper and Excel | Generic Tools | Audiment

Rows:
Mandatory photo evidence | No | Optional | Enforced per question
Geo-tagged verification | No | No | With flash video
Auto corrective actions | No | No | 48-hour SLA
Trend detection | No | No | 3-audit pattern alerts
FSSAI-ready templates | No | No | One-click load
PDF reports | No | Basic | High-fidelity export
Offline execution | No | Partial | Full sync on reconnect
Role-based access | No | Basic | Three-tier RBAC

Replace all emoji with icons:
- "No" → <X className="w-4 h-4 text-red-400 mx-auto" />
- "Yes" or feature text → <Check className="w-4 h-4 text-green-500 mx-auto" /> followed by the text
SECTION 8 – FAST SECURE ANY DEVICE Semantic HTML: <section aria-labelledby="technical-heading"> Dark background.

H2 id="technical-heading": Fast, Secure, and Works on Any Device

Three points in a row:

1. Icon: Zap – H3: "Fast" – "Real-time data across all branches. Instant alerts, live dashboards, and no delays in reporting."

2. Icon: Lock – H3: "Secure" – "Role-based access ensures everyone sees only what they need. Organisation-level data isolation protects every client."

3. Icon: Smartphone – H3: "Any device" – "Works on any phone or desktop browser. No app installation required for your field auditors."
SECTION 9 – FAQ Semantic HTML: <section aria-labelledby="faq-heading"> Light background.

H2 id="faq-heading": Frequently Asked Questions

Use shadcn Accordion component. Display all 10 FAQ questions from the schema markup in Step 1 above as interactive accordion items. The content must be visible in the raw HTML for crawlers – use server-side rendering, not client-only state.
SECTION 10 – CONTACT FORM AND FINAL CTA Semantic HTML: <section id="contact" aria-labelledby="cta-heading"> Dark background.

H2 id="cta-heading": Stop Auditing on Paper. Start Auditing with Proof.

Subheadline: "Book a call with our team and see how Audiment works for your specific operations."

Contact form collecting:
- Full Name (required)
- Company Name (required)
- Number of Outlets (number input, required)
- Email (required)
- Phone Number (required)
- Message (optional)

On submit: save to Firestore `leads` collection with createdAt timestamp.
On success: show "Thanks! We will be in touch within 24 hours." – do not redirect.
On error: show "Something went wrong. Please try again."

Below form: a "Book a Call" primary button that triggers form submission.
SECTION 11 – FOOTER Semantic HTML: <footer> Dark background (#0a0a0a).

Three column top section:

Column 1:
- "Audiment" bold logo text
- "Audit smarter. Manage better." in muted text below
- "Book a Call" button that scrolls to /#contact

Column 2 – Navigation:
H4: "Product"
Links: Features / How it works / Use cases / Login

Column 3 – Legal:
H4: "Legal"
Links: Privacy Policy / Terms of Service / Contact

Bottom strip – subtle border-t:
- Right aligned: "© copyright 2026 Audiment. All rights reserved." in text-xs text-muted-foreground

Keep the large faded watermark "Audiment" text at very bottom exactly as is.
Remove globe SVG entirely.
Remove any duplicate tagline text that appears above footer columns.
STEP 5 – Section dividers Remove all <hr> tags, border-t, border-b, and divide-y classes between sections. Sections flow using background colour changes and padding only.

STEP 6 – Smooth scrolling Add to src/app/globals.css:

css
html {
  scroll-behavior: smooth;
}
STEP 7 – Performance 1. The page must be a React Server Component at the top level. Extract only the contact form and navbar scroll listener into separate small client components. 2. Wrap the FAQ accordion in Suspense with a skeleton fallback. 3. All section content must be in the raw HTML – not client-only rendered. 4. Lazy load all images below the fold.

STEP 8 – Update landing.html After all changes to page.tsx, generate an updated standalone landing.html file in the project root that reflects all changes. All CSS inline, all JS inline, Tailwind via CDN, all icons as inline SVGs. Must work by double clicking in Chrome with no server.

SEO PRESERVATION RULES – apply throughout:

Never remove existing meta tags
Never remove existing schema markup – only add to it
One H1 only on the page
Sections use H2, cards use H3
All important text server-side rendered
Alt text on all images preserved
Aria labels preserved
Report every file changed and every section modified.