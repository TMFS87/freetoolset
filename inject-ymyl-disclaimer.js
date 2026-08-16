/**
 * inject-ymyl-disclaimer.js
 * Batch-inject a disclaimer block into YMYL (Your Money or Your Life) tool pages.
 * - Five categories: health / finance / tax / money / education, with differentiated copy
 * - Injected before </main>
 * - Idempotent: skips pages that already contain ymyl-disclaimer
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// slug -> [category, English tool name, tool-specific reminder sentence]
const PAGES = {
  // ===== health =====
  'bmi-calculator': ['health', 'BMI Calculator',
    'BMI uses the internationally standard formula weight(kg) ÷ height(m)², which does not distinguish muscle from fat and ignores differences in age, sex, frame and ethnicity. For athletes, pregnant women, teenagers and the elderly, BMI often fails to reflect true health status.'],
  'body-fat-calculator': ['health', 'Body Fat Calculator',
    "This tool estimates body-fat percentage from public models such as the U.S. Navy circumference formula. It is an indirect estimate and differs from professional measurements like DEXA; errors widen further with unusual muscle distribution, edema, or inaccurate circumference measurement."],
  'calorie-calculator': ['health', 'Calorie Calculator',
    "Daily calorie needs are estimated from public BMR formulas such as Mifflin-St Jeor and an activity factor, without accounting for personal metabolic differences, illness, medication, or pregnancy/lactation. Any long-term calorie adjustment (especially weight-loss or gain plans) should be done under the guidance of a doctor or registered dietitian."],
  'water-intake-calculator': ['health', 'Daily Water Intake Calculator',
    "Recommended intake is based on a general formula of weight and activity, ignoring climate, sweat loss, dietary water content, and conditions such as kidney or heart disease. Patients with heart failure, kidney disease, or those on diuretics must follow their doctor's advice and should not copy this tool's result."],

  // ===== finance =====
  'mortgage-calculator': ['finance', 'Mortgage Calculator',
    "Calculations use the standard equal-installment / equal-principal formulas and do not include down-payment limits, loan-to-value caps, provident-fund combo rules, early-repayment penalties, appraisal, guarantee, insurance or tax fees. Local policies and each bank's executed rate and accrual method (daily/monthly) may differ; actual monthly payment and total interest should follow the loan contract and bank approval."],
  'loan-calculator': ['finance', 'Loan Calculator',
    "Calculations use the standard repayment formula based on nominal annual rate and exclude handling fees, service fees, upfront interest, late penalties and early-settlement charges. The 'monthly fee rate' advertised for some consumer loans differs greatly from the true annualized rate (APR/IRR); before signing, always require the lender to disclose the annualized rate and all fees in writing."],
  'compound-interest-calculator': ['finance', 'Compound Interest Calculator',
    "Compound-interest projection assumes a constant return reinvested on schedule — an idealized model. Real investments involve volatility, drawdowns, taxes, subscription/redemption fees and inflation; returns are not stable and past performance does not predict the future. This result is not investment advice or a return promise; investing carries risk and principal may be lost."],
  'roi-calculator': ['finance', 'ROI Calculator',
    "ROI only reflects a static input/output ratio and ignores the time value of money, holding period, taxes, opportunity cost and risk differences. Two projects with the same ROI may differ vastly in risk and duration; do not base investment or business decisions on this single metric."],
  'salary-calculator': ['finance', 'Salary Calculator',
    "Pre- vs post-tax conversion uses a general income-tax bracket table and social-insurance/housing-fund ratios; local contribution bases, fund ratios, special additional deductions, year-end-bonus taxation and each company's actual practice all vary. Actual take-home pay should follow your pay slip and local tax/social-insurance rules."],
  'break-even-calculator': ['finance', 'Break-Even Calculator',
    "Break-even analysis assumes price, variable cost per unit and fixed costs stay constant over the modeled range, ignoring scale effects, seasonal swings, return rates, bad debt and tax. In real operations these variables keep changing; this result is only a preliminary reference and not a basis for business or financing decisions."],

  // ===== tax =====
  'sales-tax-calculator': ['tax', 'Sales Tax Calculator',
    "Sales-tax rates vary by country, state/province, city and even product category; some areas have tax-free goods, thresholds and stacked local taxes. This tool does pure math at the rate you enter and does not represent any region's official rate. Actual tax owed should follow local tax authority rules or a professional tax advisor."],
  'vat-calculator': ['tax', 'VAT Calculator',
    "VAT involves different methods for general vs small-scale taxpayers, multiple rate brackets, input credits, export rebates and regional preferences. This tool only does price-tax separation and VAT-inclusive conversion at the rate you enter and cannot replace actual tax accounting. Filing and payment should follow the tax authority's guidance or a licensed tax professional."],

  // ===== money / cost =====
  'discount-calculator': ['money', 'Discount Calculator',
    "The result is pure math and ignores threshold discounts, coupon stacking rules, member prices, shipping, taxes and the merchant's final interpretation. Actual payment amount should follow the checkout page."],
  'tip-calculator': ['money', 'Tip Calculator',
    "Tipping customs vary enormously by country and situation; some restaurant bills already include a service charge, and paying twice means overpaying. Follow the bill detail and local custom."],
  'fuel-cost-calculator': ['money', 'Fuel Cost Calculator',
    "Fuel cost is estimated from the consumption and price you enter, ignoring road conditions, load, A/C use, driving habits, idle traffic and price fluctuations; actual cost is usually higher than the theoretical value."],

  // ===== education =====
  'gpa-calculator': ['edu', 'GPA Calculator',
    "Schools use very different GPA methods (4.0 / 4.3 / 5.0 scales, weighted vs unweighted, whether retakes and electives count). Study-abroad and scholarship reviews usually require the school's official transcript and GPA. This tool is for self-check estimation only; follow your institution's official calculation."],
  'grade-calculator': ['edu', 'Grade Calculator',
    "Subject weights, coursework composition, exam conversion ratios and minimum passing lines are set by instructors and schools and may differ from this tool's general weighted algorithm. Final grades should follow the academic system's published result."],
};

const HEADINGS = {
  health: '⚠️ Health Disclaimer',
  finance: '⚠️ Financial Disclaimer',
  tax: '⚠️ Tax Disclaimer',
  money: '⚠️ Usage Note',
  edu: '⚠️ Usage Note',
};

const TAILS = {
  health: 'The results of this tool are <strong>for general health reference only and do not constitute medical advice, nor replace diagnosis and guidance from doctors, registered dietitians or other professionals</strong>. If you have a chronic condition, are on medication, are pregnant or lactating, or plan to start a weight-loss, weight-gain or major diet/exercise change, consult a healthcare professional first. If you feel unwell, seek medical care promptly.',
  finance: 'The results of this tool are <strong>for reference only and do not constitute investment advice, loan advice or any form of financial commitment</strong>. Before making borrowing, investment or major financial decisions, consult professionals such as a bank or licensed financial advisor, and rely on the formal contract terms.',
  tax: 'The results of this tool are <strong>for reference only and do not constitute tax or legal advice</strong>. For actual filing, payment and compliance matters, consult your local tax authority or a licensed tax/accounting professional.',
  money: 'The results of this tool are <strong>for reference only</strong>; actual amounts follow the merchant\'s checkout, bill detail or real expenditure.',
  edu: 'The results of this tool are <strong>for reference only</strong> and are not an official basis for any academic, advancement or application material.',
};

const COMMON = '  All calculations on this site run locally in your browser; your input is never uploaded or stored. See <a href="about.html">About Us</a> and <a href="privacy-policy.html">Privacy Policy</a>.';

function buildBlock(cat, cn, specific) {
  return `
  <!-- YMYL disclaimer -->
  <section class="ymyl-disclaimer" role="note" aria-label="Disclaimer">
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
