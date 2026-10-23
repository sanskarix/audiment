# Phase 2B: Corrective Actions & Proof-Based Audits Platform Page Improvements

**Date:** October 2026  
**Scope:** Content, technical alignment, and structure enhancement for `/platform/corrective-actions` and `/platform/proof-based-audits` for high-intent search and Answer Engine Optimization (AEO).  
**Status:** Completed and Validated  

---

## 1. Executive Summary

This implementation batch updated Audiment’s two core platform capability pages:
1. `/platform/corrective-actions`
2. `/platform/proof-based-audits`

Both pages were completely rebuilt from brief or generic copy to directly explain code-verified product mechanics. The pages clarify the exact automated trigger lifecycle, SLA timelines, reminder routines, photo capture workflows, and critical technical boundaries (e.g. distinguishing the hourly cron schedule from its 6-hour reminder window, acknowledging gallery availability on mobile file pickers, and clarifying the absence of duplicate-image hashing).

Existing canonical URLs, SEO metadata standards (`buildPageMeta`), JSON-LD schemas (`SoftwareApplication`, `BreadcrumbList`, `FAQPage`), and the conversion flow (`Book a Discovery Call`) were strictly preserved.

---

## 2. Changes by Page

### Page 1: Corrective Actions (`/platform/corrective-actions`)

#### Objective & Framing
Explains how operational failures discovered during field audits automatically convert into owned, deadline-driven remediation tasks rather than getting lost on clipboards or spreadsheets.

#### Key Content Changes
1. **Direct Upfront Buyer Answer:**
   - Immediately explains the automated failure-to-task pipeline: failing any checklist question classified as "critical" automatically creates a dedicated Corrective Action (CAPA) record in Firestore.
2. **Ownership, 48-Hour SLA, and Resolution Mechanics:**
   - Explains how tasks are automatically assigned to the designated location manager mapped to that branch node in the directory.
   - Grounded strictly in application code: the system computes a fixed deadline timestamp set to `Date.now() + 48 hours`.
   - Documents that closing an action requires detailed written notes and photo proof submitted by the manager.
3. **Verified Reminder Routine (Hourly Cron vs. 6-Hour Window):**
   - Explicitly clarifies that the background cron runs on an **hourly schedule** (`/api/cron/check-missed-audits`).
   - The cron queries open or in-progress corrective actions entering their **final 6 hours before the 48-hour deadline** (`now < deadline <= now + 6 hours`) where `reminderSent === false`.
   - Emphasizes that reminders are **not** spammed every six hours; rather, a single targeted in-app notification is dispatched when the task enters its final 6-hour window, setting `reminderSent = true`.
4. **Structured 6-Step Corrective Action Lifecycle:**
   - Step 1: Failure Detection (Auditor flags critical failure on-site).
   - Step 2: Automated Record Generation (Database record created upon final audit submission).
   - Step 3: Assignment & 48-Hour Clock (Task assigned to location manager with fixed SLA).
   - Step 4: Hourly Cron & 6-Hour Alert (Single notification dispatched 6 hours prior to expiry).
   - Step 5: Manager Remediation & Evidence Submission (Manager performs physical fix and uploads notes/photos).
   - Step 6: Head-Office Verification & Closure (Corporate administrators review evidence, with ability to approve/resolve or reject back to manager).
5. **Multi-Location Oversight & Trend Alerts:**
   - Covers corporate dashboard filtering by location, status, and manager.
   - Highlights the automated **3-consecutive low-score trend alert** triggering escalations for chronic branch non-compliance.

---

### Page 2: Proof-Based Audits (`/platform/proof-based-audits`)

#### Objective & Framing
Explains how mandatory live photo evidence eliminates checklist "pencil-whipping" while clearly communicating the operational boundaries of camera verification.

#### Key Content Changes
1. **Direct Upfront Buyer Answer:**
   - Explains what proof-based auditing is and why traditional checklists fail: self-reported forms lead to passive box-checking under time pressure.
   - Audiment enforces evidence on high-risk checks so audit records reflect physical conditions rather than assumptions.
2. **How Photographic Evidence is Captured:**
   - Blueprint configuration: administrators mark critical questions as photo-required (`isPhotoRequired`).
   - In-app camera execution: tapping "Take Photo" invokes the browser media stream (`navigator.mediaDevices.getUserMedia` using the environment/rear camera).
   - Image processing: frames are drawn onto an HTML5 canvas, exported as a fresh JPEG blob (`photo_${Date.now()}.jpg`), and uploaded to cloud storage (`/api/upload`).
   - Submission gate: audit progression or final submission is blocked if required evidence is missing.
3. **What Live Camera Capture Can and Cannot Enforce:**
   - **Enforces:** Physical presence with the camera active; prevents bulk checkbox marking; attaches visual artifacts to individual question items; provides defensible records for remote supervisor review.
   - **Cannot Enforce (Honest Boundary):** Cannot physically prevent a dishonest user from pointing their camera at another screen displaying an old picture; cannot autonomously interpret image semantics without supervisor review. Positioned as an operational accountability and deterrence system, not an infallible cryptographic guarantee.
4. **Timestamps and Geolocation Verification:**
   - Documented server-side timestamping (`serverTimestamp()`) preventing client clock tampering.
   - Documented device coordinate capture (latitude and longitude via high-accuracy Geolocation API) upon final audit submission, halting submissions if location permissions are denied.
   - Direct contextual link to `/platform/geo-verified-audits`.
5. **Explicit Statement of Technical Limitations:**
   - Clarified that secondary workflows (like manager corrective action resolution) use standard file upload pickers.
   - Confirmed the absence of automated duplicate-image detection or perceptual hashing.
   - Confirmed that canvas rendering strips EXIF metadata; verified server timestamps and GPS submission coordinates serve as the authoritative record.

---

## 3. Product Claims Verified & Limitations Retained

| Capability / Claim | Code Status | Exact Implementation Details | Marketing Copy Policy |
| :--- | :--- | :--- | :--- |
| **Critical Failure Trigger** | **Verified in Code** | `traceItem?.isCriticalFailure` in `dashboard/auditor/audits/[auditId]` creates a doc in `correctiveActions`. | Prominently featured as automated failure-to-task pipeline. |
| **48-Hour SLA Deadline** | **Verified in Code** | `Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000))` in audit submission. | Positioned as standard, objective 48-hour remediation window. |
| **Deadline Reminders** | **Verified in Code** | `/api/cron/check-missed-audits` queries `deadline <= now + 6 hours` and checks `reminderSent === false`. | Accurately described: hourly cron schedule sending a single alert entering the 6-hour window. No claims of reminders every 6 hours. |
| **Manager Photo Resolution** | **Verified in Code** | `handleComplete` in `dashboard/manager/corrective-actions` updates `resolutionNote`, `resolutionPhotoUrls`, and `completedAt`. | Explained as evidence-backed resolution reviewed by corporate admins. |
| **In-App Camera Capture** | **Verified in Code** | `navigator.mediaDevices.getUserMedia` renders to canvas and uploads blob to `/api/upload`. | Documented as active viewfinder capture; avoids claims of universal gallery blocking. |
| **Geolocation Capture** | **Verified in Code** | `navigator.geolocation.getCurrentPosition` captured on final audit submission; halts submission if uncaptured. | Documented as submission-level coordinates cross-linking to `/platform/geo-verified-audits`. |
| **Duplicate Photo Detection** | **Not Present** | No perceptual hashing or duplicate matching in code. | Explicitly stated as not supported. |
| **EXIF Timestamp Validation** | **Not Present** | Canvas export strips hardware EXIF headers. | Stated that Audiment relies on server timestamps and GPS submission records, not EXIF. |
| **Offline Operation** | **Not Supported** | Photo upload (`/api/upload`) and audit submission require active network connection. | No offline syncing claimed. |

---

## 4. Internal Links Architecture

### Added to `/platform/corrective-actions`
- `/platform/proof-based-audits` (Proof-based audits and visual evidence)
- `/platform/issue-tracking` (Comprehensive issue tracking across branches)
- `/platform/geo-verified-audits` (Physical location verification)
- `/solutions/restaurant-audit-software` (Restaurant operations and food safety compliance)
- `/solutions/qsr-audit-software` (Fast-food shift-by-shift checklists)
- `/operational-drift` (How operational drift occurs when fixes are ignored)

### Added to `/platform/proof-based-audits`
- `/platform/corrective-actions` (How failed photo checks trigger corrective actions)
- `/platform/geo-verified-audits` (How GPS coordinates verify auditor presence)
- `/platform/issue-tracking` (Tracking issues surfaced by photo proof)
- `/solutions/restaurant-audit-software` (Kitchen hygiene, food safety, and cold-chain proof)
- `/solutions/qsr-audit-software` (High-speed fast food station and shift checks)
- `/operational-drift` (Why lack of verification causes standard deterioration)

---

## 5. Files Changed

1. `src/app/(website)/platform/corrective-actions/page.tsx`
   - Complete content rewrite with 6-step lifecycle, verified 48h SLA mechanics, hourly cron / 6-hour alert distinction, manager evidence requirements, and multi-location tracking.
2. `src/app/(website)/platform/proof-based-audits/page.tsx`
   - Complete content rewrite with live camera capture workflow, honest enforcement boundaries, GPS & server timestamp explanation, technical limitations, and cross-links.

---

## 6. Technical Validation Results

| Test / Check | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **TypeScript Validation** | `npx tsc --noEmit` | **PASSED** (Code 0) | Zero type errors or missing interface properties. |
| **Next.js Production Build** | `npm run build` | **PASSED** (Code 0) | All 150 static pages generated successfully, including `/platform/corrective-actions` and `/platform/proof-based-audits`. |
| **Canonical URL Check** | Source review | **VERIFIED** | Canonical URLs match `https://audiment.in/platform/corrective-actions` and `https://audiment.in/platform/proof-based-audits`. |
| **CTA Preservation** | Source review | **VERIFIED** | Both pages retain `Book a Discovery Call` with Cal.com integration (`#aud-seo-bottom-cta`). |
| **Link Integrity** | Build output cross-check | **VERIFIED** | All newly referenced links match valid prerendered static routes. |

---

## 7. Remaining Blockers & Next Steps

1. **No Technical Blockers:** The pages are fully built, typed, and validated.
2. **Recommended Next Implementation Batches:**
   - **Batch 2C:** Solution pages for `/solutions/food-safety-audit-software` and `/solutions/franchise-audit-software`.
   - **Batch 2D:** Platform feature pages for `/platform/geo-verified-audits` and `/platform/issue-tracking`.
