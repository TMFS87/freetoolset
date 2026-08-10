/* bilingual-seo.js — 给全站工具页注入中英双语 title + meta description + WebApplication Schema。 */
const fs = require("fs");
const path = require("path");

const ZH = {
  "about": "关于我们",
  "contact": "联系我们",
  "privacy-policy": "隐私政策",
  "age-calculator": "年龄计算器",
  "ai-blog-writer": "AI博客写作器",
  "ai-content-rewriter": "AI内容改写器",
  "ai-email-subject": "AI邮件标题生成器",
  "ai-product-description": "AI产品描述生成器",
  "ai-seo-meta-generator": "AI SEO元标签生成器",
  "ai-studio": "AI内容工作室",
  "area-converter": "面积转换器",
  "base-converter": "进制转换器",
  "base64-encoder": "Base64编码解码器",
  "binary-text-converter": "文本二进制转换器",
  "bmi-calculator": "BMI计算器",
  "calorie-calculator": "卡路里计算器",
  "color-picker": "颜色选择器",
  "compound-interest-calculator": "复利计算器",
  "cron-expression-generator": "Cron表达式生成器",
  "css-minifier": "CSS压缩工具",
  "csv-to-json": "CSV转JSON工具",
  "data-storage-converter": "数据存储单位转换器",
  "date-difference-calculator": "日期差计算器",
  "dice-roller": "骰子模拟器",
  "discount-calculator": "折扣计算器",
  "fancy-text-generator": "花式文字生成器",
  "find-and-replace": "查找替换工具",
  "fuel-cost-calculator": "油费计算器",
  "gpa-calculator": "GPA计算器",
  "hash-generator": "哈希生成器",
  "html-encoder": "HTML编码解码器",
  "html-minifier": "HTML压缩工具",
  "http-status-codes": "HTTP状态码查询",
  "image-compressor": "图片压缩工具",
  "image-to-base64": "图片转Base64",
  "json-formatter": "JSON格式化工具",
  "json-minifier": "JSON压缩工具",
  "json-to-csv": "JSON转CSV",
  "jwt-decoder": "JWT解码器",
  "length-converter": "长度转换器",
  "line-tools": "行处理工具",
  "loan-calculator": "贷款计算器",
  "lorem-ipsum-generator": "Lorem Ipsum生成器",
  "markdown-to-html": "Markdown转HTML",
  "morse-code-translator": "摩斯密码翻译器",
  "mortgage-calculator": "房贷计算器",
  "number-to-words": "数字转英文",
  "password-generator": "密码生成器",
  "password-strength-checker": "密码强度检测",
  "percentage-calculator": "百分比计算器",
  "port-lookup": "端口查询",
  "qr-code-generator": "二维码生成器",
  "random-number-generator": "随机数生成器",
  "regex-tester": "正则表达式测试器",
  "remove-line-breaks": "去除换行符",
  "reverse-text": "文字翻转工具",
  "roi-calculator": "投资回报率计算器",
  "roman-numeral-converter": "罗马数字转换器",
  "salary-calculator": "工资计算器",
  "sales-tax-calculator": "销售税计算器",
  "slug-generator": "URL别名生成器",
  "speed-converter": "速度转换器",
  "stopwatch": "在线秒表",
  "temperature-converter": "温度转换器",
  "text-case-converter": "文字大小写转换",
  "text-repeater": "文字重复工具",
  "text-to-speech": "文字转语音",
  "time-unit-converter": "时间单位转换器",
  "timer": "倒计时器",
  "timestamp-converter": "时间戳转换器",
  "tip-calculator": "小费计算器",
  "unit-converter": "单位转换器",
  "url-encoder": "URL编码解码器",
  "uuid-generator": "UUID生成器",
  "volume-converter": "体积转换器",
  "weight-converter": "重量转换器",
  "whitespace-remover": "空白字符清除器",
  "word-counter": "字数统计工具"
};

const EXCLUDE_DIRS = new Set([".vercel", ".git", "node_modules", "_promote_backup", ".workbuddy", "blog"]);
const NO_SCHEMA = new Set(["index", "about", "contact", "privacy-policy"]);

function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (EXCLUDE_DIRS.has(e.name)) continue; walk(full, cb); }
    else if (e.isFile() && e.name.endsWith(".html") && e.name !== "_cards.html") cb(full);
  }
}

function enMain(title) {
  let base = title.split("|")[0].trim();
  base = base.split(/ — | - /)[0].trim();
  return base;
}

let missing = [];
walk(".", (file) => {
  let html = fs.readFileSync(file, "utf8");
  const tm = html.match(/<title>([^<]*)<\/title>/);
  if (!tm) return;
  const slug = path.basename(file, ".html");
  const zh = ZH[slug];
  if (!zh) { missing.push(slug); return; }
  const en = enMain(tm[1]);

  // 1) title 双语
  const newTitle = slug === "index"
    ? "FreeToolset · 95+个免费在线工具 | AI写作,计算器"
    : `${en} · ${zh} | FreeToolset`;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${newTitle}</title>`);

  // 2) description 双语（NO_SCHEMA 页面保留原 description）
  if (!NO_SCHEMA.has(slug)) {
    const desc = `${zh}（${en}）：免费在线工具，无需注册下载，浏览器本地运行，数据不上传，保护隐私。`;
    const eol = html.includes("\r\n") ? "\r\n" : "\n";
    if (/<meta name=["']description["'][^>]*>/i.test(html)) {
      html = html.replace(/<meta name=["']description["'][^>]*>/i, `<meta name="description" content="${desc}">`);
    } else {
      html = html.replace(/(<\/title>)/i, `$1${eol}  <meta name="description" content="${desc}">`);
    }
  }

  // 3) WebApplication Schema（工具页）
  if (!NO_SCHEMA.has(slug) && !html.includes("WebApplication")) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": en,
      "alternateName": zh,
      "url": "https://www.freetoolset.app/" + slug + ".html",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": `${zh}（${en}）免费在线工具，无需注册，本地运行保护隐私。`
    };
    const eol = html.includes("\r\n") ? "\r\n" : "\n";
    html = html.replace(/<\/head>/i, `  <script type="application/ld+json">${eol}${JSON.stringify(schema, null, 2)}${eol}</script>${eol}</head>`);
  }

  fs.writeFileSync(file, html, "utf8");
  console.log("updated", slug);
});

if (missing.length) console.log("MISSING ZH:", missing.join(", "));
