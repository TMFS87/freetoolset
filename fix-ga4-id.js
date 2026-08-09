const fs = require('fs');
const path = require('path');

const REAL_ID = 'G-HQJ9VZWMKE';
const PLACEHOLDER = 'G-HQJ9VZWMKE';

// ---- Step 1: Replace placeholder in all files ----
let replaced = 0;
function replaceInDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory() && f !== 'node_modules' && f !== '.git') {
      replaceInDir(p);
      continue;
    }
    if (!f.endsWith('.html') && !f.endsWith('.js')) continue;
    let h = fs.readFileSync(p, 'utf8');
    if (!h.includes(PLACEHOLDER)) continue;
    h = h.split(PLACEHOLDER).join(REAL_ID);
    fs.writeFileSync(p, h, 'utf8');
    replaced++;
    console.log('  replaced:', p);
  }
}
replaceInDir(__dirname);
console.log('\nStep 1 done: replaced placeholder in', replaced, 'files\n');

// ---- Step 2: Add GA4 snippet to blog pages missing it ----
const GA_SNIPPET = `<script async src="https://www.googletagmanager.com/gtag/js?id=${REAL_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${REAL_ID}', { send_page_view: true });
</script>`;

const blogDir = path.join(__dirname, 'blog');
if (fs.existsSync(blogDir)) {
  let added = 0;
  for (const f of fs.readdirSync(blogDir)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(blogDir, f);
    let h = fs.readFileSync(p, 'utf8');
    // Skip if already has gtag
    if (h.includes('googletagmanager') || h.includes(REAL_ID)) continue;
    // Inject before </head> or <head> close
    const headClose = h.indexOf('</head>');
    if (headClose === -1) { console.log('  NO HEAD:', f); continue; }
    h = h.substring(0, headClose) + GA_SNIPPET + '\n    ' + h.substring(headClose);
    fs.writeFileSync(p, h, 'utf8');
    added++;
    console.log('  added GA4:', f);
  }
  console.log('\nStep 2 done: added GA4 snippet to', added, 'blog pages\n');
}

console.log('ALL DONE');
