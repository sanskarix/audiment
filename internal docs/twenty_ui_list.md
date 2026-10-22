# twenty-ui Component Reference for Audiment

> All components sourced from the installed `twenty-ui@2.46.0` npm package (MIT licensed).
> "Safe" = no legal or practical blocker for an auditing SaaS.
> "Skip" = CRM-specific, too niche, or a poor fit for Audiment's use case.

---

## Primitives / Input

| Component | Status | Notes |
|---|---|---|
| `Button` | ✅ Safe | Core action button. Use everywhere. |
| `ButtonGroup` | ✅ Safe | Grouped actions, good for toolbar rows. |
| `Checkbox` | ✅ Safe | Audit checklists, CAPA sign-offs. |
| `Switch` | ✅ Safe | Toggle settings, notification prefs. |
| `Input` | ✅ Safe | All text fields, search bars. |
| `InputGroup` | ✅ Safe | Input + icon/button combos. |
| `Textarea` | ✅ Safe | Finding descriptions, corrective action notes. |
| `Select` | ✅ Safe | Status dropdowns, category pickers. |
| `Field` | ✅ Safe | Label + input wrapper. Use for all form fields. |
| `RadioGroup` / `Radio` | ✅ Safe | Risk level pickers, severity selectors. |
| `SegmentedControl` | ✅ Safe | View toggles (e.g. List / Board / Calendar). |
| `Autocomplete` | ✅ Safe | Outlet/store lookup, auditor name search. |
| `NumberStepper` | ✅ Safe | Quantity or score inputs. |
| `Slider` | ⚠️ Use if needed | Fine for numeric scoring but verify touch UX. |

---

## Primitives / Surfaces

| Component | Status | Notes |
|---|---|---|
| `Card` | ✅ Safe | Dashboard metric cards, CAPA cards, summary panels. |
| `Dialog` | ✅ Safe | Confirmation dialogs, detail views, audit submit. |
| `AlertDialog` | ✅ Safe | Destructive actions — delete, escalate, close audit. |
| `Popover` | ✅ Safe | Inline context menus, quick-edit panels. |
| `Tooltip` | ✅ Safe | Icon labels, score explanations. |
| `Menu` | ✅ Safe | Right-click / action menus on rows. |

---

## Primitives / Feedback

| Component | Status | Notes |
|---|---|---|
| `Skeleton` | ✅ Safe | Loading states on all data-heavy screens. |
| `Loader` | ✅ Safe | Spinner for async actions (submit, export). |
| `ProgressBar` | ✅ Safe | Audit completion %, CAPA resolution progress. |
| `ProgressRing` | ✅ Safe | Circular score display on dashboard. |
| `Banner` | ✅ Safe | Page-level warnings (overdue audits, unresolved CAPAs). |

---

## Primitives / Data Display

| Component | Status | Notes |
|---|---|---|
| `Status` | ✅ Safe | Audit status badges (Open / In Review / Closed). |
| `Tag` | ✅ Safe | Category tags, department labels. |
| `Chip` | ✅ Safe | Inline people/store chips on audit records. |
| `Pill` | ✅ Safe | Count badges, filter pills. |
| `Avatar` | ✅ Safe | Auditor profile pictures. |
| `ColorSample` | ⚠️ Use if needed | Only useful if you show color-coded categories. |

---

## Primitives / Navigation

| Component | Status | Notes |
|---|---|---|
| `Tabs` | ✅ Safe | Switch between Findings / CAPA / History on a record. |
| `Breadcrumb` | ✅ Safe | Outlet > Audit > Finding navigation trail. |
| `ListItem` | ✅ Safe | Sidebar nav items, list rows. |

---

## Primitives / Layout

| Component | Status | Notes |
|---|---|---|
| `Separator` | ✅ Safe | Section dividers in forms and panels. |
| `Collapsible` | ✅ Safe | Expandable sections in long audit forms. |
| `ResizeHandle` | ⚠️ Use if needed | Only useful if you have a split-pane layout. |
| `DirectionProvider` | ⚠️ Use if needed | RTL support only. Skip unless you need it. |

---

## Primitives / Typography

| Component | Status | Notes |
|---|---|---|
| `Text` | ✅ Safe | Body copy everywhere. |
| `Heading` | ✅ Safe | Page and section titles. Override weight to 400 (your design system rule). |
| `OverflowingTextWithTooltip` | ✅ Safe | Long outlet names or finding titles in table cells. |
| `Shortcut` | ⚠️ Use if needed | Keyboard shortcut labels. Only add if you have shortcuts. |

---

## Primitives / Accessibility

| Component | Status | Notes |
|---|---|---|
| `VisuallyHidden` | ✅ Safe | Screen reader labels on icon-only buttons. |
| `ClickableElementKeyDown` | ✅ Safe | Keyboard handler wrapper. Use on custom clickable elements. |

---

## Components / Input

| Component | Status | Notes |
|---|---|---|
| `MainButton` | ✅ Safe | Primary CTA (Submit Audit, Save CAPA). Opinionated styled Button. |
| `IconButton` | ✅ Safe | Icon-only actions in table rows or toolbars. |
| `LightButton` | ✅ Safe | Secondary/ghost actions. |
| `LightIconButton` | ✅ Safe | Ghost icon buttons. |
| `SearchInput` | ✅ Safe | Global search bar, outlet/audit search. |
| `ImageInput` | ⚠️ Use if needed | Photo evidence upload on findings. |
| `CountrySelect` | ⚠️ Use if needed | Only if you have country-level outlet data. |
| `CurrencyPicker` | ❌ Skip | CRM/finance concept. Not relevant to auditing. |
| `PhoneCountryPicker` | ❌ Skip | Too niche. Use a standard Input instead. |

---

## Components / Data Display

| Component | Status | Notes |
|---|---|---|
| `MetricRow` | ✅ Safe | KPI rows on the dashboard (total audits, open CAPAs, score). |
| `AvatarGroup` | ✅ Safe | Show multiple auditors assigned to a location. |
| `NotificationCounter` | ✅ Safe | Unread count on nav items. |
| `JsonTree` | ⚠️ Use if needed | Debug/raw data views. Not for regular users. |
| `CommandBlock` | ❌ Skip | Dev-facing code display. Not for auditing UI. |
| `TintedIconTile` | ⚠️ Use if needed | Decorative icon tiles. Fine for empty states. |
| `IconTileColorShades` | ❌ Skip | Design utility only. |

---

## Components / Feedback

| Component | Status | Notes |
|---|---|---|
| `Toast` / `Toaster` / `ToastProvider` / `useToast` | ✅ Safe | Confirmation messages (Audit submitted, CAPA resolved). |
| `Callout` | ✅ Safe | Inline warnings inside forms (e.g. "This finding requires a CAPA"). |
| `InlineBanner` | ✅ Safe | Contextual alerts within a card or panel. |

---

## Components / Navigation

| Component | Status | Notes |
|---|---|---|
| `Dropdown` | ✅ Safe | Action menus, filter dropdowns. |
| `MenuItem` / `MenuItemAvatar` / `MenuItemDraggable` / `MenuItemSuggestion` | ✅ Safe | Items inside Dropdown and Menu. |
| `ListItemButton` | ✅ Safe | Clickable rows in sidebar or list views. |
| `TabButton` | ✅ Safe | Individual tab item if you need custom tab styling. |
| `MenuPicker` | ✅ Safe | Multi-option picker inside a dropdown. |
| `DropdownPage` | ⚠️ Use if needed | Paginated dropdown. Only if you have very long lists. |

---

## Components / Layout

| Component | Status | Notes |
|---|---|---|
| `Section` | ✅ Safe | Named sections in settings or detail panels. |
| `OverflowingList` | ✅ Safe | Chip lists that collapse when space runs out. |
| `AnimatedIconCrossfade` | ⚠️ Use if needed | Animated icon swap (e.g. save → saved). Decorative. |

---

## Components / Settings

| Component | Status | Notes |
|---|---|---|
| `SettingsRow` | ✅ Safe | Label + control rows in any settings page. |

---

## Components / Code Editor

| Component | Status | Notes |
|---|---|---|
| `CodeEditor` / `CodeEditorHeader` | ❌ Skip | Developer tool. Not relevant to auditing. |

---

## Theme

| Export | Status | Notes |
|---|---|---|
| `ThemeProvider` | ✅ Safe | Wrap your dashboard layout in this. Required for all above to render correctly. |
| `useTheme` | ✅ Safe | Read current theme in any component. |
| `useThemeColorScheme` | ✅ Safe | Light/dark toggle logic. Hook into your existing `next-themes`. |
| `ThemeOverrides` | ✅ Safe | Pass your Audiment color tokens here to override Twenty's defaults. |
| `THEME_LIGHT` / `THEME_DARK` | ✅ Safe | Base theme objects. Extend with `ThemeOverrides`. |

---

## Summary counts

| Status | Count |
|---|---|
| ✅ Safe to use | 52 |
| ⚠️ Use if needed | 11 |
| ❌ Skip | 6 |