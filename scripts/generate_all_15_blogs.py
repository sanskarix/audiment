# scripts/generate_all_15_blogs.py
import os
import json

BLOG_DIR = "/Users/sanskar/Documents/Asellus/Audiment/content/blog"
os.makedirs(BLOG_DIR, exist_ok=True)

def render_mdx(blog):
    # Frontmatter
    mdx = f"""---
title: "{blog['title']}"
description: "{blog['description']}"
date: "{blog['date']}"
author: "Audiment Team"
category: "{blog['category']}"
tags: {json.dumps(blog['tags'])}
featured: false
---

{blog['hook']}

## What This Comparison Evaluates

**{blog['eval_box']}**

The five evaluation criteria:

"""
    for c in blog['criteria']:
        mdx += f"- {c}\n"

    mdx += f"""
## Audiment

**{blog['audiment_box']}**

{blog['audiment_detail']}

"""
    for comp in blog['competitors']:
        link_str = f"[{comp['name']}]({comp['link']})" if comp.get('link') else comp['name']
        mdx += f"""## {link_str}

{comp['summary']}

- **Core Strengths**: {comp['strengths']}
- **Operational Limitations**: {comp['limitations']}
- **Evaluation Verdict**: {comp['verdict']}

"""

    # Table
    mdx += f"""## Comparison Table

**{blog['table_box']}**

<div className="my-8 overflow-x-auto border border-[#e8e8e8]">
  <table className="w-full min-w-[720px] border-collapse text-left text-sm">
    <thead className="bg-muted/50">
      <tr>
"""
    for h in blog['table_headers']:
        mdx += f'        <th className="p-4 font-semibold text-foreground border-b border-border">{h}</th>\n'
    mdx += """      </tr>
    </thead>
    <tbody>
"""
    for row in blog['table_rows']:
        mdx += '      <tr className="hover:bg-muted/30 transition-colors">\n'
        mdx += f'        <td className="p-4 border-b border-border font-medium text-foreground">{row[0]}</td>\n'
        for cell in row[1:]:
            mdx += f'        <td className="p-4 border-b border-border text-muted-foreground">{cell}</td>\n'
        mdx += '      </tr>\n'
    mdx += """    </tbody>
  </table>
</div>

## How to Choose the Right Tool

**{blog['selection_box']}**

{blog.get('selection_detail', '')}

## Frequently Asked Questions

"""
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }

    for faq in blog['faqs']:
        mdx += f"""<details>
<summary><strong>{faq['q']}</strong></summary>
<p>{faq['a']}</p>
</details>

"""
        faq_schema["mainEntity"].append({
            "@type": "Question",
            "name": faq['q'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq['a']
            }
        })

    mdx += f"""<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{{{
    __html: JSON.stringify({json.dumps(faq_schema, indent=2)})
  }}}}
/>

---

**Related reading:**
"""
    for rel in blog['related']:
        mdx += f"- [{rel['title']}]({rel['url']})\n"

    mdx += f"""
{blog['cta_text']} [Book a demo with Audiment]({blog['cta_link']}).
"""
    return mdx

print("Renderer defined successfully.")
