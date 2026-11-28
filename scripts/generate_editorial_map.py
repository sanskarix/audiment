#!/usr/bin/env python3
"""
Generate a human-readable Editorial Content Map from blog_analysis_report.json.

Covers:
1. Meaningful Major Topics & Subtopics
2. Every blog assigned 1+ relevant topic tags & preserved original /blog/<slug> URL
3. Explicit cross-reference of near-duplicate & overlapping articles
4. Multi-topic blogs broken down by their actual markdown section headings
5. Irrelevant, malformed, and suspicious files flagged separately
6. Outlier blogs that don't fit any existing topic
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

REPORT_JSON = Path("/Users/sanskar/Documents/Asellus/Audiment/scripts/output/blog_analysis_report.json")
BLOG_DIR = Path("/Users/sanskar/Documents/Asellus/Audiment/content/blog")
OUT_MD = Path("/Users/sanskar/Documents/Asellus/Audiment/scripts/output/editorial_content_map.md")

# Ordered taxonomy: (Major Topic, Subtopic, keyword patterns, topic tag)
TAXONOMY_RULES: list[tuple[str, str, list[str], str]] = [
    # 1. Software Evaluation, Comparisons & Pricing
    (
        "Software Evaluation, Comparisons & Pricing",
        "Competitor Comparisons & Alternatives",
        [r"\bvs\b", r"\balternative\b", r"\bjolt\b", r"\bzenput\b", r"\bgoaudits\b", r"\bsafetyculture\b"],
        "competitor-comparison",
    ),
    (
        "Software Evaluation, Comparisons & Pricing",
        "Buying Guides, RFPs, Demos & Contracts",
        [r"\brfp\b", r"\bdemo\b", r"\bcontract\b", r"\bnotice period", r"\bpricing\b", r"\broi\b", r"\bevaluate\b", r"\bbest\b.*\bsoftware\b", r"\bbest\b.*\bapps\b", r"\bhow to compare\b", r"\bselection\b"],
        "software-evaluation",
    ),
    (
        "Software Evaluation, Comparisons & Pricing",
        "Platform Features, Dashboards & Integrations",
        [r"\bfeatures\b", r"\bdashboards\b", r"\bintegrations\b", r"\boffline\b", r"\bmodern audit technology\b", r"\bcloud-based\b", r"\balerts\b"],
        "platform-features",
    ),
    # 2. IT Security, Governance & Data Architecture
    (
        "IT Security, Governance & Data Architecture",
        "Access Control, Privacy & Data Ownership",
        [r"\bsecurity\b", r"\bprivacy\b", r"\brole-based\b", r"\brbac\b", r"\bdata if you stop\b", r"\bregulated data\b"],
        "security-governance",
    ),
    # 3. Migration, Adoption & Change Management
    (
        "Migration, Adoption & Change Management",
        "Moving Off WhatsApp, Paper & Spreadsheets",
        [r"\bwhatsapp\b", r"\bnotebook\b", r"\bpaper\b", r"\bspreadsheet\b", r"\bexcel\b", r"\bmigration\b"],
        "legacy-migration",
    ),
    (
        "Migration, Adoption & Change Management",
        "Rollout, Training & Staff Adoption",
        [r"\badoption\b", r"\bfailed the last time\b", r"\bsetup guide\b", r"\bstaff turnover\b", r"\btraining\b", r"\bregional\b"],
        "rollout-adoption",
    ),
    # 4. Quality Management & Regulatory Compliance
    (
        "Quality Management & Regulatory Compliance",
        "Food Safety, Cold Chain & FSSAI Compliance",
        [r"\bfssai\b", r"\bfood safety\b", r"\bcold storage\b", r"\btemperature\b", r"\bhygiene\b", r"\bkitchen\b.*\bprep\b", r"\bshelf life\b", r"\bexpiry\b"],
        "food-safety-fssai",
    ),
    (
        "Quality Management & Regulatory Compliance",
        "Quality Assurance, QC & ISO Standards",
        [r"\biso 9001\b", r"\biso 13485\b", r"\bgxp\b", r"\bquality control\b", r"\bquality assurance\b", r"\bquality audit\b", r"\bquality consistency\b"],
        "quality-management",
    ),
    (
        "Quality Management & Regulatory Compliance",
        "Enterprise Risk, SOX & Multi-Framework Compliance",
        [r"\bsox\b", r"\berm\b", r"\brisk management\b", r"\bregulatory compliance\b", r"\bmulti-framework\b", r"\bcompliance audit\b", r"\bcompliance guide\b"],
        "regulatory-compliance",
    ),
    # 5. Industry Playbooks & Verticals
    (
        "Industry Playbooks & Verticals",
        "Restaurants, QSR, Cloud Kitchens & Bakeries",
        [r"\brestaurant\b", r"\bqsr\b", r"\bcloud kitchen\b", r"\bdark kitchen\b", r"\bbakery\b", r"\bcatering\b", r"\bfood\b"],
        "vertical-food-qsr",
    ),
    (
        "Industry Playbooks & Verticals",
        "Retail, Grocery & Multi-Unit Stores",
        [r"\bretail\b", r"\bgrocery\b", r"\bstore audit\b", r"\bstores\b", r"\bsignage\b", r"\bcampaign\b", r"\bmerchandising\b"],
        "vertical-retail",
    ),
    (
        "Industry Playbooks & Verticals",
        "Franchises & Multi-Brand Networks",
        [r"\bfranchis", r"\bmaster franchisee\b", r"\bbrand standards\b"],
        "vertical-franchise",
    ),
    (
        "Industry Playbooks & Verticals",
        "Hospitality, Hotels & Resorts",
        [r"\bhotel\b", r"\bresort\b", r"\bhospitality\b", r"\bvilla\b"],
        "vertical-hospitality",
    ),
    (
        "Industry Playbooks & Verticals",
        "Healthcare, Hospitals, Clinics & Life Sciences",
        [r"\bhospital\b", r"\bclinic\b", r"\bdiagnostic\b", r"\bmedical device\b", r"\bpharmaceutical\b", r"\bhealthcare\b", r"\binfection control\b", r"\bsterilisation\b"],
        "vertical-healthcare",
    ),
    (
        "Industry Playbooks & Verticals",
        "Manufacturing, Construction, Energy & Logistics",
        [r"\bmanufacturing\b", r"\bconstruction\b", r"\bwarehouse\b", r"\blogistics\b", r"\butility\b", r"\benergy\b"],
        "vertical-industrial-logistics",
    ),
    (
        "Industry Playbooks & Verticals",
        "Facility Management, Education & Financial Services",
        [r"\bfacility management\b", r"\bfacilities\b", r"\bschool\b", r"\bcampus\b", r"\bbanking\b", r"\bfinancial services\b", r"\bagencies\b"],
        "vertical-facilities-other",
    ),
    # 6. Audit & Inspection Fundamentals
    (
        "Audit & Inspection Fundamentals",
        "Corrective Actions & CAPA",
        [r"\bcorrective action\b", r"\bcapa\b", r"\bfollow up\b", r"\bfailed items\b", r"\bescalate\b", r"\bissue tracking\b"],
        "corrective-actions-capa",
    ),
    (
        "Audit & Inspection Fundamentals",
        "Evidence, Proof & On-Site Verification",
        [r"\bevidence\b", r"\bphoto proof\b", r"\bgps\b", r"\bphysically at the location\b", r"\bsurprise audit\b", r"\btimestamped\b", r"\bfake audits?\b"],
        "proof-verification",
    ),
    (
        "Audit & Inspection Fundamentals",
        "Audit Lifecycle, Planning & Checklists",
        [r"\bplanning\b", r"\bscheduling\b", r"\bworkflow\b", r"\bchecklist\b", r"\bfieldwork\b", r"\breporting\b", r"\btracking software\b"],
        "audit-execution-checklists",
    ),
    (
        "Audit & Inspection Fundamentals",
        "Core Concepts & Multi-Location Standards",
        [r"\bwhat is\b", r"\boperational drift\b", r"\baudit score\b", r"\baudit management\b", r"\binspection management\b", r"\boutlet audit\b", r"\bmulti-location\b"],
        "audit-fundamentals",
    ),
]


def assign_topics(blog: dict[str, Any]) -> tuple[str, str, list[str]]:
    """Assign primary (major_topic, subtopic) and all matching topic tags."""
    haystack = " ".join([
        blog["title"],
        blog["filename"].rsplit(".", 1)[0].replace("-", " "),
        blog["category"],
        " ".join(blog["tags"]),
        blog["description"],
    ]).lower()

    matches: list[tuple[str, str, str]] = []
    seen_tags: set[str] = set()
    for major, sub, patterns, tag in TAXONOMY_RULES:
        if any(re.search(pat, haystack) for pat in patterns):
            if tag not in seen_tags:
                seen_tags.add(tag)
                matches.append((major, sub, tag))

    if not matches:
        return "Unassigned / Outlier", "Uncategorized", ["outlier"]

    primary_major, primary_sub, _ = matches[0]
    tags = [m[2] for m in matches]
    return primary_major, primary_sub, tags


def detect_flagged_files(blogs: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Flag irrelevant, malformed, or suspicious files in content/blog."""
    flagged: list[dict[str, str]] = []
    for b in blogs:
        path = BLOG_DIR / b["filename"]
        raw = path.read_text(encoding="utf-8", errors="replace")
        has_fm = raw.startswith("---") and len(raw.split("---", 2)) >= 3
        reasons: list[str] = []

        if path.suffix != ".mdx":
            reasons.append(f"Non-MDX extension (`{path.suffix}`) — ignored by `getAllPosts()` in `src/lib/blog.ts`")
        if not has_fm:
            reasons.append("Missing YAML frontmatter (`title`, `description`, `date`, `tags`)")
        if b["filename"] == "tech_instructions.md":
            reasons.append("Irrelevant internal technical specification, not a blog post")
        if b["filename"] == "temp_content.md":
            reasons.append(f"Massive scratch/dump file ({b['word_count']:,} words, {b['section_count']} sections, title `'1'`)")
        if re.search(r"[a-z]•|\u2022[a-z]", raw):
            reasons.append("Contains garbled/truncated ASCII diagram text (mid-word `•` corruption)")

        if reasons:
            flagged.append({
                "filename": b["filename"],
                "url": b["url"],
                "title": b["title"],
                "reasons": "; ".join(reasons),
            })
    return flagged


def main() -> None:
    report = json.loads(REPORT_JSON.read_text(encoding="utf-8"))
    blogs: list[dict[str, Any]] = report["extracted_blogs"]

    flagged = detect_flagged_files(blogs)
    flagged_non_blog = {f["filename"] for f in flagged if not f["filename"].endswith(".mdx")}

    # Group live .mdx blogs into Major Topic -> Subtopic
    grouped: dict[str, dict[str, list[dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    outliers: list[dict[str, Any]] = []

    for b in blogs:
        if b["filename"] in flagged_non_blog:
            continue
        major, sub, topic_tags = assign_topics(b)
        entry = {**b, "assigned_tags": topic_tags}
        if major == "Unassigned / Outlier":
            outliers.append(entry)
        else:
            grouped[major][sub].append(entry)

    lines: list[str] = [
        "# Audiment Editorial Content Map",
        "",
        f"Covers all **{len(blogs)}** files in `content/blog` (**{len(blogs) - len(flagged_non_blog)}** live `.mdx` blogs + **{len(flagged_non_blog)}** non-blog `.md` files). All original `/blog/<slug>` URLs are preserved.",
        "",
        "---",
        "",
        "## 1. Flagged Files (Irrelevant, Malformed, or Suspicious)",
        "",
    ]

    for f in flagged:
        lines.append(f"- **`{f['filename']}`** (`{f['url']}`) — _{f['title']}_  \n  **Flags:** {f['reasons']}")

    lines.extend(["", "---", "", "## 2. Duplicate & Overlapping Articles (Cross-Reference)", ""])
    lines.append("### Near-Duplicates (High Body Overlap, Differing Titles)")
    for d in report["near_duplicates"]:
        lines.append(
            f"- [{d['doc_a']['title']}]({d['doc_a']['url']}) ↔ [{d['doc_b']['title']}]({d['doc_b']['url']})  \n"
            f"  Semantic sim: `{d['semantic_similarity']}` | Body TF-IDF sim: `{d['body_tfidf_similarity']}` | Title sim: `{d['title_similarity']}`"
        )

    lines.extend(["", "### High-Overlap Topic Pairs (Top 20)", ""])
    for p in report["similar_topic_pairs"][:20]:
        lines.append(
            f"- [{p['doc_a']['title']}]({p['doc_a']['url']}) ↔ [{p['doc_b']['title']}]({p['doc_b']['url']}) "
            f"(Semantic sim: `{p['semantic_similarity']}`)"
        )

    lines.extend(["", "---", "", "## 3. Multi-Topic Blogs Broken Down by Actual Sections", ""])
    blog_by_file = {b["filename"]: b for b in blogs}
    for m in report["multi_topic_blogs"]:
        if m["filename"] in flagged_non_blog:
            continue
        b = blog_by_file[m["filename"]]
        h2s = [h["text"] for h in b["headings"] if h["level"] == 2]
        if not h2s:
            h2s = [h["text"] for h in b["headings"] if h["level"] == 3]
        lines.append(
            f"### [{m['title']}]({m['url']}) (`{m['filename']}`)"
        )
        lines.append(
            f"- **Coherence:** Mean section sim `{m['mean_section_similarity']}` | Min section sim `{m['min_section_similarity']}`"
        )
        lines.append(
            f"- **Most divergent pair:** _{m['most_divergent_sections'][0]}_ vs _{m['most_divergent_sections'][1]}_"
        )
        lines.append("- **Actual Sections:**")
        for idx, sec_title in enumerate(h2s, 1):
            lines.append(f"  {idx}. {sec_title}")
        lines.append("")

    lines.extend(["---", "", "## 4. Editorial Topic & Subtopic Map", ""])
    major_order = [
        "Audit & Inspection Fundamentals",
        "Quality Management & Regulatory Compliance",
        "Industry Playbooks & Verticals",
        "Software Evaluation, Comparisons & Pricing",
        "Migration, Adoption & Change Management",
        "IT Security, Governance & Data Architecture",
    ]
    for major in major_order:
        subs = grouped.get(major, {})
        total_in_major = sum(len(v) for v in subs.values())
        lines.append(f"### {major} ({total_in_major} blogs)")
        lines.append("")
        for sub, items in subs.items():
            lines.append(f"#### {sub} ({len(items)})")
            for item in sorted(items, key=lambda x: x["title"]):
                tags_str = ", ".join(f"`{t}`" for t in item["assigned_tags"])
                lines.append(f"- [{item['title']}]({item['url']}) — Tags: {tags_str}")
            lines.append("")

    lines.extend(["---", "", "## 5. Blogs That Don't Fit Any Existing Topic (Outliers)", ""])
    if outliers:
        for o in outliers:
            lines.append(f"- [{o['title']}]({o['url']}) (`{o['filename']}`, Category: `{o['category'] or 'None'}`)")
    else:
        lines.append("_All 228 live `.mdx` blogs fit cleanly into the editorial taxonomy above._")

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"Editorial content map written to {OUT_MD}")
    print(f"Live .mdx blogs mapped: {sum(len(v) for s in grouped.values() for v in s.values())}")
    print(f"Outliers: {len(outliers)}")
    print(f"Flagged files: {len(flagged)}")


if __name__ == "__main__":
    main()
