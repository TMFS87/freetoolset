/* tools-b3-dev.js — batch 3, developer / image tools (12 tools) */
const T = [];

function textToolBody(placeholder, label) {
  return `        <div class="form-row">
          <label for="input">${label}</label>
          <textarea id="input" rows="10" placeholder="${placeholder}"></textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Convert</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
          <button class="btn btn-secondary" id="clearBtn">Clear</button>
        </div>
        <div class="form-row">
          <label for="out">Result</label>
          <textarea id="out" rows="10" readonly placeholder="Result appears here"></textarea>
        </div>`;
}

/* ---------- 1. JSON to YAML ---------- */
T.push({
  slug: 'json-to-yaml', icon: '📄', title: 'JSON to YAML Converter', tagline: 'Convert JSON into clean YAML',
  category: 'developer', popular: 'Popular',
  desc: 'Convert JSON into readable YAML instantly. Great for Kubernetes, Docker Compose, GitHub Actions and config files.',
  cardDesc: 'Turn JSON into clean, indented YAML for config files.',
  keywords: 'json to yaml, json2yaml, yaml converter, json yaml converter, config converter',
  searchTerms: 'json to yaml convert kubernetes docker compose config',
  howto: ['Paste your JSON into the input box.', 'Click Convert.', 'Copy the YAML result.', 'Fix any parse error shown in red.'],
  faq: [
    { q: 'Does it preserve nesting and arrays?', a: 'Yes — objects, arrays, strings, numbers, booleans and null are all converted with correct indentation and list dashes.' },
    { q: 'Why would I convert JSON to YAML?', a: 'YAML is far more readable for humans and is the preferred format for many DevOps config files, while JSON is stricter and machine-friendly.' },
    { q: 'Is my data uploaded?', a: 'No. Conversion runs entirely in your browser; nothing is sent to a server.' }
  ],
  zhfaq: [
    { q: 'Are nesting and arrays preserved?', a: 'Yes. Objects, arrays, strings, numbers, booleans, and null are all converted with correct indentation and list markers.' },
    { q: 'Are the converted data uploaded?', a: 'No. Conversion runs entirely locally in your browser and is never sent to any server.' }
  ],
  usecases: [
    { icon: '☸️', title: 'Kubernetes', text: 'Write manifests faster.' },
    { icon: '🐳', title: 'Docker Compose', text: 'Edit configs with ease.' },
    { icon: '⚙️', title: 'CI/CD', text: 'GitHub Actions YAML.' }
  ],
  deep: '## Why convert JSON to YAML\nJSON is machine-friendly but hard to read; YAML uses indentation to express hierarchy, which is more comfortable when writing config. Kubernetes, Docker Compose, and GitHub Actions almost all use YAML.\n## What this tool handles\n- Objects (key-value pairs) become indented key: value.\n- Arrays become lists starting with a dash.\n- Strings, numbers, booleans, and null are all expressed correctly.\n- Strings that need quotes get them automatically.\n## Usage tips\n- Make sure the JSON is valid before pasting (use a JSON validator first).\n- The result can be copied straight into a .yml file.\n## Privacy\nAll parsing happens locally in your browser; data is not uploaded.',
  body: textToolBody('{\n  "name": "freetoolset",\n  "tools": ["json", "yaml"],\n  "free": true\n}', 'Paste JSON here'),
  js: `    var input=document.getElementById('input'),out=document.getElementById('out'),btn=document.getElementById('btn'),copyBtn=document.getElementById('copyBtn'),clearBtn=document.getElementById('clearBtn');
    function isObj(v){return v&&typeof v==='object'&&!Array.isArray(v);}
    function scalar(v){if(v===null)return 'null';if(typeof v==='string'){if(/[:#\\-\\?\\\\[\\]\\{\\}>,|!%@\`"\\n]/.test(v)||v===''||/^\\s|\\s$/.test(v))return JSON.stringify(v);return v;}return String(v);}
    function serialize(val,indent){
      indent=indent||'';
      if(Array.isArray(val)){
        if(!val.length)return indent+'[]\\n';
        var s='';
        val.forEach(function(item){
          if(isObj(item)||Array.isArray(item)){var inner=serialize(item,indent+'  ');s+=indent+'- '+inner.slice((indent+'  ').length);}
          else s+=indent+'- '+scalar(item)+'\\n';
        });
        return s;
      }
      if(isObj(val)){
        var keys=Object.keys(val);
        if(!keys.length)return indent+'{}\\n';
        var o='';
        keys.forEach(function(k){var v=val[k];if(isObj(v)||Array.isArray(v))o+=indent+k+':\\n'+serialize(v,indent+'  ');else o+=indent+k+': '+scalar(v)+'\\n';});
        return o;
      }
      return indent+scalar(val)+'\\n';
    }
    function convert(){
      var txt=input.value.trim();
      if(!txt){out.value='';return;}
      try{var obj=JSON.parse(txt);out.value=serialize(obj).replace(/\\n$/,'')+'\\n';out.style.color='';}
      catch(e){out.value='';out.style.color='#ef4444';out.value='Invalid JSON: '+e.message;}
    }
    btn.addEventListener('click',convert);
    copyBtn.addEventListener('click',function(){if(out.value){out.select();document.execCommand('copy');}});
    clearBtn.addEventListener('click',function(){input.value='';out.value='';});
    convert();`
});

/* ---------- 2. HTML to Markdown ---------- */
T.push({
  slug: 'html-to-markdown', icon: '🔤', title: 'HTML to Markdown Converter', tagline: 'Turn HTML into Markdown',
  category: 'developer',
  desc: 'Convert HTML snippets into Markdown. Handles headings, bold/italic, links, lists, code blocks, blockquotes and images.',
  cardDesc: 'Convert HTML markup into Markdown for docs and READMEs.',
  keywords: 'html to markdown, html2md, markdown converter, rich text to md, html markdown',
  searchTerms: 'html to markdown convert rich text md docs',
  howto: ['Paste the HTML you want to convert.', 'Click Convert.', 'Copy the Markdown output.', 'Tweak manually if your HTML uses unusual tags.'],
  faq: [
    { q: 'Which tags are supported?', a: 'Headings (h1–h6), paragraphs, bold/italic, links, unordered/ordered lists, inline and block code, blockquotes, horizontal rules and images.' },
    { q: 'What about tables and divs?', a: 'Tables are flattened to their text content; presentational divs are unwrapped to their inner text. For complex layouts, light manual editing may be needed.' },
    { q: 'Is it safe for private HTML?', a: 'Yes — everything is parsed locally in your browser.' }
  ],
  zhfaq: [
    { q: 'Which tags are supported?', a: 'Headings (h1-h6), paragraphs, bold/italic, links, ordered/unordered lists, inline and code blocks, blockquotes, horizontal rules, and images.' },
    { q: 'How are tables and divs handled?', a: 'Tables are flattened to text content; layout-only divs are stripped to keep just their inner text. Complex layouts may need manual tweaking.' }
  ],
  usecases: [
    { icon: '📝', title: 'Docs', text: 'Paste from editors.' },
    { icon: '📚', title: 'README', text: 'Build fast docs.' },
    { icon: '✉️', title: 'Email', text: 'HTML to MD drafts.' }
  ],
  deep: '## Purpose\nMany rich-text editors and CMS exports are HTML, while docs sites, GitHub, and forums use Markdown. This tool converts between the two.\n## Conversion rules\n- Headings become the corresponding number of # marks.\n- Bold **text**, italic *text*.\n- Links [text](url), images ![alt](src).\n- Lists become - or 1. prefixes.\n- Code blocks are fenced with triple backticks.\n## Limits\nPure presentational tags (div/span styles) are ignored and only their text is kept; complex tables are reduced to text.\n## Privacy\nParsing happens locally in your browser.',
  body: textToolBody('<h2>Hello</h2>\\n<p>Visit <a href="https://example.com">our site</a>.</p>', 'Paste HTML here'),
  js: `    var input=document.getElementById('input'),out=document.getElementById('out'),btn=document.getElementById('btn'),copyBtn=document.getElementById('copyBtn'),clearBtn=document.getElementById('clearBtn');
    function inline(node){
      var s='';
      node.childNodes.forEach(function(n){
        if(n.nodeType===3){s+=n.nodeValue;}
        else if(n.nodeType===1){
          var t=n.tagName.toLowerCase();
          if(t==='strong'||t==='b')s+='**'+inline(n)+'**';
          else if(t==='em'||t==='i')s+='*'+inline(n)+'*';
          else if(t==='code')s+='\`'+n.textContent+'\`';
          else if(t==='a')s+='['+inline(n)+']('+(n.getAttribute('href')||'')+')';
          else if(t==='img')s+='!['+(n.getAttribute('alt')||'')+']('+(n.getAttribute('src')||'')+')';
          else if(t==='br')s+='  \\n';
          else s+=inline(n);
        }
      });
      return s;
    }
    function block(el){
      var tag=el.tagName?el.tagName.toLowerCase():'';
      if(tag==='h1')return '# '+inline(el)+'\\n\\n';
      if(tag==='h2')return '## '+inline(el)+'\\n\\n';
      if(tag==='h3')return '### '+inline(el)+'\\n\\n';
      if(tag==='h4')return '#### '+inline(el)+'\\n\\n';
      if(tag==='h5')return '##### '+inline(el)+'\\n\\n';
      if(tag==='h6')return '###### '+inline(el)+'\\n\\n';
      if(tag==='p')return inline(el)+'\\n\\n';
      if(tag==='hr')return '---\\n\\n';
      if(tag==='blockquote')return '> '+inline(el).replace(/\\n/g,'\\n> ')+'\\n\\n';
      if(tag==='pre')return '\`\`\`\\n'+el.textContent+'\\n\`\`\`\\n\\n';
      if(tag==='ul'||tag==='ol'){
        var items=Array.prototype.filter.call(el.children,function(c){return c.tagName&&c.tagName.toLowerCase()==='li';});
        var r='';items.forEach(function(li,i){r+=(tag==='ol'?(i+1)+'. ':'- ')+inline(li).trim()+'\\n';});return r+'\\n';
      }
      if(tag==='br')return '  \\n';
      if(tag==='img')return '!['+(el.getAttribute('alt')||'')+']('+(el.getAttribute('src')||'')+')\\n\\n';
      var inner='';
      Array.prototype.forEach.call(el.childNodes,function(n){
        if(n.nodeType===1)inner+=block(n);else if(n.nodeType===3)inner+=n.nodeValue;
      });
      return inner;
    }
    function convert(){
      var html=input.value.trim();
      if(!html){out.value='';return;}
      var div=document.createElement('div');div.innerHTML=html;
      var md='';div.childNodes.forEach(function(n){if(n.nodeType===1)md+=block(n);else if(n.nodeType===3)md+=n.nodeValue;});
      out.value=md.replace(/\\n{3,}/g,'\\n\\n').trim()+'\\n';
    }
    btn.addEventListener('click',convert);
    copyBtn.addEventListener('click',function(){if(out.value){out.select();document.execCommand('copy');}});
    clearBtn.addEventListener('click',function(){input.value='';out.value='';});
    convert();`
});

/* ---------- 3. Color Contrast Checker ---------- */
T.push({
  slug: 'color-contrast-checker', icon: '🎨', title: 'Color Contrast Checker', tagline: 'WCAG AA / AAA compliance',
  category: 'developer', popular: 'Popular',
  desc: 'Check the contrast ratio between two colors and see if your text meets WCAG AA and AAA accessibility standards.',
  cardDesc: 'Test color contrast for WCAG AA / AAA accessibility.',
  keywords: 'color contrast checker, wcag contrast, accessibility contrast, contrast ratio, color contrast tool',
  searchTerms: 'color contrast wcag accessibility ratio checker',
  howto: ['Pick or enter the foreground (text) color.', 'Pick or enter the background color.', 'Click Check.', 'Read the ratio and the AA / AAA pass/fail badges.'],
  faq: [
    { q: 'What contrast ratio is required?', a: 'WCAG AA needs 4.5:1 for normal text and 3:1 for large text (≥24px or ≥18.66px bold). AAA needs 7:1 and 4.5:1 respectively.' },
    { q: 'How is the ratio calculated?', a: 'It uses the relative luminance of each color (sRGB → linear RGB → luminance) then (Llighter+0.05)/(Ddarker+0.05).' },
    { q: 'Does this apply to buttons and icons?', a: 'Contrast rules mainly target text and essential UI components. Non-text contrast (e.g. button borders) has a 3:1 guideline.' }
  ],
  zhfaq: [
    { q: 'How much contrast do I need?', a: 'WCAG AA requires 4.5:1 for body text and 3:1 for large text (at least 24px or 18.66px bold); AAA requires 7:1 and 4.5:1.' },
    { q: 'How is the ratio calculated?', a: 'Using each color\'s relative luminance (sRGB to linear RGB to luminance), the formula is (lighter + 0.05) / (darker + 0.05).' }
  ],
  usecases: [
    { icon: '♿', title: 'Accessibility', text: 'Meet WCAG rules.' },
    { icon: '🌐', title: 'Web design', text: 'Pick readable colors.' },
    { icon: '📱', title: 'UI', text: 'Contrast for buttons.' }
  ],
  deep: '## Why contrast matters\nEnough contrast lets users with poor vision, in bright environments, or who are older read text clearly; it is a basic requirement of accessible design.\n## WCAG standards\n- AA normal text: at least 4.5:1\n- AA large text: at least 3:1\n- AAA normal text: at least 7:1\n- AAA large text: at least 4.5:1\n## How it is calculated\nFirst convert sRGB to linear values, then compute relative luminance L = 0.2126R + 0.7152G + 0.0722B, and finally the ratio = (L1 + 0.05) / (L2 + 0.05).\n## Tip\nPure black on pure white is about 21:1, far above typical needs; light-gray text on a white background often fails.',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="fg">Text (foreground) color</label>
            <input type="color" id="fg" value="#222222">
            <input type="text" id="fgHex" value="#222222" style="margin-top:6px">
          </div>
          <div class="form-row">
            <label for="bg">Background color</label>
            <input type="color" id="bg" value="#ffffff">
            <input type="text" id="bgHex" value="#ffffff" style="margin-top:6px">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Check</button>
        </div>
        <div id="out"></div>`,
  js: `    var fg=document.getElementById('fg'),bg=document.getElementById('bg'),fgHex=document.getElementById('fgHex'),bgHex=document.getElementById('bgHex'),out=document.getElementById('out'),btn=document.getElementById('btn');
    function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c;}).join('');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
    function lum(rgb){var a=rgb.map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];}
    function ratio(c1,c2){var L1=lum(c1),L2=lum(c2);var hi=Math.max(L1,L2),lo=Math.min(L1,L2);return (hi+0.05)/(lo+0.05);}
    function badge(ok,label){return '<span style="display:inline-block;padding:4px 10px;border-radius:999px;font-size:.85rem;font-weight:700;color:#fff;background:'+(ok?'#22c55e':'#ef4444')+'">'+label+'</span>';}
    function check(){
      var c1,c2;
      try{c1=hex2rgb(fgHex.value);c2=hex2rgb(bgHex.value);}catch(e){out.innerHTML='<div style="color:#ef4444">Enter valid hex colors like #336699</div>';return;}
      var r=ratio(c1,c2);
      out.innerHTML='<div style="display:flex;gap:16px;align-items:center;margin:6px 0 14px">'+
        '<div style="flex:1;padding:24px;text-align:center;background:'+bgHex.value+';color:'+fgHex.value+';border-radius:10px;font-weight:700;border:1px solid var(--border)">Aa Sample Text</div>'+
        '<div style="font-size:2rem;font-weight:800">'+r.toFixed(2)+':1</div></div>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
        badge(r>=4.5,'AA Normal')+badge(r>=3,'AA Large')+badge(r>=7,'AAA Normal')+badge(r>=4.5,'AAA Large')+'</div>';
    }
    fg.addEventListener('input',function(){fgHex.value=fg.value;check();});bg.addEventListener('input',function(){bgHex.value=bg.value;check();});
    fgHex.addEventListener('input',function(){fg.value=fgHex.value;check();});bgHex.addEventListener('input',function(){bg.value=bgHex.value;check();});
    btn.addEventListener('click',check);check();`
});

/* ---------- 4. User Agent Parser ---------- */
T.push({
  slug: 'user-agent-parser', icon: '🕵️', title: 'User Agent Parser', tagline: 'Decode any User-Agent string',
  category: 'developer',
  desc: 'Parse a User-Agent string to reveal the browser, operating system, device type and rendering engine.',
  cardDesc: 'Decode browser, OS, device and engine from a UA string.',
  keywords: 'user agent parser, user-agent analyzer, ua parser, browser detector, parse useragent',
  searchTerms: 'user agent parser analyzer ua browser os detect',
  howto: ['Paste a User-Agent string.', 'Click Parse.', 'Read the extracted browser, OS, device and engine.', 'Use the sample button to load an example.'],
  faq: [
    { q: 'Is UA parsing reliable?', a: 'It is heuristic — based on known tokens. Modern browsers also "lie" via UA reduction, so results are best-effort, not guaranteed.' },
    { q: 'What can a UA tell me?', a: 'Roughly the browser family/version, OS, whether it is mobile/tablet/desktop, and the rendering engine (Blink, WebKit, Gecko).' },
    { q: 'Should I block users by UA?', a: 'Not recommended — UAs are easily spoofed. Use feature detection or server-side capability checks instead.' }
  ],
  zhfaq: [
    { q: 'Is UA parsing reliable?', a: 'It is a heuristic judgment based on known signature strings. Modern browsers are also reducing UA info (UA reduction), so results are for reference only, not absolutely accurate.' },
    { q: 'What can a UA tell you?', a: 'Roughly the browser family and version, operating system, whether the device is phone/tablet/desktop, and the rendering engine (Blink, WebKit, Gecko).' }
  ],
  usecases: [
    { icon: '📊', title: 'Analytics', text: 'Understand visitors.' },
    { icon: '🐛', title: 'Debug', text: 'Reproduce issues.' },
    { icon: '🤖', title: 'Bots', text: 'Spot crawlers.' }
  ],
  deep: '## What is a User-Agent\nA UA is a self-describing text string a browser sends when visiting a site, containing info about the browser, engine, and operating system.\n## Parsing logic\nThis tool uses a set of regular expressions to match common signatures: Chrome/Edge/Firefox/Safari, Windows/macOS/iOS/Android/Linux, Blink/WebKit/Gecko engines, and iPhone/iPad/Android devices.\n## Limits and notes\n- A UA can be faked and must not be used as a security basis.\n- Browsers are gradually reducing UA info (UA reduction), so less will be parseable in future.\n- Results are for reference only.',
  body: `        <div class="form-row">
          <label for="input">User-Agent string</label>
          <textarea id="input" rows="4" placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ..."></textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Parse</button>
          <button class="btn btn-secondary" id="sampleBtn">Load sample</button>
        </div>
        <div id="out"></div>`,
  js: `    var input=document.getElementById('input'),out=document.getElementById('out'),btn=document.getElementById('btn'),sampleBtn=document.getElementById('sampleBtn');
    function parse(ua){
      ua=ua||'';
      var browser='Unknown',version='',os='Unknown',device='Desktop',engine='Unknown';
      if(/Edg\\//.test(ua)){browser='Edge';version=(ua.match(/Edg\\/([\\d.]+)/)||[])[1]||'';}
      else if(/OPR\\/|Opera/.test(ua)){browser='Opera';version=(ua.match(/(?:OPR\\/|Opera\\/)([\\d.]+)/)||[])[1]||'';}
      else if(/Firefox\\//.test(ua)){browser='Firefox';version=(ua.match(/Firefox\\/([\\d.]+)/)||[])[1]||'';}
      else if(/Chrome\\//.test(ua)){browser='Chrome';version=(ua.match(/Chrome\\/([\\d.]+)/)||[])[1]||'';}
      else if(/Safari\\//.test(ua)){browser='Safari';version=(ua.match(/Version\\/([\\d.]+)/)||[])[1]||'';}
      if(/Windows NT 10/.test(ua))os='Windows 10/11';else if(/Windows NT/.test(ua))os='Windows';else if(/Mac OS X/.test(ua))os='macOS';else if(/Android/.test(ua))os='Android';else if(/(iPhone|iPad|iPod)/.test(ua))os='iOS';else if(/Linux/.test(ua))os='Linux';
      if(/Blink|Chrome\\/|Edg\\/|OPR\\//.test(ua))engine='Blink';else if(/WebKit/.test(ua))engine='WebKit';else if(/Gecko\\/|Firefox/.test(ua))engine='Gecko';
      if(/iPhone|iPod/.test(ua))device='Mobile (iPhone)';else if(/iPad/.test(ua))device='Tablet (iPad)';else if(/Android/.test(ua)&&/Mobile/.test(ua))device='Mobile (Android)';else if(/Android/.test(ua))device='Tablet (Android)';
      return [['Browser',browser+' '+(version||'')],['Operating System',os],['Device',device],['Engine',engine]];
    }
    function render(){
      var rows=parse(input.value);
      out.innerHTML='<div style="display:grid;gap:8px;margin-top:6px">'+rows.map(function(r){return '<div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:8px"><span style="opacity:.7">'+r[0]+'</span><strong>'+r[1].trim()+'</strong></div>';}).join('')+'</div>';
    }
    btn.addEventListener('click',render);
    sampleBtn.addEventListener('click',function(){input.value='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0';render();});
    render();`
});

/* ---------- 5. JWT Encoder ---------- */
T.push({
  slug: 'jwt-encoder', icon: '🔐', title: 'JWT Encoder', tagline: 'Create HS256 JSON Web Tokens',
  category: 'developer',
  desc: 'Build a signed JWT (header.payload.signature) using HMAC-SHA256. Enter a JSON payload and a secret — signing happens in your browser.',
  cardDesc: 'Create HS256 JWT tokens with HMAC-SHA256 signing in your browser.',
  keywords: 'jwt encoder, create jwt, jwt generator, hs256 sign, json web token',
  searchTerms: 'jwt encoder generator hs256 hmac sign token',
  howto: ['Enter a JSON payload.', 'Enter a secret key.', 'Click Generate to sign with HS256.', 'Copy the resulting token.'],
  faq: [
    { q: 'What algorithm does this use?', a: 'HMAC-SHA256 (HS256). The token is signed, not encrypted — anyone with the token can read the payload, only the secret proves it was signed by you.' },
    { q: 'Is the secret sent anywhere?', a: 'No. All signing uses the Web Crypto API in your browser; the secret never leaves your device.' },
    { q: 'Can I verify a token here too?', a: 'This tool focuses on encoding/signing. For verification, compare the signature with your backend or a verify tool.' }
  ],
  zhfaq: [
    { q: 'What algorithm is used?', a: 'HMAC-SHA256 (HS256). The token is signed, not encrypted - anyone can read the payload, but only the secret proves the signature came from you.' },
    { q: 'Is the secret uploaded?', a: 'No. Signing is done entirely with the browser\'s built-in Web Crypto API, and the secret always stays on your device.' }
  ],
  usecases: [
    { icon: '🔑', title: 'Auth debug', text: 'Test API tokens.' },
    { icon: '🧪', title: ' prototyping', text: 'Mock auth flows.' },
    { icon: '📚', title: 'Learning', text: 'See JWT structure.' }
  ],
  deep: '## JWT structure\nA JWT has three parts joined by dots: header (algorithm and type), payload (claim data), and signature.\n## Signing process (HS256)\n1. base64url-encode the header and payload.\n2. Concatenate data = encHeader + "." + encPayload.\n3. Apply HMAC-SHA256 to data using the secret.\n4. base64url-encode the signature to get token = data + "." + sig.\n## Important reminders\n- A JWT is signed, not encrypted; the payload can be read by anyone.\n- Do not put sensitive information in the payload.\n- This tool signs only in your local browser; the secret is not uploaded.',
  body: `        <div class="form-row">
          <label for="payload">Payload (JSON)</label>
          <textarea id="payload" rows="6" placeholder='{"sub":"123","name":"Ada","admin":true}'>{"sub":"1234567890","name":"FreeToolset","iat":1516239022}</textarea>
        </div>
        <div class="form-row">
          <label for="secret">Secret</label>
          <input type="text" id="secret" value="my-secret-key">
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Generate</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="form-row">
          <label for="out">Token</label>
          <textarea id="out" rows="5" readonly placeholder="Signed JWT appears here"></textarea>
        </div>`,
  js: `    var payload=document.getElementById('payload'),secret=document.getElementById('secret'),out=document.getElementById('out'),btn=document.getElementById('btn'),copyBtn=document.getElementById('copyBtn');
    function b64url(str){return btoa(unescape(encodeURIComponent(str))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');}
    function b64urlBytes(bytes){var s='';bytes.forEach(function(b){s+=String.fromCharCode(b);});return btoa(s).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');}
    async function gen(){
      var p;try{p=JSON.parse(payload.value);}catch(e){out.value='Invalid JSON payload: '+e.message;out.style.color='#ef4444';return;}
      out.style.color='';
      var header={alg:'HS256',typ:'JWT'};
      var data=b64url(JSON.stringify(header))+'.'+b64url(JSON.stringify(p));
      try{
        var key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
        var sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(data));
        out.value=data+'.'+b64urlBytes(new Uint8Array(sig));
      }catch(e){out.value='Signing failed (Web Crypto requires a secure/https context): '+e.message;out.style.color='#ef4444';}
    }
    btn.addEventListener('click',gen);
    copyBtn.addEventListener('click',function(){if(out.value){out.select();document.execCommand('copy');}});
    gen();`
});

/* ---------- 6. XML to JSON ---------- */
T.push({
  slug: 'xml-to-json', icon: '🔄', title: 'XML to JSON Converter', tagline: 'Convert XML into JSON',
  category: 'developer',
  desc: 'Convert XML into JSON for easier parsing in JavaScript and other languages. Attributes, nested elements and text are preserved.',
  cardDesc: 'Turn XML into JSON, keeping attributes and structure.',
  keywords: 'xml to json, xml2json, convert xml, xml parser, soap to json',
  searchTerms: 'xml to json convert parser attributes',
  howto: ['Paste your XML.', 'Click Convert.', 'Copy the JSON result.', 'Fix any well-formedness error shown.'],
  faq: [
    { q: 'How are attributes handled?', a: 'Attributes are placed under an "@attributes" object on the element. Repeated sibling elements with the same tag become an array.' },
    { q: 'What about the root element?', a: 'The root tag name is preserved as the top-level key in the output object.' },
    { q: 'Does it need valid XML?', a: 'Yes — the XML must be well-formed (matched tags, quoted attributes). The browser parser will report errors otherwise.' }
  ],
  zhfaq: [
    { q: 'How are attributes handled?', a: 'Attributes go under that element\'s "@attributes" object; same-name sibling elements are merged into an array.' },
    { q: 'How is the root element kept?', a: 'The outermost key of the output JSON preserves the root tag name.' }
  ],
  usecases: [
    { icon: '📡', title: 'APIs', text: 'SOAP/XML → JSON.' },
    { icon: '🗂️', title: 'Config', text: 'Parse XML feeds.' },
    { icon: '🧩', title: 'Integration', text: 'Bridge systems.' }
  ],
  deep: '## Why convert\nMany legacy systems, bank interfaces, and RSS still output XML, while modern front ends prefer JSON. After conversion it is easier to process.\n## Mapping rules\n- Elements become object keys.\n- Attributes become an "@attributes" sub-object.\n- Text becomes "#text".\n- Same-name sibling elements become an array.\n## Notes\n- XML must be well-formed (matched tags, quoted attributes).\n- Conversion happens locally in your browser; data is not uploaded.',
  body: textToolBody('<note><to>Ada</to><from>Bob</from><body>Hi!</body></note>', 'Paste XML here'),
  js: `    var input=document.getElementById('input'),out=document.getElementById('out'),btn=document.getElementById('btn'),copyBtn=document.getElementById('copyBtn'),clearBtn=document.getElementById('clearBtn');
    function xml2obj(el){
      var result={};
      if(el.attributes&&el.attributes.length){result['@attributes']={};for(var i=0;i<el.attributes.length;i++)result['@attributes'][el.attributes[i].name]=el.attributes[i].value;}
      var childEls=[];for(var j=0;j<el.childNodes.length;j++){if(el.childNodes[j].nodeType===1)childEls.push(el.childNodes[j]);}
      if(childEls.length===0){var txt=(el.textContent||'').trim();if(result['@attributes'])result['#text']=txt;else return txt;return result;}
      var map={};
      childEls.forEach(function(c){var name=c.tagName;var val=xml2obj(c);if(map[name]){if(!Array.isArray(map[name]))map[name]=[map[name]];map[name].push(val);}else map[name]=val;});
      for(var k in map)result[k]=map[k];
      return result;
    }
    function convert(){
      var xml=input.value.trim();if(!xml){out.value='';return;}
      try{
        var doc=new DOMParser().parseFromString(xml,'application/xml');
        var err=doc.querySelector('parsererror');if(err)throw new Error(err.textContent.slice(0,120));
        var root=doc.documentElement;
        var obj={};obj[root.tagName]=xml2obj(root);
        out.value=JSON.stringify(obj,null,2);out.style.color='';
      }catch(e){out.value='';out.style.color='#ef4444';out.value='XML error: '+e.message;}
    }
    btn.addEventListener('click',convert);
    copyBtn.addEventListener('click',function(){if(out.value){out.select();document.execCommand('copy');}});
    clearBtn.addEventListener('click',function(){input.value='';out.value='';});
    convert();`
});

/* ---------- 7. Image Resizer ---------- */
T.push({
  slug: 'image-resizer', icon: '🖼️', title: 'Image Resizer', tagline: 'Resize images in your browser',
  category: 'developer',
  desc: 'Resize a JPG/PNG/WEBP image to a target width or height. Processing is done locally with the Canvas API — your photo never leaves the device.',
  cardDesc: 'Resize images to a target size, right in your browser.',
  keywords: 'image resizer, resize photo, image size changer, shrink image, canvas resizer',
  searchTerms: 'image resizer resize photo shrink picture',
  howto: ['Choose an image file.', 'Set a target width (height auto) or both.', 'Click Resize.', 'Download the result.'],
  faq: [
    { q: 'Is my image uploaded?', a: 'No. The file is read and processed entirely in your browser via the Canvas API. Nothing is sent to a server.' },
    { q: 'What formats are supported?', a: 'Input: most browsers accept JPG, PNG and WEBP. Output is PNG by default to avoid quality loss; you can switch to JPG.' },
    { q: 'Will resizing reduce quality?', a: 'Downscaling generally looks good. Upscaling beyond the original size can look blurry because no new detail is invented.' }
  ],
  zhfaq: [
    { q: 'Are images uploaded?', a: 'No. Files are read and processed locally in your browser via the Canvas API and are never sent to a server.' },
    { q: 'Which formats are supported?', a: 'Inputs usually support JPG, PNG, and WEBP; output defaults to PNG to avoid quality loss, with JPG also available.' }
  ],
  usecases: [
    { icon: '📧', title: 'Email', text: 'Shrink attachments.' },
    { icon: '🌐', title: 'Web', text: 'Optimise for speed.' },
    { icon: '📱', title: 'Social', text: 'Fit upload limits.' }
  ],
  deep: '## How it works\nRead the image file, draw it on a Canvas at the target size, then export as an image. The whole flow happens in your browser, so it is private.\n## Usage tips\n- Fill in only the width and the height is calculated proportionally.\n- Shrinking images for the web noticeably speeds up pages.\n- Enlarging beyond the original size gets blurry.\n## Privacy\nImages are not uploaded; processing is local.',
  body: `        <div class="form-row">
          <label for="file">Choose image</label>
          <input type="file" id="file" accept="image/*">
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="w">Width (px, blank = auto)</label>
            <input type="number" id="w" placeholder="e.g. 800" min="1">
          </div>
          <div class="form-row">
            <label for="h">Height (px, blank = auto)</label>
            <input type="number" id="h" placeholder="e.g. 600" min="1">
          </div>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="fmt">Output format</label>
            <select id="fmt"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option></select>
          </div>
          <div class="form-row">
            <label for="q">JPG/WEBP quality</label>
            <input type="number" id="q" value="0.9" min="0.1" max="1" step="0.1">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Resize</button>
        </div>
        <div id="out"></div>`,
  js: `    var file=document.getElementById('file'),w=document.getElementById('w'),h=document.getElementById('h'),fmt=document.getElementById('fmt'),q=document.getElementById('q'),out=document.getElementById('out'),btn=document.getElementById('btn');
    var img=null,srcUrl=null;
    file.addEventListener('change',function(){var f=file.files[0];if(!f)return;if(srcUrl)URL.revokeObjectURL(srcUrl);srcUrl=URL.createObjectURL(f);img=new Image();img.onload=function(){w.placeholder=img.naturalWidth;h.placeholder=img.naturalHeight;};img.src=srcUrl;});
    function resize(){
      if(!img){out.innerHTML='<div style="color:#ef4444">Choose an image first.</div>';return;}
      var W=parseInt(w.value)||0,H=parseInt(h.value)||0;
      if(!W&&!H){W=img.naturalWidth;}
      if(!W)W=Math.round(img.naturalWidth*(H/img.naturalHeight));
      if(!H)H=Math.round(img.naturalHeight*(W/img.naturalWidth));
      var c=document.createElement('canvas');c.width=W;c.height=H;var ctx=c.getContext('2d');ctx.drawImage(img,0,0,W,H);
      var url=c.toDataURL(fmt.value,parseFloat(q.value));
      var ext=fmt.value.split('/')[1];
      out.innerHTML='<div style="margin:8px 0">Resized to '+W+' × '+H+' px</div>'+
        '<img src="'+url+'" style="max-width:100%;border:1px solid var(--border);border-radius:8px;margin-bottom:10px">'+
        '<br><a class="btn btn-secondary" download="resized.'+ext+'" href="'+url+'">Download</a>';
    }
    btn.addEventListener('click',resize);`
});

/* ---------- 8. Color Palette Generator ---------- */
T.push({
  slug: 'color-palette-generator', icon: '🌈', title: 'Color Palette Generator', tagline: 'Build harmonious palettes',
  category: 'developer',
  desc: 'Generate a harmonious color palette from a base color — tints, shades, complementary and analogous colors, with copy-ready hex codes.',
  cardDesc: 'Create tints, shades and harmonies from one base color.',
  keywords: 'color palette generator, palette from color, color scheme, hex palette, design colors',
  searchTerms: 'color palette generator scheme harmony hex',
  howto: ['Pick or enter a base color.', 'Click Generate.', 'See the palette of tints, shades and harmonies.', 'Click any swatch to copy its hex.'],
  faq: [
    { q: 'What harmonies does it produce?', a: 'It shows lighter tints and darker shades of your base, plus the complementary (opposite) color and two analogous neighbors on the color wheel.' },
    { q: 'Are the colors accessible together?', a: 'Not automatically — pair them with the Color Contrast Checker if you need text/background combinations to meet WCAG.' },
    { q: 'Can I use these in CSS?', a: 'Yes — every swatch shows a hex code you can paste straight into CSS or design tools.' }
  ],
  zhfaq: [
    { q: 'Which harmonized colors are generated?', a: 'It shows the base color\'s tint (lighter) and shade (darker), plus the complement (opposite on the wheel) and two analogous colors.' },
    { q: 'Are these pairings readable?', a: 'Not guaranteed. For text/background combos that meet accessibility standards, use the color contrast checker together.' }
  ],
  usecases: [
    { icon: '🎨', title: 'Web UI', text: 'Theme colors.' },
    { icon: '🖌️', title: 'Branding', text: 'Quick schemes.' },
    { icon: '📐', title: 'Prototypes', text: 'Mock palettes.' }
  ],
  deep: '## Color basics\nTo generate harmonized colors from a base, common approaches are:\n- Tint: mix with white to lighten.\n- Shade: mix with black to darken.\n- Complement: 180 degrees across the wheel.\n- Analogous: within about 30 degrees on the wheel.\n## Why HSL helps\nAdjusting lightness/saturation in HSL space is more intuitive than editing RGB directly, so this tool generates steps in HSL.\n## Usage\nClick a swatch to copy its hex, ready for CSS or design files.',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="base">Base color</label>
            <input type="color" id="base" value="#4f46e5">
            <input type="text" id="baseHex" value="#4f46e5" style="margin-top:6px">
          </div>
          <div class="form-row">
            <label for="count">Shades per row</label>
            <input type="number" id="count" value="5" min="3" max="9">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Generate</button>
        </div>
        <div id="out"></div>`,
  js: `    var base=document.getElementById('base'),baseHex=document.getElementById('baseHex'),count=document.getElementById('count'),out=document.getElementById('out'),btn=document.getElementById('btn');
    function hex2hsl(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c;}).join('');var r=parseInt(h.substr(0,2),16)/255,g=parseInt(h.substr(2,2),16)/255,b=parseInt(h.substr(4,2),16)/255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,s=0,hh=0;if(mx!==mn){var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);if(mx===r)hh=(g-b)/d+(g<b?6:0);else if(mx===g)hh=(b-r)/d+2;else hh=(r-g)/d+4;hh/=6;}return [hh*360,s*100,l*100];}
    function hsl2hex(hh,s,l){hh/=360;s/=100;l/=100;var r,g,b;if(s===0){r=g=b=l;}else{var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;var hue=function(t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};r=hue(hh+1/3);g=hue(hh);b=hue(hh-1/3);}var to=function(x){return ('0'+Math.round(x*255).toString(16)).slice(-2);};return '#'+to(r)+to(g)+to(b);}
    function row(arr,title){return '<div style="margin-bottom:14px"><div style="font-size:.85rem;opacity:.7;margin-bottom:6px">'+title+'</div><div style="display:flex;gap:8px;flex-wrap:wrap">'+arr.map(function(c){return '<div title="'+c+'" style="cursor:pointer;flex:1;min-width:60px;height:64px;border-radius:8px;background:'+c+';border:1px solid var(--border)" onclick="(function(){var t=document.createElement(\\'textarea\\');t.value=\\''+c+'\\';document.body.appendChild(t);t.select();document.execCommand(\\'copy\\');t.remove();})(this)"><div style="font-size:.7rem;padding:4px;color:'+(c+'').toLowerCase()+';mix-blend-mode:difference;filter:invert(1)">'+c+'</div></div>';}).join('')+'</div></div>';}
    function gen(){
      var hsl=hex2hsl(baseHex.value);var n=Math.max(3,Math.min(9,parseInt(count.value)||5));
      var shades=[],tints=[];
      for(var i=0;i<n;i++){var l=Math.round((i+1)/(n+1)*100);tints.push(hsl2hex(hsl[0],hsl[1],l));}
      shades=[hsl2hex(hsl[0],hsl[1],Math.max(8,hsl[2]*0.8))];for(var j=1;j<n;j++)shades.push(hsl2hex(hsl[0],hsl[1],Math.max(4,hsl[2]*(1-j*0.18))));
      var comp=hsl2hex((hsl[0]+180)%360,hsl[1],hsl[2]);
      var ana1=hsl2hex((hsl[0]+30)%360,hsl[1],hsl[2]),ana2=hsl2hex((hsl[0]+330)%360,hsl[1],hsl[2]);
      out.innerHTML=row([baseHex.value].concat(tints),'Base + Tints')+row(shades,'Shades')+row([comp,ana1,ana2],'Harmonies (complementary · analogous)');
    }
    base.addEventListener('input',function(){baseHex.value=base.value;gen();});
    baseHex.addEventListener('input',function(){base.value=baseHex.value;gen();});
    count.addEventListener('input',gen);btn.addEventListener('click',gen);gen();`
});

/* ---------- 9. Image Rotate & Flip ---------- */
T.push({
  slug: 'image-rotate-flip', icon: '🔁', title: 'Image Rotate & Flip', tagline: 'Rotate or flip images locally',
  category: 'developer',
  desc: 'Rotate an image 90°, 180°, 270° or flip it horizontally / vertically. Runs entirely in your browser.',
  cardDesc: 'Rotate and flip images with the Canvas API, locally.',
  keywords: 'image rotate, flip image, rotate photo, image orientation, canvas rotate',
  searchTerms: 'image rotate flip photo orientation canvas',
  howto: ['Choose an image file.', 'Click Rotate 90° / 180° / 270°.', 'Or Flip Horizontal / Vertical.', 'Download the corrected image.'],
  faq: [
    { q: 'Will this fix phone photos that look sideways?', a: 'Yes — rotate until the orientation is correct, then download. Note this does not read EXIF orientation automatically; you choose the angle.' },
    { q: 'Is the image uploaded?', a: 'No. All rotation is done locally with Canvas.' },
    { q: 'What format is the output?', a: 'PNG by default to preserve quality; you can choose JPG.' }
  ],
  zhfaq: [
    { q: 'Can it fix a photo taken at an angle on my phone?', a: 'Yes. Rotate manually to the correct angle and download. Note this tool does not auto-read EXIF orientation; you choose the angle.' },
    { q: 'Are images uploaded?', a: 'No. All rotation is done locally on the Canvas.' }
  ],
  usecases: [
    { icon: '📷', title: 'Fix tilt', text: 'Straighten photos.' },
    { icon: '🪞', title: 'Mirror', text: 'Flip for effect.' },
    { icon: '📄', title: 'Docs', text: 'Reorient scans.' }
  ],
  deep: '## How it works\nUse the Canvas rotate/scale transform to redraw the image onto a new canvas; after rotation the canvas dimensions swap accordingly (width and height swap at 90 or 270 degrees).\n## Tips\n- This tool does not auto-read EXIF; choose the angle manually.\n- Output defaults to PNG to preserve quality, with JPG optional.\n- Fully local processing; not uploaded.',
  body: `        <div class="form-row">
          <label for="file">Choose image</label>
          <input type="file" id="file" accept="image/*">
        </div>
        <div class="btn-row">
          <button class="btn btn-secondary" id="r90">Rotate 90°</button>
          <button class="btn btn-secondary" id="r180">Rotate 180°</button>
          <button class="btn btn-secondary" id="r270">Rotate 270°</button>
        </div>
        <div class="btn-row">
          <button class="btn btn-secondary" id="fh">Flip Horizontal</button>
          <button class="btn btn-secondary" id="fv">Flip Vertical</button>
          <button class="btn btn-primary" id="dl">Download</button>
        </div>
        <div id="out"></div>`,
  js: `    var file=document.getElementById('file'),out=document.getElementById('out'),img=null,srcUrl=null,cur=null;
    var angle=0,fx=1,fy=1;
    file.addEventListener('change',function(){var f=file.files[0];if(!f)return;if(srcUrl)URL.revokeObjectURL(srcUrl);srcUrl=URL.createObjectURL(f);img=new Image();img.onload=function(){angle=0;fx=1;fy=1;render();};img.src=srcUrl;});
    function render(){
      if(!img){out.innerHTML='<div style="color:#ef4444">Choose an image first.</div>';return;}
      var swap=(angle%180!==0);var W=swap?img.naturalHeight:img.naturalWidth,H=swap?img.naturalWidth:img.naturalHeight;
      var c=document.createElement('canvas');c.width=W;c.height=H;var ctx=c.getContext('2d');
      ctx.translate(W/2,H/2);ctx.rotate(angle*Math.PI/180);ctx.scale(fx,fy);ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2);
      cur=c.toDataURL('image/png');
      out.innerHTML='<img src="'+cur+'" style="max-width:100%;border:1px solid var(--border);border-radius:8px">';
    }
    document.getElementById('r90').onclick=function(){angle=(angle+90)%360;render();};
    document.getElementById('r180').onclick=function(){angle=(angle+180)%360;render();};
    document.getElementById('r270').onclick=function(){angle=(angle+270)%360;render();};
    document.getElementById('fh').onclick=function(){fx*=-1;render();};
    document.getElementById('fv').onclick=function(){fy*=-1;render();};
    document.getElementById('dl').onclick=function(){if(!cur)return;var a=document.createElement('a');a.href=cur;a.download='rotated.png';a.click();};`
});

/* ---------- 10. Image Cropper ---------- */
T.push({
  slug: 'image-cropper', icon: '✂️', title: 'Image Cropper', tagline: 'Crop to a ratio, locally',
  category: 'developer',
  desc: 'Crop an image to a chosen aspect ratio (1:1, 4:3, 16:9 and more) or free size. All processing stays in your browser.',
  cardDesc: 'Crop images to a preset aspect ratio in your browser.',
  keywords: 'image cropper, crop photo, aspect ratio crop, picture cropper, canvas crop',
  searchTerms: 'image cropper crop photo aspect ratio',
  howto: ['Choose an image.', 'Pick an aspect ratio (or Original).', 'Click Crop to cut the centered region.', 'Download the result.'],
  faq: [
    { q: 'Does it crop from the center?', a: 'Yes — the largest centered rectangle of the chosen ratio is used, so nothing important at the edges is lost unexpectedly.' },
    { q: 'Can I crop a free rectangle?', a: 'This tool uses preset ratios for reliability. For pixel-precise cropping, choose Original (no change) and use an editor.' },
    { q: 'Is my photo uploaded?', a: 'No — cropping is done locally with Canvas.' }
  ],
  zhfaq: [
    { q: 'Is it cropped from the center?', a: 'Yes. The tool takes the largest centered rectangle for the chosen ratio, avoiding accidentally cutting off the center.' },
    { q: 'Can I drag freely to crop?', a: 'For reliability this tool uses preset ratios. For pixel-level free cropping, pick Original (no crop) and use another editor.' }
  ],
  usecases: [
    { icon: '🟣', title: 'Avatars', text: 'Square crops.' },
    { icon: '🖥️', title: 'Covers', text: '16:9 banners.' },
    { icon: '📷', title: 'Social', text: 'Perfect framing.' }
  ],
  deep: '## How it works\nCompute the largest centered rectangle for the target ratio and draw that region to a new canvas, then export.\n## Ratio guide\n- 1:1 square (avatars)\n- 4:3 / 3:4 general photos\n- 16:9 / 9:16 landscape/portrait covers\n- Original (no crop)\n## Privacy\nLocal processing; images are not uploaded.',
  body: `        <div class="form-row">
          <label for="file">Choose image</label>
          <input type="file" id="file" accept="image/*">
        </div>
        <div class="form-row">
          <label for="ratio">Aspect ratio</label>
          <select id="ratio">
            <option value="0">Original (no crop)</option>
            <option value="1">1:1 Square</option>
            <option value="1.3333">4:3</option>
            <option value="0.75">3:4</option>
            <option value="1.7778" selected>16:9</option>
            <option value="0.5625">9:16</option>
          </select>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Crop</button>
        </div>
        <div id="out"></div>`,
  js: `    var file=document.getElementById('file'),ratio=document.getElementById('ratio'),out=document.getElementById('out'),btn=document.getElementById('btn'),img=null,srcUrl=null;
    file.addEventListener('change',function(){var f=file.files[0];if(!f)return;if(srcUrl)URL.revokeObjectURL(srcUrl);srcUrl=URL.createObjectURL(f);img=new Image();img.onload=function(){out.innerHTML='Image loaded ('+img.naturalWidth+'×'+img.naturalHeight+'). Pick a ratio and Crop.';};img.src=srcUrl;});
    function crop(){
      if(!img){out.innerHTML='<div style="color:#ef4444">Choose an image first.</div>';return;}
      var r=parseFloat(ratio.value);var W=img.naturalWidth,H=img.naturalHeight,cw=W,ch=H;
      if(r>0){if(W/H>r){cw=Math.round(H*r);ch=H;}else{ch=Math.round(W/r);cw=W;}}
      var sx=Math.round((W-cw)/2),sy=Math.round((H-ch)/2);
      var c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(img,sx,sy,cw,ch,0,0,cw,ch);
      var url=c.toDataURL('image/png');
      out.innerHTML='<div style="margin:8px 0">Cropped '+cw+' × '+ch+' px</div><img src="'+url+'" style="max-width:100%;border:1px solid var(--border);border-radius:8px;margin-bottom:10px"><br><a class="btn btn-secondary" download="cropped.png" href="'+url+'">Download</a>';
    }
    btn.addEventListener('click',crop);`
});

/* ---------- 11. CSV to Markdown ---------- */
T.push({
  slug: 'csv-to-markdown', icon: '📊', title: 'CSV to Markdown Table', tagline: 'Convert CSV into MD tables',
  category: 'developer',
  desc: 'Convert a CSV file or pasted text into a Markdown table. Handles quoted fields, commas and embedded newlines.',
  cardDesc: 'Turn CSV data into a Markdown table for docs.',
  keywords: 'csv to markdown, csv2md, markdown table, csv converter, spreadsheet to md',
  searchTerms: 'csv to markdown table convert',
  howto: ['Paste CSV text or load a file.', 'Click Convert.', 'Copy the Markdown table.', 'The first row becomes the header.'],
  faq: [
    { q: 'Does it handle quoted commas?', a: 'Yes — fields wrapped in quotes containing commas or newlines are parsed correctly.' },
    { q: 'What becomes the header?', a: 'The first row of the CSV is used as the table header; every following row becomes a table row.' },
    { q: 'Is my data uploaded?', a: 'No — parsing happens in your browser.' }
  ],
  zhfaq: [
    { q: 'Can it handle commas inside quotes?', a: 'Yes. Fields wrapped in quotes that contain commas or newlines are parsed correctly.' },
    { q: 'Which row is the header?', a: 'The first row of the CSV is the header; each following row becomes a table row.' }
  ],
  usecases: [
    { icon: '📚', title: 'Docs', text: 'Paste tables fast.' },
    { icon: '📈', title: 'Reports', text: 'Spreadsheet → MD.' },
    { icon: '💬', title: 'Chat', text: 'Share as table.' }
  ],
  deep: '## Purpose\nConvert tabular data from CSV into a Markdown table, handy for docs, wikis, or READMEs.\n## Parsing rules\n- Fields are separated by commas.\n- Quoted fields may contain commas and newlines.\n- Two consecutive quotes represent one quote character.\n- The first row is the header.\n## Privacy\nParsing happens locally in your browser.',
  body: textToolBody('name,role,age\\nAda,Engineer,36\\n"Lin, Yu",Designer,29', 'Paste CSV here'),
  js: `    var input=document.getElementById('input'),out=document.getElementById('out'),btn=document.getElementById('btn'),copyBtn=document.getElementById('copyBtn'),clearBtn=document.getElementById('clearBtn');
    function parseCsv(txt){
      var rows=[],row=[],field='',i=0,q=false;
      while(i<txt.length){
        var c=txt[i];
        if(q){
          if(c==='\\\\'){field+=txt[i+1]||'';i+=2;continue;}
          if(c==='"'){if(txt[i+1]==='"'){field+='"';i+=2;continue;}q=false;i++;continue;}
          field+=c;i++;continue;
        }
        if(c==='"'){q=true;i++;continue;}
        if(c===','){row.push(field);field='';i++;continue;}
        if(c==='\\n'){row.push(field);rows.push(row);row=[];field='';i++;continue;}
        if(c==='\\r'){i++;continue;}
        field+=c;i++;
      }
      row.push(field);rows.push(row);
      return rows.filter(function(r){return r.length>1||r[0]!=='';});
    }
    function md(rows){
      if(!rows.length)return '';
      var esc=function(s){return String(s).replace(/\\|/g,'\\\\|');};
      var head='| '+rows[0].map(esc).join(' | ')+' |';
      var sep='| '+rows[0].map(function(){return '---';}).join(' | ')+' |';
      var body=rows.slice(1).map(function(r){return '| '+r.map(esc).join(' | ')+' |';}).join('\\n');
      return head+'\\n'+sep+'\\n'+body+'\\n';
    }
    function convert(){var t=input.value;out.value=t.trim()?md(parseCsv(t)):'';}
    btn.addEventListener('click',convert);
    copyBtn.addEventListener('click',function(){if(out.value){out.select();document.execCommand('copy');}});
    clearBtn.addEventListener('click',function(){input.value='';out.value='';});
    convert();`
});

/* ---------- 12. Base64 to Image ---------- */
T.push({
  slug: 'base64-to-image', icon: '🖼️', title: 'Base64 to Image', tagline: 'Decode base64 into an image',
  category: 'developer',
  desc: 'Paste a base64 string (with or without the data: prefix) and preview the image, then download it. Decoding is local.',
  cardDesc: 'Preview and download an image from a base64 string.',
  keywords: 'base64 to image, base64 image decoder, decode base64 image, data uri to image',
  searchTerms: 'base64 to image decode data uri',
  howto: ['Paste a base64 image string.', 'Click Decode.', 'Preview the image.', 'Download it as a file.'],
  faq: [
    { q: 'Do I need the data: prefix?', a: 'No — paste either the raw base64 or a full data:image/png;base64,… URI; the tool detects both.' },
    { q: 'What format is downloaded?', a: 'The extension is taken from the data URI mime type if present; otherwise it defaults to PNG.' },
    { q: 'Is decoding private?', a: 'Yes — it runs entirely in your browser; nothing is uploaded.' }
  ],
  zhfaq: [
    { q: 'Do I need the data: prefix?', a: 'No. It recognizes both raw base64 and a full data:image/png;base64,... URI.' },
    { q: 'What format is the download?', a: 'If the data URI has a mime type, the extension follows it; otherwise it defaults to PNG.' }
  ],
  usecases: [
    { icon: '🔍', title: 'Inspect', text: 'View encoded img.' },
    { icon: '💾', title: 'Extract', text: 'Save from base64.' },
    { icon: '🧪', title: 'Debug', text: 'Check API output.' }
  ],
  deep: '## Purpose\nBase64 images commonly appear in API responses, inline CSS, or databases. This tool turns them back into a visible, downloadable image.\n## Parsing rules\n- Automatically recognizes the data:image/...;base64, prefix.\n- Also supports plain base64 text (defaults to PNG).\n- The download extension follows the mime type.\n## Privacy\nDecoding happens locally in your browser.',
  body: `        <div class="form-row">
          <label for="input">Base64 image string</label>
          <textarea id="input" rows="6" placeholder="data:image/png;base64,iVBORw0KGgo..."></textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Decode</button>
          <button class="btn btn-secondary" id="clearBtn">Clear</button>
        </div>
        <div id="out"></div>`,
  js: `    var input=document.getElementById('input'),out=document.getElementById('out'),btn=document.getElementById('btn'),clearBtn=document.getElementById('clearBtn');
    function decode(){
      var v=input.value.trim();if(!v){out.innerHTML='';return;}
      var mime='image/png',ext='png',b64=v;
      var m=v.match(/^data:([^;]+);base64,(.*)$/s);
      if(m){mime=m[1];ext=(mime.split('/')[1]||'png').replace('+xml','');b64=m[2];}
      var url='data:'+mime+';base64,'+b64;
      var img=new Image();
      img.onload=function(){out.innerHTML='<img src="'+url+'" style="max-width:100%;border:1px solid var(--border);border-radius:8px;margin-bottom:10px"><br><a class="btn btn-secondary" download="image.'+ext+'" href="'+url+'">Download</a>';};
      img.onerror=function(){out.innerHTML='<div style="color:#ef4444">Could not decode — check the base64 string.</div>';};
      img.src=url;
    }
    btn.addEventListener('click',decode);
    clearBtn.addEventListener('click',function(){input.value='';out.innerHTML='';});
    decode();`
});

module.exports = T;
