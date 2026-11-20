
/* =====================================================================
   v27
   - «ذكّره بلطف»: a polite WhatsApp reminder to a customer who owes, from their page,
     from the home card «إلك عند الناس», and right after a cheque bounces.
   - «صوّر» takes up to 10 papers at once and lists them to save together.
   - Bank statement or a screenshot of the bank app → every transaction, with the ones
     already in Daftar left unticked.
   - «سكّر الصندوق»: count the cash, Daftar says what should be there and the difference.
   - Thursday's notification opens «أسبوعك» and Daftar reads it out.
   - Home warns when a kind of spending runs well above its usual level this month.
   - Voice questions: «كم دفعت لأبو خالد من أول السنة؟», «قديش صرفت على البنزين؟».
   ===================================================================== */
Object.assign(L, {
  rmBtn:["ذكّره بلطف على الواتساب","Polite WhatsApp reminder"],
  rmTxt:["مرحبا {p}،\nتحية طيبة من {co}.\nحابين نذكّرك بلطف إنو الرصيد المستحق عندنا {x}.\nإذا بتحب نبعتلك كشف الحساب، احكيلنا.\nشكراً إلك.","Hello {p},\nKind regards from {co}.\nA gentle reminder that the balance due with us is {x}.\nTell us if you'd like a statement.\nThank you."],
  rmBounce:["مرحبا {p}،\nتحية من {co}.\nالشيك رقم {n} بقيمة {x} رجع من البنك.\nبنتمنى نرتب طريقة الدفع بأقرب وقت. شكراً إلك.","Hello {p},\nFrom {co}.\nCheque no. {n} for {x} was returned by the bank.\nWe'd like to arrange payment soon. Thank you."],
  rmBounceT:["الشيك رجع","The cheque bounced"], rmBounceQ:["بدك تبعت لـ {p} رسالة على الواتساب؟","Send {p} a WhatsApp message?"], rmLater:["بعدين","Later"],
  owT:["إلك عند الناس","Owed to you"], owAll:["كل الزباين","All customers"], owRemind:["ذكّره","Remind"],
  spT:["انتبه للمصاريف","Spending alert"], spTxt:["صرفك على {c} هالشهر أعلى من العادي بـ {p}%","{c} is {p}% above your usual this month"], spSub:["لهلأ {x} · العادي لهاي الفترة تقريباً {u}","So far {x} · usual for this point about {u}"],
  bsBtn:["صوّر كذا ورقة مرة وحدة","Snap several at once"], bsBtnSub:["لحد 10 وصولات أو فواتير أو شيكات","Up to 10 receipts, bills or cheques"],
  bkBtn:["كشف البنك أو صورة من تطبيق البنك","Bank statement or bank app screenshot"],
  bsT:["الأوراق اللي صوّرتها","Your papers"], bsMore:["صوّر كمان","Snap another"], bsGal:["زيد من الصور","Add from photos"],
  bsWait:["بالدور…","Waiting…"], bsRead:["عم بقرأ…","Reading…"], bsFail:["ما انقرأت","Couldn't read"], bsNoAmt:["ما في مبلغ","No amount"],
  bsExp:["مصروف","Expense"], bsInc:["دخل","Income"], bsChIn:["شيك وصلني","Cheque in"], bsChOut:["شيك كتبته","Cheque out"],
  bsFlip:["اعكس","Flip"], bsSave:["سجّل {n}","Save {n}"], bsSaved:["انسجّل {n}","{n} saved"], bsNone:["ما في إشي جاهز للتسجيل.","Nothing ready to save."],
  bsMax:["10 أوراق بالمرة كحد أقصى.","10 papers at a time at most."], bsUnit:["على أي {unit}؟","Which {unit}?"], bsBusy:["استنى لحتى أخلص قراءة.","Wait until reading is done."],
  bkT:["كشف البنك","Bank statement"], bkSub:["صوّر صفحات الكشف، أو خذ لقطة شاشة من تطبيق البنك (لحد 5 صور). دفتر بيطلّع كل حركة، واللي مسجّلها قبل ما بيعلّم عليها.","Snap the statement pages or screenshot your bank app (up to 5). Daftar lists every transaction and leaves the ones you already have unticked."],
  bkPick:["اختار الصور","Choose images"], bkReading:["عم بقرأ الصفحة {i} من {n}…","Reading page {i} of {n}…"],
  bkFound:["{n} حركة · طلع {o} · دخل {i}","{n} transactions · out {o} · in {i}"], bkDup:["مسجّلة قبل؟","Already in?"],
  bkNone:["ما لقيت حركات بهاي الصور. صوّر الكشف نفسه أو قائمة الحركات بالتطبيق.","No transactions found. Snap the statement itself or the app's transactions list."],
  bkNote:["من كشف البنك","From bank statement"], bkMax:["5 صور كحد أقصى.","5 images at most."],
  ccTile:["سكّر الصندوق","Close the till"], ccTileSub:["عدّ الكاش","Count the cash"], ccT:["سكّر الصندوق","Close the till"],
  ccExp:["المفروض يكون معك كاش","Cash you should have"], ccExpSub:["من كل الكاش اللي دخل وطلع مسجّل بدفتر","From all cash in and out recorded in Daftar"],
  ccCount:["كم عدّيت؟","How much did you count?"], ccOk:["مزبوط، الصندوق مطابق","Spot on, the till matches"], ccShort:["في نقص {x}","Short by {x}"], ccOver:["في زيادة {x}","Over by {x}"],
  ccDone:["تمام، سكّرت","Done, closed"], ccFix:["سجّل الفرق","Record the difference"], ccFirst:["أول مرة بتعدّ الصندوق بدفتر؟ إذا الفرق هو الكاش اللي كان معك من قبل، سجّله رصيد بداية.","First count in Daftar? If the difference is cash you had before, record it as the opening balance."],
  ccOpen:["سجّله رصيد بداية","Record as opening balance"], ccOpenNote:["رصيد الصندوق الافتتاحي","Opening cash balance"],
  ccNeg:["بالسالب لأنو المصاريف الكاش المسجّلة أكثر من الكاش اللي دخل. غالباً الكاش اللي كان معك أول ما بلشت مش مسجّل.","Negative because recorded cash spending is more than cash in. Usually the cash you started with isn't recorded."],
  ccShortCat:["عجز صندوق","Cash shortage"], ccOverCat:["زيادة صندوق","Cash surplus"], ccClosed:["سكّرت الصندوق: {x}","Till closed: {x}"], ccLast:["آخر مرة: {d} · {x}","Last: {d} · {x}"],
  wkT:["أسبوعك","Your week"], wkTop:["أكثر إشي صرفت عليه {c} بـ {x}.","Most spent on {c}: {x}."], wkOwe:["أكثر حدا عليه إلك {p} بـ {x}.","{p} owes you the most: {x}."],
  wkChq:["وعندك {n} شيك بيستحق هالأسبوع الجاي بـ {x}.","{n} cheques due next week: {x}."],
  vxTot:["المجموع","Total"], vxTotPaid:["{per} دفعت لـ {p} {x}{c}.","{per} you paid {p} {x}{c}."], vxTotGot:["{per} قبضت من {p} {x}{c}.","{per} {p} paid you {x}{c}."],
  vxTotSold:["{per} بعت لـ {p} بـ {x}{c}.","{per} you sold {p} {x}{c}."], vxTotBought:["{per} اشتريت من {p} بـ {x}{c}.","{per} you bought {x} from {p}{c}."],
  vxTotSpent:["{per} صرفت على {k} {x}{c}.","{per} you spent {x} on {k}{c}."], vxTotEarned:["{per} دخلك من {k} {x}{c}.","{per} {k} brought in {x}{c}."],
  vxTotCnt:[" ({n} مرات)"," ({n} times)"], vxTotNoP:["مش لاقي هالاسم بالزباين والموردين.","I can't find that name among your customers and suppliers."],
  vxPYear:["من أول السنة","Since January"], vxPAll:["من الأول","Overall"], vxPYest:["مبارح","Yesterday"],
});

/* ---------- small helpers ---------- */
const v27Co = () => (COMPANY && COMPANY.name) || "";
function v27Range(per){
  const td = today();
  if(per==="today") return [td, td];
  if(per==="yesterday"){ const y = addDays(td,-1); return [y, y]; }
  if(per==="week") return [addDays(td,-6), td];
  if(per==="last_month"){ const m = addMonths(monthStartOf(td),-1); return [m, monthEnd(m)]; }
  if(per==="year") return [td.slice(0,4)+"-01-01", td];
  if(per==="all") return ["0000-01-01", "9999-12-31"];
  return [monthStartOf(td), td];
}
const v27PerTxt = per => t({today:"vxToday", yesterday:"vxPYest", week:"vxWeek", month:"vxMonth", last_month:"vxLastMonth", year:"vxPYear", all:"vxPAll"}[per]||"vxMonth");
const v27Unit = () => { const u = S.view==="unit" && S.uid ? unitById(S.uid) : null; return (u && u.status!=="closed") ? u : (activeUnits()[0] || null); };
function v27Cat(u, kind, want){
  const list = unitCats(u, kind) || []; if(!list.length) return want || "أخرى";
  if(want && list.some(p=>p[0]===want)) return want;
  const o = list.find(p=>p[0]==="أخرى" || p[1]==="Other"); return (o || list[list.length-1])[0];
}

/* ---------- 1. a polite reminder to a customer who owes ---------- */
function rmText(p, bal){ return t("rmTxt",{p:p.name, co:v27Co(), x:moneyTxt(Math.round(Math.abs(bal)*1000)/1000)}); }
Object.assign(A, {
  pRemind: id => { const p = partyById(id); if(!p) return; (window.dtrack||function(){})("remind_wa"); openWaText(p.phone, rmText(p, partyBal(id))); },
  owAll: () => { closeSheet(); S.view = "money"; S.btab = "parties"; S.pfilter = "customer"; scrollTo(0,0); render(); },
});
{ const _vps = viewPartySheet; viewPartySheet = function(id){
    const r = _vps.apply(this, arguments);
    try{ const p = partyById(id), b = partyBal(id), owe = document.querySelector("#sheetBody .owe");
      if(p && owe && p.kind!=="supplier" && b>0.005 && !document.querySelector("#sheetBody .rm-btn"))
        owe.insertAdjacentHTML("afterend", `<button type="button" class="btn rm-btn" data-act="pRemind" data-id="${esc(id)}">${icon("send")}${t("rmBtn")}</button>`);
    }catch(e){}
    return r; }; }
// a cheque from a customer bounced → offer the message right away
{ const _cs = chSet; chSet = async function(id, st){
    const r = await _cs.apply(this, arguments);
    try{ const c = S.cheques.find(x=>x.id===id), p = c && partyById(c.partyId);
      if(st==="bounced" && c && c.dir==="in" && p){
        const txt = t("rmBounce",{p:p.name, co:v27Co(), n:c.no||"", x:moneyTxt(num(c.amount))});
        window.__rmBounce = {phone:p.phone, txt};
        setTimeout(()=>openSheet({ title:t("rmBounceT"), noSave:true, html:`<p class="sub">${t("rmBounceQ",{p:esc(p.name)})}</p><div class="rm-prev">${esc(txt).replace(/\n/g,"<br>")}</div>
          <div class="two"><button type="button" class="btn primary big" data-act="rmBounceGo">${icon("send")}${t("rmBtn")}</button><button type="button" class="btn big" data-act="closeSheet">${t("rmLater")}</button></div>` }), 350);
      }
    }catch(e){}
    return r; }; }
Object.assign(A, { rmBounceGo: () => { const x = window.__rmBounce; if(x) openWaText(x.phone, x.txt); closeSheet(); } });

/* ---------- 2. spending alert (same rule as Thursday's notification) ---------- */
function spikeNow(){
  const td = today(), ym = td.slice(0,7), day = Number(td.slice(8,10)); if(day < 7) return null;
  const prev = [1,2,3].map(k=>addMonths(monthStartOf(td),-k).slice(0,7));
  const now = {}, base = {}, cnt = {}; let all = 0;
  (S.expenses||[]).forEach(x=>{ const d = String(x.date||""), c = x.category, a = num(x.amount); if(!c) return;
    if(d.slice(0,7)===ym && d<=td){ now[c] = (now[c]||0)+a; cnt[c] = (cnt[c]||0)+1; }
    else if(prev.includes(d.slice(0,7))){ base[c] = (base[c]||0)+a/3; all += a/3; } });
  const dim = Number(monthEnd(monthStartOf(td)).slice(8,10)), part = day/dim;
  let best = null;
  Object.keys(now).forEach(c=>{ const usual = (base[c]||0)*part; if(usual<=0 || (cnt[c]||0)<2) return;
    const pct = Math.round((now[c]/usual-1)*100);
    if(pct>=40 && now[c]-usual >= all*part*0.05 && (!best || pct>best.pct)) best = {cat:c, pct:Math.min(pct,500), now:now[c], usual}; });
  return best;
}
function owedTop(){
  return (S.parties||[]).filter(p=>!p.archived && !p.walkIn && p.kind!=="supplier").map(p=>[p, partyBal(p.id)]).filter(([,b])=>b>0.005).sort((a,b)=>b[1]-a[1]);
}
{ const _top = dsHomeTop; dsHomeTop = function(){
    let h = _top.apply(this, arguments);
    let add = "";
    try{
      const sp = spikeNow();
      if(sp) add += `<button type="button" class="panel ds-spike" data-act="go" data-id="money"><span class="ds-si">${icon("alert")}</span><span class="m"><b>${esc(t("spTxt",{c:catLabel(sp.cat), p:sp.pct}))}</b><span class="sub">${esc(t("spSub",{x:moneyTxt(Math.round(sp.now)), u:moneyTxt(Math.round(sp.usual))}))}</span></span></button>`;
      const ow = owedTop();
      if(ow.length){ const tot = ow.reduce((s,[,b])=>s+b,0);
        add += `<div class="panel ds-owed"><div class="ds-rh"><b>${t("owT")} · <span class="num">${money(tot)}</span></b><button type="button" class="linkbtn" data-act="owAll">${t("owAll")}</button></div>
          <div class="list">${ow.slice(0,3).map(([p,b])=>`<div class="row ds-ow"><button type="button" class="m" data-act="viewParty" data-id="${esc(p.id)}"><b>${esc(p.name)}</b><span class="sub due">${money(b)}</span></button><button type="button" class="btn sm" data-act="pRemind" data-id="${esc(p.id)}">${icon("send")}${t("owRemind")}</button></div>`).join("")}</div></div>`; }
    }catch(e){}
    if(!add) return h;
    const k = h.indexOf('<div class="panel ds-recent">');
    return k<0 ? h + add : h.slice(0,k) + add + h.slice(k);
  }; }

/* ---------- 3. voice questions: totals for a person or a kind of spending ---------- */
function v27Total(a){
  const per = a.period || (a.party ? "all" : "month"), [x, y] = v27Range(per), inR = d => d>=x && d<=y;
  const pre = v27PerTxt(per);
  const cntTxt = n => n>1 ? t("vxTotCnt",{n}) : "";
  if(a.party || ["paid_to","received_from","sold_to","bought_from"].includes(a.flow)){
    const p = vxParty(a);
    if(!p) return { kind:"ask", on:false, ok:true, tag:t("vxTot"), label:esc(String(a.party||"")), answer:t("vxTotNoP") };
    let flow = a.flow; if(!["paid_to","received_from","sold_to","bought_from"].includes(flow)) flow = p.kind==="supplier" ? "paid_to" : "received_from";
    let list;
    if(flow==="paid_to" || flow==="received_from"){ const ty = flow==="paid_to" ? "payment" : "receipt"; list = (S.vouchers||[]).filter(v=>!v.void && v.partyId===p.id && v.type===ty && inR(v.date||"")).map(v=>num(v.amount)); }
    else { const ty = flow==="sold_to" ? "sale" : "purchase"; list = (S.invoices||[]).filter(v=>!v.void && v.partyId===p.id && v.type===ty && inR(v.date||"")).map(v=>invCalc(v).total); }
    const tot = list.reduce((s,v)=>s+v,0), key = {paid_to:"vxTotPaid", received_from:"vxTotGot", sold_to:"vxTotSold", bought_from:"vxTotBought"}[flow];
    const answer = t(key,{per:pre, p:p.name, x:moneyTxt(Math.round(tot*1000)/1000), c:cntTxt(list.length)});
    return { kind:"ask", on:false, ok:true, tag:t("vxTot"), label:`${esc(p.name)} · <b class="num">${esc(moneyTxt(Math.round(tot)))}</b> · ${esc(pre)}`, answer };
  }
  const earned = a.flow==="earned", src = earned ? (S.income||[]) : (S.expenses||[]);
  const want = vxNorm(a.category||""), wd = vxNorm(a.desc||a.item||"");
  const hit = r => { const c = vxNorm(r.category||""), cl = vxNorm(catLabel(r.category||"")), it = vxNorm([r.item, r.note, r.supplier].filter(Boolean).join(" "));
    return (want && (c===want || cl===want || cl.includes(want) || (c && want.includes(c)))) || (wd && (it.includes(wd) || cl.includes(wd) || c===wd)); };
  const rows = src.filter(r=>inR(r.date||"") && (!want && !wd ? true : hit(r)));
  const tot = rows.reduce((s,r)=>s+num(r.amount),0), k = a.category ? catLabel(a.category) : (a.desc || a.item || (earned ? t("income") : t("expenses")));
  const answer = t(earned?"vxTotEarned":"vxTotSpent",{per:pre, k, x:moneyTxt(Math.round(tot*1000)/1000), c:cntTxt(rows.length)});
  return { kind:"ask", on:false, ok:true, tag:t("vxTot"), label:`${esc(k)} · <b class="num">${esc(moneyTxt(Math.round(tot)))}</b> · ${esc(pre)}`, answer };
}
function v27Week(r){
  try{
    const td = today(), x = addDays(td,-6), byCat = {};
    (S.expenses||[]).filter(e=>e.date>=x && e.date<=td).forEach(e=>{ byCat[e.category] = (byCat[e.category]||0)+num(e.amount); });
    const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0], ow = owedTop()[0], sp = spikeNow();
    const nx = addDays(td,7), ch = (S.cheques||[]).filter(c=>c.dir==="in" && ["pending","deposited"].includes(c.status||"pending") && c.dueDate>td && c.dueDate<=nx);
    const more = [top && top[1]>0 ? t("wkTop",{c:catLabel(top[0]), x:moneyTxt(Math.round(top[1]))}) : "", ow ? t("wkOwe",{p:ow[0].name, x:moneyTxt(Math.round(ow[1]))}) : "",
      ch.length ? t("wkChq",{n:ch.length, x:moneyTxt(Math.round(ch.reduce((s,c)=>s+num(c.amount),0)))}) : "", sp ? t("spTxt",{c:catLabel(sp.cat), p:sp.pct})+"." : ""].filter(Boolean);
    if(more.length) r.answer = r.answer + " " + more.join(" ");
  }catch(e){}
  return r;
}
{ const _row = vxRow; vxRow = function(a){
    if(a && a.type==="ask" && a.metric==="total") return v27Total(a);
    const r = _row.apply(this, arguments);
    if(r && a && a.type==="ask" && a.metric==="summary" && a.period==="week") return v27Week(r);
    return r; }; }

/* ---------- 4. Thursday's notification → «أسبوعك», read out ---------- */
let WK_GO = false;
(function(){ try{ const q = new URLSearchParams(location.search); if(q.has("week")){ WK_GO = true; q.delete("week"); const s = q.toString(); history.replaceState(null, "", location.pathname + (s ? "?"+s : "") + location.hash); } }catch(e){} })();
function wkRun(){
  if(!WK_GO || typeof S==="undefined" || S.screen!=="app" || !S.ready) return;
  WK_GO = false;
  setTimeout(()=>{ try{ vxOpen(); vxStopListening(false); vxTurn(true, t("wkT")); vxApply({ actions:[{type:"ask", metric:"summary", period:"week"}], reply:"" }); }catch(e){} }, 450);
}
{ const _render = render; render = function(){ const r = _render.apply(this, arguments); try{ wkRun(); }catch(e){} return r; }; }
try{ navigator.serviceWorker && navigator.serviceWorker.addEventListener("message", e => { const d = e.data || {};
  if(d.type==="daftar-open" && typeof d.url==="string"){ try{ if(new URL(d.url, location.origin).searchParams.has("week")){ WK_GO = true; wkRun(); } }catch(x){} } }); }catch(e){}

/* ---------- 5. «صوّر» several papers, and bank statements ---------- */
{ const _pick = phPickSheet; phPickSheet = function(){
    _pick.apply(this, arguments);
    const box = document.querySelector("#sheetBody .ph-pick"); if(!box) return;
    box.insertAdjacentHTML("beforeend", `<div class="ph-more">
      <label class="btn big ph-multi">${icon("grid")}<span><b>${t("bsBtn")}</b><small>${t("bsBtnSub")}</small></span><input type="file" id="bsPick" accept="image/*" multiple hidden></label>
      <button type="button" class="btn big ph-bank" data-act="bkOpen">${icon("bank")}<span><b>${t("bkBtn")}</b></span></button></div>`);
  }; }
const BS = { items:[], uid:"", busy:0 };
const b64of = blob => new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(String(f.result).split(",")[1]||""); f.onerror = rej; f.readAsDataURL(blob); });
function bsRec(j){
  const k = j.kind;
  if(k==="cheque" && j.cheque){ const c = j.cheque, out = c.dir==="out";
    return { type: out?"chOut":"chIn", amount:num(c.amount ?? j.total), date:j.date||today(), due:c.due_date||"", who:(out ? c.payee : (c.drawer||c.payee)) || j.merchant || "", no:c.number||"", bank:c.bank||"" }; }
  if(k==="sales_invoice") return { type:"inc", amount:num(j.total), date:j.date||today(), who:j.buyer||j.merchant||"" };
  if(k==="receipt" || k==="supplier_invoice") return { type:"exp", amount:num(j.total), date:j.date||today(), who:j.seller||j.merchant||"", category:j.category||"" };
  return null;
}
async function bsAdd(files){
  const list = [...files].filter(f=>/^image\//.test(f.type||"image/"));
  for(const f of list){
    if(BS.items.length >= 10){ toast(t("bsMax")); break; }
    const blob = await shrinkImage(f); if(!blob) continue;
    BS.items.push({ id:newId(), blob, url:URL.createObjectURL(blob), st:"wait", on:false, rec:null, j:null });
  }
  bsSheet(); bsPump();
}
function bsPump(){
  while(BS.busy < 2){
    const it = BS.items.find(x=>x.st==="wait"); if(!it) break;
    it.st = "read"; BS.busy++; bsDraw();
    (async()=>{
      try{
        const ctl = new AbortController(); const to = setTimeout(()=>ctl.abort(), 45000);
        const r = await vxCall({ mode:"photo", image:await b64of(it.blob), ctx:vxContext() }, ctl.signal); clearTimeout(to);
        const j = await r.json().catch(()=>null);
        if(!r.ok || !j){ it.st = "fail"; if(j && j.err==="limit") toast(t("vxLimit")); }
        else { it.j = j; it.rec = bsRec(j); it.st = it.rec && it.rec.amount>0 ? "ok" : "fail"; it.on = it.st==="ok"; }
      }catch(e){ it.st = "fail"; }
      BS.busy--; bsDraw(); bsPump();
    })();
  }
}
const BS_T = {exp:"bsExp", inc:"bsInc", chIn:"bsChIn", chOut:"bsChOut"};
function bsUnitPick(needUnit){
  const us = activeUnits(); if(!needUnit || us.length<2) return "";
  return `<div class="field"><span class="flabel">${tv("bsUnit")}</span><div class="pc-row">${us.map(u=>`<button type="button" class="pc-c ${BS.uid===u.id?"on":""}" data-act="bsUnit" data-id="${esc(u.id)}" aria-pressed="${BS.uid===u.id}"><b>${esc(u.name)}</b></button>`).join("")}</div></div>`;
}
function bsDraw(){
  const el = document.getElementById("bs"); if(!el) return;
  const ready = BS.items.filter(x=>x.st==="ok" && x.on), reading = BS.items.some(x=>x.st==="wait"||x.st==="read");
  const needUnit = BS.items.some(x=>x.rec && (x.rec.type==="exp"||x.rec.type==="inc"));
  el.innerHTML = `${bsUnitPick(needUnit)}<div class="bs-list">${BS.items.map(x=>{ const r = x.rec;
      const st = x.st==="wait" ? t("bsWait") : x.st==="read" ? t("bsRead") : x.st==="fail" ? (x.j ? t("bsNoAmt") : t("bsFail")) : "";
      return `<div class="bs-i ${x.st} ${x.on?"on":""}"><img src="${x.url}" alt="">
        <div class="m">${r && x.st==="ok" ? `<b>${esc(t(BS_T[r.type]))}${r.who?` · ${esc(r.who)}`:""}</b><span class="num">${esc(moneyTxt(r.amount))}</span><span class="sub">${fdate(r.date)}${r.no?` · ${t("cheque")} <span class="num">${esc(r.no)}</span>`:""}</span>` : `<b>${esc(st)}</b>${x.st==="read"?'<span class="bs-spin"></span>':""}`}</div>
        ${x.st==="ok" ? `<div class="bs-c"><button type="button" class="linkbtn bs-flip" data-act="bsFlip" data-id="${x.id}">${t("bsFlip")}</button><button type="button" class="bs-tick ${x.on?"on":""}" data-act="bsTog" data-id="${x.id}" aria-pressed="${x.on}" aria-label="${esc(t("bsSave",{n:1}))}">${icon("check")}</button></div>` : ""}</div>`; }).join("")}</div>
    <div class="two"><label class="btn">${icon("camera")}${t("bsMore")}<input type="file" id="bsCam" accept="image/*" capture="environment" hidden></label><label class="btn">${icon("file")}${t("bsGal")}<input type="file" id="bsPick2" accept="image/*" multiple hidden></label></div>
    <button type="button" class="btn primary big" data-act="bsSave" ${ready.length && !reading ? "" : "disabled"}>${icon("check")}${t("bsSave",{n:ready.length})}</button>`;
}
function bsSheet(){
  if(document.getElementById("bs")) return bsDraw();
  if(!BS.uid || !unitById(BS.uid)) BS.uid = (v27Unit()||{}).id || "";
  openSheet({ title:t("bsT"), noSave:true, html:`<div id="bs" class="bs"></div>` }); bsDraw();
}
document.addEventListener("change", e => { const el = e.target; if(!el || !el.files || !el.files.length) return;
  if(el.id==="bsPick"){ if(window.DEMO_MODE){ closeSheet(); toast(t("phDemo")); return; } BS.items.forEach(x=>URL.revokeObjectURL(x.url)); BS.items = []; closeSheet(); setTimeout(()=>bsAdd(el.files), 60); }
  else if(el.id==="bsCam" || el.id==="bsPick2") bsAdd(el.files);
  else if(el.id==="bkPick" || el.id==="bkCam") bkGo(el.files);
});
async function bsSaveOne(x, u){
  const r = x.rec, note = "";
  if(r.type==="exp" || r.type==="inc"){
    if(!u) return false;
    let files = [];
    try{ FILES.begin([]); FILES.add.push({blob:x.blob, type:"image/jpeg", name:"photo-"+r.date+".jpg", size:x.blob.size, url:""}); files = (await FILES.commit()) || []; FILES.add = []; }catch(e){ files = []; }
    const base = {unitId:u.id, amount:Math.round(r.amount*1000)/1000, date:r.date, payBy:"cash", files, createdAt:Date.now(), snap:true};
    return r.type==="exp" ? save("expenses", null, {...base, category:v27Cat(u,"exp",r.category), item:String(r.who||"").slice(0,80), supplier:String(r.who||"").slice(0,80)}, true)
      : save("income", null, {...base, category:v27Cat(u,"inc",""), note:String(r.who||"").slice(0,80)}, true);
  }
  const type = r.type==="chOut" ? "payment" : "receipt", side = type==="receipt" ? "sale" : "purchase";
  const p = vxParty({party:r.who}, side), pid = await vxEnsureParty(p, r.who, side); if(!pid) return false;
  return saveVoucher({type, partyId:pid, amount:Math.round(r.amount*1000)/1000, date:r.date, method:"cheque", chNo:String(r.no||"").slice(0,30), chBank:String(r.bank||"").slice(0,40), chDue:/^\d{4}-\d{2}-\d{2}$/.test(r.due)?r.due:r.date, note}, true);
}
Object.assign(A, {
  bsTog: id => { const x = BS.items.find(i=>i.id===id); if(x){ x.on = !x.on; bsDraw(); } },
  bsFlip: id => { const x = BS.items.find(i=>i.id===id); if(x && x.rec){ x.rec.type = {exp:"inc", inc:"exp", chIn:"chOut", chOut:"chIn"}[x.rec.type]; bsDraw(); } },
  bsUnit: id => { BS.uid = id; bsDraw(); },
  bsSave: async () => {
    if(BS.items.some(x=>x.st==="wait"||x.st==="read")){ toast(t("bsBusy")); return; }
    const go = BS.items.filter(x=>x.st==="ok" && x.on); if(!go.length){ toast(t("bsNone")); return; }
    const u = unitById(BS.uid) || v27Unit();
    if(go.some(x=>x.rec.type==="exp"||x.rec.type==="inc") && !u){ toast(tv("phNoUnit")); return; }
    const btn = document.querySelector('#bs [data-act="bsSave"]'); if(btn) btn.disabled = true;
    let n = 0; for(const x of go){ if(await bsSaveOne(x, u)){ n++; x.on = false; x.st = "saved"; } }
    (window.dtrack||function(){})("snap_batch");
    closeSheet(); toast(t("bsSaved",{n})); BS.items.forEach(x=>URL.revokeObjectURL(x.url)); BS.items = []; render();
  },
});

/* bank statement */
const BK = { rows:[], uid:"", info:"" };
Object.assign(A, {
  bkOpen: () => { if(window.DEMO_MODE){ closeSheet(); toast(t("phDemo")); return; }
    closeSheet(); setTimeout(()=>openSheet({ title:t("bkT"), noSave:true, html:`<div class="ph-pick"><p class="sub">${t("bkSub")}</p>
      <label class="btn primary big">${icon("file")}${t("bkPick")}<input type="file" id="bkPick" accept="image/*" multiple hidden></label>
      <label class="btn big">${icon("camera")}${t("phCam")}<input type="file" id="bkCam" accept="image/*" capture="environment" hidden></label></div>` }), 80); },
});
function bkDup(r){
  const near = d => d && r.date && Math.abs(parseD(d) - parseD(r.date)) <= 3*864e5;
  const same = a => Math.abs(num(a) - r.amount) < 0.001;
  if(r.dir==="out") return (S.expenses||[]).some(x=>same(x.amount)&&near(x.date)) || (S.vouchers||[]).some(v=>!v.void&&v.type==="payment"&&same(v.amount)&&near(v.date)) || (S.payments||[]).some(p=>same(p.amount)&&near(p.date));
  return (S.income||[]).some(x=>same(x.amount)&&near(x.date)) || (S.vouchers||[]).some(v=>!v.void&&v.type==="receipt"&&same(v.amount)&&near(v.date));
}
async function bkGo(files){
  const list = [...files].filter(f=>/^image\//.test(f.type||"image/")).slice(0,5); if(files.length>5) toast(t("bkMax"));
  if(!list.length) return;
  BK.rows = []; BK.uid = (v27Unit()||{}).id || ""; BK.info = "";
  const seen = new Set();
  for(let i=0;i<list.length;i++){
    openSheet({ title:t("bkT"), noSave:true, html:`<div class="ph-read"><span class="ph-scan"></span><p class="sub">${t("bkReading",{i:i+1, n:list.length})}</p></div>` });
    try{
      const blob = await shrinkImage(list[i]); if(!blob) continue;
      const ctl = new AbortController(); const to = setTimeout(()=>ctl.abort(), 60000);
      const r = await vxCall({ mode:"statement", image:await b64of(blob), ctx:vxContext() }, ctl.signal); clearTimeout(to);
      const j = await r.json().catch(()=>null);
      if(!r.ok || !j){ if(j && j.err==="limit"){ toast(t("vxLimit")); break; } continue; }
      if(j.flags && j.flags.includes("other_currency")) BK.info = t("phFl_other_currency",{c:j.currency, m:ST().currency});
      (j.rows||[]).forEach(x=>{ const k = [x.date, x.dir, x.amount, x.desc].join("|"); if(seen.has(k)) return; seen.add(k);
        const row = { id:newId(), date:/^\d{4}-\d{2}-\d{2}$/.test(x.date)?x.date:today(), desc:String(x.desc||"").slice(0,80), dir:x.dir==="in"?"in":"out", amount:num(x.amount), category:x.category||"" };
        if(row.amount<=0) return; row.dup = bkDup(row); row.on = !row.dup; BK.rows.push(row); });
    }catch(e){}
  }
  (window.dtrack||function(){})("bank_statement");
  if(!BK.rows.length){ closeSheet(); toast(t("bkNone")); return; }
  BK.rows.sort((a,b)=>a.date.localeCompare(b.date));
  openSheet({ title:t("bkT"), noSave:true, html:`<div id="bk" class="bs"></div>` }); bkDraw();
}
function bkDraw(){
  const el = document.getElementById("bk"); if(!el) return;
  const on = BK.rows.filter(r=>r.on), o = on.filter(r=>r.dir==="out").reduce((s,r)=>s+r.amount,0), i = on.filter(r=>r.dir==="in").reduce((s,r)=>s+r.amount,0);
  const us = activeUnits();
  el.innerHTML = `<p class="sub">${t("bkFound",{n:BK.rows.length, o:esc(moneyTxt(o)), i:esc(moneyTxt(i))})}</p>${BK.info?`<div class="alert warn">${icon("alert")}<span>${esc(BK.info)}</span></div>`:""}
    ${us.length>1?`<div class="field"><span class="flabel">${tv("bsUnit")}</span><div class="pc-row">${us.map(u=>`<button type="button" class="pc-c ${BK.uid===u.id?"on":""}" data-act="bkUnit" data-id="${esc(u.id)}" aria-pressed="${BK.uid===u.id}"><b>${esc(u.name)}</b></button>`).join("")}</div></div>`:""}
    <div class="bk-list">${BK.rows.map(r=>`<button type="button" class="bk-r ${r.on?"on":""}" data-act="bkTog" data-id="${r.id}" aria-pressed="${r.on}">
      <span class="bs-tick ${r.on?"on":""}">${icon("check")}</span>
      <span class="m"><b>${esc(r.desc||t(r.dir==="out"?"bsExp":"bsInc"))}</b><span class="sub">${fdate(r.date)}${r.dir==="out"&&r.category?` · ${esc(catLabel(r.category))}`:""}${r.dup?` · <span class="warnv">${t("bkDup")}</span>`:""}</span></span>
      <b class="num ${r.dir==="in"?"pos":""}">${r.dir==="in"?"+":"−"}${esc(fmt(r.amount))}</b></button>`).join("")}</div>
    <button type="button" class="btn primary big" data-act="bkSave" ${on.length?"":"disabled"}>${icon("check")}${t("bsSave",{n:on.length})}</button>`;
}
Object.assign(A, {
  bkTog: id => { const r = BK.rows.find(x=>x.id===id); if(r){ r.on = !r.on; bkDraw(); } },
  bkUnit: id => { BK.uid = id; bkDraw(); },
  bkSave: async () => {
    const go = BK.rows.filter(r=>r.on); if(!go.length) return;
    const u = unitById(BK.uid) || v27Unit(); if(!u){ toast(tv("phNoUnit")); return; }
    const btn = document.querySelector('#bk [data-act="bkSave"]'); if(btn) btn.disabled = true;
    let n = 0;
    for(const r of go){
      const base = {unitId:u.id, amount:Math.round(r.amount*1000)/1000, date:r.date, payBy:"transfer", files:[], createdAt:Date.now()+n, bank:true};
      const ok = r.dir==="out" ? await save("expenses", null, {...base, category:v27Cat(u,"exp",r.category), item:r.desc || t("bkNote"), supplier:""}, true)
        : await save("income", null, {...base, category:v27Cat(u,"inc",""), note:r.desc || t("bkNote")}, true);
      if(ok){ n++; r.on = false; }
    }
    closeSheet(); toast(t("bsSaved",{n})); BK.rows = []; render();
  },
});

/* ---------- 6. «سكّر الصندوق» ---------- */
const ccKey = () => "cashClose_" + (typeof CID!=="undefined" ? CID : "");
function cashExpected(){ try{ const b = balances(null, today())["11"] || {dr:0, cr:0}; return Math.round((num(b.dr) - num(b.cr))*1000)/1000; }catch(e){ return 0; } }
const CC = { exp:0, got:null };
function ccSheet(){
  CC.exp = cashExpected(); CC.got = null;
  const last = lsGet(ccKey(), null);
  openSheet({ title:t("ccT"), noSave:true, html:`<div class="cc">
    <div class="owe"><span class="label">${t("ccExp")}</span><b>${money(CC.exp)}</b><span class="sub">${CC.exp<-0.001?t("ccNeg"):t("ccExpSub")}</span></div>
    ${last && last.date ? `<span class="sub">${esc(t("ccLast",{d:fdate(last.date).replace(/<[^>]+>/g,""), x:moneyTxt(num(last.counted))}))}</span>` : ""}
    <label class="field"><span class="flabel">${t("ccCount")}</span><input id="ccAmt" class="input big num" inputmode="decimal" autocomplete="off" placeholder="0"></label>
    <div id="ccRes" class="cc-res" aria-live="polite"></div></div>` });
  setTimeout(()=>{ const i = document.getElementById("ccAmt"); if(i) i.focus(); }, 250);
}
function ccDraw(){
  const el = document.getElementById("ccRes"); if(!el) return;
  if(CC.got===null){ el.innerHTML = ""; return; }
  const d = Math.round((CC.got - CC.exp)*1000)/1000, first = !lsGet(ccKey(), null) && !(S.journals||[]).some(j=>j.cashOpen);
  const msg = Math.abs(d)<0.001 ? `<div class="alert info cc-ok">${icon("check")}<span><b>${t("ccOk")}</b></span></div>`
    : `<div class="alert warn">${icon("alert")}<span><b>${esc(t(d<0?"ccShort":"ccOver",{x:moneyTxt(Math.abs(d))}))}</b>${first?`<br><span class="sub">${t("ccFirst")}</span>`:""}</span></div>`;
  el.innerHTML = msg + `<div class="${Math.abs(d)<0.001?"":"two"}">${Math.abs(d)<0.001?"":(first?`<button type="button" class="btn" data-act="ccOpenBal">${t("ccOpen")}</button>`:`<button type="button" class="btn" data-act="ccFix">${t("ccFix")}</button>`)}
    <button type="button" class="btn primary big" data-act="ccDone">${icon("check")}${t("ccDone")}</button></div>`;
}
document.addEventListener("input", e => { if(e.target && e.target.id==="ccAmt"){ const v = String(toEn(e.target.value||"")).replace(/[^\d.]/g,""); CC.got = v==="" ? null : num(v); ccDraw(); } });
Object.assign(A, {
  qCash: () => { closeSheet(); setTimeout(ccSheet, 80); },
  ccDone: () => { if(CC.got===null) return; lsSet(ccKey(), {date:today(), counted:CC.got, expected:CC.exp}); (window.dtrack||function(){})("cash_close"); closeSheet(); toast(t("ccClosed",{x:moneyTxt(CC.got)})); },
  ccFix: async () => {
    const d = Math.round((CC.got - CC.exp)*1000)/1000; if(Math.abs(d)<0.001) return;
    const u = v27Unit(); if(!u){ toast(tv("phNoUnit")); return; }
    const base = {unitId:u.id, amount:Math.abs(d), date:today(), payBy:"cash", files:[], createdAt:Date.now(), cashClose:true};
    const ok = d<0 ? await save("expenses", null, {...base, category:v27Cat(u,"exp",""), item:t("ccShortCat"), supplier:""}, true)
      : await save("income", null, {...base, category:v27Cat(u,"inc",""), note:t("ccOverCat")}, true);
    if(ok){ CC.exp = cashExpected(); A.ccDone(); render(); }
  },
  ccOpenBal: async () => {
    const d = Math.round((CC.got - CC.exp)*1000)/1000; if(Math.abs(d)<0.001) return;
    const lines = d>0 ? [{acc:"11", dr:d, cr:0, note:""},{acc:"33", dr:0, cr:d, note:""}] : [{acc:"33", dr:-d, cr:0, note:""},{acc:"11", dr:0, cr:-d, note:""}];
    const ok = await save("journals", null, {createdAt:Date.now(), date:today(), note:t("ccOpenNote"), lines, cashOpen:true}, true);
    if(ok){ CC.exp = cashExpected(); A.ccDone(); render(); }
  },
});
{ const _qs = quickSheet; quickSheet = function(){ _qs.apply(this, arguments);
    const g = document.querySelector("#sheetBody .qgrid"); if(!g || g.querySelector(".q-cash")) return;
    const after = g.querySelector(".q-staff") || g.querySelector(".q-snap");
    const b = `<button type="button" class="qtile q-cash" data-act="qCash">${icon("wallet")}<b>${esc(t("ccTile"))}</b><span>${esc(t("ccTileSub"))}</span></button>`;
    if(after) after.insertAdjacentHTML("afterend", b); else g.insertAdjacentHTML("afterbegin", b);
  }; }
