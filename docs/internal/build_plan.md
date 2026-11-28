# Audiment – Build Plan

## How to use this file
Update the status of each block as you build. 
Status options: NOT STARTED | IN PROGRESS | COMPLETE

---

## Block 1 – Project Setup & Authentication
Status: COMPLETE

- Initialise Next.js project with Tailwind CSS
- Connect Firebase to Next.js
- Set up environment variables
- Build /login page (single entry point for all roles)
- Implement Firebase Auth email/password login
- Read user role from Firestore on login
- Implement role-based routing middleware:
  - admin → /dashboard/admin
  - manager → /dashboard/manager
  - auditor → /dashboard/auditor
- Build basic shell layout for each dashboard (placeholder screens)
- Implement logout functionality

---

## Block 2 – Database Setup & Admin: User Management
Status: COMPLETE

- Set up all Firestore collections as per DATABASE.md
- Configure Firestore security rules
- Admin can create manager accounts
- Admin can create auditor accounts
- Admin can assign auditors to managers
- Admin can view all users in a list
- Admin can deactivate a user

---

## Block 3 – Admin: Location Management
Status: COMPLETE

- Admin can create locations (branch/outlet)
- Admin can assign a manager to a location
- Admin can view all locations in a list
- Admin can edit or deactivate a location

---

## Block 4 – Admin: Audit Template Builder
Status: COMPLETE

- Admin can create an audit template with title and category
- Admin can add questions to a template
- Each question has: text, type (yes/no or rating), severity, requiresPhoto toggle
- Admin can reorder questions
- Admin can edit or deactivate a template
- Pre-built FSSAI templates loaded by default

---

## Block 5 – Audit Publishing & Assignment
Status: NOT STARTED

- Admin can publish an audit from a template to a specific location
- Admin can set deadline and mark as surprise audit
- Manager receives notification when audit is published
- Manager can assign audit to one of their auditors
- Auditor receives notification when audit is assigned
- Audit status updates automatically through the workflow

---

## Block 6 – Auditor Interface & Audit Taking
Status: NOT STARTED

- Auditor sees list of assigned audits on their dashboard
- Auditor opens an audit and sees questions one at a time
- Yes/No questions show toggle buttons
- Rating questions show a 1-10 slider or selector
- Auditor can attach photos to any question
- Geo-tag and timestamp captured automatically on submission
- Auditor can save progress and resume later (offline sync)
- Audit marked as completed on final submission
- Score calculated automatically on completion

---

## Block 7 – Scoring Engine
Status: NOT STARTED

- Yes/No questions: yes = full score, no = 0
- Rating questions: score = answer value out of 10
- Each score multiplied by severity weight:
  - low = 1x
  - medium = 1.5x
  - critical = 2x
- Final score expressed as percentage of maximum possible
- Score stored on audit document on completion

---

## Block 8 – Reporting & Dashboards
Status: NOT STARTED

- Admin dashboard: overview of all locations, recent audits, open corrective actions, trend graph
- Manager dashboard: assigned locations, recent audit scores, auditor activity
- Auditor dashboard: personal performance, completed vs missed audits
- Cross-branch comparison report for admin
- Daily and monthly report views
- PDF export for completed audit reports

---

## Block 9 – Corrective Action Tracking
Status: NOT STARTED

- Auto-create corrective action when critical question is failed
- Assign corrective action to location manager
- Manager can update status and add resolution note and photo
- Admin can view all open corrective actions across all locations
- Corrective action closes only when marked resolved

---

## Block 10 – Notifications & Escalation Alerts
Status: NOT STARTED

- Push notification when audit is assigned (auditor)
- Push notification when audit is published (manager)
- Alert when audit is missed past deadline
- Alert when score falls below threshold set by admin
- Trend alert when branch score drops across consecutive audits
- Notification centre in dashboard for all roles

---

## Block 11 – Flashmob Audit
Status: NOT STARTED

- Special auditor accounts flagged with flashmob access
- Flashmob section visible only to authorised auditors
- Auditor can record 20-second video inside browser
- Auditor reviews video before submitting
- Auditor attaches selfie and name
- Geo-tag and timestamp captured on submission
- Visible only to admin and specifically authorised viewers

---

## Block 12 – Surprise Audit & Scheduling
Status: NOT STARTED

- Admin can mark any published audit as surprise
- Surprise audits have a same-day deadline
- Manager calendar view showing upcoming scheduled audits
- Recurring audit scheduling (e.g. every Monday)
- Surprise audits not visible to manager until published

---

## Block 13 – Landing Page
Status: COMPLETE

- Public marketing page for Audiment
- Sections: hero, problem, solution, features, pricing, CTA
- Login button routes to /login
- Fully responsive

---

## Notes
- Always read all files in _docs before starting a session
- Build one block at a time, never skip ahead
- Test each block fully before moving to the next
- Update status in this file after each block is complete