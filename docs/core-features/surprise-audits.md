# Surprise Audits & Scheduling Engine

Surprise audits create unpredictability across outlet networks, preventing branch managers and staff from "prepping" only when expecting inspectors.

---

## 🎯 Surprise Audits Mechanics

### Key Rules:
1. **Admin Flag (`isSurprise: true`):** When publishing an audit blueprint to a location, the Admin can toggle `isSurprise`.
2. **Hidden Manager Schedule:** Surprise audits are **hidden from manager calendar views** until published.
3. **Same-Day Deadlines:** Surprise audits enforce a short same-day deadline (typically 4–8 hours from publication).
4. **Immediate Auditor Dispatch:** Upon publication, the system immediately notifies field auditors assigned to the target branch.

---

## 📅 Scheduled & Recurring Audits

For standard compliance routines (e.g. weekly hygiene audits, monthly inventory checks), Audiment supports automated scheduling rules:

* **Frequency Rules:** Weekly (e.g. Every Monday at 08:00 AM), Bi-weekly, or Monthly.
* **Auto-Publish Engine:** Scheduled tasks create new `audits` documents automatically on the specified execution date.
