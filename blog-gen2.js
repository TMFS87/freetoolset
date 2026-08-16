/**
 * FreeToolset blog generator (batch 2).
 * Renders 30 new Chinese tutorial pages into /blog/, cross-links tools + posts,
 * and appends new URLs to sitemap.xml (idempotent).
 */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const BLOG = path.join(ROOT, "blog");
const SITE = "https://www.freetoolset.app";

// Original tool name map (fallback for tools not present in tools-data.js)
const BASE_NAME = {
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
  "ai-seo-meta-generator.html": "AI SEO Meta Generator",
  "word-counter.html": "Word Counter",
  "lorem-ipsum-generator.html": "Lorem Ipsum Generator",
  "text-case-converter.html": "Case Converter",
  "color-picker.html": "Color Picker",
  "hash-generator.html": "Hash Generator",
  "line-tools.html": "Line Tools",
  "port-lookup.html": "Port Lookup",
  "ai-blog-writer.html": "AI Blog Writer",
  "ai-email-subject.html": "AI Email Subject",
  "ai-content-rewriter.html": "AI Content Rewriter"
};

const T = require("./tools-data.js");
const SLUG2NAME = Object.assign({}, BASE_NAME);
T.forEach(t => { SLUG2NAME[t.slug + ".html"] = t.title; });

const POSTS = require("./blog-data.js");

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
  const toolLinks = (p.tools || []).map(t =>
    '      <a href="../' + t + '">' + (SLUG2NAME[t] || t) + "</a>").join("\n");
  const postLinks = (p.posts || []).map(s => {
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
      <div class="related_posts">
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

<!-- BAIDU_AUTO_PUSH -->
<script>
(function(){var bp=document.createElement('script');var p=location.protocol.split(':')[0];bp.src=p==='https'?'https://zz.bdstatic.com/linksubmit/push.js':'http://push.zhanzhang.baidu.com/push.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(bp,s);})();
</script>
</body>
</html>
`;
}

if (!fs.existsSync(BLOG)) fs.mkdirSync(BLOG, { recursive: true });
let written = 0, skipped = 0;
POSTS.forEach(p => {
  const fp = path.join(BLOG, p.slug + ".html");
  fs.writeFileSync(fp, renderPost(p), "utf8");
  written++;
  console.log("WROTE blog/" + p.slug + ".html");
});

// Update sitemap.xml (idempotent)
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
console.log("\nBlog pages written:", written, "| skipped(existing):", skipped, "| sitemap entries added:", added);
