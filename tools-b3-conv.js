/* tools-b3-conv.js — batch 3, converter category (9 tools) */
const T = [];

/* Shared builder for linear unit converters (factor-to-base model).
 * Keeps the interactive code consistent and correct across tools while every
 * tool still ships its own unique copy, FAQ and long-form content. */
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
    function fmt(x){
      if(!isFinite(x))return '—';
      var a=Math.abs(x);
      if(a!==0&&(a<0.000001||a>=1e12))return x.toExponential(6);
      return parseFloat(x.toPrecision(10)).toLocaleString(undefined,{maximumFractionDigits:10});
    }
    function calc(){
      var v=parseFloat(val.value);
      if(isNaN(v)){out.className='result-box';out.textContent='Enter a number to convert.';all.innerHTML='';return;}
      var base=v*f(from.value);
      var r=base/f(to.value);
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.7rem;font-weight:700;word-break:break-all">'+fmt(r)+'</div>'+
        '<div style="opacity:.75;margin-top:4px">'+fmt(v)+' '+name(from.value)+' = '+fmt(r)+' '+name(to.value)+'</div>';
      all.innerHTML='<div style="font-size:.92rem;font-weight:600;margin-bottom:8px">All units</div>'+
        U.map(function(u){
          var x=base/u[2];
          return '<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.9rem">'+
            '<span style="opacity:.85">'+u[1]+'</span><strong style="word-break:break-all;text-align:right">'+fmt(x)+'</strong></div>';
        }).join('');
    }
    swapBtn.addEventListener('click',function(){var t=from.value;from.value=to.value;to.value=t;calc();});
    [val,from,to].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});
    convBtn.addEventListener('click',calc);calc();`;
  return { body, js };
}

/* ---------- 1. Pressure ---------- */
T.push(Object.assign({
  slug: 'pressure-converter', icon: '🌡️', title: 'Pressure Converter', tagline: 'Pa, bar, psi, atm, mmHg & More',
  category: 'converter',
  desc: 'Convert between pascal, kilopascal, bar, psi, atmosphere, torr, mmHg and other pressure units instantly, with all units shown side by side.',
  cardDesc: 'Convert pascal, bar, psi, atm and other pressure units.',
  keywords: 'pressure converter, psi to bar, kpa to psi, bar to pascal, atm converter, mmhg converter',
  searchTerms: 'pressure psi bar pascal kpa atm mmhg torr convert',
  zh: '压力单位换算器支持帕斯卡、千帕、兆帕、巴、磅每平方英寸（psi）、标准大气压、托、毫米汞柱等常用压力单位互转，输入一个数值即可同时看到全部单位的对应值。',
  howto: ['Type the value you want to convert.', 'Pick the source and target units.', 'The result updates as you type.', 'Scroll down to see the value in every supported unit.'],
  faq: [
    { q: 'How many psi is 1 bar?', a: '1 bar equals 14.5038 psi. Car tyre pressures are often quoted in both, which is why 2.2 bar and 32 psi appear interchangeably.' },
    { q: 'What is standard atmospheric pressure?', a: '1 atm = 101,325 Pa = 1.01325 bar = 14.6959 psi = 760 mmHg. It is the average air pressure at sea level.' }
  ],
  zhfaq: [
    { q: '1 巴等于多少 psi？', a: '1 bar = 14.5038 psi。汽车胎压常见 2.2 bar 或 32 psi，说的其实是差不多的压力。' },
    { q: '标准大气压是多少？', a: '1 标准大气压 = 101325 帕 = 1.01325 巴 = 14.6959 psi = 760 毫米汞柱，即海平面的平均气压。' }
  ],
  usecases: [
    { icon: '🚗', title: 'Tyre Pressure', text: 'Convert bar to psi at the air pump.' },
    { icon: '🔧', title: 'Engineering', text: 'Switch between kPa and MPa in specs.' },
    { icon: '🩺', title: 'Medical', text: 'Read blood pressure in mmHg or kPa.' }
  ],
  deep: '## 压力单位为什么这么多\n压力的国际单位是帕斯卡（Pa），定义为每平方米一牛顿的力。但由于帕斯卡数值太小，工程、医疗、气象等领域各自发展出了更顺手的单位，于是形成了今天并存的局面。\n## 常用单位对照\n- 1 bar = 100,000 Pa = 100 kPa\n- 1 psi = 6,894.76 Pa\n- 1 atm = 101,325 Pa = 760 mmHg\n- 1 MPa = 1,000,000 Pa（常见于液压系统）\n## 各领域的使用习惯\n- **汽车胎压**：欧洲用 bar，美国用 psi，中国两者混用\n- **医疗血压**：全球通用 mmHg（毫米汞柱），如 120/80\n- **气象气压**：用百帕（hPa），标准海平面为 1013.25 hPa\n- **液压工程**：多用 MPa\n## 一个换算例子\n轮胎标注 2.4 bar，换算成 psi：2.4 × 14.5038 ≈ 34.8 psi。所以充到 35 psi 基本符合要求。',
  usecasesNote: ''
}, linearConv([
  ['pa', 'Pascal (Pa)', 1],
  ['kpa', 'Kilopascal (kPa)', 1000],
  ['mpa', 'Megapascal (MPa)', 1000000],
  ['hpa', 'Hectopascal (hPa)', 100],
  ['bar', 'Bar', 100000],
  ['mbar', 'Millibar (mbar)', 100],
  ['psi', 'Pounds per sq inch (psi)', 6894.757293],
  ['atm', 'Standard atmosphere (atm)', 101325],
  ['torr', 'Torr', 133.3223684],
  ['mmhg', 'Millimetre of mercury (mmHg)', 133.322387415],
  ['inhg', 'Inch of mercury (inHg)', 3386.389],
  ['mmh2o', 'Millimetre of water (mmH₂O)', 9.80665]
], 'bar', 'psi', 2.4)));

/* ---------- 2. Energy ---------- */
T.push(Object.assign({
  slug: 'energy-converter', icon: '⚡', title: 'Energy Converter', tagline: 'Joule, Calorie, kWh, BTU & More',
  category: 'converter',
  desc: 'Convert energy units including joule, kilojoule, calorie, kilocalorie, watt-hour, kilowatt-hour, BTU and electronvolt.',
  cardDesc: 'Convert joules, calories, kWh, BTU and more.',
  keywords: 'energy converter, joules to calories, kwh to joules, btu converter, kj to kcal, energy unit conversion',
  searchTerms: 'energy joule calorie kwh btu kj kcal convert',
  zh: '能量单位换算器支持焦耳、千焦、卡路里、千卡、瓦时、千瓦时、英热单位（BTU）、电子伏特等单位互转，食品热量、电费用电量、暖通制冷都用得上。',
  howto: ['Enter the energy value.', 'Choose source and target units.', 'Read the converted result instantly.', 'Check the full list below for all units at once.'],
  faq: [
    { q: 'Is a food calorie the same as a calorie?', a: 'No. The "calorie" on nutrition labels is actually a kilocalorie (kcal) — 1000 small calories. A 500 kcal meal is 500,000 calories in physics terms.' },
    { q: 'How many joules in 1 kWh?', a: '1 kilowatt-hour = 3,600,000 joules (3.6 MJ). That is one kilowatt sustained for one hour.' }
  ],
  zhfaq: [
    { q: '食品上的「卡路里」和物理里的卡一样吗？', a: '不一样。营养标签上的「卡路里」实际是千卡（kcal），等于 1000 小卡。一份 500 大卡的餐食，在物理单位下是 500000 卡。' },
    { q: '1 度电等于多少焦耳？', a: '1 千瓦时（1 度电）= 3,600,000 焦耳 = 3.6 兆焦，即 1 千瓦功率持续工作 1 小时的能量。' }
  ],
  usecases: [
    { icon: '🍔', title: 'Nutrition', text: 'Convert kJ on labels to kcal.' },
    { icon: '🔌', title: 'Electricity', text: 'Relate kWh on your bill to joules.' },
    { icon: '❄️', title: 'HVAC', text: 'Work with BTU ratings.' }
  ],
  deep: '## 能量的国际单位\n焦耳（J）是能量的国际标准单位，定义为一牛顿的力作用一米距离所做的功。所有其他能量单位都可以换算成焦耳。\n## 各领域常用单位\n- **食品营养**：千卡（kcal）和千焦（kJ），1 kcal = 4.184 kJ\n- **电力**：千瓦时（kWh），1 kWh = 3.6 MJ\n- **暖通空调**：英热单位（BTU），1 BTU ≈ 1055 J\n- **微观物理**：电子伏特（eV），1 eV ≈ 1.602×10⁻¹⁹ J\n## 一个实用换算\n某食品标注每 100g 含 1500 kJ。换算成千卡：1500 ÷ 4.184 ≈ 358 kcal。中国营养标签通常直接标千焦，习惯看千卡的人需要除以 4.184。\n## 空调 BTU 的含义\n空调「制冷量 12000 BTU/h」约等于 3.5 kW，也就是俗称的「1.5 匹」。BTU 是每小时能量，换算时注意区分能量和功率。',
  usecasesNote: ''
}, linearConv([
  ['j', 'Joule (J)', 1],
  ['kj', 'Kilojoule (kJ)', 1000],
  ['mj', 'Megajoule (MJ)', 1000000],
  ['cal', 'Calorie (cal)', 4.184],
  ['kcal', 'Kilocalorie / food Calorie (kcal)', 4184],
  ['wh', 'Watt-hour (Wh)', 3600],
  ['kwh', 'Kilowatt-hour (kWh)', 3600000],
  ['btu', 'British thermal unit (BTU)', 1055.05585262],
  ['ftlb', 'Foot-pound (ft·lb)', 1.3558179483],
  ['ev', 'Electronvolt (eV)', 1.602176634e-19],
  ['therm', 'Therm', 105505585.262]
], 'kj', 'kcal', 1500)));

/* ---------- 3. Power ---------- */
T.push(Object.assign({
  slug: 'power-converter', icon: '🔌', title: 'Power Converter', tagline: 'Watt, Horsepower, BTU/h & More',
  category: 'converter',
  desc: 'Convert power units: watt, kilowatt, megawatt, metric and mechanical horsepower, BTU per hour, and refrigeration tons.',
  cardDesc: 'Convert watts, horsepower, BTU/h and other power units.',
  keywords: 'power converter, watts to horsepower, kw to hp, btu per hour converter, hp to kw',
  searchTerms: 'power watt kilowatt horsepower hp btu convert',
  zh: '功率单位换算器支持瓦、千瓦、兆瓦、公制马力、英制马力、英热单位每小时（BTU/h）、冷吨等互转，看车辆参数、电器功率和空调制冷量时都会用到。',
  howto: ['Enter the power value.', 'Select the unit you have and the unit you want.', 'Results appear immediately.', 'Use the full table to compare all units.'],
  faq: [
    { q: 'Metric or mechanical horsepower?', a: 'They differ slightly: metric hp (PS, used in Europe and Asia) = 735.5 W, mechanical hp (used in the US/UK) = 745.7 W. Car specs usually mean metric hp in China and Europe.' },
    { q: 'How do air conditioner "horses" relate to watts?', a: 'In Chinese usage 1 "匹" is roughly 735 W of cooling capacity, so a 1.5-hp unit is about 1100 W input or ~12000 BTU/h cooling.' }
  ],
  zhfaq: [
    { q: '公制马力和英制马力有什么区别？', a: '公制马力（PS，欧洲和亚洲常用）= 735.5 瓦；英制马力（hp，英美常用）= 745.7 瓦，相差约 1.4%。国内车辆参数一般指公制马力。' },
    { q: '空调「几匹」是什么意思？', a: '「1 匹」约对应 735 瓦制冷量。1.5 匹空调制冷量约 3500 瓦（12000 BTU/h），适合 16–26 平方米房间。' }
  ],
  usecases: [
    { icon: '🚙', title: 'Car Specs', text: 'Convert kW to horsepower.' },
    { icon: '❄️', title: 'Air Con', text: 'Match BTU/h to room size.' },
    { icon: '🏭', title: 'Machinery', text: 'Read motor ratings in any unit.' }
  ],
  deep: '## 功率与能量的区别\n功率是单位时间内做功或转换能量的速率，单位是瓦（W = J/s）。能量是总量，功率是速度 —— 一台 2000W 的热水器工作半小时，消耗的能量是 1 kWh。\n## 马力的两种定义\n- **公制马力（PS/CV）**：735.49875 W，源自欧洲，中国、日本、欧洲车企常用\n- **英制马力（hp）**：745.69987 W，源自瓦特对马拉重物的测算，英美常用\n两者相差约 1.4%，看外媒车评时要注意区分。\n## 空调的功率与制冷量\n空调标注的「制冷量」是输出的热量搬运能力，「输入功率」才是耗电。一台 1.5 匹空调制冷量约 3500 W，但输入功率通常只有 1100 W 左右 —— 因为空调是搬运热量而非直接产生冷量，能效比（COP）通常在 3 以上。\n## 换算示例\n一台电动车电机功率 150 kW，换算成公制马力：150000 ÷ 735.5 ≈ 204 PS。',
  usecasesNote: ''
}, linearConv([
  ['w', 'Watt (W)', 1],
  ['kw', 'Kilowatt (kW)', 1000],
  ['mw', 'Megawatt (MW)', 1000000],
  ['hp', 'Mechanical horsepower (hp)', 745.69987158],
  ['ps', 'Metric horsepower (PS / 匹)', 735.49875],
  ['btuh', 'BTU per hour (BTU/h)', 0.29307107],
  ['ton', 'Ton of refrigeration (RT)', 3516.8528421],
  ['ftlbs', 'Foot-pound per second', 1.35581795],
  ['kcalh', 'Kilocalorie per hour', 1.163]
], 'kw', 'ps', 150)));

/* ---------- 4. Angle ---------- */
T.push(Object.assign({
  slug: 'angle-converter', icon: '📐', title: 'Angle Converter', tagline: 'Degrees, Radians, Gradians & Turns',
  category: 'converter',
  desc: 'Convert angle units including degrees, radians, gradians, turns, arcminutes, arcseconds and milliradians.',
  cardDesc: 'Convert degrees, radians, gradians and turns.',
  keywords: 'angle converter, degrees to radians, radians to degrees, gradian converter, arcminute arcsecond',
  searchTerms: 'angle degree radian gradian turn arcminute convert',
  zh: '角度单位换算器支持度、弧度、百分度（gon）、圈、角分、角秒、毫弧度等互转。写代码调用三角函数、做几何计算或看测量仪器读数时经常需要。',
  howto: ['Enter the angle value.', 'Choose the units to convert between.', 'The result updates live.', 'See every unit in the table below.'],
  faq: [
    { q: 'How do I convert degrees to radians?', a: 'Multiply by π/180. So 180° = π ≈ 3.14159 rad, and 90° = π/2 ≈ 1.5708 rad.' },
    { q: 'Why do programming languages use radians?', a: 'Math functions like Math.sin() in JavaScript, Python and C all expect radians. Passing degrees directly is one of the most common bugs in graphics code.' }
  ],
  zhfaq: [
    { q: '度和弧度怎么换算？', a: '弧度 = 度 × π/180。所以 180° = π ≈ 3.14159 弧度，90° = π/2 ≈ 1.5708 弧度。' },
    { q: '为什么编程里要用弧度？', a: 'JavaScript、Python、C 等语言的 sin/cos 函数都接收弧度。直接传角度值是图形和游戏开发中最常见的 bug 之一。' }
  ],
  usecases: [
    { icon: '💻', title: 'Coding', text: 'Convert degrees before calling sin/cos.' },
    { icon: '📏', title: 'Surveying', text: 'Work with gradians and arcseconds.' },
    { icon: '🎮', title: 'Game Dev', text: 'Handle rotation values correctly.' }
  ],
  deep: '## 角度的几种表示法\n- **度（°）**：把一圈分成 360 份，源自古巴比伦的六十进制，日常最常用\n- **弧度（rad）**：弧长等于半径时对应的圆心角，一圈为 2π，数学和编程的标准单位\n- **百分度（gon/grad）**：把一圈分成 400 份，直角正好是 100，测绘领域使用\n- **圈（turn）**：一整圈为 1，动画和旋转参数中直观好用\n## 关键换算关系\n- 1 圈 = 360° = 2π rad ≈ 6.28319 rad = 400 gon\n- 1° = 60 角分（′）= 3600 角秒（″）\n- 1 rad ≈ 57.2958°\n## 编程中的常见坑\nJavaScript 的 `Math.sin(90)` 不会返回 1，因为它把 90 当作弧度处理。正确写法是 `Math.sin(90 * Math.PI / 180)`。这个错误在 Canvas 绘图和 3D 旋转中尤其高发。\n## 角分角秒的用途\n经纬度坐标常写成「39°54′27″N」这种度分秒格式，天文观测和 GPS 定位也大量使用角秒作为精度单位。',
  usecasesNote: ''
}, linearConv([
  ['deg', 'Degree (°)', 1],
  ['rad', 'Radian (rad)', 57.29577951308232],
  ['grad', 'Gradian / gon', 0.9],
  ['turn', 'Turn (full circle)', 360],
  ['arcmin', 'Arcminute (′)', 0.016666666666667],
  ['arcsec', 'Arcsecond (″)', 0.00027777777777778],
  ['mrad', 'Milliradian (mrad)', 0.05729577951308],
  ['quad', 'Quadrant (right angle)', 90]
], 'deg', 'rad', 90)));

/* ---------- 5. Frequency ---------- */
T.push(Object.assign({
  slug: 'frequency-converter', icon: '📡', title: 'Frequency Converter', tagline: 'Hz, kHz, MHz, GHz & RPM',
  category: 'converter',
  desc: 'Convert frequency units: hertz, kilohertz, megahertz, gigahertz, terahertz, RPM and cycles per minute or day.',
  cardDesc: 'Convert Hz, kHz, MHz, GHz and RPM.',
  keywords: 'frequency converter, hz to khz, mhz to ghz, rpm to hz, frequency unit conversion',
  searchTerms: 'frequency hertz hz khz mhz ghz rpm convert',
  zh: '频率单位换算器支持赫兹、千赫、兆赫、吉赫、太赫以及转每分钟（RPM）等单位互转。看 CPU 主频、无线电频段、电机转速、音频采样率时都用得上。',
  howto: ['Type the frequency value.', 'Select the two units.', 'Read the converted value instantly.', 'Compare all units in the list below.'],
  faq: [
    { q: 'How many Hz is 2.4 GHz Wi-Fi?', a: '2.4 GHz = 2,400,000,000 Hz. The 2.4 GHz band is crowded because Wi-Fi, Bluetooth and microwave ovens all share it.' },
    { q: 'How do RPM and Hz relate?', a: 'One revolution per second is 1 Hz, so 60 RPM = 1 Hz. A motor at 3000 RPM is spinning at 50 Hz.' }
  ],
  zhfaq: [
    { q: '2.4 GHz Wi-Fi 是多少赫兹？', a: '2.4 GHz = 24 亿赫兹。这个频段之所以拥挤，是因为 Wi-Fi、蓝牙和微波炉都在使用它。' },
    { q: '转速（RPM）和赫兹怎么换算？', a: '每秒转一圈就是 1 赫兹，所以 60 RPM = 1 Hz。电机 3000 转/分即 50 Hz。' }
  ],
  usecases: [
    { icon: '💻', title: 'CPU Specs', text: 'Compare GHz clock speeds.' },
    { icon: '📻', title: 'Radio', text: 'Switch between kHz and MHz bands.' },
    { icon: '⚙️', title: 'Motors', text: 'Convert RPM to Hz for drives.' }
  ],
  deep: '## 频率的定义\n频率表示单位时间内周期性事件重复的次数，国际单位是赫兹（Hz），即每秒一次。这个单位以发现电磁波的德国物理学家海因里希·赫兹命名。\n## 常见量级参考\n- **人耳听觉范围**：20 Hz – 20 kHz\n- **市电频率**：中国和欧洲 50 Hz，美国和日本部分地区 60 Hz\n- **AM 广播**：约 530–1700 kHz\n- **FM 广播**：88–108 MHz\n- **Wi-Fi**：2.4 GHz 和 5 GHz\n- **CPU 主频**：现代处理器普遍 3–5 GHz\n## 转速与频率\n机械领域常用「转每分钟」（RPM）。换算很简单：Hz = RPM ÷ 60。一台 1500 RPM 的电机运行频率为 25 Hz，这也是变频器调速的基本依据。\n## 一个换算例子\n音频采样率 44.1 kHz 意味着每秒采样 44100 次。根据奈奎斯特定理，它能完整还原最高 22.05 kHz 的声音，刚好覆盖人耳听觉上限。',
  usecasesNote: ''
}, linearConv([
  ['hz', 'Hertz (Hz)', 1],
  ['khz', 'Kilohertz (kHz)', 1000],
  ['mhz', 'Megahertz (MHz)', 1000000],
  ['ghz', 'Gigahertz (GHz)', 1000000000],
  ['thz', 'Terahertz (THz)', 1000000000000],
  ['rpm', 'Revolutions per minute (RPM)', 0.016666666666667],
  ['rps', 'Revolutions per second', 1],
  ['cpd', 'Cycles per day', 0.000011574074074],
  ['bpm', 'Beats per minute (BPM)', 0.016666666666667]
], 'ghz', 'mhz', 2.4)));

/* ---------- 6. Force ---------- */
T.push(Object.assign({
  slug: 'force-converter', icon: '💪', title: 'Force Converter', tagline: 'Newton, Pound-force, Kilogram-force',
  category: 'converter',
  desc: 'Convert force units: newton, kilonewton, pound-force, kilogram-force, dyne, poundal and ton-force.',
  cardDesc: 'Convert newtons, pound-force and kilogram-force.',
  keywords: 'force converter, newton to pound force, kgf to n, force unit conversion, kn to lbf',
  searchTerms: 'force newton pound kgf dyne convert physics',
  zh: '力的单位换算器支持牛顿、千牛、磅力、千克力、达因、磅达、吨力等单位互转。物理作业、工程结构计算和进口设备参数换算时都会用到。',
  howto: ['Enter the force value.', 'Pick your source and target units.', 'The conversion updates as you type.', 'Review all units in the table.'],
  faq: [
    { q: 'What is the difference between kg and kgf?', a: 'Kilogram is mass; kilogram-force is the weight that mass has under standard gravity. 1 kgf = 9.80665 N. On the Moon the same kg would produce far less force.' },
    { q: 'How many newtons is 1 pound-force?', a: '1 lbf = 4.44822 N. US equipment specs often use lbf where metric specs use N or kN.' }
  ],
  zhfaq: [
    { q: '千克和千克力有什么区别？', a: '千克是质量单位，千克力是该质量在标准重力下产生的力，1 kgf = 9.80665 N。同样的质量在月球上产生的力要小得多。' },
    { q: '1 磅力等于多少牛顿？', a: '1 lbf = 4.44822 N。美国设备参数常用磅力，公制参数则用牛顿或千牛。' }
  ],
  usecases: [
    { icon: '🏗️', title: 'Structural', text: 'Convert kN in load specs.' },
    { icon: '🔬', title: 'Physics', text: 'Check homework unit conversions.' },
    { icon: '📦', title: 'Imports', text: 'Read foreign equipment ratings.' }
  ],
  deep: '## 力的国际单位\n牛顿（N）是力的国际单位，定义为使 1 千克质量产生 1 m/s² 加速度所需的力，即 1 N = 1 kg·m/s²。\n## 质量与力的混淆\n日常说「这个东西重 5 公斤」其实混用了质量和重力。严格来说 5 kg 是质量，它在地球表面产生的重力约为 5 × 9.80665 = 49.03 N，也就是 5 kgf。工程图纸中区分这两者很重要。\n## 常用换算\n- 1 N = 0.10197 kgf = 0.22481 lbf\n- 1 kgf = 9.80665 N\n- 1 lbf = 4.44822 N\n- 1 kN = 1000 N ≈ 102 kgf\n## 工程中的实际应用\n建筑结构荷载通常用 kN 表示：一个 5 kN 的集中荷载约相当于 510 kg 物体的重量。螺栓预紧力、起重设备额定载荷也都用力的单位标注，采购进口设备时需要在 lbf 和 kN 之间换算。',
  usecasesNote: ''
}, linearConv([
  ['n', 'Newton (N)', 1],
  ['kn', 'Kilonewton (kN)', 1000],
  ['mn', 'Meganewton (MN)', 1000000],
  ['kgf', 'Kilogram-force (kgf)', 9.80665],
  ['gf', 'Gram-force (gf)', 0.00980665],
  ['lbf', 'Pound-force (lbf)', 4.4482216153],
  ['ozf', 'Ounce-force (ozf)', 0.2780138509],
  ['dyn', 'Dyne (dyn)', 0.00001],
  ['pdl', 'Poundal (pdl)', 0.138254954376],
  ['tf', 'Ton-force (metric)', 9806.65]
], 'kn', 'kgf', 5)));

/* ---------- 7. Density ---------- */
T.push(Object.assign({
  slug: 'density-converter', icon: '🧊', title: 'Density Converter', tagline: 'kg/m³, g/cm³, lb/ft³ & More',
  category: 'converter',
  desc: 'Convert density units between kg/m³, g/cm³, g/mL, kg/L, lb/ft³, lb/in³ and ounces per gallon.',
  cardDesc: 'Convert kg/m³, g/cm³, lb/ft³ and other density units.',
  keywords: 'density converter, kg/m3 to g/cm3, density unit conversion, lb/ft3 converter, specific gravity',
  searchTerms: 'density kg m3 g cm3 lb ft3 convert material',
  zh: '密度单位换算器支持千克每立方米、克每立方厘米、克每毫升、千克每升、磅每立方英尺、磅每立方英寸等互转，材料选型、化学实验和工程计算常用。',
  howto: ['Enter the density value.', 'Select source and target units.', 'Read the result instantly.', 'Use the full table for a quick overview.'],
  faq: [
    { q: 'What is the density of water?', a: 'Pure water at 4°C is 1000 kg/m³ = 1 g/cm³ = 1 g/mL. This is the reference point for specific gravity.' },
    { q: 'Why is g/cm³ so common?', a: 'Because water is exactly 1 g/cm³, any material\u2019s number immediately tells you whether it floats (below 1) or sinks (above 1).' }
  ],
  zhfaq: [
    { q: '水的密度是多少？', a: '4℃ 的纯水密度为 1000 kg/m³ = 1 g/cm³ = 1 g/mL，这是比重（相对密度）的参照基准。' },
    { q: '为什么常用 g/cm³？', a: '因为水正好是 1 g/cm³，看到某材料的数值就能立刻判断它在水中是浮（小于 1）还是沉（大于 1）。' }
  ],
  usecases: [
    { icon: '🏭', title: 'Materials', text: 'Compare metal and plastic densities.' },
    { icon: '🧪', title: 'Chemistry', text: 'Convert lab measurement units.' },
    { icon: '🚢', title: 'Shipping', text: 'Estimate cargo weight from volume.' }
  ],
  deep: '## 密度的定义\n密度是单位体积内的质量，公式为 ρ = m / V。国际单位是千克每立方米（kg/m³），但实验室更常用克每立方厘米（g/cm³）。\n## 关键换算关系\n1 g/cm³ = 1000 kg/m³ = 1 g/mL = 1 kg/L。这四个表述数值上完全等价，只是单位组合不同。\n## 常见材料密度参考（g/cm³）\n- 软木：约 0.24\n- 水：1.00\n- 混凝土：约 2.4\n- 铝：2.70\n- 钢铁：7.85\n- 铜：8.96\n- 铅：11.34\n- 金：19.32\n## 实际应用\n知道密度就能在质量和体积之间换算。例如一块 20cm × 10cm × 5cm 的钢板，体积 1000 cm³，密度 7.85 g/cm³，质量约 7.85 kg。物流报价、材料采购和结构自重计算都依赖这一关系。',
  usecasesNote: ''
}, linearConv([
  ['kgm3', 'Kilogram per cubic metre (kg/m³)', 1],
  ['gcm3', 'Gram per cubic centimetre (g/cm³)', 1000],
  ['gml', 'Gram per millilitre (g/mL)', 1000],
  ['kgl', 'Kilogram per litre (kg/L)', 1000],
  ['gl', 'Gram per litre (g/L)', 1],
  ['mgm3', 'Milligram per cubic metre (mg/m³)', 0.000001],
  ['lbft3', 'Pound per cubic foot (lb/ft³)', 16.018463374],
  ['lbin3', 'Pound per cubic inch (lb/in³)', 27679.904710],
  ['ozgal', 'Ounce per US gallon', 7.4891517],
  ['lbgal', 'Pound per US gallon', 119.82642731]
], 'gcm3', 'kgm3', 7.85)));

/* ---------- 8. Shoe size ---------- */
T.push({
  slug: 'shoe-size-converter', icon: '👟', title: 'Shoe Size Converter', tagline: 'US, UK, EU, CN & Foot Length',
  category: 'converter', popular: 'Popular',
  desc: 'Convert shoe sizes between US, UK, EU, Chinese (mm) and Japanese systems for men, women and kids, based on actual foot length.',
  cardDesc: 'Convert shoe sizes between US, UK, EU and CN.',
  keywords: 'shoe size converter, us to eu shoe size, uk shoe size conversion, shoe size chart, foot length to shoe size',
  searchTerms: 'shoe size us uk eu cn foot length convert chart',
  zh: '鞋码换算器支持美码、英码、欧码、中国码（毫米）和日码之间的互转，区分男鞋、女鞋和童鞋，并以实际脚长为基准，海淘买鞋时不再纠结尺码。',
  howto: ['Choose men\u2019s, women\u2019s or kids\u2019 sizing.', 'Pick the size system you know.', 'Enter your size or measure your foot length in mm.', 'Read the equivalent sizes in all systems.'],
  faq: [
    { q: 'How do I measure foot length correctly?', a: 'Stand on a sheet of paper against a wall in the evening (feet swell during the day), mark the longest toe, and measure from the wall. Measure both feet and use the larger one.' },
    { q: 'Why do sizes vary between brands?', a: 'There is no enforced international standard, and each brand uses its own last shape. Foot length in millimetres is the only reliable reference — always check the brand\u2019s own chart too.' }
  ],
  zhfaq: [
    { q: '怎么正确量脚长？', a: '傍晚时（脚会轻微肿胀）光脚贴墙站在纸上，标记最长脚趾的位置，量出到墙的距离。两只脚都量，按较大的那只选码。' },
    { q: '为什么不同品牌尺码差别很大？', a: '鞋码没有强制国际标准，各品牌鞋楦不同。以毫米为单位的脚长是唯一可靠参照，购买前最好再对照该品牌的官方尺码表。' }
  ],
  usecases: [
    { icon: '🌍', title: 'Overseas Shopping', text: 'Convert US sizes when buying abroad.' },
    { icon: '🎁', title: 'Buying Gifts', text: 'Work from a known size in another system.' },
    { icon: '👶', title: 'Kids Shoes', text: 'Track growing feet by length.' }
  ],
  deep: '## 鞋码为什么这么混乱\n各国鞋码体系起源不同：英美用「巴黎点」的变体并以脚长英寸为基础，欧洲用「巴黎点」（每点 2/3 厘米），中国和日本直接用脚长毫米。三套体系起点和增量都不同，所以无法简单加减换算。\n## 以脚长为基准最可靠\n本工具的所有换算都以实际脚长（毫米）为中间基准：欧码 ≈ (脚长mm + 15) ÷ 6.67，中国码 = 脚长mm，美码男 ≈ (脚长mm − 208) ÷ 8.47 + 6。这样比「美码 + 33 = 欧码」这类粗略口诀准确得多。\n## 常见对照（男鞋）\n- 脚长 250mm ≈ 中国 250 / 欧码 40 / 美码 7.5 / 英码 6.5\n- 脚长 260mm ≈ 中国 260 / 欧码 41.5 / 美码 8.5 / 英码 7.5\n- 脚长 270mm ≈ 中国 270 / 欧码 43 / 美码 9.5 / 英码 9\n## 选鞋的实用建议\n- 运动鞋通常要比正装鞋大半码，给脚趾留出活动空间\n- 男女鞋码在美制体系中相差约 1.5 码（女码 = 男码 + 1.5）\n- 童鞋建议每 3 个月重新量一次脚长\n- 本换算为通用参考，最终请以品牌官方尺码表为准',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="who">Category</label>
            <select id="who">
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div class="form-row">
            <label for="sys">I know my size in</label>
            <select id="sys">
              <option value="mm">Foot length (mm) / China</option>
              <option value="eu">EU</option>
              <option value="us">US</option>
              <option value="uk">UK</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <label for="val">Size / length</label>
          <input type="number" id="val" value="260" step="0.5">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="convBtn">Convert</button>
        </div>
        <div id="out"></div>`,
  js: `    var who=document.getElementById('who'),sys=document.getElementById('sys'),val=document.getElementById('val'),out=document.getElementById('out'),btn=document.getElementById('convBtn');
    // all systems derived from foot length in mm
    function fromMM(mm,cat){
      var eu=(mm+15)/6.6667;
      var us,uk;
      if(cat==='men'){us=(mm-208)/8.466+6;uk=us-0.5;}
      else if(cat==='women'){us=(mm-195)/8.466+6;uk=us-2.5;}
      else{us=(mm-152)/8.466+8;uk=us-0.5;}
      return {eu:eu,us:us,uk:uk,mm:mm,jp:mm/10};
    }
    function toMM(v,s,cat){
      if(s==='mm')return v;
      if(s==='eu')return v*6.6667-15;
      if(s==='us'){
        if(cat==='men')return (v-6)*8.466+208;
        if(cat==='women')return (v-6)*8.466+195;
        return (v-8)*8.466+152;
      }
      if(s==='uk'){
        if(cat==='men')return (v+0.5-6)*8.466+208;
        if(cat==='women')return (v+2.5-6)*8.466+195;
        return (v+0.5-8)*8.466+152;
      }
      return v;
    }
    function half(x){return (Math.round(x*2)/2).toFixed(1);}
    function calc(){
      var v=parseFloat(val.value),cat=who.value;
      if(isNaN(v)){out.className='result-box';out.textContent='Enter a size to convert.';return;}
      var mm=toMM(v,sys.value,cat);
      if(mm<100||mm>400){out.className='result-box';out.textContent='That gives a foot length of '+Math.round(mm)+'mm, which looks out of range. Check the selected system.';return;}
      var r=fromMM(mm,cat);
      function row(a,b){return '<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border)"><span>'+a+'</span><strong style="font-size:1.05rem">'+b+'</strong></div>';}
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.6rem;font-weight:700;margin-bottom:4px">'+Math.round(mm)+' mm</div>'+
        '<div style="opacity:.75;margin-bottom:14px">foot length · '+cat+'\\u2019s sizing</div>'+
        row('China (mm)',Math.round(mm))+
        row('EU',half(r.eu))+
        row('US',half(r.us))+
        row('UK',half(r.uk))+
        row('Japan (cm)',half(r.jp))+
        '<p style="margin-top:12px;font-size:.85rem;opacity:.75">Sizes are rounded to the nearest half. Brands vary — check the maker\\u2019s own chart before ordering.</p>';
    }
    [who,sys,val].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});
    btn.addEventListener('click',calc);calc();`
});

/* ---------- 9. Cooking ---------- */
T.push({
  slug: 'cooking-converter', icon: '🥄', title: 'Cooking Measurement Converter', tagline: 'Cups, Tablespoons, Grams & Millilitres',
  category: 'converter', popular: 'Popular',
  desc: 'Convert cooking measurements between cups, tablespoons, teaspoons, millilitres, grams and ounces — with ingredient-specific density for accurate weight conversion.',
  cardDesc: 'Convert cups, spoons, grams and ml for recipes.',
  keywords: 'cooking converter, cups to grams, tablespoon to ml, recipe converter, baking measurement conversion',
  searchTerms: 'cooking baking cups grams ml tablespoon recipe convert',
  zh: '烹饪单位换算器支持杯、汤匙、茶匙、毫升、克、盎司之间的换算，并针对面粉、糖、黄油、水等不同食材使用各自的密度，让「1 杯面粉等于多少克」这类问题有准确答案。',
  howto: ['Enter the amount from your recipe.', 'Choose the unit it uses.', 'Pick the ingredient (density matters for weight).', 'Read the equivalent in every other unit.'],
  faq: [
    { q: 'Why does 1 cup of flour differ from 1 cup of sugar in grams?', a: 'Cups measure volume, grams measure weight. Flour is light and airy (about 125g per cup) while granulated sugar is denser (about 200g per cup).' },
    { q: 'Should I use cups or a scale for baking?', a: 'A kitchen scale is far more reliable. Scooping flour can vary by 20% depending on how packed it is, which is enough to change the texture of a cake.' }
  ],
  zhfaq: [
    { q: '为什么 1 杯面粉和 1 杯糖的克数不一样？', a: '杯是体积单位，克是重量单位。面粉蓬松（约 125 克/杯），白砂糖密实（约 200 克/杯），同样体积重量差别很大。' },
    { q: '烘焙用量杯还是电子秤？', a: '强烈建议用电子秤。舀面粉的松紧程度能造成 20% 的重量差异，这足以改变蛋糕的口感和成败。' }
  ],
  usecases: [
    { icon: '🍰', title: 'Baking', text: 'Convert US recipes to grams.' },
    { icon: '🌏', title: 'Foreign Recipes', text: 'Handle cups when you only own scales.' },
    { icon: '📏', title: 'Scaling', text: 'Adjust batch sizes accurately.' }
  ],
  deep: '## 体积与重量的根本区别\n欧美食谱习惯用「杯」（cup）这种体积单位，而中文食谱和专业烘焙用「克」这种重量单位。两者之间没有固定换算关系 —— 必须知道食材的密度。\n## 常见食材的换算（1 美制杯 = 236.6 mL）\n- 水：约 237 克\n- 中筋面粉：约 125 克\n- 白砂糖：约 200 克\n- 红糖（压实）：约 220 克\n- 黄油：约 227 克\n- 牛奶：约 245 克\n- 大米（生）：约 185 克\n## 小匙具的标准值\n- 1 汤匙（tbsp）= 15 mL = 3 茶匙\n- 1 茶匙（tsp）= 5 mL\n- 1 美制杯 = 16 汤匙 = 236.6 mL\n- 英制杯 = 250 mL，澳洲汤匙 = 20 mL，跨国食谱要留意\n## 为什么专业烘焙只认重量\n面粉的堆积密度受装填方式影响极大：直接舀取比先松散再刮平能多装 20% 以上。做面包和蛋糕时这种误差足以让成品失败，所以专业配方一律用克。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="amt">Amount</label>
            <input type="number" id="amt" value="1" step="any" min="0">
          </div>
          <div class="form-row">
            <label for="unit">Unit</label>
            <select id="unit">
              <option value="cup">US cup</option>
              <option value="tbsp">Tablespoon (15 mL)</option>
              <option value="tsp">Teaspoon (5 mL)</option>
              <option value="ml">Millilitre (mL)</option>
              <option value="l">Litre</option>
              <option value="floz">US fluid ounce</option>
              <option value="g">Gram (weight)</option>
              <option value="oz">Ounce (weight)</option>
              <option value="lb">Pound (weight)</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <label for="ing">Ingredient (for weight ↔ volume)</label>
          <select id="ing">
            <option value="1">Water / most liquids — 1.00 g/mL</option>
            <option value="0.529">All-purpose flour — 125 g per cup</option>
            <option value="0.6">Bread flour — 142 g per cup</option>
            <option value="0.845">Granulated sugar — 200 g per cup</option>
            <option value="0.93">Brown sugar (packed) — 220 g per cup</option>
            <option value="0.507">Powdered sugar — 120 g per cup</option>
            <option value="0.959">Butter — 227 g per cup</option>
            <option value="1.035">Milk — 245 g per cup</option>
            <option value="0.913">Vegetable oil — 216 g per cup</option>
            <option value="0.782">Uncooked rice — 185 g per cup</option>
            <option value="0.423">Rolled oats — 100 g per cup</option>
            <option value="1.4">Salt (table) — 331 g per cup</option>
            <option value="0.37">Cocoa powder — 88 g per cup</option>
          </select>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="convBtn">Convert</button>
        </div>
        <div id="out"></div>`,
  js: `    var amt=document.getElementById('amt'),unit=document.getElementById('unit'),ing=document.getElementById('ing'),out=document.getElementById('out'),btn=document.getElementById('convBtn');
    var ML={cup:236.588,tbsp:14.7868,tsp:4.92892,ml:1,l:1000,floz:29.5735};
    var G={g:1,oz:28.3495,lb:453.592};
    function fmt(x){
      if(!isFinite(x))return '—';
      if(x>=100)return x.toFixed(0);
      if(x>=10)return x.toFixed(1);
      if(x>=1)return x.toFixed(2);
      return x.toFixed(3);
    }
    function calc(){
      var v=parseFloat(amt.value),u=unit.value,d=parseFloat(ing.value)||1;
      if(isNaN(v)||v<0){out.className='result-box';out.textContent='Enter an amount.';return;}
      var ml,g;
      if(ML[u]!==undefined){ml=v*ML[u];g=ml*d;}
      else{g=v*G[u];ml=g/d;}
      function row(a,b){return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:.95rem"><span>'+a+'</span><strong>'+b+'</strong></div>';}
      var ingName=ing.options[ing.selectedIndex].text.split('—')[0].trim();
      out.className='result-box';
      out.innerHTML='<div style="font-size:1.55rem;font-weight:700;margin-bottom:4px">'+fmt(g)+' g &nbsp;·&nbsp; '+fmt(ml)+' mL</div>'+
        '<div style="opacity:.75;margin-bottom:14px">'+v+' '+unit.options[unit.selectedIndex].text.split('(')[0].trim()+' of '+ingName+'</div>'+
        '<div style="font-weight:600;font-size:.9rem;margin-bottom:4px">Volume</div>'+
        row('US cups',fmt(ml/ML.cup))+row('Tablespoons',fmt(ml/ML.tbsp))+row('Teaspoons',fmt(ml/ML.tsp))+
        row('Millilitres',fmt(ml))+row('US fluid ounces',fmt(ml/ML.floz))+
        '<div style="font-weight:600;font-size:.9rem;margin:14px 0 4px">Weight</div>'+
        row('Grams',fmt(g))+row('Ounces',fmt(g/G.oz))+row('Pounds',fmt(g/G.lb));
    }
    [amt,unit,ing].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc);});
    btn.addEventListener('click',calc);calc();`
});

module.exports = T;
