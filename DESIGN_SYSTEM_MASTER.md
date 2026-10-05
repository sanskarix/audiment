# Audiment Master UI Design System & Brand Visual Language
### Canonical Specification & Code Component Library for Marketing Campaigns, Brand Creatives & UI Engineering

> **Audience & Portability Notice:** This document is the standalone, canonical single source of truth for the **Design, Marketing, and Engineering teams** at Audiment and Asellus Studio. It is 100% self-contained and portable—it can be shared, emailed, synced to Figma, or pushed to GitHub without broken local machine paths. All code components (React TSX, Tailwind v4, pure CSS, and inline SVGs) are included in full.

---

## Table of Contents
1. [Brand Narrative Anchor & Dual-System Architecture](#1-brand-narrative-anchor--dual-system-architecture)
2. [Color Tokens & Exact Mathematical Formulas](#2-color-tokens--exact-mathematical-formulas)
3. [Typography & Optical Rules](#3-typography--optical-rules)
4. [Signature Striped Patterns (Code Components)](#4-signature-striped-patterns-code-components)
5. [Architectural Blueprint & Drafting Components](#5-architectural-blueprint--drafting-components)
6. [Card, Grid & Container Components](#6-card-grid--container-components)
7. [Status Badges & Verification Seals](#7-status-badges--verification-seals)
8. [Navigation & Header Component](#8-navigation--header-component)
9. [Marketing Campaign & Creative Templates](#9-marketing-campaign--creative-templates)
10. [Spacing, Borders, Radii & Elevation](#10-spacing-borders-radii--elevation)
11. [Embedded Vector Brand Assets](#11-embedded-vector-brand-assets)
12. [Brand Voice, Copy Directives & Do's / Don'ts](#12-brand-voice-copy-directives--dos--donts)

---

## 1. Brand Narrative Anchor & Dual-System Architecture

### 1.1 The Narrative Anchor
> **"You can't be everywhere."**  
> Multi-location operators cannot physically inspect every branch every day. Audiment replaces unreliable manual checks and "pencil-whipping" with **ground-truth operational accountability** through timestamped photo proof, Flash Verification (video presence audits), and automated 48-hour CAPA workflows.

### 1.2 Dual-System Visual Architecture

```
+---------------------------------------------------------------------------------------------------+
| AUDIMENT DUAL-SYSTEM ARCHITECTURE                                                                |
+-----------------------------------+---------------------------------------------------------------+
| System 1: Editorial Marketing Web | Asellus Design Language:                                      |
|    - Landing Page (`/`)           | - High-contrast Paper (`#FAFAFA`) & Ink (`#181818`)          |
|    - Solutions (`/solutions/*`)   | - High-voltage Electric Orange (`#FF5400`)                    |
|    - Use Cases (`/use-cases/*`)   | - Hairline 1px architectural framing (`#e8e8e8`)              |
|    - Blog & Hub (`/blog/*`)       | - Non-bold headers (`font-weight: 400 !important`)           |
|    - Compare Pages (`/compare/*`) | - Signature animated diagonal stripes & blueprint drafting    |
|    - Marketing & Ad Creatives     | - Analog grain overlay (`/noise.webp` 5% opacity)             |
+-----------------------------------+---------------------------------------------------------------+
| System 2: Operations Application  | High-Density Modern Slate:                                    |
|    - Auth Portal (`/login`)       | - Clean slate canvas (`oklch(1 0 0)` / Dark `oklch(0.18...)`) |
|    - App Shell (`/dashboard/*`)   | - Functional Azure Indigo (`oklch(0.5 0.134 242.7)`)         |
|    - CAPA Resolution Trays        | - Strict semantic status badges (Pass, Warning, Critical)     |
|    - Flashmob Video Verification  | - Micro-typography (12px-14px) optimized for high data density|
+-----------------------------------+---------------------------------------------------------------+
```

---

## 2. Color Tokens & Exact Mathematical Formulas

### 2.1 Marketing & Public Website Palette (Asellus System)

| Token Name | CSS Variable | Hex Code | RGB Value | HSL Value | Dark Mode | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Orange** | `--orange` / `--primary` | `#FF5400` | `255, 84, 0` | `20°, 100%, 50%` | `#FF5400` | Primary action CTAs, brand highlights, indicator dots. |
| **Orange Hover** | — | `#E04A00` | `224, 74, 0` | `20°, 100%, 44%` | `#FF6A1A` | Hover & active state for primary buttons. |
| **Paper Canvas** | `--paper` / `--background`| `#FAFAFA` | `250, 250, 250`| `0°, 0%, 98%` | `#121212` | Public page background, striped track base. |
| **Deep Ink** | `--ink` / `--foreground` | `#181818` | `24, 24, 24` | `0°, 0%, 9%` | `#FAFAFA` | Main headlines, brand logo, high-contrast labels. |
| **Body Charcoal**| `--color-body` | `#45474d` | `69, 71, 77` | `225°, 5%, 29%` | `#e4e4e7` | Reading paragraphs, explanations, list items. |
| **Muted Slate** | `--muted` / `--color-muted`| `#737373` | `115, 115, 115`| `0°, 0%, 45%` | `#a1a1aa` | Metadata, breadcrumbs, tags, timestamps. |
| **Hairline Grid**| `--line` / `--border` | `#e8e8e8` | `232, 232, 232`| `0°, 0%, 91%` | `rgba(255,255,255,0.12)`| 1px architectural divider lines and card borders. |
| **Secondary Tint**| `--secondary` | `#f2f2f0` | `242, 242, 240`| `60°, 5%, 95%` | `#262626` | Pill badges, soft icon backdrops, hover surfaces. |
| **Grounding Dark**| — | `#0d0d0f` | `13, 13, 15` | `240°, 7%, 5%` | `#08080a` | Deep footer canvas, dark mockups, terminal panels. |
| **Dark Border** | — | `rgba(255, 255, 255, 0.08)` | — | — | — | Hairline divider lines inside dark sections. |

#### Volumetric Orange Glow Tokens (Dark Canvas Hover State)
```css
/* Multi-tiered volumetric orange glow stack */
filter: drop-shadow(0 0 20px rgba(255, 84, 0, 0.85))
        drop-shadow(0 0 50px rgba(255, 84, 0, 0.55))
        drop-shadow(0 0 90px rgba(255, 84, 0, 0.35));

/* Ambient radial backdrop glow */
background: radial-gradient(circle, rgba(255, 84, 0, 0.07) 0%, rgba(13, 13, 15, 0) 70%);
```

---

### 2.2 Application & Dashboard Tokens (OKLCH Color Space)

| Token | Light Mode Value | Dark Mode Value | Usage Context |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(1 0 0)` | `oklch(0.18 0.02 240)` | Main application viewport |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary interface text |
| `--card` | `oklch(1 0 0)` | `oklch(0.22 0.025 240)` | Data tables, inspection cards, modal bodies |
| `--primary` | `oklch(0.5 0.134 242.7)` | `oklch(0.55 0.15 240)` | Azure Indigo for action CTAs & active tabs |
| `--secondary` | `oklch(0.967 0.001 286)` | `oklch(0.28 0.03 240)` | Secondary buttons, filters, toolbars |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.28 0.03 240)` | Table alternate rows, subtle container backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.75 0.02 240)` | Helper captions, column headers, disabled text |
| `--border` | `oklch(0.9 0 0)` | `oklch(1 0 0 / 15%)` | Table borders, container boundaries |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.55 0.15 240)` | Keyboard navigation focus rings |
| `--success` | `oklch(0.6 0.18 150)` | `oklch(0.5 0.15 150)` | Passed audit, 100% score, CAPA resolved |
| `--warning` | `oklch(0.8 0.12 80)` | `oklch(0.75 0.15 80)` | Pending CAPA, surprise audit queued, score drift |
| `--destructive` | `oklch(0.577 0.245 27.3)` | `oklch(0.704 0.191 22.216)`| Critical violation, failed audit, delete action |

---

## 3. Typography & Optical Rules

### 3.1 Typefaces & Stylistic Sets
- **Sans-Serif (Primary):** `Geist, Arial, sans-serif` (`--font-sans` with `Inter` fallback).
- **Monospace (Telemetry & Metrics):** `Geist Mono, monospace` (`--font-geist-mono`). Used for GPS coordinates, timestamps, audit IDs, percentage metrics, and JSON payloads.
- **OpenType Stylistic Sets:** Enforced globally:
  ```css
  body {
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
  ```
  *(Enables flat-top numerals, slashed zero for audit IDs, and open geometric terminals).*

### 3.2 The Golden Rule of Audiment Headings
> ⚠️ **CRITICAL BRAND DIRECTIVE:**
> ```css
> h1, h2, h3, h4, h5, h6 {
>   font-weight: 400 !important;
> }
> ```
> **Never use bold (700/800) font weights on titles or page headlines.** Audiment communicates authority through **scale, optical kerning, and negative space**, creating a refined, precision architectural identity.

### 3.3 Marketing Type Scale

| Role | Selector | Size (Desktop) | Size (Mobile) | Weight | Tracking | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Headline** | `h1`, `.hero-title` | `56px - 72px` | `38px - 44px` | `400` | `-0.04em` | `1.08` |
| **Section Title** | `h2`, `.intro h2` | `32px - 36px` | `26px - 28px` | `400` | `-0.04em` | `1.18` |
| **Card / Subsection**| `h3`, `.aud-card h3`| `18px` | `17px` | `500` | `-0.03em` | `1.30` |
| **Lead Subheadline** | `.lead-text` | `16.5px - 18px`| `15px - 16px` | `400` | `-0.01em` | `1.65` |
| **Body Paragraph** | `p`, `.aud-card p` | `14.5px - 15px`| `14px` | `400` | `0` | `1.70` |
| **Micro / Metadata** | `.muted-label` | `12px` | `11px` | `500` | `+0.04em` | `1.40` |
| **Section Tag Pill** | `.badge-tag` | `11px - 12px` | `11px` | `500` | `+0.05em` | `1.00` |

---

## 4. Signature Striped Patterns (Code Components)

Audiment utilizes custom repeating-linear-gradient strip patterns across multiple UI components.

### 4.1 Pattern A: Signature Moving Diagonal Thick Stripes (Footer Dynamic Canvas)

#### CSS Rules:
```css
.footer-moving-stripes {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    135deg,
    transparent 0px,
    transparent 20px,
    rgba(255, 255, 255, 0.08) 20px,
    rgba(255, 255, 255, 0.08) 40px
  );
  background-size: 56.568px 56.568px;
  animation: moveThickLightStripes 1.8s linear infinite;
}

@keyframes moveThickLightStripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 56.568px 0;
  }
}

.footer-glow-backdrop {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 350px;
  background: radial-gradient(circle, rgba(255, 84, 0, 0.07) 0%, rgba(13, 13, 15, 0) 70%);
  pointer-events: none;
}
```

#### React Component (`FooterMovingStripes.tsx`):
```tsx
import React from 'react';

export const FooterMovingStripes: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#0d0d0f] py-20 border-t border-white/10">
      {/* Signature Moving Stripes */}
      <div className="footer-moving-stripes" aria-hidden="true" />
      {/* Warm Volumetric Ambient Glow */}
      <div className="footer-glow-backdrop" aria-hidden="true" />
      
      <div className="relative z-10 max-w-[1248px] mx-auto px-6 text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#FF5400] bg-[#FF5400]/10 px-3 py-1 rounded-full border border-[#FF5400]/20">
          OPERATIONAL RUNTIME ENGINE
        </span>
        <h3 className="text-white text-3xl font-normal mt-4 tracking-tight">
          Ground-truth verification across every branch.
        </h3>
      </div>
    </div>
  );
};
```

---

### 4.2 Pattern B: Precision Editorial Diagonal Micro-Stripes (Section Track)

Used on full-width transition tracks and category navigation bars.

#### CSS Rules:
```css
.aud-striped-track {
  background-color: #FAFAFA;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 12px,
    rgba(0, 0, 0, 0.035) 12px,
    rgba(0, 0, 0, 0.035) 13px
  );
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
```

#### React Component (`StripedSection.tsx`):
```tsx
import React from 'react';

interface StripedSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const StripedSection: React.FC<StripedSectionProps> = ({ title, subtitle, children }) => {
  return (
    <section className="aud-striped-track w-full py-16">
      <div className="max-w-[1248px] mx-auto px-6">
        {(title || subtitle) && (
          <div className="max-w-[760px] mb-12">
            {title && (
              <h2 className="text-[32px] font-normal tracking-[-0.03em] leading-[1.25] text-[#181818] m-0 mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[16.5px] leading-[1.6] text-[#737373] m-0">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
```

---

### 4.3 Pattern C: Sleek Category Tabs Bar with Signature Stripes

#### React Component (`CategoryTabsBar.tsx`):
```tsx
'use client';
import React, { useState } from 'react';

const CATEGORIES = [
  'All Operations',
  'Multi-Location Audits',
  'FSSAI & Food Safety',
  '48h CAPA Tracking',
  'Flash Verification',
  'Preventing Drift',
];

export const CategoryTabsBar: React.FC = () => {
  const [active, setActive] = useState('All Operations');

  return (
    <div className="w-full border-t border-b border-[#e8e8e8] bg-[#FAFAFA] [background-image:repeating-linear-gradient(-45deg,transparent,transparent_12px,rgba(0,0,0,0.035)_12px,rgba(0,0,0,0.035)_13px)]">
      <div className="max-w-[1248px] mx-auto px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#181818] text-white shadow-sm'
                    : 'bg-white text-[#737373] border border-[#e8e8e8] hover:text-[#181818] hover:border-[#bbbbbb]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

---

### 4.4 Pattern D: Compact Pre-Footer Operational CTA Strip

#### React Component (`PreFooterCtaStrip.tsx`):
```tsx
import React from 'react';
import { DotBorderButton } from './DotBorderButton';

export const PreFooterCtaStrip: React.FC = () => {
  return (
    <section className="relative w-full bg-[#FAFAFA] border-t border-[#e8e8e8] z-10" aria-label="Book a demo">
      <div className="max-w-[1248px] mx-auto px-12 py-12 border-l border-r border-[#e8e8e8] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-normal tracking-[-0.02em] text-[#181818] m-0 mb-1.5">
            Ready to see what&apos;s actually happening at your <span className="text-[#FF5400]">branches?</span>
          </h2>
          <p className="text-[14.5px] text-[#737373] m-0">
            Book a 20-minute operational walkthrough with our founding team.
          </p>
        </div>
        <div>
          <DotBorderButton label="Book a Demo" variant="orange" href="https://cal.com/audiment/demo" />
        </div>
      </div>
    </section>
  );
};
```

---

## 5. Architectural Blueprint & Drafting Components

### 5.1 The Blueprint Dot-Border Button (Global System)

Features 4 corner registration crosshair dots, 4 drawing border lines on hover, and an animated 45° drafting grid.

```
       +--- line top (draws left to right) ---+
       |                                      |
  dot [.]                                    [.] dot
       |            [ BOOK A CALL ]           |
  dot [.]                                    [.] dot
       |                                      |
       +-- line bottom (draws right to left) -+
```

#### CSS Engine:
```css
.btn-wrapper {
  --dot-size: 7px;
  --line-weight: 1px;
  --line-distance: 6px;
  --animation-speed: 0.18s;
  --dot-color: #FF5400;
  --line-color: rgba(255, 84, 0, 0.85);
  --grid-color: rgba(255, 84, 0, 0.2);
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  padding: var(--line-distance);
  background-color: transparent;
  user-select: none;
  border-radius: 100px;
  vertical-align: middle;
}

.btn-wrapper--orange {
  --dot-color: #FF5400;
  --line-color: rgba(255, 84, 0, 0.85);
  --grid-color: rgba(255, 84, 0, 0.2);
}

.btn-wrapper--dark {
  --dot-color: #ffffff;
  --line-color: rgba(255, 255, 255, 0.8);
  --grid-color: rgba(255, 255, 255, 0.2);
}

.btn-wrapper::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background-image: repeating-linear-gradient(45deg, var(--grid-color) 0 1px, transparent 2px 5px);
  opacity: 0;
  z-index: -1;
}

.btn-wrapper:hover::after {
  animation: opacity-anim calc(var(--animation-speed) * 3) ease-in-out forwards;
}

@keyframes opacity-anim {
  80% { opacity: 0; }
  100% { opacity: 1; }
}

.btn-wrapper .dot {
  position: absolute;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 2px;
  background-color: var(--dot-color);
  pointer-events: none;
  transition: all 0.3s ease-in-out;
}

.btn-wrapper .dot.top.left { top: 0; left: 0; transform-origin: top left; }
.btn-wrapper .dot.top.right { top: 0; right: 0; transform-origin: top right; }
.btn-wrapper .dot.bottom.left { bottom: 0; left: 0; transform-origin: bottom left; }
.btn-wrapper .dot.bottom.right { bottom: 0; right: 0; transform-origin: bottom right; }

.btn-wrapper .line {
  position: absolute;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  z-index: 9;
}

.btn-wrapper .line.horizontal {
  height: var(--line-weight);
  width: 100%;
  background-image: repeating-linear-gradient(90deg, transparent 0 calc(var(--line-weight)*2), var(--line-color) calc(var(--line-weight)*2) calc(var(--line-weight)*4));
}

.btn-wrapper .line.vertical {
  width: var(--line-weight);
  height: 100%;
  background-image: repeating-linear-gradient(0deg, transparent 0 calc(var(--line-weight)*2), var(--line-color) calc(var(--line-weight)*2) calc(var(--line-weight)*4));
}

.btn-wrapper .line.top { top: calc(var(--line-weight) * -0.5); transform-origin: top left; transform: rotate(5deg) scaleX(0); }
.btn-wrapper:hover .line.top { animation: draw-top var(--animation-speed) ease-in-out forwards; animation-delay: calc(var(--animation-speed) * 0.8); }

.btn-wrapper .line.bottom { bottom: calc(var(--line-weight) * -0.5); transform-origin: bottom right; transform: rotate(5deg) scaleX(0); }
.btn-wrapper:hover .line.bottom { animation: draw-bottom var(--animation-speed) ease-in-out forwards; animation-delay: calc(var(--animation-speed) * 2); }

.btn-wrapper .line.left { left: calc(var(--line-weight) * -0.5); transform-origin: bottom left; transform: rotate(0deg) scaleY(0); }
.btn-wrapper:hover .line.left { animation: draw-left var(--animation-speed) ease-in-out forwards; animation-delay: calc(var(--animation-speed) * 2.4); }

.btn-wrapper .line.right { right: calc(var(--line-weight) * -0.5); transform-origin: top right; transform: rotate(0deg) scaleY(0); }
.btn-wrapper:hover .line.right { animation: draw-right var(--animation-speed) ease-in-out forwards; animation-delay: calc(var(--animation-speed) * 1.6); }

@keyframes draw-top { 100% { transform: rotate(0deg) scaleX(1); } }
@keyframes draw-bottom { 100% { transform: rotate(0deg) scaleX(1); } }
@keyframes draw-left { 100% { transform: rotate(0deg) scaleY(1); } }
@keyframes draw-right { 100% { transform: rotate(0deg) scaleY(1); } }

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 24px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 100px;
  color: #181818;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.button:hover {
  background: #F5F3EE;
  border-color: #bbbbbb;
  transform: scale(1.03);
}

.button:active {
  transform: scale(0.98);
}

.button--orange {
  background: #FF5400;
  border-color: #FF5400;
  color: #fff;
}

.button--orange:hover {
  background: #E04A00;
  border-color: #E04A00;
  color: #fff;
}
```

#### React Component (`DotBorderButton.tsx`):
```tsx
import React from 'react';

interface DotBorderButtonProps {
  label: string;
  href?: string;
  variant?: 'default' | 'orange' | 'dark';
  onClick?: (e: React.MouseEvent) => void;
  id?: string;
}

export const DotBorderButton: React.FC<DotBorderButtonProps> = ({
  label,
  href = '#',
  variant = 'orange',
  onClick,
  id,
}) => {
  const wrapClass = `btn-wrapper${
    variant === 'orange' ? ' btn-wrapper--orange' : variant === 'dark' ? ' btn-wrapper--dark' : ''
  }`;
  const btnClass = `button${variant === 'orange' ? ' button--orange' : ''}`;

  return (
    <div className={wrapClass}>
      <span className="dot top left" />
      <span className="dot top right" />
      <span className="dot bottom left" />
      <span className="dot bottom right" />
      <span className="line horizontal top" />
      <span className="line horizontal bottom" />
      <span className="line vertical left" />
      <span className="line vertical right" />
      <a className={btnClass} href={href} onClick={onClick} id={id}>
        {label}
      </a>
    </div>
  );
};
```

---

### 5.2 Screen-Wide Hollow Stroked Brand Logotype

#### CSS Rules:
```css
.hollow-brand-text {
  display: inline-block;
  font-size: clamp(48px, 11vw, 136px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.14);
  line-height: 0.9;
  user-select: none;
  cursor: pointer;
  transition: -webkit-text-stroke-color 0.5s ease, filter 0.5s ease;
}

.footer-brand-wrap:hover .hollow-brand-text,
.hollow-brand-text:hover {
  color: transparent !important;
  -webkit-text-stroke: 1.8px #FF5400 !important;
  filter: drop-shadow(0 0 20px rgba(255, 84, 0, 0.85))
          drop-shadow(0 0 50px rgba(255, 84, 0, 0.55))
          drop-shadow(0 0 90px rgba(255, 84, 0, 0.35)) !important;
}
```

#### React Component (`HollowBrandLogotype.tsx`):
```tsx
import React from 'react';

export const HollowBrandLogotype: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div
      className="footer-brand-wrap w-full py-16 flex items-center justify-center bg-[#0d0d0f] border-t border-white/10"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="hollow-brand-text">
        AUDIMENT
      </span>
    </div>
  );
};
```

---

## 6. Card, Grid & Container Components

### 6.1 Architectural Standard Card (`AudimentCard.tsx`)

#### React Component:
```tsx
import React from 'react';

interface AudimentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  dark?: boolean;
}

export const AudimentCard: React.FC<AudimentCardProps> = ({ title, description, icon, dark = false }) => {
  if (dark) {
    return (
      <div className="p-10 bg-[#111111] border-r border-[#1e1e1e] last:border-r-0 hover:bg-[#171717] transition-colors duration-200">
        <div className="w-11 h-11 border border-white/10 bg-white/5 grid place-items-center mb-6 text-[#e5e5e5]">
          {icon}
        </div>
        <h3 className="m-0 mb-3 text-[18px] font-medium tracking-[-0.03em] leading-[1.3] text-[#f5f5f5]">
          {title}
        </h3>
        <p className="m-0 text-[14.5px] leading-[1.7] text-[#999999]">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white border-r border-[#e8e8e8] last:border-r-0 hover:bg-[#fbfbfb] transition-colors duration-200">
      <div className="w-11 h-11 border border-[#e8e8e8] bg-[#FAFAFA] grid place-items-center mb-6 text-[#181818]">
        {icon}
      </div>
      <h3 className="m-0 mb-3 text-[18px] font-medium tracking-[-0.03em] leading-[1.3] text-[#181818]">
        {title}
      </h3>
      <p className="m-0 text-[14.5px] leading-[1.7] text-[#555555]">
        {description}
      </p>
    </div>
  );
};
```

---

### 6.2 Three-Column Area Architecture Grid (`ThreeAreasGrid.tsx`)

Features sharp architectural corners (`rounded-none`), hairline borders, and an animated underline on link hover.

#### React Component:
```tsx
import React from 'react';

export interface AreaItem {
  number: string;
  tag: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export const ThreeAreasGrid: React.FC<{ items: AreaItem[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 w-full">
      {items.map((item) => (
        <a
          key={item.number}
          href={item.href}
          className="group flex flex-col justify-between bg-white border border-[#e8e8e8] p-8 rounded-none transition-colors duration-200 hover:border-[#bbbbbb] no-underline"
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#e8e8e8] mb-6">
              <span className="text-[12px] font-mono text-[#737373] tracking-[0.05em] uppercase">
                {item.number}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#FF5400] bg-[#FF5400]/10 px-2 py-0.5 rounded-full border border-[#FF5400]/20">
                {item.tag}
              </span>
            </div>
            <h3 className="text-xl font-normal text-[#181818] tracking-tight mb-3">
              {item.title}
            </h3>
            <p className="text-[14.5px] text-[#45474d] leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="mt-7 inline-flex items-center text-[13px] font-semibold text-[#FF5400]">
            <span className="relative">
              {item.linkText}
              <span className="absolute left-0 bottom-[-2px] w-full h-[1.5px] bg-[#FF5400] scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-300" />
            </span>
            <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </div>
        </a>
      ))}
    </div>
  );
};
```

---

## 7. Status Badges & Verification Seals

### 7.1 Status Badge Component (`StatusBadge.tsx`)

#### React Component:
```tsx
import React from 'react';

export type BadgeStatus = 'passed' | 'warning' | 'destructive' | 'neutral' | 'live';

interface StatusBadgeProps {
  status: BadgeStatus;
  label: string;
  metric?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, metric }) => {
  const styles: Record<BadgeStatus, string> = {
    passed: 'bg-[oklch(0.6_0.18_150)]/10 text-[oklch(0.6_0.18_150)] border-[oklch(0.6_0.18_150)]/20',
    warning: 'bg-[oklch(0.8_0.12_80)]/10 text-[#a16207] border-[oklch(0.8_0.12_80)]/30',
    destructive: 'bg-[oklch(0.577_0.245_27.3)]/10 text-[oklch(0.577_0.245_27.3)] border-[oklch(0.577_0.245_27.3)]/20',
    neutral: 'bg-black/5 text-[#737373] border-black/10',
    live: 'bg-[#FF5400]/10 text-[#FF5400] border-[#FF5400]/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium border whitespace-nowrap ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-currentColor shrink-0" />
      <span>{label}</span>
      {metric && <span className="font-mono text-[11px] opacity-80">[{metric}]</span>}
    </span>
  );
};
```

---

## 8. Navigation & Header Component

### 8.1 Sticky Frosted Glass Header with Noise Grain (`Header.tsx`)

#### React Component:
```tsx
import React from 'react';
import { DotBorderButton } from './DotBorderButton';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[rgba(250,250,250,0.72)] backdrop-blur-xl border-b border-[#e8e8e8] overflow-hidden">
      <div className="relative z-10 flex items-center justify-between max-w-[1248px] h-[72px] mx-auto px-7 border-l border-r border-[#e8e8e8]">
        {/* Brand Mark */}
        <a href="/" className="flex items-center gap-2 text-[#181818] font-semibold text-lg tracking-tight no-underline">
          <span className="w-6 h-6 rounded-full bg-[#FF5400] text-white text-xs grid place-items-center font-bold">
            A
          </span>
          <span className="font-normal text-xl tracking-[-0.04em]">audiment</span>
        </a>

        {/* Navigation Links with Sliding Orange Underline */}
        <nav className="hidden md:flex items-center gap-7">
          {[
            { label: 'Features', href: '/#features' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Use Cases', href: '/use-cases' },
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-[#555555] hover:text-[#181818] text-[14px] font-medium tracking-tight py-1 no-underline transition-colors duration-150"
            >
              {link.label}
              <span className="absolute bottom-[-2px] left-0 w-full h-[1.5px] bg-[#FF5400] scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-200" />
            </a>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <a href="/login" className="text-[14px] font-medium text-[#555555] hover:text-[#181818] no-underline">
            Sign in
          </a>
          <DotBorderButton label="Book a call" variant="orange" href="https://cal.com/audiment/demo" />
        </div>
      </div>
    </header>
  );
};
```

---

## 9. Marketing Campaign & Creative Templates

Use these ready-to-run components for **LinkedIn ads, display banners, pitch carousels, and promotional pages**.

### 9.1 Ad Banner Creative Component (`AdBannerCreative.tsx`)

#### React Component:
```tsx
import React from 'react';
import { DotBorderButton } from './DotBorderButton';

export const AdBannerCreative: React.FC<{
  headline: string;
  metric: string;
  metricLabel: string;
}> = ({
  headline = "Know what's actually happening at every branch.",
  metric = "48h SLA",
  metricLabel = "CAPA Auto-Resolution",
}) => {
  return (
    <div className="relative w-[1200px] h-[628px] bg-[#FAFAFA] border border-[#e8e8e8] p-16 flex flex-col justify-between overflow-hidden">
      {/* Background Architectural Page Lines */}
      <div className="absolute inset-0 pointer-events-none border-l border-r border-[#e8e8e8] mx-12" />

      {/* Top Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#e8e8e8] pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5400] animate-pulse" />
          <span className="font-mono text-xs text-[#737373] tracking-widest uppercase">
            AUDIMENT // MULTI-LOCATION AUDIT SUITE
          </span>
        </div>
        <span className="font-mono text-xs text-[#737373]">
          GPS VERIFIED • TIMESTAMPED PROOF
        </span>
      </div>

      {/* Main Focus Area */}
      <div className="relative z-10 max-w-[840px] my-auto">
        <h1 className="text-6xl font-normal text-[#181818] tracking-[-0.04em] leading-[1.1] m-0 mb-6">
          {headline}
        </h1>
        <p className="text-xl text-[#737373] font-normal leading-relaxed m-0">
          Replace WhatsApp faked checklists with unannounced audits, mandatory photo proof, and automated corrective actions.
        </p>
      </div>

      {/* Bottom Proof Metric & CTA */}
      <div className="relative z-10 flex items-end justify-between pt-6 border-t border-[#e8e8e8]">
        <div>
          <div className="font-mono text-4xl text-[#FF5400] font-normal tracking-tight">
            {metric}
          </div>
          <div className="text-xs uppercase tracking-wider text-[#737373] mt-1">
            {metricLabel}
          </div>
        </div>
        <div>
          <DotBorderButton label="Schedule Walkthrough →" variant="orange" />
        </div>
      </div>
    </div>
  );
};
```

---

### 9.2 Social Carousel Slide Component (`CarouselSlide.tsx`)

#### React Component:
```tsx
import React from 'react';

export const CarouselSlide: React.FC<{
  slideNumber: string;
  category: string;
  title: string;
  point1: string;
  point2: string;
  point3: string;
}> = ({ slideNumber, category, title, point1, point2, point3 }) => {
  return (
    <div className="relative w-[1080px] h-[1350px] bg-[#FAFAFA] border-2 border-[#e8e8e8] p-20 flex flex-col justify-between font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-8">
        <span className="text-sm font-mono uppercase tracking-[0.1em] text-[#FF5400] bg-[#FF5400]/10 px-3 py-1 rounded-full border border-[#FF5400]/20">
          {category}
        </span>
        <span className="font-mono text-base text-[#737373]">
          SLIDE {slideNumber}
        </span>
      </div>

      {/* Center Body */}
      <div className="my-auto">
        <h2 className="text-5xl font-normal text-[#181818] tracking-[-0.035em] leading-[1.15] mb-12">
          {title}
        </h2>
        <div className="space-y-8">
          {[point1, point2, point3].map((pt, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-white border border-[#e8e8e8] rounded-none">
              <span className="w-2 h-2 rounded-full bg-[#FF5400] mt-2.5 shrink-0" />
              <p className="text-xl text-[#45474d] leading-relaxed m-0 font-normal">
                {pt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex items-center justify-between border-t border-[#e8e8e8] pt-8">
        <span className="text-lg font-normal tracking-tight text-[#181818]">
          audiment.in
        </span>
        <span className="font-mono text-xs text-[#737373] tracking-widest uppercase">
          OPERATIONAL GROUND-TRUTH
        </span>
      </div>
    </div>
  );
};
```

---

## 10. Spacing, Borders, Radii & Elevation

### 10.1 Spacing Scale

| Variable | Pixels | Application |
| :--- | :--- | :--- |
| `--spacing-aud-2xs` | `4px` | Crosshair offsets, pill margins |
| `--spacing-aud-xs` | `8px` | Icon gaps, badge padding |
| `--spacing-aud-sm` | `12px` | Input padding, metadata gaps |
| `--spacing-aud-md` | `16px` | Standard gaps, card inner elements |
| `--spacing-aud-lg` | `24px` | Card internal padding, grid column gutters |
| `--spacing-aud-xl` | `32px` | Feature padding, section sub-groups |
| `--spacing-aud-2xl`| `48px` | Pre-footer CTA strip vertical padding |
| `--spacing-aud-3xl`| `64px` | Hero spacing, section vertical dividers |

### 10.2 Layout Bounds
- **Marketing Max Width:** `1248px` (`--content: 1248px; margin: 0 auto;`).
- **Dashboard Max Width:** `1440px` (Sidebar `280px` fixed).
- **Header Height:** `72px` (Desktop) / `64px` (Mobile).

### 10.3 Border Radii
- `rounded-none` (`0px`): Architectural cards, feature grid blocks, carousel cards.
- `--radius-sm` (`6px`): Small chips, select dropdowns.
- `--radius-md` (`8px`): Inputs, search bars, category buttons.
- `--radius-xl` (`14px`): Dashboard data cards.
- `rounded-full` (`100px`): Primary action buttons, blueprint buttons, status pills.

---

## 11. Embedded Vector Brand Assets

### 11.1 Primary Dark Audiment Logotype (Inline Vector)
Copy and paste this raw SVG directly for light backgrounds (`#FAFAFA` / `#ffffff`):

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="134" height="43" viewBox="0 0 1003.5 322.5" fill="#181818">
  <path d="M 158.97 259.26 L 139.16 259.26 L 121.47 212.26 L 38.03 212.26 L 20.33 259.26 L 1.31 259.26 L 71.56 74.42 L 88.72 74.42 Z M 115.13 195.09 L 79.75 100.82 L 44.36 195.09 Z"/>
  <path d="M 215.95 261.9 C 206.1 261.9 197.16 259.52 189.16 254.78 C 181.14 250.02 174.85 243.24 170.27 234.43 C 165.69 225.63 163.41 215.42 163.41 203.81 L 163.41 127.23 L 180.58 127.23 L 180.58 203.81 C 180.58 216.84 184.01 227.1 190.87 234.57 C 197.74 242.05 206.63 245.79 217.55 245.79 C 229.16 245.79 238.49 242.05 245.53 234.57 C 252.57 227.1 256.09 216.84 256.09 203.81 L 256.09 127.23 L 273.27 127.23 L 273.27 259.26 L 260.58 259.26 L 256.09 241.31 L 254.78 241.31 C 251.26 246.77 246.11 251.56 239.33 255.7 C 232.55 259.83 224.75 261.9 215.95 261.9 Z"/>
  <path d="M 350.1 261.9 C 339.01 261.9 328.84 259 319.6 253.2 C 310.36 247.38 303.01 239.24 297.55 228.78 C 292.09 218.3 289.37 206.45 289.37 193.24 C 289.37 180.05 292.09 168.21 297.55 157.73 C 303.01 147.25 310.36 139.11 319.6 133.31 C 328.84 127.49 339.01 124.59 350.1 124.59 C 356.79 124.59 363.08 125.82 368.98 128.29 C 374.88 130.75 379.85 133.57 383.9 136.74 C 387.95 139.91 390.76 142.72 392.35 145.18 L 393.68 145.18 L 393.68 74.42 L 410.84 74.42 L 410.84 259.26 L 398.16 259.26 L 393.68 241.31 L 392.35 241.31 C 390.59 243.77 387.73 246.58 383.77 249.76 C 379.81 252.93 374.88 255.74 368.98 258.21 C 363.08 260.67 356.79 261.9 350.1 261.9 Z M 350.1 245.79 C 358.03 245.79 365.34 243.6 372.02 239.2 C 378.71 234.79 383.99 228.58 387.87 220.57 C 391.74 212.56 393.68 203.45 393.68 193.24 C 393.68 183.04 391.74 173.93 387.87 165.92 C 383.99 157.91 378.71 151.71 372.02 147.31 C 365.34 142.9 358.03 140.7 350.1 140.7 C 342.18 140.7 334.87 142.9 328.18 147.31 C 321.49 151.71 316.21 157.91 312.33 165.92 C 308.47 173.93 306.54 183.04 306.54 193.24 C 306.54 203.45 308.47 212.56 312.33 220.57 C 316.21 228.58 321.49 234.79 328.18 239.2 C 334.87 243.6 342.18 245.79 350.1 245.79 Z"/>
  <path d="M 454.14 259.26 L 436.98 259.26 L 436.98 127.23 L 454.14 127.23 Z M 445.7 106.1 C 442.35 106.1 439.52 104.96 437.23 102.68 C 434.95 100.39 433.81 97.57 433.81 94.23 C 433.81 90.71 434.95 87.85 437.23 85.65 C 439.52 83.44 442.35 82.34 445.7 82.34 C 449.22 82.34 452.08 83.44 454.28 85.65 C 456.47 87.85 457.58 90.71 457.58 94.23 C 457.58 97.57 456.43 100.39 454.14 102.68 C 451.86 104.96 449.05 106.1 445.7 106.1 Z"/>
  <path d="M 607.83 124.59 C 615.74 124.59 623.04 126.79 629.73 131.2 C 636.43 135.6 641.71 141.88 645.58 150.07 C 649.45 158.26 651.39 167.72 651.39 178.46 L 651.39 259.26 L 634.23 259.26 L 634.23 178.46 C 634.23 166.49 631.54 157.2 626.17 150.6 C 620.8 144 613.63 140.7 604.65 140.7 C 596.03 140.7 588.72 144.18 582.73 151.13 C 576.75 158.08 573.76 167.19 573.76 178.46 L 573.76 259.26 L 556.59 259.26 L 556.59 178.46 C 556.59 166.66 553.86 157.42 548.4 150.73 C 542.95 144.04 535.83 140.7 527.03 140.7 C 518.22 140.7 510.87 144.18 504.97 151.13 C 499.07 158.08 496.12 167.19 496.12 178.46 L 496.12 259.26 L 478.97 259.26 L 478.97 127.23 L 491.64 127.23 L 496.12 145.18 L 497.45 145.18 C 500.61 139.9 504.88 135.15 510.25 130.93 C 515.62 126.7 522.18 124.59 529.92 124.59 C 539.78 124.59 547.93 127.37 554.36 132.92 C 560.78 138.46 565.4 144.4 568.22 150.73 C 571.38 144.22 576.22 138.24 582.73 132.78 C 589.25 127.32 597.61 124.59 607.83 124.59 Z"/>
  <path d="M 787.38 189.29 C 787.38 194.74 787.03 198.88 786.33 201.7 L 683.86 201.7 C 685.28 215.25 690.07 225.99 698.26 233.92 C 706.44 241.83 716.61 245.79 728.76 245.79 C 744.95 245.79 757.19 238.84 765.46 224.93 L 782.63 224.93 C 778.58 235.67 771.62 244.52 761.76 251.48 C 751.9 258.43 740.73 261.9 728.24 261.9 C 716.61 261.9 706.09 259 696.68 253.2 C 687.26 247.38 679.82 239.29 674.36 228.9 C 668.9 218.51 666.18 206.62 666.18 193.24 C 666.18 180.21 668.95 168.46 674.49 157.99 C 680.04 147.52 687.57 139.33 697.07 133.43 C 706.57 127.54 716.97 124.59 728.24 124.59 C 739.32 124.59 749.4 127.46 758.46 133.18 C 767.53 138.9 774.62 146.69 779.72 156.54 C 784.83 166.4 787.38 177.31 787.38 189.29 Z M 728.24 140.7 C 720.84 140.7 713.93 142.6 707.51 146.39 C 701.07 150.17 695.71 155.54 691.4 162.49 C 687.08 169.44 684.48 177.32 683.6 186.12 L 769.96 186.12 C 769.07 172.91 764.76 162.04 757.01 153.51 C 749.26 144.97 739.68 140.7 728.24 140.7 Z"/>
  <path d="M 803.5 259.26 L 803.5 127.23 L 816.17 127.23 L 820.65 145.18 L 821.98 145.18 C 825.5 139.72 830.64 134.93 837.42 130.79 C 844.2 126.66 851.99 124.59 860.79 124.59 C 870.64 124.59 879.58 126.97 887.59 131.73 C 895.6 136.48 901.89 143.26 906.46 152.06 C 911.05 160.86 913.34 171.07 913.34 182.68 L 913.34 259.26 L 896.18 259.26 L 896.18 182.68 C 896.18 169.65 892.75 159.4 885.87 151.92 C 879 144.44 870.12 140.7 859.21 140.7 C 847.59 140.7 838.25 144.44 831.21 151.92 C 824.17 159.4 820.65 169.65 820.65 182.68 L 820.65 259.26 Z"/>
  <path d="M 979.1 261.9 C 968.53 261.9 959.82 258.12 952.96 250.56 C 946.09 242.99 942.66 232.68 942.66 219.65 L 942.66 143.34 L 919.14 143.34 L 919.14 127.23 L 929.46 127.23 C 940.18 127.23 945.55 121.95 945.55 111.38 L 945.55 92.1 L 959.82 92.1 L 959.82 127.23 L 990.71 127.23 L 990.71 143.34 L 959.82 143.34 L 959.82 219.92 C 959.82 228.54 961.75 235.01 965.63 239.32 C 969.5 243.63 974.87 245.79 981.74 245.79 C 984.9 245.79 987.89 245.27 990.71 244.21 L 990.71 259.79 C 986.84 261.2 982.97 261.9 979.1 261.9 Z"/>
</svg>
```

---

## 12. Brand Voice, Copy Directives & Do's / Don'ts

### 12.1 Practical Founder Voice
Audiment writes like an experienced multi-outlet founder who has dealt with kitchen staff faking hygiene reports over WhatsApp, missed store audits, and unexpected regulatory inspections. Never use generic corporate jargon.

| ❌ Banned Abstract SaaS Jargon | ✅ Approved Founder-Native Alternative |
| :--- | :--- |
| *Operational visibility / clarity* | "Know what's actually happening at every branch." |
| *Streamline compliance* | "Run audits without faking or delay." |
| *Systemic bottlenecks* | "See which outlets keep failing—and why." |
| *Seamlessly / Empower / Leverage* | Use active verbs: build, inspect, track, resolve. |
| *Enterprise control infrastructure* | "Audit management system built for multi-location teams." |

---

### 12.2 Strict Design Do's & Don'ts

| ✅ DO | ❌ DON'T |
| :--- | :--- |
| Use non-bold headings (`font-weight: 400`) with tight tracking (`-0.03em` to `-0.04em`). | Do not use bold/black (700/800/900) weights on headlines. |
| Ground interfaces with 1px hairline borders (`#e8e8e8` / `border-border/50`). | Do not use heavy 2px-4px borders or multi-colored strokes. |
| Use Electric Orange (`#FF5400`) strictly as an optical focal highlight or button. | Do not use orange for large background fills or entire cards. |
| Frame CTA buttons with the blueprint corner crosshair dots and drawing lines. | Do not use generic pill buttons without hover physics. |
| Include signature -45° micro-stripes or 135° moving stripes on transition tracks. | Do not use generic wavy SVG dividers, blobs, or confetti. |
| Anchor data in physical reality: GPS coordinates, photo proof, countdown timers. | Do not use generic stock photography of people pointing at tablets. |
| Use deep grounding dark `#0d0d0f` with orange volumetric glow on dark sections. | Do not use muddy grays or flat unstyled black. |

---

*Canonical Master Design Document — Version 3.1 • Audiment & Asellus Studio • 100% Self-Contained & Production-Ready.*
