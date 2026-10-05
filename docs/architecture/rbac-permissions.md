# Role-Based Access Control (RBAC) & Security Architecture

Audiment enforces strict multi-tenant data isolation and role-based permissions across all system interfaces and Firestore database operations.

---

## 🔒 Multi-Tenant Data Isolation Model

Every record in Audiment is scoped to an `organizationId`. A user belonging to Organization A can **never** query, view, or mutate documents belonging to Organization B.

Data isolation is enforced at two layers:
1. **Next.js Middleware & API Layer:** Verifies user role and `organizationId` claims before fetching backend records.
2. **Firestore Security Rules:** Server-side database enforcement that evaluates `request.auth.token.organizationId == resource.data.organizationId`.

---

## 👥 Role Matrix & Scope

```
+-----------------------------------------------------------------------------------+
| USER ROLES                                                                        |
+-------------------+---------------------------------------------------------------+
| Admin (Owner)     | Multi-branch org scope. Full administrative & reporting power.|
| Manager           | Branch-level scope. Manages assigned outlets & auditors.     |
| Auditor           | Inspection-level scope. Executes assigned audit tasks.        |
+-------------------+---------------------------------------------------------------+
```

### Detailed Capability Matrix

| Feature / Operational Capability | Admin | Manager | Auditor |
| :--- | :---: | :---: | :---: |
| **Manage Organization Settings** | ✅ | ❌ | ❌ |
| **Create / Edit Master Blueprints** | ✅ | ❌ | ❌ |
| **Create / Manage Locations (Nodes)** | ✅ | ❌ | ❌ |
| **Manage Member Directory (Users & Reset Passwords)** | ✅ | ❌ | ❌ |
| **Publish Regular & Surprise Audits** | ✅ | ❌ | ❌ |
| **View Org Compliance Health & Regional Analytics** | ✅ | ❌ | ❌ |
| **Review Flashmob Video Recordings & Selfies** | ✅ | Restricted* | ❌ |
| **Assign Audits to Field Auditors** | ✅ | ✅ | ❌ |
| **View Assigned Location Audits Queue** | ✅ | ✅ | ❌ |
| **Resolve Corrective Actions (CAPA) with Proof** | ✅ | ✅ | ❌ |
| **View Manager Calendar & Deadlines** | ✅ | ✅ | ❌ |
| **Execute Step-by-Step Mobile Inspections** | ❌ | ❌ | ✅ |
| **Submit Audit Answers & Attach Photos** | ❌ | ❌ | ✅ |
| **Initiate Stealth Flashmob Verification** | ❌ | ❌ | ✅ (If flagged) |

> *\*Flashmob recordings are visible only to Admins and Managers explicitly included in the document's `visibleTo` array.*

---

## 🛡️ Firestore Security Rules Logic

Below is a conceptual representation of Audiment's Firestore security rules enforcement (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isSameOrg(orgId) {
      return isAuthenticated() && getUserData().organizationId == orgId;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }

    // Rules for Audits
    match /audits/{auditId} {
      allow read: if isAuthenticated() && isSameOrg(resource.data.organizationId);
      allow create, update: if isAdmin();
      allow delete: if false; // Audit logs are immutable
    }

    // Rules for Audit Responses
    match /auditResponses/{responseId} {
      allow read: if isAuthenticated() && isSameOrg(resource.data.organizationId);
      allow create: if isAuthenticated() && getUserData().role == 'auditor';
      allow update, delete: if false; // Audit evidence cannot be altered after submission
    }
  }
}
```

---

## 🚪 Route Guard & Navigation Middleware

Next.js Middleware inspects authentication tokens on every route request:
* If unauthenticated, requests to `/dashboard/*` redirect to `/login`.
* If an Auditor attempts to access `/dashboard/admin`, Middleware redirects them to `/dashboard/auditor`.
* If a Manager attempts to access `/dashboard/admin`, Middleware redirects them to `/dashboard/manager`.
