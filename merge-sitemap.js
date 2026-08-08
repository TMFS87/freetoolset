/* merge-sitemap.js — append the 20 new tool URLs to sitemap.xml before </urlset>. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const EXTRA = require('./tools-extra.js');

const d = new Date();
const today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const base = 'https://www.freetoolset.app/';

function entry(t) {
  return '  <url>\n' +
    '    <loc>' + base + t.slug + '.html</loc>\n' +
    '    <lastmod>' + today + '</lastmod>\n' +
    '    <changefreq>monthly</changefreq>\n' +
    '    <priority>0.8</priority>\n' +
    '  </url>';
}

const fp = path.join(ROOT, 'sitemap.xml');
let xml = fs.readFileSync(fp, 'utf8');

const close = '</urlset>';
if (!xml.includes(close)) throw new Error('urlset close not found');

let added = 0;
const blocks = EXTRA.map(entry).join('\n');
// guard: skip if already merged
if (xml.includes(base + EXTRA[0].slug + '.html')) {
  console.log('already merged, skipping');
} else {
  xml = xml.replace(close, blocks + '\n' + close);
  added = EXTRA.length;
}
fs.writeFileSync(fp, xml, 'utf8');

const count = (xml.match(/<loc>/g) || []).length;
console.log('added=' + added + ' total=<loc>=' + count);
