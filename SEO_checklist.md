# Comprehensive SEO, AEO & LLM Search Master Checklist

---

## 1. Document Architecture, URL Slugs & Canonical Management

- [ ] **Treat the URL slug as the definitive document identifier**  
  Because Google’s search engine is historically rooted in a UNIX filesystem architecture, it evaluates the file/document name from the slug first (supporting 57 file types, only 3 of which natively support headings: HTML, PDF, DOC). The slug establishes the primary competitive index.
- [ ] **Execute the slug narrowing / URL repositioning tactic**  
  If a page is stuck on Page 2–5 or trapped in *"Crawled - currently not indexed"* because it requires more authority than your domain currently possesses:
  - Do not just leave it or repeatedly request indexing in Google Search Console.
  - Take the page down and republish under a narrower, more specific long-tail slug (e.g., shifting from broad `/google-seo/` to specific `/google-core-update-march-2026/`).
  - Ensure the old URL/canonical is retired and 301-redirected cleanly so Google does not trip over duplicate canonical indicators (Page Title, Slug, H1).
  - The republished page enters an index with lower competition and inherits your domain's updated topical authority cluster score.
- [ ] **Study competitor URL slugs in plain sight**  
  When analyzing why competitors rank for target commercial terms (e.g., *"HVAC in Boston"*), click the top 5 results and examine the exact wording and structure of their slugs rather than obsessing over complex third-party on-page scoring tools.
- [ ] **Channel internal links from click-earning URLs (The Triage Rule)**  
  Google’s Caffeine-based indexing triages the web every 24 hours, actively crawling only URLs that receive organic clicks. Submitting an XML sitemap without context will not force indexation. Place in-content internal links pointing from high-traffic, click-earning pages directly to stagnant or new pages to force Google to crawl and index them.
- [ ] **Audit URLs inside Google Search Console**  
  Filter GSC pages by the last 7 days of organic clicks. Inspect the top-clicked URLs to confirm they are crawled and re-indexed every 24 hours.

---

## 2. Scaled Structural Playbooks & Domain Strategy

- [ ] **Execute the Granular Use-Case Playbook at scale**  
  Rather than relying on a high-level product landing page, map out every single practical permutation, software integration, protocol, and configuration (e.g., creating thousands of use-case pages for load-balancing NGINX, Microsoft Lync, Exchange, etc.).
- [ ] **Localize and translate use-case pages**  
  Translate established use-case content into multiple target languages (e.g., across 16 languages) to capture uncontested regional search indexes globally.
- [ ] **Deploy standalone Exact Match Domains (EMDs)**  
  - Acquire keyword-matching domains (e.g., `freeloadbalancer.com` or `exchangeloadbalancer.com`) on low-cost CMS setups (such as WordPress with a standard theme).
  - Use them to capture bottom-of-funnel searches that corporate giants (Google, Microsoft, Citrix, AWS) compete for.
  - Link them contextually back to the parent brand website.
- [ ] **Bypass the 1-to-2 Domain SERP Cap with satellite sites**  
  Because search engines and LLM vector retrievers enforce a ceiling of 1–2 results per root domain per topic, build multiple targeted satellite domains to control more real estate in the top 20 retrieved pool.
- [ ] **Create dedicated B2B Glossaries**  
  Publish glossaries defining emerging job titles (e.g., CISO vs. BISO), obscure technical terms, and industry jargon. Target buyers, architects, and IT admins who search for exact phrasing when assembling board decks and slide presentations.
- [ ] **Develop downloadable technical stencil assets (Visio/Diagrams)**  
  Build downloadable Visio stencils, architecture icons, and system diagram templates so enterprise admins can drop your product directly into their internal infrastructure diagrams.
- [ ] **Execute brute-force topical cluster generation**  
  Deploy clusters of 50–100 specific sub-topics. Expect ~70% to index and rank automatically on low competition; use targeted internal linking from those winning pages to elevate the remaining 30%.
- [ ] **Deploy the "Compact Keywords" Playbook**  
  Build concise, bottom-of-funnel transactional pages (averaging ~415 words) targeted specifically at purchase-ready searchers rather than top-of-funnel informational queries.

---

## 3. On-Page Optimization, Headers & Search Intent

- [ ] **Strip brand names from informational & long-tail title tags**  
  Stop appending `| Brand Name` or `- Brand Name` to informational articles. It consumes character budget, dilutes core keyword weight, and triggers keyword cannibalization. Confine the brand name strictly to the Homepage, Pricing, Contact, and Support pages.
- [ ] **Structure multi-branded search routing for larger brands**  
  For larger enterprises with multiple brand variations, thread distinct branded terms to dedicated subdomains or landing pages rather than sending all branded traffic to the homepage.
- [ ] **Publish dedicated URLs for individual FAQ questions**  
  Abandon single-page FAQ accordion blocks using FAQ schema. Build every single FAQ question on its own dedicated URL so the question is captured entirely by the slug and title tag.
- [ ] **Promote GSC Page 2 queries into exact H2 headings**  
  Export phrases from Google Search Console where an existing page ranks on Page 2. Insert those exact search phrases as H2 subheadings within the page to gain an immediate ranking lift without third-party optimization tools.
- [ ] **Adopt the "No Word Count Minimum" rule**  
  Google’s spam policies enforce thin content penalties primarily against thin *affiliate* sites, not short, useful pages. Do not pad content—concise, direct answers (even 10–100 words), spreadsheets, or data tables rank effectively.
- [ ] **Place the direct answer / TL;DR above the fold**  
  Deliver the core answer or product summary immediately at the top of the page before the scroll to fulfill search intent, minimize SERP pogo-sticking, and increase conversions.
- [ ] **Build unstyled comparison tables (The "Ugly Spreadsheet" Tactic)**  
  Create direct, raw HTML tables comparing your pricing, speeds, and technical specs against high-cost competitors without logos or fancy styling. Tables frequently capture Google's top featured snippet and drive high-intent leads.
- [ ] **Design for skimmers using three-letter technical acronyms**  
  Frame technical product descriptions around the exact protocols and acronyms engineers look for (e.g., TLS, SSL, TMG, SSL offloading) rather than verbose marketing jargon.

---

## 4. AEO (Answer Engine Optimization) & LLM Retrieval Mechanics

- [ ] **Optimize for the Top 20 consensus pool**  
  Unlike classic Google search where Position #1 claims the majority of clicks, LLMs retrieve the top ~20 documents across the query fan-out and synthesize output based on statistical agreement. Ranking anywhere in that top 20 pool gets your claim into the consensus.
- [ ] **Target Query Fan-Out long-tail sub-queries**  
  Map out the secondary and tertiary sub-questions generated when an LLM breaks down a user prompt, and build dedicated content answering those specific sub-queries.
- [ ] **Target LLM cache retention**  
  Recognize that LLMs frequently serve answers from an internal retrieval cache (and Common Crawl) to avoid the high financial and computational costs of running live search API queries for every prompt.
- [ ] **Verify Common Crawl accessibility**  
  Audit `robots.txt` and server firewalls to ensure Common Crawl bots are permitted full access, ensuring inclusion in foundational LLM datasets.
- [ ] **Account for the two-step LLM ingestion lag**  
  When publishing new data to influence LLMs, expect a lag between the initial crawl/cache ingestion and accurate text synthesis. LLMs often cite the source first while initially misattributing the claim, before aligning synthesis hours or days later.
- [ ] **Deploy low-cost syndicated press releases ($6 to $66)**  
  Use distribution wire services (e.g., AB Newswire, EIN Presswire) to create multiple indexed news footprints across the web. LLMs ingest these syndicated records and synthesize them as factual events, categories, or titles.
- [ ] **Establish independent award bodies & benchmarking directories**  
  Create dedicated third-party domains (e.g., industry benchmarking associations, awards platforms) that publicly evaluate and declare your core product as the top solution, manufacturing multi-source consensus for LLMs.
- [ ] **Secure placements in third-party roundups & listicles**  
  When users ask LLMs "Who is the best [X]?", models query existing web listicles and regurgitate the names listed. Actively pitch and secure placements in third-party "Top [X]" articles.

---

## 5. Entity Authority, Schema & Knowledge Graphs

- [ ] **Treat Schema (JSON-LD) as structural hygiene, not an entity-ranking signal**  
  Do not rely on schema markup to generate Knowledge Panels or rank for entity terms. Search engines and LLMs discount on-page schema because it is easily faked and self-serving.
- [ ] **Build Knowledge Graph presence via real web citations**  
  Direct entity recognition comes from independent, third-party occurrences across the web (Wikipedia, Wikidata, mainstream press coverage, and reputable business listings), not on-page code tags.
- [ ] **Disregard programmatic "EEAT" scoring myths**  
  Search engines and LLMs cannot verify subjective human qualities like "experience" or "trust." They measure mathematical link graph proximity and multi-site co-occurrences.

---

## 6. Media Optimization & Platform-Specific Constraints (YouTube, Reddit, Images)

- [ ] **Keep search-focused YouTube videos under 45 minutes**  
  Ensure informational videos stay below 45 minutes to guarantee automated transcription by YouTube, enabling search engines and LLM crawlers to parse and index the content.
- [ ] **Publish full on-page transcripts for long-form media**  
  For podcasts, webinars, or videos extending past 45–90 minutes, host the complete written transcript and structural summary directly on your website.
- [ ] **Do not rely on Reddit for scalable AEO**  
  Avoid treating Reddit threads as a primary channel for persistent AI visibility due to pagination limits, API barriers, thread archiving, and aggressive spam filters/account suspensions.
- [ ] **Distribute visual assets across diverse external domains**  
  Google Images and multimodal AI search engines cap image results from a single domain at ~30–40%. Seed infographics, screenshots, and photos across guest posts, podcast hosts, YouTube thumbnails, and partner sites to capture visual search share.

---

## 7. Link Building, Network Partnerships & Reconnaissance

- [ ] **Form real-world B2B co-marketing partnerships**  
  Exchange contextual in-content links with non-competing, reputable businesses that share your exact audience (e.g., an HVAC contractor partnering with a local electrician; a software firm partnering with systems integrators).
- [ ] **Provide SEO optimization to distribution and MSP partners**  
  Offer hands-on technical SEO, title tag improvements, and partner landing pages directly for distributors, vendors, and MSPs in exchange for contextual backlinks from their domains.
- [ ] **Never buy mass exact-match anchor link packages**  
  Purchasing repetitive anchor text links creates unnatural heuristic footprints that search engines easily detect and devalue.
- [ ] **Ignore low-quality scraper backlinks and avoid the disavow tool**  
  Google naturally zeros out scrapers, automated directories, and adult spam links without passing algorithmic penalties to the recipient. Reserve the disavow tool strictly for situations where you manually bought large-scale paid link packages and received an algorithmic warning.
- [ ] **Conduct free competitor backlink reconnaissance in Bing Webmaster Tools**  
  Use Bing Webmaster Tools to view competitor backlink profiles for free. Bing displays inbound links with toxic spam pre-filtered.
- [ ] **Account for Link Ghosts / Link Geckos**  
  Understand that when a high-quality backlink is lost, its positive algorithmic authority effects can temporarily persist on the target page.

---

## 8. Analytics Realities & Algorithmic Signals

- [ ] **Migrate to the Google Search Console API as the single source of truth**  
  Stop relying on third-party rank tracking software (Moz, Semrush, Ahrefs) for daily rank decisions. Go-to redirects, continuous AB testing, and hyper-personalization make external scrapers highly inaccurate. Build internal reporting directly from the GSC API.
- [ ] **Decouple impression drops from organic traffic health**  
  Declining impressions in Search Console do not indicate a penalty if click volume remains stable. Google regularly personalizes SERPs, eliminates redundant impressions, and tests faster query loops.
- [ ] **Segment traditional browser traffic from LLM referral traffic**  
  Track and analyze organic browser clicks separately from AI-driven search referrals, as search intent and conversion paths differ significantly between the two channels.
- [ ] **Focus on SERP-level CTR over analytics bounce rates/dwell time**  
  Dwell time and Google Analytics bounce rates are not direct algorithmic ranking factors due to browser discrepancies and privacy laws (e.g., GDPR in Europe). Focus on winning the click on the SERP and satisfying the query instantly to prevent pogo-sticking back to competitor results.
- [ ] **Avoid automated CTR manipulation tools**  
  Steer clear of bot networks that simulate SERP clicks. Search engines detect repetitive weekly click spikes and invalidate the affected queries.

---

## 9. Content Production & AI Workflow

- [ ] **Use LLMs as structural scaffolding**  
  Use LLMs to defeat writer's block, generate initial outlines, or transform conversational social media notes into structured articles.
- [ ] **Conduct rigorous human fact-checking**  
  Manually verify technical claims and quotes to catch LLM hallucinations before publishing.
- [ ] **Publish immediately and iterate with real search data**  
  Eliminate multi-layered, bureaucratic content review pipelines for early-stage content. Ship pages rapidly to let GSC performance data guide subsequent optimization.