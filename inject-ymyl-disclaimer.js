/**
 * inject-ymyl-disclaimer.js
 * 为 YMYL（Your Money or Your Life）类工具页批量注入免责声明区块。
 * - 分健康 / 金融 / 税务 / 消费 / 教育 五类，文案差异化
 * - 注入到 </main> 前
 * - 幂等：已存在 ymyl-disclaimer 则跳过
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// slug -> [类别, 工具中文名, 该工具专属提醒句]
const PAGES = {
  // ===== 健康类 =====
  'bmi-calculator': ['health', 'BMI 计算器',
    'BMI 采用国际通用的「体重(kg) ÷ 身高(m)²」公式，不区分肌肉与脂肪，也未考虑年龄、性别、骨架与人种差异。运动员、孕妇、青少年、老年人的 BMI 数值往往无法真实反映健康状况。'],
  'body-fat-calculator': ['health', '体脂率计算器',
    '本工具基于美国海军围度公式等公开估算模型推算体脂率，属于间接估算，与 DEXA、双能 X 光等专业测量存在误差；肌肉分布异常、水肿或围度测量不准确时误差会进一步放大。'],
  'calorie-calculator': ['health', '卡路里计算器',
    '每日热量需求基于 Mifflin-St Jeor 等公开基础代谢公式与活动系数估算，未考虑个人代谢差异、疾病、用药、孕期哺乳期等特殊情况。长期热量摄入调整（尤其是减脂或增重计划）应在医生或注册营养师指导下进行。'],
  'water-intake-calculator': ['health', '每日饮水量计算器',
    '推荐饮水量基于体重与活动量的通用经验公式，未考虑气候、出汗量、饮食含水量以及肾脏、心脏疾病等健康状况。心衰、肾病患者及正在服用利尿类药物者的饮水量必须遵医嘱，切勿照搬本工具结果。'],

  // ===== 金融类 =====
  'mortgage-calculator': ['finance', '房贷计算器',
    '计算基于等额本息 / 等额本金的标准公式，未包含首付比例限制、贷款成数、公积金组合贷规则、提前还款违约金、评估费、担保费、保险费及税费。各地政策与各银行执行利率、计息方式（按日/按月）均可能不同，实际月供与总利息请以贷款合同和银行审批结果为准。'],
  'loan-calculator': ['finance', '贷款计算器',
    '计算基于名义年利率的标准还款公式，未包含手续费、服务费、砍头息、逾期罚息与提前结清费用。部分消费贷宣传的「月费率」与真实年化利率（APR/IRR）差距很大，签约前务必要求放款方书面披露年化利率与全部费用。'],
  'compound-interest-calculator': ['finance', '复利计算器',
    '复利测算假设收益率恒定且按期复投，属于理想化数学模型。真实投资存在波动、回撤、税费、申赎费用与通货膨胀，收益率并不稳定，历史业绩也不代表未来表现。本结果不构成任何投资建议或收益承诺，投资有风险，本金可能亏损。'],
  'roi-calculator': ['finance', 'ROI 投资回报率计算器',
    'ROI 仅反映投入产出的静态比值，未考虑资金时间价值、持有周期长短、税费、机会成本与风险差异。两个 ROI 相同的项目，风险与周期可能天差地别，请勿仅凭此单一指标做投资或经营决策。'],
  'salary-calculator': ['finance', '工资计算器',
    '税前税后换算基于通用的个税税率表与社保公积金比例，各地社保缴费基数上下限、公积金比例、专项附加扣除、年终奖计税方式与企业实际执行口径均有差异。实际到手工资请以公司薪资单与当地税务、社保部门规定为准。'],
  'break-even-calculator': ['finance', '盈亏平衡点计算器',
    '盈亏平衡分析假设售价、单位变动成本与固定成本在测算区间内保持不变，未考虑规模效应、季节波动、退货率、坏账与税负。真实经营中这些变量会持续变化，本结果仅可作为初步测算参考，不构成经营或融资决策依据。'],

  // ===== 税务类 =====
  'sales-tax-calculator': ['tax', '销售税计算器',
    '销售税率因国家、州/省、城市甚至商品类别而异，部分地区还存在免税商品、起征点与叠加地方税。本工具按你输入的税率做纯数学换算，不代表任何地区的官方税率。实际应纳税额请以当地税务机关规定或专业税务顾问意见为准。'],
  'vat-calculator': ['tax', '增值税计算器',
    '增值税涉及一般纳税人与小规模纳税人的不同计税方式、多档税率、进项抵扣、免抵退与地区性优惠政策。本工具仅按输入税率做价税分离与含税换算，不能替代实际税务核算。申报缴税请以税务机关口径或持牌税务师意见为准。'],

  // ===== 消费/成本类 =====
  'discount-calculator': ['money', '折扣计算器',
    '计算结果为纯数学折算，未考虑满减门槛、优惠券叠加规则、会员价、运费、税费与商家的最终解释权。实际支付金额请以结算页面为准。'],
  'tip-calculator': ['money', '小费计算器',
    '小费比例习惯因国家和场景差异极大，部分餐厅账单中已包含服务费（service charge），重复支付会造成多付。请以账单明细和当地习惯为准。'],
  'fuel-cost-calculator': ['money', '油费计算器',
    '油费测算基于你输入的油耗与油价，未考虑路况、载重、空调使用、驾驶习惯、堵车怠速与油价波动带来的偏差，实际花费通常会高于理论值。'],

  // ===== 教育类 =====
  'gpa-calculator': ['edu', 'GPA 计算器',
    '不同学校采用的 GPA 算法差异很大（4.0 / 4.3 / 5.0 制、加权与非加权、是否计入重修与选修）。留学申请与奖学金评定通常要求学校官方出具的成绩单与 GPA。本工具结果仅供自查估算，请以所在院校教务处的官方核算为准。'],
  'grade-calculator': ['edu', '成绩计算器',
    '各科目权重、平时分构成、卷面折算比例与最低及格线由任课教师和学校规定，可能与本工具的通用加权算法不同。最终成绩请以教务系统公布结果为准。'],
};

const HEADINGS = {
  health: '⚠️ 健康免责声明',
  finance: '⚠️ 金融免责声明',
  tax: '⚠️ 税务免责声明',
  money: '⚠️ 使用提示',
  edu: '⚠️ 使用提示',
};

const TAILS = {
  health: '本工具的计算结果<strong>仅供一般健康参考，不构成医疗建议，也不能替代医生、注册营养师等专业人士的诊断与指导</strong>。如你有慢性疾病、正在服药、处于孕期哺乳期，或准备开始减脂、增重、大幅调整饮食与运动计划，请先咨询专业医疗人员。若出现身体不适，请及时就医。',
  finance: '本工具的计算结果<strong>仅供参考，不构成投资建议、贷款建议或任何形式的财务承诺</strong>。请在做出借贷、投资或重大财务决策前，咨询银行、持牌金融顾问等专业人士，并以正式合同条款为准。',
  tax: '本工具的计算结果<strong>仅供参考，不构成税务或法律意见</strong>。涉及实际申报、缴税与合规事项，请咨询当地税务机关或持牌税务/会计专业人士。',
  money: '本工具的计算结果<strong>仅供参考</strong>，实际金额以商家结算、账单明细或实际支出为准。',
  edu: '本工具的计算结果<strong>仅供参考</strong>，不作为任何学业、升学或申请材料的正式依据。',
};

const COMMON = ' 本站所有计算均在你的浏览器本地完成，输入内容不会上传或保存。详见<a href="about.html">关于我们</a>与<a href="privacy-policy.html">隐私政策</a>。';

function buildBlock(cat, cn, specific) {
  return `
  <!-- YMYL disclaimer -->
  <section class="ymyl-disclaimer" role="note" aria-label="免责声明">
    <h2>${HEADINGS[cat]}</h2>
    <p><strong>${cn}</strong>${specific} ${TAILS[cat]}${COMMON}</p>
  </section>
`;
}

let done = 0, skipped = 0, missing = 0;
const results = [];

for (const [slug, [cat, cn, specific]] of Object.entries(PAGES)) {
  const file = path.join(ROOT, slug + '.html');
  if (!fs.existsSync(file)) { missing++; results.push(`MISSING ${slug}`); continue; }

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('ymyl-disclaimer')) { skipped++; results.push(`SKIP    ${slug}`); continue; }

  const idx = html.lastIndexOf('</main>');
  if (idx === -1) { missing++; results.push(`NOMAIN  ${slug}`); continue; }

  const block = buildBlock(cat, cn, specific);
  html = html.slice(0, idx) + block + html.slice(idx);
  fs.writeFileSync(file, html, 'utf8');
  done++;
  results.push(`OK      ${slug} [${cat}]`);
}

console.log(results.join('\n'));
console.log(`\ndone:${done} skipped:${skipped} missing:${missing} total:${Object.keys(PAGES).length}`);
