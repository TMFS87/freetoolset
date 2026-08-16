/* inject-category.js — inject new tools into category pages + update H1 counts. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const EXTRA = require('./tools-extra.js');

// category -> { file, oldCount, newCount }
const CATS = {
  developer: { file: 'developer-tools.html', oldCount: 26, newCount: 33 },
  calculator: { file: 'calculators.html', oldCount: 15, newCount: 20 },
  text: { file: 'text-tools.html', oldCount: 12, newCount: 17 },
  fun: { file: 'fun-tools.html', oldCount: 4, newCount: 7 },
};

function cardHtml(t) {
  const title = String(t.title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '        <a class="tool-card" href="' + t.slug + '.html">\n          <h3>' + title + '</h3>\n        </a>';
}

const anchorClose = '    </div>\n  </main>';

for (const [cat, cfg] of Object.entries(CATS)) {
  const fp = path.join(ROOT, cfg.file);
  if (!fs.existsSync(fp)) { console.log('SKIP missing ' + cfg.file); continue; }
  let html = fs.readFileSync(fp, 'utf8');

  const tools = EXTRA.filter(t => t.category === cat);
  if (tools.length === 0) { console.log('SKIP ' + cat + ' (no new tools)'); continue; }

  const firstSlug = tools[0].slug;

  // 1) inject cards before grid closing </div></main>
  if (!html.includes(anchorClose)) throw new Error(cfg.file + ': grid close anchor not found');
  if (html.includes(firstSlug + '.html')) {
    console.log('already injected ' + cfg.file + ', skip cards');
  } else {
    const cards = tools.map(cardHtml).join('\n');
    html = html.replace(anchorClose, cards + '\n    </div>\n  </main>');
  }

  // 2) update H1 count
  const oldH1 = cfg.oldCount + ' free online tools';
  const newH1 = cfg.newCount + ' free online tools';
  if (html.includes(oldH1)) {
    html = html.split(oldH1).join(newH1);
  } else if (!html.includes(newH1)) {
    console.log('WARN ' + cfg.file + ': H1 count marker not found (' + oldH1 + ')');
  }

  fs.writeFileSync(fp, html, 'utf8');

  const cardCount = (html.match(/class="tool-card"/g) || []).length;
  const h1ok = html.includes(newH1);
  console.log('OK ' + cfg.file + ' -> cards=' + cardCount + ', h1updated=' + h1ok);
}
