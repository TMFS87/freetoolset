/* gen-categories.js
 * 1) Enhance breadcrumbs of 75 tool pages to three levels (Home / Category / Current)
 * 2) Generate 6 category aggregation pages (ai-tools / calculators / converters / text-tools / developer-tools / fun-tools)
 * 3) Add category pages to sitemap.xml
 */
const fs = require("fs");
const path = require("path");
const ROOT = ".";

const SITE = "https://www.freetoolset.app";

// slug -> category key
const CAT = {
  "ai-studio": "ai-tools", "ai-product-description": "ai-tools", "ai-seo-meta-generator": "ai-tools",
  "ai-blog-writer": "ai-tools", "ai-email-subject": "ai-tools", "ai-content-rewriter": "ai-tools",
  "bmi-calculator": "calculators", "age-calculator": "calculators", "percentage-calculator": "calculators",
  "loan-calculator": "calculators", "mortgage-calculator": "calculators", "tip-calculator": "calculators",
  "discount-calculator": "calculators", "compound-interest-calculator": "calculators", "gpa-calculator": "calculators",
  "calorie-calculator": "calculators", "sales-tax-calculator": "calculators", "salary-calculator": "calculators",
  "fuel-cost-calculator": "calculators", "roi-calculator": "calculators", "date-difference-calculator": "calculators",
  "unit-converter": "converters", "temperature-converter": "converters", "length-converter": "converters",
  "weight-converter": "converters", "speed-converter": "converters", "area-converter": "converters",
  "volume-converter": "converters", "data-storage-converter": "converters", "time-unit-converter": "converters",
  "roman-numeral-converter": "converters", "binary-text-converter": "converters", "text-case-converter": "converters",
  "morse-code-translator": "fun-tools", "timer": "fun-tools", "stopwatch": "fun-tools", "dice-roller": "fun-tools",
  "word-counter": "text-tools", "lorem-ipsum-generator": "text-tools", "line-tools": "text-tools",
  "number-to-words": "text-tools", "reverse-text": "text-tools", "text-repeater": "text-tools",
  "find-and-replace": "text-tools", "slug-generator": "text-tools", "remove-line-breaks": "text-tools",
  "whitespace-remover": "text-tools", "text-to-speech": "text-tools", "fancy-text-generator": "text-tools",
  "port-lookup": "developer-tools", "image-compressor": "developer-tools", "qr-code-generator": "developer-tools",
  "json-formatter": "developer-tools", "color-picker": "developer-tools", "base64-encoder": "developer-tools",
  "url-encoder": "developer-tools", "hash-generator": "developer-tools", "uuid-generator": "developer-tools",
  "image-to-base64": "developer-tools", "timestamp-converter": "developer-tools", "regex-tester": "developer-tools",
  "base-converter": "developer-tools", "password-generator": "developer-tools", "password-strength-checker": "developer-tools",
  "css-minifier": "developer-tools", "json-minifier": "developer-tools", "html-minifier": "developer-tools",
  "markdown-to-html": "developer-tools", "csv-to-json": "developer-tools", "json-to-csv": "developer-tools",
  "jwt-decoder": "developer-tools", "cron-expression-generator": "developer-tools", "http-status-codes": "developer-tools",
  "random-number-generator": "developer-tools", "html-encoder": "developer-tools"
};

const CATMETA = {
  "ai-tools": { en: "AI Writing Tools",
    desc: "Generate product descriptions, blog posts, email subjects, and SEO copy with AI—free, no registration, runs locally in your browser to protect privacy.",
    title: "AI Writing Tools · 6 Free AI Copy Generators | FreeToolset" },
  "calculators": { en: "Calculators",
    desc: "Free online calculators: BMI, age, loan, mortgage, discount, compound interest, salary, ROI, and more—results appear as you type.",
    title: "Calculators · 15 Free Online Calculators | FreeToolset" },
  "converters": { en: "Converters",
    desc: "Free unit and encoding converters: temperature, length, weight, base/radix, Roman numerals, text encoding, and more.",
    title: "Converters · 12 Free Online Conversion Tools | FreeToolset" },
  "text-tools": { en: "Text Tools",
    desc: "Free text tools: word count, case conversion, whitespace removal, text repeat, slug generation, find & replace, and more.",
    title: "Text Tools · 12 Free Text Tools | FreeToolset" },
  "developer-tools": { en: "Developer Tools",
    desc: "Essential free tools for programmers: JSON formatter, Base64, URL encoding, regex tester, hash, JWT decoder, Cron, and more.",
    title: "Developer Tools · 26 Free Dev Tools | FreeToolset" },
  "fun-tools": { en: "Fun Tools",
    desc: "Relaxing and playful free mini-tools: Morse code translator, timer, stopwatch, dice roller.",
    title: "Fun Tools · 4 Free Fun Tools | FreeToolset" }
};

function detectEol(s){ return s.includes("\r\n") ? "\r\n" : "\n"; }

// Get a tool page title (strip the " | FreeToolset" suffix)
function pageTitle(slug){
  const f = path.join(ROOT, slug + ".html");
  if(!fs.existsSync(f)) return slug;
  const html = fs.readFileSync(f, "utf8");
  const m = html.match(/<title>([^<]*)<\/title>/);
  if(!m) return slug;
  return m[1].split("|")[0].trim();
}

let breadcrumbFixed = 0;

// ---- 1) Enhance breadcrumbs ----
for(const slug of Object.keys(CAT)){
  const f = path.join(ROOT, slug + ".html");
  if(!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, "utf8");
  const re = /(>Home<\/a>\s*<span class="separator">\/<\/span>\s*)(<span class="current">)/;
  if(re.test(html) && !html.includes("breadcrumb-cat")){
    const cat = CATMETA[CAT[slug]];
    const ins = `<a href="${CAT[slug]}.html">${cat.en}</a>` + "\n      <span class=\"separator\">/</span>\n      ";
    html = html.replace(re, "$1" + ins + "$2");
    // mark to avoid duplication
    html = html.replace(/(<nav class="breadcrumb">)/, '$1<!-- breadcrumb-cat -->');
    fs.writeFileSync(f, html, "utf8");
    breadcrumbFixed++;
  }
}
console.log("breadcrumbs enhanced: " + breadcrumbFixed + " pages");

// ---- 2) Generate category pages ----
const navBar = `  <nav class="navbar">
    <a href="index.html" class="navbar-brand"><span class="logo-icon">⚡</span> FreeToolset</a>
    <div class="navbar-nav">
      <a href="index.html" class="nav-link">Home</a>
      <a href="ai-studio.html" class="nav-link">✨ AI Studio</a>
      <a href="about.html" class="nav-link">About</a>
      <a href="privacy-policy.html" class="nav-link">Privacy</a>
    </div>
  </nav>`;

const footer = `  <footer class="site-footer">
    <div class="footer-inner">
      <p>© 2026 FreeToolset · 95+ free online tools, no registration, runs locally to protect your privacy</p>
      <nav><a href="index.html">Home</a> · <a href="ai-studio.html">AI Studio</a> · <a href="about.html">About</a> · <a href="privacy-policy.html">Privacy</a> · <a href="contact.html">Contact</a></nav>
    </div>
  </footer>`;

for(const key of Object.keys(CATMETA)){
  const meta = CATMETA[key];
  const items = Object.keys(CAT).filter(s => CAT[s] === key).map(s => ({ slug:s, title: pageTitle(s) }));
  const cards = items.map(it =>
    `        <a class="tool-card" href="${it.slug}.html">
          <h3>${it.title}</h3>
        </a>`).join("\n");
  const html =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}/${key}.html">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
${navBar}
  <main class="main-content">
    <section class="tool-intro">
      <h1>${meta.en} · ${items.length} free online tools</h1>
      <p>${meta.desc}</p>
    </section>
    <div class="tool-grid">
${cards}
    </div>
  </main>
${footer}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, key + ".html"), html, "utf8");
  console.log("generated category page: " + key + ".html (" + items.length + " tools)");
}

// ---- 3) Update sitemap ----
const smPath = path.join(ROOT, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8");
for(const key of Object.keys(CATMETA)){
  const loc = `${SITE}/${key}.html`;
  if(!sm.includes(loc)){
    const entry = `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n</urlset>`;
    sm = sm.replace(/<\/urlset>/, entry);
  }
}
fs.writeFileSync(smPath, sm, "utf8");
const total = (sm.match(/<loc>/g) || []).length;
console.log("sitemap updated, total URLs: " + total);
console.log("all done");
