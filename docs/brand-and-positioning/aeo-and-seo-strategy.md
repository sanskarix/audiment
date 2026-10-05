# AEO & Invisible SEO Strategy

Audiment uses an **Invisible SEO** strategy—delivering sleek human UX while embedding rich structured metadata for Search Engines and AI Answer Engines (Perplexity, ChatGPT, Claude, Gemini).

---

## 🤖 Answer Engine Optimization (AEO)

AI engines query structured text files and canonical schema declarations:

1. **`public/llms.txt` Entity Specification:** Standard entity definition file describing Audiment's purpose, capabilities, pricing model, and architecture for LLM web crawlers.
2. **Per-Page JSON-LD Schemas:** Dynamic `<script type="application/ld+json">` injected via `next/script` on landing and solution pages.
3. **Robots & Sitemap Control:** Explicitly allows AI search bot user-agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`) in `robots.txt` and dynamically updates `sitemap.ts`.

---

## 🕸️ Hub-and-Spoke Content Architecture

```
                       +-----------------------+
                       |    HOMEPAGE (HUB)     |
                       |    audiment.in       |
                       +-----------+-----------+
                                   |
           +-----------------------+-----------------------+
           |                       |                       |
           v                       v                       v
+---------------------+ +---------------------+ +---------------------+
|     SOLUTIONS       | |     USE CASES       | |    COMPARISONS      |
| /solutions/         | | /use-cases/         | | /compare/           |
| restaurant-ops      | | prevent-fake-audits | | vs-safetyculture    |
+---------------------+ +---------------------+ +---------------------+
```

* **Hub:** Main landing page establishing primary category positioning.
* **Spokes:** Targeted landing pages addressing vertical operational needs (restaurant operations, QSR franchise management, retail compliance).
