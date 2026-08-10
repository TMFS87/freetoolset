/* rebuild-discovery.js — wire the 50 new batch-3 tools into the discovery layer:
 *  1) index.html   - append new cards before the "Discover" card, bump counts 95+ -> 145+, extend ItemList
 *  2) 6 category hubs - append any missing tool cards, bump the "共 N 个" / title counts
 *  3) sitemap.xml  - merge the 50 new tool URLs
 * Idempotent: re-running is safe.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const BASE = 'https://www.freetoolset.app/';
const CAT_LABEL = { calculator: 'Calculator', converter: 'Converter', text: 'Text', developer: 'Developer', image: 'Image', fun: 'Fun', ai: 'AI' };

const A = require('./tools-data.js');
const B = require('./tools-extra.js');
const B3 = [].concat(
  require('./tools-b3-calc.js'), require('./tools-b3-conv.js'),
  require('./tools-b3-calc2.js'), require('./tools-b3-conv2.js'),
  require('./tools-b3-dev.js'), require('./tools-b3-fun.js'), require('./tools-b3-text.js')
);
const TOOLS = A.concat(B).concat(B3);
const NEW = B3; // the 50 added this round

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ---------- 1. INDEX.HTML ---------- */
let idx = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');

// guard
if(!idx.includes('bmr-calculator.html')){
  // build new cards (regular format, no data-i18n — matches existing non-featured cards)
  const cards = NEW.map(t=>{
    const badge = CAT_LABEL[t.category]||'Tool';
    const dataName = (t.title+' '+(t.searchTerms||'')).toLowerCase();
    return `        <a href="${t.slug}.html" class="tool-card" data-name="${esc(dataName)}" data-category="${t.category}">
          <div class="card-icon">${t.icon}</div>
          <span class="card-badge badge-${t.category}">${badge}</span>
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.cardDesc||t.desc)}</p>
        </a>`;
  }).join('\n\n');
  const anchor = '<a href="index.html#tools" class="tool-card card-discover-more"';
  if(!idx.includes(anchor)) throw new Error('discover anchor not found in index.html');
  idx = idx.replace(anchor, cards+'\n\n'+anchor);
  console.log('index.html: appended', NEW.length, 'cards');
} else {
  console.log('index.html: new cards already present, skipped');
}

// counts 95+ -> 145+
const before = (idx.match(/95\+/g)||[]).length;
idx = idx.split('95+').join('145+');
console.log('index.html: replaced', before, 'x "95+" -> "145+"');

// ItemList: append positions 96..145 after the position-95 entry
if(!idx.includes('"position": 145')){
  const lastEntry = '      {"@type": "ListItem", "position": 95, "name": "Random Team Generator", "url": "https://www.freetoolset.app/random-team-generator.html"}';
  if(!idx.includes(lastEntry)) throw new Error('ItemList position-95 anchor not found');
  const items = NEW.map((t,i)=>{
    const pos = i+96;
    const name = t.title.replace(/"/g,'\\"');
    return '      {"@type": "ListItem", "position": '+pos+', "name": "'+name+'", "url": "'+BASE+t.slug+'.html"}';
  }).join(',\n');
  idx = idx.replace(lastEntry, lastEntry+',\n'+items);
  console.log('index.html: ItemList extended to', 95+NEW.length, 'entries');
} else {
  console.log('index.html: ItemList already extended, skipped');
}
fs.writeFileSync(path.join(ROOT,'index.html'),idx,'utf8');

/* ---------- 2. CATEGORY HUBS ---------- */
// standalone AI pages (not in data files) that belong on ai-tools.html
const AI_STANDALONE = [
  {slug:'ai-studio',title:'AI Content Studio'},
  {slug:'ai-product-description',title:'AI Product Description Writer'},
  {slug:'ai-seo-meta-generator',title:'AI SEO Meta Generator'},
  {slug:'ai-blog-writer',title:'AI Blog Post Writer'},
  {slug:'ai-email-subject',title:'AI Email Subject Lines'},
  {slug:'ai-content-rewriter',title:'AI Content Rewriter'}
];
const HUB = [
  {file:'ai-tools.html',        cat:'ai',        extra:AI_STANDALONE},
  {file:'calculators.html',     cat:'calculator',extra:[]},
  {file:'converters.html',      cat:'converter', extra:[]},
  {file:'text-tools.html',      cat:'text',      extra:[]},
  {file:'developer-tools.html', cat:'developer', extra:[]},
  {file:'fun-tools.html',       cat:'fun',       extra:[]}
];

HUB.forEach(h=>{
  const fp = path.join(ROOT,h.file);
  if(!fs.existsSync(fp)){console.log('SKIP (missing)',h.file);return;}
  let html = fs.readFileSync(fp,'utf8');
  const slugs = TOOLS.filter(t=>t.category===h.cat).map(t=>t.slug).concat(h.extra.map(e=>e.slug));
  // existing slugs already in the grid
  const gridRe = /<div class="tool-grid">([\s\S]*?)<\/div>/;
  const m = html.match(gridRe);
  if(!m){console.log('SKIP (no grid)',h.file);return;}
  const existing = m[1];
  const existingSlugs = (existing.match(/href="([^"]+)\.html"/g)||[]).map(s=>s.replace('href="','').replace('.html"',''));
  const newOnes = slugs.filter(s=>existingSlugs.indexOf(s)<0);
  if(newOnes.length){
    const cards = newOnes.map(slug=>{
      const t = TOOLS.find(x=>x.slug===slug) || h.extra.find(x=>x.slug===slug);
      const title = t?t.title:slug;
      return `        <a class="tool-card" href="${slug}.html">
          <h3>${esc(title)}</h3>
        </a>`;
    }).join('\n');
    html = html.replace(gridRe, '<div class="tool-grid">'+existing+'\n'+cards+'\n    </div>');
    console.log(h.file+': +'+newOnes.length+' cards (now '+slugs.length+')');
  } else {
    console.log(h.file+': nothing new to add');
  }
  // bump counts
  const total = slugs.length;
  html = html.replace(/共 \d+ 个免费在线工具/, '共 '+total+' 个免费在线工具');
  html = html.replace(/— \d+ 个免费[^<]*/, '— '+total+' 个免费在线工具');
  html = html.replace(/ \d+ 款免费在线计算器/, ' '+total+' 款免费在线计算器');
  html = html.replace(/<strong>\d+ 款免费在线计算器/, '<strong>'+total+' 款免费在线计算器');
  fs.writeFileSync(fp,html,'utf8');
});

/* ---------- 3. SITEMAP ---------- */
const smPath = path.join(ROOT,'sitemap.xml');
let sm = fs.readFileSync(smPath,'utf8');
const today = new Date().toISOString().slice(0,10);
let added = 0;
const blocks = NEW.map(t=>'  <url>\n    <loc>'+BASE+t.slug+'.html</loc>\n    <lastmod>'+today+'</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>').join('\n');
const missing = NEW.filter(t=>!sm.includes(BASE+t.slug+'.html'));
if(missing.length){
  sm = sm.replace(/<\/urlset>/, blocks+'\n</urlset>');
  added = missing.length;
}
fs.writeFileSync(smPath,sm,'utf8');
console.log('sitemap.xml: +'+added+' URLs (total <loc>='+(sm.match(/<loc>/g)||[]).length+')');

console.log('DISCOVERY REBUILD DONE ✅');
