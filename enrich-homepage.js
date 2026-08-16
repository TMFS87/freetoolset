/* enrich-homepage.js — add content sections + FAQ to homepage (index.html).
   Injects before </main>.
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const fp = path.join(ROOT, 'index.html');
let html = fs.readFileSync(fp, 'utf8');

if (html.includes('id="home-faq"')) {
  console.log('already enriched'); process.exit(0);
}

const NEW_CONTENT = `
    <!-- SEO Content Sections -->
    <section class="home-why" aria-label="Why choose FreeToolset">
      <h2>Why choose FreeToolset?</h2>
      <div class="why-grid">
        <div class="why-item">
          <h3>🔒 Privacy First</h3>
          <p>All tools run locally in your browser, so your data is never uploaded to any server. Use them with confidence even for sensitive code, financial data, or personal text.</p>
        </div>
        <div class="why-item">
          <h3>⚡ Ready to Use</h3>
          <p>No registration, download, or install needed. Open the page and use 95+ free online tools, on both desktop and mobile browsers.</p>
        </div>
        <div class="why-item">
          <h3>🛠️ Comprehensive Coverage</h3>
          <p>From <strong>developer tools</strong> like JSON formatting and regex testing, to <strong>calculators</strong> for BMI and mortgage, to <strong>text tools</strong> for word frequency and text comparison—one stop for everyday needs.</p>
        </div>
        <div class="why-item">
          <h3>📱 Responsive Design</h3>
          <p>All tools adapt to any screen size. Enjoy a smooth experience whether you're deep-working at a computer or quickly checking on your phone.</p>
        </div>
      </div>
    </section>

    <section id="home-faq" class="home-faq-section" aria-label="FAQ">
      <h2>FAQ</h2>
      <dl class="faq-list">
        <dt>Are FreeToolset's tools really completely free?</dt>
        <dd>Yes, all 95+ tools are completely free to use—no account registration, no hidden charges, and no ad interruptions.</dd>
        <dt>Is my data safe?</dt>
        <dd>Absolutely safe. All data processing happens in your browser and is never uploaded to our servers. You can even keep using most tools after going offline.</dd>
        <dt>Which languages do the tools support?</dt>
        <dd>The interface is in English. Text tools work with both English and Chinese input—for example, the Word Frequency Counter counts English words and Chinese characters, and the Chinese Converter handles Traditional/Simplified conversion.</dd>
        <dt>Can I use them on my phone?</dt>
        <dd>Yes. All tools are responsive and work smoothly in mobile browsers.</dd>
        <dt>How do I get help or send feedback?</dt>
        <dd>Visit our <a href="contact.html">contact page</a> to send feedback; we keep improving and adding tools.</dd>
      </dl>
    </section>

    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are FreeToolset's tools really completely free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, all 95+ tools are completely free to use—no account registration, no hidden charges, and no ad interruptions." }
    },
    {
      "@type": "Question",
      "name": "Is my data safe?",
      "acceptedAnswer": { "@type": "Answer", "text": "Absolutely safe. All data processing happens in your browser and is never uploaded to our servers. You can even keep using most tools after going offline." }
    },
    {
      "@type": "Question",
      "name": "Which languages do the tools support?",
      "acceptedAnswer": { "@type": "Answer", "text": "The interface is in English. Text tools work with both English and Chinese input—for example, the Word Frequency Counter counts English words and Chinese characters, and the Chinese Converter handles Traditional/Simplified conversion." }
    },
    {
      "@type": "Question",
      "name": "Can I use them on my phone?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. All tools are responsive and work smoothly in mobile browsers." }
    },
    {
      "@type": "Question",
      "name": "How do I get help or send feedback?",
      "acceptedAnswer": { "@type": "Answer", "text": "Visit our contact page to send feedback; we keep improving and adding tools." }
    }
  ]
}
    </script>`;

// Inject before </main>
html = html.replace('  </main>', NEW_CONTENT + '\n  </main>');
fs.writeFileSync(fp, html, 'utf8');

const h2Count = (html.match(/<h2/g) || []).length;
console.log('OK index.html -> H2=' + h2Count + ', FAQ=5, sections added');
