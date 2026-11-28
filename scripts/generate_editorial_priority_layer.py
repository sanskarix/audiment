#!/usr/bin/env python3
"""
Add an Editorial-Priority Layer on top of the existing Editorial Content Map.

Preserves every original /blog/<slug> URL and existing topic/subtopic/tag assignment
from generate_editorial_map.py, and classifies all 228 live .mdx blogs into:
  - P1: Primary Focus (Restaurants, QSRs, Cloud Kitchens & Multi-Location Food) — Directly Relevant
  - P2: Secondary Focus (Franchises, Retail & General Multi-Location Operations) — Directly Relevant
  - P3: Supporting Topics (Audit Fundamentals, Software Comparisons/Buying, Security, Adjacent Industries) — Directly Relevant (Supporting)
  - Tangential: Off-ICP Verticals & Enterprise/Niche Topics — Merely Tangential

Flagged non-blog .md files (tech_instructions.md, temp_content.md) remain separated.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import generate_editorial_map as gem

REPORT_JSON = Path("/Users/sanskar/Documents/Asellus/Audiment/scripts/output/blog_analysis_report.json")
OUT_MD = Path("/Users/sanskar/Documents/Asellus/Audiment/scripts/output/editorial_priority_map.md")

# Patterns identifying off-ICP / tangential buyers rather than Audiment's core
# food / franchise / retail / multi-location ops buyers
TANGENTIAL_PATTERNS = [
    r"\bsox\b",
    r"\berm\b",
    r"\bmedical device\b",
    r"\biso 13485\b",
    r"\bpharmaceutical\b",
    r"\bgxp\b",
    r"\bconstruction\b",
    r"\bcontractors\b",
    r"\benergy\b",
    r"\butility\b",
    r"\bbanking\b",
    r"\bfinancial services\b",
    r"\bmanufacturing\b",
    r"\bacross plants\b",
    r"\biso 9001\b",
    r"\bschool chains\b",
    r"\bmulti-campus\b",
    r"\baudit agencies\b",
    r"\bconsulting\b",
]

PRIMARY_FOOD_PATTERNS = [
    r"\brestaurant",
    r"\bqsr\b",
    r"\bcloud kitchen",
    r"\bdark kitchen",
    r"\bbakery\b",
    r"\bcatering\b",
    r"\bfood\b",
    r"\bfssai\b",
    r"\bcold storage\b",
    r"\btemperature log",
    r"\bkitchen\b",
    r"\bshelf life\b",
    r"\bexpiry\b",
    r"\bjolt\b",
]

SECONDARY_FRANCHISE_RETAIL_PATTERNS = [
    r"\bfranchis",
    r"\bretail\b",
    r"\bgrocery\b",
    r"\bstore audit",
    r"\b50 stores\b",
    r"\b15 to 40 stores\b",
    r"\bmulti-location\b",
    r"\bmulti-unit\b",
    r"\boutlet\b",
    r"\bsignage\b",
    r"\bwhatsapp\b",
    r"\bbrand standards\b",
    r"\bbrand consistency\b",
]


def classify_priority(blog: dict[str, Any], major: str, sub: str, tags: list[str]) -> tuple[str, str, str]:
    """
    Return (priority_tier, sub_bucket, buyer_relevance) while preserving
    the blog's existing topic/subtopic/tags.
    """
    title_slug_cat = " ".join([
        blog["title"],
        blog["filename"].rsplit(".", 1)[0].replace("-", " "),
        blog["category"],
    ]).lower()

    haystack = " ".join([
        title_slug_cat,
        " ".join(blog["tags"]),
    ]).lower()

    # Classify priority from title, slug, category, and frontmatter tags (not body/description spillover)
    is_food = any(re.search(p, haystack) for p in PRIMARY_FOOD_PATTERNS)
    is_franchise_retail = any(
        re.search(p, haystack) for p in SECONDARY_FRANCHISE_RETAIL_PATTERNS
    )
    is_tangential_topic = any(re.search(p, title_slug_cat) for p in TANGENTIAL_PATTERNS)

    if is_tangential_topic and not (is_food or is_franchise_retail):
        return (
            "Tangential (Off-ICP / Adjacent Niche)",
            "Enterprise Corporate, Heavy Industrial, Life Sciences & Institutional",
            "Tangential (Non-Core Buyer)",
        )

    # Primary Focus: Restaurant chains, QSRs, cloud kitchens, bakeries, food safety/FSSAI
    if is_food:
        if "competitor-comparison" in tags or "software-evaluation" in tags:
            bucket = "Food & QSR Software Comparisons / Setup Guides"
        elif "food-safety-fssai" in tags:
            bucket = "Food Safety, FSSAI, Cold Chain & Kitchen Hygiene"
        else:
            bucket = "Restaurants, QSRs, Cloud Kitchens, Bakeries & Catering"
        return (
            "P1 — Primary Focus (Food, QSR & Cloud Kitchens)",
            bucket,
            "Directly Relevant (Core Target Buyer)",
        )

    # Secondary Focus: Franchises, retail, and general multi-location operations
    if is_franchise_retail:
        if "vertical-franchise" in tags:
            bucket = "Franchise & Multi-Brand Networks"
        elif "vertical-retail" in tags:
            bucket = "Retail, Grocery & Store Operations"
        else:
            bucket = "General Multi-Location Operations & Rollout"
        return (
            "P2 — Secondary Focus (Franchises, Retail & Multi-Location Ops)",
            bucket,
            "Directly Relevant (Core Target Buyer)",
        )

    # Supporting Topics: Audit fundamentals, software comparisons/buying, security, other industries
    if major == "IT Security, Governance & Data Architecture":
        bucket = "IT Security, Access Control & Data Governance"
    elif major == "Software Evaluation, Comparisons & Pricing":
        bucket = "Software Comparisons, Buying Guides, Features & Pricing"
    elif major == "Industry Playbooks & Verticals":
        bucket = f"Other Industries ({sub})"
    elif major == "Quality Management & Regulatory Compliance":
        bucket = "Quality Management & Compliance Fundamentals"
    elif major == "Migration, Adoption & Change Management":
        bucket = "Migration & Rollout Enablement"
    else:
        bucket = f"Audit & Inspection Fundamentals ({sub})"

    return (
        "P3 — Supporting Topics (Fundamentals, Software, Security & Other Industries)",
        bucket,
        "Directly Relevant (Supporting / Enabling Topic)",
    )


def main() -> None:
    report = json.loads(REPORT_JSON.read_text(encoding="utf-8"))
    blogs: list[dict[str, Any]] = report["extracted_blogs"]

    flagged = gem.detect_flagged_files(blogs)
    flagged_non_blog = {f["filename"] for f in flagged if not f["filename"].endswith(".mdx")}

    tiers: dict[str, dict[str, list[dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    tier_counts: dict[str, int] = defaultdict(int)
    relevance_counts: dict[str, int] = defaultdict(int)

    for b in blogs:
        if b["filename"] in flagged_non_blog:
            continue
        major, sub, tags = gem.assign_topics(b)
        tier, bucket, relevance = classify_priority(b, major, sub, tags)
        entry = {
            **b,
            "existing_major": major,
            "existing_subtopic": sub,
            "assigned_tags": tags,
            "buyer_relevance": relevance,
        }
        tiers[tier][bucket].append(entry)
        tier_counts[tier] += 1
        relevance_counts[relevance] += 1

    tier_order = [
        "P1 — Primary Focus (Food, QSR & Cloud Kitchens)",
        "P2 — Secondary Focus (Franchises, Retail & Multi-Location Ops)",
        "P3 — Supporting Topics (Fundamentals, Software, Security & Other Industries)",
        "Tangential (Off-ICP / Adjacent Niche)",
    ]

    lines: list[str] = [
        "# Audiment Editorial-Priority Content Map",
        "",
        "Layered directly on top of [editorial_content_map.md](file:///Users/sanskar/Documents/Asellus/Audiment/scripts/output/editorial_content_map.md), preserving every original `/blog/<slug>` URL and existing topic/subtopic/tag assignment.",
        "",
        "## Priority & Buyer Relevance Summary",
        "",
        f"- **Total live `.mdx` blogs:** {sum(tier_counts.values())} (plus {len(flagged_non_blog)} non-blog `.md` files flagged separately)",
        f"- **Directly Relevant — Core Target Buyers (P1 + P2):** {tier_counts[tier_order[0]] + tier_counts[tier_order[1]]} blogs",
        f"  - **P1 Primary Focus (Food, QSR, Cloud Kitchens):** {tier_counts[tier_order[0]]}",
        f"  - **P2 Secondary Focus (Franchises, Retail, Multi-Location Ops):** {tier_counts[tier_order[1]]}",
        f"- **Directly Relevant — Supporting Topics (P3):** {tier_counts[tier_order[2]]} blogs",
        f"- **Tangential / Off-ICP Buyers:** {tier_counts[tier_order[3]]} blogs",
        "",
        "---",
        "",
    ]

    for tier in tier_order:
        buckets = tiers.get(tier, {})
        lines.append(f"## {tier} ({tier_counts[tier]} blogs)")
        lines.append("")
        for bucket in sorted(buckets.keys()):
            items = sorted(buckets[bucket], key=lambda x: x["title"])
            lines.append(f"### {bucket} ({len(items)})")
            for item in items:
                tags_str = ", ".join(f"`{t}`" for t in item["assigned_tags"])
                lines.append(
                    f"- [{item['title']}]({item['url']}) — "
                    f"**Relevance:** {item['buyer_relevance']} | "
                    f"**Existing Topic:** {item['existing_major']} → {item['existing_subtopic']} | "
                    f"**Tags:** {tags_str}"
                )
            lines.append("")
        lines.append("---")
        lines.append("")

    lines.append(f"## Flagged Non-Blog / Malformed Files ({len(flagged)} total)")
    lines.append("")
    for f in flagged:
        lines.append(f"- **`{f['filename']}`** (`{f['url']}`) — _{f['title']}_ — {f['reasons']}")

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_MD}")
    for tier in tier_order:
        print(f"  {tier}: {tier_counts[tier]}")


if __name__ == "__main__":
    main()
