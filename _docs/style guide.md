# Audiment Style Guide

This style guide documents the design system and UI components used in the Audiment SaaS project. It is based on the **shadcn/ui** core library using the **`b1D5T6NG`** (Modern Slate + Azure Indigo) professional preset.

---

## 🎨 Design System

### 1. Color Palette (OKLCH)
The project uses the OKLCH color space for superior perceptual uniformity. These values are optimized for high-contrast clarity and a premium SaaS aesthetic.

| Variable | OKLCH Value | UI Context |
| :--- | :--- | :--- |
| `--background` | `1 0 0` | Pure white background for maximum focus |
| `--foreground` | `0.145 0 0` | Deep charcoal for primary text |
| `--card` | `1 0 0` | Card & container backgrounds |
| `--primary` | `0.5 0.134 242.7` | Azure Indigo for CTAs and focus states |
| `--secondary` | `0.967 0.001 286` | Subtle cool grey for secondary elements |
| `--muted` | `0.97 0 0` | Muted backgrounds (Tabs, Sidebar highlights) |
| `--muted-foreground` | `0.556 0 0` | Mid-grey for secondary/helper text |
| `--accent` | `0.97 0 0` | Hover states and interactive highlights |
| `--destructive` | `0.577 0.245 27.3` | Semantic red for destructive actions |
| `--border` | `0.922 0 0` | Refined light grey for divides |

### 2. Typography & Semantics
Apply these classes to maintain consistent text hierarchy:

- **`.page-heading`**: Main headers (`h1`). 2XL/3XL, Bold, Tight tracking.
- **`.section-heading`**: Category headers (`h2`/`h3`). LG/XL, Semibold.
- **`.body-text`**: Standard paragraph text. SM size, Muted foreground.
- **`.muted-label`**: Small, uppercase, tracking-wider labels for metadata.

### 3. Layout Tokens (Spacing & Radius)
- **Radius**: System-wide corner rounding is **`0.625rem` (10px)** (`--radius-lg`). This provides a modern, balanced look halfway between "boxy" and "rounded".
- **Glassmorphism**: `.glass` and `.glass-dark` are used for high-end floating UI elements (Modals, Headers).

---

## 📏 Spacing & Proportions (Product Area)

To ensure a cohesive and functional user experience throughout the dashboard, we adhere to a **4px base-unit** grid system. This does not apply to the landing page, which uses a more expressive layout.

### **The Spacing Scale**
| Token | Pixels | Rem | Usage |
| :--- | :--- | :--- | :--- |
| `2xs` | 4px | 0.25rem | Micro-adjustments, icon-text gap |
| `xs` | 8px | 0.5rem | Internal button padding, small gaps |
| `sm` | 12px | 0.75rem | Small list item padding |
| `md` | 16px | 1rem | **Standard Item Gap**, small card padding |
| `lg` | 24px | 1.5rem | **Standard Card Padding**, Grid Gutters |
| `xl` | 32px | 2rem | **Global Page Padding** |
| `2xl` | 48px | 3rem | Section spacing within a single page |
| `3xl` | 64px | 4rem | Large vertical spacing between major blocks |

### **Global Proportions**
- **Viewport Layout**: Fixed Sidebar (**280px**) + Fluid Main Content.
- **Max Content Width**: `1600px` (to prevent line lengths from becoming unreadable on ultra-wide screens).
- **Header Height**: `64px` (h-16) for universal navigation bars.
- **Interactive Targets**: Default buttons and inputs are **40px** tall for optimal touch/click ergonomics. small variants are **32px**.
- **Card Consistency**: Use `.standard-card` with `p-6` (24px) padding for all dashboard modules.

---

## 🛠️ Global Component Inventory

Every shadcn component is themed to match the **Modern Slate + Azure Indigo** palette.

### **Navigation & Structure**
- **Sidebar**: Fixed vertical navigation bar (280px) with Azure Indigo active states.
- **Navigation Menu**: High-end horizontal tabs or menu lists.
- **Tabs**: Line-based or capsule-based switching with azure active indicators.

### **Inputs & Controls**
- **Form**: Integrated Zod validation.
- **Button**: Azure (`primary`), Cool Grey (`secondary`), or Ghost for low-emphasis.
- **Select / Checkbox / Switch**: Accessibility-first controls with consistent focus rings.

### **Data Visualization & Overlays**
- **Table**: Clean, borderless rows with `muted` hover highlights.
- **Dialog / Sheet**: Themed with `.glass` overlays and `0.625rem` radius.
- **Sonner**: Toast notifications positioned at `bottom-right`.

---

## ✨ Implementation Patterns

### 1. Standard Dashboard Page
```tsx
<div className="dashboard-page-container flex-1 overflow-auto">
  <div className="page-header-section mb-xl"> 
    <div className="flex flex-col gap-xs">
      <h1 className="page-heading">Dashboard</h1>
      <p className="body-text">Monitor your audit performance and recent activity.</p>
    </div>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
    <Card className="standard-card p-6">...</Card>
    <Card className="standard-card p-6">...</Card>
    <Card className="standard-card p-6 col-span-2">...</Card>
  </div>
</div>
```

### 2. Dark Mode Support
The **Azure Indigo** (`--primary`) remains the same in dark mode, while the background shifts to a deep slate charcoal (`oklch(0.145 0 0)`), ensuring the product feels unified across themes.

---

*Last Updated: March 2026*
