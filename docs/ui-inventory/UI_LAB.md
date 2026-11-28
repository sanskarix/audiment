# Audiment UI Lab — Exhaustive Existing UI Inventory

## Objective

Build a comprehensive, interactive visual inventory of the UI that currently exists throughout the entire Audiment application.

This is a discovery and documentation project, NOT a redesign project.

I want to understand exactly what UI implementations currently exist in the codebase before deciding which components to standardize, replace, or redesign.

**The governing rule is: document first, decide later.**

Do not simplify, consolidate, normalize, improve, or replace existing UI implementations. Even if two components look almost identical, document them separately until I personally decide whether they should become one universal component.

The final result should be a complete visual reference library inside the existing `/ui-lab` route, backed by a detailed, source-linked inventory.

## Phase 1 — Establish the project scope

Before making changes, inspect the project structure and determine:

- The framework, application architecture, routing system, and relevant rendering conventions.
- All application routes, including nested routes, dynamic routes, layouts, loading states, error states, and route-specific variations.
- Every UI-related source directory, shared component directory, feature module, stylesheet, design-token file, theme, icon collection, and asset directory.
- All UI libraries and dependencies used in the application, including Twenty UI and other component libraries.
- Existing shared components, locally defined components, inline JSX, conditional UI, CSS modules, Tailwind classes, global styles, and dynamically generated UI.
- The current `/ui-lab` implementation and any documentation already created for it.

Inspect the actual repository. Do not rely solely on the README, existing documentation, route names, or previous AI-generated summaries.

Create a scope report listing the directories, files, routes, and categories that must be inspected.

### Inspection coverage

Perform a systematic source-code audit of the entire repository.

Inspect every relevant UI implementation, including UI code embedded directly inside pages, components, layouts, dialogs, drawers, menus, and conditional branches.

Do not inspect only the shared component folder. Do not assume that a page uses a shared component merely because its UI looks similar to one.

Non-UI code such as backend business logic, database operations, authentication internals, and deployment configuration does not need to be reproduced in the visual inventory. However, inspect UI-facing code that determines what the user sees or how a UI element behaves.

Maintain an inspection ledger so that every relevant file is accounted for. Mark files as inspected, not applicable to the UI inventory, or blocked/unresolved. Do not claim complete coverage while relevant files remain uninspected.

## Phase 2 — Build a complete route and page inventory

Identify every application page and its actual route.

For each page, record:

1. Page ID.
2. Page name.
3. Exact URL path or route pattern.
4. Relevant parent layout.
5. Authentication or role restrictions, where evident from the code.
6. Major UI sections.
7. Components rendered by that page.
8. Route-specific variants of otherwise similar components.
9. Loading, empty, error, disabled, selected, expanded, and other conditional states where present.
10. Source files responsible for the page and its components.

Include all relevant product areas: dashboards, audit management, audit templates, audit execution, corrective actions, locations, users, reports, settings, administrative pages, and any other pages actually discovered.

These examples are not an exhaustive route list. Discover the actual routes from the repository.

For dynamic routes, inspect representative implementations and document the route parameters. Do not invent real records or credentials to gain access to restricted pages.

If some screens cannot be rendered because they require authentication, unavailable data, or specific permissions, inspect their source code and document the limitation. Never silently omit them.

## Phase 3 — Inventory every distinct UI implementation

Create a unique inventory entry for every distinct component implementation or meaningful visual variant.

Use stable, sequential IDs, grouped by category. For example:

- BTN-001: Button variant 1
- BTN-002: Button variant 2
- FIL-001: Filter variant 1
- FIL-002: Filter variant 2
- TBL-001: Table implementation 1
- TBL-002: Table implementation 2
- INP-001: Input variant 1
- MOD-001: Modal implementation 1

These IDs are illustrative. Establish a consistent naming convention and apply it throughout the inventory.

### Strict duplicate-handling rules

Do not merge entries because they share a component name, HTML element, React component, or visual purpose.

Do not merge entries because their differences seem unimportant.

Create separate entries whenever there is a meaningful difference in any of the following:

- Visual appearance.
- Dimensions or spacing.
- Typography.
- Color, opacity, or contrast.
- Border, radius, or shadow.
- Icon, icon position, or icon size.
- Alignment or layout.
- Content structure.
- Interaction behavior.
- Available actions.
- Hover, focus, active, selected, disabled, loading, error, or empty states.
- Responsive behavior.
- Accessibility semantics.
- Implementation or styling approach that produces a distinct result.

For example, if `/admin/audits` has a filter button with one padding value and `/corrective-actions` has a similar filter button with different padding, record both separately.

If two implementations appear visually identical but have different underlying implementations, record the implementation distinction as well. Link them as potential duplicates, but do not consolidate them.

If one implementation has five materially different states, document those states under its entry. Create separate entries for those states only when they represent distinct implementations or structural variants, and cross-reference the parent.

Do not artificially multiply entries for trivial differences in content text alone. Record content differences as data variations unless they alter the UI structure, styling, or behavior.

The objective is complete coverage without either merging genuine variants or creating meaningless duplicates.

## Phase 4 — Record the visual specification of every entry

For each component or variant, document every applicable property that can be established from the source code or rendered UI.

### A. Identity and location

- Unique component ID.
- Component name.
- Category.
- Exact page route(s).
- Page ID(s).
- Parent section or layout.
- Source file path(s).
- Relevant component, function, or JSX location.
- Relevant line ranges where available.
- Shared component dependencies.
- Styling source: CSS, CSS module, Tailwind, inline style, design token, library default, or other mechanism.

### B. Dimensions and spacing

Record explicit values wherever available:

- Width and height.
- Minimum and maximum dimensions.
- Padding on each side.
- Margin on each side.
- Gap between child elements.
- Vertical distance between adjacent headings, labels, inputs, buttons, sections, and other elements.
- Horizontal spacing and alignment.
- Grid and flex configuration.
- Row height and column spacing.
- Positioning, overflow, and scroll behavior.
- Responsive breakpoints and layout changes.

Do not invent pixel measurements if they cannot be reliably established. Distinguish source-defined values from browser-observed or estimated values.

### C. Typography

Document:

- Font family.
- Font size.
- Font weight.
- Line height.
- Letter spacing.
- Text color.
- Text alignment.
- Text transformation.
- Text decoration.
- Wrapping, truncation, and overflow.
- Heading and label hierarchy.
- Inherited typography versus locally overridden typography.

### D. Colors and visual styling

Document:

- Background and foreground colors.
- Border colors and thickness.
- Border radius.
- Shadow definitions.
- Opacity.
- Focus rings and outlines.
- Hover and pressed colors.
- Selected and active colors.
- Disabled-state appearance.
- Error, warning, success, and informational styling.
- CSS variables or design tokens used.
- Light/dark theme behavior, if present.

Preserve actual token names and CSS values wherever possible.

### E. Structure and content

Document:

- Child elements and their order.
- Icons and icon sources.
- Labels, placeholders, helper text, and tooltips.
- Leading and trailing adornments.
- Table columns, headers, cell structures, and action columns.
- Filter groups and search controls.
- Empty-state illustrations and messages.
- Nested menus and dialogs.
- Conditional elements and their triggering conditions.

### F. Behavior and state

Record what the code actually implements:

- Click actions.
- Navigation destinations.
- Search, sorting, filtering, pagination, and selection.
- Form validation.
- Open/close behavior.
- Keyboard interaction.
- Loading and asynchronous states.
- Error handling and feedback.
- Disabled-state conditions.
- Data-dependent visibility.
- Hover and focus interactions.
- Responsive interaction changes.

Do not execute destructive actions against production data. Inspect their handlers and document their behavior without triggering them.

### G. Evidence and confidence

For each recorded property, distinguish among:

- Source-confirmed.
- Browser-verified.
- Inferred from implementation.
- Not yet verified.

Never present an assumption as an observed fact.

## Phase 5 — Create the visual UI lab

Expand the existing `/ui-lab` rather than creating an unrelated second showcase.

The lab should contain the current implementations, not proposed redesigns.

### Required organization

Create a navigable inventory with categories such as:

1. Typography.
2. Colors and design tokens.
3. Spacing and layout.
4. Buttons and actions.
5. Search bars.
6. Filters and filter menus.
7. Text inputs and form controls.
8. Selects, dropdowns, and pickers.
9. Tabs and navigation.
10. Tables and data grids.
11. Lists and row actions.
12. Cards and dashboard widgets.
13. Badges, tags, and status indicators.
14. Dialogs, modals, and drawers.
15. Popovers and tooltips.
16. Toasts, alerts, and notifications.
17. Loading indicators and skeletons.
18. Empty and error states.
19. Charts and data visualizations.
20. Icons and illustrations.
21. Page headers and toolbars.
22. Pagination.
23. Date and time controls.
24. Specialized audit and corrective-action components.
25. Other categories discovered during the audit.

This is a starting taxonomy, not a reason to omit components that do not fit neatly into it.

### Every inventory entry should display

- Its unique ID and name.
- A visual rendering of the actual existing implementation, or a faithful isolated reproduction when the original cannot be safely rendered independently.
- The page route where it appears.
- Its source file and relevant code location.
- Its documented visual properties.
- Its available states and variants.
- Its interaction behavior.
- Other routes where the same implementation appears.
- Related or potentially duplicate entries.

Provide search and category filters so I can find components quickly by ID, name, route, or category.

Make it easy to compare multiple entries side by side, particularly when comparing duplicate tables, filters, buttons, or form controls.

Where possible, provide a link from a lab entry to its source file and line number. Where direct source navigation is unavailable, display the exact file path and line range.

### Preserve the current design

The lab must faithfully represent the existing implementation. Do not apply the new Twenty UI styling universally during this phase.

Do not modify the marketing website, existing production components, or product behavior to make the lab easier to build.

If an existing component depends on application data, authentication, or complex parent state, use an isolated mock-data rendering or faithful snapshot of its UI. Make it clear when the lab example is a reproduction rather than the original live component.

Do not add new dependencies without first determining whether existing project tools can accomplish the task.

## Phase 6 — Inventory design tokens and global styling

Create a separate design-token inventory that records the actual values used throughout the application.

Inspect:

- Global CSS.
- CSS variables.
- Tailwind configuration.
- Theme definitions.
- Font loading.
- Component-level styles.
- Repeated arbitrary values.
- Page-specific overrides.
- CSS resets.
- Responsive breakpoints.
- Third-party component theme overrides.
- Conflicting or overridden declarations.

Record both the intended token and the actual resolved appearance where they differ.

If the same visual property uses different values in different locations, record each distinct value and identify where it occurs.

Do not standardize tokens, change CSS variables, or remove duplicate declarations during this phase.

## Phase 7 — Create durable documentation

Save the inventory in the repository so it remains available to future development sessions.

Create or update the following documentation under a suitable existing documentation directory:

- `UI_INVENTORY_README.md` — scope, methodology, limitations, and navigation.
- `UI_ROUTE_INVENTORY.md` — all discovered routes and their coverage.
- `UI_COMPONENT_INVENTORY.md` — numbered components, variants, and source references.
- `UI_DESIGN_TOKENS.md` — typography, colors, spacing, borders, shadows, and other tokens.
- `UI_DUPLICATE_CANDIDATES.md` — visually or functionally similar implementations that need my later review.
- `UI_INSPECTION_LEDGER.md` — inspected files, uninspected files, exclusions, and outstanding work.

Use structured data such as JSON where it makes sense to power the visual lab from the same inventory rather than maintaining two inconsistent copies.

If the inventory becomes too large for one document, split it into logically organized files and provide an index. Do not truncate the inventory to make it manageable.

## Phase 8 — Completeness verification

Before declaring the task complete, perform a separate coverage audit.

Verify that:

- Every discovered application route is accounted for.
- Every relevant UI source file has a recorded inspection status.
- Every discovered distinct implementation has an inventory entry.
- Every entry has a stable ID.
- Every entry has its route association and source location where determinable.
- Shared components are mapped to all known usages.
- Locally implemented and inline UI has not been overlooked.
- Conditional and dynamically rendered UI has been considered.
- Styling overrides and route-specific variations have been examined.
- Duplicate candidates have not been silently merged.
- The UI lab can display the documented entries.
- Unavailable screens and unresolved cases are explicitly listed.
- The documentation agrees with the actual lab inventory.

Run appropriate project checks and confirm that the UI lab works without affecting existing product functionality.

If you encounter context limits or the task is too large for one pass, work in numbered batches, persist the inspection ledger after each batch, and resume from the last confirmed position. Never claim to have audited the entire repository merely because the initial scan completed.

## Strict prohibitions

During this task, do not:

- Redesign any production page.
- Standardize any component.
- Delete or consolidate duplicate components.
- Replace old components with Twenty UI components.
- Modify business logic or application workflows.
- Change data schemas, APIs, authentication, or permissions.
- Change global typography, spacing, colors, or styling.
- Invent components or properties that do not exist.
- Guess route coverage from directory names alone.
- Treat similar-looking components as identical without evidence.
- Declare completion without a documented coverage report.

## Final deliverable

I expect to open `/ui-lab` and explore a comprehensive catalogue of Audiment's existing UI implementations, including the inconsistent and duplicated versions currently scattered across the product.

I must be able to identify each entry by its unique number, see its appearance, find the exact page where it occurs, and trace it back to the relevant source code.

Alongside the lab, provide a coverage report showing the number of routes discovered and inspected, relevant source files inspected, unique UI entries catalogued, variants recorded, duplicate candidates identified, and unresolved items.