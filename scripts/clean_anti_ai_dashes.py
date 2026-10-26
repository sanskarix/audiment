import os
import glob
import re

def clean_dashes(text: str) -> str:
    # 1. Bold list headers with dash: 1. **Define standard** – rest -> 1. **Define standard:** rest
    text = re.sub(r'(\*\*[^*]+?\*\*)\s*[–—]\s*', r'\1: ', text)
    
    # 2. Number ranges: 10–15 -> 10-15
    text = re.sub(r'(\d+)\s*[–—]\s*(\d+)', r'\1-\2', text)
    
    # 3. Unit ranges: 1°C–4°C -> 1°C to 4°C
    text = re.sub(r'(\d+°?C?)\s*[–—]\s*(\d+°C)', r'\1 to \2', text)

    # 4. Heading separators: # Title – Subtitle -> # Title: Subtitle
    text = re.sub(r'^(#+\s+[^\n–—]+?)\s*[–—]\s*', r'\1: ', text, flags=re.MULTILINE)

    # 5. Common transition phrases
    text = re.sub(r'\s*[–—]\s*not\b', r', not', text)
    text = re.sub(r'\s*[–—]\s*typically\b', r', typically', text)
    text = re.sub(r'\s*[–—]\s*especially\b', r', especially', text)
    text = re.sub(r'\s*[–—]\s*particularly\b', r', particularly', text)
    text = re.sub(r'\s*[–—]\s*meaning\b', r', meaning', text)
    text = re.sub(r'\s*[–—]\s*which\b', r', which', text)
    text = re.sub(r'\s*[–—]\s*where\b', r', where', text)
    text = re.sub(r'\s*[–—]\s*when\b', r', when', text)
    text = re.sub(r'\s*[–—]\s*by\b', r', by', text)
    text = re.sub(r'\s*[–—]\s*with\b', r', with', text)
    text = re.sub(r'\s*[–—]\s*from\b', r', from', text)
    text = re.sub(r'\s*[–—]\s*including\b', r', including', text)
    text = re.sub(r'\s*[–—]\s*such as\b', r', such as', text)
    text = re.sub(r'\s*[–—]\s*rather than\b', r', rather than', text)
    text = re.sub(r'\s*[–—]\s*and\b', r', and', text)
    text = re.sub(r'\s*[–—]\s*but\b', r', but', text)

    # Quotes after dash: " – \"" -> ": \""
    text = re.sub(r'\s*[–—]\s*(["“])', r': \1', text)

    # Clean existing punctuation collisions
    text = re.sub(r',\s*[–—]\s*', r', ', text)
    text = re.sub(r':\s*[–—]\s*', r': ', text)

    # General remaining " – " or " — "
    def dash_replacer(m):
        post = m.string[m.end():min(len(m.string), m.end() + 20)]
        if post and post[0].isupper():
            return ': '
        return ', '

    text = re.sub(r'\s+[–—]\s+', dash_replacer, text)
    # Any isolated single dash chars remaining
    text = re.sub(r'[–—]', '-', text)

    return text

def standardize_special_faqs():
    # 1. content/blog/multi-location-compliance-guide.mdx
    ml_path = 'content/blog/multi-location-compliance-guide.mdx'
    if os.path.exists(ml_path):
        txt = open(ml_path, 'r', encoding='utf-8').read()
        # Find the <div className="bg-muted/20... block and replace with standard FAQ
        faq_replacement = '''## Frequently Asked Questions

<details>
<summary><strong>How can we ensure consistency across franchisee-owned locations?</strong></summary>
<p>Franchise compliance requires clear contractual brand standards coupled with mandatory corporate or third-party audits. Standardised software ensures all franchisees are evaluated objectively against identical metrics.</p>
</details>

<details>
<summary><strong>What is the most common cause of compliance failure in chain stores?</strong></summary>
<p>Poor communication and high staff turnover. When operating procedures are not reinforced through accessible checklists and habit-building routines, new frontline staff drift out of compliance.</p>
</details>

<details>
<summary><strong>How do we manage audits in areas with poor internet connection?</strong></summary>
<p>Audits continue offline and sync automatically once the device reconnects. Teams complete inspections and capture evidence without interrupting execution.</p>
</details>

<details>
<summary><strong>What is the ideal ratio of area managers to store locations?</strong></summary>
<p>While dependent on operational complexity, an industry benchmark is 1 Area Manager to 8-12 locations. This ratio allows the manager to conduct thorough physical audits across all locations monthly while resolving operational issues.</p>
</details>

<details>
<summary><strong>Should self-inspections replace corporate audits?</strong></summary>
<p>No, they are complementary. Daily self-inspections build daily compliance habits and handle immediate tactical risks like temperature logs. Corporate audits verify the integrity of those self-inspections and identify deeper systemic gaps.</p>
</details>
'''
        txt = re.sub(r'<div className="bg-muted/20[\s\S]*?</div>\s*</div>', faq_replacement, txt)
        with open(ml_path, 'w', encoding='utf-8') as f:
            f.write(txt)

    # 2. content/blog/restaurant-audit-guide.mdx
    rag_path = 'content/blog/restaurant-audit-guide.mdx'
    if os.path.exists(rag_path):
        txt = open(rag_path, 'r', encoding='utf-8').read()
        faq_replacement = '''## Frequently Asked Questions

<details>
<summary><strong>How often should a restaurant conduct internal hygiene audits?</strong></summary>
<p>Beyond daily temperature checks, a comprehensive hygiene self-assessment should be conducted weekly by on-site management. Area managers should perform unannounced evaluations at least monthly.</p>
</details>

<details>
<summary><strong>What happens if an external auditor finds a critical failure?</strong></summary>
<p>Critical failures involving food safety risks lead to immediate downgrades of health ratings and can result in on-the-spot closure notices until the issue is demonstrably rectified.</p>
</details>

<details>
<summary><strong>Why are paper checklists problematic for daily prep?</strong></summary>
<p>Paper records are easily falsified, easily destroyed in busy kitchens, difficult to track across locations without manual data entry, and offer no automatic alerts when dangerous temperatures are logged.</p>
</details>

<details>
<summary><strong>Who should perform the brand standard audit?</strong></summary>
<p>To prevent bias, brand audits should be conducted by someone outside the store's direct reporting line: typically an Area Manager, Regional Coach, or a third-party Quality Assurance specialist.</p>
</details>

<details>
<summary><strong>Can we customize restaurant audit apps?</strong></summary>
<p>Yes. Platforms like Audiment allow corporate operations teams to build custom, localized checklists that deploy instantly to every store tablet or smartphone across the chain.</p>
</details>
'''
        txt = re.sub(r'<div className="bg-muted/20[\s\S]*?</div>\s*</div>', faq_replacement, txt)
        with open(rag_path, 'w', encoding='utf-8') as f:
            f.write(txt)

    # 3. content/blog/why-quality-control-is-important.mdx
    wqc_path = 'content/blog/why-quality-control-is-important.mdx'
    if os.path.exists(wqc_path):
        txt = open(wqc_path, 'r', encoding='utf-8').read()
        faq_replacement = '''## Frequently Asked Questions

<details>
<summary><strong>Why is quality control important in business?</strong></summary>
<p>Quality control provides structured verification rather than assumption that standards are met across locations. Without systematic checks, quality drift happens gradually across shifts until it surfaces as a customer complaint, regulatory penalty, or lost revenue.</p>
</details>

<details>
<summary><strong>What happens when quality control fails?</strong></summary>
<p>When quality control fails, consequences compound over time. Common results include unaddressed customer complaints, regulatory fines from unmonitored standard drift, brand inconsistency between stores, and staff turnover where operational standards are not enforced.</p>
</details>

<details>
<summary><strong>What are the benefits of quality audits?</strong></summary>
<p>Key benefits include tamper-proof photographic evidence that inspections occurred, comparable score benchmarks across locations, automatic corrective action dispatch when checks fail, and recurring issue detection before customer churn occurs.</p>
</details>

<details>
<summary><strong>How do quality audits improve customer satisfaction?</strong></summary>
<p>Audits create operational discipline that makes consistent customer experiences repeatable across all locations and shifts. Multi-location brands that audit regularly maintain narrower quality gaps between their highest and lowest-performing outlets.</p>
</details>
'''
        # Replace the custom details container and script
        txt = re.sub(r'<div className="space-y-4 my-8">[\s\S]*?</script>', faq_replacement, txt)
        with open(wqc_path, 'w', encoding='utf-8') as f:
            f.write(txt)

def main():
    print("Step 1: Standardizing special FAQ formats...")
    standardize_special_faqs()

    print("Step 2: Cleaning all en-dashes and em-dashes across all MDX blog posts...")
    files = glob.glob('content/blog/*.mdx')
    modified_count = 0
    total_dashes_removed = 0

    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        dashes_in_file = content.count('–') + content.count('—')
        if dashes_in_file > 0:
            cleaned = clean_dashes(content)
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            modified_count += 1
            total_dashes_removed += dashes_in_file

    print(f"Modified {modified_count} files, removed {total_dashes_removed} dashes.")

    # Validation pass
    print("\nStep 3: Validating all 222 blogs...")
    remaining_em = 0
    remaining_en = 0
    missing_faqs = []

    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            c = f.read()
        remaining_em += c.count('—')
        remaining_en += c.count('–')

        # check faq extraction
        pattern = r'(##\s+Frequently Asked Questions[\s\S]*?)(?=\n##\s+|$)'
        match = re.search(pattern, c, re.IGNORECASE)
        if not match:
            missing_faqs.append((fpath, 'No FAQ heading'))
        else:
            faqs = re.findall(r'<details[\s\S]*?<summary[^>]*>([\s\S]*?)</summary>[\s\S]*?<p[^>]*>([\s\S]*?)</p>[\s\S]*?</details>', match.group(1), re.IGNORECASE)
            if len(faqs) == 0:
                missing_faqs.append((fpath, '0 details/summary parsed'))

    print(f"Validation Results:")
    print(f"  Total MDX blog files: {len(files)}")
    print(f"  Remaining em-dashes (—): {remaining_em}")
    print(f"  Remaining en-dashes (–): {remaining_en}")
    print(f"  Files missing FAQ or 0 parsed: {len(missing_faqs)}")
    if missing_faqs:
        for f, err in missing_faqs:
            print(f"    {f}: {err}")
    else:
        print("  ALL 222 BLOGS (100%) HAVE VALID, PARSED FAQS!")

if __name__ == '__main__':
    main()
