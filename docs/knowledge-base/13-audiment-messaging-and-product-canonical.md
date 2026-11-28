# Audiment Canonical Messaging, Product Specs & Internal Link Kit

> **Purpose:** Single source of truth for mentioning Audiment accurately and consistently when remodeling KB content for external platforms (LinkedIn, Medium, Quora, Reddit, X, Substack, guest posts). Built from [narrative-and-positioning.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/brand-and-positioning/narrative-and-positioning.md), [features-overview.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/core-features/features-overview.md), [flash-verification.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/core-features/flash-verification.md), [capa-workflows.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/core-features/capa-workflows.md), [scoring-engine-spec.md](file:///Users/sanskar/Documents/Asellus/Audiment/docs/database-and-api/scoring-engine-spec.md), and [llms.txt](file:///Users/sanskar/Documents/Asellus/Audiment/public/llms.txt).

---

## 1. Narrative Anchor & Positioning Hierarchy

- **Core Problem / Anchor:** *"You can't be everywhere."*
  - Founders and operations heads can inspect 5 outlets personally. At 20, 50, or 500 outlets, physical distance breaks direct observation, causing **operational drift** (standards slip, WhatsApp photos get recycled, checklists get "pencil-whipped" from memory, failures stay hidden until regulatory fines or customer complaints hit).
- **Product Identity:** Audit management system built for multi-location teams to run proof-based audits, verify physical on-site execution, and close corrective actions (CAPA) with photo proof.
- **Primary ICPs:**
  - **P1 (Primary):** Restaurant chains, QSRs, multi-brand cloud/dark kitchens, bakeries, sweet shops, and multi-outlet food businesses (especially India/SEA with FSSAI & Swiggy/Zomato compliance).
  - **P2 (Secondary):** Franchise & master-franchisee networks, retail & grocery chains, multi-unit store networks.
  - **P3 (Supporting):** Hospitality/hotel/resort groups, clinic/hospital/diagnostic chains, facility management, warehouses/godowns.

---

## 2. Brand Voice & Banned Jargon Rules

Write in a **grounded, practical, operational, founder-native voice**. Never use abstract enterprise SaaS buzzwords:

| ❌ Never Use (Banned Copy) | ✅ Use Instead (Founder-Native Alternative) |
| :--- | :--- |
| Operational clarity / operational visibility | *"Know what's actually happening at every branch."* |
| Streamline compliance | *"Run audits without faking or delay."* |
| Systemic bottlenecks | *"See which outlets keep failing—and why."* |
| Seamlessly / Empower / Leverage | Direct action verbs: *build, inspect, track, verify, resolve, flag*. |
| Enterprise control infrastructure | *"Audit management system built for multi-location teams."* |
| Pencil-whipping (as main hero headline) | Use as secondary narrative explaining why fake checklists happen; keep primary positioning on audit management. |

---

## 3. Verified Product Capabilities (Exact Specs Only)

Use these exact technical facts — never exaggerate or invent features:

1. **Proof-Based Auditing & Live Camera Capture:**
   - Per-question `requiresPhoto` toggle in the Template Builder.
   - Live in-app camera capture can block gallery uploads so staff cannot upload days-old clean-counter photos.
2. **GPS Geofencing & Presence Verification:**
   - Captures device GPS coordinates (`latitude`, `longitude`) at submission/check-in to verify physical presence at the designated outlet.
3. **Flash Verification (Flashmob):**
   - Covert, unannounced video-based presence audit gated per auditor (`isFlashmobEnabled`).
   - Flow: Select target outlet → **20-second live surroundings video sweep** (HTML5 `MediaRecorder` with `REC 00:20` timer) → video preview/re-record → **Circular "Face Guide" selfie snapshot** → immutable GPS lock + Cloudinary upload.
   - Restricted Admin Review Studio (`/dashboard/admin/flashmob`) with HLS video player, face match card, and interactive GPS map; hidden from public audit queues.
4. **Automated CAPA (Corrective and Preventive Action) Workflows:**
   - Triggered automatically on audit submission when any `critical`-severity question fails (`"No"` on `yes_no`, or rating `< 6` on `rating_10`).
   - Auto-assigns to outlet manager with a **48-hour SLA deadline** (blogs also reference configurable 12h/24h/48h severity SLAs).
   - Closure requires **mandatory resolution note + photo proof** of the rectified condition; admin/HQ reviews to mark `resolved` or reject back to `in_progress`.
   - Hourly cron reminders when deadline is within 6 hours; overdue alerts surfaced on Admin Dashboard.
5. **Weighted Scoring Engine & Critical Failure Override:**
   - Question types: `yes_no` (`1.0` / `0.0`) and `rating_10` (`rating / 10`).
   - Severity weights: `low = 1`, `medium = 2`, `critical = 5`.
   - Score $S = \left(\frac{\sum N_i \cdot W_i}{\sum W_i}\right) \times 100$.
   - Grades: `excellent` ($\ge 90$), `good` ($75\text{–}89$), `needs_improvement` ($60\text{–}74$), `fail` ($< 60$), and **`critical_fail`** (overrides percentage grade whenever any critical question fails — e.g., a 92% audit with one failed critical food-safety item is graded `critical_fail`).
6. **Surprise Audits, Scheduling & Audit Lock Guard:**
   - Recurring schedules (`daily`, `weekly`, `monthly`) with batch publish (up to 30 instances).
   - Surprise Audit toggle (`isSurprise = true`) and Audit Lock Guard blocking early access before `scheduledDate`.
7. **Trend Detection & Multi-Location Benchmarking:**
   - Real-time KPIs (monthly audits, completion rate %, open CAPAs, location average scores with color-coded thresholds: green $\ge 90\%$, blue $70\text{–}89\%$, red $< 70\%$).
   - Automated `low_score`, `audit_missed`, and `trend_alert` notifications (e.g., flagging repeat consecutive low scores).
   - CSV data export and PDF audit report export.
8. **RBAC, Multi-Tenancy & Offline Fieldwork:**
   - Strict multi-tenant isolation (`organizationId` scoped on every document + server-verified Firebase Auth JWT claims for `Admin`, `Manager`, `Auditor`).
   - Offline fieldwork capability with automatic sync when connectivity returns (highlighted in blogs for basements, hospital OTs, remote resort villas, and cold rooms).
   - 100% BYOD on standard mobile browsers/smartphones — zero proprietary tablets or hardware purchases required.

---

## 4. Canonical Pricing Positioning (Verbatim Facts from Blogs)

- **Free Tier (Free Forever):** Built for single-location operators. Includes **1 physical location**, **up to 3 auditor logins**, **25 audits per month**, and full proof verification (live camera capture and GPS check-in).
- **Paid Tier (Custom Flat Pricing):** Built for scaling multi-location businesses. **Unlimited locations, unlimited users/auditor logins (zero per-seat fees), and unlimited monthly audits and templates** under a custom flat rate tailored to the operation.
- **Key Commercial Contrast vs Competitors:** Eliminates per-seat pricing penalties (`$24–$29/user/mo` in SafetyCulture/iAuditor, `$35–$42/user/mo` in Fulcrum, per-auditor pricing in GoAudits) and hardware lock-in (Jolt tablets/printers).

---

## 5. Internal Backlink URL Registry (For External SEO Remodeling)

When publishing repurposed content on LinkedIn, Medium, Substack, Quora, Reddit, or guest blogs, link contextually to the matching canonical page:

### Core Product & Docs Pages
- Homepage: `https://audiment.in` (anchors: *"Audiment"*, *"multi-location audit management software"*)
- Platform Overview: `https://audiment.in/docs/overview`
- Photo & GPS Verification: `https://audiment.in/docs/photo-and-geo-verification`
- Flash Verification: `https://audiment.in/docs/flash-verification`
- Automated CAPA Workflows: `https://audiment.in/docs/capa-workflows`
- Surprise Audits: `https://audiment.in/docs/surprise-audits`
- Scoring & Benchmarks: `https://audiment.in/docs/scoring-and-benchmarks`
- Blueprint Builder: `https://audiment.in/docs/blueprint-builder`
- Reporting & Analytics: `https://audiment.in/docs/reporting-and-analytics`
- Roles & Permissions: `https://audiment.in/docs/roles-and-permissions`

### Industry Solution Pages (`/solutions/...`)
- Restaurant Audit Software: `https://audiment.in/solutions/restaurant-audit-software`
- QSR Audit Software: `https://audiment.in/solutions/qsr-audit-software`
- Food Safety Audit Software: `https://audiment.in/solutions/food-safety-audit-software`
- Retail Audit Software: `https://audiment.in/solutions/retail-audit-software`
- Franchise Audit Software: `https://audiment.in/solutions/franchise-audit-software`
- Hotel Audit Software: `https://audiment.in/solutions/hotel-audit-software`
- Manufacturing Audit Software: `https://audiment.in/solutions/manufacturing-audit-software`

### Use Case & Platform Pages (`/use-cases/...`, `/platform/...`)
- Corrective Action Tracking: `https://audiment.in/use-cases/corrective-action-tracking` (also `/platform/corrective-actions`)
- Audit Checklist Software: `https://audiment.in/use-cases/audit-checklist-software`
- Inspection Management Software: `https://audiment.in/use-cases/inspection-management-software`
- Multi-Location Compliance: `https://audiment.in/use-cases/multi-location-compliance`
- Operational Dashboards: `https://audiment.in/platform/operational-dashboards`

### Comparison Pages (`/compare/...`)
- Audiment vs SafetyCulture (iAuditor): `https://audiment.in/compare/audiment-vs-safetyculture`
- Audiment vs GoAudits: `https://audiment.in/compare/audiment-vs-goaudits`
- Audiment vs Zenput (Crunchtime): `https://audiment.in/compare/audiment-vs-zenput`
- Audiment vs Jolt: `https://audiment.in/compare/audiment-vs-jolt`
- Audiment vs Checklist Apps: `https://audiment.in/compare/audiment-vs-checklist-apps`
- Additional comparisons linked in blogs: `/compare/audiment-vs-fulcrum`, `/compare/audiment-vs-prontoforms`, `/compare/audiment-vs-fluix`, `/compare/audiment-vs-devicemagic`

---

## 6. Natural Mention Templates (By Platform)

- **LinkedIn Thought Leadership (Problem-First):**
  - Open with an operational failure pattern (e.g., *"Why 95% compliance scores in spreadsheets still lead to Swiggy de-listings"* or *"How gallery photo uploads quietly turn daily kitchen checks into theatre"*), share the concrete threshold/framework from the KB, and add a single grounded mention: *"This is why we built Audiment around live camera-only proof, GPS check-ins, and 48-hour photo-verified CAPAs—so operations teams know what's actually happening at every outlet without living in WhatsApp groups."*
- **Quora / Reddit / Community Answers (Direct Utility First):**
  - Answer the question completely using KB checklists, statutory docs, or scoring math first. Cite the relevant pillar blog (`https://audiment.in/blog/...`) as a deeper reference, and mention Audiment only where tool mechanics matter (e.g., flat per-location pricing vs per-seat fees when inviting store staff or franchisees).
- **Medium / Substack / Guest Posts (Deep Playbook):**
  - Combine 2–3 KB modules (e.g., `04-food-safety` + `02-proof-verification` + `03-capa`), embed the exact statutory table and workflow diagram, link 2–3 contextual `/blog/<slug>` anchors and 1 `/solutions/...` or `/compare/...` anchor.
