const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

const solutions = [
  { match: /food safety audit software/i, link: '/solutions/food-safety-audit-software', label: 'food safety audit software' },
  { match: /franchise audit software/i, link: '/solutions/franchise-audit-software', label: 'franchise audit software' },
  { match: /hotel audit software/i, link: '/solutions/hotel-audit-software', label: 'hotel audit software' },
  { match: /manufacturing audit software/i, link: '/solutions/manufacturing-audit-software', label: 'manufacturing audit software' },
  { match: /qsr audit software/i, link: '/solutions/qsr-audit-software', label: 'qsr audit software' },
  { match: /restaurant audit software/i, link: '/solutions/restaurant-audit-software', label: 'restaurant audit software' },
  { match: /retail audit software/i, link: '/solutions/retail-audit-software', label: 'retail audit software' },
];

const platforms = [
  { match: /corrective actions?/i, link: '/platform/corrective-actions', label: 'corrective actions' },
  { match: /geo-verified audits?/i, link: '/platform/geo-verified-audits', label: 'geo-verified audits' },
  { match: /geo-verified/i, link: '/platform/geo-verified-audits', label: 'geo-verified' },
  { match: /issue tracking/i, link: '/platform/issue-tracking', label: 'issue tracking' },
  { match: /operational dashboards?/i, link: '/platform/operational-dashboards', label: 'operational dashboards' },
  { match: /proof-based audits?/i, link: '/platform/proof-based-audits', label: 'proof-based audits' },
  { match: /photo evidence/i, link: '/platform/proof-based-audits', label: 'photo evidence' },
  { match: /dashboards?/i, link: '/platform/operational-dashboards', label: 'dashboards' },
];

const useCases = [
  { match: /audit checklist software/i, link: '/use-cases/audit-checklist-software', label: 'audit checklist software' },
  { match: /audit checklists?/i, link: '/use-cases/audit-checklist-software', label: 'audit checklists' },
  { match: /corrective action tracking/i, link: '/use-cases/corrective-action-tracking', label: 'corrective action tracking' },
  { match: /inspection management software/i, link: '/use-cases/inspection-management-software', label: 'inspection management software' },
  { match: /inspection management/i, link: '/use-cases/inspection-management-software', label: 'inspection management' },
  { match: /multi-location compliance/i, link: '/use-cases/multi-location-compliance', label: 'multi-location compliance' },
  { match: /multi-location/i, link: '/use-cases/multi-location-compliance', label: 'multi-location' },
];

const compares = [
  { match: /checklist apps?/i, link: '/compare/audiment-vs-checklist-apps', label: 'checklist apps' },
  { match: /safetyculture/i, link: '/compare/audiment-vs-safetyculture', label: 'SafetyCulture' },
  { match: /iauditor/i, link: '/compare/audiment-vs-safetyculture', label: 'iAuditor' },
  { match: /jolt/i, link: '/compare/audiment-vs-jolt', label: 'Jolt' },
  { match: /zenput/i, link: '/compare/audiment-vs-zenput', label: 'Zenput' },
  { match: /goaudits/i, link: '/compare/audiment-vs-goaudits', label: 'GoAudits' },
];

function isInsideLink(str, index) {
  // A simple heuristic: search backwards for '[' and ']'. If '[' is closer than ']', we're inside a link text.
  // Also check if we are inside parentheses of a link.
  let openBracketIndex = str.lastIndexOf('[', index);
  let closeBracketIndex = str.lastIndexOf(']', index);
  
  // Similarly check for href part inside parentheses
  let openParenIndex = str.lastIndexOf('(', index);
  let closeParenIndex = str.lastIndexOf(')', index);

  if (openBracketIndex > closeBracketIndex) return true; // Inside link text
  // To avoid modifying the URL part of a link
  if (openParenIndex > closeParenIndex && str[openParenIndex - 1] === ']') return true; // Inside link url

  // Frontmatter protection
  let dashesIndex = str.lastIndexOf('---', index);
  if (dashesIndex === 0) return true; // Inside frontmatter (assuming only one block at start)

  return false;
}

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  let hasSolution = content.includes('/solutions/');
  let hasPlatform = content.includes('/platform/');
  let hasUseCase = content.includes('/use-cases/');
  let hasCompare = content.includes('/compare/');

  const processCategory = (categoryLinks, hasFlag, fallbackType) => {
    if (hasFlag) return true;
    for (const item of categoryLinks) {
      let regex = new RegExp(item.match.source, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (!isInsideLink(content, match.index)) {
          // Found a valid match to replace!
          const before = content.slice(0, match.index);
          const after = content.slice(match.index + match[0].length);
          const replacementStr = `[${match[0]}](${item.link})`;
          content = before + replacementStr + after;
          return true; // only replace one per category
        }
      }
    }
    return false;
  };

  hasSolution = processCategory(solutions, hasSolution, 'solution');
  hasPlatform = processCategory(platforms, hasPlatform, 'platform');
  hasUseCase = processCategory(useCases, hasUseCase, 'usecase');
  hasCompare = processCategory(compares, hasCompare, 'compare'); 

  if (!hasSolution) {
    let industry = 'retail';
    if (file.includes('food') || file.includes('restaurant') || file.includes('qsr')) industry = 'restaurant';
    else if (file.includes('hotel')) industry = 'hotel';
    else if (file.includes('manufacturing')) industry = 'manufacturing';
    else if (file.includes('franchise')) industry = 'franchise';

    let fallbackMatched = false;
    let regex = /audit software/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!isInsideLink(content, match.index)) {
        const before = content.slice(0, match.index);
        const after = content.slice(match.index + match[0].length);
        const replacementStr = `[${match[0]}](/solutions/${industry}-audit-software)`;
        content = before + replacementStr + after;
        fallbackMatched = true;
        break;
      }
    }

    if (!fallbackMatched) {
      const paragraphRegex = /(\n\n[A-Z][^\n]+)(\n\n)/;
      const matchPar = paragraphRegex.exec(content);
      if (matchPar) {
        const before = content.slice(0, matchPar.index + matchPar[1].length);
        const after = content.slice(matchPar.index + matchPar[1].length);
        const replacementStr = ` This is why many organizations implement [audit software](/solutions/${industry}-audit-software) to standardize their operations.`;
        content = before + replacementStr + after;
      }
    }
  }

  if (!hasUseCase) {
    const paragraphRegex = /(\n\n[A-Z][^\n]+)(\n\n)/;
    const matchPar = paragraphRegex.exec(content);
    if (matchPar) {
      const before = content.slice(0, matchPar.index + matchPar[1].length);
      const after = content.slice(matchPar.index + matchPar[1].length);
      const replacementStr = ` A centralized system is critical for [multi-location compliance](/use-cases/multi-location-compliance).`;
      content = before + replacementStr + after;
    }
  }

  if (!hasPlatform) {
    const paragraphRegex = /(\n\n[A-Z][^\n]+)(\n\n)/;
    const matchPar = paragraphRegex.exec(content);
    if (matchPar) {
      const before = content.slice(0, matchPar.index + matchPar[1].length);
      const after = content.slice(matchPar.index + matchPar[1].length);
      const replacementStr = ` Implementing [proof-based audits](/platform/proof-based-audits) ensures that operational standards are actively verified.`;
      content = before + replacementStr + after;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} files.`);
