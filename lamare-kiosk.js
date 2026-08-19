(function(){
if(window.__lamareK)return;window.__lamareK=1;
var D=700,ov=null;
function n(s){return(s||'').replace(/\s+/g,' ').trim();}
function vis(e){return e&&e.offsetParent&&!(ov&&ov.contains(e));}
function ck(e){if(!e)return;['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window}));});}

function cssPath(el){if(!el)return'';if(el.id)return'#'+CSS.escape(el.id);var parts=[];while(el&&el.nodeType===1&&el!==document.body){if(el.id){parts.unshift('#'+CSS.escape(el.id));break;}var s=el.nodeName.toLowerCase(),sib=el,i=1;while(sib=sib.previousElementSibling){if(sib.nodeName===el.nodeName)i++;}parts.unshift(s+':nth-of-type('+i+')');el=el.parentElement;}return parts.join('>');}
function bySel(p){if(!p)return null;try{return document.querySelector(p);}catch(e){return null;}}

function padFromRoot(root){if(!root)return null;var dg={},bs=null,ok=null;[].slice.call(root.querySelectorAll('button,a,div,span,input')).forEach(function(e){if(!vis(e)||e.children.length)return;var t=e.tagName==='INPUT'?e.value:n(e.textContent);if(/^[0-9]$/.test(t))dg[t]=e;else if(n(t)==='OK')ok=e;else if(t===''||/[\u232b\u2190]/.test(t)){if(!bs)bs=e;}});if(Object.keys(dg).length>=10&&ok)return{root:root,ok:ok,dg:dg,bs:bs};return null;}
function autoPad(){var ok=null;[].slice.call(document.querySelectorAll('button,a,div,span,input')).forEach(function(e){if(!vis(e))return;var t=e.tagName==='INPUT'?e.value:(e.children.length?'':n(e.textContent));if(n(t)==='OK')ok=e;});if(!ok)return null;var root=ok;for(var k=0;k<7;k++){root=root.parentElement;if(!root)break;var p=padFromRoot(root);if(p)return p;}return null;}
function getPad(){return padFromRoot(bySel(localStorage.getItem('lamare_kp')))||autoPad();}

function findCouponAuto(){var b=null;[].slice.call(document.querySelectorAll('button,a,li,tr,td,div,span')).forEach(function(e){if(!vis(e))return;var t=n(e.textContent);if(/^2시간\s*(무료|유료)/.test(t)){if(!b||t.length<n(b.textContent).length)b=e;}});return b;}
function getCoupon(){var sel=localStorage.getItem('lamare_cp');if(sel){var e=bySel(sel);if(e&&vis(e)&&/2시간\s*(무료|유료)/.test(n(e.textContent)))return e;localStorage.removeItem('lamare_cp');}return findCouponAuto();}
function cnt(e){if(!e)return null;var m=n(e.textContent).match(/([\d,]+)\s*$/);return m?+m[1].replace(/,/g,''):null;}
function applied(){var f=false;[].slice.call(document.querySelectorAll('span,div,td,li,b,strong,p')).forEach(function(e){if(!vis(e))return;var t=n(e.textContent);if(/2시간\s*\(\d+\)/.test(t)&&t.length<24)f=true;});return f;}

var num='',busy=false,alertG={ts:0},DIG=['공','일','이','삼','사','오','육','칠','팔','구'];
ov=document.createElement('div');ov.id='lk-ov';
ov.style.cssText='position:fixed;inset:0;z-index:2147483000;background:radial-gradient(900px 460px at 50% 8%, #1c2a49 0%, #0f1626 60%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Malgun Gothic,Apple SD Gothic Neo,sans-serif;';
var lkStyle=document.createElement('style');lkStyle.textContent='#lk-ov *{box-sizing:border-box;}#lk-ov .key{position:relative;overflow:hidden;border:2px solid rgba(255,255,255,.07);border-radius:20px;background:#1e2b47;color:#ffffff;font-size:54px;font-weight:700;padding:30px 0;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.28);transition:transform .08s ease,box-shadow .25s ease,border-color .25s ease,background .1s;-webkit-tap-highlight-color:transparent;}#lk-ov .key.glow{border-color:#4f8bff;box-shadow:0 0 0 2px rgba(79,139,255,.35),0 0 18px 3px rgba(79,139,255,.55),0 3px 10px rgba(0,0,0,.28);}#lk-ov .key.ok.glow{border-color:#9cc0ff;box-shadow:0 0 0 2px rgba(156,192,255,.5),0 0 22px 4px rgba(47,107,255,.7);}#lk-ov .key:active{transform:scale(.94);background:#243357;}#lk-ov .key.ok{background:#2f6bff;color:#fff;border-color:transparent;font-size:42px;box-shadow:0 6px 20px rgba(47,107,255,.5);}#lk-ov .key.ok:active{background:#265ce0;}#lk-ov .key.fn{color:#9fb0cd;}#lk-ov .rip{position:absolute;border-radius:50%;background:rgba(255,255,255,.14);transform:scale(0);animation:lkrip .5s ease-out;pointer-events:none;}#lk-ov .key.ok .rip{background:rgba(255,255,255,.4);}@keyframes lkrip{to{transform:scale(2.4);opacity:0;}}#lk-ov .slot{display:inline-block;width:80px;text-align:center;font-weight:700;}';document.head.appendChild(lkStyle);
ov.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;">'
+'<div style="font-size:34px;font-weight:700;color:#f2f6fc;letter-spacing:-.5px;">차량번호 입력</div>'
+'<div style="font-size:17px;color:#8ea0bf;margin-top:8px;margin-bottom:20px;">뒤 4자리를 누른 후 OK</div>'
+'<div id="lk-disp" style="width:400px;height:200px;background:#fff;border-radius:24px;box-shadow:0 6px 22px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;overflow:hidden;"></div>'
+'<div id="lk-pad" style="width:400px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:22px;"></div>'
+'<div id="lk-stat" style="margin-top:14px;font-size:15px;min-height:20px;color:#8a97a5;"></div></div>'
+'<div id="lk-set" style="position:absolute;top:14px;right:16px;font-size:14px;color:#5b6c8c;cursor:pointer;user-select:none;">설정 ⚙</div>';
document.body.appendChild(ov);
var _pf=document.createElement('link');_pf.rel='stylesheet';_pf.href='https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css';document.head.appendChild(_pf);
var _pfs=document.createElement('style');_pfs.textContent='#lk-ov,#lk-ov *{font-family:Pretendard,"Malgun Gothic","Apple SD Gothic Neo",sans-serif !important;}';document.head.appendChild(_pfs);

// 실제 나이스파크 경고창을 그대로 띄우되, 우리 오버레이는 잠깐 숨겼다가 확인 후 복귀
var _origAlert=window.alert;
window.alert=function(m){
  alertG.ts=Date.now(); busy=false;
  var wasOverlay = ov.style.display!=='none';
  if(wasOverlay) ov.style.display='none';
  var r; try{ r=_origAlert.call(window,m); }catch(e){}
  if(wasOverlay) ov.style.display='flex';
  num=''; upd(); setStat('');
  return r;
};
var _origConfirm=window.confirm;
window.confirm=function(m){
  alertG.ts=Date.now();
  var wasOverlay = ov.style.display!=='none';
  if(wasOverlay) ov.style.display='none';
  var r=false; try{ r=_origConfirm.call(window,m); }catch(e){}
  if(wasOverlay) ov.style.display='flex';
  return r;
};





// ---- 대기/시작 화면 + 자동 복귀 ----
var idleStyle=document.createElement('style');
idleStyle.textContent='@keyframes lkfloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}#lk-idle .row{display:flex;align-items:center;justify-content:space-between;background:#f4f6fa;border:1px solid #e3e8f0;border-radius:20px;padding:24px 32px;}#lk-idle .row .t{font-size:28px;color:#3a4557;font-weight:600;}#lk-idle .row .v{font-size:38px;font-weight:800;color:#1c2536;}#lk-idle .total{display:flex;flex-direction:column;align-items:center;justify-content:center;background:#eaf1ff;border:1px solid #bcd2ff;border-radius:20px;padding:0 44px;}#lk-idle .total .t{font-size:24px;color:#2f6bff;font-weight:700;}#lk-idle .total .v{font-size:56px;font-weight:800;color:#2f6bff;line-height:1.1;}';
document.head.appendChild(idleStyle);
var idleEl=document.createElement('div');idleEl.id='lk-idle';
idleEl.style.cssText='position:absolute;inset:0;z-index:2147483500;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(11,17,30,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-family:Malgun Gothic,Apple SD Gothic Neo,sans-serif;';
idleEl.innerHTML='<div style="background:#fff;border-radius:36px;padding:64px 72px;width:840px;max-width:94%;box-shadow:0 30px 80px rgba(0,0,0,.45);text-align:center;">'+'<div style="font-size:22px;font-weight:700;color:#2f6bff;letter-spacing:2px;">라마레 사전주차등록시스템</div>'+'<div style="font-size:50px;font-weight:800;color:#1c2536;margin-top:20px;">주차 할인 안내</div>'+'<div style="display:flex;align-items:stretch;gap:18px;margin-top:38px;">'+'<div style="flex:1;display:flex;flex-direction:column;gap:18px;">'+'<div class="row"><span class="t">카페 이용</span><span class="v">2시간</span></div>'+'<div class="row"><span class="t">일광미식 이용</span><span class="v">＋2시간</span></div>'+'</div>'+'<div class="total"><span class="t">최대</span><span class="v">4시간</span></div>'+'</div>'+'<div style="margin-top:32px;background:#fff7e6;border:1px solid #ffe1a8;border-radius:18px;padding:24px 26px;"><span style="font-size:28px;font-weight:700;color:#8a5a00;">일광미식 주차등록은 <span style="color:#c0392b;">2층</span>에서 해주세요</span></div>'+'<div style="margin-top:32px;padding-top:32px;border-top:1px solid #eef1f5;"><div style="font-size:36px;font-weight:800;color:#1c2536;animation:lkfloat 2.6s ease-in-out infinite;">화면을 터치해 시작하세요</div><div style="font-size:22px;color:#8a97a5;margin-top:10px;">여기서는 카페 2시간 무료 주차만 등록됩니다</div></div>'+'</div>';
ov.appendChild(idleEl);
var idleTimer=null,popupOpen=false;
function showIdle(){num='';upd();setStat('');idleEl.style.display='flex';clearTimeout(idleTimer);}
function resetIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(function(){if(!popupOpen)showIdle();},45000);}
function hideIdle(){idleEl.style.display='none';resetIdle();}
idleEl.onclick=function(){hideIdle();};

var disp=ov.querySelector('#lk-disp'),pad=ov.querySelector('#lk-pad'),stat=ov.querySelector('#lk-stat');
function upd(){var h='';for(var i=0;i<4;i++){var c=num[i];h+='<span class="slot" style="font-size:84px;color:'+(c?'#1c2536':'#c7cfda')+'">'+(c||'·')+'</span>';}disp.innerHTML=h;}
function setStat(t,c){stat.textContent=t;stat.style.color=c||'#8a97a5';}
function ripple(e){var b=e.currentTarget,r=document.createElement('span'),rc=b.getBoundingClientRect(),sz=Math.max(rc.width,rc.height);r.className='rip';r.style.width=r.style.height=sz+'px';r.style.left=((e.clientX||rc.left+rc.width/2)-rc.left-sz/2)+'px';r.style.top=((e.clientY||rc.top+rc.height/2)-rc.top-sz/2)+'px';b.appendChild(r);setTimeout(function(){r.remove();},500);b.classList.add('glow');setTimeout(function(){b.classList.remove('glow');},350);}

// ---- 결과 팝업 ----
function chime(){try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;var c=new AC();function t(f,t0,dur){var o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(f,c.currentTime+t0);g.gain.setValueAtTime(0.0001,c.currentTime+t0);g.gain.exponentialRampToValueAtTime(0.3,c.currentTime+t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t0+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+dur+0.02);}t(523,0,0.12);t(659,0.12,0.12);t(784,0.24,0.32);setTimeout(function(){try{c.close();}catch(e){}},1400);}catch(e){}}
function speak(t){try{if(!('speechSynthesis' in window))return null;var u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.rate=0.8;u.pitch=1;var vs=window.speechSynthesis.getVoices();for(var i=0;i<vs.length;i++){if(/ko/i.test(vs[i].lang)){u.voice=vs[i];break;}}window.speechSynthesis.cancel();window.speechSynthesis.speak(u);return u;}catch(e){return null;}}
function fmt(m){var h=Math.floor(m/60),mi=m%60;return (h?h+'시간 ':'')+mi+'분';}
function rowMinutes(label){var els=document.querySelectorAll('tr,td,div,li,p,span'),best=null;for(var i=0;i<els.length;i++){if(!vis(els[i]))continue;var t=n(els[i].textContent);if(t.indexOf(label)>-1&&/\(\d+\s*분\)/.test(t)){if(!best||t.length<n(best.textContent).length)best=els[i];}}if(!best)return null;var m=n(best.textContent).match(/\((\d+)\s*분\)/);return m?+m[1]:null;}
function readPlate(){var els=document.querySelectorAll('tr,td,div,li,p,span');for(var i=0;i<els.length;i++){if(!vis(els[i]))continue;var t=n(els[i].textContent);var idx=t.indexOf('차량번호');if(idx>-1){var m=t.slice(idx+4).match(/(\d{2,3}\s?[가-힣]\s?\d{4})/);if(m)return m[1].replace(/\s/g,'');}}var b=n(document.body.innerText).match(/(\d{2,3}[가-힣]\d{4})/);return b?b[1]:null;}
function popup(ok,plate,ti){
  popupOpen=true;
  var _vt=null;if(ok){chime();_vt=(ti&&ti.over!=null)?'이용 시간이 초과되었습니다. 추가 요금이 발생할 수 있습니다.':'정상 처리되었습니다. 이용해주셔서 감사합니다.';}
  var over=(ti&&ti.over!=null);
  var color=!ok?'#e14a4a':(over?'#f5a524':'#12b866');
  var msg=!ok?'등록 실패 · 다시 시도해 주세요':(over?'이용 시간이 초과되었습니다':'정상 처리되었습니다');
  var line='';
  if(ok&&over) line='<div style="margin-top:20px;font-size:36px;font-weight:700;color:#f5a524;">무료시간 초과 · '+fmt(ti.over)+'</div><div style="font-size:18px;color:#f5a524;margin-top:6px;opacity:.85;">추가요금이 발생할 수 있습니다</div>';
  else if(ok&&ti) line='<div style="margin-top:20px;font-size:36px;font-weight:700;color:#12d27a;">남은 무료시간 '+fmt(ti.rem)+'</div>';
  else if(ok) line='<div style="margin-top:20px;font-size:36px;font-weight:700;color:#12d27a;">2시간 무료 적용 완료</div>';
  var back=document.createElement('div');
  back.style.cssText='position:absolute;inset:0;z-index:2147483300;display:flex;align-items:center;justify-content:center;background:rgba(6,10,20,.6);font-family:Malgun Gothic,Apple SD Gothic Neo,sans-serif;';
  back.innerHTML='<div style="position:relative;background:#18233c;border:3px solid '+color+';border-radius:30px;padding:60px 72px;width:700px;max-width:92%;text-align:center;box-shadow:0 26px 70px rgba(0,0,0,.55),0 0 0 7px '+color+'26;">'
    +'<div id="lk-pclose" style="position:absolute;top:20px;right:22px;width:52px;height:52px;border-radius:50%;background:#243357;color:#9fb0cd;font-size:24px;line-height:52px;cursor:pointer;">✕</div>'
    +'<div style="font-size:20px;color:#8ea0bf;letter-spacing:1px;">차량번호</div>'
    +'<div style="font-size:84px;font-weight:700;color:#fff;letter-spacing:8px;margin-top:6px;">'+(plate||'-')+'</div>'
    +line
    +'<div style="margin-top:34px;padding-top:28px;border-top:1px solid #2a3a5e;font-size:32px;font-weight:700;color:'+color+';">'+msg+'</div>'
    +'</div>';
  ov.appendChild(back);
  function close(){try{window.speechSynthesis.cancel();}catch(e){}if(back.parentNode)back.remove();popupOpen=false;if(ok)showIdle();else resetIdle();}
  back.onclick=close;
  var _cb=back.querySelector('#lk-pclose');if(_cb)_cb.onclick=function(ev){ev.stopPropagation();close();};
  var closed=false; function closeOnce(){if(closed)return;closed=true;close();}
  if(ok&&_vt){ setTimeout(function(){ var u=speak(_vt); if(u){ u.onend=function(){ setTimeout(closeOnce,600); }; setTimeout(closeOnce,9000); } else { setTimeout(closeOnce,2600); } }, 450); }
  else { setTimeout(closeOnce, ok?2600:3800); }
}

[1,2,3,4,5,6,7,8,9,'back',0,'ok'].forEach(function(k){
  var b=document.createElement('button');
  b.className='key'+(k==='ok'?' ok':'')+(k==='back'?' fn':'');
  b.textContent=k==='back'?'⌫':k==='ok'?'OK':k;
  b.addEventListener('pointerdown',ripple);
  b.onclick=function(){
    resetIdle();
    if(k==='back'){num=num.slice(0,-1);upd();var p=getPad();if(p&&p.bs)ck(p.bs);}
    else if(k==='ok'){submit();}
    else if(num.length<4){num+=(''+k);upd();var p=getPad();if(p&&p.dg[k])ck(p.dg[k]);speak(DIG[k]);}
  };
  pad.appendChild(b);
});

function reset(){var q=getPad();if(q&&q.bs){for(var j=0;j<5;j++)ck(q.bs);}num='';upd();setStat('');busy=false;}

function submit(){
  if(!num){setStat('차량번호를 입력하세요','#c0392b');return;}
  if(busy)return;busy=true;var subStart=Date.now();var plate=num;setStat('등록 중\u2026');
  var p=getPad();if(p&&p.ok)ck(p.ok);
  var t0=Date.now();
  (function waitCoupon(){
    if(alertG.ts>=subStart){busy=false;return;}
    var c=getCoupon();
    if(c){verify(c);return;}
    if(Date.now()-t0<2500){setTimeout(waitCoupon,200);return;}
    popup(false,readPlate()||plate);busy=false;
  })();
  function verify(c){
    var bf=cnt(c);ck(c);
    if(alertG.ts>=subStart){busy=false;return;}
    var t1=Date.now(),retried=false;
    (function poll(){
      if(alertG.ts>=subStart){busy=false;return;}
      var cc=getCoupon(),nw=cnt(cc),dec=(bf!=null&&nw!=null&&nw<bf);
      if(dec||applied()){var pk=rowMinutes('주차시간'),ds=rowMinutes('할인시간')||120,ti=null;if(pk!=null){var df=ds-pk;ti=(df>=0)?{rem:df}:{over:-df};}popup(true,readPlate()||plate,ti);reset();return;}
      var el=Date.now()-t1;
      if(el>1200&&!retried){retried=true;if(cc)ck(cc);}
      if(el<3500){setTimeout(poll,200);return;}
      popup(false,readPlate()||plate);busy=false;
    })();
  }
}

ov.querySelector('#lk-set').onclick=function(){
  var m=document.createElement('div');
  m.style.cssText='position:fixed;inset:0;z-index:2147483100;background:rgba(15,23,32,.55);display:flex;align-items:center;justify-content:center;font-family:Malgun Gothic,sans-serif;';
  m.innerHTML='<div style="background:#fff;border-radius:16px;padding:22px;width:300px;box-shadow:0 20px 60px rgba(0,0,0,.4);">'
  +'<div style="font-size:17px;font-weight:500;color:#26324e;margin-bottom:16px;">설정</div>'
  +'<button data-a="cal" style="width:100%;padding:14px;border:none;border-radius:10px;background:#2f3e6b;color:#fff;font-size:15px;font-weight:500;cursor:pointer;margin-bottom:10px;">키패드 · 할인권 다시 지정</button>'
  +'<button data-a="normal" style="width:100%;padding:14px;border:1px solid #d0d7de;border-radius:10px;background:#fff;color:#26324e;font-size:15px;cursor:pointer;margin-bottom:10px;">일반 화면으로 잠깐 나가기</button>'
  +'<button data-a="close" style="width:100%;padding:12px;border:none;border-radius:10px;background:#eef1f4;color:#5a6b7b;font-size:14px;cursor:pointer;">닫기</button></div>';
  document.body.appendChild(m);
  m.onclick=function(e){var a=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(a==='close'||e.target===m){m.remove();}
    else if(a==='normal'){m.remove();ov.style.display='none';var chip=document.createElement('div');chip.textContent='키오스크 화면';chip.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483001;background:#0f1720;color:#fff;padding:9px 13px;border-radius:12px;font-size:13px;cursor:pointer;font-family:Malgun Gothic,sans-serif;';chip.onclick=function(){ov.style.display='flex';chip.remove();};document.body.appendChild(chip);}
    else if(a==='cal'){m.remove();calibrate();}
  };
};

function calibrate(){
  ov.style.display='none';
  var bar=document.createElement('div');
  bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483200;background:#2f3e6b;color:#fff;padding:16px 18px;font-family:Malgun Gothic,sans-serif;font-size:16px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 16px rgba(0,0,0,.25);';
  bar.innerHTML='<span id="lk-msg">\u2460 화면의 진짜 키패드에서 <b>아무 숫자나 한 번</b> 누르세요</span><button id="lk-cancel" style="background:rgba(255,255,255,.2);border:none;color:#fff;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:14px;">취소</button>';
  document.body.appendChild(bar);
  var msg=bar.querySelector('#lk-msg');
  function end(){document.removeEventListener('click',onClick,true);bar.remove();ov.style.display='flex';}
  bar.querySelector('#lk-cancel').onclick=end;
  var stage=1;
  function onClick(e){
    if(bar.contains(e.target))return;
    e.preventDefault();e.stopPropagation();
    if(stage===1){var r=e.target,found=null;for(var k=0;k<8;k++){if(!r)break;if(padFromRoot(r)){found=r;break;}r=r.parentElement;}
      if(!found){msg.innerHTML='키패드를 못 찾았어요. <b>숫자 버튼</b>을 정확히 눌러주세요.';return;}
      localStorage.setItem('lamare_kp',cssPath(found));stage=2;msg.innerHTML="\u2461 이번엔 <b>'2시간 무료' 할인권</b>을 한 번 누르세요";
    }else{localStorage.setItem('lamare_cp',cssPath(e.target));end();setStat('설정 완료 \u2713','#0a7d3e');setTimeout(function(){setStat('');},2500);}
  }
  document.addEventListener('click',onClick,true);
}

upd();
setTimeout(function(){if(!getPad()){setStat('키패드 인식 필요 \u2014 우측 상단 설정에서 지정','#e08600');}},400);
})();
