'use strict';
// Batch-inject a long-tail Chinese explainer paragraph into every tool page.
// Long-tail keyword = "免费在线{中文名}". Content is built from each page's
// unique tool-intro Chinese description so pages stay distinct (not templated spam).
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Administrator/freetoolset';

// slug -> Chinese name (single source of truth)
const DATA = {
  'age-calculator': '年龄计算器',
  'ai-blog-writer': 'AI 博客写作工具',
  'ai-content-rewriter': 'AI 内容改写工具',
  'ai-email-subject': 'AI 邮件标题生成器',
  'ai-product-description': 'AI 产品描述生成器',
  'ai-seo-meta-generator': 'AI SEO 元标签生成器',
  'area-converter': '面积单位转换器',
  'base-converter': '进制转换器',
  'base64-encoder': 'Base64 编解码工具',
  'binary-text-converter': '二进制文本转换器',
  'bmi-calculator': 'BMI 计算器',
  'body-fat-calculator': '体脂率计算器',
  'break-even-calculator': '盈亏平衡计算器',
  'calorie-calculator': '卡路里计算器',
  'chinese-converter': '简繁转换工具',
  'coin-flip': '抛硬币工具',
  'color-converter': '颜色转换器',
  'color-picker': '在线取色器',
  'compound-interest-calculator': '复利计算器',
  'cron-expression-generator': 'Cron 表达式生成器',
  'css-formatter': 'CSS 格式化工具',
  'css-minifier': 'CSS 压缩工具',
  'csv-to-json': 'CSV 转 JSON 工具',
  'data-storage-converter': '数据存储单位转换器',
  'date-difference-calculator': '日期差计算器',
  'dice-roller': '在线掷骰子',
  'discount-calculator': '折扣计算器',
  'duplicate-line-remover': '删除重复行工具',
  'fancy-text-generator': '花式文字生成器',
  'find-and-replace': '查找替换工具',
  'fuel-cost-calculator': '油耗成本计算器',
  'gpa-calculator': 'GPA 计算器',
  'grade-calculator': '成绩计算器',
  'hash-generator': '哈希生成器',
  'html-encoder': 'HTML 实体编码工具',
  'html-minifier': 'HTML 压缩工具',
  'http-status-codes': 'HTTP 状态码查询',
  'image-compressor': '在线图片压缩',
  'image-to-base64': '图片转 Base64 工具',
  'json-formatter': 'JSON 格式化工具',
  'json-minifier': 'JSON 压缩工具',
  'json-to-csv': 'JSON 转 CSV 工具',
  'json-validator': 'JSON 校验工具',
  'jwt-decoder': 'JWT 解码器',
  'length-converter': '长度转换器',
  'line-tools': '行处理工具',
  'loan-calculator': '贷款计算器',
  'lorem-ipsum-generator': 'Lorem Ipsum 生成器',
  'markdown-to-html': 'Markdown 转 HTML 工具',
  'morse-code-translator': '摩斯密码翻译器',
  'mortgage-calculator': '房贷计算器',
  'number-to-words': '数字转文字工具',
  'password-generator': '密码生成器',
  'password-strength-checker': '密码强度检测',
  'percentage-calculator': '百分比计算器',
  'port-lookup': '端口查询工具',
  'qr-code-generator': '二维码生成器',
  'random-name-picker': '随机取名工具',
  'random-number-generator': '随机数生成器',
  'random-team-generator': '随机分组工具',
  'regex-tester': '正则表达式测试工具',
  'remove-line-breaks': '去除换行工具',
  'reverse-text': '文字反转工具',
  'roi-calculator': '投资回报率计算器',
  'roman-numeral-converter': '罗马数字转换器',
  'salary-calculator': '工资计算器',
  'sales-tax-calculator': '销售税计算器',
  'slug-generator': 'Slug 生成器',
  'speed-converter': '速度转换器',
  'sql-formatter': 'SQL 格式化工具',
  'stopwatch': '在线秒表',
  'temperature-converter': '温度转换器',
  'text-case-converter': '大小写转换工具',
  'text-diff-checker': '文本对比工具',
  'text-repeater': '文字重复工具',
  'text-sorter': '文本排序工具',
  'text-to-speech': '文字转语音工具',
  'time-unit-converter': '时间单位转换器',
  'timer': '在线计时器',
  'timestamp-converter': '时间戳转换工具',
  'tip-calculator': '小费计算器',
  'unit-converter': '单位转换器',
  'url-encoder': 'URL 编码工具',
  'url-parser': 'URL 解析工具',
  'uuid-generator': 'UUID 生成器',
  'vat-calculator': '增值税计算器',
  'volume-converter': '体积转换器',
  'water-intake-calculator': '饮水量计算器',
  'weight-converter': '重量转换器',
  'whitespace-remover': '空白字符清理工具',
  'word-counter': '字数统计工具',
  'word-frequency-counter': '词频统计工具',
  'xml-formatter': 'XML 格式化工具',
  'yaml-to-json': 'YAML 转 JSON 工具'
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function readIntro(html) {
  const m = html.match(/<section class="tool-intro">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (!m) return '';
  return m[1].replace(/\s+/g, ' ').trim();
}

function makePara(cn, intro) {
  let base = intro || `这款${cn}可以帮你快速完成相关任务`;
  base = base.replace(/[。.\s]+$/, '').replace(/[。]$/, '');
  const tail = `免费在线${cn}`;
  return `正在寻找${tail}？${base}。本工具完全免费、无需注册，所有计算都在你的浏览器本地完成，数据不会上传到任何服务器，打开网页即可随时使用。`;
}

let done = 0, skipped = 0, missing = 0, nomain = 0, nointro = 0;

for (const slug of Object.keys(DATA)) {
  const cn = DATA[slug];
  const file = path.join(DIR, slug + '.html');
  if (!fs.existsSync(file)) { console.log('MISSING', slug); missing++; continue; }
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('longtail-note')) { skipped++; continue; }

  const intro = readIntro(html);
  if (!intro) nointro++;
  const para = makePara(cn, intro);
  const paraEsc = esc(para);

  let injected = false;

  // Case A: page already has a tool-deep section -> append inside it
  const tdMatch = html.match(/<section class="tool-deep">[\s\S]*?<\/section>/);
  if (tdMatch) {
    const block = tdMatch[0];
    const note = `\n\n    <h3 class="longtail-note">关于免费在线${cn}</h3>\n    <p class="longtail-note">${paraEsc}</p>`;
    const replaced = block.replace(/<\/section>\s*$/, note + '\n  </section>');
    html = html.split(block).join(replaced);
    injected = true;
  } else {
    // Case B: no tool-deep (AI pages) -> insert a new section before </main>
    const mainIdx = html.lastIndexOf('</main>');
    if (mainIdx === -1) { console.log('NO_MAIN', slug); nomain++; continue; }
    const newBlock =
      `  <section class="tool-deep longtail-note">\n` +
      `    <h2>📖 深入了解 ${cn}</h2>\n` +
      `    <h3>关于免费在线${cn}</h3>\n` +
      `    <p>${paraEsc}</p>\n` +
      `  </section>\n`;
    html = html.slice(0, mainIdx) + newBlock + html.slice(mainIdx);
    injected = true;
  }

  if (!injected) continue;

  // Append long-tail keywords
  html = html.replace(/(<meta name="keywords" content=")([^"]*)(")/, (m, a, b, c) => {
    return a + b + `, 免费在线${cn}, ${cn}在线工具, ${cn}免费` + c;
  });

  fs.writeFileSync(file, html, 'utf8');
  done++;
}

console.log(JSON.stringify({ done, skipped, missing, nomain, nointro, total: Object.keys(DATA).length }));
