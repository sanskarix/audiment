# Audiment Dashboard Design System
### Global Style Guide – All Pages Except Landing

> **Scope:** Applies to every route under `/dashboard/**` and `/login`. Does **not** apply to `/` (the landing page). This document is the single source of truth – UI decisions made here must be replicated consistently on every page.

---

## 1. Color Tokens

All colors use the **OKLCH** color space. The preset is `b1D5T6NG` – Modern Slate + Azure Indigo.

### Light Mode (`:root`)

| CSS Variable | Value | Description |
|---|---|---|
| `--background` | `oklch(1 0 0)` | Pure white – app background |
| `--foreground` | `oklch(0.145 0 0)` | Deep charcoal – primary foreground text |
| `--card` | `oklch(1 0 0)` | White – card and container surface |
| `--card-foreground` | `oklch(0.145 0 0)` | Same as foreground |
| `--primary` | `oklch(0.5 0.134 242.7)` | **Azure Indigo** – CTAs, active nav, focus states |
| `--primary-foreground` | `oklch(0.977 0.013 236.62)` | White text on primary backgrounds |
| `--secondary` | `oklch(0.967 0.001 286)` | Very light cool grey – secondary button bg |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)` | Dark text on secondary backgrounds |
| `--muted` | `oklch(0.97 0 0)` | Near-white grey – soft backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | Mid-grey – placeholder, disabled, helper |
| `--accent` | `oklch(0.97 0 0)` | Same as muted – hover backgrounds |
| `--accent-foreground` | `oklch(0.205 0 0)` | Text on hover states |
| `--border` | `oklch(0.9 0 0)` | Light grey – borders and dividers |
| `--input` | `oklch(0.9 0 0)` | Input border color |
| `--ring` | `oklch(0.708 0 0)` | Focus ring color |
| `--destructive` | `oklch(0.577 0.245 27.3)` | Semantic red – danger, delete |
| `--success` | `oklch(0.6 0.18 150)` | Green – completed, passed |
| `--warning` | `oklch(0.8 0.12 80)` | Amber – flagged, in-progress, surprise |
| `--radius` | `0.625rem` (10px) | Base border radius |

### Semantic Text Colors (Named Hex)

| Token | Hex Value | CSS Variable | Usage |
|---|---|---|---|
| Heading | `#121317` | `--color-heading` | Page titles, card titles, bold labels |
| Body | `#45474d` | `--color-body` | Table cells, paragraph text, form fields |
| Muted | `#6b7280` | `--color-muted` / `--muted-text` | Placeholders, secondary labels, icons |

### Dark Mode (`.dark`)

| Variable | Value |
|---|---|
| `--background` | `oklch(0.145 0 0)` – deep charcoal |
| `--card` | `oklch(0.205 0 0)` – slightly elevated surface |
| `--border` | `oklch(1 0 0 / 10%)` – subtle white border |
| Heading | `#f4f4f5` |
| Body | `#d1d5db` |
| Muted | `#9ca3af` |

---

## 2. Typography

### Fonts

- **Primary font**: System font stack via `--font-sans` (set globally on `html`)
- **Monospace**: Geist Mono via `--font-geist-mono`
- Font features: `cv02`, `cv03`, `cv04`, `cv11` for refined readability

### Type Scale – Dashboard Pages

| Class / Usage | Font Size | Font Weight | Color | Tracking | Line Height |
|---|---|---|---|---|---|
| **`.page-heading`** (h1) | `22px` | `600` (semibold) | `#121317` (heading) | `tracking-tight` | `tight` |
| **`.section-heading`** (h2/h3) | `15px` | `500` (medium) | `#121317` (heading) | `tracking-tight` | default |
| **Page subtitle** (p under h1) | `12px` | `400` (regular) | `#45474d` (body) | normal | `relaxed` |
| **`.body-text`** (paragraphs, cells) | `12px` | `400` | `#45474d` | normal | `relaxed` |
| **`.muted-label`** (metadata tags) | `12px` | `500` | `muted-text / 80%` opacity | normal | default |
| **Table column header** | `12px` | `500` | `#6b7280` (muted) | normal | default |
| **Table cell body** | `14px` | `400` | `#45474d` (body) | normal | default |
| **Sidebar nav item** | `13px` | `400` | body color | `tracking-tight` | default |
| **Card stat number** | `30px` (text-3xl) | `500` | varies by semantic | `tracking-tight` | none |
| **Card stat label** | `14px` | `500` | muted, `tracking-wider` | – | default |

> **Rule:** Never use raw `text-sm`, `text-xs`, etc. directly in pages. Always apply one of the semantic classes above.

---

## 3. Spacing & Layout

### Spacing Scale

| Token | Rem | Pixels | Usage |
|---|---|---|---|
| `2xs` | `0.25rem` | 4px | Icon-text gap, micro adjustments |
| `xs` | `0.5rem` | 8px | Tight gaps inside form groups |
| `sm` | `0.75rem` | 12px | Small element internal padding |
| `md` | `1rem` | 16px | Standard item gap |
| `lg` | `1.5rem` | 24px | Card padding, grid gutters |
| `xl` | `2rem` | 32px | Page horizontal padding |
| `2xl` | `3rem` | 48px | Section vertical gap |
| `3xl` | `4rem` | 64px | Major section separators |

### Global Layout Rules

| Property | Value |
|---|---|
| Sidebar width | `280px` fixed |
| Max content width | `1440px` centered |
| Page container class | `.dashboard-page-container` |
| Page padding | `p-6` (24px) on mobile, `pt-8 md:pt-[34px]` top |
| Content gap (vertical) | `gap-6` (24px) between major sections |
| Header height (sidebar logo area) | `h-24` (96px) |
| Sidebar border | `border-r border-border/50` |

### `.dashboard-page-container`

```
padding: 24px (p-6)
gap: 24px
display: flex flex-col
min-height: 100%
max-width: 1440px
margin: auto
width: 100%
padding-top: 32px (md: 34px)
```

### `.page-header-section`

```
display: flex (col on mobile, row on md+)
align-items: flex-end (md) / start (mobile)
justify-content: space-between
gap: 16px
margin-bottom: 24px
```

---

## 4. Sidebar

| Property | Value |
|---|---|
| Width | `280px` |
| Background | `--sidebar` (`oklch(0.985 0 0)`) |
| Right border | `1px solid border/50` |
| Logo text | `24px`, weight `500`, `tracking-tighter` |
| Logo area height | `h-24` (96px), flex row, centered |
| Nav padding | `px-3` |
| Nav item gap | `gap-0.5` (2px) |
| Nav item height | `h-10` (40px) |
| Nav item radius | `rounded-lg` (8px) |
| Nav icon size | `h-4 w-4` (16px) |
| Nav text size | `13px`, weight `400`, `tracking-tight` |
| Active state color | `text-primary`, `bg-primary/5` |
| Active state weight | `font-medium` (500) |
| Inactive text | `text-muted-text` |
| Footer padding | `p-4`, `border-t border-border/50` |
| User avatar size | `h-8 w-8`, `rounded-lg` |
| Avatar background | `bg-primary/10`, icon `text-primary` |

---

## 5. Page Header (h1 + Subtitle + CTA Button)

Observed on: Users, Locations, Templates, Audits, Overview

```
+---------------------------------------------+------------------+
|  h1.page-heading  (22px / 600 / #121317)    |  [CTA Button]    |
|  p.body-text      (12px / 400 / #45474d)    |                  |
+---------------------------------------------+------------------+
```

- h1 and subtitle have `gap-2` (8px) between them
- Header section has `justify-between` layout
- On mobile: stacks vertically

---

## 6. Buttons

### Primary CTA Button (e.g. "Create User", "Publish Audit")

| Property | Value |
|---|---|
| Height | `h-11` (44px) |
| Horizontal padding | `px-5` (20px) |
| Font size | `14px` |
| Font weight | `500` (medium) |
| Icon size | `h-4 w-4` (16px) |
| Icon-label gap | `gap-2` (8px) |
| Background | `--primary` (Azure Indigo) |
| Text color | `--primary-foreground` (white) |
| Shadow | `shadow-lg shadow-primary/20` |
| Border radius | `rounded-md` (`0.625rem`) |
| Hover | `bg-primary/80` |
| Active | `active:scale-95` |
| Transition | `transition-all` |

### Outline / Secondary Button (e.g. "Filters")

| Property | Value |
|---|---|
| Height | `h-11` (44px) |
| Horizontal padding | `px-4` (16px) |
| Font size | `12px` |
| Font weight | `500` (medium) |
| Icon-label gap | `gap-2` (8px) |
| Border | `border-border/50` |
| Text color | `#6b7280` (muted) |
| Background | transparent |
| Hover | `bg-input/50` |

### Ghost Button (e.g. 3-dot action menu trigger)

| Property | Value |
|---|---|
| Size | `h-8 w-8` (32px square) |
| Padding | `p-0` |
| Inner icon | `h-4 w-4` (16px) |

### Success/Special Outline (e.g. "Load FSSAI Defaults")

| Property | Value |
|---|---|
| Height | `h-11` (44px) |
| Text color | `text-success` |
| Border | `border-success/20` |
| Hover bg | `hover:bg-success/5` |

---

## 7. Search Bar

Consistent across all list pages (Users, Locations, Templates, Audits):

| Property | Value |
|---|---|
| Height | `h-11` (44px) |
| Border | `border border-border/50` |
| Background | `bg-background` |
| Left icon | `Search` from lucide, `h-4 w-4`, positioned `left-3 top-1/2 -translate-y-1/2` |
| Left padding | `pl-9` (to clear the icon) |
| Font size | `14px` |
| Font weight | `400` |
| Text color | `#6b7280` |
| Placeholder | `#6b7280` at 70% opacity |
| Icon color default | `text-muted-text` |
| Icon color focused | `text-primary` (via `group-focus-within`) |
| Border radius | `rounded-md` from Input component |
| Transition | `transition-colors` on icon |
| Container | `relative flex-1 group` |

---

## 8. Filters Button

Sits to the right of the search bar.

| Property | Value |
|---|---|
| Same height as search | `h-11` |
| Label | "Filters" |
| Icon | `Filter` from lucide, `h-4 w-4` |
| Badge count indicator | `Badge variant="secondary"` – `h-4`, `text-[10px]`, `px-1`, `py-0`, `rounded-sm` |

---

## 9. Table

### Table Container Card

```css
class: standard-card
border: 1px solid border/50
background: card (white)
border-radius: rounded-xl (approx 14px)
box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)
hover: box-shadow 0 10px 20px -10px rgba(0,0,0,0.04)
```

### Table Header Row

```css
class: standard-table-header
background: bg-muted/30
border-bottom: 1px solid muted/30
hover: transparent (no hover on header)
```

### Table Header Cell

```css
class: standard-table-head
padding: py-3 px-4 (12px vertical, 16px horizontal)
font-size: 12px
font-weight: 500 (medium)
color: #6b7280 (muted)
```

### Table Body Row

```css
class: standard-table-row
hover background: bg-muted/10
border-bottom: 1px solid muted/20
transition: all
```

### Table Body Cell

```css
class: standard-table-cell
padding: px-4 py-3 (16px horizontal, 12px vertical)
font-size: 14px
font-weight: 400 (regular)
color: #45474d (body)
```

### Empty State Row

```
Cell spans all columns
Height: h-32 (128px) for simple; py-24 for rich empty states
Text: centered, standard-table-cell class
```

---

## 10. Badges / Bubbles (Role & Status Labels)

The canonical bubble style is: **pill-shaped, soft background, no hard border, small text**.

Observed on: Users (role column), Templates (category column), Audits (status column)

### Category / Role Badge (standard grey bubble)

Source: `/dashboard/admin/templates` – category column (e.g. "Hygiene", "Custom", "Safety")

| Property | Value |
|---|---|
| Component | `<Badge variant="secondary">` |
| Display | `inline-flex` |
| Height | `24px` (`h-6`) |
| Padding | `px-2.5 py-0.5` (10px sides / 2px top-bottom) |
| Font size | `12px` |
| Font weight | `400` (regular) |
| Background | `bg-secondary` = `oklch(0.967 0.001 286)` (very light cool grey) |
| Text color | `text-secondary-foreground` = `oklch(0.21 0.006 285.885)` (dark slate) |
| Border | none (transparent) |
| Border radius | `rounded-full` (fully rounded pill) |
| Transition | `transition-all` |

**Do NOT use** `font-semibold`, heavy borders, or hard background colors on standard category/role bubbles.

### Semantic Status Badges

| Status | Background | Text | Border |
|---|---|---|---|
| Admin role | `bg-primary` | `text-primary-foreground` (white) | none |
| Auditor / Manager role | `bg-muted/30` | `text-body` | `border border-border` |
| Published | `bg-primary/5` | `text-primary` | `border-primary/20` |
| Assigned | `bg-warning/10` | `text-warning` | `border-warning/20` |
| Active / In Progress | `bg-primary/10` | `text-primary` | `border-primary/20` |
| Completed | `bg-success/10` | `text-success` | `border-success/20` |
| Missed | `bg-destructive/10` | `text-destructive` | none |
| FSSAI Blueprint | `bg-success/10` | `text-success` | `border-success/30` |

**Universal badge rules:**
- Font size: always `12px`
- Font weight: `400` for category/role; `500` for status labels that need emphasis
- Horizontal padding: minimum `px-2` (8px each side)
- Border radius: `rounded-full` (pill shaped)
- Height: `h-6` (24px)

---

## 11. Switch / Toggle

Used in: Status column (Users, Locations, Templates), Edit dialogs

| Property | Value |
|---|---|
| Track height | `16.6px` |
| Track width | `28px` |
| Border radius | `rounded-full` |
| Checked background | `bg-primary` (Azure Indigo) |
| Unchecked background | `bg-input` (grey) |
| Thumb size | `14px x 14px` |
| Thumb background | `bg-background` (white) |
| Disabled state | `opacity-50`, `pointer-events-none` |
| Transition | `transition-all` |

> Switches in table rows are used for binary Active/Inactive state. They must be left-aligned within their cell. No surrounding label text required in the column.

---

## 12. Input Fields (Text, Email, Password)

| Property | Value |
|---|---|
| Height | `h-11` (44px) |
| Width | `w-full` |
| Border | `border border-input` (1px, `oklch(0.9 0 0)`) |
| Background | `bg-input/20` |
| Border radius | `rounded-md` (10px) |
| Padding | `px-4 py-2` |
| Font size | `14px` |
| Font weight | `400` |
| Text color | `text-body` (`#45474d`) |
| Placeholder color | `text-muted-text` (`#6b7280`) |
| Focus border | `border-ring` |
| Focus ring | `ring-2 ring-ring/30` |
| Disabled | `opacity-50, pointer-events-none` |

---

## 13. Select Dropdowns

| Property | Value |
|---|---|
| Border | `border border-input` |
| Background | `bg-input/20` |
| Border radius | `rounded-md` |
| Font size | text-body class (14px in forms) |
| Font weight | `400` |
| Text color | `text-body` |
| Placeholder | `text-muted-text` |
| Focus | `border-ring ring-2 ring-ring/30` |
| Dropdown content | `bg-popover/70 backdrop-blur-2xl`, `rounded-lg`, `ring-1 ring-foreground/10` |
| Item height | `min-h-7` (28px) |
| Item padding | `px-2 py-1` |

---

## 14. Labels (Form)

| Property | Value |
|---|---|
| Font size | `14px` (use `text-body` class) |
| Font weight | `400` (regular – NOT bold) |
| Color | `text-body` or `text-heading` |
| Margin below | use `gap-2` in the parent flex container |

> **Rule:** Labels must never be bold. Use `font-normal` explicitly.

---

## 15. Dialogs / Modals

| Property | Value |
|---|---|
| Overlay | `bg-black/80, backdrop-blur-xs` |
| Max width | `sm:max-w-[425px]` for standard, `sm:max-w-[550px]` for complex |
| Background | `bg-popover` |
| Border radius | `rounded-xl` |
| Ring | `ring-1 ring-foreground/10` |
| Close button | Ghost, `icon-sm` size, top-right absolute |
| Dialog title | `font-semibold text-heading` |
| Dialog description | `text-xs/relaxed text-muted-text` |
| Form body spacing | `space-y-4 py-6` |
| Footer layout | `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` |
| Primary action | Full width in simple dialogs; `flex-1` in multi-button footers |

### Form Field Layout Inside Dialog

```
flex flex-col gap-2
  Label (text-body, font-normal)
  Input / Select (h-11, text-body)
```

---

## 16. Alert Dialog (Destructive Confirm)

| Property | Value |
|---|---|
| Title | `font-semibold text-heading` |
| Description | `text-body font-normal` |
| Cancel button | Default outline style |
| Confirm button | `bg-destructive hover:bg-destructive/90 text-white font-medium` |

---

## 17. Dropdown Menus (Action Menus)

| Property | Value |
|---|---|
| Trigger | Ghost button, `h-8 w-8 p-0` |
| Content alignment | `align="end"` (right-aligned) |
| Content width | `w-[200px]` for filters, `w-40`/`w-48` for actions |
| Destructive item | `text-destructive focus:text-destructive` |
| Icon in item | `mr-2 h-4 w-4` |

---

## 18. Cards (Overview / Stat Cards)

| Property | Value |
|---|---|
| Class | `standard-card` |
| Padding | `p-6` (24px) |
| Background | `bg-card` (white) |
| Border | `1px solid border/50` |
| Border radius | `rounded-xl` |
| Shadow | `0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)` |
| Hover shadow | `0 10px 20px -10px rgba(0,0,0,0.04)` |
| Stat label | `text-sm font-medium tracking-wider text-muted-text` |
| Stat value | `text-3xl font-medium tracking-tight` + semantic color |
| Stat description | `body-text mt-2` |

---

## 19. Section Headers (within cards)

| Property | Value |
|---|---|
| Class | `section-heading` |
| Font size | `15px` |
| Font weight | `500` (medium) |
| Color | heading (`#121317`) |
| Tracking | `tracking-tight` |
| Subtext below | `body-text` |

---

## 20. Inline Metadata Chips (non-badge)

Used in Audits table for recurring schedule indicators like "daily":

| Property | Value |
|---|---|
| Background | `bg-primary/5` |
| Text | `text-primary` |
| Border | `border border-primary/10` |
| Padding | `px-2 py-0.5` |
| Border radius | `rounded-full` |
| Font size | `12px` (muted-label) |
| Icon | `w-3 h-3` |
| Gap | `gap-1.5` |
| Display | `inline-flex items-center w-fit` |

---

## 21. Inline Banner Feedback (Success / Error)

**Success banner** (above filters bar):

```css
bg-success/10
border: 1px solid success/50
color: text-success
padding: p-3 (12px)
border-radius: rounded-md
font-size: text-sm (14px)
font-weight: 400
animation: animate-in fade-in slide-in-from-top-1
```

**Inline form error:**

```css
color: text-destructive
font-size: text-sm (14px)
```

---

## 22. Progress Bar

Used in stat cards:

| Property | Value |
|---|---|
| Height | `h-1.5` (6px) |
| Track background | `bg-success/10` |
| Border radius | rounded pill |

---

## 23. Checkbox (Native, inside forms)

Used in location manager assignment grid:

| Property | Value |
|---|---|
| Size | `h-4 w-4` (16px) |
| Border radius | `rounded` |
| Border color | `border-gray-300` |
| Adjacent label | `text-sm font-normal cursor-pointer line-clamp-1` |

---

## 24. Empty States (Table)

| Property | Value |
|---|---|
| Cell colspan | All columns |
| Cell height | `h-32` for simple; `py-24` for rich |
| Layout | `flex flex-col items-center justify-center gap-4` |
| Icon | Lucide icon `h-8 w-8 opacity-20`, optionally in `bg-muted/10 p-4 rounded-full` |
| Text | `.page-heading opacity-40` or `.body-text` |

---

## 25. Page Anatomy – Standard List Page Template

Every dashboard list page follows this exact structure:

```tsx
<DashboardShell role="Admin|Manager|Auditor">
  <div className="dashboard-page-container">

    {/* 1. Page Header */}
    <div className="page-header-section flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="page-heading">[Page Title]</h1>
        <p className="body-text">[One-line description]</p>
      </div>
      <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2">
        <Icon className="h-4 w-4" /> [Action Label]
      </Button>
    </div>

    {/* 2. Search + Filter Bar */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search..."
          className="pl-9 h-11 text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70"
        />
      </div>
      <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
        <Filter className="h-4 w-4" /> Filters
      </Button>
    </div>

    {/* 3. Data Table */}
    <Card className="standard-card">
      <Table>
        <TableHeader className="standard-table-header">
          <TableRow className="hover:bg-transparent">
            <TableHead className="standard-table-head">Column</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="standard-table-row">
            <TableCell className="standard-table-cell">Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

  </div>
</DashboardShell>
```

---

## 26. Utility Classes Reference

| Class | Definition |
|---|---|
| `.dashboard-page-container` | `p-6 gap-6 flex flex-col min-h-full max-w-[1440px] mx-auto w-full pt-8 md:pt-[34px]` |
| `.page-header-section` | `flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6` |
| `.standard-card` | `transition-all border border-border/50 bg-card rounded-xl` + shadow |
| `.standard-table-header` | `bg-muted/30 border-b border-muted/30` |
| `.standard-table-row` | `hover:bg-muted/10 transition-all border-b border-muted/20` |
| `.standard-table-head` | `py-3 px-4 font-medium text-[12px]` + color `#6b7280` |
| `.standard-table-cell` | `px-4 py-3 text-[14px] font-normal` + color `#45474d` |
| `.page-heading` | `text-[22px] font-semibold tracking-tight text-heading leading-tight` |
| `.section-heading` | `text-[15px] font-medium text-heading tracking-tight` |
| `.body-text` | `text-[12px] font-normal leading-relaxed` + color `#45474d` |
| `.muted-label` | `text-[12px] font-medium text-muted-text/80` |

---

## 27. Dark Mode Rules

- Use semantic CSS variables everywhere – NEVER hardcode hex colors in dark-mode-aware contexts
- Use `text-heading`, `text-body`, `text-muted-text` utility classes which auto-swap in dark mode
- Exception: inline `color:` properties in chart tooltips must specify OKLCH values from tokens
- Borders in dark mode become `border/10` (10% white opacity)
- Inputs: `dark:bg-input/30`
- Sidebar: switches to `oklch(0.205 0 0)` background

---

*Last Updated: March 2026 – extracted from live screenshots of `/dashboard/admin/users`, `/dashboard/admin`, `/dashboard/admin/audits`, `/dashboard/admin/templates`*
