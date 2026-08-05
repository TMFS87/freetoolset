const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const files = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !f.startsWith('_') && !f.includes('baidu') && !f.includes('google'))
  .map(f => path.join(ROOT, f));

const extra = ['about.html', 'contact.html', 'privacy-policy.html', 'ai-studio.html', '404.html']
  .map(f => path.join(ROOT, f));

const allFiles = Array.from(new Set([...files, ...extra]));
let changed = 0;

for (const file of allFiles) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  let orig = html;

  // Remove duplicate data-i18n attributes on the same tag
  html = html.replace(/(\sdata-i18n="[^"]+")(?=.*\1)/g, '');

  if (html !== orig) {
    fs.writeFileSync(file, html);
    changed++;
    console.log('Deduped:', path.basename(file));
  }
}

console.log(`\nDeduped ${changed} files.`);
