// seo-faq.js — inject an FAQ block + FAQPage structured data into every tool page
// Rationale: adding a visible FAQ section improves on-page engagement and gives
// search engines expandable Q&A rich results.
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const EXCLUDE = new Set([
  "_cards.html", "index.html", "about.html", "contact.html", "privacy-policy.html",
  "404.html", "ai-studio.html",
  "baidu_verify_codeva-OivAbYsb29.html", "baidu_verify_codeva-cLcTPo9dNf.html",
  "googleaa6e10b4cdc3dee6.html"
]);

// never touch deployed Baidu/Google verification files
function isVerifyFile(f) { return f.startsWith("baidu_verify") || f.startsWith("google"); }

// 20 high-traffic tools with tailored English FAQ
const CUSTOM_FAQ = {
  "bmi-calculator.html": [
    ["What is a normal BMI?", "For adults, a healthy BMI typically falls between 18.5 and 24.9. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese. This tool shows your category directly, but it is for general reference only and is not a medical diagnosis."],
    ["Why do fit people sometimes have a high BMI?", "BMI does not distinguish muscle from fat. People with high muscle mass (e.g. athletes) weigh more, so their BMI may read 'overweight' while they are actually very healthy. It is best viewed alongside body-fat percentage."],
    ["Can children use this BMI calculator?", "This tool uses the adult formula and is suitable for ages 20+. Children and teens should use age- and sex-specific BMI percentile charts (pediatric standards)."]
  ],
  "calorie-calculator.html": [
    ["How does the calorie calculator estimate daily burn?", "It first computes your Basal Metabolic Rate (BMR) from height, weight, age and sex, then multiplies by your activity factor to get your total daily energy expenditure (TDEE)."],
    ["How many calories should I eat to lose weight?", "A daily deficit of 300–500 kcal below your TDEE produces a gentle, sustainable loss of about 0.3–0.5 kg per week."],
    ["Are the results accurate?", "Based on widely used formulas like Mifflin-St Jeor, they are reasonably accurate for the average person; individual metabolism varies, so treat them as a reference, not an absolute."]
  ],
  "compound-interest-calculator.html": [
    ["How exactly does compound interest work?", "The formula is principal × (1 + annual rate) ^ periods. Interest is added back to the principal and earns further interest — 'interest on interest' — and the effect grows dramatically over time."],
    ["Can it model monthly recurring investments?", "Yes. Besides an initial principal, you can set monthly or annual contributions to simulate the compound-growth curve of real-world dollar-cost averaging."],
    ["What annual return should I assume?", "Long-run historical data shows broad equity index returns of roughly 7%–10% per year (before inflation). Treat that as a reference range only — investing carries risk."]
  ],
  "discount-calculator.html": [
    ["How do I calculate the price after a discount?", "Multiply the original price by (1 − discount rate). For example, 20% off means original × 0.8. This tool outputs the result as soon as you enter the price and rate."],
    ["Is a threshold discount or a percentage-off better?", "Compare both to be sure. Threshold offers (e.g. spend 200, save 30) have minimums; percentage-off has none, so for small orders percentage-off is often better."],
    ["Does the result include tax?", "This tool shows the discounted product price only — no tax or shipping. Estimate those separately."]
  ],
  "age-calculator.html": [
    ["Can age be calculated to the exact day?", "Yes. Enter your birth date and the tool returns the years, months and days elapsed — precise to the day."],
    ["Does it show full age or nominal age?", "It defaults to the internationally used exact age. Nominal age follows traditional custom (usually exact age + 1) and can be converted manually."],
    ["Can it handle very old dates?", "Yes, it supports any historical date, even births over a century ago."]
  ],
  "json-formatter.html": [
    ["Does JSON formatting leak my data?", "No. All parsing and formatting happen locally in your browser; nothing is uploaded to any server, so it stays private."],
    ["How large a JSON file is supported?", "Anything within your browser's memory is fine; files of a few MB are effortless, while very large files may be limited by your device's memory."],
    ["Can it help me find syntax errors?", "Yes. When the JSON is invalid, it points to roughly where the error is so you can fix it quickly."]
  ],
  "base64-encoder.html": [
    ["Is Base64 encryption?", "No. Base64 is merely an encoding that anyone can decode; never treat it as encryption to protect passwords or sensitive data."],
    ["Is my data uploaded during processing?", "No. Encoding/decoding runs entirely in your browser locally; content is never uploaded, making it safe for sensitive text."],
    ["Can non-Latin text like Chinese be Base64-encoded?", "Yes. The tool handles non-Latin characters correctly via UTF-8, with no garbling."]
  ],
  "password-generator.html": [
    ["Are the generated passwords secure?", "Yes. It uses the browser's built-in cryptographic random generator (crypto) for high randomness that is hard to guess or brute-force."],
    ["Are passwords saved?", "No. Passwords are generated and shown only on your device — never stored or uploaded — and disappear when you close the page, so keep them somewhere safe yourself."],
    ["How long should a password be?", "For important accounts, 16+ characters combining upper/lowercase letters, digits and symbols significantly raises resistance to cracking."]
  ],
  "qr-code-generator.html": [
    ["Will the generated QR code actually work?", "Yes. It follows the standard QR spec and is scannable by phone cameras, WeChat and other readers."],
    ["How much can a QR code store?", "URLs, text, contact info and more. The longer the content, the denser the pattern — keep it reasonably short for easy scanning."],
    ["Is this tool free?", "Completely free; codes are generated locally in your browser and can be downloaded as a PNG in one click."]
  ],
  "word-counter.html": [
    ["Is the word count accurate?", "Yes. It counts characters, words and paragraphs separately, applying the rules for each language, and also tallies spaces and punctuation."],
    ["Is my document uploaded?", "No. All counting happens locally in your browser, so even long texts never leave your device."],
    ["Can it estimate reading time?", "Yes. At an average reading speed (~200–300 words/min) it estimates how long the piece will take, helping you control length."]
  ],
  "uuid-generator.html": [
    ["Can a UUID repeat?", "This tool generates v4 random UUIDs with an astronomically large combination space, so the practical chance of a collision is negligible."],
    ["Is data uploaded during generation?", "No. UUIDs are generated randomly in your browser locally; nothing is uploaded."],
    ["What are UUIDs used for?", "Commonly as database primary keys, request IDs in distributed systems, session identifiers, file names — anywhere a globally unique ID is needed."]
  ],
  "timestamp-converter.html": [
    ["What is a timestamp?", "Usually a Unix timestamp: the number of seconds (or milliseconds) since 1970-01-01 00:00:00 UTC."],
    ["How are time zones handled?", "A timestamp itself is time-zone independent; this tool converts bidirectionally between UTC and your local time."],
    ["Does conversion need internet?", "No. Time math runs entirely in your browser locally."]
  ],
  "percentage-calculator.html": [
    ["How do I calculate a percentage?", "Basic formula: part ÷ whole × 100%. For example, 20 out of 80 is 25%."],
    ["How do I calculate percentage growth?", "Use (new − old) ÷ old × 100%. Positive means up, negative means down."],
    ["Is this tool free?", "Free, computed locally in your browser, no sign-up needed."]
  ],
  "unit-converter.html": [
    ["Which units can it convert?", "Length, weight, temperature, volume, area, speed and many other common unit types."],
    ["Are the results accurate?", "It uses internationally standard conversion factors, so results are reliable."],
    ["Is this tool free?", "Completely free, ready to use instantly, no sign-up or login."]
  ],
  "roman-numeral-converter.html": [
    ["How large a range does Roman numerals support?", "Typically 1–3999, the standard range for classic Roman numerals; larger numbers need special notation."],
    ["How do Arabic numbers convert to Roman?", "By accumulating I/V/X/L/C/D/M with the 'subtraction rule' (e.g. IV=4), done automatically by the tool."],
    ["Is this tool free?", "Free, converted locally in your browser, no sign-up."]
  ],
  "ai-blog-writer.html": [
    ["Is AI blog writing free?", "Free. You get 5 free uses per day; the GLM model costs 0.5 credit and DeepSeek 1 credit per use. When credits run out you can get more in AI Studio."],
    ["Can the generated article be used commercially?", "Yes. Content the tool produces belongs to you and can be used for blogs, social media, marketing or any purpose."],
    ["Does it support Chinese input?", "Yes. You can enter a Chinese topic and get a Chinese or bilingual article, and also specify tone and length."]
  ],
  "ai-product-description.html": [
    ["Is AI product-description writing free?", "Free. 5 free uses per day (GLM 0.5, DeepSeek 1); top up in AI Studio when used up."],
    ["Can the descriptions be used commercially?", "Yes. The content is yours and can go straight to Taobao, Amazon, your own store, etc."],
    ["Which platforms does it suit?", "Taobao, JD, Amazon, Shopify stores, Xiaohongshu shops and other e-commerce copy needs."]
  ],
  "ai-seo-meta-generator.html": [
    ["Is AI meta generation free?", "Free. 5 uses per day (GLM 0.5, DeepSeek 1); top up in AI Studio when used up."],
    ["What does it generate?", "In one go it produces an SEO title, description and keywords, following length guidance from major search engines."],
    ["Are the title lengths compliant?", "It aims for Google's suggestions (title ~60 chars, description ~155 chars) to reduce truncation."]
  ],
  "ai-content-rewriter.html": [
    ["Is AI rewriting free?", "Free. 5 uses per day (GLM 0.5, DeepSeek 1); get more in AI Studio when credits run out."],
    ["Will rewriting drift from the original meaning?", "No. It follows 'keep the meaning, change the wording' — good for de-duplication, polishing and localization; you can fine-tune."],
    ["Can the rewritten content be used commercially?", "Yes. Results belong to you and suit commercial use in articles and copy."]
  ],
  "ai-email-subject.html": [
    ["Is AI email-subject writing free?", "Free. 5 uses per day (GLM 0.5, DeepSeek 1); top up in AI Studio when used up."],
    ["How many subjects per run?", "It gives several alternatives in different styles (professional, click-worthy, urgent) — pick the best fit."],
    ["Can the content be used commercially?", "Yes. The subjects are yours and can go straight into email marketing, EDM, etc."]
  ]
};

// category templates (for pages outside the 20 custom ones)
function tpl(category, cn, en) {
  const name = en || cn;
  if (category === "ai") {
    return [
      [name + " free to use?", "Free. You get 5 free uses per day; the GLM model costs 0.5 credit and DeepSeek 1 credit per use. When credits run out you can get more in AI Studio."],
      ["Can the generated content be used commercially?", "Yes. Content the tool produces belongs to you and can be used commercially without extra licensing."],
      ["Does it support Chinese input?", "Yes. You can enter a Chinese topic or material and get Chinese or bilingual results, and also specify tone and style."]
    ];
  }
  if (category === "calculator") {
    return [
      [name + " free to use?", "Yes. " + name + " is completely free, no sign-up needed, and works right in your browser — all calculations run locally, so your data is never uploaded."],
      [name + " supports which units or formats?", "It switches between metric and imperial and many other units/formats, showing results instantly — handy for daily, financial and health scenarios."],
      ["Are the results accurate?", "Calculated in real time from standard formulas, results are reliable; treat them as reference and consult a professional for important decisions."]
    ];
  }
  if (category === "converter") {
    return [
      [name + " free to use?", "Yes. " + name + " is free, no sign-up needed, and conversions run locally in your browser — your data is never uploaded."],
      [name + " supports which formats or units?", "It converts between common formats and units instantly with simple input."],
      ["Will converting leak my data?", "No. All processing happens locally in your browser; nothing is uploaded to any server."]
    ];
  }
  if (category === "fun") {
    return [
      [name + " free?", "Completely free, ready to use in your browser, no sign-up needed."],
      ["How do I use it?", "Just follow the on-screen prompts; results show instantly and can be copied or redone."],
      ["Is data uploaded?", "No. All computation runs locally in your browser, protecting your privacy."]
    ];
  }
  // text / developer default
  return [
    [name + " need internet?", "No. All processing runs locally in your browser; data is never uploaded, and it works offline too."],
    [name + " support large files or batch?", "Within your browser's performance limits it handles fairly large content; the exact ceiling depends on your device's memory."],
    [name + " free to use?", "Yes, completely free, no sign-up needed, ready to use instantly."]
  ];
}

function blogTpl(title) {
  return [
    ["What does this guide on " + title + " cover?", "This article systematically explains the core methods and practical steps for " + title + ", and recommends FreeToolset's free online tools so you can finish quickly in your browser — no sign-up, everything processed locally."],
    ["Where can I practice?", "The 'Related Tools' section at the end lists the matching free tools on FreeToolset — open and use them instantly; all calculations run locally, protecting your privacy."],
    ["Do these tools cost anything?", "All FreeToolset tools are free, run in your browser locally and never upload your data — safe for study and work."]
  ];
}

function categoryOf(file) {
  if (file.startsWith("ai-")) return "ai";
  if (file.includes("calculator")) return "calculator";
  if (file.includes("converter") || file.includes("-to-")) return "converter";
  if (["dice-roller.html", "stopwatch.html", "timer.html", "random-number-generator.html",
       "fancy-text-generator.html", "lorem-ipsum-generator.html", "morse-code-translator.html",
       "text-repeater.html", "reverse-text.html"].includes(file)) return "fun";
  return "text";
}

function detectEol(s) { return s.includes("\r\n") ? "\r\n" : "\n"; }

let done = 0, skipped = 0;
const files = fs.readdirSync(ROOT).filter(f => f.endsWith(".html") && !EXCLUDE.has(f) && !isVerifyFile(f));
for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, "utf8");
  if (html.includes("<!-- ft-zh-faq -->")) { skipped++; continue; }

  const m = html.match(/<title>([^<]*)<\/title>/);
  if (!m) { skipped++; continue; }
  const title = m[1];
  const cn = (title.split("·")[1] || "").split("|")[0].trim() || title.split("|")[0].trim();
  const en = (title.split("·")[0] || title).split("|")[0].trim();

  const faqs = CUSTOM_FAQ[f] || tpl(categoryOf(f), cn, en);
  const eol = detectEol(html);

  // English FAQ HTML
  const faqHtml = [
    '          <!-- ft-faq -->',
    '          <details class="faq-item">',
    '            <summary>' + faqs[0][0] + '</summary>',
    '            <p>' + faqs[0][1] + '</p>',
    '          </details>',
    '          <details class="faq-item">',
    '            <summary>' + faqs[1][0] + '</summary>',
    '            <p>' + faqs[1][1] + '</p>',
    '          </details>',
    '          <details class="faq-item">',
    '            <summary>' + faqs[2][0] + '</summary>',
    '            <p>' + faqs[2][1] + '</p>',
    '          </details>'
  ].join(eol);

  // Inject before the end of the FAQ info-section (the FAQ section has no div; the first </div> marks its end)
  const faqRe = /(<h2>❓ FAQ<\/h2>[\s\S]*?)(<\/div>)/;
  if (!faqRe.test(html)) { skipped++; continue; }
  html = html.replace(faqRe, "$1" + eol + faqHtml + eol + "$2");

  // FAQPage schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(([q, a]) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };
  const schemaHtml = '  <!-- ft-faq-schema -->\n  <script type="application/ld+json">\n' +
    JSON.stringify(schema, null, 2) + "\n  </script>";
  html = html.replace(/(<\/head>)/, schemaHtml + "\n$1");

  fs.writeFileSync(fp, html, "utf8");
  done++;
}

// Blog pages: no FAQ section, so insert the English FAQ section directly before </article>
const blogDir = path.join(ROOT, "blog");
if (fs.existsSync(blogDir)) {
  const bfiles = fs.readdirSync(blogDir).filter(f => f.endsWith(".html"));
  for (const f of bfiles) {
    const fp = path.join(blogDir, f);
    let html = fs.readFileSync(fp, "utf8");
    if (html.includes("<!-- ft-zh-faq -->")) continue;
    const m = html.match(/<title>([^<]*)<\/title>/);
    if (!m) continue;
    const title = m[1];
    const cleanTitle = (title.split("·")[1] || title).split("|")[0].trim();
    const faqs = blogTpl(cleanTitle);
    const eol = detectEol(html);
    const faqHtml = [
      '      <!-- ft-zh-faq -->',
      '      <section class="info-section" style="margin-top:32px">',
      '        <h2>❓ Frequently Asked Questions</h2>',
      '        <details class="faq-item">',
      '          <summary>' + faqs[0][0] + '</summary>',
      '          <p>' + faqs[0][1] + '</p>',
      '        </details>',
      '        <details class="faq-item">',
      '          <summary>' + faqs[1][0] + '</summary>',
      '          <p>' + faqs[1][1] + '</p>',
      '        </details>',
      '        <details class="faq-item">',
      '          <summary>' + faqs[2][0] + '</summary>',
      '          <p>' + faqs[2][1] + '</p>',
      '        </details>',
      '      </section>'
    ].join(eol);
    if (!html.includes("</article>")) continue;
    html = html.replace(/(<\/article>)/, faqHtml + eol + "$1");
    const schema = {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": faqs.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
    };
    const schemaHtml = '  <!-- ft-faq-schema -->\n  <script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + "\n  </script>";
    html = html.replace(/(<\/head>)/, schemaHtml + "\n$1");
    fs.writeFileSync(fp, html, "utf8");
    done++;
  }
}

console.log("FAQ injection complete: " + done + " pages updated, " + skipped + " skipped");
