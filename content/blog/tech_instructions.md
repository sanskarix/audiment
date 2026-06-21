# Audiment Blog Technical Implementation Specification

## Blog Template

Use the existing blog layout.

Do NOT create:

* new blog templates
* landing page layouts
* comparison page layouts
* sidebar navigation
* sticky table of contents
* gated content sections
* download forms

All content should render through the existing rich text/article template.

---

# URL Structure

Format:

/blog/[slug]

Examples:

/blog/what-is-audit-management

/blog/best-audit-management-software

/blog/inspection-checklist

Use clean, keyword-focused URLs.

No dates in URLs.

---

# Heading Structure

Exactly one H1 per page.

Use H2 for all major sections.

Use H3 for subsections.

Never skip heading levels.

Example:

H1

→ H2

→ H3

→ H3

→ H2

---

# Answer Box Implementation

For every major H2 section:

Render the first paragraph directly below the H2 as a highlighted answer box.

Requirements:

* 40–60 words
* visually distinct
* regular HTML text (not image)
* crawlable by search engines

Purpose:

* Featured snippets
* AI answer engines
* GEO optimization

---

# Tables

Use semantic HTML tables.

Never use images for tables.

Tables must remain:

* selectable
* crawlable
* accessible

Required structure:

<table>
<thead>
<tbody>

No screenshots of tables.

---

# FAQ Section

Render FAQs using existing FAQ component.

Implementation:

* Visible FAQ section on page
* FAQPage schema attached

Questions and answers must remain visible on page.

Do not use hidden FAQ schema.

---

# Schema Markup

Every blog post must include:

## Article Schema

Required:

* headline
* description
* datePublished
* dateModified
* author
* image
* mainEntityOfPage

## FAQ Schema

Add whenever FAQ section exists.

---

# Internal Links

Links must remain standard HTML links.

No JavaScript-only navigation.

Requirements:

* descriptive anchor text
* crawlable links
* same-tab navigation

Examples:

Good:
"What Is Audit Management"

Bad:
"Click here"

---

# Images

If article includes images:

Requirements:

* descriptive file names
* alt text
* lazy loading

Do not use text-heavy infographic images for critical content.

Important content must remain in HTML.

---

# Performance

Target:

* LCP under 2.5s
* CLS under 0.1

Use:

* lazy loading
* optimized images
* responsive images

No unnecessary animation in blog pages.

---

# Mobile Requirements

Tables:

* horizontally scrollable
  OR
* responsive

Content width:

Readable without zooming.

All answer boxes and tables must remain usable on mobile.

---

# Metadata

Every article requires:

Meta Title

Meta Description

Open Graph Title

Open Graph Description

Open Graph Image

Canonical URL

---

# Canonicals

Self-referencing canonical on every blog page.

Example:

/blog/inspection-checklist

Canonical:

/blog/inspection-checklist

---

# Breadcrumbs

Implement breadcrumb navigation.

Example:

Home
→ Blog
→ Article

Include Breadcrumb schema if already supported.

---

# CTA Component

Use the existing blog CTA component.

Placement:

After FAQ section.

Single CTA only.

Do not inject multiple CTAs throughout the article.

---

# Search Engine Requirements

All primary content must render server-side.

Do not rely on client-side rendering for article body content.

Headings, tables, FAQs, and internal links must be present in source HTML.

---

# Accessibility

Use:

* semantic headings
* table headers
* alt text
* accessible link text

Ensure FAQ accordion is keyboard accessible.

---

# Things To Never Do

Do not:

* place critical content inside images
* use image-based tables
* hide FAQ answers
* use multiple H1 tags
* inject popups into article body
* break heading hierarchy
* create separate layouts per article

Every article should use the same implementation pattern.
