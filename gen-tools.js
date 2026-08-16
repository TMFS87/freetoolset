/**
 * gen-tools.js — Batch generator for client-side tool pages.
 * Produces one standalone HTML page per tool (matching the FreeToolset
 * design/structure), plus snippet files for index.html cards and sitemap.xml.
 *
 * SEO improvements over v1:
 *  - FAQPage structured data (from t.faq)
 *  - BreadcrumbList structured data (Home > Category > Tool)
 *  - Category breadcrumb link in body
 *  - tool-deep long-form Chinese content section (from t.deep)
 *  - Chinese FAQ block (from t.zhfaq)
 *
 * Run:  node gen-tools.js
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.freetoolset.app/';
const ROOT = __dirname;

const CAT_LABEL = {
  calculator: 'Calculator',
  converter: 'Converter',
  text: 'Text',
  developer: 'Developer',
  image: 'Image',
  fun: 'Fun',
  ai: 'AI'
};

// category -> category page (used by breadcrumb + breadcrumbList schema)
const CAT_PAGE = {
  calculator: 'calculators.html',
  converter: 'converters.html',
  text: 'text-tools.html',
  developer: 'developer-tools.html',
  fun: 'fun-tools.html',
  image: 'image-tools.html',
  ai: 'ai-tools.html'
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Pick related tools: up to 4 from same category (excluding self), then AI Studio + All Tools.
function relatedCards(t, all) {
  const sameCat = all.filter(x => x.category === t.category && x.slug !== t.slug).slice(0, 4);
  const cards = sameCat.map(x => ({ href: x.slug + '.html', icon: x.icon, name: x.title }));
  cards.push({ href: 'ai-studio.html', icon: '✨', name: 'AI Content Studio' });
  cards.push({ href: 'index.html', icon: '⚡', name: 'All Tools' });
  return cards.slice(0, 6).map(c =>
    `            <a href="${c.href}" class="related-tool-card">\n` +
    `              <span class="rt-icon">${c.icon}</span>\n` +
    `              <span class="rt-name">${esc(c.name)}</span>\n` +
    `            </a>`).join('\n');
}

function howtoList(steps) {
  return (steps || []).map(s => `            <li>${esc(s)}</li>`).join('\n');
}

function faqList(faq) {
  return (faq || []).map(f =>
    `          <details class="faq-item">\n` +
    `            <summary>${esc(f.q)}</summary>\n` +
    `            <p>${esc(f.a)}</p>\n` +
    `          </details>`).join('\n');
}

function useCaseList(ucs) {
  return (ucs || []).map(u =>
    `            <div class="use-case-item">\n` +
    `              <div class="uc-icon">${u.icon}</div>\n` +
    `              <div class="uc-content">\n` +
    `                <h4>${esc(u.title)}</h4>\n` +
    `                <p>${esc(u.text)}</p>\n` +
    `              </div>\n` +
    `            </div>`).join('\n');
}

function faqSchema(faq) {
  if (!faq || !faq.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  return `  <script type="application/ld+json">\n  ${JSON.stringify(data)}\n  </script>`;
}

function breadcrumbSchema(t) {
  const cat = CAT_LABEL[t.category] || 'Tool';
  const page = CAT_PAGE[t.category] || 'index.html';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: cat, item: BASE + page },
      { '@type': 'ListItem', position: 3, name: t.title, item: BASE + t.slug + '.html' }
    ]
  };
  return `  <script type="application/ld+json">\n  ${JSON.stringify(data)}\n  </script>`;
}

function deepSection(t) {
  let html = `  <section class="tool-deep">\n    <h2>📖 Deep Dive: ${esc(t.title)}</h2>\n`;
  if (t.deep) {
    t.deep.split('\n').filter(Boolean).forEach(p => {
      if (p.startsWith('## ')) html += `    <h3>${esc(p.slice(3))}</h3>\n`;
      else if (p.startsWith('- ')) html += `    <li>${esc(p.slice(2))}</li>\n`;
      else html += `    <p>${esc(p)}</p>\n`;
    });
  } else {
    html += `    <p>${esc(t.desc)}</p>\n`;
    html += `    <p>${esc(t.title)} is a free tool that runs 100% in your browser. No signup, no uploads — your data stays private. Perfect for everyday text and data tasks, saving you time and reducing mistakes.</p>\n`;
  }
  html += `  </section>`;
  return html;
}

function zhFaqSection(t) {
  if (!t.zhfaq || !t.zhfaq.length) return '';
  const items = t.zhfaq.map(f =>
    `          <details class="faq-item">\n            <summary>${esc(f.q)}</summary>\n            <p>${esc(f.a)}</p>\n          </details>`).join('\n');
  return `        <div class="info-section">\n          <h2>❓ More Questions</h2>\n${items}\n        </div>`;
}

function template(t, all) {
  const url = BASE + t.slug + '.html';
  const badge = CAT_LABEL[t.category] || 'Tool';
  const catPage = CAT_PAGE[t.category] || 'index.html';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.titleFull || (t.title + ' — ' + t.tagline),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    url: url,
    description: t.desc,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'FreeToolset', url: BASE }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(t.title)} — ${esc(t.tagline)} | FreeToolset</title>
  <meta name="description" content="${esc(t.desc)}">
  <meta name="keywords" content="${esc(t.keywords)}">
  <meta property="og:title" content="${esc(t.title)} — FreeToolset">
  <meta property="og:description" content="${esc(t.desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <link rel="stylesheet" href="css/style.css">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="FreeToolset">
  <meta property="og:image" content="${BASE}og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:image" content="${BASE}og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(t.title)} — FreeToolset">
  <meta name="twitter:description" content="${esc(t.desc)}">
  <script type="application/ld+json">
  ${JSON.stringify(schema)}
  </script>
${faqSchema(t.faq)}
${breadcrumbSchema(t)}
</head>
<body>

  <nav class="navbar">
    <a href="index.html" class="navbar-brand">
      <span class="logo-icon">⚡</span>
      FreeToolset
    </a>
    <div class="navbar-nav">
      <a href="index.html" class="nav-link" data-i18n="Home">Home</a>
      <a href="index.html#tools" class="nav-link active">Tools</a>
      <a href="ai-studio.html" class="nav-link">✨ AI Studio</a>
      <a href="about.html" class="nav-link" data-i18n="About">About</a>
    </div>
  </nav>

  <main class="main-content">
  <section class="tool-intro">
    <h2>📌 Overview</h2>
    <p>${esc(t.desc)}</p>
  </section>

    <nav class="breadcrumb">
      <a href="index.html">Home</a>
      <span class="separator">/</span>
      <a href="${catPage}">${esc(badge)}</a>
      <span class="separator">/</span>
      <span class="current">${esc(t.title)}</span>
    </nav>

    <div class="tool-header">
      <h1>${t.icon} ${esc(t.title)}</h1>
      <p>${esc(t.desc)}</p>
    </div>

    <div class="tool-layout">
      <div class="tool-main">
${t.body}

        <div class="privacy-notice">
          <span class="pn-icon">🔒</span>
          <span>All processing happens in your browser. No data is uploaded to any server.</span>
        </div>
      </div>

      <aside class="tool-sidebar">
        <div class="info-section">
          <h2>📋 How to Use</h2>
          <ol class="how-to-list">
${howtoList(t.howto)}
          </ol>
        </div>

        <div class="info-section">
          <h2>❓ FAQ</h2>
${faqList(t.faq)}
        </div>

${zhFaqSection(t)}

        <div class="info-section">
          <h2>💡 Use Cases</h2>
          <div class="use-case-grid">
${useCaseList(t.usecases)}
          </div>
        </div>

        <div class="info-section">
          <h2>🔗 Related Tools</h2>
          <div class="related-tools-grid">
${relatedCards(t, all)}
          </div>
        </div>
      </aside>
    </div>

${deepSection(t)}
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div>
        <div class="footer-brand">
          <span class="logo-icon">⚡</span>
          FreeToolset
        </div>
        <p class="footer-desc" data-i18n="footerDesc">Free online tools that run entirely in your browser. No data is uploaded to any server.</p>
      </div>
      <div class="footer-links">
        <a href="index.html" data-i18n="Tools">Tools</a>
        <a href="about.html" data-i18n="About">About</a>
        <a href="privacy-policy.html" data-i18n="Privacy Policy">Privacy Policy</a>
        <a href="contact.html" data-i18n="Contact">Contact</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 FreeToolset. All tools run locally in your browser.</p>
    </div>
  </footer>

  <script>
  (function(){
${t.js}
  })();
  </script>

<script defer src="/_vercel/insights/script.js"></script>
<!-- BAIDU_AUTO_PUSH -->
<script>
(function(){var bp=document.createElement('script');var p=location.protocol.split(':')[0];bp.src=p==='https'?'https://zz.bdstatic.com/linksubmit/push.js':'http://push.zhanzhang.baidu.com/push.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(bp,s);})();
</script>
</body>
</html>
`;
}

// ---- Run ----
const A = require('./tools-data.js');
const B = require('./tools-extra.js');
const B3 = [].concat(
  require('./tools-b3-calc.js'),
  require('./tools-b3-conv.js'),
  require('./tools-b3-calc2.js'),
  require('./tools-b3-conv2.js'),
  require('./tools-b3-dev.js'),
  require('./tools-b3-fun.js'),
  require('./tools-b3-text.js')
);
const TOOLS = A.concat(B).concat(B3);

// sanity: unique slugs
const seen = {};
TOOLS.forEach(t => { if (seen[t.slug]) throw new Error('dup slug ' + t.slug); seen[t.slug] = 1; });

let count = 0;
TOOLS.forEach(t => {
  const html = template(t, TOOLS);
  fs.writeFileSync(path.join(ROOT, t.slug + '.html'), html, 'utf8');
  count++;
});

// index.html cards snippet
const cards = TOOLS.map(t => {
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
}).join('\n\n');
fs.writeFileSync(path.join(ROOT, '_cards.html'), cards, 'utf8');

// sitemap entries snippet
const today = new Date().toISOString().slice(0, 10);
const sm = TOOLS.map(t =>
  `  <url>\n    <loc>${BASE}${t.slug}.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
).join('\n');
fs.writeFileSync(path.join(ROOT, '_sitemap_entries.xml'), sm, 'utf8');

console.log('Generated ' + count + ' tool pages.');
console.log('Snippets: _cards.html, _sitemap_entries.xml');
