/**
 * FreeToolset blog generator (idempotent).
 * Renders 12 tutorial pages into /blog/, cross-links tools + posts,
 * and appends the new URLs to sitemap.xml.
 */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const BLOG = path.join(ROOT, "blog");
const SITE = "https://www.freetoolset.app";

const TOOLNAME = {
  "base64-encoder.html": "Base64 Encoder/Decoder",
  "json-formatter.html": "JSON Formatter",
  "password-generator.html": "Password Generator",
  "password-strength-checker.html": "Password Strength Checker",
  "uuid-generator.html": "UUID Generator",
  "url-encoder.html": "URL Encoder/Decoder",
  "timestamp-converter.html": "Timestamp Converter",
  "regex-tester.html": "Regex Tester",
  "base-converter.html": "Base Converter",
  "image-compressor.html": "Image Compressor",
  "image-to-base64.html": "Image to Base64",
  "qr-code-generator.html": "QR Code Generator",
  "ai-product-description.html": "AI Product Description",
  "ai-studio.html": "AI Studio",
  "ai-seo-meta-generator.html": "AI SEO Meta Generator"
};

const POSTS = [
  {
    slug: "what-is-base64",
    title: "What Is Base64? Encoding Principles and Common Uses Explained",
    desc: "Base64 encoding principles, use cases, and hands-on practice with an online tool — understand why Base64 exists and how to represent binary data in development.",
    keywords: "base64, base64 explained, base64 uses, base64 online tool",
    tools: ["base64-encoder.html", "image-to-base64.html"],
    posts: ["url-encoding-explained", "json-formatting-tips"],
    blocks: [
      { tag: "p", text: "Base64 is an encoding you see everywhere on the web: email attachments, JWTs, and Data URI images all rely on it. It doesn't encrypt — it converts arbitrary bytes into text made of 64 safe characters, so it can travel through text-only protocols." },
      { tag: "h2", text: "What Base64 actually does" },
      { tag: "p", text: "Base64 splits every 3 bytes (24 bits) into 4 groups of 6 bits, mapped to 64 characters: A–Z, a–z, 0–9, plus + and / (with = padding when short). Binary data thus becomes pure ASCII text that safely fits inside JSON, URLs, or email headers." },
      { tag: "h2", text: "Common use cases" },
      { tag: "ul", text: "Inline small icons in HTML/CSS (Data URI) to cut requests\nEncode credentials in JWT and Basic auth\nEncode binary content in email attachments (MIME)\nCarry binary data with special characters in APIs" },
      { tag: "h2", text: "Try it online" },
      { tag: "p", text: "When you need to encode or decode, just use FreeToolset's Base64 tool — pure browser runtime, UTF-8 for Chinese supported, no upload required." },
      { tag: "tip", text: "Base64 is NOT encryption! It only encodes; anyone can decode it. Encrypt sensitive data before Base64 transport." }
    ]
  },
  {
    slug: "json-formatting-tips",
    title: "JSON Formatting & Validation: 5 Tips Every Developer Needs",
    desc: "Master practical techniques for JSON beautifying, minifying, and catching validation errors with an online formatter to locate API anomalies fast.",
    keywords: "json formatting, json validation, json beautify, api debugging",
    tools: ["json-formatter.html"],
    posts: ["regex-for-beginners", "understanding-uuid"],
    blocks: [
      { tag: "p", text: "JSON is the de facto standard for frontend-backend communication, but JSON compressed to one line is nearly unreadable. Formatting and validation are daily skills for developers." },
      { tag: "h2", text: "Why format" },
      { tag: "p", text: "Formatting (beautifying) uses indentation to make hierarchy obvious, helping you spot missing fields and type errors; minifying shrinks size during transport." },
      { tag: "h2", text: "5 practical tips" },
      { tag: "ul", text: "One-click beautify/minify with FreeToolset's JSON formatter\nUse live validation to pinpoint the line of a syntax error\nDiff two JSONs to find differences\nBeautify backend logs for easier troubleshooting\nSave common structures as templates" },
      { tag: "h2", text: "Common errors" },
      { tag: "p", text: "The most common are trailing commas, single-quoted keys, or forgetting double quotes around keys. A formatter highlights these errors directly." },
      { tag: "tip", text: "Beautify an API response before reading its structure — the fastest first step in integration debugging." }
    ]
  },
  {
    slug: "create-strong-password",
    title: "How to Generate a Strong Password: From Length to Entropy",
    desc: "Understand the link between password strength and entropy, learn to create hard-to-crack credentials with a random password generator, and self-check with a strength checker.",
    keywords: "strong password, password generator, password strength, account security",
    tools: ["password-generator.html", "password-strength-checker.html"],
    posts: ["understanding-uuid"],
    blocks: [
      { tag: "p", text: "Weak passwords are the number-one cause of account takeovers. A strong password should be long, random, and hard to guess or brute-force." },
      { tag: "h2", text: "What determines strength" },
      { tag: "p", text: "The core is 'entropy' — the number of possible combinations. Length matters more than a complex character set: 12+ random characters are usually safe enough." },
      { tag: "h2", text: "How to generate strong passwords" },
      { tag: "ul", text: "At least 12–16 characters\nMix upper/lowercase letters, digits, and symbols\nAvoid dictionary words, names, birthdays\nUse a different password per account\nStore them in a password manager" },
      { tag: "h2", text: "Make it concrete with a tool" },
      { tag: "p", text: "FreeToolset's password generator creates high-strength passwords locally at random, and the strength checker estimates crack time — all without upload." },
      { tag: "tip", text: "Avoid 'Pa$$w0rd'-style 'complex' but common variations — they're already in crack dictionaries." }
    ]
  },
  {
    slug: "understanding-uuid",
    title: "What Is a UUID? Generating and Using v4 Random Identifiers",
    desc: "The principles, version differences, and typical use cases of UUIDs (universally unique identifiers), plus how to batch-generate v4 online.",
    keywords: "uuid, uuid v4, unique identifier, guid",
    tools: ["uuid-generator.html"],
    posts: ["create-strong-password", "json-formatting-tips"],
    blocks: [
      { tag: "p", text: "A UUID (Universally Unique Identifier) is the standard way to generate unique IDs in distributed systems — you've seen it in nearly every server and database table." },
      { tag: "h2", text: "What is a UUID" },
      { tag: "p", text: "A UUID is a 128-bit identifier, standard text form 550e8400-e29b-41d4-a716-446655440000, split into five segments by hyphens." },
      { tag: "h2", text: "Why UUID v4" },
      { tag: "ul", text: "Random enough that collisions are vanishingly rare\nNo central service needed — fits distributed systems\nHarder to enumerate/guess than auto-increment IDs\nEasy to merge multi-source data without conflicts" },
      { tag: "h2", text: "Generate online" },
      { tag: "p", text: "FreeToolset's UUID generator can batch-generate up to 100 v4 IDs at once, locally — great for testing and system integration." },
      { tag: "tip", text: "When a primary key needs ordering, v4 isn't the best choice; consider a timestamp-prefixed variant." }
    ]
  },
  {
    slug: "url-encoding-explained",
    title: "How URL Encoding Works: Why Chinese Characters Become %E4%...",
    desc: "Explain percent-encoding (URL Encode) and the difference between encodeURI and encodeURIComponent, with an online encode/decode tool.",
    keywords: "url encoding, urlencode, percent encoding, encodeuri",
    tools: ["url-encoder.html"],
    posts: ["what-is-base64", "regex-for-beginners"],
    blocks: [
      { tag: "p", text: "When you see %E4%B8%AD in the address bar, that's URL encoding (percent-encoding) at work. It lets Chinese characters and special symbols appear safely in a URL." },
      { tag: "h2", text: "Why encode URLs" },
      { tag: "p", text: "URLs only allow a subset of ASCII characters. Spaces, Chinese, &, = and the like would be misinterpreted and must be encoded as % plus two hex digits." },
      { tag: "h2", text: "encodeURI vs encodeURIComponent" },
      { tag: "ul", text: "encodeURI keeps structural chars like ? # / — for whole URLs\nencodeURIComponent encodes more thoroughly — for a single parameter value\nUse the latter when concatenating query strings" },
      { tag: "h2", text: "Encode/decode online" },
      { tag: "p", text: "FreeToolset's URL tool converts both ways, handy for debugging API parameters." },
      { tag: "tip", text: "When a parameter value contains &, always use encodeURIComponent, or it'll be treated as a new parameter separator." }
    ]
  },
  {
    slug: "unix-timestamp-guide",
    title: "The Complete Unix Timestamp Guide: Seconds, Milliseconds & Dates",
    desc: "Understand Unix timestamps, the difference between seconds and milliseconds, UTC vs local time, and quickly troubleshoot time-zone issues with an online tool.",
    keywords: "timestamp, unix timestamp, time conversion, timezone",
    tools: ["timestamp-converter.html"],
    posts: ["number-base-conversion"],
    blocks: [
      { tag: "p", text: "A Unix timestamp is the number of seconds since 1970-01-01, used by almost every system to record time. Understand it and time-zone and log issues become easy." },
      { tag: "h2", text: "Seconds or milliseconds" },
      { tag: "p", text: "Many systems use seconds (10 digits), while JavaScript's Date.now() returns milliseconds (13 digits). 1000× apart — confusing them shows the time as 1970." },
      { tag: "h2", text: "UTC vs local time" },
      { tag: "ul", text: "UTC is Coordinated Universal Time, independent of time zone\nLocal time = UTC ± zone offset\nStore in UTC, convert only when displaying" },
      { tag: "h2", text: "Convert online" },
      { tag: "p", text: "FreeToolset's timestamp tool converts seconds/milliseconds both ways and shows UTC and local time for easy checking." },
      { tag: "tip", text: "When log times don't match, first confirm seconds vs milliseconds, then check the time-zone setting." }
    ]
  },
  {
    slug: "regex-for-beginners",
    title: "Regular Expressions for Beginners: Patterns, Groups & Online Testing in 30 Minutes",
    desc: "From metacharacters to capture groups, regex is a powerhouse for text. This intro gets you started and recommends a live online tester.",
    keywords: "regular expression, regex intro, regex, text matching",
    tools: ["regex-tester.html"],
    posts: ["json-formatting-tips", "url-encoding-explained"],
    blocks: [
      { tag: "p", text: "A regular expression (Regex) is a one-line 'pattern' for complex text matching — form validation and log extraction both rely on it." },
      { tag: "h2", text: "Core metacharacters" },
      { tag: "ul", text: "\\d digit, \\w word char, . any char\n* 0+, + 1+, ? 0 or 1\n[] character set, () capture group\n^ start, $ end" },
      { tag: "h2", text: "Learn from examples" },
      { tag: "p", text: "Match email with ^\\S+@\\S+\\.\\S+$; extract a date with \\d{4}-\\d{2}-\\d{2}. Write small examples first, then add conditions step by step." },
      { tag: "h2", text: "Write and test together" },
      { tag: "p", text: "FreeToolset's regex tester highlights matches live and shows capture groups — the best playground to pick up regex." },
      { tag: "tip", text: "Don't write regex too complex at once. Break it into small pieces and verify each — better readability and maintainability." }
    ]
  },
  {
    slug: "number-base-conversion",
    title: "Number Base Conversion Explained: Binary, Octal, Decimal & Hexadecimal",
    desc: "Grasp number bases in computing, master binary/octal/decimal/hex conversion, with an online base converter.",
    keywords: "base conversion, binary, hexadecimal, decimal",
    tools: ["base-converter.html"],
    posts: ["unix-timestamp-guide"],
    blocks: [
      { tag: "p", text: "Computers think in binary, humans in decimal, and colors and memory addresses often use hexadecimal. Base conversion is foundational to understanding the low level." },
      { tag: "h2", text: "Why multiple bases" },
      { tag: "ul", text: "Binary (0/1) is the circuit's native language\nOctal/hex are compact forms of binary\nDecimal is human habit\nHex is common for color values (#RRGGBB) and memory addresses" },
      { tag: "h2", text: "Conversion thinking" },
      { tag: "p", text: "Decimal to others uses 'divide by base, take remainder'; others to decimal uses 'expand by weight and sum.' Once you know the principles, a tool handles bulk conversion more efficiently." },
      { tag: "h2", text: "Convert online" },
      { tag: "p", text: "FreeToolset's base converter does real-time binary/octal/decimal/hex conversion." },
      { tag: "tip", text: "When you see a color like #ff8800, try splitting it into three hex bytes for more intuitive color tuning." }
    ]
  },
  {
    slug: "image-compression-guide",
    title: "Lossless-Looking Image Compression: Practical Ways to Speed Up Pages",
    desc: "Understand lossy vs lossless compression, learn to shrink images in-browser to boost load speed while balancing quality and privacy.",
    keywords: "image compression, page speed, image optimization, image compressor",
    tools: ["image-compressor.html", "image-to-base64.html"],
    posts: ["qr-code-use-cases"],
    blocks: [
      { tag: "p", text: "Images are often the largest resource on a page. Reasonable compression noticeably speeds up loading with barely visible difference — directly affecting bounce rate and SEO." },
      { tag: "h2", text: "Lossy vs lossless" },
      { tag: "ul", text: "Lossy (JPEG/WebP) is smaller — good for photos\nLossless (PNG) keeps detail — good for icons/screenshots\nWebP usually beats JPEG/PNG" },
      { tag: "h2", text: "Compression in practice" },
      { tag: "p", text: "Use FreeToolset's image compressor to compress and resize right in the browser — no server upload, protecting privacy with instant output." },
      { tag: "h2", text: "A few tips" },
      { tag: "ul", text: "Prefer WebP format\nExport at display size — don't upload originals\nQuality 75–85 is usually enough" },
      { tag: "tip", text: "Keep above-the-fold images under 100KB for a clear mobile experience boost." }
    ]
  },
  {
    slug: "qr-code-use-cases",
    title: "Common Uses & Best Practices for QR Code Generation",
    desc: "QR codes can carry URLs, text, WiFi, and more. This article lays out 8 practical scenarios and a local generation tool.",
    keywords: "qr code, qr code generation, scan",
    tools: ["qr-code-generator.html"],
    posts: ["image-compression-guide"],
    blocks: [
      { tag: "p", text: "A QR code turns information into one image — scan with a phone to read it. It goes far beyond payments and is a low-cost, efficient connection entry point." },
      { tag: "h2", text: "What a QR code can hold" },
      { tag: "ul", text: "URL links\nPlain text / WiFi password\nContact (vCard)\nSMS / phone actions" },
      { tag: "h2", text: "8 practical scenarios" },
      { tag: "ul", text: "Business-card QR — scan to save contact\nEvent posters — drive follows to an account\nProduct packaging — jump to instructions\nMeeting materials — quick WiFi connect\nE-commerce parcels — track logistics\nOffline ads — drive to a landing page\nE-tickets — scan to redeem\nTeaching materials — scan to get resources" },
      { tag: "h2", text: "Generate locally" },
      { tag: "p", text: "FreeToolset's QR tool supports custom sizes, generates locally for instant download, and keeps assets on-device." },
      { tag: "tip", text: "Higher error correction means it survives partial damage — raise it for important scenarios." }
    ]
  },
  {
    slug: "ai-product-description-conversion",
    title: "Writing Product Descriptions with AI: Practical Methods to Boost Detail-Page Conversion",
    desc: "Product descriptions directly affect conversion. This article shows how to batch-produce selling-point copy with an AI product description generator, plus optimization tips.",
    keywords: "ai product description, ecommerce copy, detail-page conversion, ai writing",
    tools: ["ai-product-description.html", "ai-studio.html"],
    posts: ["seo-meta-tags-guide"],
    blocks: [
      { tag: "p", text: "On an e-commerce detail page, the product description is a key conversion lever. Good copy clarifies the selling point and hits the need, and AI helps you batch-produce drafts." },
      { tag: "h2", text: "What good copy looks like" },
      { tag: "ul", text: "One opening line stating what it is and what problem it solves\nBenefits (not just parameter lists)\nClear audience and scenario\nLanguage matching the platform tone" },
      { tag: "h2", text: "Boost efficiency with AI" },
      { tag: "p", text: "FreeToolset's AI product description generator outputs multiple copy variants from product info, with style switching — great for Taobao, standalone sites, and cross-border stores to list fast." },
      { tag: "h2", text: "Optimization tips" },
      { tag: "ul", text: "Embed core keywords for search\nHighlight differentiation and trust evidence\nTune tone per channel" },
      { tag: "tip", text: "AI output is high-quality draft — always manually verify parameters and compliance wording before listing." }
    ]
  },
  {
    slug: "seo-meta-tags-guide",
    title: "SEO Meta Tag Optimization: How to Write Titles & Descriptions People Click",
    desc: "Titles and descriptions are the first impression in search results. This article covers length, keywords, and appeal, and recommends an AI metadata generator.",
    keywords: "seo meta, title optimization, description optimization, meta tags",
    tools: ["ai-seo-meta-generator.html", "ai-studio.html"],
    posts: ["ai-product-description-conversion"],
    blocks: [
      { tag: "p", text: "In search results, users see the title and description first. Good meta tags directly lift click-through rate (CTR), which in turn affects ranking." },
      { tag: "h2", text: "How to write the title" },
      { tag: "ul", text: "Keep 50–60 characters to avoid truncation\nFront-load the core keyword\nInclude the brand name for trust\nUnique per page, no stuffing" },
      { tag: "h2", text: "How to write the description" },
      { tag: "p", text: "Descriptions don't directly affect ranking but decide whether users click. Use 120–155 characters to summarize the value proposition with a call to action." },
      { tag: "h2", text: "Generate with AI" },
      { tag: "p", text: "FreeToolset's AI SEO metadata generator batch-produces titles and descriptions meeting length and keyword requirements — faster and more consistent." },
      { tag: "tip", text: "Periodically use Search Console to find pages with high impressions but low clicks, and rewrite their descriptions first." }
    ]
  }
];

function renderBody(blocks) {
  return blocks.map(b => {
    if (b.tag === "h2") return "    <h2>" + b.text + "</h2>";
    if (b.tag === "p") return "    <p>" + b.text + "</p>";
    if (b.tag === "tip") return '    <div class="tip">💡 ' + b.text + "</div>";
    if (b.tag === "ul") {
      const items = b.text.split("\n").map(i => "      <li>" + i + "</li>").join("\n");
      return "    <ul>\n" + items + "\n    </ul>";
    }
    return "";
  }).join("\n");
}

function renderPost(p) {
  const url = SITE + "/blog/" + p.slug + ".html";
  const toolLinks = p.tools.map(t =>
    '      <a href="../' + t + '">' + (TOOLNAME[t] || t) + "</a>").join("\n");
  const postLinks = p.posts.map(s => {
    const tp = POSTS.find(x => x.slug === s);
    return '      <a href="' + s + '.html">' + (tp ? tp.title : s) + "</a>";
  }).join("\n");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": p.title,
    "description": p.desc,
    "url": url,
    "mainEntityOfPage": url,
    "publisher": { "@type": "Organization", "name": "FreeToolset", "url": SITE + "/" }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title} | FreeToolset Guides</title>
  <meta name="description" content="${p.desc}">
  <meta name="keywords" content="${p.keywords}">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.desc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="FreeToolset">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.title}">
  <meta name="twitter:description" content="${p.desc}">
  <meta name="twitter:image" content="${SITE}/og-image.png">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <link rel="stylesheet" href="../css/style.css">
  <script type="application/ld+json">
  ${JSON.stringify(schema)}
  </script>
</head>
<body>

  <nav class="navbar">
    <a href="../index.html" class="navbar-brand"><span class="logo-icon">⚡</span> FreeToolset</a>
    <div class="navbar-nav">
      <a href="../index.html" class="nav-link">Home</a>
      <a href="../ai-studio.html" class="nav-link">✨ AI Studio</a>
      <a href="../index.html#tools" class="nav-link">Tools</a>
      <a href="../about.html" class="nav-link">About</a>
      <a href="../privacy-policy.html" class="nav-link">Privacy</a>
    </div>
  </nav>

  <main class="main-content">
    <article class="article">
      <p class="post-meta">FreeToolset · Practical Guides</p>
      <h1>${p.title}</h1>
${renderBody(p.blocks)}
      <div class="related-posts">
        <h3>🔗 Related Tools</h3>
${toolLinks}
        <h3>📚 Related Articles</h3>
${postLinks}
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div>
        <div class="footer-brand"><span class="logo-icon">⚡</span> FreeToolset</div>
        <p class="footer-desc">Free online tools that run entirely in your browser — your data never leaves your device.</p>
      </div>
      <div class="footer-links">
        <a href="../index.html">Tools</a>
        <a href="../ai-studio.html">AI Studio</a>
        <a href="../about.html">About</a>
        <a href="../privacy-policy.html">Privacy</a>
      </div>
    </div>
    <div class="footer-bottom"><p>© 2025 FreeToolset. All tools run locally in your browser.</p></div>
  </footer>

</body>
</html>
`;
}

if (!fs.existsSync(BLOG)) fs.mkdirSync(BLOG, { recursive: true });
let written = 0;
POSTS.forEach(p => {
  const fp = path.join(BLOG, p.slug + ".html");
  fs.writeFileSync(fp, renderPost(p), "utf8");
  written++;
  console.log("WROTE blog/" + p.slug + ".html");
});

// Update sitemap.xml
const sm = path.join(ROOT, "sitemap.xml");
let xml = fs.readFileSync(sm, "utf8");
let added = 0;
POSTS.forEach(p => {
  const loc = SITE + "/blog/" + p.slug + ".html";
  if (!xml.includes(loc)) {
    const entry = `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`;
    xml = xml.replace("</urlset>", entry);
    added++;
  }
});
fs.writeFileSync(sm, xml, "utf8");
console.log("\nBlog pages written:", written, "| sitemap entries added:", added);
