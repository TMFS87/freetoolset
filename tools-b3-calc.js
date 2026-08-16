/* tools-b3-calc.js — batch 3, calculator category (14 tools) */
const T = [];

T.push({
  slug: 'bmr-calculator', icon: '🔥', title: 'BMR Calculator', tagline: 'Basal Metabolic Rate & Daily Calorie Needs',
  category: 'calculator', popular: 'Popular',
  desc: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation, plus your total daily energy expenditure (TDEE) based on activity level.',
  cardDesc: 'Find your basal metabolic rate and daily calorie needs.',
  keywords: 'bmr calculator, basal metabolic rate, tdee calculator, daily calorie needs, metabolism calculator',
  searchTerms: 'bmr basal metabolic rate tdee calorie metabolism',
  howto: ['Enter your gender, age, height and weight.', 'Pick the activity level that matches your week.', 'Click Calculate to see BMR and TDEE.', 'Use TDEE as your maintenance calorie baseline.'],
  faq: [
    { q: 'What is the difference between BMR and TDEE?', a: 'BMR is what your body burns at complete rest, just keeping organs running. TDEE is BMR multiplied by an activity factor, representing everything you actually burn in a day.' },
    { q: 'Which formula does this use?', a: 'Mifflin-St Jeor, which research generally finds more accurate for most people than the older Harris-Benedict equation.' },
    { q: 'How accurate is it?', a: 'It is a population-based estimate, typically within about 10% for most adults. Body composition, genetics and medication can shift the real number.' }
  ],
  zhfaq: [
    { q: 'What is the difference between BMR and TDEE?', a: 'BMR is the energy burned at complete rest to sustain basic life functions like heartbeat, breathing, and body temperature. TDEE is BMR multiplied by an activity factor and represents your actual total daily calorie burn.' },
    { q: 'How many calories should I eat to lose fat?', a: 'Usually a mild deficit of 300-500 kcal below TDEE works well; too large a deficit risks losing muscle and is hard to sustain. Adjust to your own situation or consult a dietitian.' }
  ],
  usecases: [
    { icon: '🥗', title: 'Fat Loss Plan', text: 'Set a calorie target below your TDEE.' },
    { icon: '💪', title: 'Muscle Gain', text: 'Eat above TDEE for a controlled surplus.' },
    { icon: '⚖️', title: 'Maintenance', text: 'Match TDEE to hold your current weight.' }
  ],
  deep: '## What is basal metabolic rate\nBasal metabolic rate (BMR) is the minimum energy your body uses to keep the heart beating, lungs breathing, body temperature steady, and organs running while you are fully awake, lying down, fasting, and in a comfortable environment. It usually makes up 60%-70% of daily energy use and is the baseline for any diet plan.\n## The formula\nThis tool uses the Mifflin-St Jeor equation: male BMR = 10 times weight(kg) + 6.25 times height(cm) - 5 times age + 5; female BMR = 10 times weight + 6.25 times height - 5 times age - 161. Compared with the older Harris-Benedict formula, it has smaller error in modern populations.\n## From BMR to TDEE\nMultiply BMR by an activity factor to get total daily energy expenditure: sedentary 1.2, light 1.375, moderate 1.55, high 1.725, athlete 1.9. Example: a 30-year-old, 170cm, 65kg woman has a BMR around 1379 kcal; with light activity her TDEE is about 1896 kcal.\n## Things to keep in mind\n- Formulas are based on population statistics; individual variation can exceed 10%.\n- People with more muscle mass have a higher actual BMR than the estimate.\n- Long-term very-low-calorie diets lower metabolic adaptation and make the number unreliable.\n- Results are for reference only and do not replace professional nutrition or medical advice.',
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
  howto: ['Choose your gender.', 'Enter your height in centimetres.', 'Click Calculate.', 'Compare the four formula results with the healthy BMI range.'],
  faq: [
    { q: 'Why do the four formulas disagree?', a: 'They were derived from different populations and eras. Treat the spread between them as a reasonable range rather than looking for one exact number.' },
    { q: 'Is ideal weight the same as healthy weight?', a: 'No. The healthy BMI range (18.5–24.9) is wider and more forgiving. Ideal weight formulas give a single point estimate originally designed for medication dosing.' }
  ],
  zhfaq: [
    { q: 'The four formulas give different results - which should I trust?', a: 'They come from different eras and populations, so differences are normal. Treat the four results as a reasonable range rather than chasing one exact number.' },
    { q: 'Is ideal weight the healthiest weight?', a: 'Not necessarily. The healthy BMI range (18.5-24.9) is looser and more practical; the ideal-weight formulas were originally designed for drug dosing and ignore muscle mass and body shape.' }
  ],
  usecases: [
    { icon: '🎯', title: 'Set a Goal', text: 'Pick a realistic target weight range.' },
    { icon: '📊', title: 'Health Check', text: 'See if your weight sits in a healthy band.' },
    { icon: '🏃', title: 'Fitness Plan', text: 'Use with BMR to plan calories.' }
  ],
  deep: '## Where ideal weight comes from\nThe idea of ideal weight first appeared in the 1970s. The Devine formula was originally designed to calculate drug dosages, then became widely used for health assessment. Later scholars such as Robinson, Miller, and Hamwi proposed their own revised versions.\n## Differences between the four formulas\nTake a 170cm man as an example: Devine about 65.9kg, Robinson about 64.9kg, Miller about 64.5kg, Hamwi about 68.0kg. The differences come from their base weights and per-inch increments, usually 2-4kg apart.\n## A more practical reference: the BMI range\nThe WHO recommends adults keep BMI between 18.5 and 24.9. Converted to weight that is a range rather than a single point; for 170cm a healthy weight is roughly 53.5-72.0kg. This range better accommodates different body types and muscle mass.\n## Limitations\n- Formulas consider only height and sex, ignoring muscle mass and frame size.\n- Athletes with high muscle density are often labeled overweight but are actually healthy.\n- Not suitable for children, pregnant women, or the elderly.\n- Results are for reference only and do not constitute medical advice.',
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
  howto: ['Enter the first day of your last menstrual period.', 'Adjust cycle length if yours is not 28 days.', 'Click Calculate.', 'Review your estimated due date and current gestational week.'],
  faq: [
    { q: 'How accurate is a due date?', a: 'Only about 4% of babies arrive exactly on the estimated date. Roughly 80% are born within two weeks either side, which is why it is called an estimate.' },
    { q: 'What if my cycle is not 28 days?', a: 'The calculator adjusts for that. A longer cycle usually means later ovulation, which pushes the due date later by the same number of days.' }
  ],
  zhfaq: [
    { q: 'Is the due date accurate?', a: 'Only about 4% of babies are born exactly on the due date, and about 80% arrive within two weeks before or after, so it is an estimated range, not a fixed date.' },
    { q: 'What if my cycle is not 28 days?', a: 'The tool adjusts automatically. A longer cycle usually means later ovulation, and the due date shifts later by the same number of days.' }
  ],
  usecases: [
    { icon: '📅', title: 'Plan Ahead', text: 'Know when to book leave and appointments.' },
    { icon: '🩺', title: 'Track Progress', text: 'See your current gestational week.' },
    { icon: '🍼', title: 'Prepare', text: 'Line up trimester milestones.' }
  ],
  deep: '## How the due date is calculated\nThe most common clinical method is Naegele\'s rule: add 280 days (40 weeks) to the first day of the last menstrual period. It assumes a 28-day cycle with ovulation on day 14.\n## Adjusting for irregular cycles\nIf your cycle is 32 days, ovulation is about 4 days later, so the due date shifts later by the same amount. This tool has that correction built in: due date = last period + 280 days + (cycle length - 28).\n## The three trimesters\n- First trimester: weeks 1-13, the critical period of organ formation.\n- Second trimester: weeks 14-27, symptoms usually ease and it feels most comfortable.\n- Third trimester: weeks 28-40, the fetus gains weight rapidly.\n## Important note\nActual delivery varies greatly between individuals; an ultrasound (especially in early pregnancy) is more accurate than menstrual dating. This tool is for reference only; follow your doctor\'s diagnosis for prenatal scheduling.',
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
  howto: ['Enter the vehicle price.', 'Add your down payment and any trade-in value.', 'Set the loan term and annual interest rate.', 'Click Calculate to see the monthly payment breakdown.'],
  faq: [
    { q: 'Does a longer term save money?', a: 'It lowers the monthly payment but increases total interest. A 7-year loan can cost thousands more than a 4-year loan on the same car.' },
    { q: 'Should I include sales tax in the loan?', a: 'Many buyers do finance the tax. This calculator lets you add a tax rate so the monthly figure reflects what you will actually pay.' }
  ],
  zhfaq: [
    { q: 'Is a longer loan term more cost-effective?', a: 'A longer term lowers the monthly payment but greatly increases total interest. A 7-year loan on the same car can cost tens of thousands more in interest than a 4-year loan.' },
    { q: 'Is the dealer\'s zero interest really true?', a: 'It usually requires giving up cash discounts or bundling insurance and accessories to offset it, so the true all-in cost is not necessarily lower. Use this tool to calculate and compare the total spend of both options.' }
  ],
  usecases: [
    { icon: '🏷️', title: 'Budget Check', text: 'See if the monthly payment fits your income.' },
    { icon: '⚖️', title: 'Compare Terms', text: 'Weigh 3-year vs 5-year total cost.' },
    { icon: '🤝', title: 'Negotiate', text: 'Know the real numbers before the dealership.' }
  ],
  deep: '## How the monthly car payment is calculated\nA car loan is an equal-installment amortizing loan. The payment formula is M = P times r times (1+r)^n divided by ((1+r)^n - 1), where P is the loan principal (price - down payment - trade-in + fees), r is the monthly rate (annual rate divided by 12), and n is the total number of months.\n## A real example\nCar price 200000, down payment 60000, loan 140000, annual rate 5%, term 5 years: monthly payment about 2642, total interest about 18500, total cost about 218500. If the term is shortened to 3 years, the monthly payment rises to about 4196 but interest drops to about 11000, saving about 7500.\n## Often-overlooked costs\n- One-time fees such as handling, GPS, and service charges.\n- Full-coverage insurance requirement: usually mandatory during the loan period.\n- Prepayment penalty: some contracts charge 1%-3% of the remaining principal.\n## The monthly rate trap\nSales often quote a monthly rate of 0.3%, which sounds low but is calculated on the original principal, so the real annual rate is close to 6.5%, more than double the nominal value. Always ask for the annual percentage rate (APR) in writing before signing.',
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
  howto: ['Choose whether to solve for monthly amount or time needed.', 'Enter your goal, current savings and interest rate.', 'Fill in the remaining field.', 'Click Calculate to see your plan.'],
  faq: [
    { q: 'Does it account for interest?', a: 'Yes. Contributions compound monthly at the annual rate you enter. Set the rate to 0 for a plain cash savings plan.' },
    { q: 'Should I include inflation?', a: 'This tool works in nominal terms. For a rough real-terms view, subtract expected inflation from your interest rate before entering it.' }
  ],
  zhfaq: [
    { q: 'Does the calculation include interest?', a: 'Yes. Money deposited each month compounds monthly at the annual rate you enter. If you just leave it in a no-interest account, set the rate to 0.' },
    { q: 'Should I account for inflation?', a: 'This tool uses nominal amounts. To see real purchasing power, enter the difference between the annual rate and your expected inflation rate for an approximate real-return view.' }
  ],
  usecases: [
    { icon: '🏠', title: 'Down Payment', text: 'Plan a house deposit timeline.' },
    { icon: '✈️', title: 'Big Trip', text: 'Save for travel without a loan.' },
    { icon: '🛡️', title: 'Emergency Fund', text: 'Build 6 months of expenses.' }
  ],
  deep: '## Two common questions\nSaving plans usually come down to two questions: how much do I need to save each month to reach the goal on time, and at my current pace when will I get there. This tool supports both modes.\n## The formula behind it\nRegular deposits with compounding use the future-value-of-an-annuity formula: FV = PV times (1+r)^n + PMT times (((1+r)^n - 1) divided by r), where r is the monthly rate and n is the number of months. Solving for PMT gives the monthly amount to save.\n## An example\nGoal 300000 down payment, current savings 50000, annual rate 3%, want to reach it in 5 years. The formula gives about 3835 per month; without interest you would need about 4167 - interest saves you about 20000 of principal.\n## Ways to improve your success rate\n- Set up auto-transfer: move savings out on payday.\n- Put bonuses and tax refunds straight toward the goal.\n- Pay down high-interest debt first: clearing a 15% credit card equals a 15% risk-free return.',
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
  howto: ['Enter the amount of money.', 'Set the number of years and average inflation rate.', 'Choose future value or past value.', 'Click Calculate.'],
  faq: [
    { q: 'What inflation rate should I use?', a: 'Long-run averages sit around 2–3% for most developed economies. Check your national statistics bureau for the official CPI figure if you want precision.' },
    { q: 'Why does my salary feel smaller each year?', a: 'If your raise is below the inflation rate, your real purchasing power falls even though the number on your payslip goes up.' }
  ],
  zhfaq: [
    { q: 'What inflation rate should I enter?', a: 'Most developed economies average 2%-3% long term. For more precision, check the year-over-year CPI published by the statistics bureau.' },
    { q: 'Why do I feel poorer after a raise?', a: 'If your raise is below the inflation rate, your real purchasing power falls. For example, a 3% raise with 5% inflation is a real income drop of about 2%.' }
  ],
  usecases: [
    { icon: '🏦', title: 'Retirement Plan', text: 'See what your savings will really buy.' },
    { icon: '💼', title: 'Salary Check', text: 'Test if a raise beats inflation.' },
    { icon: '📊', title: 'History', text: 'Compare prices across decades.' }
  ],
  deep: '## How inflation erodes purchasing power\nInflation means the same amount of money buys less over time. The formula: future amount needed = current amount times (1 + inflation rate) to the power of years; conversely, a future amount\'s purchasing power today = future amount divided by (1 + inflation rate) to the power of years.\n## A clear example\nAssume 3% annual inflation: today\'s 100000 will require about 180600 in 20 years to buy the same things; conversely, 100000 in 20 years is worth only about 55400 in today\'s money.\n## Three takeaways for personal finance\n- Cash has a cost: deposit rates are long below inflation, so idle cash slowly loses value.\n- Raises must beat inflation: a 3% nominal raise with 3% inflation means zero real income growth.\n- Long-term goals need future prices: planning 20-year retirement must use future price levels.\n## Limitations\nReal inflation varies a lot by category (medical and education often rise faster than average, electronics can even fall). This tool uses a single average rate and is for reference only, not investment advice.',
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
  howto: ['Enter the appliance wattage (check the label).', 'Set daily hours of use.', 'Enter your electricity price per kWh.', 'Click Calculate to see daily, monthly and yearly cost.'],
  faq: [
    { q: 'Where do I find the wattage?', a: 'Look at the rating label on the back or underside of the appliance, or in the manual. It is shown in W (watts) or sometimes as volts × amps.' },
    { q: 'Does standby power matter?', a: 'Yes. Devices left on standby typically draw 1–5W each. Across a whole house that can add up to a noticeable share of the annual bill.' }
  ],
  zhfaq: [
    { q: 'Where do I find the power rating?', a: 'Usually on the nameplate on the back or bottom of the appliance, marked in W (watts); some list only voltage and current, in which case power = voltage times current.' },
    { q: 'Does standby power matter?', a: 'Yes. A single device may use only 1-5W on standby, but a whole house of a dozen devices over a year can add up to over a hundred in cost.' }
  ],
  usecases: [
    { icon: '❄️', title: 'Air Conditioner', text: 'See the real cost of summer cooling.' },
    { icon: '🖥️', title: 'Home Office', text: 'Budget PC and monitor running costs.' },
    { icon: '🔍', title: 'Find Waste', text: 'Spot which device drives your bill.' }
  ],
  deep: '## How the electricity bill is calculated\nThe basic unit is the kilowatt-hour (kWh, commonly called a degree). Formula: energy(kWh) = power(W) times hours used divided by 1000; cost = energy times price.\n## Power reference for common appliances\n- LED bulb: about 10W\n- Laptop: about 50W\n- Desktop plus monitor: about 200W\n- Rice cooker: about 800W\n- Air conditioner (1.5 HP): about 1100W\n- Water heater: about 2000W\n## An example\nAn 1100W air conditioner running 8 hours a day at 0.6 per kWh: 8.8 kWh per day, about 5.28, about 158 a month, and about 475 over a whole summer (3 months).\n## Practical ways to save\n- Each 1 C higher on the AC cuts consumption about 6%-8%.\n- Use a power strip to cut standby power completely.\n- Check the energy label: tier 1 is usually 20%-30% more efficient than tier 3.\n- In time-of-use areas, run laundry and charging in off-peak hours.',
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
  howto: ['Enter room length, width and wall height.', 'Set how many doors and windows to subtract.', 'Choose number of coats and paint coverage.', 'Click Calculate.'],
  faq: [
    { q: 'How many coats do I need?', a: 'Two coats is standard. Use three when painting a light colour over a dark one, or when covering bare plaster.' },
    { q: 'What coverage should I enter?', a: 'Most emulsion paints cover 10–12 m² per litre per coat. The exact figure is printed on the tin — rough or porous surfaces absorb more.' }
  ],
  zhfaq: [
    { q: 'How many coats do I need?', a: 'Two coats is usually enough. Going from dark to light, or painting a new wall for the first time, three coats gives more even coverage.' },
    { q: 'What coverage should I enter?', a: 'Most latex paint covers 10-12 sqm per liter per coat; the exact number is printed on the can. Rough or absorbent walls need noticeably more.' }
  ],
  usecases: [
    { icon: '🏠', title: 'Room Refresh', text: 'Buy the right amount in one trip.' },
    { icon: '💰', title: 'Budget', text: 'Estimate material cost before starting.' },
    { icon: '🧰', title: 'Renovation', text: 'Plan a multi-room repaint.' }
  ],
  deep: '## The calculation logic\nFirst find the total wall area: perimeter times ceiling height = 2 times (length + width) times height. Then subtract doors and windows (standard door about 1.8 sqm, standard window about 1.5 sqm). Finally: paint needed(L) = net wall area times coats divided by coverage per liter.\n## An example\nA 4m by 3.5m bedroom with 2.8m ceiling: perimeter 15m, total wall area 42 sqm; minus one door and one window (3.3 sqm) leaves about 38.7 sqm net. Two coats at 11 sqm/L needs about 7.03 L; buying two 5L cans is the safer choice.\n## Don\'t forget these\n- Leave a 10% margin for touch-ups, repairs, and later maintenance.\n- Primer is separate: new walls or big color changes need extra primer.\n- Ceiling is separate: area = length times width, usually with dedicated ceiling paint.\n- Dark colors use more paint: vivid red or blue may need 3-4 coats for even coverage.\n## Reminder\nThis tool is an estimate; actual usage depends on wall material, tools (rollers save paint vs spraying), and technique. Buy about 10% more than the result.',
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
  howto: ['Enter the area length and width.', 'Enter your tile dimensions in centimetres.', 'Set grout gap and wastage percentage.', 'Click Calculate to see tiles and boxes needed.'],
  faq: [
    { q: 'How much wastage should I allow?', a: 'Add 10% for a straight layout, 15% for diagonal or herringbone patterns, and up to 20% for small rooms with many cuts.' },
    { q: 'Why buy from the same batch?', a: 'Tile colour varies slightly between production batches. Buying all boxes at once with the same batch number avoids visible colour differences.' }
  ],
  zhfaq: [
    { q: 'What waste margin is appropriate?', a: '10% for straight layout, 15% for diagonal or herringbone, up to 20% for small rooms with many cuts. Buy a bit extra; restocking often shows color differences.' },
    { q: 'Why buy it all at once?', a: 'Tiles from different batches have subtle color differences; the same batch number (printed on the box) ensures consistent overall color.' }
  ],
  usecases: [
    { icon: '🚿', title: 'Bathroom', text: 'Plan wall and floor tiling.' },
    { icon: '🍳', title: 'Kitchen', text: 'Estimate backsplash quantity.' },
    { icon: '💵', title: 'Quote Check', text: 'Verify a contractor\u2019s material list.' }
  ],
  deep: '## The calculation method\nFirst the tiling area: length times width. Then the effective footprint of one tile including grout: (tile length + grout) times (tile width + grout). Tiles needed = tiling area divided by single-tile footprint times (1 + waste rate).\n## An example\nBathroom floor 2.5m by 1.8m = 4.5 sqm, with 30cm by 30cm tiles and 2mm grout: footprint 0.302 by 0.302 is about 0.0912 sqm, theoretically 49.3 tiles; with 10% waste about 55 tiles. If 11 tiles per box, buy 5 boxes.\n## Why grout matters\nTiles expand and contract with temperature and need room to move; fully groutless tiling can buckle and crack when temperatures change. Standard wall tile grout 1-2mm, floor tile 2-3mm, rustic tile 3-5mm.\n## Practical notes\n- Note the batch number and buy from the same batch to avoid color differences.\n- Keep 2-3 whole tiles as spares for future breakage.\n- Odd-shaped areas (pipes, thresholds) need extra.\n- This tool is an estimate; rely on on-site measurement.',
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
  howto: ['Enter your daily calorie target (use the BMR calculator if unsure).', 'Pick a macro split preset or set custom percentages.', 'Click Calculate.', 'Use the gram targets to plan meals.'],
  faq: [
    { q: 'How many calories per gram?', a: 'Protein and carbohydrate provide 4 kcal per gram; fat provides 9 kcal per gram. That is why fat grams look small relative to its calorie share.' },
    { q: 'How much protein do I need?', a: 'General guidance is 1.6–2.2 g per kg of bodyweight for people training regularly. Sedentary adults need less, around 0.8–1.2 g/kg.' }
  ],
  zhfaq: [
    { q: 'How many calories per gram of each nutrient?', a: 'Protein and carbs are 4 kcal/g, fat is 9 kcal/g. So at the same percentage, the gram amount of fat looks much smaller.' },
    { q: 'How much protein should I eat?', a: 'Common advice for regular trainees is 1.6-2.2 g per kg of body weight; sedentary people about 0.8-1.2 g is enough. Judge based on your own health.' }
  ],
  usecases: [
    { icon: '🏋️', title: 'Bulking', text: 'Hit protein targets while gaining.' },
    { icon: '🔥', title: 'Cutting', text: 'Keep protein high while in deficit.' },
    { icon: '🥑', title: 'Low Carb', text: 'Shift calories toward fat.' }
  ],
  deep: '## What are macronutrients\nMacronutrients (often called macros) are the three energy-providing nutrients: protein, carbohydrate, and fat. Their calorie densities are: protein 4 kcal/g, carb 4 kcal/g, fat 9 kcal/g.\n## Common ratio plans\n- Balanced (30/40/30): good for most people\'s daily maintenance.\n- Low carb (35/25/40): for those with lower insulin sensitivity or who prefer high-fat diets.\n- High protein (40/35/25): for strength training or fat loss while preserving muscle.\n- High carb (25/55/20): for endurance athletes and high-volume training.\n## A conversion example\nDaily target 2000 kcal at 30/40/30: protein 600 kcal divided by 4 = 150g; carb 800 kcal divided by 4 = 200g; fat 600 kcal divided by 9 is about 67g.\n## Execution tips\n- Hit protein first; it most affects satiety and muscle retention.\n- Fat should not stay below 20% of calories long term, or hormones suffer.\n- Ratios need not be exact daily; a weekly average is fine.\n- This tool is for reference; people with specific conditions should follow medical advice.',
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
  howto: ['Choose what you want to calculate.', 'Fill in the two values you know.', 'Click Calculate.', 'Check the race predictions table below the result.'],
  faq: [
    { q: 'What is a good pace?', a: 'It depends entirely on experience. Many recreational runners sit around 6:00–7:00 min/km for easy runs; the point is consistency, not comparison.' },
    { q: 'How are the race predictions made?', a: 'They apply your entered pace evenly across each distance. Real races slow down over longer distances, so treat longer predictions as optimistic.' }
  ],
  zhfaq: [
    { q: 'What counts as a good pace?', a: 'It depends entirely on your training level. Casual runners\' easy pace is often 6:00-7:00 per km; what matters is consistency, not comparing with others.' },
    { q: 'Is the finish-time prediction accurate?', a: 'It assumes the pace you entered held steady. Real races slow more over longer distances, so a full marathon prediction is usually optimistic; leave a margin.' }
  ],
  usecases: [
    { icon: '🏅', title: 'Race Goal', text: 'Find the pace needed for a target time.' },
    { icon: '📉', title: 'Training', text: 'Set easy and tempo run paces.' },
    { icon: '⏱️', title: 'Splits', text: 'Check per-kilometre targets.' }
  ],
  deep: '## What pace means\nPace is the time to run each kilometer, usually written as minutes:seconds per km. It is more intuitive than speed (km/h): seeing 5:30 tells you each km takes 5 minutes 30 seconds.\n## How the three relate\nPace = total time divided by distance; total time = pace times distance; distance = total time divided by pace. Knowing any two gives the third - that is the core logic of this tool.\n## Common race distances\nAt a 6:00 per km pace: 5 km about 30 minutes, 10 km about 1 hour, half marathon (21.0975km) about 2 hours 7 minutes, full marathon (42.195km) about 4 hours 13 minutes.\n## Pace zones in training\n- Easy run: can talk normally, 70%-80% of total training volume.\n- Tempo run: a bit hard but holdable for 20-40 minutes.\n- Interval run: near max, repeated in short bursts.\nAlways running fast is the most common amateur mistake and a major source of injury.\n## Reminder\nThis tool assumes a steady pace; actual results depend on terrain, weather, nutrition, and pacing. Use it with your own context.',
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
  howto: ['Choose whether you know your wake-up time or bedtime.', 'Set the time.', 'Click Calculate.', 'Pick one of the suggested times — later options mean more cycles.'],
  faq: [
    { q: 'Why 90 minutes?', a: 'A full sleep cycle averages around 90 minutes, moving through light, deep and REM sleep. Waking at the end of a cycle usually feels far less groggy than waking mid-cycle.' },
    { q: 'How many cycles do I need?', a: 'Most adults do well on 5–6 cycles, which is 7.5–9 hours. Four cycles (6 hours) works short-term but is not sustainable for most people.' }
  ],
  zhfaq: [
    { q: 'Why 90 minutes?', a: 'A full sleep cycle averages about 90 minutes, moving through light sleep, deep sleep, and REM. Waking at the end of a cycle is usually far fresher than being jolted awake during deep sleep.' },
    { q: 'How many cycles per night?', a: 'Most adults do well with 5-6 cycles (7.5-9 hours). Four cycles (6 hours) works short term but builds sleep debt over time.' }
  ],
  usecases: [
    { icon: '⏰', title: 'Early Meeting', text: 'Set a bedtime that avoids grogginess.' },
    { icon: '✈️', title: 'Jet Lag', text: 'Rebuild a sleep schedule.' },
    { icon: '📚', title: 'Study Nights', text: 'Choose the least damaging short sleep.' }
  ],
  deep: '## What is a sleep cycle\nHuman sleep is not uniform; it cycles through N1 light, N2, N3 deep, and REM rapid-eye-movement stages, with one full cycle averaging about 90 minutes. A night usually has 4-6 cycles.\n## Why waking at cycle end feels better\nIf the alarm rings during deep sleep (N3), the brain needs a long time to wake up; this grogginess, called sleep inertia, can last 15-30 minutes or more. Waking near the end of a cycle, close to light sleep, is far more natural.\n## How it is calculated\nThis tool steps 90 minutes forward or backward from your target time and adds about 15 minutes to fall asleep (the average time from lying down to sleeping for most people).\n## Practical tips for better sleep\n- A fixed schedule matters more than total hours.\n- Avoid bright light and screen blue light one hour before bed.\n- Caffeine has a half-life of about 5-6 hours; avoid it after noon.\n- Bedroom temperature of 18-22 C is usually best for falling asleep.\n## Reminder\n90 minutes is a population average; individual cycles range 70-110 minutes. This tool is for reference; for chronic insomnia or sleep apnea, see a doctor.',
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
  howto: ['Enter the price and quantity for each option.', 'Use the same unit across all options (g, ml, pieces…).', 'Click Compare.', 'The cheapest option is highlighted with the savings shown.'],
  faq: [
    { q: 'Is the bigger pack always cheaper?', a: 'No. Retail studies regularly find larger packs with a higher unit price, especially on promotion-heavy items. Always check the per-unit number.' },
    { q: 'What units should I use?', a: 'Anything, as long as all options use the same one. Comparing grams against kilograms will give a meaningless result.' }
  ],
  zhfaq: [
    { q: 'Is the big pack always cheaper?', a: 'Not necessarily. Retail surveys often find the large pack has a higher unit price, especially on promoted items. Make a habit of checking the unit price.' },
    { q: 'What unit do I enter?', a: 'Any unit works, but all options must use the same one. Mixing grams and kilograms gives completely wrong conclusions.' }
  ],
  usecases: [
    { icon: '🛍️', title: 'Grocery Run', text: 'Pick the genuinely cheaper pack.' },
    { icon: '🧴', title: 'Bulk Buying', text: 'Check if bulk really saves money.' },
    { icon: '📱', title: 'In Store', text: 'Compare on your phone at the shelf.' }
  ],
  deep: '## Why calculate unit price\nPackages vary wildly: 500g for 29.9 and 1.2kg for 68 - which is cheaper? Comparing total prices is meaningless; you must convert to a unit price under the same unit: the former is 0.0598 per g, the latter 0.0567 per g, so the larger pack wins slightly.\n## Common pricing traps\n- The bigger is cheaper mindset: sellers exploit this by setting a higher unit price on large packs.\n- Promo vs original: a discounted mid-size pack can beat the large pack.\n- Spec tweaks: packaging looks the same but content drops from 500g to 450g - shrinkflation.\n## How it is calculated\nUnit price = total price divided by quantity. This tool automatically finds the lowest unit price and shows how much you save versus the most expensive option.\n## Practical tips\n- Store shelf labels usually show a small-print unit price, but the unit may differ.\n- Short-shelf-life items in a big pack you can\'t finish end up more expensive.\n- Multiply unit price by what you actually consume to get the true cost.',
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
  howto: ['Enter your annual taxable income.', 'Adjust the deduction if applicable.', 'Choose or edit the bracket preset.', 'Click Calculate to see the band-by-band breakdown.'],
  faq: [
    { q: 'Does moving into a higher bracket tax all my income?', a: 'No — this is the most common misunderstanding. Only the portion above each threshold is taxed at the higher rate. Earning one unit more never reduces your take-home pay.' },
    { q: 'What is the effective tax rate?', a: 'Total tax divided by total income. It is always lower than your top marginal bracket, because the lower bands are taxed at lower rates.' }
  ],
  zhfaq: [
    { q: 'If I jump to a higher bracket, is all my income taxed at the higher rate?', a: 'No - that is the most common misunderstanding. Only the part above the threshold is taxed at the higher rate; earning one more unit can never reduce your take-home pay.' },
    { q: 'What is the effective tax rate?', a: 'Effective tax rate = total tax divided by total income. It is always below your top marginal rate because the lower brackets are taxed at lower rates.' }
  ],
  usecases: [
    { icon: '💼', title: 'Job Offer', text: 'Compare take-home across salaries.' },
    { icon: '📊', title: 'Tax Planning', text: 'See the marginal cost of extra income.' },
    { icon: '🎓', title: 'Learning', text: 'Understand how brackets actually work.' }
  ],
  deep: '## How progressive tax works\nA progressive tax slices income into brackets, each with its own rate; only the portion falling in a bracket is taxed at that bracket\'s rate. That is why earning one more unit can never leave you with less under a progressive system.\n## A concrete example\nAssume rates: 0-36000 at 3%, 36000-144000 at 10%, 144000-300000 at 20%. With annual taxable income of 200000:\n- first 36000 times 3% = 1080\n- middle 108000 times 10% = 10800\n- remaining 56000 times 20% = 11200\n- total 23080, effective rate 11.5%, not the top bracket\'s 20%.\n## Marginal vs effective rate\nThe marginal rate is the rate on your last unit of income (20% above); the effective rate is total tax divided by total income (11.5% above). Use marginal rate for raise or side-income decisions, effective rate to assess overall tax burden.\n## Usage note\nThis tool\'s default brackets are a generic example; you can edit them to match your region\'s actual table. The result is an estimate and excludes special deductions, social security, housing fund, and tax credits; it is not tax advice. Formal filing should follow tax authority rules or a professional.',
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
