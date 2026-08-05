const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !f.startsWith('_') && !f.includes('baidu') && !f.includes('google'));

const catMap = {
  'ai-tools.html': { en: 'AI Writing Tools', key: 'catTitle_ai-tools' },
  'calculators.html': { en: 'Calculators', key: 'catTitle_calculators' },
  'converters.html': { en: 'Unit Converters', key: 'catTitle_converters' },
  'text-tools.html': { en: 'Text Tools', key: 'catTitle_text-tools' },
  'developer-tools.html': { en: 'Developer Tools', key: 'catTitle_developer-tools' },
  'fun-tools.html': { en: 'Fun Tools', key: 'catTitle_fun-tools' }
};

const zhCatNames = {
  'AI 写作工具': 'ai-tools.html',
  '计算器': 'calculators.html',
  '单位转换器': 'converters.html',
  '文本处理工具': 'text-tools.html',
  '开发者工具': 'developer-tools.html',
  '趣味小工具': 'fun-tools.html'
};

// Tool name mapping: slug -> English display name (without emoji)
const toolNames = {
  'ai-studio': 'AI Content Studio',
  'ai-product-description': 'AI Product Description Writer',
  'ai-seo-meta-generator': 'AI SEO Meta Generator',
  'ai-blog-writer': 'AI Blog Post Writer',
  'ai-email-subject': 'AI Email Subject Line Generator',
  'ai-content-rewriter': 'AI Content Rewriter',
  'port-lookup': 'Port Lookup',
  'image-compressor': 'Image Compressor',
  'qr-code-generator': 'QR Code Generator',
  'word-counter': 'Word Counter',
  'password-generator': 'Password Generator',
  'json-formatter': 'JSON Formatter',
  'color-picker': 'Color Picker',
  'base64-encoder': 'Base64 Encoder/Decoder',
  'lorem-ipsum-generator': 'Lorem Ipsum Generator',
  'url-encoder': 'URL Encoder / Decoder',
  'hash-generator': 'Hash Generator',
  'uuid-generator': 'UUID Generator',
  'image-to-base64': 'Image to Base64',
  'text-case-converter': 'Text Case Converter',
  'timestamp-converter': 'Timestamp Converter',
  'regex-tester': 'Regex Tester',
  'base-converter': 'Base Converter',
  'line-tools': 'Line Tools',
  'password-strength-checker': 'Password Strength Checker',
  'bmi-calculator': 'BMI Calculator',
  'age-calculator': 'Age Calculator',
  'percentage-calculator': 'Percentage Calculator',
  'loan-calculator': 'Loan Calculator',
  'mortgage-calculator': 'Mortgage Calculator',
  'tip-calculator': 'Tip Calculator',
  'discount-calculator': 'Discount Calculator',
  'compound-interest-calculator': 'Compound Interest Calculator',
  'gpa-calculator': 'GPA Calculator',
  'calorie-calculator': 'Calorie Calculator',
  'sales-tax-calculator': 'Sales Tax Calculator',
  'salary-calculator': 'Salary Calculator',
  'fuel-cost-calculator': 'Fuel Cost Calculator',
  'roi-calculator': 'ROI Calculator',
  'date-difference-calculator': 'Date Difference Calculator',
  'unit-converter': 'Unit Converter',
  'temperature-converter': 'Temperature Converter',
  'length-converter': 'Length Converter',
  'weight-converter': 'Weight Converter',
  'speed-converter': 'Speed Converter',
  'area-converter': 'Area Converter',
  'volume-converter': 'Volume Converter',
  'data-storage-converter': 'Data Storage Converter',
  'time-unit-converter': 'Time Unit Converter',
  'roman-numeral-converter': 'Roman Numeral Converter',
  'number-to-words': 'Number to Words Converter',
  'binary-text-converter': 'Text to Binary Converter',
  'reverse-text': 'Reverse Text',
  'text-repeater': 'Text Repeater',
  'find-and-replace': 'Find and Replace Text',
  'slug-generator': 'URL Slug Generator',
  'remove-line-breaks': 'Remove Line Breaks',
  'whitespace-remover': 'Whitespace Remover',
  'text-to-speech': 'Text to Speech',
  'fancy-text-generator': 'Fancy Text Generator',
  'html-encoder': 'HTML Encoder / Decoder',
  'css-minifier': 'CSS Minifier',
  'json-minifier': 'JSON Minifier',
  'html-minifier': 'HTML Minifier',
  'markdown-to-html': 'Markdown to HTML',
  'csv-to-json': 'CSV to JSON',
  'json-to-csv': 'JSON to CSV',
  'jwt-decoder': 'JWT Decoder',
  'cron-expression-generator': 'Cron Expression Generator',
  'http-status-codes': 'HTTP Status Codes',
  'random-number-generator': 'Random Number Generator',
  'morse-code-translator': 'Morse Code Translator',
  'timer': 'Online Countdown Timer',
  'stopwatch': 'Online Stopwatch',
  'dice-roller': 'Dice Roller'
};

let changed = 0;

for (const file of files) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let orig = html;
  const slug = file.replace('.html', '');

  // Find breadcrumb block
  const bcRegex = /<nav class="breadcrumb">.*?<\/nav>/s;
  html = html.replace(bcRegex, function (block) {
    // Home link
    block = block.replace(
      /<a href="index\.html">Home<\/a>/,
      '<a href="index.html" data-i18n="Home">Home</a>'
    );

    // Category link: replace Chinese category name with English + data-i18n
    for (const [zhName, catFile] of Object.entries(zhCatNames)) {
      const re = new RegExp(`<a href="${catFile}">${zhName}</a>`);
      const { en, key } = catMap[catFile];
      block = block.replace(re, `<a href="${catFile}" data-i18n="${key}">${en}</a>`);
    }

    // Current page title: add data-i18n if known
    const currentMatch = block.match(/<span class="current">([^<]+)<\/span>/);
    if (currentMatch && toolNames[slug]) {
      const enTitle = toolNames[slug];
      const titleKey = 'cardTitle_' + slug;
      block = block.replace(
        /<span class="current">[^<]+<\/span>/,
        `<span class="current" data-i18n="${titleKey}">${enTitle}</span>`
      );
    }

    return block;
  });

  if (html !== orig) {
    fs.writeFileSync(filePath, html);
    changed++;
    console.log('Updated breadcrumb:', file);
  }
}

console.log(`\nUpdated breadcrumbs in ${changed} files.`);
