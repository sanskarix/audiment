const fs = require('fs');

let html = fs.readFileSync('audiment-privacy-policy.html', 'utf-8');

// Extract the body content
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.error("No body found");
  process.exit(1);
}
let bodyContent = bodyMatch[1];

// Remove the <script> tags at the end
bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/, '');

// Convert common HTML to JSX
bodyContent = bodyContent.replace(/class="/g, 'className="');
bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');
bodyContent = bodyContent.replace(/stroke-linecap/g, 'strokeLinecap');
bodyContent = bodyContent.replace(/stroke-linejoin/g, 'strokeLinejoin');

// Replace style strings with style objects
bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, ruleString) => {
  const rules = ruleString.split(';').filter(Boolean);
  const styleObj = rules.map(rule => {
    const [key, value] = rule.split(':').map(str => str.trim());
    const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
    return `${camelKey}: '${value}'`;
  }).join(', ');
  return `style={{ ${styleObj} }}`;
});

function camelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

// Convert specific classes to styles.xyz 
const classesToReplace = [
  'site-header', 'logo', 'logo-text', 'theme-toggle', 'policy-hero', 'policy-badge',
  'policy-title', 'policy-meta', 'policy-layout', 'toc', 'toc-title', 'toc-list',
  'active', 'policy-content', 'policy-section', 'section-number', 'section-title',
  'section-subtitle', 'section-intro', 'data-chips', 'chip', 'provider-grid',
  'provider-card', 'provider-name', 'provider-type', 'contact-box', 'contact-row',
  'dsar-box', 'dsar-box-content', 'btn-primary', 'policy-footer'
];

classesToReplace.forEach(cls => {
  const regex = new RegExp(`className="([^"]*\\b)${cls}(\\b[^"]*)"`, 'g');
  bodyContent = bodyContent.replace(regex, (match, p1, p2) => {
    // We retain the original class as a generic string for DOM selectors if needed,
    // plus the styles module one.
    return `className={\`\${styles.${camelCase(cls)}} ${cls} ${p1}${p2}\`.trim()}`;
  });
});

// For any remaining className="something" that wasn't transformed, change to simple string
// Actually we already wrapped the ones we wanted. Wait, some might have multiple classes.
// Our regex might be naive. A better way is to do a global replace on all className="xyz"

// Replace links and text as requested
const mailtoLink = "mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A";
bodyContent = bodyContent.replace(/https:\/\/app\.termly\.io\/dsar\/b4027388-0475-41b2-9028-bb74d14e2e4b/g, mailtoLink);
bodyContent = bodyContent.replace(/Submit a Request/g, "Email a Data Request");
bodyContent = bodyContent.replace(/Submit a Data Request →/g, "Email a Data Request →");

// Ensure target="_blank" has rel="noopener noreferrer"
// It's mostly already there, just making sure.
bodyContent = bodyContent.replace(/<a([^>]*)target="_blank"([^>]*)>/gi, (match, p1, p2) => {
  if (!match.includes("rel=")) {
    return `<a${p1}target="_blank" rel="noopener noreferrer"${p2}>`;
  }
  return match;
});

// Add the toc-list-item class to links in toc-list so our JS works
bodyContent = bodyContent.replace(/className={`\$\{styles\.tocList} toc-list `}\s*>\s*(<li>\s*<a)/g, "className={`\${styles.tocList} toc-list `}>\n<li><a className=\"toc-list-item\"");
// Let's just blindly add className="toc-list-item" to all links that are inside ol class="toc-list"
// A bit hard via regex. I'll just change href="#.*" to include it if it's in the TOC.
const lines = bodyContent.split('\n');
let inToc = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('styles.tocList')) inToc = true;
  if (inToc && lines[i].includes('</ol>')) inToc = false;
  if (inToc && lines[i].includes('<a href="#')) {
    lines[i] = lines[i].replace('<a href', '<a className={`toc-list-item ${styles.active ? styles.active : ""}`} href');
  }
}
bodyContent = lines.join('\n');

// Clean up any remaining multiple empty classes or weird syntax
bodyContent = bodyContent.replace(/\s+class="[^"]*"/g, ''); // just in case

// Fix empty tags like <br> or <hr>
bodyContent = bodyContent.replace(/<br>/g, '<br />').replace(/<hr>/g, '<hr />');

const output = `import { Inter, Instrument_Serif } from 'next/font/google';
import styles from './privacy-policy.module.css';
import { PrivacyInteractions } from './PrivacyClient';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ['latin'] });

export const metadata = {
  title: "Privacy Policy – Audiment",
  description: "Audiment privacy policy and data rights information.",
  robots: "index, follow"
};

export default function PrivacyPolicyPage() {
  return (
    <div id="privacy-container" className={\`\${styles.container} \${inter.className}\`} data-theme="light">
      <style dangerouslySetInnerHTML={{ __html: \`
        .\${styles.container} {
          --font-body: \${inter.style.fontFamily}, system-ui, sans-serif;
          --font-display: \${instrumentSerif.style.fontFamily}, Georgia, serif;
        }
      \`}} />
      <PrivacyInteractions />
      \${bodyContent}
    </div>
  );
}
`;

fs.writeFileSync('src/app/(public)/privacy-policy/page.tsx', output);
console.log('Successfully generated page.tsx');
