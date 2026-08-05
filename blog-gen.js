/**
 * FreeToolset blog generator (idempotent).
 * Renders 12 Chinese tutorial pages into /blog/, cross-links tools + posts,
 * and appends the new URLs to sitemap.xml.
 */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const BLOG = path.join(ROOT, "blog");
const SITE = "https://www.freetoolset.app";

const TOOLNAME = {
  "base64-encoder.html": "Base64 编解码",
  "json-formatter.html": "JSON 格式化",
  "password-generator.html": "密码生成器",
  "password-strength-checker.html": "密码强度检查器",
  "uuid-generator.html": "UUID 生成器",
  "url-encoder.html": "URL 编码/解码",
  "timestamp-converter.html": "时间戳转换",
  "regex-tester.html": "正则测试器",
  "base-converter.html": "进制转换器",
  "image-compressor.html": "图片压缩",
  "image-to-base64.html": "图片转 Base64",
  "qr-code-generator.html": "二维码生成器",
  "ai-product-description.html": "AI 商品描述",
  "ai-studio.html": "AI 内容工作台",
  "ai-seo-meta-generator.html": "AI SEO 元数据"
};

const POSTS = [
  {
    slug: "what-is-base64",
    title: "Base64 是什么？一文讲清编码原理与常见用途",
    desc: "Base64 编码原理、使用场景与在线工具实践，帮你快速搞懂为什么需要 Base64，以及如何在开发中表示二进制数据。",
    keywords: "base64, base64 原理, base64 用途, base64 在线工具",
    tools: ["base64-encoder.html", "image-to-base64.html"],
    posts: ["url-encoding-explained", "json-formatting-tips"],
    blocks: [
      { tag: "p", text: "Base64 是网络中随处可见的编码方式：邮件附件、JWT、Data URI 图片背后都有它的身影。它并不加密，而是把任意字节转成由 64 个安全字符组成的文本，方便在只认文本的协议里传输。" },
      { tag: "h2", text: "Base64 到底做了什么" },
      { tag: "p", text: "Base64 把每 3 个字节（24 位）拆成 4 组 6 位，映射到 A–Z、a–z、0–9 以及 +、/ 共 64 个字符（不足补 =）。这样二进制数据就变成了纯 ASCII 文本，能安全地塞进 JSON、URL 或邮件头。" },
      { tag: "h2", text: "常见使用场景" },
      { tag: "ul", text: "在 HTML/CSS 中内联小图标（Data URI），减少请求数\n在 JWT、Basic 认证里编码凭证\n邮件附件（MIME）编码二进制内容\nAPI 中传输含特殊字符的二进制数据" },
      { tag: "h2", text: "在线实践" },
      { tag: "p", text: "需要编解码时，直接用 FreeToolset 的 Base64 工具即可，纯浏览器运行、支持中文 UTF-8，无需上传数据。" },
      { tag: "tip", text: "Base64 不是加密！它只做编码，任何人都能解码。敏感数据请先加密再用 Base64 传输。" }
    ]
  },
  {
    slug: "json-formatting-tips",
    title: "JSON 格式化与校验：开发者必备的 5 个技巧",
    desc: "掌握 JSON 美化、压缩、校验错误的实用技巧，用在线格式化工具快速定位接口异常，提升日常调试效率。",
    keywords: "json 格式化, json 校验, json 美化, 接口调试",
    tools: ["json-formatter.html"],
    posts: ["regex-for-beginners", "understanding-uuid"],
    blocks: [
      { tag: "p", text: "JSON 是前后端通信的事实标准，但压缩成一行的 JSON 极难阅读。格式化与校验是开发者每天都会用到的能力。" },
      { tag: "h2", text: "为什么需要格式化" },
      { tag: "p", text: "格式化（美化）通过缩进让层级一目了然，便于排查字段缺失、类型错误；压缩则在传输时减小体积。" },
      { tag: "h2", text: "5 个实用技巧" },
      { tag: "ul", text: "用 FreeToolset JSON 格式化工具一键美化/压缩\n利用实时校验定位语法错误所在行\n对比两份 JSON 找出差异\n格式化后端日志便于排查\n把常用结构保存为模板" },
      { tag: "h2", text: "常见错误" },
      { tag: "p", text: "最常见的是尾随逗号、键名用了单引号、或忘记给键名加双引号。格式化工具会直接高亮这些错误。" },
      { tag: "tip", text: "拿到接口返回先美化再读结构，是排查联调问题最快的第一步。" }
    ]
  },
  {
    slug: "create-strong-password",
    title: "如何生成强密码：从长度到熵值的完整指南",
    desc: "理解密码强度与熵值的关系，学会用随机密码生成器创建难以破解的凭据，并搭配强度检查器自查。",
    keywords: "强密码, 密码生成器, 密码强度, 账户安全",
    tools: ["password-generator.html", "password-strength-checker.html"],
    posts: ["understanding-uuid"],
    blocks: [
      { tag: "p", text: "弱密码是账号被盗的头号原因。一个强密码应当足够长、随机且难以被猜测或暴力破解。" },
      { tag: "h2", text: "密码强度由什么决定" },
      { tag: "p", text: "核心是「熵值」——可能的组合数。长度比复杂字符集更关键：12 位以上的随机密码通常就足够安全。" },
      { tag: "h2", text: "生成强密码的做法" },
      { tag: "ul", text: "长度至少 12–16 位\n混合大小写字母、数字与符号\n避免字典词、姓名、生日\n每个账户使用不同密码\n用密码管理器统一保存" },
      { tag: "h2", text: "用工具落地" },
      { tag: "p", text: "FreeToolset 密码生成器可在本地随机生成高强度密码，配合密码强度检查器评估破解时间，全程不上传。" },
      { tag: "tip", text: "别用「Pa$$w0rd」这类看似复杂实则常见的变形，它们早已在破解字典中。" }
    ]
  },
  {
    slug: "understanding-uuid",
    title: "UUID 是什么？v4 随机标识符的生成与应用",
    desc: "UUID 通用唯一标识符的原理、版本差异与典型应用场景，附在线批量生成 v4 的方法。",
    keywords: "uuid, uuid v4, 唯一标识符, guid",
    tools: ["uuid-generator.html"],
    posts: ["create-strong-password", "json-formatting-tips"],
    blocks: [
      { tag: "p", text: "UUID（Universally Unique Identifier）是分布式系统中生成唯一 ID 的标准方式，你几乎在每台服务器、每张数据库表里都见过它。" },
      { tag: "h2", text: "UUID 是什么" },
      { tag: "p", text: "UUID 是一个 128 位的标识符，标准文本形如 550e8400-e29b-41d4-a716-446655440000，由连字符分成五段。" },
      { tag: "h2", text: "为什么用 UUID v4" },
      { tag: "ul", text: "足够随机，碰撞概率极低\n不依赖中心服务，适合分布式系统\n比自增 ID 更难被遍历猜测\n便于合并多来源数据而不冲突" },
      { tag: "h2", text: "在线生成" },
      { tag: "p", text: "FreeToolset UUID 生成器可一次性批量生成最多 100 个 v4，本地即生成，适合测试与系统对接。" },
      { tag: "tip", text: "主键需要有序时，UUID v4 不是最佳选择；可考虑带时间戳前缀的变体。" }
    ]
  },
  {
    slug: "url-encoding-explained",
    title: "URL 编码原理：为什么网址里的中文会变成 %E4%...",
    desc: "讲清百分号编码（URL Encode）的作用与 encodeURI / encodeURIComponent 的区别，附在线编解码工具。",
    keywords: "url 编码, urlencode, 百分号编码, encodeuri",
    tools: ["url-encoder.html"],
    posts: ["what-is-base64", "regex-for-beginners"],
    blocks: [
      { tag: "p", text: "当你在地址栏看到 %E4%B8%AD 这样的字符，那就是 URL 编码（百分号编码）的功劳。它让中文和特殊符号能安全地出现在网址里。" },
      { tag: "h2", text: "为什么需要 URL 编码" },
      { tag: "p", text: "URL 只允许一部分 ASCII 字符。空格、中文、&、= 等字符会被误解，必须编码为 % 加两位十六进制。" },
      { tag: "h2", text: "encodeURI 与 encodeURIComponent" },
      { tag: "ul", text: "encodeURI 保留 ? # / 等结构字符，用于整条网址\nencodeURIComponent 编码得更彻底，用于单个参数值\n拼接查询字符串时应使用后者" },
      { tag: "h2", text: "在线编解码" },
      { tag: "p", text: "FreeToolset URL 编码工具同时支持两种方式互转，方便调试接口参数。" },
      { tag: "tip", text: "参数值里含有 & 时务必用 encodeURIComponent，否则会被当成新参数分隔符。" }
    ]
  },
  {
    slug: "unix-timestamp-guide",
    title: "Unix 时间戳转换完全指南：秒、毫秒与日期互转",
    desc: "理解 Unix 时间戳，掌握秒与毫秒的区别、UTC 与本地时间转换，用在线工具快速排查时区问题。",
    keywords: "时间戳, unix 时间戳, 时间转换, 时区",
    tools: ["timestamp-converter.html"],
    posts: ["number-base-conversion"],
    blocks: [
      { tag: "p", text: "Unix 时间戳是从 1970-01-01 起的秒数，被几乎所有系统用来记录时间。理解它，排查时区与日志问题就轻松了。" },
      { tag: "h2", text: "秒还是毫秒" },
      { tag: "p", text: "很多系统用秒（10 位），而 JavaScript 的 Date.now() 返回毫秒（13 位）。差 1000 倍，混淆会导致时间显示为 1970 年。" },
      { tag: "h2", text: "UTC 与本地时间" },
      { tag: "ul", text: "UTC 是世界协调时，不随时区变化\n本地时间 = UTC ± 时区偏移\n存储建议统一用 UTC，展示时再转换" },
      { tag: "h2", text: "在线转换" },
      { tag: "p", text: "FreeToolset 时间戳工具支持秒/毫秒互转，并显示 UTC 与本地时间，方便核对。" },
      { tag: "tip", text: "日志时间对不上时，先确认是秒还是毫秒，再看时区设置。" }
    ]
  },
  {
    slug: "regex-for-beginners",
    title: "正则表达式入门：30 分钟看懂匹配、分组与在线测试",
    desc: "从元字符到捕获组，正则表达式是文本处理的利器。本文带你入门并推荐在线实时测试工具。",
    keywords: "正则表达式, 正则入门, regex, 文本匹配",
    tools: ["regex-tester.html"],
    posts: ["json-formatting-tips", "url-encoding-explained"],
    blocks: [
      { tag: "p", text: "正则表达式（Regex）是用一行「模式」完成复杂文本匹配的工具，表单校验、日志提取都离不开它。" },
      { tag: "h2", text: "核心元字符" },
      { tag: "ul", text: "\\d 数字，\\w 单词字符，. 任意字符\n* 0 次以上，+ 1 次以上，? 0 或 1 次\n[] 字符集合，() 捕获分组\n^ 开头，$ 结尾" },
      { tag: "h2", text: "从例子学" },
      { tag: "p", text: "匹配邮箱可用 ^\\S+@\\S+\\.\\S+$，提取日期可用 \\d{4}-\\d{2}-\\d{2}。先写小例子，再逐步加条件。" },
      { tag: "h2", text: "边写边测" },
      { tag: "p", text: "FreeToolset 正则测试器可实时高亮匹配、展示捕获组，是上手正则的最佳练习场。" },
      { tag: "tip", text: "正则不要一次写太复杂，拆成小片段逐步验证，可读性与可维护性都更好。" }
    ]
  },
  {
    slug: "number-base-conversion",
    title: "进制转换详解：二进制、八进制、十进制与十六进制",
    desc: "搞懂计算机中的进制表示，掌握二/八/十/十六进制互转方法，附在线进制转换器。",
    keywords: "进制转换, 二进制, 十六进制, 十进制",
    tools: ["base-converter.html"],
    posts: ["unix-timestamp-guide"],
    blocks: [
      { tag: "p", text: "计算机用二进制思考，人类用十进制，而颜色与内存地址常用十六进制。进制转换是理解底层的基础功。" },
      { tag: "h2", text: "为什么有多种进制" },
      { tag: "ul", text: "二进制（0/1）是电路的自然语言\n八进制/十六进制是二进制的紧凑写法\n十进制是人类习惯\n十六进制常用于颜色值（#RRGGBB）与内存地址" },
      { tag: "h2", text: "互转思路" },
      { tag: "p", text: "十进制转其他进制用「除基取余」，其他进制转十进制用「按权展开求和」。掌握原理后，用工具批量转换更高效。" },
      { tag: "h2", text: "在线转换" },
      { tag: "p", text: "FreeToolset 进制转换器支持二/八/十/十六进制实时互转。" },
      { tag: "tip", text: "看到 #ff8800 这类颜色值时，试着拆成 RGB 三个十六进制字节，调色更直观。" }
    ]
  },
  {
    slug: "image-compression-guide",
    title: "图片压缩不损质：网页提速的实用方法",
    desc: "了解有损与无损压缩，学会用浏览器内图片压缩工具减小体积、提升加载速度，兼顾画质与隐私。",
    keywords: "图片压缩, 网页提速, 图片优化, image compressor",
    tools: ["image-compressor.html", "image-to-base64.html"],
    posts: ["qr-code-use-cases"],
    blocks: [
      { tag: "p", text: "图片往往是网页里最大的资源。合理压缩能在肉眼难辨的前提下显著加快加载，直接影响跳出率与 SEO。" },
      { tag: "h2", text: "有损 vs 无损" },
      { tag: "ul", text: "有损（如 JPEG/WebP）体积更小，适合照片\n无损（如 PNG）保留细节，适合图标/截图\nWebP 通常比 JPEG/PNG 更优" },
      { tag: "h2", text: "压缩实践" },
      { tag: "p", text: "用 FreeToolset 图片压缩工具在浏览器内直接压缩、缩放，无需上传服务器，保护隐私且即时出图。" },
      { tag: "h2", text: "几点建议" },
      { tag: "ul", text: "优先使用 WebP 格式\n按显示尺寸导出，别上传原图\n质量控制在 75–85 之间通常够用" },
      { tag: "tip", text: "把首屏图片控制在 100KB 内，移动端体验提升明显。" }
    ]
  },
  {
    slug: "qr-code-use-cases",
    title: "二维码生成的常见用途与最佳实践",
    desc: "二维码能承载网址、文本、WiFi 等信息，本文梳理 8 个实用场景并推荐本地生成工具。",
    keywords: "二维码, qr code, 二维码生成, 扫码",
    tools: ["qr-code-generator.html"],
    posts: ["image-compression-guide"],
    blocks: [
      { tag: "p", text: "二维码把信息变成一图，手机一扫即可读取。它早已超出支付场景，是低成本高效的连接入口。" },
      { tag: "h2", text: "二维码能存什么" },
      { tag: "ul", text: "网址链接\n纯文本 / WiFi 密码\n联系方式（vCard）\n短信 / 电话动作" },
      { tag: "h2", text: "8 个实用场景" },
      { tag: "ul", text: "名片二维码，扫码即存联系方式\n活动海报，引导关注公众号\n产品包装，跳转使用说明\n会议物料，快速连 WiFi\n电商包裹，追踪物流\n线下广告，导流到落地页\n电子票据，扫码核销\n教学资料，扫码获取资源" },
      { tag: "h2", text: "本地生成" },
      { tag: "p", text: "FreeToolset 二维码工具支持自定义尺寸、本地生成即时下载，素材不外传。" },
      { tag: "tip", text: "二维码容错率越高，越能在部分污损时仍被识别，重要场景建议提高容错。" }
    ]
  },
  {
    slug: "ai-product-description-conversion",
    title: "用 AI 写商品描述：提升详情页转化的实战方法",
    desc: "商品描述直接影响转化。本文教你用 AI 商品描述生成器批量产出卖点文案，并给出优化要点。",
    keywords: "ai 商品描述, 电商文案, 详情页转化, ai 写作",
    tools: ["ai-product-description.html", "ai-studio.html"],
    posts: ["seo-meta-tags-guide"],
    blocks: [
      { tag: "p", text: "电商详情页里，商品描述是转化的关键一环。好的描述讲清卖点、击中需求，而 AI 能帮你批量产出初稿。" },
      { tag: "h2", text: "好描述长什么样" },
      { tag: "ul", text: "开头一句话讲清是什么、解决什么问题\n用利益点（好处）而非参数罗列\n面向人群与场景清晰\n语言符合平台调性" },
      { tag: "h2", text: "用 AI 提效" },
      { tag: "p", text: "FreeToolset AI 商品描述生成器输入产品信息即可产出多版本文案，支持风格切换，适合淘宝、独立站与跨境店铺快速铺货。" },
      { tag: "h2", text: "优化要点" },
      { tag: "ul", text: "嵌入核心关键词利于搜索\n突出差异化与信任证据\n不同渠道微调语气" },
      { tag: "tip", text: "AI 产出的是高质量初稿，务必人工核对参数与合规表述后再上架。" }
    ]
  },
  {
    slug: "seo-meta-tags-guide",
    title: "SEO Meta 标签优化：标题与描述怎么写才被点",
    desc: "标题与描述是搜索结果的第一印象。本文讲解长度、关键词与吸引力写法，并推荐 AI 元数据生成器。",
    keywords: "seo meta, 标题优化, 描述优化, meta 标签",
    tools: ["ai-seo-meta-generator.html", "ai-studio.html"],
    posts: ["ai-product-description-conversion"],
    blocks: [
      { tag: "p", text: "搜索结果里用户最先看到的是标题与描述。写好 Meta 标签，能直接提升点击率（CTR），进而影响排名。" },
      { tag: "h2", text: "标题怎么写" },
      { tag: "ul", text: "长度控制在 50–60 字符，避免被截断\n前置核心关键词\n包含品牌名增强信任\n每页唯一，不堆砌" },
      { tag: "h2", text: "描述怎么写" },
      { tag: "p", text: "描述虽不直接影响排名，但决定用户是否点击。用 120–155 字符概括价值主张，加上行动号召。" },
      { tag: "h2", text: "用 AI 生成" },
      { tag: "p", text: "FreeToolset AI SEO 元数据生成器可批量产出符合长度与关键词要求的标题与描述，省时且更规范。" },
      { tag: "tip", text: "定期用 Search Console 看哪些页面展现高但点击低，优先重写它们的描述。" }
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
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title} | FreeToolset 教程</title>
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
      <p class="post-meta">FreeToolset · 实用教程</p>
      <h1>${p.title}</h1>
${renderBody(p.blocks)}
      <div class="related-posts">
        <h3>🔗 相关工具</h3>
${toolLinks}
        <h3>📚 相关文章</h3>
${postLinks}
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div>
        <div class="footer-brand"><span class="logo-icon">⚡</span> FreeToolset</div>
        <p class="footer-desc">免费在线工具，全部在浏览器本地运行，数据不上传。</p>
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
