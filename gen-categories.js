/* gen-categories.js
 * 1) 增强 75 个工具页面包屑为三级 (Home / 分类 / 当前页)
 * 2) 生成 6 个分类聚合页 (ai-tools / calculators / converters / text-tools / developer-tools / fun-tools)
 * 3) 把分类页写入 sitemap.xml
 */
const fs = require("fs");
const path = require("path");
const ROOT = ".";

const SITE = "https://www.freetoolset.app";

// slug -> 分类 key
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
  "ai-tools": { name: "AI 写作工具", en: "AI Writing Tools",
    desc: "AI 一键生成产品描述、博客、邮件标题与 SEO 文案，免费使用，无需注册，浏览器本地运行保护隐私。",
    title: "AI 写作工具 · 6 个免费 AI 文案生成器 | FreeToolset" },
  "calculators": { name: "计算器", en: "Calculators",
    desc: "各类免费在线计算器：BMI、年龄、贷款、房贷、折扣、复利、薪资、ROI 等，输入即出结果。",
    title: "计算器 · 15 个免费在线计算器 | FreeToolset" },
  "converters": { name: "单位转换器", en: "Converters",
    desc: "免费在线单位换算与编码转换：温度、长度、重量、进制、罗马数字、文本编码等。",
    title: "单位转换器 · 12 个免费在线转换工具 | FreeToolset" },
  "text-tools": { name: "文本处理工具", en: "Text Tools",
    desc: "免费文本工具：字数统计、大小写转换、去空格、文本重复、Slug 生成、替换查找等。",
    title: "文本处理工具 · 12 个免费文本工具 | FreeToolset" },
  "developer-tools": { name: "开发者工具", en: "Developer Tools",
    desc: "程序员必备免费工具：JSON 格式化、Base64、URL 编码、正则测试、哈希、JWT 解析、Cron 等。",
    title: "开发者工具 · 26 个免费开发工具 | FreeToolset" },
  "fun-tools": { name: "趣味小工具", en: "Fun Tools",
    desc: "休闲好玩的免费小工具：摩斯密码翻译、计时器、秒表、骰子。",
    title: "趣味小工具 · 4 个免费趣味工具 | FreeToolset" }
};

const BAIDU_PUSH = `<script>
(function(){var bp=document.createElement('script');var curProtocol=window.location.protocol.split(':')[0];if(curProtocol==='https'){bp.src='https://zz.bdstatic.com/linksubmit/push.js';}else{bp.src='http://push.zhanzhang.baidu.com/push.js';}var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(bp,s);})();
</script>`;

function detectEol(s){ return s.includes("\r\n") ? "\r\n" : "\n"; }

// 取工具页标题（去 | FreeToolset 后缀）
function pageTitle(slug){
  const f = path.join(ROOT, slug + ".html");
  if(!fs.existsSync(f)) return slug;
  const html = fs.readFileSync(f, "utf8");
  const m = html.match(/<title>([^<]*)<\/title>/);
  if(!m) return slug;
  return m[1].split("|")[0].trim();
}

let breadcrumbFixed = 0;

// ---- 1) 增强面包屑 ----
for(const slug of Object.keys(CAT)){
  const f = path.join(ROOT, slug + ".html");
  if(!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, "utf8");
  const re = /(>Home<\/a>\s*<span class="separator">\/<\/span>\s*)(<span class="current">)/;
  if(re.test(html) && !html.includes("breadcrumb-cat")){
    const cat = CATMETA[CAT[slug]];
    const ins = `<a href="${CAT[slug]}.html">${cat.name}</a>` + "\n      <span class=\"separator\">/</span>\n      ";
    html = html.replace(re, "$1" + ins + "$2");
    // 标记避免重复
    html = html.replace(/(<nav class="breadcrumb">)/, '$1<!-- breadcrumb-cat -->');
    fs.writeFileSync(f, html, "utf8");
    breadcrumbFixed++;
  }
}
console.log("面包屑增强完成: " + breadcrumbFixed + " 页");

// ---- 2) 生成分类页 ----
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
      <p>© 2026 FreeToolset · 75 个免费在线工具，无需注册，本地运行保护隐私</p>
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
<html lang="zh">
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
      <h1>${meta.name} · 共 ${items.length} 个免费在线工具</h1>
      <p>${meta.desc}</p>
    </section>
    <div class="tool-grid">
${cards}
    </div>
  </main>
${footer}
${BAIDU_PUSH}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, key + ".html"), html, "utf8");
  console.log("生成分类页: " + key + ".html (" + items.length + " 个工具)");
}

// ---- 3) 更新 sitemap ----
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
console.log("sitemap 更新完成, 总 URL: " + total);
console.log("全部完成 ✅");
