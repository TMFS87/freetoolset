/* tools-b3-conv2.js — batch 3, extra converters (3 tools) */
const T = [];

/* linear converter factory (factor-to-base), shared pattern */
function linearConv(units, defFrom, defTo, defVal) {
  const opts = units.map(u => `<option value="${u[0]}">${u[1]}</option>`).join('');
  const body = `        <div class="form-row">
          <label for="val">Value</label>
          <input type="number" id="val" value="${defVal}" step="any">
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="from">From</label>
            <select id="from">${opts}</select>
          </div>
          <div class="form-row">
            <label for="to">To</label>
            <select id="to">${opts}</select>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="convBtn">Convert</button>
          <button class="btn btn-secondary" id="swapBtn">⇅ Swap</button>
        </div>
        <div id="out"></div>
        <div id="all" style="margin-top:18px"></div>`;
  const js = `    var U=${JSON.stringify(units)};
    var val=document.getElementById('val'),from=document.getElementById('from'),to=document.getElementById('to'),
        out=document.getElementById('out'),all=document.getElementById('all'),
        convBtn=document.getElementById('convBtn'),swapBtn=document.getElementById('swapBtn');
    from.value='${defFrom}';to.value='${defTo}';
    function f(k){for(var i=0;i<U.length;i++){if(U[i][0]===k)return U[i][2];}return 1;}
    function name(k){for(var i=0;i<U.length;i++){if(U[i][0]===k)return U[i][1];}return k;}
    function fmt(x){if(!isFinite(x))return '—';var a=Math.abs(x);if(a!==0&&(a<0.000001||a>=1e12))return x.toExponential(6);return parseFloat(x.toPrecision(10)).toLocaleString(undefined,{maximumFractionDigits:10});}
    function calc(){
      var v=parseFloat(val.value);
      if(isNaN(v)){out.className='result-box';out.textContent='Enter a number to convert.';all.innerHTML='';return;}
      var base=v*f(from.value),r=base/f(to.value);
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;word-break:break-all">'+fmt(r)+'</div>'+
        '<div style="opacity:.75;margin-top:4px">'+fmt(v)+' '+name(from.value)+' = '+fmt(r)+' '+name(to.value)+'</div>';
      all.innerHTML='<div style="font-size:.92rem;font-weight:600;margin-bottom:8px">All units</div>'+U.map(function(u){var x=base/u[2];return '<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.9rem"><span style="opacity:.85">'+u[1]+'</span><strong style="word-break:break-all;text-align:right">'+fmt(x)+'</strong></div>';}).join('');
    }
    swapBtn.addEventListener('click',function(){var t=from.value;from.value=to.value;to.value=t;calc();});
    [val,from,to].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});
    convBtn.addEventListener('click',calc);calc();`;
  return { body, js };
}

/* data-transfer-rate */
(function () {
  const units = [
    ['bps', 'bit/s', 1],
    ['kbps', 'kbit/s', 1e3],
    ['Mbps', 'Mbit/s', 1e6],
    ['Gbps', 'Gbit/s', 1e9],
    ['Bps', 'Byte/s', 8],
    ['KBps', 'KB/s', 8e3],
    ['MBps', 'MB/s', 8e6],
    ['GBps', 'GB/s', 8e9]
  ];
  const c = linearConv(units, 'Mbps', 'MBps', 100);
  T.push({
    slug: 'data-transfer-rate-converter', icon: '📶', title: 'Data Transfer Rate Converter', tagline: 'bps, kbps, Mbps, Gbps, KB/s, MB/s',
    category: 'converter',
    desc: 'Convert network and data-transfer speeds between bit-based (bps, Mbps, Gbps) and byte-based (KB/s, MB/s, GB/s) units.',
    cardDesc: 'Convert bandwidth and download speeds across bit and byte units.',
    keywords: 'data transfer rate converter, bandwidth converter, mbps to mb/s, gbps converter, internet speed',
    searchTerms: 'data transfer rate bandwidth mbps mb/s gbps converter',
    howto: ['Enter the speed value.', 'Pick the source unit (e.g. Mbps).', 'Pick the target unit (e.g. MB/s).', 'Read the result and the full unit table.'],
    faq: [
      { q: 'Why is 100 Mbps only ~12.5 MB/s?', a: 'ISPs quote bits per second (Mbps) while download managers show bytes per second (MB/s). Since 1 byte = 8 bits, divide the Mbps number by 8 to get MB/s.' },
      { q: 'Does this use 1000 or 1024?', a: 'Network speeds use decimal (1000) factors: 1 Mbps = 1,000,000 bit/s. Storage tools sometimes use 1024, but transfer rates follow the decimal convention.' },
      { q: 'What is a good home internet speed?', a: 'Roughly 25+ Mbps supports HD streaming; 100+ Mbps is comfortable for multiple 4K streams and video calls simultaneously.' }
    ],
    zhfaq: [
    { q: 'Why is 100 Mbps only about 12.5 MB/s?', a: 'ISPs advertise bits per second (Mbps), while download tools show bytes per second (MB/s). 1 byte = 8 bits, so divide Mbps by 8 to get MB/s.' },
    { q: 'Should I use 1000 or 1024 here?', a: 'Network rates use decimal (1000): 1 Mbps = 1,000,000 bit/s. Storage units sometimes use 1024, but transfer rates are decimal.' }
  ],
    usecases: [
      { icon: '🌐', title: 'ISP plans', text: 'Compare Mbps offers.' },
      { icon: '⬇️', title: 'Downloads', text: 'Convert to MB/s.' },
      { icon: '🔌', title: 'Interfaces', text: 'USB/Ethernet rates.' }
    ],
    deep: '## Bit vs byte\nNetwork bandwidth is almost always given in bits per second (bit/s, bps), while file sizes use bytes (Byte, B), where 1 byte = 8 bits. So a 100 Mbps connection has a theoretical max download speed of about 12.5 MB/s.\n## Decimal conversion\nTransfer rates follow the decimal system: 1 kbps = 1,000 bit/s, 1 Mbps = 1,000,000 bit/s, 1 Gbps = 10 to the 9th bit/s.\n## Common references\n- 4G peak: about 100 Mbps\n- Gigabit broadband: 1000 Mbps = 1 Gbps is about 125 MB/s\n- Wi-Fi 6: theoretical 9.6 Gbps\n## Notes\n- Actual speed is lower than theoretical due to line quality, congestion, and protocol overhead.\n- Results are for reference only.',
    body: c.body, js: c.js
  });
})();

/* torque */
(function () {
  const units = [
    ['Nm', 'N·m', 1],
    ['lbf-ft', 'lbf·ft', 1.3558179483314004],
    ['kgf-m', 'kgf·m', 9.80665],
    ['Ncm', 'N·cm', 0.01]
  ];
  const c = linearConv(units, 'Nm', 'lbf-ft', 100);
  T.push({
    slug: 'torque-converter', icon: '🔧', title: 'Torque Converter', tagline: 'N·m, lbf·ft, kgf·m, N·cm',
    category: 'converter',
    desc: 'Convert torque and moment units between newton-metres, pound-force feet, kilogram-force metres and newton-centimetres.',
    cardDesc: 'Convert torque between N·m, lbf·ft, kgf·m and N·cm.',
    keywords: 'torque converter, nm to lb ft, newton meter, pound force foot, kgf m',
    searchTerms: 'torque converter nm lbf ft kgf m newton meter',
    howto: ['Enter the torque value.', 'Choose the source unit.', 'Choose the target unit.', 'Read the converted value and the full table.'],
    faq: [
      { q: 'What is the difference between torque and power?', a: 'Torque is rotational force (N·m); power is how fast that force does work (kW or hp). Power = torque × angular speed.' },
      { q: 'Is N·m the same as kgf·m?', a: 'No. 1 kgf·m ≈ 9.81 N·m because it uses the force of 1 kg under gravity. They are close but not equal.' },
      { q: 'When do I use lbf·ft?', a: 'US automotive and engineering specs commonly quote engine and fastener torque in pound-force feet.' }
    ],
    zhfaq: [
    { q: 'What is the difference between torque and power?', a: 'Torque is rotational force (N m), power is how fast work is done (kW or hp). Power = torque times angular velocity.' },
    { q: 'Are N m and kgf m the same?', a: 'No. 1 kgf m is about 9.81 N m (by 1 kg of gravity), so the numbers are close but not equal.' }
  ],
    usecases: [
      { icon: '🚗', title: 'Engine specs', text: 'Compare N·m to lbf·ft.' },
      { icon: '🔩', title: 'Bolt torque', text: 'Match workshop manuals.' },
      { icon: '🚲', title: 'Bike fit', text: 'Crank torque checks.' }
    ],
    deep: '## What is torque\nTorque (moment of force) measures the rotational effect of force times lever arm, with the international unit newton-meter (N m).\n## Common units\n- N m: international standard.\n- lbf ft: imperial, common in US automotive and machinery.\n- kgf m: kilogram-force meter, old system, 1 kgf m is about 9.80665 N m.\n- N cm: small torque, 1 N m = 100 N cm.\n## Conversion note\nAll units are linearly converted to N m first, then to the target unit.\n## Note\n- Results are for reference only; for engineering use the design specification.',
    body: c.body, js: c.js
  });
})();

/* fuel-economy — inverse (L/100km) handling */
(function () {
  const body = `        <div class="form-row">
          <label for="val">Value</label>
          <input type="number" id="val" value="8" step="any">
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="from">From</label>
            <select id="from">
              <option value="mpg_us">MPG (US)</option>
              <option value="mpg_uk">MPG (UK)</option>
              <option value="km_l">km/L</option>
              <option value="l_100km">L/100km</option>
            </select>
          </div>
          <div class="form-row">
            <label for="to">To</label>
            <select id="to">
              <option value="mpg_us">MPG (US)</option>
              <option value="mpg_uk">MPG (UK)</option>
              <option value="km_l">km/L</option>
              <option value="l_100km" selected>L/100km</option>
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="convBtn">Convert</button>
          <button class="btn btn-secondary" id="swapBtn">⇅ Swap</button>
        </div>
        <div id="out"></div>
        <div id="all" style="margin-top:18px"></div>`;
  const js = `    var val=document.getElementById('val'),from=document.getElementById('from'),to=document.getElementById('to'),
        out=document.getElementById('out'),all=document.getElementById('all'),
        convBtn=document.getElementById('convBtn'),swapBtn=document.getElementById('swapBtn');
    from.value='km_l';to.value='l_100km';
    function toKmPL(v,k){if(k==='km_l')return v;if(k==='mpg_us')return v/2.352145833;if(k==='mpg_uk')return v/2.824809363;if(k==='l_100km')return v>0?100/v:0;return v;}
    function fromKmPL(kmpl,k){if(k==='km_l')return kmpl;if(k==='mpg_us')return kmpl*2.352145833;if(k==='mpg_uk')return kmpl*2.824809363;if(k==='l_100km')return kmpl>0?100/kmpl:0;return kmpl;}
    function nm(k){return k==='mpg_us'?'MPG (US)':k==='mpg_uk'?'MPG (UK)':k==='km_l'?'km/L':'L/100km';}
    function fmt(x){if(!isFinite(x)||x===0)return '—';var a=Math.abs(x);if(a<0.000001||a>=1e12)return x.toExponential(6);return parseFloat(x.toPrecision(10)).toLocaleString(undefined,{maximumFractionDigits:10});}
    function calc(){
      var v=parseFloat(val.value);
      if(isNaN(v)||v<=0){out.className='result-box';out.textContent='Enter a positive number to convert.';all.innerHTML='';return;}
      var kmpl=toKmPL(v,from.value),r=fromKmPL(kmpl,to.value);
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;word-break:break-all">'+fmt(r)+'</div>'+
        '<div style="opacity:.75;margin-top:4px">'+fmt(v)+' '+nm(from.value)+' = '+fmt(r)+' '+nm(to.value)+'</div>';
      var keys=['mpg_us','mpg_uk','km_l','l_100km'];
      all.innerHTML='<div style="font-size:.92rem;font-weight:600;margin-bottom:8px">All units</div>'+keys.map(function(k){var x=fromKmPL(kmpl,k);return '<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.9rem"><span style="opacity:.85">'+nm(k)+'</span><strong style="word-break:break-all;text-align:right">'+(x>0?fmt(x):'—')+'</strong></div>';}).join('');
    }
    swapBtn.addEventListener('click',function(){var t=from.value;from.value=to.value;to.value=t;calc();});
    [val,from,to].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});
    convBtn.addEventListener('click',calc);calc();`;
  T.push({
    slug: 'fuel-economy-converter', icon: '⛽', title: 'Fuel Economy Converter', tagline: 'MPG, km/L, L/100km',
    category: 'converter',
    desc: 'Convert fuel economy between MPG (US & UK), km/L and L/100km — useful when comparing cars across regions.',
    cardDesc: 'Convert fuel economy between MPG, km/L and L/100km.',
    keywords: 'fuel economy converter, mpg to l/100km, km/l converter, gas mileage, fuel efficiency',
    searchTerms: 'fuel economy mpg km/l l 100km converter mileage',
    howto: ['Enter the fuel economy value.', 'Pick the source unit (MPG US/UK, km/L, L/100km).', 'Pick the target unit.', 'Read the result and the full comparison table.'],
    faq: [
      { q: 'MPG US vs MPG UK — why different?', a: 'A US gallon is ~3.785 L while a UK (imperial) gallon is ~4.546 L, so the same car shows a higher number in UK MPG. Always note which one.' },
      { q: 'Why is L/100km the inverse of MPG?', a: 'MPG says distance per volume (more = better) while L/100km says volume per distance (less = better). They are reciprocals, so converting is not a simple factor.' },
      { q: 'Which is better for comparing cars?', a: 'Either works as long as you keep the unit consistent. L/100km is linear and easier to subtract differences; MPG is intuitive for "how far on a tank".' }
    ],
    zhfaq: [
    { q: 'Why do US MPG and UK MPG differ?', a: 'The US gallon is about 3.785 L while the imperial gallon is about 4.546 L, so the same car shows a larger number in imperial MPG. Always check which one it is.' },
    { q: 'Why are L/100km and MPG inverse?', a: 'MPG is distance per volume (higher is thriftier), while L/100km is volume per distance (lower is thriftier); the two are reciprocals, not a simple multiple.' }
  ],
    usecases: [
      { icon: '🚗', title: 'Import cars', text: 'Compare US vs EU ratings.' },
      { icon: '📊', title: 'Trip budget', text: 'Estimate fuel cost.' },
      { icon: '🌍', title: 'Spec sheets', text: 'Normalise units.' }
    ],
    deep: '## Two ways of thinking\nMPG (miles per gallon) is volume to distance, where a larger number means better economy; L/100km is distance to volume, where a smaller number means better economy. The two are reciprocal.\n## Conversion factors\n- 1 km/L = 2.352 MPG(US) = 2.825 MPG(UK)\n- 1 L/100km = 100 / (km/L)\n- 1 MPG(US) is about 0.425 km/L\n## US vs imperial gallon\nThe US gallon is 3.785 L, the imperial gallon is 4.546 L, so imperial MPG shows a larger number.\n## Notes\n- Real fuel use varies a lot with driving habits, road conditions, and air conditioning.\n- Results are for reference only.',
    body: body, js: js
  });
})();

module.exports = T;
