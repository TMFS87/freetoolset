/**
 * FreeToolset SEO enhancer (idempotent).
 * For each tool page: completes Open Graph / Twitter tags, adds JSON-LD
 * SoftwareApplication schema, and inserts a Chinese "适用场景" intro block.
 * Re-running is safe (guarded by HTML marker comments).
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

const ZH = {
  "base64-encoder.html": "Base64 是一种将二进制数据编码为纯文本的通用格式，广泛用于邮件附件、API 数据传输、Data URI 内联图片以及 JWT / 基础认证等场景。本工具完全在浏览器本地运行，支持 UTF-8（含中文、emoji），无需上传数据即可即时编解码，兼顾安全与速度，适合开发调试与日常文本转换。",
  "json-formatter.html": "JSON 是前后端交互最常用的数据格式。本工具可一键美化、压缩、校验 JSON，自动高亮语法错误并定位行号，帮助开发者快速排查接口返回异常、整理配置文件。纯本地运行，数据不出浏览器，适合调试 API、查看日志、编辑 package.json 等。",
  "password-generator.html": "强密码是账号安全的第一道防线。本工具可生成高强度随机密码，自定义长度并包含大小写字母、数字与符号，支持批量生成。所有计算在本地完成，不上传任何信息，适合为邮箱、网银、服务器等敏感账户创建难以破解的凭据。",
  "uuid-generator.html": "UUID（通用唯一标识符）常用于数据库主键、分布式系统 ID、会话标识与临时文件名。本工具一键生成符合 RFC 4122 的随机 UUID v4，支持批量生成最多 100 个，无需后端、本地即生成，适合开发测试与系统对接。",
  "hash-generator.html": "哈希（Hash）可将任意文本映射为固定长度摘要，用于校验文件完整性、存储密码摘要、生成签名等。本工具支持 MD5、SHA-1、SHA-256、SHA-512，本地实时计算不依赖网络，适合验证下载文件是否被篡改、调试接口签名。",
  "url-encoder.html": "URL 编码（百分号编码）用于在网址中安全传输特殊字符。本工具支持 encodeURI 与 encodeURIComponent 两种方式互转，帮助开发者正确处理中文参数、空格与符号，避免接口 400 错误，适合前端拼接链接与调试查询字符串。",
  "color-picker.html": "取色器可快速获取颜色并转换 HEX、RGB、HSL 等格式，是前端与 UI 设计必备。本工具支持点击色板取色、输入值互转、复制结果，纯本地运行，适合配色校对、CSS 变量提取与设计稿还原。",
  "image-compressor.html": "图片体积过大会拖慢网页加载。本工具在浏览器内直接压缩与缩放图片，支持常见格式，无需上传服务器即可减小体积、提升页面速度，兼顾画质与性能，适合站长优化站点、压缩电商图片。",
  "qr-code-generator.html": "二维码可把网址、文本、WiFi 等信息编码为一图，方便手机扫码。本工具支持自定义尺寸与格式，本地生成、即时下载，适合制作名片二维码、活动海报、公众号关注码等推广素材。",
  "word-counter.html": "字数统计是写作与 SEO 的基础。本工具实时统计字数、字符数、句子与段落，帮助作者控制篇幅、满足投稿与平台限制，适合写论文、公众号推文、论文摘要时快速核对长度。",
  "lorem-ipsum-generator.html": "Lorem Ipsum 是设计与排版常用的占位文本。本工具可按段落、句子或单词批量生成占位文字，方便在未定稿前搭建页面布局、演示组件效果，适合前端原型设计与 UI 稿填充。",
  "image-to-base64.html": "将图片转为 Base64 Data URI 可直接内联进 HTML / CSS，减少请求数。本工具在本地把图片编码为 Data URI，支持一键复制，适合做小图标内联、邮件 HTML 嵌入图片，避免外链失效。",
  "text-case-converter.html": "大小写转换在编程与文案中很常用。本工具支持大写、小写、首字母大写、驼峰（camelCase）、蛇形（snake_case）、短横（kebab-case）等多种格式互转，本地批量处理，适合变量命名、标题规范化与代码整理。",
  "timestamp-converter.html": "Unix 时间戳是系统记录时间的标准方式。本工具支持秒 / 毫秒时间戳与日期互转，显示 UTC 与本地时间，方便排查日志时间、接口时区问题，适合后端调试与跨时区协作。",
  "regex-tester.html": "正则表达式是文本匹配与提取的利器。本工具实时测试正则，高亮匹配结果、展示捕获组，帮助开发者验证邮箱、手机号等规则，适合表单校验、日志抽取与数据清洗。",
  "base-converter.html": "进制转换是底层开发的常见需求。本工具支持二进制、八进制、十进制、十六进制互转，实时计算，适合学习计算机原理、调试内存地址、阅读颜色值与位运算结果。",
  "line-tools.html": "行处理工具可批量整理文本：排序、去重、乱序、去空行、裁剪与改大小写。本工具纯本地运行，适合清洗 CSV 数据、整理名单、处理日志，提升文本编辑效率。",
  "port-lookup.html": "端口是网络服务的出入口。本工具可查询 TCP / UDP 端口对应的协议、服务与安全风险，帮助运维快速识别开放端口、排查防火墙与端口冲突，适合服务器安全加固与排障。",
  "password-strength-checker.html": "密码强度检查器可评估口令熵值、预估破解时间并给出改进建议。本工具本地运行，不上传密码，帮助你在注册时判断口令是否足够安全，适合个人与企业提升账户防护。",
  "ai-studio.html": "AI 内容工作台是你的全能写作助手：输入任意需求，AI 即时生成商品描述、博客、邮件标题、SEO 文案等。每日免费额度、无需注册，纯网页即用，适合营销、运营与创作者高效产出内容。",
  "ai-product-description.html": "用 AI 一键生成高转化商品描述：输入产品信息，自动产出卖点清晰、符合电商调性的文案，支持多语言与风格切换，帮助卖家提升详情页转化，适合淘宝、独立站与跨境店铺。",
  "ai-seo-meta-generator.html": "AI SEO 元数据生成器可根据页面主题自动产出优化的标题与描述，控制字符数、嵌入关键词，提升搜索点击率，适合站长批量优化落地页 meta 标签、提高收录排名。",
  "ai-blog-writer.html": "AI 博客写作助手可根据主题生成结构完整、可读性强的文章，自带小标题与要点，帮助内容创作者高效产出、保持更新频率，适合自媒体、企业博客与 SEO 内容矩阵。",
  "ai-email-subject.html": "AI 邮件标题生成器一次产出 10 条高打开率标题，支持 A / B 风格切换，帮助营销邮件提升打开率，适合 Newsletter、促销与冷启动触达。",
  "ai-content-rewriter.html": "AI 内容改写器可重写、润色文本，调整语气与改写强度，避免重复、激发灵感，适合伪原创、文案优化与多平台分发，本地提交、AI 即时返回。"
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

  // 1) Complete Open Graph / Twitter tags
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

  // 2) JSON-LD SoftwareApplication schema
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

  // 3) Chinese "适用场景" intro block
  if (!html.includes("<!-- ft-zh-intro -->") && ZH[file]) {
    const block =
      "  <!-- ft-zh-intro -->\n" +
      '  <section class="tool-intro">\n' +
      "    <h2>📌 适用场景</h2>\n" +
      "    <p>" + ZH[file] + "</p>\n" +
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
