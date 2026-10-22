# Audiment UI Variant Decision System — Architecture & Documentation

**Location**: `docs/ui-inventory/decisions/`  
**Data File**: [`docs/ui-inventory/decisions/variant_decisions.json`](file:///Users/sanskar/Documents/Asellus/Audiment/docs/ui-inventory/decisions/variant_decisions.json)  
**API Endpoint**: `/api/ui-lab/decisions` (`src/app/api/ui-lab/decisions/route.ts`)  
**Scope**: Decision recording and review only — **zero production UI changes**.

---

## 1. Storage Mechanism & Persistence Architecture

Decisions are stored in a version-controlled, project-local file:
`docs/ui-inventory/decisions/variant_decisions.json`

### Why this approach was chosen:
1. **Survives browser reloads, dev-server restarts, and cache invalidation**: Because decisions are written directly to disk via the local Next.js API endpoint, they are never lost when the dev server is restarted or browser local storage is cleared.
2. **Version control friendly**: Developers can commit decisions to git alongside documentation, allowing review intent to be shared across pairing sessions.
3. **Zero database dependency**: Does not require Firebase or external databases.

---

## 2. Decision Record Schema

Decisions are keyed by the stable **Source Variant ID** (`sourceVariantId`):

```json
{
  "decisions": {
    "VAR-SEARCH-LG": {
      "decisionId": "DEC-VAR-SEARCH-LG",
      "familyId": "FAM-SEARCH",
      "sourceVariantId": "VAR-SEARCH-LG",
      "decisionType": "merge",
      "targetVariantId": "VAR-SEARCH-ICON-INPUT",
      "notes": "Standardize on standard icon search input with responsive fluid width.",
      "updatedAt": "2026-10-13T04:45:58.897Z",
      "status": "recorded",
      "isImplemented": false
    }
  }
}
```

### Supported Decision Types:
- `merge`: The variant is planned to be merged into a surviving target variant in the same family (`VAR-XXX -> VAR-YYY`).
- `keep_separate`: The variant is intentionally designated to stay distinct (e.g. `.apple-press` tactile button vs standard button).
- `decide_later`: Left unresolved for future review.

---

## 3. Conflict & Integrity Safeguards (Implemented)

1. **Self-Merge Prevention**: A variant is prohibited from merging into itself. The UI excludes the source variant from the target selector, and the API rejects any attempt with HTTP 400.
2. **Circular Loop Detection**: If Variant A is marked to merge into Variant B, and Variant B is marked to merge into Variant A, a persistent red alert banner warns: `Direct circular merge loop detected: VAR-A <-> VAR-B`.
3. **Transitive Chain Detection**: If Variant A merges into Variant B, and Variant B merges into Variant C, the system highlights a warning so developers can resolve the intermediate step.
4. **Stable ID Referencing**: Decisions bind directly to canonical variant IDs (e.g., `VAR-SEARCH-LG`), not array indexes or display orders.
5. **Confirmation on Deletion**: Removing a decision requires confirmation to avoid accidental loss.

---

## 4. Distinction Between Decision & Implementation

All decisions recorded in the UI Lab are explicitly marked with `isImplemented: false` and labeled as **"Planned Decision"**.
Recording a decision does **NOT**:
- Modify any production component.
- Standardize CSS or design tokens.
- Alter database models or API routes.
- Change route configurations.
