# Admin Operational Handbook

The **Admin Dashboard** (`/dashboard/admin`) gives organization owners and operations directors full control over master templates, outlet nodes, user directories, and compliance health.

---

## 🛠️ Key Operational Workflows

```
+---------------------------------------------------------------------------------+
|                               ADMIN WORKFLOWS                                   |
|                                                                                 |
| 1. Build Template --> 2. Add Outlets --> 3. Add Users --> 4. Publish Audit       |
|    (Blueprint)          (Nodes)           (Directory)     (Set Deadline)        |
+---------------------------------------------------------------------------------+
```

### 1. Creating Master Audit Blueprints
* Navigate to **Templates > Create Template**.
* Enter template title, category (e.g. Hygiene, Safety), and description.
* Add questions, select question type (`yes_no` or `rating_10`), set severity weight (`low`, `medium`, `critical`), and toggle `requiresPhoto`.
* Click **Load FSSAI Defaults** to auto-populate standard food safety criteria.

### 2. Managing Locations (Nodes)
* Navigate to **Locations > Add Location**.
* Input outlet name, street address, city, and GPS coordinates.
* Assign a primary Manager to the location.

### 3. User Lifecycle & Password Resets
* Navigate to **Users > Add User**.
* Select role (`Admin`, `Manager`, or `Auditor`) and assign manager/outlet associations.
* **Password Reset:** Click **Send Reset Email** on any user row to trigger a self-service password reset email directly from Firebase Auth.

### 4. Publishing Scheduled & Surprise Audits
* Select a template and target location.
* Set audit completion deadline.
* Toggle **Surprise Audit** if you wish to hide the audit from the outlet manager's calendar until published.
