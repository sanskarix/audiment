# Audiment Documentation Hub

Welcome to the official documentation for **Audiment**—an enterprise-grade, high-trust compliance and audit management platform engineered for multi-location businesses.

> **Narrative Anchor:** *"You can't be everywhere."*  
> Audiment replaces unreliable manual checks and "pencil-whipping" with ground-truth operational accountability through timestamped photo proof, Flash Verification (video presence audits), automated 48-hour CAPA workflows, and trend detection.

---

## 📚 Documentation Sitemap

### 🚀 [Getting Started](./getting-started/quickstart.md)
* [Quickstart & Development Setup](./getting-started/quickstart.md) – Local development environment, dependencies, and setup scripts.
* [Environment Variables Reference](./getting-started/environment-variables.md) – Configuration guide for Firebase, Cloudinary, Vercel Cron, and app secrets.

### 🏗️ [Architecture](./architecture/system-overview.md)
* [System Overview & Data Flow](./architecture/system-overview.md) – App Router structure, server components, and data pipeline.
* [RBAC & Multi-Tenant Security](./architecture/rbac-permissions.md) – Organization isolation, role-based access matrix (Admin, Manager, Auditor).
* [Tech Stack Specification](./architecture/tech-stack.md) – Next.js 16, React 19, TypeScript, Firestore, Cloudinary, Recharts, and jsPDF.

### ⚡ [Core Features](./core-features/blueprint-builder.md)
* [Features Overview](./core-features/features-overview.md) – Complete platform feature matrix and capabilities summary.
* [Blueprint Builder & FSSAI Loader](./core-features/blueprint-builder.md) – Audit template authoring, question types, severity weights, and 1-click FSSAI defaults.
* [Flash Verification (Flashmob)](./core-features/flash-verification.md) – Stealth 20-second video presence audits, circular selfie guide, and GPS locking.
* [Automated CAPA Workflows](./core-features/capa-workflows.md) – 48-hour SLA corrective action lifecycle, auto-generation, and photo resolution.
* [Surprise Audits & Scheduling](./core-features/surprise-audits.md) – Unannounced inspection publishing and recurring scheduling logic.
* [Reporting & PDF Export Engine](./core-features/reporting-pdf-engine.md) – Organization compliance health, regional comparison, and high-fidelity jsPDF engine.

### 🔌 [Database & API Reference](./database-and-api/firestore-schema.md)
* [Firestore Schema & Rules](./database-and-api/firestore-schema.md) – Complete collection schemas (users, audits, responses, CAPA, flashmob) and security rules.
* [Mathematical Scoring Engine](./database-and-api/scoring-engine-spec.md) – Weighted score formula, normalization, critical failure overrides, and trace model.
* [Cron Jobs & Alert Engine](./database-and-api/cron-jobs-and-alerts.md) – Missed audit automated transition, CAPA deadline reminders, and Vercel Cron setup.

### 🚢 [Deployment](./deployment/vercel-deployment.md)
* [Vercel Deployment Guide](./deployment/vercel-deployment.md) – Production build procedures, Vercel configuration, and environment setup.
* [Firebase & Cloudinary Setup](./deployment/firebase-and-cloudinary.md) – Storage bucket rules, multipart upload configuration, and HLS streaming setup.

### 👥 [User Handbooks](./user-guides/admin-guide.md)
* [Training & Operational Workflows](./user-guides/training-and-workflows.md) – End-to-end operational training and workflow walkthroughs.
* [Admin Handbook](./user-guides/admin-guide.md) – Managing organization nodes, member accounts, password resets, and master blueprints.
* [Manager Handbook](./user-guides/manager-guide.md) – Outlet management, auditor delegation, calendar scheduling, and resolving CAPA tasks.
* [Auditor Handbook](./user-guides/auditor-guide.md) – Mobile inspection workflow, draft auto-save, photo requirements, and Flashmob execution.

### 🎯 [Brand & Positioning](./brand-and-positioning/narrative-and-positioning.md)
* [Master UI Design System & Brand Visual Language](./brand-and-positioning/ui-design-system-master.md) – Canonical specification for colors, non-bold typography, signature moving stripes, blueprint button drafting, spacing scale, component patterns, and asset inventory.
* [Narrative, Tone & Banned Copy](./brand-and-positioning/narrative-and-positioning.md) – Practical founder voice, banned SaaS buzzwords, and positioning hierarchy.
* [AEO & Invisible SEO Strategy](./brand-and-positioning/aeo-and-seo-strategy.md) – Answer Engine Optimization, JSON-LD schema injection, `llms.txt`, and hub-and-spoke content.
* [SEO Checklist](./brand-and-positioning/seo-checklist.md) – Technical and on-page SEO verification checklist.

### 🧩 [UI Inventory & Design Lab](./ui-inventory/UI_INVENTORY_README.md)
* [UI Inventory Master Guide](./ui-inventory/UI_INVENTORY_README.md) – Component, route, token, and duplicate candidate ledgers.
* [UI Lab Guide](./ui-inventory/UI_LAB.md) – Documentation for the `/ui-lab` visual component catalog and decision system.

### 📁 [Internal Specs & Archives](./internal/)
* Historical & internal working specs (`product.md`, `PRODUCT_DOCUMENTATION.md`, `positioning.md`, `scoring_model.md`, `style_guide.md`, `build_plan.md`, `database.md`, `notifications_cron.md`, `tech_stack.md`).

### 🧠 [SEO & Content Knowledge Base](./knowledge-base/00-INDEX-AND-USAGE-GUIDE.md)
* Systematically deduplicated, citation-backed Knowledge Base synthesized from all 228 live `.mdx` blog posts in `content/blog/` (`00` index, `01`–`12` topic/vertical modules, `13` canonical Audiment messaging & internal links, `14` SEO keywords & AEO questions bank, and `15` citations & 228-blog traceability ledger).

---

## 🛠️ Repository Navigation

```
Audiment/
├── docs/                             # Full Enterprise Documentation Suite
│   ├── README.md                     # Master Sitemap (You are here)
│   ├── getting-started/             # Quickstart & environment configuration
│   ├── architecture/                # System design & security model
│   ├── core-features/               # Detailed product module specs
│   ├── database-and-api/            # Schemas, scoring math & cron APIs
│   ├── deployment/                  # Production Vercel & Firebase configuration
│   ├── user-guides/                 # Role-based operational handbooks & training
│   ├── brand-and-positioning/       # Copywriting, design system & SEO/AEO guidelines
│   ├── knowledge-base/              # Deduplicated 228-blog SEO & Content Knowledge Base
│   ├── ui-inventory/                # UI component ledgers, tokens & /ui-lab data
│   └── internal/                    # Internal product, scoring & architecture specs
├── src/                             # Next.js Source Code
│   ├── app/                         # App Router Pages & API routes
│   ├── components/                  # React Components & Shadcn UI
│   └── lib/                         # Core Utilities & Scoring Engine
└── public/                          # Static Assets & llms.txt
```
