const fs = require('fs');
const path = require('path');

const solutions = [
  "food safety audit software",
  "franchise audit software",
  "hotel audit software",
  "manufacturing audit software",
  "qsr audit software",
  "restaurant audit software",
  "retail audit software",
  "retail store audit",
  "audit software",
];

const platforms = [
  "corrective action",
  "geo-verified",
  "issue track",
  "dashboard",
  "proof-based",
  "photo evidence", // can map to proof-based
];

const useCases = [
  "audit checklist",
  "inspection management",
  "multi-location compliance",
  "multi-location", // very broad
  "compliance check", // can map to multi-location compliance
];

let noSolution = 0, noPlatform = 0, noUseCase = 0;

const dir = path.join(__dirname, 'content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const text = fs.readFileSync(path.join(dir, file), 'utf-8').toLowerCase();
  
  const hasSol = solutions.some(s => text.includes(s));
  const hasPlat = platforms.some(s => text.includes(s));
  const hasUse = useCases.some(s => text.includes(s));

  if (!hasSol) noSolution++;
  if (!hasPlat) noPlatform++;
  if (!hasUse) noUseCase++;
});

console.log(`Total files: ${files.length}`);
console.log(`Missing Solution keywords: ${noSolution}`);
console.log(`Missing Platform keywords: ${noPlatform}`);
console.log(`Missing Use Case keywords: ${noUseCase}`);
