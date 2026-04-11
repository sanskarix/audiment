# SEO Audit Checklist — Audiment

This file is the single source of truth for the SEO audit.
The AI agent must check every item below and report 
pass/fail/missing for each one. No additional checks should 
be invented. No assumptions should be made without reading 
the actual file contents.

---

## 1. METADATA — Every page file in src/app/

For each page, check the exported `metadata` object.

- [ ] `title` exists
- [ ] `title` is under 60 characters
- [ ] `description` exists
- [ ] `description` is between 140 and 160 characters
- [ ] `keywords` array exists
- [ ] `openGraph.title` exists
- [ ] `openGraph.description` exists
- [ ] `openGraph.url` exists
- [ ] `openGraph.type` is set to "website" or "article"
- [ ] `openGraph.images` array exists with at least one image
- [ ] `twitter.card` is set to "summary_large_image"
- [ ] `twitter.title` exists
- [ ] `twitter.description` exists
- [ ] `canonical` URL is set

Pages to check:
- src/app/page.tsx (homepage)
- src/app/blog/page.tsx
- src/app/blog/[slug]/page.tsx
- src/app/solutions/restaurant-operations/page.tsx
- src/app/solutions/retail-operations/page.tsx
- src/app/solutions/franchise-operations/page.tsx
- src/app/contact/page.tsx (if exists)

---

## 2. JSON-LD STRUCTURED DATA

- [ ] Homepage has `Organization` schema with:
  - name
  - url
  - logo
  - sameAs (social profiles)
  - description
- [ ] Homepage has `WebSite` schema with `SearchAction`
- [ ] Each solutions page has `SoftwareApplication` or 
  `Product` schema
- [ ] Each blog post page has `Article` schema with:
  - headline
  - author
  - datePublished
  - dateModified
  - image
  - publisher
- [ ] JSON-LD is injected per-page (not only in layout.tsx)
- [ ] JSON-LD uses next/script with 
  strategy="afterInteractive" or is in a 
  `<script type="application/ld+json">` tag

---

## 3. SITEMAP

- [ ] src/app/sitemap.ts exists
- [ ] Sitemap includes homepage with priority 1.0
- [ ] Sitemap includes /blog with priority 0.8
- [ ] Sitemap includes all solutions pages
- [ ] Sitemap includes all blog post slugs dynamically
- [ ] Each URL has a `lastModified` date
- [ ] Each URL has a `changeFrequency` value
- [ ] Sitemap returns valid MetadataRoute.Sitemap type

---

## 4. ROBOTS.TXT

- [ ] public/robots.txt OR src/app/robots.ts exists
- [ ] Allows all crawlers for public pages (User-agent: *)
- [ ] Disallows /admin/* 
- [ ] Disallows /manager/*
- [ ] Disallows /auditor/*
- [ ] Disallows /api/*
- [ ] Contains Sitemap URL pointing to 
  https://audiment.com/sitemap.xml

---

## 5. LLMS.TXT (GEO — AI Search Visibility)

- [ ] public/llms.txt exists
- [ ] Contains a plain-language description of what 
  Audiment does (2-4 sentences)
- [ ] Lists the homepage URL
- [ ] Lists all solutions page URLs
- [ ] Lists all blog post URLs
- [ ] Uses the positioning language from 
  _docs/POSITIONING.md (not old compliance angle)
- [ ] Is under 2000 tokens total

---

## 6. SEMANTIC HTML STRUCTURE

For each page, check the rendered component tree:

- [ ] Exactly ONE `<h1>` per page
- [ ] `<h2>` appears before `<h3>` (no skipped levels)
- [ ] `<header>` used for the navbar
- [ ] `<main>` wraps the page content
- [ ] `<footer>` used for the footer
- [ ] `<nav>` used for navigation links
- [ ] `<section>` used for page sections
- [ ] `<article>` used for blog post content
- [ ] No `<div>` used where a semantic element exists

---

## 7. HEADING COPY (Keyword Alignment)

For each page, check H1 and H2 text:

- [ ] Homepage H1 contains the primary keyword 
  (audit, operations, visibility, or accountability)
- [ ] Each solutions page H1 names the vertical 
  (restaurant, retail, franchise)
- [ ] Blog post H1 matches the MDX frontmatter title exactly
- [ ] No heading uses Title Case (should be sentence case)
- [ ] No heading is a generic phrase 
  ("Welcome", "Our features", "About us")

---

## 8. IMAGE OPTIMISATION

For all `<Image>` and `<img>` tags across all checked files:

- [ ] All images use Next.js `<Image>` component 
  (not raw `<img>` tags in .tsx files)
- [ ] Every `<Image>` has an `alt` attribute
- [ ] Every `<Image>` has explicit `width` and `height`
- [ ] Every `<Image>` has `loading="lazy"` or 
  `priority` for above-fold images
- [ ] No `alt=""` on content images 
  (only acceptable on decorative images)
- [ ] OG image exists at public/og-image.png or 
  is generated via src/app/opengraph-image.tsx

---

## 9. INTERNAL LINKING

- [ ] Navbar links to all solutions pages
- [ ] Footer links to all solutions pages
- [ ] Footer links to /blog
- [ ] Homepage hero or nav links to /blog
- [ ] Each solutions page links to at least 2 other 
  internal pages
- [ ] Each blog post links to at least 1 solutions page
- [ ] No orphan pages (every page reachable from nav 
  or footer)
- [ ] Blog index page links to each individual blog post
- [ ] No broken internal hrefs (check all Link href values)

---

## 10. CANONICAL & DUPLICATE CONTENT

- [ ] layout.tsx sets a default canonical base URL
- [ ] Each page either inherits or overrides canonical
- [ ] Blog posts set canonical to their own URL
  (not the index page)
- [ ] No two pages have identical `<title>` values
- [ ] No two pages have identical `<description>` values

---

## 11. PERFORMANCE (Static Analysis Only)

Do not run the app. Check the code only.

- [ ] No page-level file has "use client" at the top 
  (pages should be server components)
- [ ] Components using useState/useEffect/framer-motion 
  are isolated as separate client components
- [ ] Next.js `<Image>` is used for all images 
  (auto WebP conversion)
- [ ] Google Fonts loaded with `display=swap`
- [ ] No large libraries imported at the page level 
  without dynamic import
- [ ] `next/dynamic` used for heavy client components 
  where appropriate

---

## 12. ACCESSIBILITY (SEO-ADJACENT)

- [ ] All icon-only buttons have `aria-label`
- [ ] All form inputs have associated `<label>`
- [ ] Skip to content link exists as first focusable element
- [ ] Color contrast is not hardcoded in a way that 
  fails WCAG (check for text-white/40 or lower 
  on body-size text)
- [ ] All `<a>` tags have descriptive text 
  (no "click here" or "read more" without context)

---

## 13. BLOG MDX CONTENT — SEO CHECKS

For each .mdx file in content/blog/:

- [ ] frontmatter `title` exists and is under 60 chars
- [ ] frontmatter `description` exists 
  and is 140-160 chars
- [ ] frontmatter `date` is in YYYY-MM-DD format
- [ ] frontmatter `author` exists
- [ ] frontmatter `tags` array has at least 3 items
- [ ] Post has at least one H2 heading
- [ ] Post has at least one internal link to a 
  solutions page
- [ ] Post ends with a CTA paragraph linking 
  to /contact or /#contact
- [ ] Post contains at least one comparison table 
  using pipe | MDX table syntax
- [ ] Post opening paragraph does NOT start with 
  the word "In this article" or "Introduction"

---

## 14. ROUTE COVERAGE

Confirm these routes exist as actual page files:

- [ ] src/app/page.tsx
- [ ] src/app/blog/page.tsx
- [ ] src/app/blog/[slug]/page.tsx
- [ ] src/app/solutions/restaurant-operations/page.tsx
- [ ] src/app/solutions/retail-operations/page.tsx
- [ ] src/app/solutions/franchise-operations/page.tsx
- [ ] src/app/sitemap.ts
- [ ] src/app/robots.ts OR public/robots.txt
- [ ] public/llms.txt

Report MISSING if any of these do not exist.