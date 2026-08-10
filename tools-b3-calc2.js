/* tools-b3-calc2.js — batch 3, extra calculators (4 tools) */
const T = [];

T.push({
  slug: 'heart-rate-zone-calculator', icon: '❤️', title: 'Heart Rate Zone Calculator', tagline: 'Training Zones from Max & Resting Heart Rate',
  category: 'calculator', popular: 'Popular',
  desc: 'Estimate your heart-rate training zones using the Karvonen formula, based on your max and resting heart rate. Perfect for runners, cyclists and HIIT training.',
  cardDesc: 'Find your five heart-rate training zones for effective cardio workouts.',
  keywords: 'heart rate zone calculator, karvonen formula, target heart rate, training zones, max heart rate',
  searchTerms: 'heart rate zone karvonen target training max resting',
  zh: '心率区间计算器用 Karvonen（卡沃宁）公式，根据最大心率和静息心率算出你运动时的目标心率区间。它把强度分成 5 个区间，帮助你在区间 2–3 做燃脂、区间 4–5 做心肺提升，避免练得太轻或太猛。',
  howto: ['Enter your age (used to estimate max heart rate).', 'Measure and enter your resting heart rate (morning, before getting up works best).', 'Click Calculate to see all five zones.', 'Use the zone ranges to guide your workout intensity.'],
  faq: [
    { q: 'What is the Karvonen formula?', a: 'Target HR = ((Max HR − Resting HR) × intensity%) + Resting HR. It personalises training zones using your resting heart rate, which the simpler 220−age method ignores.' },
    { q: 'How do I find my resting heart rate?', a: 'Take your pulse first thing in the morning, still lying down, for 30–60 seconds. A typical adult resting rate is 60–80 bpm.' },
    { q: 'Which zone should I train in?', a: 'Zone 2 (60–70%) builds aerobic base and burns fat; Zone 4–5 (80–90%+) improves speed and VO2 max but cannot be sustained long. Most people mix zones across the week.' }
  ],
  zhfaq: [
    { q: '卡沃宁公式和 220−年龄 有什么区别？', a: '220−年龄只估算最大心率，忽略了每个人的静息心率差异。卡沃宁公式把静息心率纳入计算，得到的目标区间更贴合个人体质。' },
    { q: '减脂应该练哪个区间？', a: '通常区间 2（约 60%–70% 强度）最适合燃脂和打有氧基础；区间 4–5 强度高、难以持久，主要提升速度和最大摄氧量。' }
  ],
  usecases: [
    { icon: '🏃', title: 'Fat-burn runs', text: 'Hold Zone 2 for steady-state cardio.' },
    { icon: '🚴', title: 'Interval training', text: 'Push into Zone 4–5 for reps.' },
    { icon: '💓', title: 'Recovery', text: 'Keep easy days below Zone 2.' }
  ],
  deep: '## 为什么用心率区间\n凭感觉练很容易要么太轻松、要么过度。心率区间把强度量化成 5 档，让你清楚知道每一段训练在练什么。\n## 卡沃宁公式\n目标心率 =（最大心率 − 静息心率）× 强度% + 静息心率。其中最大心率常用 220 − 年龄估算（也可用更精确的 208 − 0.7×年龄）。\n## 五个区间\n- 区间 1（50%–60%）：热身、恢复\n- 区间 2（60%–70%）：燃脂、有氧基础\n- 区间 3（70%–80%）：有氧耐力\n- 区间 4（80%–90%）：无氧阈、速度\n- 区间 5（90%–100%）：冲刺、最大输出\n## 注意事项\n- 公式给出的是估算值，服药、咖啡因、睡眠都会影响实际心率\n- 戴心率带或手表测量比手机更准\n- 结果仅供参考，开始新训练计划前请咨询专业人士',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="age">Age (years)</label>
            <input type="number" id="age" value="30" min="10" max="100">
          </div>
          <div class="form-row">
            <label for="rhr">Resting HR (bpm)</label>
            <input type="number" id="rhr" value="65" min="35" max="120">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var age=document.getElementById('age'),rhr=document.getElementById('rhr'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    var zones=[['Zone 1 · Warm up',0.5,0.6],['Zone 2 · Fat burn',0.6,0.7],['Zone 3 · Aerobic',0.7,0.8],['Zone 4 · Threshold',0.8,0.9],['Zone 5 · Max',0.9,1.0]];
    function calc(){
      var A=parseFloat(age.value),R=parseFloat(rhr.value);
      if(!(A>0&&R>0)){out.className='result-box';out.textContent='Enter a valid age and resting HR.';return;}
      var maxHR=220-A;
      var h='<div style="margin-bottom:10px;opacity:.8;font-size:.92rem">Estimated max HR: <strong>'+Math.round(maxHR)+' bpm</strong> · Resting: <strong>'+Math.round(R)+' bpm</strong></div>';
      h+='<div style="display:grid;gap:8px">';
      zones.forEach(function(z){
        var lo=Math.round((maxHR-R)*z[1]+R), hi=Math.round((maxHR-R)*z[2]+R);
        h+='<div style="padding:10px 12px;border-radius:10px;background:var(--surface);border:1px solid var(--border)">'+
           '<div style="font-weight:700">'+z[0]+'</div>'+
           '<div style="font-size:1.25rem;font-weight:700">'+lo+' – '+hi+' bpm</div></div>';
      });
      h+='</div>';
      out.className='result-box';out.innerHTML=h;
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'debt-payoff-calculator', icon: '💳', title: 'Debt Payoff Calculator', tagline: 'Months & Interest to Clear a Loan',
  category: 'calculator',
  desc: 'See how long it takes to pay off a debt and how much interest you will pay, based on balance, APR and monthly payment.',
  cardDesc: 'Find the payoff time and total interest for any loan or credit balance.',
  keywords: 'debt payoff calculator, loan payoff, credit card payoff, interest paid, amortization',
  searchTerms: 'debt payoff loan credit card interest balance apr',
  zh: '债务还清计算器输入欠款余额、年化利率（APR）和每月还款额，算出还清所需月数以及总共支付的利息。它能直观告诉你：每月多还一点，能省下多少利息、缩短多少时间。',
  howto: ['Enter the current balance you owe.', 'Enter the annual interest rate (APR).', 'Enter how much you can pay each month.', 'Click Calculate to see months to payoff and total interest.'],
  faq: [
    { q: 'Why does paying extra matter so much?', a: 'Extra payments reduce the principal faster, which means less interest accrues every month. On a long loan even small extra payments can cut months off the term.' },
    { q: 'Does this handle credit cards?', a: 'Yes — treat the balance as your card debt and the APR as the card rate. Just know card minimum payments are often calculated differently by the issuer.' },
    { q: 'What if my payment is too low?', a: 'If the monthly payment does not cover the monthly interest, the balance grows and the debt is never paid off. The calculator will warn you.' }
  ],
  zhfaq: [
    { q: '每月多还一点真的有用吗？', a: '非常有用。多还的钱直接冲减本金，下个月利息就按更低的本金计算，长期能省下可观利息、缩短还款时间。' },
    { q: '还款额低于月利息会怎样？', a: '本金不仅不会减少，还会越滚越大，永远还不清。本工具会在这种情况下给出提醒。' }
  ],
  usecases: [
    { icon: '💳', title: 'Credit cards', text: 'Plan how to clear balances fast.' },
    { icon: '🎓', title: 'Student loans', text: 'Compare standard vs accelerated.' },
    { icon: '🚗', title: 'Car loans', text: 'See interest saved by overpaying.' }
  ],
  deep: '## 债务怎么产生利息\n贷款每月按剩余本金计息。你还的钱先抵利息，剩下的才减本金。所以前期大部分还款都在付利息。\n## 计算公式\n月利率 r = APR/12。每月利息 = 剩余本金 × r；本金减少 = 月供 − 月利息。逐月循环直到本金归零，记录月数即为还清时间。\n## 提前还款的力量\n每多还一笔，本金下降更快，后续利息随之减少。对高利率的消费贷、信用卡尤其明显。\n## 注意\n- 本工具假设固定月供、固定利率\n- 部分贷款有提前还款违约金，实际省息会打折\n- 结果仅供参考，不构成理财建议',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="bal">Balance ($)</label>
            <input type="number" id="bal" value="5000" min="0" step="any">
          </div>
          <div class="form-row">
            <label for="apr">APR (%)</label>
            <input type="number" id="apr" value="19.9" min="0" step="any">
          </div>
        </div>
        <div class="form-row">
          <label for="pay">Monthly payment ($)</label>
          <input type="number" id="pay" value="250" min="0" step="any">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var bal=document.getElementById('bal'),apr=document.getElementById('apr'),pay=document.getElementById('pay'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var B=parseFloat(bal.value),a=parseFloat(apr.value),P=parseFloat(pay.value);
      if(!(B>0&&P>0)){out.className='result-box';out.textContent='Enter a positive balance and payment.';return;}
      var r=a/100/12, b=B, months=0, interest=0, minPay=b*r+0.01;
      if(P<=minPay){out.className='result-box';out.innerHTML='<div style="color:#ef4444">⚠️ Your payment is too low to ever clear this debt (it does not cover the monthly interest). Increase the payment.</div>';return;}
      while(b>0.005&&months<1200){var i=b*r;b-=(P-i);if(b<0)b=0;interest+=i;months++;}
      var yrs=Math.floor(months/12), mos=months%12;
      out.className='result-box';
      out.innerHTML='<div style="display:grid;gap:10px">'+
        '<div><div style="font-size:1.6rem;font-weight:700">'+months+' months</div><div style="opacity:.75">≈ '+yrs+' yr '+(mos?mos+' mo':'')+' to pay off</div></div>'+
        '<div><div style="font-size:1.6rem;font-weight:700">$'+interest.toFixed(2)+'</div><div style="opacity:.75">Total interest paid</div></div>'+
        '<div><div style="font-size:1.6rem;font-weight:700">$'+(B+interest).toFixed(2)+'</div><div style="opacity:.75">Total of all payments</div></div></div>';
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'retirement-calculator', icon: '🌅', title: 'Retirement Calculator', tagline: 'Project Your Savings at Retirement',
  category: 'calculator',
  desc: 'Estimate how much your retirement nest egg will grow, given current savings, monthly contributions and an expected annual return.',
  cardDesc: 'Project your future retirement savings with compound growth.',
  keywords: 'retirement calculator, retirement savings, compound growth, 401k projection, nest egg',
  searchTerms: 'retirement savings compound projection 401k future value',
  zh: '退休金计算器输入你当前的存款、每月定投金额、预期年化收益率和投资年数，用复利公式估算退休时账户里大概有多少钱。它帮你判断现在的储蓄速度是否够用，以及多投一点能带来多大差别。',
  howto: ['Enter your current age and planned retirement age.', 'Enter current savings and monthly contribution.', 'Enter expected annual return (e.g. 6%).', 'Click Calculate to see the projected balance.'],
  faq: [
    { q: 'What return rate should I use?', a: 'Historical stock/bond portfolios often average 5–8% after inflation over long periods, but returns vary year to year. Use a conservative number like 5–6% for planning.' },
    { q: 'Does this include inflation?', a: 'No — the result is in today’s nominal dollars of growth. For purchasing power you can subtract ~2–3% annual inflation mentally, or use a lower real return.' },
    { q: 'Is this a 401(k) or IRA calculator?', a: 'It models any tax-advantaged or taxable account the same way via compound growth; it does not model contribution limits or taxes.' }
  ],
  zhfaq: [
    { q: '年化收益率填多少合适？', a: '长期股债组合的历史平均实际回报常在 5%–8%，但每年波动很大。做规划时建议保守一点，用 5%–6% 更稳妥。' },
    { q: '算出来的钱是现值还是未来值？', a: '本工具算的是名义增长，未按通胀折算。要估算实际购买力，可把年收益下调约 2%–3%。' }
  ],
  usecases: [
    { icon: '📈', title: 'Goal check', text: 'See if you are on track.' },
    { icon: '💰', title: 'Boost savings', text: 'Test higher contributions.' },
    { icon: '🗓️', title: 'Retire early?', text: 'Model an earlier date.' }
  ],
  deep: '## 复利是退休储蓄的核心\n你投入的钱每年产生收益，收益再产生收益，时间越长滚雪球效应越明显。\n## 计算公式\n未来值 FV = 当前存款 × (1+r)^n + 月供 × [((1+r/12)^(12n) − 1) / (r/12)]，其中 r 为年化收益率、n 为年数。\n## 早开始的优势\n25 岁和 35 岁开始，即使每月金额相同，最终差距可能高达数倍，因为前期投入享受的复利时间更长。\n## 注意\n- 结果为估算，市场实际回报不可预测\n- 未考虑税费、通胀与提取规则\n- 仅供参考，重大财务决策请咨询持牌顾问',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="age">Current age</label>
            <input type="number" id="age" value="30" min="16" max="80">
          </div>
          <div class="form-row">
            <label for="ret">Retire at</label>
            <input type="number" id="ret" value="65" min="17" max="90">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="save">Current savings ($)</label>
            <input type="number" id="save" value="10000" min="0" step="any">
          </div>
          <div class="form-row">
            <label for="mon">Monthly contribution ($)</label>
            <input type="number" id="mon" value="500" min="0" step="any">
          </div>
        </div>
        <div class="form-row">
          <label for="rate">Annual return (%)</label>
          <input type="number" id="rate" value="6" min="0" step="any">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var age=document.getElementById('age'),ret=document.getElementById('ret'),save=document.getElementById('save'),mon=document.getElementById('mon'),rate=document.getElementById('rate'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var A=parseFloat(age.value),R=parseFloat(ret.value),S=parseFloat(save.value),M=parseFloat(mon.value),r=parseFloat(rate.value)/100;
      if(!(A>0&&R>A&&S>=0&&M>=0&&r>=0)){out.className='result-box';out.textContent='Enter valid ages (retire > current) and amounts.';return;}
      var n=R-A, months=n*12, fv=S*Math.pow(1+r/12,months);
      if(r>0) fv+=M*((Math.pow(1+r/12,months)-1)/(r/12)); else fv+=M*months;
      var contributed=S+M*months;
      out.className='result-box';
      out.innerHTML='<div style="display:grid;gap:10px">'+
        '<div><div style="font-size:1.8rem;font-weight:700">$'+Math.round(fv).toLocaleString()+'</div><div style="opacity:.75">Projected at age '+R+' ('+n+' years)</div></div>'+
        '<div><div style="font-size:1.3rem;font-weight:700">$'+Math.round(contributed).toLocaleString()+'</div><div style="opacity:.75">Total you contribute</div></div>'+
        '<div><div style="font-size:1.3rem;font-weight:700;color:#22c55e">$'+Math.round(fv-contributed).toLocaleString()+'</div><div style="opacity:.75">Growth from compounding</div></div></div>';
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'lease-payment-calculator', icon: '🚗', title: 'Car Lease Payment Calculator', tagline: 'Estimate Your Monthly Lease',
  category: 'calculator',
  desc: 'Estimate a car lease monthly payment from vehicle price, down payment, residual value, term and money factor (or APR).',
  cardDesc: 'Estimate your monthly car lease payment before you visit the dealer.',
  keywords: 'lease payment calculator, car lease, monthly lease, residual value, money factor',
  searchTerms: 'car lease payment monthly residual money factor apr',
  zh: '汽车租赁月供计算器输入车身价、首付、到期残值、租期和利率（资金系数或年化利率），估算每月租赁费用。它帮你提前知道大致月供，到店里谈价时心里有数，避免被各种附加费用绕晕。',
  howto: ['Enter the vehicle price (MSRP or negotiated price).', 'Enter down payment and the residual value at lease end.', 'Enter term in months and the money factor (or APR).', 'Click Calculate to see the monthly payment.'],
  faq: [
    { q: 'What is residual value?', a: 'The estimated worth of the car at the end of the lease, set by the leasing company. A higher residual lowers your monthly payment because you only finance the depreciation.' },
    { q: 'Money factor vs APR — what is the link?', a: 'Money factor × 2400 ≈ equivalent APR. If a dealer quotes APR on a lease, divide by 2400 to get the money factor.' },
    { q: 'Why is my lease payment split into two parts?', a: 'Part 1 covers depreciation (price − residual over the term); part 2 is the finance/rent charge on the average capitalized cost.' }
  ],
  zhfaq: [
    { q: '残值（residual value）是什么？', a: '租赁公司预估车辆租期结束时的价值。残值越高，你需要“摊销”的折旧越少，月供越低。' },
    { q: '资金系数和年化利率怎么换算？', a: '资金系数 × 2400 ≈ 对应的年化利率。如果车商给你的是年化利率，除以 2400 即得资金系数。' }
  ],
  usecases: [
    { icon: '🚗', title: 'New car shop', text: 'Compare lease vs buy.' },
    { icon: '📊', title: 'Budget', text: 'Know the monthly hit.' },
    { icon: '🤝', title: 'Negotiate', text: 'Spot a bad money factor.' }
  ],
  deep: '## 租赁月供的构成\n租赁月供由两部分相加：折旧费 + 融资费。\n## 折旧费\n（净资本化成本 − 残值）÷ 租期月数。净资本化成本 = 车身价 − 首付（及其他抵扣）。\n## 融资费\n（净资本化成本 + 残值）× 资金系数。资金系数 = 年化利率 ÷ 2400。\n## 举例\n车身价 30000、首付 3000、残值 18000、租期 36 个月、资金系数 0.0025：\n折旧费 = (27000 − 18000)/36 = 250；融资费 = (27000 + 18000) × 0.0025 = 112.5；月供 ≈ 362.5。\n## 注意\n- 实际租赁还有购置税、手续费、里程限制与超标费\n- 不同州/地区税费差异大\n- 结果仅供参考',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="price">Vehicle price ($)</label>
            <input type="number" id="price" value="30000" min="0" step="any">
          </div>
          <div class="form-row">
            <label for="down">Down payment ($)</label>
            <input type="number" id="down" value="3000" min="0" step="any">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="res">Residual value ($)</label>
            <input type="number" id="res" value="18000" min="0" step="any">
          </div>
          <div class="form-row">
            <label for="term">Term (months)</label>
            <input type="number" id="term" value="36" min="1" max="120">
          </div>
        </div>
        <div class="form-row">
          <label for="apr">APR (%) — converts to money factor</label>
          <input type="number" id="apr" value="6" min="0" step="any">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var price=document.getElementById('price'),down=document.getElementById('down'),res=document.getElementById('res'),term=document.getElementById('term'),apr=document.getElementById('apr'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var P=parseFloat(price.value),D=parseFloat(down.value),R=parseFloat(res.value),T=parseFloat(term.value),a=parseFloat(apr.value);
      if(!(P>0&&T>0&&a>=0&&R>=0&&D>=0)){out.className='result-box';out.textContent='Enter valid lease figures.';return;}
      var netCap=P-D, mf=a/100/2400;
      var dep=(netCap-R)/T, fin=(netCap+R)*mf, pay=dep+fin;
      out.className='result-box';
      out.innerHTML='<div style="display:grid;gap:10px">'+
        '<div><div style="font-size:1.8rem;font-weight:700">$'+pay.toFixed(2)+' / mo</div><div style="opacity:.75">Estimated lease payment</div></div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:.92rem">'+
        '<div>Depreciation: <strong>$'+dep.toFixed(2)+'</strong></div>'+
        '<div>Finance fee: <strong>$'+fin.toFixed(2)+'</strong></div>'+
        '<div>Net cap cost: <strong>$'+netCap.toFixed(2)+'</strong></div>'+
        '<div>Money factor: <strong>'+mf.toFixed(5)+'</strong></div></div>'+
        '<div style="opacity:.7;font-size:.82rem">Excludes tax, title, registration and fees.</div></div>';
    }
    btn.addEventListener('click',calc);calc();`
});

module.exports = T;
