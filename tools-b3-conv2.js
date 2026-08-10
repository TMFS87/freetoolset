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
    zh: '数据传输速率转换器在比特单位（bps、Mbps、Gbps）和字节单位（KB/s、MB/s、GB/s）之间换算。注意 1 字节 = 8 比特，所以 100 Mbps 约等于 12.5 MB/s。常用来核对宽带、下载和接口速度。',
    howto: ['Enter the speed value.', 'Pick the source unit (e.g. Mbps).', 'Pick the target unit (e.g. MB/s).', 'Read the result and the full unit table.'],
    faq: [
      { q: 'Why is 100 Mbps only ~12.5 MB/s?', a: 'ISPs quote bits per second (Mbps) while download managers show bytes per second (MB/s). Since 1 byte = 8 bits, divide the Mbps number by 8 to get MB/s.' },
      { q: 'Does this use 1000 or 1024?', a: 'Network speeds use decimal (1000) factors: 1 Mbps = 1,000,000 bit/s. Storage tools sometimes use 1024, but transfer rates follow the decimal convention.' },
      { q: 'What is a good home internet speed?', a: 'Roughly 25+ Mbps supports HD streaming; 100+ Mbps is comfortable for multiple 4K streams and video calls simultaneously.' }
    ],
    zhfaq: [
      { q: '为什么 100 Mbps 只有约 12.5 MB/s？', a: '运营商标的是“比特/秒”（Mbps），而下载工具显示“字节/秒”（MB/s）。1 字节 = 8 比特，所以把 Mbps 除以 8 才是 MB/s。' },
      { q: '这里用 1000 还是 1024？', a: '网络速率采用十进制（1000）：1 Mbps = 1,000,000 bit/s。存储单位有时用 1024，但传输速率按十进制。' }
    ],
    usecases: [
      { icon: '🌐', title: 'ISP plans', text: 'Compare Mbps offers.' },
      { icon: '⬇️', title: 'Downloads', text: 'Convert to MB/s.' },
      { icon: '🔌', title: 'Interfaces', text: 'USB/Ethernet rates.' }
    ],
    deep: '## 比特 vs 字节\n网络带宽几乎都用“比特每秒”（bit/s, bps）表示，而文件大小用“字节”（Byte, B），1 字节 = 8 比特。因此 100 Mbps 的宽带，理论最大下载速度约 12.5 MB/s。\n## 十进制换算\n传输速率遵循十进制：1 kbps = 1,000 bit/s，1 Mbps = 1,000,000 bit/s，1 Gbps = 10^9 bit/s。\n## 常见参考\n- 4G 峰值：约 100 Mbps\n- 千兆宽带：1000 Mbps = 1 Gbps ≈ 125 MB/s\n- Wi-Fi 6：理论 9.6 Gbps\n## 注意\n- 实际速度受线路、拥塞、协议开销影响，低于理论值\n- 结果仅供参考',
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
    zh: '扭矩（力矩）转换器在牛·米（N·m）、磅力·英尺（lbf·ft）、千克力·米（kgf·m）和牛·厘米（N·cm）之间换算。汽车发动机扭矩、自行车力矩、机械设计里经常用到，单位不统一时很容易算错。',
    howto: ['Enter the torque value.', 'Choose the source unit.', 'Choose the target unit.', 'Read the converted value and the full table.'],
    faq: [
      { q: 'What is the difference between torque and power?', a: 'Torque is rotational force (N·m); power is how fast that force does work (kW or hp). Power = torque × angular speed.' },
      { q: 'Is N·m the same as kgf·m?', a: 'No. 1 kgf·m ≈ 9.81 N·m because it uses the force of 1 kg under gravity. They are close but not equal.' },
      { q: 'When do I use lbf·ft?', a: 'US automotive and engineering specs commonly quote engine and fastener torque in pound-force feet.' }
    ],
    zhfaq: [
      { q: '扭矩和功率有什么区别？', a: '扭矩是旋转力（N·m），功率是做功快慢（kW 或 hp）。功率 = 扭矩 × 角速度。' },
      { q: 'N·m 和 kgf·m 一样吗？', a: '不一样。1 kgf·m ≈ 9.81 N·m（按 1 千克重力估算），数值接近但不相等。' }
    ],
    usecases: [
      { icon: '🚗', title: 'Engine specs', text: 'Compare N·m to lbf·ft.' },
      { icon: '🔩', title: 'Bolt torque', text: 'Match workshop manuals.' },
      { icon: '🚲', title: 'Bike fit', text: 'Crank torque checks.' }
    ],
    deep: '## 什么是扭矩\n扭矩（力矩）衡量使物体绕轴旋转的“力的大小 × 力臂长度”，国际单位是牛·米（N·m）。\n## 常用单位\n- N·m：国际标准\n- lbf·ft：英制，美国汽车/机械常用\n- kgf·m：千克力·米，旧制，1 kgf·m ≈ 9.80665 N·m\n- N·cm：小力矩，1 N·m = 100 N·cm\n## 换算要点\n所有单位都线性换算到 N·m 再转目标单位。\n## 注意\n- 结果仅供参考，工程计算请以设计规范为准',
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
    zh: '油耗转换器在 MPG（美制/英制）、km/L 和 L/100km 之间换算。美国用 MPG（越高越省），欧洲和中国常用 L/100km（越低越省），两者互为倒数关系，比较进口车参数时很容易搞混。',
    howto: ['Enter the fuel economy value.', 'Pick the source unit (MPG US/UK, km/L, L/100km).', 'Pick the target unit.', 'Read the result and the full comparison table.'],
    faq: [
      { q: 'MPG US vs MPG UK — why different?', a: 'A US gallon is ~3.785 L while a UK (imperial) gallon is ~4.546 L, so the same car shows a higher number in UK MPG. Always note which one.' },
      { q: 'Why is L/100km the inverse of MPG?', a: 'MPG says distance per volume (more = better) while L/100km says volume per distance (less = better). They are reciprocals, so converting is not a simple factor.' },
      { q: 'Which is better for comparing cars?', a: 'Either works as long as you keep the unit consistent. L/100km is linear and easier to subtract differences; MPG is intuitive for "how far on a tank".' }
    ],
    zhfaq: [
      { q: '美制 MPG 和英制 MPG 为什么不同？', a: '美制加仑约 3.785 升，英制加仑约 4.546 升，所以同一辆车英制 MPG 数字更大。一定要看清楚是哪种。' },
      { q: 'L/100km 和 MPG 为什么是倒数关系？', a: 'MPG 是“每单位体积跑多远”（越大越省），L/100km 是“每单位距离耗多少油”（越小越省），二者互为倒数，不是简单倍率。' }
    ],
    usecases: [
      { icon: '🚗', title: 'Import cars', text: 'Compare US vs EU ratings.' },
      { icon: '📊', title: 'Trip budget', text: 'Estimate fuel cost.' },
      { icon: '🌍', title: 'Spec sheets', text: 'Normalise units.' }
    ],
    deep: '## 两种思维\nMPG（每加仑英里）是“体积→距离”，数字越大越省油；L/100km 是“距离→体积”，数字越小越省油。二者互为倒数关系。\n## 换算系数\n- 1 km/L = 2.352 MPG(US) = 2.825 MPG(UK)\n- 1 L/100km = 100 / (km/L)\n- 1 MPG(US) ≈ 0.425 km/L\n## 美制 vs 英制加仑\n美国加仑 = 3.785 L，英国加仑 = 4.546 L，所以英制 MPG 数值更大。\n## 注意\n- 实际油耗受驾驶习惯、路况、空调影响很大\n- 结果仅供参考',
    body: body, js: js
  });
})();

module.exports = T;
