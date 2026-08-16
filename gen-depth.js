/**
 * FreeToolset tool-page depth injector (idempotent).
 * Adds a "📖 Deep Dive" section (why / principle / example / myths) to each
 * tool page, complementing the sidebar How-to/FAQ/Use Cases. Uses category
 * templates + per-tool use cases for uniqueness. Guarded by <!-- ft-deep -->.
 */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const T = require("./tools-data.js");

// Category templates. {n} = tool title.
const CAT = {
  calculator: {
    principle: n => `${n} plugs several inputs into a fixed mathematical formula and computes the result in real time. Compared with manual calculation or a temporary spreadsheet, an online tool saves you from memorizing formulas and handling units—results appear as you type, and you can even work backwards.`,
    example: n => `For example, when using ${n}, fill in the key parameters and the result updates instantly; tweak any input and you can see directly how the output changes, making "what if" explorations easy.`,
    myths: ["Looking only at a single result while ignoring conditions and assumptions", "Treating an estimate as a precise conclusion", "Ignoring unit differences (metric/imperial) that cause order-of-magnitude errors"],
    why: ["Get accurate results fast, no manual math", "Make instant decisions in shopping, finance, and health scenarios", "Support reverse derivation to explore how inputs affect the outcome"]
  },
  converter: {
    principle: n => `${n} maps one unit to its equivalent in others via a fixed conversion coefficient. Watch out for decimal vs binary coefficients (e.g., storage units) and the metric/imperial difference.`,
    example: n => `For example, enter a common unit into ${n} and instantly see its equivalent in others; switching metric/imperial recalculates automatically—no manual coefficient needed.`,
    myths: ["Confusing decimal and binary units (e.g., KB vs KiB)", "Ignoring imperial/metric conversion coefficients", "Treating an approximate conversion as an exact value"],
    why: ["Cross-system communication without friction", "Instant conversion while cooking, renovating, or studying", "Avoid errors from misremembered coefficients"]
  },
  text: {
    principle: n => `${n} transforms strings (reverse, replace, clean, convert, etc.) entirely in the browser. It's pure front-end processing—your text never leaves your device, ideal for private documents.`,
    example: n => `For example, paste a paragraph with messy line breaks or extra spaces into ${n}, click once, and get a clean version to copy back where you need it.`,
    myths: ["Using an online tool that requires uploads when handling sensitive documents", "Causing wrong replacements by overlooking case or regex", "Breaking the original paragraph structure while cleaning whitespace"],
    why: ["Automate repetitive text operations", "Clean up messy text copied from elsewhere", "Batch-editing words and formats to save time"]
  },
  developer: {
    principle: n => `${n} targets development and debugging—formatting, compressing, or decoding locally without sending tokens, code, or other sensitive content to third-party servers.`,
    example: n => `For example, paste a JWT or CSV into ${n} and it parses or converts locally immediately; results can be copied directly, with sensitive data never leaving the browser.`,
    myths: ["Mistaking decodable content like JWT for encrypted", "Losing readable source after compression, making issues hard to debug", "Using an upload-required online tool for keys/tokens"],
    why: ["Format conversion and debugging with no environment setup", "Safer local handling of sensitive data", "Turn tedious scripts into one-click operations"]
  },
  fun: {
    principle: n => `${n} is a lightweight fun or productivity tool that generates random results or times events locally in your browser—no install, no trace left when you close the page.`,
    example: n => `For example, set the range or duration and launch ${n} with one click; the whole process runs locally—great for decisions, hosting, or relaxation.`,
    myths: ["Using pseudo-random output as true random for high-security scenarios", "Background timers being throttled by the browser, reducing accuracy", "Lacking randomness guarantees when using fun results for serious decisions"],
    why: ["Lightweight fun/productivity, no install", "Local random and timing, ready to use", "Privacy-preserving, no trace when closed"]
  }
};

// Original 25 tools (non-AI) → category. AI pages excluded (different template).
const OLD = {
  "base64-encoder.html": "developer",
  "json-formatter.html": "developer",
  "password-generator.html": "fun",
  "password-strength-checker.html": "fun",
  "uuid-generator.html": "developer",
  "url-encoder.html": "developer",
  "timestamp-converter.html": "converter",
  "regex-tester.html": "developer",
  "base-converter.html": "converter",
  "image-compressor.html": "fun",
  "image-to-base64.html": "fun",
  "qr-code-generator.html": "fun",
  "word-counter.html": "text",
  "lorem-ipsum-generator.html": "text",
  "text-case-converter.html": "text",
  "color-picker.html": "fun",
  "hash-generator.html": "developer",
  "line-tools.html": "text",
  "port-lookup.html": "developer"
};

function titleOf(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/[—\-|]\s*FreeToolset[\s\S]*$/i, "").replace(/\s*\|?\s*FreeToolset.*$/i, "").trim() : "";
}
function descOf(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  return m ? m[1] : "";
}

// Build the per-tool job list
const jobs = [];
T.forEach(t => {
  jobs.push({
    file: t.slug + ".html",
    name: t.title,
    category: t.category,
    why: (t.usecases || []).map(u => u.title)
  });
});
Object.keys(OLD).forEach(f => {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) return;
  const html = fs.readFileSync(fp, "utf8");
  jobs.push({
    file: f,
    name: titleOf(html) || f,
    category: OLD[f],
    why: null,
    desc: descOf(html)
  });
});

function buildSection(j) {
  const c = CAT[j.category] || CAT.fun;
  const whyItems = (j.why && j.why.length ? j.why : c.why).map(i => "      <li>" + i + "</li>").join("\n");
  const mythItems = c.myths.map(i => "      <li>" + i + "</li>").join("\n");
  return (
    "  <!-- ft-deep -->\n" +
    '  <section class="tool-deep">\n' +
    "    <h2>📖 Deep Dive: " + j.name + "</h2>\n" +
    "    <h2>Why you need it</h2>\n" +
    "    <ul>\n" + whyItems + "\n    </ul>\n" +
    "    <h2>How it works</h2>\n" +
    "    <p>" + c.principle(j.name) + "</p>\n" +
    "    <h2>An example</h2>\n" +
    "    <p>" + c.example(j.name) + "</p>\n" +
    "    <h2>Common misconceptions</h2>\n" +
    "    <ul>\n" + mythItems + "\n    </ul>\n" +
    "  </section>\n"
  );
}

let changed = 0, skipped = 0, noanchor = 0;
jobs.forEach(j => {
  const fp = path.join(ROOT, j.file);
  if (!fs.existsSync(fp)) { console.log("SKIP missing:", j.file); return; }
  let html = fs.readFileSync(fp, "utf8");
  if (html.includes("<!-- ft-deep -->")) { skipped++; return; }
  const anchor = '<nav class="breadcrumb">';
  const idx = html.indexOf(anchor);
  if (idx === -1) { noanchor++; console.log("NO ANCHOR:", j.file); return; }
  const sec = buildSection(j);
  html = html.replace(anchor, sec + "    " + anchor);
  fs.writeFileSync(fp, html, "utf8");
  changed++;
});
console.log("\nDepth section: changed=" + changed + " skipped=" + skipped + " no-anchor=" + noanchor + " / total=" + jobs.length);
