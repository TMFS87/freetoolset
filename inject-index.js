/* inject-index.js — inject the 20 new tools into index.html without touching existing cards. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const CAT_LABEL = { calculator: 'Calculator', converter: 'Converter', text: 'Text', developer: 'Developer', image: 'Image', fun: 'Fun', ai: 'AI' };

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const EXTRA = require('./tools-extra.js');

function cardHtml(t) {
  const badge = CAT_LABEL[t.category] || 'Tool';
  const pop = t.popular ? `          <span class="card-popular">${t.popular}</span>\n` : '';
  const dataName = (t.title + ' ' + (t.searchTerms || '')).toLowerCase();
  return `        <a href="${t.slug}.html" class="tool-card" data-name="${esc(dataName)}" data-category="${t.category}">\n` +
    pop +
    `          <div class="card-icon">${t.icon}</div>\n` +
    `          <span class="card-badge badge-${t.category}">${badge}</span>\n` +
    `          <h3>${esc(t.title)}</h3>\n` +
    `          <p>${esc(t.cardDesc || t.desc)}</p>\n` +
    `        </a>`;
}

const cards = EXTRA.map(cardHtml).join('\n\n');
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// 1) insert new cards before the "Discover" card
const anchor = '<a href="index.html#tools" class="tool-card card-discover-more"';
if (!html.includes(anchor)) throw new Error('discover anchor not found');
if (html.includes('word-frequency-counter.html')) {
  console.log('already injected, skipping card insert');
} else {
  html = html.replace(anchor, cards + '\n\n' + anchor);
}

// 2) update counts 75 -> 95+
html = html.split('75 free tools including').join('95+ free tools including');
html = html.split('75 free online tools including').join('95+ free online tools including');
html = html.split('75 free, fast, privacy-friendly tools').join('95+ free, fast, privacy-friendly tools');
html = html.split('"description": "75 free online tools plus').join('"description": "95+ free online tools plus');
html = html.split('Discover 75+ Free Tools').join('Discover 95+ Free Tools');

// 3) extend ItemList: append 20 entries before closing ]
const base = 'https://www.freetoolset.app/';
const items = EXTRA.map((t, i) => {
  const pos = i + 76;
  const name = t.title.replace(/"/g, '&quot;');
  return '      {"@type": "ListItem", "position": ' + pos + ', "name": "' + name + '", "url": "' + base + t.slug + '.html"}';
}).join(',\n');
const closeMarker = '    ]\n  }\n  </script>';
if (!html.includes(closeMarker)) throw new Error('itemlist close marker not found');
if (!html.includes('"position": 95')) {
  html = html.replace(closeMarker, ',\n' + items + '\n    ]\n  }\n  </script>');
}

fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');

const cardCount = (html.match(/class="tool-card"/g) || []).length;
const listCount = (html.match(/"@type": "ListItem"/g) || []).length;
console.log('OK index.html -> tool-cards=' + cardCount + ', itemList=' + listCount);
