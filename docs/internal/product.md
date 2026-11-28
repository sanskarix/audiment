# Audiment – Product Reference

> **This is the single source of truth for what Audiment is, who it is for, what it does, and every feature at every level of detail. Read this before every session.**

---

## 1. What Is Audiment?

Audiment is an enterprise-grade, high-trust compliance and operational audit platform for multi-outlet businesses. It digitises the entire audit workflow – from publishing audits to reviewing results – through a transparent, role-based system accessible from any browser on any device.

**Tagline:** Audit smarter. Manage better.

**The core idea:** replace physical presence with a trusted digital system that creates accountability at every level – owner, manager, and auditor – by coupling checklist-style audits with mandatory photo/video evidence and geo-verified presence checks.

---

## 2. The Problem We Solve

Multi-outlet restaurant owners and operations heads cannot be physically present at every branch. They rely on managers and field staff who may not always report transparently.

**The real pain: pencil-whipping.** Field workers fake audits, fill checklists without visiting locations, send WhatsApp photos from yesterday. Operations heads have no ground-truth visibility into what is actually happening at their branches. Physical or scattered audit records are unreliable, easy to falsify, and hard to track over time. Critical hygiene or operational issues go unnoticed until they become serious problems – regulatory fines, health violations, brand damage.

---

## 3. The Solution

Audiment gives owners and operations teams:
- Verified, timestamped, photo-backed audit data from every branch in one place.
- Geo-tagged proof that the auditor was physically present (Flash Verification).
- Automated corrective action workflows that turn failures into managed tasks.
- Trend-based intelligence that escalates problems before they become crises.

---

## 4. Target Users (ICP)

**Primary:**
- VP of Operations / Director of Operations at multi-unit QSR chains
- Franchise Operations Head at franchise networks (20–500 locations)
- Head of Retail Operations at retail chains
- Multi-outlet restaurant and café owners (5–30 outlets)

**Secondary:**
- Retail chains, hotels, hospitals, facility management companies

---

## 5. Brand & Positioning

- **Category:** High-Trust Accountability Engine – not generic compliance software.
- **Tone:** Punchy and outcome-driven. "Stop pencil-whipping" not "Improve compliance." Relatable to franchise owners – reference real pain like "the WhatsApp black hole." Never robotic SEO text in visible UI. Sentence case on all headings – never Title Case.
- **Key differentiators to use in all copy:**
  - Flash Verification: geo-tagged video + selfie proves auditor was physically present
  - 48-hour auto-CAPA: critical failures auto-generate corrective tasks with mandatory photo proof
  - Mandatory photo evidence: enforced per question – no photo, no submission
  - Surprise audits: managers never know when one is coming
  - Trend detection: 3 consecutive poor audits trigger a priority alert

**Competitors:**
| Competitor | Weakness vs Audiment |
|---|---|
| SafetyCulture (iAuditor) | Generic, not India-focused, no flash verification |
| GoAudits | Basic checklist tool, no CAPA automation |
| Zenput | US-focused, expensive, no geo-verification |
| Jolt | Restaurant-specific but no evidence enforcement |

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) – single codebase for UI + server logic |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + Shadcn UI (preset: `b1D5T6KA`) |
| Animations | Framer Motion + tw-animate |
| Database | Firebase Firestore (real-time NoSQL) |
| Authentication | Firebase Auth (email/password) |
| File Storage | Cloudinary (images, videos, HLS streaming) |
| Analytics/Charts | Recharts |
| PDF Export | jsPDF + html2canvas with custom CSS injection |
| Hosting | Vercel (auto-deploy, optimised for Next.js) |

**Architecture principles:**
- API routes handle all backend operations
- Server components for performance; client components only for interactivity
- Mobile-first approach for auditor interface; web dashboard for managers and admins
- No native app in the testing phase – fully browser-based

---

## 7. User Roles & Access Control (RBAC)

The system operates on a strict three-tier hierarchy isolated by `organizationId`. Every user belongs to one organization; they can only ever see data from their own organization.

### Admin (Owner)
- Total control over the platform for their organization
- Creates and manages locations (Nodes), users, audit templates (Blueprints)
- Publishes audits to locations and sets deadlines
- Views all audit results across all locations
- Accesses cross-branch performance comparisons and compliance trend data
- Manages the member directory (create, deactivate, reset passwords)
- Monitors the corrective action queue across all locations
- Sees Flash Verification (Flashmob) results

### Manager
- Assigned to specific locations
- Assigned audits by the admin and redistributes them to auditors
- Receives notifications when audits are published or missed
- Monitors auditor activity and audit progress in their locations
- Owns the corrective action resolution queue for their locations
- Must provide mandatory notes and photo proof when resolving issues
- Views location-specific performance trend charts

### Auditor
- Field agent. Sees only audits assigned to them
- Completes audits step by step on a mobile-optimised interface
- Attaches photo evidence per question (mandatory where required)
- Saves progress mid-audit and resumes later
- Geo-tagged and timestamped automatically on each response submission
- Has access to Flash Verification (Flashmob) if flagged with that permission

---

## 8. Core Workflows

### 8.1 The Standard Audit Lifecycle

| Step | Actor | What Happens |
|---|---|---|
| 1. Blueprint Creation | Admin | Defines a standardized audit template (questions, types, severity, scoring, photo requirements) |
| 2. Node Definition | Admin | Creates a location and assigns a manager |
| 3. Publishing | Admin | Publishes the audit to a location with a deadline; optionally marks as surprise |
| 4. Assignment | Manager | Assigns the published audit to one of their auditors |
| 5. Notification | System | Auditor receives a notification of the new assignment |
| 6. Execution | Auditor | Completes audit step-by-step, providing answers and photo evidence |
| 7. Geo-tagging | System | Captures auditor's GPS location at submission time |
| 8. Scoring | System | Calculates weighted score, grade, and critical failure flags automatically |
| 9. Intelligence | System | Triggers alerts if score < 60%, or if 3 consecutive audits trend poorly at a location |
| 10. Corrective Loop | System → Manager | Critical failed questions auto-generate a resolution task with a 48-hr SLA |
| 11. Resolution | Manager | Manager resolves each corrective action with mandatory proof note + photo |
| 12. Reporting | Admin/Manager | Detailed audit report viewable in-app; exportable as PDF |

### 8.2 The Flash Verification (Flashmob) Lifecycle

A covert, unannounced video-based audit to prove physical presence at a location.

| Step | Detail |
|---|---|
| 1. Access | Only auditors flagged with `flashmobAccess` can initiate |
| 2. Location Selection | Auditor selects a target location from the list |
| 3. Surroundings Recording | Auditor records a 20-second environmental video inside the browser |
| 4. Video Review | Auditor reviews the recording before proceeding |
| 5. Identity Verification | Circular "Face Guide" viewfinder captures a verified selfie |
| 6. Geo-tag + Timestamp | System locks GPS coordinates and timestamp at submission |
| 7. Upload | Video and selfie uploaded to Cloudinary |
| 8. Admin Review | Visible only to admin and specifically authorized viewers (`visibleTo` array) |

### 8.3 Corrective Action (CAPA) Lifecycle

| Step | Detail |
|---|---|
| Trigger | System auto-creates when a critical severity question is failed in an audit |
| Assignment | Automatically assigned to the location's manager |
| SLA | 48-hour deadline from creation |
| Status flow | `open` → `in_progress` → `resolved` |
| Resolution requirement | Manager must add a note and upload photo proof |
| Escalation | Cron job sends reminders when deadline is within 6 hours |
| Visibility | Admin can see all open corrective actions across all locations |

---

## 9. Feature Inventory

### 9.1 Admin Dashboard
- **Compliance Health widget:** Organisation-wide compliance score at a glance
- **Regional performance charts:** Recharts bar/area charts showing score trends across locations
- **Active audit monitor:** Real-time count and status of audits in flight across the org
- **Open corrective actions counter:** Priority queue of unresolved issues needing manager attention
- **Blueprint Builder:** Full CRUD UI for building audit templates
  - Add/edit/delete questions
  - Set question type: `yes_no` or `rating_10`
  - Set severity per question: `low`, `medium`, or `critical`
  - Toggle `requiresPhoto` per question to enforce evidence
  - Drag-to-reorder questions
  - Edit or deactivate entire templates
  - **FSSAI Compliance Loader:** One-click configuration to load standard food hygiene/safety audit questions (FSSAI defaults)
- **Node Manager:** CRUD for locations (Nodes)
  - Create location with name, address, city, lat/lng
  - Assign a manager to each location
  - View all locations in a list, activate/deactivate
- **Member Directory:** Full user lifecycle management
  - Create manager and auditor accounts
  - Assign auditors to managers
  - Assign managers to locations
  - Deactivate users
  - **Password Self-Service:** Admin can trigger password reset emails to users directly from the directory
  - Firebase Auth ↔ Firestore DB sync on user creation
- **Audit Publishing:** Publish a blueprint to a specific location
  - Set deadline
  - Mark as surprise audit (hides from manager until published)
  - Set as recurring (e.g. every Monday)
- **Cross-branch comparison report:** Rank all locations by audit score side-by-side
- **PDF export:** Export any audit report as a high-fidelity PDF

### 9.2 Manager Dashboard
- **Operational overview:** Count of active auditors and managed locations
- **Audit queue:** All audits assigned to their locations with current status
- **Auditor assignment UI:** Assign a published audit to one of their auditors
- **Resolution dashboard:** Queue of corrective actions needing resolution
  - Status badges (`open`, `in_progress`, `resolved`)
  - Mandatory note + photo upload on resolution
  - 48-hour deadline countdown visible
- **Location performance trends:** Area charts tracking audit scores at each location over time
- **Notification center:** In-app alerts for new audits, missed deadlines, corrective action reminders

### 9.3 Auditor Dashboard
- **Assigned audit list:** All current and upcoming audits with status and deadline
- **Audit execution interface (mobile-optimised):**
  - Step-by-step question flow with progress bar
  - `yes_no` questions: toggle button UI
  - `rating_10` questions: 1–10 selector
  - Per-question photo attachment with inline preview/carousel
  - Per-question optional notes field
  - **Abort Protection:** Confirmation guardrail to prevent accidental data loss when leaving an active audit mid-session
  - **Resume Capability:** Save progress and return to any in-progress audit
- **Flash Verification (Flashmob) button:** Visible only if the auditor has `flashmobAccess` flag
- **Personal performance stats:** Completed vs missed audits, score history

### 9.4 Audit Report (All Roles)
- Final weighted score displayed as a percentage
- Grade badge: `excellent`, `good`, `needs_improvement`, `fail`, `critical_fail`
- Critical failure banner if any critical question was failed
- Per-question breakdown: answer, score contribution, critical-fail marker
- Expandable "How this score was calculated" trace panel
- Geo-tag map view of auditor location at submission
- PDF export button

---

## 10. Scoring Model (Summary)

> Full mathematical specification: `scoringmodel.md`

**Normalization:**
- `yes_no`: Yes = 1.0, No = 0.0
- `rating_10`: normalizedScore = rating / 10

**Severity weights:**
| Severity | Weight |
|---|---:|
| Low | 1 |
| Medium | 2 |
| Critical | 5 |

**Formula:**
```
finalPercentage = (Σ normalizedScore × weight) / (Σ weight) × 100
```

**Critical failure:** Triggered when severity = critical AND (yes_no answer = No) OR (rating < 6). Tracked separately from the percentage – a critical_fail grade overrides any percentage-based grade.

**Grade thresholds:**
| Score | Grade |
|---|---|
| Any critical failure → | `critical_fail` |
| 90–100 | `excellent` |
| 75–89 | `good` |
| 60–74 | `needs_improvement` |
| 0–59 | `fail` |

All scoring must go through the single centralised function in `src/lib/scoring.ts`. The same formula is used at submission, in reports, on dashboards, and in PDF exports – never diverge.

---

## 11. Alerting & Intelligence Engine

### 11.1 Low Score Alert
- **Trigger:** Any audit that completes with a `scorePercentage` < 60%
- **Action:** Instant notification to the assigned manager + all admins in the organization
- **Channel:** In-app notification center + (future) email

### 11.2 Trend Alert
- **Trigger:** A location scores poorly (below threshold) on 3 consecutive audits
- **Action:** Priority "Trend Alert" notification to admin and manager
- **Purpose:** Detect systemic problems at a branch before they escalate

### 11.3 Auto-CAPA (Corrective Action) Generation
- **Trigger:** Any `critical` severity question is answered as a failure
- **Action:** System auto-creates a `correctiveAction` document assigned to the location's manager
- **SLA:** 48-hour deadline from creation
- **Escalation:** Cron job checks every hour; sends reminder when deadline is within 6 hours

### 11.4 Missed Audit Alert
- **Trigger:** Cron job detects an audit in `published`, `assigned`, or `in_progress` status past its deadline
- **Action:** Status updated to `missed`; notification sent to manager and all admins
- **Cron path:** `GET /api/cron/check-missed-audits` (secured with `CRON_SECRET` bearer token)
- **Schedule:** Every hour via Vercel cron (`"0 * * * *"`)

---

## 12. Media & Evidence Pipeline

| Asset Type | Source | Storage | Notes |
|---|---|---|---|
| Audit question photos | Auditor camera | Cloudinary | Multipart upload; stored as array of URLs per response |
| Corrective action resolution photos | Manager camera/upload | Cloudinary | Mandatory for resolution |
| Flashmob 20-second video | Browser MediaRecorder | Cloudinary | Supports WebM and MP4 for browser compatibility |
| Flashmob selfie | Browser camera capture | Cloudinary | Circular "Face Guide" viewfinder UI |

**Photo enforcement:** Per-question `requiresPhoto` toggle – if set, the auditor cannot advance past that question or submit the audit without providing a photo. This is the core anti-pencil-whipping mechanism.

**Video recording UI:** Real-time countdown timer and animated "REC" indicator during flashmob recording. Auditor reviews video before submission.

---

## 13. Surprise Audit Feature

- Admin can flag any published audit as a surprise (`isSurprise: true`)
- Surprise audits are **not visible to the manager** until the admin publishes them
- Same-day deadlines enforced for surprise audits
- Creates unpredictability that prevents branch staff from "prepping for audits"
- Manager calendar view shows upcoming scheduled audits (non-surprise only)
- Recurring audit scheduling support (e.g. every Monday)

---

## 14. Micro Features & UX Polish

| Feature | Detail |
|---|---|
| Dynamic headings | Subheaders adapt to provide context-aware, action-oriented instructions based on current state |
| Skeleton loading system | Custom-designed skeleton placeholders for every data-heavy component – no blank screens |
| Smart geo-tagging | 5-second location capture with fallback logic for connectivity issues |
| Abort protection | Confirmation modal prevents data loss when leaving an active audit |
| Interactive badges | Status chips with role-specific iconography and color-coded severity |
| Photo inline preview | Carousel for reviewing and deleting evidence photos before submission |
| Score color-coding | All score displays (cards, charts, lists) use dynamic color: green (≥90), amber (60–89), red (<60) |
| FSSAI one-click loader | Admin can load a pre-built FSSAI food hygiene template in one click |
| Resume mid-audit | Auditor can exit and return to any in-progress audit without losing answers |
| Password self-service | Admin triggers password reset email from the member directory – auditors don't need to contact support |
| PDF export engine | jsPDF + html2canvas with custom CSS stripping for 100% rendering compatibility in exported documents |
| Video countdown UI | Real-time timer and animated REC badge during flashmob recording |
| HLS streaming support | Cloudinary HLS for smooth video playback of flashmob recordings in the admin review UI |

---

## 15. Security & Data Integrity

- **Firestore Security Rules:** Every document enforces `organizationId` isolation. Users cannot read or write documents from other organizations.
- **Role-based rules:** Auditors can only read audits assigned to their `userId`. Managers can only read locations assigned to their `userId`. Only admins can create/modify templates, locations, and users.
- **MediaRecorder MIME support:** Flashmob recording uses multiple candidate types (`video/webm;codecs=vp9`, `video/webm`, `video/mp4`) to maximize browser compatibility.
- **Scoring version field:** Every scored audit stores `scoringVersion` for future migration compatibility.
- **Geo-lock:** Auditor's GPS coordinates are captured at submission time and stored immutably – cannot be edited after the fact.
- **Timestamp lock:** All submissions record `submittedAt` server-side – cannot be backdated.

---

## 16. Product Structure (Navigation)

| Surface | Path | Access |
|---|---|---|
| Public marketing site | `/` | All |
| Login | `/login` | All |
| Admin dashboard | `/dashboard/admin` | Admin only |
| Manager dashboard | `/dashboard/manager` | Manager only |
| Auditor interface | `/dashboard/auditor` | Auditor only |

Role-based routing is enforced in Next.js middleware: on login, the app reads the `role` field from the Firestore `users` document and redirects to the correct dashboard. No role can access another role's routes.

---

## 17. GEO / SEO Strategy

- **Invisible SEO:** Sleek UI for humans; structured data for AI crawlers.
- **JSON-LD schema** injected per-page via `next/script` – never global.
- **Semantic HTML** tables used for all comparison matrices.
- `llms.txt` entity definition at `public/llms.txt`.
- AI crawlers explicitly allowed in `robots.txt`.

**Hub and spoke architecture:**
- Hub: Homepage (`/`)
- Spokes: `/solutions/restaurant-operations` (built), `/solutions/franchise-operations` (pending), `/solutions/retail-operations` (pending), `/use-cases/prevent-fake-audits` (pending), `/compare/audiment-vs-safetyculture` (pending), `/blog/` (pending)

**Blog clusters (priority order):**
1. Operational Accountability and Anti-Fraud
2. CAPA Workflows
3. High-Value Checklists and Templates
