/* fix-title-counts.js — fix remaining "75" count references that fix-counts.js missed:
   - index.html <title> still says "75+"
   - Multiple pages have "All 75+ Tools" link text
   Does NOT touch CSS values like 0.75rem or max-width:75% or form placeholders.
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let changed = 0;

for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');
  let dirty = false;

  // 1) title tag: "75+ 实用工具" -> "95+ 实用工具"
  if (html.includes('75+ 实用工具')) {
    html = html.split('75+ 实用工具').join('95+ 实用工具');
    dirty = true;
  }

  // 2) "All 75+ Tools" link text -> "All 95+ Tools"
  if (html.includes('All 75+ Tools')) {
    html = html.split('All 75+ Tools').join('All 95+ Tools');
    dirty = true;
  }

  if (dirty) { fs.writeFileSync(fp, html, 'utf8'); changed++; }
}

console.log('files changed: ' + changed);

// verify
let stale = 0;
for (const f of files) {
  const fp = path.join(ROOT, f);
  const html = fs.readFileSync(fp, 'utf8');
  if (/75\+ (实用工具|Tools)/.test(html)) {
    console.log('STALE: ' + f);
    stale++;
  }
}
console.log('stale count refs: ' + stale);
