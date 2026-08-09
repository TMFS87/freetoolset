/* fix-lang-hreflang.js — fix language consistency across all HTML pages:
   1) lang="en" -> lang="zh-CN"
   2) Add <link rel="alternate" hreflang="zh-CN"> to <head>
   3) Ensure og:locale is zh_CN
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const BASE = 'https://www.freetoolset.app/';

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let changed = 0;

for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');
  let dirty = false;

  // 1) Fix lang attribute
  if (html.includes('lang="en"')) {
    html = html.split('lang="en"').join('lang="zh-CN"');
    dirty = true;
  }
  // also handle lang=en without quotes
  if (html.match(/<html[^>]*\blang=en\b/)) {
    html = html.replace(/(<html[^>]*\b)lang=en(\b)/g, '$1lang="zh-CN"$2');
    dirty = true;
  }

  // 2) Add hreflang link tag (before </head>)
  const pageUrl = BASE + (f === 'index.html' ? '' : f);
  const hreflangTag = '\n  <link rel="alternate" hreflang="zh-CN" href="' + pageUrl + '" />\n' +
                       '  <link rel="alternate" hreflang="x-default" href="' + pageUrl + '" />';
  if (!html.includes('hreflang=')) {
    html = html.split('</head>').join(hreflangTag + '\n</head>');
    dirty = true;
  }

  // 3) Fix og:locale if present (en_US -> zh_CN)
  if (html.includes('og:locale" content="en_US"')) {
    html = html.split('og:locale" content="en_US"').join('og:locale" content="zh_CN"');
    dirty = true;
  }

  if (dirty) { fs.writeFileSync(fp, html, 'utf8'); changed++; }
}

console.log('files changed: ' + changed + ' / ' + files.length);

// Verify
let noLang = 0, noHref = 0;
for (const f of files) {
  const h = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (!h.includes('lang="zh-CN"') && !h.includes("lang=zh-CN")) noLang++;
  if (!h.includes('hreflang=')) noHref++;
}
console.log('missing lang=zh-CN: ' + noLang + ', missing hreflang: ' + noHref);
