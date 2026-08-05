/**
 * FreeToolset AI Pet Widget
 * Self-contained virtual pet for the website.
 * Features: custom pet/name/color, draggable, auto-walk, speech bubbles, sleep mode, settings.
 */
(function () {
  'use strict';
  if (window.__AI_PET_INITED__) return;
  window.__AI_PET_INITED__ = true;

  /* ===== Data ===== */
  var PETS = [
    { id: 'cat', e: '🐱' }, { id: 'rabbit', e: '🐰' },
    { id: 'fox', e: '🦊' }, { id: 'panda', e: '🐼' },
    { id: 'tiger', e: '🐯' }, { id: 'frog', e: '🐸' },
    { id: 'hamster', e: '🐹' }, { id: 'koala', e: '🐨' },
    { id: 'dog', e: '🐶' }, { id: 'bear', e: '🐻' },
    { id: 'unicorn', e: '🦄' }, { id: 'dragon', e: '🐲' },
    { id: 'penguin', e: '🐧' }, { id: 'chick', e: '🐥' },
    { id: 'pig', e: '🐷' }, { id: 'monkey', e: '🐵' }
  ];
  var COLORS = [
    { v: '#4a9eff' }, { v: '#a855f7' }, { v: '#ec4899' }, { v: '#22c55e' },
    { v: '#f97316' }, { v: '#06b6d4' }, { v: '#ef4444' }, { v: '#eab308' }
  ];
  var MSG_IDLE = ['Hmm... 🤔',"What's up?",'Here! ✨','Pet me! 🥺','Nice day~','Hello!','La la la~ 🎵','👀','Hehe~','Bored... 😴'];
  var MSG_CLICK = ['Hehe! 😊','Tickles!','Hi hi~','Found me!','Yay! ❤️','More!','Purr~','Eek! 😆'];
  var MSG_DRAG = ['Wheee! 🎢','Where to?','Like it here!','Adventure!','Fast! 😵','New spot!','Explore!','Up we go!'];
  var MSG_WALK = ['Exploring~','New spot!','Walking...',"What's here?",'Ooh nice!','Stroll~','Hmm~'];
  var MSG_SLEEP = ['Zzz... 😴','Sleeping...','Cozy... 💤'];

  var SK = 'ft_pet_v1';
  var state = null;
  var pet, body, nameTag, speech, zzz, hideBtn, gearBtn, showBtn, settings;
  var dragging = false, dragMoved = false, lastDragEnd = 0;
  var walkTimer = null, idleTimer = null, speechTimer = null, idleSpeechTimer = null;
  var lastInteract = Date.now(), isWalking = false;

  /* ===== State ===== */
  function loadState() {
    try { var s = JSON.parse(localStorage.getItem(SK)); if (s && s.petId) return s; } catch(e) {}
    return null;
  }
  function saveState() { try { localStorage.setItem(SK, JSON.stringify(state)); } catch(e) {} }

  /* ===== CSS ===== */
  var css = ''+
  '.ap-overlay{position:fixed;inset:0;z-index:99998;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);padding:20px}'+
  '.ap-overlay.show{display:flex}'+
  '.ap-modal{background:#1a1a2e;border:1px solid rgba(255,255,255,.1);border-radius:20px;max-width:440px;width:100%;padding:36px 32px;box-shadow:0 24px 80px rgba(0,0,0,.5);text-align:center;animation:apPop .4s ease}'+
  '@keyframes apPop{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}'+
  '.ap-modal h2{font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:8px}'+
  '.ap-modal .ap-sub{font-size:.875rem;color:rgba(255,255,255,.5);margin-bottom:24px}'+
  '.ap-section-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.4);margin-bottom:10px;text-align:left}'+
  '.ap-pet-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin-bottom:20px}'+
  '.ap-pet-opt{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:1.4rem;border-radius:12px;border:2px solid transparent;background:rgba(255,255,255,.05);cursor:pointer;transition:all .2s}'+
  '.ap-pet-opt:hover{background:rgba(255,255,255,.1);transform:scale(1.1)}'+
  '.ap-pet-opt.sel{border-color:var(--ap-sel,#4a9eff);background:rgba(74,158,255,.15)}'+
  '.ap-name-input{width:100%;padding:12px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#fff;font-size:1rem;font-family:inherit;outline:none;margin-bottom:20px;box-sizing:border-box}'+
  '.ap-name-input:focus{border-color:#4a9eff}'+
  '.ap-color-grid{display:flex;gap:10px;justify-content:center;margin-bottom:24px;flex-wrap:wrap}'+
  '.ap-color-opt{width:32px;height:32px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .2s}'+
  '.ap-color-opt:hover{transform:scale(1.15)}'+
  '.ap-color-opt.sel{border-color:#fff;box-shadow:0 0 12px currentColor}'+
  '.ap-create-btn{width:100%;padding:14px;background:linear-gradient(135deg,#4a9eff,#7c3aed);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit}'+
  '.ap-create-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(74,158,255,.4)}'+
  '.ap-skip{margin-top:12px;font-size:.8rem;color:rgba(255,255,255,.3);cursor:pointer;background:none;border:none;font-family:inherit}'+
  '.ap-skip:hover{color:rgba(255,255,255,.6)}'+

  /* Pet */
  '.ap-pet{position:fixed;z-index:99997;pointer-events:auto;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;transition:transform .4s cubic-bezier(.4,0,.2,1);will-change:transform}'+
  '.ap-pet.dragging{cursor:grabbing;transition:none}'+
  '.ap-pet-body{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;font-size:2rem;background:rgba(255,255,255,.08);backdrop-filter:blur(8px);border:2px solid var(--ap-bd,rgba(74,158,255,.4));box-shadow:0 4px 20px var(--ap-glow,rgba(74,158,255,.3));animation:apBob 2.5s ease-in-out infinite;transition:box-shadow .3s,border-color .3s}'+
  '.ap-pet:hover .ap-pet-body{border-color:rgba(255,255,255,.35);box-shadow:0 4px 30px var(--ap-glow,rgba(74,158,255,.5))}'+
  '.ap-pet.dragging .ap-pet-body{animation:apWobble .3s ease-in-out infinite;transform:scale(1.1)}'+
  '.ap-pet.sleeping .ap-pet-body{animation:apSleep 3s ease-in-out infinite}'+
  '@keyframes apBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'+
  '@keyframes apWobble{0%,100%{transform:scale(1.1) rotate(-5deg)}50%{transform:scale(1.1) rotate(5deg)}}'+
  '@keyframes apSleep{0%,100%{transform:scale(.95)}50%{transform:scale(.98)}}'+
  '@keyframes apHappy{0%{transform:scale(1)}30%{transform:scale(1.3) rotate(-10deg)}60%{transform:scale(1.2) rotate(10deg)}100%{transform:scale(1)}}'+
  '.ap-pet.happy .ap-pet-body{animation:apHappy .5s ease}'+
  '.ap-pet.ap-pet-walk .ap-pet-body{animation:apWalkB .5s ease-in-out infinite}'+
  '@keyframes apWalkB{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-4px) rotate(3deg)}}'+

  /* Name Tag */
  '.ap-name-tag{position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:.7rem;font-weight:600;color:rgba(255,255,255,.7);background:rgba(0,0,0,.4);padding:2px 10px;border-radius:100px;white-space:nowrap;pointer-events:none;backdrop-filter:blur(4px)}'+

  /* Speech */
  '.ap-speech{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:rgba(255,255,255,.95);color:#1a1a2e;font-size:.75rem;font-weight:600;padding:6px 14px;border-radius:14px 14px 14px 4px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .3s,transform .3s;box-shadow:0 2px 12px rgba(0,0,0,.2);z-index:1}'+
  '.ap-speech.show{opacity:1;transform:translateX(-50%) translateY(-4px)}'+
  '.ap-speech::after{content:"";position:absolute;bottom:-5px;left:18px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid rgba(255,255,255,.95)}'+

  /* Sleep */
  '.ap-zzz{position:absolute;top:-30px;right:6px;font-size:1rem;opacity:0;transition:opacity .3s;pointer-events:none}'+
  '.ap-pet.sleeping .ap-zzz{opacity:1;animation:apZzz 2s ease-in-out infinite}'+
  '@keyframes apZzz{0%,100%{transform:translateY(0) scale(.8);opacity:.4}50%{transform:translateY(-8px) scale(1);opacity:1}}'+

  /* Pet buttons */
  '.ap-pet-btn{position:absolute;top:-6px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;border:1px solid rgba(255,255,255,.2);font-size:.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;z-index:2}'+
  '.ap-pet:hover .ap-pet-btn{opacity:1}'+
  '.ap-pet-btn:hover{background:rgba(0,0,0,.9)}'+
  '.ap-btn-hide{right:-6px}'+
  '.ap-btn-gear{left:-6px}'+

  /* Settings */
  '.ap-settings{position:fixed;z-index:99999;background:#1a1a2e;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px;min-width:260px;max-width:300px;box-shadow:0 12px 48px rgba(0,0,0,.5);display:none}'+
  '.ap-settings.show{display:block;animation:apPop .2s ease}'+
  '.ap-settings h3{font-size:.9rem;font-weight:700;color:#fff;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}'+
  '.ap-settings .ap-close{background:none;border:none;color:rgba(255,255,255,.4);font-size:1.2rem;cursor:pointer;padding:0;line-height:1}'+
  '.ap-settings .ap-close:hover{color:#fff}'+
  '.ap-set-row{margin-bottom:14px}'+
  '.ap-set-label{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:rgba(255,255,255,.4);margin-bottom:6px}'+
  '.ap-set-pets{display:grid;grid-template-columns:repeat(8,1fr);gap:4px}'+
  '.ap-set-pets .ap-pet-opt{font-size:1rem;border-radius:8px;aspect-ratio:1}'+
  '.ap-set-colors{display:flex;gap:6px;flex-wrap:wrap}'+
  '.ap-set-colors .ap-color-opt{width:24px;height:24px;border-width:2px}'+
  '.ap-set-name{width:100%;padding:8px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;font-size:.85rem;font-family:inherit;outline:none;box-sizing:border-box}'+
  '.ap-set-name:focus{border-color:#4a9eff}'+
  '.ap-toggle{display:flex;align-items:center;justify-content:space-between}'+
  '.ap-toggle-label{font-size:.8rem;color:rgba(255,255,255,.7)}'+
  '.ap-switch{position:relative;width:40px;height:22px;background:rgba(255,255,255,.1);border-radius:100px;cursor:pointer;transition:background .2s;flex-shrink:0}'+
  '.ap-switch.on{background:#4a9eff}'+
  '.ap-switch::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .2s}'+
  '.ap-switch.on::after{transform:translateX(18px)}'+
  '.ap-set-actions{display:flex;gap:8px;margin-top:16px}'+
  '.ap-btn-reset{flex:1;padding:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.5);font-size:.75rem;cursor:pointer;font-family:inherit;transition:all .2s}'+
  '.ap-btn-reset:hover{color:#ef4444;border-color:#ef4444}'+

  /* Show button when hidden */
  '.ap-show-btn{position:fixed;bottom:20px;right:20px;z-index:99997;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.08);backdrop-filter:blur(8px);border:2px solid rgba(255,255,255,.15);font-size:1.5rem;cursor:pointer;display:none;align-items:center;justify-content:center;transition:all .2s}'+
  '.ap-show-btn:hover{transform:scale(1.1)}'+
  '.ap-show-btn.show{display:flex}'+

  /* Hint bubble */
  '.ap-hint{position:fixed;bottom:20px;right:20px;z-index:99996;display:flex;align-items:center;gap:10px;background:rgba(26,26,46,.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:10px 14px 10px 10px;box-shadow:0 8px 32px rgba(0,0,0,.4);cursor:pointer;transform:translateY(80px);opacity:0;transition:transform .4s cubic-bezier(.4,0,.2,1),opacity .4s}'+
  '.ap-hint.show{transform:translateY(0);opacity:1}'+
  '.ap-hint-emoji{font-size:1.6rem;line-height:1;animation:apBob 2.5s ease-in-out infinite}'+
  '.ap-hint-text{flex:1}'+
  '.ap-hint-title{font-size:.8rem;font-weight:700;color:#fff;white-space:nowrap}'+
  '.ap-hint-desc{font-size:.65rem;color:rgba(255,255,255,.5);white-space:nowrap}'+
  '.ap-hint-close{flex-shrink:0;background:none;border:none;color:rgba(255,255,255,.3);font-size:.7rem;cursor:pointer;padding:2px 4px;line-height:1}'+
  '.ap-hint-close:hover{color:rgba(255,255,255,.8)}'+

  '@media(max-width:480px){.ap-pet-grid{grid-template-columns:repeat(6,1fr)}.ap-set-pets{grid-template-columns:repeat(6,1fr)}.ap-pet-body{width:48px;height:48px;font-size:1.6rem}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ===== Utils ===== */
  function rand(a){return a[Math.floor(Math.random()*a.length)]}
  function hexRgba(h,a){var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return'rgba('+r+','+g+','+b+','+a+')'}

  /* ===== Init ===== */
  function init(){
    state = loadState();
    if(!state){ showHint(); }
    else { createPet(); }
  }

  /* ===== Bottom-right hint bubble (non-intrusive) ===== */
  var SK_HINT = 'ft_pet_hint_dismissed';
  function showHint(){
    if(localStorage.getItem(SK_HINT)) return;
    var hint=document.createElement('div');
    hint.className='ap-hint';
    hint.innerHTML=
      '<span class="ap-hint-emoji">🐱</span>'+
      '<div class="ap-hint-text">'+
        '<div class="ap-hint-title">Adopt a virtual pet!</div>'+
        '<div class="ap-hint-desc">Create your AI companion</div>'+
      '</div>'+
      '<button class="ap-hint-close">✕</button>';
    document.body.appendChild(hint);

    // animate in
    setTimeout(function(){hint.classList.add('show')},300);

    // click body → open creation modal
    hint.querySelector('.ap-hint-emoji').onclick=hint.querySelector('.ap-hint-text').onclick=function(){
      hint.remove();
      showCreateModal();
    };
    // close → dismiss permanently
    hint.querySelector('.ap-hint-close').onclick=function(){
      localStorage.setItem(SK_HINT,'1');
      hint.classList.remove('show');
      setTimeout(function(){hint.remove()},300);
    };
  }

  /* ===== Pet Creation Modal (opened from hint or settings reset) ===== */
  var wPet='cat', wColor='#4a9eff';
  function showCreateModal(){
    wPet='cat'; wColor='#4a9eff';
    var ov=document.createElement('div');
    ov.className='ap-overlay show';
    ov.innerHTML=
      '<div class="ap-modal">'+
        '<h2>🐾 Create Your AI Companion!</h2>'+
        '<p class="ap-sub">Pick a virtual pet to hang out with you on FreeToolset</p>'+
        '<div class="ap-section-label">Choose your pet</div>'+
        '<div class="ap-pet-grid" id="wPG"></div>'+
        '<div class="ap-section-label">Name your pet</div>'+
        '<input type="text" class="ap-name-input" id="wName" placeholder="e.g. Whiskers, Luna, Pixel..." maxlength="12" value="Buddy">'+
        '<div class="ap-section-label">Pick a color</div>'+
        '<div class="ap-color-grid" id="wCG"></div>'+
        '<button class="ap-create-btn" id="wCreate">Create My Pet! ✨</button>'+
        '<button class="ap-skip" id="wSkip">Maybe later</button>'+
      '</div>';
    document.body.appendChild(ov);

    var pg=ov.querySelector('#wPG');
    PETS.forEach(function(p){
      var el=document.createElement('div');
      el.className='ap-pet-opt'+(p.id===wPet?' sel':'');
      el.textContent=p.e;
      el.onclick=function(){pg.querySelectorAll('.ap-pet-opt').forEach(function(x){x.classList.remove('sel')});el.classList.add('sel');wPet=p.id};
      pg.appendChild(el);
    });

    var cg=ov.querySelector('#wCG');
    COLORS.forEach(function(c){
      var el=document.createElement('div');
      el.className='ap-color-opt'+(c.v===wColor?' sel':'');
      el.style.background=c.v;el.style.color=c.v;
      el.onclick=function(){cg.querySelectorAll('.ap-color-opt').forEach(function(x){x.classList.remove('sel')});el.classList.add('sel');wColor=c.v};
      cg.appendChild(el);
    });

    ov.querySelector('#wCreate').onclick=function(){
      var name=ov.querySelector('#wName').value.trim()||'Buddy';
      var pd=PETS.find(function(p){return p.id===wPet})||PETS[0];
      state={petId:wPet,petEmoji:pd.e,name:name,color:wColor,x:window.innerWidth/2-28,y:window.innerHeight-120,autoWalk:true,facing:1};
      saveState();ov.remove();createPet();
    };
    ov.querySelector('#wSkip').onclick=function(){
      ov.remove();
    };
  }

  /* ===== Create Pet ===== */
  function createPet(){
    if(pet) return;
    pet=document.createElement('div');
    pet.className='ap-pet';
    pet.innerHTML=
      '<div class="ap-zzz">💤</div>'+
      '<div class="ap-name-tag"></div>'+
      '<div class="ap-speech"></div>'+
      '<div class="ap-pet-body"></div>'+
      '<button class="ap-pet-btn ap-btn-gear" title="Settings">⚙</button>'+
      '<button class="ap-pet-btn ap-btn-hide" title="Hide">✕</button>';
    document.body.appendChild(pet);

    body=pet.querySelector('.ap-pet-body');
    nameTag=pet.querySelector('.ap-name-tag');
    speech=pet.querySelector('.ap-speech');
    zzz=pet.querySelector('.ap-zzz');
    gearBtn=pet.querySelector('.ap-btn-gear');
    hideBtn=pet.querySelector('.ap-btn-hide');

    showBtn=document.createElement('div');
    showBtn.className='ap-show-btn';
    document.body.appendChild(showBtn);

    updateAppearance();
    updatePosition();

    setupDrag();
    pet.addEventListener('click',onPetClick);
    gearBtn.addEventListener('click',function(e){e.stopPropagation();openSettings()});
    hideBtn.addEventListener('click',function(e){e.stopPropagation();hidePet()});
    showBtn.addEventListener('click',function(){pet.style.display='';showBtn.classList.remove('show')});

    resetIdle();
    scheduleIdleSpeech();
  }

  function updateAppearance(){
    if(!pet) return;
    body.textContent=state.petEmoji;
    nameTag.textContent=state.name;
    showBtn.textContent=state.petEmoji;
    pet.style.setProperty('--ap-glow',hexRgba(state.color,.4));
    pet.style.setProperty('--ap-bd',hexRgba(state.color,.5));
  }

  function updatePosition(){
    if(!pet) return;
    var x=Math.max(0,Math.min(state.x,window.innerWidth-60));
    var y=Math.max(0,Math.min(state.y,window.innerHeight-60));
    state.x=x;state.y=y;
    pet.style.transform='translate('+x+'px,'+y+'px) scaleX('+state.facing+')';
  }

  /* ===== Drag ===== */
  function setupDrag(){
    var sx,sy,px,py;
    function onDown(e){
      if(e.target===gearBtn||e.target===hideBtn) return;
      var pt=e.touches?e.touches[0]:e;
      dragging=true;dragMoved=false;
      sx=pt.clientX;sy=pt.clientY;px=state.x;py=state.y;
      pet.classList.add('dragging');
      pet.style.transition='none';
      e.preventDefault();
    }
    function onMove(e){
      if(!dragging) return;
      var pt=e.touches?e.touches[0]:e;
      var dx=pt.clientX-sx,dy=pt.clientY-sy;
      if(Math.abs(dx)>3||Math.abs(dy)>3) dragMoved=true;
      state.x=Math.max(0,Math.min(px+dx,window.innerWidth-60));
      state.y=Math.max(0,Math.min(py+dy,window.innerHeight-60));
      if(Math.abs(dx)>5) state.facing=dx>0?1:-1;
      pet.style.transform='translate('+state.x+'px,'+state.y+'px) scaleX('+state.facing+')';
      e.preventDefault();
    }
    function onUp(){
      if(!dragging) return;
      dragging=false;
      pet.classList.remove('dragging');
      pet.style.transition='';
      lastDragEnd=Date.now();
      if(dragMoved){
        saveState();
        showSpeech(rand(MSG_DRAG));
        pet.classList.add('happy');
        setTimeout(function(){pet.classList.remove('happy')},500);
      }
      resetIdle();
    }
    pet.addEventListener('mousedown',onDown);
    pet.addEventListener('touchstart',onDown,{passive:false});
    document.addEventListener('mousemove',onMove);
    document.addEventListener('touchmove',onMove,{passive:false});
    document.addEventListener('mouseup',onUp);
    document.addEventListener('touchend',onUp);
  }

  /* ===== Click ===== */
  function onPetClick(e){
    if(Date.now()-lastDragEnd<250) return; // ignore click right after drag
    if(e.target===gearBtn||e.target===hideBtn) return;
    pet.classList.add('happy');
    setTimeout(function(){pet.classList.remove('happy')},500);
    showSpeech(rand(MSG_CLICK));
    resetIdle();
  }

  /* ===== Speech ===== */
  function showSpeech(msg){
    if(!speech) return;
    speech.textContent=msg;
    speech.classList.add('show');
    clearTimeout(speechTimer);
    speechTimer=setTimeout(function(){speech.classList.remove('show')},2500);
  }
  function scheduleIdleSpeech(){
    clearTimeout(idleSpeechTimer);
    idleSpeechTimer=setTimeout(function(){
      if(!dragging&&!isWalking&&Date.now()-lastInteract>10000){
        if(!pet.classList.contains('sleeping')) showSpeech(rand(MSG_IDLE));
      }
      scheduleIdleSpeech();
    },12000+Math.random()*10000);
  }

  /* ===== Auto Walk & Sleep ===== */
  function resetIdle(){
    lastInteract=Date.now();
    pet.classList.remove('sleeping');
    clearTimeout(idleTimer);
    clearTimeout(walkTimer);
    idleTimer=setTimeout(checkSleep,120000);
    if(state.autoWalk) walkTimer=setTimeout(autoWalk,5000+Math.random()*5000);
  }

  function autoWalk(){
    if(!state.autoWalk||dragging||pet.classList.contains('sleeping')) return;
    isWalking=true;
    pet.classList.add('ap-pet-walk');
    var pad=60;
    var tx=pad+Math.random()*(window.innerWidth-2*pad);
    var ty=pad+Math.random()*(window.innerHeight-2*pad-100);
    state.facing=tx<state.x?-1:1;
    state.x=tx;state.y=ty;
    showSpeech(rand(MSG_WALK));
    updatePosition();
    saveState();
    setTimeout(function(){
      isWalking=false;
      pet.classList.remove('ap-pet-walk');
      if(state.autoWalk) walkTimer=setTimeout(autoWalk,4000+Math.random()*6000);
    },3500);
  }

  function checkSleep(){
    if(Date.now()-lastInteract>120000&&!dragging){
      pet.classList.add('sleeping');
      showSpeech(rand(MSG_SLEEP));
    }
  }

  /* ===== Hide ===== */
  function hidePet(){
    pet.style.display='none';
    showBtn.classList.add('show');
  }

  /* ===== Settings ===== */
  function openSettings(){
    if(settings){settings.remove();settings=null;return}
    settings=document.createElement('div');
    settings.className='ap-settings show';
    settings.innerHTML=
      '<h3>🐾 Pet Settings <button class="ap-close">✕</button></h3>'+
      '<div class="ap-set-row"><div class="ap-set-label">Pet Type</div><div class="ap-set-pets" id="sPG"></div></div>'+
      '<div class="ap-set-row"><div class="ap-set-label">Name</div><input type="text" class="ap-set-name" id="sName" maxlength="12" value="'+state.name+'"></div>'+
      '<div class="ap-set-row"><div class="ap-set-label">Color</div><div class="ap-set-colors" id="sCG"></div></div>'+
      '<div class="ap-set-row ap-toggle"><span class="ap-toggle-label">🚶 Auto-walk</span><div class="ap-switch '+(state.autoWalk?'on':'')+'" id="sWalk"></div></div>'+
      '<div class="ap-set-actions"><button class="ap-btn-reset" id="sReset">Reset Pet</button></div>';

    var sx=state.x+70,sy=state.y-50;
    if(sx+290>window.innerWidth) sx=state.x-290;
    if(sy<10) sy=10;
    if(sy+420>window.innerHeight) sy=Math.max(10,window.innerHeight-430);
    settings.style.left=sx+'px';
    settings.style.top=sy+'px';
    document.body.appendChild(settings);

    var pg=settings.querySelector('#sPG');
    PETS.forEach(function(p){
      var el=document.createElement('div');
      el.className='ap-pet-opt'+(p.id===state.petId?' sel':'');
      el.textContent=p.e;
      el.style.setProperty('--ap-sel',state.color);
      el.onclick=function(){
        pg.querySelectorAll('.ap-pet-opt').forEach(function(x){x.classList.remove('sel')});
        el.classList.add('sel');
        state.petId=p.id;state.petEmoji=p.e;
        updateAppearance();saveState();
      };
      pg.appendChild(el);
    });

    var cg=settings.querySelector('#sCG');
    COLORS.forEach(function(c){
      var el=document.createElement('div');
      el.className='ap-color-opt'+(c.v===state.color?' sel':'');
      el.style.background=c.v;el.style.color=c.v;
      el.onclick=function(){
        cg.querySelectorAll('.ap-color-opt').forEach(function(x){x.classList.remove('sel')});
        el.classList.add('sel');
        state.color=c.v;
        updateAppearance();saveState();
        pg.querySelectorAll('.ap-pet-opt').forEach(function(x){x.style.setProperty('--ap-sel',c.v)});
      };
      cg.appendChild(el);
    });

    settings.querySelector('#sName').addEventListener('input',function(){
      state.name=this.value.trim()||'Buddy';
      nameTag.textContent=state.name;
      saveState();
    });

    var wt=settings.querySelector('#sWalk');
    wt.onclick=function(){
      state.autoWalk=!state.autoWalk;
      wt.classList.toggle('on',state.autoWalk);
      saveState();
      if(state.autoWalk) resetIdle();
      else{clearTimeout(walkTimer);pet.classList.remove('ap-pet-walk');isWalking=false}
    };

    settings.querySelector('.ap-close').onclick=function(){settings.remove();settings=null};
    settings.querySelector('#sReset').onclick=function(){
      if(confirm('Reset your pet? This will create a new one.')){
        localStorage.removeItem(SK);
        settings.remove();settings=null;
        if(pet) pet.remove();
        if(showBtn) showBtn.remove();
        pet=null;state=null;
        showCreateModal();
      }
    };

    setTimeout(function(){document.addEventListener('click',closeOut)},100);
  }

  function closeOut(e){
    if(settings&&!settings.contains(e.target)&&e.target!==pet&&!pet.contains(e.target)){
      settings.remove();settings=null;
      document.removeEventListener('click',closeOut);
    }
  }

  /* ===== Resize ===== */
  window.addEventListener('resize',function(){
    if(state){
      state.x=Math.min(state.x,window.innerWidth-60);
      state.y=Math.min(state.y,window.innerHeight-60);
      updatePosition();
    }
  });

  /* ===== Start ===== */
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
