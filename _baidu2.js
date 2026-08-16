const fs = require('fs');
const path = require('path');

const root = 'C:\\Users\\Administrator\\freetoolset';
const htmlFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
})(root);

// Baidu auto-push IIFE (two variants share the same shape)
const re = /\s*\(function\(\)\{var bp=document\.createElement\('script'\);[\s\S]*?\}\)\(\);\s*/g;
let filesTouched = 0;
let removed = 0;
for (const f of htmlFiles) {
  let s = fs.readFileSync(f, 'utf8');
  if (re.test(s)) {
    re.lastIndex = 0;
    s = s.replace(re, '');
    fs.writeFileSync(f, s);
    filesTouched++;
    removed++;
  }
}
console.log('html files touched:', filesTouched);
console.log('baidu push IIFEs removed:', removed);
