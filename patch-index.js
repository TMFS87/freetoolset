/* patch-index.js — insert 50 new tools into index.html and update counts/meta/schema. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const idxPath = path.join(root, 'index.html');
const cardsPath = path.join(root, '_cards.html');
const dataPath = path.join(root, 'tools-data.js');

let html = fs.readFileSync(idxPath, 'utf8');
const cards = fs.readFileSync(cardsPath, 'utf8').trim();
const TOOLS = require(dataPath);

function mustReplace(s, from, to, label) {
  if (s.indexOf(from) === -1) throw new Error('MARKER NOT FOUND: ' + label);
  return s.replace(from, to);
}

const CR = '\r\n';
// normalize cards to CRLF to match index.html
const cardsCRLF = cards.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

// 1) Hero + meta counts 25 -> 75
html = mustReplace(html, '25 free tools including an AI Content Studio. Write, generate, format, and convert', '75 free tools including an AI Content Studio. Write, generate, format, and convert', 'hero subtitle');
html = mustReplace(html, 'content="25 free online tools including', 'content="75 free online tools including', 'meta description');
html = mustReplace(html, 'content="25 free, fast, privacy-friendly tools', 'content="75 free, fast, privacy-friendly tools', 'og description');
html = mustReplace(html, '"description": "25 free online tools plus', '"description": "75 free online tools plus', 'jsonld description');

// 2) Category filter buttons (Calculator / Converter / Fun)
const secBtn = '      <button class="category-btn" data-category="security" data-i18n="Security">Security</button>';
const newBtns = secBtn + CR +
  '      <button class="category-btn" data-category="calculator">🧮 Calculator</button>' + CR +
  '      <button class="category-btn" data-category="converter">🔄 Converter</button>' + CR +
  '      <button class="category-btn" data-category="fun">🎲 Fun</button>';
html = mustReplace(html, secBtn, newBtns, 'category security button');

// 3) Insert 50 cards inside the tool grid (before the grid close)
const gridMarker = '        </a>' + CR + CR + '      </div>' + CR + '    </div>' + CR + CR + '  </main>';
const gridNew = '        </a>' + CR + CR + cardsCRLF + CR + CR + '      </div>' + CR + '    </div>' + CR + CR + '  </main>';
html = mustReplace(html, gridMarker, gridNew, 'tool grid close');

// 4) Append 50 ItemList entries (positions 26..75)
const lastItem = '      {"@type": "ListItem", "position": 25, "name": "Password Strength Checker", "url": "https://www.freetoolset.app/password-strength-checker.html"}';
const base = 'https://www.freetoolset.app/';
const items = TOOLS.map((t, i) => {
  const pos = i + 26;
  const name = t.title.replace(/"/g, '&quot;');
  const slug = t.slug;
  return '      {"@type": "ListItem", "position": ' + pos + ', "name": "' + name + '", "url": "' + base + slug + '.html"}';
}).join(',' + CR);
const listMarker = lastItem + CR + '    ]';
const listNew = lastItem + ',' + CR + items + CR + '    ]';
html = mustReplace(html, listMarker, listNew, 'itemlist close');

fs.writeFileSync(idxPath, html, 'utf8');

// sanity counts
const cardCount = (html.match(/class="tool-card"/g) || []).length;
const listCount = (html.match(/"@type": "ListItem"/g) || []).length;
const filterCount = (html.match(/class="category-btn"/g) || []).length;
console.log('OK. tool-cards=' + cardCount + ' (expect 75), itemList=' + listCount + ' (expect 75), categoryBtns=' + filterCount + ' (expect 10)');
