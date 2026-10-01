# Audiment – Public Facing Website

This folder contains a complete, decoupled copy of the public-facing marketing website for Audiment. It includes all layout, styling, public components, assets, and 1 representative example of each page type across all categories.

---

## 📂 Included Pages

| Category | Route | File Path |
| :--- | :--- | :--- |
| **Homepage** | `/` | `src/app/page.tsx` |
| **About** | `/about` | `src/app/about/page.tsx` |
| **Blog Listing** | `/blog` | `src/app/blog/page.tsx` |
| **Blog Article (1 example)** | `/blog/best-audit-management-software` | `src/app/blog/[slug]/page.tsx` + `content/blog/best-audit-management-software.mdx` |
| **Product Comparisons Hub** | `/compare` | `src/app/compare/page.tsx` |
| **Comparison (1 example)** | `/compare/audiment-vs-safetyculture` | `src/app/compare/audiment-vs-safetyculture/page.tsx` |
| **Solutions Hub** | `/solutions` | `src/app/solutions/page.tsx` |
| **Solution (1 example)** | `/solutions/restaurant-audit-software` | `src/app/solutions/restaurant-audit-software/page.tsx` |
| **Use Cases Hub** | `/use-cases` | `src/app/use-cases/page.tsx` |
| **Use Case (1 example)** | `/use-cases/corrective-action-tracking` | `src/app/use-cases/corrective-action-tracking/page.tsx` |
| **Platform Feature (1 example)** | `/platform/proof-based-audits` | `src/app/platform/proof-based-audits/page.tsx` |
| **Operational Problem (1 example)** | `/operational-drift` | `src/app/operational-drift/page.tsx` |
| **Commercial Landing (1 example)** | `/multi-location-audit-software` | `src/app/multi-location-audit-software/page.tsx` |
| **Privacy Policy** | `/privacy-policy` | `src/app/(public)/privacy-policy/page.tsx` |
| **Terms of Service** | `/terms-of-service` | `src/app/(public)/terms-of-service/page.tsx` |
| **Cookie Policy** | `/cookie-policy` | `src/app/(public)/cookie-policy/page.tsx` |

---

## 🏗️ Structure

- `public/`: Static logos, images, icons, and fonts
- `content/blog/`: Markdown/MDX content for blog posts
- `src/app/`: Next.js App Router pages and metadata
- `src/components/`:
  - `ui/`: Design system UI components (buttons, dialogs, cards, navigation, etc.)
  - `layout/`: Public navigation navbar
  - `home/`: Deferred homepage sections
  - `blog/`: Blog cards and structured metadata publisher
  - `compare/`: Comparison table template
  - `solutions/`: Solution page template
  - `use-cases/`: Use case template
  - `seo/`: Structured SEO content template
  - `AppProviders.tsx`, `ConsentBanner.tsx`, `ConsentProvider.tsx`, `PublicGtm.tsx`, `PublicPageviewTracker.tsx`
- `src/lib/`:
  - `blog.ts`: MDX blog reader and slug resolver
  - `seo.ts`: Metadata generator and OpenGraph helpers
  - `utils.ts`: Classname merge utilities
  - `dataLayer.ts`: Google Tag Manager event helpers
  - `auth.ts`: Standalone client-safe session cookie parser (no Firebase required)

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
