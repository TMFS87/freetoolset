/* inject-analytics.js — inject GA4 gtag.js snippet into all HTML pages.
   Replace GA4_ID with your real Measurement ID (G-HQJ9VZWMKE).
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// TODO: Replace with your real GA4 Measurement ID
const GA4_ID = 'G-HQJ9VZWMKE';

// Don't inject if already present
if (!GA4_ID || GA4_ID === 'G-HQJ9VZWMKE') {
  console.log('WARNING: Using placeholder GA4_ID. Replace with real ID before deploying.');
  console.log('Get your ID: https://analytics.google.com/ → Admin → Create Property → Data Stream → Web');
}

const SNIPPET = `\n<!-- Google Analytics 4 -->\n` +
  `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>\n` +
  `<script>\n` +
  `  window.dataLayer = window.dataLayer || [];\n` +
  `  function gtag(){dataLayer.push(arguments);}\n` +
  `  gtag('js', new Date());\n` +
  `  gtag('config', '${GA4_ID}', { send_page_view: true });\n` +
  `</script>`;

const ANCHOR = '</head>';
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let injected = 0;
let skipped = 0;

for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');

  // skip if already injected
  if (html.includes('googletagmanager.com/gtag/js')) { skipped++; continue; }
  if (!html.includes(ANCHOR)) { skipped++; continue; }

  html = html.replace(ANCHOR, SNIPPET + '\n' + ANCHOR);
  fs.writeFileSync(fp, html, 'utf8');
  injected++;
}

console.log('injected=' + injected + ' skipped=' + skipped + ' total=' + files.length);
console.log('GA4_ID=' + GA4_ID);
