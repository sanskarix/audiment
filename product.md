# Audiment Product Documentation

## 1. Product Vision & Value Proposition
Audiment is an enterprise-grade compliance and operational audit platform designed to ensure quality, safety, and brand standards across distributed locations. It bridges the gap between field-level data collection and high-level management oversight through high-trust evidence (photo/video), automated resolution workflows, and real-time intelligence.

---

## 2. Technological Foundation
*   **Core Architecture**: Next.js 16 (App Router) with React 19.
*   **Database & Auth**: Google Firebase (Firestore for real-time data, Firebase Auth for identity).
*   **Styling & UI**: Tailwind CSS 4 with Shadcn UI components and custom Glassmorphism aesthetics.
*   **Animations**: Framer Motion and Tw-animate for smooth transitions and high-end feel.
*   **Media Pipeline**: Cloudinary integration for image/video hosting and HLS streaming support.
*   **Analytics**: Recharts for interactive, role-specific data visualization.
*   **Documentation & Reporting**: jsPDF and html2canvas with custom CSS injection for high-fidelity PDF exports.

---

## 3. Core Systems & Architecture

### Role-Based Access Control (RBAC)
The system operates on a strict three-tier hierarchy isolated by `organizationId`:
*   **Admin**: Total control over blueprints, nodes, users, and cross-region intelligence.
*   **Manager**: Accountable for specific locations (Nodes), supervision of auditors, and resolution of issues.
*   **Auditor**: Field agents responsible for high-trust data collection and flash verification.

### Automated Alerting & Intelligence
*   **Low Score Alerts**: Instant notification to managers and admins if an audit falls below 60%.
*   **Trend Detection**: System-level monitoring that triggers a "Trend Alert" if a location scores poorly on 3 consecutive audits.
*   **Auto-Corrective Action Loop**: Critical failed questions automatically generate a resolution task for managers with a 48-hour SLA.

### Media & Evidence Pipeline
*   **Cloudinary Integration**: Handles multipart uploads for audit proof, resolution proof, and flashmob videos.
*   **Photo Enforcement**: Question-level settings that block audit progression unless photo evidence is provided.

---

## 4. End-to-End Product Workflows

### The Audit Lifecycle
1.  **Blueprint Creation**: Admin builds a standardized framework (questions, scoring, severity).
2.  **Node Definition**: Admin defines a location and assigns managers.
3.  **Assignment**: Audits are scheduled and assigned to auditors.
4.  **Execution**: Auditor performs the audit, providing photo/note evidence per question.
5.  **Intelligence Capture**: System calculates scores, triggers alerts, and geo-tags the auditor's location.
6.  **Corrective Loop**: Managers resolve any "open" issues with mandatory notes and proof.
7.  **Final Insight**: Detailed reports generated and exported as PDF for stakeholders.

### The Flash Verification (Flashmob) Loop
1.  **Selection**: Auditor selects a location for verification.
2.  **Surroundings Check**: Auditor records 20 seconds of environmental video.
3.  **Identity Verification**: Circular "Face Guide" viewfinder captures a verified selfie.
4.  **Submission**: Recorded data is geo-tagged and uploaded for admin review.

---

## 5. User-Role Deep Dives

### Admin: The Governance Engine
*   **Blueprint Builder**: Framework for creating "Audit Blueprints" with scoring logic and FSSAI (hygiene) defaults.
*   **Organization Vitals**: Top-level dashboard monitoring "Compliance Health" and regional performance charts.
*   **Member Directory**: Central hub for user lifecycle management (Auth/DB syncing).
*   **Node Management**: Configuring organizational geography and management assignments.

### Manager: The Resolution Hub
*   **Operational Overview**: Tracking "Active Auditors" and "Managed Locations."
*   **Resolution Dashboard**: A queue of "Corrective Actions" requiring immediate fix.
*   **Evidence Collection**: Mandatory note and photo upload when resolving issues.
*   **Performance Trends**: Area charts tracking location scores over time.

### Auditor: The Evidence Tool
*   **Mobile-Optimized Execution**: Step-by-step audit interface with progress tracking.
*   **Resume Capability**: Ability to save progress and return to in-progress audits.
*   **Flash Audit**: A specialized high-speed multi-stage verification wizard.

---

## 6. Macro & Micro Feature Inventory

### Macro Features
*   **Dynamic Charting**: Score-based color-coding (Success/Warning/Critical) in all lists and charts.
*   **FSSAI Compliance Loader**: One-click configuration for standard hygiene/safety audits.
*   **PDF Export Engine**: Proprietary logic to convert complex, dynamic UI into print-safe documents.
*   **Location Filtering**: Drill-down capabilities across the entire platform.

### Micro Features (The "Polish")
*   **Dynamic Headings**: Subheaders that adapt to provide context-aware, action-oriented instructions.
*   **Skeleton Loading System**: Custom-designed placeholders for every data-heavy component.
*   **Smart Geo-Tagging**: 5-second location capture with fallback logic for connectivity issues.
*   **Video Countdown UI**: Real-time timer and "REC" animations during flash audits.
*   **Abort Protection**: Guardrails to prevent data loss when leaving an active audit.
*   **Interactive Badges**: Small status chips with role-specific iconography.
*   **Photo Preview/Management**: Inline carousels for reviewing and deleting evidence before submission.
*   **Password Self-Service**: Admins can trigger reset emails to users directly from the directory.

---

## 7. System Details & Security
*   **Data Integrity**: Firestore Security Rules enforce organization-level isolation and role-specific read/write permissions.
*   **MIME Support**: Flashmob recording supports multiple candidate types (WebM/MP4) for maximum browser compatibility.
*   **CSS Stability**: Low-level CSS stripping in report generation to ensure 100% PDF rendering compatibility.
