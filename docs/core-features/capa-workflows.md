# Automated Corrective Action (CAPA) Workflows

Audiment's **CAPA (Corrective and Preventive Action)** engine automatically turns critical audit failures into trackable, SLA-bound resolution tasks.

---

## ⚡ The Automated CAPA Lifecycle

```
[ Audit Submitted ] ---> ( Is Severity == "critical" AND Failed? )
                                  |
                                  +--> YES --> [ Auto-Create CAPA Document ]
                                                    | (SLA: 48-Hour Deadline)
                                                    v
                                               [ Assign to Outlet Manager ]
                                                    |
                                                    v
                                               [ Manager Resolves with ]
                                               [ Mandatory Note + Photo]
                                                    |
                                                    v
                                               [ Status: "resolved" ]
```

---

## 📋 Trigger & Auto-Generation Rules

When an auditor submits an audit, the backend evaluates every response against the scoring rules:

* **Trigger Condition:** Any question with `severity = "critical"` that receives:
  * An answer of `"No"` (for `yes_no` questions), OR
  * A rating score of `< 6` (for `rating_10` questions).
* **Action:** System auto-creates a document in `correctiveActions`:
  * `status`: `"open"`
  * `assignedManagerId`: Manager assigned to the outlet location.
  * `deadline`: Automatically set to **48 hours** from audit completion.
  * `severity`: `"critical"`

---

## 🛠️ Manager Resolution Workflow

Managers monitor open items in the Manager CAPA Queue (`/dashboard/manager/corrective-actions`):

### Resolution Enforcements:
1. **Mandatory Resolution Note:** Manager must detail the exact fix applied (e.g. *"Walk-in cooler compressor replaced and temperature verified at 3.2°C"*).
2. **Mandatory Photo Proof:** Manager must upload photo evidence of the rectified condition.
3. **SLA Countdown:** UI displays an active countdown badge (e.g. `22h remaining`). Items past 48 hours show a red `OVERDUE` badge.

---

## ⏰ Escalations & Deadline Reminders

Background cron jobs (`/api/cron/check-missed-audits`) run hourly:
* When a CAPA item deadline is **within 6 hours**, an urgent in-app notification is sent to the Manager.
* `lastDeadlineReminderSentAt` is updated to prevent spamming duplicate reminders.
* Unresolved items after 48 hours trigger an alert in the Admin Dashboard.
