const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'blog');
const ctaHtml = `
    <div style="margin:18px 0 24px; padding:16px 20px; background:#eef2ff; border:1px solid #e0e7ff; border-radius:12px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
      <div>
        <div style="font-weight:700; font-size:0.98rem; color:#3730a3; margin-bottom:2px;">✨ 用 AI 一键完成类似任务</div>
        <div style="font-size:0.85rem; color:#4b5563;">FreeToolset AI Content Studio 免费可用，每日赠送 5 Credits，无需注册。</div>
      </div>
      <a href="../ai-studio.html" style="display:inline-block; padding:9px 18px; background:#4f46e5; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; white-space:nowrap;">试用 AI Studio →</a>
    </div>
`;

let count = 0;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
for (const f of files) {
  const fp = path.join(dir, f);
  let h = fs.readFileSync(fp, 'utf8');
  if (h.includes('试用 AI Studio →')) continue; // idempotent
  // inject after first </h1>
  const idx = h.indexOf('</h1>');
  if (idx === -1) continue;
  h = h.slice(0, idx + 5) + ctaHtml + h.slice(idx + 5);
  fs.writeFileSync(fp, h, 'utf8');
  count++;
}
console.log('Injected AI Studio CTA into', count, 'blog articles');
