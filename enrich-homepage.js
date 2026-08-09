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
    <section class="home-why" aria-label="为什么选择 FreeToolset">
      <h2>为什么选择 FreeToolset？</h2>
      <div class="why-grid">
        <div class="why-item">
          <h3>🔒 隐私优先</h3>
          <p>所有工具在浏览器本地运行，你的数据不会上传到任何服务器。处理敏感代码、财务数据或个人文本时也能放心使用。</p>
        </div>
        <div class="why-item">
          <h3>⚡ 即开即用</h3>
          <p>无需注册、下载或安装。打开网页即可使用 95+ 款免费在线工具，支持桌面端和手机浏览器。</p>
        </div>
        <div class="why-item">
          <h3>🛠️ 覆盖全面</h3>
          <p>从 JSON 格式化、正则测试等<strong>开发者工具</strong>，到 BMI、房贷等<strong>计算器</strong>，再到词频统计、文本对比等<strong>文本处理工具</strong>，一站式满足日常需求。</p>
        </div>
        <div class="why-item">
          <h3>📱 响应式设计</h3>
          <p>所有工具适配各种屏幕尺寸。在电脑前深度工作，或在手机上快速查询，都有流畅体验。</p>
        </div>
      </div>
    </section>

    <section id="home-faq" class="home-faq-section" aria-label="常见问题">
      <h2>常见问题</h2>
      <dl class="faq-list">
        <dt>FreeToolset 的工具真的完全免费吗？</dt>
        <dd>是的，所有 95+ 个工具完全免费使用，无需注册账号，没有隐藏收费，也没有广告干扰。</dd>
        <dt>我的数据安全吗？</dt>
        <dd>绝对安全。所有数据处理都在你的浏览器中完成，不会上传到我们的服务器。你甚至可以断网后继续使用大部分工具。</dd>
        <dt>支持中文吗？</dt>
        <dd>支持。我们的界面提供中英文双语，部分工具（如词频统计、中文转换）专门针对中文文本优化。</dd>
        <dt>可以在手机上使用吗？</dt>
        <dd>可以。所有工具采用响应式设计，在手机浏览器上同样可以流畅操作。</dd>
        <dt>如何获取帮助或反馈建议？</dt>
        <dd>请访问我们的 <a href="contact.html">联系页面</a> 提交反馈，我们会持续改进和新增工具。</dd>
      </dl>
    </section>

    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "FreeToolset 的工具真的完全免费吗？",
      "acceptedAnswer": { "@type": "Answer", "text": "是的，所有 95+ 个工具完全免费使用，无需注册账号，没有隐藏收费，也没有广告干扰。" }
    },
    {
      "@type": "Question",
      "name": "我的数据安全吗？",
      "acceptedAnswer": { "@type": "Answer", "text": "绝对安全。所有数据处理都在你的浏览器中完成，不会上传到我们的服务器。你甚至可以断网后继续使用大部分工具。" }
    },
    {
      "@type": "Question",
      "name": "支持中文吗？",
      "acceptedAnswer": { "@type": "Answer", "text": "支持。我们的界面提供中英文双语，部分工具（如词频统计、中文转换）专门针对中文文本优化。" }
    },
    {
      "@type": "Question",
      "name": "可以在手机上使用吗？",
      "acceptedAnswer": { "@type": "Answer", "text": "可以。所有工具采用响应式设计，在手机浏览器上同样可以流畅操作。" }
    },
    {
      "@type": "Question",
      "name": "如何获取帮助或反馈建议？",
      "acceptedAnswer": { "@type": "Answer", "text": "请访问我们的联系页面提交反馈，我们会持续改进和新增工具。" }
    }
  ]
}
    </script>`;

// Inject before </main>
html = html.replace('  </main>', NEW_CONTENT + '\n  </main>');
fs.writeFileSync(fp, html, 'utf8');

const h2Count = (html.match(/<h2/g) || []).length;
console.log('OK index.html -> H2=' + h2Count + ', FAQ=5, sections added');
