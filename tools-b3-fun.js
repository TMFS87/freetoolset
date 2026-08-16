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
  howto: ['Click Generate.', 'Pick a username you like.', 'Click it to copy.', 'Tweak the style with the options if available.'],
  faq: [
    { q: 'Are these usernames guaranteed available?', a: 'No — the tool only creates combinations; you still need to check availability on the specific platform.' },
    { q: 'Can I make them longer or add numbers?', a: 'Each generated name already appends a random number by default. Generate again for variety.' },
    { q: 'Is this useful for branding?', a: 'It is a good brainstorming start, but for a real brand you should check trademarks and domain availability too.' }
  ],
  zhfaq: [
    { q: 'Are these usernames guaranteed available?', a: 'No. The tool only generates combinations; you still need to check availability on the platform.' },
    { q: 'Can I make them longer or add numbers?', a: 'By default every name gets a random number; click generate again for more variations.' }
  ],
  usecases: [
    { icon: '🎮', title: 'Gaming', text: 'Fresh gamertags.' },
    { icon: '📱', title: 'Social', text: 'Alt handles.' },
    { icon: '💡', title: 'Ideas', text: 'Brainstorm names.' }
  ],
  deep: '## Purpose\nWhen you struggle to name things, combine adjective + noun + number to quickly produce a batch of candidate usernames.\n## Tips\n- Generate a few times for more variety.\n- After picking one, check for duplicates on the target platform.\n- For branding, also check trademarks and domains.\n## Privacy\nEverything is generated randomly in your browser; not uploaded.',
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
  howto: ['Click New Color.', 'See the swatch and hex code.', 'Click to copy the hex.', 'Keep clicking for more ideas.'],
  faq: [
    { q: 'Can I generate many at once?', a: 'This tool shows one large preview at a time for clarity; click New Color to cycle. For a full palette, try the Color Palette Generator.' },
    { q: 'Is the color truly random?', a: 'It is a uniform random 24-bit RGB value, so every color is equally likely.' },
    { q: 'How do I use the hex?', a: 'Paste it into CSS, design tools or anywhere a color is accepted.' }
  ],
  zhfaq: [
    { q: 'Can it generate several at once?', a: 'This tool shows one large swatch at a time for clarity; for a whole coordinated set use the color palette generator.' },
    { q: 'Is the color truly random?', a: 'Yes, it is a uniform random 24-bit RGB value, so every color is equally likely.' }
  ],
  usecases: [
    { icon: '🎨', title: 'Inspiration', text: 'Break a block.' },
    { icon: '🖌️', title: 'Design', text: 'Quick swatches.' },
    { icon: '🌈', title: 'Play', text: 'Just for fun.' }
  ],
  deep: '## Purpose\nWhen bored or stuck, draw a random color - it often sparks unexpected inspiration.\n## Usage\nClick new color to refresh, click the swatch to copy the hex.\n## Privacy\nGenerated randomly in your browser.',
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
  howto: ['Think of your yes/no question.', 'Click Decide.', 'Accept the verdict (or ask again).', 'Use only for trivial choices!'],
  faq: [
    { q: 'Is it really random?', a: 'Yes — each click is an independent random pick weighted mostly to Yes/No with a small chance of Maybe.' },
    { q: 'Should I use this for important decisions?', a: 'No. This is for fun and trivial choices. Real life decisions deserve real thought.' },
    { q: 'Why does it say Maybe sometimes?', a: 'A small probability returns Maybe to reflect that some questions are genuinely undecided.' }
  ],
  zhfaq: [
    { q: 'Is it really random?', a: 'Yes. Each click is an independent random draw, mostly yes or no, with a small chance of "think again".' },
    { q: 'Can I use it for important decisions?', a: 'No. It is only for trivial little choices; important decisions need real thought.' }
  ],
  usecases: [
    { icon: '🍕', title: 'Trivial', text: 'Pizza or pasta?' },
    { icon: '🎬', title: 'Bored', text: 'Movie or game?' },
    { icon: '😄', title: 'Fun', text: 'Settle a bet.' }
  ],
  deep: '## Purpose\nFaced with a trivial either/or, let randomness decide so you stop agonizing.\n## Notes\nMostly yes or no, occasionally think again. For entertainment only.\n## Reminder\nDo not rely on this tool for major decisions.',
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
  howto: ['Click Rock, Paper or Scissors.', 'See the computer’s move and result.', 'Watch your score update.', 'Play best of luck!'],
  faq: [
    { q: 'Is the computer fair?', a: 'It picks uniformly at random each round, so over many games your win rate should approach one third.' },
    { q: 'Does it learn my pattern?', a: 'No — it is purely random and has no memory between rounds.' },
    { q: 'Can I reset the score?', a: 'Refresh the page to reset the scoreboard.' }
  ],
  zhfaq: [
    { q: 'Is the computer fair?', a: 'It plays each round uniformly at random, so in the long run your win rate approaches one third.' },
    { q: 'Does it learn my patterns?', a: 'No, it is completely random with no memory between rounds.' }
  ],
  usecases: [
    { icon: '⚔️', title: 'Versus', text: 'Settle who goes first.' },
    { icon: '🎲', title: 'Pass time', text: 'Quick fun.' },
    { icon: '🏆', title: 'Score', text: 'Track your record.' }
  ],
  deep: '## Rules\nRock beats scissors, scissors beats paper, paper beats rock; the same move is a draw.\n## Notes\nThe computer plays each round uniformly at random with no memory. Refresh the page to reset the score.',
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
  howto: ['Set a start date.', 'Set an end date.', 'Click Generate.', 'Use the date or roll again.'],
  faq: [
    { q: 'Can I generate only weekdays?', a: 'This simple version picks any calendar day uniformly. For weekdays-only, just reroll if a weekend appears.' },
    { q: 'What range can I use?', a: 'Any two dates; the start must be before the end. You can span years.' },
    { q: 'Is it useful for giveaways?', a: 'Yes — picking a random date, then a random entry from that day, is a common fair-draw technique.' }
  ],
  zhfaq: [
    { q: 'Can it generate only weekdays?', a: 'This simple version picks uniformly from all calendar days; if you want a weekday, just draw again when it lands on a weekend.' },
    { q: 'What range can I use?', a: 'Any two dates, with the start before the end; it can span years.' }
  ],
  usecases: [
    { icon: '🎁', title: 'Giveaways', text: 'Fair random draw.' },
    { icon: '📊', title: 'Sampling', text: 'Pick a sample day.' },
    { icon: '🗓️', title: 'Plan', text: 'Decide a date.' }
  ],
  deep: '## Purpose\nPick one day at random, uniformly, between two dates - handy for giveaways, sampling, or small decisions.\n## Usage\nSet the start and end dates and click generate; the start must be earlier than the end.',
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
  howto: ['Click Generate.', 'See your random emoji.', 'Click it to copy.', 'Roll again for more.'],
  faq: [
    { q: 'Where do the emojis come from?', a: 'From a curated list of common emojis stored in the page — no download or network needed.' },
    { q: 'Can I copy the emoji?', a: 'Yes — click the big emoji to copy it to your clipboard.' },
    { q: 'Will it work everywhere?', a: 'Emoji rendering depends on your device OS and font, but the characters themselves are standard Unicode.' }
  ],
  zhfaq: [
    { q: 'Where do the emojis come from?', a: 'From a built-in list of common emojis in the page; no download or internet needed.' },
    { q: 'Can I copy an emoji?', a: 'Yes, click the large emoji to copy it to the clipboard.' }
  ],
  usecases: [
    { icon: '💬', title: 'Chat', text: 'React fast.' },
    { icon: '📝', title: 'Posts', text: 'Add flair.' },
    { icon: '🎲', title: 'Fun', text: 'Roll one.' }
  ],
  deep: '## Purpose\nQuickly add an emoji to your text for a bit of fun.\n## Usage\nClick generate, then click the large emoji to copy. Emoji display depends on device fonts, but the characters are standard Unicode.',
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
