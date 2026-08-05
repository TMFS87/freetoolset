const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');

const translations = {};
function addTrans(key, zh) {
  translations[key] = zh;
}

// 1. 导航 Home / Tools
html = html.replace(
  /<a href="index\.html" class="nav-link active">Home<\/a>/,
  '<a href="index.html" class="nav-link active" data-i18n="Home">Home</a>'
);
addTrans('Home', '首页');

html = html.replace(
  /<a href="#tools" class="nav-link">Tools<\/a>/,
  '<a href="#tools" class="nav-link" data-i18n="Tools">Tools</a>'
);
// 'Tools' 已在字典中

// 2. Hero textarea placeholder
html = html.replace(
  /<textarea id="aiQuickInput" placeholder="✨ Ask AI to write anything\.\.\. e\.g\. Write a product description for a smart watch" rows="2"><\/textarea>/,
  '<textarea id="aiQuickInput" data-i18n-placeholder="heroPlaceholder" placeholder="✨ Ask AI to write anything... e.g. Write a product description for a smart watch" rows="2"></textarea>'
);
addTrans('heroPlaceholder', '✨ 让 AI 写点什么……例如：为智能手表写一段产品描述');

// 3. Quick tags（给没有 data-i18n 的加）
const quickTagMap = {
  '📦 Product Description': '📦 产品描述',
  '📝 Blog Post': '📝 博客文章',
  '🔍 SEO Meta Tags': '🔍 SEO Meta 标签',
  '🔄 Rewrite Content': '🔄 改写内容'
};
for (const [en, zh] of Object.entries(quickTagMap)) {
  const re = new RegExp(`<a href="ai-studio\.html" class="quick-tag">${escapeRegExp(en)}</a>`);
  const key = 'qt_' + en.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '');
  html = html.replace(re, `<a href="ai-studio.html" class="quick-tag" data-i18n="${key}">${en}</a>`);
  addTrans(key, zh);
}

// 4. 分类导航区 cat-nav-section
html = html.replace(
  /<h2 class="cat-nav-title">按分类浏览全部工具<\/h2>/,
  '<h2 class="cat-nav-title" data-i18n="catNavTitle">按分类浏览全部工具</h2>'
);
addTrans('catNavTitle', '按分类浏览全部工具'); // 中文原文，英文用原始文本

const catCards = [
  { href: 'ai-tools.html', icon: '✨', title: 'AI 写作工具', en: 'AI Writing Tools', desc: '6 个免费 AI 文案生成器', enDesc: '6 free AI copy generators' },
  { href: 'calculators.html', icon: '🧮', title: '计算器', en: 'Calculators', desc: '15 个免费在线计算器', enDesc: '15 free online calculators' },
  { href: 'converters.html', icon: '🔄', title: '单位转换器', en: 'Unit Converters', desc: '12 个免费转换工具', enDesc: '12 free conversion tools' },
  { href: 'text-tools.html', icon: '📝', title: '文本处理工具', en: 'Text Tools', desc: '12 个免费文本工具', enDesc: '12 free text tools' },
  { href: 'developer-tools.html', icon: '🛠', title: '开发者工具', en: 'Developer Tools', desc: '26 个免费开发工具', enDesc: '26 free developer tools' },
  { href: 'fun-tools.html', icon: '🎲', title: '趣味小工具', en: 'Fun Tools', desc: '4 个免费趣味工具', enDesc: '4 free fun tools' }
];
for (const c of catCards) {
  const titleRe = new RegExp(`<a class="tool-card" href="${escapeRegExp(c.href)}"><h3>${escapeRegExp(c.icon)} ${escapeRegExp(c.title)}</h3><p>${escapeRegExp(c.desc)}</p></a>`);
  const titleKey = 'catTitle_' + c.href.replace('.html', '');
  const descKey = 'catDesc_' + c.href.replace('.html', '');
  html = html.replace(titleRe, `<a class="tool-card" href="${c.href}"><h3 data-i18n="${titleKey}">${c.icon} ${c.title}</h3><p data-i18n="${descKey}">${c.desc}</p></a>`);
  addTrans(titleKey, c.icon + ' ' + c.title); // 保存原始中文作为中文显示，英文恢复原始 innerHTML
  addTrans(descKey, c.desc);
}

// 5. 分类筛选按钮补齐
const filterMap = {
  '🧮 Calculator': '🧮 计算器',
  '🔄 Converter': '🔄 转换器',
  '🎲 Fun': '🎲 趣味'
};
// AI 按钮
html = html.replace(
  /<button class="category-btn" data-category="ai">✨ AI<\/button>/,
  '<button class="category-btn" data-category="ai" data-i18n="filterAI">✨ AI</button>'
);
addTrans('filterAI', '✨ AI');
for (const [en, zh] of Object.entries(filterMap)) {
  const re = new RegExp(`<button class="category-btn" data-category="${en.toLowerCase().includes('calculator') ? 'calculator' : en.toLowerCase().includes('converter') ? 'converter' : 'fun'}">${escapeRegExp(en)}</button>`);
  const key = 'filter_' + (en.includes('Calculator') ? 'Calc' : en.includes('Converter') ? 'Conv' : 'Fun');
  html = html.replace(re, `<button class="category-btn" data-category="${en.toLowerCase().includes('calculator') ? 'calculator' : en.toLowerCase().includes('converter') ? 'converter' : 'fun'}" data-i18n="${key}">${en}</button>`);
  addTrans(key, zh);
}

// 6. 工具卡片：给每个 tool-card 的 h3 和 p 加 data-i18n
// 遍历所有 tool-card，用 href 作为 key 前缀
const cardRegex = /<a href="([^"]+)" class="tool-card"[\s\S]*?<h3>([^<]+)<\/h3>\s*<p>([^<]+)<\/p>\s*<\/a>/g;
let m;
const seenHrefs = new Set();
while ((m = cardRegex.exec(html)) !== null) {
  const [full, href, title, desc] = m;
  if (seenHrefs.has(href)) continue;
  seenHrefs.add(href);
  const slug = href.replace('.html', '');
  const titleKey = 'cardTitle_' + slug;
  const descKey = 'cardDesc_' + slug;
  // 只对没有 data-i18n 的加
  const newFull = full
    .replace(`<h3>${title}</h3>`, `<h3 data-i18n="${titleKey}">${title}</h3>`)
    .replace(`<p>${desc}</p>`, `<p data-i18n="${descKey}">${desc}</p>`);
  html = html.replace(full, newFull);
  addTrans(titleKey, title);
  addTrans(descKey, desc);
}

// 7. Footer desc
html = html.replace(
  /<p class="footer-desc">Free online tools that run entirely in your browser\. No data is uploaded to any server\. Your privacy is our priority\.<\/p>/,
  '<p class="footer-desc" data-i18n="footerDesc">Free online tools that run entirely in your browser. No data is uploaded to any server. Your privacy is our priority.</p>'
);
// footerDesc 已在字典中（中文翻译略有不同，这里保持一致）

// 8. Footer copyright
html = html.replace(
  /<p>© 2025 FreeToolset\. All tools run locally in your browser\. No data is uploaded\.<\/p>/,
  '<p data-i18n="footerCopy">© 2025 FreeToolset. All tools run locally in your browser. No data is uploaded.</p>'
);
addTrans('footerCopy', '© 2025 FreeToolset。所有工具均在浏览器本地运行，不会上传任何数据。');

fs.writeFileSync(INDEX, html);
console.log('Updated index.html');

// 输出需要追加到 i18n.js 的翻译
console.log('\n// Add these to js/i18n.js DICT:\n');
for (const [k, v] of Object.entries(translations)) {
  console.log(`    '${k.replace(/'/g, "\\'")}': '${v.replace(/'/g, "\\'")}',`);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
