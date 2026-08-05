const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('more-tools-section')) return;

  // Extract category i18n key from breadcrumb
  const catMatch = html.match(/<a href="([^"]+\.html)"[^>]*data-i18n="catTitle_([^"]+)">([^<]+)<\/a>/);
  if (!catMatch) return;

  const catHref = catMatch[1];
  const catKey = catMatch[2];
  const catName = catMatch[3].trim();

  // Replace the category card in more-tools-section if it lacks data-i18n
  const oldCard = `<a href="${catHref}" class="more-tool-card">\n          <span class="mt-icon">📂</span>\n          <span class="mt-name">${catName}</span>\n        </a>`;
  const newCard = `<a href="${catHref}" class="more-tool-card">\n          <span class="mt-icon">📂</span>\n          <span class="mt-name" data-i18n="catTitle_${catKey}">${catName}</span>\n        </a>`;

  if (html.includes(oldCard)) {
    html = html.replace(oldCard, newCard);
    fs.writeFileSync(filePath, html);
    console.log(`Fixed: ${file} (catTitle_${catKey})`);
  } else {
    console.log(`Skip: ${file}`);
  }
});
