# System Overview & Architecture

Audiment is architected as a high-performance Next.js 16 App Router web application integrated with Firebase backend services and Cloudinary media processing.

---

## 🏛️ High-Level System Architecture

```
+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|   +--------------------------+  +--------------------------+  +--------------+  |
|   | Admin Web Dashboard      |  | Manager Web Dashboard    |  | Auditor PWA  |  |
|   | (Desktop Optimised)      |  | (Desktop/Tablet)         |  | (Mobile)     |  |
|   +--------------------------+  +--------------------------+  +--------------+  |
+----------------------------------------+----------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                                NEXT.JS ROUTER & API                             |
|  +---------------------------------------------------------------------------+  |
|  | Middleware: Auth verification, Role routing & Organization tenant isolation|  |
|  +---------------------------------------------------------------------------+  |
|  | React 19 Server Components | Client State Hooks | API Route Handlers      |  |
|  +---------------------------------------------------------------------------+  |
+----------------------------------------+----------------------------------------+
                                         |
            +----------------------------+----------------------------+
            |                                                         |
            v                                                         v
+-----------------------+                                 +-----------------------+
|  FIREBASE SERVICES    |                                 |  MEDIA & REPORTING    |
| - Firestore NoSQL DB  |                                 | - Cloudinary API      |
| - Firebase Auth       |                                 | - HLS Video Stream    |
| - Security Rules      |                                 | - jsPDF PDF Engine    |
+-----------------------+                                 +-----------------------+
```

---

## 📂 Application Directory Layout

The application codebase resides in `src/`:

```
src/
├── app/
│   ├── (app)/                       # Authenticated Role Dashboards
│   │   ├── dashboard/
│   │   │   ├── admin/              # Admin Blueprint Builder, Nodes, Users, Flashmob
│   │   │   ├── manager/            # Manager Audit Queue, Auditor Assignment, CAPA Queue
│   │   │   └── auditor/            # Auditor Inspection Execution & Flashmob Studio
│   │   ├── login/                  # Multi-tenant Auth Entry Point
│   │   └── layout.tsx              # Authenticated App Shell & Nav
│   ├── (website)/                   # Public Marketing & Solution Pages
│   └── api/                         # Backend API Handlers
│       └── cron/                    # Vercel Cron Escalation APIs
├── components/                      # UI Component Architecture
│   ├── admin/                      # TemplateBuilder, NodeManager, MemberDirectory
│   ├── app-ui/                     # Dashboard Shell, Navigation, Cards, Tables
│   └── ui/                         # Shadcn primitive UI elements
└── lib/                             # Core Domain & Scoring Engine
    ├── firebase.ts                 # Client SDK Initializer
    ├── firebaseAdmin.ts            # Server Admin SDK Initializer
    └── scoring.ts                  # Centralized Audit Scoring Engine
```

---

## 🔄 Core Data Flow Pipelines

### 1. Audit Publishing to Execution Pipeline
1. **Admin** creates an audit blueprint template (`auditTemplates`) with weighted questions and photo rules.
2. **Admin** publishes an instance of the blueprint (`audits`) assigned to a branch (`locations`).
3. **Manager** receives a notification, accesses the Manager Queue, and delegates the audit to a specific **Auditor**.
4. **Auditor** receives task notification, executes step-by-step audit, attaches mandatory photos, and captures device GPS.
5. Upon submission, **System (`src/lib/scoring.ts`)** calculates total score, grade, and checks critical failure conditions.

### 2. Automated CAPA Resolution Pipeline
1. If any question with `severity = "critical"` fails, the system auto-generates a document in `correctiveActions`.
2. The item is auto-assigned to the location's assigned **Manager** with a 48-hour deadline SLA.
3. The Manager inspects the failed question, takes corrective action, uploads photographic proof, and marks it resolved.
4. **Admin** receives real-time update in the org CAPA Queue.

---

## ⚡ Key Architectural Decisions

* **Single Codebase Model:** Unified Next.js codebase powering public marketing pages, API routes, and 3 distinct role-based web dashboards.
* **Server-Driven Multi-Tenancy:** All queries automatically bind to `organizationId` from authenticated session claims, guaranteeing data isolation.
* **Deterministic Scoring Model:** All scoring calculations MUST execute through `src/lib/scoring.ts` to prevent UI/report math divergence.
* **Mobile-First Auditor UI:** The auditor interface is optimized for touchscreen phones, touch targets, offline draft recovery, and native media uploads.
