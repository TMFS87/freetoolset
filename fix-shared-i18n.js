const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const files = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !f.startsWith('_') && !f.includes('baidu') && !f.includes('google'))
  .map(f => path.join(ROOT, f));

// Also include ai-studio, about, contact, privacy-policy explicitly
const extra = ['about.html', 'contact.html', 'privacy-policy.html', 'ai-studio.html', '404.html']
  .map(f => path.join(ROOT, f));

const allFiles = Array.from(new Set([...files, ...extra]));

let changed = 0;

for (const file of allFiles) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  let orig = html;

  // 1. Navbar: ensure shared links have data-i18n
  // Home link without data-i18n
  html = html.replace(
    /<a href="index\.html" class="nav-link([^"]*)"([^>]*)>(?!\s*<span)Home<\/a>/g,
    '<a href="index.html" class="nav-link$1"$2 data-i18n="Home">Home</a>'
  );

  // Tools link without data-i18n (including #tools)
  html = html.replace(
    /<a href="index\.html#tools" class="nav-link([^"]*)"([^>]*)>Tools<\/a>/g,
    '<a href="index.html#tools" class="nav-link$1"$2 data-i18n="Tools">Tools</a>'
  );
  html = html.replace(
    /<a href="#tools" class="nav-link([^"]*)"([^>]*)>Tools<\/a>/g,
    '<a href="#tools" class="nav-link$1"$2 data-i18n="Tools">Tools</a>'
  );

  // AI Studio without data-i18n
  html = html.replace(
    /<a href="ai-studio\.html" class="nav-link([^"]*)"([^>]*)>✨ AI Studio<\/a>/g,
    '<a href="ai-studio.html" class="nav-link$1"$2 data-i18n="✨ AI Studio">✨ AI Studio</a>'
  );

  // About without data-i18n
  html = html.replace(
    /<a href="about\.html" class="nav-link([^"]*)"([^>]*)>About<\/a>/g,
    '<a href="about.html" class="nav-link$1"$2 data-i18n="About">About</a>'
  );

  // Privacy without data-i18n
  html = html.replace(
    /<a href="privacy-policy\.html" class="nav-link([^"]*)"([^>]*)>Privacy<\/a>/g,
    '<a href="privacy-policy.html" class="nav-link$1"$2 data-i18n="Privacy">Privacy</a>'
  );

  // 2. Footer copyright
  html = html.replace(
    /<p>(© 2025 FreeToolset\. All tools run locally in your browser\. No data is uploaded\.)<\/p>/g,
    '<p data-i18n="footerCopy">$1</p>'
  );

  // 3. Footer links
  html = html.replace(
    /<a href="ai-studio\.html">AI Studio<\/a>/g,
    '<a href="ai-studio.html" data-i18n="✨ AI Studio">AI Studio</a>'
  );

  if (html !== orig) {
    fs.writeFileSync(file, html);
    changed++;
    console.log('Updated:', path.basename(file));
  }
}

console.log(`\nUpdated ${changed} files.`);
