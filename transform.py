import re

with open('audiment-privacy-policy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract the body content
body_match = re.search(r'<body>([\s\S]*?)</body>', html)
if not body_match:
    print("No body found")
    exit(1)
body_content = body_match.group(1)

# Remove script tags
body_content = re.sub(r'<script>[\s\S]*?</script>', '', body_content)

# Convert class to className
body_content = body_content.replace('class="', 'className="')

# Convert SVG attributes
body_content = body_content.replace('stroke-width', 'strokeWidth')
body_content = body_content.replace('stroke-linecap', 'strokeLinecap')
body_content = body_content.replace('stroke-linejoin', 'strokeLinejoin')

# Replace inline style strings with style objects
def style_replacer(match):
    rule_string = match.group(1)
    rules = [r for r in rule_string.split(';') if r.strip()]
    styles = []
    for rule in rules:
        if ':' not in rule: continue
        parts = rule.split(':')
        key = parts[0].strip()
        val = ':'.join(parts[1:]).strip()
        camel_key = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), key)
        styles.append(f"{camel_key}: '{val}'")
    return "style={{ " + ", ".join(styles) + " }}"

body_content = re.sub(r'style="([^"]*)"', style_replacer, body_content)

def camel_case(s):
    return re.sub(r'-([a-z])', lambda x: x.group(1).upper(), s)

classes_to_replace = [
    'site-header', 'logo', 'logo-text', 'theme-toggle', 'policy-hero', 'policy-badge',
    'policy-title', 'policy-meta', 'policy-layout', 'toc', 'toc-title', 'toc-list',
    'active', 'policy-content', 'policy-section', 'section-number', 'section-title',
    'section-subtitle', 'section-intro', 'data-chips', 'chip', 'provider-grid',
    'provider-card', 'provider-name', 'provider-type', 'contact-box', 'contact-row',
    'dsar-box', 'dsar-box-content', 'btn-primary', 'policy-footer'
]

for cls in classes_to_replace:
    pattern = r'className="([^"]*\b)' + cls + r'(\b[^"]*)"'
    def class_replacer(match):
        p1 = match.group(1)
        p2 = match.group(2)
        cc = camel_case(cls)
        # We append styles.XYZ and also keep the original class for interactions
        return f"className={{`${{styles.{cc}}} {cls} {p1}{p2}`.trim()}}"
    body_content = re.sub(pattern, class_replacer, body_content)

# Replace dsar buttons & text
mailto = "mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A"
body_content = body_content.replace('https://app.termly.io/dsar/b4027388-0475-41b2-9028-bb74d14e2e4b', mailto)
body_content = body_content.replace('Submit a Request', 'Email a Data Request')
body_content = body_content.replace('Submit a Data Request →', 'Email a Data Request →')

# Add missing rel="noopener noreferrer"
def link_replacer(match):
    full_a = match.group(0)
    if 'rel=' not in full_a:
        # Just insert rel attrs
        return full_a.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"')
    return full_a
body_content = re.sub(r'<a[^>]*target="_blank"[^>]*>', link_replacer, body_content)

# Add toc-list-item to toc links
def toc_replacer(match):
    # match.group() is `<a href="#`
    return '<a className="toc-list-item" href="#'
body_content = re.sub(r'<a href="#', toc_replacer, body_content)

# Convert single tags <br>, <hr>
body_content = body_content.replace('<br>', '<br />').replace('<hr>', '<hr />')

# Convert SVG tags properly
body_content = body_content.replace('viewbox', 'viewBox')

# Deal with weird stuff if any
body_content = re.sub(r'\s+class="[^"]*"', '', body_content)

# Special NextJS Link component fix - the instructions didn't necessitate next/link for in-content links,
# but using standard anchor tags is perfectly fine for privacy policy pages.

output = f"""import {{ Inter, Instrument_Serif }} from 'next/font/google';
import styles from './privacy-policy.module.css';
import {{ PrivacyInteractions }} from './PrivacyClient';

const inter = Inter({{ subsets: ['latin'] }});
const instrumentSerif = Instrument_Serif({{ weight: "400", style: ["normal", "italic"], subsets: ['latin'] }});

export const metadata = {{
  title: "Privacy Policy – Audiment",
  description: "Audiment privacy policy and data rights information.",
  robots: "index, follow"
}};

export default function PrivacyPolicyPage() {{
  return (
    <div id="privacy-container" className={{`${{styles.container}} ${{inter.className}}`}} data-theme="light">
      <style dangerouslySetInnerHTML={{{{ __html: `
        .${{styles.container}} {{
          --font-body: ${{inter.style.fontFamily}}, system-ui, sans-serif;
          --font-display: ${{instrumentSerif.style.fontFamily}}, Georgia, serif;
        }}
      `}}}} />
      <PrivacyInteractions />
      {body_content}
    </div>
  );
}}
"""

with open('src/app/(public)/privacy-policy/page.tsx', 'w', encoding='utf-8') as f:
    f.write(output)
print("done")
