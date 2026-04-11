import re

with open("audiment-privacy-policy.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract styles
style_match = re.search(r'<style>([\s\S]*?)</style>', html)
style_content = style_match.group(1) if style_match else ""

# Extract body
body_match = re.search(r'<body>([\s\S]*?)<script>', html)
if body_match:
    body_content = body_match.group(1)
else:
    body_match = re.search(r'<body>([\s\S]*?)</body>', html)
    body_content = body_match.group(1)

# Basic JSX conversions
body_content = body_content.replace('class="', 'className="')
body_content = body_content.replace('stroke-width', 'strokeWidth')
body_content = body_content.replace('stroke-linecap', 'strokeLinecap')
body_content = body_content.replace('stroke-linejoin', 'strokeLinejoin')
body_content = body_content.replace('<br>', '<br />')
body_content = body_content.replace('<hr>', '<hr />')

# Remove comments
body_content = re.sub(r'<!--.*?-->', '', body_content)

# Convert specific style strings
# 1
body_content = body_content.replace('style="margin-top: 1.5rem;"', 'style={{ marginTop: "1.5rem" }}')
# 2
body_content = body_content.replace(
    'style="background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-8); border: 1px solid var(--color-border); border-top: 1px solid var(--color-border); margin-bottom: var(--space-12);"',
    'style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-8)", border: "1px solid var(--color-border)", borderTop: "1px solid var(--color-border)", marginBottom: "var(--space-12)" }}'
)
# 3
body_content = body_content.replace('style="margin-top: 1rem; display: inline-flex;"', 'style={{ marginTop: "1rem", display: "inline-flex" }}')

# DSAR replacements
mailto = 'mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A'
body_content = body_content.replace('https://app.termly.io/dsar/b4027388-0475-41b2-9028-bb74d14e2e4b', mailto)
body_content = body_content.replace('Submit a Request', 'Email a Data Request')
body_content = body_content.replace('Submit a Data Request →', 'Email a Data Request')

with open("src/app/(public)/privacy-policy/page.tsx", "w", encoding="utf-8") as out:
    out.write(f"""import {{ Inter, Instrument_Serif }} from 'next/font/google';
import {{ PrivacyInteractions }} from './PrivacyClient';

const inter = Inter({{ subsets: ['latin'] }});
const instrumentSerif = Instrument_Serif({{ weight: "400", style: ["normal", "italic"], subsets: ['latin'] }});

export const metadata = {{
  title: "Privacy Policy – Audiment",
  description: "Audiment privacy policy and data rights information.",
  robots: "index, follow",
}};

export default function PrivacyPolicyPage() {{
  return (
    <div style={{{{ '--font-body': inter.style.fontFamily, '--font-display': instrumentSerif.style.fontFamily }} as React.CSSProperties }}>
      <style dangerouslySetInnerHTML={{{{ __html: `{style_content}` }}}} />
      <PrivacyInteractions />
      {{/* Original body content starts below */}}
      {body_content}
    </div>
  );
}}
""")

print("Rewrote page.tsx properly")
