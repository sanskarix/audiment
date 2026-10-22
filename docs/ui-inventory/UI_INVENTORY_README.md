# Audiment UI Inventory — Readme & System Index

**Objective**: Comprehensive, interactive visual reference inventory of all existing UI implementations across the Audiment application.  
**Governing Rule**: **Document first, decide later.** No UI has been simplified, consolidated, or redesigned.

---

## 1. Documentation Index

The inventory is divided into durable, source-linked documents located under [`docs/ui-inventory/`](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory):

1. [UI_SCOPE_REPORT.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/UI_SCOPE_REPORT.md):
   - Architectural framework (Next.js 16, Tailwind CSS v4, Radix/Base UI, Twenty UI).
   - Audit boundaries and inspection methodology.

2. [UI_ROUTE_INVENTORY.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/UI_ROUTE_INVENTORY.md):
   - All 69 discovered application routes (Admin, Manager, Auditor, Login, Internal Tools, Marketing/SEO).
   - Layouts, authentication requirements, loading/empty/error states, and rendered components.

3. [UI_COMPONENT_INVENTORY.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/UI_COMPONENT_INVENTORY.md):
   - Numbered sequential entries for 215 UI components and implementations:
     - 100 shared primitive library components (`src/components/ui` vs `src/components/app-ui`).
     - 115 distinct in-app implementations (`BTN-xxx`, `TBL-xxx`, `FIL-xxx`, `MOD-xxx`, `CRD-xxx`, `BDG-xxx`) with exact line numbers.

4. [UI_DESIGN_TOKENS.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/UI_DESIGN_TOKENS.md):
   - Global CSS tokens (OKLCH color palette for Light and Dark modes).
   - Border radius scale (`--radius-sm` through `--radius-4xl`).
   - Spacing scales (`--spacing-aud-*`).
   - Custom utility classes (`.badge-*`, `.stat-number`, `.filter-btn`, `.icon-action-btn`, `.apple-press`).

5. [UI_DUPLICATE_CANDIDATES.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/UI_DUPLICATE_CANDIDATES.md):
   - Detailed ledger of 50 duplicate component filenames between `src/components/ui` and `src/components/app-ui`.
   - In-app pattern duplicate observations (varying filter button paddings, custom modal shells, metric card structures).

6. [UI_INSPECTION_LEDGER.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/UI_INSPECTION_LEDGER.md):
   - Exhaustive ledger tracking all 266 source files across `src/`, categorized by status (`INSPECTED`, `PENDING_LAB_REVIEW`, `EXCLUDED_NON_UI`).

---

## 2. Interactive Visual Reference Library (`/ui-lab`)

An interactive visual catalog is deployed at `/ui-lab` backed by structured data in [`docs/ui-inventory/ui_lab_data.json`](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/ui_lab_data.json).

Features:
- **In-App Implementations Browser**: Filter by category (Buttons, Tables, Filters, Modals, Cards, Badges) with live visual previews rendered for every component.
- **Visual Specifications & Code Trace**: Displays extracted dimensions, typography, colors, behaviors, and direct source file links.
- **Library Primitives Browser**: Inspect both `src/components/ui` and `src/components/app-ui`.
- **Route Explorer**: Full breakdown of all 69 application routes with state tracking.
- **Side-by-Side Comparison**: Compare duplicate candidate implementations directly.
