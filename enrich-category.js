/* enrich-category.js — add H2 sections + FAQ + FAQPage schema to category pages.
   Injects between tool-grid </div> and </main>.
*/
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

// Category content data: about + FAQs for each category page
const CAT_CONTENT = {
  'developer-tools.html': {
    title: '开发者工具',
    slug: 'developer-tools',
    aboutH2: '为什么选择 FreeToolset 的开发者工具？',
    aboutHtml: `<p>FreeToolset 提供了 <strong>33 款免费在线开发工具</strong>，覆盖前端开发、后端调试、数据处理的日常需求。所有工具均在浏览器本地运行，<strong>代码和数据不会上传到任何服务器</strong>——这对处理敏感信息（如 API Key、JWT Token、私有配置）尤为重要。</p>
<p>无需安装 Node.js、Python 或任何 IDE 插件，打开浏览器即可使用。支持桌面端和移动端，在通勤路上也能快速格式化 JSON 或生成 UUID。我们持续更新工具列表，最近新增了 <a href="color-converter.html">颜色转换器</a>、<a href="url-parser.html">URL 解析器</a>、<a href="sql-formatter.html">SQL 格式化器</a>、<a href="xml-formatter.html">XML 格式化器</a>、<a href="yaml-to-json.html">YAML 转 JSON</a>、<a href="css-formatter.html">CSS 格式化器</a> 和 <a href="json-validator.html">JSON 校验器</a> 等实用工具。</p>`,
    faqs: [
      { q: '这些开发工具真的免费吗？', a: '是的，FreeToolset 的所有 95+ 个工具完全免费使用，无需注册账号，没有功能限制，也没有广告干扰。' },
      { q: '我的代码数据安全吗？会上传到服务器吗？', a: '绝对安全。所有数据处理都在你的浏览器中完成，代码和数据不会离开你的设备。即使断网也能正常使用大部分工具。' },
      { q: '支持哪些编程语言的格式化？', a: '目前支持 JSON、XML、YAML、SQL、CSS、HTML、JavaScript 的格式化和压缩，以及 Markdown 与 HTML 的互转。CSV 和 JSON 也可以相互转换。' },
      { q: '可以在手机上使用吗？', a: '可以。我们的工具采用响应式设计，在手机浏览器上同样可以流畅操作。适合在外出时紧急查看 JWT 内容或格式化一段 JSON。' },
      { q: '如何收藏常用的开发工具？', a: '直接在浏览器中将对应工具页面加入书签即可。每个工具都有独立 URL，方便分享给团队成员。' }
    ]
  },
  'calculators.html': {
    title: '计算器',
    slug: 'calculators',
    aboutH2: '免费在线计算器——生活、财务、健康一站式解决',
    aboutHtml: `<p>FreeToolset 收录了 <strong>20 款免费在线计算器</strong>，涵盖财务管理、健康评估、数学运算和日常换算场景。无论是计算房贷月供、BMI 指数、卡路里消耗，还是盈亏平衡点和增值税，都能在这里找到专业工具。</p>
<p>所有计算器均采用最新算法公式，结果即时显示，无需点击"计算"按钮。数据仅在浏览器本地处理，输入的财务数据和身体参数<strong>不会被记录或上传</strong>。最近新增了 <a href="break-even-calculator.html">盈亏平衡计算器</a>、<a href="vat-calculator.html">增值税计算器</a>、<a href="grade-calculator.html">成绩/等级计算器</a>、<a href="body-fat-calculator.html">体脂率计算器</a> 和 <a href="water-intake-calculator.html">每日饮水量计算器</a>。</p>`,
    faqs: [
      { q: '计算器的结果准确吗？', a: '我们的计算器采用标准数学和医学公式（如 Mifflin-St Jeor 卡路里公式、US Navy 体脂率公式），结果仅供参考，具体数值请以专业机构检测为准。' },
      { q: '需要注册才能使用吗？', a: '不需要。所有计算器即开即用，无需注册、登录或下载任何应用。' },
      { q: '我的输入数据会被保存吗？', a: '不会。所有计算在浏览器本地完成，页面关闭后数据即刻消失。我们不会存储任何用户输入。' },
      { q: '可以在手机上使用这些计算器吗？', a: '完全可以。响应式设计确保在手机屏幕上也有良好的输入体验，适合超市购物时算折扣或在健身房计算 BMI。' }
    ]
  },
  'text-tools.html': {
    title: '文本处理工具',
    slug: 'text-tools',
    aboutH2: '强大的在线文本处理——写作、SEO、数据分析必备',
    aboutHtml: `<p>FreeToolset 的 <strong>17 款文本处理工具</strong>满足从内容创作到技术文档的各种需求。无论你是 SEO 优化师需要统计词频、开发者需要对比文本差异，还是写作者需要排序去重，都能找到合适的工具。</p>
<p>支持中文和英文文本处理，大文件也能流畅运行。所有操作在浏览器本地完成，<strong>你的文章内容不会外泄</strong>。最近新增了 <a href="word-frequency-counter.html">词频统计器</a>、<a href="text-diff-checker.html">文本差异对比</a>、<a href="duplicate-line-remover.html">重复行删除</a>、<a href="text-sorter.html">文本排序工具</a> 和 <a href="chinese-converter.html">中文转换（繁简/大小写）</a>。</p>`,
    faqs: [
      { q: '支持处理多长的文本？', a: '大部分工具支持处理数万字以内的文本。词频统计器和文本差异对比工具针对大文件做了性能优化。' },
      { q: '支持中文文本处理吗？', a: '支持。词频统计器可分别统计英文单词和中文字符，中文转换工具支持繁简互换、大小写转换等。' },
      { q: '处理后的文本如何保存？', a: '可以直接复制结果，部分工具提供一键下载为 .txt 文件的功能。所有处理都在本地完成，无需上传。' },
      { q: '这些工具对 SEO 有什么帮助？', a: '词频统计器可以帮助分析关键词密度，文本排序和去重工具有助于整理结构化数据，都是 SEO 从业者的常用辅助工具。' }
    ]
  },
  'fun-tools.html': {
    title: '趣味小工具',
    slug: 'fun-tools',
    aboutH2: '轻松有趣的在线小工具——决策、娱乐、随机生成',
    aboutHtml: `<p>工作之余也需要放松一下。FreeToolset 的 <strong>7 款趣味小工具</strong>帮你做随机决策、生成有趣内容、给生活加点小惊喜。从抛硬币做决定到随机取名，从掷骰子到团队分组，让枯燥的日常多一点乐趣。</p>
<p>所有趣味工具完全免费，界面简洁有趣，适合分享给朋友一起玩。最近新增了 <a href="coin-flip.html">抛硬币</a>、<a href="random-name-picker.html">随机名字抽取器</a> 和 <a href="random-team-generator.html">随机分组生成器</a>。</p>`,
    faqs: [
      { q: '抛硬币的结果是真正随机的吗？', a: '是的。我们使用加密安全的随机数生成器（crypto.getRandomValues），每次结果都不可预测，公平公正。' },
      { q: '随机名字抽取器支持自定义名单吗？', a: '支持。你可以输入任意名字列表，工具会从中随机抽取一个或多个，适合课堂点名、抽奖等场景。' },
      { q: '这些工具可以离线使用吗？', a: '可以。一旦页面加载完成，即使断开网络也能继续使用所有随机功能。' }
    ]
  },
  'converters.html': {
    title: '单位转换器',
    slug: 'converters',
    aboutH2: '全面的单位换算工具——科学、烹饪、旅行全覆盖',
    aboutHtml: `<p>FreeToolset 提供 <strong>12 款单位转换器</strong>，覆盖长度、重量、温度、速度、面积、体积、时间、数据存储等常见维度。无论是厨房里的烘焙换算、出国旅行的货币/温度转换，还是程序员的数据单位换算，都能快速得到准确结果。</p>
<p>转换算法基于国际标准定义，结果精确可靠。界面简洁直观，选择单位和输入数值后即时显示结果，无需等待。</p>`,
    faqs: [
      { q: '支持哪些单位的转换？', a: '覆盖公制（SI）、英制、美制、中国市制等单位制式。包括米/英尺/英寸、千克/磅/盎司、摄氏/华氏/开尔文等常见单位。' },
      { q: '转换结果准确吗？', a: '准确。我们使用标准换算系数，大部分转换精度可达小数点后 10 位以上。' },
      { q: '可以反向转换吗？', a: '可以。只需交换单位选择即可自动反向计算，非常方便。' }
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
    <section class="cat-about" aria-label="${esc(cat.title)}介绍">
      <h2>${esc(cat.aboutH2)}</h2>
      ${cat.aboutHtml}
    </section>

    <section id="faq-section" class="cat-faq" aria-label="常见问题">
      <h2>${esc(cat.title)}常见问题</h2>
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
