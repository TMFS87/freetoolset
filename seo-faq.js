// seo-faq.js — 给所有工具页注入中文 FAQ 区块 + FAQPage 结构化数据
// 解决中文搜索 0 点击问题：现有 FAQ 是纯英文，加中文 FAQ 后搜索结果可展开中文问答，提升 CTR
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const EXCLUDE = new Set([
  "_cards.html", "index.html", "about.html", "contact.html", "privacy-policy.html",
  "404.html", "ai-studio.html",
  "baidu_verify_codeva-OivAbYsb29.html", "baidu_verify_codeva-cLcTPo9dNf.html",
  "googleaa6e10b4cdc3dee6.html"
]);

// 已部署的百度验证/Google 验证文件不要动
function isVerifyFile(f) { return f.startsWith("baidu_verify") || f.startsWith("google"); }

// 20 个高流量工具的定制中文 FAQ
const CUSTOM_FAQ = {
  "bmi-calculator.html": [
    ["BMI 多少算正常？", "成年人的健康 BMI 范围通常是 18.5–24.9。低于 18.5 为偏瘦，25–29.9 为超重，30 及以上为肥胖。本工具会直接给出分级，但仅作健康参考，不作为医学诊断。"],
    ["为什么健身的人 BMI 偏高？", "BMI 不区分肌肉和脂肪。肌肉量高的人（如运动员）体重更大，BMI 可能显示「超重」但实际很健康。建议结合体脂率一起看。"],
    ["儿童可以用这个 BMI 计算器吗？", "本工具使用成人公式，适合 20 岁以上人群。儿童青少年应使用按年龄、性别分级的 BMI 百分位图表（儿科标准）。"]
  ],
  "calorie-calculator.html": [
    ["卡路里计算器怎么估算每日消耗？", "先按身高、体重、年龄、性别算出基础代谢率（BMR），再乘以你的活动系数，得到每天总消耗（TDEE）。"],
    ["想减肥每天吃多少卡路里？", "在 TDEE 基础上每天减少 300–500 大卡，可形成温和的热量缺口，约每周减 0.3–0.5 公斤，比较健康可持续。"],
    ["计算结果准确吗？", "基于 Mifflin-St Jeor 等国际通用公式，对普通人较准；个体代谢有差异，结果作为参考而非绝对标准。"]
  ],
  "compound-interest-calculator.html": [
    ["复利到底怎么算？", "公式是 本金 ×(1 + 年化利率)^期数。利息会加入本金继续生息，也就是「利滚利」，时间越长增长越明显。"],
    ["每月定投也能算复利吗？", "可以。本工具支持在初始本金之外，设置每月/每年定期追加金额，模拟真实定投的复利增长曲线。"],
    ["年化收益定多少合适？", "历史长期数据看，美股宽基指数年化约 7%–10%（已扣通胀前）。请把它当作参考区间，投资有风险。"]
  ],
  "discount-calculator.html": [
    ["打折后多少钱怎么算？", "用原价 ×(1 − 折扣率) 即可。例如 8 折就是原价 ×0.8。本工具直接输入原价和折扣率就出结果。"],
    ["满减和打折哪个更划算？", "分别算一遍再比较最稳妥。满减通常有门槛（如满 200 减 30），打折无门槛，小额订单打折往往更优。"],
    ["结果包含税费吗？", "本工具计算的是折扣后的商品价格，不含税、不含运费，税费请另外估算。"]
  ],
  "age-calculator.html": [
    ["年龄能精确到天吗？", "可以。输入出生日期，工具会算出距今的多少年、多少个月、多少天，精确到天。"],
    ["算的是周岁还是虚岁？", "默认给出国际通用的周岁（精确到日）。虚岁按传统习俗通常在周岁基础上加 1，可自行换算。"],
    ["能算很久以前的日期吗？", "可以，支持任意历史日期，甚至百年前的出生日期也能准确计算。"]
  ],
  "json-formatter.html": [
    ["JSON 格式化会泄露我的数据吗？", "不会。所有解析和格式化都在你的浏览器本地完成，数据不上传到任何服务器，私密安全。"],
    ["支持多大的 JSON 文件？", "在浏览器内存范围内都可处理，常见几 MB 的文件毫无压力；超大文件可能受设备内存限制。"],
    ["能帮我找出语法错误吗？", "能。当 JSON 格式不合法时，会提示大致的错误位置，方便你快速修正。"]
  ],
  "base64-encoder.html": [
    ["Base64 是加密吗？", "不是。Base64 只是一种编码方式，任何人都能解码还原，千万不要把它当加密来保护密码或敏感信息。"],
    ["处理过程会上传数据吗？", "不会。编码/解码全部在浏览器本地进行，内容不上传，适合处理含敏感信息的文本。"],
    ["中文能 Base64 编码吗？", "可以。工具会按 UTF-8 正确处理中文等非英文字符，不会出现乱码。"]
  ],
  "password-generator.html": [
    ["生成的密码安全吗？", "安全。使用浏览器内置的密码学随机数生成器（crypto），随机性高，难以被猜解或暴力破解。"],
    ["密码会被保存吗？", "不会。密码只在你本机生成并显示，不存储、不上传，关闭页面即消失，请自行妥善保存。"],
    ["密码多长比较安全？", "重要账户建议 16 位以上，并同时包含大小写字母、数字和符号，可显著提升抗破解能力。"]
  ],
  "qr-code-generator.html": [
    ["生成的二维码能用吗？", "能。采用标准 QR 码规范，手机微信、相机等扫码工具都能识别。"],
    ["二维码能存多少内容？", "可存放网址、文本、联系方式等。内容越长，二维码的点阵越密，建议控制在合理长度内以便扫描。"],
    ["这个工具收费吗？", "完全免费，在浏览器本地生成，可一键下载为 PNG 图片使用。"]
  ],
  "word-counter.html": [
    ["字数统计准吗？", "准。会分别统计字符数、词数、段落数，中英文按各自规则计数，还能量化空格和标点。"],
    ["我的文章会被上传吗？", "不会。所有统计在浏览器本地完成，长文也不会离开你的设备。"],
    ["能估算阅读时间吗？", "可以。按平均阅读速度（约 200–300 字/分钟）估算，方便你控制篇幅。"]
  ],
  "uuid-generator.html": [
    ["UUID 会重复吗？", "本工具生成的是 v4 随机 UUID，组合数极大，实际重复的概率可以忽略不计。"],
    ["生成过程会上传数据吗？", "不会。UUID 在你的浏览器本地随机生成，不上传任何信息。"],
    ["UUID 一般用来做什么？", "常作数据库主键、分布式系统请求 ID、会话标识、文件名等需要全局唯一标识的场景。"]
  ],
  "timestamp-converter.html": [
    ["时间戳是什么？", "通常指 Unix 时间戳，是从 1970-01-01 00:00:00 UTC 起经过的秒数（或毫秒数）。"],
    ["时区怎么处理？", "时间戳本身是时区无关的；本工具可在 UTC 和你的本地时间之间双向转换。"],
    ["转换需要联网吗？", "不需要。时间换算完全在浏览器本地进行。"]
  ],
  "percentage-calculator.html": [
    ["百分比怎么算？", "基本公式：部分 ÷ 整体 × 100%。例如 20 占 80 就是 25%。"],
    ["增长百分比怎么算？", "用 (新值 − 旧值) ÷ 旧值 × 100%。结果为正表示上涨，为负表示下降。"],
    ["这个工具免费吗？", "免费，在浏览器本地计算，无需注册。"]
  ],
  "unit-converter.html": [
    ["支持哪些单位换算？", "支持长度、重量、温度、体积、面积、速度等多类常用单位之间的互相转换。"],
    ["换算结果准确吗？", "采用国际标准的换算系数，结果准确可靠。"],
    ["这个工具收费吗？", "完全免费，打开即用，无需注册登录。"]
  ],
  "roman-numeral-converter.html": [
    ["罗马数字支持多大范围？", "通常支持 1–3999。这是经典罗马数字的标准范围，更大数字需特殊符号表达。"],
    ["阿拉伯数字怎么转罗马数字？", "按 I/V/X/L/C/D/M 的累加与「减法规则」（如 IV=4）逐级转换，工具会自动完成。"],
    ["这个工具免费吗？", "免费，浏览器本地转换，无需注册。"]
  ],
  "ai-blog-writer.html": [
    ["AI 写博客免费吗？", "免费。每天有 5 次免费额度，GLM 模型每次消耗 0.5 额度、DeepSeek 每次 1 额度，额度用完可到 AI Studio 获取更多。"],
    ["生成的文章可以商用吗？", "可以。工具生成的内容归你所有，可用于博客、公众号、营销等任何用途。"],
    ["支持中文写作吗？", "支持。可输入中文主题，生成中文或中英双语文章，也能指定语气和长度。"]
  ],
  "ai-product-description.html": [
    ["AI 写产品描述免费吗？", "免费。每天 5 次免费额度，GLM 每次 0.5、DeepSeek 每次 1，用完可到 AI Studio 续。"],
    ["生成的描述能商用吗？", "能。内容归你所有，可直接用于淘宝、亚马逊、独立站等电商场景。"],
    ["适合哪些平台？", "适用于淘宝、京东、亚马逊、Shopify 独立站、小红书店铺等多平台商品文案。"]
  ],
  "ai-seo-meta-generator.html": [
    ["AI 生成 meta 免费吗？", "免费。每天 5 次额度，GLM 每次 0.5、DeepSeek 每次 1，用完可在 AI Studio 补充。"],
    ["会生成哪些内容？", "一次性生成 SEO 标题（title）、描述（description）和关键词（keywords），符合主流搜索引擎的长度建议。"],
    ["生成的标题长度合规吗？", "会参考 Google 建议（标题约 60 字符内、描述约 155 字符内）生成，减少被截断的概率。"]
  ],
  "ai-content-rewriter.html": [
    ["AI 改写免费吗？", "免费。每天 5 次额度，GLM 每次 0.5、DeepSeek 每次 1，额度用尽可到 AI Studio 获取。"],
    ["改写会偏离原意吗？", "不会。改写以「保持原意、换种表达」为原则，适合降重、润色和本地化，你可自行微调。"],
    ["改写内容能商用吗？", "可以。生成结果归你所有，可用于文章、文案等商业场景。"]
  ],
  "ai-email-subject.html": [
    ["AI 写邮件标题免费吗？", "免费。每天 5 次额度，GLM 每次 0.5、DeepSeek 每次 1，用完可到 AI Studio 续。"],
    ["一次能生成几个标题？", "会给出多个不同风格的备选标题（如专业、吸引点击、紧迫感），你挑最合适的用。"],
    ["生成内容能商用吗？", "能。标题归你所有，可直接用于邮件营销、EDM 等。"]
  ]
};

// 类别模板（用于 20 个定制之外的页面）
function tpl(category, cn, en) {
  if (category === "ai") {
    return [
      [cn + "免费吗？", "免费。每天提供 5 次免费额度，GLM 模型每次消耗 0.5 额度、DeepSeek 每次 1 额度，用完可到 AI Studio 获取更多。"],
      ["生成的内容可以商用吗？", "可以。由工具生成的内容归你所有，可用于商业用途，无需额外授权。"],
      ["支持中文吗？", "支持。可输入中文主题或素材，生成中文或中英双语结果，也能指定语气与风格。"]
    ];
  }
  if (category === "calculator") {
    return [
      [cn + "是免费的吗？", "是的，" + cn + "（" + en + "）完全免费，无需注册，打开网页即可使用，计算全部在你的浏览器本地完成，数据不上传。"],
      [cn + "支持哪些单位或格式？", "支持公制与英制等多种单位/格式切换，输入即时出结果，适合日常、财务、健康等多种场景。"],
      ["计算结果准确吗？", "基于标准公式实时计算，结果可靠；建议作为参考，重要决策请咨询专业人士。"]
    ];
  }
  if (category === "converter") {
    return [
      [cn + "是免费的吗？", "是的，" + cn + "（" + en + "）免费使用，无需注册，转换在你的浏览器本地完成，数据不上传。"],
      [cn + "支持哪些格式或单位？", "支持常见格式与单位之间的互相转换，输入即转换，操作简单。"],
      ["转换会泄露我的数据吗？", "不会。所有处理都在本地浏览器进行，内容不上传任何服务器。"]
    ];
  }
  if (category === "fun") {
    return [
      [cn + "免费吗？", "完全免费，打开网页即可使用，无需注册。"],
      ["怎么用？", "按页面提示操作即可，结果实时显示，可复制或重来。"],
      ["数据会上传吗？", "不会。所有计算在你本地浏览器完成，保护隐私。"]
    ];
  }
  // text / developer 类默认
  return [
    [cn + "需要联网吗？", "不需要。所有处理都在你的浏览器本地完成，数据不上传服务器，离线也能用。"],
    [cn + "支持大文件或批量吗？", "在浏览器性能范围内支持较大内容处理；具体上限取决于你的设备内存。"],
    [cn + "是免费的吗？", "是的，完全免费，无需注册，打开即用。"]
  ];
}

function blogTpl(cn) {
  return [
    ["这篇《" + cn + "》主要讲什么？", "本文系统讲解「" + cn + "」的核心方法与实操要点，并推荐配套的 FreeToolset 免费在线工具，帮助你在浏览器里快速完成，无需注册、数据本地处理。"],
    ["在哪里可以实操练习？", "文末「相关工具」列出了 FreeToolset 上对应的免费在线工具，打开即用，所有计算都在本地浏览器完成，保护隐私。"],
    ["这些工具要收费吗？", "FreeToolset 的全部工具均免费，在浏览器本地运行、不上传数据，可放心用于学习与工作。"]
  ];
}

function categoryOf(file) {
  if (file.startsWith("ai-")) return "ai";
  if (file.includes("calculator")) return "calculator";
  if (file.includes("converter") || file.includes("-to-")) return "converter";
  if (["dice-roller.html", "stopwatch.html", "timer.html", "random-number-generator.html",
       "fancy-text-generator.html", "lorem-ipsum-generator.html", "morse-code-translator.html",
       "text-repeater.html", "reverse-text.html"].includes(file)) return "fun";
  return "text";
}

function detectEol(s) { return s.includes("\r\n") ? "\r\n" : "\n"; }

let done = 0, skipped = 0;
const files = fs.readdirSync(ROOT).filter(f => f.endsWith(".html") && !EXCLUDE.has(f) && !isVerifyFile(f));
for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, "utf8");
  if (html.includes("<!-- ft-zh-faq -->")) { skipped++; continue; }

  const m = html.match(/<title>([^<]*)<\/title>/);
  if (!m) { skipped++; continue; }
  const title = m[1];
  const cn = (title.split("·")[1] || "").split("|")[0].trim() || title.split("|")[0].trim();
  const en = (title.split("·")[0] || title).split("|")[0].trim();

  const faqs = CUSTOM_FAQ[f] || tpl(categoryOf(f), cn, en);
  const eol = detectEol(html);

  // 中文 FAQ HTML
  const faqHtml = [
    '          <!-- ft-zh-faq -->',
    '          <details class="faq-item">',
    '            <summary>' + faqs[0][0] + '</summary>',
    '            <p>' + faqs[0][1] + '</p>',
    '          </details>',
    '          <details class="faq-item">',
    '            <summary>' + faqs[1][0] + '</summary>',
    '            <p>' + faqs[1][1] + '</p>',
    '          </details>',
    '          <details class="faq-item">',
    '            <summary>' + faqs[2][0] + '</summary>',
    '            <p>' + faqs[2][1] + '</p>',
    '          </details>'
  ].join(eol);

  // 注入到 FAQ info-section 结束前（FAQ section 内无 div，第一个 </div> 即 section 结束）
  const faqRe = /(<h2>❓ FAQ<\/h2>[\s\S]*?)(<\/div>)/;
  if (!faqRe.test(html)) { skipped++; continue; }
  html = html.replace(faqRe, "$1" + eol + faqHtml + eol + "$2");

  // FAQPage schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(([q, a]) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };
  const schemaHtml = '  <!-- ft-faq-schema -->\n  <script type="application/ld+json">\n' +
    JSON.stringify(schema, null, 2) + "\n  </script>";
  html = html.replace(/(<\/head>)/, schemaHtml + "\n$1");

  fs.writeFileSync(fp, html, "utf8");
  done++;
}

// 博客页：无 FAQ section，直接在 </article> 前插入中文 FAQ section
const blogDir = path.join(ROOT, "blog");
if (fs.existsSync(blogDir)) {
  const bfiles = fs.readdirSync(blogDir).filter(f => f.endsWith(".html"));
  for (const f of bfiles) {
    const fp = path.join(blogDir, f);
    let html = fs.readFileSync(fp, "utf8");
    if (html.includes("<!-- ft-zh-faq -->")) continue;
    const m = html.match(/<title>([^<]*)<\/title>/);
    if (!m) continue;
    const title = m[1];
    const cn = (title.split("·")[1] || title).split("|")[0].trim();
    const faqs = blogTpl(cn);
    const eol = detectEol(html);
    const faqHtml = [
      '      <!-- ft-zh-faq -->',
      '      <section class="info-section" style="margin-top:32px">',
      '        <h2>❓ 常见问题</h2>',
      '        <details class="faq-item">',
      '          <summary>' + faqs[0][0] + '</summary>',
      '          <p>' + faqs[0][1] + '</p>',
      '        </details>',
      '        <details class="faq-item">',
      '          <summary>' + faqs[1][0] + '</summary>',
      '          <p>' + faqs[1][1] + '</p>',
      '        </details>',
      '        <details class="faq-item">',
      '          <summary>' + faqs[2][0] + '</summary>',
      '          <p>' + faqs[2][1] + '</p>',
      '        </details>',
      '      </section>'
    ].join(eol);
    if (!html.includes("</article>")) continue;
    html = html.replace(/(<\/article>)/, faqHtml + eol + "$1");
    const schema = {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": faqs.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
    };
    const schemaHtml = '  <!-- ft-faq-schema -->\n  <script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + "\n  </script>";
    html = html.replace(/(<\/head>)/, schemaHtml + "\n$1");
    fs.writeFileSync(fp, html, "utf8");
    done++;
  }
}

console.log("中文 FAQ 注入完成：新增 " + done + " 页，跳过 " + skipped + " 页");
