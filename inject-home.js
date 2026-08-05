/* inject-home.js — 在首页 hero 后、Divider 前插入分类导航区块 */
const fs = require("fs");
const ROOT = ".";
const f = ROOT + "/index.html";
let html = fs.readFileSync(f, "utf8");

const block = `    <!-- Category Pages Nav -->
    <section class="cat-nav-section">
      <h2 class="cat-nav-title">按分类浏览全部工具</h2>
      <div class="tool-grid">
        <a class="tool-card" href="ai-tools.html"><h3>✨ AI 写作工具</h3><p>6 个免费 AI 文案生成器</p></a>
        <a class="tool-card" href="calculators.html"><h3>🧮 计算器</h3><p>15 个免费在线计算器</p></a>
        <a class="tool-card" href="converters.html"><h3>🔄 单位转换器</h3><p>12 个免费转换工具</p></a>
        <a class="tool-card" href="text-tools.html"><h3>📝 文本处理工具</h3><p>12 个免费文本工具</p></a>
        <a class="tool-card" href="developer-tools.html"><h3>🛠 开发者工具</h3><p>26 个免费开发工具</p></a>
        <a class="tool-card" href="fun-tools.html"><h3>🎲 趣味小工具</h3><p>4 个免费趣味工具</p></a>
      </div>
    </section>

`;

if(html.includes("cat-nav-section")){
  console.log("首页分类导航已存在，跳过");
} else {
  const marker = "<!-- Divider -->";
  const idx = html.indexOf(marker);
  if(idx < 0){ console.log("未找到 Divider 标记"); process.exit(1); }
  html = html.slice(0, idx) + block + html.slice(idx);
  fs.writeFileSync(f, html, "utf8");
  console.log("首页分类导航注入完成 ✅");
}
