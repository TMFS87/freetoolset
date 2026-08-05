// New blog posts (30) for FreeToolset — topic clusters linking back to tool pages.
// blocks: {tag:'p'|'h2'|'ul'|'tip', text}. ul uses \n per item.
module.exports = [
  {
    slug: "calculators-guide",
    title: "15 个必备在线计算器：从 BMI 到 ROI 一站搞定",
    desc: "汇总生活中最常用的 15 类在线计算器，覆盖健康、理财、购物与效率场景，全部浏览器本地运行、免费即用。",
    keywords: "在线计算器, bmi 计算器, 贷款计算器, roi 计算器, 免费工具",
    tools: ["bmi-calculator.html","age-calculator.html","percentage-calculator.html","loan-calculator.html","mortgage-calculator.html","tip-calculator.html","discount-calculator.html","compound-interest-calculator.html","gpa-calculator.html","calorie-calculator.html","sales-tax-calculator.html","salary-calculator.html","fuel-cost-calculator.html","roi-calculator.html","date-difference-calculator.html"],
    posts: ["bmi-health-guide","loan-vs-mortgage","roi-explained","percentage-in-life"],
    blocks: [
      { tag: "p", text: "计算器是互联网上搜索量最大的工具类别之一。无论是算 BMI、测房贷月供，还是估算投资回报，一个好用的在线计算器能省下大量手工计算。FreeToolset 把 15 类高频计算器集中到一处，全部在浏览器本地运行，数据不上传，免费即用。" },
      { tag: "h2", text: "健康与生活类" },
      { tag: "ul", text: "BMI 计算器：输入身高体重看健康分级\n年龄计算器：精确到天的周岁与生日倒计时\n卡路里计算器：按 Mifflin-St Jeor 公式估算每日消耗\n日期差计算器：算合同天数、工龄与账期" },
      { tag: "h2", text: "理财与购物类" },
      { tag: "ul", text: "贷款/房贷计算器：等额本息月供与总利息\n复利计算器：看清利滚利的长期增长\n折扣/小费计算器：购物聚餐不糊涂\n销售税计算器：报价开票一键含税" },
      { tag: "h2", text: "效率与决策类" },
      { tag: "ul", text: "ROI 计算器：评估投资与广告投放回报\n薪资换算器：时薪月薪年薪自由切换\n油费计算器：自驾通勤成本核算" },
      { tag: "tip", text: "所有计算器都在本地算完即出结果，关掉页面不留痕，适合处理工资、账单等敏感数字。" }
    ]
  },
  {
    slug: "converters-guide",
    title: "单位换算完全指南：长度、重量、温度与数据存储",
    desc: "一文搞定日常与学习中所有单位换算需求，覆盖公制英制、温标与存储单位，附在线换算工具。",
    keywords: "单位换算, 长度换算, 重量换算, 温度换算, 数据存储单位",
    tools: ["unit-converter.html","temperature-converter.html","length-converter.html","weight-converter.html","speed-converter.html","area-converter.html","volume-converter.html","data-storage-converter.html","time-unit-converter.html","roman-numeral-converter.html"],
    posts: ["length-conversion-tips","temperature-conversion","data-storage-units","roman-numeral-basics"],
    blocks: [
      { tag: "p", text: "单位换算是学习、装修、烹饪甚至看天气时的高频需求。不同国家用不同制式，记不住换算系数很正常——把活交给在线工具最省心。" },
      { tag: "h2", text: "公制与英制怎么选" },
      { tag: "p", text: "中国、欧洲用公制（米、千克、摄氏度），美国常用英制（英尺、磅、华氏度）。跨国购物、看海外食谱或技术文档时，实时切换单位能避免大量错误。" },
      { tag: "h2", text: "容易被忽略的换算" },
      { tag: "ul", text: "数据存储：1 KB = 1000 字节还是 1024？十进制与二进制差异很大\n面积：平方米与平方英尺在房产里常混用\n体积：烹饪的杯/汤匙与毫升需对照\n温标：摄氏、华氏、开尔文三者关系" },
      { tag: "tip", text: "FreeToolset 的单位换算器把十类常用单位集中在一起，输入即转，不用再翻系数表。" }
    ]
  },
  {
    slug: "text-tools-guide",
    title: "文本处理工具大全：清洗、转换与排版一键完成",
    desc: "汇总 8 个实用文本工具，覆盖反转、查找替换、去换行、生成 slug 等场景，帮你在写作与数据处理中提效。",
    keywords: "文本工具, 查找替换, 去除换行, slug 生成, 文字转语音",
    tools: ["reverse-text.html","text-repeater.html","find-and-replace.html","slug-generator.html","remove-line-breaks.html","whitespace-remover.html","text-to-speech.html","fancy-text-generator.html"],
    posts: ["reverse-text-fun","text-case-naming"],
    blocks: [
      { tag: "p", text: "写文案、整理数据、做开发时，文本处理是绕不开的琐事。把重复的手动操作交给工具，几秒钟就能完成批量清洗。" },
      { tag: "h2", text: "清洗类" },
      { tag: "ul", text: "查找替换：支持正则，批量改词\n去除换行：合并从 PDF 复制的断行文字\n空白清理：去掉多余空格与空行" },
      { tag: "h2", text: "转换与创作类" },
      { tag: "ul", text: "文本反转：字符/单词/行倒序\n文字转语音：浏览器朗读文章\n花式文字：社交媒体的 Unicode 艺术字\nslug 生成：标题转 SEO 友好网址" },
      { tag: "tip", text: "处理含隐私的文档时，优先用本地运行的工具，内容不会离开浏览器。" }
    ]
  },
  {
    slug: "dev-tools-guide",
    title: "开发者必备的 10 个在线工具",
    desc: "前端与后端日常调试好帮手：HTML 编码、CSS/JSON/HTML 压缩、CSV 互转、JWT 解码、Cron 与 HTTP 状态码。",
    keywords: "开发者工具, json 压缩, jwt 解码, cron 表达式, http 状态码",
    tools: ["html-encoder.html","css-minifier.html","json-minifier.html","html-minifier.html","markdown-to-html.html","csv-to-json.html","json-to-csv.html","jwt-decoder.html","cron-expression-generator.html","http-status-codes.html"],
    posts: ["jwt-explained","cron-expression-guide","http-status-codes","markdown-to-html-guide","css-minify-tips"],
    blocks: [
      { tag: "p", text: "开发者每天都要和格式转换、压缩、调试打交道。一组顺手的在线工具，能省下安装环境、写脚本的时间。" },
      { tag: "h2", text: "格式化与压缩" },
      { tag: "ul", text: "JSON 压缩：校验合法性同时去空白\nCSS/HTML 压缩：上线前减小体积\nMarkdown 转 HTML：带实时预览" },
      { tag: "h2", text: "调试与编码" },
      { tag: "ul", text: "HTML 实体编码：安全展示代码片段\nJWT 解码：本地查看 token 声明\nCron 生成：下拉生成定时任务表达式\nHTTP 状态码：1xx-5xx 速查" },
      { tag: "tip", text: "JWT、CSV 等含敏感数据的操作都在浏览器本地完成，令牌不会上传到任何服务器。" }
    ]
  },
  {
    slug: "bmi-health-guide",
    title: "BMI 怎么算才准：分级、误区与实例",
    desc: "理解 BMI 公式、健康分级标准，避开肌肉量误判等常见误区，并用在线计算器快速自查。",
    keywords: "bmi 怎么算, bmi 分级, bmi 误区, 健康体重",
    tools: ["bmi-calculator.html"],
    posts: ["calculators-guide","calorie-tracker"],
    blocks: [
      { tag: "p", text: "BMI（身体质量指数）= 体重(kg) ÷ 身高(m)²。比如身高 1.7m、体重 65kg，BMI = 65 ÷ 2.89 ≈ 22.5，落在健康区间。" },
      { tag: "h2", text: "健康分级" },
      { tag: "ul", text: "低于 18.5：偏瘦\n18.5–24.9：正常\n25–29.9：超重\n30 及以上：肥胖" },
      { tag: "h2", text: "常见误区" },
      { tag: "ul", text: "肌肉多的人 BMI 会偏高，不等于不健康\nBMI 不区分脂肪分布，不能替代体脂率\n儿童与孕妇要用专门标准" },
      { tag: "tip", text: "BMI 只是粗略筛查，结合腰围与体脂率看更全面。" }
    ]
  },
  {
    slug: "loan-vs-mortgage",
    title: "贷款与房贷计算：月供、利息一次搞懂",
    desc: "用等额本息搞清每月还款额与总利息，对比贷款与房贷计算器的用法，买房买车前心里有数。",
    keywords: "贷款计算器, 房贷计算器, 月供, 等额本息",
    tools: ["loan-calculator.html","mortgage-calculator.html"],
    posts: ["calculators-guide","compound-interest-explained"],
    blocks: [
      { tag: "p", text: "贷款金额、年利率、期限三个数决定你的月供。等额本息下，每月还款额固定，前期还利息多、后期还本金多。" },
      { tag: "h2", text: "贷款 vs 房贷" },
      { tag: "ul", text: "贷款计算器：输入金额、年利率、期限即出月供\n房贷计算器：额外考虑首付比例与贷款年限\n两者都给出利息总额，方便比价" },
      { tag: "h2", text: "怎么用结果做决策" },
      { tag: "p", text: "把月供和你的收入对比，通常建议不超过月收入的一半。调高首付或缩短年限都能省利息，但月供会上升。" },
      { tag: "tip", text: "期限每缩短 5 年，总利息往往能省下好几万，先用计算器试算再签合同。" }
    ]
  },
  {
    slug: "compound-interest-explained",
    title: "复利的力量：一张表看懂利滚利",
    desc: "用复利计算器理解本金、利率、时间与定投如何共同放大财富，附每月定投的长期增长示例。",
    keywords: "复利计算, 利滚利, 定投, 财富增长",
    tools: ["compound-interest-calculator.html"],
    posts: ["loan-vs-mortgage","roi-explained"],
    blocks: [
      { tag: "p", text: "复利是「利息也产生利息」。公式 A = P(1+r/n)^(nt)，其中 P 本金、r 年利率、n 复利次数、t 年数。" },
      { tag: "h2", text: "时间是最强的杠杆" },
      { tag: "p", text: "假设每月定投 1000 元、年化 6%，20 年后本金 24 万，但本息可能接近 46 万——多出的部分几乎全是复利贡献。" },
      { tag: "h2", text: "提高收益的三件事" },
      { tag: "ul", text: "尽早开始，让时间发挥作用\n提高定投频率，复利更密集\n控制费率，少扣一点长期差距巨大" },
      { tag: "tip", text: "用复利计算器切换不同年限，直观感受「晚 5 年起步」会少赚多少。" }
    ]
  },
  {
    slug: "percentage-in-life",
    title: "百分比在生活中的 8 个用法",
    desc: "从折扣、成绩到增长率，百分比计算无处不在。用在线工具快速算出涨跌、占比与分成。",
    keywords: "百分比计算, 涨跌百分比, 占比, 折扣",
    tools: ["percentage-calculator.html"],
    posts: ["calculators-guide","discount-vs-tip"],
    blocks: [
      { tag: "p", text: "百分比把「部分与整体」的关系标准化，方便比较。常见三类：求某数的百分之几、A 是 B 的百分之几、涨跌百分比。" },
      { tag: "h2", text: "高频场景" },
      { tag: "ul", text: "购物：原价打 7 折省多少\n成绩：得了 85 分占总分多少\n增长：月活从 1000 涨到 1300 涨了 30%\n小费：账单 200 加 15% 小费" },
      { tag: "h2", text: "涨跌百分比的坑" },
      { tag: "p", text: "从 100 涨到 120 是 +20%，但从 120 跌回 100 是 −16.7%，因为分母变了。涨跌不对称，比较时要看清基准。" },
      { tag: "tip", text: "分不清「占谁的百分之多少」时，直接用百分比计算器选对模式，避免算反。" }
    ]
  },
  {
    slug: "roi-explained",
    title: "ROI 是什么：投资回报率计算与决策",
    desc: "用 ROI 计算器衡量项目、理财与广告投放的回报，理解净利润与年化收益的区别。",
    keywords: "roi 计算, 投资回报率, 年化收益率, 广告投放",
    tools: ["roi-calculator.html"],
    posts: ["compound-interest-explained","calculators-guide"],
    blocks: [
      { tag: "p", text: "ROI（投资回报率）= (最终价值 − 初始投入) ÷ 初始投入 ×100%。简单说，投入 1000 收回 1200，ROI 就是 20%。" },
      { tag: "h2", text: "为什么 ROI 重要" },
      { tag: "ul", text: "横向比较不同项目哪个更划算\n评估广告投放是否回本\n给老板/客户一个直观的回报数字" },
      { tag: "h2", text: "别忘了时间维度" },
      { tag: "p", text: "ROI 不体现时间。一年赚 20% 和一天赚 20% 天差地别，所以还要看年化收益率。" },
      { tag: "tip", text: "对比多个方案时，把周期统一成年化再比，才公平。" }
    ]
  },
  {
    slug: "length-conversion-tips",
    title: "长度单位换算技巧：米、英尺与英寸",
    desc: "搞懂公制与英制长度换算，记住关键系数，用在线工具快速在米/厘米/英寸/英尺间切换。",
    keywords: "长度换算, 米转英尺, 英寸厘米, 单位换算",
    tools: ["length-converter.html"],
    posts: ["converters-guide"],
    blocks: [
      { tag: "p", text: "1 英寸 = 2.54 厘米，1 英尺 = 30.48 厘米，1 英里 ≈ 1.609 千米。记住这几个数，日常估算就够用。" },
      { tag: "h2", text: "常见用途" },
      { tag: "ul", text: "海淘家具看尺寸：英寸换厘米\n装修量房：米与英尺对照\n旅行看路牌：英里换千米" },
      { tag: "h2", text: "快速心算" },
      { tag: "p", text: "厘米换英寸大约除以 2.5；英尺换米大约乘 0.3。需要精确值时交给换算器。" },
      { tag: "tip", text: "FreeToolset 长度换算器支持 8 种单位一键互转，输入即出，不用记系数。" }
    ]
  },
  {
    slug: "temperature-conversion",
    title: "摄氏度华氏度怎么换：公式与速算",
    desc: "掌握 ℃ 与 ℉ 的换算公式，理解开尔文在科学中的角色，附三温标实时互转工具。",
    keywords: "温度换算, 摄氏华氏, 开尔文, 温标",
    tools: ["temperature-converter.html"],
    posts: ["converters-guide"],
    blocks: [
      { tag: "p", text: "华氏转摄氏：℃ = (℉ − 32) × 5/9；摄氏转华氏：℉ = ℃ × 9/5 + 32。水的冰点是 0℃/32℉，沸点是 100℃/212℉。" },
      { tag: "h2", text: "三种温标" },
      { tag: "ul", text: "摄氏：日常与科学常用\n华氏：美国天气与烹饪常用\n开尔文：绝对零度起算，物理化学用" },
      { tag: "h2", text: "速算小技巧" },
      { tag: "p", text: "摄氏翻倍加 30 约等于华氏（如 20℃→70℉，实际 68℉），适合估温度。" },
      { tag: "tip", text: "看海外天气或烘焙配方时，用温度换算器一次看全三种温标最省事。" }
    ]
  },
  {
    slug: "data-storage-units",
    title: "KB/MB/GB/TB：存储单位到底差多少",
    desc: "理清十进制与二进制存储单位的差异，搞懂 KB 与 KiB 的区别，避免买硬盘「缩水」的误解。",
    keywords: "存储单位, kb mb gb, kib, 硬盘容量",
    tools: ["data-storage-converter.html"],
    posts: ["converters-guide"],
    blocks: [
      { tag: "p", text: "硬盘厂商标的是十进制：1 KB = 1000 字节；而操作系统多用二进制：1 KiB = 1024 字节。这就是标称 1TB 硬盘到手显示约 931GB 的原因。" },
      { tag: "h2", text: "单位阶梯" },
      { tag: "ul", text: "十进制：KB→MB→GB→TB，每级 ×1000\n二进制：KiB→MiB→GiB→TiB，每级 ×1024\n两者差约 4.9%，越大差距越明显" },
      { tag: "h2", text: "实际用途" },
      { tag: "p", text: "估算文件大小、带宽、云存储配额时，先确认对方用哪种进制，否则容易算错。" },
      { tag: "tip", text: "FreeToolset 数据存储换算器同时支持十进制与二进制单位，切换一目了然。" }
    ]
  },
  {
    slug: "roman-numeral-basics",
    title: "罗马数字怎么读：从时钟到页码",
    desc: "理解罗马数字的符号与规则，能手写年份与序号，附阿拉伯数字与罗马数字互转工具。",
    keywords: "罗马数字, 罗马数字转换, 年份, 序号",
    tools: ["roman-numeral-converter.html"],
    posts: ["converters-guide","number-to-words-guide"],
    blocks: [
      { tag: "p", text: "罗马数字用 I(1)、V(5)、X(10)、L(50)、C(100)、D(500)、M(1000)。相同符号最多连续三个，小的在大的右边是加、左边是减。" },
      { tag: "h2", text: "常见例子" },
      { tag: "ul", text: "IV = 4，IX = 9，XL = 40，XC = 90\nMMXXVI = 2026\n钟面常用 IV 而非 IIII 是历史惯例" },
      { tag: "h2", text: "什么时候会用到" },
      { tag: "p", text: "影视年份、书籍章节、钟表、纪念碑落款仍常见罗马数字，会读会写很实用。" },
      { tag: "tip", text: "不确定时，用罗马数字转换器双向验证，避免写错年份。" }
    ]
  },
  {
    slug: "number-to-words-guide",
    title: "数字转中文大写：财务写作必会",
    desc: "写支票、合同、发票时把数字转成英文或中文大写，避免篡改。附数字转单词工具。",
    keywords: "数字转大写, 数字转英文, 支票金额, 发票",
    tools: ["number-to-words.html"],
    posts: ["roman-numeral-basics"],
    blocks: [
      { tag: "p", text: "财务票据上的金额要用大写汉字（壹贰叁肆…）或英文单词书写，目的是防止涂改。比如 1234 写作 ONE THOUSAND TWO HUNDRED THIRTY-FOUR。" },
      { tag: "h2", text: "为什么用大写" },
      { tag: "ul", text: "大写难篡改，票据更安全\n合同金额中英文对照更规范\n发票、支票法律要求大写" },
      { tag: "h2", text: "易错点" },
      { tag: "p", text: "注意零的读法、小数点后几位的处理，以及「and」在英文金额里的位置。" },
      { tag: "tip", text: "填票据前用数字转单词工具生成，再核对一遍再抄写，省时且更准。" }
    ]
  },
  {
    slug: "binary-text-basics",
    title: "二进制与文本：字符编码入门",
    desc: "理解文字如何变成 0 和 1，搞懂 ASCII 与 UTF-8，用文本二进制转换器做趣味编码。",
    keywords: "二进制, 字符编码, ascii, utf-8, 文本转二进制",
    tools: ["binary-text-converter.html"],
    posts: ["converters-guide"],
    blocks: [
      { tag: "p", text: "计算机只认 0 和 1。一个英文字符通常占 8 位（1 字节），比如大写 A 的 ASCII 码是 65，二进制为 01000001。" },
      { tag: "h2", text: "编码方案" },
      { tag: "ul", text: "ASCII：128 个基础字符，1 字节\nUTF-8：兼容 ASCII，中文用 3 字节，全球通用\nUnicode：给每个字符一个编号" },
      { tag: "h2", text: "动手感受" },
      { tag: "p", text: "把一句英文转成二进制，再解码回来，能直观理解「文字即数据」。" },
      { tag: "tip", text: "FreeToolset 文本二进制转换器用 8 位编码、字节间空格分隔，适合学习或发趣味密文。" }
    ]
  },
  {
    slug: "reverse-text-fun",
    title: "把文字反过来：回文与隐藏彩蛋",
    desc: "用文本反转工具做字符倒序、单词颠倒或行反转，适合趣味文字、回文测试与数据处理。",
    keywords: "文本反转, 回文, 倒序, 文字游戏",
    tools: ["reverse-text.html"],
    posts: ["text-tools-guide"],
    blocks: [
      { tag: "p", text: "反转文字就是把顺序颠倒：字符反转后「hello」变「olleh」，单词反转后「a b c」变「c b a」。" },
      { tag: "h2", text: "能玩什么" },
      { tag: "ul", text: "回文测试：上海自来水来自海上\n密文彩蛋：把消息倒过来藏起来\n数据整理：倒序排列列表" },
      { tag: "h2", text: "三种模式" },
      { tag: "p", text: "按字符、按单词、按行各有用途。做趣味内容用字符，处理清单用行反转。" },
      { tag: "tip", text: "反转后的回文读起来一样，是检验工具是否正确的好例子。" }
    ]
  },
  {
    slug: "text-case-naming",
    title: "大小写与命名规范：camelCase 到 kebab",
    desc: "理清编程与文案中的命名风格，附大小写转换工具，变量命名、标题规范化一次搞定。",
    keywords: "大小写转换, camelcase, snake_case, kebab-case, 命名规范",
    tools: ["text-case-converter.html"],
    posts: ["text-tools-guide"],
    blocks: [
      { tag: "p", text: "不同场景用不同命名：JS 变量用 camelCase（myVar），常量用 UPPER_SNAKE，CSS 类名用 kebab-case（my-class），Python 用 snake_case。" },
      { tag: "h2", text: "常见风格" },
      { tag: "ul", text: "camelCase：首词小写，其后首字母大写\nsnake_case：全小写，下划线分隔\nkebab-case：全小写，短横分隔\nPascalCase：每词首字母大写" },
      { tag: "h2", text: "怎么选" },
      { tag: "p", text: "跟着语言或平台的惯例走，团队统一比个人偏好更重要。" },
      { tag: "tip", text: "批量改命名时，用大小写转换工具一次处理整段文本，避免手改出错。" }
    ]
  },
  {
    slug: "csv-json-convert",
    title: "CSV 与 JSON 互转：表格数据搬家风",
    desc: "前端与数据工作中，CSV 和 JSON 互相转换很常见。用在线工具正确处理引号与逗号，避免数据错位。",
    keywords: "csv 转 json, json 转 csv, 数据转换, 表格",
    tools: ["csv-to-json.html","json-to-csv.html"],
    posts: ["dev-tools-guide"],
    blocks: [
      { tag: "p", text: "CSV 是表格（逗号分隔），JSON 是结构化对象。把 Excel 导出的 CSV 转成 JSON，才能喂给接口；反过来把接口数据导成 CSV，方便在表格里看。" },
      { tag: "h2", text: "转换要点" },
      { tag: "ul", text: "字段内含逗号要用引号包住\n自定义分隔符（如分号）要指定\nJSON 数组转 CSV 自动生成表头" },
      { tag: "h2", text: "典型流程" },
      { tag: "p", text: "Excel → 另存 CSV → 转 JSON → 调接口；或 接口 JSON → 转 CSV → 用 Excel 分析。" },
      { tag: "tip", text: "FreeToolset 的 CSV/JSON 互转都正确处理带引号字段，大文件也不卡。" }
    ]
  },
  {
    slug: "jwt-explained",
    title: "JWT 是什么：令牌结构与安全要点",
    desc: "搞懂 JSON Web Token 的三段结构，学会本地解码查看声明，理解签名与过期时间。",
    keywords: "jwt, jwt 解码, 令牌, 鉴权",
    tools: ["jwt-decoder.html"],
    posts: ["dev-tools-guide"],
    blocks: [
      { tag: "p", text: "JWT 由三部分组成：头部（算法）、载荷（数据）、签名，用点分隔。载荷里的 exp 是过期时间，iat 是签发时间。" },
      { tag: "h2", text: "如何调试" },
      { tag: "ul", text: "把 token 粘进解码器看载荷\n检查 exp 是否过期\n确认算法头是否符合预期" },
      { tag: "h2", text: "安全提醒" },
      { tag: "p", text: "JWT 可被任何人解码读取，别在里面放密码等敏感信息；安全性靠签名，而不是靠「别人看不懂」。" },
      { tag: "tip", text: "FreeToolset JWT 解码器全程在浏览器本地运行，token 不会上传，调试登录问题更安心。" }
    ]
  },
  {
    slug: "cron-expression-guide",
    title: "Cron 表达式详解：定时任务排期",
    desc: "从五个字段看懂 crontab 表达式，用生成器把「每天 9 点」变成标准写法。",
    keywords: "cron 表达式, crontab, 定时任务, 调度",
    tools: ["cron-expression-generator.html"],
    posts: ["dev-tools-guide"],
    blocks: [
      { tag: "p", text: "标准 cron 有五个字段：分 时 日 月 周。例如「0 9 * * 1-5」表示工作日每天上午 9 点。" },
      { tag: "h2", text: "常用写法" },
      { tag: "ul", text: "*/5 * * * *：每 5 分钟\n0 0 * * *：每天午夜\n0 9 * * 1-5：工作日 9 点\n30 18 * * 6,0：周末 18:30" },
      { tag: "h2", text: "容易错的地方" },
      { tag: "p", text: "日和周同时设值可能变成「或」关系，不同系统解释不同，建议只用一个维度。" },
      { tag: "tip", text: "用 Cron 生成器下拉选择，自动给出中英文说明，避免手写拼错字段。" }
    ]
  },
  {
    slug: "http-status-codes",
    title: "HTTP 状态码速查：从 200 到 500",
    desc: "理解 1xx-5xx 五大类状态码含义，调试接口时快速定位问题，附可搜索的状态码参考。",
    keywords: "http 状态码, 200, 404, 500, 接口调试",
    tools: ["http-status-codes.html"],
    posts: ["dev-tools-guide"],
    blocks: [
      { tag: "p", text: "状态码第一位表示类别：2xx 成功、3xx 重定向、4xx 客户端错、5xx 服务端错。1xx 是中间状态。" },
      { tag: "h2", text: "最常遇到" },
      { tag: "ul", text: "200 OK：成功\n301/302：跳转\n400：请求格式错\n401/403：未登录/无权限\n404：找不到\n500：服务器崩了" },
      { tag: "h2", text: "调试思路" },
      { tag: "p", text: "看到 4xx 先查请求（参数、token）；看到 5xx 是后端问题，看服务端日志。" },
      { tag: "tip", text: "FreeToolset 的状态码工具支持按码号或关键词搜索，排错时随手查。" }
    ]
  },
  {
    slug: "morse-code-basics",
    title: "摩斯密码入门：滴答之间传信息",
    desc: "了解摩斯电码的点划规则，能手译简单单词，附文字与摩斯互译工具。",
    keywords: "摩斯密码, 摩斯翻译, 点划, 应急通信",
    tools: ["morse-code-translator.html"],
    posts: ["binary-text-basics"],
    blocks: [
      { tag: "p", text: "摩斯用「・」（滴）和「—」（嗒）表示字母数字。E 是最短的「・」，T 是「—」，SOS 即「・・・———・・・」。" },
      { tag: "h2", text: "记忆窍门" },
      { tag: "ul", text: "常用字母先记：E T A N S O\n数字按 1-5 个符号递增\n分组练习比死记快" },
      { tag: "h2", text: "现代用途" },
      { tag: "p", text: "无线电爱好者、应急通信、以及作为趣味暗号仍然活跃。" },
      { tag: "tip", text: "用摩斯翻译器输入文字看电码，或反向把电码解出文字，边玩边学。" }
    ]
  },
  {
    slug: "random-number-use",
    title: "随机数的用途：从抽签到验证码",
    desc: "理解真随机与伪随机，掌握在线随机数生成器的范围、去重等用法，附趣味场景。",
    keywords: "随机数, 随机生成, 抽签, 验证码",
    tools: ["random-number-generator.html"],
    posts: ["dev-tools-guide","dice-roller"],
    blocks: [
      { tag: "p", text: "随机数广泛用于抽奖、抽样、验证码、游戏与做决定。浏览器用伪随机数算法，日常足够；加密场景才需要真随机源。" },
      { tag: "h2", text: "常见玩法" },
      { tag: "ul", text: "抽签：1-100 抽一个\n分组：生成不重复的多个数\n决策：抛硬币式二选一" },
      { tag: "h2", text: "去重与范围" },
      { tag: "p", text: "要抽几张不重复的号码就开「不重复」，范围按需求设定避免越界。" },
      { tag: "tip", text: "做决定拿不准时，让随机数替你选，省去纠结。" }
    ]
  },
  {
    slug: "privacy-local-tools",
    title: "免费工具如何保护隐私：本地计算的真相",
    desc: "解释浏览器本地运行工具为何更安全，对比上传式服务，给出选择隐私友好工具的判断标准。",
    keywords: "隐私工具, 本地计算, 数据不上传, 浏览器工具",
    tools: ["bmi-calculator.html","password-generator.html","jwt-decoder.html","html-encoder.html","json-minifier.html"],
    posts: ["dev-tools-guide","calculators-guide"],
    blocks: [
      { tag: "p", text: "纯前端工具在浏览器里算完即出结果，数据不离开你的设备；而需要上传的服务，文件会经过对方服务器，存在泄露风险。" },
      { tag: "h2", text: "怎么判断" },
      { tag: "ul", text: "看是否要求上传文件或填敏感信息\n代码开源或明确标注「本地运行」更可信\n处理密码、令牌优先选本地工具" },
      { tag: "h2", text: "FreeToolset 的做法" },
      { tag: "p", text: "本站工具全部浏览器本地运行，关掉页面不留痕，适合处理工资、密码、令牌等敏感内容。" },
      { tag: "tip", text: "处理敏感数据时，先用浏览器的无痕窗口 + 本地工具，双重降低风险。" }
    ]
  },
  {
    slug: "productivity-tools",
    title: "提升效率的 10 个免费在线工具",
    desc: "汇总写作、开发、换算与决策类的效率工具，帮你把重复琐事交给浏览器，专注真正重要的事。",
    keywords: "效率工具, 免费工具, 生产力, 在线工具",
    tools: ["word-counter.html","slug-generator.html","csv-to-json.html","unit-converter.html","timer.html","stopwatch.html","random-number-generator.html","find-and-replace.html"],
    posts: ["text-tools-guide","dev-tools-guide","calculators-guide"],
    blocks: [
      { tag: "p", text: "效率不是更努力，而是把低价值重复动作自动化。下面这些免费工具，几秒就能完成过去要手动折腾的任务。" },
      { tag: "h2", text: "写作与整理" },
      { tag: "ul", text: "字数统计：控制篇幅不超限制\nslug 生成：标题转网址\n查找替换：批量改词" },
      { tag: "h2", text: "时间与管理" },
      { tag: "ul", text: "倒计时/秒表：番茄钟与控场\n随机数：抽签与决策\n单位换算：免记系数" },
      { tag: "tip", text: "把这些工具加进浏览器书签栏，下次遇到同类需求一键直达。" }
    ]
  },
  {
    slug: "markdown-to-html-guide",
    title: "Markdown 转 HTML：写作与发布的桥梁",
    desc: "理解 Markdown 常见语法，用在线转换器把笔记、README 变成网页，带实时预览更高效。",
    keywords: "markdown 转 html, markdown 语法, readme, 实时预览",
    tools: ["markdown-to-html.html"],
    posts: ["dev-tools-guide"],
    blocks: [
      { tag: "p", text: "Markdown 用简洁符号表达格式：# 标题、**粗体**、- 列表、`代码`、> 引用。写起来快，读起来也清楚。" },
      { tag: "h2", text: "转 HTML 干嘛" },
      { tag: "ul", text: "把 README 渲染成网页\n把笔记发布到支持 HTML 的平台\n给邮件/文档生成带格式内容" },
      { tag: "h2", text: "实时预览的好处" },
      { tag: "p", text: "左边写右边出结果，能立刻发现语法错误，不必反复切换。" },
      { tag: "tip", text: "FreeToolset 的 Markdown 转换器支持标题、列表、表格、代码块等，带实时预览。" }
    ]
  },
  {
    slug: "css-minify-tips",
    title: "CSS 压缩与优化：提速网页加载",
    desc: "理解压缩 CSS 对加载速度的影响，配合 HTML 压缩整体瘦身，附在线压缩工具。",
    keywords: "css 压缩, html 压缩, 网页提速, 前端优化",
    tools: ["css-minifier.html","html-minifier.html"],
    posts: ["dev-tools-guide"],
    blocks: [
      { tag: "p", text: "压缩就是去掉注释、空格、换行，把 10KB 的 CSS 变成 6KB。体积小了，浏览器下载更快，首屏更早出来。" },
      { tag: "h2", text: "上线前清单" },
      { tag: "ul", text: "压缩 CSS 与 JS\n压缩 HTML\n图片转 WebP 并控制尺寸\n合并小文件减少请求" },
      { tag: "h2", text: "注意点" },
      { tag: "p", text: "压缩会去掉源码可读性，建议保留带注释的源文件，只压缩上线版本。" },
      { tag: "tip", text: "FreeToolset 的 CSS/HTML 压缩器一键处理，发布前跑一遍即可。" }
    ]
  },
  {
    slug: "salary-vs-hourly",
    title: "月薪时薪怎么算：换工作的账",
    desc: "用薪资换算器在时薪、日薪、周薪、月薪、年薪间自由切换，谈薪比较 offer 不踩坑。",
    keywords: "薪资换算, 时薪, 月薪, 年薪, 谈薪",
    tools: ["salary-calculator.html"],
    posts: ["calculators-guide"],
    blocks: [
      { tag: "p", text: "不同工作用不同口径报薪：有的给年薪，有的给时薪。统一成同一单位才好比较真实收入。" },
      { tag: "h2", text: "怎么换算" },
      { tag: "ul", text: "年薪 ÷ 12 = 月薪\n月薪 ÷ 21.75 ≈ 日薪（月计薪天数）\n日薪 ÷ 8 ≈ 时薪" },
      { tag: "h2", text: "别漏了隐性项" },
      { tag: "p", text: "五险一金、补贴、加班强度都会影响到手。时薪低但加班少，可能比高时薪更划算。" },
      { tag: "tip", text: "拿到多个 offer 时，用薪资换算器拉成同一口径，再综合福利判断。" }
    ]
  },
  {
    slug: "age-calculator-guide",
    title: "年龄计算器：精确到天的纪念",
    desc: "用出生日期算周岁、活了多少天、距下次生日几天，填表算工龄生日提醒都好用。",
    keywords: "年龄计算, 周岁, 生日倒计时, 工龄",
    tools: ["age-calculator.html"],
    posts: ["calculators-guide","date-difference-guide"],
    blocks: [
      { tag: "p", text: "输入出生日期，工具算出精确周岁、活过的天数，以及距离下一个生日还有多久——精确到天，不只是「几岁」。" },
      { tag: "h2", text: "实用场景" },
      { tag: "ul", text: "填表写年龄：直接给周岁\n算工龄：用入职日减出生日\n生日提醒：看距下次生日天数" },
      { tag: "h2", text: "为什么按天" },
      { tag: "p", text: "很多权益（退休、入学）看足岁足月，按天计算最严谨。" },
      { tag: "tip", text: "FreeToolset 年龄计算器一并给出月数、天数与生日倒计时，信息一次看全。" }
    ]
  },
  {
    slug: "discount-vs-tip",
    title: "折扣与小费：购物用餐别算错",
    desc: "用折扣计算器看折后价，用小费计算器分账 AA，两件套让你消费时心里有数。",
    keywords: "折扣计算, 小费计算, 折后价, aa 分账",
    tools: ["discount-calculator.html","tip-calculator.html"],
    posts: ["percentage-in-life","calculators-guide"],
    blocks: [
      { tag: "p", text: "折扣算「省多少」，小费算「多付多少」，一个减法一个加法，但都依赖百分比基本功。" },
      { tag: "h2", text: "折扣怎么看" },
      { tag: "ul", text: "原价 ×(1−折扣%) = 折后价\n叠加折扣不是简单相加，要连乘\n看清是「满减」还是「打折」" },
      { tag: "h2", text: "小费怎么分" },
      { tag: "p", text: "输入账单、比例、人数，直接给出小费、总额和每人应付，聚餐 AA 不再掰手指。" },
      { tag: "tip", text: "海外用餐小费比例多为 10%-20%，先看当地习惯再算。" }
    ]
  }
];
