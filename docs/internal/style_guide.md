# Audiment Global Design System & Style Guide
### Single Source of Truth for Dashboard, Mobile, and Landing Pages

> **Scope:** This document defines the visual language and implementation patterns for the entire Audiment ecosystem. It covers the Landing Page (`/`), Auth Screens (`/login`), and all Dashboard routes (`/dashboard/**`). Following these specs ensures a cohesive, premium brand experience across all touchpoints.

---

## 1. Color System (OKLCH)

We use the **OKLCH** color space for better perceptual uniformity and more vibrant colors. The primary theme is **Modern Slate + Azure Indigo**.

### 1.1 Core UI Tokens (Dashboard & Auth)

These tokens change based on the theme (Light/Dark).

| Variable | Light Mode (Preset: `b1D5T6NG`) | Dark Mode | Usage |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.18 0.02 240)` | Main app background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary text color |
| `--card` | `oklch(1 0 0)` | `oklch(0.22 0.025 240)` | Surface for cards/dialogs |
| `--primary` | `oklch(0.5 0.134 242.7)` | `oklch(0.55 0.15 240)` | **Azure Indigo** CSAs & core branding |
| `--secondary` | `oklch(0.967 0.001 286)` | `oklch(0.28 0.03 240)` | Low-priority buttons & backgrounds |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.28 0.03 240)` | Subtle backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.75 0.02 240)` | Metadata and placeholder text |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.28 0.03 240)` | Hover states |
| `--border` | `oklch(0.9 0 0)` | `oklch(1 0 0 / 15%)` | Dividers and strokes |
| `--input` | `oklch(0.9 0 0)` | `oklch(1 0 0 / 20%)` | Form field borders |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.55 0.15 240)` | Focus ring color |

### 1.2 Semantic & Brand Tokens

| Token | CSS Variable | Value (Light) | Context |
|---|---|---|---|
| **Heading** | `--color-heading` | `#121317` | h1, h2, h3, card titles |
| **Body text** | `--color-body` | `#45474d` | Paragraphs, table cells |
| **Muted text** | `--color-muted` | `#6b7280` | Labels, icons, placeholders |
| **Success** | `--success` | `oklch(0.6 0.18 150)` | Completed audits, passed items |
| **Warning** | `--warning` | `oklch(0.8 0.12 80)` | Flagged items, surprise audits |
| **Destructive** | `--destructive` | `oklch(0.577 0.245 27.3)` | Error states, delete actions |

### 1.3 Landing Page Palette

The landing page uses a more high-contrast, "Noir" inspired palette.

- **Backgrounds**: `neutral-50` (soft light), `white`, `neutral-950` (deep dark).
- **Text**: `neutral-900` (primary), `neutral-500` (secondary), `neutral-400` (on dark).
- **Accents**: `emerald-400` / `emerald-500` for "Verification" and "Audit Proof" messaging.

---

## 2. Typography

### 2.1 Fonts & Features
- **Sans (Primary)**: System font stack via `--font-sans`.
- **Mono**: Geist Mono via `--font-geist-mono`.
- **Feature Settings**: `cv02`, `cv03`, `cv04`, `cv11` are enforced for maximum readability (sharpness, legible digits).

### 2.2 Functional Type Scale (Dashboard)

| Class | Usage | Size | Weight | Color |
|---|---|---|---|---|
| `.page-heading` | Main Title | `22px` | Semibold (`600`) | `text-heading` |
| `.section-heading` | Card/Section | `15px` | Medium (`500`) | `text-heading` |
| `.body-text` | Paragraph/Cell | `12px` | Regular (`400`) | `text-body` |
| `.muted-label` | Tags/Metadata | `12px` | Medium (`500`) | `text-muted-text/80` |
| **Table Head** | Column Labels | `12px` | Medium (`500`) | `#6b7280` |
| **Table Cell** | Data Content | `14px` | Regular (`400`) | `text-body` |

### 2.3 Landing Page Type Scale
- **Hero Title**: `text-5xl md:text-7xl`, `font-semibold`, `tracking-tight`.
- **Section Heading**: `text-4xl md:text-5xl`, `font-semibold`, `tracking-tight`.
- **Sub-headline**: `text-lg md:text-xl`, `font-normal`, `text-neutral-500`.

---

## 3. Spacing & Border Radius

### 3.1 Audiment Spacing Scale
Always use these variables (or Tailwind `aud-` prefix) for consistent vertical/horizontal gaps.

| Token | Rem | Pixels |
|---|---|---|
| `--spacing-aud-2xs` | `0.25rem` | 4px |
| `--spacing-aud-xs` | `0.5rem` | 8px |
| `--spacing-aud-sm` | `0.75rem` | 12px |
| `--spacing-aud-md` | `1rem` | 16px |
| `--spacing-aud-lg` | `1.5rem` | 24px |
| `--spacing-aud-xl` | `2rem` | 32px |
| `--spacing-aud-2xl` | `3rem` | 48px |
| `--spacing-aud-3xl` | `4rem` | 64px |

### 3.2 Border Radius (`--radius`)
Default radius is `0.625rem` (10px). The scale is relative to this:
- **`sm`**: `radius * 0.6` (6px)
- **`md`**: `radius * 0.8` (8px) - *Default for Buttons/Inputs*
- **`lg`**: `radius` (10px)
- **`xl`**: `radius * 1.4` (14px) - *Default for Cards*
- **`2xl` to `4xl`**: Used for large containers and landing page sections.

---

## 4. Components & Layout Patterns

### 4.1 Dashboard Shell Anatomy
- **Sidebar Width**: `280px` fixed.
- **Max Content Width**: `1440px`.
- **Page Container**: `.dashboard-page-container` (internal padding `p-6`).
- **Section Headers**: `.page-header-section` (flex-row, justify-between, gap-4).

### 4.2 Standard UI Elements

#### Buttons
- **Primary**: `h-11`, `px-5`, `rounded-md`, `bg-primary`, `shadow-lg shadow-primary/20`.
- **Secondary/Outline**: `h-11`, `px-4`, `border-border/50`, `text-muted-text`.
- **Ghost/Icon**: `h-8`, `w-8`, `p-0`.

#### Cards (`.standard-card`)
- **Border**: `1px solid border/50`.
- **Background**: `bg-card`.
- **Shadow**: Subtle lift (`0 1px 3px rgba(0,0,0,0.02)`).
- **Hover**: Scale/Shadow transition.

#### Badges & Status
- **Style**: Pill-shaped (`rounded-full`), soft background (`bg-x/10`), `text-[12px]`.
- **Examples**: 
    - Published: `bg-primary/5 text-primary border-primary/20`
    - Completed: `bg-success/10 text-success border-success/20`
    - Destructive: `bg-destructive/10 text-destructive`

### 4.3 Advanced Visuals

#### Glassmorphism
Used for popovers, navbars, and elevated UI on landing pages.
- **`.glass`**: `bg-white/70 backdrop-blur-xl border-white/20`.
- **`.glass-dark`**: `bg-black/50 backdrop-blur-xl border-white/10`.

#### Charts
Use the defined chart tokens for multi-series data:
`--chart-1` (Slate light) → `--chart-5` (Slate deep).

---

## 5. Motion & Interaction

### 5.1 Global Keyframes
| Name | Description | Used In |
|---|---|---|
| `scroll` | Endless horizontal scroll | Social proof logobar |
| `mesh-gradient` | Animated organic background | Hero sections |
| `float` | Subtle vertical hover | Interaction hints |
| `spotlight` | Radial reveal on hover | Dark-mode cards |

### 5.2 Micro-interactions
- **Active state**: All buttons should have `active:scale-95 transition-transform`.
- **Entry animations**: Tables and lists should use `animate-in fade-in slide-in-from-bottom-2`.

---

## 6. Layout Guidelines (Landing Page)

### 6.1 Section Standard
- **Vertical Padding**: `py-24 md:py-32`.
- **Horizontal Padding**: `px-6`.
- **Content Max-Width**: `max-w-6xl mx-auto`.
- **Section Transitions**: Alternate between `bg-white` and `bg-neutral-50` or `bg-neutral-950`.

---

## 7. Developer Rules

1.  **Never hardcode hex colors**: Use CSS variables or Tailwind utility classes (`text-primary`, `bg-background`).
2.  **Semantic Typography**: Never use `text-sm` directly; use `.body-text` or `.page-heading` to ensure font-features and weights are correct.
3.  **Variable Opacity**: Use Tailwind's slash syntax for borders and backgrounds (e.g., `border-border/50`, `bg-primary/10`).
4.  **Dark Mode Compliance**: Check every component with the `.dark` class. Ensure `bg-card` and `bg-background` provide enough contrast.

---

*Last Updated: April 2026 – Synchronized with globals.css v2.4 (Azure Indigo Theme)*
