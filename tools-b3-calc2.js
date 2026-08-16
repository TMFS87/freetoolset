/* tools-b3-calc2.js — batch 3, extra calculators (4 tools) */
const T = [];

T.push({
  slug: 'heart-rate-zone-calculator', icon: '❤️', title: 'Heart Rate Zone Calculator', tagline: 'Training Zones from Max & Resting Heart Rate',
  category: 'calculator', popular: 'Popular',
  desc: 'Estimate your heart-rate training zones using the Karvonen formula, based on your max and resting heart rate. Perfect for runners, cyclists and HIIT training.',
  cardDesc: 'Find your five heart-rate training zones for effective cardio workouts.',
  keywords: 'heart rate zone calculator, karvonen formula, target heart rate, training zones, max heart rate',
  searchTerms: 'heart rate zone karvonen target training max resting',
  howto: ['Enter your age (used to estimate max heart rate).', 'Measure and enter your resting heart rate (morning, before getting up works best).', 'Click Calculate to see all five zones.', 'Use the zone ranges to guide your workout intensity.'],
  faq: [
    { q: 'What is the Karvonen formula?', a: 'Target HR = ((Max HR − Resting HR) × intensity%) + Resting HR. It personalises training zones using your resting heart rate, which the simpler 220−age method ignores.' },
    { q: 'How do I find my resting heart rate?', a: 'Take your pulse first thing in the morning, still lying down, for 30–60 seconds. A typical adult resting rate is 60–80 bpm.' },
    { q: 'Which zone should I train in?', a: 'Zone 2 (60–70%) builds aerobic base and burns fat; Zone 4–5 (80–90%+) improves speed and VO2 max but cannot be sustained long. Most people mix zones across the week.' }
  ],
  zhfaq: [
    { q: 'How does the Karvonen formula differ from 220 − age?', a: 'The 220 − age method only estimates max heart rate and ignores each person’s resting heart rate. The Karvonen formula incorporates resting HR, giving target zones that better match your personal fitness.' },
    { q: 'Which zone should I train in to burn fat?', a: 'Zone 2 (about 60%–70% intensity) is best for fat-burning and building an aerobic base; Zones 4–5 are high-intensity and hard to sustain, mainly improving speed and VO2 max.' }
  ],
  usecases: [
    { icon: '🏃', title: 'Fat-burn runs', text: 'Hold Zone 2 for steady-state cardio.' },
    { icon: '🚴', title: 'Interval training', text: 'Push into Zone 4–5 for reps.' },
    { icon: '💓', title: 'Recovery', text: 'Keep easy days below Zone 2.' }
  ],
  deep: '## Why use heart-rate zones\nTraining by feel alone makes it easy to train too lightly or too hard. Heart-rate zones quantify intensity into five bands so you know exactly what each session is training.\n## The Karvonen formula\nTarget HR = (Max HR − Resting HR) × intensity% + Resting HR. Max HR is commonly estimated as 220 − age (a more precise option is 208 − 0.7 × age).\n## The five zones\n- Zone 1 (50%–60%): warm-up, recovery\n- Zone 2 (60%–70%): fat-burn, aerobic base\n- Zone 3 (70%–80%): aerobic endurance\n- Zone 4 (80%–90%): anaerobic threshold, speed\n- Zone 5 (90%–100%): sprint, max output\n## Cautions\n- The formula gives estimates; medication, caffeine and sleep all affect actual heart rate\n- A chest strap or watch is more accurate than a phone\n- For reference only; consult a professional before starting a new program',
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
  howto: ['Enter the current balance you owe.', 'Enter the annual interest rate (APR).', 'Enter how much you can pay each month.', 'Click Calculate to see months to payoff and total interest.'],
  faq: [
    { q: 'Why does paying extra matter so much?', a: 'Extra payments reduce the principal faster, which means less interest accrues every month. On a long loan even small extra payments can cut months off the term.' },
    { q: 'Does this handle credit cards?', a: 'Yes — treat the balance as your card debt and the APR as the card rate. Just know card minimum payments are often calculated differently by the issuer.' },
    { q: 'What if my payment is too low?', a: 'If the monthly payment does not cover the monthly interest, the balance grows and the debt is never paid off. The calculator will warn you.' }
  ],
  zhfaq: [
    { q: 'Does paying a little extra really help?', a: 'Greatly. Extra payments reduce the principal directly, so next month’s interest is calculated on a smaller balance — saving meaningful interest and shortening the term over time.' },
    { q: 'What if my payment is lower than the monthly interest?', a: 'The balance will not shrink — it will grow, and the debt is never paid off. This tool warns you in that case.' }
  ],
  usecases: [
    { icon: '💳', title: 'Credit cards', text: 'Plan how to clear balances fast.' },
    { icon: '🎓', title: 'Student loans', text: 'Compare standard vs accelerated.' },
    { icon: '🚗', title: 'Car loans', text: 'See interest saved by overpaying.' }
  ],
  deep: '## How debt accrues interest\nA loan charges interest each month on the remaining principal. Your payment first covers interest; only the remainder reduces principal, so early payments are mostly interest.\n## The calculation\nMonthly rate r = APR/12. Monthly interest = remaining principal × r; principal reduction = payment − monthly interest. Repeat monthly until the balance hits zero — the month count is your payoff time.\n## The power of prepayment\nEvery extra payment lowers the principal faster, so subsequent interest shrinks too. This is especially noticeable on high-rate consumer loans and credit cards.\n## Notes\n- Assumes fixed monthly payments and a fixed rate\n- Some loans charge prepayment penalties, reducing real savings\n- For reference only, not financial advice',
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
  howto: ['Enter your current age and planned retirement age.', 'Enter current savings and monthly contribution.', 'Enter expected annual return (e.g. 6%).', 'Click Calculate to see the projected balance.'],
  faq: [
    { q: 'What return rate should I use?', a: 'Historical stock/bond portfolios often average 5–8% after inflation over long periods, but returns vary year to year. Use a conservative number like 5–6% for planning.' },
    { q: 'Does this include inflation?', a: 'No — the result is in today’s nominal dollars of growth. For purchasing power you can subtract ~2–3% annual inflation mentally, or use a lower real return.' },
    { q: 'Is this a 401(k) or IRA calculator?', a: 'It models any tax-advantaged or taxable account the same way via compound growth; it does not model contribution limits or taxes.' }
  ],
  zhfaq: [
    { q: 'What annual return should I use?', a: 'Long-term stock/bond portfolios have historically averaged around 5%–8% real return, but returns vary year to year. For planning, a conservative 5%–6% is safer.' },
    { q: 'Is the result in today’s dollars or future dollars?', a: 'This tool shows nominal growth, not inflation-adjusted. To estimate purchasing power, mentally subtract about 2%–3% annual inflation, or use a lower real return.' }
  ],
  usecases: [
    { icon: '📈', title: 'Goal check', text: 'See if you are on track.' },
    { icon: '💰', title: 'Boost savings', text: 'Test higher contributions.' },
    { icon: '🗓️', title: 'Retire early?', text: 'Model an earlier date.' }
  ],
  deep: '## Compound growth is the core of retirement saving\nYour money earns returns each year, and those returns earn returns — the longer the horizon, the stronger the snowball.\n## The formula\nFuture value FV = current savings × (1+r)^n + monthly contribution × [((1+r/12)^(12n) − 1) / (r/12)], where r is the annual return and n is years.\n## The advantage of starting early\nStarting at 25 vs 35, even with the same monthly amount, the final gap can be several times larger because early contributions enjoy far more compounding time.\n## Notes\n- Results are estimates; real market returns are unpredictable\n- Taxes, inflation and withdrawal rules are not modelled\n- For reference only; consult a licensed adviser for major decisions',
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
  howto: ['Enter the vehicle price (MSRP or negotiated price).', 'Enter down payment and the residual value at lease end.', 'Enter term in months and the money factor (or APR).', 'Click Calculate to see the monthly payment.'],
  faq: [
    { q: 'What is residual value?', a: 'The estimated worth of the car at the end of the lease, set by the leasing company. A higher residual lowers your monthly payment because you only finance the depreciation.' },
    { q: 'Money factor vs APR — what is the link?', a: 'Money factor × 2400 ≈ equivalent APR. If a dealer quotes APR on a lease, divide by 2400 to get the money factor.' },
    { q: 'Why is my lease payment split into two parts?', a: 'Part 1 covers depreciation (price − residual over the term); part 2 is the finance/rent charge on the average capitalized cost.' }
  ],
  zhfaq: [
    { q: 'What is residual value?', a: 'The leasing company’s estimate of the car’s worth at the end of the lease. A higher residual means less depreciation to amortise, so your monthly payment is lower.' },
    { q: 'How do I convert money factor to APR?', a: 'Money factor × 2400 ≈ the equivalent APR. If a dealer quotes APR on a lease, divide by 2400 to get the money factor.' }
  ],
  usecases: [
    { icon: '🚗', title: 'New car shop', text: 'Compare lease vs buy.' },
    { icon: '📊', title: 'Budget', text: 'Know the monthly hit.' },
    { icon: '🤝', title: 'Negotiate', text: 'Spot a bad money factor.' }
  ],
  deep: '## What makes up a lease payment\nA lease payment is the sum of two parts: depreciation + rent charge.\n## Depreciation fee\n(Net capitalized cost − residual value) ÷ lease term in months. Net capitalized cost = vehicle price − down payment (and other reductions).\n## Rent charge\n(Net capitalized cost + residual value) × money factor. Money factor = APR ÷ 2400.\n## Example\nPrice 30,000, down 3,000, residual 18,000, term 36 months, money factor 0.0025:\ndepreciation = (27,000 − 18,000)/36 = 250; rent = (27,000 + 18,000) × 0.0025 = 112.5; payment ≈ 362.5.\n## Notes\n- Real leases also include tax, fees, mileage limits and over-mileage charges\n- Taxes vary widely by state/region\n- For reference only',
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
