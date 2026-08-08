/* fix-counts.js — normalize site-wide tool-count phrasing 75 -> 95+ across all html. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// ordered to avoid partial overlaps
const REPL = [
  ['75 个免费在线工具', '95+ 个免费在线工具'],
  ['75+ 个免费在线工具', '95+ 个免费在线工具'],
  ['75+ free online tools', '95+ free online tools'],
  ['75+ 个', '95+ 个'],
];

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let changed = 0;
for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');
  let dirty = false;
  for (const [a, b] of REPL) {
    if (html.includes(a)) { html = html.split(a).join(b); dirty = true; }
  }
  if (dirty) { fs.writeFileSync(fp, html, 'utf8'); changed++; }
}
console.log('files changed: ' + changed + ' / ' + files.length);
