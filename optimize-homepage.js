const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INDEX = path.join(ROOT, 'index.html');

let html = fs.readFileSync(INDEX, 'utf8');

// 1. Inject Featured AI Studio section right after AI Hero section closing tag
const featuredHTML = `
    <!-- Featured AI Studio Section -->
    <section class="featured-ai-section" aria-label="Featured tool">
      <div class="featured-ai-content">
        <div class="featured-ai-badge" data-i18n="featuredBadge">⭐ Featured Tool</div>
        <h2 class="featured-ai-title" data-i18n="featuredTitle">AI Content Studio</h2>
        <p class="featured-ai-desc" data-i18n="featuredDesc">Our most popular tool — type any request and let AI generate product descriptions, blog posts, SEO meta tags, emails, and more. No signup required.</p>
        <div class="featured-ai-actions">
          <a href="ai-studio.html" class="btn-featured-primary" data-i18n="featuredPrimaryBtn">✨ Open AI Studio →</a>
          <a href="ai-tools.html" class="btn-featured-secondary" data-i18n="featuredSecondaryBtn">Browse AI Tools</a>
        </div>
      </div>
      <div class="featured-ai-highlights">
        <a href="ai-product-description.html" class="featured-ai-mini" data-i18n="featuredMini1">📦 Product Description</a>
        <a href="ai-blog-writer.html" class="featured-ai-mini" data-i18n="featuredMini2">📝 Blog Post Writer</a>
        <a href="ai-seo-meta-generator.html" class="featured-ai-mini" data-i18n="featuredMini3">🔍 SEO Meta Generator</a>
        <a href="ai-email-subject.html" class="featured-ai-mini" data-i18n="featuredMini4">✉️ Email Subject Lines</a>
      </div>
    </section>
`;

if (!html.includes('class="featured-ai-section"')) {
  // Flexible marker: any whitespace before Category Pages Nav comment
  html = html.replace(
    /(<\/section>\s*)(\n\s*<!-- Category Pages Nav -->)/,
    '$1' + featuredHTML + '$2'
  );
  console.log('Added featured AI Studio section');
} else {
  console.log('Featured AI Studio section already exists');
}

// 2. Inject CSS for featured section in <style> block (before closing </style> of inline styles)
const featuredCSS = `
    /* Featured AI Studio Section */
    .featured-ai-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 32px;
      align-items: center;
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%);
      border: 2px solid var(--primary);
      border-radius: var(--radius-lg);
      padding: 40px;
      margin: 32px 0 48px;
      box-shadow: 0 8px 32px var(--primary-glow);
      position: relative;
      overflow: hidden;
    }

    .featured-ai-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
      opacity: 0.6;
      pointer-events: none;
    }

    .featured-ai-content {
      position: relative;
      z-index: 1;
    }

    .featured-ai-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 100px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .featured-ai-title {
      font-size: 2.2rem;
      font-weight: 900;
      margin-bottom: 14px;
      color: var(--text);
      letter-spacing: -0.5px;
    }

    .featured-ai-desc {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.7;
      margin-bottom: 24px;
      max-width: 520px;
    }

    .featured-ai-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .btn-featured-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 14px 28px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: #fff;
      border: none;
      border-radius: 100px;
      font-size: 1rem;
      font-weight: 800;
      text-decoration: none;
      transition: all var(--transition);
      box-shadow: 0 4px 16px var(--primary-glow);
    }

    .btn-featured-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px var(--primary-glow);
      color: #fff;
    }

    .btn-featured-secondary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 14px 24px;
      background: var(--card-bg);
      color: var(--primary);
      border: 1.5px solid var(--primary);
      border-radius: 100px;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      transition: all var(--transition);
    }

    .btn-featured-secondary:hover {
      background: var(--primary);
      color: #fff;
    }

    .featured-ai-highlights {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      position: relative;
      z-index: 1;
    }

    .featured-ai-mini {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: all var(--transition);
    }

    .featured-ai-mini:hover {
      border-color: var(--primary);
      background: var(--primary-light);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .featured-ai-section {
        grid-template-columns: 1fr;
        padding: 28px 24px;
      }
      .featured-ai-title { font-size: 1.7rem; }
      .featured-ai-highlights { grid-template-columns: 1fr; }
    }
`;

const styleEndMarker = '    /* Section Divider */\n';
if (!html.includes('Featured AI Studio Section')) {
  html = html.replace(styleEndMarker, featuredCSS + '\n    /* Section Divider */\n');
  console.log('Added featured AI Studio CSS');
} else {
  console.log('Featured AI Studio CSS already exists');
}

// 3. Add a "Discover more tools" link at the bottom of tool grid
const moreToolsLinkHTML = `
        <a href="index.html#tools" class="tool-card card-discover-more" data-i18n="discoverMoreCard">
          <div class="card-icon">⚡</div>
          <span class="card-badge badge-developer">FreeToolset</span>
          <h3>Discover 75+ Free Tools</h3>
          <p>Browse calculators, converters, text tools, dev tools and more.</p>
        </a>
`;
const discoverMoreCSS = `
    .card-discover-more {
      border: 2px dashed var(--border);
      background: transparent;
      justify-content: center;
      text-align: center;
    }
    .card-discover-more:hover {
      border-color: var(--primary);
      background: var(--primary-light);
    }
`;

if (!html.includes('card-discover-more')) {
  // Insert before closing of tool-grid
  html = html.replace(
    '        <a href="dice-roller.html" class="tool-card" data-name="dice roller dice roller roll virtual d20 d6 board game rpg" data-category="fun">\n          <div class="card-icon">🎲</div>\n          <span class="card-badge badge-fun">Fun</span>\n          <h3 data-i18n="cardTitle_dice-roller">Dice Roller</h3>\n          <p data-i18n="cardDesc_dice-roller">Roll any number of dice with any sides online.</p>\n        </a>\n\n      </div>',
    '        <a href="dice-roller.html" class="tool-card" data-name="dice roller dice roller roll virtual d20 d6 board game rpg" data-category="fun">\n          <div class="card-icon">🎲</div>\n          <span class="card-badge badge-fun">Fun</span>\n          <h3 data-i18n="cardTitle_dice-roller">Dice Roller</h3>\n          <p data-i18n="cardDesc_dice-roller">Roll any number of dice with any sides online.</p>\n        </a>\n' + moreToolsLinkHTML + '\n      </div>'
  );
  // Insert CSS
  html = html.replace('    /* Section Divider */\n', discoverMoreCSS + '\n    /* Section Divider */\n');
  console.log('Added discover more card');
} else {
  console.log('Discover more card already exists');
}

fs.writeFileSync(INDEX, html);
console.log('Wrote index.html');
