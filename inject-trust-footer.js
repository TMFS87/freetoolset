/**
 * inject-trust-footer.js
 * 1) Add the operator byline to the site-wide footer (the "Who" signal for E-E-A-T); root and blog/ use different relative paths
 * 2) Fix the dead contact.html link pointing to an empty github.com/
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OLD = '<p>© 2025 FreeToolset. All tools run locally in your browser.</p>';
const NEW_ROOT = '<p>© 2025 FreeToolset · independently developed and maintained by <a href="about.html">TMFS</a> · all tools run locally in your browser, no data uploaded</p>';
const NEW_BLOG = '<p>© 2025 FreeToolset · independently developed and maintained by <a href="../about.html">TMFS</a> · all tools run locally in your browser, no data uploaded</p>';

function walk(dir, replacement) {
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const file = path.join(dir, f);
    if (!fs.statSync(file).isFile()) continue;
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes(OLD)) continue;
    html = html.split(OLD).join(replacement);
    fs.writeFileSync(file, html, 'utf8');
    n++;
  }
  return n;
}

const a = walk(ROOT, NEW_ROOT);
const blogDir = path.join(ROOT, 'blog');
const b = fs.existsSync(blogDir) ? walk(blogDir, NEW_BLOG) : 0;
console.log(`footer updated -> root:${a} blog:${b}`);

// Fix contact.html's empty GitHub link
const contact = path.join(ROOT, 'contact.html');
if (fs.existsSync(contact)) {
  let html = fs.readFileSync(contact, 'utf8');
  const before = html;
  html = html.replace(
    /<li><strong data-i18n="GitHub:">GitHub:<\/strong>[\s\S]*?<\/li>/,
    '<li><strong>Feedback:</strong> If a tool errors or returns wrong results, email <a href="mailto:freetoolset.app@gmail.com">freetoolset.app@gmail.com</a> with the page URL and your input, and I will fix it as soon as possible.</li>'
  );
  if (html !== before) {
    fs.writeFileSync(contact, html, 'utf8');
    console.log('contact.html: dead GitHub link fixed');
  } else {
    console.log('contact.html: pattern not matched (skipped)');
  }
}
