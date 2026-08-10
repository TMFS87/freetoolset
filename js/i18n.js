/**
 * FreeToolset — lightweight EN / 中文 (zh-CN) language switcher.
 *
 * How it works:
 *   - Any element with a `data-i18n="<key>"` attribute gets translated.
 *   - `DICT[key]` holds the Chinese translation. The English text is the
 *     element's original inner HTML (captured on first run), so toggling
 *     back to English always restores the exact original markup.
 *   - The choice is persisted in localStorage and re-applied on load.
 *   - The 🌐 button (`.nav-lang`) calls window.toggleLang().
 */
(function () {
  'use strict';

  // key (usually the English text) -> Simplified Chinese
  var DICT = {
    // ---- Page titles ----
    'homePageTitle': 'FreeToolset — 95+免费在线工具与AI写作助手、二维码、密码生成等 | 无需登录',
    // ---- AI Studio payment modal ----
    'creditsValidNote': '积分自购买起 2 个月内有效，可在全部 AI 工具中使用。',
    // ---- Shared chrome: navbar ----
    'Home': '首页',
    'heroPlaceholder': '✨ 让 AI 写点什么……例如：为智能手表写一段产品描述',
    'qt_ProductDescription': '📦 产品描述',
    'qt_BlogPost': '📝 博客文章',
    'qt_SEOMetaTags': '🔍 SEO Meta 标签',
    'qt_RewriteContent': '🔄 改写内容',
    'catNavTitle': '按分类浏览全部工具',
    'catTitle_ai-tools': '✨ AI 写作工具',
    'catDesc_ai-tools': '6 个免费 AI 文案生成器',
    'catTitle_calculators': '🧮 计算器',
    'catDesc_calculators': '15 个免费在线计算器',
    'catTitle_converters': '🔄 单位转换器',
    'catDesc_converters': '12 个免费转换工具',
    'catTitle_text-tools': '📝 文本处理工具',
    'catDesc_text-tools': '12 个免费文本工具',
    'catTitle_developer-tools': '🛠 开发者工具',
    'catDesc_developer-tools': '26 个免费开发工具',
    'catTitle_fun-tools': '🎲 趣味小工具',
    'catDesc_fun-tools': '4 个免费趣味工具',
    'filterAI': '✨ AI',
    'filter_Calc': '🧮 计算器',
    'filter_Conv': '🔄 转换器',
    'filter_Fun': '🎲 趣味',
    'footerCopy': '© 2025 FreeToolset。所有工具均在浏览器本地运行，不会上传任何数据。',
    'cardTitle_ai-studio': '✨ AI 内容工作室',
    'cardDesc_ai-studio': '一站式 AI 写作助手，输入需求即可即时生成内容。',
    'cardTitle_ai-product-description': '📦 AI 产品描述生成器',
    'cardDesc_ai-product-description': '用 AI 生成有吸引力、高转化的产品描述。',
    'cardTitle_ai-seo-meta-generator': '🔍 AI SEO Meta 标签生成器',
    'cardDesc_ai-seo-meta-generator': '生成优化后的标题和描述，提升搜索排名。',
    'cardTitle_ai-blog-writer': '📝 AI 博客文章生成器',
    'cardDesc_ai-blog-writer': '用 AI 围绕任何主题写出结构完整的博客文章。',
    'cardTitle_ai-email-subject': '✉️ AI 邮件标题生成器',
    'cardDesc_ai-email-subject': '用 AI 生成 10 个高打开率的邮件主题。',
    'cardTitle_ai-content-rewriter': '🔄 AI 内容改写器',
    'cardDesc_ai-content-rewriter': '用 AI 改写和润色文本，可调整语气与变化程度。',
    'cardTitle_port-lookup': '🔌 端口查询',
    'cardDesc_port-lookup': '查询 TCP/UDP 端口号、协议、服务及安全风险。',
    'cardTitle_image-compressor': '🖼️ 图片压缩器',
    'cardDesc_image-compressor': '在浏览器中直接压缩和调整图片尺寸。',
    'cardTitle_qr-code-generator': '📱 二维码生成器',
    'cardDesc_qr-code-generator': '从网址或文本生成二维码，可自定义尺寸与格式。',
    'cardTitle_word-counter': '📝 字数统计器',
    'cardDesc_word-counter': '统计文本的字数、字符数、句数和段落数。',
    'cardTitle_password-generator': '🔐 密码生成器',
    'cardDesc_password-generator': '生成高强度的随机密码，可调整长度和复杂度。',
    'cardTitle_json-formatter': '🧩 JSON 格式化工具',
    'cardDesc_json-formatter': '即时格式化、验证和美化 JSON 数据。',
    'cardTitle_color-picker': '🎨 颜色选择器',
    'cardDesc_color-picker': '取色并在 HEX、RGB、HSL 格式之间转换。',
    'cardTitle_base64-encoder': '🔄 Base64 编码/解码器',
    'cardDesc_base64-encoder': '对文本进行 Base64 编码或解码。',
    'cardTitle_lorem-ipsum-generator': '📄 Lorem Ipsum 生成器',
    'cardDesc_lorem-ipsum-generator': '按段落生成占位用的 Lorem Ipsum 文本。',
    'cardTitle_url-encoder': '🔗 URL 编码/解码器',
    'cardDesc_url-encoder': '支持 encodeURI 与 encodeURIComponent 的 URL 编解码。',
    'cardTitle_hash-generator': '#️⃣ 哈希生成器',
    'cardDesc_hash-generator': '为任意文本生成 MD5、SHA-1、SHA-256、SHA-512 哈希值。',
    'cardTitle_uuid-generator': '🆔 UUID 生成器',
    'cardDesc_uuid-generator': '生成随机 UUID v4 标识符，支持批量生成最多 100 个。',
    'cardTitle_image-to-base64': '🖼️ 图片转 Base64',
    'cardDesc_image-to-base64': '将图片转换为 Base64 Data URI，方便内联嵌入。',
    'cardTitle_text-case-converter': '🔤 文本大小写转换器',
    'cardDesc_text-case-converter': '在大小写、首字母大写、驼峰式、下划线式等之间转换。',
    'cardTitle_timestamp-converter': '⏱️ 时间戳转换器',
    'cardDesc_timestamp-converter': 'Unix 时间戳与可读日期互转，支持秒/毫秒、UTC 与本地时间。',
    'cardTitle_regex-tester': '🔍 正则表达式测试器',
    'cardDesc_regex-tester': '实时测试正则表达式，高亮匹配结果并查看捕获组。',
    'cardTitle_base-converter': '🔢 进制转换器',
    'cardDesc_base-converter': '在二进制、八进制、十进制、十六进制之间即时转换。',
    'cardTitle_line-tools': '📋 行处理工具',
    'cardDesc_line-tools': '对文本行进行排序、去重、打乱、修剪，移除空行并转换大小写。',
    'cardTitle_password-strength-checker': '🛡️ 密码强度检测器',
    'cardDesc_password-strength-checker': '估算密码熵值、破解时间并给出改进建议。',
    'cardTitle_bmi-calculator': '🏋️ BMI 计算器',
    'cardDesc_bmi-calculator': '根据身高体重计算身体质量指数，支持公制与英制。',
    'cardTitle_age-calculator': '🎂 年龄计算器',
    'cardDesc_age-calculator': '精确计算周岁、月、日以及已活天数。',
    'cardTitle_percentage-calculator': '➗ 百分比计算器',
    'cardDesc_percentage-calculator': '计算 X% 的数值、占比以及百分比变化。',
    'cardTitle_loan-calculator': '🏦 贷款计算器',
    'cardDesc_loan-calculator': '估算月供、总利息及任意贷款的还款计划。',
    'cardTitle_mortgage-calculator': '🏠 房贷计算器',
    'cardDesc_mortgage-calculator': '根据房价、首付、利率和期限计算月供。',
    'cardTitle_tip-calculator': '💵 小费计算器',
    'cardDesc_tip-calculator': '计算小费金额并在多人之间分摊账单。',
    'cardTitle_discount-calculator': '🏷️ 折扣计算器',
    'cardDesc_discount-calculator': '计算任意折扣后的售价与节省金额。',
    'cardTitle_compound-interest-calculator': '📈 复利计算器',
    'cardDesc_compound-interest-calculator': '预测储蓄在复利和定期投入下的增长情况。',
    'cardTitle_gpa-calculator': '🎓 GPA 计算器',
    'cardDesc_gpa-calculator': '根据课程学分计算 4.0 制的加权 GPA。',
    'cardTitle_calorie-calculator': '🍎 卡路里计算器',
    'cardDesc_calorie-calculator': '估算每日热量需求（TDEE）和基础代谢（BMR）。',
    'cardTitle_sales-tax-calculator': '🧾 销售税计算器',
    'cardDesc_sales-tax-calculator': '即时为价格加上或扣除销售税/增值税。',
    'cardTitle_salary-calculator': '💼 薪资计算器',
    'cardDesc_salary-calculator': '在时薪、周薪、月薪、年薪之间换算。',
    'cardTitle_fuel-cost-calculator': '⛽ 燃油成本计算器',
    'cardDesc_fuel-cost-calculator': '根据距离和油耗估算行程燃油费用。',
    'cardTitle_roi-calculator': '💹 ROI 计算器',
    'cardDesc_roi-calculator': '计算投资回报率、净利润和年化收益。',
    'cardTitle_date-difference-calculator': '📅 日期差计算器',
    'cardDesc_date-difference-calculator': '计算两个日期之间的天数、周数和月数。',
    'cardTitle_unit-converter': '📐 单位转换器',
    'cardDesc_unit-converter': '在一个工具中转换长度、重量和温度单位。',
    'cardTitle_temperature-converter': '🌡️ 温度转换器',
    'cardDesc_temperature-converter': '在摄氏度、华氏度、开尔文之间即时转换。',
    'cardTitle_length-converter': '📏 长度转换器',
    'cardDesc_length-converter': '转换毫米、厘米、米、公里、英寸、英尺、码、英里。',
    'cardTitle_weight-converter': '⚖️ 重量转换器',
    'cardDesc_weight-converter': '转换毫克、克、千克、吨、盎司、磅、英石。',
    'cardTitle_speed-converter': '🚗 速度转换器',
    'cardDesc_speed-converter': '转换米/秒、公里/小时、英里/小时、英尺/秒和节。',
    'cardTitle_area-converter': '🗺️ 面积转换器',
    'cardDesc_area-converter': '转换平方米、平方英尺、英亩、公顷、平方公里和平方英里。',
    'cardTitle_volume-converter': '🧴 体积转换器',
    'cardDesc_volume-converter': '转换毫升、升、杯、品脱、夸脱和加仑。',
    'cardTitle_data-storage-converter': '💾 数据存储转换器',
    'cardDesc_data-storage-converter': '转换比特、字节、KB、MB、GB、TB 及二进制单位。',
    'cardTitle_time-unit-converter': '⏳ 时间单位转换器',
    'cardDesc_time-unit-converter': '转换秒、分、小时、天、周和年。',
    'cardTitle_roman-numeral-converter': '🏛️ 罗马数字转换器',
    'cardDesc_roman-numeral-converter': '在阿拉伯数字与罗马数字之间互相转换。',
    'cardTitle_number-to-words': '🔢 数字转英文单词',
    'cardDesc_number-to-words': '将任意数字用英文单词拼出，适用于支票和合同。',
    'cardTitle_binary-text-converter': '0️⃣ 文本转二进制',
    'cardDesc_binary-text-converter': '在文本与二进制之间互相转换。',
    'cardTitle_reverse-text': '🔄 文本反转',
    'cardDesc_reverse-text': '按字符、单词或行即时反转文本。',
    'cardTitle_text-repeater': '🔁 文本重复器',
    'cardDesc_text-repeater': '按指定次数和分隔符重复文本或单词。',
    'cardTitle_find-and-replace': '🔍 查找替换文本',
    'cardDesc_find-and-replace': '支持大小写不敏感和正则的查找替换。',
    'cardTitle_slug-generator': '🔗 URL Slug 生成器',
    'cardDesc_slug-generator': '将标题转换为干净、利于 SEO 的 URL slug。',
    'cardTitle_remove-line-breaks': '↵ 移除换行',
    'cardDesc_remove-line-breaks': '去除换行符，将文本合并为干净的段落。',
    'cardTitle_whitespace-remover': '🧹 空白清理器',
    'cardDesc_whitespace-remover': '修剪、合并空格、移除空行并清理文本。',
    'cardTitle_text-to-speech': '🔊 文本转语音',
    'cardDesc_text-to-speech': '用可调的语音、语速和音调朗读任意文本。',
    'cardTitle_fancy-text-generator': '✨ 花样字体生成器',
    'cardDesc_fancy-text-generator': '创建酷炫的 Unicode 字体，用于简介、帖子和用户名。',
    'cardTitle_html-encoder': '</> HTML 编码/解码器',
    'cardDesc_html-encoder': '编码或解码 HTML 实体，安全地显示标记内容。',
    'cardTitle_css-minifier': '🎨 CSS 压缩器',
    'cardDesc_css-minifier': '通过移除注释和空白来压缩 CSS。',
    'cardTitle_json-minifier': '🗜️ JSON 压缩器',
    'cardDesc_json-minifier': '压缩并验证 JSON，减小传输体积。',
    'cardTitle_html-minifier': '📄 HTML 压缩器',
    'cardDesc_html-minifier': '通过移除注释和多余空白来压缩 HTML。',
    'cardTitle_markdown-to-html': '📝 Markdown 转 HTML',
    'cardDesc_markdown-to-html': '将 Markdown 转换为 HTML 并实时预览。',
    'cardTitle_csv-to-json': '🔄 CSV 转 JSON',
    'cardDesc_csv-to-json': '将 CSV 即时转换为对象数组 JSON。',
    'cardTitle_json-to-csv': '📊 JSON 转 CSV',
    'cardDesc_json-to-csv': '将对象数组 JSON 转换为干净的 CSV。',
    'cardTitle_jwt-decoder': '🔐 JWT 解码器',
    'cardDesc_jwt-decoder': '解码 JWT 头部和载荷，查看声明内容。',
    'cardTitle_cron-expression-generator': '⏰ Cron 表达式生成器',
    'cardDesc_cron-expression-generator': '构建 Cron 表达式并获取通俗易懂的执行计划说明。',
    'cardTitle_http-status-codes': '🌐 HTTP 状态码',
    'cardDesc_http-status-codes': '查询 HTTP 状态码及其清晰解释。',
    'cardTitle_random-number-generator': '🎲 随机数生成器',
    'cardDesc_random-number-generator': '在任意范围内生成随机数，可单次或批量。',
    'cardTitle_morse-code-translator': '📻 摩斯电码翻译器',
    'cardDesc_morse-code-translator': '在文本与摩斯电码之间互相转换。',
    'cardTitle_timer': '⏱️ 在线倒计时器',
    'cardDesc_timer': '使用预设或自定义时间设置倒计时。',
    'cardTitle_stopwatch': '⏱️ 在线秒表',
    'cardDesc_stopwatch': '带圈数记录、开始/停止/复位的正计时秒表。',
    'cardTitle_dice-roller': '🎲 掷骰子',
    'cardDesc_dice-roller': '在线投掷任意数量、任意面数的骰子。',
    '✨ AI Studio': '✨ AI 工作室',
    'Tools': '工具',
    'About': '关于',
    'Privacy': '隐私',

    // ---- Shared chrome: footer ----
    'Privacy Policy': '隐私政策',
    'Contact': '联系我们',
    'footerDesc': '完全在浏览器中运行的免费在线工具，数据不会上传到任何服务器。',

    // ---- Index hero ----

    // ---- Featured AI Studio ----
    'featuredBadge': '⭐ 精选工具',
    'featuredTitle': 'AI 内容工作室',
    'featuredDesc': '我们最受欢迎的 AI 工具——输入任意需求，即可生成产品描述、博客文章、SEO 标签、邮件标题等。无需注册，免费使用。',
    'featuredPrimaryBtn': '✨ 打开 AI 工作室 →',
    'featuredSecondaryBtn': '浏览 AI 工具',
    'featuredMini1': '📦 产品描述生成',
    'featuredMini2': '📝 博客文章生成',
    'featuredMini3': '🔍 SEO Meta 生成',
    'featuredMini4': '✉️ 邮件标题生成',
    'discoverMoreCard': '发现 95+ 免费工具',

    // ---- More Tools section (tool page bottom) ----
    'moreToolsTitle': '🔍 探索更多工具',
    'moreToolsDesc': 'FreeToolset 还有 95+ 款免费在线工具，继续浏览提升效率。',
    'moreToolsAll': '全部 95+ 工具',

    'heroTitle': 'FreeToolset — 95+ 款免费在线工具',
    'heroSubtitle': '包含 AI 内容工作室在内的 95+ 款免费工具。AI 写作、计算器、转换器、开发工具，全部在浏览器中完成。',
    'heroBadge': '每日 5 免费积分 · 无需注册',
    'heroOpenBtn': '打开 AI 工作室 →',
    'All Tools': '全部工具',
    'All': '全部',
    'Network': '网络',
    'Image': '图片',
    'Text': '文本',
    'Developer': '开发',
    'Security': '安全',
    '📦 Product Description': '📦 产品描述',
    '📝 Blog Post': '📝 博客文章',
    '✉️ Email Subject Lines': '✉️ 邮件标题',
    '🔍 SEO Meta Tags': '🔍 SEO Meta 标签',
    '🔄 Rewrite Content': '🔄 改写内容',

    // ---- Page H1s ----
    'About FreeToolset': '关于 FreeToolset',
    '📝 AI Blog Post Writer': '📝 AI 博客文章生成器',
    '🔄 AI Content Rewriter': '🔄 AI 内容改写器',
    '✉️ AI Email Subject Line Generator': '✉️ AI 邮件标题生成器',
    '✨ AI Product Description Writer': '✨ AI 产品描述生成器',
    '🔍 AI SEO Meta Generator': '🔍 AI SEO Meta 标签生成器',
    '✨ AI Content Studio': '✨ AI 内容工作室',
    '🔢 Base Converter': '🔢 进制转换器',
    '🔄 Base64 Encoder / Decoder': '🔄 Base64 编码/解码器',
    '🎨 Color Picker': '🎨 颜色选择器',
    'Contact Us': '联系我们',
    '#️⃣ Hash Generator': '#️⃣ 哈希生成器',
    '🖼️ Image Compressor': '🖼️ 图片压缩器',
    '🖼️ Image to Base64': '🖼️ 图片转 Base64',
    '🧩 JSON Formatter': '🧩 JSON 格式化工具',
    '📋 Line Tools': '📋 行处理工具',
    '📄 Lorem Ipsum Generator': '📄 Lorem Ipsum 生成器',
    '🔐 Password Generator': '🔐 密码生成器',
    '🛡️ Password Strength Checker': '🛡️ 密码强度检测器',
    '🔌 Port Lookup': '🔌 端口查询',
    'Privacy Policy': '隐私政策',
    '📱 QR Code Generator': '📱 二维码生成器',
    '🔍 Regex Tester': '🔍 正则表达式测试器',
    '🔤 Text Case Converter': '🔤 文本大小写转换器',
    '⏱️ Timestamp Converter': '⏱️ 时间戳转换器',
    '🔗 URL Encoder / Decoder': '🔗 URL 编码/解码器',
    '🆔 UUID Generator': '🆔 UUID 生成器',
    '📝 Word Counter': '📝 字数统计器',

    // ---- Contact page ----
    'contactSubtitle': '有反馈、工具建议或发现 Bug？我们很乐意听取你的声音！',
    'Send Us a Message': '给我们留言',
    'contactIntro': '填写下面的表单，我们会尽快回复。留言会发送到我们的服务器以便跟进；若服务器不可用，将改用你的邮件客户端作为后备。',
    'Your Name': '你的姓名',
    'Your Email': '你的邮箱',
    'Subject': '主题',
    'General Feedback': '一般反馈',
    'Tool Suggestion': '工具建议',
    'Bug Report': 'Bug 报告',
    'Feature Request': '功能请求',
    'Other': '其他',
    'Message': '留言内容',
    'Send Message': '发送留言',
    'Other Ways to Reach Us': '其他联系方式',
    'contactEmailLine': '你也可以通过邮件直接联系我们：',
    'Email:': '邮箱：',
    'GitHub:': 'GitHub：',
    'Report issues on GitHub': '在 GitHub 上反馈问题',
    'Response Time': '回复时间',
    'responseTimeText': '我们通常在 2–3 个工作日内回复。反馈 Bug 时请尽量提供详细信息：工具名称、浏览器与操作系统、以及复现步骤。',
    'contactPrivacyNote': '你的留言会发送到我们的服务器以便我们跟进。若提交失败，将改用你的邮件客户端作为后备。',
    'contactSuccess': '✓ 留言已发送！我们会尽快回复你。',
    'contactFallback': '✓ 已尝试打开你的邮件客户端。若未弹出，请直接邮件联系 billyjaydenbilly@gmail.com'
  };

  var STORAGE_KEY = 'ft-lang';

  function getSavedLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return (v === 'zh' || v === 'en') ? v : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function applyLang(lang) {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-i18n');
      var translated = (lang === 'zh' && Object.prototype.hasOwnProperty.call(DICT, key)) ? DICT[key] : null;

      if (el.tagName === 'TITLE') {
        if (el.dataset.i18nOrig === undefined) {
          el.dataset.i18nOrig = el.textContent;
        }
        var titleText = translated || el.dataset.i18nOrig;
        el.textContent = titleText;
        document.title = titleText;
      } else if (el.tagName === 'META' && el.getAttribute('property') === 'og:title') {
        if (el.dataset.i18nOrig === undefined) {
          el.dataset.i18nOrig = el.getAttribute('content') || '';
        }
        el.setAttribute('content', translated || el.dataset.i18nOrig);
      } else {
        if (el.dataset.i18nOrig === undefined) {
          el.dataset.i18nOrig = el.innerHTML;
        }
        el.innerHTML = translated || el.dataset.i18nOrig;
      }
    }

    // placeholder translation
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phEls.length; j++) {
      var pel = phEls[j];
      var phKey = pel.getAttribute('data-i18n-placeholder');
      if (pel.dataset.i18nPhOrig === undefined) {
        pel.dataset.i18nPhOrig = pel.getAttribute('placeholder') || '';
      }
      if (lang === 'zh' && Object.prototype.hasOwnProperty.call(DICT, phKey)) {
        pel.setAttribute('placeholder', DICT[phKey]);
      } else {
        pel.setAttribute('placeholder', pel.dataset.i18nPhOrig);
      }
    }

    var btn = document.querySelector('.nav-lang');
    if (btn) {
      btn.textContent = (lang === 'zh') ? 'EN' : '🌐';
    }

    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  window.toggleLang = function () {
    applyLang(document.documentElement.lang === 'zh-CN' ? 'en' : 'zh');
  };

  function init() {
    applyLang(getSavedLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
