# Audiment — Complete Feature List (Code-Extracted)

> Every feature here is derived directly from reading the source code. No documentation, no assumptions.

---

## PLATFORM-WIDE

### Authentication & Identity
- Firebase Auth with email/password
- Custom JWT claims (`role`, `organizationId`) injected server-side at user creation and role change, ensuring every ID token is authoritative without a DB lookup
- `AuthProvider` client component syncs Firebase Auth state → Firestore user doc via `isSynced` + `orgId` state before any page renders data (`useAuthSync()` hook)
- `auth-server.ts` `getCallerInfo()` extracts and verifies the Bearer token on every API route server-side before touching the DB

### Multi-Tenancy
- Every Firestore document is scoped by `organizationId`. All queries use this as the primary filter, ensuring zero data leakage between organizations
- Separate `organizations` collection stores org-level settings (`timezone`, `defaultStartTime`, `defaultEndTime`, `logoUrl`, notification preferences)

### Notifications (Real-Time, Role-Aware)
- Firebase `onSnapshot` listener on the `notifications` collection filtered by `recipientId`
- Notification types: `audit_assigned`, `audit_published`, `surprise_audit`, `audit_missed`, `low_score`, `trend_alert`, `corrective_action`
- **Role-aware routing**: clicking a notification dynamically routes to the correct role-scoped page (e.g. `audit_missed` → `/dashboard/admin/audits` for admins, `/dashboard/manager/audits` for managers)
- **Audit Lock Guard**: auditor notification clicks check the audit's `scheduledDate`; if `now < scheduledDate`, access is blocked with a message
- **Optimistic UI**: local state is updated immediately before Firestore write resolves
- **Sidebar Card Stack Mode**: Framer Motion `AnimatePresence` + `popLayout` renders the top 3 unread notifications as a physical stacked deck with `scale`, `zIndex`, and `blur` animations
- **Mark All Read**: Firestore `writeBatch` commits all unread updates atomically in one round-trip
- Notification bell supports 4 display variants: `default`, `trigger-only`, `sidebar-item`, `sidebar-card`

### Dark / Light Mode
- Full dark/light theme support via `next-themes`
- `ThemeToggle` components surfaced in the dashboard shell

### Data Export (CSV)
- Admin can export all org audit data to CSV from Settings
- Fetches auditor/manager names in batches of 30 (Firestore `in` limit), builds a lookup map, then generates `Audit Title, Location, Manager, Auditor, Score, Date, Status` columns
- Formats status strings (`in_progress` → `In Progress`) before writing
- Triggers browser download via a synthetic `<a>` click with a Blob URL

---

## ADMIN DASHBOARD

### Overview / Home
- 4 real-time `onSnapshot` listeners running in parallel: Locations, Audits, Open Corrective Actions, Trend Alerts
- **KPIs (computed via `useMemo`)**: Total Audits This Month, Completion Rate (%), Open Corrective Actions count, Location Average Scores
- **Location Performance Bar Chart**: Recharts `BarChart` with dynamic `Cell` color coding — green (≥ 90%), primary/blue (≥ 70%), red (< 70%)
- **Trend Alert Banners**: unread `trend_alert` notifications surface as dismissable warning banners on the homepage

### Audits Management (`/admin/audits`)
- Create new audits: select Template, Location, Manager, Schedule Date/Time, Deadline Date/Time
- **Surprise Audit toggle**: marks audit as `isSurprise = true`, which changes the notification type sent to manager
- **Recurring Schedules**: `daily`, `weekly` (with `recurringDay` for day-of-week), `monthly` (with day-of-month), or `none`
- **Batch Recurring Publish**: when `repeatUntil` is set, calculates number of occurrences (daily = every day, weekly = every 7 days, monthly = every 30 days), safety-capped at 30 max instances, and publishes each as a separate audit document preserving the original duration window (`deadline - scheduledDate`)
- **Default Times from Org/Location**: form pre-fills `scheduledDate` and `deadline` from the location's `defaultStartTime`/`defaultEndTime`, falling back to org defaults
- Edit existing audits (reschedule template, location, manager, dates)
- Multi-filter: search by template title / location / status / manager (4 independent filter dropdowns)
- Audits sorted: incomplete first (by `scheduledDate` ascending), completed last (by `completedAt` descending)
- Status calculation logic: `Scheduled` (scheduledDate in future), `Pending` (past scheduledDate, not started), `In Progress`, `Deadline Hit` (past deadline, not completed), `Completed`
- On publish: notifies manager with `audit_assigned` or `surprise_audit` notification (only on first occurrence for batch)

### Templates (`/admin/templates`)
- List all active templates for the org
- **Template Builder** (`/admin/templates/new` + `/admin/templates/[id]`):
  - Add unlimited questions
  - Per-question config: `questionText`, `questionType` (`yes_no` or `rating`), `severity` (`low`, `medium`, `critical`), `requiresPhoto` toggle
  - Reorder questions up/down with smooth scroll-to-element
  - Firestore `writeBatch` atomically creates the template document and all question sub-documents in a single transaction
  - Edit existing templates (loads template + questions from Firestore sub-collection)

### Locations (`/admin/locations`)
- Create locations: `name`, `address`, `city`
- Per-location `defaultStartTime` and `defaultEndTime` (optional) — these override org defaults when scheduling audits
- Assign multiple managers to a location via a custom searchable multi-select picker (`ManagerMultiSelect`)
- Active/Inactive toggle (soft delete via `isActive` field)
- Edit location — when name changes, performs a `writeBatch` cascade update of `locationName` across `audits`, `correctiveActions`, and `flashmobAudits` collections

### Users (`/admin/users`)
- Invite new users (Manager or Auditor)
- Sets temporary password; calls `POST /api/users` which creates Firebase Auth account + injects custom JWT claims + creates Firestore user doc
- **Auditor-specific**: assign a managing manager (`managerId` field)
- **Flashmob Access toggle**: per-auditor `isFlashmobEnabled` flag controls whether that auditor can access the Flashmob feature
- Edit users: rename, change manager assignment, toggle flashmob access
- **Send Password Reset Email** button in edit dialog (triggers Firebase Auth `sendPasswordResetEmail`)
- **Disable/Enable user**: `PATCH /api/users` calls both `adminAuth.updateUser({ disabled: !isActive })` and updates Firestore `isActive` field
- **Delete user**: `DELETE /api/users` executes `adminAuth.deleteUser` + `adminDb.delete` in `Promise.all`. Admins cannot delete other admins
- Filter users by: role (Manager/Auditor), location assignment, search query

### Corrective Actions / CAPA (`/admin/corrective-actions`)
- Lists all org-wide corrective actions with parallel `getDoc` hydration of manager names
- **Three-tier sort**: Deadline (closest) → Priority (critical first) → Status (open first)
- Summary counters: Overdue count (deadline < now), Critical severity count, "48h" upcoming label
- Status filter: All, Open, In Progress, Resolved, Overdue
- **Reassign**: admin can re-assign a CA to a different manager and change its deadline
- **Review & Resolve**: when manager marks a CA as `completed`, admin can "Review" to either `resolved` (accept) or reject back to `in_progress`
- Inline photo viewer: clicking a resolution evidence photo opens a full-screen modal image viewer
- Real-time `onSnapshot` listener

### Reports (`/admin/reports`)
- Paginated list of all completed audits
- Multi-filter: by location, date range (start/end), search query
- Links to individual detailed report pages

### Flashmob (`/admin/flashmob`)
- Create mass-dispatch audit requests:
  - Select auditor + location
  - Set deadline with full date + 12-hour clock picker (hour, minute, AM/PM)
- **Active Requests tab**: shows all `published` status flashmob requests sorted by `publishedAt` descending
- **History tab**: shows completed flashmob audits sorted by `submittedAt` descending
- Cancel active request (delete from Firestore)
- Direct link to completed flashmob audit report

### Settings (`/admin/settings`)
- **Profile tab**: update display name, email; update password (requires re-authentication with current password via `EmailAuthProvider.credential`)
- **Profile photo**: upload → crop (using `react-easy-crop` + canvas `drawImage`) → upload cropped JPEG to Cloudinary → save URL to Firestore
- **Organization tab**: update org name, timezone (11 supported timezones), default start time, default end time
- **Organization logo**: same crop-upload flow as profile photo, saved to `organizations/{id}.logoUrl`
- **Remove photo/logo**: sets field to `null` in Firestore
- **Notifications tab**: per-org toggles stored in `organizations/{id}/settings/notifications`:
  - Low Score Alert (on/off)
  - Missed Audit Alert (on/off)
  - Trend Alert (on/off)
  - Corrective Overdue Alert (on/off)
  - Low Score Threshold (configurable %, default 60)
- **Danger Zone tab**: Data export (CSV), account deletion warnings
- Tab state is synced to the URL query param (`?tab=profile`) for direct linking

---

## MANAGER DASHBOARD

### Overview / Home
- **Dual-strategy location detection**: checks `assignedLocationIds` on user doc first; if empty, queries by `assignedManagerIds` array-contains AND legacy `assignedManagerId` field, deduplicates results
- **KPIs**: Assigned Locations count, Active Auditors count
- **Area Chart**: Recharts `AreaChart` showing recent audit score trend over time
- **Auditor Activity table**: per-auditor completed/pending breakdown
- **Task Priority Tabs**: "Unassigned Audits" (audits with no auditor assigned) and "Near Deadlines" (audits due soon)
- **Activity Tabs**: toggle between recent audits list and recent notifications
- **Inline CA Resolution** from the dashboard: manager can resolve a CA directly from the overview page without navigating away — includes camera capture for resolution evidence photo

### Audits (`/manager/audits`)
- View all audits for locations the manager oversees
- **Bulk Assign**: select multiple audits via checkboxes → assign all to a single auditor in one action
- Single-audit assign: select auditor from dropdown → `updateDoc` sets `assignedAuditorId` and `status: 'assigned'` → pushes `audit_assigned` notification to that auditor
- Create new audits (same form as admin, but auto-assigns `assignedManagerId = uid`)
- Recurring schedule support with `repeatUntil`
- Real-time `onSnapshot` listener on the audit list

### Calendar (`/manager/calendar`)
- Visual calendar view of scheduled and completed audits

### Corrective Actions (`/manager/corrective-actions`)
- Lists only CAs assigned to this manager (`where('assignedManagerId', '==', uid)`)
- **Tabbed view**: Open Issues vs Resolved
- Resolve a CA: add resolution note (free text) + attach resolution photos
- **In-App Camera** for resolution evidence: `getUserMedia` with `facingMode: environment` → canvas `drawImage` capture → upload to Cloudinary
- File picker fallback (for non-mobile)
- On resolve: sets `status: 'completed'`, `completedAt: serverTimestamp()`, `resolutionNote`, `resolutionPhotoUrls[]`
- Real-time `onSnapshot` listener

### Reports (`/manager/reports`)
- List of all completed audits for managed locations with date filter
- **Detailed Report View** (`/manager/reports/[auditId]`):
  - Full audit metadata (template title, location, auditor, date, GPS coordinates)
  - Final score with color-coded progress ring (green ≥ 90, primary ≥ 70, red otherwise)
  - Critical failure banner (shown if `hasCriticalFailure = true`)
  - Pass/Fail summary counts
  - Per-question breakdown: answer, notes, all attached evidence photos (click to fullscreen)
  - **Live Score Recalculation**: if `audit.scoringVersion !== SCORING_VERSION` (i.e. legacy data), re-runs `calculateAuditScore()` client-side on the stored responses before displaying
  - **PDF Export**: triggers `exportElementToPDF()` with `buildAuditPDFFilename(locationName, auditTitle)` naming pattern

### Settings (`/manager/settings`)
- Profile (name, email, password change)
- Profile photo crop + upload

---

## AUDITOR APP

### Auditor Dashboard
- Real-time `onSnapshot` on assigned audits filtered by `assignedAuditorId = uid`
- **Sorted by**: Deadline (closest first) → Status (`missed` first, then `assigned`/`in_progress`, then `completed`)
- KPIs: Completed audits count, Average score % across all completed audits
- Search filter across active assignments
- Missed audits displayed distinctly
- Completed audits history visible

### Audit Execution Engine (`/auditor/audits/[auditId]`)
- **Schedule Lock**: if `now < audit.scheduledDate`, the page immediately redirects and shows an alert — the audit cannot be started early
- Loads template questions ordered by `order` field
- Loads any pre-existing `auditResponses` for resume-ability
- **Progress Bar**: sticky header shows `Question X of N` and a smooth animated progress bar
- **Question UI**:
  - `yes_no`: large Yes/No buttons with green/red active states
  - `rating`: 1–10 numbered grid buttons with primary active state
  - Per-question severity badge (`critical`, `medium`, `low`)
  - `PHOTO REQUIRED` badge shown when `requiresPhoto = true`
- **Per-question Notes**: free-text area for observations
- **Multi-photo per question**: supports multiple evidence photos per question
- **Navigation**: Previous / Next with `canProceed` gate — next is disabled until question is answered (and photo uploaded if required)
- **In-App Camera** (`getUserMedia`):
  - Opens full-screen native camera modal
  - Front/rear camera flip (`facingMode: 'user'` ↔ `'environment'`)
  - **Mirror correction**: front-facing captures are horizontally flipped via canvas `ctx.scale(-1, 1)` to un-mirror selfie orientation
  - Corner viewfinder overlay guides
  - Capture → canvas `drawImage` → `canvas.toBlob` at `image/jpeg, 0.9` quality → streamed to `/api/upload` → Cloudinary → URL saved to response state
- **File Upload fallback**: standard `<input type="file">` for photos from device gallery
- **Save Progress**: mid-audit saves write all current responses to `auditResponses` sub-documents and sets `audit.status = 'in_progress'` via `writeBatch`
- **Unsaved Changes Guard**: `beforeunload` event listener + custom `AlertDialog` with 3 choices: "Continue Auditing", "Exit Without Saving", "Save and Leave"

### Geolocation Verification (GPS-Enforced Submission)
- On initial audit open: `AlertDialog` prompts the user to enable location access before starting
- On final submission: calls `navigator.geolocation.getCurrentPosition()` with `{ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }`
- An 8-second timeout fallback resolves with `locationCaptured: false` if permission is denied or slow
- **If location is not captured, the audit CANNOT be submitted** — the submission is aborted and a `showLocationErrorDialog` is displayed with a "Try Again" button
- On success: `latitude`, `longitude`, and `locationCaptured: true` are written into the audit document alongside the final score

### Audit Submission & Auto-CAPA Generation
- Calls `calculateAuditScore()` on all responses to produce `finalScore`, `grade`, `hasCriticalFailure`, `criticalFailureCount`, `scoringTrace`, `weightedEarned`, `weightedMax`
- Commits via `writeBatch`:
  - Each `auditResponse` document: `answer`, `score`, `notes`, `photoUrls[]`, `severity`, `isCriticalFailure`, `submittedAt`
  - **Auto-CAPA creation**: for every response where `isCriticalFailure = true`, a new `correctiveActions` document is automatically created with:
    - `description` = auditor's notes (or fallback `"Critical Failure detected: {questionText}"`)
    - `severity` = question severity
    - `status = 'open'`
    - `deadline = now + 48 hours`
    - Assigned to `audit.assignedManagerId`
  - Audit document updated: `status = 'completed'`, final score fields, GPS coordinates
- **Post-commit low-score alert**: if `scorePercentage < 60`, fires a non-blocking `fetch('/api/audit/submit-notifications', ...)` with the auditor's JWT — this runs server-side (Admin SDK) to avoid client Firestore security rule denials

### Flashmob (`/auditor/flashmob`)
- Auditor receives and responds to flashmob audit requests
- Only accessible if `user.isFlashmobEnabled = true`

### History (`/auditor/history`)
- View all past completed audits

### Settings (`/auditor/settings`)
- Profile name/email update
- Password change (requires re-authentication)
- Profile photo crop + upload

---

## BACKEND / API

### `/api/audit/submit-notifications` (POST)
- Server-side notification job for low-score + trend alerts
- Uses Firebase Admin SDK to bypass client-side Firestore security rules
- Checks if location has scored below threshold on 3+ consecutive audits → fires `trend_alert` notification

### `/api/cron/check-missed-audits` (GET, Vercel Cron)
- Queries for all audits in `['published', 'assigned', 'in_progress']` status with `deadline < now`
- Marks each as `status: 'missed'`
- Sends `audit_missed` notification to both the `assignedManagerId` AND all Admins in the organization
- **CA Deadline Reminders**: queries for open CAs with `deadline > now AND deadline <= now + 6 hours`, sends `corrective_action` notification once (idempotency flag `reminderSent: true` prevents duplicate reminders)

### `/api/cron/generate-recurring-audits` (GET, Vercel Cron)
- Processes completed recurring audits (`nextInstanceGenerated: false`)
- Calculates next `scheduledDate` for `daily`, `weekly` (with `recurringDay`), and `monthly` frequencies
- Inherits original duration (`deadline - scheduledDate`) for the new instance
- Creates audit + manager notification
- Sets `nextInstanceGenerated: true` on original (idempotency)

### `/api/upload` (POST)
- Requires authenticated caller (any role)
- Streams the uploaded file as a Node.js `Readable` stream directly to `cloudinary.uploader.upload_stream` — no temp disk writes
- Returns `secure_url`

### `/api/users` (POST / PATCH / DELETE)
- Admin-only (verified via `getCallerInfo` + role check)
- **POST**: Creates Firebase Auth user, sets custom JWT claims (`role`, `organizationId`), creates Firestore user document
- **PATCH**: Updates Auth displayName, re-sets custom claims if role changes, updates Firestore doc. Supports: `name`, `role`, `managerId`, `isFlashmobEnabled`, `isActive` (which also toggles `adminAuth.updateUser({ disabled })`)
- **DELETE**: Parallel `adminAuth.deleteUser` + `adminDb.delete`. Prevents deleting ADMIN accounts

### `/api/auth/*`
- Auth-related server routes (token verification, session management)

### `/api/leads`
- Lead capture from the public marketing website

### `/api/health`
- Health check endpoint

---

## SCORING ENGINE (`src/lib/scoring.ts`)
- Question types: `yes_no`, `rating_10`, `rating`
- Severity weights: `low (1×)`, `medium (2×)`, `critical (5×)`
- `yes_no`: Yes = 1.0 normalized, No = 0.0; critical No = instant `isCriticalFailure`
- `rating/rating_10`: value clamped 0–10, normalized to `rating / 10`; critical question with rating < 6 = `isCriticalFailure`
- Final score = `(weightedEarned / weightedMax) * 100`, rounded
- Grades: `critical_fail` (any critical failure) → `excellent` (≥90) → `good` (≥75) → `needs_improvement` (≥60) → `fail` (<60)
- Returns full `ScoreTraceItem[]` trace with per-question breakdown
- Versioned via `SCORING_VERSION = 'v2-weighted-critical-threshold-6'`; report pages detect version mismatch and re-score legacy data on the fly

---

## PDF EXPORT (`src/lib/pdf-export.ts`)
- Off-screen DOM clone at fixed `1200px` width
- Strips `.report-exclude-from-pdf`, `data-html2canvas-ignore`, and specific text-matched nodes
- `html2canvas-pro` at `2.5×` scale
- `jsPDF` A4 multi-page slicing via `while (heightLeft > 0)` loop
- File named `{Location}-{Template}-{ddMMMyyy}.pdf`

---

## PUBLIC WEBSITE

### Content
- MDX-powered blog, glossary, solutions, use-cases, compare pages
- `reading-time` package used to estimate read time for blog posts
- `rehype-autolink-headings` + `rehype-slug` for in-page anchor links

### Analytics & Consent
- Google Tag Manager via `PublicGtm.tsx`
- Custom `dataLayer` push events (`dataLayer.ts`)
- Full GDPR/CCPA consent banner with 3 categories: Strictly Necessary (always-on), Analytics, Marketing
- `ConsentProvider` stores preferences in `localStorage`
- Focus trap + keyboard navigation (`Escape` to close, `Tab`/`Shift+Tab` cycling) inside the modal
- Banner never shows on `/dashboard` or `/login` routes

### Booking
- `@calcom/embed-react` for in-app demo scheduling

### Animations
- `IntersectionObserver` with `threshold: 0.01` for scroll-reveal animations
- Stagger delay formula: `(childIndex % 4) * 0.08s` for grid children
- `MutationObserver` re-runs reveal setup on React DOM mutations
- Lenis smooth-scroll, Framer Motion, GSAP for premium animation layers
