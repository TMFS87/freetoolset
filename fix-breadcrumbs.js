/* fix-breadcrumbs.js — add BreadcrumbList schema to pages that are missing it.
   Targets: AI tool pages, ai-studio, ai-tools (important content pages).
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// Pages that should have breadcrumbs: map filename -> {label, parentUrl}
const PAGES = {
  'ai-blog-writer.html':     { label: 'AI Blog Post Writer',    parent: 'ai-tools.html', parentLabel: 'AI Tools' },
  'ai-content-rewriter.html': { label: 'AI Content Rewriter',    parent: 'ai-tools.html', parentLabel: 'AI Tools' },
  'ai-email-subject.html':   { label: 'AI Email Subject',       parent: 'ai-tools.html', parentLabel: 'AI Tools' },
  'ai-product-description.html': { label: 'AI Product Description', parent: 'ai-tools.html', parentLabel: 'AI Tools' },
  'ai-seo-meta-generator.html': { label: 'AI SEO Meta Generator', parent: 'ai-tools.html', parentLabel: 'AI Tools' },
  'ai-studio.html':          { label: 'AI Studio',              parent: 'index.html',    parentLabel: 'Home' },
  'ai-tools.html':           { label: 'AI Tools',               parent: 'index.html',    parentLabel: 'Home' },
};

const BASE = 'https://www.freetoolset.app/';
let fixed = 0;

for (const [filename, info] of Object.entries(PAGES)) {
  const fp = path.join(ROOT, filename);
  if (!fs.existsSync(fp)) { console.log('SKIP missing ' + filename); continue; }

  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('BreadcrumbList')) { console.log('already has ' + filename); continue; }

  const pageUrl = BASE + filename;
  const parentUrl = BASE + info.parent;
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FreeToolset Home', url: BASE },
      { '@type': 'ListItem', position: 2, name: info.parentLabel, url: parentUrl },
      { '@type': 'ListItem', position: 3, name: info.label, url: pageUrl }
    ]
  }, null, 2);

  const snippet = '\n  <script type="application/ld+json">\n' + breadcrumbSchema + '\n  </script>';

  // Insert before </head>
  if (html.includes('</head>')) {
    html = html.split('</head>').join(snippet + '\n</head>');
    fs.writeFileSync(fp, html, 'utf8');
    fixed++;
    console.log('OK ' + filename);
  } else {
    console.log('WARN no </head> in ' + filename);
  }
}

console.log('\nfixed: ' + fixed + ' / ' + Object.keys(PAGES).length);
