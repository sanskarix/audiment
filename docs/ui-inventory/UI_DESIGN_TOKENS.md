# Audiment UI Design Tokens & Global Styling (Phase 6)

This document establishes the empirical inventory of all global design tokens, CSS variables, utility rules, and typography styles currently active in the Audiment application.
**Governing Rule**: Document actual values as they exist without standardization or modification.

---

## 1. Global CSS Color Tokens (`src/styles/app.css`)

### Light Theme (`:root`)
- `--background`: `oklch(1 0 0)` (Pure white)
- `--foreground`: `oklch(0.145 0 0)` (Near black slate)
- `--card`: `oklch(1 0 0)`
- `--card-foreground`: `oklch(0.145 0 0)`
- `--popover`: `oklch(1 0 0)`
- `--popover-foreground`: `oklch(0.145 0 0)`
- `--primary`: `oklch(0.5 0.134 242.7)` (Azure Indigo)
- `--primary-foreground`: `oklch(0.977 0.013 236.62)`
- `--secondary`: `oklch(0.967 0.001 286)`
- `--secondary-foreground`: `oklch(0.21 0.006 285.885)`
- `--muted`: `oklch(0.97 0 0)`
- `--muted-foreground`: `oklch(0.556 0 0)`
- `--accent`: `oklch(0.97 0 0)`
- `--accent-foreground`: `oklch(0.205 0 0)`
- `--destructive`: `oklch(0.577 0.245 27.3)` (Ruby Crimson)
- `--destructive-foreground`: `oklch(0.98 0 0)`
- `--success`: `oklch(0.6 0.18 150)` (Emerald)
- `--success-foreground`: `oklch(0.98 0 0)`
- `--warning`: `oklch(0.8 0.12 80)` (Amber)
- `--warning-foreground`: `oklch(0.2 0.02 80)`
- `--border`: `oklch(0.9 0 0)`
- `--input`: `oklch(0.9 0 0)`
- `--ring`: `oklch(0.708 0 0)`
- `--radius`: `0.625rem` (10px)

### Dark Theme (`.dark`)
- `--background`: `oklch(0.145 0 0)`
- `--foreground`: `oklch(0.985 0 0)`
- `--card`: `oklch(0.18 0 0)`
- `--card-foreground`: `oklch(0.985 0 0)`
- `--popover`: `oklch(0.18 0 0)`
- `--popover-foreground`: `oklch(0.985 0 0)`
- `--primary`: `oklch(0.65 0.15 242.7)`
- `--primary-foreground`: `oklch(0.12 0.02 242.7)`
- `--secondary`: `oklch(0.22 0 0)`
- `--secondary-foreground`: `oklch(0.985 0 0)`
- `--muted`: `oklch(0.22 0 0)`
- `--muted-foreground`: `oklch(0.708 0 0)`
- `--accent`: `oklch(0.22 0 0)`
- `--accent-foreground`: `oklch(0.985 0 0)`
- `--destructive`: `oklch(0.704 0.191 22.216)`
- `--border`: `oklch(0.269 0 0)`
- `--input`: `oklch(0.269 0 0)`
- `--ring`: `oklch(0.439 0 0)`

---

## 2. Spacing Scale

Defined in `@theme` in `app.css`:
- `--spacing-aud-2xs`: `0.25rem` (4px)
- `--spacing-aud-xs`: `0.5rem` (8px)
- `--spacing-aud-sm`: `0.75rem` (12px)
- `--spacing-aud-md`: `1rem` (16px)
- `--spacing-aud-lg`: `1.5rem` (24px)
- `--spacing-aud-xl`: `2rem` (32px)
- `--spacing-aud-2xl`: `3rem` (48px)
- `--spacing-aud-3xl`: `4rem` (64px)

---

## 3. Border Radii Scale

- `--radius-sm`: `calc(var(--radius) * 0.6)` (6px)
- `--radius-md`: `calc(var(--radius) * 0.8)` (8px)
- `--radius-lg`: `var(--radius)` (10px)
- `--radius-xl`: `calc(var(--radius) * 1.4)` (14px)
- `--radius-2xl`: `calc(var(--radius) * 1.8)` (18px)
- `--radius-3xl`: `calc(var(--radius) * 2.2)` (22px)
- `--radius-4xl`: `calc(var(--radius) * 2.6)` (26px)

---

## 4. Custom Utility Classes (`src/styles/app.css`)

### Badges
- `.badge-base`: `inline-flex items-center px-2 py-0.5 rounded-full border-none text-[10px] font-semibold tracking-[0.025em]`
- `.badge-completed`: `h-6 px-2.5 rounded-full bg-success/10 text-success text-[12px] font-medium tracking-[0.02em]`
- `.badge-in-progress`: `h-6 px-2.5 rounded-full bg-primary/10 text-primary text-[12px] font-medium tracking-[0.02em]`
- `.badge-assigned`: `h-6 px-2.5 rounded-full bg-warning/10 text-warning text-[12px] font-medium tracking-[0.02em]`
- `.badge-missed`: `h-6 px-2.5 rounded-full bg-destructive/10 text-destructive text-[12px] font-medium tracking-[0.02em]`
- `.badge-high`: `px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-semibold tracking-[0.025em]`
- `.badge-medium`: `px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-semibold tracking-[0.025em]`
- `.badge-low`: `px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold tracking-[0.025em]`

### Stat / Metric Indicators
- `.stat-number`: `text-[32px] font-semibold tracking-[-0.03em] tabular-nums leading-tight`
- `.stat-number-lg`: `text-[36px] font-bold tracking-[-0.035em] tabular-nums leading-none`
- `.stat-label`: `text-[11px] font-medium text-muted-foreground uppercase tracking-[0.08em]`
- `.stat-sub`: `text-[12px] text-muted-foreground mt-2 tracking-[-0.005em]`

### Tactile & Action Buttons
- `.filter-btn`: `h-11 px-4 gap-2 font-medium text-[13px] border-border/50 text-muted-foreground transition-all duration-150 active:scale-[0.98]`
- `.icon-action-btn`: `h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 active:scale-90`
- `.apple-press`: `transition-transform duration-100 ease-out active:scale-[0.975] active:opacity-95`
- `.apple-press-subtle`: `transition-transform duration-100 ease-out active:scale-[0.985]`

---

## 5. Website Stylesheets
- `src/styles/website-audiment.css` (110 KB): Landing page styling, hero glow effects, testimonial tickers.
- `src/styles/website-style.css` (56 KB): Marketing grid layouts, typography tokens for solutions and comparisons.
- `src/styles/website.css` (8.9 KB): Base resets and public website navbar rules.
- `src/styles/website-scroll-reveal.css` (177 B): Scroll reveal animations.
