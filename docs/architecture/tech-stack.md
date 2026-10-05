# Tech Stack Specification

Audiment is built on a modern, developer-friendly web stack optimized for rapid page loads, responsive client dashboards, mobile field use, and enterprise reliability.

---

## 🛠️ Complete Technology Breakdown

| Architecture Layer | Core Technology | Version | Purpose / Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `^16.2.1` | Server Components, hybrid SSR/SSG, optimized route bundling, and built-in API handlers. |
| **Language** | TypeScript | `^5.0.0` | Strict type safety across client components, backend API routes, database schemas, and scoring logic. |
| **UI Component Primitives** | React / Base UI / Radix | `19.2.4` | Accessible design primitives for dialogs, dropdowns, tooltips, and modals. |
| **Styling & Design System** | Tailwind CSS 4 + Shadcn UI | `^4.0.0` | Utility-first CSS engine with dark mode support and customized component styling tokens. |
| **Animations** | Framer Motion & tw-animate | `^12.38.0` | Micro-interactions, slide-in drawers, modal transitions, and Flashmob REC indicators. |
| **Database** | Firebase Firestore | `^12.11.0` | Real-time document NoSQL database with client offline caching and index support. |
| **Authentication** | Firebase Auth | `^12.11.0` | Secure email/password authentication integrated with Firestore RBAC user documents. |
| **Server Admin SDK** | Firebase Admin SDK | `^10.3.0` | Privileged backend database operations, account creation, and cron job execution. |
| **Media Pipeline** | Cloudinary & Next Cloudinary | `^2.9.0` | Direct client-side multipart photo uploads, WebM/MP4 video storage, and HLS video streaming. |
| **Data Analytics & Charts** | Recharts | `^3.8.0` | Interactive compliance score bar charts, regional comparison graphs, and trend line graphs. |
| **PDF Export Engine** | jsPDF + html2canvas | `^4.2.1` | Client-side HTML-to-PDF rendering engine with custom CSS stripping for high-fidelity exports. |
| **Hosting & Cron Automation**| Vercel | Production | Automatic deployment pipelines, edge network CDN, and scheduled cron jobs. |

---

## 📦 Package Dependencies Summary

Excerpt from `package.json`:

```json
{
  "dependencies": {
    "@next/mdx": "^16.2.2",
    "@tabler/icons-react": "^3.40.0",
    "cloudinary": "^2.9.0",
    "date-fns": "^4.1.0",
    "firebase": "^12.11.0",
    "firebase-admin": "^10.3.0",
    "framer-motion": "^12.38.0",
    "html2canvas-pro": "^2.0.2",
    "jspdf": "^4.2.1",
    "lucide-react": "^1.7.0",
    "next": "^16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "^3.8.0",
    "tailwind-merge": "^3.5.0"
  }
}
```

---

## 🏎️ Performance & Mobile Optimization

1. **Webpack Allocation:** Next.js dev scripts run with `--max-old-space-size=4096` to support fast hot-module replacement (HMR) during complex dashboard development.
2. **Mobile Touch Enforcements:** Auditor touch targets use a minimum height of 48px to prevent touch miss errors on mobile phones.
3. **Dynamic Import Splitting:** Heavy libraries (e.g. Recharts, jsPDF, html2canvas) are dynamically imported (`next/dynamic`) to keep initial bundle sizes light.
