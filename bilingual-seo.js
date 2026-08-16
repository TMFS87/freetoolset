/* bilingual-seo.js — inject an English title + meta description + WebApplication
 * schema into every tool page. English-only (no Chinese), per site requirements. */
const fs = require("fs");
const path = require("path");

// slug -> English tool name (single source of truth)
const EN = {
  "about": "About Us",
  "contact": "Contact Us",
  "privacy-policy": "Privacy Policy",
  "age-calculator": "Age Calculator",
  "ai-blog-writer": "AI Blog Writer",
  "ai-content-rewriter": "AI Content Rewriter",
  "ai-email-subject": "AI Email Subject Line Generator",
  "ai-product-description": "AI Product Description Generator",
  "ai-seo-meta-generator": "AI SEO Meta Tag Generator",
  "ai-studio": "AI Content Studio",
  "area-converter": "Area Converter",
  "base-converter": "Base Converter",
  "base64-encoder": "Base64 Encoder / Decoder",
  "binary-text-converter": "Binary Text Converter",
  "bmi-calculator": "BMI Calculator",
  "calorie-calculator": "Calorie Calculator",
  "color-picker": "Color Picker",
  "compound-interest-calculator": "Compound Interest Calculator",
  "cron-expression-generator": "Cron Expression Generator",
  "css-minifier": "CSS Minifier",
  "csv-to-json": "CSV to JSON Converter",
  "data-storage-converter": "Data Storage Converter",
  "date-difference-calculator": "Date Difference Calculator",
  "dice-roller": "Dice Roller",
  "discount-calculator": "Discount Calculator",
  "fancy-text-generator": "Fancy Text Generator",
  "find-and-replace": "Find and Replace",
  "fuel-cost-calculator": "Fuel Cost Calculator",
  "gpa-calculator": "GPA Calculator",
  "hash-generator": "Hash Generator",
  "html-encoder": "HTML Encoder / Decoder",
  "html-minifier": "HTML Minifier",
  "http-status-codes": "HTTP Status Code Lookup",
  "image-compressor": "Image Compressor",
  "image-to-base64": "Image to Base64",
  "json-formatter": "JSON Formatter",
  "json-minifier": "JSON Minifier",
  "json-to-csv": "JSON to CSV",
  "jwt-decoder": "JWT Decoder",
  "length-converter": "Length Converter",
  "line-tools": "Line Tools",
  "loan-calculator": "Loan Calculator",
  "lorem-ipsum-generator": "Lorem Ipsum Generator",
  "markdown-to-html": "Markdown to HTML",
  "morse-code-translator": "Morse Code Translator",
  "mortgage-calculator": "Mortgage Calculator",
  "number-to-words": "Number to Words",
  "password-generator": "Password Generator",
  "password-strength-checker": "Password Strength Checker",
  "percentage-calculator": "Percentage Calculator",
  "port-lookup": "Port Lookup",
  "qr-code-generator": "QR Code Generator",
  "random-number-generator": "Random Number Generator",
  "regex-tester": "Regex Tester",
  "remove-line-breaks": "Remove Line Breaks",
  "reverse-text": "Reverse Text",
  "roi-calculator": "ROI Calculator",
  "roman-numeral-converter": "Roman Numeral Converter",
  "salary-calculator": "Salary Calculator",
  "sales-tax-calculator": "Sales Tax Calculator",
  "slug-generator": "Slug Generator",
  "speed-converter": "Speed Converter",
  "stopwatch": "Stopwatch",
  "temperature-converter": "Temperature Converter",
  "text-case-converter": "Text Case Converter",
  "text-repeater": "Text Repeater",
  "text-to-speech": "Text to Speech",
  "time-unit-converter": "Time Unit Converter",
  "timer": "Timer",
  "timestamp-converter": "Timestamp Converter",
  "tip-calculator": "Tip Calculator",
  "unit-converter": "Unit Converter",
  "url-encoder": "URL Encoder / Decoder",
  "uuid-generator": "UUID Generator",
  "volume-converter": "Volume Converter",
  "weight-converter": "Weight Converter",
  "whitespace-remover": "Whitespace Remover",
  "word-counter": "Word Counter"
};

const EXCLUDE_DIRS = new Set([".vercel", ".git", "node_modules", "_promote_backup", ".workbuddy", "blog"]);
const NO_SCHEMA = new Set(["index", "about", "contact", "privacy-policy"]);

function hasHan(s) { return /[一-鿿]/.test(s); }

function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (EXCLUDE_DIRS.has(e.name)) continue; walk(full, cb); }
    else if (e.isFile() && e.name.endsWith(".html") && e.name !== "_cards.html") cb(full);
  }
}

const GEN_DESC = (en) =>
  `${en}: a free online tool that runs entirely in your browser — no sign-up required and your data never leaves your device, so your privacy is always protected.`;

let missing = [];
walk(".", (file) => {
  let html = fs.readFileSync(file, "utf8");
  const tm = html.match(/<title>([^<]*)<\/title>/);
  if (!tm) return;
  const slug = path.basename(file, ".html");
  const en = EN[slug];
  if (!en) { missing.push(slug); return; }

  // 1) title — only replace if it currently contains Chinese (keep good English titles)
  const curTitle = tm[1];
  if (hasHan(curTitle)) {
    const newTitle = slug === "index"
      ? "FreeToolset · 95+ Free Online Tools | AI Writing, Calculators"
      : `${en} | FreeToolset`;
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${newTitle}</title>`);
  }

  // 2) description — only replace if it currently contains Chinese; keep good English ones
  if (!NO_SCHEMA.has(slug)) {
    const eol = html.includes("\r\n") ? "\r\n" : "\n";
    const m = html.match(/<meta name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const needsFix = !m || hasHan(m[1]);
    if (needsFix) {
      const desc = GEN_DESC(en);
      if (m) {
        html = html.replace(/<meta name=["']description["'][^>]*>/i, `<meta name="description" content="${desc}">`);
      } else {
        html = html.replace(/(<\/title>)/i, `$1${eol}  <meta name="description" content="${desc}">`);
      }
    }
  }

  // 2b) keywords — strip any Chinese tokens so the attribute stays English-only
  html = html.replace(/<meta name=["']keywords["'][^>]*content=["']([^"']*)["']/i, (mm, kw) => {
    const cleaned = kw.split(",").map(s => s.trim()).filter(s => s && !hasHan(s)).join(", ");
    return `<meta name="keywords" content="${cleaned}">`;
  });

  // 3) WebApplication schema (tool pages)
  if (!NO_SCHEMA.has(slug) && !html.includes("WebApplication")) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": en,
      "url": "https://www.freetoolset.app/" + slug + ".html",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": GEN_DESC(en)
    };
    const eol = html.includes("\r\n") ? "\r\n" : "\n";
    html = html.replace(/<\/head>/i, `  <script type="application/ld+json">${eol}${JSON.stringify(schema, null, 2)}${eol}</script>${eol}</head>`);
  }

  // 4) Clean existing Open Graph tags if they contain Chinese
  const enTitleForOg = (html.match(/<title>([^<]*)<\/title>/) || [,""])[1];
  html = html.replace(/<meta property=["']og:title["'][^>]*content=["']([^"']*)["']/i, (mm, c) =>
    hasHan(c) ? `<meta property="og:title" content="${enTitleForOg}">` : mm);
  html = html.replace(/<meta property=["']og:description["'][^>]*content=["']([^"']*)["']/i, (mm, c) => {
    if (!hasHan(c)) return mm;
    const d = GEN_DESC(en);
    return `<meta property="og:description" content="${d}">`;
  });

  // 5) Fix an existing WebApplication schema that still contains Chinese
  if (html.includes("WebApplication")) {
    html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (mm, body) => {
      if (!body.includes("WebApplication")) return mm;
      if (!hasHan(body)) return mm;
      try {
        const obj = JSON.parse(body);
        obj.name = en;
        delete obj.alternateName;
        obj.description = GEN_DESC(en);
        return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
      } catch (e) { return mm; }
    });
  }

  fs.writeFileSync(file, html, "utf8");
  console.log("updated", slug);
});

if (missing.length) console.log("MISSING EN:", missing.join(", "));
