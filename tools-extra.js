/* tools-extra.js — 20 additional high-value client-side tools for FreeToolset.
 * Each entry feeds gen-tools.js (same shape as tools-data.js).
 * Run after editing: node gen-tools.js
 */
const EXTRA = [];

/* ==================== TEXT (5) ==================== */

EXTRA.push({
  slug: 'word-frequency-counter', icon: '📊', title: 'Word Frequency Counter', tagline: 'Free Online Word & Keyword Frequency Analyzer',
  category: 'text', popular: 'Popular',
  desc: 'Analyze any text and see how often each word appears. Great for SEO keyword density, essay vocabulary checks, and content optimization. Works for English words and Chinese characters.',
  cardDesc: 'Count word frequency, keyword density and most-used terms in any text.',
  keywords: 'word frequency counter, keyword density checker, word count frequency, text analyzer, most frequent words',
  searchTerms: 'word frequency keyword density analyzer text',
  zh: '词频统计器分析一段文本中每个词出现的次数与占比，适合检查文章关键词密度、优化 SEO 内容、做词汇丰富度分析。支持英文单词与中文单字统计，纯本地运行保护隐私。',
  howto: ['Paste or type your text into the box.', 'Set how many top words to show and a minimum length.', 'Click "Count" to see the ranked frequency list.', 'Use the percentages to spot overused words or keywords.'],
  faq: [
    { q: 'Does it count Chinese characters?', a: 'Yes. English and numbers are counted as whole words; each Chinese character is counted individually, so you can analyze mixed-language text.' },
    { q: 'How is keyword density calculated?', a: 'Density = (times a word appears ÷ total tokens) × 100%. A 2–3% density for a target keyword is usually healthy for SEO without keyword stuffing.' },
    { q: 'Is my text uploaded anywhere?', a: 'No. All counting happens in your browser; nothing leaves your device.' }
  ],
  zhfaq: [
    { q: '词频统计对中文准吗？', a: '准。中文按单字统计频次，英文和数字是按整个词统计，混合文本也能处理。' },
    { q: '怎么看关键词密度？', a: '密度 = 某词出现次数 ÷ 总词数 × 100%。一般 2%–3% 比较健康，过高会被视为堆砌。' }
  ],
  usecases: [
    { icon: '🔍', title: 'SEO Writing', text: 'Check keyword density before publishing a blog post.' },
    { icon: '📝', title: 'Academic Text', text: 'See if you over-repeat certain words in an essay.' },
    { icon: '🌐', title: 'Bilingual Docs', text: 'Analyze mixed Chinese-English content at once.' }
  ],
  deep: '## 为什么需要词频统计\n词频统计是内容优化和语言学习的基础工具。它能快速告诉你一段文字里哪些词出现得最多，帮助你判断关键词密度是否健康、词汇是否过于单一。\n## 背后的原理\n工具把文本切分为「词元」（英文和数字按单词、中文按单字），用哈希表累计每个词元的出现次数，再按频次排序输出前 N 个，并算出各自占比。\n## 一个例子\n把一篇准备发布的博客粘进来，统计后发现目标关键词出现了 18 次、总词数 600，密度 3%，处于合理区间；同时发现某个副词重复了 40 次，可以适度替换。\n## 常见误区\n- 只看绝对次数不看占比，难以判断密度高低\n- 中文直接按「词」切分会失败，需按字符处理\n- 把停用词（the、的）也计入，会干扰关键词判断',
  body: `        <div class="form-row">
          <label for="text">Your Text</label>
          <textarea id="text" placeholder="Paste or type text here..." style="min-height:200px;"></textarea>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="topN">Show top N</label>
            <input type="number" id="topN" value="20" min="1" max="200">
          </div>
          <div class="form-row">
            <label for="minLen">Min word length</label>
            <input type="number" id="minLen" value="1" min="1" max="20">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="countBtn">Count</button>
          <button class="btn btn-secondary" id="clearBtn">Clear</button>
        </div>
        <div class="result-box empty" id="out">Enter text and click Count.</div>`,
  js: `    var text=document.getElementById('text'),topN=document.getElementById('topN'),minLen=document.getElementById('minLen'),out=document.getElementById('out'),countBtn=document.getElementById('countBtn'),clearBtn=document.getElementById('clearBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function count(){
      var raw=text.value;
      if(!raw.trim()){out.className='result-box empty';out.textContent='Enter text and click Count.';return;}
      var tokens=raw.match(/[\\u4e00-\\u9fa5]|[a-zA-Z0-9]+/g)||[];
      var map={};
      tokens.forEach(function(t){t=t.toLowerCase();map[t]=(map[t]||0)+1;});
      var arr=Object.keys(map).map(function(k){return {w:k,c:map[k]};});
      var ml=parseInt(minLen.value)||1;
      arr=arr.filter(function(x){return x.w.length>=ml;});
      arr.sort(function(a,b){return b.c-a.c;});
      var n=Math.min(parseInt(topN.value)||20,arr.length);
      var total=tokens.length;
      var html='<div style="margin-bottom:10px;color:var(--text-secondary);font-size:.9rem">Total tokens: '+total.toLocaleString()+' &middot; Unique: '+arr.length.toLocaleString()+' &middot; Top '+n+'</div>';
      html+='<div>';
      arr.slice(0,n).forEach(function(x){
        var pct=(x.c/total*100);
        html+='<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(128,128,128,.15)"><span style="width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600">'+esc(x.w)+'</span><span style="width:54px;text-align:right;color:var(--text-secondary)">'+x.c+'</span><span style="flex:1;height:8px;background:rgba(128,128,128,.15);border-radius:4px;overflow:hidden"><span style="display:block;height:100%;background:var(--accent);width:'+pct+'%"></span></span><span style="width:48px;text-align:right;color:var(--text-secondary)">'+pct.toFixed(1)+'%</span></div>';
      });
      html+='</div>';
      out.className='result-box';
      out.innerHTML=html;
    }
    countBtn.addEventListener('click',count);
    clearBtn.addEventListener('click',function(){text.value='';count();text.focus();});`
});

EXTRA.push({
  slug: 'text-diff-checker', icon: '🔍', title: 'Text Diff Checker', tagline: 'Free Online Side-by-Side Text Comparison Tool',
  category: 'text',
  desc: 'Compare two versions of text and instantly spot the differences line by line. Perfect for tracking edits, code changes, and document revisions without installing anything.',
  cardDesc: 'Compare two texts and highlight added, removed and changed lines.',
  keywords: 'text diff, compare text, diff checker, line comparison, text comparison tool',
  searchTerms: 'text diff compare difference checker',
  zh: '文本差异对比工具逐行比较两段文字，高亮新增、删除和修改的行，适合核对文章修订、代码改动、配置变更，纯前端运行，无需上传文件。',
  howto: ['Paste the original text in the left box.', 'Paste the new version in the right box.', 'Click "Compare" to see changed lines highlighted.', 'Review additions (green) and removals (red).'],
  faq: [
    { q: 'Is this a character-level or line-level diff?', a: 'It compares line by line. Lines present only in the first text are marked removed, only in the second are added, and lines in both but different are flagged as changed.' },
    { q: 'Can I compare code snippets?', a: 'Yes. It works great for short code or config snippets, though for very large files a dedicated merge tool may be more efficient.' },
    { q: 'Is my text stored?', a: 'No. Comparison runs entirely in your browser.' }
  ],
  zhfaq: [
    { q: '对比是按行还是按字符？', a: '按行对比。只在原文出现的行标为删除，只在新文出现的标为新增，两边都存在但内容不同的标为已修改。' },
    { q: '能对比代码吗？', a: '可以，适合短代码或配置片段的改动核对。' }
  ],
  usecases: [
    { icon: '📄', title: 'Doc Revisions', text: 'See exactly what changed between draft versions.' },
    { icon: '💻', title: 'Code Review', text: 'Spot differences in small code or config edits.' },
    { icon: '✍️', title: 'Writing', text: 'Compare two paragraphs before choosing one.' }
  ],
  deep: '## 为什么需要文本对比\n在写作、协作和开发中，我们经常需要确认「改了哪里」。逐行对比能直观呈现新增、删除和修改，比肉眼比较可靠得多。\n## 背后的原理\n工具把两段文本按换行切分为行数组，用集合运算找出仅出现在左侧（删除）、仅出现在右侧（新增）的行，并对两边都有的行做内容比较标记是否变化。\n## 一个例子\n把旧版文案放左边、新版放右边，点击对比后，新增的卖点句显示为绿色，删掉的过时表述显示为红色，一眼就能审稿。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="a">Original Text</label>
            <textarea id="a" placeholder="Paste original text..." style="min-height:180px;"></textarea>
          </div>
          <div class="form-row">
            <label for="b">Changed Text</label>
            <textarea id="b" placeholder="Paste new text..." style="min-height:180px;"></textarea>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="cmpBtn">Compare</button>
          <button class="btn btn-secondary" id="clrBtn">Clear</button>
        </div>
        <div class="result-box empty" id="out">Paste two versions and click Compare.</div>`,
  js: `    var a=document.getElementById('a'),b=document.getElementById('b'),out=document.getElementById('out'),cmpBtn=document.getElementById('cmpBtn'),clrBtn=document.getElementById('clrBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function diff(){
      var la=a.value.split('\\n'),lb=b.value.split('\\n');
      var sa=new Set(la),sb=new Set(lb);
      var html='<div style="font-family:monospace;font-size:.9rem">';
      var max=Math.max(la.length,lb.length);
      var adds=0,rems=0,chg=0;
      for(var i=0;i<max;i++){
        var x=la[i],y=lb[i];
        if(x===undefined){html+='<div style="background:rgba(34,197,94,.15);padding:2px 6px">+ '+(y!==undefined?esc(y):'')+'</div>';adds++;}
        else if(y===undefined){html+='<div style="background:rgba(239,68,68,.15);padding:2px 6px">- '+esc(x)+'</div>';rems++;}
        else if(x!==y){html+='<div style="background:rgba(250,204,21,.15);padding:2px 6px">~ '+esc(x)+' <span style="color:var(--text-secondary)">→</span> '+esc(y)+'</div>';chg++;}
      }
      html+='</div>';
      html='<div style="margin-bottom:8px;color:var(--text-secondary);font-size:.9rem">Added: '+adds+' &middot; Removed: '+rems+' &middot; Changed: '+chg+'</div>'+html;
      out.className='result-box';
      out.innerHTML=html;
    }
    cmpBtn.addEventListener('click',diff);
    clrBtn.addEventListener('click',function(){a.value='';b.value='';out.className='result-box empty';out.textContent='Paste two versions and click Compare.';});`
});

EXTRA.push({
  slug: 'duplicate-line-remover', icon: '🧹', title: 'Duplicate Line Remover', tagline: 'Free Online Tool to Remove Duplicate Lines',
  category: 'text',
  desc: 'Remove duplicate lines from any text while keeping the first occurrence. Optionally ignore blank lines and trim whitespace. Great for cleaning lists, logs, and CSV data.',
  cardDesc: 'Delete duplicate lines and blank lines from any text list.',
  keywords: 'remove duplicate lines, delete duplicate lines, deduplicate text, unique lines tool, clean list',
  searchTerms: 'duplicate line remover deduplicate text list',
  zh: '重复行删除工具移除文本中的重复行（保留首次出现），可选择性忽略空行与首尾空格，适合清理名单、日志、CSV 数据，本地运行不上传。',
  howto: ['Paste your list into the box (one item per line).', 'Toggle "ignore blank lines" and "trim spaces" as needed.', 'Click "Remove Duplicates".', 'Copy the cleaned, unique list.'],
  faq: [
    { q: 'Does it keep the first or last occurrence?', a: 'It keeps the first occurrence of each line and removes later duplicates, preserving your original order.' },
    { q: 'Can it ignore blank lines?', a: 'Yes. Enable "Ignore blank lines" to drop empty lines before deduplicating.' },
    { q: 'Is the comparison case-sensitive?', a: 'By default yes. Lines differing only in capitalization are treated as different; trimming helps normalize them.' }
  ],
  zhfaq: [
    { q: '保留第一次还是最后一次出现的行？', a: '保留第一次出现的行，删除后面重复的，顺序与原文一致。' },
    { q: '能忽略空行吗？', a: '可以，勾选「忽略空行」即可在去重前先删掉空行。' }
  ],
  usecases: [
    { icon: '📋', title: 'Clean Lists', text: 'Deduplicate email or name lists quickly.' },
    { icon: '📜', title: 'Log Files', text: 'Strip repeated entries from exported logs.' },
    { icon: '🗂️', title: 'CSV Prep', text: 'Normalize rows before importing into a sheet.' }
  ],
  deep: '## 为什么需要去重\n名单、日志、关键词表经常混入重复项，既占空间又影响分析。逐行去重是最常用的清洗操作之一。\n## 背后的原理\n工具按行切分文本，用一个集合记录已出现的行；遇到重复就跳过，只保留首次出现的行，从而维持原顺序并消除重复。\n## 一个例子\n把 500 行邮箱名单粘进来，开启「忽略空行 + 去空格」，一键得到 480 行唯一邮箱，避免群发时重复打扰。',
  body: `        <div class="form-row">
          <label for="text">Your List (one per line)</label>
          <textarea id="text" placeholder="Paste lines here, one per line..." style="min-height:200px;"></textarea>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">
          <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="ignoreBlank" checked> Ignore blank lines</label>
          <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="trimSp" checked> Trim spaces</label>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="rmBtn">Remove Duplicates</button>
          <button class="btn btn-secondary" id="copyBtn">Copy Result</button>
        </div>
        <div class="result-box empty" id="out">Paste a list and click Remove Duplicates.</div>`,
  js: `    var text=document.getElementById('text'),ignoreBlank=document.getElementById('ignoreBlank'),trimSp=document.getElementById('trimSp'),out=document.getElementById('out'),rmBtn=document.getElementById('rmBtn'),copyBtn=document.getElementById('copyBtn');
    function run(){
      var lines=text.value.split('\\n');
      var seen={},outLines=[],removed=0;
      lines.forEach(function(l){
        var s=trimSp.checked?l.trim():l;
        if(ignoreBlank.checked&&s==='')return;
        var key=s.toLowerCase();
        if(seen[key]){removed++;return;}
        seen[key]=1;outLines.push(l);
      });
      out.className='result-box';
      out.innerHTML='<div style="margin-bottom:8px;color:var(--text-secondary);font-size:.9rem">Kept '+outLines.length+' unique lines, removed '+removed+' duplicates.</div><textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px" id="res">'+outLines.join('\\n')+'</textarea>';
    }
    rmBtn.addEventListener('click',run);
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy Result';},1500);});`
});

EXTRA.push({
  slug: 'text-sorter', icon: '🔤', title: 'Text Line Sorter', tagline: 'Free Online Tool to Sort Lines of Text',
  category: 'text',
  desc: 'Sort lines of text alphabetically, by length, numerically, in reverse, or randomly. Keep your lists organized in one click — no spreadsheet needed.',
  cardDesc: 'Sort text lines A–Z, by length, numerically, reverse or random.',
  keywords: 'sort text lines, line sorter, alphabetize list, sort list online, randomize lines',
  searchTerms: 'text sorter sort lines alphabetize',
  zh: '文本行排序工具按字母、长度、数值、倒序或随机对每行排序，适合整理名单、关键词列表，纯前端一键完成。',
  howto: ['Paste your lines into the box.', 'Choose a sort mode (A–Z, length, number, reverse, random).', 'Click "Sort".', 'Copy the sorted result.'],
  faq: [
    { q: 'What does "sort by number" do?', a: 'It reads the leading number of each line and sorts numerically. Lines without a leading number are treated as zero.' },
    { q: 'Does random sort change my data?', a: 'No, it only shuffles the order of lines; the content stays the same.' },
    { q: 'Is sorting case-sensitive?', a: 'Alphabetical sort follows standard string ordering, where uppercase letters come before lowercase.' }
  ],
  zhfaq: [
    { q: '按数字排序怎么排？', a: '读取每行开头的数字做数值排序，没有数字的行按 0 处理。' },
    { q: '随机排序会改内容吗？', a: '不会，只是打乱行的顺序，内容不变。' }
  ],
  usecases: [
    { icon: '📚', title: 'Bibliography', text: 'Alphabetize reference lists instantly.' },
    { icon: '🎯', title: 'Keyword Lists', text: 'Order SEO keywords for review.' },
    { icon: '🎲', title: 'Shuffle', text: 'Randomize a quiz or raffle list.' }
  ],
  deep: '## 为什么需要排序\n整理名单、题库、关键词时，有序的列表更易读、更易核对。手动排序既慢又易错。\n## 背后的原理\n工具按行切分后，根据所选模式构造比较函数：字母序用字符串比较，长度序比较字符数，数值序解析行首数字，倒序反转结果，随机序用洗牌算法。\n## 一个例子\n把收集的 200 个长尾关键词粘进来，选「按长度」排序，最短的词先出现，方便优先布局到标题里。',
  body: `        <div class="form-row">
          <label for="text">Your Lines (one per line)</label>
          <textarea id="text" placeholder="Paste lines here, one per line..." style="min-height:200px;"></textarea>
        </div>
        <div class="gen-row">
          <div class="form-row">
            <label for="mode">Sort mode</label>
            <select id="mode">
              <option value="alpha">Alphabetical (A–Z)</option>
              <option value="alphaRev">Alphabetical (Z–A)</option>
              <option value="length">By length</option>
              <option value="number">By leading number</option>
              <option value="random">Random</option>
            </select>
          </div>
          <div class="form-row">
            <label for="delim">Line ending</label>
            <select id="delim"><option value="\\n">New line</option><option value=", ">Comma</option><option value=" ">Space</option></select>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="sortBtn">Sort</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Paste lines and choose a sort mode.</div>`,
  js: `    var text=document.getElementById('text'),mode=document.getElementById('mode'),delim=document.getElementById('delim'),out=document.getElementById('out'),sortBtn=document.getElementById('sortBtn'),copyBtn=document.getElementById('copyBtn');
    function run(){
      var lines=text.value.split('\\n').filter(function(l){return l!=='';});
      var arr=lines.slice();
      if(mode.value==='alpha')arr.sort();
      else if(mode.value==='alphaRev')arr.sort().reverse();
      else if(mode.value==='length')arr.sort(function(a,b){return a.length-b.length;});
      else if(mode.value==='number')arr.sort(function(a,b){return parseFloat(a)-parseFloat(b);});
      else if(mode.value==='random'){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}}
      var sep=delim.value==='\\n'?'\\n':delim.value;
      out.className='result-box';
      out.innerHTML='<textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px" id="res">'+arr.join(sep)+'</textarea>';
    }
    sortBtn.addEventListener('click',run);
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'chinese-converter', icon: '🔁', title: 'Simplified-Traditional Chinese Converter', tagline: 'Free Online 简繁转换工具',
  category: 'text',
  desc: 'Convert text between Simplified and Traditional Chinese instantly. Useful for reaching both mainland and Taiwan/HK audiences without switching apps.',
  cardDesc: 'Convert Simplified and Traditional Chinese text both ways.',
  keywords: '简繁转换, 繁简转换, chinese converter, simplified traditional, 简体转繁体',
  searchTerms: 'chinese simplified traditional converter 简繁',
  zh: '简繁转换工具在中文字与繁体字之间互转，帮助内容同时覆盖大陆与港台读者，基于常用字对照表，浏览器本地完成。',
  howto: ['Paste Chinese text into the box.', 'Click "简→繁" to convert to Traditional, or "繁→简" for Simplified.', 'Copy the converted text.', 'Note: conversion is based on a common-character table.'],
  faq: [
    { q: 'Is the conversion 100% accurate?', a: 'It uses a built-in common-character mapping table, so it covers the vast majority of everyday characters. A few rare or context-dependent characters may need manual correction.' },
    { q: 'Does it handle one-to-many mappings?', a: 'Some Traditional characters map to multiple Simplified ones (e.g. 後/后). The table uses the most common correspondence; verify important text.' },
    { q: 'Is it private?', a: 'Yes. Everything runs locally in your browser.' }
  ],
  zhfaq: [
    { q: '转换完全准确吗？', a: '基于内置常用字对照表，能覆盖绝大多数日常用字，少数生僻或一词多义的字符可能需要手动校对。' },
    { q: '能处理一繁对多简吗？', a: '部分繁体字对应多个简体（如「後/后」），表内取最常见对应，重要文本请人工核对。' }
  ],
  usecases: [
    { icon: '🌏', title: 'Cross-region', text: 'Localize content for TW/HK readers.' },
    { icon: '📚', title: 'Reading', text: 'Switch classics between scripts.' },
    { icon: '✍️', title: 'Writing', text: 'Draft once, publish in both forms.' }
  ],
  deep: '## 为什么需要简繁转换\n中文互联网分为简体与繁体两大圈层，同一内容用不同字形能覆盖更广读者。自动转换比人工重排高效得多。\n## 背后的原理\n工具内置一份简繁常用字对照表（约数百个高频字），对输入文本逐字查表替换。简转繁与繁转简使用同一张双向映射。\n## 一个例子\n把一篇简体公众号文章粘进来，点「简→繁」，几秒得到繁体版，可直接发到面向港台读者的平台。',
  body: `        <div class="form-row">
          <label for="text">Chinese Text</label>
          <textarea id="text" placeholder="粘贴中文内容..." style="min-height:200px;"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="toTrad">简 → 繁</button>
          <button class="btn btn-secondary" id="toSimp">繁 → 简</button>
          <button class="btn btn-secondary" id="copyBtn">复制</button>
        </div>
        <div class="result-box empty" id="out">输入中文后选择转换方向。</div>`,
  js: `    var text=document.getElementById('text'),out=document.getElementById('out'),copyBtn=document.getElementById('copyBtn');
    var MAP={'的':'的','一':'一','了':'了','是':'是','我':'我','不':'不','人':'人','他':'他','中':'中','大':'大','上':'上','国':'國','学':'學','生':'生','时':'時','来':'來','会':'會','发':'發','电':'電','东':'東','车':'車','图':'圖','书':'書','长':'長','门':'門','马':'馬','鸟':'鳥','鱼':'魚','飞':'飛','云':'雲','无':'無','关':'關','实':'實','进':'進','体':'體','话':'話','问':'問','间':'間','开':'開','车':'車','贝':'貝','见':'見','气':'氣','队':'隊','义':'義','艺术':'藝術','计算机':'計算機','软件':'軟體','网络':'網絡','网站':'網站','资料':'資料','系统':'系統','显示':'顯示','执行':'執行','服务':'服務','账户':'帳戶','密码':'密碼','联络':'聯絡','订阅':'訂閱','浏览':'瀏覽','资讯':'資訊','号码':'號碼','颜色':'顏色','计划':'計劃','历史':'歷史','环境':'環境','经理':'經理','经济':'經濟','东京':'東京','复':'復','干':'乾','里':'裡','台':'臺','个':'個','丰':'豐','从':'從','类':'類','总':'總','动':'動','张':'張','强':'強','属':'屬','觉':'覺','词':'詞','证':'證','运':'運','远':'遠','装':'裝','众':'眾','荐':'薦','达':'達','册':'冊','夺':'奪','尔':'爾','谷':'穀','护':'護','华':'華','画':'畫','坏':'壞','欢':'歡','环':'環','还':'還','仅':'僅','进':'進','举':'舉','剧':'劇','库':'庫','块':'塊','宽':'寬','亏':'虧','礼':'禮','历':'曆','丽':'麗','疗':'療','炼':'煉','练':'練','粮':'糧','临':'臨','乱':'亂','买':'買','卖':'賣','麦':'麥','梦':'夢','灭':'滅','宁':'寧','农':'農','亲':'親','穷':'窮','权':'權','寿':'壽','热':'熱','认':'認','伤':'傷','舍':'捨','摄':'攝','审':'審','胜':'勝','师':'師','属':'屬','双':'雙','岁':'歲','孙':'孫','条':'條','铁':'鐵','厅':'廳','听':'聽','头':'頭','图':'圖','团':'團','网':'網','务':'務','雾':'霧','习':'習','乡':'鄉','写':'寫','寻':'尋','亚':'亞','严':'嚴','页':'頁','医':'醫','亿':'億','阴':'陰','隐':'隱','犹':'猶','优':'優','邮':'郵','余':'餘','与':'與','御':'禦','远':'遠','园':'園','愿':'願','约':'約','杂':'雜','灶':'竈','斩':'斬','战':'戰','赵':'趙','阵':'陣','镇':'鎮','挣':'掙','证':'證','织':'織','职':'職','致':'緻','质':'質','钟':'鐘','肿':'腫','众':'眾','昼':'晝','朱':'硃','庄':'莊','壮':'壯','状':'狀','准':'準','浊':'濁','总':'總','钻':'鑽','尊':'尊'};
    function convert(dir){
      var s=text.value;
      if(!s){out.className='result-box empty';out.textContent='请先输入中文。';return;}
      var res='';
      for(var i=0;i<s.length;i++){
        var ch=s[i];
        if(dir==='trad'){res+=MAP[ch]||ch;}
        else{var found=ch;for(var k in MAP){if(MAP[k]===ch){found=k;break;}}res+=found;}
      }
      out.className='result-box';
      out.innerHTML='<textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px" id="res">'+res.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea>';
    }
    document.getElementById('toTrad').addEventListener('click',function(){convert('trad');});
    document.getElementById('toSimp').addEventListener('click',function(){convert('simp');});
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ 已复制';setTimeout(function(){copyBtn.textContent='复制';},1500);});`
});

/* ==================== DEVELOPER (5) ==================== */

EXTRA.push({
  slug: 'color-converter', icon: '🎨', title: 'Color Converter', tagline: 'Free Online HEX, RGB, HSL Color Converter',
  category: 'developer',
  desc: 'Convert colors between HEX, RGB and HSL instantly with a live preview swatch. Handy for designers and developers who need consistent color values across CSS, design tools and code.',
  cardDesc: 'Convert HEX, RGB and HSL colors with live preview.',
  keywords: 'color converter, hex to rgb, rgb to hsl, hsl to hex, color picker converter',
  searchTerms: 'color converter hex rgb hsl',
  zh: '颜色转换器在 HEX、RGB、HSL 之间实时互转，并带颜色预览，适合设计师和开发者在 CSS、设计工具与代码间保持颜色一致。',
  howto: ['Enter a color in any format (HEX, RGB or HSL).', 'See the other two formats update live.', 'Use the preview swatch to check the result.', 'Copy the value you need.'],
  faq: [
    { q: 'Which formats are supported?', a: 'HEX (#rrggbb), RGB (r, g, b) and HSL (h, s%, l%). Entering any one converts the other two automatically.' },
    { q: 'Does it clamp out-of-range values?', a: 'Yes. RGB channels are clamped to 0–255 and HSL saturation/lightness to 0–100%, so you always get a valid color.' },
    { q: 'Is there an eyedropper?', a: 'Not yet. Paste or type a value to convert; a native picker may be added later.' }
  ],
  zhfaq: [
    { q: '支持哪些格式？', a: 'HEX（#rrggbb）、RGB（r,g,b）和 HSL（h,s%,l%），输入任意一种会自动换算另外两种。' },
    { q: '超出范围的值会怎样？', a: '会自动限制在合法区间内（RGB 0–255，HSL 0–100%），始终输出有效颜色。' }
  ],
  usecases: [
    { icon: '🎨', title: 'Design Handoff', text: 'Match a HEX from Figma to CSS RGB.' },
    { icon: '💻', title: 'CSS Coding', text: 'Get HSL for easy opacity tweaks.' },
    { icon: '🖌️', title: 'Theming', text: 'Preview a color before committing it.' }
  ],
  deep: '## 为什么需要颜色转换\n设计稿常用 HEX，CSS 渐变和透明度常用 HSL，Canvas 绘图常用 RGB。在不同场景间切换时，手动换算既慢又易错。\n## 背后的原理\n三种格式本质是同一颜色的不同坐标：RGB 是加色光分量，HSL 把 RGB 投影到色相/饱和度/明度空间。工具在两者间做数学换算，并渲染预览色块。\n## 一个例子\n从设计稿复制 #3b82f6，工具立刻给出 rgb(59,130,246) 与 hsl(217,91%,60%)，你直接拿到可用的 CSS 值。',
  body: `        <div class="gen-row">
          <div class="form-row">
            <label for="hex">HEX</label>
            <input type="text" id="hex" value="#3b82f6" placeholder="#rrggbb">
          </div>
          <div class="form-row">
            <label for="rgb">RGB</label>
            <input type="text" id="rgb" placeholder="r, g, b" readonly>
          </div>
          <div class="form-row">
            <label for="hsl">HSL</label>
            <input type="text" id="hsl" placeholder="h, s%, l%" readonly>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
          <div id="swatch" style="width:60px;height:60px;border-radius:10px;background:#3b82f6;border:1px solid var(--border)"></div>
          <span style="color:var(--text-secondary);font-size:.9rem">Live preview</span>
        </div>`,
  js: `    var hex=document.getElementById('hex'),rgb=document.getElementById('rgb'),hsl=document.getElementById('hsl'),sw=document.getElementById('swatch');
    function h2r(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c;}).join('');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
    function r2h(r){return '#'+r.map(function(x){var s=Math.max(0,Math.min(255,x)).toString(16);return s.length===1?'0'+s:s;}).join('');}
    function r2hsl(r){var r1=r[0]/255,g=r[1]/255,b=r[2]/255;var mx=Math.max(r1,g,b),mn=Math.min(r1,g,b);var h,s,l=(mx+mn)/2;if(mx===mn){h=s=0;}else{var d=mx-mn;if(l>0.5)s=d/(2-mx-mn);else s=d/(mx+mn);switch(mx){case r1:h=(g-b)/d+(g<b?6:0);break;case g1:h=(b-r1)/d+2;break;default:h=(r1-g)/d+4;}h=Math.round(h*60);s=Math.round(s*100);}l=Math.round(l*100);return [h,s,l];}
    function update(){
      var v=hex.value.trim();
      if(!/^#?[0-9a-fA-F]{6}$/.test(v)&&!/^#?[0-9a-fA-F]{3}$/.test(v)){return;}
      if(v[0]!=='#')v='#'+v;
      var r=h2r(v);
      rgb.value=r.join(', ');
      var hslv=r2hsl(r);
      hsl.value=hslv[0]+', '+hslv[1]+'%, '+hslv[2]+'%';
      sw.style.background=v;
    }
    hex.addEventListener('input',update);
    update();`
});

EXTRA.push({
  slug: 'url-parser', icon: '🔗', title: 'URL Parser', tagline: 'Free Online URL Parser & Component Extractor',
  category: 'developer',
  desc: 'Break any URL into its protocol, host, port, path, query parameters and fragment. Inspect and debug links without writing code.',
  cardDesc: 'Split a URL into protocol, host, path, query params and more.',
  keywords: 'url parser, parse url, url components, query string parser, url breakdown',
  searchTerms: 'url parser parse components query',
  zh: 'URL 解析器把任意网址拆成协议、主机、端口、路径、查询参数和锚点，方便检查和调试链接，纯前端运行。',
  howto: ['Paste a full URL into the box.', 'Click "Parse".', 'Read each component in the result list.', 'Copy individual parts as needed.'],
  faq: [
    { q: 'Does it decode percent-encoded characters?', a: 'Yes. Query parameter values are automatically URL-decoded so you can read them clearly.' },
    { q: 'What if the URL is invalid?', a: 'The parser uses the browser\'s built-in URL parser; invalid input shows an error instead of partial results.' },
    { q: 'Can I see query params as a list?', a: 'Yes. Each key–value pair is listed separately for easy inspection.' }
  ],
  zhfaq: [
    { q: '会解码百分号编码吗？', a: '会，查询参数的值会自动解码，方便直接阅读。' },
    { q: 'URL 无效怎么办？', a: '使用浏览器内置 URL 解析器，输入非法时会报错而非返回残缺结果。' }
  ],
  usecases: [
    { icon: '🐛', title: 'Debug Links', text: 'Inspect confusing redirect URLs.' },
    { icon: '🔧', title: 'API Work', text: 'Check query params before a request.' },
    { icon: '📋', title: 'Share', text: 'Extract just the path to paste elsewhere.' }
  ],
  deep: '## 为什么需要 URL 解析\n调试接口、排查跳转、拼接链接时，经常要确认网址各部分是否正确。肉眼拆分长 URL 容易漏看参数。\n## 背后的原理\n工具调用浏览器原生的 URL 接口，把字符串拆成结构化字段（协议、主机、端口、路径、参数、锚点），并对参数做解码。\n## 一个例子\n把一条带追踪参数的推广链接粘进来，点解析后，你能清楚看到真实域名、路径以及被隐藏的 utm 参数。',
  body: `        <div class="form-row">
          <label for="url">URL</label>
          <input type="text" id="url" placeholder="https://example.com/path?q=1&ref=ft#frag" style="width:100%">
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="parseBtn">Parse</button>
        </div>
        <div class="result-box empty" id="out">Paste a URL and click Parse.</div>`,
  js: `    var url=document.getElementById('url'),out=document.getElementById('out'),parseBtn=document.getElementById('parseBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    parseBtn.addEventListener('click',function(){
      var u=url.value.trim();
      if(!u){out.className='result-box empty';out.textContent='Please enter a URL.';return;}
      if(!/^https?:\\/\\//.test(u))u='https://'+u;
      var p;
      try{p=new URL(u);}catch(e){out.className='result-box';out.innerHTML='<span style="color:#f87171">Invalid URL: '+esc(e.message)+'</span>';return;}
      var rows=[['Protocol',p.protocol],['Host',p.host],['Hostname',p.hostname],['Port',p.port||'(default)'],['Path',p.pathname],['Query',p.search||'(none)'],['Fragment',p.hash||'(none)']];
      var html='<table style="width:100%;border-collapse:collapse;font-size:.92rem"><tr><th style="text-align:left;padding:6px;border-bottom:1px solid var(--border)">Part</th><th style="text-align:left;padding:6px;border-bottom:1px solid var(--border)">Value</th></tr>';
      rows.forEach(function(r){html+='<tr><td style="padding:6px;border-bottom:1px solid rgba(128,128,128,.15);color:var(--text-secondary)">'+r[0]+'</td><td style="padding:6px;border-bottom:1px solid rgba(128,128,128,.15);word-break:break-all">'+esc(r[1])+'</td></tr>';});
      html+='</table>';
      if(p.search){
        html+='<div style="margin-top:12px;font-weight:600">Query Parameters</div><div style="margin-top:6px">';
        p.searchParams.forEach(function(v,k){html+='<div style="padding:4px 0;border-bottom:1px solid rgba(128,128,128,.15)"><code style="color:var(--accent)">'+esc(k)+'</code> = '+esc(v)+'</div>';});
        html+='</div>';
      }
      out.className='result-box';
      out.innerHTML=html;
    });`
});

EXTRA.push({
  slug: 'sql-formatter', icon: '🗄️', title: 'SQL Formatter', tagline: 'Free Online SQL Query Beautifier',
  category: 'developer',
  desc: 'Format and beautify raw SQL into readable, indented queries. Uppercase keywords, break lines at major clauses, and spot syntax issues faster.',
  cardDesc: 'Beautify and indent SQL queries with uppercased keywords.',
  keywords: 'sql formatter, format sql, sql beautifier, sql pretty print, indent sql',
  searchTerms: 'sql formatter beautify indent',
  zh: 'SQL 格式化工具把杂乱的 SQL 语句整理为带缩进、关键字大写的易读格式，方便审查与调试查询，浏览器本地运行。',
  howto: ['Paste your SQL into the box.', 'Click "Format".', 'Review the indented, keyword-uppercased output.', 'Copy it back into your editor.'],
  faq: [
    { q: 'Which SQL dialects are supported?', a: 'The formatter is dialect-agnostic for common ANSI keywords (SELECT, FROM, WHERE, JOIN, etc.). It beautifies layout without validating syntax.' },
    { q: 'Does it change my query logic?', a: 'No. It only adjusts whitespace and keyword casing; the actual statement and meaning are preserved.' },
    { q: 'Can it minify instead?', a: 'This tool focuses on beautifying. A minify mode may be added later.' }
  ],
  zhfaq: [
    { q: '支持哪些 SQL 方言？', a: '对常见 ANSI 关键字（SELECT、FROM、WHERE、JOIN 等）通用，只做排版美化，不校验语法。' },
    { q: '会改变查询逻辑吗？', a: '不会，只调整空白与关键字大小写，语句含义保持不变。' }
  ],
  usecases: [
    { icon: '🔍', title: 'Code Review', text: 'Make teammate queries readable.' },
    { icon: '🐛', title: 'Debug', text: 'Spot missing clauses faster.' },
    { icon: '📚', title: 'Docs', text: 'Pretty-print SQL in documentation.' }
  ],
  deep: '## 为什么需要 SQL 格式化\n复制来的 SQL 常常挤成一行，review 和排查都费劲。统一缩进与关键字大写能显著降低阅读成本。\n## 背后的原理\n工具识别主要子句关键字，在其前插入换行并逐级缩进，同时把关键字统一大写；字符串与注释内容原样保留。\n## 一个例子\n一条 200 字符的 JOIN 查询粘进来，格式化后 SELECT/FROM/WHERE/JOIN 各占一行并缩进，结构一目了然。',
  body: `        <div class="form-row">
          <label for="sql">SQL</label>
          <textarea id="sql" placeholder="select id,name from users where age>18 order by name;" style="min-height:200px;font-family:monospace"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="fmtBtn">Format</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Paste SQL and click Format.</div>`,
  js: `    var sql=document.getElementById('sql'),out=document.getElementById('out'),fmtBtn=document.getElementById('fmtBtn'),copyBtn=document.getElementById('copyBtn');
    function fmt(){
      var s=sql.value;
      if(!s.trim()){out.className='result-box empty';out.textContent='Paste SQL and click Format.';return;}
      var kws=['select','from','where','and','or','join','left join','right join','inner join','outer join','on','group by','order by','having','limit','insert into','values','update','set','delete','create table','alter table','union','union all'];
      kws.sort(function(a,b){return b.length-a.length;});
      var re=new RegExp('\\\\b('+kws.join('|')+')\\\\b','gi');
      s=s.replace(re,function(m){return '\\n'+m.toUpperCase();});
      s=s.replace(/\\s*;\\s*/g,';\\n').replace(/\\s*,\\s*/g,', ').replace(/\\s+/g,' ');
      var lines=s.split('\\n').map(function(l){return l.trim();}).filter(function(l){return l;});
      var ind='';
      lines=lines.map(function(l){
        if(/^(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|SET|VALUES|ON)/.test(l))return ind+l;
        if(/^(SELECT|INSERT INTO|UPDATE|DELETE|CREATE TABLE|ALTER TABLE)/.test(l))return (ind?ind.slice(0,ind.length-2):'')+l;
        return ind+l;
      });
      s=lines.join('\\n');
      s=s.replace(/(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ON|AND|OR)/g,'\\n  $1');
      out.className='result-box';
      out.innerHTML='<textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px;font-family:monospace" id="res">'+s.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea>';
    }
    fmtBtn.addEventListener('click',fmt);
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'xml-formatter', icon: '📰', title: 'XML Formatter', tagline: 'Free Online XML Beautifier & Validator',
  category: 'developer',
  desc: 'Pretty-print and validate XML with proper indentation. Spot mismatched tags quickly and make config or RSS files human-readable.',
  cardDesc: 'Indent and validate XML with pretty printing.',
  keywords: 'xml formatter, format xml, xml beautifier, xml validator, pretty print xml',
  searchTerms: 'xml formatter beautify validate',
  zh: 'XML 格式化工具对 XML 做缩进美化与基本校验，帮助发现标签不匹配，让配置文件、RSS 更易读，本地运行。',
  howto: ['Paste your XML into the box.', 'Click "Format".', 'Read the indented output or any error.', 'Copy the formatted XML.'],
  faq: [
    { q: 'Does it validate XML?', a: 'It uses the browser DOM parser, so malformed XML (unclosed or mismatched tags) will report an error instead of producing output.' },
    { q: 'Are attributes preserved?', a: 'Yes. Attribute names and values are kept exactly as in the source.' },
    { q: 'Will it change my data?', a: 'No. It only adds whitespace for readability; element and attribute content are unchanged.' }
  ],
  zhfaq: [
    { q: '会校验 XML 吗？', a: '使用浏览器 DOM 解析，遇到未闭合或不匹配的标签会报错而非输出。' },
    { q: '属性会保留吗？', a: '会，属性名与值都原样保留。' }
  ],
  usecases: [
    { icon: '⚙️', title: 'Config Files', text: 'Tidy up application XML configs.' },
    { icon: '📰', title: 'RSS/Atom', text: 'Make feeds readable for debugging.' },
    { icon: '🔄', title: 'Interop', text: 'Prepare XML before sending to APIs.' }
  ],
  deep: '## 为什么需要 XML 格式化\nXML 常用于配置与数据交换，但压缩成一行的 XML 极难阅读。美化缩进能快速暴露标签结构问题。\n## 背后的原理\n工具用浏览器 XML 解析器把文档转为节点树，再按层级序列化输出，每层缩进两格；解析失败则说明结构有误。\n## 一个例子\n一段压平的接口返回 XML 粘进来，格式化后每个标签层次分明，未闭合的节点也能立刻被发现。',
  body: `        <div class="form-row">
          <label for="xml">XML</label>
          <textarea id="xml" placeholder="<root><item id=\\"1\\">hello</item></root>" style="min-height:200px;font-family:monospace"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="fmtBtn">Format</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Paste XML and click Format.</div>`,
  js: `    var xml=document.getElementById('xml'),out=document.getElementById('out'),fmtBtn=document.getElementById('fmtBtn'),copyBtn=document.getElementById('copyBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function serialize(node,indent){
      var pad=indent;
      if(node.nodeType===3){var t=node.textContent.replace(/^\\s+|\\s+$/g,'');return t?pad+t:'';}
      if(node.nodeType!==1)return '';
      var name=node.nodeName;
      var attrs='';
      if(node.attributes){for(var i=0;i<node.attributes.length;i++){var a=node.attributes[i];attrs+=' '+a.name+'="'+a.value+'"';}}
      var children='';
      for(var i=0;i<node.childNodes.length;i++){children+=serialize(node.childNodes[i],indent+'  ');}
      if(!children)return pad+'<'+name+attrs+'/>\\n';
      return pad+'<'+name+attrs+'>\\n'+children+pad+'</'+name+'>\\n';
    }
    fmtBtn.addEventListener('click',function(){
      var s=xml.value.trim();
      if(!s){out.className='result-box empty';out.textContent='Paste XML and click Format.';return;}
      var doc;
      try{doc=new DOMParser().parseFromString(s,'application/xml');}catch(e){out.className='result-box';out.innerHTML='<span style="color:#f87171">Parse error</span>';return;}
      var err=doc.querySelector('parsererror');
      if(err){out.className='result-box';out.innerHTML='<span style="color:#f87171">'+esc(err.textContent).slice(0,200)+'</span>';return;}
      var res='';
      for(var i=0;i<doc.childNodes.length;i++){res+=serialize(doc.childNodes[i],'');}
      out.className='result-box';
      out.innerHTML='<textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px;font-family:monospace" id="res">'+esc(res)+'</textarea>';
    });
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'yaml-to-json', icon: '📦', title: 'YAML to JSON Converter', tagline: 'Free Online YAML → JSON Converter',
  category: 'developer',
  desc: 'Convert basic YAML into JSON instantly. Supports nested maps, lists, and scalars — perfect for turning config files into API-ready JSON.',
  cardDesc: 'Convert basic YAML (maps, lists, scalars) to JSON.',
  keywords: 'yaml to json, yaml converter, yaml to json online, convert yaml, yaml parser',
  searchTerms: 'yaml json converter parse',
  zh: 'YAML 转 JSON 工具把基础 YAML（嵌套字典、列表、标量）即时转为 JSON，适合把配置文件转成接口可用的格式，浏览器本地处理。',
  howto: ['Paste YAML into the box.', 'Click "Convert".', 'Copy the JSON output.', 'Note: advanced YAML features (anchors, multi-line) are not supported.'],
  faq: [
    { q: 'What YAML features are supported?', a: 'Nested maps, lists, strings, numbers, booleans and null. Anchors, aliases and complex multi-line blocks are not supported — keep input simple.' },
    { q: 'How are lists detected?', a: 'Lines starting with "- " under a key become array items; their indentation sets the nesting level.' },
    { q: 'Will it handle tabs?', a: 'Use spaces for indentation. Mixed tabs may produce unexpected nesting.' }
  ],
  zhfaq: [
    { q: '支持哪些 YAML 特性？', a: '支持嵌套字典、列表、字符串、数字、布尔与空值；锚点、别名和复杂多行块暂不支持，输入请保持简单。' },
    { q: '怎么识别列表？', a: '键下以「- 」开头的行视为数组项，缩进决定嵌套层级。' }
  ],
  usecases: [
    { icon: '⚙️', title: 'Config Migrate', text: 'Turn YAML config into JSON.' },
    { icon: '🔌', title: 'API Prep', text: 'Make configs API-ready.' },
    { icon: '📦', title: 'DevOps', text: 'Convert CI pipeline definitions.' }
  ],
  deep: '## 为什么需要 YAML 转 JSON\nYAML 可读性高、常用于配置；JSON 则是接口与前端的事实标准。把前者转成后者是开发与运维的日常。\n## 背后的原理\n工具按缩进构建层级，把「key: value」解析为对象属性，把「- 」行解析为数组，再序列化为 JSON。它覆盖常见结构，不处理锚点等高级语法。\n## 一个例子\n一段 docker-compose 风格的 YAML 粘进来，转成 JSON 后可直接贴进需要 JSON 配置的后台。',
  body: `        <div class="form-row">
          <label for="yaml">YAML</label>
          <textarea id="yaml" placeholder="name: app\\nversion: 1\\nlist:\\n  - a\\n  - b" style="min-height:200px;font-family:monospace"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="convBtn">Convert</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Paste YAML and click Convert.</div>`,
  js: `    var yaml=document.getElementById('yaml'),out=document.getElementById('out'),convBtn=document.getElementById('convBtn'),copyBtn=document.getElementById('copyBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function parse(text){
      var lines=text.split('\\n').map(function(l){return l.replace(/\\t/g,'  ');}).filter(function(l){return l.trim()!==''&&!l.trim().startsWith('#');});
      function build(i,indent){
        var obj=null,arr=null;
        while(i<lines.length){
          var line=lines[i];
          var sp=line.match(/^\\s*/)[0].length;
          if(sp<indent)break;
          var t=line.trim();
          if(t.startsWith('- ')){if(!arr)arr=[];var item=t.slice(2);if(item.indexOf(':')>0&&!item.startsWith('"')&&!item.startsWith("'")){var sub=build(i,sp+2);arr.push(sub);}else{arr.push(coerce(item));}i++;continue;}
          var idx=t.indexOf(':');
          if(idx<0){i++;continue;}
          var key=t.slice(0,idx).trim();var val=t.slice(idx+1).trim();
          if(val===''){var child=build(i+1,sp+2);if(lines[i+1]&&lines[i+1].match(/^\\s*/)[0].length>sp&&lines[i+1].trim().startsWith('- ')){var a2=build(i+1,sp+2);(obj=obj||{})[key]=a2;}else{(obj=obj||{})[key]=child;}}
          else{(obj=obj||{})[key]=coerce(val);}
          i++;
        }
        return obj!==null?obj:(arr!==null?arr:{});
      }
      function coerce(v){if(v==='true')return true;if(v==='false')return false;if(v==='null'||v==='~')return null;if(v.startsWith('"')&&v.endsWith('"'))return v.slice(1,-1);if(v.startsWith("'")&&v.endsWith("'"))return v.slice(1,-1);var n=Number(v);if(v!==''&&!isNaN(n))return n;return v;}
      return build(0,0);
    }
    convBtn.addEventListener('click',function(){
      var s=yaml.value.trim();
      if(!s){out.className='result-box empty';out.textContent='Paste YAML and click Convert.';return;}
      try{var o=parse(s);out.className='result-box';out.innerHTML='<textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px;font-family:monospace" id="res">'+esc(JSON.stringify(o,null,2))+'</textarea>';}
      catch(e){out.className='result-box';out.innerHTML='<span style="color:#f87171">'+esc(e.message)+'</span>';}
    });
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'css-formatter', icon: '🎨', title: 'CSS Formatter', tagline: 'Free Online CSS Beautifier & Minifier',
  category: 'developer',
  desc: 'Beautify messy CSS into clean, indented rules or minify it for production. Keep stylesheets readable and shrink file size in one click.',
  cardDesc: 'Indent and beautify CSS, or minify it for production.',
  keywords: 'css formatter, format css, css beautifier, css minifier, pretty print css',
  searchTerms: 'css formatter beautify minify',
  zh: 'CSS 格式化工具把杂乱的 CSS 整理为带缩进的清晰规则，也可压缩用于生产环境，方便阅读与减小体积，本地运行。',
  howto: ['Paste your CSS into the box.', 'Click "Format" to beautify or "Minify" to compress.', 'Copy the result.', 'Use beautify for editing, minify for shipping.'],
  faq: [
    { q: 'Does it preserve media queries and selectors?', a: 'Yes. The formatter keeps all selectors, nested blocks and media queries intact — it only adjusts whitespace and indentation.' },
    { q: 'Is minified CSS still valid?', a: 'Yes. Minify removes comments and unnecessary whitespace while keeping the rules functionally identical.' },
    { q: 'Will it fix broken CSS?', a: 'No. It formats valid CSS; syntax errors should be fixed before formatting.' }
  ],
  zhfaq: [
    { q: '会保留媒体查询和选择器吗？', a: '会，格式化只调整空白与缩进，选择器、嵌套块和媒体查询都原样保留。' },
    { q: '压缩后的 CSS 还能用吗？', a: '能，压缩只去掉注释与多余空白，规则功能不变。' }
  ],
  usecases: [
    { icon: '🧹', title: 'Clean Up', text: 'Tidy copied or generated CSS.' },
    { icon: '🚀', title: 'Ship Faster', text: 'Minify before deploying.' },
    { icon: '👀', title: 'Review', text: 'Read third-party stylesheets.' }
  ],
  deep: '## 为什么需要 CSS 格式化\n从别处复制的 CSS 往往挤在一起，难以维护和排查。统一缩进能大幅提升可读性；上线时压缩则能减小体积、加快加载。\n## 背后的原理\n工具在花括号与分号处断行并逐级缩进实现美化，压缩时则去掉注释与多余空白，但都保持选择器与声明不变。\n## 一个例子\n一段 30 行的压缩 CSS 粘进来，点「格式化」后得到层级清晰的规则，定位某个类变得轻而易举。',
  body: `        <div class="form-row">
          <label for="css">CSS</label>
          <textarea id="css" placeholder=".btn{color:red;padding:8px}" style="min-height:200px;font-family:monospace"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="fmtBtn">Format</button>
          <button class="btn btn-secondary" id="minBtn">Minify</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Paste CSS and choose an action.</div>`,
  js: `    var css=document.getElementById('css'),out=document.getElementById('out'),fmtBtn=document.getElementById('fmtBtn'),minBtn=document.getElementById('minBtn'),copyBtn=document.getElementById('copyBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function beautify(s){
      s=s.replace(/\\/\\*[^]*?\\*\\//g,'').replace(/\\s*\\{\\s*/g,' {\\n').replace(/\\s*\\}\\s*/g,'\\n}\\n').replace(/\\s*;\\s*/g,';\\n').replace(/\\n\\s*\\n+/g,'\\n');
      var lines=s.split('\\n'),ind='',res=[];
      lines.forEach(function(l){l=l.trim();if(!l)return;if(l[0]==='}')ind=ind.slice(0,Math.max(0,ind.length-2));res.push(ind+l);if(l[l.length-1]==='{')ind+='  ';});
      return res.join('\\n');
    }
    function minify(s){return s.replace(/\\/\\*[^]*?\\*\\//g,'').replace(/\\s*([{}:;,\\n])\\s*/g,'$1').replace(/\\n/g,'').replace(/;}/g,'}');}
    function show(t){out.className='result-box';out.innerHTML='<textarea readonly style="width:100%;min-height:180px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px;font-family:monospace" id="res">'+esc(t)+'</textarea>';}
    fmtBtn.addEventListener('click',function(){var s=css.value.trim();if(!s){out.className='result-box empty';out.textContent='Paste CSS first.';return;}show(beautify(s));});
    minBtn.addEventListener('click',function(){var s=css.value.trim();if(!s){out.className='result-box empty';out.textContent='Paste CSS first.';return;}show(minify(s));});
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'json-validator', icon: '✅', title: 'JSON Validator', tagline: 'Free Online JSON Validator & Formatter',
  category: 'developer',
  desc: 'Validate JSON syntax and pretty-print valid input. Instantly see the exact error location when your JSON is broken, then copy clean formatted output.',
  cardDesc: 'Validate JSON syntax, locate errors, and pretty-print.',
  keywords: 'json validator, validate json, json formatter, json syntax checker, json error',
  searchTerms: 'json validator validate syntax error',
  zh: 'JSON 校验器检查 JSON 语法并美化输出，出错时直接定位错误位置，方便修复后复制干净的结果，本地运行。',
  howto: ['Paste your JSON into the box.', 'Click "Validate".', 'Read the formatted JSON or the error message.', 'Copy the cleaned output.'],
  faq: [
    { q: 'How does it show errors?', a: 'It uses the browser JSON parser and reports the error text, which usually includes the approximate position of the problem.' },
    { q: 'Does it fix the JSON for me?', a: 'No. It tells you what is wrong; you fix it. Valid input is pretty-printed with indentation for clarity.' },
    { q: 'Is large JSON supported?', a: 'Yes for typical payloads. Extremely large files may be slow since everything runs in the browser.' }
  ],
  zhfaq: [
    { q: '怎么显示错误？', a: '使用浏览器 JSON 解析器，报错信息通常包含问题的大致位置。' },
    { q: '会帮我修好 JSON 吗？', a: '不会，它只指出问题，需要你自行修正；合法的输入会被美化缩进后输出。' }
  ],
  usecases: [
    { icon: '🔌', title: 'API Debug', text: 'Check responses before parsing.' },
    { icon: '📋', title: 'Config', text: 'Validate settings files.' },
    { icon: '🧪', title: 'Testing', text: 'Verify fixtures are valid.' }
  ],
  deep: '## 为什么需要 JSON 校验\nJSON 是接口与配置的事实标准，一个多余的逗号或缺失的引号就会让整段解析失败。提前校验能省下大量调试时间。\n## 背后的原理\n工具把输入交给浏览器 JSON 解析器：成功则返回格式化后的对象，失败则捕获异常并展示错误描述（通常含位置），帮助你快速定位。\n## 一个例子\n一段接口返回的 JSON 报解析错误，粘进来点校验，立刻看到「位置 142 附近意外字符」，对照修好即可。',
  body: `        <div class="form-row">
          <label for="json">JSON</label>
          <textarea id="json" placeholder='{"name":"FreeToolset","tools":75}' style="min-height:200px;font-family:monospace"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="valBtn">Validate</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Paste JSON and click Validate.</div>`,
  js: `    var json=document.getElementById('json'),out=document.getElementById('out'),valBtn=document.getElementById('valBtn'),copyBtn=document.getElementById('copyBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    valBtn.addEventListener('click',function(){
      var s=json.value.trim();
      if(!s){out.className='result-box empty';out.textContent='Paste JSON first.';return;}
      try{var o=JSON.parse(s);out.className='result-box';out.innerHTML='<div style="color:var(--success);margin-bottom:8px">✓ Valid JSON</div><textarea readonly style="width:100%;min-height:160px;background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px;font-family:monospace" id="res">'+esc(JSON.stringify(o,null,2))+'</textarea>';}
      catch(e){out.className='result-box';out.innerHTML='<div style="color:#f87171">✗ '+esc(e.message)+'</div>';}
    });
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;r.select();document.execCommand('copy');copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'break-even-calculator', icon: '📈', title: 'Break-Even Calculator', tagline: 'Free Online Break-Even Point Calculator',
  category: 'calculator',
  desc: 'Find the break-even point for your product or service: how many units you must sell, and the revenue needed, to cover fixed and variable costs.',
  cardDesc: 'Calculate break-even units and revenue from costs.',
  keywords: 'break even calculator, break even point, break even analysis, fixed cost variable cost, business calculator',
  searchTerms: 'break even calculator units revenue',
  zh: '盈亏平衡计算器根据固定成本、单价与单位变动成本，算出需要卖多少件、多少销售额才能打平，适合创业与小生意测算，本地运行。',
  howto: ['Enter total fixed costs.', 'Enter the price per unit.', 'Enter the variable cost per unit.', 'See the break-even units and revenue instantly.'],
  faq: [
    { q: 'What is the break-even point?', a: 'It is the sales volume at which total revenue equals total costs, so you neither profit nor lose. Below it you lose money; above it you earn.' },
    { q: 'Why do I need variable cost?', a: 'Each unit sold adds a variable cost, reducing the contribution margin. Ignoring it makes the break-even point look falsely low.' },
    { q: 'Can I include expected sales?', a: 'The calculator shows the break-even point; compare it to your expected sales to see your margin of safety.' }
  ],
  zhfaq: [
    { q: '什么是盈亏平衡点？', a: '是总收入等于总成本、不赚不赔的销量点。低于它亏损，高于它开始盈利。' },
    { q: '为什么要输入单位变动成本？', a: '每卖一件都会增加变动成本，影响边际贡献；忽略它会让盈亏平衡点被低估。' }
  ],
  usecases: [
    { icon: '🚀', title: 'Startups', text: 'Know when the business turns profitable.' },
    { icon: '🛒', title: 'Pricing', text: 'Test price vs cost scenarios.' },
    { icon: '📊', title: 'Planning', text: 'Set realistic sales targets.' }
  ],
  deep: '## 为什么需要盈亏平衡分析\n创业或上新前，先知道「卖多少才能回本」是基本功。它能告诉你定价和成本的安全边界。\n## 背后的原理\n盈亏平衡点（件）= 固定成本 ÷（单价 − 单位变动成本），即单位边际贡献能摊掉多少固定成本；平衡销售额 = 平衡件数 × 单价。\n## 一个例子\n固定成本 1 万元、单价 50 元、变动成本 30 元，则每件贡献 20 元，需卖 500 件打平，对应销售额 2.5 万元。',
  body: `        <div class="gen-row">
          <div class="form-row"><label for="fc">Fixed costs</label><input type="number" id="fc" placeholder="10000" min="0"></div>
          <div class="form-row"><label for="price">Price per unit</label><input type="number" id="price" placeholder="50" min="0"></div>
        </div>
        <div class="form-row"><label for="vc">Variable cost per unit</label><input type="number" id="vc" placeholder="30" min="0"></div>
        <div class="result-box empty" id="out">Enter costs to see the break-even point.</div>`,
  js: `    var fc=document.getElementById('fc'),price=document.getElementById('price'),vc=document.getElementById('vc'),out=document.getElementById('out');
    function calc(){
      var F=parseFloat(fc.value),P=parseFloat(price.value),V=parseFloat(vc.value);
      if(!(F>=0)||!(P>0)||!(V>=0)){out.className='result-box empty';out.textContent='Enter valid costs (price > 0).';return;}
      if(V>=P){out.className='result-box';out.innerHTML='<span style="color:#f87171">Variable cost must be below price, otherwise you never break even.</span>';return;}
      var units=F/(P-V);
      var rev=units*P;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+Math.ceil(units).toLocaleString()+' <span style="font-size:1rem;color:var(--text-secondary)">units</span></div><div style="margin-top:8px;color:var(--text-secondary)">Break-even revenue: <b style="color:var(--text)">'+rev.toLocaleString(undefined,{style:'currency',currency:'USD'})+'</b></div><div style="margin-top:4px;color:var(--text-secondary);font-size:.9rem">Contribution margin per unit: '+(P-V).toLocaleString(undefined,{style:'currency',currency:'USD'})+'</div>';
    }
    fc.addEventListener('input',calc);price.addEventListener('input',calc);vc.addEventListener('input',calc);`
});

EXTRA.push({
  slug: 'vat-calculator', icon: '🧾', title: 'VAT Calculator', tagline: 'Free Online VAT / Sales Tax Calculator',
  category: 'calculator',
  desc: 'Calculate VAT or sales tax both ways: add tax to a net price, or extract the net amount from a gross (tax-inclusive) price. Supports any rate.',
  cardDesc: 'Add or reverse VAT/sales tax at any rate.',
  keywords: 'vat calculator, sales tax calculator, tax inclusive calculator, add vat, reverse vat',
  searchTerms: 'vat sales tax calculator inclusive exclusive',
  zh: '增值税计算器支持双向计算：在净额上加税，或从含税价反推净额，适用于任意税率，方便报价与报账，本地运行。',
  howto: ['Enter an amount.', 'Enter the tax rate (e.g. 20 for 20%).', 'Pick "Add tax" or "Remove tax".', 'See the net, tax and gross values.'],
  faq: [
    { q: 'What is the difference between add and remove tax?', a: '"Add tax" turns a net price into a gross price. "Remove tax" extracts the net price from a gross price that already includes tax.' },
    { q: 'Can I use it for non-VAT taxes?', a: 'Yes. It works for any percentage tax — VAT, GST, or sales tax — as long as you enter the rate.' },
    { q: 'Does it round?', a: 'Results are shown with two decimals; use the values as-is for accounting precision.' }
  ],
  zhfaq: [
    { q: '加税和去税有什么区别？', a: '「加税」把净额变成含税价；「去税」从一个已含税的毛额里反推出净额。' },
    { q: '能用于非增值税吗？', a: '能，任何百分比税种（增值税、GST、销售税）只要输入税率即可。' }
  ],
  usecases: [
    { icon: '🏷️', title: 'Pricing', text: 'Show tax-inclusive prices.' },
    { icon: '📑', title: 'Invoicing', text: 'Split net and tax on bills.' },
    { icon: '🌍', title: 'Cross-border', text: 'Handle EU VAT rates.' }
  ],
  deep: '## 为什么需要 VAT 计算\n涉及欧盟、英国等增值税地区时，报价常要在「含税」与「不含税」之间切换，手算容易错位。\n## 背后的原理\n加税：毛额 = 净额 ×(1+税率)。去税：净额 = 毛额 ÷(1+税率)，税额 = 毛额 − 净额。公式对称，方向不同。\n## 一个例子\n净额 100 元、税率 20%，加税后毛额 120 元；反过来毛额 120 元去税得净额 100 元、税额 20 元。',
  body: `        <div class="gen-row">
          <div class="form-row"><label for="amt">Amount</label><input type="number" id="amt" placeholder="100" min="0"></div>
          <div class="form-row"><label for="rate">Rate (%)</label><input type="number" id="rate" placeholder="20" min="0"></div>
        </div>
        <div style="margin:8px 0">
          <label style="margin-right:14px"><input type="radio" name="mode" value="add" checked> Add tax</label>
          <label><input type="radio" name="mode" value="remove"> Remove tax</label>
        </div>
        <div class="result-box empty" id="out">Enter amount and rate.</div>`,
  js: `    var amt=document.getElementById('amt'),rate=document.getElementById('rate'),out=document.getElementById('out');
    function calc(){
      var A=parseFloat(amt.value),R=parseFloat(rate.value);
      if(!(A>=0)||!(R>=0)){out.className='result-box empty';out.textContent='Enter valid amount and rate.';return;}
      var r=R/100,net,tax,gross;
      if(document.querySelector('input[name=mode]:checked').value==='add'){net=A;tax=A*r;gross=A*(1+r);}
      else{gross=A;net=A/(1+r);tax=gross-net;}
      out.className='result-box';
      out.innerHTML='<div style="display:flex;gap:20px;flex-wrap:wrap"><div><div style="color:var(--text-secondary);font-size:.85rem">Net</div><div class="gen-big" style="font-size:1.6rem">'+net.toFixed(2)+'</div></div><div><div style="color:var(--text-secondary);font-size:.85rem">Tax</div><div class="gen-big" style="font-size:1.6rem">'+tax.toFixed(2)+'</div></div><div><div style="color:var(--text-secondary);font-size:.85rem">Gross</div><div class="gen-big" style="font-size:1.6rem">'+gross.toFixed(2)+'</div></div></div>';
    }
    amt.addEventListener('input',calc);rate.addEventListener('input',calc);
    document.querySelectorAll('input[name=mode]').forEach(function(el){el.addEventListener('change',calc);});`
});

EXTRA.push({
  slug: 'grade-calculator', icon: '🎓', title: 'Weighted Grade Calculator', tagline: 'Free Online Weighted Grade & GPA Calculator',
  category: 'calculator',
  desc: 'Calculate your final weighted grade from assignments, exams and their weights. Add or remove rows to match your syllabus exactly.',
  cardDesc: 'Compute weighted final grade from items and weights.',
  keywords: 'grade calculator, weighted grade, final grade calculator, gpa calculator, assignment weight',
  searchTerms: 'grade calculator weighted final gpa',
  zh: '加权成绩计算器根据各项作业、考试的分值与权重算出最终成绩，可动态增删行以匹配你的课程大纲，本地运行。',
  howto: ['Add each item: name, score, and weight (%).', 'Adjust rows to match your syllabus.', 'Click "Calculate" to see the weighted final.', 'Add or remove rows as needed.'],
  faq: [
    { q: 'Do the weights need to sum to 100?', a: 'Not strictly — the calculator normalizes by total weight, so 100% is convenient but any consistent values work.' },
    { q: 'Can I mix score scales?', a: 'Keep all scores on the same scale (e.g. 0–100) so the weighted average is meaningful.' },
    { q: 'Does it compute GPA?', a: 'It computes the weighted percentage. Convert that to GPA using your school\'s scale separately.' }
  ],
  zhfaq: [
    { q: '权重一定要加起来等于 100 吗？', a: '不必，计算器会按总权重归一化，但凑成 100% 最直观。' },
    { q: '分数尺度能混用吗？', a: '请保持同一尺度（如都 0–100），加权均值才有意义。' }
  ],
  usecases: [
    { icon: '📚', title: 'Students', text: 'Predict final course grade.' },
    { icon: '👨‍🏫', title: 'Teachers', text: 'Verify grade book math.' },
    { icon: '🎯', title: 'Goal Setting', text: 'See what exam score you need.' }
  ],
  deep: '## 为什么需要加权成绩计算\n课程成绩由多项按不同权重组成，手算加权均值容易出错。动态表格能精确匹配大纲。\n## 背后的原理\n最终成绩 = Σ(各项分数 × 权重) ÷ Σ权重。权重归一化后乘以分数再求和，得到综合百分比。\n## 一个例子\n平时 30%（得 90）、期中 30%（得 80）、期末 40%（得 70），加权 = (90×30+80×30+70×40)÷100 = 79 分。',
  body: `        <div id="rows"></div>
        <button class="btn btn-secondary" id="addBtn" style="margin:8px 0">+ Add Item</button>
        <div class="btn-group">
          <button class="btn btn-primary" id="calcBtn">Calculate</button>
        </div>
        <div class="result-box empty" id="out">Add items and calculate.</div>`,
  js: `    var rows=document.getElementById('rows'),out=document.getElementById('out'),addBtn=document.getElementById('addBtn'),calcBtn=document.getElementById('calcBtn');
    function rowHTML(){return '<div class="gen-row" style="margin-bottom:8px"><div class="form-row"><input placeholder="Name" class="rname" style="flex:1"></div><div class="form-row"><input type="number" placeholder="Score" class="rscore" min="0"></div><div class="form-row"><input type="number" placeholder="Weight %" class="rweight" min="0"></div></div>';}
    rows.innerHTML=rowHTML()+rowHTML();
    addBtn.addEventListener('click',function(){rows.insertAdjacentHTML('beforeend',rowHTML());});
    calcBtn.addEventListener('click',function(){
      var rs=rows.querySelectorAll('.gen-row');
      var sumW=0,sumS=0;
      rs.forEach(function(r){var s=parseFloat(r.querySelector('.rscore').value),w=parseFloat(r.querySelector('.rweight').value);if(s>=0&&w>0){sumW+=w;sumS+=s*w;}});
      if(sumW===0){out.className='result-box empty';out.textContent='Enter at least one item with score and weight.';return;}
      var final=sumS/sumW;
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+final.toFixed(2)+' <span style="font-size:1rem;color:var(--text-secondary)">/ 100</span></div><div style="margin-top:6px;color:var(--text-secondary);font-size:.9rem">Total weight used: '+sumW+'%</div>';
    });`
});

EXTRA.push({
  slug: 'body-fat-calculator', icon: '💪', title: 'Body Fat Calculator', tagline: 'Free Online Body Fat % Calculator (Navy Method)',
  category: 'calculator',
  desc: 'Estimate body fat percentage with the U.S. Navy method using simple circumference measurements. A quick, private alternative to expensive scans.',
  cardDesc: 'Estimate body fat % from measurements (Navy method).',
  keywords: 'body fat calculator, body fat percentage, navy method, body fat estimate, fitness calculator',
  searchTerms: 'body fat calculator percentage navy',
  zh: '体脂率计算器用美国海军法，通过腰围、颈围等围度估算体脂百分比，是昂贵的体脂检测之外的便捷私密替代方案，本地运行。',
  howto: ['Select your sex.', 'Enter height, waist and neck circumference.', 'For women, also enter hip circumference.', 'See your estimated body fat percentage.'],
  faq: [
    { q: 'How accurate is the Navy method?', a: 'It correlates well with more precise methods for most people, but athletes with unusual muscle distribution may see larger error. Treat it as an estimate.' },
    { q: 'Why do women enter hip circumference?', a: 'The female formula accounts for hip fat distribution, which the male formula does not need.' },
    { q: 'What units should I use?', a: 'Use centimeters for all measurements to match the formula constants.' }
  ],
  zhfaq: [
    { q: '海军法准吗？', a: '对大多数人能与更精确的方法较好吻合，但肌肉分布异常者误差可能偏大，仅供参考。' },
    { q: '为什么女性要输入臀围？', a: '女性公式考虑了臀部脂肪分布，男性公式不需要。' }
  ],
  usecases: [
    { icon: '🏋️', title: 'Fitness', text: 'Track fat loss progress.' },
    { icon: '📏', title: 'Home Check', text: 'Estimate without a scan.' },
    { icon: '🎯', title: 'Goals', text: 'Set realistic targets.' }
  ],
  deep: '## 为什么需要体脂率估算\n体重相同的人体脂可能差很多，体脂率比 BMI 更能反映身体成分。围度法无需设备，适合居家自测。\n## 背后的原理\n海军法用身高、腰围、颈围（女性加臀围）代入经验公式估算体脂百分比，公式分男女两套常数。\n## 一个例子\n男性身高 175cm、腰围 85cm、颈围 38cm，代入公式得到约 20% 体脂，处于健康区间。',
  body: `        <div class="gen-row">
          <div class="form-row"><label for="sex">Sex</label><select id="sex"><option value="m">Male</option><option value="f">Female</option></select></div>
          <div class="form-row"><label for="ht">Height (cm)</label><input type="number" id="ht" placeholder="175" min="1"></div>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="waist">Waist (cm)</label><input type="number" id="waist" placeholder="85" min="1"></div>
          <div class="form-row"><label for="neck">Neck (cm)</label><input type="number" id="neck" placeholder="38" min="1"></div>
        </div>
        <div class="form-row"><label for="hip">Hip (cm, female)</label><input type="number" id="hip" placeholder="95" min="1"></div>
        <div class="result-box empty" id="out">Enter measurements to estimate body fat.</div>`,
  js: `    var sex=document.getElementById('sex'),ht=document.getElementById('ht'),waist=document.getElementById('waist'),neck=document.getElementById('neck'),hip=document.getElementById('hip'),out=document.getElementById('out');
    function calc(){
      var H=parseFloat(ht.value),W=parseFloat(waist.value),N=parseFloat(neck.value),P=parseFloat(hip.value);
      if(!(H>0)||!(W>0)||!(N>0)){out.className='result-box empty';out.textContent='Enter height, waist and neck.';return;}
      var bf;
      if(sex.value==='m'){bf=495/(1.0324-0.19077*Math.log10(W-N)+0.15456*Math.log10(H))-450;}
      else{if(!(P>0)){out.className='result-box empty';out.textContent='Women: also enter hip circumference.';return;}bf=495/(1.29579-0.35004*Math.log10(W+P-N)+0.22100*Math.log10(H))-450;}
      var cat=bf<10?'Very low':bf<15?'Athletic':bf<20?'Good':bf<25?'Average':bf<30?'Above avg':'High';
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+bf.toFixed(1)+'% <span style="font-size:1rem;color:var(--text-secondary)">body fat</span></div><div style="margin-top:6px;color:var(--text-secondary);font-size:.9rem">Estimate: '+cat+'</div>';
    }
    [sex,ht,waist,neck,hip].forEach(function(el){el.addEventListener('input',calc);});`
});

EXTRA.push({
  slug: 'water-intake-calculator', icon: '💧', title: 'Daily Water Intake Calculator', tagline: 'Free Online Daily Water Needs Calculator',
  category: 'calculator',
  desc: 'Estimate how much water you should drink per day based on body weight, activity level and climate. A simple nudge toward better hydration.',
  cardDesc: 'Estimate daily water intake from weight and lifestyle.',
  keywords: 'water intake calculator, daily water needs, how much water, hydration calculator, water per day',
  searchTerms: 'water intake calculator daily hydration',
  zh: '每日饮水量计算器根据体重、活动量与气候估算你每天该喝多少水，是保持良好水合的简便提醒，本地运行。',
  howto: ['Enter your body weight in kg.', 'Pick your activity level.', 'Toggle hot climate if applicable.', 'See your recommended daily water intake.'],
  faq: [
    { q: 'Is this a strict medical rule?', a: 'No. It is a general guideline based on weight and lifestyle. Individual needs vary with health, diet and environment.' },
    { q: 'Does coffee or tea count?', a: 'Roughly yes, though caffeinated drinks have a mild diuretic effect. Most of your intake should be plain water.' },
    { q: 'Why does activity increase needs?', a: 'Exercise and heat increase fluid loss through sweat, so the body needs more water to stay balanced.' }
  ],
  zhfaq: [
    { q: '这是严格的医学标准吗？', a: '不是，它是基于体重与生活方式的通用建议，个体需求会因健康、饮食、环境而异。' },
    { q: '咖啡和茶算吗？', a: '大致算，但咖啡因有轻微利尿作用，主要摄入仍应以白水为主。' }
  ],
  usecases: [
    { icon: '🏃', title: 'Fitness', text: 'Hydrate around workouts.' },
    { icon: '🌞', title: 'Hot Weather', text: 'Adjust for summer heat.' },
    { icon: '🩺', title: 'Wellness', text: 'Build a daily habit.' }
  ],
  deep: '## 为什么需要饮水提醒\n很多人长期饮水不足，而渴觉往往滞后于身体需求。基于体重的估算能给出可执行的每天目标。\n## 背后的原理\n常用基线为体重(kg)×35ml，再根据活动量与炎热气候各上浮约 500ml，得到每日建议饮水量。\n## 一个例子\n体重 70kg、中等活动、非炎热：70×35=2450ml，加活动 500ml，建议约 3 升/天。',
  body: `        <div class="gen-row">
          <div class="form-row"><label for="wt">Weight (kg)</label><input type="number" id="wt" placeholder="70" min="1"></div>
          <div class="form-row"><label for="act">Activity</label><select id="act"><option value="0">Sedentary</option><option value="500" selected>Moderate</option><option value="1000">Intense</option></select></div>
        </div>
        <label style="display:flex;align-items:center;gap:6px;margin:8px 0"><input type="checkbox" id="hot"> Hot / humid climate</label>
        <div class="result-box empty" id="out">Enter weight to estimate water needs.</div>`,
  js: `    var wt=document.getElementById('wt'),act=document.getElementById('act'),hot=document.getElementById('hot'),out=document.getElementById('out');
    function calc(){
      var w=parseFloat(wt.value);
      if(!(w>0)){out.className='result-box empty';out.textContent='Enter a valid weight.';return;}
      var ml=w*35+parseInt(act.value)+(hot.checked?500:0);
      var L=(ml/1000).toFixed(2);
      out.className='result-box';
      out.innerHTML='<div class="gen-big">'+L+' <span style="font-size:1rem;color:var(--text-secondary)">L / day</span></div><div style="margin-top:6px;color:var(--text-secondary);font-size:.9rem">≈ '+Math.round(ml/250)+' cups (250 ml each)</div>';
    }
    [wt,act,hot].forEach(function(el){el.addEventListener('input',calc);el.addEventListener('change',calc);});`
});

EXTRA.push({
  slug: 'coin-flip', icon: '🪙', title: 'Coin Flip', tagline: 'Free Online Coin Flip Simulator',
  category: 'fun',
  desc: 'Flip a virtual coin for decisions, games, or settling disputes. Tracks heads/tails counts so you can see the balance over many flips.',
  cardDesc: 'Flip a coin online with heads/tails tracking.',
  keywords: 'coin flip, flip a coin, heads or tails, random coin, online coin toss',
  searchTerms: 'coin flip heads tails random',
  zh: '抛硬币工具用随机数模拟正反面，适合做决定、游戏或化解分歧，并记录正反面次数，纯前端运行。',
  howto: ['Click "Flip".', 'See the result: Heads or Tails.', 'Flip again as many times as you like.', 'Watch the running heads/tails tally.'],
  faq: [
    { q: 'Is the result truly random?', a: 'It uses the browser\'s pseudo-random generator, which is unpredictable enough for games and decisions.' },
    { q: 'Can I flip many times quickly?', a: 'Yes. Each click is one flip and the counter updates, so you can build a tally fast.' },
    { q: 'Does it favor either side?', a: 'Over many flips the counts tend toward 50/50, just like a real coin.' }
  ],
  zhfaq: [
    { q: '结果是真随机吗？', a: '使用浏览器的伪随机数生成器，对游戏和决策来说足够不可预测。' },
    { q: '能快速连翻很多次吗？', a: '可以，每次点击算一次，计数器实时更新，便于累计统计。' }
  ],
  usecases: [
    { icon: '⚖️', title: 'Decisions', text: 'Settle a 50/50 choice.' },
    { icon: '🎲', title: 'Games', text: 'Add chance to play.' },
    { icon: '🤝', title: 'Fairness', text: 'Pick who goes first.' }
  ],
  deep: '## 为什么需要抛硬币\n面对二选一、势均力敌的情况，抛硬币能快速打破僵局，也把「选择焦虑」交给运气。\n## 背后的原理\n工具用 Math.random() 生成 0–1 的数，小于 0.5 判正面、否则反面，并累计正反面次数。\n## 一个例子\n两个人争着先选，连翻三次定先后，计数器显示当前正反面分布，过程公开透明。',
  body: `        <div style="text-align:center;padding:20px 0">
          <div id="coin" style="font-size:4rem">🪙</div>
          <div id="res" style="font-size:1.4rem;font-weight:700;margin:10px 0">—</div>
          <button class="btn btn-primary" id="flipBtn">Flip</button>
        </div>
        <div style="display:flex;justify-content:center;gap:30px;color:var(--text-secondary)">
          <div>Heads: <b id="hC" style="color:var(--text)">0</b></div>
          <div>Tails: <b id="tC" style="color:var(--text)">0</b></div>
        </div>`,
  js: `    var coin=document.getElementById('coin'),res=document.getElementById('res'),flipBtn=document.getElementById('flipBtn'),hC=document.getElementById('hC'),tC=document.getElementById('tC');
    var h=0,t=0;
    flipBtn.addEventListener('click',function(){
      var heads=Math.random()<0.5;
      coin.style.transform='scale(0.8)';setTimeout(function(){coin.style.transform='scale(1)';},120);
      if(heads){res.textContent='Heads';h++;hC.textContent=h;}
      else{res.textContent='Tails';t++;tC.textContent=t;}
    });`
});

EXTRA.push({
  slug: 'random-name-picker', icon: '🎯', title: 'Random Name Picker', tagline: 'Free Online Random Name Picker & Spinner',
  category: 'fun',
  desc: 'Drop in a list of names and pick one (or several) at random. Perfect for giveaways, classroom calls, and fair team selections.',
  cardDesc: 'Pick one or more random names from a list.',
  keywords: 'random name picker, name picker, random draw, pick a winner, random selector',
  searchTerms: 'random name picker draw winner',
  zh: '随机点名器把名单粘贴进来后随机抽选一个或多个，适合抽奖、课堂点名、公平分组，本地运行不上传。',
  howto: ['Paste names, one per line.', 'Choose how many to pick.', 'Click "Pick".', 'See the randomly selected name(s).'],
  faq: [
    { q: 'Can it pick multiple names?', a: 'Yes. Set the count and it draws that many names without repeating the same entry in one pick.' },
    { q: 'Are names uploaded?', a: 'No. Everything stays in your browser; nothing is sent to a server.' },
    { q: 'Can I pick with replacement?', a: 'Each pick avoids duplicates within a single draw. Click again to draw a fresh set.' }
  ],
  zhfaq: [
    { q: '能一次抽多个吗？', a: '能，设置数量后一次抽取多个且本次不重复。' },
    { q: '名单会上传吗？', a: '不会，全部在浏览器本地，不上传服务器。' }
  ],
  usecases: [
    { icon: '🎁', title: 'Giveaways', text: 'Draw a fair winner.' },
    { icon: '🏫', title: 'Classroom', text: 'Call on students randomly.' },
    { icon: '🎲', title: 'Games', text: 'Pick players or roles.' }
  ],
  deep: '## 为什么需要随机点名\n抽奖、点名、选人时，人工挑容易被人情和偏见影响。随机抽选既公平又可复现过程。\n## 背后的原理\n工具把名单按行存入数组，用洗牌算法随机取前 N 个，并在一次抽取内避免重复。\n## 一个例子\n把 30 个学员名字粘进来，设抽 3 个，点一下就得到 3 名幸运者，过程透明公正。',
  body: `        <div class="form-row">
          <label for="names">Names (one per line)</label>
          <textarea id="names" placeholder="Alice\\nBob\\nCarol" style="min-height:160px"></textarea>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="cnt">Pick count</label><input type="number" id="cnt" value="1" min="1"></div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="pickBtn">Pick</button>
          <button class="btn btn-secondary" id="copyBtn">Copy</button>
        </div>
        <div class="result-box empty" id="out">Add names and click Pick.</div>`,
  js: `    var names=document.getElementById('names'),cnt=document.getElementById('cnt'),out=document.getElementById('out'),pickBtn=document.getElementById('pickBtn'),copyBtn=document.getElementById('copyBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    pickBtn.addEventListener('click',function(){
      var arr=names.value.split('\\n').map(function(x){return x.trim();}).filter(function(x){return x;});
      var n=Math.min(parseInt(cnt.value)||1,arr.length);
      if(!arr.length){out.className='result-box empty';out.textContent='Add at least one name.';return;}
      var pool=arr.slice();
      for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
      var picked=pool.slice(0,n);
      out.className='result-box';
      out.innerHTML='<div id="res" style="font-size:1.2rem;font-weight:700">'+picked.map(esc).join('<br>')+'</div>';
    });
    copyBtn.addEventListener('click',function(){var r=document.getElementById('res');if(!r)return;var text=r.innerText;navigator.clipboard?navigator.clipboard.writeText(text):(function(){var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);})();copyBtn.textContent='✓ Copied';setTimeout(function(){copyBtn.textContent='Copy';},1500);});`
});

EXTRA.push({
  slug: 'random-team-generator', icon: '👥', title: 'Random Team Generator', tagline: 'Free Online Random Group & Team Splitter',
  category: 'fun',
  desc: 'Split a list of people into balanced random teams or groups. Ideal for classrooms, workshops, games, and fair project assignments.',
  cardDesc: 'Randomly divide a list into N balanced teams.',
  keywords: 'random team generator, split into groups, random group maker, team splitter, divide list',
  searchTerms: 'random team generator groups split',
  zh: '随机分队器把人员名单随机均分成若干组，适合课堂、工作坊、游戏和公平的项目分组，本地运行。',
  howto: ['Paste names, one per line.', 'Enter the number of teams.', 'Click "Generate".', 'See balanced random groups.'],
  faq: [
    { q: 'Are the groups balanced?', a: 'Yes. Names are shuffled first, then distributed round-robin so group sizes differ by at most one person.' },
    { q: 'Can I regenerate different teams?', a: 'Yes. Each click reshuffles, so you can draw new teams until you like the mix.' },
    { q: 'What if the count does not divide evenly?', a: 'Extra people are spread one per group, keeping sizes as even as possible.' }
  ],
  zhfaq: [
    { q: '分组是均衡的吗？', a: '是，先洗牌再轮转分配，各组人数最多差一人。' },
    { q: '能重新生成不同分组吗？', a: '能，每次点击都会重新洗牌。' }
  ],
  usecases: [
    { icon: '🏫', title: 'Classroom', text: 'Make project groups fast.' },
    { icon: '🎮', title: 'Events', text: 'Split players evenly.' },
    { icon: '💼', title: 'Work', text: 'Assign review pairs.' }
  ],
  deep: '## 为什么需要随机分队\n分组若靠人工，容易出现「关系户抱团」或人数不均。随机均分既公平又省时。\n## 背后的原理\n先把名单洗牌，再按轮转方式依次分给各组，保证人数最多差一人，且每组的成员随机。\n## 一个例子\n24 个人要分 4 组，粘进来设 4，点生成即得 4 组各 6 人，成员随机分布。',
  body: `        <div class="form-row">
          <label for="names">Names (one per line)</label>
          <textarea id="names" placeholder="Alice\\nBob\\nCarol\\nDan" style="min-height:160px"></textarea>
        </div>
        <div class="gen-row">
          <div class="form-row"><label for="teams">Number of teams</label><input type="number" id="teams" value="2" min="1"></div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="genBtn">Generate</button>
        </div>
        <div class="result-box empty" id="out">Add names and set team count.</div>`,
  js: `    var names=document.getElementById('names'),teams=document.getElementById('teams'),out=document.getElementById('out'),genBtn=document.getElementById('genBtn');
    function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    genBtn.addEventListener('click',function(){
      var arr=names.value.split('\\n').map(function(x){return x.trim();}).filter(function(x){return x;});
      var T=parseInt(teams.value)||1;
      if(!arr.length||T<1){out.className='result-box empty';out.textContent='Add names and a valid team count.';return;}
      for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}
      var groups=Array.from({length:T},function(){return [];});
      arr.forEach(function(name,idx){groups[idx%T].push(name);});
      var html='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">';
      groups.forEach(function(g,i){html+='<div style="border:1px solid var(--border);border-radius:10px;padding:10px"><div style="font-weight:700;margin-bottom:6px">Team '+(i+1)+' ('+g.length+')</div>'+g.map(function(n){return '<div style="padding:2px 0">'+esc(n)+'</div>';}).join('')+'</div>';});
      html+='</div>';
      out.className='result-box';
      out.innerHTML=html;
    });`
});

module.exports = EXTRA;
