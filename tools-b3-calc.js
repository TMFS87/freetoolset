/* tools-b3-calc.js — batch 3, calculator category (14 tools) */
const T = [];

T.push({
  slug: 'bmr-calculator', icon: '🔥', title: 'BMR Calculator', tagline: 'Basal Metabolic Rate & Daily Calorie Needs',
  category: 'calculator', popular: 'Popular',
  desc: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation, plus your total daily energy expenditure (TDEE) based on activity level.',
  cardDesc: 'Find your basal metabolic rate and daily calorie needs.',
  keywords: 'bmr calculator, basal metabolic rate, tdee calculator, daily calorie needs, metabolism calculator',
  searchTerms: 'bmr basal metabolic rate tdee calorie metabolism',
  zh: '基础代谢率（BMR）计算器用 Mifflin-St Jeor 公式估算你静息状态下一天消耗的热量，再结合活动系数算出每日总消耗（TDEE），是制定增肌或减脂饮食计划的第一步。',
  howto: ['Enter your gender, age, height and weight.', 'Pick the activity level that matches your week.', 'Click Calculate to see BMR and TDEE.', 'Use TDEE as your maintenance calorie baseline.'],
  faq: [
    { q: 'What is the difference between BMR and TDEE?', a: 'BMR is what your body burns at complete rest, just keeping organs running. TDEE is BMR multiplied by an activity factor, representing everything you actually burn in a day.' },
    { q: 'Which formula does this use?', a: 'Mifflin-St Jeor, which research generally finds more accurate for most people than the older Harris-Benedict equation.' },
    { q: 'How accurate is it?', a: 'It is a population-based estimate, typically within about 10% for most adults. Body composition, genetics and medication can shift the real number.' }
  ],
  zhfaq: [
    { q: 'BMR 和 TDEE 有什么区别？', a: 'BMR 是完全静息状态下维持心跳、呼吸、体温等基础生命活动的耗能；TDEE 是 BMR 乘以活动系数，代表你一天实际消耗的总热量。' },
    { q: '减脂应该吃多少？', a: '通常在 TDEE 基础上减 300–500 千卡形成温和缺口，过大的缺口容易掉肌肉且难以坚持。具体请结合自身情况或咨询营养师。' }
  ],
  usecases: [
    { icon: '🥗', title: 'Fat Loss Plan', text: 'Set a calorie target below your TDEE.' },
    { icon: '💪', title: 'Muscle Gain', text: 'Eat above TDEE for a controlled surplus.' },
    { icon: '⚖️', title: 'Maintenance', text: 'Match TDEE to hold your current weight.' }
  ],
  deep: '## 什么是基础代谢率\n基础代谢率（BMR）指人在完全清醒、静卧、空腹且环境温度舒适时，维持心跳、呼吸、体温和器官运转所消耗的最低能量。它通常占日常总消耗的 60%–70%，是所有饮食计划的基准线。\n## 计算公式\n本工具采用 Mifflin-St Jeor 公式：男性 BMR = 10×体重(kg) + 6.25×身高(cm) − 5×年龄 + 5；女性 BMR = 10×体重 + 6.25×身高 − 5×年龄 − 161。相比更早的 Harris-Benedict 公式，它在现代人群中误差更小。\n## 从 BMR 到 TDEE\n把 BMR 乘以活动系数即得每日总消耗：久坐 1.2、轻度活动 1.375、中等 1.55、高强度 1.725、运动员 1.9。举例：一位 30 岁、170cm、65kg 的女性 BMR 约 1379 千卡，若为轻度活动，TDEE 约 1896 千卡。\n## 使用时的注意点\n- 公式基于人群统计，个体差异可达 10% 以上\n- 肌肉量高的人实际 BMR 会高于公式估算\n- 长期极低热量饮食会让代谢适应性下降，数值不再准确\n- 结果仅供参考，不能替代专业营养或医疗建议',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="gender">Gender</label>
            <select id="gender"><option value="m">Male</option><option value="f">Female</option></select>
          </div>
          <div class="form-row">
            <label for="age">Age (years)</label>
            <input type="number" id="age" value="30" min="10" max="100">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="height">Height (cm)</label>
            <input type="number" id="height" value="170" min="100" max="250">
          </div>
          <div class="form-row">
            <label for="weight">Weight (kg)</label>
            <input type="number" id="weight" value="65" min="20" max="300" step="0.1">
          </div>
        </div>
        <div class="form-row">
          <label for="act">Activity Level</label>
          <select id="act">
            <option value="1.2">Sedentary — little or no exercise</option>
            <option value="1.375" selected>Light — 1-3 days/week</option>
            <option value="1.55">Moderate — 3-5 days/week</option>
            <option value="1.725">Active — 6-7 days/week</option>
            <option value="1.9">Very active — physical job or 2x training</option>
          </select>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var g=document.getElementById('gender'),age=document.getElementById('age'),h=document.getElementById('height'),w=document.getElementById('weight'),act=document.getElementById('act'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var A=parseFloat(age.value),H=parseFloat(h.value),W=parseFloat(w.value),F=parseFloat(act.value);
      if(!(A>0&&H>0&&W>0)){out.className='result-box';out.textContent='Please enter valid age, height and weight.';return;}
      var bmr=10*W+6.25*H-5*A+(g.value==='m'?5:-161);
      var tdee=bmr*F;
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.6rem;font-weight:700;margin-bottom:4px">'+Math.round(bmr)+' kcal/day</div>'+
        '<div style="opacity:.75;margin-bottom:14px">Basal Metabolic Rate (at complete rest)</div>'+
        '<div style="font-size:1.6rem;font-weight:700;margin-bottom:4px">'+Math.round(tdee)+' kcal/day</div>'+
        '<div style="opacity:.75;margin-bottom:14px">TDEE — total daily energy expenditure</div>'+
        '<div style="display:grid;gap:6px;font-size:.92rem">'+
        '<div>🥗 Fat loss (−500): <strong>'+Math.round(tdee-500)+' kcal</strong></div>'+
        '<div>⚖️ Maintain: <strong>'+Math.round(tdee)+' kcal</strong></div>'+
        '<div>💪 Muscle gain (+300): <strong>'+Math.round(tdee+300)+' kcal</strong></div></div>';
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'ideal-weight-calculator', icon: '⚖️', title: 'Ideal Weight Calculator', tagline: 'Healthy Weight Range by Height',
  category: 'calculator',
  desc: 'Estimate your ideal body weight using four established formulas (Devine, Robinson, Miller, Hamwi) plus the healthy BMI range for your height.',
  cardDesc: 'See your healthy weight range using four medical formulas.',
  keywords: 'ideal weight calculator, healthy weight range, ideal body weight, devine formula, weight for height',
  searchTerms: 'ideal weight healthy range body devine hamwi',
  zh: '理想体重计算器用 Devine、Robinson、Miller、Hamwi 四种经典公式估算适合你身高的体重，并给出对应的健康 BMI 区间，帮助你判断当前体重是否合理。',
  howto: ['Choose your gender.', 'Enter your height in centimetres.', 'Click Calculate.', 'Compare the four formula results with the healthy BMI range.'],
  faq: [
    { q: 'Why do the four formulas disagree?', a: 'They were derived from different populations and eras. Treat the spread between them as a reasonable range rather than looking for one exact number.' },
    { q: 'Is ideal weight the same as healthy weight?', a: 'No. The healthy BMI range (18.5–24.9) is wider and more forgiving. Ideal weight formulas give a single point estimate originally designed for medication dosing.' }
  ],
  zhfaq: [
    { q: '四个公式结果不一样，听哪个？', a: '它们来自不同年代和人群，差异属于正常。把四个结果看作一个合理区间，比追求某一个精确数字更有意义。' },
    { q: '理想体重就是最健康的体重吗？', a: '不一定。健康 BMI 区间（18.5–24.9）更宽松也更实用；理想体重公式最初是为药物剂量计算设计的，不考虑肌肉量和体型差异。' }
  ],
  usecases: [
    { icon: '🎯', title: 'Set a Goal', text: 'Pick a realistic target weight range.' },
    { icon: '📊', title: 'Health Check', text: 'See if your weight sits in a healthy band.' },
    { icon: '🏃', title: 'Fitness Plan', text: 'Use with BMR to plan calories.' }
  ],
  deep: '## 理想体重是怎么来的\n「理想体重」概念最早出现在 1970 年代，Devine 公式本是为计算药物剂量而设计，后来才被广泛用于健康评估。之后 Robinson、Miller、Hamwi 等学者又提出了各自的修正版本。\n## 四种公式的差别\n以身高 170cm 男性为例：Devine 约 65.9kg、Robinson 约 64.9kg、Miller 约 64.5kg、Hamwi 约 68.0kg。差异来自各自的基准体重和每英寸增量不同，通常相差 2–4kg。\n## 更实用的参考：BMI 区间\n世界卫生组织建议成年人 BMI 保持在 18.5–24.9。换算成体重就是一个区间而非单点，例如 170cm 的健康体重约为 53.5–72.0kg。这个范围更能容纳不同体型和肌肉量。\n## 局限性\n- 公式只考虑身高和性别，完全忽略肌肉量与骨架大小\n- 运动员肌肉密度高，常被判定为「超重」但实际很健康\n- 不适用于儿童、孕妇和老年人\n- 结果仅供参考，不构成医疗建议',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="gender">Gender</label>
            <select id="gender"><option value="m">Male</option><option value="f">Female</option></select>
          </div>
          <div class="form-row">
            <label for="height">Height (cm)</label>
            <input type="number" id="height" value="170" min="120" max="230">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var g=document.getElementById('gender'),h=document.getElementById('height'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var H=parseFloat(h.value);
      if(!(H>0)){out.className='result-box';out.textContent='Please enter a valid height.';return;}
      var inch=(H-152.4)/2.54; if(inch<0) inch=0;
      var male=g.value==='m';
      var devine=(male?50:45.5)+2.3*inch;
      var robinson=(male?52:49)+(male?1.9:1.7)*inch;
      var miller=(male?56.2:53.1)+(male?1.41:1.36)*inch;
      var hamwi=(male?48:45.5)+(male?2.7:2.2)*inch;
      var m=H/100, lo=18.5*m*m, hi=24.9*m*m;
      function row(n,v){return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)"><span>'+n+'</span><strong>'+v.toFixed(1)+' kg</strong></div>';}
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.35rem;font-weight:700;margin-bottom:12px">Healthy BMI range: '+lo.toFixed(1)+' – '+hi.toFixed(1)+' kg</div>'+
        row('Devine formula',devine)+row('Robinson formula',robinson)+row('Miller formula',miller)+row('Hamwi formula',hamwi)+
        '<p style="margin-top:12px;font-size:.86rem;opacity:.75">The BMI range is the more practical guide; the four formulas give a narrower point estimate.</p>';
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'pregnancy-due-date-calculator', icon: '👶', title: 'Pregnancy Due Date Calculator', tagline: 'Estimate Your Baby\u2019s Due Date',
  category: 'calculator', popular: 'Popular',
  desc: 'Estimate your due date from the first day of your last menstrual period using Naegele\u2019s rule, with current gestational age and trimester milestones.',
  cardDesc: 'Estimate due date, gestational age and trimester dates.',
  keywords: 'due date calculator, pregnancy calculator, edd calculator, gestational age, naegele rule',
  searchTerms: 'pregnancy due date edd gestational trimester baby',
  zh: '预产期计算器根据末次月经第一天，用内格勒法则（末次月经 + 280 天）推算预产期，并显示当前孕周、孕期阶段和各三个月的关键时间点。',
  howto: ['Enter the first day of your last menstrual period.', 'Adjust cycle length if yours is not 28 days.', 'Click Calculate.', 'Review your estimated due date and current gestational week.'],
  faq: [
    { q: 'How accurate is a due date?', a: 'Only about 4% of babies arrive exactly on the estimated date. Roughly 80% are born within two weeks either side, which is why it is called an estimate.' },
    { q: 'What if my cycle is not 28 days?', a: 'The calculator adjusts for that. A longer cycle usually means later ovulation, which pushes the due date later by the same number of days.' }
  ],
  zhfaq: [
    { q: '预产期准吗？', a: '只有约 4% 的宝宝正好在预产期当天出生，约 80% 在预产期前后两周内出生，所以它是一个估算范围而非确定日期。' },
    { q: '月经周期不是 28 天怎么办？', a: '工具会自动调整。周期偏长通常意味着排卵较晚，预产期也会相应推后同样天数。' }
  ],
  usecases: [
    { icon: '📅', title: 'Plan Ahead', text: 'Know when to book leave and appointments.' },
    { icon: '🩺', title: 'Track Progress', text: 'See your current gestational week.' },
    { icon: '🍼', title: 'Prepare', text: 'Line up trimester milestones.' }
  ],
  deep: '## 预产期是怎么算的\n临床上最常用的是内格勒法则（Naegele\u2019s rule）：从末次月经第一天起加 280 天（40 周）。它假设月经周期为 28 天、排卵发生在第 14 天。\n## 周期不规律怎么修正\n如果你的周期是 32 天，排卵大约推迟 4 天，预产期也相应推后 4 天。本工具已内置这一修正：预产期 = 末次月经 + 280 天 +（周期长度 − 28）。\n## 孕期三阶段\n- 孕早期：第 1–13 周，器官形成的关键期\n- 孕中期：第 14–27 周，通常反应减轻、体感最舒适\n- 孕晚期：第 28–40 周，胎儿体重快速增长\n## 重要提醒\n实际分娩时间受个体差异影响很大，超声波检查（尤其孕早期）比月经推算更准确。本工具结果仅供参考，产检安排请以医生诊断为准。',
  body: `        <div class="form-row">
          <label for="lmp">First day of last menstrual period</label>
          <input type="date" id="lmp">
        </div>
        <div class="form-row">
          <label for="cyc">Average cycle length (days)</label>
          <input type="number" id="cyc" value="28" min="20" max="45">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var lmp=document.getElementById('lmp'),cyc=document.getElementById('cyc'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    var t=new Date();t.setDate(t.getDate()-70);lmp.value=t.toISOString().slice(0,10);
    function fmt(d){return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});}
    function calc(){
      if(!lmp.value){out.className='result-box';out.textContent='Please pick a date.';return;}
      var s=new Date(lmp.value+'T00:00:00'),c=parseInt(cyc.value,10)||28;
      var due=new Date(s.getTime());due.setDate(due.getDate()+280+(c-28));
      var days=Math.floor((Date.now()-s.getTime())/86400000);
      var wk=Math.floor(days/7),dd=days%7;
      var tri=wk<13?'First trimester':wk<28?'Second trimester':wk<=42?'Third trimester':'Past due';
      var t1=new Date(s.getTime());t1.setDate(t1.getDate()+13*7);
      var t2=new Date(s.getTime());t2.setDate(t2.getDate()+27*7);
      var left=Math.ceil((due-Date.now())/86400000);
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.6rem;font-weight:700;margin-bottom:4px">'+fmt(due)+'</div>'+
        '<div style="opacity:.75;margin-bottom:14px">Estimated due date</div>'+
        (days>=0&&days<310?'<div style="display:grid;gap:6px;font-size:.95rem;margin-bottom:12px">'+
        '<div>Current: <strong>'+wk+' weeks '+dd+' days</strong> — '+tri+'</div>'+
        (left>0?'<div><strong>'+left+'</strong> days to go</div>':'')+'</div>':'')+
        '<div style="display:grid;gap:6px;font-size:.9rem;opacity:.85">'+
        '<div>End of 1st trimester: '+fmt(t1)+'</div>'+
        '<div>End of 2nd trimester: '+fmt(t2)+'</div></div>';
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'car-loan-calculator', icon: '🚗', title: 'Car Loan Calculator', tagline: 'Auto Loan Monthly Payment & Interest',
  category: 'calculator', popular: 'Popular',
  desc: 'Calculate your car loan monthly payment, total interest and full cost including down payment, trade-in value and optional sales tax.',
  cardDesc: 'Work out auto loan payments, interest and total cost.',
  keywords: 'car loan calculator, auto loan calculator, car payment calculator, vehicle finance, monthly car payment',
  searchTerms: 'car auto loan payment vehicle finance monthly',
  zh: '车贷计算器根据车价、首付、置换抵扣、贷款年限和年利率，算出每月还款额、利息总额和购车总成本，帮你在签合同前看清真实花费。',
  howto: ['Enter the vehicle price.', 'Add your down payment and any trade-in value.', 'Set the loan term and annual interest rate.', 'Click Calculate to see the monthly payment breakdown.'],
  faq: [
    { q: 'Does a longer term save money?', a: 'It lowers the monthly payment but increases total interest. A 7-year loan can cost thousands more than a 4-year loan on the same car.' },
    { q: 'Should I include sales tax in the loan?', a: 'Many buyers do finance the tax. This calculator lets you add a tax rate so the monthly figure reflects what you will actually pay.' }
  ],
  zhfaq: [
    { q: '贷款年限越长越划算吗？', a: '年限拉长会降低月供，但利息总额显著增加。同一辆车做 7 年贷比 4 年贷可能多付好几万利息。' },
    { q: '4S 店说的「零利率」是真的吗？', a: '通常需要放弃现金优惠或搭售保险、装潢来抵消，实际综合成本未必更低。建议用本工具把两种方案的总支出都算出来对比。' }
  ],
  usecases: [
    { icon: '🏷️', title: 'Budget Check', text: 'See if the monthly payment fits your income.' },
    { icon: '⚖️', title: 'Compare Terms', text: 'Weigh 3-year vs 5-year total cost.' },
    { icon: '🤝', title: 'Negotiate', text: 'Know the real numbers before the dealership.' }
  ],
  deep: '## 车贷月供是怎么算的\n车贷属于等额本息分期贷款，月供公式为 M = P × r × (1+r)^n ÷ [(1+r)^n − 1]，其中 P 是贷款本金（车价 − 首付 − 置换抵扣 + 税费），r 是月利率（年利率 ÷ 12），n 是总月数。\n## 一个真实例子\n车价 20 万，首付 6 万，贷款 14 万，年利率 5%，期限 5 年：月供约 2642 元，利息总额约 1.85 万元，总支出约 21.85 万元。若期限改为 3 年，月供升至约 4196 元，但利息降到约 1.1 万元，省下约 7500 元。\n## 容易被忽略的成本\n- 手续费、GPS 费、服务费等一次性费用\n- 全险要求：贷款期内通常强制购买全险\n- 提前还款违约金：部分合同收取剩余本金的 1%–3%\n## 关于「月费率」的陷阱\n销售常报「月费率 0.3%」，听起来很低，但那是按原始本金算的，实际年化利率接近 6.5%，是名义值的两倍多。签约前务必要求提供年化利率（APR）书面说明。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="price">Vehicle price</label>
            <input type="number" id="price" value="200000" min="0" step="1000">
          </div>
          <div class="form-row">
            <label for="down">Down payment</label>
            <input type="number" id="down" value="60000" min="0" step="1000">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="trade">Trade-in value</label>
            <input type="number" id="trade" value="0" min="0" step="1000">
          </div>
          <div class="form-row">
            <label for="tax">Sales tax (%)</label>
            <input type="number" id="tax" value="0" min="0" max="30" step="0.1">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="years">Loan term (years)</label>
            <input type="number" id="years" value="5" min="1" max="10">
          </div>
          <div class="form-row">
            <label for="rate">Annual rate (%)</label>
            <input type="number" id="rate" value="5" min="0" max="30" step="0.01">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var ids=['price','down','trade','tax','years','rate'],el={};ids.forEach(function(i){el[i]=document.getElementById(i);});
    var out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function n(x){return (Math.round(x*100)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var P=+el.price.value||0,D=+el.down.value||0,TR=+el.trade.value||0,TX=+el.tax.value||0,Y=+el.years.value||1,R=+el.rate.value||0;
      var taxAmt=P*TX/100, principal=P+taxAmt-D-TR;
      if(principal<=0){out.className='result-box';out.textContent='No financing needed — down payment covers the price.';return;}
      var mr=R/100/12,nm=Y*12,m;
      m = mr===0 ? principal/nm : principal*mr*Math.pow(1+mr,nm)/(Math.pow(1+mr,nm)-1);
      var total=m*nm, interest=total-principal;
      function row(a,b){return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)"><span>'+a+'</span><strong>'+b+'</strong></div>';}
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+n(m)+' / month</div>'+
        '<div style="opacity:.75;margin-bottom:14px">for '+nm+' months</div>'+
        row('Amount financed',n(principal))+
        (taxAmt>0?row('Sales tax included',n(taxAmt)):'')+
        row('Total interest',n(interest))+
        row('Total of payments',n(total))+
        row('Total cost (incl. down payment)',n(total+D+TR));
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'savings-goal-calculator', icon: '🎯', title: 'Savings Goal Calculator', tagline: 'How Long to Reach Your Savings Target',
  category: 'calculator',
  desc: 'Work out how much to save each month to hit a target amount by a deadline, or how long your current savings rate will take, with interest included.',
  cardDesc: 'Plan monthly savings to reach any financial goal.',
  keywords: 'savings goal calculator, save money calculator, savings plan, how long to save, monthly savings',
  searchTerms: 'savings goal target monthly save plan money',
  zh: '存钱目标计算器帮你算出：要在指定时间攒够目标金额，每月需要存多少；或者按当前存钱速度，需要多久才能达成目标。计算中已包含利息复利效果。',
  howto: ['Choose whether to solve for monthly amount or time needed.', 'Enter your goal, current savings and interest rate.', 'Fill in the remaining field.', 'Click Calculate to see your plan.'],
  faq: [
    { q: 'Does it account for interest?', a: 'Yes. Contributions compound monthly at the annual rate you enter. Set the rate to 0 for a plain cash savings plan.' },
    { q: 'Should I include inflation?', a: 'This tool works in nominal terms. For a rough real-terms view, subtract expected inflation from your interest rate before entering it.' }
  ],
  zhfaq: [
    { q: '计算包含利息吗？', a: '包含。每月存入的钱会按你填写的年利率按月复利计算。如果只是放活期不计息，把利率填 0 即可。' },
    { q: '要考虑通货膨胀吗？', a: '本工具按名义金额计算。若想看实际购买力，可以把「年利率 − 预期通胀率」的差值填进去，得到近似的实际收益视角。' }
  ],
  usecases: [
    { icon: '🏠', title: 'Down Payment', text: 'Plan a house deposit timeline.' },
    { icon: '✈️', title: 'Big Trip', text: 'Save for travel without a loan.' },
    { icon: '🛡️', title: 'Emergency Fund', text: 'Build 6 months of expenses.' }
  ],
  deep: '## 两种常见问题\n存钱规划通常只有两个问题：一是「我每月要存多少才能按时攒够」，二是「按现在的速度，我什么时候能攒够」。本工具两种模式都支持。\n## 背后的公式\n带复利的定期存入用年金终值公式：FV = PV×(1+r)^n + PMT×[((1+r)^n − 1) ÷ r]，其中 r 为月利率、n 为月数。反解 PMT 即得每月应存金额。\n## 一个例子\n目标 30 万元首付，现有存款 5 万元，年利率 3%，希望 5 年内达成。按公式每月需存约 3835 元；若不计利息则需约 4167 元 —— 利息帮你省下约 2 万元的本金投入。\n## 提高达成率的做法\n- 设置自动转账，发薪日当天就把储蓄划走\n- 把奖金、退税等意外收入直接计入目标\n- 优先偿还高息负债：还掉年化 15% 的信用卡，等于获得 15% 的无风险收益',
  body: `        <div class="form-row">
          <label for="mode">I want to know</label>
          <select id="mode">
            <option value="pmt">How much to save each month</option>
            <option value="time">How long it will take</option>
          </select>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="goal">Savings goal</label>
            <input type="number" id="goal" value="300000" min="1" step="1000">
          </div>
          <div class="form-row">
            <label for="have">Already saved</label>
            <input type="number" id="have" value="50000" min="0" step="1000">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row" id="wrapYears">
            <label for="years">Years to reach goal</label>
            <input type="number" id="years" value="5" min="0.1" max="60" step="0.5">
          </div>
          <div class="form-row" id="wrapMonthly" style="display:none">
            <label for="monthly">Monthly saving</label>
            <input type="number" id="monthly" value="4000" min="1" step="100">
          </div>
          <div class="form-row">
            <label for="rate">Annual interest (%)</label>
            <input type="number" id="rate" value="3" min="0" max="30" step="0.1">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var mode=document.getElementById('mode'),goal=document.getElementById('goal'),have=document.getElementById('have'),years=document.getElementById('years'),monthly=document.getElementById('monthly'),rate=document.getElementById('rate'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    var wy=document.getElementById('wrapYears'),wm=document.getElementById('wrapMonthly');
    function sync(){var p=mode.value==='pmt';wy.style.display=p?'':'none';wm.style.display=p?'none':'';}
    function n(x){return (Math.round(x*100)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var G=+goal.value||0,H=+have.value||0,r=(+rate.value||0)/100/12;
      var need=G-H;
      if(need<=0){out.className='result-box';out.innerHTML='<div style="font-size:1.3rem;font-weight:700">🎉 Goal already reached!</div>';return;}
      out.className='result-box';
      if(mode.value==='pmt'){
        var nm=Math.round((+years.value||1)*12);
        var fvHave=H*Math.pow(1+r,nm);
        var rem=G-fvHave;
        var pmt = rem<=0 ? 0 : (r===0 ? rem/nm : rem*r/(Math.pow(1+r,nm)-1));
        var contrib=pmt*nm, interest=G-H-contrib;
        out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+n(pmt)+' / month</div>'+
          '<div style="opacity:.75;margin-bottom:14px">for '+nm+' months</div>'+
          '<div style="display:grid;gap:6px;font-size:.93rem">'+
          '<div>Total you contribute: <strong>'+n(contrib)+'</strong></div>'+
          '<div>Growth from interest: <strong>'+n(interest>0?interest:0)+'</strong></div>'+
          '<div>Final balance: <strong>'+n(G)+'</strong></div></div>';
      } else {
        var P=+monthly.value||0;
        if(P<=0){out.textContent='Enter a monthly amount above 0.';return;}
        var bal=H,m=0;
        while(bal<G&&m<1200){bal=bal*(1+r)+P;m++;}
        if(m>=1200){out.textContent='That will take over 100 years — try a larger monthly amount.';return;}
        var yy=Math.floor(m/12),mm=m%12;
        out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+yy+' years '+mm+' months</div>'+
          '<div style="opacity:.75;margin-bottom:14px">to reach '+n(G)+'</div>'+
          '<div style="display:grid;gap:6px;font-size:.93rem">'+
          '<div>Total months: <strong>'+m+'</strong></div>'+
          '<div>You contribute: <strong>'+n(P*m)+'</strong></div>'+
          '<div>Final balance: <strong>'+n(bal)+'</strong></div></div>';
      }
    }
    mode.addEventListener('change',function(){sync();calc();});
    btn.addEventListener('click',calc);sync();calc();`
});

T.push({
  slug: 'inflation-calculator', icon: '📈', title: 'Inflation Calculator', tagline: 'Purchasing Power Over Time',
  category: 'calculator',
  desc: 'See what an amount of money today will be worth in the future, or what a past amount is worth now, at any inflation rate.',
  cardDesc: 'Calculate how inflation changes money\u2019s real value.',
  keywords: 'inflation calculator, purchasing power calculator, value of money over time, real value calculator',
  searchTerms: 'inflation purchasing power money value time',
  zh: '通货膨胀计算器帮你看清钱的真实购买力：今天的一笔钱在若干年后相当于多少，或者过去的一笔钱换算到今天值多少，支持自定义通胀率。',
  howto: ['Enter the amount of money.', 'Set the number of years and average inflation rate.', 'Choose future value or past value.', 'Click Calculate.'],
  faq: [
    { q: 'What inflation rate should I use?', a: 'Long-run averages sit around 2–3% for most developed economies. Check your national statistics bureau for the official CPI figure if you want precision.' },
    { q: 'Why does my salary feel smaller each year?', a: 'If your raise is below the inflation rate, your real purchasing power falls even though the number on your payslip goes up.' }
  ],
  zhfaq: [
    { q: '通胀率填多少合适？', a: '多数发达经济体长期平均在 2%–3%。想更精确可以查国家统计局公布的 CPI 同比数据。' },
    { q: '为什么工资涨了却感觉更穷？', a: '如果涨薪幅度低于通胀率，实际购买力就是下降的。比如涨薪 3% 而通胀 5%，相当于实际收入缩水约 2%。' }
  ],
  usecases: [
    { icon: '🏦', title: 'Retirement Plan', text: 'See what your savings will really buy.' },
    { icon: '💼', title: 'Salary Check', text: 'Test if a raise beats inflation.' },
    { icon: '📊', title: 'History', text: 'Compare prices across decades.' }
  ],
  deep: '## 通货膨胀如何侵蚀购买力\n通胀意味着同样一笔钱能买到的东西变少。计算公式为：未来所需金额 = 现在金额 × (1 + 通胀率)^年数；反过来，未来金额折算到今天的购买力 = 未来金额 ÷ (1 + 通胀率)^年数。\n## 一个直观例子\n假设年通胀率 3%，今天的 10 万元在 20 年后需要约 18.06 万元才能买到同样的东西；换个角度，20 年后的 10 万元，只相当于今天的约 5.54 万元。\n## 对个人财务的三个启示\n- **现金是有成本的**：活期利率长期低于通胀，存着不动等于慢慢亏损\n- **涨薪要跑赢通胀**：名义涨薪 3%、通胀 3%，实际收入零增长\n- **长期目标要用未来价**：规划 20 年后的养老金，必须按未来物价水平估算\n## 使用限制\n实际通胀因商品类别差异很大（医疗、教育涨幅常高于平均，电子产品甚至下降），本工具用单一平均率估算，仅供参考，不构成投资建议。',
  body: `        <div class="form-row">
          <label for="dir">Direction</label>
          <select id="dir">
            <option value="future">Today\u2019s money → future equivalent</option>
            <option value="past">Past money → today\u2019s equivalent</option>
          </select>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="amt">Amount</label>
            <input type="number" id="amt" value="100000" min="0" step="1000">
          </div>
          <div class="form-row">
            <label for="yrs">Years</label>
            <input type="number" id="yrs" value="20" min="1" max="120">
          </div>
        </div>
        <div class="form-row">
          <label for="rate">Average annual inflation (%)</label>
          <input type="number" id="rate" value="3" min="0" max="50" step="0.1">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var dir=document.getElementById('dir'),amt=document.getElementById('amt'),yrs=document.getElementById('yrs'),rate=document.getElementById('rate'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function n(x){return (Math.round(x*100)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var A=+amt.value||0,Y=+yrs.value||1,R=(+rate.value||0)/100;
      var f=Math.pow(1+R,Y),res,lead,note;
      if(dir.value==='future'){res=A*f;lead='You would need '+n(res);note='in '+Y+' years to buy what '+n(A)+' buys today.';}
      else{res=A/f;lead=n(A)+' back then = '+n(res);note='in today\\u2019s purchasing power.';}
      var loss=dir.value==='future'?(res-A):(A-res);
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.6rem;font-weight:700;margin-bottom:4px">'+lead+'</div>'+
        '<div style="opacity:.75;margin-bottom:14px">'+note+'</div>'+
        '<div style="display:grid;gap:6px;font-size:.93rem">'+
        '<div>Cumulative inflation: <strong>'+((f-1)*100).toFixed(1)+'%</strong></div>'+
        '<div>Difference: <strong>'+n(Math.abs(loss))+'</strong></div>'+
        '<div>Money loses <strong>'+((1-1/f)*100).toFixed(1)+'%</strong> of its value over '+Y+' years at '+(R*100).toFixed(1)+'%</div></div>';
    }
    dir.addEventListener('change',calc);btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'electricity-cost-calculator', icon: '💡', title: 'Electricity Cost Calculator', tagline: 'Appliance Power Usage & Running Cost',
  category: 'calculator',
  desc: 'Calculate what any appliance costs to run per day, month and year from its wattage, hours of use and your electricity tariff.',
  cardDesc: 'Find out what your appliances cost to run.',
  keywords: 'electricity cost calculator, power consumption calculator, kwh calculator, appliance running cost, energy cost',
  searchTerms: 'electricity power kwh cost appliance energy bill',
  zh: '电费计算器根据电器功率（瓦）、每天使用时长和电价，算出该设备每天、每月、每年的耗电量和电费，帮你找出家里的「电老虎」。',
  howto: ['Enter the appliance wattage (check the label).', 'Set daily hours of use.', 'Enter your electricity price per kWh.', 'Click Calculate to see daily, monthly and yearly cost.'],
  faq: [
    { q: 'Where do I find the wattage?', a: 'Look at the rating label on the back or underside of the appliance, or in the manual. It is shown in W (watts) or sometimes as volts × amps.' },
    { q: 'Does standby power matter?', a: 'Yes. Devices left on standby typically draw 1–5W each. Across a whole house that can add up to a noticeable share of the annual bill.' }
  ],
  zhfaq: [
    { q: '功率在哪里看？', a: '一般在电器背面或底部的铭牌上，标注为 W（瓦）；有些只标电压和电流，功率 = 电压 × 电流。' },
    { q: '待机耗电要紧吗？', a: '要紧。单个设备待机通常 1–5W，但全屋十几个设备长期待机，一年累计电费可能上百元。' }
  ],
  usecases: [
    { icon: '❄️', title: 'Air Conditioner', text: 'See the real cost of summer cooling.' },
    { icon: '🖥️', title: 'Home Office', text: 'Budget PC and monitor running costs.' },
    { icon: '🔍', title: 'Find Waste', text: 'Spot which device drives your bill.' }
  ],
  deep: '## 电费是怎么算的\n电费的基本单位是千瓦时（kWh，俗称「度」）。计算公式：耗电量(kWh) = 功率(W) × 使用小时数 ÷ 1000，电费 = 耗电量 × 电价。\n## 常见电器的功率参考\n- LED 灯泡：约 10W\n- 笔记本电脑：约 50W\n- 台式机 + 显示器：约 200W\n- 电饭煲：约 800W\n- 空调（1.5 匹）：约 1100W\n- 电热水器：约 2000W\n## 一个例子\n一台 1100W 的空调每天开 8 小时，电价 0.6 元/度：每天耗电 8.8 度、约 5.28 元，一个月约 158 元，整个夏天（3 个月）约 475 元。\n## 省电的实际建议\n- 空调温度每调高 1℃，耗电约降低 6%–8%\n- 用插线板集中断电，消除待机功耗\n- 关注能效标识：一级能效比三级能效通常省 20%–30%\n- 峰谷电价地区，把洗衣、充电等安排到谷时段',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="watt">Power (watts)</label>
            <input type="number" id="watt" value="1100" min="0" step="1">
          </div>
          <div class="form-row">
            <label for="hours">Hours used per day</label>
            <input type="number" id="hours" value="8" min="0" max="24" step="0.5">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="price">Price per kWh</label>
            <input type="number" id="price" value="0.6" min="0" step="0.01">
          </div>
          <div class="form-row">
            <label for="days">Days used per month</label>
            <input type="number" id="days" value="30" min="1" max="31">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var watt=document.getElementById('watt'),hours=document.getElementById('hours'),price=document.getElementById('price'),days=document.getElementById('days'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function n(x){return (Math.round(x*100)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var W=+watt.value||0,H=+hours.value||0,P=+price.value||0,D=+days.value||30;
      var kwhD=W*H/1000, costD=kwhD*P;
      var kwhM=kwhD*D, costM=costD*D;
      var kwhY=kwhD*365, costY=costD*365;
      function row(a,b,c){return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>'+a+'</span><span>'+b+' kWh &nbsp;·&nbsp; <strong>'+c+'</strong></span></div>';}
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+n(costM)+' / month</div>'+
        '<div style="opacity:.75;margin-bottom:14px">'+n(kwhM)+' kWh over '+D+' days</div>'+
        row('Per day',n(kwhD),n(costD))+row('Per month',n(kwhM),n(costM))+row('Per year',n(kwhY),n(costY));
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'paint-calculator', icon: '🎨', title: 'Paint Calculator', tagline: 'How Much Paint Do You Need',
  category: 'calculator',
  desc: 'Estimate how many litres of paint you need for a room, accounting for wall area, doors, windows, number of coats and paint coverage.',
  cardDesc: 'Estimate litres of paint needed for any room.',
  keywords: 'paint calculator, how much paint do i need, paint coverage calculator, wall paint estimator, room paint',
  searchTerms: 'paint wall room coverage litres decorating',
  zh: '油漆用量计算器根据房间长宽高、门窗数量、涂刷遍数和油漆遮盖率，估算需要购买多少升涂料，避免买多浪费或买少断料。',
  howto: ['Enter room length, width and wall height.', 'Set how many doors and windows to subtract.', 'Choose number of coats and paint coverage.', 'Click Calculate.'],
  faq: [
    { q: 'How many coats do I need?', a: 'Two coats is standard. Use three when painting a light colour over a dark one, or when covering bare plaster.' },
    { q: 'What coverage should I enter?', a: 'Most emulsion paints cover 10–12 m² per litre per coat. The exact figure is printed on the tin — rough or porous surfaces absorb more.' }
  ],
  zhfaq: [
    { q: '要刷几遍？', a: '一般刷两遍即可。深色改浅色、或新墙面第一次上漆时建议刷三遍，遮盖才均匀。' },
    { q: '遮盖率填多少？', a: '大多数乳胶漆每升每遍可覆盖 10–12 平方米，具体数值印在包装桶上。粗糙或吸水性强的墙面用量会明显增加。' }
  ],
  usecases: [
    { icon: '🏠', title: 'Room Refresh', text: 'Buy the right amount in one trip.' },
    { icon: '💰', title: 'Budget', text: 'Estimate material cost before starting.' },
    { icon: '🧰', title: 'Renovation', text: 'Plan a multi-room repaint.' }
  ],
  deep: '## 计算逻辑\n先算四面墙的总面积：周长 × 层高 = 2 × (长 + 宽) × 高。再减去门窗面积（标准门约 1.8㎡，标准窗约 1.5㎡）。最后：所需油漆(L) = 净墙面积 × 涂刷遍数 ÷ 每升遮盖面积。\n## 一个例子\n一间 4m × 3.5m、层高 2.8m 的卧室：墙面周长 15m，总墙面积 42㎡；扣掉 1 扇门和 1 扇窗共 3.3㎡，净面积约 38.7㎡。刷两遍、遮盖率 11㎡/L，需要约 7.03 升，实际购买 2 桶 5L 装比较稳妥。\n## 别忘了这些\n- **留 10% 余量**：补漆、修补和后期维护都需要\n- **底漆单独算**：新墙或大色差需要额外的底漆用量\n- **天花板另算**：面积 = 长 × 宽，通常用专门的顶漆\n- **深色更费漆**：鲜艳的红、蓝色系可能需要 3–4 遍才均匀\n## 使用提醒\n本工具为估算参考，实际用量受墙面材质、施工工具（滚筒比喷涂省漆）和个人手法影响，建议按计算结果上浮 10% 采购。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="len">Room length (m)</label>
            <input type="number" id="len" value="4" min="0.5" step="0.1">
          </div>
          <div class="form-row">
            <label for="wid">Room width (m)</label>
            <input type="number" id="wid" value="3.5" min="0.5" step="0.1">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="hgt">Wall height (m)</label>
            <input type="number" id="hgt" value="2.8" min="1" step="0.1">
          </div>
          <div class="form-row">
            <label for="coats">Number of coats</label>
            <input type="number" id="coats" value="2" min="1" max="5">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="doors">Doors</label>
            <input type="number" id="doors" value="1" min="0" max="10">
          </div>
          <div class="form-row">
            <label for="wins">Windows</label>
            <input type="number" id="wins" value="1" min="0" max="20">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="cov">Coverage (m² per litre per coat)</label>
            <input type="number" id="cov" value="11" min="1" step="0.5">
          </div>
          <div class="form-row">
            <label for="ceil">Include ceiling?</label>
            <select id="ceil"><option value="0">No</option><option value="1">Yes</option></select>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var ids=['len','wid','hgt','coats','doors','wins','cov','ceil'],el={};ids.forEach(function(i){el[i]=document.getElementById(i);});
    var out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var L=+el.len.value||0,W=+el.wid.value||0,H=+el.hgt.value||0,C=+el.coats.value||1;
      var D=+el.doors.value||0,N=+el.wins.value||0,CV=+el.cov.value||11,CE=el.ceil.value==='1';
      var wall=2*(L+W)*H;
      var deduct=D*1.8+N*1.5;
      var net=wall-deduct; if(net<0) net=0;
      if(CE) net+=L*W;
      var litres=net*C/CV;
      var withSpare=litres*1.1;
      function row(a,b){return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)"><span>'+a+'</span><strong>'+b+'</strong></div>';}
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+withSpare.toFixed(1)+' litres</div>'+
        '<div style="opacity:.75;margin-bottom:14px">recommended purchase (includes 10% spare)</div>'+
        row('Total wall area',wall.toFixed(1)+' m²')+
        row('Doors + windows deducted','−'+deduct.toFixed(1)+' m²')+
        (CE?row('Ceiling added','+'+(L*W).toFixed(1)+' m²'):'')+
        row('Paintable area',net.toFixed(1)+' m²')+
        row('Bare requirement ('+C+' coats)',litres.toFixed(1)+' L');
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'tile-calculator', icon: '🧱', title: 'Tile Calculator', tagline: 'How Many Tiles for Floor or Wall',
  category: 'calculator',
  desc: 'Work out how many tiles and boxes you need for a floor or wall, including grout gaps and a wastage allowance for cuts and breakage.',
  cardDesc: 'Calculate tiles and boxes needed for any area.',
  keywords: 'tile calculator, how many tiles do i need, floor tile calculator, tile quantity estimator, tiles per box',
  searchTerms: 'tile floor wall quantity boxes renovation',
  zh: '瓷砖用量计算器根据铺贴面积、单块瓷砖尺寸、留缝宽度和损耗率，算出需要多少块砖、多少箱，避免施工中途断货或大量剩余。',
  howto: ['Enter the area length and width.', 'Enter your tile dimensions in centimetres.', 'Set grout gap and wastage percentage.', 'Click Calculate to see tiles and boxes needed.'],
  faq: [
    { q: 'How much wastage should I allow?', a: 'Add 10% for a straight layout, 15% for diagonal or herringbone patterns, and up to 20% for small rooms with many cuts.' },
    { q: 'Why buy from the same batch?', a: 'Tile colour varies slightly between production batches. Buying all boxes at once with the same batch number avoids visible colour differences.' }
  ],
  zhfaq: [
    { q: '损耗率留多少合适？', a: '常规直铺留 10%，斜铺或人字拼留 15%，小房间切割多的可留到 20%。宁可多买一点，补货时容易出现色差。' },
    { q: '为什么要一次买齐？', a: '不同批次的瓷砖存在细微色差，同一批号（批次号印在箱体上）才能保证整体颜色一致。' }
  ],
  usecases: [
    { icon: '🚿', title: 'Bathroom', text: 'Plan wall and floor tiling.' },
    { icon: '🍳', title: 'Kitchen', text: 'Estimate backsplash quantity.' },
    { icon: '💵', title: 'Quote Check', text: 'Verify a contractor\u2019s material list.' }
  ],
  deep: '## 计算方法\n先算铺贴面积：长 × 宽。再算单块瓷砖的有效占位面积（含留缝）：(砖长 + 缝宽) × (砖宽 + 缝宽)。所需块数 = 铺贴面积 ÷ 单砖占位面积 × (1 + 损耗率)。\n## 一个例子\n卫生间地面 2.5m × 1.8m = 4.5㎡，用 30cm × 30cm 的砖，留缝 2mm：单砖占位 0.302 × 0.302 ≈ 0.0912㎡，理论需要 49.3 块；加 10% 损耗后约 55 块。若每箱 11 块，需买 5 箱。\n## 留缝的意义\n瓷砖热胀冷缩需要伸缩空间，完全无缝铺贴容易在温差变化时起拱开裂。常规墙砖留 1–2mm，地砖留 2–3mm，仿古砖可留 3–5mm。\n## 实用提醒\n- 记下批次号，同批采购避免色差\n- 留 2–3 块整砖备用，日后破损可更换\n- 异形区域（管道、门槛）另行加量\n- 本工具为估算，实际以现场放线测量为准',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="alen">Area length (m)</label>
            <input type="number" id="alen" value="2.5" min="0.1" step="0.1">
          </div>
          <div class="form-row">
            <label for="awid">Area width (m)</label>
            <input type="number" id="awid" value="1.8" min="0.1" step="0.1">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="tlen">Tile length (cm)</label>
            <input type="number" id="tlen" value="30" min="1" step="0.5">
          </div>
          <div class="form-row">
            <label for="twid">Tile width (cm)</label>
            <input type="number" id="twid" value="30" min="1" step="0.5">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="gap">Grout gap (mm)</label>
            <input type="number" id="gap" value="2" min="0" max="20" step="0.5">
          </div>
          <div class="form-row">
            <label for="waste">Wastage (%)</label>
            <input type="number" id="waste" value="10" min="0" max="40">
          </div>
        </div>
        <div class="form-row">
          <label for="perbox">Tiles per box</label>
          <input type="number" id="perbox" value="11" min="1">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var ids=['alen','awid','tlen','twid','gap','waste','perbox'],el={};ids.forEach(function(i){el[i]=document.getElementById(i);});
    var out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function calc(){
      var A=(+el.alen.value||0)*(+el.awid.value||0);
      var g=(+el.gap.value||0)/1000;
      var tw=(+el.tlen.value||1)/100+g, th=(+el.twid.value||1)/100+g;
      var unit=tw*th;
      if(!(A>0&&unit>0)){out.className='result-box';out.textContent='Please enter valid dimensions.';return;}
      var base=A/unit;
      var waste=+el.waste.value||0;
      var need=Math.ceil(base*(1+waste/100));
      var pb=+el.perbox.value||1;
      var boxes=Math.ceil(need/pb);
      function row(a,b){return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)"><span>'+a+'</span><strong>'+b+'</strong></div>';}
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+need+' tiles</div>'+
        '<div style="opacity:.75;margin-bottom:14px">= '+boxes+' box'+(boxes>1?'es':'')+' of '+pb+'</div>'+
        row('Area to cover',A.toFixed(2)+' m²')+
        row('Coverage per tile (incl. gap)',unit.toFixed(4)+' m²')+
        row('Tiles without wastage',Math.ceil(base)+'')+
        row('Wastage allowance','+'+waste+'%')+
        row('Spare tiles in last box',(boxes*pb-need)+'');
    }
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'macro-calculator', icon: '🥗', title: 'Macro Calculator', tagline: 'Daily Protein, Carbs & Fat Targets',
  category: 'calculator',
  desc: 'Split your daily calorie target into protein, carbohydrate and fat grams based on your goal, with balanced, low-carb and high-protein presets.',
  cardDesc: 'Split daily calories into protein, carbs and fat.',
  keywords: 'macro calculator, macronutrient calculator, protein carbs fat calculator, iifym calculator, macro split',
  searchTerms: 'macro macronutrient protein carbs fat diet split',
  zh: '三大营养素计算器把你的每日热量目标拆分成蛋白质、碳水和脂肪的具体克数，内置均衡、低碳水、高蛋白等多种配比方案，方便照着执行饮食计划。',
  howto: ['Enter your daily calorie target (use the BMR calculator if unsure).', 'Pick a macro split preset or set custom percentages.', 'Click Calculate.', 'Use the gram targets to plan meals.'],
  faq: [
    { q: 'How many calories per gram?', a: 'Protein and carbohydrate provide 4 kcal per gram; fat provides 9 kcal per gram. That is why fat grams look small relative to its calorie share.' },
    { q: 'How much protein do I need?', a: 'General guidance is 1.6–2.2 g per kg of bodyweight for people training regularly. Sedentary adults need less, around 0.8–1.2 g/kg.' }
  ],
  zhfaq: [
    { q: '各营养素每克多少热量？', a: '蛋白质和碳水每克 4 千卡，脂肪每克 9 千卡。所以同样占比下，脂肪的克数看起来会明显更少。' },
    { q: '蛋白质应该吃多少？', a: '规律训练的人群常见建议为每公斤体重 1.6–2.2 克；久坐人群约 0.8–1.2 克即可。具体请结合自身健康状况判断。' }
  ],
  usecases: [
    { icon: '🏋️', title: 'Bulking', text: 'Hit protein targets while gaining.' },
    { icon: '🔥', title: 'Cutting', text: 'Keep protein high while in deficit.' },
    { icon: '🥑', title: 'Low Carb', text: 'Shift calories toward fat.' }
  ],
  deep: '## 什么是宏量营养素\n宏量营养素（macronutrients，简称「宏量」）指蛋白质、碳水化合物和脂肪三大供能物质。热量密度分别为：蛋白质 4 kcal/g、碳水 4 kcal/g、脂肪 9 kcal/g。\n## 常见配比方案\n- **均衡型**（30/40/30）：适合大多数人日常维持\n- **低碳水**（35/25/40）：适合胰岛素敏感度较低或偏好高脂饮食的人\n- **高蛋白**（40/35/25）：适合力量训练期、减脂期保留肌肉\n- **高碳水**（25/55/20）：适合耐力运动员和大运动量人群\n## 一个换算例子\n每日目标 2000 千卡，采用 30/40/30：蛋白质 600 千卡 ÷ 4 = 150g；碳水 800 千卡 ÷ 4 = 200g；脂肪 600 千卡 ÷ 9 ≈ 67g。\n## 执行建议\n- 先保证蛋白质达标，它最影响饱腹感和肌肉保留\n- 脂肪不应长期低于总热量的 20%，会影响激素水平\n- 配比不必每天精确，一周平均达标即可\n- 本工具仅供参考，特殊疾病人群请遵医嘱',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="cals">Daily calorie target</label>
            <input type="number" id="cals" value="2000" min="800" max="6000" step="50">
          </div>
          <div class="form-row">
            <label for="preset">Macro split</label>
            <select id="preset">
              <option value="30,40,30" selected>Balanced — 30P / 40C / 30F</option>
              <option value="40,35,25">High protein — 40P / 35C / 25F</option>
              <option value="35,25,40">Low carb — 35P / 25C / 40F</option>
              <option value="25,55,20">High carb — 25P / 55C / 20F</option>
              <option value="custom">Custom…</option>
            </select>
          </div>
        </div>
        <div class="gen-row" id="customRow" style="display:none">
          <div class="form-row"><label for="pp">Protein %</label><input type="number" id="pp" value="30" min="0" max="100"></div>
          <div class="form-row"><label for="cc">Carbs %</label><input type="number" id="cc" value="40" min="0" max="100"></div>
          <div class="form-row"><label for="ff">Fat %</label><input type="number" id="ff" value="30" min="0" max="100"></div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var cals=document.getElementById('cals'),preset=document.getElementById('preset'),cr=document.getElementById('customRow'),
        pp=document.getElementById('pp'),cc=document.getElementById('cc'),ff=document.getElementById('ff'),
        out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    preset.addEventListener('change',function(){
      cr.style.display=preset.value==='custom'?'':'none';
      if(preset.value!=='custom'){var p=preset.value.split(',');pp.value=p[0];cc.value=p[1];ff.value=p[2];}
      calc();
    });
    function bar(label,pct,grams,kcal,color){
      return '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.92rem;margin-bottom:4px">'+
        '<span><strong>'+label+'</strong> '+pct+'%</span><span><strong>'+grams+' g</strong> · '+kcal+' kcal</span></div>'+
        '<div style="height:8px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+color+'"></div></div></div>';
    }
    function calc(){
      var C=+cals.value||0,P=+pp.value||0,Cb=+cc.value||0,F=+ff.value||0;
      var sum=P+Cb+F;
      var warn = Math.abs(sum-100)>0.5 ? '<p style="margin-top:10px;font-size:.86rem;color:var(--warning,#d29922)">⚠️ Percentages add up to '+sum+'%, not 100%. Results are scaled proportionally.</p>' : '';
      if(sum<=0){out.className='result-box';out.textContent='Enter valid percentages.';return;}
      var np=P/sum*100,nc=Cb/sum*100,nf=F/sum*100;
      var gp=Math.round(C*np/100/4),gc=Math.round(C*nc/100/4),gf=Math.round(C*nf/100/9);
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.35rem;font-weight:700;margin-bottom:14px">'+C+' kcal per day</div>'+
        bar('Protein',np.toFixed(0),gp,Math.round(C*np/100),'#8b5cf6')+
        bar('Carbs',nc.toFixed(0),gc,Math.round(C*nc/100),'#0ea5e9')+
        bar('Fat',nf.toFixed(0),gf,Math.round(C*nf/100),'#f59e0b')+
        '<p style="margin-top:8px;font-size:.86rem;opacity:.75">Protein & carbs = 4 kcal/g · Fat = 9 kcal/g</p>'+warn;
    }
    [cals,pp,cc,ff].forEach(function(e){e.addEventListener('input',calc);});
    btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'pace-calculator', icon: '🏃', title: 'Running Pace Calculator', tagline: 'Pace, Time & Distance for Runners',
  category: 'calculator',
  desc: 'Calculate running pace, finish time or distance — fill in any two and get the third, with split times for common race distances.',
  cardDesc: 'Work out running pace, finish time or distance.',
  keywords: 'pace calculator, running pace calculator, marathon pace, race time calculator, min per km',
  searchTerms: 'pace running marathon race time distance split',
  zh: '跑步配速计算器：在配速、时间、距离三者中填入任意两项，自动算出第三项，并给出 5K、10K、半马、全马等常见距离的预计完赛时间。',
  howto: ['Choose what you want to calculate.', 'Fill in the two values you know.', 'Click Calculate.', 'Check the race predictions table below the result.'],
  faq: [
    { q: 'What is a good pace?', a: 'It depends entirely on experience. Many recreational runners sit around 6:00–7:00 min/km for easy runs; the point is consistency, not comparison.' },
    { q: 'How are the race predictions made?', a: 'They apply your entered pace evenly across each distance. Real races slow down over longer distances, so treat longer predictions as optimistic.' }
  ],
  zhfaq: [
    { q: '多快的配速算好？', a: '完全取决于训练水平。大众跑者轻松跑常见于 6:00–7:00 分/公里，重要的是稳定而非和别人比较。' },
    { q: '完赛预测准吗？', a: '预测按你输入的配速匀速推算。实际比赛距离越长掉速越明显，全马预测通常偏乐观，建议在此基础上留出余量。' }
  ],
  usecases: [
    { icon: '🏅', title: 'Race Goal', text: 'Find the pace needed for a target time.' },
    { icon: '📉', title: 'Training', text: 'Set easy and tempo run paces.' },
    { icon: '⏱️', title: 'Splits', text: 'Check per-kilometre targets.' }
  ],
  deep: '## 配速的定义\n配速指跑完每公里所需的时间，通常写作「分:秒 / 公里」。它比速度（km/h）更直观：看到 5:30 就知道每公里要 5 分 30 秒。\n## 三者的换算关系\n配速 = 总时间 ÷ 距离；总时间 = 配速 × 距离；距离 = 总时间 ÷ 配速。三个量知道任意两个就能求第三个，这正是本工具的核心逻辑。\n## 常见比赛距离参考\n以 6:00 分/公里的配速为例：5 公里约 30 分钟，10 公里约 1 小时，半程马拉松（21.0975km）约 2 小时 07 分，全程马拉松（42.195km）约 4 小时 13 分。\n## 训练中的配速分区\n- **轻松跑**：能正常说话的强度，占总训练量 70%–80%\n- **节奏跑**：略感吃力但可维持 20–40 分钟\n- **间歇跑**：接近极限，短时间重复\n盲目每次都跑快，是业余跑者最常见的错误，也是伤病的主要来源。\n## 提醒\n本工具为匀速换算，实际成绩受地形、天气、补给和体能分配影响，请结合自身情况使用。',
  body: `        <div class="form-row">
          <label for="mode">Calculate</label>
          <select id="mode">
            <option value="pace">Pace (from time + distance)</option>
            <option value="time">Time (from pace + distance)</option>
            <option value="dist">Distance (from pace + time)</option>
          </select>
        </div>
        <div class="gen-row" id="rowTime">
          <div class="form-row"><label for="hh">Hours</label><input type="number" id="hh" value="0" min="0" max="99"></div>
          <div class="form-row"><label for="mm">Minutes</label><input type="number" id="mm" value="50" min="0" max="59"></div>
          <div class="form-row"><label for="ss">Seconds</label><input type="number" id="ss" value="0" min="0" max="59"></div>
        </div>
        <div class="gen-row">
          <div class="form-row" id="rowDist">
            <label for="dist">Distance (km)</label>
            <input type="number" id="dist" value="10" min="0.1" step="0.01">
          </div>
          <div class="form-row" id="rowPace" style="display:none">
            <label for="pmin">Pace min/km</label>
            <div style="display:flex;gap:8px">
              <input type="number" id="pmin" value="5" min="0" max="59" style="flex:1">
              <input type="number" id="psec" value="0" min="0" max="59" style="flex:1">
            </div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var mode=document.getElementById('mode'),hh=document.getElementById('hh'),mm=document.getElementById('mm'),ss=document.getElementById('ss'),
        dist=document.getElementById('dist'),pmin=document.getElementById('pmin'),psec=document.getElementById('psec'),
        rowTime=document.getElementById('rowTime'),rowDist=document.getElementById('rowDist'),rowPace=document.getElementById('rowPace'),
        out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function sync(){
      var m=mode.value;
      rowTime.style.display=(m==='pace'||m==='dist')?'':'none';
      rowDist.style.display=(m==='pace'||m==='time')?'':'none';
      rowPace.style.display=(m==='time'||m==='dist')?'':'none';
    }
    function hms(sec){
      sec=Math.round(sec);
      var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
      return (h>0?h+':'+String(m).padStart(2,'0'):m)+':'+String(s).padStart(2,'0');
    }
    function calc(){
      var T=(+hh.value||0)*3600+(+mm.value||0)*60+(+ss.value||0);
      var D=+dist.value||0;
      var P=(+pmin.value||0)*60+(+psec.value||0);
      var main='',sub='',paceSec=0;
      if(mode.value==='pace'){
        if(!(D>0&&T>0)){out.className='result-box';out.textContent='Enter both time and distance.';return;}
        paceSec=T/D;main=hms(paceSec)+' /km';sub='over '+D+' km in '+hms(T);
      } else if(mode.value==='time'){
        if(!(D>0&&P>0)){out.className='result-box';out.textContent='Enter both pace and distance.';return;}
        paceSec=P;main=hms(P*D);sub=D+' km at '+hms(P)+' /km';
      } else {
        if(!(T>0&&P>0)){out.className='result-box';out.textContent='Enter both time and pace.';return;}
        paceSec=P;main=(T/P).toFixed(2)+' km';sub='in '+hms(T)+' at '+hms(P)+' /km';
      }
      var races=[['5K',5],['10K',10],['Half marathon',21.0975],['Marathon',42.195]];
      var rows=races.map(function(r){
        return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)"><span>'+r[0]+'</span><strong>'+hms(paceSec*r[1])+'</strong></div>';
      }).join('');
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.8rem;font-weight:700;margin-bottom:4px">'+main+'</div>'+
        '<div style="opacity:.75;margin-bottom:14px">'+sub+'</div>'+
        '<div style="font-size:.9rem;font-weight:600;margin-bottom:6px">At this pace:</div>'+rows+
        '<div style="margin-top:10px;font-size:.85rem;opacity:.7">Speed: '+(3600/paceSec).toFixed(2)+' km/h</div>';
    }
    mode.addEventListener('change',function(){sync();calc();});
    btn.addEventListener('click',calc);sync();calc();`
});

T.push({
  slug: 'sleep-calculator', icon: '😴', title: 'Sleep Calculator', tagline: 'Best Bedtime & Wake-up Times by Sleep Cycle',
  category: 'calculator',
  desc: 'Find the best times to go to bed or wake up based on 90-minute sleep cycles, so you wake at the end of a cycle instead of mid-deep-sleep.',
  cardDesc: 'Find bedtimes that match 90-minute sleep cycles.',
  keywords: 'sleep calculator, sleep cycle calculator, bedtime calculator, best time to wake up, 90 minute sleep cycle',
  searchTerms: 'sleep cycle bedtime wake up rest schedule',
  zh: '睡眠计算器基于 90 分钟一个睡眠周期的规律，帮你算出几点入睡或几点起床最合适，让你在浅睡阶段自然醒来，而不是被闹钟从深睡中打断。',
  howto: ['Choose whether you know your wake-up time or bedtime.', 'Set the time.', 'Click Calculate.', 'Pick one of the suggested times — later options mean more cycles.'],
  faq: [
    { q: 'Why 90 minutes?', a: 'A full sleep cycle averages around 90 minutes, moving through light, deep and REM sleep. Waking at the end of a cycle usually feels far less groggy than waking mid-cycle.' },
    { q: 'How many cycles do I need?', a: 'Most adults do well on 5–6 cycles, which is 7.5–9 hours. Four cycles (6 hours) works short-term but is not sustainable for most people.' }
  ],
  zhfaq: [
    { q: '为什么是 90 分钟？', a: '一个完整睡眠周期平均约 90 分钟，依次经历浅睡、深睡和快速眼动期。在周期结束时醒来通常比在深睡中被叫醒清爽得多。' },
    { q: '一晚需要几个周期？', a: '多数成年人 5–6 个周期（7.5–9 小时）比较合适。4 个周期（6 小时）短期可行，但长期容易造成睡眠债。' }
  ],
  usecases: [
    { icon: '⏰', title: 'Early Meeting', text: 'Set a bedtime that avoids grogginess.' },
    { icon: '✈️', title: 'Jet Lag', text: 'Rebuild a sleep schedule.' },
    { icon: '📚', title: 'Study Nights', text: 'Choose the least damaging short sleep.' }
  ],
  deep: '## 睡眠周期是什么\n人的睡眠不是均匀的，而是由 N1 浅睡、N2、N3 深睡和 REM 快速眼动期组成的循环，一个完整周期平均约 90 分钟。一夜通常经历 4–6 个周期。\n## 为什么在周期末醒来更舒服\n如果闹钟在深睡（N3）阶段响起，大脑需要较长时间才能恢复清醒，这种昏沉感被称为「睡眠惯性」，可能持续 15–30 分钟甚至更久。而在周期结束、接近浅睡时醒来，过渡会自然得多。\n## 计算方式\n本工具在目标时间基础上按 90 分钟递增或递减，并额外预留约 15 分钟的入睡时间（普通人从躺下到入睡的平均时长）。\n## 改善睡眠的实际建议\n- 固定作息时间比睡够时长更重要\n- 睡前一小时避免强光和屏幕蓝光\n- 咖啡因半衰期约 5–6 小时，下午后尽量不摄入\n- 卧室温度 18–22℃ 通常最有利于入睡\n## 提醒\n90 分钟是人群平均值，个体周期在 70–110 分钟之间浮动。本工具仅供参考，长期失眠或睡眠呼吸问题请就医。',
  body: `        <div class="form-row">
          <label for="mode">I want to know</label>
          <select id="mode">
            <option value="bed">When to go to bed (I know my wake-up time)</option>
            <option value="wake">When to wake up (I go to bed now / at a set time)</option>
          </select>
        </div>
        <div class="form-row">
          <label for="time">Time</label>
          <input type="time" id="time" value="07:00">
        </div>
        <div class="form-row">
          <label for="fall">Minutes to fall asleep</label>
          <input type="number" id="fall" value="15" min="0" max="90">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
          <button class="btn btn-secondary" id="nowBtn">Use current time</button>
        </div>
        <div id="out"></div>`,
  js: `    var mode=document.getElementById('mode'),time=document.getElementById('time'),fall=document.getElementById('fall'),
        out=document.getElementById('out'),btn=document.getElementById('calcBtn'),nowBtn=document.getElementById('nowBtn');
    function fmt(d){var h=d.getHours(),m=d.getMinutes();var ap=h<12?'AM':'PM';var h12=h%12;if(h12===0)h12=12;return h12+':'+String(m).padStart(2,'0')+' '+ap;}
    nowBtn.addEventListener('click',function(){var d=new Date();time.value=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');calc();});
    function calc(){
      if(!time.value){out.className='result-box';out.textContent='Please pick a time.';return;}
      var p=time.value.split(':');
      var base=new Date();base.setHours(+p[0],+p[1],0,0);
      var f=+fall.value||0;
      var items=[];
      for(var c=6;c>=3;c--){
        var d=new Date(base.getTime());
        if(mode.value==='bed'){d.setMinutes(d.getMinutes()-c*90-f);}
        else{d.setMinutes(d.getMinutes()+f+c*90);}
        var hrs=(c*90/60).toFixed(1).replace('.0','');
        items.push({t:fmt(d),c:c,h:hrs});
      }
      if(mode.value==='wake') items.reverse();
      var best=items.filter(function(x){return x.c===5||x.c===6;});
      var rows=items.map(function(x){
        var hl=(x.c===5||x.c===6);
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:8px;'+
          (hl?'background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.35)':'border:1px solid var(--border)')+'">'+
          '<strong style="font-size:1.1rem">'+x.t+'</strong>'+
          '<span style="font-size:.86rem;opacity:.8">'+x.c+' cycles · '+x.h+' h'+(hl?' ✓':'')+'</span></div>';
      }).join('');
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.05rem;font-weight:700;margin-bottom:10px">'+
        (mode.value==='bed'?'Go to bed at one of these times:':'Wake up at one of these times:')+'</div>'+rows+
        '<p style="margin-top:8px;font-size:.85rem;opacity:.75">Highlighted options give 5–6 full cycles, the range most adults do best on. '+f+' min to fall asleep is included.</p>';
    }
    mode.addEventListener('change',calc);btn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'unit-price-calculator', icon: '🛒', title: 'Unit Price Calculator', tagline: 'Compare Which Package Is Cheaper',
  category: 'calculator',
  desc: 'Compare up to four package sizes and instantly see which one really costs less per unit — the bigger box is not always the better deal.',
  cardDesc: 'Compare package prices and find the real best value.',
  keywords: 'unit price calculator, price per unit, cost comparison calculator, which is cheaper, price per kg',
  searchTerms: 'unit price compare cheaper value shopping grocery',
  zh: '单价比较计算器让你同时比较最多 4 种包装规格的实际单价，一眼看出哪个更划算——大包装并不总是更便宜，促销标签也常有误导。',
  howto: ['Enter the price and quantity for each option.', 'Use the same unit across all options (g, ml, pieces…).', 'Click Compare.', 'The cheapest option is highlighted with the savings shown.'],
  faq: [
    { q: 'Is the bigger pack always cheaper?', a: 'No. Retail studies regularly find larger packs with a higher unit price, especially on promotion-heavy items. Always check the per-unit number.' },
    { q: 'What units should I use?', a: 'Anything, as long as all options use the same one. Comparing grams against kilograms will give a meaningless result.' }
  ],
  zhfaq: [
    { q: '大包装一定更便宜吗？', a: '不一定。零售调查经常发现大包装单价反而更高，尤其是在促销陈列的商品上。养成看单价的习惯最靠谱。' },
    { q: '单位怎么填？', a: '填什么单位都行，但所有选项必须统一。拿「克」和「千克」混着比会得出完全错误的结论。' }
  ],
  usecases: [
    { icon: '🛍️', title: 'Grocery Run', text: 'Pick the genuinely cheaper pack.' },
    { icon: '🧴', title: 'Bulk Buying', text: 'Check if bulk really saves money.' },
    { icon: '📱', title: 'In Store', text: 'Compare on your phone at the shelf.' }
  ],
  deep: '## 为什么要算单价\n包装规格五花八门：500g 装 29.9 元和 1.2kg 装 68 元，哪个便宜？直接比总价没有意义，必须换算成同一单位下的单价：前者 0.0598 元/g，后者 0.0567 元/g，大包装略胜。\n## 常见的定价陷阱\n- **「买大更划算」的心理定势**：商家利用这一点，对大包装设定更高单价\n- **促销价对比原价**：打折后的中包装可能比大包装还便宜\n- **规格微调**：包装看起来一样但内容量从 500g 减到 450g，即「缩水式通胀」\n## 计算方法\n单价 = 总价 ÷ 数量。本工具会自动找出单价最低的选项，并算出相对最贵选项能省多少百分比。\n## 实用技巧\n- 超市货架价签通常有小字标注的单价，但单位可能不统一\n- 保质期短的商品，买大包装吃不完反而更贵\n- 把单价乘以你实际的消耗量，才是真实成本',
  body: `        <div id="rows"></div>
        <div class="btn-row">
          <button class="btn btn-primary" id="cmpBtn">Compare</button>
          <button class="btn btn-secondary" id="addBtn">Add option</button>
        </div>
        <div id="out"></div>`,
  js: `    var rows=document.getElementById('rows'),out=document.getElementById('out'),cmpBtn=document.getElementById('cmpBtn'),addBtn=document.getElementById('addBtn');
    var seed=[[29.9,500],[68,1200],[0,0]];
    function addRow(price,qty){
      var i=rows.children.length;
      if(i>=6)return;
      var d=document.createElement('div');
      d.className='gen-row';
      d.innerHTML='<div class="form-row"><label>Option '+(i+1)+' — price</label><input type="number" class="p" value="'+(price||'')+'" min="0" step="0.01" placeholder="Price"></div>'+
        '<div class="form-row"><label>Quantity (g / ml / pcs)</label><input type="number" class="q" value="'+(qty||'')+'" min="0" step="0.01" placeholder="Amount"></div>';
      rows.appendChild(d);
      d.querySelectorAll('input').forEach(function(inp){inp.addEventListener('input',calc);});
    }
    seed.forEach(function(s){addRow(s[0]||'',s[1]||'');});
    addBtn.addEventListener('click',function(){addRow('','');});
    function calc(){
      var ps=rows.querySelectorAll('.p'),qs=rows.querySelectorAll('.q');
      var list=[];
      for(var i=0;i<ps.length;i++){
        var p=parseFloat(ps[i].value),q=parseFloat(qs[i].value);
        if(p>0&&q>0) list.push({i:i+1,p:p,q:q,u:p/q});
      }
      out.className='result-box';
      if(list.length<2){out.innerHTML='<span style="opacity:.75">Enter at least two options with price and quantity.</span>';return;}
      var sorted=list.slice().sort(function(a,b){return a.u-b.u;});
      var best=sorted[0],worst=sorted[sorted.length-1];
      var save=(1-best.u/worst.u)*100;
      var body=sorted.map(function(x,idx){
        var win=idx===0;
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:8px;'+
          (win?'background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.4)':'border:1px solid var(--border)')+'">'+
          '<span>'+(win?'🏆 ':'')+'Option '+x.i+' — '+x.p+' / '+x.q+'</span>'+
          '<strong>'+x.u.toFixed(4)+' per unit</strong></div>';
      }).join('');
      out.innerHTML='<div style="font-size:1.3rem;font-weight:700;margin-bottom:10px">Option '+best.i+' is the best value</div>'+body+
        '<p style="margin-top:8px;font-size:.88rem;opacity:.8">It is <strong>'+save.toFixed(1)+'%</strong> cheaper per unit than the most expensive option.</p>';
    }
    cmpBtn.addEventListener('click',calc);calc();`
});

T.push({
  slug: 'income-tax-calculator', icon: '🧾', title: 'Income Tax Calculator', tagline: 'Progressive Tax Bracket Estimator',
  category: 'calculator',
  desc: 'Estimate income tax using progressive brackets, showing the tax due in each band, total tax, effective rate and take-home pay.',
  cardDesc: 'Estimate income tax across progressive brackets.',
  keywords: 'income tax calculator, tax bracket calculator, effective tax rate, take home pay calculator, progressive tax',
  searchTerms: 'income tax bracket rate take home salary progressive',
  zh: '个人所得税计算器按累进税率分档计算应纳税额，展示每一档的税款、合计税额、实际税负率和税后收入，帮你理解「跳档」到底影响多少。',
  howto: ['Enter your annual taxable income.', 'Adjust the deduction if applicable.', 'Choose or edit the bracket preset.', 'Click Calculate to see the band-by-band breakdown.'],
  faq: [
    { q: 'Does moving into a higher bracket tax all my income?', a: 'No — this is the most common misunderstanding. Only the portion above each threshold is taxed at the higher rate. Earning one unit more never reduces your take-home pay.' },
    { q: 'What is the effective tax rate?', a: 'Total tax divided by total income. It is always lower than your top marginal bracket, because the lower bands are taxed at lower rates.' }
  ],
  zhfaq: [
    { q: '跳到更高税率档，全部收入都按高税率交税吗？', a: '不是，这是最常见的误解。只有超过起征点的那部分按更高税率计算，多赚一块钱绝不会导致到手反而变少。' },
    { q: '实际税负率是什么？', a: '实际税负率 = 总税额 ÷ 总收入，它永远低于你所处的最高边际税率，因为低档部分是按低税率计税的。' }
  ],
  usecases: [
    { icon: '💼', title: 'Job Offer', text: 'Compare take-home across salaries.' },
    { icon: '📊', title: 'Tax Planning', text: 'See the marginal cost of extra income.' },
    { icon: '🎓', title: 'Learning', text: 'Understand how brackets actually work.' }
  ],
  deep: '## 累进税率是怎么运作的\n累进税制把收入切成若干档，每一档适用不同税率，只有落入该档的那部分收入按该档税率计税。这就是为什么「多赚一元反而到手更少」在累进税制下不可能发生。\n## 一个具体例子\n假设税率为：0–36000 部分 3%，36000–144000 部分 10%，144000–300000 部分 20%。年应纳税所得额 20 万元时：\n- 前 36000 元 × 3% = 1080 元\n- 中间 108000 元 × 10% = 10800 元\n- 剩余 56000 元 × 20% = 11200 元\n- 合计 23080 元，实际税负率 11.5%，而非最高档的 20%\n## 边际税率 vs 实际税率\n**边际税率**是你最后一元收入适用的税率（上例为 20%）；**实际税率**是总税额除以总收入（上例为 11.5%）。做加薪、兼职决策时看边际税率，评估整体税负时看实际税率。\n## 使用说明\n本工具的默认档位为通用示例，你可以按所在地区的实际税率表自行修改。计算结果为估算，不包含专项附加扣除、社保公积金、税收抵免等因素，**不构成税务意见**，正式申报请以税务机关规定或专业人士意见为准。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="income">Annual income</label>
            <input type="number" id="income" value="200000" min="0" step="1000">
          </div>
          <div class="form-row">
            <label for="deduct">Standard deduction / allowance</label>
            <input type="number" id="deduct" value="0" min="0" step="1000">
          </div>
        </div>
        <div class="form-row">
          <label for="brackets">Tax brackets (one per line: upper_limit,rate% — use blank upper limit for the top band)</label>
          <textarea id="brackets" style="min-height:130px;font-family:var(--font-mono,monospace)">36000,3
144000,10
300000,20
420000,25
660000,30
960000,35
,45</textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div id="out"></div>`,
  js: `    var income=document.getElementById('income'),deduct=document.getElementById('deduct'),brk=document.getElementById('brackets'),out=document.getElementById('out'),btn=document.getElementById('calcBtn');
    function n(x){return (Math.round(x*100)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    function calc(){
      var gross=+income.value||0,ded=+deduct.value||0;
      var taxable=gross-ded; if(taxable<0) taxable=0;
      var bands=brk.value.split('\\n').map(function(l){return l.trim();}).filter(Boolean).map(function(l){
        var p=l.split(',');
        return {lim:p[0].trim()===''?Infinity:parseFloat(p[0]),rate:parseFloat(p[1])||0};
      }).filter(function(b){return !isNaN(b.rate);});
      if(!bands.length){out.className='result-box';out.textContent='Please define at least one bracket.';return;}
      var prev=0,total=0,rows='',marginal=0;
      for(var i=0;i<bands.length;i++){
        var b=bands[i];
        if(taxable<=prev)break;
        var upper=Math.min(taxable,b.lim);
        var amt=upper-prev;
        if(amt<=0){prev=b.lim;continue;}
        var t=amt*b.rate/100;
        total+=t;marginal=b.rate;
        rows+='<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:.9rem">'+
          '<span>'+n(prev)+' – '+(b.lim===Infinity?'above':n(b.lim))+' @ '+b.rate+'%</span><strong>'+n(t)+'</strong></div>';
        prev=b.lim;
        if(prev===Infinity)break;
      }
      var eff=gross>0?total/gross*100:0;
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;margin-bottom:4px">'+n(total)+'</div>'+
        '<div style="opacity:.75;margin-bottom:14px">total tax on '+n(taxable)+' taxable income</div>'+
        rows+
        '<div style="display:grid;gap:6px;margin-top:12px;font-size:.93rem">'+
        '<div>Effective tax rate: <strong>'+eff.toFixed(2)+'%</strong></div>'+
        '<div>Marginal (top) rate: <strong>'+marginal+'%</strong></div>'+
        '<div>Take-home: <strong>'+n(gross-total)+'</strong></div></div>';
    }
    btn.addEventListener('click',calc);calc();`
});

module.exports = T;
