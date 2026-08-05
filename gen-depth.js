/**
 * FreeToolset tool-page depth injector (idempotent).
 * Adds a "📖 深入了解" section (why / principle / example / myths) to each
 * tool page, complementing the sidebar How-to/FAQ/Use Cases. Uses category
 * templates + per-tool use cases for uniqueness. Guarded by <!-- ft-deep -->.
 */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const T = require("./tools-data.js");

// Category templates. {n} = tool title.
const CAT = {
  calculator: {
    principle: n => `${n} 把若干输入代入固定的数学公式，实时算出结果。相比手算或临时搭表格，在线工具省去记忆公式与处理单位的麻烦，输入即出，还能反向推导。`,
    example: n => `例如使用 ${n} 时，把关键参数填入对应框，结果会即时更新；试着调整任一输入，就能直观看到输出如何变化，方便做「如果…会怎样」的推演。`,
    myths: ["只看单一结果、忽略适用条件与前提假设", "把估算值当精确结论直接使用", "忽略单位差异（公制/英制）导致量级错误"],
    why: ["快速得到准确结果，省去手算", "在购物、理财、健康场景做即时决策", "支持反向推导，探索不同输入的影响"]
  },
  converter: {
    principle: n => `${n} 基于单位间的固定换算系数做线性映射，输入一个值即得其他单位的等价量。要注意十进制与二进制系数不同（如存储单位），以及公制与英制的差异。`,
    example: n => `例如把 1 个常用单位输入 ${n}，立刻看到其他单位的等价量；切换公制/英制时数值自动重算，无需手算系数。`,
    myths: ["混淆十进制与二进制单位（如 KB 与 KiB）", "忽略英制与公制的换算系数", "把近似换算当作精确值使用"],
    why: ["跨制式沟通不再卡壳", "烹饪、装修、学习时即时换算", "避免记错系数导致的错误"]
  },
  text: {
    principle: n => `${n} 在浏览器内对字符串做变换（反转、替换、清理、转换等），纯前端处理，文本不会离开你的设备，适合处理含隐私的文档。`,
    example: n => `例如把一段带乱换行或多余空格的文字粘进 ${n}，点一下就能得到干净版本，再复制回原处即可。`,
    myths: ["处理敏感文档时用了需要上传的在线工具", "没注意大小写或正则导致误替换", "清理空白时破坏了原有的段落结构"],
    why: ["把重复的文本操作自动化", "清洗从别处复制来的杂乱文字", "批量改词改格式省时间"]
  },
  developer: {
    principle: n => `${n} 面向开发调试场景，在本地完成格式转换、压缩或解码，不把令牌、代码等敏感内容传到第三方服务器。`,
    example: n => `例如把一段 JWT 或 CSV 粘进 ${n}，本地立即解析或转换，结果可直接复制使用，敏感数据全程不出浏览器。`,
    myths: ["把 JWT 等可解码内容误当加密", "压缩后未保留可读源码，出问题难排查", "用了需要上传的在线工具处理密钥/令牌"],
    why: ["调试与格式转换无需安装环境", "本地处理敏感数据更安全", "把繁琐脚本变成一键操作"]
  },
  fun: {
    principle: n => `${n} 属于轻量趣味或效率工具，在浏览器本地生成随机结果或计时，无需安装，关掉页面不留痕。`,
    example: n => `例如设定好范围或时长后一键启动 ${n}，过程全在本地完成，适合做决定、控场或放松。`,
    myths: ["把伪随机当真随机用于高安全场景", "后台计时被浏览器节流导致不够准", "用趣味结果做严肃决策时缺乏随机性保证"],
    why: ["轻量趣味/效率，无需安装", "本地随机与计时，即开即用", "保护隐私，关掉不留痕"]
  }
};

// Original 25 tools (non-AI) → category. AI pages excluded (different template).
const OLD = {
  "base64-encoder.html": "developer",
  "json-formatter.html": "developer",
  "password-generator.html": "fun",
  "password-strength-checker.html": "fun",
  "uuid-generator.html": "developer",
  "url-encoder.html": "developer",
  "timestamp-converter.html": "converter",
  "regex-tester.html": "developer",
  "base-converter.html": "converter",
  "image-compressor.html": "fun",
  "image-to-base64.html": "fun",
  "qr-code-generator.html": "fun",
  "word-counter.html": "text",
  "lorem-ipsum-generator.html": "text",
  "text-case-converter.html": "text",
  "color-picker.html": "fun",
  "hash-generator.html": "developer",
  "line-tools.html": "text",
  "port-lookup.html": "developer"
};

function titleOf(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/[—\-|]\s*FreeToolset[\s\S]*$/i, "").replace(/\s*\|?\s*FreeToolset.*$/i, "").trim() : "";
}
function descOf(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  return m ? m[1] : "";
}

// Build the per-tool job list
const jobs = [];
T.forEach(t => {
  jobs.push({
    file: t.slug + ".html",
    name: t.title,
    category: t.category,
    why: (t.usecases || []).map(u => u.title)
  });
});
Object.keys(OLD).forEach(f => {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) return;
  const html = fs.readFileSync(fp, "utf8");
  jobs.push({
    file: f,
    name: titleOf(html) || f,
    category: OLD[f],
    why: null,
    desc: descOf(html)
  });
});

function buildSection(j) {
  const c = CAT[j.category] || CAT.fun;
  const whyItems = (j.why && j.why.length ? j.why : c.why).map(i => "      <li>" + i + "</li>").join("\n");
  const mythItems = c.myths.map(i => "      <li>" + i + "</li>").join("\n");
  return (
    "  <!-- ft-deep -->\n" +
    '  <section class="tool-deep">\n' +
    "    <h2>📖 深入了解 " + j.name + "</h2>\n" +
    "    <h2>为什么需要它</h2>\n" +
    "    <ul>\n" + whyItems + "\n    </ul>\n" +
    "    <h2>背后的原理</h2>\n" +
    "    <p>" + c.principle(j.name) + "</p>\n" +
    "    <h2>一个例子</h2>\n" +
    "    <p>" + c.example(j.name) + "</p>\n" +
    "    <h2>常见误区</h2>\n" +
    "    <ul>\n" + mythItems + "\n    </ul>\n" +
    "  </section>\n"
  );
}

let changed = 0, skipped = 0, noanchor = 0;
jobs.forEach(j => {
  const fp = path.join(ROOT, j.file);
  if (!fs.existsSync(fp)) { console.log("SKIP missing:", j.file); return; }
  let html = fs.readFileSync(fp, "utf8");
  if (html.includes("<!-- ft-deep -->")) { skipped++; return; }
  const anchor = '<nav class="breadcrumb">';
  const idx = html.indexOf(anchor);
  if (idx === -1) { noanchor++; console.log("NO ANCHOR:", j.file); return; }
  const sec = buildSection(j);
  html = html.replace(anchor, sec + "    " + anchor);
  fs.writeFileSync(fp, html, "utf8");
  changed++;
});
console.log("\nDepth section: changed=" + changed + " skipped=" + skipped + " no-anchor=" + noanchor + " / total=" + jobs.length);
