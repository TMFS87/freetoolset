'use strict';
// Batch-inject an English long-tail explainer paragraph into every tool page.
// English-only (no Chinese), per site requirements. Replace mode: overwrites
// any existing longtail-note so previously-Chinese blocks become English.
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/Administrator/freetoolset';

// slug -> English tool name (single source of truth)
const DATA = {
  'age-calculator': 'Age Calculator',
  'ai-blog-writer': 'AI Blog Writer',
  'ai-content-rewriter': 'AI Content Rewriter',
  'ai-email-subject': 'AI Email Subject Line Generator',
  'ai-product-description': 'AI Product Description Generator',
  'ai-seo-meta-generator': 'AI SEO Meta Tag Generator',
  'area-converter': 'Area Converter',
  'base-converter': 'Base Converter',
  'base64-encoder': 'Base64 Encoder / Decoder',
  'binary-text-converter': 'Binary Text Converter',
  'bmi-calculator': 'BMI Calculator',
  'body-fat-calculator': 'Body Fat Calculator',
  'break-even-calculator': 'Break-Even Calculator',
  'calorie-calculator': 'Calorie Calculator',
  'chinese-converter': 'Chinese Traditional/Simplified Converter',
  'coin-flip': 'Coin Flip',
  'color-converter': 'Color Converter',
  'color-picker': 'Color Picker',
  'compound-interest-calculator': 'Compound Interest Calculator',
  'cron-expression-generator': 'Cron Expression Generator',
  'css-formatter': 'CSS Formatter',
  'css-minifier': 'CSS Minifier',
  'csv-to-json': 'CSV to JSON Converter',
  'data-storage-converter': 'Data Storage Converter',
  'date-difference-calculator': 'Date Difference Calculator',
  'dice-roller': 'Dice Roller',
  'discount-calculator': 'Discount Calculator',
  'duplicate-line-remover': 'Duplicate Line Remover',
  'fancy-text-generator': 'Fancy Text Generator',
  'find-and-replace': 'Find and Replace',
  'fuel-cost-calculator': 'Fuel Cost Calculator',
  'gpa-calculator': 'GPA Calculator',
  'grade-calculator': 'Grade Calculator',
  'hash-generator': 'Hash Generator',
  'html-encoder': 'HTML Entity Encoder',
  'html-minifier': 'HTML Minifier',
  'http-status-codes': 'HTTP Status Code Lookup',
  'image-compressor': 'Image Compressor',
  'image-to-base64': 'Image to Base64',
  'json-formatter': 'JSON Formatter',
  'json-minifier': 'JSON Minifier',
  'json-to-csv': 'JSON to CSV',
  'json-validator': 'JSON Validator',
  'jwt-decoder': 'JWT Decoder',
  'length-converter': 'Length Converter',
  'line-tools': 'Line Tools',
  'loan-calculator': 'Loan Calculator',
  'lorem-ipsum-generator': 'Lorem Ipsum Generator',
  'markdown-to-html': 'Markdown to HTML',
  'morse-code-translator': 'Morse Code Translator',
  'mortgage-calculator': 'Mortgage Calculator',
  'number-to-words': 'Number to Words',
  'password-generator': 'Password Generator',
  'password-strength-checker': 'Password Strength Checker',
  'percentage-calculator': 'Percentage Calculator',
  'port-lookup': 'Port Lookup',
  'qr-code-generator': 'QR Code Generator',
  'random-name-picker': 'Random Name Picker',
  'random-number-generator': 'Random Number Generator',
  'random-team-generator': 'Random Team Generator',
  'regex-tester': 'Regex Tester',
  'remove-line-breaks': 'Remove Line Breaks',
  'reverse-text': 'Reverse Text',
  'roi-calculator': 'ROI Calculator',
  'roman-numeral-converter': 'Roman Numeral Converter',
  'salary-calculator': 'Salary Calculator',
  'sales-tax-calculator': 'Sales Tax Calculator',
  'slug-generator': 'Slug Generator',
  'speed-converter': 'Speed Converter',
  'sql-formatter': 'SQL Formatter',
  'stopwatch': 'Stopwatch',
  'temperature-converter': 'Temperature Converter',
  'text-case-converter': 'Text Case Converter',
  'text-diff-checker': 'Text Diff Checker',
  'text-repeater': 'Text Repeater',
  'text-sorter': 'Text Sorter',
  'text-to-speech': 'Text to Speech',
  'time-unit-converter': 'Time Unit Converter',
  'timer': 'Timer',
  'timestamp-converter': 'Timestamp Converter',
  'tip-calculator': 'Tip Calculator',
  'unit-converter': 'Unit Converter',
  'url-encoder': 'URL Encoder / Decoder',
  'url-parser': 'URL Parser',
  'uuid-generator': 'UUID Generator',
  'vat-calculator': 'VAT Calculator',
  'volume-converter': 'Volume Converter',
  'water-intake-calculator': 'Water Intake Calculator',
  'weight-converter': 'Weight Converter',
  'whitespace-remover': 'Whitespace Remover',
  'word-counter': 'Word Counter',
  'word-frequency-counter': 'Word Frequency Counter',
  'xml-formatter': 'XML Formatter',
  'yaml-to-json': 'YAML to JSON'
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

function makePara(en, intro) {
  let base = intro || `This ${en} helps you get the job done quickly and reliably.`;
  base = base.replace(/[.。\s]+$/, '').replace(/[。]$/, '');
  return `Looking for a free online ${en}? ${base}. This tool is completely free and requires no registration — every operation runs locally in your browser, your data is never uploaded to any server, and you can use it anytime just by opening the page.`;
}

let done = 0, skipped = 0, missing = 0, nomain = 0, nointro = 0;

for (const slug of Object.keys(DATA)) {
  const en = DATA[slug];
  const file = path.join(DIR, slug + '.html');
  if (!fs.existsSync(file)) { console.log('MISSING', slug); missing++; continue; }
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('longtail-note')) { skipped++; continue; }   // only pages that already have it

  const intro = readIntro(html);
  if (!intro) nointro++;
  const para = makePara(en, intro);
  const paraEsc = esc(para);

  let injected = false;

  // Replace existing longtail-note block (English)
  if (html.includes('longtail-note')) {
    // Case A: inside a tool-deep section
    const tdMatch = html.match(/<section class="tool-deep">[\s\S]*?<\/section>/);
    if (tdMatch) {
      const block = tdMatch[0];
      const note = `\n\n    <h3 class="longtail-note">About the free online ${en}</h3>\n    <p class="longtail-note">${paraEsc}</p>`;
      const replaced = block.replace(/<h3 class="longtail-note">[\s\S]*?<\/p>\s*/, note + '\n  ');
      if (replaced !== block) { html = html.split(block).join(replaced); injected = true; }
      else {
        // fallback: append if not found
        const rep2 = block.replace(/<\/section>\s*$/, note + '\n  </section>');
        html = html.split(block).join(rep2); injected = true;
      }
    } else {
      const mainIdx = html.lastIndexOf('</main>');
      if (mainIdx === -1) { console.log('NO_MAIN', slug); nomain++; continue; }
      const newBlock =
        `  <section class="tool-deep longtail-note">\n` +
        `    <h2>📖 Learn More About ${en}</h2>\n` +
        `    <h3>About the free online ${en}</h3>\n` +
        `    <p>${paraEsc}</p>\n` +
        `  </section>\n`;
      html = html.slice(0, mainIdx) + newBlock + html.slice(mainIdx);
      injected = true;
    }
  }

  if (!injected) continue;

  // Append long-tail keywords (English only)
  html = html.replace(/(<meta name="keywords" content=")([^"]*)(")/, (m, a, b, c) => {
    return a + b + `, free online ${en}, ${en} online, ${en} tool` + c;
  });

  fs.writeFileSync(file, html, 'utf8');
  done++;
}

console.log(JSON.stringify({ done, skipped, missing, nomain, nointro, total: Object.keys(DATA).length }));
