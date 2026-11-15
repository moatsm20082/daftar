
/* =====================================================================
   v20 "Talk to Daftar": the owner says what happened ("اشتريت باطون بمية، وضل
   عندي ستين بلاطة"), Daftar understands it, answers out loud, shows exactly what
   it will record, and saves only after the owner confirms.
   - Hearing: the phone's own speech recognition; typing (or the keyboard's mic)
     when the phone doesn't offer it.
   - Understanding: the "voice" edge function (Claude). Speaking: the same function
     with a human voice (ElevenLabs); the phone's voice if that isn't available.
   ===================================================================== */
Object.assign(L, {
  vxTitle:["احكي مع دفتر","Talk to Daftar"], vxHint:["اكبس واحكي عادي، متل ما بتحكي مع محاسبك","Tap and talk, like you'd talk to your accountant"],
  vxEx:["مثلاً: «اشتريت باطون بمية دينار، وضل عندي ستين بلاطة»","e.g. “I bought concrete for 100, and I have 60 tiles left”"],
  vxListening:["عم بسمعك…","Listening…"], vxThinking:["لحظة، عم بفهم…","One moment…"], vxTapStop:["اكبس لما تخلص","Tap when you're done"],
  vxType:["أو اكتب هون","Or type here"], vxTypePh:["اكتب اللي صار… (أو اكبس مايك الكيبورد واحكي)","Type what happened… (or use your keyboard's mic)"],
  vxSend:["ابعت","Send"], vxConfirm:["أكّد وسجّل","Confirm and save"], vxCancel:["إلغاء","Cancel"], vxAgain:["احكي كمان","Talk again"],
  vxSaved:["تمام، سجّلتهم ✓ في إشي ثاني؟","Done, saved ✓ Anything else?"], vxCancelled:["تمام، لغيتها. شو بدك نسجّل؟","OK, cancelled. What should I record?"],
  vxBye:["تمام، أنا هون إذا احتجتني 👋","OK, I'm here if you need me 👋"], vxYou:["إنت","You"], vxSavedN:["انحفظ {n}","Saved {n}"], vxNothing:["ما فهمت شو أسجّل. جرّب تحكيها بطريقة ثانية.","I didn't catch anything to record. Try saying it another way."],
  vxLimit:["خلصت أوامرك الصوتية لليوم. بترجع بكرا 🙏","You've used today's voice requests. More tomorrow 🙏"],
  vxNotReady:["الميزة بتشتغل قريباً.","This is coming very soon."], vxNet:["ما زبط الاتصال. جرّب كمان مرة.","Couldn't connect. Try again."],
  vxNoMic:["المايك مش مسموح. اكتب بدلها، أو اكبس مايك الكيبورد.","The mic isn't allowed. Type instead, or use your keyboard's mic."],
  vxDemo:["بعد ما تسجّل حسابك، بتقدر تحكي مع دفتر وهو بيسجّل عنك.","Once you sign up, you can talk to Daftar and it records for you."],
  vxMute:["كتم الصوت","Mute"], vxUnmute:["شغّل الصوت","Unmute"],
  vxExp:["مصروف","Expense"], vxInc:["دخل","Income"], vxStockIn:["دخل للمخزون","Stock in"], vxStockOut:["طلع من المخزون","Stock out"], vxStockCount:["الموجود هلأ","On hand now"],
  vxAdv:["سلفة","Advance"], vxAtt:["دوام","Attendance"], vxPresent:["حاضرين","present"], vxAbsent:["غايبين","absent"], vxAll:["كل الموظفين","Everyone"],
  vxNewItem:["صنف جديد","new item"], vxNoStaff:["ما لقيت الموظف","Couldn't find that staff member"], vxNoAmount:["المبلغ ناقص","Amount missing"],
  vxProfit:["ربحك","Your profit"], vxSpent:["صرفت","You spent"], vxEarned:["دخلك","Your income"], vxWages:["الرواتب والدوام","Wages"],
  vxToday:["اليوم","today"], vxWeek:["آخر 7 أيام","the last 7 days"], vxMonth:["هالشهر","this month"], vxLastMonth:["الشهر الماضي","last month"],
});
if(!ICON.mic) ICON.mic = '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8.5 21h7"/>';
if(!ICON.vol) ICON.vol = '<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>';
if(!ICON.volx) ICON.volx = '<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m16 9 6 6M22 9l-6 6"/>';

const VX = { open:false, state:"idle", rec:null, heard:"", rows:[], reply:"", audio:null, busy:false, turns:[], hist:[], hands:true, misses:0 };
const VX_YES = /^(آه|اه|أه|ايوا|ايوه|أيوا|أيوه|اكيد|أكيد|أكد|أكّد|اكد|تمام|ماشي|سجل|سجّل|سجلهم|سجّلهم|صح|مزبوط|yes|yeah|yep|ok|okay|sure|confirm)(?:\s|$)/i;
const VX_NO = /^(لا|لأ|لاء|الغي|ألغي|إلغاء|الغيها|ألغيها|بلاش|غلط|no|nope|cancel)(?:\s|$)/i;
const VX_BYE = /^(خلص|خلاص|يعطيك العافيه|يعطيك العافية|شكرا|شكراً|مع السلامه|مع السلامة|باي|bye|thanks|thank you|that's all)(?:\s|$)/i;
const vxMuted = () => { try{ return localStorage.getItem("vxMute")==="1"; }catch(e){ return false; } };
const vxSR = () => window.SpeechRecognition || window.webkitSpeechRecognition || null;
const vxNorm = s => String(s||"").toLowerCase().replace(/[ً-ْـ]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/(^|\s)ال/g,"$1").replace(/\s+/g," ").trim();

/* ---------- the floating mic button sits above the + button */
(function(){
  const b = document.createElement("button");
  b.id = "vxFab"; b.className = "vx-fab"; b.type = "button"; b.hidden = true;
  b.setAttribute("aria-label", t("vxTitle")); b.innerHTML = icon("mic");
  b.addEventListener("click", () => vxOpen());
  document.body.appendChild(b);
  const w = document.createElement("div");
  w.id = "vx"; w.className = "vx"; w.hidden = true; w.setAttribute("role","dialog"); w.setAttribute("aria-modal","true");
  document.body.appendChild(w);
  w.addEventListener("click", e => { const a = e.target.closest("[data-vx]"); if(a) vxAct(a.dataset.vx, a); });
  w.addEventListener("submit", e => { e.preventDefault(); const i = w.querySelector("#vxText"); const v = (i && i.value || "").trim(); if(v){ i.value = ""; vxSend(v); } });
  setInterval(()=>{ const fab = document.getElementById("fab"); b.hidden = !(fab && !fab.hidden && S.screen==="app") || VX.open; b.setAttribute("aria-label", t("vxTitle")); }, 600);
})();

function vxRender(){
  const w = document.getElementById("vx"); if(!w) return;
  const st = VX.state, listening = st==="listening", thinking = st==="thinking";
  const saveRows = VX.rows.filter(r=>r.kind!=="ask");
  const rows = VX.rows.length ? `<div class="vx-rows">${VX.rows.map((r,i)=>`
      <label class="vx-row ${r.ok?"":"bad"}"><input type="checkbox" data-vx="tog" data-i="${i}" ${r.on?"checked":""} ${r.ok&&r.kind!=="ask"?"":"disabled hidden"}>
        <span class="vx-k">${esc(r.tag)}</span><span class="vx-l">${r.label}</span>${r.note?`<span class="sub">${esc(r.note)}</span>`:""}</label>`).join("")}</div>` : "";
  const sub = listening ? t("vxListening") : thinking ? t("vxThinking") : (!VX.reply && !VX.heard) ? t("vxHint") : "";
  w.innerHTML = `<div class="vx-card">
    <div class="vx-top"><button type="button" class="iconbtn" data-vx="mute" aria-label="${vxMuted()?t("vxUnmute"):t("vxMute")}">${icon(vxMuted()?"volx":"vol")}</button>
      <b>${t("vxTitle")}</b><button type="button" class="iconbtn" data-vx="close" aria-label="${t("close")}">${icon("x")}</button></div>
    <button type="button" class="vx-orb ${listening?"on":""} ${thinking?"busy":""}" data-vx="mic" aria-label="${listening?t("vxTapStop"):t("vxTitle")}">${thinking?'<span class="spin"></span>':icon("mic")}</button>
    <p class="vx-sub" aria-live="polite">${sub}${listening?` · <span class="sub">${t("vxTapStop")}</span>`:""}</p>
    ${VX.turns.length ? `<div class="vx-chat" id="vxChat">${VX.turns.slice(-8).map(x=>`<p class="vx-b ${x.me?"me":"dx"}">${esc(x.text)}</p>`).join("")}${listening && VX.heard ? `<p class="vx-b me live">${esc(VX.heard)}</p>` : ""}</div>`
      : (listening && VX.heard ? `<p class="vx-heard">«${esc(VX.heard)}»</p>` : `<p class="vx-ex sub">${t("vxEx")}</p>`)}
    ${rows}
    ${saveRows.some(r=>r.ok) && (st==="review" || (st==="listening" && VX.prev==="review")) ? `<div class="two"><button type="button" class="btn primary" data-vx="confirm">${icon("check")}${t("vxConfirm")}</button><button type="button" class="btn" data-vx="reset">${t("vxCancel")}</button></div>` : ""}
    ${st==="done" || (st==="review" && !saveRows.some(r=>r.ok)) ? `<button type="button" class="btn" data-vx="mic">${icon("mic")}${t("vxAgain")}</button>` : ""}
    <form class="vx-type" autocomplete="off"><label class="sub" for="vxText">${t("vxType")}</label>
      <div class="vx-tr"><input id="vxText" type="text" maxlength="400" placeholder="${t("vxTypePh")}" ${thinking?"disabled":""}><button type="submit" class="btn" ${thinking?"disabled":""}>${icon("send")}<span class="sr">${t("vxSend")}</span></button></div></form>
  </div>`;
  const ch = document.getElementById("vxChat"); if(ch) ch.scrollTop = ch.scrollHeight;
}
function vxTurn(me, text){ if(!text) return; VX.turns.push({me, text}); VX.hist.push({role: me ? "user" : "assistant", text}); if(VX.hist.length>12) VX.hist = VX.hist.slice(-12); }

function vxOpen(){
  VX.open = true; VX.state = "idle"; VX.rows = []; VX.reply = ""; VX.heard = ""; VX.turns = []; VX.hist = []; VX.misses = 0;
  try{ (window.dtrack||function(){})("voice_open"); }catch(e){}
  vxUnlockAudio();
  document.getElementById("vx").hidden = false; document.body.classList.add("vx-open");
  vxRender();
  if(window.DEMO_MODE){ VX.reply = t("vxDemo"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); return; }
  if(vxSR()) vxListen();
}
function vxClose(){
  vxStopListening(); try{ speechSynthesis.cancel(); }catch(e){} if(VX.audio){ try{ VX.audio.pause(); }catch(e){} }
  VX.open = false; document.getElementById("vx").hidden = true; document.body.classList.remove("vx-open");
}
/* iOS only lets a page play sound it started from a tap: start a silent sound on the tap, reuse the player later */
function vxUnlockAudio(){
  try{ if(!VX.audio){ VX.audio = new Audio(); VX.audio.preload = "auto"; }
    VX.audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; const p = VX.audio.play(); if(p && p.catch) p.catch(()=>{}); }catch(e){}
}

function vxListen(){
  const SR = vxSR(); if(!SR){ const i = document.getElementById("vxText"); if(i) i.focus(); return; }
  vxStopListening();
  const r = new SR(); VX.rec = r;
  r.lang = LANG==="en" ? "en-US" : "ar-JO"; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
  let finalText = "";
  r.onresult = e => { let s = ""; finalText = ""; for(let k=0;k<e.results.length;k++){ s += e.results[k][0].transcript; if(e.results[k].isFinal) finalText += e.results[k][0].transcript; } VX.heard = s.trim(); vxRender(); };
  const back = VX.state==="review" ? "review" : "idle";
  r.onerror = e => { VX.rec = null; if(e && (e.error==="not-allowed" || e.error==="service-not-allowed")){ VX.hands = false; VX.reply = t("vxNoMic"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); } };
  r.onend = () => { if(VX.rec!==r) return; VX.rec = null; const txt = (finalText || VX.heard || "").trim();
    if(txt && VX.state==="listening"){ VX.misses = 0; vxSend(txt); }
    else if(VX.state==="listening"){ VX.misses++; VX.state = back; vxRender(); } };
  VX.prev = back; VX.state = "listening"; VX.heard = ""; vxRender();
  try{ r.start(); }catch(e){ VX.state = "idle"; vxRender(); }
}
function vxStopListening(){ if(VX.rec){ const r = VX.rec; try{ r.stop(); }catch(e){} } }

async function vxCall(body){
  const { data } = await sb.auth.getSession(); const tok = data && data.session && data.session.access_token;
  if(!tok) throw new Error("auth");
  return fetch(`${C.SUPABASE_URL}/functions/v1/voice`, { method:"POST", headers:{ apikey:C.SUPABASE_ANON_KEY, Authorization:"Bearer "+tok, "Content-Type":"application/json" }, body:JSON.stringify(body) });
}
function vxContext(){
  const u = vxDefaultUnit(), un = u && unitById(u);
  return { today:today(), lang:LANG, currency:curName(),
    units: activeUnits().slice(0,40).map(x=>({id:x.id, name:x.name})),
    staff: S.staff.filter(s=>s.active!==false).slice(0,80).map(s=>({id:s.id, name:s.name})),
    items: (S.items||[]).filter(i=>!i.service && !i.archived).slice(0,150).map(i=>({id:i.id, name:i.name})),
    cats: { exp: unitCats(un,"exp").map(p=>({id:p[0], label:cat(p)})), inc: unitCats(un,"inc").map(p=>({id:p[0], label:cat(p)})) } };
}
async function vxSend(text){
  if(VX.busy) return; vxStopListening();
  const pending = (VX.prev==="review" || VX.state==="review") && VX.rows.some(r=>r.kind!=="ask" && r.ok && r.on);
  const clean = String(text).trim().replace(/[.!؟?،,]+$/,"");
  vxTurn(true, clean); VX.heard = "";
  if(pending && VX_YES.test(clean) && clean.split(/\s+/).length<=4) return vxConfirm();
  if(pending && VX_NO.test(clean) && clean.split(/\s+/).length<=4){ VX.rows = []; VX.reply = t("vxCancelled"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); vxSay(VX.reply); return; }
  if(VX_BYE.test(clean) && clean.split(/\s+/).length<=4){ VX.rows = []; VX.reply = t("vxBye"); vxTurn(false, VX.reply); VX.state = "done"; VX.hands = false; vxRender(); await vxSay(VX.reply); return; }
  VX.busy = true; VX.state = "thinking"; VX.reply = ""; VX.rows = []; vxRender();
  try{
    (window.dtrack||function(){})("voice_ask");
    const r = await vxCall({ mode:"ask", text:clean, ctx:vxContext(), history:VX.hist.slice(0,-1).slice(-6) });
    const j = await r.json().catch(()=>({}));
    if(!r.ok){ VX.reply = j.err==="limit" ? t("vxLimit") : j.err==="not_ready" ? t("vxNotReady") : t("vxNet"); vxTurn(false, VX.reply); VX.hands = VX.hands && j.err!=="limit" && j.err!=="not_ready"; VX.state = "done"; vxRender(); return; }
    VX.rows = (j.actions||[]).map(vxRow).filter(Boolean);
    const asks = VX.rows.filter(x=>x.kind==="ask"), saves = VX.rows.filter(x=>x.kind!=="ask" && x.ok);
    VX.reply = asks.length && !saves.length ? asks.map(a=>a.answer).join(" ") : (j.reply || (VX.rows.length ? "" : t("vxNothing")));
    if(!VX.rows.length && !j.reply) VX.reply = t("vxNothing");
    vxTurn(false, VX.reply);
    VX.state = saves.length ? "review" : "done"; vxRender(); VX.busy = false; vxSay(VX.reply);
  }catch(e){ VX.reply = t("vxNet"); vxTurn(false, VX.reply); VX.state = "done"; vxRender(); }
  finally{ VX.busy = false; }
}

/* ---------- turning one understood action into a row the owner can check */
function vxDefaultUnit(){
  if(S.view==="unit" && unitById(S.uid) && unitById(S.uid).status!=="closed") return S.uid;
  const a = activeUnits(); return a.length ? a[0].id : "";
}
const vxDate = d => validDate(d) ? d : today();
const vxDateTxt = d => d===today() ? "" : ` · ${d}`;
function vxRow(a){
  if(!a || typeof a!=="object") return null;
  const amt = Math.round(num(a.amount)*1000)/1000, date = vxDate(a.date);
  const multi = activeUnits().length > 1;
  const unitId = (a.unit && unitById(a.unit) && unitById(a.unit).status!=="closed") ? a.unit : vxDefaultUnit();
  const uname = multi && unitById(unitId) ? ` · ${esc(unitById(unitId).name)}` : "";
  if(a.type==="expense" || a.type==="income"){
    const kind = a.type==="expense" ? "exp" : "inc", u = unitById(unitId), list = unitCats(u, kind);
    const category = list.some(p=>p[0]===a.category) ? a.category : (list[list.length-1]||[""])[0];
    const desc = String(a.desc||"").slice(0,160);
    return { kind:a.type, on:amt>0, ok:amt>0, tag:t(kind==="exp"?"vxExp":"vxInc"),
      label:`${esc(desc || catLabel(category))} · <b class="num">${esc(moneyTxt(amt))}</b>${uname}${vxDateTxt(date)}`, note: amt>0 ? "" : t("vxNoAmount"),
      run: async () => { let uid = unitId; if(!unitById(uid) && typeof ensureFirstUnit==="function"){ await ensureFirstUnit(); uid = vxDefaultUnit(); } if(!unitById(uid)) return false;
        const base = {createdAt:Date.now(), unitId:uid, category, amount:amt, date, time:"", payBy:"cash", files:[], voice:true};
        return save(kind==="exp"?"expenses":"income", null, kind==="exp" ? {...base, item:desc, supplier:"", invNo:""} : {...base, note:desc}, true); } };
  }
  if(a.type==="stock"){
    const q = Math.round(num(a.qty)*1000)/1000, mode = ["in","out","count"].includes(a.mode) ? a.mode : "in";
    const items = (S.items||[]).filter(i=>!i.service);
    const it = items.find(i=>i.id===a.item_id) || items.find(i=>vxNorm(i.name)===vxNorm(a.item)) || items.find(i=>vxNorm(a.item) && (vxNorm(i.name).includes(vxNorm(a.item)) || vxNorm(a.item).includes(vxNorm(i.name))));
    const name = it ? it.name : String(a.item||"").slice(0,120);
    const ok = !!name && (mode==="count" ? q>=0 : q>0);
    const tag = mode==="count" ? t("vxStockCount") : mode==="out" ? t("vxStockOut") : t("vxStockIn");
    return { kind:"stock", on:ok, ok, tag, label:`${esc(name)} · <b class="num">${fmt(q)}</b>${it?"":` <span class="sub">(${t("vxNewItem")})</span>`}`,
      run: async () => {
        let item = it;
        if(!item){ const id = newId(); const d = {name, price:0, cost:0, tax:0, unit:"", openQty: mode==="out" ? 0 : q, openDate:date, createdAt:Date.now()};
          if(!await save("items", id, d, true)) return false; if(mode!=="out") return true; item = {...d, id}; }
        const now = qtyOf(item.id, MAIN_STORE);
        const data = mode==="count" ? {type:"count", itemId:item.id, qty:Math.round((q-now)*1000)/1000, storeId:MAIN_STORE, counted:q} : {type:"adjust", itemId:item.id, qty: mode==="out" ? -q : q, storeId:MAIN_STORE};
        if(mode==="count" && !data.qty) return true;
        return save("stockmoves", null, {...data, date, note:"", createdAt:Date.now(), voice:true}, true); } };
  }
  if(a.type==="advance"){
    const s = staffById((a.staff_ids||[])[0]);
    const ok = !!s && amt>0;
    return { kind:"advance", on:ok, ok, tag:t("vxAdv"), label:`${esc(s ? s.name : "؟")} · <b class="num">${esc(moneyTxt(amt))}</b>${vxDateTxt(date)}`, note: !s ? t("vxNoStaff") : amt>0 ? "" : t("vxNoAmount"),
      run: () => save("payments", null, {createdAt:Date.now(), staffId:s.id, unitId:s.unitId||unitId, kind:"advance", amount:amt, date, note:String(a.desc||"").slice(0,160), voice:true}, true) };
  }
  if(a.type==="attendance"){
    const act = S.staff.filter(s=>s.active!==false);
    const list = a.all_staff ? act : (a.staff_ids||[]).map(staffById).filter(s=>s && s.active!==false);
    const st = a.status==="absent" ? "absent" : "present";
    return { kind:"attendance", on:list.length>0, ok:list.length>0, tag:t("vxAtt"),
      label:`${a.all_staff ? t("vxAll") : esc(list.map(s=>s.name).join("، ") || "؟")} · ${t(st==="absent"?"vxAbsent":"vxPresent")}${vxDateTxt(date)}`, note: list.length ? "" : t("vxNoStaff"),
      run: async () => { let ok = true; for(const s of list){ ok = (await attSave(s.id, date, st)) && ok; } return ok; } };
  }
  if(a.type==="ask"){
    const td = today(); const per = a.period || "month";
    const [x, y] = per==="today" ? [td, td] : per==="week" ? [iso(new Date(parseD(td).getTime()-6*864e5)), td] : per==="last_month" ? [addMonths(monthStartOf(td),-1), monthEnd(addMonths(monthStartOf(td),-1))] : [monthStartOf(td), td];
    const T = companyTotals(x, y), pl = t({today:"vxToday", week:"vxWeek", month:"vxMonth", last_month:"vxLastMonth"}[per]||"vxMonth");
    const m = a.metric || "profit";
    const val = m==="expenses" ? T.exp+T.lab : m==="income" ? T.inc : m==="salaries" ? T.lab : T.profit;
    const head = t({profit:"vxProfit", expenses:"vxSpent", income:"vxEarned", salaries:"vxWages"}[m]||"vxProfit");
    const answer = m==="profit" ? `${head} ${pl}: ${moneyTxt(Math.round(val))}. ${t("vxEarned")} ${moneyTxt(Math.round(T.inc))}، ${t("vxSpent")} ${moneyTxt(Math.round(T.exp+T.lab))}.` : `${head} ${pl}: ${moneyTxt(Math.round(val))}.`;
    return { kind:"ask", on:false, ok:true, tag:head, label:`<b class="num">${esc(moneyTxt(Math.round(val)))}</b> · ${esc(pl)}`, answer };
  }
  return null;
}

async function vxConfirm(){
  if(VX.busy) return; VX.busy = true;
  const todo = VX.rows.filter(r=>r.kind!=="ask" && r.ok && r.on);
  let n = 0;
  for(const r of todo){ try{ if(await r.run()) n++; }catch(e){} }
  VX.busy = false;
  try{ (window.dtrack||function(){})("voice_saved"); }catch(e){}
  render();
  VX.rows = []; VX.reply = n ? t("vxSaved") : t("eSave"); vxTurn(false, VX.reply); VX.state = "done"; vxRender();
  if(n){ toast(t("vxSavedN",{n})); try{ navigator.vibrate && navigator.vibrate(12); }catch(e){} } vxSay(VX.reply);
}

function vxAct(a, el){
  if(a==="close") return vxClose();
  if(a==="mic"){ vxUnlockAudio(); VX.hands = true; VX.misses = 0; if(VX.state==="listening"){ VX.hands = false; return vxStopListening(); } if(window.DEMO_MODE) return; if(vxSR()) return vxListen(); const i = document.getElementById("vxText"); if(i) i.focus(); return; }
  if(a==="tog"){ const r = VX.rows[Number(el.dataset.i)]; if(r) r.on = el.checked; return; }
  if(a==="confirm") return vxConfirm();
  if(a==="reset"){ VX.rows = []; VX.reply = t("vxCancelled"); vxTurn(false, VX.reply); VX.heard = ""; VX.state = "done"; vxRender(); vxSay(VX.reply); return; }
  if(a==="mute"){ try{ localStorage.setItem("vxMute", vxMuted() ? "0" : "1"); }catch(e){} if(vxMuted()){ try{ speechSynthesis.cancel(); }catch(e){} if(VX.audio) try{ VX.audio.pause(); }catch(e){} } vxRender(); }
}

/* ---------- speaking: the human voice from the server, the phone's own voice if that fails */
async function vxSay(text){
  await vxSpeak(text);
  if(VX.open && VX.hands && vxSR() && !VX.busy && VX.misses < 2 && (VX.state==="review" || VX.state==="done") && !window.DEMO_MODE) vxListen();
}
async function vxSpeak(text){
  if(!text || vxMuted() || !VX.open) return;
  try{
    if(window.DEMO_MODE) throw 0;
    const r = await vxCall({ mode:"tts", text });
    if(!r.ok) throw 0;
    const blob = await r.blob(); if(!blob.size) throw 0;
    if(!VX.open || vxMuted()) return;
    const url = URL.createObjectURL(blob); const au = VX.audio || (VX.audio = new Audio());
    au.src = url;
    await new Promise(res => { const done = () => { au.onended = au.onerror = null; URL.revokeObjectURL(url); res(); };
      au.onended = done; au.onerror = done; const p = au.play(); if(p && p.catch) p.catch(done); setTimeout(done, 20000); });
  }catch(e){ await vxSpeakLocal(text); }
}
function vxSpeakLocal(text){
  return new Promise(res => { try{
    if(!("speechSynthesis" in window)) return res();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text), lang = LANG==="en" ? "en" : "ar";
    const v = speechSynthesis.getVoices().find(x=>x.lang && x.lang.toLowerCase().startsWith(lang));
    if(v) u.voice = v; u.lang = v ? v.lang : (lang==="ar" ? "ar-SA" : "en-US"); u.rate = 1;
    u.onend = u.onerror = () => res(); setTimeout(res, 15000);
    speechSynthesis.speak(u);
  }catch(e){ res(); } });
}
document.addEventListener("keydown", e => { if(e.key==="Escape" && VX.open) vxClose(); });
