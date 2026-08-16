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
  howto: ['Type or paste your text.', 'Watch the counts update live.', 'Use the numbers to stay within limits.', 'No button needed — it is instant.'],
  faq: [
    { q: 'What counts as a word?', a: 'A word is a run of characters separated by spaces or line breaks. This is a simple heuristic, good for estimates.' },
    { q: 'Does it count spaces?', a: 'Yes — there are two figures: total characters (including spaces) and characters excluding spaces, so you can pick whichever you need.' },
    { q: 'Is there a limit on input size?', a: 'It handles typical pastes fine; extremely large texts may feel slower but still work since everything runs locally.' }
  ],
  zhfaq: [
    { q: 'What counts as a word?', a: 'A word is a run of characters separated by spaces or line breaks. This is a simple heuristic, good for estimates.' },
    { q: 'Does it count spaces?', a: 'Yes — it shows two figures: total characters including spaces, and characters excluding spaces, so you can use whichever you need.' }
  ],
  usecases: [
    { icon: '🐦', title: 'Tweets', text: 'Stay under limits.' },
    { icon: '📝', title: 'Essays', text: 'Track length.' },
    { icon: '🔍', title: 'SEO', text: 'Meta description size.' }
  ],
  deep: '## Why it is useful\nTwitter, headlines and meta descriptions all have character limits; live counting helps you stay within them.\n## The metrics\n- Characters (with spaces): total count of every character\n- Characters (without spaces): length after removing spaces\n- Words: segments separated by whitespace\n- Lines: newlines + 1\n## Privacy\nCounting happens instantly in your browser, locally.',
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
  howto: ['Type or paste your text.', 'Set the shift (13 for classic ROT13).', 'Click Encode / Decode.', 'Copy the result. (ROT13 is its own inverse.)'],
  faq: [
    { q: 'What is ROT13?', a: 'A Caesar cipher with a shift of 13. Because the alphabet has 26 letters, applying it twice returns the original text — encode and decode are the same operation.' },
    { q: 'Does it change numbers and punctuation?', a: 'No — only letters A–Z / a–z are shifted. Digits, spaces and symbols are left untouched.' },
    { q: 'Is this real encryption?', a: 'No. ROT13 is trivially reversible and offers no security; it is for fun, puzzles and obfuscation, not protection.' }
  ],
  zhfaq: [
    { q: 'What is ROT13?', a: 'A Caesar cipher with a shift of 13. Because the alphabet has 26 letters, applying it twice restores the original, so encoding and decoding are the same step.' },
    { q: 'Do numbers and punctuation change?', a: 'No. Only A–Z / a–z are shifted; digits, spaces and symbols stay as they are.' }
  ],
  usecases: [
    { icon: '🧩', title: 'Puzzles', text: 'Hide a spoiler.' },
    { icon: '🎓', title: 'Learning', text: 'See ciphers work.' },
    { icon: '🤫', title: 'Obfuscate', text: 'Light scramble.' }
  ],
  deep: '## How the Caesar cipher works\nEach letter in the alphabet is shifted N places forward (wrapping back to the start at the end). ROT13 uses N=13; since there are 26 letters, shifting twice returns the original text.\n## Rules\n- Only A–Z / a–z are shifted, preserving case\n- Digits, spaces and punctuation are left unchanged\n- With N=13, encoding and decoding are the same operation\n## Reminder\nThis is not real encryption — it provides no security and is only for fun and light obfuscation.',
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
