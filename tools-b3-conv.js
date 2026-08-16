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
  howto: ['Type the value you want to convert.', 'Pick the source and target units.', 'The result updates as you type.', 'Scroll down to see the value in every supported unit.'],
  faq: [
    { q: 'How many psi is 1 bar?', a: '1 bar equals 14.5038 psi. Car tyre pressures are often quoted in both, which is why 2.2 bar and 32 psi appear interchangeably.' },
    { q: 'What is standard atmospheric pressure?', a: '1 atm = 101,325 Pa = 1.01325 bar = 14.6959 psi = 760 mmHg. It is the average air pressure at sea level.' }
  ],
  zhfaq: [
    { q: 'How many psi in 1 bar?', a: '1 bar = 14.5038 psi. Car tire pressure is commonly 2.2 bar or 32 psi - they describe roughly the same pressure.' },
    { q: 'What is standard atmospheric pressure?', a: '1 standard atmosphere = 101325 pascals = 1.01325 bar = 14.6959 psi = 760 mmHg, which is the average sea-level pressure.' }
  ],
  usecases: [
    { icon: '🚗', title: 'Tyre Pressure', text: 'Convert bar to psi at the air pump.' },
    { icon: '🔧', title: 'Engineering', text: 'Switch between kPa and MPa in specs.' },
    { icon: '🩺', title: 'Medical', text: 'Read blood pressure in mmHg or kPa.' }
  ],
  deep: '## Why so many pressure units\nThe international unit of pressure is the pascal (Pa), defined as one newton of force per square meter. But because pascals are so small in everyday numbers, engineering, medicine, and meteorology each developed more convenient units, which is why so many coexist today.\n## Common unit reference\n- 1 bar = 100,000 Pa = 100 kPa\n- 1 psi = 6,894.76 Pa\n- 1 atm = 101,325 Pa = 760 mmHg\n- 1 MPa = 1,000,000 Pa (common in hydraulic systems)\n## Usage by field\n- Car tire pressure: Europe uses bar, the US uses psi, China mixes both.\n- Medical blood pressure: mmHg (millimeters of mercury) worldwide, e.g. 120/80.\n- Weather pressure: hectopascals (hPa); standard sea level is 1013.25 hPa.\n- Hydraulic engineering: mostly MPa.\n## A conversion example\nA tire marked 2.4 bar converts to psi: 2.4 times 14.5038 is about 34.8 psi. So inflating to 35 psi basically meets the spec.',
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
  howto: ['Enter the energy value.', 'Choose source and target units.', 'Read the converted result instantly.', 'Check the full list below for all units at once.'],
  faq: [
    { q: 'Is a food calorie the same as a calorie?', a: 'No. The "calorie" on nutrition labels is actually a kilocalorie (kcal) — 1000 small calories. A 500 kcal meal is 500,000 calories in physics terms.' },
    { q: 'How many joules in 1 kWh?', a: '1 kilowatt-hour = 3,600,000 joules (3.6 MJ). That is one kilowatt sustained for one hour.' }
  ],
  zhfaq: [
    { q: 'Is the calorie on food labels the same as the physics calorie?', a: 'No. The calorie on nutrition labels is actually a kilocalorie (kcal), equal to 1000 small calories. A 500-calorie meal is 500,000 small calories in physics units.' },
    { q: 'How many joules in 1 kWh of electricity?', a: '1 kilowatt-hour (1 degree of electricity) = 3,600,000 joules = 3.6 megajoules, i.e. the energy of 1 kilowatt running for 1 hour.' }
  ],
  usecases: [
    { icon: '🍔', title: 'Nutrition', text: 'Convert kJ on labels to kcal.' },
    { icon: '🔌', title: 'Electricity', text: 'Relate kWh on your bill to joules.' },
    { icon: '❄️', title: 'HVAC', text: 'Work with BTU ratings.' }
  ],
  deep: '## The international unit of energy\nThe joule (J) is the international standard unit of energy, defined as the work done by one newton of force acting over one meter. Every other energy unit can be converted into joules.\n## Common units by field\n- Food nutrition: kilocalorie (kcal) and kilojoule (kJ), 1 kcal = 4.184 kJ.\n- Electricity: kilowatt-hour (kWh), 1 kWh = 3.6 MJ.\n- HVAC: British thermal unit (BTU), 1 BTU is about 1055 J.\n- Microphysics: electronvolt (eV), 1 eV is about 1.602 times 10 to the power of -19 J.\n## A practical conversion\nA food labeled 1500 kJ per 100g converts to kcal: 1500 divided by 4.184 is about 358 kcal. Chinese nutrition labels usually show kilojoules directly, so people used to kcal need to divide by 4.184.\n## What air-conditioner BTU means\nAn air conditioner rated 12000 BTU/h is about 3.5 kW, commonly called a 1.5-horsepower unit. BTU is energy per hour, so keep energy and power distinct when converting.',
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
  howto: ['Enter the power value.', 'Select the unit you have and the unit you want.', 'Results appear immediately.', 'Use the full table to compare all units.'],
  faq: [
    { q: 'Metric or mechanical horsepower?', a: 'They differ slightly: metric hp (PS, used in Europe and Asia) = 735.5 W, mechanical hp (used in the US/UK) = 745.7 W. Car specs usually mean metric hp in China and Europe.' },
    { q: 'How do air conditioner "horses" relate to watts?', a: 'In HVAC usage 1 horsepower is roughly 735 W of cooling capacity, so a 1.5-hp unit is about 1100 W input or ~12000 BTU/h cooling.' }
  ],
  zhfaq: [
    { q: 'How do air conditioner "horses" relate to watts?', a: 'In HVAC usage 1 horsepower is roughly 735 W of cooling capacity, so a 1.5-hp unit is about 1100 W input or ~12000 BTU/h cooling.' },
    { q: 'What is the difference between metric and imperial horsepower?', a: 'Metric horsepower (PS, common in Europe and Asia) = 735.5 W; imperial horsepower (hp, common in UK/US) = 745.7 W, a difference of about 1.4%. Domestic vehicle specs usually refer to metric horsepower.' },
    { q: 'What does air-conditioner horsepower mean?', a: '1 horsepower corresponds to about 735 W of cooling capacity. A 1.5-horsepower unit provides about 3500 W (12000 BTU/h) of cooling, suitable for a 16-26 square meter room.' }
  ],
  usecases: [
    { icon: '🚙', title: 'Car Specs', text: 'Convert kW to horsepower.' },
    { icon: '❄️', title: 'Air Con', text: 'Match BTU/h to room size.' },
    { icon: '🏭', title: 'Machinery', text: 'Read motor ratings in any unit.' }
  ],
  deep: '## Power vs energy\nPower is the rate of doing work or converting energy per unit time, measured in watts (W = J/s). Energy is the total amount; power is the speed - a 2000W water heater running for half an hour consumes 1 kWh of energy.\n## The two definitions of horsepower\n- Metric horsepower (PS/CV): 735.49875 W, from Europe, used by Chinese, Japanese, and European carmakers.\n- Imperial horsepower (hp): 745.69987 W, from Watt\'s measurement of a horse lifting weight, used in UK/US.\nThey differ by about 1.4%; keep this in mind when reading foreign car reviews.\n## Air-conditioner power vs cooling capacity\nThe cooling capacity printed on an AC is the heat it moves; the input power is what it actually consumes. A 1.5-horsepower unit has about 3500 W of cooling capacity but usually only about 1100 W of input power - because an AC moves heat rather than generating cold, its COP is typically above 3.\n## A conversion example\nAn EV motor rated 150 kW converts to metric horsepower: 150000 divided by 735.5 is about 204 PS.',
  usecasesNote: ''
}, linearConv([
  ['w', 'Watt (W)', 1],
  ['kw', 'Kilowatt (kW)', 1000],
  ['mw', 'Megawatt (MW)', 1000000],
  ['hp', 'Mechanical horsepower (hp)', 745.69987158],
  ['ps', 'Metric horsepower (PS)', 735.49875],
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
  howto: ['Enter the angle value.', 'Choose the units to convert between.', 'The result updates live.', 'See every unit in the table below.'],
  faq: [
    { q: 'How do I convert degrees to radians?', a: 'Multiply by π/180. So 180° = π ≈ 3.14159 rad, and 90° = π/2 ≈ 1.5708 rad.' },
    { q: 'Why do programming languages use radians?', a: 'Math functions like Math.sin() in JavaScript, Python and C all expect radians. Passing degrees directly is one of the most common bugs in graphics code.' }
  ],
  zhfaq: [
    { q: 'How do degrees and radians convert?', a: 'radians = degrees times pi/180. So 180 degrees = pi is about 3.14159 radians, and 90 degrees = pi/2 is about 1.5708 radians.' },
    { q: 'Why do programming languages use radians?', a: 'The sin/cos functions in JavaScript, Python, C and others take radians. Passing degrees directly is one of the most common bugs in graphics and game development.' }
  ],
  usecases: [
    { icon: '💻', title: 'Coding', text: 'Convert degrees before calling sin/cos.' },
    { icon: '📏', title: 'Surveying', text: 'Work with gradians and arcseconds.' },
    { icon: '🎮', title: 'Game Dev', text: 'Handle rotation values correctly.' }
  ],
  deep: '## Ways to express angles\n- Degree (deg): a circle split into 360 parts, from ancient Babylonian base-60, the most common in daily life.\n- Radian (rad): the central angle whose arc equals the radius; a full circle is 2pi, the standard unit in math and programming.\n- Gradian (gon/grad): a circle split into 400 parts, with a right angle exactly 100, used in surveying.\n- Turn: a full circle equals 1, intuitive for animation and rotation parameters.\n## Key conversions\n- 1 turn = 360 deg = 2pi rad is about 6.28319 rad = 400 gon.\n- 1 deg = 60 arcminutes = 3600 arcseconds.\n- 1 rad is about 57.2958 deg.\n## A common programming pitfall\nJavaScript\'s Math.sin(90) does not return 1 because it treats 90 as radians. The correct form is Math.sin(90 * Math.PI / 180). This mistake is especially common in Canvas drawing and 3D rotation.\n## Uses of arcminutes and arcseconds\nLatitude and longitude coordinates are often written in degrees-minutes-seconds like 39 deg 54\' 27" N, and astronomical observation and GPS positioning rely heavily on arcseconds as a precision unit.',
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
  howto: ['Type the frequency value.', 'Select the two units.', 'Read the converted value instantly.', 'Compare all units in the list below.'],
  faq: [
    { q: 'How many Hz is 2.4 GHz Wi-Fi?', a: '2.4 GHz = 2,400,000,000 Hz. The 2.4 GHz band is crowded because Wi-Fi, Bluetooth and microwave ovens all share it.' },
    { q: 'How do RPM and Hz relate?', a: 'One revolution per second is 1 Hz, so 60 RPM = 1 Hz. A motor at 3000 RPM is spinning at 50 Hz.' }
  ],
  zhfaq: [
    { q: 'How many hertz is 2.4 GHz Wi-Fi?', a: '2.4 GHz = 2.4 billion hertz. This band is crowded because Wi-Fi, Bluetooth, and microwave ovens all use it.' },
    { q: 'How do RPM and hertz convert?', a: 'One revolution per second is 1 hertz, so 60 RPM = 1 Hz. A motor at 3000 RPM runs at 50 Hz.' }
  ],
  usecases: [
    { icon: '💻', title: 'CPU Specs', text: 'Compare GHz clock speeds.' },
    { icon: '📻', title: 'Radio', text: 'Switch between kHz and MHz bands.' },
    { icon: '⚙️', title: 'Motors', text: 'Convert RPM to Hz for drives.' }
  ],
  deep: '## What frequency means\nFrequency is the number of times a periodic event repeats per unit time. The international unit is the hertz (Hz), one per second. It is named after German physicist Heinrich Hertz, who discovered electromagnetic waves.\n## Common magnitudes\n- Human hearing range: 20 Hz to 20 kHz.\n- Mains frequency: 50 Hz in China and Europe, 60 Hz in the US and parts of Japan.\n- AM radio: about 530-1700 kHz.\n- FM radio: 88-108 MHz.\n- Wi-Fi: 2.4 GHz and 5 GHz.\n- CPU clock: modern processors are generally 3-5 GHz.\n## Rotation and frequency\nMechanics often use revolutions per minute (RPM). The conversion is simple: Hz = RPM divided by 60. A 1500 RPM motor runs at 25 Hz, which is also the basis of variable-frequency drive speed control.\n## A conversion example\nAn audio sample rate of 44.1 kHz means 44100 samples per second. By the Nyquist theorem it can fully reproduce sounds up to 22.05 kHz, just covering the upper limit of human hearing.',
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
  howto: ['Enter the force value.', 'Pick your source and target units.', 'The conversion updates as you type.', 'Review all units in the table.'],
  faq: [
    { q: 'What is the difference between kg and kgf?', a: 'Kilogram is mass; kilogram-force is the weight that mass has under standard gravity. 1 kgf = 9.80665 N. On the Moon the same kg would produce far less force.' },
    { q: 'How many newtons is 1 pound-force?', a: '1 lbf = 4.44822 N. US equipment specs often use lbf where metric specs use N or kN.' }
  ],
  zhfaq: [
    { q: 'What is the difference between kilogram and kilogram-force?', a: 'The kilogram is a unit of mass; kilogram-force is the force that mass produces under standard gravity, 1 kgf = 9.80665 N. The same mass produces much less force on the moon.' },
    { q: 'How many newtons in 1 pound-force?', a: '1 lbf = 4.44822 N. US equipment specs commonly use pound-force, while metric specs use newtons or kilonewtons.' }
  ],
  usecases: [
    { icon: '🏗️', title: 'Structural', text: 'Convert kN in load specs.' },
    { icon: '🔬', title: 'Physics', text: 'Check homework unit conversions.' },
    { icon: '📦', title: 'Imports', text: 'Read foreign equipment ratings.' }
  ],
  deep: '## The international unit of force\nThe newton (N) is the international unit of force, defined as the force needed to give 1 kg of mass an acceleration of 1 m/s squared, i.e. 1 N = 1 kg times m/s squared.\n## Confusing mass and force\nIn daily speech "this weighs 5 kilos" mixes up mass and gravity. Strictly, 5 kg is mass; the gravity it produces at Earth\'s surface is about 5 times 9.80665 = 49.03 N, or 5 kgf. Distinguishing the two matters in engineering drawings.\n## Common conversions\n- 1 N = 0.10197 kgf = 0.22481 lbf.\n- 1 kgf = 9.80665 N.\n- 1 lbf = 4.44822 N.\n- 1 kN = 1000 N is about 102 kgf.\n## Practical use in engineering\nBuilding loads are usually given in kN: a 5 kN point load is about the weight of a 510 kg object. Bolt preload and crane rated capacity are also labeled in force units, so importing equipment requires converting between lbf and kN.',
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
  howto: ['Enter the density value.', 'Select source and target units.', 'Read the result instantly.', 'Use the full table for a quick overview.'],
  faq: [
    { q: 'What is the density of water?', a: 'Pure water at 4°C is 1000 kg/m³ = 1 g/cm³ = 1 g/mL. This is the reference point for specific gravity.' },
    { q: 'Why is g/cm³ so common?', a: 'Because water is exactly 1 g/cm³, any material\u2019s number immediately tells you whether it floats (below 1) or sinks (above 1).' }
  ],
  zhfaq: [
    { q: 'What is the density of water?', a: 'Pure water at 4 C has a density of 1000 kg/m3 = 1 g/cm3 = 1 g/mL, which is the reference baseline for specific gravity.' },
    { q: 'Why is g/cm3 commonly used?', a: 'Because water is exactly 1 g/cm3, you can immediately tell whether a material floats (below 1) or sinks (above 1) in water.' }
  ],
  usecases: [
    { icon: '🏭', title: 'Materials', text: 'Compare metal and plastic densities.' },
    { icon: '🧪', title: 'Chemistry', text: 'Convert lab measurement units.' },
    { icon: '🚢', title: 'Shipping', text: 'Estimate cargo weight from volume.' }
  ],
  deep: '## Definition of density\nDensity is mass per unit volume, with the formula rho = m / V. The international unit is kilograms per cubic meter (kg/m3), but labs more often use grams per cubic centimeter (g/cm3).\n## Key conversions\n1 g/cm3 = 1000 kg/m3 = 1 g/mL = 1 kg/L. These four expressions are numerically identical, just different unit combinations.\n## Common material densities (g/cm3)\n- Cork: about 0.24\n- Water: 1.00\n- Concrete: about 2.4\n- Aluminum: 2.70\n- Steel: 7.85\n- Copper: 8.96\n- Lead: 11.34\n- Gold: 19.32\n## Practical use\nKnowing density lets you convert between mass and volume. For example, a steel plate 20cm by 10cm by 5cm has a volume of 1000 cm3 and, at 7.85 g/cm3, a mass of about 7.85 kg. Shipping quotes, material purchasing, and structural self-weight calculations all rely on this relationship.',
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
  howto: ['Choose men\u2019s, women\u2019s or kids\u2019 sizing.', 'Pick the size system you know.', 'Enter your size or measure your foot length in mm.', 'Read the equivalent sizes in all systems.'],
  faq: [
    { q: 'How do I measure foot length correctly?', a: 'Stand on a sheet of paper against a wall in the evening (feet swell during the day), mark the longest toe, and measure from the wall. Measure both feet and use the larger one.' },
    { q: 'Why do sizes vary between brands?', a: 'There is no enforced international standard, and each brand uses its own last shape. Foot length in millimetres is the only reliable reference — always check the brand\u2019s own chart too.' }
  ],
  zhfaq: [
    { q: 'How do I measure foot length correctly?', a: 'In the evening (feet swell slightly), stand barefoot with heels against a wall on a sheet of paper, mark the longest toe, and measure the distance to the wall. Measure both feet and size to the larger one.' },
    { q: 'Why do sizes vary so much between brands?', a: 'There is no mandatory international standard for shoe sizes, and each brand has a different last. Foot length in millimeters is the only reliable reference; also check the brand\'s official size chart before buying.' }
  ],
  usecases: [
    { icon: '🌍', title: 'Overseas Shopping', text: 'Convert US sizes when buying abroad.' },
    { icon: '🎁', title: 'Buying Gifts', text: 'Work from a known size in another system.' },
    { icon: '👶', title: 'Kids Shoes', text: 'Track growing feet by length.' }
  ],
  deep: '## Why shoe sizes are so messy\nShoe-size systems have different origins: the UK/US use a variant of the Paris point based on foot length in inches, Europe uses the Paris point (each point is 2/3 cm), and China and Japan use foot length in millimeters directly. The three systems differ in both starting point and increment, so they cannot be converted by simple addition or subtraction.\n## Foot length is the most reliable base\nAll conversions in this tool use actual foot length (mm) as the intermediate base: EU size is about (footLengthMm + 15) / 6.67, CN size = footLengthMm, US men\'s is about (footLengthMm - 208) / 8.47 + 6. This is far more accurate than rough rules like US + 33 = EU.\n## Common reference (men\'s shoes)\n- Foot 250mm is about CN 250 / EU 40 / US 7.5 / UK 6.5.\n- Foot 260mm is about CN 260 / EU 41.5 / US 8.5 / UK 7.5.\n- Foot 270mm is about CN 270 / EU 43 / US 9.5 / UK 9.\n## Practical shoe-buying tips\n- Sneakers usually run half a size larger than dress shoes; leave room for toes.\n- Men\'s and women\'s US sizes differ by about 1.5 (women\'s = men\'s + 1.5).\n- Remeasure children\'s feet every 3 months.\n- This conversion is a general reference; always defer to the brand\'s official size chart.',
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
  howto: ['Enter the amount from your recipe.', 'Choose the unit it uses.', 'Pick the ingredient (density matters for weight).', 'Read the equivalent in every other unit.'],
  faq: [
    { q: 'Why does 1 cup of flour differ from 1 cup of sugar in grams?', a: 'Cups measure volume, grams measure weight. Flour is light and airy (about 125g per cup) while granulated sugar is denser (about 200g per cup).' },
    { q: 'Should I use cups or a scale for baking?', a: 'A kitchen scale is far more reliable. Scooping flour can vary by 20% depending on how packed it is, which is enough to change the texture of a cake.' }
  ],
  zhfaq: [
    { q: 'Why do 1 cup of flour and 1 cup of sugar weigh differently?', a: 'A cup is a volume unit, a gram is weight. Flour is fluffy (about 125 g/cup) while white sugar is dense (about 200 g/cup), so the same volume weighs very differently.' },
    { q: 'Should I use a measuring cup or a digital scale for baking?', a: 'Strongly prefer a digital scale. How tightly you scoop flour can vary the weight by 20%, enough to change a cake\'s texture and success.' }
  ],
  usecases: [
    { icon: '🍰', title: 'Baking', text: 'Convert US recipes to grams.' },
    { icon: '🌏', title: 'Foreign Recipes', text: 'Handle cups when you only own scales.' },
    { icon: '📏', title: 'Scaling', text: 'Adjust batch sizes accurately.' }
  ],
  deep: '## Volume vs weight, fundamentally\nWestern recipes use volume units like the cup, while Chinese recipes and professional baking use weight in grams. There is no fixed conversion between them - you must know the ingredient\'s density.\n## Common ingredient conversions (1 US cup = 236.6 mL)\n- Water: about 237 g\n- All-purpose flour: about 125 g\n- White sugar: about 200 g\n- Brown sugar (packed): about 220 g\n- Butter: about 227 g\n- Milk: about 245 g\n- Rice (raw): about 185 g\n## Standard spoon measures\n- 1 tablespoon (tbsp) = 15 mL = 3 teaspoons\n- 1 teaspoon (tsp) = 5 mL\n- 1 US cup = 16 tablespoons = 236.6 mL\n- Imperial cup = 250 mL, Australian tablespoon = 20 mL; watch out in cross-country recipes\n## Why pros use weight only\nFlour\'s bulk density depends heavily on how it is packed: scooping directly can hold over 20% more than loosening then leveling. In bread and cake making that error is enough to ruin the result, so professional recipes always use grams.',
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
