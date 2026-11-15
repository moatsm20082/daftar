
/* =====================================================================
   v22 Talking with Daftar feels like a phone call.
   - Hearing: the phone records while you talk and stops by itself when you go quiet
     (no tap needed). The words are written out on the server (Groq Whisper), which
     hears Jordanian Arabic much better than the phone. Phones without recording fall
     back to the phone's own speech recognition.
   - One trip: the recording goes up, and the written words, the understood records
     and Daftar's spoken answer come back together.
   - Speaking: a real voice from the server; the phone's voice if that isn't available.
   - Tap the circle any time: while Daftar talks it stops and listens; while you talk it
     sends now. It never gets stuck: every step has a time limit and a way back.
   ===================================================================== */
Object.assign(L, {
  vxNotHeard:["ما سمعتك منيح، احكيها كمان مرة.","I didn't catch that, say it again."],
  vxSpeakNow:["عم بسمعك…","Listening…"], vxAuto:["لما تسكت بفهم لحالي","I'll take it when you pause"], vxTapSpeak:["اكبس عشان تقاطعه","Tap to interrupt"], vxSpeaking:["دفتر بيحكي…","Daftar is talking…"],
});

const vxListenSR = vxListen;            // the phone's own recognition, kept as the fallback
const VR = { stream:null, ctx:null, mr:null, chunks:[], iv:null, t0:0, spoke:false, sent:false, cache:new Map() };
const vrCan = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && (window.AudioContext||window.webkitAudioContext));
const vrMime = () => { for(const m of ["audio/webm;codecs=opus","audio/mp4","audio/webm","audio/ogg;codecs=opus"]) try{ if(MediaRecorder.isTypeSupported(m)) return m; }catch(e){} return ""; };
const vxShort = s => String(s).trim().split(/\s+/).length <= 4;

function vrCtx(){ try{ if(!VR.ctx) VR.ctx = new (window.AudioContext||window.webkitAudioContext)(); if(VR.ctx.state==="suspended") VR.ctx.resume(); }catch(e){} return VR.ctx; }
function vrRelease(){ try{ if(VR.stream) VR.stream.getTracks().forEach(t=>t.stop()); }catch(e){} VR.stream = null; }
function vrStopLoop(){ if(VR.iv){ clearInterval(VR.iv); VR.iv = null; } const o = document.querySelector(".vx-orb"); if(o) o.style.removeProperty("--lv"); }

/* taps unlock sound on iPhone: the player, the audio engine and the phone's voice */
{ const _u = vxUnlockAudio; vxUnlockAudio = function(){ _u(); vrCtx(); try{ if("speechSynthesis" in window && !VR.ttsUnlocked){ const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); VR.ttsUnlocked = true; } }catch(e){} }; }

vxStopListening = function(send){
  if(VX.rec){ try{ VX.rec.stop(); }catch(e){} }
  if(VR.mr && VR.mr.state!=="inactive"){ VR.sent = !!send; try{ VR.mr.stop(); }catch(e){ vrRelease(); } }
  vrStopLoop();
};
function vxStopAll(){
  VX.sayN = (VX.sayN||0) + 1;   // any answer still on its way stays quiet
  try{ speechSynthesis.cancel(); }catch(e){}
  if(VX.audio){ try{ VX.audio.pause(); if(VX.audioDone) VX.audioDone(); }catch(e){} }
  VX.speaking = false;
}

vxListen = async function(){
  if(VX.noRec || !vrCan() || window.DEMO_MODE) return vxListenSR();
  if(VX.state==="thinking") return;
  vxStopListening(false); vxStopAll();
  const back = VX.state==="review" ? "review" : VX.state==="listening" ? (VX.prev||"idle") : "idle";
  VX.prev = back; VX.state = "listening"; VX.heard = ""; vxRender();
  let stream;
  try{ stream = await navigator.mediaDevices.getUserMedia({ audio:{ echoCancellation:true, noiseSuppression:true, autoGainControl:true } }); }
  catch(e){
    if(e && (e.name==="NotAllowedError" || e.name==="SecurityError")){ VX.hands = false; VX.reply = t("vxNoMic"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); return; }
    VX.noRec = true; return vxListenSR();
  }
  if(!VX.open || VX.state!=="listening"){ stream.getTracks().forEach(t=>t.stop()); return; }
  VR.stream = stream; VR.chunks = []; VR.spoke = false; VR.sent = true; VR.t0 = Date.now();
  let mr; const mime = vrMime();
  try{ mr = mime ? new MediaRecorder(stream, { mimeType:mime, audioBitsPerSecond:32000 }) : new MediaRecorder(stream); }
  catch(e){ vrRelease(); VX.noRec = true; return vxListenSR(); }
  VR.mr = mr;
  mr.ondataavailable = e => { if(e.data && e.data.size) VR.chunks.push(e.data); };
  mr.onstop = () => {
    vrStopLoop(); vrRelease(); if(VR.mr!==mr) return; VR.mr = null;
    const blob = new Blob(VR.chunks, { type:(mr.mimeType||mime||"audio/webm") });
    if(!VX.open) return;
    if(VR.sent && VR.spoke && blob.size > 1200){ VX.misses = 0; vxSendAudio(blob); }
    else if(VX.state==="listening"){ VX.misses++; VX.state = back; vxRender(); }
  };
  try{ mr.start(250); }catch(e){ vrRelease(); VX.noRec = true; return vxListenSR(); }
  vxRender();

  /* stop by itself: after you talk and then go quiet for a moment */
  try{
    const ctx = vrCtx(), src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser();
    an.fftSize = 1024; src.connect(an); const buf = new Float32Array(an.fftSize);
    let floor = 0, n = 0, loud = 0, lastLoud = 0;
    VR.iv = setInterval(() => {
      if(!VR.mr){ vrStopLoop(); return; }
      an.getFloatTimeDomainData(buf); let s = 0; for(let i=0;i<buf.length;i++) s += buf[i]*buf[i];
      const rms = Math.sqrt(s/buf.length), now = Date.now(), el = now - VR.t0;
      if(el < 300){ floor = (floor*n + rms)/(++n); return; }
      const thr = Math.max(0.012, floor*3.2);
      if(rms > thr){ if(++loud >= 3){ VR.spoke = true; lastLoud = now; } } else loud = 0;
      const o = document.querySelector(".vx-orb"); if(o) o.style.setProperty("--lv", Math.min(1, rms/(thr*4)).toFixed(2));
      if(VR.spoke && now - lastLoud > 1150) return vxStopListening(true);   // done talking
      if(!VR.spoke && el > 8000) return vxStopListening(false);            // nobody spoke
      if(el > 25000) return vxStopListening(true);                         // long enough
    }, 50);
  }catch(e){ /* no level meter: the owner taps when done, and 25s is the cap */ VR.spoke = true; setTimeout(()=>{ if(VR.mr===mr) vxStopListening(true); }, 25000); }
};

function vxB64(blob){ return new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(String(f.result).split(",")[1]||""); f.onerror = rej; f.readAsDataURL(blob); }); }
async function vxSendAudio(blob){
  if(VX.busy) return;
  VX.busy = true; VX.state = "thinking"; VX.reply = ""; VX.rows = []; vxRender();
  const pending = VX.prev==="review" && VX.lastRows && VX.lastRows.some(r=>r.kind!=="ask" && r.ok && r.on);
  try{
    (window.dtrack||function(){})("voice_talk");
    const audio = await vxB64(blob);
    const ctl = new AbortController(); const to = setTimeout(()=>ctl.abort(), 30000);
    const r = await vxCall({ mode:"talk", audio, mime:blob.type, ctx:vxContext(), history:VX.hist.slice(-6), speak:!vxMuted(), pending }, ctl.signal);
    clearTimeout(to);
    const j = await r.json().catch(()=>({}));
    if(!r.ok){
      VX.busy = false;
      if(j.err==="not_ready"){ VX.noRec = true; VX.state = VX.prev||"idle"; if(VX.prev==="review") VX.rows = VX.lastRows||[]; vxRender(); return vxListenSR(); }
      VX.reply = j.err==="limit" ? t("vxLimit") : t("vxNet"); vxTurn(false, VX.reply); VX.hands = VX.hands && j.err!=="limit"; VX.state = "done"; vxRender(); return;
    }
    const heard = String(j.heard||"").trim().replace(/[.!؟?،,]+$/,"");
    if(!heard){ VX.busy = false; VX.misses++; if(VX.prev==="review"){ VX.rows = VX.lastRows||[]; VX.state = "review"; } else VX.state = "done"; VX.reply = t("vxNotHeard"); vxRender(); return vxSay(VX.reply); }
    VX.misses = 0;
    if(j.skip || (vxShort(heard) && (VX_YES.test(heard) || VX_NO.test(heard) || VX_BYE.test(heard)))){
      VX.busy = false; if(VX.prev==="review"){ VX.rows = VX.lastRows||[]; VX.state = "review"; } return vxSend(heard);   // yes / no / bye: handled here, no thinking needed
    }
    vxTurn(true, heard);
    vxApply(j);
  }catch(e){ VX.busy = false; VX.reply = t("vxNet"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); }
  finally{ VX.busy = false; }
}

/* the answer: rows to check, what Daftar says, and its voice when it came along */
function vxApply(j){
  VX.rows = (j.actions||[]).map(vxRow).filter(Boolean);
  const asks = VX.rows.filter(x=>x.kind==="ask"), saves = VX.rows.filter(x=>x.kind!=="ask" && x.ok);
  let audio = j.audio || "";
  if(asks.length && !saves.length){ VX.reply = asks.map(a=>a.answer).join(" "); audio = ""; }
  else VX.reply = j.reply || (VX.rows.length ? "" : t("vxNothing"));
  if(!VX.rows.length && !j.reply){ VX.reply = t("vxNothing"); audio = ""; }
  vxTurn(false, VX.reply);
  VX.lastRows = VX.rows;
  VX.state = saves.length ? "review" : "done"; VX.busy = false; vxRender(); vxSay(VX.reply, audio ? `data:${j.audio_type||"audio/wav"};base64,${audio}` : "");
}

/* typed messages take the same road back */
vxSend = async function(text){
  if(VX.busy) return; vxStopListening(false);
  const pending = (VX.prev==="review" || VX.state==="review") && VX.rows.some(r=>r.kind!=="ask" && r.ok && r.on);
  const clean = String(text).trim().replace(/[.!؟?،,]+$/,"");
  if(!clean) return;
  vxTurn(true, clean); VX.heard = "";
  if(pending && VX_YES.test(clean) && vxShort(clean)) return vxConfirm();
  if(pending && VX_NO.test(clean) && vxShort(clean)){ VX.rows = []; VX.lastRows = []; VX.reply = t("vxCancelled"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); vxSay(VX.reply); return; }
  if(VX_BYE.test(clean) && vxShort(clean)){ VX.rows = []; VX.reply = t("vxBye"); vxTurn(false, VX.reply); VX.state = "done"; VX.hands = false; vxRender(); await vxSay(VX.reply); return; }
  VX.busy = true; VX.state = "thinking"; VX.reply = ""; VX.rows = []; vxRender();
  try{
    (window.dtrack||function(){})("voice_ask");
    const ctl = new AbortController(); const to = setTimeout(()=>ctl.abort(), 30000);
    const r = await vxCall({ mode:"ask", text:clean, ctx:vxContext(), history:VX.hist.slice(0,-1).slice(-6), speak:!vxMuted() }, ctl.signal);
    clearTimeout(to);
    const j = await r.json().catch(()=>({}));
    if(!r.ok){ VX.busy = false; VX.reply = j.err==="limit" ? t("vxLimit") : j.err==="not_ready" ? t("vxNotReady") : t("vxNet"); vxTurn(false, VX.reply); VX.hands = VX.hands && j.err!=="limit" && j.err!=="not_ready"; VX.state = "done"; vxRender(); return; }
    vxApply(j);
  }catch(e){ VX.busy = false; VX.reply = t("vxNet"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); }
  finally{ VX.busy = false; }
};

vxCall = async function(body, signal){
  const { data } = await sb.auth.getSession(); const tok = data && data.session && data.session.access_token;
  if(!tok) throw new Error("auth");
  return fetch(`${C.SUPABASE_URL}/functions/v1/voice`, { method:"POST", signal, headers:{ apikey:C.SUPABASE_ANON_KEY, Authorization:"Bearer "+tok, "Content-Type":"application/json" }, body:JSON.stringify(body) });
};

/* speaking, then listening again by itself (like a call) */
vxSay = async function(text, audio){
  const id = VX.sayN = (VX.sayN||0) + 1;
  if(VX.audioDone) VX.audioDone();
  VX.speaking = true; vxRender();
  await vxSpeak(text, audio, id);
  if(id!==VX.sayN) return;          // something newer took over (a tap, a new answer)
  VX.speaking = false;
  if(!VX.open) return;
  vxRender();
  if(VX.hands && !VX.busy && VX.misses < 2 && (VX.state==="review" || VX.state==="done") && !window.DEMO_MODE && (vrCan() || vxSR())) vxListen();
};
function vxPlay(src){
  return new Promise(res => {
    const au = VX.audio || (VX.audio = new Audio());
    let fin = false; const done = ok => { if(fin) return; fin = true; au.onended = au.onerror = null; VX.audioDone = null; res(ok!==false); };
    VX.audioDone = () => done(true);
    au.onended = () => done(true); au.onerror = () => done(false); au.src = src;
    const p = au.play(); if(p && p.catch) p.catch(() => done(false));
    setTimeout(() => done(true), 25000);
  });
}
vxSpeak = async function(text, audio, id){
  if(!text || vxMuted() || !VX.open) return;
  try{
    if(window.DEMO_MODE) throw 0;
    let url = "";
    if(audio){ url = audio; }
    else if(VR.cache.has(text)){ url = VR.cache.get(text); }
    else if(!VX.noTts){
      const ctl = new AbortController(); const to = setTimeout(()=>ctl.abort(), 12000);
      const r = await vxCall({ mode:"tts", text }, ctl.signal); clearTimeout(to);
      if(r.status===503){ VX.noTts = true; throw 0; }
      if(!r.ok) throw 0;
      const blob = await r.blob(); if(!blob.size) throw 0;
      url = URL.createObjectURL(blob);
      if(text.length < 80 && VR.cache.size < 20) VR.cache.set(text, url);
    } else throw 0;
    if(!VX.open || vxMuted() || (id && id!==VX.sayN)) return;
    if(!(await vxPlay(url)) && VX.open && !vxMuted() && !(id && id!==VX.sayN)) await vxSpeakLocal(text);   // the phone couldn't play it: use its own voice
  }catch(e){ if(VX.open && !vxMuted() && !(id && id!==VX.sayN)) await vxSpeakLocal(text); }
};
vxSpeakLocal = function(text){
  return new Promise(res => { try{
    if(!("speechSynthesis" in window)) return res();
    speechSynthesis.cancel();
    const go = () => {
      const u = new SpeechSynthesisUtterance(String(text).replace(/[✓👋🙏🎉]/g,"")), lang = LANG==="en" ? "en" : "ar";
      const vs = speechSynthesis.getVoices(), v = vs.find(x=>x.lang && x.lang.toLowerCase().startsWith(lang));
      if(v) u.voice = v; u.lang = v ? v.lang : (lang==="ar" ? "ar-SA" : "en-US"); u.rate = 1.02;
      let fin = false; const done = () => { if(fin) return; fin = true; VX.audioDone = null; res(); };
      VX.audioDone = done; u.onend = u.onerror = done; setTimeout(done, Math.min(20000, 2500 + String(text).length*90));
      speechSynthesis.speak(u);
    };
    if(speechSynthesis.getVoices().length) go(); else { let ran = false; const once = () => { if(!ran){ ran = true; go(); } }; speechSynthesis.onvoiceschanged = once; setTimeout(once, 600); }
  }catch(e){ res(); } });
};

/* the circle: while Daftar talks, tap to cut in; while you talk, tap to send now */
{ const _act = vxAct; vxAct = function(a, el){
    if(a==="mic"){
      vxUnlockAudio(); VX.hands = true; VX.misses = 0;
      if(window.DEMO_MODE) return;
      if(VX.state==="thinking") return;
      if(VX.state==="listening"){ if(VR.mr){ if(VR.spoke) return vxStopListening(true); VX.hands = false; return vxStopListening(false); } VX.hands = false; return vxStopListening(); }
      if(VX.speaking) vxStopAll();
      if(vrCan() || vxSR()) return vxListen();
      const i = document.getElementById("vxText"); if(i) i.focus(); return;
    }
    if(a==="confirm" || a==="reset"){ vxStopListening(false); vxStopAll(); }
    return _act(a, el);
  }; }

vxOpen = function(){
  VX.open = true; VX.state = "idle"; VX.rows = []; VX.lastRows = []; VX.reply = ""; VX.heard = ""; VX.turns = []; VX.hist = []; VX.misses = 0; VX.hands = true; VX.busy = false;
  try{ (window.dtrack||function(){})("voice_open"); }catch(e){}
  vxUnlockAudio();
  document.getElementById("vx").hidden = false; document.body.classList.add("vx-open");
  vxRender();
  if(window.DEMO_MODE){ VX.reply = t("vxDemo"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); return; }
  if(vrCan() || vxSR()) vxListen();
};
vxClose = function(){
  vxStopListening(false); vxStopAll(); vrRelease();
  VX.open = false; VX.busy = false; VX.state = "idle"; document.getElementById("vx").hidden = true; document.body.classList.remove("vx-open");
};

/* show "Daftar is talking" and the hint to cut in */
{ const _r = vxRender; vxRender = function(){
    _r();
    const w = document.getElementById("vx"); if(!w || !VX.open) return;
    const sub = w.querySelector(".vx-sub"), orb = w.querySelector(".vx-orb");
    if(VX.speaking && VX.state!=="listening" && VX.state!=="thinking"){
      if(sub) sub.innerHTML = `${t("vxSpeaking")} · <span class="sub">${t("vxTapSpeak")}</span>`;
      if(orb){ orb.classList.add("talk"); orb.innerHTML = icon("vol"); }
    }
    if(VX.state==="listening" && VR.mr && sub) sub.innerHTML = `${t("vxSpeakNow")} · <span class="sub">${t("vxAuto")}</span>`;
  }; }
