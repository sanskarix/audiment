# Audiment Mobile UI Specification

## Purpose
This document defines the complete mobile design system, interaction model, navigation, and page-by-page layout rules for Audiment.

The goal is to make the entire product mobile-ready **without changing the desktop experience**. Mobile must feel like a deliberate operational app: fast, compact, clear, and aesthetically calm.

This specification is intended to eliminate guesswork during implementation. If a pattern is not explicitly allowed here, the implementing agent must preserve the current desktop behavior and avoid inventing new mobile interactions.

---

## Product Goals

### Primary goals
- Make the full product usable and visually polished on phones.
- Preserve the current desktop look and structure.
- Improve mobile speed, scanability, thumb reach, and task completion.
- Keep the visual language minimalist, clean, and consistent with the current product.
- Support dark mode everywhere mobile is supported.

### Product tone
- Operational, focused, trustworthy.
- Compact over spacious.
- Elegant but not decorative.
- Clear over clever.
- Fast over theatrical.

### Mobile experience principle
Audiment on mobile must behave like an **app shell**, not a shrunken website.

That means:
- persistent bottom navigation for primary destinations,
- stacked content instead of wide grids,
- cards instead of tables,
- wizard flows for multi-step tasks,
- bottom sheets for lightweight actions,
- full-screen pages for dense or longer flows.

---

## Non-Negotiables
- **Desktop must remain visually unchanged.**
- Mobile redesign applies only below the mobile breakpoint.
- Do not compress desktop tables, multi-column sections, or sidebars into illegible mobile layouts.
- Replace patterns instead of shrinking them.
- Keep all touch targets at least 44px high.
- Avoid accidental taps, clipped text, horizontal scrolling, and hidden actions.
- Mobile and desktop must use the same data and permissions, but can use different presentation patterns.

---

## Breakpoints
Use these behavioral breakpoints for the implementation:

- **Mobile:** 0–767px
- **Tablet:** 768–1023px
- **Desktop:** 1024px and above

### Breakpoint rules
- Desktop layout from 1024px+ should remain functionally and visually unchanged unless fixing a bug.
- Mobile layouts must be purpose-built below 768px.
- Tablet can use either mobile or hybrid layout depending on page complexity.
- For dense admin screens, tablet may retain some desktop structure.
- For auditor execution flows, tablet should behave closer to mobile than desktop.

---

## Visual System for Mobile

### Visual direction
The current product already has a strong minimalist base:
- white or low-noise surfaces,
- soft gray borders,
- restrained accent color,
- clear type hierarchy,
- calm enterprise dashboard styling.

The mobile version must preserve that exact feeling.

### Mobile visual principles
- Use compact spacing, but never cramped spacing.
- Keep rounded cards and soft borders.
- Avoid heavy shadows and decorative gradients.
- Use color to indicate state, not to decorate.
- Preserve current typography and brand tone.
- Support both light and dark mode without changing layout logic.

### Spacing intent
- Vertical rhythm should be tighter than desktop.
- Dense pages should prioritize 12–16px gaps, not large empty areas.
- Card padding should usually be 14–16px on mobile.
- Section spacing should usually be 20–24px.
- Full-screen forms may use 16px horizontal padding.

### Content width
- Mobile content should be edge-aware, not edge-to-edge cramped.
- Standard page padding: 16px.
- Dense lists may use 12px side padding if needed.
- Buttons and inputs should generally span full width unless a two-action split layout is clearer.

---

## Global Mobile Shell

### App bar
Every dashboard page on mobile should use a sticky top app bar.

#### App bar contents
- Left: current page title or back button where relevant.
- Right: context actions such as search, filters, notifications, or overflow menu.
- On top-level pages, avoid cluttering the app bar with too many actions.

#### App bar behavior
- Stays visible while scrolling on long pages.
- Uses a subtle surface background and bottom border.
- Should not consume excessive height.

### Bottom navigation
Use bottom navigation for top-level role-based destinations.

#### Admin tabs
- Home
- Audits
- Users
- Flashmob
- More

#### Manager tabs
- Home
- Audits
- Actions
- Reports
- More

#### Auditor tabs
- Home
- Audits
- History
- Flashmob
- More

### Bottom nav rules
- Maximum 5 items.
- No horizontally scrollable tabs.
- Always visible on top-level mobile pages.
- Active state must be visually clear.
- Labels are required; do not use icon-only tabs.
- Badges may be used for urgent counts only, such as overdue corrective actions.

### More section
The More destination opens a full-screen mobile page, not a tiny menu.

#### Contents may include
- Settings
- Locations
- Templates
- Calendar / Planning
- Auditors
- Reports (for roles where not in tab bar)
- Corrective Actions (for roles where not in tab bar)
- Logout
- Profile / Organization details

---

## Interaction Patterns

### 1. Tables become cards
Any desktop table must become a card list on mobile.

#### Card conversion rules
- Each row becomes one card.
- Put the most important identifier first.
- Convert columns into labeled metadata rows or chips.
- Keep the primary action visible.
- Secondary actions move to overflow or a swipe-safe action menu.
- Never default to horizontal table scroll unless absolutely unavoidable.

### 2. Modals become bottom sheets or pages
#### Use bottom sheets for
- Quick filters
- Sorting
- Small confirmations
- Short creation forms (1–3 fields)
- Small pickers

#### Use full-screen pages for
- Long forms
- Multi-step flows
- Editing dense records
- Template creation/editing
- Complex audit setup
- Media-heavy or detail-heavy interactions

### 3. Wizard flows for complex tasks
Use step-by-step flows for tasks that would otherwise overload the screen.

#### Wizard rules
- One primary objective per step.
- Show step progress clearly.
- Keep forward/back navigation fixed and obvious.
- Preserve partial progress.
- Allow editing previous steps without losing work.

### 4. Sticky action areas
Use sticky bottom action bars when the user must frequently confirm or advance.

Use this on:
- audit execution,
- template builder,
- long creation/edit flows,
- approval/review flows.

### 5. Search and filters
- Search should remain near the top of list pages.
- Filters should open in a bottom sheet.
- Applied filters should appear as compact removable chips.
- Avoid multi-row desktop-style filter bars on mobile.

---

## Page Priorities

### Tier 1
These pages require the highest mobile quality and most detailed implementation:
- Landing page
- Entire Auditor dashboard
- Admin Audits
- Admin Reports
- Manager Audits
- Manager Reports
- Audit detail reports
- Auditor audit execution flow

### Tier 2
These pages must be clearly responsive and fully usable:
- Admin Home
- Admin Users
- Admin Locations
- Admin Templates index
- Manager Home
- Manager Corrective Actions
- Manager Auditors
- Manager Calendar / Planning
- Flashmob views
- Settings pages

### Tier 3
These pages should be mobile-safe and visually consistent, but need less custom interaction work:
- Public site subpages
- Blog index and posts
- Long-form comparison pages
- Secondary solution pages
- Secondary use-case pages
- Legal pages

---

## Public Site Mobile Specification

### Global site header
- Replace desktop nav with a compact top bar.
- Keep logo on left.
- Right side should have either a menu icon or a single high-priority CTA.
- Full nav opens in a slide-down panel or full-screen menu.
- Keep login and Book a call visible, but avoid crowding.

### Hero section
- Headline should wrap intentionally into 2–4 lines.
- Supporting copy should stay concise and readable.
- CTAs stack vertically or sit 2-up only if both remain comfortable.
- Product mockup should scale down and crop intelligently.
- Avoid oversized empty whitespace above the fold.

### Landing page sections
#### KPI / product preview blocks
- Convert wide dashboards into vertically stacked preview cards.
- Use cropped screenshots to show clarity, not full desktop dashboards.

#### Feature sections
- Keep copy tighter.
- Use 1-column stacked sections on mobile.
- Alternate text and visuals, but avoid excessive vertical padding.

#### Testimonials / comparison / proof sections
- Use swipeable cards only if the content is short.
- Otherwise stack into a vertical list.

### Blog and content pages
- Use comfortable reading width with 16px side padding.
- Keep title, author/date, and cover image stacked cleanly.
- Inline callouts and comparison tables must collapse into stacked blocks where possible.

### Solutions / use-case / comparison pages
- Reuse a single mobile content system.
- Reduce repetition and wide comparison layouts.
- Comparison tables should collapse into card comparisons.

---

## Dashboard Mobile Framework

### Shared dashboard rules
- Remove persistent desktop sidebar on mobile.
- Use sticky top app bar + bottom navigation.
- Page titles remain visible at top.
- Every top-level page begins with a compact summary section.
- Lists and reports must prioritize actionable data first.
- Do not place too many cards in horizontal carousels; prefer vertical ordering.

### Shared mobile sections structure
Most dashboard top-level pages should follow this order:
1. App bar
2. Summary or KPI strip
3. Search / filter area
4. Primary list or chart content
5. Sticky or inline action controls where needed
6. Bottom nav

---

## Admin Mobile Specification

### Admin Home
#### Purpose
Give a quick operational snapshot for the organization.

#### Mobile layout
1. Top app bar with title “Home” and notification / overflow actions.
2. KPI block: 2-up cards on larger phones, 1-up on narrow phones.
3. Actions / attention card near top if urgent items exist.
4. Performance chart in compact card form.
5. Secondary summary cards below chart.
6. Optional recent activity list.

#### KPI behavior
- Prioritize: Audits, Completion rate, Actions, optional locations/users.
- Use compact stat cards with one number, one label, optional small trend.

#### Chart behavior
- Keep charts shorter than desktop.
- Reduce axis clutter.
- Prefer one chart per card.

### Admin Audits
#### Purpose
Fast browsing and management of all audits.

#### Mobile layout
1. App bar with title and New Audit action in overflow or prominent icon button.
2. Search bar.
3. Filter and sort sheet trigger.
4. Card list of audits.

#### Audit card content
- Template name
- Location
- Status chip
- Deadline
- Surprise / routine label if relevant
- Score or pending state
- Primary tap opens audit detail or report
- Overflow menu for secondary actions

#### Card rules
- Use colored state chips for Completed, Pending, Deadline hit, etc.
- Do not repeat low-value metadata above the fold.
- Keep score visually obvious.

### Admin Users
#### Mobile layout
1. App bar with title and Add User action.
2. Search field.
3. Filter button.
4. User card list.

#### User card content
- Name
- Role badge
- Location / org summary if relevant
- Status (active/inactive)
- Quick actions in overflow

#### Add/edit user
- Use bottom sheet for quick add only if the form is short.
- If form has several fields or permissions, use full-screen page.

### Admin Locations
#### Mobile layout
1. App bar with Add Location action.
2. Search and filters.
3. Location cards.

#### Location card content
- Location name
- Address or short identifier
- Assigned counts (audits/users/actions) if valuable
- Status
- Overflow actions

### Admin Templates Index
#### Purpose
Browse and launch template workflows.

#### Mobile layout
1. App bar with New Template action.
2. Optional larger-screen recommendation prompt on entry.
3. Search and category filter.
4. Template cards.

#### Template card content
- Template name
- Category
- Number of questions
- Last updated
- Usage summary if available
- Tap opens template detail/edit flow

### Admin Template Builder - Mobile
#### Principle
Supported on mobile, but restructured into a guided step flow.

#### Entry behavior
When entering mobile template creation or editing, show a dismissible notice:
- “Best on a larger screen, but fully supported on mobile.”

#### Builder structure
Template Builder must be a full-screen mobile flow, not a modal.

#### Steps
1. Template basics
   - Template title
   - Category
   - Description if applicable
2. Question list overview
   - Reorder questions
   - Add new question
   - Review sequence
3. Edit question
   - Question text
   - Response type
   - Severity
   - Require photo toggle
4. Rules / best practices / advanced settings if applicable
5. Review and save

#### Question list mobile behavior
- Show each question as a compact sortable card.
- Tap a card to edit in a dedicated question screen or sheet.
- Reordering should use explicit move up/down controls, not drag-only interaction.

#### Save behavior
- Sticky footer with Save Template.
- Unsaved changes warning before leaving.

### Admin Reports List
#### Mobile layout
1. App bar
2. Search field
3. Filters bottom sheet
4. Report cards instead of table rows

#### Report card content
- Template name
- Location
- Completed date
- Score chip
- Tap opens report detail

### Audit Detailed Report
#### Purpose
Readable, scannable audit outcome page for phone usage.

#### Mobile layout
1. App bar with back, title, overflow/export/share if applicable.
2. Header summary card containing:
   - final score,
   - grade/status,
   - location,
   - completed date,
   - auditor.
3. Findings list as stacked cards.
4. Critical issues section near top when present.
5. Media and notes embedded within finding cards.

#### Finding card structure
- Question title / number
- Severity chip
- Response shown clearly
- Points earned / available if relevant
- Critical fail badge if triggered
- Notes below
- Photo gallery below if present

### Admin Flashmob
- Use top-level page in bottom tabs.
- Show active requests first.
- Card layout should emphasize urgency, location, and response state.
- Actions like accept, assign, close, or review must remain easy to reach.

### Admin Settings
- Organize as grouped list items.
- Each settings group becomes its own section or screen.
- Avoid dense two-column settings layouts.

---

## Manager Mobile Specification

### Manager Home
#### Mobile layout
1. App bar with title and notifications.
2. KPI cards for locations, pending audits, completed, auditors.
3. Corrective action priority section.
4. Compact performance trend chart.
5. Auditor activity list.

#### Important rule
The desktop horizontal corrective-action rail should usually become a vertical list on mobile unless there are only 2–3 items.

### Manager Audits
Use the same mobile system as Admin Audits, with manager-specific filters and permissions.

### Manager Actions
#### Mobile layout
1. Summary strip for overdue/open/resolved counts.
2. Search and filter sheet.
3. Corrective action cards.

#### Corrective action card content
- Title or question name
- Severity
- Location
- Due date
- Status
- Assigned person if useful
- Primary action

### Manager Reports
Use the same mobile report list and report detail system as Admin Reports.

### Manager Auditors
#### Auditor list
- Each auditor becomes a card.
- Show name, status, assigned audit count, completion count, and quick action.

#### Auditor performance detail
- Summary KPI cards at top.
- Performance chart in shorter mobile card.
- Completed/pending audits as segmented lists.

### Manager Planning / Calendar
#### Mobile behavior
A full desktop calendar grid is usually too dense for small screens.

#### Mobile layout
- Default to agenda/list view on mobile.
- Day and week filters available in header.
- Use date-grouped schedule cards.
- Only use month grid if compact and readable.

### Manager Settings
Same structural rules as Admin Settings.

---

## Auditor Mobile Specification

### Auditor Home
#### Purpose
Immediate access to active audits and performance.

#### Mobile layout
1. App bar with title.
2. KPI cards for completed and average score.
3. Active audits section.
4. Search and filter if needed.
5. Audit assignment cards.

#### Audit assignment card content
- Template name
- Location
- Deadline
- Start / Continue button
- Locked state if not yet available

#### Important rule
The primary CTA must remain visible without opening the card.

### Auditor Audits
This is the active assignments list.
Use the same pattern as Auditor Home’s active audit section, but with fuller filtering.

### Auditor History
#### Mobile layout
1. Summary KPI strip.
2. Search.
3. Filter sheet.
4. History cards.

#### History card content
- Template name
- Location
- Date
- Verification state if relevant
- Score chip
- View Log action

### Auditor Flashmob
- Prioritize response urgency.
- Cards must clearly show location, time, status, and action.
- If execution starts from here, CTA must be large and immediate.

### Auditor Settings
- Profile, sync, and device-related settings should be grouped into simple list sections.
- Device sync and offline-related settings should have clearer explanatory copy on mobile.

---

## Auditor Execution Flow - Mobile First

### Core principle
This flow should feel like the most polished app-like experience in the product.

### Flow type
One question per screen.

### Header
Sticky compact header containing:
- Back button
- Progress label (e.g. Question 1 of 8)
- Save action
- Progress bar beneath or integrated into header

### Main question area
- Severity chip near top.
- Large readable question text.
- Enough spacing to avoid mis-taps.
- Keep the question itself above the fold.

### Answer input patterns
#### Yes / No
- Two large side-by-side buttons if they remain comfortable.
- Otherwise stack vertically.
- Active state must be very clear.

#### Rating /10
- Use large segmented buttons, slider with clear value, or large step control depending on current product pattern.
- The selection must be thumb-friendly and obvious.

### Evidence area
- Photos and notes should appear below the answer block.
- Camera CTA must be prominent.
- Photo previews should be visible inline.
- Notes field should expand comfortably and not dominate before answer selection.

### Navigation controls
Sticky bottom bar with:
- Previous
- Next / Complete

### Validation
- If photo is required, state this clearly before advancing.
- If a critical answer risks failure, do not over-alarm, but present clear context.

### Completion step
Final step should summarize:
- answered count,
- flagged critical issues,
- missing evidence,
- submit action.

---

## Shared Component Rules

### KPI cards
- 1-up or 2-up on mobile.
- Never force 4 cards in one row.
- Keep number + label + one small detail.
- Avoid excessive icon ornamentation.

### Search bars
- Full width on mobile.
- Filters trigger sits adjacent or in app bar.

### Filters
- Open in bottom sheet.
- Group by category.
- Apply/reset actions fixed at bottom if the filter set is long.

### Cards
- Border-first, low-shadow aesthetic.
- Clear hierarchy: title, metadata, state, action.
- Do not overload cards with too many small labels.

### Charts
- Shorter height than desktop.
- Simplify legends and axis labels.
- Use tap-friendly tooltips only if already implemented cleanly.

### Status chips
- Must be consistent across roles.
- Use restrained fills and readable contrast.
- Same status should always use same color meaning.

### Empty states
Every empty state should include:
- short explanation,
- one clear next action,
- no decorative clutter.

### Loading states
- Use skeletons matching final card shapes.
- Avoid layout shift after loading.

### Toasts and validation
- Keep notifications brief.
- Important validation should appear near the relevant field, not only as floating toast.

---

## Modal and Overlay Conversion Map

### Bottom sheet candidates
- Filters
- Sort options
- Status pickers
- Quick add location if very short
- Quick assign / quick confirm
- Short flashmob accept/decline actions

### Full-screen mobile pages
- Add/edit user when form is multi-field
- Add/edit location when form is multi-section
- Template creation/editing
- Detailed report export/share configuration
- Any modal with scrolling body + many controls
- Long corrective-action editing

### Dismissal rules
- Bottom sheets must have drag handle and explicit close affordance.
- Do not allow accidental dismissal if a form has unsaved changes.
- Full-screen forms should use a back button plus unsaved-changes protection.

---

## Role-Based Navigation Map

### Admin mobile IA
#### Bottom tabs
- Home
- Audits
- Users
- Flashmob
- More

#### More contains
- Locations
- Templates
- Reports
- Corrective Actions
- Settings
- Logout

### Manager mobile IA
#### Bottom tabs
- Home
- Audits
- Actions
- Reports
- More

#### More contains
- Auditors
- Calendar / Planning
- Settings
- Flashmob if needed by role configuration
- Logout

### Auditor mobile IA
#### Bottom tabs
- Home
- Audits
- History
- Flashmob
- More

#### More contains
- Settings
- Profile
- Logout

---

## Implementation Guardrails

### Do not do these
- Do not alter desktop visual hierarchy.
- Do not simply hide overflow and call it responsive.
- Do not keep left sidebar visible on phones.
- Do not use horizontal scrolling tables as the default solution.
- Do not reduce font sizes to fit more content.
- Do not stack five desktop controls in one row.
- Do not use centered desktop modals on mobile for large forms.
- Do not break dark mode.
- Do not invent new role structures or routes.

### Safe implementation strategy
- Add mobile-specific layout branches below 768px.
- Keep existing desktop components for md/lg and above where possible.
- Create shared mobile primitives:
  - `MobileAppBar`
  - `MobileBottomNav`
  - `MobileCardList`
  - `MobileFilterSheet`
  - `MobileStatGrid`
  - `MobileWizardLayout`
- Reuse these primitives across all roles.

### Data integrity rule
Only presentation changes on mobile. Business logic, data access, scoring, permissions, and route meaning must remain unchanged.

---

## QA Checklist

### Global QA
- No horizontal scrolling on phone-width pages.
- No clipped buttons or hidden actions.
- Touch targets are comfortable.
- Bottom nav remains stable and clear.
- Top app bar does not overlap content.
- Dark mode remains legible.
- Desktop unchanged.

### List pages QA
- Search usable with one hand.
- Filters accessible and dismissible.
- Cards readable at a glance.
- Primary action always clear.

### Audit execution QA
- One question fully visible without confusion.
- Progress always understandable.
- Photo and notes are easy to add.
- Next/Previous actions are never lost off screen.

### Template Builder QA
- Larger-screen recommendation appears on mobile entry.
- Creation and editing both work end-to-end on mobile.
- Step progress and save behavior are clear.
- Reordering is possible without drag dependence.

### Landing page QA
- Hero is compelling above the fold.
- Navigation remains simple.
- CTAs are obvious and easy to tap.
- Dashboard preview imagery remains legible enough to communicate product value.

---

## Final Instruction to Implementing Agent
Implement the mobile version of Audiment exactly according to this specification.

Priority order:
1. Tier 1 pages
2. Shared mobile shell and primitives
3. Tier 2 pages
4. Tier 3 public pages

Do not hallucinate layouts beyond this document.
If a page is not explicitly covered, apply the shared mobile framework and nearest matching pattern from this spec while preserving desktop behavior.

When in doubt:
- preserve desktop,
- favor clarity over density,
- favor compactness over decorative spacing,
- favor full-screen task flows over cramped modal experiences,
- and make the mobile product feel like a polished operational app.