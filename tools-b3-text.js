/* tools-b3-text.js — batch 3, extra text tools (2 tools) */
const T = [];

/* 1. Character Counter */
T.push({
  slug: 'character-counter', icon: '🔢', title: 'Character Counter', tagline: 'Count characters, words & lines',
  category: 'text', popular: 'Popular',
  desc: 'Count characters (with and without spaces), words, lines and paragraphs in your text in real time. Ideal for essays, tweets and metadata limits.',
  cardDesc: 'Live-count characters, words, lines and paragraphs.',
  keywords: 'character counter, letter count, word count, char counter, text counter',
  searchTerms: 'character counter count characters words lines',
  zh: '字符计数器实时统计文本中的字符数（含/不含空格）、词数、行数和段落数，写文章、发推特或控制元描述长度时非常实用。',
  howto: ['Type or paste your text.', 'Watch the counts update live.', 'Use the numbers to stay within limits.', 'No button needed — it is instant.'],
  faq: [
    { q: 'What counts as a word?', a: 'A word is a run of characters separated by spaces or line breaks. This is a simple heuristic, good for estimates.' },
    { q: 'Does it count spaces?', a: 'Yes — there are two figures: total characters (including spaces) and characters excluding spaces, so you can pick whichever you need.' },
    { q: 'Is there a limit on input size?', a: 'It handles typical pastes fine; extremely large texts may feel slower but still work since everything runs locally.' }
  ],
  zhfaq: [
    { q: '什么叫一个“词”？', a: '词是以空格或换行分隔的一段连续字符。这是简单启发式，适合估算。' },
    { q: '会统计空格吗？', a: '会。提供两个数字：含空格的总字符数，以及不含空格的字符数，按需取用。' }
  ],
  usecases: [
    { icon: '🐦', title: 'Tweets', text: 'Stay under limits.' },
    { icon: '📝', title: 'Essays', text: 'Track length.' },
    { icon: '🔍', title: 'SEO', text: 'Meta description size.' }
  ],
  deep: '## 用途\n写推特、标题、元描述时常有字数限制，实时计数能帮你把控长度。\n## 指标说明\n- 字符数（含空格）：所有字符总和\n- 字符数（不含空格）：去掉空格后的长度\n- 词数：以空白分隔的段数\n- 行数：换行 + 1\n## 隐私\n统计在浏览器本地实时完成。',
  body: `        <div class="form-row">
          <label for="input">Your text</label>
          <textarea id="input" rows="10" placeholder="Type or paste text here…"></textarea>
        </div>
        <div id="out"></div>`,
  js: `    var input=document.getElementById('input'),out=document.getElementById('out');
    function count(){
      var t=input.value;
      var chars=t.length;
      var noSpaces=t.replace(/\\s/g,'').length;
      var words=(t.trim().match(/\\S+/g)||[]).length;
      var lines=t===''?0:t.split(/\\r\\n|\\r|\\n/).length;
      var paras=t.split(/\\n\\s*\\n/).filter(function(s){return s.trim()!=='';}).length;
      out.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:8px">'+
        card('Characters',chars)+card('No spaces',noSpaces)+card('Words',words)+card('Lines',lines)+card('Paragraphs',paras)+
        '</div>';
    }
    function card(label,val){return '<div style="padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:10px;text-align:center"><div style="font-size:1.8rem;font-weight:800">'+val+'</div><div style="opacity:.7;font-size:.85rem">'+label+'</div></div>';}
    input.addEventListener('input',count);count();`
});

/* 2. ROT13 / Caesar Cipher */
T.push({
  slug: 'text-rot13', icon: '🔡', title: 'ROT13 / Caesar Cipher', tagline: 'Shift letters by N positions',
  category: 'text',
  desc: 'Apply a Caesar cipher to text — shift every letter by a chosen number of positions (ROT13 = shift 13). Encode a message or decode a cipher.',
  cardDesc: 'Shift letters with a Caesar cipher (ROT13 by default).',
  keywords: 'rot13, caesar cipher, letter shift, text encrypt, cipher tool',
  searchTerms: 'rot13 caesar cipher shift letters encode decode',
  zh: 'ROT13 / 凯撒密码工具把每个字母按指定位数平移（ROT13 即平移 13 位）。可用来对文字做简单“加密”或解码，纯字母变换、保留大小写与标点。',
  howto: ['Type or paste your text.', 'Set the shift (13 for classic ROT13).', 'Click Encode / Decode.', 'Copy the result. (ROT13 is its own inverse.)'],
  faq: [
    { q: 'What is ROT13?', a: 'A Caesar cipher with a shift of 13. Because the alphabet has 26 letters, applying it twice returns the original text — encode and decode are the same operation.' },
    { q: 'Does it change numbers and punctuation?', a: 'No — only letters A–Z / a–z are shifted. Digits, spaces and symbols are left untouched.' },
    { q: 'Is this real encryption?', a: 'No. ROT13 is trivially reversible and offers no security; it is for fun, puzzles and obfuscation, not protection.' }
  ],
  zhfaq: [
    { q: '什么是 ROT13？', a: '平移 13 位的凯撒密码。因为字母表有 26 个字母，平移两次会还原原文，所以“加密”和“解密”是同一操作。' },
    { q: '数字和标点会变吗？', a: '不会。只有 A–Z / a–z 被平移，数字、空格和符号保持不变。' }
  ],
  usecases: [
    { icon: '🧩', title: 'Puzzles', text: 'Hide a spoiler.' },
    { icon: '🎓', title: 'Learning', text: 'See ciphers work.' },
    { icon: '🤫', title: 'Obfuscate', text: 'Light scramble.' }
  ],
  deep: '## 凯撒密码原理\n把字母表中的每个字母向后移动 N 位（到末尾则回到开头）。ROT13 取 N=13，因 26 个字母，移两次即还原。\n## 规则\n- 仅平移 A–Z / a–z，保留大小写\n- 数字、空格、标点原样保留\n- N=13 时编码=解码\n## 提醒\n这不是真正的加密，无任何安全性，只用于趣味与混淆。',
  body: `        <div class="form-row">
          <label for="input">Text</label>
          <textarea id="input" rows="6" placeholder="Type or paste text to shift…">Hello World!</textarea>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="shift">Shift (0–25)</label>
            <input type="number" id="shift" value="13" min="0" max="25">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Encode / Decode</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="form-row">
          <label for="out">Result</label>
          <textarea id="out" rows="6" readonly></textarea>
        </div>`,
  js: `    var input=document.getElementById('input'),shift=document.getElementById('shift'),out=document.getElementById('out'),btn=document.getElementById('btn'),copyBtn=document.getElementById('copyBtn');
    function rot(t,n){
      n=((parseInt(shift.value)||0)%26+26)%26;
      var s='';
      for(var i=0;i<t.length;i++){var c=t.charCodeAt(i);
        if(c>=65&&c<=90)s+=String.fromCharCode((c-65+n)%26+65);
        else if(c>=97&&c<=122)s+=String.fromCharCode((c-97+n)%26+97);
        else s+=t[i];
      }
      return s;
    }
    function run(){out.value=rot(input.value,parseInt(shift.value)||0);}
    btn.addEventListener('click',run);
    copyBtn.addEventListener('click',function(){if(out.value){out.select();document.execCommand('copy');}});
    run();`
});

module.exports = T;
