import glob
import os
import re
import csv

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    text = re.sub(r'[*_#`"]', '', text)
    return text.strip().replace('\n', ' ')

def determine_cluster_and_icp(slug, title, category, desc, text):
    s = f"{slug} {title} {category} {desc} {text}".lower()
    
    # Check cluster
    if any(k in s for k in ['vs-', '-vs', 'alternative', 'comparison', 'pricing', 'hidden-costs', 'rfp', 'contract-terms', 'zoho', 'airtable', 'google-forms', 'excel', 'migrate', 'migration', 'switch']):
        cluster = "Competitor Comparison & Migration"
        icp = "VP of Operations / IT Director / COO"
    elif any(k in s for k in ['qsr', 'restaurant', 'cloud-kitchen', 'fssai', 'bakery', 'kitchen', 'food-safety', 'haccp', 'swiggy', 'zomato', 'ice-cream', 'sweet-shop', 'catering', 'freezer', 'canteen']):
        cluster = "QSR & Food Service Operations"
        icp = "Head of F&B Operations / QSR Brand Manager / Quality Lead"
    elif any(k in s for k in ['retail', 'store', 'grocery', 'visual-merchandising', 'merchandising', 'planogram', 'shelf', 'expiry', 'brand-stores']):
        cluster = "Retail & Multi-Store Operations"
        icp = "VP of Retail Operations / Retail Area Manager"
    elif any(k in s for k in ['franchis', 'brand-standards', 'sub-franchis', 'master-franchis']):
        cluster = "Franchise Governance & Brand Standards"
        icp = "Franchise Operations Director / Master Franchisee"
    elif any(k in s for k in ['hospital', 'clinic', 'medical', 'pharma', 'infection', 'diagnostic', 'gxp', 'nabh', 'healthcare', 'sterilisation']):
        cluster = "Healthcare & Clinical Compliance"
        icp = "Hospital Admin / NABH Quality Coordinator / Clinical Ops Head"
    elif any(k in s for k in ['warehouse', 'logistics', 'manufacturing', 'plant', '5s', 'facility', 'facilities', 'godown', 'ehs', 'safety-walks', 'resort', 'villa', 'hotel', 'housekeeping', 'bank', 'nbfc']):
        cluster = "Facilities, Plant & Supply Chain"
        icp = "VP of Facilities / Plant Manager / Supply Chain Head"
    else:
        cluster = "Proof-Based Auditing & Field Ops"
        icp = "Head of Operations / Area Quality Manager / Internal Audit Head"
        
    return cluster, icp

def generate_pain_point_hook(slug, title, desc, text):
    # Use description if concrete, else derive from title/slug
    if desc and len(desc) > 30 and not desc.startswith("Compare") and not desc.startswith("Learn"):
        hook = desc
    else:
        # Fallback to intelligent generation based on title/slug
        clean_title = title.replace('"', '').strip()
        if "vs" in slug or "alternative" in slug:
            hook = f"Why legacy tools or spreadsheets fall short for multi-location teams: dissecting the operational tradeoffs in {clean_title}."
        elif "fake" in slug or "photo" in slug or "gps" in slug or "verify" in slug:
            hook = f"Preventing pencil-whipping and fake check-ins: why store audits fail without tamper-proof photo verification and GPS proof."
        elif "turnover" in slug or "staff" in slug:
            hook = f"When store staff turns over every 90 days, complex app logins and per-user fees cause checklists to collapse. How to keep compliance seamless."
        elif "whatsapp" in slug or "excel" in slug:
            hook = f"The operational cost of managing audits via WhatsApp photos and messy Excel sheets, and the roadmap to a structured audit workflow."
        elif "fssai" in slug or "compliance" in slug or "hygiene" in slug:
            hook = f"How to keep inspection records audit-ready at every location without scrambling right before a regulatory visit."
        elif "corrective" in slug or "capa" in slug or "action" in slug:
            hook = f"Why audit findings get forgotten in notebooks instead of resolved: enforcing mandatory photo proof before a corrective action can be closed."
        else:
            hook = f"Eliminating operational drift across branches: {clean_title}."
            
    # Clean up hook
    hook = re.sub(r'\s+', ' ', hook).strip()
    if len(hook) > 160:
        hook = hook[:157] + "..."
    return hook

def main():
    blog_files = sorted(glob.glob('content/blog/*.mdx'))
    print(f"Processing {len(blog_files)} files...")
    
    rows = []
    
    for f in blog_files:
        slug = os.path.basename(f).replace('.mdx', '')
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
            
        # Parse frontmatter
        fm_match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        fm = {}
        if fm_match:
            fm_text = fm_match.group(1)
            for line in fm_text.split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    fm[k.strip()] = v.strip().strip('\"\'')
                    
        title = fm.get('title', slug.replace('-', ' ').title())
        desc = fm.get('description', '')
        cat = fm.get('category', '')
        
        body = content[fm_match.end():] if fm_match else content
        # Clean text snippet
        text_snippet = clean_text(body[:500])
        
        cluster, icp = determine_cluster_and_icp(slug, title, cat, desc, text_snippet)
        hook = generate_pain_point_hook(slug, title, desc, text_snippet)
        
        rows.append({
            'title': title,
            'slug': slug,
            'cluster': cluster,
            'icp': icp,
            'hook': hook,
            'status': 'Drafted'
        })
        
    # Write to CSV
    csv_path = 'LINKEDIN_CONTENT_DISTRIBUTION_MASTER.csv'
    with open(csv_path, 'w', encoding='utf-8', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([
            'Blog Title',
            'Slug / URL Path',
            'Core Topic Cluster',
            'Target ICP',
            'Primary Pain Point / LinkedIn Hook',
            'Status'
        ])
        for r in rows:
            writer.writerow([
                r['title'],
                f"/blog/{r['slug']}",
                r['cluster'],
                r['icp'],
                r['hook'],
                r['status']
            ])
            
    # Write to Markdown Tracker
    md_path = 'LINKEDIN_CONTENT_DISTRIBUTION_MASTER.md'
    with open(md_path, 'w', encoding='utf-8') as mdfile:
        mdfile.write("# Master LinkedIn Content Distribution Tracker\n\n")
        mdfile.write(f"Total Content Assets: **{len(rows)} Blogs**\n\n")
        mdfile.write("> **Columns:** Blog Title & Slug | Core Topic Cluster | Target ICP | Primary Pain Point / LinkedIn Hook | Status\n\n")
        
        # Group by cluster
        clusters = {}
        for r in rows:
            c = r['cluster']
            if c not in clusters:
                clusters[c] = []
            clusters[c].append(r)
            
        for c_name, c_rows in clusters.items():
            mdfile.write(f"## {c_name} ({len(c_rows)} Posts)\n\n")
            mdfile.write("| Blog Title & Slug | Target ICP | Primary Pain Point / Hook for LinkedIn | Status |\n")
            mdfile.write("| :--- | :--- | :--- | :--- |\n")
            for r in c_rows:
                title_link = f"[{r['title']}](file:///Users/sanskar/Documents/Asellus/Audiment/content/blog/{r['slug']}.mdx)<br>`/blog/{r['slug']}`"
                # escape pipes in hook
                safe_hook = r['hook'].replace('|', '-')
                mdfile.write(f"| {title_link} | {r['icp']} | {safe_hook} | `{r['status']}` |\n")
            mdfile.write("\n---\n\n")
            
    print(f"Generated {csv_path} and {md_path} successfully!")

if __name__ == '__main__':
    main()
