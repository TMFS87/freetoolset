const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Pages to skip (not individual tool pages)
const SKIP = new Set([
  'index.html', '404.html', 'about.html', 'contact.html', 'privacy-policy.html',
  'ai-tools.html', 'calculators.html', 'converters.html', 'text-tools.html',
  'developer-tools.html', 'fun-tools.html', 'ai-studio.html',
  'baidu_verify_codeva-cLcTPo9dNf.html', 'baidu_verify_codeva-OivAbYsb29.html',
  'googleaa6e10b4cdc3dee6.html', '_cards.html'
]);

const moreToolsSection = (categoryHref, categoryName) => `
    <!-- More Tools Section -->
    <section class="more-tools-section" aria-label="More tools">
      <h2 class="more-tools-title" data-i18n="moreToolsTitle">🔍 Explore More Tools</h2>
      <p class="more-tools-desc" data-i18n="moreToolsDesc">FreeToolset has 75+ free online tools. Browse more utilities to boost your productivity.</p>
      <div class="more-tools-grid">
        <a href="index.html" class="more-tool-card more-tool-home">
          <span class="mt-icon">⚡</span>
          <span class="mt-name" data-i18n="moreToolsAll">All 75+ Tools</span>
        </a>
        <a href="ai-studio.html" class="more-tool-card">
          <span class="mt-icon">✨</span>
          <span class="mt-name" data-i18n="✨ AI Studio">✨ AI Studio</span>
        </a>
        ${categoryHref ? `<a href="${categoryHref}" class="more-tool-card">
          <span class="mt-icon">📂</span>
          <span class="mt-name">${categoryName}</span>
        </a>` : ''}
        <a href="image-compressor.html" class="more-tool-card">
          <span class="mt-icon">🖼️</span>
          <span class="mt-name" data-i18n="cardTitle_image-compressor">🖼️ Image Compressor</span>
        </a>
        <a href="qr-code-generator.html" class="more-tool-card">
          <span class="mt-icon">📱</span>
          <span class="mt-name" data-i18n="cardTitle_qr-code-generator">📱 QR Code Generator</span>
        </a>
        <a href="password-generator.html" class="more-tool-card">
          <span class="mt-icon">🔐</span>
          <span class="mt-name" data-i18n="cardTitle_password-generator">🔐 Password Generator</span>
        </a>
        <a href="json-formatter.html" class="more-tool-card">
          <span class="mt-icon">🧩</span>
          <span class="mt-name" data-i18n="cardTitle_json-formatter">🧩 JSON Formatter</span>
        </a>
        <a href="word-counter.html" class="more-tool-card">
          <span class="mt-icon">📝</span>
          <span class="mt-name" data-i18n="cardTitle_word-counter">📝 Word Counter</span>
        </a>
      </div>
    </section>
`;

const moreToolsCSS = `
    /* More Tools Section */
    .more-tools-section {
      margin: 48px 0 32px;
      padding: 32px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }

    .more-tools-title {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 10px;
      color: var(--text);
    }

    .more-tools-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .more-tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }

    .more-tool-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all var(--transition);
    }

    .more-tool-card:hover {
      border-color: var(--primary);
      background: var(--primary-light);
      transform: translateY(-2px);
    }

    .more-tool-home {
      background: linear-gradient(135deg, var(--primary-light), var(--bg));
      border-color: var(--primary);
    }

    .mt-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .mt-name {
      line-height: 1.3;
    }

    @media (max-width: 640px) {
      .more-tools-grid { grid-template-columns: repeat(2, 1fr); }
    }
`;

function addMoreTools(file) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already has more-tools-section
  if (html.includes('more-tools-section')) {
    console.log(`SKIP (already has): ${file}`);
    return;
  }

  // Only process pages that look like tool pages (have tool-header or tool-layout)
  if (!html.includes('class="tool-header"') && !html.includes('class="tool-layout"')) {
    console.log(`SKIP (not a tool page): ${file}`);
    return;
  }

  // Extract category link from breadcrumb if available
  let categoryHref = '';
  let categoryName = '';
  const breadcrumbMatch = html.match(/<nav class="breadcrumb">[\s\S]*?<a href="([^"]+)"[^>]*data-i18n="catTitle_([^"]+)">([^<]+)<\/a>[\s\S]*?<\/nav>/);
  if (breadcrumbMatch) {
    categoryHref = breadcrumbMatch[1];
    categoryName = breadcrumbMatch[3].trim();
  }

  // Add CSS if not present
  if (!html.includes('/* More Tools Section */')) {
    // Insert before </style> of the first style block (page-specific styles)
    html = html.replace(/<\/style>/, moreToolsCSS + '\n  </style>');
  }

  // Add section before footer
  const footerMarker = '\n  <footer class="footer">';
  html = html.replace(footerMarker, moreToolsSection(categoryHref, categoryName) + '\n  <footer class="footer">');

  fs.writeFileSync(filePath, html);
  console.log(`OK: ${file}${categoryHref ? ` (category: ${categoryHref})` : ''}`);
}

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !SKIP.has(f));
files.forEach(addMoreTools);

console.log(`\nProcessed ${files.length} HTML files.`);
