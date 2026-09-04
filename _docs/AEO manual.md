**1\. AI SEO Website Development Checklist**

> Give this to your developer before they write a single line of code.

---

# **Architecture**

## **Information Architecture**

* Every important page is reachable within 3 clicks.  
* URL structure is logical and human-readable.  
* Category hierarchy is consistent.  
* No orphan pages.  
* Breadcrumbs implemented.  
* Pagination is crawlable.  
* Related pages are interlinked.  
* Canonical URLs are correctly implemented.  
* One preferred URL per page.  
* Duplicate pages removed.  
* Redirect chains eliminated.

---

## **Navigation**

* Navigation labels are descriptive.  
* No JavaScript-only navigation.  
* Footer contains important resources.  
* Related content widgets exist.  
* Search function is crawlable.  
* XML sitemap auto-generated.  
* HTML sitemap exists (for larger sites).

---

# **Technical SEO**

## **Crawlability**

* robots.txt configured properly.  
* XML sitemap submitted.  
* Important pages indexable.  
* No accidental noindex tags.  
* Crawl budget isn't wasted on filters.  
* Parameter URLs handled correctly.  
* Soft 404s removed.  
* Broken links fixed.

---

## **Rendering**

* Content available in server-rendered HTML (SSR, SSG, or equivalent) so crawlers don't depend on client-side JavaScript.  
* Critical content isn't injected only after user interaction.  
* Lazy loading doesn't hide essential text from crawlers.  
* Images use proper loading strategy.  
* Fonts don't block rendering.

---

## **Performance**

* LCP \< 2.5s  
* INP \< 200ms  
* CLS \< 0.1  
* Images compressed.  
* Images served in modern formats where appropriate.  
* CSS minimized.  
* JS minimized.  
* Unused JS removed.  
* CDN configured.  
* Browser caching enabled.  
* Gzip/Brotli enabled.  
* Critical CSS prioritized.

---

# **Semantic HTML**

* One H1.  
* Logical heading hierarchy.  
* Lists use `<ul>` / `<ol>`.  
* Tables use proper table markup.  
* Buttons use `<button>`.  
* Links use `<a>`.  
* Forms use `<label>`.  
* Images contain descriptive alt text.  
* Decorative images marked appropriately.  
* Figures use `<figure>` / `<figcaption>` when needed.

---

# **Structured Data**

Google is explicit: schema isn't required for AI visibility, but it helps search engines understand content and unlocks rich results.

Implement where relevant:

* Organization  
* Person  
* BreadcrumbList  
* Article  
* FAQPage (only when visible and eligible)  
* Product  
* Review  
* LocalBusiness  
* SoftwareApplication  
* Event  
* VideoObject

Validate every schema.

---

# **Entity Signals**

* Company name consistent everywhere.  
* Founder names consistent.  
* Product names consistent.  
* Logo consistent.  
* Brand description identical across pages.  
* Contact information consistent.  
* Social profiles linked.  
* About page exists.  
* Team page exists.  
* Author pages exist.

---

# **AI Retrieval Readiness**

## **Page Structure**

* Every page answers one primary intent.  
* Sections answer one question each.  
* Every section can stand alone.  
* Definitions appear early.  
* Important facts aren't hidden in tabs or accordions unless they're also present in the HTML.  
* Tables use proper HTML.  
* Comparisons are explicit.  
* FAQs included where genuinely useful.

---

## **Passage Retrieval**

Each section should answer:

* What?  
* Why?  
* How?  
* Benefits?  
* Drawbacks?  
* Examples?

Every section should make sense if copied into an AI answer without the rest of the page.

---

# **Internal Linking**

* Every important page has incoming links.  
* Contextual links inside paragraphs.  
* Topic clusters implemented.  
* Related articles connected.  
* Product ↔ Docs ↔ Blog ↔ Pricing linked.

---

# **Images**

* Descriptive filenames.  
* Descriptive alt text.  
* Width and height declared.  
* Captions where helpful.  
* Images compressed.  
* Original images preferred over generic stock photography.

---

# **E-E-A-T Signals**

* Author profile.  
* Credentials.  
* Experience.  
* Sources cited.  
* Updated date.  
* Original examples.  
* Contact page.  
* Editorial policy.  
* Privacy policy.  
* Terms.  
* Company address where appropriate.

---

# **Analytics**

* Google Search Console.  
* Bing Webmaster Tools.  
* Analytics configured.  
* Event tracking.  
* Conversion tracking.  
* Search queries monitored.  
* AI referral traffic monitored (where detectable).

---

# **Accessibility**

* Keyboard navigation.  
* Contrast passes WCAG.  
* ARIA used only when needed.  
* Forms accessible.  
* Focus states visible.  
* Screen reader friendly.

---

# **Things NOT to Build**

* Don't hide content behind JavaScript-only interactions.  
* Don't create duplicate pages.  
* Don't auto-generate thousands of thin pages.  
* Don't rely on infinite scroll without crawlable pagination.  
* Don't block resources that crawlers need to render the page.  
* Don't create separate "AI pages" or "LLM pages" solely for search engines.

---

# **2\. AI SEO Content Writing Checklist**

> Give this to every writer before they publish a single article.

---

# **Before Writing**

## **Search Intent**

Identify:

* Who is searching?  
* What do they actually want?  
* What action comes next?  
* Beginner or expert?  
* Commercial or informational?  
* What related questions are they likely to ask?

---

## **Research**

Collect:

* Official documentation.  
* First-party sources.  
* Original statistics.  
* Industry reports.  
* Expert opinions.  
* Recent updates.  
* Community discussions (Reddit, forums, GitHub when relevant).

Never rely solely on AI-generated summaries.

---

# **Article Structure**

Start with:

* Clear title.  
* One-paragraph answer.  
* Short introduction.  
* Table of contents (for long guides).  
* Logical headings.

---

# **Retrieval-Friendly Writing**

Every section should answer exactly one question.

Example:

## **What is AI SEO?**

(answer)

---

## **Why is AI SEO important?**

(answer)

---

## **How does AI SEO work?**

(answer)

Never bury the answer five paragraphs down.

---

# **Paragraph Rules**

* One idea per paragraph.  
* Prefer 2–5 sentences.  
* Avoid filler.  
* Put the answer first.  
* Explain after.  
* Use active voice.  
* Remove marketing fluff.

---

# **Information Density**

Every paragraph should include at least one of:

* Fact.  
* Statistic.  
* Example.  
* Framework.  
* Process.  
* Observation.  
* Comparison.  
* Definition.  
* Original insight.

If a paragraph contains none of these, rewrite or remove it.

---

# **Originality**

Every article should include at least one of:

* Personal experience.  
* Case study.  
* Internal data.  
* Original framework.  
* Screenshots.  
* Experiment.  
* Benchmark.  
* Interview.  
* Contrarian opinion supported by evidence.

Don't just summarize what's already ranking.

---

# **Entity Building**

Mention naturally:

* Company.  
* Founder.  
* Product.  
* Industry terms.  
* Competitors (when comparison adds value).  
* Technologies.  
* Standards.

Use consistent naming throughout the site.

---

# **Citability**

Ask:

Can this paragraph be quoted by an AI?

If not—

Rewrite it.

Good paragraphs contain:

* Definitions.  
* Numbers.  
* Lists.  
* Frameworks.  
* Clear explanations.

---

# **Formatting**

Use:

* Lists.  
* Tables.  
* Comparisons.  
* FAQs.  
* Images.  
* Charts.  
* Pull quotes where they genuinely add value.  
* Callout boxes.

Avoid walls of text.

---

# **Freshness**

Check:

* Current year.  
* Updated screenshots.  
* Recent statistics.  
* Latest product names.  
* Current pricing.  
* Latest documentation.

Review evergreen content on a regular schedule.

---

# **Internal Linking**

Each article should include:

* Parent topic.  
* Supporting topics.  
* Product pages.  
* Related articles.  
* Glossary entries.

---

# **External Sources**

Prioritize:

* Official documentation.  
* Government sources.  
* Academic research.  
* Standards bodies.  
* Company documentation.  
* Reputable industry publications.

Cite sources accurately and avoid copying.

---

# **E-E-A-T**

Demonstrate:

* Experience.  
* Expertise.  
* Accuracy.  
* Transparency.  
* Sources.  
* Author bio.  
* Last updated date.

---

# **AI Retrieval Checklist**

For every section ask:

* Does it answer one question?  
* Is the answer in the first paragraph?  
* Can it stand alone?  
* Is it factually precise?  
* Is it easy to quote?  
* Is it supported by evidence where needed?

---

# **Before Publishing**

* Spelling checked.  
* Facts verified.  
* Sources reviewed.  
* Links tested.  
* Images optimized.  
* Meta title written.  
* Meta description written.  
* Canonical URL confirmed.  
* Schema (if applicable) reviewed.  
* Search intent satisfied.

---

# **What NOT to Do**

* Don't write for algorithms instead of people.  
* Don't stuff keywords or entities unnaturally.  
* Don't publish AI-generated text without human review.  
* Don't rewrite competitors with superficial changes.  
* Don't make unsupported claims.  
* Don't hide the answer behind long introductions.  
* Don't publish thin pages to target every keyword variation.

---

## **One principle ties both manuals together**

The developer's job is to make information **discoverable, crawlable, fast, and machine-readable**.

The writer's job is to make information **original, trustworthy, answer-first, and easy to retrieve at the passage level**.

When those two disciplines work together, you're not "optimizing for AI" with gimmicks—you are making your knowledge the easiest, most reliable source for search engines and AI systems to understand, retrieve, and cite.

