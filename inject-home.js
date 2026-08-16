/* inject-home.js — insert a category-navigation block on the homepage, after the
   hero section and before the Divider. */
const fs = require("fs");
const ROOT = ".";
const f = ROOT + "/index.html";
let html = fs.readFileSync(f, "utf8");

const block = `    <!-- Category Pages Nav -->
    <section class="cat-nav-section">
      <h2 class="cat-nav-title">Browse all tools by category</h2>
      <div class="tool-grid">
        <a class="tool-card" href="ai-tools.html"><h3>✨ AI Writing Tools</h3><p>6 free AI copy generators</p></a>
        <a class="tool-card" href="calculators.html"><h3>🧮 Calculators</h3><p>15 free online calculators</p></a>
        <a class="tool-card" href="converters.html"><h3>🔄 Unit Converters</h3><p>12 free conversion tools</p></a>
        <a class="tool-card" href="text-tools.html"><h3>📝 Text Tools</h3><p>12 free text tools</p></a>
        <a class="tool-card" href="developer-tools.html"><h3>🛠 Developer Tools</h3><p>26 free developer tools</p></a>
        <a class="tool-card" href="fun-tools.html"><h3>🎲 Fun Tools</h3><p>4 free fun tools</p></a>
      </div>
    </section>

`;

if(html.includes("cat-nav-section")){
  console.log("Home category nav already exists, skipping");
} else {
  const marker = "<!-- Divider -->";
  const idx = html.indexOf(marker);
  if(idx < 0){ console.log("Divider marker not found"); process.exit(1); }
  html = html.slice(0, idx) + block + html.slice(idx);
  fs.writeFileSync(f, html, "utf8");
  console.log("Home category nav injected");
}
