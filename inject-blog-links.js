/**
 * inject-blog-links.js
 * Fix the internal-link island: tool pages currently link to ZERO blog posts.
 * Builds a tool -> blog mapping by reverse-parsing existing blog -> tool links
 * (semantically accurate), with category fallback for uncovered pages.
 * Idempotent via the `further-reading` marker.
 *
 * Run: node inject-blog-links.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// ai-studio is excluded because a sitewide CTA links to it from every blog post,
// which would otherwise pollute the mapping with unrelated articles.
const EXCL = ['index', 'about', 'privacy-policy', 'contact', 'blog', 'ai-studio'];

// ---- 1. Reverse-build mapping from existing blog->tool links ----
const blogFiles = fs.readdirSync(path.join(ROOT, 'blog'))
  .filter(f => f.endsWith('.html') && f !== 'index.html');

const map = {};      // toolSlug -> [blogFile]
const btitle = {};   // blogFile -> clean title (English)
const linkCount = {}; // blogFile -> how many tools it links (hub articles link many)

blogFiles.forEach(b => {
  const h = fs.readFileSync(path.join(ROOT, 'blog', b), 'utf8');
  const m = h.match(/<title>([^<|]*)/);
  btitle[b] = (m ? m[1] : b).trim();
  const links = [...h.matchAll(/href="\.\.\/([a-z0-9-]+)\.html"/g)].map(x => x[1]);
  const uniq = [...new Set(links)].filter(s => !EXCL.includes(s));
  linkCount[b] = uniq.length;
  uniq.forEach(s => { (map[s] = map[s] || []).push(b); });
});

// ---- 2. Category fallback ----
const CAT_BLOGS = {
  calculator: ['calculators-guide.html', 'percentage-in-life.html', 'productivity-tools.html'],
  converter: ['converters-guide.html', 'length-conversion-tips.html', 'data-storage-units.html'],
  text: ['text-tools-guide.html', 'text-case-naming.html', 'productivity-tools.html'],
  developer: ['dev-tools-guide.html', 'json-formatting-tips.html', 'regex-for-beginners.html'],
  image: ['image-compression-guide.html', 'privacy-local-tools.html', 'productivity-tools.html'],
  fun: ['random-number-use.html', 'productivity-tools.html', 'reverse-text-fun.html'],
  ai: ['ai-product-description-conversion.html', 'seo-meta-tags-guide.html', 'productivity-tools.html']
};

// explicit category for pages not present in tools-data (AI tools + category hubs)
const MANUAL_CAT = {
  'ai-blog-writer': 'ai', 'ai-content-rewriter': 'ai', 'ai-email-subject': 'ai',
  'ai-product-description': 'ai', 'ai-seo-meta-generator': 'ai', 'ai-studio': 'ai',
  'ai-tools': 'ai', 'calculators': 'calculator', 'converters': 'converter',
  'text-tools': 'text', 'developer-tools': 'developer', 'image-tools': 'image',
  'fun-tools': 'fun', 'line-tools': 'text'
};

// category from tool data files
const catOf = {};
try {
  const A = require('./tools-data.js');
  const B = require('./tools-extra.js');
  A.concat(B).forEach(t => { catOf[t.slug] = t.category; });
} catch (e) { console.warn('tool data load failed:', e.message); }
Object.assign(catOf, MANUAL_CAT);

function guessCat(slug, html) {
  if (catOf[slug]) return catOf[slug];
  if (/calculator|-calc/.test(slug)) return 'calculator';
  if (/converter|convert/.test(slug)) return 'converter';
  if (/text|word|line|case|sort/.test(slug)) return 'text';
  if (/json|xml|sql|css|html|hash|jwt|uuid|regex|cron|port|url|yaml/.test(slug)) return 'developer';
  if (/image|color|qr/.test(slug)) return 'image';
  const bc = (html.match(/badge-([a-z]+)/) || [])[1];
  return bc && CAT_BLOGS[bc] ? bc : 'text';
}

// ---- 3. Pick up to 3 blogs per tool: specific articles first, hub articles last ----
function pickBlogs(slug, html) {
  const direct = (map[slug] || []).slice()
    .sort((a, b) => (linkCount[a] || 0) - (linkCount[b] || 0)); // fewer links = more specific
  const cat = guessCat(slug, html);
  const fallback = CAT_BLOGS[cat] || CAT_BLOGS.text;
  const out = [];
  for (const b of direct.concat(fallback)) {
    if (out.length >= 3) break;
    if (!btitle[b]) continue;          // blog must exist
    if (out.includes(b)) continue;
    out.push(b);
  }
  return out;
}

// ---- 4. Inject ----
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let done = 0, skipped = 0, nomain = 0;
const report = [];

fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).forEach(f => {
  const slug = f.replace('.html', '');
  if (['index', 'about', 'privacy-policy', 'contact', 'terms', '404'].includes(slug)) return;
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  if (!h.includes('tool-intro') && !h.includes('tool-deep')) return; // only tool/category pages
  if (h.includes('further-reading')) { skipped++; return; }
  if (!h.includes('</main>')) { nomain++; return; }

  const picks = pickBlogs(slug, h);
  if (!picks.length) { skipped++; return; }

  const items = picks.map(b =>
    `      <a class="fr-item" href="blog/${b}"><span class="fr-icon">📄</span><span class="fr-text">${esc(btitle[b])}</span></a>`
  ).join('\n');

  const block =
`  <section class="further-reading">
    <h2>📚 Further Reading</h2>
    <p class="fr-lead">Want to go deeper? These tutorials pair well with this tool.</p>
    <div class="fr-grid">
${items}
    </div>
    <a class="fr-all" href="blog/index.html">Browse all tutorials →</a>
  </section>

`;

  h = h.replace('</main>', block + '</main>');
  fs.writeFileSync(p, h, 'utf8');
  done++;
  report.push(slug + ' -> ' + picks.map(b => b.replace('.html', '')).join(', '));
});

console.log('injected:', done, '| skipped:', skipped, '| no-main:', nomain);
console.log('--- sample ---');
report.slice(0, 8).forEach(r => console.log('  ' + r));
