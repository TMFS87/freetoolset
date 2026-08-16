/* enrich-category.js — add H2 sections + FAQ + FAQPage schema to category pages.
   Injects between tool-grid </div> and </main>.
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// Category content data: about + FAQs for each category page
const CAT_CONTENT = {
  'developer-tools.html': {
    title: 'Developer Tools',
    slug: 'developer-tools',
    aboutH2: 'Why choose FreeToolset developer tools?',
    aboutHtml: `<p>FreeToolset offers <strong>33 free online developer tools</strong> covering everyday needs for front-end development, back-end debugging, and data processing. All tools run locally in your browser, so <strong>your code and data are never uploaded to any server</strong>—especially important when handling sensitive information (such as API keys, JWT tokens, and private configs).</p>
<p>No need to install Node.js, Python, or any IDE plugin—just open your browser and go. Works on desktop and mobile, so you can quickly format JSON or generate a UUID on your commute. We keep expanding our tool list; recently added <a href="color-converter.html">Color Converter</a>, <a href="url-parser.html">URL Parser</a>, <a href="sql-formatter.html">SQL Formatter</a>, <a href="xml-formatter.html">XML Formatter</a>, <a href="yaml-to-json.html">YAML to JSON</a>, <a href="css-formatter.html">CSS Formatter</a>, and <a href="json-validator.html">JSON Validator</a>.</p>`,
    faqs: [
      { q: 'Are these developer tools really free?', a: 'Yes—all 95+ FreeToolset tools are completely free, with no account registration, no feature limits, and no ad interruptions.' },
      { q: 'Is my code data safe? Will it be uploaded to a server?', a: 'Absolutely safe. All processing happens in your browser; your code and data never leave your device. Most tools work even offline.' },
      { q: 'Which programming languages are supported for formatting?', a: 'Currently JSON, XML, YAML, SQL, CSS, HTML, and JavaScript formatting and minification, plus Markdown/HTML conversion. CSV and JSON can also be converted to each other.' },
      { q: 'Can I use these on my phone?', a: 'Yes. Our tools are responsive and work smoothly in mobile browsers—handy for quickly checking JWT contents or formatting JSON on the go.' },
      { q: 'How do I bookmark my frequently used developer tools?', a: 'Just bookmark the corresponding tool page in your browser. Each tool has its own URL, easy to share with teammates.' }
    ]
  },
  'calculators.html': {
    title: 'Calculators',
    slug: 'calculators',
    aboutH2: 'Free online calculators—everything for life, finance, and health in one place',
    aboutHtml: `<p>FreeToolset collects <strong>20 free online calculators</strong> spanning personal finance, health assessment, math, and everyday conversions. Whether you're calculating a mortgage payment, BMI, calorie burn, break-even point, or VAT, you'll find a professional tool here.</p>
<p>All calculators use up-to-date formula algorithms with instant results—no "Calculate" button needed. Data is processed only in your browser; your financial inputs and body metrics <strong>are never recorded or uploaded</strong>. Recently added <a href="break-even-calculator.html">Break-Even Calculator</a>, <a href="vat-calculator.html">VAT Calculator</a>, <a href="grade-calculator.html">Grade Calculator</a>, <a href="body-fat-calculator.html">Body Fat Calculator</a>, and <a href="water-intake-calculator.html">Daily Water Intake Calculator</a>.</p>`,
    faqs: [
      { q: 'Are the calculator results accurate?', a: 'Our calculators use standard math and medical formulas (e.g., the Mifflin-St Jeor calorie formula and US Navy body-fat formula). Results are for reference only—please rely on professional testing for precise values.' },
      { q: 'Do I need to register to use them?', a: 'No. All calculators work instantly—no registration, login, or app download required.' },
      { q: 'Will my input data be saved?', a: 'No. All calculations happen in your browser and disappear when you close the page. We never store any user input.' },
      { q: 'Can I use these calculators on my phone?', a: 'Absolutely. The responsive design ensures a good input experience on phone screens—great for calculating discounts while shopping or BMI at the gym.' }
    ]
  },
  'text-tools.html': {
    title: 'Text Tools',
    slug: 'text-tools',
    aboutH2: 'Powerful online text processing—essential for writing, SEO, and data analysis',
    aboutHtml: `<p>FreeToolset's <strong>17 text-processing tools</strong> meet needs from content creation to technical documentation. Whether you're an SEO specialist counting word frequency, a developer comparing text differences, or a writer sorting and deduplicating, you'll find the right tool.</p>
<p>Supports both Chinese and English text processing, and handles large files smoothly. All operations run locally in your browser, so <strong>your article content never leaks</strong>. Recently added <a href="word-frequency-counter.html">Word Frequency Counter</a>, <a href="text-diff-checker.html">Text Diff Checker</a>, <a href="duplicate-line-remover.html">Duplicate Line Remover</a>, <a href="text-sorter.html">Text Sorter</a>, and <a href="chinese-converter.html">Chinese Converter (Traditional/Simplified & case)</a>.</p>`,
    faqs: [
      { q: 'How long a text can be processed?', a: 'Most tools handle texts up to tens of thousands of characters. The word-frequency counter and diff checker are performance-optimized for large files.' },
      { q: 'Does it support Chinese text processing?', a: 'Yes. The word-frequency counter counts English words and Chinese characters separately, and the Chinese converter supports Traditional/Simplified conversion and case conversion.' },
      { q: 'How do I save processed text?', a: 'You can copy the result directly; some tools offer one-click download as a .txt file. Everything runs locally with no upload.' },
      { q: 'How do these tools help with SEO?', a: 'The word-frequency counter helps analyze keyword density, while sorting and deduplication help organize structured data—both common aids for SEO practitioners.' }
    ]
  },
  'fun-tools.html': {
    title: 'Fun Tools',
    slug: 'fun-tools',
    aboutH2: 'Easy and fun online mini-tools—decisions, entertainment, random generation',
    aboutHtml: `<p>You need to relax after work too. FreeToolset's <strong>7 fun mini-tools</strong> help you make random decisions, generate interesting content, and add a little surprise to daily life. From a coin flip to decide, to a random name picker, to dice rolling and team grouping—make the dull day a bit more fun.</p>
<p>All fun tools are completely free with a clean, playful interface—perfect to share with friends. Recently added <a href="coin-flip.html">Coin Flip</a>, <a href="random-name-picker.html">Random Name Picker</a>, and <a href="random-team-generator.html">Random Team Generator</a>.</p>`,
    faqs: [
      { q: 'Are coin-flip results truly random?', a: 'Yes. We use a cryptographically secure random number generator (crypto.getRandomValues); every result is unpredictable and fair.' },
      { q: 'Does the random name picker support a custom list?', a: 'Yes. You can enter any list of names and the tool randomly draws one or more—ideal for classroom roll-calls, giveaways, and similar scenarios.' },
      { q: 'Can these tools be used offline?', a: 'Yes. Once the page loads, all random features keep working even if the network disconnects.' }
    ]
  },
  'converters.html': {
    title: 'Unit Converters',
    slug: 'converters',
    aboutH2: 'Comprehensive unit conversion tools—science, cooking, and travel covered',
    aboutHtml: `<p>FreeToolset provides <strong>12 unit converters</strong> covering length, weight, temperature, speed, area, volume, time, and data storage. Whether it's a baking conversion in the kitchen, a currency/temperature conversion while traveling abroad, or a data-unit conversion for programmers, you get accurate results fast.</p>
<p>Conversion algorithms are based on international standard definitions, ensuring precise and reliable results. The interface is clean and intuitive—select units and enter a value for instant results, no waiting.</p>`,
    faqs: [
      { q: 'Which units are supported?', a: 'Covers metric (SI), imperial, US customary, and Chinese market units—including meters/feet/inches, kilograms/pounds/ounces, and Celsius/Fahrenheit/Kelvin.' },
      { q: 'Are the conversion results accurate?', a: 'Accurate. We use standard conversion coefficients, with most conversions precise to over 10 decimal places.' },
      { q: 'Can I convert in reverse?', a: 'Yes. Simply swap the unit selection to auto-calculate in reverse—very convenient.' }
    ]
  }
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function faqSchema(faqs, pageTitle) {
  const entities = faqs.map((f, i) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities
  }, null, 2);
}

const ANCHOR = '    </div>\n  </main>';
let totalChanged = 0;

for (const [filename, cat] of Object.entries(CAT_CONTENT)) {
  const fp = path.join(ROOT, filename);
  if (!fs.existsSync(fp)) { console.log('SKIP missing ' + filename); continue; }

  let html = fs.readFileSync(fp, 'utf8');

  // Skip if already enriched (has FAQ section)
  if (html.includes('id="faq-section"')) {
    console.log('already enriched ' + filename);
    continue;
  }

  // Build content to inject
  const faqItems = cat.faqs.map(f =>
    '<dt>' + esc(f.q) + '</dt>\n        <dd>' + esc(f.a) + '</dd>'
  ).join('\n        ');

  const content = `
    <section class="cat-about" aria-label="${esc(cat.title)} overview">
      <h2>${esc(cat.aboutH2)}</h2>
      ${cat.aboutHtml}
    </section>

    <section id="faq-section" class="cat-faq" aria-label="FAQ">
      <h2>${esc(cat.title)} FAQ</h2>
      <dl class="faq-list">
        ${faqItems}
      </dl>
    </section>

    <script type="application/ld+json">
${faqSchema(cat.faqs, cat.title)}
    </script>`;

  if (!html.includes(ANCHOR)) {
    console.log('WARN ' + filename + ': anchor not found');
    continue;
  }

  html = html.replace(ANCHOR, content + '\n  </main>');
  fs.writeFileSync(fp, html, 'utf8');
  totalChanged++;

  const h2Count = (html.match(/<h2/g) || []).length;
  console.log('OK ' + filename + ' -> H2=' + h2Count + ', FAQ=' + cat.faqs.length);
}

console.log('\ntotal category pages enriched: ' + totalChanged);
