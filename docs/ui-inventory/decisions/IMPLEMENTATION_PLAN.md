# Audiment UI Variant Standardization — Future System Specification Plan

**Status**: `design_decision_recorded_pending_system_definition`  
**Governing Workflow**:  
`Current UI inventory → complete variant decisions → define universal Audiment application design system → build visual UI lab for approved system → map all existing UI implementations to new system → implement ONLY after explicit user approval.`

> [!IMPORTANT]
> **Zero Implementation Authorization**: This document does NOT authorize code modifications. It records the user's intent and architectural preferences for the future Audiment application design system (excluding the marketing website). No production components, styles, imports, or workflows are being altered.

---

## 1. Recorded Variant Design Decisions (28 Total)

### A. Merges Planned for Universal System Definition (8 Decisions)
1. **`VAR-BTN-SETTINGS-NAV` &rarr; `VAR-BTN-PRIMARY`**
   - **Target**: Consolidate `.settings-nav-btn` into the universal Action Button specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 2 occurrences in Admin and Manager settings.

2. **`VAR-TBL-REPORT` &rarr; `VAR-TBL-STANDARD`**
   - **Target**: Standardize report summary tables into the universal Entity Data Table specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 2 occurrences in Admin and Manager reports.

3. **`VAR-TBL-USERS` &rarr; `VAR-TBL-STANDARD`**
   - **Target**: Standardize user directory tables into the universal Entity Data Table specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 1 occurrence in Admin users.

4. **`VAR-INP-TEXTAREA` &rarr; `VAR-INP-TEXT`**
   - **Target**: Standardize textarea border radii, focus ring treatment, and typography to match the universal Text Input field specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 7 occurrences across audit observation and CAPA forms.

5. **`VAR-SEL-DROPDOWN-MENU` &rarr; `VAR-SEL-FORM-PICKER`**
   - **Target**: Unify context action menus with the universal Select & Picker specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 12 occurrences across dashboard portals.

6. **`VAR-MOD-ALERT` &rarr; `VAR-MOD-MODAL`**
   - **Target**: Standardize confirmation alerts into the universal Interactive Modal specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 4 occurrences.

7. **`VAR-MOD-SHEET` &rarr; `VAR-MOD-MODAL`**
   - **Target**: Standardize slide-over sheet containers to share the universal Modal typography and action footer conventions.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 4 occurrences.

8. **`VAR-NAV-SEGMENT-PILL` &rarr; `VAR-NAV-UNDERLINE-TAB`**
   - **Target**: Standardize navigation switchers into the universal Underline Tab Strip specification.
   - **Status**: `design_decision_recorded_pending_system_definition` (`isImplemented: false`)
   - **Affected Usages**: 1 occurrence.

---

### B. Distinct Variants to Keep Separate (20 Decisions)
Each of the following variants has been explicitly marked to remain distinct within the future design system:
- `VAR-SEARCH-ICON-INPUT` (Standard Icon Search Bar)
- `VAR-FILTER-SELECT-DROPDOWN` (Select Dropdown Filter)
- `VAR-BTN-PRIMARY` (Primary Solid Button)
- `VAR-BTN-OUTLINE` (Outline Bordered Button)
- `VAR-BTN-GHOST` (Ghost Button)
- `VAR-BTN-FILTER-TOOLBAR` (Filter Toolbar Button `.filter-btn`)
- `VAR-TBL-STANDARD` (Standard Entity Data Table)
- `VAR-BDG-COMPLETED` (Audit Completed Badge `.badge-completed`)
- `VAR-BDG-INFORMATIONAL` (Generic Informational Tag)
- `VAR-BDG-IN-PROGRESS` (In Progress Badge `.badge-in-progress`)
- `VAR-INP-TEXT` (Standard Text Input Field)
- `VAR-SEL-FORM-PICKER` (Form Select Picker)
- `VAR-CRD-SURFACE` (Standard Card Container)
- `VAR-CRD-KPI-HERO` (Hero KPI Stat Display `.stat-number`)
- `VAR-MOD-MODAL` (Standard Interactive Modal Window)
- `VAR-NAV-UNDERLINE-TAB` (Underline Tab Strip)
- `VAR-SKL-PULSE` (Animated Pulse Skeleton Shimmer)
- `VAR-EMP-ZERO-STATE` (Dashed Border Zero State Container)
- `VAR-CHT-BAR-TREND` (Bar & Trend Visualization Chart)
- `VAR-SPU-EXECUTION` (Audit Execution & Camera Verification Step)
