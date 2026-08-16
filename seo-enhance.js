/**
 * FreeToolset SEO enhancer (English-only, replace mode).
 * For each tool page: completes Open Graph / Twitter tags, adds JSON-LD
 * SoftwareApplication schema, and (re)inserts an English "Use Cases" intro block.
 * Re-running replaces existing content so previously-Chinese blocks become English.
 */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

const TOOLS = [
  "base64-encoder.html", "json-formatter.html", "password-generator.html",
  "uuid-generator.html", "hash-generator.html", "url-encoder.html",
  "color-picker.html", "image-compressor.html", "qr-code-generator.html",
  "word-counter.html", "lorem-ipsum-generator.html", "image-to-base64.html",
  "text-case-converter.html", "timestamp-converter.html", "regex-tester.html",
  "base-converter.html", "line-tools.html", "port-lookup.html",
  "password-strength-checker.html", "ai-studio.html", "ai-product-description.html",
  "ai-seo-meta-generator.html", "ai-blog-writer.html", "ai-email-subject.html",
  "ai-content-rewriter.html"
];

const EN = {
  "base64-encoder.html": "Base64 is a universal format for encoding binary data as plain text, widely used for email attachments, API data transfer, Data-URI inline images, and JWT / Basic Auth. This tool runs entirely in your browser, supports UTF-8 (including Chinese and emoji), and encodes and decodes instantly without uploading your data — balancing security and speed, ideal for development debugging and everyday text conversion.",
  "json-formatter.html": "JSON is the most common data format for front-end and back-end communication. This tool beautifies, minifies, and validates JSON in one click, automatically highlights syntax errors and pinpoints line numbers, helping developers quickly troubleshoot abnormal API responses and organize config files. It runs locally, so your data never leaves the browser — great for debugging APIs, inspecting logs, and editing package.json.",
  "password-generator.html": "A strong password is the first line of defense for account security. This tool generates high-strength random passwords, with customizable length and inclusion of uppercase and lowercase letters, numbers, and symbols, and supports batch generation. All computation happens locally with no data uploaded, making it ideal for creating hard-to-crack credentials for email, online banking, servers, and other sensitive accounts.",
  "uuid-generator.html": "UUIDs (Universally Unique Identifiers) are commonly used as database primary keys, distributed-system IDs, session identifiers, and temporary file names. This tool generates random UUID v4 compliant with RFC 4122 in one click, supports batch generation of up to 100, requires no backend, and runs locally — ideal for development testing and system integration.",
  "hash-generator.html": "A hash maps any text to a fixed-length digest, used to verify file integrity, store password digests, and generate signatures. This tool supports MD5, SHA-1, SHA-256, and SHA-512, computing in real time locally without network dependency — ideal for verifying whether downloaded files have been tampered with and debugging API signatures.",
  "url-encoder.html": "URL encoding (percent-encoding) is used to safely transmit special characters in web addresses. This tool converts between encodeURI and encodeURIComponent, helping developers correctly handle Chinese parameters, spaces, and symbols, avoid 400 errors, and is ideal for front-end link building and debugging query strings.",
  "color-picker.html": "A color picker quickly grabs colors and converts between HEX, RGB, HSL, and other formats — essential for front-end and UI design. This tool supports clicking a palette to pick, converting input values, and copying results, all locally — ideal for color proofing, extracting CSS variables, and recreating designs.",
  "image-compressor.html": "Oversized images slow down page loading. This tool compresses and resizes images directly in the browser, supports common formats, and reduces size without uploading to a server — improving page speed while balancing quality and performance, ideal for webmasters optimizing sites and compressing e-commerce images.",
  "qr-code-generator.html": "QR codes encode URLs, text, WiFi, and other info into an image for easy mobile scanning. This tool supports custom sizes and formats, generates locally for instant download — ideal for creating business-card QR codes, event posters, and official-account follow codes for promotion.",
  "word-counter.html": "Word counting is the foundation of writing and SEO. This tool counts characters, words, sentences, and paragraphs in real time, helping authors control length and meet submission and platform limits — ideal for checking the length of papers, official-account posts, and abstracts quickly.",
  "lorem-ipsum-generator.html": "Lorem Ipsum is placeholder text commonly used in design and typesetting. This tool generates placeholder text by paragraph, sentence, or word in batches, making it easy to build page layouts and demonstrate component effects before finalizing content — ideal for front-end prototyping and UI mockups.",
  "image-to-base64.html": "Converting images to Base64 Data URIs lets you inline them directly into HTML / CSS, reducing requests. This tool encodes images into Data URIs locally with one-click copy — ideal for inlining small icons and embedding images in email HTML, avoiding broken external links.",
  "text-case-converter.html": "Case conversion is common in programming and copywriting. This tool supports uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more, processing batches locally — ideal for variable naming, title normalization, and code organization.",
  "timestamp-converter.html": "Unix timestamps are the standard way systems record time. This tool converts between second / millisecond timestamps and dates, showing UTC and local time, making it easy to troubleshoot log times and interface timezone issues — ideal for back-end debugging and cross-timezone collaboration.",
  "regex-tester.html": "Regular expressions are powerful for text matching and extraction. This tool tests regex in real time, highlights matches, and shows capture groups, helping developers validate rules like emails and phone numbers — ideal for form validation, log extraction, and data cleaning.",
  "base-converter.html": "Base conversion is a common need in low-level development. This tool converts between binary, octal, decimal, and hexadecimal in real time — ideal for learning computer fundamentals, debugging memory addresses, and reading color values and bitwise results.",
  "line-tools.html": "Line tools batch-organize text: sort, dedupe, shuffle, remove blank lines, trim, and change case. This tool runs entirely locally — ideal for cleaning CSV data, organizing name lists, and processing logs, boosting text-editing efficiency.",
  "port-lookup.html": "Ports are the entry and exit points of network services. This tool queries the protocol, service, and security risks behind TCP / UDP ports, helping ops quickly identify open ports and troubleshoot firewall and port conflicts — ideal for server hardening and troubleshooting.",
  "password-strength-checker.html": "A password strength checker evaluates entropy, estimates crack time, and gives improvement suggestions. This tool runs locally without uploading your password, helping you judge whether a passphrase is secure enough when registering — ideal for individuals and businesses improving account protection.",
  "ai-studio.html": "The AI Content Studio is your all-in-one writing assistant: enter any need and AI instantly generates product descriptions, blog posts, email subjects, SEO copy, and more. Free daily quota, no registration, works right in the browser — ideal for marketing, operations, and creators producing content efficiently.",
  "ai-product-description.html": "Generate high-converting product descriptions in one click with AI: enter product info and it automatically produces clear, e-commerce-friendly copy with adjustable language and tone, helping sellers improve detail-page conversion — ideal for Taobao, independent sites, and cross-border stores.",
  "ai-seo-meta-generator.html": "The AI SEO meta generator automatically produces optimized titles and descriptions based on your page topic, controlling character counts and embedding keywords to improve search click-through rates — ideal for webmasters batch-optimizing landing-page meta tags and improving indexing and ranking.",
  "ai-blog-writer.html": "The AI blog writing assistant generates well-structured, readable articles from a topic, with built-in subheadings and key points, helping content creators produce efficiently and maintain posting frequency — ideal for self-media, corporate blogs, and SEO content matrices.",
  "ai-email-subject.html": "The AI email subject generator produces 10 high-open-rate subjects at once, with A/B style switching, helping marketing emails improve open rates — ideal for newsletters, promotions, and cold outreach.",
  "ai-content-rewriter.html": "The AI content rewriter rewrites and polishes text, adjusting tone and rewrite strength to avoid duplication and spark inspiration — ideal for spinning, copy optimization, and multi-platform distribution, with local submission and instant AI return."
};

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function pick(html, prop, attr) {
  const pat1 = `<meta[^>]+${attr}=["']${escRe(prop)}["'][^>]+content=["']([^"']*)["']`;
  let m = html.match(new RegExp(pat1, "i"));
  if (m) return m[1];
  const pat2 = `<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${escRe(prop)}["']`;
  m = html.match(new RegExp(pat2, "i"));
  return m ? m[1] : "";
}
function getName(html, n) { return pick(html, n, "name"); }
function getProp(html, p) { return pick(html, p, "property"); }
function getTitle(html) { const m = html.match(/<title>([^<]*)<\/title>/i); return m ? m[1] : ""; }
function getCanonical(html) {
  let m = html.match(/<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']*)["\']/i);
  if (m) return m[1];
  m = html.match(/<link[^>]+href=["\']([^"\']*)["\'][^>]+rel=["\']canonical["\']/i);
  return m ? m[1] : "";
}

const hasImage = fs.existsSync(path.join(ROOT, "og-image.png"));
let changed = 0;

TOOLS.forEach(file => {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) { console.log("SKIP (missing):", file); return; }
  let html = fs.readFileSync(fp, "utf8");
  const orig = html;

  const title = getTitle(html);
  const desc = getName(html, "description");
  const ogTitle = getProp(html, "og:title") || title;
  const ogDesc = getProp(html, "og:description") || desc;
  let canonical = getCanonical(html);
  if (!canonical) canonical = "https://www.freetoolset.app/" + file;
  const name = title.replace(/[—\-|]\s*FreeToolset[\s\S]*$/i, "").trim();

  // 1) Complete Open Graph / Twitter tags (only if missing)
  if (!html.includes("<!-- ft-og-social -->")) {
    const img = hasImage
      ? '  <meta property="og:image" content="https://www.freetoolset.app/og-image.png">\n' +
        '  <meta property="og:image:width" content="1200">\n' +
        '  <meta property="og:image:height" content="630">\n' +
        '  <meta name="twitter:image" content="https://www.freetoolset.app/og-image.png">\n'
      : "";
    const social =
      "  <!-- ft-og-social -->\n" +
      '  <meta property="og:type" content="website">\n' +
      '  <meta property="og:url" content="' + canonical + '">\n' +
      '  <meta property="og:site_name" content="FreeToolset">\n' +
      img +
      '  <meta name="twitter:card" content="summary_large_image">\n' +
      '  <meta name="twitter:title" content="' + ogTitle + '">\n' +
      '  <meta name="twitter:description" content="' + ogDesc + '">\n';
    html = html.replace("</head>", social + "</head>");
  }

  // 2) JSON-LD SoftwareApplication schema (only if missing)
  if (!html.includes("<!-- ft-schema -->")) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": name,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "url": canonical,
      "description": desc,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": { "@type": "Organization", "name": "FreeToolset", "url": "https://www.freetoolset.app/" }
    };
    const s = "  <!-- ft-schema -->\n  <script type=\"application/ld+json\">\n  " + JSON.stringify(schema) + "\n  </script>\n";
    html = html.replace("</head>", s + "</head>");
  }

  // 3) English "Use Cases" intro block — replace existing ft-zh-intro if present
  if (EN[file]) {
    html = html.replace(/<!-- ft-zh-intro -->[\s\S]*?<\/section>\n?/, "");
    const block =
      "  <!-- ft-zh-intro -->\n" +
      '  <section class="tool-intro">\n' +
      "    <h2>📌 Use Cases</h2>\n" +
      "    <p>" + EN[file] + "</p>\n" +
      "  </section>\n";
    html = html.replace('<main class="main-content">', '<main class="main-content">\n' + block);
  }

  if (html !== orig) {
    fs.writeFileSync(fp, html, "utf8");
    changed++;
    console.log("UPDATED:", file);
  } else {
    console.log("unchanged:", file);
  }
});

console.log("\nDone. Pages modified:", changed, "/", TOOLS.length);
