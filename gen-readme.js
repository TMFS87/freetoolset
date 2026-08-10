/**
 * gen-readme.js — Generate README.md with the full tool index.
 * The complete per-tool link list is the point: it gives the GitHub repo
 * real reference value and creates one crawlable entry per tool page.
 * Re-run after adding tools.
 *
 * Run: node gen-readme.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const BASE = 'https://www.freetoolset.app/';

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

// AI tools live as standalone pages, not in the data files
const AI_TOOLS = [
  { slug: 'ai-studio', title: 'AI Content Studio', cardDesc: 'Multi-model AI writing workspace with 18 quick prompts.' },
  { slug: 'ai-blog-writer', title: 'AI Blog Writer', cardDesc: 'Generate blog outlines and full drafts from a topic.' },
  { slug: 'ai-product-description', title: 'AI Product Description Generator', cardDesc: 'Write conversion-focused e-commerce copy in seconds.' },
  { slug: 'ai-seo-meta-generator', title: 'AI SEO Meta Generator', cardDesc: 'Produce optimized title tags and meta descriptions.' },
  { slug: 'ai-email-subject', title: 'AI Email Subject Line Generator', cardDesc: 'Generate high-open-rate subject lines.' },
  { slug: 'ai-content-rewriter', title: 'AI Content Rewriter', cardDesc: 'Rephrase and improve existing text while keeping meaning.' }
];

const CAT_META = {
  ai: { label: 'AI Writing Tools', icon: '🤖', page: 'ai-tools.html' },
  calculator: { label: 'Calculators', icon: '🧮', page: 'calculators.html' },
  converter: { label: 'Converters', icon: '🔄', page: 'converters.html' },
  text: { label: 'Text Tools', icon: '📝', page: 'text-tools.html' },
  developer: { label: 'Developer Tools', icon: '🛠️', page: 'developer-tools.html' },
  image: { label: 'Image & Color Tools', icon: '🎨', page: 'image-tools.html' },
  fun: { label: 'Fun & Random Tools', icon: '🎲', page: 'fun-tools.html' }
};
const ORDER = ['ai', 'calculator', 'converter', 'text', 'developer', 'image', 'fun'];

// group tools that actually have a built page
const groups = {};
ORDER.forEach(c => groups[c] = []);
AI_TOOLS.forEach(t => { if (fs.existsSync(path.join(ROOT, t.slug + '.html'))) groups.ai.push(t); });
TOOLS.forEach(t => {
  if (!fs.existsSync(path.join(ROOT, t.slug + '.html'))) return;
  const c = groups[t.category] ? t.category : 'text';
  groups[c].push(t);
});

const totalTools = ORDER.reduce((n, c) => n + groups[c].length, 0);

// blog posts
const blogFiles = fs.readdirSync(path.join(ROOT, 'blog'))
  .filter(f => f.endsWith('.html') && f !== 'index.html').sort();
const blogRows = blogFiles.map(b => {
  const h = fs.readFileSync(path.join(ROOT, 'blog', b), 'utf8');
  const t = ((h.match(/<title>([^<|]*)/) || [])[1] || b).trim();
  return `- [${t}](${BASE}blog/${b})`;
});

function clean(s) {
  return String(s || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

let md = `# FreeToolset — ${totalTools}+ Free Online Tools

> Privacy-first online toolbox. Every tool runs 100% in your browser — no signup, no upload, no tracking of your input data.

🌐 **Live site: [www.freetoolset.app](${BASE})**

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.freetoolset.app&style=flat-square)](${BASE})
![Tools](https://img.shields.io/badge/tools-${totalTools}%2B-8b5cf6?style=flat-square)
![No signup](https://img.shields.io/badge/signup-not%20required-22c55e?style=flat-square)
![Client side](https://img.shields.io/badge/processing-100%25%20client--side-0ea5e9?style=flat-square)

---

## Why this exists

Most "free online tool" sites are a mess: popups everywhere, forced registration, and worst of all — they upload your data to a server just to format a JSON string or calculate a BMI.

FreeToolset does the opposite:

- **Everything runs locally.** Your text, numbers and files never leave your browser. Open DevTools → Network tab and check for yourself.
- **No account, ever.** No email wall, no "sign up to continue".
- **No dark patterns.** No fake countdowns, no bundled downloads.
- **Fast.** Static pages on a global CDN, no heavy CMS behind it.

---

## Tool index

Jump to a category:
${ORDER.filter(c => groups[c].length).map(c => `[${CAT_META[c].icon} ${CAT_META[c].label}](#${CAT_META[c].label.toLowerCase().replace(/[^a-z0-9]+/g, '-')})`).join(' · ')}

`;

ORDER.forEach(c => {
  const list = groups[c];
  if (!list.length) return;
  const m = CAT_META[c];
  md += `### ${m.icon} ${m.label}\n\n`;
  md += `> Category page: [${BASE}${m.page}](${BASE}${m.page}) — ${list.length} tools\n\n`;
  md += `| Tool | What it does |\n|------|-------------|\n`;
  list.forEach(t => {
    md += `| [${clean(t.title)}](${BASE}${t.slug}.html) | ${clean(t.cardDesc || t.desc)} |\n`;
  });
  md += `\n`;
});

md += `---

## Guides & tutorials

${blogRows.length} in-depth articles explaining the concepts behind the tools — encoding, regex, financial math, health metrics and more.

📚 **[Browse all guides](${BASE}blog/)**

<details>
<summary>Full article list (${blogRows.length})</summary>

${blogRows.join('\n')}

</details>

---

## Tech stack

Deliberately boring, because it is the right call for a tool site:

- **Static HTML/CSS/vanilla JS** — no framework, no build step for the tool pages themselves
- **Client-side computation** — every calculator/converter/formatter is plain JS running in your tab
- **Serverless functions** (Node.js on Vercel) — only for the AI Studio proxy; no user data is persisted
- **Vercel** — global CDN hosting
- **Structured data** — SoftwareApplication / FAQPage / BreadcrumbList JSON-LD on tool pages

No database. No user accounts. No cookies for tracking individual behaviour.

---

## Privacy

The core promise: **tools that compute in your browser never send your input anywhere.**

- Calculators, converters, formatters, encoders, generators → 100% local
- AI Studio → your prompt is forwarded to the selected model provider to generate a response (this is unavoidable for AI features) and is not stored by FreeToolset
- Analytics → aggregate page-view statistics only, never the content you type

Full policy: [Privacy Policy](${BASE}privacy-policy.html)

---

## About the maintainer

Built and maintained by **TMFS**, an independent developer.

This started as a personal itch — needing a quick JSON formatter and getting a page full of ads instead — and grew into a ${totalTools}-tool collection. It is a one-person project: no company, no team, no VC.

- Site: [www.freetoolset.app](${BASE})
- About page: [${BASE}about.html](${BASE}about.html)
- Contact: [${BASE}contact.html](${BASE}contact.html)

## Feedback & tool requests

Missing a tool you need? Found a calculation that looks wrong?

- Open an [issue](https://github.com/TMFS87/freetoolset/issues) — bug reports and tool suggestions both welcome
- Or use the [contact form](${BASE}contact.html)

If a tool saved you time, a ⭐ on this repo helps other people find it.

---

<sub>© FreeToolset — free to use, free to share.</sub>
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), md, 'utf8');
console.log('README.md generated');
console.log('  tools indexed:', totalTools);
ORDER.forEach(c => { if (groups[c].length) console.log('   ', CAT_META[c].label + ':', groups[c].length); });
console.log('  blog articles:', blogRows.length);
console.log('  size:', (md.length / 1024).toFixed(1) + ' KB');
