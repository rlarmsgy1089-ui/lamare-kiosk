(function(){
if(window.__lamareK)return;window.__lamareK=1;
var D=700,ov=null;
function n(s){return(s||'').replace(/\s+/g,' ').trim();}
function vis(e){return e&&e.offsetParent&&!(ov&&ov.contains(e));}
function ck(e){if(!e)return;['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window}));});}

function cssPath(el){if(!el)return'';if(el.id)return'#'+CSS.escape(el.id);var parts=[];while(el&&el.nodeType===1&&el!==document.body){if(el.id){parts.unshift('#'+CSS.escape(el.id));break;}var s=el.nodeName.toLowerCase(),sib=el,i=1;while(sib=sib.previousElementSibling){if(sib.nodeName===el.nodeName)i++;}parts.unshift(s+':nth-of-type('+i+')');el=el.parentElement;}return parts.join('>');}
function bySel(p){if(!p)return null;try{return document.querySelector(p);}catch(e){return null;}}

function findBs(root,dg,ok){var used=[];for(var d in dg)used.push(dg[d]);if(ok)used.push(ok);function isUsed(e){for(var u=0;u<used.length;u++){if(used[u]===e||used[u].contains(e))return true;}return false;}function hasUsed(e){for(var u=0;u<used.length;u++){if(e.contains(used[u]))return true;}return false;}var cand=[].slice.call(root.querySelectorAll('button,a,[role=button],div,span')),best=null;for(var i=0;i<cand.length;i++){var e=cand[i];if(!vis(e)||hasUsed(e)||isUsed(e))continue;var txt=n(e.textContent);if(/[\u232b\u2190]/.test(txt))return e;var cn=(typeof e.className==='string')?e.className:((e.className&&e.className.baseVal)||'');var lab=(((e.getAttribute&&(e.getAttribute('aria-label')||e.getAttribute('title')))||'')+' '+(e.id||'')+' '+cn).toLowerCase();if(/back|delete|erase|clear|지우|삭제|정정/.test(lab))return e;if(!/[0-9]/.test(txt)&&txt.length<3&&e.querySelector&&e.querySelector('svg,img,i,use,path')){if(!best)best=e;}}return best;}
function padFromRoot(root){if(!root)return null;var dg={},bs=null,ok=null;[].slice.call(root.querySelectorAll('button,a,div,span,input')).forEach(function(e){if(!vis(e)||e.children.length)return;var t=e.tagName==='INPUT'?e.value:n(e.textContent);if(/^[0-9]$/.test(t))dg[t]=e;else if(n(t)==='OK')ok=e;else if(/[\u232b\u2190]/.test(t)){if(!bs)bs=e;}});if(Object.keys(dg).length>=10&&ok){if(!bs)bs=findBs(root,dg,ok);return{root:root,ok:ok,dg:dg,bs:bs};}return null;}
function autoPad(){var ok=null;[].slice.call(document.querySelectorAll('button,a,div,span,input')).forEach(function(e){if(!vis(e))return;var t=e.tagName==='INPUT'?e.value:(e.children.length?'':n(e.textContent));if(n(t)==='OK')ok=e;});if(!ok)return null;var root=ok;for(var k=0;k<7;k++){root=root.parentElement;if(!root)break;var p=padFromRoot(root);if(p)return p;}return null;}
function getPad(){var p=padFromRoot(bySel(localStorage.getItem('lamare_kp')))||autoPad();if(p){var bsel=localStorage.getItem('lamare_bs');if(bsel){var be=bySel(bsel);if(be&&vis(be))p.bs=be;}}return p;}
function padDispValue(p){var skip=[];if(p&&p.dg){for(var kk in p.dg)skip.push(p.dg[kk]);}if(p&&p.ok)skip.push(p.ok);if(p&&p.bs)skip.push(p.bs);function isSkip(e){for(var s2=0;s2<skip.length;s2++)if(skip[s2]===e)return true;return false;}try{var inps=document.querySelectorAll('input');for(var i=0;i<inps.length;i++){var raw=(inps[i].value||'').trim();if(vis(inps[i])&&/^\d{1,4}$/.test(raw))return raw;}}catch(e){}var best=null,els=document.querySelectorAll('div,span,p,td,b,strong');for(var j=0;j<els.length;j++){var e=els[j];if(!vis(e)||e.children.length||isSkip(e))continue;var t=n(e.textContent).replace(/\s/g,'');if(/^\d{1,4}$/.test(t)){if(!best||t.length>best.length)best=t;}}return best;}
function clearPad(p){if(!p||!p.bs)return;if(!padDispValue(p))return;for(var z=0;z<8;z++)ck(p.bs);}

function findCouponAuto(){var b=null;[].slice.call(document.querySelectorAll('button,a,li,tr,td,div,span')).forEach(function(e){if(!vis(e))return;var t=n(e.textContent);if(/^2시간\s*(무료|유료)/.test(t)){if(!b||t.length<n(b.textContent).length)b=e;}});return b;}
function getCoupon(){var sel=localStorage.getItem('lamare_cp');if(sel){var e=bySel(sel);if(e&&vis(e)&&/2시간\s*(무료|유료)/.test(n(e.textContent)))return e;localStorage.removeItem('lamare_cp');}return findCouponAuto();}
function cnt(e){if(!e)return null;var m=n(e.textContent).match(/([\d,]+)\s*$/);return m?+m[1].replace(/,/g,''):null;}
function applied(){var f=false;[].slice.call(document.querySelectorAll('span,div,td,li,b,strong,p')).forEach(function(e){if(!vis(e))return;var t=n(e.textContent);if(/2시간\s*\(\d+\)/.test(t)&&t.length<24)f=true;});return f;}

var num='',busy=false,alertG={ts:0},DIG=['공','일','이','삼','사','오','육','칠','팔','구'];
ov=document.createElement('div');ov.id='lk-ov';
ov.style.cssText='position:fixed;inset:0;z-index:2147483000;background:radial-gradient(900px 460px at 50% 8%, #1c2a49 0%, #0f1626 60%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Malgun Gothic,Apple SD Gothic Neo,sans-serif;';
var lkStyle=document.createElement('style');lkStyle.textContent='#lk-ov *{box-sizing:border-box;}#lk-ov .key{position:relative;overflow:hidden;border:2px solid rgba(255,255,255,.07);border-radius:20px;background:#1e2b47;color:#ffffff;font-size:clamp(40px,10.5vw,72px);font-weight:800;padding:clamp(20px,5vw,38px) 0;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.28);transition:transform .08s ease,box-shadow .25s ease,border-color .25s ease,background .1s;-webkit-tap-highlight-color:transparent;}#lk-ov .key.glow{border-color:#4f8bff;box-shadow:0 0 0 2px rgba(79,139,255,.35),0 0 18px 3px rgba(79,139,255,.55),0 3px 10px rgba(0,0,0,.28);}#lk-ov .key.ok.glow{border-color:#9cc0ff;box-shadow:0 0 0 2px rgba(156,192,255,.5),0 0 22px 4px rgba(47,107,255,.7);}#lk-ov .key:active{transform:scale(.94);background:#243357;}#lk-ov .key.ok{background:#2f6bff;color:#fff;border-color:transparent;font-size:clamp(30px,7.5vw,52px);box-shadow:0 6px 20px rgba(47,107,255,.5);}#lk-ov .key.ok:active{background:#265ce0;}#lk-ov .key.fn{color:#9fb0cd;}#lk-ov .rip{position:absolute;border-radius:50%;background:rgba(255,255,255,.14);transform:scale(0);animation:lkrip .5s ease-out;pointer-events:none;}#lk-ov .key.ok .rip{background:rgba(255,255,255,.4);}@keyframes lkrip{to{transform:scale(2.4);opacity:0;}}#lk-ov .slot{display:inline-block;width:clamp(54px,14vw,96px);text-align:center;font-weight:700;}#lk-ov{touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;}';document.head.appendChild(lkStyle);
ov.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;">'
+'<div style="font-size:clamp(48px,11vw,76px);font-weight:800;color:#f2f6fc;letter-spacing:-1px;">차량번호 입력</div>'
+'<div style="font-size:clamp(18px,4vw,26px);color:#b9c8e2;margin-top:10px;margin-bottom:22px;font-weight:600;">뒤 4자리를 누른 후 OK</div>'
+'<div id="lk-disp" style="width:min(90vw,460px);height:clamp(140px,30vw,230px);background:#fff;border-radius:24px;box-shadow:0 6px 22px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;overflow:hidden;"></div>'
+'<div id="lk-pad" style="width:min(90vw,460px);display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,2.5vw,16px);margin-top:clamp(14px,3vw,22px);"></div>'
+'<div id="lk-stat" style="margin-top:14px;font-size:15px;min-height:20px;color:#8a97a5;"></div></div>'
+'<div id="lk-set" style="position:absolute;top:6px;right:6px;font-size:14px;color:#5b6c8c;cursor:pointer;user-select:none;padding:12px 14px;">설정 ⚙</div>';
document.body.appendChild(ov);
var _vp=document.querySelector('meta[name=viewport]');if(!_vp){_vp=document.createElement('meta');_vp.name='viewport';document.head.appendChild(_vp);}_vp.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
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
idleStyle.textContent='@keyframes lkfloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}#lk-idle .row{display:flex;align-items:center;justify-content:space-between;background:#f4f6fa;border:1px solid #e3e8f0;border-radius:20px;padding:clamp(14px,3.4vw,24px) clamp(18px,4.4vw,32px);}#lk-idle .row .t{font-size:clamp(17px,3.6vw,28px);color:#3a4557;font-weight:600;}#lk-idle .row .v{font-size:clamp(24px,5vw,38px);font-weight:800;color:#1c2536;}#lk-idle .total{display:flex;flex-direction:column;align-items:center;justify-content:center;background:#eaf1ff;border:1px solid #bcd2ff;border-radius:20px;padding:0 clamp(20px,5vw,44px);}#lk-idle .total .t{font-size:clamp(15px,3vw,24px);color:#2f6bff;font-weight:700;}#lk-idle .total .v{font-size:clamp(32px,7vw,56px);font-weight:800;color:#2f6bff;line-height:1.1;}';
document.head.appendChild(idleStyle);
var idleEl=document.createElement('div');idleEl.id='lk-idle';
idleEl.style.cssText='position:absolute;inset:0;z-index:2147483500;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(11,17,30,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-family:Malgun Gothic,Apple SD Gothic Neo,sans-serif;';
idleEl.innerHTML='<div style="background:#fff;border-radius:36px;padding:clamp(26px,6vw,64px) clamp(22px,5vw,72px);width:min(94vw,900px);max-width:94%;box-shadow:0 30px 80px rgba(0,0,0,.45);text-align:center;">'+'<div style="font-size:clamp(15px,3vw,22px);font-weight:700;color:#2f6bff;letter-spacing:2px;">라마레 사전주차등록시스템</div>'+'<div style="font-size:clamp(30px,6.2vw,50px);font-weight:800;color:#1c2536;margin-top:clamp(12px,2.6vw,20px);">주차 할인 안내</div>'+'<div style="display:flex;align-items:stretch;gap:clamp(10px,2.4vw,18px);margin-top:clamp(22px,5vw,38px);">'+'<div style="flex:1;display:flex;flex-direction:column;gap:clamp(10px,2.4vw,18px);">'+'<div class="row"><span class="t">카페 이용</span><span class="v">2시간</span></div>'+'<div class="row"><span class="t">일광미식 이용</span><span class="v">＋2시간</span></div>'+'</div>'+'<div class="total"><span class="t">최대</span><span class="v">4시간</span></div>'+'</div>'+'<div style="margin-top:clamp(20px,4.6vw,32px);background:#fff7e6;border:1px solid #ffe1a8;border-radius:18px;padding:clamp(14px,3.4vw,24px) clamp(16px,3.6vw,26px);"><span style="font-size:clamp(17px,3.8vw,28px);font-weight:700;color:#8a5a00;">일광미식 주차등록은 <span style="color:#c0392b;">2층</span>에서 해주세요</span></div>'+'<div style="margin-top:clamp(20px,4.6vw,32px);padding-top:clamp(20px,4.6vw,32px);border-top:1px solid #eef1f5;"><div style="font-size:clamp(22px,5vw,36px);font-weight:800;color:#1c2536;animation:lkfloat 2.6s ease-in-out infinite;">화면을 터치해 시작하세요</div><div style="font-size:clamp(14px,3vw,22px);color:#8a97a5;margin-top:10px;">여기서는 카페 2시간 무료 주차만 등록됩니다</div></div>'+'</div>';
ov.appendChild(idleEl);idleEl.style.display='none';
var idleTimer=null,popupOpen=false;
function showIdle(){num='';upd();setStat('');clearTimeout(idleTimer);try{if(findErrModal())dismissModal();clearPad(getPad());}catch(e){}}
function resetIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(function(){if(!popupOpen)showIdle();},45000);}
function hideIdle(){idleEl.style.display='none';try{clearPad(getPad());}catch(e){}resetIdle();}
idleEl.onclick=function(){hideIdle();};

var disp=ov.querySelector('#lk-disp'),pad=ov.querySelector('#lk-pad'),stat=ov.querySelector('#lk-stat');
function upd(){var h='';for(var i=0;i<4;i++){var c=num[i];h+='<span class="slot" style="font-size:clamp(54px,15vw,100px);color:'+(c?'#1c2536':'#c7cfda')+'">'+(c||'·')+'</span>';}disp.innerHTML=h;}
function setStat(t,c){stat.textContent=t;stat.style.color=c||'#8a97a5';}
function ripple(e){var b=e.currentTarget,r=document.createElement('span'),rc=b.getBoundingClientRect(),sz=Math.max(rc.width,rc.height);r.className='rip';r.style.width=r.style.height=sz+'px';r.style.left=((e.clientX||rc.left+rc.width/2)-rc.left-sz/2)+'px';r.style.top=((e.clientY||rc.top+rc.height/2)-rc.top-sz/2)+'px';b.appendChild(r);setTimeout(function(){r.remove();},500);b.classList.add('glow');setTimeout(function(){b.classList.remove('glow');},350);}

// ---- 결과 팝업 ----
function chime(){try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;var c=new AC();function t(f,t0,dur){var o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(f,c.currentTime+t0);g.gain.setValueAtTime(0.0001,c.currentTime+t0);g.gain.exponentialRampToValueAtTime(0.3,c.currentTime+t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t0+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+dur+0.02);}t(523,0,0.12);t(659,0.12,0.12);t(784,0.24,0.32);setTimeout(function(){try{c.close();}catch(e){}},1400);}catch(e){}}
function speak(t){try{if(!('speechSynthesis' in window))return null;var u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.rate=0.8;u.pitch=1;var vs=window.speechSynthesis.getVoices();for(var i=0;i<vs.length;i++){if(/ko/i.test(vs[i].lang)){u.voice=vs[i];break;}}window.speechSynthesis.cancel();window.speechSynthesis.speak(u);return u;}catch(e){return null;}}
function fmt(m){var h=Math.floor(m/60),mi=m%60;return (h?h+'시간 ':'')+mi+'분';}
function rowMinutes(label){var els=document.querySelectorAll('tr,td,div,li,p,span'),best=null;for(var i=0;i<els.length;i++){if(!vis(els[i]))continue;var t=n(els[i].textContent);if(t.indexOf(label)>-1&&/\(\d+\s*분\)/.test(t)){if(!best||t.length<n(best.textContent).length)best=els[i];}}if(!best)return null;var m=n(best.textContent).match(/\((\d+)\s*분\)/);return m?+m[1]:null;}
function readPlate(){var els=document.querySelectorAll('tr,td,div,li,p,span');for(var i=0;i<els.length;i++){if(!vis(els[i]))continue;var t=n(els[i].textContent);var idx=t.indexOf('차량번호');if(idx>-1){var m=t.slice(idx+4).match(/(\d{2,3}\s?[가-힣]\s?\d{4})/);if(m)return m[1].replace(/\s/g,'');}}var b=n(document.body.innerText).match(/(\d{2,3}[가-힣]\d{4})/);return b?b[1]:null;}
function popup(ok,plate,ti,reason){
  popupOpen=true;
  var _vt=null;if(ok){chime();_vt=(ti&&ti.over!=null)?'이용 시간이 초과되었습니다. 추가 요금이 발생할 수 있습니다.':'정상 처리되었습니다. 이용해주셔서 감사합니다.';}
  var over=(ti&&ti.over!=null);
  var color=!ok?'#e14a4a':(over?'#f5a524':'#12b866');
  var msg=!ok?((reason&&reason.msg)||'등록 실패 · 다시 시도해 주세요'):(over?'이용 시간이 초과되었습니다':'정상 처리되었습니다');
  var ic=!ok?'\u2715':(over?'!':'\u2713');
  var line='';
  if(ok&&over) line='<div style="margin-top:20px;font-size:36px;font-weight:700;color:#f5a524;">무료시간 초과 · '+fmt(ti.over)+'</div><div style="font-size:18px;color:#f5a524;margin-top:6px;opacity:.85;">추가요금이 발생할 수 있습니다</div>';
  else if(ok&&ti) line='<div style="margin-top:20px;font-size:36px;font-weight:700;color:#12d27a;">남은 무료시간 '+fmt(ti.rem)+'</div>';
  else if(ok) line='<div style="margin-top:20px;font-size:36px;font-weight:700;color:#12d27a;">2시간 무료 적용 완료</div>';
  else if(!ok&&reason&&reason.sub) line='<div style="margin-top:18px;font-size:clamp(16px,3.4vw,24px);font-weight:600;color:#ff9c9c;">'+reason.sub+'</div>';
  var back=document.createElement('div');
  back.style.cssText='position:absolute;inset:0;z-index:2147483300;display:flex;align-items:center;justify-content:center;background:rgba(6,10,20,.6);font-family:Malgun Gothic,Apple SD Gothic Neo,sans-serif;';
  back.innerHTML='<div style="position:relative;background:#18233c;border:3px solid '+color+';border-radius:30px;padding:clamp(30px,6.5vw,60px) clamp(26px,6vw,72px);width:min(92vw,700px);max-width:92%;text-align:center;box-shadow:0 26px 70px rgba(0,0,0,.55),0 0 0 7px '+color+'26;">'
    +'<div id="lk-pclose" style="position:absolute;top:20px;right:22px;width:52px;height:52px;border-radius:50%;background:#243357;color:#9fb0cd;font-size:24px;line-height:52px;cursor:pointer;">✕</div>'
    +'<div style="font-size:20px;color:#8ea0bf;letter-spacing:1px;">차량번호</div>'
    +'<div style="font-size:clamp(40px,9.5vw,72px);font-weight:800;color:#fff;letter-spacing:3px;margin-top:6px;white-space:nowrap;">'+(plate||'-')+'</div>'
    +line
    +'<div style="margin-top:30px;padding-top:26px;border-top:1px solid #2a3a5e;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;"><span style="display:inline-flex;align-items:center;justify-content:center;width:clamp(44px,9vw,64px);height:clamp(44px,9vw,64px);border-radius:50%;background:'+color+';color:#fff;font-size:clamp(26px,6vw,42px);font-weight:800;">'+ic+'</span><span style="font-size:clamp(28px,6.5vw,42px);font-weight:800;color:'+color+';">'+msg+'</span></div>'
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
    else if(num.length<4){var p=getPad();num+=(''+k);upd();if(p&&p.dg[k])ck(p.dg[k]);speak(DIG[k]);}
  };
  pad.appendChild(b);
});

function reset(){var q=getPad();if(q&&q.bs){for(var j=0;j<5;j++)ck(q.bs);}num='';upd();setStat('');busy=false;}

function plateMatchCount(entered){var els=document.querySelectorAll('td,div,span,li,option,tr,button');var set={},c=0;for(var i=0;i<els.length;i++){var e=els[i];if(!vis(e)||e.children.length)continue;if(e.closest&&e.closest('#lk-selbar'))continue;var t=n(e.textContent);var m=t.match(/(\d{2,3}\s?[가-힣]\s?\d{4})/g);if(!m)continue;for(var k=0;k<m.length;k++){var d=m[k].replace(/[^0-9]/g,'');if(d.slice(-4)===entered){var key=m[k].replace(/\s/g,'');if(!set[key]){set[key]=1;c++;}}}}return c;}
function isSelectPopup(entered){var els=document.querySelectorAll('div,span,p,td,h1,h2,h3,strong,b');for(var i=0;i<els.length;i++){var e=els[i];if(!vis(e)||e.children.length)continue;if(e.closest&&e.closest('#lk-selbar'))continue;var t=n(e.textContent);if(t.length>40)continue;if(/차량\s*선택|차량번호\s*선택|차량을\s*선택|선택해\s*주세요|여러\s*대|목록에서|차량이\s*여러/.test(t))return true;}return plateMatchCount(entered)>=2;}
function classifyModal(t){t=n(t);if(/검색된 차량이 없|조회되지 않|조회된 차량이 없|차량이 없/.test(t))return{msg:'차량을 찾을 수 없습니다',sub:'번호를 다시 확인해 주세요'};if(/이미 할인|이미 적용|이미 등록|중복/.test(t))return{msg:'이미 할인이 적용된 차량입니다',sub:'중복 등록은 되지 않습니다'};if(/할인 적용할 차량을 검색|먼저 조회|차량을 검색/.test(t))return{msg:'차량을 먼저 조회해 주세요',sub:null};return null;}
function findErrModal(){var ph=['검색된 차량이 없','할인 적용할 차량을 검색','조회되지 않','조회된 차량이 없','차량이 없','이미 할인','이미 적용','이미 등록','중복'];var els=document.querySelectorAll('div,span,p,td,li');for(var i=0;i<els.length;i++){var e=els[i];if(!vis(e)||e.children.length)continue;var t=n(e.textContent);if(t.length>40)continue;for(var j=0;j<ph.length;j++){if(t.indexOf(ph[j])>-1)return e;}}return null;}
function findAlert(){var header=false,confirm=false;var els=document.querySelectorAll('div,span,p,td,li,h1,h2,h3,strong,b,button,a');for(var i=0;i<els.length;i++){var e=els[i];if(!vis(e)||e.children.length)continue;var t=n(e.textContent);if(!t)continue;if(/^(알림|경고|안내|오류|에러|확인)$/.test(t)){if(/^(알림|경고|안내|오류|에러)$/.test(t))header=true;if(t==='확인')confirm=true;}}return (header||confirm);}
function dismissModal(){var sv=localStorage.getItem('lamare_okbtn');if(sv){var se=bySel(sv);if(se&&vis(se)){ck(se);return true;}}var btns=document.querySelectorAll('button,a,[role=button],input[type=button],input[type=submit]');for(var i=0;i<btns.length;i++){var e=btns[i];if(!vis(e))continue;var t=n(e.tagName==='INPUT'?(e.value||''):e.textContent);if(/^(확인|닫기|예|확인하기)$/.test(t)){ck(e);return true;}}var els=document.querySelectorAll('span,div,td,p,li');for(var k=0;k<els.length;k++){var e2=els[k];if(!vis(e2)||e2.children.length)continue;var t2=n(e2.textContent);if(/^(확인|닫기)$/.test(t2)){ck(e2);return true;}}for(var m=0;m<btns.length;m++){var e3=btns[m];if(!vis(e3))continue;var lab=(((e3.getAttribute&&(e3.getAttribute('aria-label')||e3.getAttribute('title')))||'')).toLowerCase();if(/close|닫기|dismiss/.test(lab)){ck(e3);return true;}var tt=n(e3.textContent);if(/^[\u00d7\u2715xX]$/.test(tt)){ck(e3);return true;}}return false;}
function plateOK(entered){var p=readPlate();if(!p)return false;var d=p.replace(/[^0-9]/g,'');return d.length>=4&&d.slice(-4)===entered;}
function submit(){
  if(!num){setStat('차량번호를 입력하세요','#c0392b');return;}
  if(busy)return;busy=true;var subStart=Date.now();var plate=num;setStat('조회 중\u2026');
  var p=getPad();
  if(findErrModal()||findAlert()){dismissModal();if(findAlert())dismissModal();}
  clearPad(p);
  for(var zt=0;zt<num.length;zt++){if(p&&p.dg[num[zt]])ck(p.dg[num[zt]]);}
  if(p&&p.ok)ck(p.ok);
  var t0=Date.now();
  (function waitSearch(){
    if(alertG.ts>=subStart){busy=false;return;}
    var em=findErrModal();
    if(em){var rs=classifyModal(em.textContent);dismissModal();popup(false,plate,null,rs);busy=false;num='';upd();return;}
    if(findAlert()){dismissModal();popup(false,plate,null,{msg:'다시 확인해 주세요',sub:'등록 상태를 확인해 주세요'});busy=false;num='';upd();return;}
    if(isSelectPopup(plate)){handleSelect();return;}
    if(plateOK(plate)){confirmPlate();return;}
    if(Date.now()-t0<2800){setTimeout(waitSearch,150);return;}
    if(findAlert()){dismissModal();popup(false,plate,null,{msg:'다시 확인해 주세요',sub:'등록 상태를 확인해 주세요'});busy=false;num='';upd();return;}
    popup(false,plate,null,{msg:'차량을 찾을 수 없습니다',sub:'번호를 다시 확인해 주세요'});busy=false;num='';upd();
  })();
  function handleSelect(){
    ov.style.display='none';clearTimeout(idleTimer);
    var bn=document.createElement('div');bn.id='lk-selbar';
    bn.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483600;background:#2f6bff;color:#fff;padding:clamp(14px,3vw,22px);text-align:center;font-family:Pretendard,Malgun Gothic,sans-serif;font-size:clamp(18px,4.5vw,30px);font-weight:800;box-shadow:0 6px 20px rgba(0,0,0,.35);';
    bn.textContent='\ud654\uba74\uc5d0\uc11c \ubcf8\uc778 \ucc28\ub7c9\uc744 \uc120\ud0dd\ud574 \uc8fc\uc138\uc694';
    document.body.appendChild(bn);
    var st=Date.now(),sawPopup=false;
    function done(restoreIdle){if(bn.parentNode)bn.remove();ov.style.display='flex';if(restoreIdle){showIdle();busy=false;}}
    function dismissSelect(){var els=document.querySelectorAll('button,a,div,span');for(var i=0;i<els.length;i++){var e=els[i];if(!vis(e)||e.children.length)continue;if(n(e.textContent)==='닫기'){ck(e);return true;}}return false;}
    (function wsel(){
      if(alertG.ts>=subStart){if(bn.parentNode)bn.remove();busy=false;return;}
      var em=findErrModal();
      if(em){var rs=classifyModal(em.textContent);dismissModal();done(false);popup(false,plate,null,rs);busy=false;num='';upd();return;}
      var open=isSelectPopup(plate);
      if(open){sawPopup=true;if(Date.now()-st<60000){setTimeout(wsel,300);return;}dismissSelect();done(true);return;}
      if(plateOK(plate)){done(false);confirmPlate();return;}
      if(!sawPopup&&Date.now()-st<3000){setTimeout(wsel,200);return;}
      done(true);
    })();
  }
  function confirmPlate(){
    var realPlate=readPlate()||plate;
    popupOpen=true;busy=true;clearTimeout(idleTimer);
    var back=document.createElement('div');back.id='lk-confirm';
    back.style.cssText='position:absolute;inset:0;z-index:2147483300;display:flex;align-items:center;justify-content:center;background:rgba(6,10,20,.6);font-family:Pretendard,Malgun Gothic,sans-serif;';
    back.innerHTML='<div style="background:#18233c;border:3px solid #2f6bff;border-radius:30px;padding:clamp(30px,6vw,48px) clamp(26px,5vw,44px);width:min(92vw,640px);text-align:center;box-shadow:0 26px 70px rgba(0,0,0,.55),0 0 0 7px rgba(47,107,255,.15);">'
      +'<div style="font-size:clamp(18px,3.8vw,26px);color:#b9c8e2;letter-spacing:1px;font-weight:600;">입력하신 차량이 맞습니까?</div>'
      +'<div style="font-size:clamp(40px,9.5vw,72px);font-weight:800;color:#fff;letter-spacing:3px;margin:16px 0 10px;white-space:nowrap;">'+realPlate+'</div>'
      +'<div style="font-size:clamp(16px,3.4vw,22px);color:#ffc74d;font-weight:800;margin-bottom:6px;">\u26a0 본인 차량번호가 맞는지 꼭 확인하세요</div>'
      +'<div style="display:flex;gap:16px;margin-top:clamp(22px,5vw,34px);">'
      +'<button id="lk-no" style="flex:1;padding:clamp(20px,5vw,30px) 0;border:3px solid #5a6b8c;border-radius:18px;background:#20304e;color:#e6edf6;font-size:clamp(22px,5.2vw,32px);font-weight:800;cursor:pointer;-webkit-tap-highlight-color:transparent;">\u2715 아니요</button>'
      +'<button id="lk-yes" style="flex:2;padding:clamp(20px,5vw,30px) 0;border:none;border-radius:18px;background:#2f6bff;color:#fff;font-size:clamp(24px,5.6vw,36px);font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(47,107,255,.6);-webkit-tap-highlight-color:transparent;">\u2713 네, 맞아요</button>'
      +'</div></div>';
    ov.appendChild(back);
    var fin=false,to=setTimeout(function(){cancel();},20000);
    function cleanup(){if(fin)return;fin=true;clearTimeout(to);if(back.parentNode)back.remove();popupOpen=false;}
    function cancel(){cleanup();busy=false;showIdle();}
    function yes(){cleanup();setStat('등록 중\u2026');runCoupon();}
    back.querySelector('#lk-no').onclick=cancel;
    back.querySelector('#lk-yes').onclick=yes;
  }
  function runCoupon(){
    var tc=Date.now();
    (function waitCoupon(){
      if(alertG.ts>=subStart){busy=false;return;}
      var em=findErrModal();if(em){var rs=classifyModal(em.textContent);dismissModal();popup(false,readPlate()||plate,null,rs);busy=false;return;}
      var c=getCoupon();
      if(c){verify(c);return;}
      if(Date.now()-tc<2500){setTimeout(waitCoupon,200);return;}
      popup(false,readPlate()||plate);busy=false;
    })();
    function verify(c){
      var bf=cnt(c);ck(c);
      if(alertG.ts>=subStart){busy=false;return;}
      var tv=Date.now(),retried=false;
      (function poll(){
        if(alertG.ts>=subStart){busy=false;return;}
        var em=findErrModal();if(em){var rs=classifyModal(em.textContent);dismissModal();popup(false,readPlate()||plate,null,rs);busy=false;return;}
        var cc=getCoupon(),nw=cnt(cc),dec=(bf!=null&&nw!=null&&nw<bf);
        if(dec||applied()){var pk=rowMinutes('주차시간'),ds=rowMinutes('할인시간')||120,ti=null;if(pk!=null){var df=ds-pk;ti=(df>=0)?{rem:df}:{over:-df};}popup(true,readPlate()||plate,ti);reset();return;}
        var el=Date.now()-tv;
        if(el>1200&&!retried){retried=true;if(cc)ck(cc);}
        if(el<3500){setTimeout(poll,200);return;}
        popup(false,readPlate()||plate);busy=false;
      })();
    }
  }
}

ov.querySelector('#lk-set').onclick=function(){
  var m=document.createElement('div');
  m.style.cssText='position:fixed;inset:0;z-index:2147483100;background:rgba(15,23,32,.55);display:flex;align-items:center;justify-content:center;font-family:Malgun Gothic,sans-serif;';
  m.innerHTML='<div style="background:#fff;border-radius:20px;padding:26px;width:min(92vw,380px);box-shadow:0 20px 60px rgba(0,0,0,.4);font-family:Pretendard,Malgun Gothic,sans-serif;">'+'<div style="font-size:22px;font-weight:800;color:#1c2536;">직원 설정</div>'+'<div style="font-size:14px;color:#8a97a5;margin:6px 0 20px;">손님에게는 보이지 않는 관리 메뉴예요</div>'+'<button data-a="cal" style="display:block;width:100%;text-align:left;padding:16px 18px;border:2px solid #e3e8f0;border-radius:14px;background:#f7f9fc;cursor:pointer;margin-bottom:12px;">'+'<div data-a="cal" style="font-size:17px;font-weight:800;color:#26324e;">\u2699\ufe0f 키패드\u00b7할인권 다시 지정</div>'+'<div data-a="cal" style="font-size:13px;color:#8a97a5;margin-top:4px;">나이스파크 화면이 바뀌어 인식이 안 될 때</div></button>'+'<button data-a="normal" style="display:block;width:100%;text-align:left;padding:16px 18px;border:2px solid #e3e8f0;border-radius:14px;background:#f7f9fc;cursor:pointer;margin-bottom:12px;">'+'<div data-a="normal" style="font-size:17px;font-weight:800;color:#26324e;">\ud83d\udda5\ufe0f 나이스파크 화면 잠깐 보기</div>'+'<div data-a="normal" style="font-size:13px;color:#8a97a5;margin-top:4px;">뒤 화면을 직접 확인할 때 (다시 돌아올 수 있어요)</div></button>'+'<button data-a="close" style="width:100%;padding:14px;border:none;border-radius:12px;background:#eef1f4;color:#5a6b7b;font-size:15px;font-weight:700;cursor:pointer;">닫기</button></div>';
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
  bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483200;background:#2f3e6b;color:#fff;padding:18px 20px;font-family:Pretendard,Malgun Gothic,sans-serif;display:flex;justify-content:space-between;align-items:center;gap:14px;box-shadow:0 4px 16px rgba(0,0,0,.25);';
  bar.innerHTML='<div style="display:flex;align-items:center;gap:14px;"><span id="lk-step" style="flex:none;width:42px;height:42px;border-radius:50%;background:#fff;color:#2f3e6b;font-size:20px;font-weight:800;display:flex;align-items:center;justify-content:center;">1</span><span id="lk-msg" style="font-size:clamp(16px,3.4vw,21px);font-weight:600;">화면의 <b>숫자 키패드에서 아무 숫자</b>를 한 번 누르세요</span></div><div style="display:flex;gap:8px;flex:none;"><button id="lk-skip" style="background:rgba(255,255,255,.15);border:none;color:#fff;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;">건너뛰기</button><button id="lk-cancel" style="background:rgba(255,255,255,.2);border:none;color:#fff;padding:10px 18px;border-radius:10px;cursor:pointer;font-size:15px;font-weight:700;">취소</button></div>';
  document.body.appendChild(bar);
  var msg=bar.querySelector('#lk-msg'),stepb=bar.querySelector('#lk-step');
  function flash(el){try{var o=el.style.outline,ob=el.style.outlineOffset;el.style.outline='4px solid #38d39f';el.style.outlineOffset='2px';setTimeout(function(){el.style.outline=o;el.style.outlineOffset=ob;},900);}catch(e){}}
  function end(ok){document.removeEventListener('click',onClick,true);bar.remove();ov.style.display='flex';if(ok){setStat('설정 완료 \u2713','#0a7d3e');setTimeout(function(){setStat('');},2500);}}
  bar.querySelector('#lk-cancel').onclick=function(){end(false);};
  bar.querySelector('#lk-skip').onclick=function(){if(stage===3){stage=4;stepb.textContent='4';msg.innerHTML="이번엔 <b>\u20182시간 무료\u2019 할인권</b>을 한 번 누르세요";}};
  function clickable(el){var e=el;for(var i=0;i<5;i++){if(!e)break;if(e.tagName==='BUTTON'||e.tagName==='A'||(e.getAttribute&&e.getAttribute('role')==='button'))return e;e=e.parentElement;}return el;}
  var stage=1;
  function onClick(e){
    if(bar.contains(e.target))return;
    e.preventDefault();e.stopPropagation();
    if(stage===1){var r=e.target,found=null;for(var k=0;k<8;k++){if(!r)break;if(padFromRoot(r)){found=r;break;}r=r.parentElement;}
      if(!found){msg.innerHTML='\u274c 키패드를 못 찾았어요. <b>숫자 버튼</b>을 정확히 눌러주세요.';return;}
      localStorage.setItem('lamare_kp',cssPath(found));flash(found);stage=2;stepb.textContent='2';msg.innerHTML="\u2705 1단계 완료! 이번엔 <b>지우기(\u232b) 버튼</b>을 한 번 누르세요";
    }else if(stage===2){var bt=clickable(e.target);localStorage.setItem('lamare_bs',cssPath(bt));flash(bt);stage=3;stepb.textContent='3';msg.innerHTML="\u2705 2단계 완료! 잘못된 번호 조회 시 뜨는 <b>알림창의 \u2018확인\u2019 버튼</b>을 한 번 누르세요 <small style=\'opacity:.8\'>(알림창이 없으면 건너뛰기)</small>";
    }else if(stage===3){var ct=clickable(e.target);localStorage.setItem('lamare_okbtn',cssPath(ct));flash(ct);stage=4;stepb.textContent='4';msg.innerHTML="\u2705 3단계 완료! 마지막으로 <b>\u20182시간 무료\u2019 할인권</b>을 한 번 누르세요";
    }else{localStorage.setItem('lamare_cp',cssPath(e.target));flash(e.target);msg.innerHTML='\u2705 모두 완료되었습니다!';setTimeout(function(){end(true);},700);}
  }
  document.addEventListener('click',onClick,true);
}

upd();
setTimeout(function(){if(!getPad()){setStat('키패드 인식 필요 \u2014 우측 상단 설정에서 지정','#e08600');}},400);
})();
