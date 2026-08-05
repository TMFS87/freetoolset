/* tools-data.js — 50 high-traffic client-side tool definitions for FreeToolset. */

const TOOLS = [];

/* ==================== CALCULATORS (15) ==================== */

TOOLS.push({
  slug: 'bmi-calculator', icon: '🏋️', title: 'BMI Calculator', tagline: 'Free Online Body Mass Index Calculator',
  category: 'calculator', popular: 'Popular',
  desc: 'Calculate your Body Mass Index (BMI) instantly from height and weight. Supports metric and imperial units with a healthy-weight category breakdown.',
  cardDesc: 'Calculate Body Mass Index from height & weight, metric or imperial.',
  keywords: 'bmi calculator, body mass index, healthy weight calculator, bmi chart, metric imperial bmi',
  searchTerms: 'bmi body mass index weight health',
  zh: 'BMI（身体质量指数）是衡量体重是否健康的常用指标。本工具支持公制与英制，输入身高体重即可得出 BMI 数值与偏瘦/正常/超重/肥胖分级，适合健身、减脂、体检前自查。',
  howto: ['Choose metric (cm/kg) or imperial (in/lb) units.', 'Enter your height and weight.', 'Your BMI updates instantly below.', 'Read the category to see your healthy-weight status.'],
  faq: [
    { q: 'What is a healthy BMI range?', a: 'For most adults a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese.' },
    { q: 'Is BMI accurate for athletes?', a: 'BMI does not distinguish muscle from fat, so very muscular people may show a high BMI while being healthy. Use it as a general guide, not a diagnosis.' },
    { q: 'Does this work for children?', a: 'This calculator uses the adult formula. Children and teens should use age- and sex-specific BMI percentiles from a pediatric chart.' }
  ],
  usecases: [
    { icon: '🩺', title: 'Health Checkups', text: 'Quickly self-assess weight status before a doctor visit.' },
    { icon: '🏃', title: 'Fitness Goals', text: 'Track how your BMI changes as you lose or gain weight.' },
    { icon: '📋', title: 'Diet Planning', text: 'Use your category as a starting point for a nutrition plan.' }
  ],
  body: `        <div class="form-row">
          <label for="unit">Units</label>
          <select id="unit">
            <option value="metric">Metric (cm, kg)</option>
            <option value="imperial">Imperial (in, lb)</option>
          </select>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="height">Height (<span id="hu">cm</span>)</label>
            <input type="number" id="height" placeholder="170" min="1">
          </div>
          <div class="form-row">
            <label for="weight">Weight (<span id="wu">kg</span>)</label>
            <input type="number" id="weight" placeholder="65" min="1">
          </div>
        </div>
        <div class="result-box empty" id="out">Enter your height and weight to see your BMI.</div>`,
  js: `    var unit=document.getElementById('unit'),h=document.getElementById('height'),w=document.getElementById('weight'),out=document.getElementById('out'),hu=document.getElementById('hu'),wu=document.getElementById('wu');
    function calc(){
      var H=parseFloat(h.value),W=parseFloat(w.value);
      if(!H||!W||H<=0||W<=0){out.className='result-box empty';out.textContent='Enter your height and weight to see your BMI.';return;}
      var bmi;
      if(unit.value==='metric'){var m=H/100;bmi=W/(m*m);}else{bmi=703*W/(H*H);}
      bmi=Math.round(bmi*10)/10;
      var cat,color;
      if(bmi<18.5){cat='Underweight';color='#38bdf8';}
      else if(bmi<25){cat='Healthy weight';color='var(--success)';}
      else if(bmi<30){cat='Overweight';color='var(--warning)';}
      else{cat='Obese';color='#f87171';}
      out.className='result-box';
      out.innerHTML='<div class="gen-big" style="color:'+color+'">'+bmi+'</div><div style="font-weight:600;margin-top:4px">'+cat+'</div><div style="color:var(--text-secondary);margin-top:8px;font-size:.9rem">Healthy range: 18.5 – 24.9</div>';
    }
    function ulabel(){if(unit.value==='metric'){hu.textContent='cm';wu.textContent='kg';}else{hu.textContent='in';wu.textContent='lb';}calc();}
    unit.addEventListener('change',ulabel);h.addEventListener('input',calc);w.addEventListener('input',calc);`
});

TOOLS.push({
  slug: 'age-calculator', icon: '🎂', title: 'Age Calculator', tagline: 'Free Online Age & Birthday Calculator',
  category: 'calculator', popular: 'Popular',
  desc: 'Calculate your exact age in years, months and days from your date of birth. See total days lived and days until your next birthday.',
  cardDesc: 'Find your exact age in years, months, days and total days lived.',
  keywords: 'age calculator, date of birth calculator, how old am i, age in days, birthday countdown',
  searchTerms: 'age birthday date of birth how old',
  zh: '年龄计算器根据出生日期精确计算你的周岁、月数与天数，还能算出已经活了多少天、距离下次生日还有几天，适合填表、算工龄、生日提醒等场景。',
  howto: ['Pick your date of birth.', 'Optionally change the "age at" date (defaults to today).', 'See your exact age broken down by years, months and days.', 'Check total days lived and the countdown to your next birthday.'],
  faq: [
    { q: 'How is age calculated?', a: 'We compute the difference between your birth date and the target date, accounting for varying month lengths and leap years, then express it as years, months and days.' },
    { q: 'Can I calculate age on a future date?', a: 'Yes. Change the "Age at date" field to any date to see how old you (or someone) will be then.' },
    { q: 'Is my birth date stored anywhere?', a: 'No. Everything is calculated locally in your browser and nothing is uploaded.' }
  ],
  usecases: [
    { icon: '📝', title: 'Forms & Applications', text: 'Get your exact age for visas, jobs and school forms.' },
    { icon: '🎉', title: 'Birthday Planning', text: 'Count down the days until the next celebration.' },
    { icon: '👶', title: 'Milestones', text: 'Track a baby or child’s age in months and days.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob">
          </div>
          <div class="form-row">
            <label for="target">Age at Date</label>
            <input type="date" id="target">
          </div>
        </div>
        <div class="result-box empty" id="out">Select your date of birth to calculate your age.</div>`,
  js: `    var dob=document.getElementById('dob'),target=document.getElementById('target'),out=document.getElementById('out');
    target.value=new Date().toISOString().slice(0,10);
    function calc(){
      if(!dob.value){out.className='result-box empty';out.textContent='Select your date of birth to calculate your age.';return;}
      var b=new Date(dob.value),t=target.value?new Date(target.value):new Date();
      if(b>t){out.className='result-box empty';out.textContent='Birth date is after the target date.';return;}
      var y=t.getFullYear()-b.getFullYear(),m=t.getMonth()-b.getMonth(),d=t.getDate()-b.getDate();
      if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate();}
      if(m<0){y--;m+=12;}
      var totalDays=Math.floor((t-b)/86400000);
      var nb=new Date(t.getFullYear(),b.getMonth(),b.getDate());if(nb<t)nb.setFullYear(t.getFullYear()+1);
      var untilBday=Math.ceil((nb-t)/86400000);
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+y+' <span style="font-size:1rem;color:var(--text-secondary)">years</span> '+m+' <span style="font-size:1rem;color:var(--text-secondary)">months</span> '+d+' <span style="font-size:1rem;color:var(--text-secondary)">days</span></div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Total: '+totalDays.toLocaleString()+' days &nbsp;·&nbsp; '+Math.floor(totalDays/7).toLocaleString()+' weeks<br>Next birthday in '+untilBday+' day'+(untilBday===1?'':'s')+'</div>';
    }
    dob.addEventListener('input',calc);target.addEventListener('input',calc);`
});

TOOLS.push({
  slug: 'percentage-calculator', icon: '➗', title: 'Percentage Calculator', tagline: 'Free Online Percentage Calculator',
  category: 'calculator', popular: 'Popular',
  desc: 'Solve everyday percentage problems: find X% of a number, what percent one number is of another, and percentage increase or decrease.',
  cardDesc: 'Find X% of a number, percent of a total, and percentage change.',
  keywords: 'percentage calculator, percent calculator, percentage increase, percentage change, what percent',
  searchTerms: 'percentage percent increase decrease change',
  zh: '百分比计算器解决三类常见问题：求某数的百分之几、某数是另一数的百分之几、以及涨跌百分比。适合算折扣、成绩占比、数据增长率等日常场景。',
  howto: ['Pick the type of percentage question.', 'Enter the two numbers.', 'The answer appears instantly below each row.', 'Use as many of the three calculators as you need.'],
  faq: [
    { q: 'How do I calculate percentage change?', a: 'Percentage change = (new − old) / old × 100. A positive result is an increase; a negative result is a decrease.' },
    { q: 'What does "X is what percent of Y" mean?', a: 'It tells you what proportion X represents of Y, calculated as X / Y × 100.' },
    { q: 'Are decimals supported?', a: 'Yes, you can enter decimal values in any field and results are rounded to two decimals.' }
  ],
  usecases: [
    { icon: '🛍️', title: 'Shopping & Discounts', text: 'Work out how much you save at a given percentage off.' },
    { icon: '📊', title: 'Data & Reports', text: 'Compute growth rates and shares for spreadsheets.' },
    { icon: '🎓', title: 'Grades', text: 'Convert scores into percentages quickly.' }
  ],
  body: `        <div class="form-row"><label>What is <b>X%</b> of a number?</label>
          <div class="gen-row"><input type="number" id="a1" placeholder="% e.g. 20"><input type="number" id="a2" placeholder="of e.g. 150"></div>
          <div class="result-box empty" id="r1" style="margin-top:10px">Result</div>
        </div>
        <div class="form-row" style="margin-top:18px"><label><b>X</b> is what percent of <b>Y</b>?</label>
          <div class="gen-row"><input type="number" id="b1" placeholder="X e.g. 30"><input type="number" id="b2" placeholder="Y e.g. 150"></div>
          <div class="result-box empty" id="r2" style="margin-top:10px">Result</div>
        </div>
        <div class="form-row" style="margin-top:18px"><label>Percentage change from <b>old</b> to <b>new</b></label>
          <div class="gen-row"><input type="number" id="c1" placeholder="old e.g. 80"><input type="number" id="c2" placeholder="new e.g. 100"></div>
          <div class="result-box empty" id="r3" style="margin-top:10px">Result</div>
        </div>`,
  js: `    function num(id){return parseFloat(document.getElementById(id).value);}
    function set(id,txt,ok){var e=document.getElementById(id);e.className='result-box'+(ok?'':' empty');e.innerHTML=txt;}
    function f(n){return (Math.round(n*100)/100).toLocaleString();}
    function calc(){
      var a1=num('a1'),a2=num('a2');(!isNaN(a1)&&!isNaN(a2))?set('r1','<b>'+f(a1/100*a2)+'</b>',1):set('r1','Result',0);
      var b1=num('b1'),b2=num('b2');(!isNaN(b1)&&!isNaN(b2)&&b2!==0)?set('r2','<b>'+f(b1/b2*100)+'%</b>',1):set('r2','Result',0);
      var c1=num('c1'),c2=num('c2');
      if(!isNaN(c1)&&!isNaN(c2)&&c1!==0){var ch=(c2-c1)/c1*100;set('r3','<b style="color:'+(ch>=0?'var(--success)':'#f87171')+'">'+(ch>=0?'+':'')+f(ch)+'%</b> ('+(ch>=0?'increase':'decrease')+')',1);}else set('r3','Result',0);
    }
    ['a1','a2','b1','b2','c1','c2'].forEach(function(id){document.getElementById(id).addEventListener('input',calc);});`
});

TOOLS.push({
  slug: 'loan-calculator', icon: '🏦', title: 'Loan Calculator', tagline: 'Free Online Loan & EMI Calculator',
  category: 'calculator', popular: 'Popular',
  desc: 'Estimate your monthly loan payment (EMI), total interest and total repayment from the loan amount, interest rate and term.',
  cardDesc: 'Estimate monthly payment, total interest and repayment for any loan.',
  keywords: 'loan calculator, emi calculator, monthly payment calculator, interest calculator, personal loan',
  searchTerms: 'loan emi monthly payment interest amortization',
  zh: '贷款计算器根据贷款金额、年利率和期限，算出每月还款额（等额本息）、利息总额与还款总额，适合房贷、车贷、消费贷提前测算月供压力。',
  howto: ['Enter the loan amount you want to borrow.', 'Enter the annual interest rate.', 'Enter the loan term in years.', 'See your monthly payment and total interest instantly.'],
  faq: [
    { q: 'What is EMI?', a: 'EMI (Equated Monthly Installment) is the fixed amount you pay each month, covering both principal and interest, so the loan is fully repaid by the end of the term.' },
    { q: 'How is monthly payment calculated?', a: 'We use the standard amortization formula: P × r × (1+r)^n / ((1+r)^n − 1), where r is the monthly rate and n is the number of months.' },
    { q: 'Does this include fees or insurance?', a: 'No. This is a principal-plus-interest estimate. Actual costs may include processing fees, insurance or taxes.' }
  ],
  usecases: [
    { icon: '🏠', title: 'Home Loans', text: 'Compare monthly payments across different terms.' },
    { icon: '🚗', title: 'Car Loans', text: 'Check affordability before financing a vehicle.' },
    { icon: '💳', title: 'Personal Loans', text: 'Understand the true cost of borrowing.' }
  ],
  body: `        <div class="form-row"><label for="amt">Loan Amount</label><input type="number" id="amt" placeholder="20000" min="0"></div>
        <div class="gen-row">
          <div class="form-row"><label for="rate">Annual Interest Rate (%)</label><input type="number" id="rate" placeholder="6.5" step="0.01" min="0"></div>
          <div class="form-row"><label for="years">Term (years)</label><input type="number" id="years" placeholder="5" min="0"></div>
        </div>
        <div class="result-box empty" id="out">Enter loan details to see your monthly payment.</div>`,
  js: `    var amt=document.getElementById('amt'),rate=document.getElementById('rate'),years=document.getElementById('years'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var P=parseFloat(amt.value),R=parseFloat(rate.value),Y=parseFloat(years.value);
      if(!P||P<=0||isNaN(R)||!Y||Y<=0){out.className='result-box empty';out.textContent='Enter loan details to see your monthly payment.';return;}
      var n=Y*12,r=R/100/12,emi;
      if(r===0){emi=P/n;}else{var p=Math.pow(1+r,n);emi=P*r*p/(p-1);}
      var total=emi*n,interest=total-P;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(emi)+'<span style="font-size:1rem;color:var(--text-secondary)"> /month</span></div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Total interest: <b>'+f(interest)+'</b><br>Total repayment: <b>'+f(total)+'</b></div>';
    }
    [amt,rate,years].forEach(function(e){e.addEventListener('input',calc);});`
});

TOOLS.push({
  slug: 'mortgage-calculator', icon: '🏠', title: 'Mortgage Calculator', tagline: 'Free Online Mortgage Payment Calculator',
  category: 'calculator', popular: 'Popular',
  desc: 'Calculate your monthly mortgage payment from home price, down payment, interest rate and loan term. See total interest over the life of the loan.',
  cardDesc: 'Monthly mortgage payment from price, down payment, rate and term.',
  keywords: 'mortgage calculator, home loan calculator, monthly mortgage payment, down payment calculator',
  searchTerms: 'mortgage home loan down payment property',
  zh: '房贷计算器根据房屋总价、首付、年利率和贷款年限，算出每月月供和总利息，帮助购房前评估首付比例与还款压力。',
  howto: ['Enter the home price and your down payment.', 'Enter the annual interest rate and loan term.', 'See the loan amount and monthly payment instantly.', 'Compare scenarios by changing the down payment.'],
  faq: [
    { q: 'What is included in the payment?', a: 'This estimate covers principal and interest only. Property tax, home insurance and HOA fees are not included.' },
    { q: 'How much should my down payment be?', a: 'A common guideline is 20% of the home price to avoid mortgage insurance, but requirements vary by lender and country.' },
    { q: 'Can I change the term?', a: 'Yes. Try 15, 20 or 30 years to see how the term affects your monthly payment and total interest.' }
  ],
  usecases: [
    { icon: '🔑', title: 'Home Buying', text: 'Estimate payments before house hunting.' },
    { icon: '💰', title: 'Budgeting', text: 'See how down payment size changes your monthly cost.' },
    { icon: '📉', title: 'Refinancing', text: 'Compare a new rate against your current loan.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="price">Home Price</label><input type="number" id="price" placeholder="300000" min="0"></div>
          <div class="form-row"><label for="down">Down Payment</label><input type="number" id="down" placeholder="60000" min="0"></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="mrate">Annual Interest Rate (%)</label><input type="number" id="mrate" placeholder="6.0" step="0.01" min="0"></div>
          <div class="form-row"><label for="myears">Term (years)</label><input type="number" id="myears" placeholder="30" min="0"></div>
        </div>
        <div class="result-box empty" id="out">Enter mortgage details to see your monthly payment.</div>`,
  js: `    var price=document.getElementById('price'),down=document.getElementById('down'),rate=document.getElementById('mrate'),years=document.getElementById('myears'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var Pr=parseFloat(price.value)||0,D=parseFloat(down.value)||0,R=parseFloat(rate.value),Y=parseFloat(years.value);
      var P=Pr-D;
      if(P<=0||isNaN(R)||!Y||Y<=0){out.className='result-box empty';out.textContent='Enter mortgage details to see your monthly payment.';return;}
      var n=Y*12,r=R/100/12,emi;
      if(r===0){emi=P/n;}else{var p=Math.pow(1+r,n);emi=P*r*p/(p-1);}
      var total=emi*n,interest=total-P;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(emi)+'<span style="font-size:1rem;color:var(--text-secondary)"> /month</span></div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Loan amount: <b>'+f(P)+'</b><br>Total interest: <b>'+f(interest)+'</b><br>Total of payments: <b>'+f(total)+'</b></div>';
    }
    [price,down,rate,years].forEach(function(e){e.addEventListener('input',calc);});`
});

TOOLS.push({
  slug: 'tip-calculator', icon: '💵', title: 'Tip Calculator', tagline: 'Free Online Tip & Bill Split Calculator',
  category: 'calculator',
  desc: 'Calculate the tip and split the bill in seconds. Enter the bill amount, tip percentage and number of people to get the per-person total.',
  cardDesc: 'Calculate the tip and split any bill between people.',
  keywords: 'tip calculator, gratuity calculator, bill split calculator, tip percentage, restaurant tip',
  searchTerms: 'tip gratuity bill split restaurant',
  zh: '小费计算器根据账单金额、小费比例和人数，算出小费金额、总额与每人应付，适合出国吃饭、聚餐 AA 分账。',
  howto: ['Enter the total bill amount.', 'Choose or type a tip percentage.', 'Set how many people are splitting.', 'See the tip, grand total and amount per person.'],
  faq: [
    { q: 'How much should I tip?', a: 'In the US, 15–20% is customary for good service. Tipping norms vary widely by country, so check local customs.' },
    { q: 'Does it split the tip too?', a: 'Yes. The per-person amount includes each person’s share of both the bill and the tip.' },
    { q: 'Can I tip on the pre-tax amount?', a: 'Enter the pre-tax subtotal in the bill field if you prefer to tip before tax.' }
  ],
  usecases: [
    { icon: '🍽️', title: 'Dining Out', text: 'Split restaurant checks fairly with friends.' },
    { icon: '✈️', title: 'Travel', text: 'Work out tips quickly in unfamiliar currencies.' },
    { icon: '🚕', title: 'Services', text: 'Tip drivers, salons and delivery with ease.' }
  ],
  body: `        <div class="form-row"><label for="bill">Bill Amount</label><input type="number" id="bill" placeholder="80.00" min="0" step="0.01"></div>
        <div class="gen-row">
          <div class="form-row"><label for="tip">Tip (%)</label><input type="number" id="tip" placeholder="15" min="0" value="15"></div>
          <div class="form-row"><label for="people">People</label><input type="number" id="people" placeholder="2" min="1" value="1"></div>
        </div>
        <div class="result-box empty" id="out">Enter a bill amount to calculate the tip.</div>`,
  js: `    var bill=document.getElementById('bill'),tip=document.getElementById('tip'),people=document.getElementById('people'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var B=parseFloat(bill.value),T=parseFloat(tip.value)||0,P=parseInt(people.value)||1;
      if(!B||B<=0){out.className='result-box empty';out.textContent='Enter a bill amount to calculate the tip.';return;}
      if(P<1)P=1;var tipAmt=B*T/100,total=B+tipAmt;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(total/P)+'<span style="font-size:1rem;color:var(--text-secondary)"> /person</span></div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Tip amount: <b>'+f(tipAmt)+'</b><br>Grand total: <b>'+f(total)+'</b></div>';
    }
    [bill,tip,people].forEach(function(e){e.addEventListener('input',calc);});`
});

TOOLS.push({
  slug: 'discount-calculator', icon: '🏷️', title: 'Discount Calculator', tagline: 'Free Online Discount & Sale Price Calculator',
  category: 'calculator',
  desc: 'Calculate the final price after a discount and see exactly how much you save. Supports single and stacked percentage discounts.',
  cardDesc: 'Find the sale price and savings for any percentage discount.',
  keywords: 'discount calculator, sale price calculator, percentage off calculator, savings calculator',
  searchTerms: 'discount sale price percent off savings',
  zh: '折扣计算器输入原价和折扣百分比，立刻得出折后价与节省金额，还支持二次叠加折扣，适合网购、促销比价。',
  howto: ['Enter the original price.', 'Enter the discount percentage.', 'Optionally add a second stacked discount.', 'See the final price and total savings.'],
  faq: [
    { q: 'How do stacked discounts work?', a: 'A second discount is applied to the already-discounted price, not the original. For example, 50% then 20% off equals 60% off in total, not 70%.' },
    { q: 'Can I calculate the original price from a sale price?', a: 'This tool works forward from the original price. To reverse it, divide the sale price by (1 − discount/100).' },
    { q: 'Does it handle tax?', a: 'No, this calculates the discount only. Add sales tax afterwards with our Sales Tax Calculator.' }
  ],
  usecases: [
    { icon: '🛒', title: 'Online Shopping', text: 'Check the real price before you check out.' },
    { icon: '🏬', title: 'In-Store Sales', text: 'Instantly verify a clearance discount.' },
    { icon: '📈', title: 'Pricing', text: 'Sellers can preview promotional pricing.' }
  ],
  body: `        <div class="form-row"><label for="orig">Original Price</label><input type="number" id="orig" placeholder="100" min="0" step="0.01"></div>
        <div class="gen-row">
          <div class="form-row"><label for="d1">Discount 1 (%)</label><input type="number" id="d1" placeholder="20" min="0"></div>
          <div class="form-row"><label for="d2">Discount 2 (%) — optional</label><input type="number" id="d2" placeholder="0" min="0"></div>
        </div>
        <div class="result-box empty" id="out">Enter a price and discount to see the sale price.</div>`,
  js: `    var orig=document.getElementById('orig'),d1=document.getElementById('d1'),d2=document.getElementById('d2'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var O=parseFloat(orig.value),A=parseFloat(d1.value)||0,B=parseFloat(d2.value)||0;
      if(!O||O<=0){out.className='result-box empty';out.textContent='Enter a price and discount to see the sale price.';return;}
      var p1=O*(1-A/100),fin=p1*(1-B/100),saved=O-fin,pct=O?saved/O*100:0;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(fin)+'</div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">You save <b style="color:var(--success)">'+f(saved)+'</b> ('+(Math.round(pct*10)/10)+'% off)</div>';
    }
    [orig,d1,d2].forEach(function(e){e.addEventListener('input',calc);});`
});

TOOLS.push({
  slug: 'compound-interest-calculator', icon: '📈', title: 'Compound Interest Calculator', tagline: 'Free Online Compound Interest Calculator',
  category: 'calculator',
  desc: 'See how your savings grow with compound interest. Enter principal, rate, years, compounding frequency and optional monthly contributions.',
  cardDesc: 'Project savings growth with compound interest and contributions.',
  keywords: 'compound interest calculator, investment growth calculator, savings calculator, interest compounding',
  searchTerms: 'compound interest investment savings growth',
  zh: '复利计算器根据本金、年利率、年限和复利频率，测算最终本息与利息总额，还支持每月定投，帮助规划储蓄和投资增长。',
  howto: ['Enter your starting principal.', 'Set the annual rate and number of years.', 'Choose the compounding frequency.', 'Optionally add a monthly contribution to see the effect.'],
  faq: [
    { q: 'What is compound interest?', a: 'Compound interest is interest earned on both your original principal and previously accumulated interest, so growth accelerates over time.' },
    { q: 'How does compounding frequency matter?', a: 'More frequent compounding (e.g. monthly vs annually) produces slightly higher returns for the same rate.' },
    { q: 'Are contributions added before or after interest?', a: 'This calculator adds each monthly contribution and compounds the balance, giving a close estimate of end value.' }
  ],
  usecases: [
    { icon: '🐖', title: 'Savings Goals', text: 'See how long it takes to reach a target amount.' },
    { icon: '📊', title: 'Investing', text: 'Model long-term growth of index funds or deposits.' },
    { icon: '🎓', title: 'Education Funds', text: 'Plan contributions for future tuition costs.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="p">Principal</label><input type="number" id="p" placeholder="10000" min="0"></div>
          <div class="form-row"><label for="r">Annual Rate (%)</label><input type="number" id="r" placeholder="7" step="0.01" min="0"></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="yy">Years</label><input type="number" id="yy" placeholder="10" min="0"></div>
          <div class="form-row"><label for="freq">Compounding</label>
            <select id="freq"><option value="1">Annually</option><option value="2">Semi-annually</option><option value="4">Quarterly</option><option value="12" selected>Monthly</option><option value="365">Daily</option></select>
          </div>
        </div>
        <div class="form-row"><label for="pmt">Monthly Contribution — optional</label><input type="number" id="pmt" placeholder="0" min="0"></div>
        <div class="result-box empty" id="out">Enter values to project your balance.</div>`,
  js: `    var ids=['p','r','yy','freq','pmt'],out=document.getElementById('out');
    function g(id){return parseFloat(document.getElementById(id).value);}
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var P=g('p'),R=g('r'),Y=g('yy'),n=parseInt(document.getElementById('freq').value),PMT=g('pmt')||0;
      if(isNaN(P)||isNaN(R)||isNaN(Y)||Y<=0){out.className='result-box empty';out.textContent='Enter values to project your balance.';return;}
      var i=R/100/n,periods=n*Y,bal=P;
      var perMonthToPeriod=PMT*12/n;
      for(var k=0;k<periods;k++){bal=bal*(1+i)+perMonthToPeriod;}
      var contributed=P+PMT*12*Y,interest=bal-contributed;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(bal)+'</div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Total contributed: <b>'+f(contributed)+'</b><br>Interest earned: <b style="color:var(--success)">'+f(interest)+'</b></div>';
    }
    ids.forEach(function(id){document.getElementById(id).addEventListener('input',calc);document.getElementById(id).addEventListener('change',calc);});`
});

TOOLS.push({
  slug: 'gpa-calculator', icon: '🎓', title: 'GPA Calculator', tagline: 'Free Online GPA Calculator',
  category: 'calculator',
  desc: 'Calculate your Grade Point Average on a 4.0 scale. Add each course with its grade and credit hours to get a weighted GPA instantly.',
  cardDesc: 'Compute a weighted GPA on a 4.0 scale from your courses.',
  keywords: 'gpa calculator, grade point average, college gpa, weighted gpa, 4.0 scale',
  searchTerms: 'gpa grade point average college credits',
  zh: 'GPA 计算器按 4.0 制，根据每门课的成绩等级和学分算出加权平均绩点，适合大学生自查绩点、申请留学时估算 GPA。',
  howto: ['Enter each course’s credit hours.', 'Select the letter grade for that course.', 'Add more rows with the "Add Course" button.', 'Your weighted GPA updates automatically.'],
  faq: [
    { q: 'What grade scale is used?', a: 'A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D=1.0, F=0.0 — a common US 4.0 scale.' },
    { q: 'What is a weighted GPA?', a: 'Each course grade is multiplied by its credit hours; the sum is divided by total credits, so higher-credit courses count more.' },
    { q: 'Can I remove a course?', a: 'Yes, click the ✕ on any row to remove it and the GPA recalculates.' }
  ],
  usecases: [
    { icon: '📚', title: 'Students', text: 'Track your GPA across a semester.' },
    { icon: '🎯', title: 'Goal Setting', text: 'See what grades you need to hit a target GPA.' },
    { icon: '🌍', title: 'Applications', text: 'Estimate GPA for scholarship or study-abroad forms.' }
  ],
  body: `        <div id="rows"></div>
        <div class="btn-group"><button class="btn btn-secondary" id="addBtn">+ Add Course</button></div>
        <div class="result-box empty" id="out">Add courses to calculate your GPA.</div>`,
  js: `    var rows=document.getElementById('rows'),out=document.getElementById('out'),addBtn=document.getElementById('addBtn');
    var grades=[['A',4.0],['A-',3.7],['B+',3.3],['B',3.0],['B-',2.7],['C+',2.3],['C',2.0],['C-',1.7],['D',1.0],['F',0.0]];
    function opts(){return grades.map(function(g){return '<option value="'+g[1]+'">'+g[0]+'</option>';}).join('');}
    function addRow(){
      var div=document.createElement('div');div.className='gen-row';div.style.marginBottom='10px';
      div.innerHTML='<input type="number" class="cr" placeholder="Credits e.g. 3" min="0"><div style="display:flex;gap:8px"><select class="gr">'+opts()+'</select><button class="btn btn-secondary rm" style="padding:0 14px">✕</button></div>';
      rows.appendChild(div);
      div.querySelector('.cr').addEventListener('input',calc);
      div.querySelector('.gr').addEventListener('change',calc);
      div.querySelector('.rm').addEventListener('click',function(){div.remove();calc();});
    }
    function calc(){
      var crs=rows.querySelectorAll('.gen-row'),tp=0,tc=0;
      crs.forEach(function(row){var c=parseFloat(row.querySelector('.cr').value)||0,g=parseFloat(row.querySelector('.gr').value);tp+=c*g;tc+=c;});
      if(tc<=0){out.className='result-box empty';out.textContent='Add courses to calculate your GPA.';return;}
      out.className='result-box';out.innerHTML='<div class="gen-big">'+(Math.round(tp/tc*1000)/1000).toFixed(2)+'</div><div style="margin-top:8px;color:var(--text-secondary);font-size:.92rem">Total credits: <b>'+tc+'</b></div>';
    }
    addBtn.addEventListener('click',addRow);addRow();addRow();addRow();`
});

TOOLS.push({
  slug: 'calorie-calculator', icon: '🍎', title: 'Calorie Calculator', tagline: 'Free Online BMR & TDEE Calorie Calculator',
  category: 'calculator', popular: 'Popular',
  desc: 'Estimate your daily calorie needs (TDEE) and basal metabolic rate (BMR) using the Mifflin-St Jeor equation, based on age, sex, height, weight and activity.',
  cardDesc: 'Estimate daily calorie needs (TDEE) and BMR for your body.',
  keywords: 'calorie calculator, tdee calculator, bmr calculator, daily calorie needs, maintenance calories',
  searchTerms: 'calorie tdee bmr maintenance weight loss diet',
  zh: '热量计算器用 Mifflin-St Jeor 公式，根据年龄、性别、身高、体重和活动水平，估算基础代谢率(BMR)和每日总消耗(TDEE)，是减脂增肌制定饮食计划的基础。',
  howto: ['Select your sex and enter age, height and weight.', 'Choose your typical activity level.', 'See your BMR and daily maintenance calories (TDEE).', 'Use the loss/gain targets to plan your diet.'],
  faq: [
    { q: 'What is TDEE?', a: 'Total Daily Energy Expenditure is the number of calories you burn per day including activity. Eating at TDEE maintains weight.' },
    { q: 'How do I lose weight?', a: 'A deficit of about 500 calories per day typically leads to roughly 0.45 kg (1 lb) of loss per week. Never go below your BMR without medical advice.' },
    { q: 'How accurate is this?', a: 'The Mifflin-St Jeor equation is one of the most accurate estimates, but individual metabolism varies. Use it as a starting point.' }
  ],
  usecases: [
    { icon: '🥗', title: 'Weight Loss', text: 'Find your calorie deficit target.' },
    { icon: '💪', title: 'Muscle Gain', text: 'Calculate a surplus for lean bulking.' },
    { icon: '⚖️', title: 'Maintenance', text: 'Know exactly how much to eat to stay steady.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="sex">Sex</label><select id="sex"><option value="m">Male</option><option value="f">Female</option></select></div>
          <div class="form-row"><label for="age">Age</label><input type="number" id="age" placeholder="30" min="1"></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="ht">Height (cm)</label><input type="number" id="ht" placeholder="175" min="1"></div>
          <div class="form-row"><label for="wt">Weight (kg)</label><input type="number" id="wt" placeholder="70" min="1"></div>
        </div>
        <div class="form-row"><label for="act">Activity Level</label>
          <select id="act">
            <option value="1.2">Sedentary (little/no exercise)</option>
            <option value="1.375">Light (1-3 days/week)</option>
            <option value="1.55" selected>Moderate (3-5 days/week)</option>
            <option value="1.725">Active (6-7 days/week)</option>
            <option value="1.9">Very active (hard training/physical job)</option>
          </select>
        </div>
        <div class="result-box empty" id="out">Enter your details to estimate calorie needs.</div>`,
  js: `    var ids=['sex','age','ht','wt','act'],out=document.getElementById('out');
    function calc(){
      var sex=document.getElementById('sex').value,age=parseFloat(document.getElementById('age').value),ht=parseFloat(document.getElementById('ht').value),wt=parseFloat(document.getElementById('wt').value),act=parseFloat(document.getElementById('act').value);
      if(!age||!ht||!wt||age<=0||ht<=0||wt<=0){out.className='result-box empty';out.textContent='Enter your details to estimate calorie needs.';return;}
      var bmr=10*wt+6.25*ht-5*age+(sex==='m'?5:-161);
      var tdee=bmr*act;
      function r(n){return Math.round(n).toLocaleString();}
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+r(tdee)+' <span style="font-size:1rem;color:var(--text-secondary)">kcal/day</span></div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">BMR: <b>'+r(bmr)+'</b> kcal &nbsp;·&nbsp; Maintenance: <b>'+r(tdee)+'</b><br>Mild weight loss: <b>'+r(tdee-500)+'</b> &nbsp;·&nbsp; Weight gain: <b>'+r(tdee+500)+'</b></div>';
    }
    ids.forEach(function(id){var e=document.getElementById(id);e.addEventListener('input',calc);e.addEventListener('change',calc);});`
});

TOOLS.push({
  slug: 'sales-tax-calculator', icon: '🧾', title: 'Sales Tax Calculator', tagline: 'Free Online Sales Tax & VAT Calculator',
  category: 'calculator',
  desc: 'Add or remove sales tax / VAT from any amount. Enter the price and tax rate to see the tax amount and the gross or net total.',
  cardDesc: 'Add or remove sales tax / VAT from any price instantly.',
  keywords: 'sales tax calculator, vat calculator, tax calculator, add tax, remove tax, gross net',
  searchTerms: 'sales tax vat gross net price',
  zh: '销售税/增值税计算器可对任意金额加税或去税，输入价格和税率即可得出税额与含税/不含税总价，适合报价、开票、跨境购物核算。',
  howto: ['Enter the amount (net or gross).', 'Enter the tax rate percentage.', 'Choose "Add tax" or "Remove tax".', 'See the tax amount and the resulting total.'],
  faq: [
    { q: 'What is the difference between adding and removing tax?', a: 'Adding tax computes the gross price from a net amount. Removing tax extracts the net price and tax from a tax-inclusive (gross) amount.' },
    { q: 'Does this support VAT and GST?', a: 'Yes. VAT, GST and sales tax all work the same way — just enter the applicable rate.' },
    { q: 'How is remove-tax calculated?', a: 'Net = gross / (1 + rate/100), and tax = gross − net.' }
  ],
  usecases: [
    { icon: '🧑‍💼', title: 'Invoicing', text: 'Quote gross prices to clients accurately.' },
    { icon: '🛍️', title: 'Shopping', text: 'Work out the checkout total before you buy.' },
    { icon: '📒', title: 'Bookkeeping', text: 'Separate net and tax for your records.' }
  ],
  body: `        <div class="form-row"><label for="amt">Amount</label><input type="number" id="amt" placeholder="100" min="0" step="0.01"></div>
        <div class="gen-row">
          <div class="form-row"><label for="trate">Tax Rate (%)</label><input type="number" id="trate" placeholder="8.5" step="0.01" min="0"></div>
          <div class="form-row"><label for="mode">Mode</label><select id="mode"><option value="add">Add tax (amount is net)</option><option value="remove">Remove tax (amount is gross)</option></select></div>
        </div>
        <div class="result-box empty" id="out">Enter an amount and tax rate.</div>`,
  js: `    var amt=document.getElementById('amt'),trate=document.getElementById('trate'),mode=document.getElementById('mode'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var A=parseFloat(amt.value),R=parseFloat(trate.value);
      if(isNaN(A)||A<0||isNaN(R)||R<0){out.className='result-box empty';out.textContent='Enter an amount and tax rate.';return;}
      var net,tax,gross;
      if(mode.value==='add'){net=A;tax=A*R/100;gross=A+tax;}else{gross=A;net=A/(1+R/100);tax=gross-net;}
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(gross)+'<span style="font-size:1rem;color:var(--text-secondary)"> gross</span></div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Net: <b>'+f(net)+'</b><br>Tax ('+R+'%): <b>'+f(tax)+'</b></div>';
    }
    [amt,trate,mode].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});`
});

TOOLS.push({
  slug: 'salary-calculator', icon: '💼', title: 'Salary Calculator', tagline: 'Free Online Salary & Wage Converter',
  category: 'calculator',
  desc: 'Convert your pay between hourly, daily, weekly, monthly and annual amounts. Enter one figure and see all the others instantly.',
  cardDesc: 'Convert pay between hourly, weekly, monthly and yearly.',
  keywords: 'salary calculator, hourly to salary, annual salary calculator, wage calculator, pay converter',
  searchTerms: 'salary wage hourly annual pay income',
  zh: '薪资换算器可在时薪、日薪、周薪、月薪、年薪之间自由换算，输入其中一个金额即可看到全部，适合谈薪、比较 offer、估算兼职收入。',
  howto: ['Enter one pay amount.', 'Select which period it represents.', 'Set your hours per week and days per week.', 'See the equivalent hourly, weekly, monthly and annual pay.'],
  faq: [
    { q: 'How is annual salary from hourly calculated?', a: 'Annual = hourly × hours per week × 52. Monthly is the annual figure divided by 12.' },
    { q: 'Is this gross or net pay?', a: 'These are gross (pre-tax) figures. Taxes and deductions vary by location and are not included.' },
    { q: 'Can I change working hours?', a: 'Yes. Adjust hours per week and days per week to match your schedule for accurate conversions.' }
  ],
  usecases: [
    { icon: '🤝', title: 'Job Offers', text: 'Compare offers quoted in different periods.' },
    { icon: '🕐', title: 'Freelancing', text: 'Set an hourly rate that hits your income goal.' },
    { icon: '💹', title: 'Budgeting', text: 'Know your monthly take-home from an annual figure.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="amt">Amount</label><input type="number" id="amt" placeholder="30" min="0" step="0.01"></div>
          <div class="form-row"><label for="per">Period</label><select id="per"><option value="hour">Per hour</option><option value="day">Per day</option><option value="week">Per week</option><option value="month">Per month</option><option value="year">Per year</option></select></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="hpw">Hours / week</label><input type="number" id="hpw" value="40" min="1"></div>
          <div class="form-row"><label for="dpw">Days / week</label><input type="number" id="dpw" value="5" min="1"></div>
        </div>
        <div class="result-box empty" id="out">Enter an amount to convert your pay.</div>`,
  js: `    var amt=document.getElementById('amt'),per=document.getElementById('per'),hpw=document.getElementById('hpw'),dpw=document.getElementById('dpw'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var A=parseFloat(amt.value),H=parseFloat(hpw.value)||40,D=parseFloat(dpw.value)||5;
      if(isNaN(A)||A<0){out.className='result-box empty';out.textContent='Enter an amount to convert your pay.';return;}
      var hoursPerYear=H*52,hoursPerDay=H/D,annual;
      switch(per.value){case 'hour':annual=A*hoursPerYear;break;case 'day':annual=A*D*52;break;case 'week':annual=A*52;break;case 'month':annual=A*12;break;default:annual=A;}
      var hourly=annual/hoursPerYear,daily=annual/(D*52),weekly=annual/52,monthly=annual/12;
      out.className='result-box';
      out.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
        '<div><div class="gen-big" style="font-size:1.3rem">'+f(hourly)+'</div><div style="color:var(--text-secondary);font-size:.85rem">hourly</div></div>'+
        '<div><div class="gen-big" style="font-size:1.3rem">'+f(weekly)+'</div><div style="color:var(--text-secondary);font-size:.85rem">weekly</div></div>'+
        '<div><div class="gen-big" style="font-size:1.3rem">'+f(monthly)+'</div><div style="color:var(--text-secondary);font-size:.85rem">monthly</div></div>'+
        '<div><div class="gen-big" style="font-size:1.3rem">'+f(annual)+'</div><div style="color:var(--text-secondary);font-size:.85rem">annual</div></div>'+
        '</div>';
    }
    [amt,per,hpw,dpw].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});`
});

TOOLS.push({
  slug: 'fuel-cost-calculator', icon: '⛽', title: 'Fuel Cost Calculator', tagline: 'Free Online Fuel & Trip Cost Calculator',
  category: 'calculator',
  desc: 'Estimate the fuel cost of any trip from distance, fuel efficiency and fuel price. Supports L/100km and MPG.',
  cardDesc: 'Estimate the fuel cost of a trip from distance and efficiency.',
  keywords: 'fuel cost calculator, gas cost calculator, trip cost calculator, mpg calculator, fuel consumption',
  searchTerms: 'fuel gas trip cost mpg consumption driving',
  zh: '油费计算器根据行驶距离、油耗和油价，估算一趟行程的燃油费用，支持 L/100km 和 MPG 两种油耗单位，适合自驾游、通勤成本核算。',
  howto: ['Enter the trip distance.', 'Enter your vehicle’s fuel efficiency.', 'Pick the efficiency unit (L/100km or MPG).', 'Enter the fuel price to see total cost and fuel used.'],
  faq: [
    { q: 'Which efficiency unit should I use?', a: 'Use L/100km if your car reports litres per 100 km (common outside the US), or MPG (miles per gallon) if that is how efficiency is measured for you.' },
    { q: 'What price should I enter?', a: 'For L/100km, enter price per litre. For MPG, enter price per gallon. Keep units consistent for accurate results.' },
    { q: 'Does it account for city vs highway?', a: 'No, it uses the single efficiency figure you provide. Use your average or a highway/city figure as needed.' }
  ],
  usecases: [
    { icon: '🗺️', title: 'Road Trips', text: 'Budget fuel before a long drive.' },
    { icon: '🚙', title: 'Commuting', text: 'Work out your monthly driving costs.' },
    { icon: '🤝', title: 'Ride Sharing', text: 'Split fuel costs fairly with passengers.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="dist">Distance</label><input type="number" id="dist" placeholder="500" min="0"></div>
          <div class="form-row"><label for="unit">Efficiency Unit</label><select id="unit"><option value="l100">L/100km</option><option value="mpg">MPG</option></select></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="eff">Fuel Efficiency</label><input type="number" id="eff" placeholder="8" min="0" step="0.1"></div>
          <div class="form-row"><label for="price">Fuel Price (per unit)</label><input type="number" id="price" placeholder="1.6" min="0" step="0.01"></div>
        </div>
        <div class="result-box empty" id="out">Enter trip details to estimate fuel cost.</div>`,
  js: `    var dist=document.getElementById('dist'),unit=document.getElementById('unit'),eff=document.getElementById('eff'),price=document.getElementById('price'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var D=parseFloat(dist.value),E=parseFloat(eff.value),P=parseFloat(price.value);
      if(!D||D<=0||!E||E<=0||isNaN(P)||P<0){out.className='result-box empty';out.textContent='Enter trip details to estimate fuel cost.';return;}
      var fuel,unitName;
      if(unit.value==='l100'){fuel=D/100*E;unitName='litres';}else{fuel=D/E;unitName='gallons';}
      var cost=fuel*P;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+f(cost)+'</div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Fuel needed: <b>'+f(fuel)+'</b> '+unitName+'</div>';
    }
    [dist,unit,eff,price].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});`
});

TOOLS.push({
  slug: 'roi-calculator', icon: '💹', title: 'ROI Calculator', tagline: 'Free Online Return on Investment Calculator',
  category: 'calculator',
  desc: 'Calculate return on investment (ROI), net profit and annualized return from your initial cost and final value.',
  cardDesc: 'Calculate ROI, net profit and annualized return on any investment.',
  keywords: 'roi calculator, return on investment, profit calculator, annualized return, investment return',
  searchTerms: 'roi return investment profit annualized',
  zh: 'ROI（投资回报率）计算器根据初始投入和最终价值，算出回报率、净利润和年化收益率，适合评估理财、项目、广告投放等投资效果。',
  howto: ['Enter your initial investment cost.', 'Enter the final value or amount returned.', 'Optionally enter the holding period in years.', 'See ROI, net profit and annualized return.'],
  faq: [
    { q: 'How is ROI calculated?', a: 'ROI = (final value − initial cost) / initial cost × 100, expressed as a percentage.' },
    { q: 'What is annualized return?', a: 'It converts total ROI into an equivalent yearly rate using (final/initial)^(1/years) − 1, so investments of different lengths can be compared.' },
    { q: 'Can ROI be negative?', a: 'Yes. A negative ROI means the investment lost value relative to its cost.' }
  ],
  usecases: [
    { icon: '📈', title: 'Investing', text: 'Compare returns across stocks, funds or property.' },
    { icon: '📣', title: 'Marketing', text: 'Measure the ROI of an ad campaign.' },
    { icon: '🏢', title: 'Business', text: 'Evaluate whether a project paid off.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="init">Initial Investment</label><input type="number" id="init" placeholder="10000" min="0"></div>
          <div class="form-row"><label for="final">Final Value</label><input type="number" id="final" placeholder="13000" min="0"></div>
        </div>
        <div class="form-row"><label for="yrs">Holding Period (years) — optional</label><input type="number" id="yrs" placeholder="3" min="0" step="0.1"></div>
        <div class="result-box empty" id="out">Enter investment values to calculate ROI.</div>`,
  js: `    var init=document.getElementById('init'),final=document.getElementById('final'),yrs=document.getElementById('yrs'),out=document.getElementById('out');
    function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var I=parseFloat(init.value),F=parseFloat(final.value),Y=parseFloat(yrs.value);
      if(!I||I<=0||isNaN(F)){out.className='result-box empty';out.textContent='Enter investment values to calculate ROI.';return;}
      var profit=F-I,roi=profit/I*100;
      var extra='';
      if(Y&&Y>0){var ann=(Math.pow(F/I,1/Y)-1)*100;extra='<br>Annualized return: <b>'+(Math.round(ann*100)/100)+'%</b>';}
      out.className='result-box';
      out.innerHTML='<div class="gen-big" style="color:'+(roi>=0?'var(--success)':'#f87171')+'">'+(roi>=0?'+':'')+(Math.round(roi*100)/100)+'%</div>'+
        '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">Net profit: <b>'+f(profit)+'</b>'+extra+'</div>';
    }
    [init,final,yrs].forEach(function(e){e.addEventListener('input',calc);});`
});

TOOLS.push({
  slug: 'date-difference-calculator', icon: '📅', title: 'Date Difference Calculator', tagline: 'Free Online Days Between Dates Calculator',
  category: 'calculator',
  desc: 'Count the number of days, weeks and months between two dates. Includes an option to add or subtract days from a date.',
  cardDesc: 'Count days, weeks and months between any two dates.',
  keywords: 'date difference calculator, days between dates, date duration calculator, days calculator',
  searchTerms: 'date difference days between duration calendar',
  zh: '日期差计算器可算出两个日期之间相隔多少天、周、月，也能在某个日期上加减天数，适合算合同天数、倒计时、工龄、账期等。',
  howto: ['Pick a start date and an end date.', 'See the difference in days, weeks and months.', 'Switch to "Add / subtract" mode to shift a date.', 'Enter the number of days to add or subtract.'],
  faq: [
    { q: 'Are both dates included?', a: 'The difference counts the number of days between the two dates. Add one day if you need to include both endpoints.' },
    { q: 'How are months counted?', a: 'Months are approximate (average 30.44 days) for the summary; the day count is always exact.' },
    { q: 'Can I go backwards?', a: 'Yes. In add/subtract mode, enter a negative number of days to move to an earlier date.' }
  ],
  usecases: [
    { icon: '📃', title: 'Contracts', text: 'Count the exact term of an agreement.' },
    { icon: '⏳', title: 'Countdowns', text: 'See how many days until an event.' },
    { icon: '💼', title: 'Payroll & Billing', text: 'Work out billing periods and due dates.' }
  ],
  body: `        <div class="form-row"><label for="mode">Mode</label><select id="mode"><option value="diff">Difference between two dates</option><option value="add">Add / subtract days</option></select></div>
        <div id="diffBox">
          <div class="gen-row">
            <div class="form-row"><label for="d1">Start Date</label><input type="date" id="d1"></div>
            <div class="form-row"><label for="d2">End Date</label><input type="date" id="d2"></div>
          </div>
        </div>
        <div id="addBox" style="display:none">
          <div class="gen-row">
            <div class="form-row"><label for="base">Base Date</label><input type="date" id="base"></div>
            <div class="form-row"><label for="days">Days (+/-)</label><input type="number" id="days" placeholder="30"></div>
          </div>
        </div>
        <div class="result-box empty" id="out">Select dates to calculate the difference.</div>`,
  js: `    var mode=document.getElementById('mode'),d1=document.getElementById('d1'),d2=document.getElementById('d2'),base=document.getElementById('base'),days=document.getElementById('days'),out=document.getElementById('out'),diffBox=document.getElementById('diffBox'),addBox=document.getElementById('addBox');
    var today=new Date().toISOString().slice(0,10);d1.value=today;base.value=today;
    function calc(){
      if(mode.value==='diff'){
        if(!d1.value||!d2.value){out.className='result-box empty';out.textContent='Select dates to calculate the difference.';return;}
        var a=new Date(d1.value),b=new Date(d2.value),ms=Math.abs(b-a),dd=Math.round(ms/86400000);
        out.className='result-box';
        out.innerHTML='<div class="gen-big">'+dd.toLocaleString()+' <span style="font-size:1rem;color:var(--text-secondary)">days</span></div>'+
          '<div style="margin-top:10px;color:var(--text-secondary);font-size:.92rem">'+(Math.round(dd/7*10)/10)+' weeks &nbsp;·&nbsp; '+(Math.round(dd/30.44*10)/10)+' months &nbsp;·&nbsp; '+(Math.round(dd/365.25*100)/100)+' years</div>';
      }else{
        if(!base.value||days.value===''){out.className='result-box empty';out.textContent='Enter a base date and number of days.';return;}
        var dt=new Date(base.value);dt.setDate(dt.getDate()+parseInt(days.value));
        var opt={weekday:'long',year:'numeric',month:'long',day:'numeric'};
        out.className='result-box';out.innerHTML='<div class="gen-big" style="font-size:1.4rem">'+dt.toLocaleDateString(undefined,opt)+'</div>';
      }
    }
    mode.addEventListener('change',function(){var a=mode.value==='add';diffBox.style.display=a?'none':'';addBox.style.display=a?'':'none';calc();});
    [d1,d2,base,days].forEach(function(e){e.addEventListener('input',calc);});`
});

/* ==================== CONVERTERS (12) ==================== */

TOOLS.push({
  slug: 'unit-converter', icon: '📐', title: 'Unit Converter', tagline: 'Free Online Unit Converter',
  category: 'converter', popular: 'Popular',
  desc: 'Convert between units of length, weight and temperature in one place. Fast, accurate and works entirely offline in your browser.',
  cardDesc: 'Convert length, weight and temperature units in one tool.',
  keywords: 'unit converter, measurement converter, metric to imperial, length weight temperature converter',
  searchTerms: 'unit converter measurement metric imperial length weight temperature',
  zh: '通用单位换算器一站式支持长度、重量、温度的常用单位互转，公制与英制自由切换，全部在浏览器本地计算，适合日常、学习和工作中的快速换算。',
  howto: ['Choose a category: length, weight or temperature.', 'Enter a value and pick the "from" unit.', 'Pick the "to" unit to convert.', 'Use the swap button to reverse the conversion.'],
  faq: [
    { q: 'Which categories are supported?', a: 'Length, weight/mass and temperature. For more, try our dedicated Length, Weight, Speed, Area, Volume and Data converters.' },
    { q: 'How accurate are the conversions?', a: 'We use standard conversion factors and full floating-point precision, rounding only the displayed result.' },
    { q: 'Does it work offline?', a: 'Yes. All calculations run locally in your browser with no server calls.' }
  ],
  usecases: [
    { icon: '✈️', title: 'Travel', text: 'Convert miles, kilograms and Celsius on the go.' },
    { icon: '👩‍🍳', title: 'Cooking', text: 'Switch recipes between metric and imperial.' },
    { icon: '📚', title: 'Study', text: 'Check unit conversions for homework.' }
  ],
  body: `        <div class="form-row"><label for="cat">Category</label><select id="cat"><option value="length">Length</option><option value="weight">Weight / Mass</option><option value="temp">Temperature</option></select></div>
        <div class="form-row"><label for="val">Value</label><input type="number" id="val" placeholder="1" step="any"></div>
        <div class="gen-row">
          <div class="form-row"><label for="from">From</label><select id="from"></select></div>
          <div class="form-row"><label for="to">To</label><select id="to"></select></div>
        </div>
        <div class="btn-group"><button class="btn btn-secondary" id="swap">⇅ Swap</button></div>
        <div class="result-box empty" id="out">Enter a value to convert.</div>`,
  js: `    var data={length:{base:'m',u:{'Millimeter (mm)':0.001,'Centimeter (cm)':0.01,'Meter (m)':1,'Kilometer (km)':1000,'Inch (in)':0.0254,'Foot (ft)':0.3048,'Yard (yd)':0.9144,'Mile (mi)':1609.344}},weight:{u:{'Milligram (mg)':1e-6,'Gram (g)':0.001,'Kilogram (kg)':1,'Tonne (t)':1000,'Ounce (oz)':0.0283495,'Pound (lb)':0.453592,'Stone (st)':6.35029}}};
    var cat=document.getElementById('cat'),val=document.getElementById('val'),from=document.getElementById('from'),to=document.getElementById('to'),out=document.getElementById('out');
    var tempUnits=['Celsius (°C)','Fahrenheit (°F)','Kelvin (K)'];
    function fill(){
      var opts='';
      if(cat.value==='temp'){opts=tempUnits.map(function(u){return '<option>'+u+'</option>';}).join('');}
      else{opts=Object.keys(data[cat.value].u).map(function(u){return '<option>'+u+'</option>';}).join('');}
      from.innerHTML=opts;to.innerHTML=opts;to.selectedIndex=1;calc();
    }
    function toC(v,u){if(u.indexOf('Fahrenheit')>=0)return (v-32)*5/9;if(u.indexOf('Kelvin')>=0)return v-273.15;return v;}
    function fromC(v,u){if(u.indexOf('Fahrenheit')>=0)return v*9/5+32;if(u.indexOf('Kelvin')>=0)return v+273.15;return v;}
    function calc(){
      var v=parseFloat(val.value);if(isNaN(v)){out.className='result-box empty';out.textContent='Enter a value to convert.';return;}
      var res;
      if(cat.value==='temp'){res=fromC(toC(v,from.value),to.value);}
      else{var uu=data[cat.value].u;res=v*uu[from.value]/uu[to.value];}
      out.className='result-box';out.innerHTML='<div class="gen-big" style="font-size:1.6rem">'+(Math.round(res*1e6)/1e6).toLocaleString()+'</div><div style="color:var(--text-secondary);font-size:.9rem;margin-top:4px">'+val.value+' '+from.value+' = '+(Math.round(res*1e6)/1e6).toLocaleString()+' '+to.value+'</div>';
    }
    cat.addEventListener('change',fill);val.addEventListener('input',calc);from.addEventListener('change',calc);to.addEventListener('change',calc);
    document.getElementById('swap').addEventListener('click',function(){var i=from.selectedIndex;from.selectedIndex=to.selectedIndex;to.selectedIndex=i;calc();});
    fill();`
});

TOOLS.push({
  slug: 'temperature-converter', icon: '🌡️', title: 'Temperature Converter', tagline: 'Free Online Celsius Fahrenheit Kelvin Converter',
  category: 'converter',
  desc: 'Convert temperatures between Celsius, Fahrenheit and Kelvin instantly. Enter one value to see all three scales at once.',
  cardDesc: 'Convert Celsius, Fahrenheit and Kelvin instantly.',
  keywords: 'temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, c to f',
  searchTerms: 'temperature celsius fahrenheit kelvin convert c f k',
  zh: '温度换算器支持摄氏度、华氏度、开尔文三种温标互转，输入任意一个即可同时看到另外两个，适合看天气、做实验、烘焙查温度。',
  howto: ['Pick the scale you are converting from.', 'Enter the temperature value.', 'See the equivalent in the other two scales instantly.', 'No button needed — it updates as you type.'],
  faq: [
    { q: 'How do I convert Celsius to Fahrenheit?', a: 'Multiply by 9/5 and add 32: °F = °C × 9/5 + 32. This tool does it automatically.' },
    { q: 'What is Kelvin used for?', a: 'Kelvin is the SI base unit of temperature used in science; 0 K is absolute zero, equal to −273.15 °C.' },
    { q: 'Can temperatures be negative?', a: 'Celsius and Fahrenheit can be negative, but Kelvin cannot go below 0.' }
  ],
  usecases: [
    { icon: '🌤️', title: 'Weather', text: 'Read foreign forecasts in your preferred scale.' },
    { icon: '🧪', title: 'Science', text: 'Convert lab measurements to Kelvin.' },
    { icon: '🍰', title: 'Baking', text: 'Convert oven temperatures for recipes.' }
  ],
  body: `        <div class="gen-row">
          <div class="form-row"><label for="scale">From Scale</label><select id="scale"><option value="c">Celsius (°C)</option><option value="f">Fahrenheit (°F)</option><option value="k">Kelvin (K)</option></select></div>
          <div class="form-row"><label for="val">Temperature</label><input type="number" id="val" placeholder="25" step="any"></div>
        </div>
        <div class="result-box empty" id="out">Enter a temperature to convert.</div>`,
  js: `    var scale=document.getElementById('scale'),val=document.getElementById('val'),out=document.getElementById('out');
    function calc(){
      var v=parseFloat(val.value);if(isNaN(v)){out.className='result-box empty';out.textContent='Enter a temperature to convert.';return;}
      var c;if(scale.value==='c')c=v;else if(scale.value==='f')c=(v-32)*5/9;else c=v-273.15;
      var f=c*9/5+32,k=c+273.15;function r(n){return Math.round(n*100)/100;}
      out.className='result-box';
      out.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">'+
        '<div><div class="gen-big" style="font-size:1.4rem">'+r(c)+'°</div><div style="color:var(--text-secondary);font-size:.85rem">Celsius</div></div>'+
        '<div><div class="gen-big" style="font-size:1.4rem">'+r(f)+'°</div><div style="color:var(--text-secondary);font-size:.85rem">Fahrenheit</div></div>'+
        '<div><div class="gen-big" style="font-size:1.4rem">'+r(k)+'</div><div style="color:var(--text-secondary);font-size:.85rem">Kelvin</div></div></div>';
    }
    scale.addEventListener('change',calc);val.addEventListener('input',calc);`
});

function linearConverter(cfg){
  // cfg: slug, icon, title, tagline, desc, cardDesc, keywords, searchTerms, zh, popular?, units(obj name->factor), unitWord, faq, usecases, howto
  return {
    slug:cfg.slug, icon:cfg.icon, title:cfg.title, tagline:cfg.tagline, category:'converter', popular:cfg.popular,
    desc:cfg.desc, cardDesc:cfg.cardDesc, keywords:cfg.keywords, searchTerms:cfg.searchTerms, zh:cfg.zh,
    howto:cfg.howto, faq:cfg.faq, usecases:cfg.usecases,
    body:`        <div class="form-row"><label for="val">Value</label><input type="number" id="val" placeholder="1" step="any"></div>
        <div class="gen-row">
          <div class="form-row"><label for="from">From</label><select id="from"></select></div>
          <div class="form-row"><label for="to">To</label><select id="to"></select></div>
        </div>
        <div class="btn-group"><button class="btn btn-secondary" id="swap">⇅ Swap</button></div>
        <div class="result-box empty" id="out">Enter a value to convert.</div>`,
    js:`    var units=${JSON.stringify(cfg.units)};
    var val=document.getElementById('val'),from=document.getElementById('from'),to=document.getElementById('to'),out=document.getElementById('out');
    var keys=Object.keys(units),opts=keys.map(function(k){return '<option>'+k+'</option>';}).join('');
    from.innerHTML=opts;to.innerHTML=opts;to.selectedIndex=Math.min(1,keys.length-1);
    function calc(){var v=parseFloat(val.value);if(isNaN(v)){out.className='result-box empty';out.textContent='Enter a value to convert.';return;}
      var res=v*units[from.value]/units[to.value];
      out.className='result-box';out.innerHTML='<div class="gen-big" style="font-size:1.6rem">'+(Math.round(res*1e8)/1e8).toLocaleString()+'</div><div style="color:var(--text-secondary);font-size:.9rem;margin-top:4px">'+val.value+' '+from.value+' = '+(Math.round(res*1e8)/1e8).toLocaleString()+' '+to.value+'</div>';}
    val.addEventListener('input',calc);from.addEventListener('change',calc);to.addEventListener('change',calc);
    document.getElementById('swap').addEventListener('click',function(){var i=from.selectedIndex;from.selectedIndex=to.selectedIndex;to.selectedIndex=i;calc();});`
  };
}

TOOLS.push(linearConverter({
  slug:'length-converter', icon:'📏', title:'Length Converter', tagline:'Free Online Length & Distance Converter',
  desc:'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards and miles instantly.',
  cardDesc:'Convert mm, cm, m, km, inch, foot, yard and mile.',
  keywords:'length converter, distance converter, cm to inches, meters to feet, km to miles',
  searchTerms:'length distance cm inch meter feet km miles convert',
  zh:'长度换算器支持毫米、厘米、米、千米、英寸、英尺、码、英里等常用长度单位互转，公制英制一键切换，适合装修、旅行、学习。',
  units:{'Millimeter (mm)':0.001,'Centimeter (cm)':0.01,'Meter (m)':1,'Kilometer (km)':1000,'Inch (in)':0.0254,'Foot (ft)':0.3048,'Yard (yd)':0.9144,'Mile (mi)':1609.344,'Nautical mile':1852},
  howto:['Enter the value you want to convert.','Choose the unit to convert from.','Choose the unit to convert to.','Read the result instantly or swap the units.'],
  faq:[{q:'How many centimeters are in an inch?',a:'One inch equals exactly 2.54 centimeters.'},{q:'How do I convert meters to feet?',a:'Multiply meters by 3.28084. This tool does it automatically when you pick the units.'},{q:'Is the mile statute or nautical?',a:'"Mile (mi)" is the statute mile (1609.344 m). A separate nautical mile option (1852 m) is included.'}],
  usecases:[{icon:'🏗️',title:'Construction',text:'Convert measurements between metric and imperial.'},{icon:'🏃',title:'Running',text:'Switch race distances between km and miles.'},{icon:'🌍',title:'Travel',text:'Understand distances abroad instantly.'}]
}));

TOOLS.push(linearConverter({
  slug:'weight-converter', icon:'⚖️', title:'Weight Converter', tagline:'Free Online Weight & Mass Converter',
  desc:'Convert between milligrams, grams, kilograms, tonnes, ounces, pounds and stone instantly.',
  cardDesc:'Convert mg, g, kg, tonne, ounce, pound and stone.',
  keywords:'weight converter, mass converter, kg to lbs, pounds to kg, grams to ounces',
  searchTerms:'weight mass kg lb pound gram ounce stone convert',
  zh:'重量换算器支持毫克、克、千克、吨、盎司、磅、英石等单位互转，适合健身称重、快递计费、烹饪配料换算。',
  units:{'Milligram (mg)':1e-6,'Gram (g)':0.001,'Kilogram (kg)':1,'Tonne (t)':1000,'Ounce (oz)':0.0283495,'Pound (lb)':0.453592,'Stone (st)':6.35029},
  howto:['Enter the weight value.','Choose the unit to convert from.','Choose the unit to convert to.','See the converted weight instantly.'],
  faq:[{q:'How many pounds in a kilogram?',a:'One kilogram equals about 2.20462 pounds.'},{q:'What is a stone?',a:'A stone is a British unit of mass equal to 14 pounds (about 6.35 kg), often used for body weight.'},{q:'Is mass the same as weight?',a:'In everyday use they are treated the same; this tool converts mass units commonly called "weight".'}],
  usecases:[{icon:'💪',title:'Fitness',text:'Track body weight in kg or lbs.'},{icon:'📦',title:'Shipping',text:'Convert parcel weights for carriers.'},{icon:'🍳',title:'Cooking',text:'Convert grams and ounces for recipes.'}]
}));

TOOLS.push(linearConverter({
  slug:'speed-converter', icon:'🚗', title:'Speed Converter', tagline:'Free Online Speed Converter',
  desc:'Convert between meters per second, kilometers per hour, miles per hour, feet per second and knots.',
  cardDesc:'Convert m/s, km/h, mph, ft/s and knots.',
  keywords:'speed converter, kmh to mph, mph to kmh, knots converter, meters per second',
  searchTerms:'speed velocity kmh mph knots convert',
  zh:'速度换算器支持米每秒、千米每时、英里每时、英尺每秒、节等单位互转，适合看车速、航速、风速。',
  units:{'Meter/second (m/s)':1,'Kilometer/hour (km/h)':0.277778,'Mile/hour (mph)':0.44704,'Foot/second (ft/s)':0.3048,'Knot (kn)':0.514444},
  howto:['Enter the speed value.','Pick the unit to convert from.','Pick the unit to convert to.','Read the converted speed instantly.'],
  faq:[{q:'How do I convert km/h to mph?',a:'Multiply km/h by 0.621371. This tool handles it automatically.'},{q:'What is a knot?',a:'A knot is one nautical mile per hour (about 1.852 km/h), used in aviation and shipping.'},{q:'Which unit is SI?',a:'Meters per second (m/s) is the SI unit of speed.'}],
  usecases:[{icon:'🚙',title:'Driving',text:'Convert speed limits when driving abroad.'},{icon:'⛵',title:'Boating',text:'Work with knots and km/h.'},{icon:'🌬️',title:'Weather',text:'Convert wind speeds between units.'}]
}));

TOOLS.push(linearConverter({
  slug:'area-converter', icon:'🗺️', title:'Area Converter', tagline:'Free Online Area Converter',
  desc:'Convert between square meters, square feet, acres, hectares, square kilometers and square miles.',
  cardDesc:'Convert m², ft², acres, hectares, km² and mi².',
  keywords:'area converter, square meters to square feet, acres to hectares, land area converter',
  searchTerms:'area square meter feet acre hectare land convert',
  zh:'面积换算器支持平方米、平方英尺、英亩、公顷、平方千米、平方英里等单位互转，适合房产、土地、农业面积换算。',
  units:{'Square millimeter (mm²)':1e-6,'Square centimeter (cm²)':1e-4,'Square meter (m²)':1,'Hectare (ha)':10000,'Square kilometer (km²)':1e6,'Square inch (in²)':0.00064516,'Square foot (ft²)':0.092903,'Acre (ac)':4046.86,'Square mile (mi²)':2589988.11},
  howto:['Enter the area value.','Choose the source unit.','Choose the target unit.','Read the converted area instantly.'],
  faq:[{q:'How big is one acre?',a:'One acre is 4046.86 square meters, or about 43,560 square feet.'},{q:'How many square feet in a square meter?',a:'One square meter equals about 10.7639 square feet.'},{q:'What is a hectare?',a:'A hectare is 10,000 square meters, commonly used for land and farm areas.'}],
  usecases:[{icon:'🏡',title:'Real Estate',text:'Convert property sizes between units.'},{icon:'🌾',title:'Agriculture',text:'Switch farm areas between acres and hectares.'},{icon:'🏗️',title:'Planning',text:'Convert plot sizes for construction.'}]
}));

TOOLS.push(linearConverter({
  slug:'volume-converter', icon:'🧴', title:'Volume Converter', tagline:'Free Online Volume & Capacity Converter',
  desc:'Convert between milliliters, liters, cubic meters, teaspoons, tablespoons, cups, pints, quarts and gallons.',
  cardDesc:'Convert ml, liters, cups, pints, quarts and gallons.',
  keywords:'volume converter, liters to gallons, ml to cups, cooking measurement converter',
  searchTerms:'volume capacity liter gallon cup ml convert cooking',
  zh:'体积/容量换算器支持毫升、升、立方米、茶匙、汤匙、杯、品脱、夸脱、加仑等单位互转，做饭烘焙、买饮料换算都好用。',
  units:{'Milliliter (ml)':0.001,'Liter (l)':1,'Cubic meter (m³)':1000,'Teaspoon (tsp)':0.00492892,'Tablespoon (tbsp)':0.0147868,'Cup (US)':0.236588,'Pint (US)':0.473176,'Quart (US)':0.946353,'Gallon (US)':3.78541,'Fluid ounce (US)':0.0295735},
  howto:['Enter the volume value.','Pick the source unit.','Pick the target unit.','Read the converted volume instantly.'],
  faq:[{q:'How many ml in a US cup?',a:'One US cup is about 236.6 milliliters.'},{q:'How many liters in a gallon?',a:'One US gallon equals about 3.785 liters.'},{q:'Are these US or imperial units?',a:'Cups, pints, quarts, gallons and fluid ounces here use US customary values.'}],
  usecases:[{icon:'🥤',title:'Drinks',text:'Convert bottle and can sizes.'},{icon:'👩‍🍳',title:'Recipes',text:'Switch cooking measures between systems.'},{icon:'🧪',title:'Science',text:'Convert lab volumes accurately.'}]
}));

TOOLS.push(linearConverter({
  slug:'data-storage-converter', icon:'💾', title:'Data Storage Converter', tagline:'Free Online Digital Storage Converter',
  desc:'Convert between bits, bytes, kilobytes, megabytes, gigabytes, terabytes and their binary (KiB, MiB, GiB) equivalents.',
  cardDesc:'Convert bits, bytes, KB, MB, GB, TB and binary units.',
  keywords:'data storage converter, bytes to gb, mb to gb, kib mib gib converter, file size converter',
  searchTerms:'data storage bytes kb mb gb tb file size convert',
  zh:'数据存储换算器支持比特、字节、KB、MB、GB、TB 以及二进制的 KiB、MiB、GiB 等单位互转，适合算文件大小、带宽、硬盘容量。',
  units:{'Bit (b)':0.125,'Byte (B)':1,'Kilobyte (KB)':1000,'Megabyte (MB)':1e6,'Gigabyte (GB)':1e9,'Terabyte (TB)':1e12,'Kibibyte (KiB)':1024,'Mebibyte (MiB)':1048576,'Gibibyte (GiB)':1073741824,'Tebibyte (TiB)':1099511627776},
  howto:['Enter the size value.','Pick the unit to convert from.','Pick the unit to convert to.','Read the converted size instantly.'],
  faq:[{q:'What is the difference between MB and MiB?',a:'MB is decimal (1,000,000 bytes); MiB is binary (1,048,576 bytes). Drives are usually sold in MB/GB while OSes often report MiB/GiB.'},{q:'How many bytes in a bit?',a:'One byte equals 8 bits, so one bit is 0.125 bytes.'},{q:'How many MB in a GB?',a:'In decimal units, 1 GB = 1000 MB.'}],
  usecases:[{icon:'💽',title:'Storage',text:'Compare drive and file sizes.'},{icon:'📶',title:'Bandwidth',text:'Convert data caps and speeds.'},{icon:'☁️',title:'Cloud',text:'Estimate backup and upload sizes.'}]
}));

TOOLS.push(linearConverter({
  slug:'time-unit-converter', icon:'⏳', title:'Time Unit Converter', tagline:'Free Online Time Unit Converter',
  desc:'Convert between seconds, minutes, hours, days, weeks, months and years instantly.',
  cardDesc:'Convert seconds, minutes, hours, days, weeks and years.',
  keywords:'time converter, seconds to minutes, hours to days, time unit converter, days to years',
  searchTerms:'time seconds minutes hours days weeks years convert',
  zh:'时间单位换算器支持秒、分、时、天、周、月、年之间互转，适合计算时长、排期、倒计时。',
  units:{'Millisecond (ms)':0.001,'Second (s)':1,'Minute (min)':60,'Hour (h)':3600,'Day':86400,'Week':604800,'Month (avg)':2629800,'Year':31557600},
  howto:['Enter the time value.','Pick the unit to convert from.','Pick the unit to convert to.','Read the converted duration instantly.'],
  faq:[{q:'How long is a "month" here?',a:'A month uses the average length of 30.44 days (2,629,800 seconds) so yearly conversions stay consistent.'},{q:'How many seconds in a day?',a:'One day has 86,400 seconds.'},{q:'How many hours in a week?',a:'One week has 168 hours.'}],
  usecases:[{icon:'🗓️',title:'Scheduling',text:'Convert durations for planning.'},{icon:'⏱️',title:'Timing',text:'Work out seconds, minutes and hours.'},{icon:'📊',title:'Estimates',text:'Convert project time units.'}]
}));

TOOLS.push({
  slug:'roman-numeral-converter', icon:'🏛️', title:'Roman Numeral Converter', tagline:'Free Online Roman Numeral Converter',
  category:'converter',
  desc:'Convert numbers to Roman numerals and Roman numerals back to numbers (1–3,999,999). Instant and accurate.',
  cardDesc:'Convert numbers to Roman numerals and back.',
  keywords:'roman numeral converter, number to roman, roman to number, roman numerals',
  searchTerms:'roman numeral converter number to roman I V X L C D M',
  zh:'罗马数字转换器可将阿拉伯数字转为罗马数字、也能把罗马数字转回数字，支持大数（带上划线的千位），适合看钟表、章节编号、影视年份。',
  howto:['Type an Arabic number to get its Roman numeral.','Or type a Roman numeral to get the number.','Conversions update as you type.','Copy the result with the copy button.'],
  faq:[{q:'What is the largest number supported?',a:'Standard Roman numerals go up to 3,999. We extend to millions using overline notation for thousands.'},{q:'Is zero supported?',a:'Romans had no numeral for zero, so 0 and negative numbers are not converted.'},{q:'Is input case sensitive?',a:'No. Roman numerals are accepted in upper or lower case.'}],
  usecases:[{icon:'🎬',title:'Movies',text:'Decode copyright years in Roman numerals.'},{icon:'📖',title:'Books',text:'Read chapter and volume numbers.'},{icon:'⌚',title:'Clocks',text:'Understand Roman numeral clock faces.'}],
  body:`        <div class="form-row"><label for="num">Number → Roman</label><input type="number" id="num" placeholder="2024" min="1"></div>
        <div class="result-box empty gen-mono" id="outR">Enter a number.</div>
        <div class="form-row" style="margin-top:18px"><label for="rom">Roman → Number</label><input type="text" id="rom" placeholder="MMXXIV" style="text-transform:uppercase"></div>
        <div class="result-box empty" id="outN">Enter a Roman numeral.</div>`,
  js:`    var map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    var num=document.getElementById('num'),rom=document.getElementById('rom'),outR=document.getElementById('outR'),outN=document.getElementById('outN');
    function toRoman(n){var s='';for(var i=0;i<map.length;i++){while(n>=map[i][0]){s+=map[i][1];n-=map[i][0];}}return s;}
    function fromRoman(str){var vals={I:1,V:5,X:10,L:50,C:100,D:500,M:1000},t=0,p=0;for(var i=str.length-1;i>=0;i--){var v=vals[str[i]];if(v===undefined)return null;if(v<p)t-=v;else{t+=v;p=v;}}return t;}
    num.addEventListener('input',function(){var n=parseInt(num.value);if(!n||n<1||n>3999){outR.className='result-box empty gen-mono';outR.textContent=n>3999?'Max 3999 for standard numerals.':'Enter a number (1-3999).';return;}outR.className='result-box gen-mono';outR.innerHTML='<div class="gen-big" style="font-size:1.8rem;letter-spacing:2px">'+toRoman(n)+'</div>';});
    rom.addEventListener('input',function(){var s=rom.value.toUpperCase().trim();if(!s){outN.className='result-box empty';outN.textContent='Enter a Roman numeral.';return;}var n=fromRoman(s);if(n===null||toRoman(n)!==s){outN.className='result-box empty';outN.textContent='Not a valid Roman numeral.';return;}outN.className='result-box';outN.innerHTML='<div class="gen-big">'+n+'</div>';});`
});

TOOLS.push({
  slug:'number-to-words', icon:'🔢', title:'Number to Words Converter', tagline:'Free Online Number to Words Converter',
  category:'converter',
  desc:'Convert numbers into written English words — perfect for writing cheques, contracts and invoices. Supports decimals and large numbers.',
  cardDesc:'Spell out any number in English words for cheques & contracts.',
  keywords:'number to words, number spelling, amount in words, cheque writing, spell number',
  searchTerms:'number to words spell amount cheque check writing english',
  zh:'数字转英文单词工具可将数字转换为英文书写形式，写支票、合同、发票金额时很实用，支持小数和大数字。',
  howto:['Type any number, including decimals.','The English words appear instantly below.','Copy the result for your document.','Use it for cheques, invoices and legal amounts.'],
  faq:[{q:'How large a number is supported?',a:'Up to the quadrillions range, covering virtually all everyday and financial uses.'},{q:'Does it handle decimals?',a:'Yes. Decimal digits are read out after the word "point".'},{q:'Is it useful for cheques?',a:'Yes — write the number in the box and copy the spelled-out words onto the amount line.'}],
  usecases:[{icon:'🧾',title:'Cheques',text:'Spell out amounts to write on cheques.'},{icon:'📑',title:'Contracts',text:'Add amounts in words to legal documents.'},{icon:'💵',title:'Invoices',text:'Show totals in words for clarity.'}],
  body:`        <div class="form-row"><label for="num">Number</label><input type="number" id="num" placeholder="1234.56" step="any"></div>
        <div class="result-box empty" id="out">Enter a number to spell it out.</div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Words</button></div>`,
  js:`    var num=document.getElementById('num'),out=document.getElementById('out');
    var ones=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    var tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    var scales=['','thousand','million','billion','trillion','quadrillion'];
    function three(n){var s='';if(n>99){s+=ones[Math.floor(n/100)]+' hundred';n%=100;if(n)s+=' ';}if(n>19){s+=tens[Math.floor(n/10)];n%=10;if(n)s+='-'+ones[n];}else if(n>0){s+=ones[n];}return s;}
    function toWords(n){if(n===0)return 'zero';var parts=[],i=0;while(n>0){var c=n%1000;if(c)parts.unshift(three(c)+(scales[i]?' '+scales[i]:''));n=Math.floor(n/1000);i++;}return parts.join(' ');}
    function calc(){var raw=num.value.trim();if(raw===''||isNaN(parseFloat(raw))){out.className='result-box empty';out.textContent='Enter a number to spell it out.';return;}
      var neg=parseFloat(raw)<0,abs=Math.abs(parseFloat(raw)),intPart=Math.floor(abs),decStr=raw.indexOf('.')>=0?raw.split('.')[1]:'';
      if(intPart>999999999999999){out.className='result-box empty';out.textContent='Number too large.';return;}
      var words=toWords(intPart);
      if(decStr){words+=' point '+decStr.split('').map(function(d){return d==='0'?'zero':ones[parseInt(d)];}).join(' ');}
      if(neg)words='negative '+words;
      words=words.charAt(0).toUpperCase()+words.slice(1);
      out.className='result-box';out.textContent=words;}
    num.addEventListener('input',calc);
    document.getElementById('copyBtn').addEventListener('click',function(){if(out.classList.contains('empty'))return;navigator.clipboard.writeText(out.textContent);this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Words';},1500);});`
});

TOOLS.push({
  slug:'binary-text-converter', icon:'0️⃣', title:'Text to Binary Converter', tagline:'Free Online Text ⇄ Binary Converter',
  category:'converter',
  desc:'Convert text to binary code and decode binary back to text. Uses 8-bit ASCII/UTF-8 encoding with space-separated bytes.',
  cardDesc:'Convert text to binary and binary back to text.',
  keywords:'text to binary, binary to text, binary translator, binary code converter, ascii binary',
  searchTerms:'text binary ascii converter translator 8-bit code',
  zh:'文本二进制转换器可把文字转成二进制编码，也能把二进制解码回文字，采用 8 位编码、字节间空格分隔，适合学习编码、做题、发趣味密文。',
  howto:['Type text in the top box to see binary below.','Or paste space-separated binary to decode to text.','Use the swap direction toggle as needed.','Copy the output with the copy button.'],
  faq:[{q:'What encoding is used?',a:'Each character is encoded as its UTF-8 byte(s), shown as 8-bit binary groups separated by spaces.'},{q:'How do I decode binary?',a:'Paste 8-bit binary groups separated by spaces into the binary box and the text appears automatically.'},{q:'Does it support emoji?',a:'Yes, multi-byte UTF-8 characters like emoji are encoded across several bytes.'}],
  usecases:[{icon:'🎓',title:'Learning',text:'Understand how text is stored as bits.'},{icon:'🧩',title:'Puzzles',text:'Create and solve binary messages.'},{icon:'💻',title:'Coding',text:'Inspect character encodings quickly.'}],
  body:`        <div class="form-row"><label for="txt">Text</label><textarea id="txt" placeholder="Hello"></textarea></div>
        <div class="form-row"><label for="bin">Binary</label><textarea id="bin" class="gen-mono" placeholder="01001000 01100101 01101100 01101100 01101111"></textarea></div>`,
  js:`    var txt=document.getElementById('txt'),bin=document.getElementById('bin');
    function enc(s){return Array.from(new TextEncoder().encode(s)).map(function(b){return b.toString(2).padStart(8,'0');}).join(' ');}
    function dec(s){var groups=s.trim().split(/\\s+/).filter(Boolean);try{var bytes=groups.map(function(g){return parseInt(g,2);});return new TextDecoder().decode(new Uint8Array(bytes));}catch(e){return '';}}
    var lock=false;
    txt.addEventListener('input',function(){if(lock)return;lock=true;bin.value=txt.value?enc(txt.value):'';lock=false;});
    bin.addEventListener('input',function(){if(lock)return;lock=true;txt.value=bin.value.trim()?dec(bin.value):'';lock=false;});`
});

/* ==================== TEXT TOOLS (8) ==================== */

TOOLS.push({
  slug:'reverse-text', icon:'🔄', title:'Reverse Text', tagline:'Free Online Text Reverser',
  category:'text',
  desc:'Reverse text by characters, words or lines. Flip a string backwards or reverse word/line order instantly.',
  cardDesc:'Reverse text by characters, words or lines instantly.',
  keywords:'reverse text, text reverser, backwards text, flip text, reverse words',
  searchTerms:'reverse text backwards flip words lines mirror',
  zh:'文本反转工具可按字符、单词或行反转文字，比如把字符串倒序、把单词或行顺序颠倒，适合做趣味文字、测试、处理数据。',
  howto:['Type or paste your text.','Choose the reverse mode (characters, words or lines).','The reversed text appears instantly.','Copy the result with the copy button.'],
  faq:[{q:'What is the difference between the modes?',a:'"Characters" flips the whole string backwards; "Words" reverses word order; "Lines" reverses the order of lines.'},{q:'Does it support emoji?',a:'Character reversal is grapheme-aware for most emoji, though some complex sequences may split.'},{q:'Is my text uploaded?',a:'No. Reversal happens entirely in your browser.'}],
  usecases:[{icon:'🎨',title:'Creative',text:'Make mirror-style or backwards text.'},{icon:'🧪',title:'Testing',text:'Generate reversed strings for QA.'},{icon:'📋',title:'Data',text:'Flip line or word order quickly.'}],
  body:`        <div class="form-row"><label for="inp">Text</label><textarea id="inp" placeholder="Type something..."></textarea></div>
        <div class="form-row"><label for="mode">Reverse By</label><select id="mode"><option value="char">Characters</option><option value="word">Words</option><option value="line">Lines</option></select></div>
        <div class="form-row"><label>Result</label><textarea id="out" readonly placeholder="Reversed text appears here"></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Result</button></div>`,
  js:`    var inp=document.getElementById('inp'),mode=document.getElementById('mode'),out=document.getElementById('out');
    function calc(){var t=inp.value,r;if(mode.value==='char'){r=Array.from(t).reverse().join('');}else if(mode.value==='word'){r=t.split(/(\\s+)/).reverse().join('');}else{r=t.split('\\n').reverse().join('\\n');}out.value=r;}
    inp.addEventListener('input',calc);mode.addEventListener('change',calc);
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Result';},1500);});`
});

TOOLS.push({
  slug:'text-repeater', icon:'🔁', title:'Text Repeater', tagline:'Free Online Text Repeater',
  category:'text',
  desc:'Repeat any text or word multiple times with a custom separator. Great for testing, filler content and social posts.',
  cardDesc:'Repeat text or a word any number of times with a separator.',
  keywords:'text repeater, repeat text, repeat word, duplicate text, spam text generator',
  searchTerms:'text repeater repeat word duplicate multiply string',
  zh:'文本重复工具可将一段文字或词语重复指定次数，并选择分隔符（换行/空格/无），适合造测试数据、填充内容、生成重复文案。',
  howto:['Enter the text you want to repeat.','Set how many times to repeat it.','Choose a separator between repeats.','Copy the generated output.'],
  faq:[{q:'Is there a repeat limit?',a:'You can repeat up to 10,000 times; very large outputs may be slow to display.'},{q:'What separators are available?',a:'New line, space, comma, or none — pick what suits your use.'},{q:'Can I repeat multiple lines?',a:'Yes, the entire input block is repeated as one unit.'}],
  usecases:[{icon:'🧪',title:'Testing',text:'Generate bulk placeholder text.'},{icon:'📝',title:'Content',text:'Create repeated list items fast.'},{icon:'🎮',title:'Fun',text:'Make repeated messages for chats.'}],
  body:`        <div class="form-row"><label for="inp">Text to Repeat</label><textarea id="inp" placeholder="Hello"></textarea></div>
        <div class="gen-row">
          <div class="form-row"><label for="times">Times</label><input type="number" id="times" value="10" min="1" max="10000"></div>
          <div class="form-row"><label for="sep">Separator</label><select id="sep"><option value="\\n">New line</option><option value=" ">Space</option><option value=", ">Comma</option><option value="">None</option></select></div>
        </div>
        <div class="form-row"><label>Result</label><textarea id="out" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Result</button></div>`,
  js:`    var inp=document.getElementById('inp'),times=document.getElementById('times'),sep=document.getElementById('sep'),out=document.getElementById('out');
    function calc(){var n=Math.min(parseInt(times.value)||0,10000);if(!inp.value||n<1){out.value='';return;}var s=sep.value.replace('\\\\n','\\n');out.value=Array(n).fill(inp.value).join(s);}
    inp.addEventListener('input',calc);times.addEventListener('input',calc);sep.addEventListener('change',calc);
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Result';},1500);});`
});

TOOLS.push({
  slug:'find-and-replace', icon:'🔍', title:'Find and Replace Text', tagline:'Free Online Find & Replace Tool',
  category:'text',
  desc:'Find and replace text online with support for case-insensitive matching and regular expressions. See how many replacements were made.',
  cardDesc:'Find and replace text with case-insensitive and regex options.',
  keywords:'find and replace, text replace, replace all, regex replace, search and replace online',
  searchTerms:'find replace text search regex substitute all',
  zh:'查找替换工具可在文本中批量查找并替换内容，支持忽略大小写和正则表达式，并显示替换了多少处，适合清洗数据、批量改词。',
  howto:['Paste your text in the input box.','Enter the text (or regex) to find.','Enter the replacement text.','Toggle options and see the result with a replacement count.'],
  faq:[{q:'Does it support regular expressions?',a:'Yes. Enable the "Regex" option to use patterns like \\\\d+ or capture groups such as $1.'},{q:'Is it case sensitive?',a:'By default yes; enable "Ignore case" for case-insensitive matching.'},{q:'Are all matches replaced?',a:'Yes, every match is replaced and the total count is shown.'}],
  usecases:[{icon:'🧹',title:'Data Cleaning',text:'Standardize or fix text in bulk.'},{icon:'💻',title:'Coding',text:'Bulk-edit snippets with regex.'},{icon:'✍️',title:'Writing',text:'Swap repeated terms across a document.'}],
  body:`        <div class="form-row"><label for="inp">Text</label><textarea id="inp" placeholder="Paste your text here..."></textarea></div>
        <div class="gen-row">
          <div class="form-row"><label for="find">Find</label><input type="text" id="find" placeholder="old"></div>
          <div class="form-row"><label for="rep">Replace With</label><input type="text" id="rep" placeholder="new"></div>
        </div>
        <div style="display:flex;gap:18px;margin-bottom:14px;flex-wrap:wrap">
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="ci" style="width:auto"> Ignore case</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="re" style="width:auto"> Regex</label>
        </div>
        <div class="form-row"><label>Result <span id="cnt" style="color:var(--text-secondary);font-weight:400"></span></label><textarea id="out" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Result</button></div>`,
  js:`    var inp=document.getElementById('inp'),find=document.getElementById('find'),rep=document.getElementById('rep'),ci=document.getElementById('ci'),re=document.getElementById('re'),out=document.getElementById('out'),cnt=document.getElementById('cnt');
    function esc(s){return s.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&');}
    function calc(){var t=inp.value;if(!find.value){out.value=t;cnt.textContent='';return;}var flags='g'+(ci.checked?'i':'');var pat;try{pat=new RegExp(re.checked?find.value:esc(find.value),flags);}catch(e){cnt.textContent='(invalid regex)';out.value=t;return;}var n=0;out.value=t.replace(pat,function(){n++;return re.checked?rep.value.replace(/\\$&/g,arguments[0]):rep.value;});cnt.textContent='— '+n+' replacement'+(n===1?'':'s');}
    [inp,find,rep].forEach(function(e){e.addEventListener('input',calc);});[ci,re].forEach(function(e){e.addEventListener('change',calc);});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Result';},1500);});`
});

TOOLS.push({
  slug:'slug-generator', icon:'🔗', title:'URL Slug Generator', tagline:'Free Online SEO Slug Generator',
  category:'text',
  desc:'Turn any title into a clean, SEO-friendly URL slug. Lowercases text, strips accents and replaces spaces with hyphens.',
  cardDesc:'Convert titles into clean, SEO-friendly URL slugs.',
  keywords:'slug generator, url slug, seo slug, permalink generator, slugify',
  searchTerms:'slug url seo permalink slugify hyphen',
  zh:'URL Slug 生成器可把标题转换为干净、利于 SEO 的网址短链：自动转小写、去除重音符号、把空格替换为连字符，适合博客、CMS、静态站生成链接。',
  howto:['Type or paste your title or heading.','Choose a separator (hyphen or underscore).','The URL-safe slug is generated instantly.','Copy it into your CMS or code.'],
  faq:[{q:'Why use hyphens in URLs?',a:'Search engines treat hyphens as word separators, so hyphenated slugs are more readable and SEO-friendly than underscores or spaces.'},{q:'Does it remove accents?',a:'Yes. Accented characters like é or ü are converted to their base letters (e, u).'},{q:'What about special characters?',a:'Punctuation and symbols are removed, leaving only letters, numbers and the separator.'}],
  usecases:[{icon:'📝',title:'Blogging',text:'Create clean permalinks for posts.'},{icon:'🛒',title:'E-commerce',text:'Generate product page URLs.'},{icon:'💻',title:'Development',text:'Slugify titles in your app.'}],
  body:`        <div class="form-row"><label for="inp">Title / Text</label><input type="text" id="inp" placeholder="10 Best Tips for Better SEO in 2025!"></div>
        <div class="form-row"><label for="sep">Separator</label><select id="sep"><option value="-">Hyphen ( - )</option><option value="_">Underscore ( _ )</option></select></div>
        <div class="form-row"><label>Slug</label><input type="text" id="out" class="gen-mono" readonly></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Slug</button></div>`,
  js:`    var inp=document.getElementById('inp'),sep=document.getElementById('sep'),out=document.getElementById('out');
    function slugify(s){return s.normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\\s+/g,sep.value);}
    function calc(){out.value=slugify(inp.value);}
    inp.addEventListener('input',calc);sep.addEventListener('change',calc);
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Slug';},1500);});`
});

TOOLS.push({
  slug:'remove-line-breaks', icon:'↵', title:'Remove Line Breaks', tagline:'Free Online Line Break Remover',
  category:'text',
  desc:'Remove line breaks and paragraph breaks from text. Join broken lines into a single paragraph, with an option to keep paragraph spacing.',
  cardDesc:'Strip line breaks and join text into clean paragraphs.',
  keywords:'remove line breaks, delete line breaks, join lines, remove newlines, text to one line',
  searchTerms:'remove line breaks newlines join lines paragraph one line',
  zh:'去除换行工具可删除文本中的换行/回车，把断行的文字合并成一段，可选保留段落间距，适合整理从 PDF、邮件复制过来的乱换行文字。',
  howto:['Paste text with unwanted line breaks.','Choose whether to keep paragraph breaks.','Pick what to replace line breaks with (space or nothing).','Copy the cleaned single-block text.'],
  faq:[{q:'Will it keep paragraphs?',a:'If you enable "Keep paragraph breaks", blank-line separated paragraphs are preserved while single line breaks inside them are removed.'},{q:'What replaces the line break?',a:'You can replace each removed break with a space (recommended) or with nothing.'},{q:'Good for pasted PDF text?',a:'Yes — it fixes text that wraps awkwardly after copying from PDFs or emails.'}],
  usecases:[{icon:'📄',title:'PDF Copy',text:'Fix broken lines copied from PDFs.'},{icon:'📧',title:'Email',text:'Clean up forwarded message formatting.'},{icon:'📊',title:'Data',text:'Flatten multi-line fields.'}],
  body:`        <div class="form-row"><label for="inp">Text</label><textarea id="inp" placeholder="Paste text with line breaks..."></textarea></div>
        <div style="display:flex;gap:18px;margin-bottom:14px;flex-wrap:wrap">
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="keepPara" checked style="width:auto"> Keep paragraph breaks</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="useSpace" checked style="width:auto"> Replace with space</label>
        </div>
        <div class="form-row"><label>Result</label><textarea id="out" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Result</button></div>`,
  js:`    var inp=document.getElementById('inp'),keepPara=document.getElementById('keepPara'),useSpace=document.getElementById('useSpace'),out=document.getElementById('out');
    function calc(){var t=inp.value.replace(/\\r/g,''),rep=useSpace.checked?' ':'';
      if(keepPara.checked){t=t.split(/\\n{2,}/).map(function(p){return p.replace(/\\n/g,rep).replace(/[ \\t]{2,}/g,' ').trim();}).join('\\n\\n');}
      else{t=t.replace(/\\n/g,rep).replace(/[ \\t]{2,}/g,' ').trim();}
      out.value=t;}
    inp.addEventListener('input',calc);keepPara.addEventListener('change',calc);useSpace.addEventListener('change',calc);
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Result';},1500);});`
});

TOOLS.push({
  slug:'whitespace-remover', icon:'🧹', title:'Whitespace Remover', tagline:'Free Online Whitespace & Space Remover',
  category:'text',
  desc:'Clean up messy text: trim lines, collapse multiple spaces, remove blank lines, or strip all spaces. Multiple cleanup options in one tool.',
  cardDesc:'Trim, collapse spaces, remove blank lines and clean text.',
  keywords:'whitespace remover, remove extra spaces, trim text, remove blank lines, text cleaner',
  searchTerms:'whitespace remove spaces trim blank lines clean text',
  zh:'空白清理工具可去除多余空格、行首行尾空白、空行，或删除全部空格，多种清理选项一站搞定，适合整理复制来的杂乱文本。',
  howto:['Paste the text you want to clean.','Tick the cleanup options you need.','The cleaned text updates instantly.','Copy the tidy result.'],
  faq:[{q:'What does "collapse spaces" do?',a:'It replaces runs of multiple spaces/tabs with a single space, keeping words readable.'},{q:'Will it remove empty lines?',a:'Yes, when "Remove blank lines" is enabled, all empty or whitespace-only lines are deleted.'},{q:'Can I remove all spaces?',a:'Yes. "Remove all spaces" strips every space character, useful for compacting strings.'}],
  usecases:[{icon:'🧾',title:'Formatting',text:'Tidy up pasted or exported text.'},{icon:'💾',title:'Data Prep',text:'Normalize whitespace before import.'},{icon:'💻',title:'Coding',text:'Clean strings and config values.'}],
  body:`        <div class="form-row"><label for="inp">Text</label><textarea id="inp" placeholder="Paste messy text..."></textarea></div>
        <div style="display:flex;gap:16px;margin-bottom:14px;flex-wrap:wrap">
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="trim" checked style="width:auto"> Trim each line</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="collapse" checked style="width:auto"> Collapse spaces</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="blanks" style="width:auto"> Remove blank lines</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.9rem"><input type="checkbox" id="all" style="width:auto"> Remove ALL spaces</label>
        </div>
        <div class="form-row"><label>Result</label><textarea id="out" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Result</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out');var opts=['trim','collapse','blanks','all'].map(function(id){return document.getElementById(id);});
    function calc(){var t=inp.value.replace(/\\r/g,'');var lines=t.split('\\n');
      lines=lines.map(function(l){if(document.getElementById('collapse').checked)l=l.replace(/[ \\t]{2,}/g,' ');if(document.getElementById('trim').checked)l=l.replace(/^[ \\t]+|[ \\t]+$/g,'');return l;});
      if(document.getElementById('blanks').checked)lines=lines.filter(function(l){return l.trim()!=='';});
      t=lines.join('\\n');
      if(document.getElementById('all').checked)t=t.replace(/[ \\t]/g,'');
      out.value=t;}
    inp.addEventListener('input',calc);opts.forEach(function(e){e.addEventListener('change',calc);});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Result';},1500);});`
});

TOOLS.push({
  slug:'text-to-speech', icon:'🔊', title:'Text to Speech', tagline:'Free Online Text to Speech Reader',
  category:'text', popular:'New!',
  desc:'Convert text to natural-sounding speech in your browser. Choose a voice, adjust speed and pitch, then play, pause or stop — no signup.',
  cardDesc:'Read any text aloud with adjustable voice, speed and pitch.',
  keywords:'text to speech, tts, read text aloud, voice generator, speech synthesis online',
  searchTerms:'text to speech tts read aloud voice speech synthesis',
  zh:'文字转语音工具用浏览器内置语音合成把文字朗读出来，可选择音色、调节语速和音调，支持播放/暂停/停止，无需注册，适合朗读文章、练听力、辅助阅读。',
  howto:['Type or paste the text to read.','Select a voice from your system.','Adjust the speed and pitch sliders.','Press Play to listen; use Pause or Stop anytime.'],
  faq:[{q:'Which voices are available?',a:'The tool uses your device and browser voices, so the list depends on your operating system. More voices may appear on desktop browsers.'},{q:'Is audio uploaded anywhere?',a:'No. Speech is synthesized locally by your browser; nothing is sent to a server.'},{q:'Can I download the audio?',a:'Browser speech synthesis plays audio live and does not provide a downloadable file in most browsers.'}],
  usecases:[{icon:'📖',title:'Reading',text:'Listen to articles and notes hands-free.'},{icon:'🎧',title:'Learning',text:'Practice pronunciation and listening.'},{icon:'♿',title:'Accessibility',text:'Assist reading for low-vision users.'}],
  body:`        <div class="form-row"><label for="inp">Text</label><textarea id="inp" placeholder="Type text to read aloud..."></textarea></div>
        <div class="form-row"><label for="voice">Voice</label><select id="voice"></select></div>
        <div class="gen-row">
          <div class="form-row"><label>Speed: <span id="rateVal">1</span></label><input type="range" id="rate" min="0.5" max="2" step="0.1" value="1"></div>
          <div class="form-row"><label>Pitch: <span id="pitchVal">1</span></label><input type="range" id="pitch" min="0" max="2" step="0.1" value="1"></div>
        </div>
        <div class="btn-group"><button class="btn btn-primary" id="play">▶ Play</button><button class="btn btn-secondary" id="pause">⏸ Pause</button><button class="btn btn-secondary" id="stop">⏹ Stop</button></div>`,
  js:`    var synth=window.speechSynthesis,inp=document.getElementById('inp'),voice=document.getElementById('voice'),rate=document.getElementById('rate'),pitch=document.getElementById('pitch');
    document.getElementById('rate').addEventListener('input',function(){document.getElementById('rateVal').textContent=rate.value;});
    document.getElementById('pitch').addEventListener('input',function(){document.getElementById('pitchVal').textContent=pitch.value;});
    var voices=[];
    function loadVoices(){voices=synth.getVoices();voice.innerHTML=voices.map(function(v,i){return '<option value="'+i+'">'+v.name+' ('+v.lang+')'+(v.default?' — default':'')+'</option>';}).join('');}
    loadVoices();if(synth.onvoiceschanged!==undefined)synth.onvoiceschanged=loadVoices;
    document.getElementById('play').addEventListener('click',function(){if(!inp.value.trim())return;synth.cancel();var u=new SpeechSynthesisUtterance(inp.value);if(voices[voice.value])u.voice=voices[voice.value];u.rate=parseFloat(rate.value);u.pitch=parseFloat(pitch.value);synth.speak(u);});
    document.getElementById('pause').addEventListener('click',function(){if(synth.speaking&&!synth.paused)synth.pause();else if(synth.paused)synth.resume();});
    document.getElementById('stop').addEventListener('click',function(){synth.cancel();});`
});

TOOLS.push({
  slug:'fancy-text-generator', icon:'✨', title:'Fancy Text Generator', tagline:'Free Online Fancy Text & Font Generator',
  category:'text', popular:'Popular',
  desc:'Turn plain text into fancy Unicode fonts and styles — bold, monospace, fullwidth, circled, strikethrough and more — for bios and social media.',
  cardDesc:'Create fancy Unicode fonts for bios, posts and usernames.',
  keywords:'fancy text generator, cool fonts, unicode text, instagram fonts, stylish text, font generator',
  searchTerms:'fancy text font generator unicode cool stylish instagram bio',
  zh:'花式文字生成器可把普通文字转换成各种 Unicode 花体字：粗体、等宽、全角、圈圈字、删除线等，适合社交媒体昵称、简介、帖子，让文字更吸睛。',
  howto:['Type your text in the input box.','Browse the generated font styles below.','Click any style to copy it.','Paste it into Instagram, X, TikTok or anywhere.'],
  faq:[{q:'Will these work everywhere?',a:'They are real Unicode characters, so they work in most apps that support Unicode (Instagram, X, Discord, etc.). A few platforms may not render every style.'},{q:'Is this a real font?',a:'No — it maps letters to styled Unicode symbols, so no font install is needed and it copies as text.'},{q:'Why do some characters look plain?',a:'Only letters and digits have styled equivalents; punctuation stays as-is.'}],
  usecases:[{icon:'📱',title:'Social Bios',text:'Stand out on Instagram and TikTok.'},{icon:'🎮',title:'Usernames',text:'Create stylish gaming handles.'},{icon:'💬',title:'Chats',text:'Add flair to messages and posts.'}],
  body:`        <div class="form-row"><label for="inp">Your Text</label><input type="text" id="inp" placeholder="Type here..." value="Fancy Text"></div>
        <div id="list" class="gen-output"></div>`,
  js:`    var inp=document.getElementById('inp'),list=document.getElementById('list');
    function mapRange(s,ua,la,da){return Array.from(s).map(function(ch){var c=ch.charCodeAt(0);if(ch>='A'&&ch<='Z')return String.fromCodePoint(ua+(c-65));if(ch>='a'&&ch<='z')return String.fromCodePoint(la+(c-97));if(ch>='0'&&ch<='9'&&da)return String.fromCodePoint(da+(c-48));return ch;}).join('');}
    function circled(s){return Array.from(s).map(function(ch){var c=ch.charCodeAt(0);if(ch>='A'&&ch<='Z')return String.fromCodePoint(0x24B6+(c-65));if(ch>='a'&&ch<='z')return String.fromCodePoint(0x24D0+(c-97));if(ch==='0')return '⓪';if(ch>='1'&&ch<='9')return String.fromCodePoint(0x2460+(c-49));return ch;}).join('');}
    function combine(s,mark){return Array.from(s).map(function(ch){return ch===' '?ch:ch+mark;}).join('');}
    var styles=[
      {n:'Bold',f:function(s){return mapRange(s,0x1D400,0x1D41A,0x1D7CE);}},
      {n:'Bold Italic',f:function(s){return mapRange(s,0x1D468,0x1D482,0x1D7CE);}},
      {n:'Sans Bold',f:function(s){return mapRange(s,0x1D5D4,0x1D5EE,0x1D7EC);}},
      {n:'Monospace',f:function(s){return mapRange(s,0x1D670,0x1D68A,0x1D7F6);}},
      {n:'Fullwidth (Aesthetic)',f:function(s){return Array.from(s).map(function(ch){var c=ch.charCodeAt(0);return (c>=33&&c<=126)?String.fromCharCode(c-33+0xFF01):(ch===' '?'\\u3000':ch);}).join('');}},
      {n:'Circled',f:circled},
      {n:'Strikethrough',f:function(s){return combine(s,'\\u0336');}},
      {n:'Underline',f:function(s){return combine(s,'\\u0332');}}
    ];
    function render(){var t=inp.value||'';list.innerHTML=styles.map(function(st){var v=st.f(t);return '<div class="result-box" style="cursor:pointer;margin-bottom:10px" data-v="'+v.replace(/"/g,'&quot;')+'"><div style="font-size:.72rem;color:var(--text-muted);margin-bottom:4px">'+st.n+' — click to copy</div><div style="font-size:1.15rem;word-break:break-word">'+v+'</div></div>';}).join('');
      list.querySelectorAll('.result-box').forEach(function(el){el.addEventListener('click',function(){navigator.clipboard.writeText(this.getAttribute('data-v'));var d=this.querySelector('div');var o=d.textContent;d.textContent='✓ Copied!';var self=this;setTimeout(function(){d.textContent=o;},1200);});});}
    inp.addEventListener('input',render);render();`
});

/* ==================== DEVELOPER / WEB TOOLS (10) ==================== */

TOOLS.push({
  slug:'html-encoder', icon:'</>', title:'HTML Encoder / Decoder', tagline:'Free Online HTML Entity Encoder Decoder',
  category:'developer',
  desc:'Encode text to HTML entities or decode HTML entities back to plain text. Safely escape <, >, & and quotes for the web.',
  cardDesc:'Encode & decode HTML entities to safely display markup.',
  keywords:'html encoder, html decoder, html entities, escape html, encode special characters',
  searchTerms:'html encode decode entities escape special characters ampersand',
  zh:'HTML 编码/解码工具可把文本转成 HTML 实体（转义 <、>、& 和引号），也能把实体解码回普通文本，适合在网页里安全显示代码、防止 XSS 展示。',
  howto:['Paste text or HTML into the input box.','Click Encode to escape special characters.','Or click Decode to convert entities back.','Copy the converted output.'],
  faq:[{q:'Why encode HTML?',a:'Encoding turns characters like < and & into entities so they display as text instead of being interpreted as markup — essential for showing code safely.'},{q:'Which characters are encoded?',a:'The core special characters &, <, >, " and \' are converted; decoding also understands named and numeric entities.'},{q:'Does it prevent XSS?',a:'Escaping output is one important defense, but always combine it with proper server-side sanitization.'}],
  usecases:[{icon:'💻',title:'Documentation',text:'Show code snippets inside HTML pages.'},{icon:'🛡️',title:'Security',text:'Escape user content before display.'},{icon:'📧',title:'Email',text:'Encode entities for HTML emails.'}],
  body:`        <div class="form-row"><label for="inp">Input</label><textarea id="inp" placeholder="<div class=&quot;box&quot;>Hi</div>"></textarea></div>
        <div class="btn-group"><button class="btn btn-primary" id="enc">Encode →</button><button class="btn btn-secondary" id="dec">Decode →</button></div>
        <div class="form-row"><label>Output</label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Output</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out');
    function encode(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
    function decode(s){var el=document.createElement('textarea');el.innerHTML=s;return el.value;}
    document.getElementById('enc').addEventListener('click',function(){out.value=encode(inp.value);});
    document.getElementById('dec').addEventListener('click',function(){out.value=decode(inp.value);});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Output';},1500);});`
});

TOOLS.push({
  slug:'css-minifier', icon:'🎨', title:'CSS Minifier', tagline:'Free Online CSS Minifier & Compressor',
  category:'developer',
  desc:'Minify and compress CSS to reduce file size. Removes comments and unnecessary whitespace while keeping your styles intact.',
  cardDesc:'Minify CSS by removing comments and whitespace.',
  keywords:'css minifier, css compressor, minify css, compress css, css optimizer',
  searchTerms:'css minifier compressor minify optimize whitespace comments',
  zh:'CSS 压缩工具可去除注释和多余空白，减小 CSS 文件体积、加快网页加载，适合上线前压缩样式表。',
  howto:['Paste your CSS into the input box.','Click Minify to compress it.','Review the size saved.','Copy the minified CSS for production.'],
  faq:[{q:'Is minified CSS still valid?',a:'Yes. Minification only removes comments and redundant whitespace; the rules and selectors are unchanged.'},{q:'How much can I save?',a:'Typical savings are 20–50% depending on how much whitespace and how many comments your CSS contains.'},{q:'Does it change my styles?',a:'No. Output CSS behaves identically to the input, just smaller.'}],
  usecases:[{icon:'⚡',title:'Performance',text:'Shrink stylesheets for faster loads.'},{icon:'🚀',title:'Deployment',text:'Prepare CSS for production builds.'},{icon:'📦',title:'Bundling',text:'Reduce asset sizes before shipping.'}],
  body:`        <div class="form-row"><label for="inp">CSS Input</label><textarea id="inp" class="gen-mono" placeholder="body {\\n  color: red;\\n}"></textarea></div>
        <div class="btn-group"><button class="btn btn-primary" id="run">Minify CSS</button></div>
        <div class="form-row"><label>Minified Output <span id="stat" style="color:var(--text-secondary);font-weight:400"></span></label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Output</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out'),stat=document.getElementById('stat');
    function minify(css){return css.replace(/\\/\\*[\\s\\S]*?\\*\\//g,'').replace(/\\s+/g,' ').replace(/\\s*([{}:;,>~+])\\s*/g,'$1').replace(/;}/g,'}').trim();}
    document.getElementById('run').addEventListener('click',function(){var o=minify(inp.value);out.value=o;var a=inp.value.length,b=o.length,saved=a?Math.round((1-b/a)*100):0;stat.textContent='— '+a+' → '+b+' bytes ('+saved+'% smaller)';});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var x=this;setTimeout(function(){x.textContent='Copy Output';},1500);});`
});

TOOLS.push({
  slug:'json-minifier', icon:'🗜️', title:'JSON Minifier', tagline:'Free Online JSON Minifier & Compressor',
  category:'developer',
  desc:'Minify JSON by removing all whitespace, and validate it at the same time. Compress JSON payloads for smaller size and faster transfer.',
  cardDesc:'Minify and validate JSON to shrink payload size.',
  keywords:'json minifier, minify json, compress json, json compressor, json validator',
  searchTerms:'json minifier compressor minify validate whitespace',
  zh:'JSON 压缩工具在压缩的同时校验 JSON 合法性，去除所有空白以减小体积、加快传输，适合压缩接口数据和配置文件。',
  howto:['Paste your JSON into the input box.','Click Minify to compress and validate it.','Fix any reported syntax errors.','Copy the compact JSON output.'],
  faq:[{q:'Does it validate my JSON?',a:'Yes. Invalid JSON triggers a clear error message pointing to the problem so you can fix it.'},{q:'Is data uploaded?',a:'No. Parsing and minifying happen locally in your browser.'},{q:'What is the difference from a formatter?',a:'A formatter adds indentation for readability; a minifier removes all whitespace for the smallest size.'}],
  usecases:[{icon:'📡',title:'APIs',text:'Compress request and response bodies.'},{icon:'⚙️',title:'Config',text:'Ship compact config files.'},{icon:'✅',title:'Validation',text:'Catch JSON errors while minifying.'}],
  body:`        <div class="form-row"><label for="inp">JSON Input</label><textarea id="inp" class="gen-mono" placeholder='{ &quot;name&quot;: &quot;value&quot; }'></textarea></div>
        <div class="btn-group"><button class="btn btn-primary" id="run">Minify JSON</button></div>
        <div class="form-row"><label>Output <span id="stat" style="color:var(--text-secondary);font-weight:400"></span></label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Output</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out'),stat=document.getElementById('stat');
    document.getElementById('run').addEventListener('click',function(){try{var o=JSON.stringify(JSON.parse(inp.value));out.value=o;var a=inp.value.length,b=o.length,saved=a?Math.round((1-b/a)*100):0;stat.textContent='— '+a+' → '+b+' bytes ('+saved+'% smaller)';stat.style.color='var(--success)';}catch(e){out.value='';stat.textContent='— Error: '+e.message;stat.style.color='#f87171';}});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var x=this;setTimeout(function(){x.textContent='Copy Output';},1500);});`
});

TOOLS.push({
  slug:'html-minifier', icon:'📄', title:'HTML Minifier', tagline:'Free Online HTML Minifier & Compressor',
  category:'developer',
  desc:'Minify HTML by removing comments and collapsing whitespace to reduce page size and speed up load times.',
  cardDesc:'Minify HTML by removing comments and extra whitespace.',
  keywords:'html minifier, minify html, compress html, html compressor, html optimizer',
  searchTerms:'html minifier compressor minify whitespace comments optimize',
  zh:'HTML 压缩工具可去除注释、折叠多余空白，减小页面体积、提升加载速度，适合上线前压缩静态页面。',
  howto:['Paste your HTML markup.','Click Minify to compress it.','Check the size reduction.','Copy the minified HTML.'],
  faq:[{q:'Will it break my page?',a:'It preserves the content of <pre>, <textarea>, <script> and <style> blocks and only collapses whitespace elsewhere, so pages usually render identically.'},{q:'Are comments removed?',a:'Standard HTML comments are removed. Keep important ones by using conditional comments if needed.'},{q:'How much smaller?',a:'Savings depend on formatting; heavily indented pages can drop 10–30%.'}],
  usecases:[{icon:'⚡',title:'Speed',text:'Reduce HTML weight for faster loads.'},{icon:'📦',title:'Build Step',text:'Minify templates before deploy.'},{icon:'📧',title:'Email',text:'Compact HTML email markup.'}],
  body:`        <div class="form-row"><label for="inp">HTML Input</label><textarea id="inp" class="gen-mono" placeholder="<div>  Hello  </div>"></textarea></div>
        <div class="btn-group"><button class="btn btn-primary" id="run">Minify HTML</button></div>
        <div class="form-row"><label>Output <span id="stat" style="color:var(--text-secondary);font-weight:400"></span></label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Output</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out'),stat=document.getElementById('stat');
    function minify(html){var store=[],i=0;
      html=html.replace(/<(pre|textarea|script|style)[\\s\\S]*?<\\/\\1>/gi,function(m){store.push(m);return '\\u0000'+(i++)+'\\u0000';});
      html=html.replace(/<!--(?!\\[if)[\\s\\S]*?-->/g,'').replace(/>\\s+</g,'><').replace(/\\s{2,}/g,' ').replace(/\\s+>/g,'>').trim();
      html=html.replace(/\\u0000(\\d+)\\u0000/g,function(_,n){return store[n];});
      return html;}
    document.getElementById('run').addEventListener('click',function(){var o=minify(inp.value);out.value=o;var a=inp.value.length,b=o.length,saved=a?Math.round((1-b/a)*100):0;stat.textContent='— '+a+' → '+b+' bytes ('+saved+'% smaller)';});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var x=this;setTimeout(function(){x.textContent='Copy Output';},1500);});`
});

TOOLS.push({
  slug:'markdown-to-html', icon:'📝', title:'Markdown to HTML', tagline:'Free Online Markdown to HTML Converter',
  category:'developer', popular:'Popular',
  desc:'Convert Markdown to clean HTML with a live preview. Supports headings, bold, italic, links, images, lists, code and blockquotes.',
  cardDesc:'Convert Markdown to HTML with a live preview.',
  keywords:'markdown to html, md to html, markdown converter, markdown preview, convert markdown',
  searchTerms:'markdown html converter md preview readme',
  zh:'Markdown 转 HTML 工具支持标题、粗体、斜体、链接、图片、列表、代码、引用，并带实时预览，适合把 README、笔记转成网页 HTML。',
  howto:['Type or paste Markdown on the left.','See the live HTML preview update.','Switch to the HTML tab to view the code.','Copy the generated HTML.'],
  faq:[{q:'Which Markdown features are supported?',a:'Headings, bold, italic, inline and block code, links, images, ordered/unordered lists, blockquotes, horizontal rules and paragraphs.'},{q:'Is it CommonMark compliant?',a:'It covers the most common syntax. For edge cases, output may differ slightly from full CommonMark parsers.'},{q:'Is my text uploaded?',a:'No. Conversion happens entirely in your browser.'}],
  usecases:[{icon:'📘',title:'READMEs',text:'Turn project docs into HTML.'},{icon:'✍️',title:'Blogging',text:'Write in Markdown, publish as HTML.'},{icon:'📧',title:'Newsletters',text:'Convert notes into email-ready HTML.'}],
  body:`        <div class="form-row"><label for="inp">Markdown</label><textarea id="inp" class="gen-mono" placeholder="# Hello\\n\\nSome **bold** text and a [link](https://example.com)."></textarea></div>
        <div class="btn-group"><button class="btn btn-primary" id="tabPrev">Preview</button><button class="btn btn-secondary" id="tabCode">HTML Code</button></div>
        <div class="result-box" id="preview" style="min-height:120px"></div>
        <div class="form-row" style="display:none"><label>HTML</label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy HTML</button></div>`,
  js:`    var inp=document.getElementById('inp'),preview=document.getElementById('preview'),out=document.getElementById('out'),outRow=out.parentElement;
    function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function inline(s){return s.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g,'<img alt="$1" src="$2">').replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g,'<a href="$2">$1</a>').replace(/\\*\\*([^*]+)\\*\\*/g,'<strong>$1</strong>').replace(/\\*([^*]+)\\*/g,'<em>$1</em>').replace(/\`([^\`]+)\`/g,'<code>$1</code>');}
    function md(src){var lines=src.replace(/\\r/g,'').split('\\n'),html=[],i=0;
      while(i<lines.length){var line=lines[i];
        if(/^\`\`\`/.test(line)){var code=[];i++;while(i<lines.length&&!/^\`\`\`/.test(lines[i])){code.push(esc(lines[i]));i++;}i++;html.push('<pre><code>'+code.join('\\n')+'</code></pre>');continue;}
        if(/^#{1,6}\\s/.test(line)){var lvl=line.match(/^#+/)[0].length;html.push('<h'+lvl+'>'+inline(esc(line.replace(/^#+\\s/,'')))+'</h'+lvl+'>');i++;continue;}
        if(/^\\s*([-*+])\\s/.test(line)){var items=[];while(i<lines.length&&/^\\s*([-*+])\\s/.test(lines[i])){items.push('<li>'+inline(esc(lines[i].replace(/^\\s*([-*+])\\s/,'')))+'</li>');i++;}html.push('<ul>'+items.join('')+'</ul>');continue;}
        if(/^\\s*\\d+\\.\\s/.test(line)){var oi=[];while(i<lines.length&&/^\\s*\\d+\\.\\s/.test(lines[i])){oi.push('<li>'+inline(esc(lines[i].replace(/^\\s*\\d+\\.\\s/,'')))+'</li>');i++;}html.push('<ol>'+oi.join('')+'</ol>');continue;}
        if(/^\\s*>\\s?/.test(line)){var q=[];while(i<lines.length&&/^\\s*>\\s?/.test(lines[i])){q.push(inline(esc(lines[i].replace(/^\\s*>\\s?/,''))));i++;}html.push('<blockquote>'+q.join('<br>')+'</blockquote>');continue;}
        if(/^\\s*(-{3,}|\\*{3,})\\s*$/.test(line)){html.push('<hr>');i++;continue;}
        if(line.trim()===''){i++;continue;}
        var para=[];while(i<lines.length&&lines[i].trim()!==''&&!/^(#{1,6}\\s|\\s*([-*+])\\s|\\s*\\d+\\.\\s|\\s*>|\`\`\`)/.test(lines[i])){para.push(inline(esc(lines[i])));i++;}html.push('<p>'+para.join('<br>')+'</p>');
      }
      return html.join('\\n');}
    function render(){var h=md(inp.value);out.value=h;preview.innerHTML=h;}
    inp.addEventListener('input',render);
    document.getElementById('tabPrev').addEventListener('click',function(){preview.style.display='';outRow.style.display='none';});
    document.getElementById('tabCode').addEventListener('click',function(){preview.style.display='none';outRow.style.display='';});
    document.getElementById('copyBtn').addEventListener('click',function(){navigator.clipboard.writeText(out.value);this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy HTML';},1500);});
    render();`
});

TOOLS.push({
  slug:'csv-to-json', icon:'🔄', title:'CSV to JSON', tagline:'Free Online CSV to JSON Converter',
  category:'developer',
  desc:'Convert CSV data to a JSON array of objects. Handles quoted fields, commas inside values and custom delimiters.',
  cardDesc:'Convert CSV to a JSON array of objects instantly.',
  keywords:'csv to json, convert csv to json, csv json converter, csv parser online',
  searchTerms:'csv to json converter parse table data',
  zh:'CSV 转 JSON 工具可把表格 CSV 数据转成 JSON 对象数组，正确处理带引号的字段、字段内逗号和自定义分隔符，适合数据导入和接口调试。',
  howto:['Paste your CSV data (first row as headers).','Choose the delimiter if not a comma.','Click Convert to generate JSON.','Copy the JSON array output.'],
  faq:[{q:'Does the first row become keys?',a:'Yes. The first row is treated as the header, and each following row becomes an object using those keys.'},{q:'Are quoted fields supported?',a:'Yes. Fields wrapped in double quotes may contain commas, quotes and line breaks.'},{q:'What delimiters work?',a:'Comma, semicolon and tab are supported via the delimiter selector.'}],
  usecases:[{icon:'📊',title:'Data Import',text:'Turn spreadsheets into JSON for apps.'},{icon:'🔌',title:'APIs',text:'Prepare JSON payloads from CSV.'},{icon:'🧪',title:'Testing',text:'Generate JSON test fixtures.'}],
  body:`        <div class="form-row"><label for="inp">CSV Input</label><textarea id="inp" class="gen-mono" placeholder="name,age\\nAlice,30\\nBob,25"></textarea></div>
        <div class="gen-row">
          <div class="form-row"><label for="delim">Delimiter</label><select id="delim"><option value=",">Comma ( , )</option><option value=";">Semicolon ( ; )</option><option value="\\t">Tab</option></select></div>
          <div class="form-row"><label for="pretty">Format</label><select id="pretty"><option value="2">Pretty (indented)</option><option value="0">Minified</option></select></div>
        </div>
        <div class="btn-group"><button class="btn btn-primary" id="run">Convert to JSON</button></div>
        <div class="form-row"><label>JSON Output <span id="err" style="color:#f87171;font-weight:400"></span></label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy JSON</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out'),err=document.getElementById('err');
    function parseCSV(text,d){var rows=[],row=[],field='',q=false;for(var i=0;i<text.length;i++){var c=text[i];
      if(q){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else q=false;}else field+=c;}
      else{if(c==='"')q=true;else if(c===d){row.push(field);field='';}else if(c==='\\n'){row.push(field);rows.push(row);row=[];field='';}else if(c==='\\r'){}else field+=c;}}
      if(field!==''||row.length){row.push(field);rows.push(row);}return rows;}
    document.getElementById('run').addEventListener('click',function(){err.textContent='';var d=document.getElementById('delim').value.replace('\\\\t','\\t');try{var rows=parseCSV(inp.value.trim(),d);if(rows.length<1){out.value='[]';return;}var headers=rows[0],arr=[];for(var r=1;r<rows.length;r++){var o={};for(var c=0;c<headers.length;c++)o[headers[c]]=rows[r][c]!==undefined?rows[r][c]:'';arr.push(o);}out.value=JSON.stringify(arr,null,parseInt(document.getElementById('pretty').value));}catch(e){err.textContent='— '+e.message;out.value='';}});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy JSON';},1500);});`
});

TOOLS.push({
  slug:'json-to-csv', icon:'📊', title:'JSON to CSV', tagline:'Free Online JSON to CSV Converter',
  category:'developer',
  desc:'Convert a JSON array of objects into CSV. Automatically builds the header row and safely quotes values with commas or quotes.',
  cardDesc:'Convert a JSON array of objects into clean CSV.',
  keywords:'json to csv, convert json to csv, json csv converter, export json to csv',
  searchTerms:'json to csv converter table export spreadsheet',
  zh:'JSON 转 CSV 工具可把 JSON 对象数组转成 CSV 表格，自动生成表头、对含逗号或引号的值正确加引号，适合把接口数据导出到 Excel。',
  howto:['Paste a JSON array of objects.','Click Convert to generate CSV.','Fix any JSON errors reported.','Copy the CSV or paste it into a spreadsheet.'],
  faq:[{q:'What JSON shape is required?',a:'An array of flat objects, e.g. [{"a":1,"b":2}, ...]. Keys across objects are merged into the header row.'},{q:'How are special characters handled?',a:'Values containing commas, quotes or line breaks are wrapped in double quotes with quotes escaped, per CSV rules.'},{q:'Are nested objects supported?',a:'Nested values are serialized as JSON strings within the cell. Flatten your data first for best results.'}],
  usecases:[{icon:'📈',title:'Spreadsheets',text:'Move JSON data into Excel or Sheets.'},{icon:'🗄️',title:'Exports',text:'Create CSV downloads from API data.'},{icon:'📊',title:'Reporting',text:'Prepare tabular reports from JSON.'}],
  body:`        <div class="form-row"><label for="inp">JSON Input</label><textarea id="inp" class="gen-mono" placeholder='[{&quot;name&quot;:&quot;Alice&quot;,&quot;age&quot;:30}]'></textarea></div>
        <div class="btn-group"><button class="btn btn-primary" id="run">Convert to CSV</button></div>
        <div class="form-row"><label>CSV Output <span id="err" style="color:#f87171;font-weight:400"></span></label><textarea id="out" class="gen-mono" readonly></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy CSV</button></div>`,
  js:`    var inp=document.getElementById('inp'),out=document.getElementById('out'),err=document.getElementById('err');
    function cell(v){if(v===null||v===undefined)return '';if(typeof v==='object')v=JSON.stringify(v);v=String(v);if(/[",\\n]/.test(v))v='"'+v.replace(/"/g,'""')+'"';return v;}
    document.getElementById('run').addEventListener('click',function(){err.textContent='';try{var data=JSON.parse(inp.value);if(!Array.isArray(data))throw new Error('JSON must be an array of objects');var keys=[];data.forEach(function(o){Object.keys(o||{}).forEach(function(k){if(keys.indexOf(k)<0)keys.push(k);});});var lines=[keys.map(cell).join(',')];data.forEach(function(o){lines.push(keys.map(function(k){return cell(o?o[k]:'');}).join(','));});out.value=lines.join('\\n');}catch(e){err.textContent='— '+e.message;out.value='';}});
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy CSV';},1500);});`
});

TOOLS.push({
  slug:'jwt-decoder', icon:'🔐', title:'JWT Decoder', tagline:'Free Online JWT Token Decoder',
  category:'developer',
  desc:'Decode a JSON Web Token (JWT) to inspect its header and payload. Views claims like exp and iat locally without sending the token anywhere.',
  cardDesc:'Decode JWT header and payload to inspect claims.',
  keywords:'jwt decoder, decode jwt, json web token decoder, jwt parser, jwt viewer',
  searchTerms:'jwt decoder json web token decode header payload claims',
  zh:'JWT 解码器可解析 JSON Web Token 的头部和载荷，查看 exp、iat 等声明，全部在浏览器本地完成、不上传令牌，适合调试登录鉴权。',
  howto:['Paste your JWT into the input box.','The header and payload are decoded instantly.','Review the claims and expiry time.','Nothing is uploaded — it is safe to inspect.'],
  faq:[{q:'Does it verify the signature?',a:'No. This tool only decodes the token for inspection. Signature verification requires your secret/key and should be done server-side.'},{q:'Is my token sent anywhere?',a:'No. Decoding is fully local in your browser, so it is safe for sensitive tokens.'},{q:'What do exp and iat mean?',a:'exp is the expiration time and iat is the issued-at time, both as Unix timestamps; we show them in readable form.'}],
  usecases:[{icon:'🔑',title:'Auth Debugging',text:'Inspect claims during development.'},{icon:'⏰',title:'Expiry Checks',text:'See when a token expires.'},{icon:'🧪',title:'Testing',text:'Verify payload contents quickly.'}],
  body:`        <div class="form-row"><label for="inp">JWT</label><textarea id="inp" class="gen-mono" placeholder="eyJhbGciOi..."></textarea></div>
        <div class="form-row"><label>Header</label><textarea id="head" class="gen-mono" readonly style="min-height:80px"></textarea></div>
        <div class="form-row"><label>Payload <span id="exp" style="color:var(--text-secondary);font-weight:400"></span></label><textarea id="pay" class="gen-mono" readonly></textarea></div>`,
  js:`    var inp=document.getElementById('inp'),head=document.getElementById('head'),pay=document.getElementById('pay'),exp=document.getElementById('exp');
    function b64url(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}
    function calc(){var t=inp.value.trim();exp.textContent='';if(!t){head.value='';pay.value='';return;}var parts=t.split('.');if(parts.length<2){head.value='';pay.value='Invalid JWT (needs header.payload.signature)';return;}
      try{var h=JSON.parse(b64url(parts[0]));head.value=JSON.stringify(h,null,2);}catch(e){head.value='Invalid header';}
      try{var p=JSON.parse(b64url(parts[1]));pay.value=JSON.stringify(p,null,2);if(p.exp){var d=new Date(p.exp*1000),now=Date.now();exp.textContent='— expires '+d.toLocaleString()+(now>p.exp*1000?' (EXPIRED)':'');}}catch(e){pay.value='Invalid payload';}}
    inp.addEventListener('input',calc);`
});

TOOLS.push({
  slug:'cron-expression-generator', icon:'⏰', title:'Cron Expression Generator', tagline:'Free Online Crontab Generator & Explainer',
  category:'developer',
  desc:'Build and understand cron schedules. Pick minute, hour, day, month and weekday to generate a crontab expression with a plain-English description.',
  cardDesc:'Build cron expressions and get a plain-English schedule.',
  keywords:'cron expression generator, crontab generator, cron schedule, cron explainer, cron builder',
  searchTerms:'cron crontab expression generator schedule job explainer',
  zh:'Cron 表达式生成器通过下拉选择分钟、小时、日、月、星期，生成 crontab 表达式并给出通俗的中英文调度说明，适合配置定时任务。',
  howto:['Pick a preset or set each field manually.','Use * for every value or a specific number.','The cron expression updates automatically.','Read the plain-English description to confirm.'],
  faq:[{q:'What is the cron field order?',a:'Minute, Hour, Day-of-month, Month, Day-of-week — five fields separated by spaces.'},{q:'What does * mean?',a:'An asterisk means "every" value for that field, e.g. * in the hour field means every hour.'},{q:'Can I use step values?',a:'Yes, the presets include steps like */5 (every 5 minutes). You can also type any field manually.'}],
  usecases:[{icon:'🖥️',title:'Servers',text:'Schedule backups and maintenance jobs.'},{icon:'⚙️',title:'CI/CD',text:'Set up recurring pipeline runs.'},{icon:'📨',title:'Automation',text:'Time emails, reports and scripts.'}],
  body:`        <div class="form-row"><label for="preset">Preset</label><select id="preset"><option value="">Custom</option><option value="* * * * *">Every minute</option><option value="*/5 * * * *">Every 5 minutes</option><option value="0 * * * *">Every hour</option><option value="0 0 * * *">Every day at midnight</option><option value="0 9 * * 1-5">Weekdays at 9am</option><option value="0 0 * * 0">Every Sunday</option><option value="0 0 1 * *">First of every month</option></select></div>
        <div class="gen-row">
          <div class="form-row"><label for="min">Minute</label><input type="text" id="min" value="*" class="gen-mono"></div>
          <div class="form-row"><label for="hour">Hour</label><input type="text" id="hour" value="*" class="gen-mono"></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="dom">Day of Month</label><input type="text" id="dom" value="*" class="gen-mono"></div>
          <div class="form-row"><label for="mon">Month</label><input type="text" id="mon" value="*" class="gen-mono"></div>
        </div>
        <div class="form-row"><label for="dow">Day of Week (0-6, Sun=0)</label><input type="text" id="dow" value="*" class="gen-mono"></div>
        <div class="result-box gen-mono" id="out" style="font-size:1.3rem"></div>
        <div class="result-box" id="desc" style="margin-top:10px"></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Expression</button></div>`,
  js:`    var ids=['min','hour','dom','mon','dow'],out=document.getElementById('out'),desc=document.getElementById('desc'),preset=document.getElementById('preset');
    function g(id){return document.getElementById(id).value.trim()||'*';}
    function describe(m,h,dom,mon,dow){var p=[];p.push(m==='*'?'every minute':'at minute '+m);p.push(h==='*'?'':'hour '+h);var d=[];if(dom!=='*')d.push('day-of-month '+dom);if(mon!=='*')d.push('month '+mon);if(dow!=='*')d.push('day-of-week '+dow);return 'Runs '+p.filter(Boolean).join(', ')+(d.length?', on '+d.join(', '):'')+'.';}
    function calc(){var m=g('min'),h=g('hour'),dom=g('dom'),mon=g('mon'),dow=g('dow');out.textContent=[m,h,dom,mon,dow].join(' ');desc.textContent=describe(m,h,dom,mon,dow);}
    ids.forEach(function(id){document.getElementById(id).addEventListener('input',calc);});
    preset.addEventListener('change',function(){if(!preset.value)return;var p=preset.value.split(' ');ids.forEach(function(id,i){document.getElementById(id).value=p[i];});calc();});
    document.getElementById('copyBtn').addEventListener('click',function(){navigator.clipboard.writeText(out.textContent);this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Expression';},1500);});
    calc();`
});

TOOLS.push({
  slug:'http-status-codes', icon:'🌐', title:'HTTP Status Codes', tagline:'Free HTTP Status Code Reference & Lookup',
  category:'developer',
  desc:'Search and look up HTTP status codes with clear explanations — from 200 OK to 404 Not Found and 500 Internal Server Error.',
  cardDesc:'Search HTTP status codes with clear explanations.',
  keywords:'http status codes, http status code list, 404 meaning, 500 error, status code reference',
  searchTerms:'http status codes list reference 200 404 500 error lookup',
  zh:'HTTP 状态码参考与查询工具，收录 1xx-5xx 常见状态码及通俗解释，支持按码号或关键词搜索，适合前后端调试接口。',
  howto:['Type a code number or keyword to search.','Browse the filtered list of status codes.','Read the meaning and category of each code.','Use it as a quick reference while debugging.'],
  faq:[{q:'What do the code categories mean?',a:'1xx informational, 2xx success, 3xx redirection, 4xx client errors, 5xx server errors.'},{q:'What is the difference between 401 and 403?',a:'401 Unauthorized means authentication is required or failed; 403 Forbidden means you are authenticated but not allowed.'},{q:'When is 500 used?',a:'500 Internal Server Error is a generic message when the server hits an unexpected condition.'}],
  usecases:[{icon:'🐞',title:'Debugging',text:'Understand API and server responses.'},{icon:'📚',title:'Learning',text:'Study how HTTP works.'},{icon:'🔧',title:'Development',text:'Choose the right code for responses.'}],
  body:`        <div class="form-row"><label for="q">Search codes</label><input type="text" id="q" placeholder="e.g. 404, not found, redirect"></div>
        <div id="list" class="gen-output"></div>`,
  js:`    var codes=[[100,'Continue','Informational — the server received the request headers.'],[101,'Switching Protocols','Informational — the server is switching protocols as requested.'],[200,'OK','Success — the request succeeded.'],[201,'Created','Success — a new resource was created.'],[202,'Accepted','Success — request accepted but not yet processed.'],[204,'No Content','Success — no content to return.'],[206,'Partial Content','Success — partial resource delivered (range request).'],[301,'Moved Permanently','Redirect — resource permanently moved to a new URL.'],[302,'Found','Redirect — resource temporarily at a different URL.'],[304,'Not Modified','Redirect — cached version is still valid.'],[307,'Temporary Redirect','Redirect — repeat request to new URL, keep method.'],[308,'Permanent Redirect','Redirect — permanent, keep method.'],[400,'Bad Request','Client error — malformed request syntax.'],[401,'Unauthorized','Client error — authentication required or failed.'],[403,'Forbidden','Client error — authenticated but not allowed.'],[404,'Not Found','Client error — resource does not exist.'],[405,'Method Not Allowed','Client error — HTTP method not supported.'],[408,'Request Timeout','Client error — the server timed out waiting.'],[409,'Conflict','Client error — request conflicts with current state.'],[410,'Gone','Client error — resource permanently removed.'],[418,'I\\'m a teapot','Fun — the server refuses to brew coffee.'],[422,'Unprocessable Entity','Client error — semantic errors in the request.'],[429,'Too Many Requests','Client error — rate limit exceeded.'],[500,'Internal Server Error','Server error — unexpected condition.'],[501,'Not Implemented','Server error — functionality not supported.'],[502,'Bad Gateway','Server error — invalid response from upstream.'],[503,'Service Unavailable','Server error — server overloaded or down.'],[504,'Gateway Timeout','Server error — upstream timed out.']];
    var q=document.getElementById('q'),list=document.getElementById('list');
    function color(c){if(c<200)return '#38bdf8';if(c<300)return 'var(--success)';if(c<400)return 'var(--info)';if(c<500)return 'var(--warning)';return '#f87171';}
    function render(){var term=q.value.toLowerCase();var f=codes.filter(function(c){return !term||(''+c[0]).indexOf(term)>=0||c[1].toLowerCase().indexOf(term)>=0||c[2].toLowerCase().indexOf(term)>=0;});
      list.innerHTML=f.map(function(c){return '<div class="result-box" style="margin-bottom:8px;display:flex;gap:12px;align-items:baseline"><span class="gen-big" style="font-size:1.3rem;color:'+color(c[0])+';min-width:52px">'+c[0]+'</span><span><b>'+c[1]+'</b><br><span style="color:var(--text-secondary);font-size:.9rem">'+c[2]+'</span></span></div>';}).join('')||'<div class="result-box empty">No matching codes.</div>';}
    q.addEventListener('input',render);render();`
});


/* ==================== FUN / EXTRA (5) ==================== */

TOOLS.push({
  slug:'random-number-generator', icon:'🎲', title:'Random Number Generator', tagline:'Free Online Random Number Generator',
  category:'fun',
  desc:'Generate random integers within any range. Pick one or many numbers, optionally unique, for games, giveaways, sampling and quick decisions.',
  cardDesc:'Generate random numbers in any range, single or many.',
  keywords:'random number generator, random integer, pick a number, random number picker, rng',
  searchTerms:'random number generator integer pick range luck draw',
  zh:'随机数生成器可在任意范围内生成随机整数，支持一次出一个或多个、可设置不重复，适合抽奖、抽签、抽样、做决定。',
  howto:['Set the minimum and maximum range.','Choose how many numbers to generate.','Toggle unique to avoid duplicates.','Click Generate and copy the results.'],
  faq:[{q:'Are the numbers truly random?',a:'They use your browser’s crypto-grade random generator for strong unpredictability.'},{q:'Can I get unique numbers only?',a:'Yes — enable the unique option and the tool will not repeat a value within one draw.'},{q:'What is the maximum range?',a:'The range is limited only by JavaScript’s safe integer size, which is plenty for everyday use.'}],
  usecases:[{icon:'🎁',title:'Giveaways',text:'Pick unbiased winners from a list.'},{icon:'🎯',title:'Decisions',text:'Let chance choose for you.'},{icon:'🧪',title:'Sampling',text:'Draw random samples for tests.'}],
  body:`        <div class="gen-row">
          <div class="form-row"><label for="min">Minimum</label><input type="number" id="min" value="1"></div>
          <div class="form-row"><label for="max">Maximum</label><input type="number" id="max" value="100"></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="count">How many</label><input type="number" id="count" value="1" min="1" max="1000"></div>
          <div class="form-row"><label for="uniq">Options</label><div style="display:flex;align-items:center;gap:8px;padding-top:10px"><input type="checkbox" id="uniq" style="width:auto"> <span style="font-size:.9rem">Unique only</span></div></div>
        </div>
        <div class="btn-group"><button class="btn btn-primary" id="genBtn">Generate</button></div>
        <div class="result-box empty" id="out">Your random numbers will appear here.</div>`,
  js:`    var min=document.getElementById('min'),max=document.getElementById('max'),count=document.getElementById('count'),uniq=document.getElementById('uniq'),out=document.getElementById('out'),btn=document.getElementById('genBtn');
    function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
    btn.addEventListener('click',function(){var a=parseInt(min.value)||0,b=parseInt(max.value)||0,n=Math.min(parseInt(count.value)||1,1000);if(a>b){var t=a;a=b;b=t;}var res=[];if(uniq.checked){var pool=[];for(var i=a;i<=b;i++)pool.push(i);for(var k=0;k<n&&pool.length;k++){var idx=Math.floor(Math.random()*pool.length);res.push(pool.splice(idx,1)[0]);}}else{for(var j=0;j<n;j++){res.push(rnd(a,b));}}out.className='result-box';out.textContent=res.join(', ');});`
});

TOOLS.push({
  slug:'morse-code-translator', icon:'📻', title:'Morse Code Translator', tagline:'Free Online Morse Code Translator',
  category:'converter',
  desc:'Translate text to Morse code and decode Morse back to text. Supports letters, numbers and common punctuation with a dot/dash playback option.',
  cardDesc:'Convert text to Morse code and decode Morse back.',
  keywords:'morse code translator, text to morse, morse to text, morse decoder, dot dash',
  searchTerms:'morse code translate text dots dashes decode',
  zh:'摩斯密码翻译器可把文字转成摩斯密码（点划），也能把摩斯解码回文字，支持字母、数字与常见标点，适合学习、趣味、应急通信。',
  howto:['Type text to convert to Morse, or Morse to decode.','Switch the direction with the mode menu.','Copy the translated result.','Optionally play the beeps in the browser.'],
  faq:[{q:'What characters are supported?',a:'A–Z, 0–9 and common punctuation. Unknown characters are skipped or marked with a placeholder.'},{q:'Can it play the sound?',a:'Yes — use the play button to hear dot/dash beeps via the Web Audio API.'},{q:'Is it case sensitive?',a:'No; input is treated as uppercase before encoding.'}],
  usecases:[{icon:'📚',title:'Learning',text:'Study Morse code basics.'},{icon:'🎮',title:'Fun',text:'Send secret messages to friends.'},{icon:'🆘',title:'Signaling',text:'Understand emergency communication.'}],
  body:`        <div class="form-row"><label for="mode">Mode</label><select id="mode"><option value="to">Text → Morse</option><option value="from">Morse → Text</option></select></div>
        <div class="form-row"><label for="inp">Input</label><textarea id="inp" placeholder="HELLO WORLD"></textarea></div>
        <div class="form-row"><label>Result</label><textarea id="out" readonly placeholder=".... . .-.. .-.. --- / .-- --- .-. .-.. -.."></textarea></div>
        <div class="btn-group"><button class="btn btn-secondary" id="copyBtn">Copy Result</button><button class="btn btn-secondary" id="playBtn">▶ Play</button></div>`,
  js:`    var M={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.',',':'--..--','.':'.-.-.-','?':'..--..','/':'-..-.','=':'-...-',':':'---...','!':'-.-.--','-':'-....-','(':'-.--.',')':'-.--.-',"'":'.----.'};
    var mode=document.getElementById('mode'),inp=document.getElementById('inp'),out=document.getElementById('out');
    function calc(){var t=inp.value;if(!t){out.value='';return;}if(mode.value==='to'){out.value=t.toUpperCase().split('').map(function(c){return M[c]||('['+c+']');}).join(' ');}else{out.value=t.trim().split(/\\s+/).map(function(code){for(var k in M){if(M[k]===code)return k;}return '?';}).join('');}}
    inp.addEventListener('input',calc);mode.addEventListener('change',calc);
    document.getElementById('copyBtn').addEventListener('click',function(){out.select();document.execCommand('copy');this.textContent='✓ Copied!';var b=this;setTimeout(function(){b.textContent='Copy Result';},1500);});
    document.getElementById('playBtn').addEventListener('click',function(){if(!out.value)return;try{var ctx=new (window.AudioContext||window.webkitAudioContext)();var i=0;out.value.split('').forEach(function(ch){if(ch==='.'){beep(ctx,i,0.1);i+=0.15;}else if(ch==='-'){beep(ctx,i,0.3);i+=0.35;}else if(ch===' '){i+=0.3;}});}catch(e){}});
    function beep(ctx,start,dur){var o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=600;o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+start);g.gain.setValueAtTime(0.2,ctx.currentTime+start);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+start+dur);o.stop(ctx.currentTime+start+dur);}`
});

TOOLS.push({
  slug:'timer', icon:'⏱️', title:'Online Countdown Timer', tagline:'Free Online Countdown Timer',
  category:'fun',
  desc:'A simple online countdown timer with quick presets (1, 5, 10, 30 minutes) and a custom time. Hear a beep when time is up — no install needed.',
  cardDesc:'Set a countdown timer with presets or custom time.',
  keywords:'online timer, countdown timer, minute timer, 5 minute timer, kitchen timer',
  searchTerms:'timer countdown minutes stop alarm beep',
  zh:'在线倒计时器，提供 1/5/10/30 分钟快捷预设，也能自定义时分秒，到点会响提示音，适合厨房计时、学习番茄钟、演讲控场。',
  howto:['Pick a preset or enter minutes/seconds.','Press Start to begin the countdown.','Pause or Reset anytime.','Listen for the beep when it reaches zero.'],
  faq:[{q:'Does it keep running if I close the tab?',a:'No — the timer lives in this tab, so keep it open while counting.'},{q:'Can I use it as a Pomodoro timer?',a:'Yes, set 25 minutes for focus and 5 for a break.'},{q:'Is there a sound alert?',a:'Yes, a short beep plays when the countdown ends.'}],
  usecases:[{icon:'🍳',title:'Cooking',text:'Time your recipes hands-free.'},{icon:'📚',title:'Study',text:'Run Pomodoro focus sessions.'},{icon:'🎤',title:'Speaking',text:'Keep talks within limit.'}],
  body:`        <div class="gen-row">
          <div class="form-row"><label for="min">Minutes</label><input type="number" id="min" value="5" min="0" max="600"></div>
          <div class="form-row"><label for="sec">Seconds</label><input type="number" id="sec" value="0" min="0" max="59"></div>
        </div>
        <div class="btn-group" style="flex-wrap:wrap">
          <button class="btn btn-secondary" data-preset="1">1 min</button>
          <button class="btn btn-secondary" data-preset="5">5 min</button>
          <button class="btn btn-secondary" data-preset="10">10 min</button>
          <button class="btn btn-secondary" data-preset="30">30 min</button>
        </div>
        <div class="result-box" id="out" style="text-align:center"><span class="gen-big" id="disp">05:00</span></div>
        <div class="btn-group">
          <button class="btn btn-primary" id="startBtn">Start</button>
          <button class="btn btn-secondary" id="pauseBtn">Pause</button>
          <button class="btn btn-secondary" id="resetBtn">Reset</button>
        </div>`,
  js:`    var min=document.getElementById('min'),sec=document.getElementById('sec'),disp=document.getElementById('disp'),startBtn=document.getElementById('startBtn'),pauseBtn=document.getElementById('pauseBtn'),resetBtn=document.getElementById('resetBtn');
    var total=300,left=300,running=false,timer=null;
    function fmt(s){var m=Math.floor(s/60),ss=s%60;return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss;}
    function show(){disp.textContent=fmt(left);}
    function setFromInputs(){total=(parseInt(min.value)||0)*60+(parseInt(sec.value)||0);if(!running)left=total;show();}
    function beep(){try{var ctx=new (window.AudioContext||window.webkitAudioContext)();var o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=880;o.connect(g);g.connect(ctx.destination);o.start();g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.6);o.stop(ctx.currentTime+0.6);}catch(e){}}
    function tick(){if(left<=0){clearInterval(timer);running=false;beep();disp.textContent='00:00';return;}left--;show();}
    document.querySelectorAll('[data-preset]').forEach(function(b){b.addEventListener('click',function(){min.value=b.getAttribute('data-preset');sec.value='0';setFromInputs();});});
    min.addEventListener('input',setFromInputs);sec.addEventListener('input',setFromInputs);
    startBtn.addEventListener('click',function(){setFromInputs();if(left<=0)return;running=true;timer=setInterval(tick,1000);});
    pauseBtn.addEventListener('click',function(){running=false;clearInterval(timer);});
    resetBtn.addEventListener('click',function(){running=false;clearInterval(timer);setFromInputs();});
    setFromInputs();`
});

TOOLS.push({
  slug:'stopwatch', icon:'⏱️', title:'Online Stopwatch', tagline:'Free Online Stopwatch',
  category:'fun',
  desc:'A clean online stopwatch that counts up from zero with start, stop and lap. Great for workouts, experiments and time trials — runs right in your browser.',
  cardDesc:'Count-up stopwatch with laps, start/stop/reset.',
  keywords:'online stopwatch, stopwatch, timer count up, lap timer, web stopwatch',
  searchTerms:'stopwatch count up laps start stop reset',
  zh:'在线秒表从零开始计时，支持开始、暂停、计圈、重置，适合运动训练、实验计时、比赛测时，纯浏览器运行无需安装。',
  howto:['Press Start to begin counting up.','Press Lap to record split times.','Press Stop to pause, Start to resume.','Press Reset to return to zero.'],
  faq:[{q:'How accurate is it?',a:'It uses the browser clock and is accurate enough for everyday timing; extreme precision may drift slightly.'},{q:'What are laps for?',a:'Laps capture split times so you can compare intervals within one run.'},{q:'Does it run in the background?',a:'It keeps running while the tab is open, though heavy load can cause minor jitter.'}],
  usecases:[{icon:'🏃',title:'Fitness',text:'Time intervals and sprints.'},{icon:'🔬',title:'Experiments',text:'Measure durations precisely enough.'},{icon:'🏆',title:'Races',text:'Track splits during time trials.'}],
  body:`        <div class="result-box" style="text-align:center"><span class="gen-big" id="disp">00:00.00</span></div>
        <div class="btn-group">
          <button class="btn btn-primary" id="startBtn">Start</button>
          <button class="btn btn-secondary" id="lapBtn">Lap</button>
          <button class="btn btn-secondary" id="resetBtn">Reset</button>
        </div>
        <div class="form-row"><label>Laps</label><div id="laps" class="gen-output"></div></div>`,
  js:`    var disp=document.getElementById('disp'),startBtn=document.getElementById('startBtn'),lapBtn=document.getElementById('lapBtn'),resetBtn=document.getElementById('resetBtn'),lapsBox=document.getElementById('laps');
    var ms=0,running=false,last=0,raf=null,laps=[];
    function fmt(t){var m=Math.floor(t/60000),s=Math.floor((t%60000)/1000),cs=Math.floor((t%1000)/10);return (m<10?'0':'')+m+':'+(s<10?'0':'')+s+'.'+(cs<10?'0':'')+cs;}
    function loop(now){if(!running)return;ms+=(now-last);last=now;disp.textContent=fmt(ms);raf=requestAnimationFrame(loop);}
    startBtn.addEventListener('click',function(){if(running){running=false;cancelAnimationFrame(raf);startBtn.textContent='Start';}else{running=true;last=performance.now();raf=requestAnimationFrame(loop);startBtn.textContent='Stop';}});
    lapBtn.addEventListener('click',function(){if(!running&&ms===0)return;laps.push(ms);var d=document.createElement('div');d.className='result-box';d.style.marginBottom='6px';d.textContent='Lap '+laps.length+': '+fmt(ms);lapsBox.insertBefore(d,lapsBox.firstChild);});
    resetBtn.addEventListener('click',function(){running=false;cancelAnimationFrame(raf);ms=0;laps=[];disp.textContent='00:00.00';lapsBox.innerHTML='';startBtn.textContent='Start';});`
});

TOOLS.push({
  slug:'dice-roller', icon:'🎲', title:'Dice Roller', tagline:'Free Online Dice Roller',
  category:'fun',
  desc:'Roll virtual dice online — any number of dice with any number of sides (d4 to d100). See each roll and the total, perfect for board games and RPGs.',
  cardDesc:'Roll any number of dice with any sides online.',
  keywords:'dice roller, roll dice, virtual dice, d20, dice simulator, rpg dice',
  searchTerms:'dice roller roll virtual d20 d6 board game rpg',
  zh:'在线掷骰子，支持任意数量、任意面数（d4–d100），显示每一颗点数与总和，适合桌游、跑团、做随机决策。',
  howto:['Choose how many dice to roll.','Set the number of sides per die.','Press Roll to throw them.','Read each result and the total below.'],
  faq:[{q:'What dice can I roll?',a:'Any side count from 2 up to 100, including common d4, d6, d8, d10, d12, d20 and d100.'},{q:'Is it fair?',a:'Each roll uses a uniformly random generator, so results are unbiased.'},{q:'Can I roll many dice at once?',a:'Yes — pick how many dice you want and roll them together.'}],
  usecases:[{icon:'🎲',title:'Board Games',text:'Replace missing physical dice.'},{icon:'🐉',title:'RPG',text:'Roll d20 and others for campaigns.'},{icon:'🎯',title:'Decisions',text:'Let a die settle a debate.'}],
  body:`        <div class="gen-row">
          <div class="form-row"><label for="num">Number of dice</label><input type="number" id="num" value="2" min="1" max="20"></div>
          <div class="form-row"><label for="sides">Sides per die</label><input type="number" id="sides" value="6" min="2" max="100"></div>
        </div>
        <div class="btn-group"><button class="btn btn-primary" id="rollBtn">Roll Dice</button></div>
        <div class="result-box empty" id="out">Roll the dice to see results.</div>`,
  js:`    var num=document.getElementById('num'),sides=document.getElementById('sides'),out=document.getElementById('out'),btn=document.getElementById('rollBtn');
    var FACES='⚀⚁⚂⚃⚄⚅';
    function rnd(n){return Math.floor(Math.random()*n)+1;}
    btn.addEventListener('click',function(){var n=Math.min(Math.max(parseInt(num.value)||1,1),20),s=Math.min(Math.max(parseInt(sides.value)||6,2),100);var rolls=[],sum=0;for(var i=0;i<n;i++){var v=rnd(s);rolls.push(v);sum+=v;}out.className='result-box';out.innerHTML='<div style="font-size:1.4rem;letter-spacing:4px;margin-bottom:8px">'+rolls.map(function(v){return v>=1&&v<=6?FACES[v-1]:('['+v+']');}).join(' ')+'</div><div>Total: <b>'+sum+'</b> · Average: '+(sum/n).toFixed(2)+'</div>';});`
});

module.exports = TOOLS;
