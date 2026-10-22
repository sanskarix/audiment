# Audiment UI Inventory — Scope Report & Methodology (Phase 1)

**Date**: 2026-10-13  
**Status**: Phase 1 Complete (Scope Established, Ledger Initialized)

---

## 1. Executive Summary & Objective

In accordance with [UI_LAB.md](file:///Users/sanskar/Documents/Asellus/Audiment/UI_LAB.md), this project conducts an exhaustive, empirical visual inventory of the UI implementations currently existing throughout the Audiment codebase.
**Governing Rule: Document first, decide later.** No UI is being simplified, replaced, or redesigned in this phase.

This Scope Report defines the framework, dependencies, architectural boundaries, route taxonomy, and file ledger for the audit.

---

## 2. Technical Stack & Architecture

- **Framework**: Next.js 16.2.1 (App Router), React 19.2.4, TypeScript 5.
- **Styling Architecture**:
  - Tailwind CSS v4 (`@tailwindcss/postcss`, `@tailwindcss/typography`, `tw-animate-css`).
  - App Stylesheet: `src/styles/app.css` (custom classes for dashboards, badges, tables, tactile controls, Apple-inspired utility classes).
  - Website Stylesheets: `src/styles/website-audiment.css`, `src/styles/website-style.css`, `src/styles/website.css`, `src/styles/website-scroll-reveal.css`.
- **UI Component Libraries**:
  - `twenty-ui` (`2.46.0`) in `package.json` (unpacked/imported in recent prototype sections).
  - Radix UI primitives (`@radix-ui/react-label`, `@radix-ui/react-slot`, `radix-ui`).
  - `@base-ui/react` (`^1.4.0`).
  - Icons: `lucide-react` (`^1.7.0`), `@tabler/icons-react` (`^3.40.0`).
  - Animations: `framer-motion` (`^12.38.0`), `motion` (`^12.38.0`), `gsap` (`^3.15.0`), `lenis` (`^1.3.26`).
  - Data viz: `recharts` (`^3.8.0`).
  - Date picking: `react-day-picker` (`^9.14.0`), `date-fns` (`^4.1.0`).
  - Other: `@calcom/embed-react`, `react-easy-crop`, `react-use-measure`.

---

## 3. Discovered Route Scope

The application is structured into two main route groups under `src/app`:
1. **`(app)` — Authenticated Product Application**:
   - `/login` — Login & authentication entry point.
   - `/dashboard/admin` — Admin Portal (Overview, Audits, Corrective Actions, Locations, Users, Templates list/new/edit, Reports list & detail, Flashmob dashboard & detail, Settings).
   - `/dashboard/manager` — Manager Portal (Overview, Audits, Auditors list & detail, Calendar, Corrective Actions, Reports list & detail, Settings).
   - `/dashboard/auditor` — Auditor Portal (Overview, Audits execution `[auditId]`, History, Flashmob execution, Settings).
   - `/test-recording` — Audio/video verification testing harness.
2. **`(website)` — Public Marketing & Knowledge Base**:
   - `/` — Homepage.
   - `/about`, `/glossary`, `/cookie-policy`, `/privacy-policy`, `/terms-of-service`.
   - `/solutions/*` (7 pages: retail, restaurant, food-safety, hotel, qsr, manufacturing, franchise, hub).
   - `/platform/*` (5 pages: geo-verified, proof-based, operational-dashboards, corrective-actions, issue-tracking).
   - `/use-cases/*` (5 pages: multi-location-compliance, inspection-management, corrective-action-tracking, audit-checklist, hub).
   - `/compare/*` (6 pages: vs checklist apps, zenput, goaudits, safetyculture, jolt, hub).
   - Topical SEO landing pages (e.g., `/fssai-audit-software`, `/operational-drift`, `/staying-ahead-of-compliance`, etc.).
   - `/blog`, `/blog/[slug]`.
3. **`/ui-lab` — Visual UI Lab Target**:
   - Currently contains 17 draft sections in `src/app/ui-lab/sections/`. Note: currently lacking `page.tsx` entry point, which will be constructed as the central interactive catalog.

---

## 4. Source Directory Audit Boundaries

- **`src/app/(app)`** (32 files): Core audit execution, management, administration UI.
- **`src/app/(website)`** (41 files): Public marketing, SEO templates, landing flows.
- **`src/components/ui/`** (42 files): Baseline shared UI components (Radix / shadcn style).
- **`src/components/app-ui/`** (43 files): Parallel app-specific variants or customized components.
- **`src/components/admin/`** (`TemplateBuilder.tsx`): Complex drag-and-drop audit template builder.
- **`src/components/website/`** (5 files): Shared public layouts, footers, headers, logos.
- **`src/components/home/`, `about/`, `blog/`, `compare/`, `solutions/`, `use-cases/`, `legal/`, `seo/`, `glossary/`** (18 files): Domain-specific clients and templates.
- **`src/styles/`** (5 files): Global stylesheets, design tokens, utility rules.

---

## 5. Inspection Ledger Architecture

The file ledger is persisted at `docs/ui-inventory/UI_INSPECTION_LEDGER.md`. Every file in `src` is accounted for across three statuses:
- `INSPECTED`: Audited for UI components, DOM structure, and styles.
- `PENDING`: Scheduled for Phase 2/3 deep audit.
- `EXCLUDED_NON_UI`: Backend logic, database/auth handlers, cron tasks, or utility scripts with zero rendering responsibility.
