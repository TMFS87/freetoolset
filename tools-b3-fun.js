/* tools-b3-fun.js — batch 3, fun & random tools (6 tools) */
const T = [];

/* 1. Random Username Generator */
T.push({
  slug: 'random-username-generator', icon: '🎲', title: 'Random Username Generator', tagline: 'Get name ideas instantly',
  category: 'fun', popular: 'Popular',
  desc: 'Generate random, available-feeling usernames by mixing adjectives, nouns and numbers. Great for gaming tags, alt accounts and brainstorming.',
  cardDesc: 'Create random username ideas from words and numbers.',
  keywords: 'random username generator, username ideas, gamertag generator, nickname generator, handle generator',
  searchTerms: 'random username generator gamertag nickname handle',
  zh: '随机用户名生成器把形容词、名词和数字随机组合，生成一堆可用的用户名点子，适合游戏 ID、小号、品牌昵称或起名灵感。',
  howto: ['Click Generate.', 'Pick a username you like.', 'Click it to copy.', 'Tweak the style with the options if available.'],
  faq: [
    { q: 'Are these usernames guaranteed available?', a: 'No — the tool only creates combinations; you still need to check availability on the specific platform.' },
    { q: 'Can I make them longer or add numbers?', a: 'Each generated name already appends a random number by default. Generate again for variety.' },
    { q: 'Is this useful for branding?', a: 'It is a good brainstorming start, but for a real brand you should check trademarks and domain availability too.' }
  ],
  zhfaq: [
    { q: '这些用户名保证可用吗？', a: '不保证。工具只负责生成组合，具体是否可用还需在对应平台查询。' },
    { q: '能加长或加数字吗？', a: '默认每个名字都会带一个随机数字；再点一次生成可得到更多变化。' }
  ],
  usecases: [
    { icon: '🎮', title: 'Gaming', text: 'Fresh gamertags.' },
    { icon: '📱', title: 'Social', text: 'Alt handles.' },
    { icon: '💡', title: 'Ideas', text: 'Brainstorm names.' }
  ],
  deep: '## 用途\n起名困难时，用“形容词 + 名词 + 数字”的组合快速产出一批候选用户名。\n## 小技巧\n- 多生成几次增加变化\n- 选好后记得去目标平台查重\n- 品牌用途还需查商标与域名\n## 隐私\n全部在浏览器本地随机生成，不上传。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="num">How many</label>
            <input type="number" id="num" value="8" min="1" max="20">
          </div>
          <div class="form-row">
            <label for="len">Max number digits</label>
            <input type="number" id="len" value="3" min="0" max="6">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Generate</button>
        </div>
        <div id="out"></div>`,
  js: `    var num=document.getElementById('num'),len=document.getElementById('len'),out=document.getElementById('out'),btn=document.getElementById('btn');
    var adj=['shadow','silent','crimson','lunar','frost','neon','iron','wild','cosmic','velvet','electric','midnight','golden','rapid','tiny','brave','hidden','lucky','calm','swift'];
    var noun=['tiger','falcon','panda','comet','wolf','pixel','river','ember','otter','raven','maple','quartz','vortex','willow','cobra','sparrow','mango','nebula','cactus','breeze'];
    function rnd(a){return a[Math.floor(Math.random()*a.length)];}
    function gen(){
      var n=Math.max(1,Math.min(20,parseInt(num.value)||8)),d=Math.max(0,Math.min(6,parseInt(len.value)||3)),html='';
      for(var i=0;i<n;i++){var nm=rnd(adj)+'_'+rnd(noun);if(d>0)nm+=Math.floor(Math.random()*Math.pow(10,d));html+='<div class="copy-line" onclick="(function(){var t=document.createElement(\\'textarea\\');t.value=this.innerText;document.body.appendChild(t);t.select();document.execCommand(\\'copy\\');t.remove();})(this)" style="cursor:pointer;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:8px;font-family:monospace;margin-bottom:6px">'+nm+' <span style="opacity:.5;font-size:.8rem">copy</span></div>';}
      out.innerHTML=html;
    }
    btn.addEventListener('click',gen);gen();`
});

/* 2. Random Color Generator */
T.push({
  slug: 'random-color-generator', icon: '🎨', title: 'Random Color Generator', tagline: 'Discover colors by chance',
  category: 'fun',
  desc: 'Generate random colors with hex codes, preview them, and copy what you like. Useful for design inspiration and palettes.',
  cardDesc: 'Generate random hex colors to spark design ideas.',
  keywords: 'random color generator, random hex, color picker random, random colour, color ideas',
  searchTerms: 'random color generator hex design',
  zh: '随机颜色生成器每次生成一个随机十六进制颜色并预览，喜欢的可以直接复制色值，适合做设计配色灵感。',
  howto: ['Click New Color.', 'See the swatch and hex code.', 'Click to copy the hex.', 'Keep clicking for more ideas.'],
  faq: [
    { q: 'Can I generate many at once?', a: 'This tool shows one large preview at a time for clarity; click New Color to cycle. For a full palette, try the Color Palette Generator.' },
    { q: 'Is the color truly random?', a: 'It is a uniform random 24-bit RGB value, so every color is equally likely.' },
    { q: 'How do I use the hex?', a: 'Paste it into CSS, design tools or anywhere a color is accepted.' }
  ],
  zhfaq: [
    { q: '能一次生成多个吗？', a: '本工具一次显示一个大方块更清晰；想要整组搭配可用“配色方案生成器”。' },
    { q: '颜色是真正随机的吗？', a: '是均匀随机的 24 位 RGB 值，每种颜色概率相同。' }
  ],
  usecases: [
    { icon: '🎨', title: 'Inspiration', text: 'Break a block.' },
    { icon: '🖌️', title: 'Design', text: 'Quick swatches.' },
    { icon: '🌈', title: 'Play', text: 'Just for fun.' }
  ],
  deep: '## 用途\n无聊或卡顿时随机抽一个颜色，常能带来意外灵感。\n## 用法\n点“新颜色”刷新，点色块复制 hex。\n## 隐私\n随机在浏览器本地生成。',
  body: `        <div class="btn-row">
          <button class="btn btn-primary" id="btn">New Color</button>
        </div>
        <div id="out"></div>`,
  js: `    var out=document.getElementById('out'),btn=document.getElementById('btn');
    function hex(){var s=Math.floor(Math.random()*0xffffff).toString(16);while(s.length<6)s='0'+s;return '#'+s;}
    function gen(){
      var c=hex();
      out.innerHTML='<div style="display:flex;gap:16px;align-items:center;margin-top:8px">'+
        '<div onclick="(function(){var t=document.createElement(\\'textarea\\');t.value=\\''+c+'\\';document.body.appendChild(t);t.select();document.execCommand(\\'copy\\');t.remove();})(this)" style="width:120px;height:120px;border-radius:14px;background:'+c+';border:1px solid var(--border);cursor:pointer"></div>'+
        '<div><div style="font-size:1.6rem;font-weight:800;font-family:monospace">'+c+'</div><div style="opacity:.6;font-size:.85rem">click swatch to copy</div></div></div>';
    }
    btn.addEventListener('click',gen);gen();`
});

/* 3. Yes / No Decider */
T.push({
  slug: 'yes-no-decider', icon: '🤔', title: 'Yes or No Decider', tagline: 'Can’t decide? Let chance',
  category: 'fun',
  desc: 'Stuck on a simple choice? Let the Yes/No decider make it for you. Occasionally throws in a “Maybe” for the truly undecided.',
  cardDesc: 'Flip a coin-style Yes / No / Maybe decision maker.',
  keywords: 'yes no decider, decision maker, yes or no, coin flip decision, can t decide',
  searchTerms: 'yes no decider decision maker maybe',
  zh: '是/否决策器在你拿不定主意时替你随机做决定，大多给“是/否”，偶尔来一个“再想想（Maybe）”，适合无关紧要的小选择。',
  howto: ['Think of your yes/no question.', 'Click Decide.', 'Accept the verdict (or ask again).', 'Use only for trivial choices!'],
  faq: [
    { q: 'Is it really random?', a: 'Yes — each click is an independent random pick weighted mostly to Yes/No with a small chance of Maybe.' },
    { q: 'Should I use this for important decisions?', a: 'No. This is for fun and trivial choices. Real life decisions deserve real thought.' },
    { q: 'Why does it say Maybe sometimes?', a: 'A small probability returns Maybe to reflect that some questions are genuinely undecided.' }
  ],
  zhfaq: [
    { q: '真的是随机的吗？', a: '是的。每次点击都是独立随机，主要以“是/否”为主，小概率出现“再想想”。' },
    { q: '重要决定能用它吗？', a: '不能。这只适合无关紧要的小选择，重要决定需要认真思考。' }
  ],
  usecases: [
    { icon: '🍕', title: 'Trivial', text: 'Pizza or pasta?' },
    { icon: '🎬', title: 'Bored', text: 'Movie or game?' },
    { icon: '😄', title: 'Fun', text: 'Settle a bet.' }
  ],
  deep: '## 用途\n面对无关紧要的二选一，让随机替你拍板，省得纠结。\n## 说明\n以“是/否”为主，偶尔“再想想”。仅用于娱乐。\n## 提醒\n重大决定请勿依赖本工具。',
  body: `        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Decide</button>
        </div>
        <div id="out"></div>`,
  js: `    var out=document.getElementById('out'),btn=document.getElementById('btn');
    function decide(){
      var r=Math.random();
      var ans,col;
      if(r<0.45){ans='YES';col='#22c55e';}else if(r<0.9){ans='NO';col='#ef4444';}else{ans='MAYBE';col='#f59e0b';}
      out.innerHTML='<div style="margin-top:14px;text-align:center;font-size:3rem;font-weight:900;color:'+col+'">'+ans+'</div><div style="text-align:center;opacity:.6;font-size:.85rem">click again to reroll</div>';
    }
    btn.addEventListener('click',decide);decide();`
});

/* 4. Rock Paper Scissors */
T.push({
  slug: 'rock-paper-scissors', icon: '✊', title: 'Rock Paper Scissors', tagline: 'Play against the computer',
  category: 'fun',
  desc: 'Play Rock Paper Scissors against a randomly choosing computer. Tracks your win/loss/tie score.',
  cardDesc: 'Play Rock Paper Scissors vs the computer with a scoreboard.',
  keywords: 'rock paper scissors, rps game, play rps, paper scissors rock, online rps',
  searchTerms: 'rock paper scissors game play computer',
  zh: '石头剪刀布游戏让你和随机出招的电脑对战，并自动记录胜、负、平的比分。',
  howto: ['Click Rock, Paper or Scissors.', 'See the computer’s move and result.', 'Watch your score update.', 'Play best of luck!'],
  faq: [
    { q: 'Is the computer fair?', a: 'It picks uniformly at random each round, so over many games your win rate should approach one third.' },
    { q: 'Does it learn my pattern?', a: 'No — it is purely random and has no memory between rounds.' },
    { q: 'Can I reset the score?', a: 'Refresh the page to reset the scoreboard.' }
  ],
  zhfaq: [
    { q: '电脑公平吗？', a: '每回合均匀随机出招，长期看你的胜率会趋近于三分之一。' },
    { q: '它会学我的套路吗？', a: '不会，完全随机且各回合之间无记忆。' }
  ],
  usecases: [
    { icon: '⚔️', title: 'Versus', text: 'Settle who goes first.' },
    { icon: '🎲', title: 'Pass time', text: 'Quick fun.' },
    { icon: '🏆', title: 'Score', text: 'Track your record.' }
  ],
  deep: '## 规则\n石头胜剪刀，剪刀胜布，布胜石头，相同则平。\n## 说明\n电脑每回合均匀随机，无记忆。想清零比分刷新页面即可。',
  body: `        <div class="btn-row">
          <button class="btn btn-secondary" id="rock">✊ Rock</button>
          <button class="btn btn-secondary" id="paper">✋ Paper</button>
          <button class="btn btn-secondary" id="scissors">✌️ Scissors</button>
        </div>
        <div id="out"></div>`,
  js: `    var out=document.getElementById('out');
    var score={w:0,l:0,t:0};
    var map={rock:0,paper:1,scissors:2},emoji={0:'✊',1:'✋',2:'✌️'},name={0:'Rock',1:'Paper',2:'Scissors'};
    function play(me){
      var cpu=Math.floor(Math.random()*3);var m=map[me];
      var res = m===cpu?'tie':((m+1)%3===cpu?'lose':'win');
      if(res==='win')score.w++;else if(res==='lose')score.l++;else score.t++;
      var col=res==='win'?'#22c55e':res==='lose'?'#ef4444':'#f59e0b';
      var label=res==='win'?'You win!':res==='lose'?'You lose':'Tie';
      out.innerHTML='<div style="margin-top:12px;text-align:center">'+
        '<div style="font-size:2rem">You: '+emoji[m]+' &nbsp; vs &nbsp; CPU: '+emoji[cpu]+'</div>'+
        '<div style="font-size:1.6rem;font-weight:800;color:'+col+';margin:8px 0">'+label+'</div>'+
        '<div style="opacity:.75">Wins '+score.w+' · Losses '+score.l+' · Ties '+score.t+'</div></div>';
    }
    document.getElementById('rock').onclick=function(){play('rock');};
    document.getElementById('paper').onclick=function(){play('paper');};
    document.getElementById('scissors').onclick=function(){play('scissors');};`
});

/* 5. Random Date Generator */
T.push({
  slug: 'random-date-generator', icon: '📅', title: 'Random Date Generator', tagline: 'Pick a random date in range',
  category: 'fun',
  desc: 'Generate a random date between two dates (or within a year). Handy for giveaways, sampling, or just settling “which day”.',
  cardDesc: 'Get a random date between any two dates.',
  keywords: 'random date generator, random day, pick a date, date picker random, random calendar',
  searchTerms: 'random date generator day between',
  zh: '随机日期生成器在指定起止日期（或某一年）之间随机抽一个日期，适合抽奖、抽样或“到底选哪天”的小决定。',
  howto: ['Set a start date.', 'Set an end date.', 'Click Generate.', 'Use the date or roll again.'],
  faq: [
    { q: 'Can I generate only weekdays?', a: 'This simple version picks any calendar day uniformly. For weekdays-only, just reroll if a weekend appears.' },
    { q: 'What range can I use?', a: 'Any two dates; the start must be before the end. You can span years.' },
    { q: 'Is it useful for giveaways?', a: 'Yes — picking a random date, then a random entry from that day, is a common fair-draw technique.' }
  ],
  zhfaq: [
    { q: '能只生成工作日吗？', a: '这个简易版对所有日历日均匀抽取；若只想工作日，抽到周末再点一次即可。' },
    { q: '能用什么范围？', a: '任意两个日期，开始须早于结束，可跨年。' }
  ],
  usecases: [
    { icon: '🎁', title: 'Giveaways', text: 'Fair random draw.' },
    { icon: '📊', title: 'Sampling', text: 'Pick a sample day.' },
    { icon: '🗓️', title: 'Plan', text: 'Decide a date.' }
  ],
  deep: '## 用途\n在两个日期之间均匀随机抽一天，常用于抽奖、抽样或做小决定。\n## 用法\n设好起止日期点生成；开始须早于结束。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="start">Start date</label>
            <input type="date" id="start" value="2026-01-01">
          </div>
          <div class="form-row">
            <label for="end">End date</label>
            <input type="date" id="end" value="2026-12-31">
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Generate</button>
        </div>
        <div id="out"></div>`,
  js: `    var start=document.getElementById('start'),end=document.getElementById('end'),out=document.getElementById('out'),btn=document.getElementById('btn');
    function gen(){
      var s=new Date(start.value),e=new Date(end.value);
      if(isNaN(s)||isNaN(e)||s>=e){out.innerHTML='<div style="color:#ef4444">Start must be before end, both valid.</div>';return;}
      var diff=e-s;var r=new Date(s.getTime()+Math.floor(Math.random()*diff));
      var str=r.getFullYear()+'-'+('0'+(r.getMonth()+1)).slice(-2)+'-'+('0'+r.getDate()).slice(-2);
      out.innerHTML='<div style="margin-top:14px;text-align:center;font-size:2rem;font-weight:800">'+str+'</div>';
    }
    btn.addEventListener('click',gen);gen();`
});

/* 6. Random Emoji Generator */
T.push({
  slug: 'random-emoji-generator', icon: '😎', title: 'Random Emoji Generator', tagline: 'Spin up a random emoji',
  category: 'fun',
  desc: 'Generate a random emoji with one click. Great for adding a bit of flair to messages, posts and replies.',
  cardDesc: 'Get a random emoji to spice up your text.',
  keywords: 'random emoji generator, emoji picker random, random emoticon, emoji spinner, emoji ideas',
  searchTerms: 'random emoji generator picker',
  zh: '随机表情生成器点一下就抽一个表情符号，给聊天、帖子或回复加点趣味。',
  howto: ['Click Generate.', 'See your random emoji.', 'Click it to copy.', 'Roll again for more.'],
  faq: [
    { q: 'Where do the emojis come from?', a: 'From a curated list of common emojis stored in the page — no download or network needed.' },
    { q: 'Can I copy the emoji?', a: 'Yes — click the big emoji to copy it to your clipboard.' },
    { q: 'Will it work everywhere?', a: 'Emoji rendering depends on your device OS and font, but the characters themselves are standard Unicode.' }
  ],
  zhfaq: [
    { q: '表情从哪来？', a: '来自页面内置的一批常用表情列表，无需下载或联网。' },
    { q: '能复制表情吗？', a: '可以，点大表情即可复制到剪贴板。' }
  ],
  usecases: [
    { icon: '💬', title: 'Chat', text: 'React fast.' },
    { icon: '📝', title: 'Posts', text: 'Add flair.' },
    { icon: '🎲', title: 'Fun', text: 'Roll one.' }
  ],
  deep: '## 用途\n快速给文字添个表情，增添趣味。\n## 用法\n点生成，点大表情复制。表情显示依赖设备字体，但字符本身是标准 Unicode。',
  body: `        <div class="btn-row">
          <button class="btn btn-primary" id="btn">Generate</button>
        </div>
        <div id="out"></div>`,
  js: `    var out=document.getElementById('out'),btn=document.getElementById('btn');
    var E=['😀','😎','🤩','😍','🥳','🤔','😴','🤯','🔥','💡','⭐','🌟','💥','🎉','🎈','🍕','🍔','🚀','🌈','⚡','🐱','🐶','🦄','🌸','🍀','💎','🎯','🧠','👍','🙌','💯','✨','🍀','🌻','🐢','🦊','🍉','🎮','🎵','☕'];
    function gen(){
      var e=E[Math.floor(Math.random()*E.length)];
      out.innerHTML='<div onclick="(function(){var t=document.createElement(\\'textarea\\');t.value=\\''+e+'\\';document.body.appendChild(t);t.select();document.execCommand(\\'copy\\');t.remove();})(this)" style="margin-top:14px;text-align:center;font-size:5rem;cursor:pointer">'+e+'<div style="font-size:.8rem;opacity:.6">click to copy</div></div>';
    }
    btn.addEventListener('click',gen);gen();`
});

module.exports = T;
