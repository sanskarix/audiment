# Blueprint Builder & FSSAI Template Engine

The **Blueprint Builder** (`src/components/admin/TemplateBuilder.tsx`) is the central tool used by Admins to author, structure, and configure audit templates across an organization.

---

## ⚙️ Core Blueprint Builder Features

```
+---------------------------------------------------------------------------------+
|                            BLUEPRINT BUILDER UI                                 |
|                                                                                 |
| Template Metadata: Title, Category (Hygiene, Safety, Inventory), Description    |
|                                                                                 |
| Questions List (Drag-and-Drop Order):                                          |
| +-----------------------------------------------------------------------------+ |
| | Question Text: "Are all raw meats stored below 4°C?"                        | |
| | Type: [ Yes/No | Rating (1-10) ]   Severity: [ Low | Medium | Critical ] | |
| | [x] Enforce Photo Evidence (requiresPhoto)                                 | |
| +-----------------------------------------------------------------------------+ |
|                                                                                 |
| Action Buttons: [ Add Question ] [ Load FSSAI Defaults ] [ Save Template ]     |
+---------------------------------------------------------------------------------+
```

### Key Configurations per Question:
1. **Question Text:** Clear operational criteria to inspect.
2. **Question Type:**
   * `yes_no` (Binary compliance check: Yes = 1.0, No = 0.0).
   * `rating_10` (Numeric compliance check: 1 to 10 scale).
3. **Severity Weighting:**
   * `low` (Baseline influence, weight = 1).
   * `medium` (Moderate influence, weight = 2).
   * `critical` (High influence, weight = 5. Triggers auto-CAPA and grade overrides on failure).
4. **Photo Enforcement Toggle (`requiresPhoto`):**
   * When enabled, the field auditor **cannot submit** the audit without uploading live camera evidence for this question.

---

## 🍲 FSSAI One-Click Template Loader

Audiment includes a built-in pre-configured **FSSAI (Food Safety and Standards Authority of India)** compliance loader. With a single click in the Blueprint Builder, Admins can populate a standard FSSAI Food Safety Audit template containing pre-weighted questions:

| FSSAI Question Criteria | Type | Severity | Photo Required |
| :--- | :---: | :---: | :---: |
| *Walk-in cooler temperature maintained at <= 4°C?* | `yes_no` | `critical` | **Yes** |
| *Valid FSSAI license displayed prominently at outlet?* | `yes_no` | `critical` | **Yes** |
| *Staff wearing clean aprons, hairnets, and gloves?* | `rating_10` | `medium` | **Yes** |
| *Raw and cooked food items stored in separate shelves?* | `yes_no` | `critical` | **Yes** |
| *Pest control records updated within the last 30 days?* | `yes_no` | `medium` | No |
| *Handwashing station equipped with soap and running water?* | `yes_no` | `critical` | **Yes** |

---

## 💾 Firestore Storage Structure

Audit templates are saved in the `auditTemplates` collection with nested subcollections for questions:

```
auditTemplates/{templateId}
  ├── title: "FSSAI Food Safety Audit"
  ├── category: "hygiene"
  ├── isActive: true
  ├── createdBy: "admin_uid_123"
  └── questions/{questionId}
        ├── questionText: "Walk-in cooler temperature maintained at <= 4°C?"
        ├── questionType: "yes_no"
        ├── severity: "critical"
        ├── requiresPhoto: true
        └── order: 1
```
