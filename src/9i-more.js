/* =====================================================================
   1. Loyalty points: customers earn points on what they buy and spend
      them as a discount at the cashier.
   2. Appointments: clinics, salons, workshops, trainers. A day view,
      clash warnings, WhatsApp reminders, and "done" turns into an invoice.
   3. Selling without internet: if the connection drops, sales, receipts
      and new customers are kept on the device and sent when it's back.
   ===================================================================== */
Object.assign(L, {
  // loyalty
  loy:["نقاط الولاء","Loyalty points"], loySub:["الزبون بيجمع نقاط على مشترياته، وبيستخدمها خصم عند الكاشير.","Customers earn points on purchases and spend them as a discount at the till."],
  loyOn:["شغّل نقاط الولاء","Turn on loyalty points"], loyPer:["نقاط لكل 1 {c}","Points per 1 {c}"], loyVal:["قيمة النقطة ({c})","Value of one point ({c})"], loyMin:["أقل عدد نقاط للاستخدام","Minimum points to redeem"],
  loyEx:["مثال: زبون اشترى بـ 50 بياخد {p} نقطة = خصم {v} على مشترياته الجاية.","Example: a 50 purchase earns {p} points = {v} off next time."],
  loyBal:["نقاطه: {n} (= {v})","Points: {n} (= {v})"], loyUse:["استخدم {n} نقطة · خصم {v}","Use {n} points · {v} off"], loyUsed:["خصم نقاط: {v}","Points discount: {v}"], loyCancel:["بلاش خصم النقاط","Don't use points"],
  loyEarned:["كسب {n} نقطة على هالفاتورة","Earned {n} points on this invoice"], loySaved:["تمام، نقاط الولاء شغّالة","Loyalty points are on"], loyOff:["وقّف نقاط الولاء","Turn off loyalty points"],
  // appointments
  ap:["المواعيد","Appointments"], apNew:["موعد جديد","New appointment"], apWho:["الزبون","Customer"], apWhoName:["اسم الزبون","Customer name"], apPhone:["رقم الزبون","Customer phone"],
  apSvc:["الخدمة","Service"], apSvcPh:["كشفية، قص شعر، صيانة…","Check-up, haircut, service…"], apTime:["الساعة","Time"], apDur:["المدة (دقيقة)","Length (minutes)"], apWith:["مع مين؟","With whom?"], apAny:["أي حدا","Anyone"],
  apPrice:["السعر","Price"], apNote:["ملاحظة","Note"], apSaved:["انحجز الموعد","Appointment booked"], apNone:["ما في مواعيد بهاليوم.","No appointments this day."],
  apDone:["خلص · اعمل فاتورة","Done · make invoice"], apNoShow:["ما إجا","No-show"], apCancel:["إلغاء الموعد","Cancel"], apRemind:["ذكّره واتساب","Remind on WhatsApp"],
  apSt_booked:["محجوز","Booked"], apSt_done:["خلص","Done"], apSt_noshow:["ما إجا","No-show"], apSt_cancel:["ملغي","Cancelled"],
  apClash:["انتبه: في موعد ثاني بنفس الوقت ({x})","Heads up: clashes with another appointment ({x})"], apToday:["مواعيد اليوم: {n}","Today's appointments: {n}"], apNext:["الجاي: {x} الساعة {t}","Next: {x} at {t}"],
  apWa:["مرحبا {p}،\nتذكير بموعدك عند {co} يوم {d} الساعة {t}{s}.\nإذا بدك تغيّر الموعد احكيلنا. شكراً","Hello {p},\nA reminder of your appointment at {co} on {d} at {t}{s}.\nLet us know if you need to change it. Thank you"],
  apNeedName:["اكتب اسم الزبون","Enter the customer's name"], apNeedDb:["المواعيد بدها تحديث بسيط بقاعدة البيانات. احكي مع الدعم.","Appointments need a small database update. Contact support."],
  // offline
  obSaved:["ما في إنترنت. انحفظت على الجهاز، وبتنرفع لحالها لما يرجع النت.","No internet. Saved on this device; it will upload when you're back online."],
  obPending:["{n} بانتظار النت","{n} waiting for internet"], obSent:["رجع النت، وانرفع كل اللي كان محفوظ ({n})","Back online, uploaded {n} saved items"],
});
ICON.star = '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>';
if(!COLS.includes("appointments")){ COLS.push("appointments"); S.appointments = S.appointments || []; }

/* ===================== 1. loyalty ===================== */
const LOY = () => { const l = (COMPANY && COMPANY.settings && COMPANY.settings.loyalty) || {}; return {on:!!l.on, per:num(l.per)||1, value:num(l.value)||0.01, min:Math.max(0, num(l.min))}; };
/* points: earned on every live sale (on the amount before tax), returned on sale returns, spent when redeemed */
function loyPoints(pid){
  const p = partyById(pid); if(!p || p.walkIn || !LOY().on) return 0;
  const per = LOY().per; let pts = 0;
  liveInv().filter(x=>x.partyId===pid).forEach(x=>{ const net = invCalc(x).net;
    if(x.type==="sale") pts += Math.floor(net*per) - num(x.redeem); else if(x.type==="saleReturn") pts -= Math.floor(net*per); });
  return Math.max(0, pts);
}
const loyEarnedOn = x => x.type==="sale" && LOY().on && !(partyById(x.partyId)||{}).walkIn ? Math.floor(invCalc(x).net*LOY().per) : 0;
/* what the cashier's "use points" button is worth on this sale (checked again at payment time) */
function loyRedeemFor(pos){
  if(!pos || !pos.redeem || !LOY().on || !pos.partyId) return {discount:0, redeem:0};
  const l = LOY(), net = invCalc({lines:pos.lines, incTax:ST().incTax}).net, pts = Math.min(pos.redeem, loyPoints(pos.partyId), Math.floor(net/l.value));
  return pts>0 ? {discount:r2(pts*l.value), redeem:pts} : {discount:0, redeem:0};
}
function loySheet(){
  if(ROLE!=="owner"){ toast(t("onlyOwner")); return; }
  const l = LOY(), c = curName();
  openSheet({title:t("loy"), saveLabel:t("save"), html:`<p class="sub">${t("loySub")}</p>`,
    fields:[{name:"on",label:t("loyOn"),type:"chips",options:[["1",t("yes")],["0",t("no")]],value:l.on?"1":"0"},
      {name:"per",label:t("loyPer",{c}),type:"money",value:String(l.per)},{name:"value",label:t("loyVal",{c}),type:"money",value:String(l.value),hint:t("loyEx",{p:Math.floor(50*l.per), v:moneyTxt(Math.floor(50*l.per)*l.value)})},
      {name:"min",label:t("loyMin"),type:"money",value:String(l.min||0)}],
    submit: async v=>{ const loyalty = {on:v.on==="1", per:Math.max(0.01, Math.min(100, num(v.per)||1)), value:Math.max(0.0001, Math.min(100, num(v.value)||0.01)), min:Math.max(0, num(v.min))};
      const ok = await applySettings({settings:{...(COMPANY.settings||{}), loyalty}}); if(ok) toast(t("loySaved")); return ok; }});
}
/* POS: offer the customer's points as a discount */
const _posRender0 = posRender;
posRender = function(){
  _posRender0();
  if(!POS || !LOY().on || !POS.partyId) return;
  const pts = loyPoints(POS.partyId), l = LOY(), box = document.querySelector("#sheetBody .kv"); if(!box) return;
  const total = invCalc({lines:POS.lines, incTax:ST().incTax}).net, maxPts = Math.min(pts, Math.floor(total/l.value)), val = r2(maxPts*l.value);
  let h = `<div class="loy-line">${icon("star")}<span>${t("loyBal",{n:`<b class="num">${fmt(pts)}</b>`, v:money(pts*l.value)})}</span></div>`;
  if(POS.redeem) h += `<div class="loy-line"><span class="pos">${t("loyUsed",{v:money(r2(POS.redeem*l.value))})}</span><button type="button" class="linkbtn" data-act="loyRedeem" data-id="0">${t("loyCancel")}</button></div>`;
  else if(maxPts>0 && pts>=l.min && POS.lines.length) h += `<button type="button" class="btn sm" data-act="loyRedeem" data-id="${maxPts}">${icon("star")}${t("loyUse",{n:fmt(maxPts), v:moneyTxt(val)})}</button>`;
  box.insertAdjacentHTML("beforebegin", h);
  if(POS.redeem){ const c = invCalc({lines:POS.lines, incTax:ST().incTax, discount:r2(POS.redeem*l.value)}), tot = document.querySelector("#sheetBody .total b"); if(tot) tot.innerHTML = money(c.total);
    document.querySelectorAll('#sheetBody [data-act="posPay"][data-id="cash"]').forEach(b=>b.innerHTML = `${icon("wallet")}${t("cash")} · ${fmt(c.total)}`); }
};
/* ===================== 2. appointments ===================== */
const AP_ST = ["booked","done","noshow","cancel"];
const apOn = d => S.appointments.filter(a=>a.date===d && a.status!=="cancel").sort((a,b)=>String(a.time).localeCompare(String(b.time)));
const apName = a => (a.partyId && partyById(a.partyId) ? partyById(a.partyId).name : a.name) || "";
const apPhone = a => (a.partyId && partyById(a.partyId) ? partyById(a.partyId).phone : a.phone) || "";
const apEnd = a => (mins(a.time)||0) + Math.max(5, num(a.dur)||30);
function apClash(a, ignoreId){
  return S.appointments.find(b=>b.id!==ignoreId && b.date===a.date && b.status!=="cancel" && b.status!=="noshow" && (!a.staffId || !b.staffId || a.staffId===b.staffId)
    && (mins(a.time)||0) < apEnd(b) && (mins(b.time)||0) < apEnd(a));
}
function apSheet(date){
  S.apDate = date || S.apDate || today();
  const d = S.apDate, list = S.appointments.filter(a=>a.date===d).sort((a,b)=>String(a.time).localeCompare(String(b.time)));
  const row = a => `<div class="row static ap-row ${a.status!=="booked"?"ap-"+a.status:""}"><span class="ap-t num ltr">${esc(a.time||"")}</span>
    <div class="m"><b>${esc(apName(a))}</b><span class="sub">${esc(a.svc||"")}${a.staffId&&staffById(a.staffId)?" · "+esc(staffById(a.staffId).name):""}${num(a.price)?" · "+money(num(a.price)):""}</span></div>
    <div class="col end"><span class="pill ${a.status==="done"?"good":a.status==="booked"?"":"bad"}">${t("apSt_"+a.status)}</span>
    ${a.status==="booked"?`<div class="ap-acts"><button type="button" class="linkbtn" data-act="apDone" data-id="${esc(a.id)}">${t("apDone")}</button><button type="button" class="linkbtn" data-act="apWa" data-id="${esc(a.id)}">${t("apRemind")}</button><button type="button" class="linkbtn" data-act="apEdit" data-id="${esc(a.id)}">${t("edit")}</button></div>`:""}</div></div>`;
  openSheet({title:t("ap"), noSave:true, html:`<div class="daybar"><button type="button" class="iconbtn" data-act="apDay" data-id="1" aria-label="+1">${icon("chevE")}</button><b>${fdate(d)}</b><button type="button" class="iconbtn" data-act="apDay" data-id="-1" aria-label="-1">${icon("chevS")}</button></div>
    <button type="button" class="btn primary" data-act="apNew">${icon("plus")}${t("apNew")}</button>
    ${list.length ? `<div class="list">${list.map(row).join("")}</div>` : `<span class="hint">${t("apNone")}</span>`}`});
}
function apForm(a){
  const custs = S.parties.filter(p=>!p.archived && !p.walkIn && p.kind!=="supplier").sort((x,y)=>String(x.name).localeCompare(String(y.name)));
  const staff = S.staff.filter(s=>s.active!==false);
  openSheet({title: a ? t("edit") : t("apNew"), saveLabel: a ? t("save") : t("apNew"),
    fields:[...(custs.length?[{name:"partyId",label:t("apWho"),type:"select",options:[["",t("apWhoName")+" ↓"],...custs.map(p=>[p.id,p.name])],value:a?.partyId||""}]:[]),
      {name:"name",label:t("apWhoName"),value:a?.name||"",max:80},{name:"phone",label:t("apPhone"),type:"tel",value:a?.phone||"",max:30},
      {name:"svc",label:t("apSvc"),value:a?.svc||"",max:80,ph:t("apSvcPh")},
      {name:"date",label:t("date"),type:"date",value:a?.date||S.apDate||today()},{name:"time",label:t("apTime"),type:"time",value:a?.time||"10:00"},
      {name:"price",label:t("apPrice"),type:"money",value:a?.price||""}],
    more:[{name:"dur",label:t("apDur"),type:"chips",options:[["15","15"],["30","30"],["45","45"],["60","60"],["90","90"],["120","120"]],value:String(a?.dur||30)},
      ...(staff.length?[{name:"staffId",label:t("apWith"),type:"select",options:[["",t("apAny")],...staff.map(s=>[s.id,s.name])],value:a?.staffId||""}]:[]),
      {name:"note",label:t("apNote"),value:a?.note||"",max:160}],
    del: a ? {label:t("apCancel"), run:()=>save("appointments", a.id, {...strip(a), status:"cancel"})} : null,
    submit: async v=>{
      const pid = partyById(v.partyId) ? v.partyId : "";
      if(!pid && !v.name){ toast(t("apNeedName")); return false; }
      const data = {...(a?strip(a):{createdAt:Date.now(), status:"booked"}), partyId:pid, name:(v.name||"").slice(0,80), phone:(v.phone||"").slice(0,30), svc:(v.svc||"").slice(0,80),
        date:validDate(v.date)?v.date:today(), time:mins(v.time)!=null?v.time:"10:00", dur:Math.max(5, Math.min(600, parseInt(v.dur)||30)), staffId:staffById(v.staffId)?v.staffId:"", price:num(v.price), note:(v.note||"").slice(0,160)};
      const c = apClash(data, a?.id); if(c) toast(t("apClash",{x:`${apName(c)} ${c.time}`}));
      const ok = await save("appointments", a?.id || null, data, true);
      if(!ok){ toast(t("apNeedDb")); return false; }
      if(!c) toast(t("apSaved")); setTimeout(()=>apSheet(data.date), 30); return true; }});
}
function apHomeCard(){
  const list = apOn(today()).filter(a=>a.status==="booked"); if(!list.length) return "";
  const now = new Date().toTimeString().slice(0,5), next = list.find(a=>a.time>=now) || list[0];
  return `<button class="panel grow push-card ap-card" data-act="appts"><span class="tx-ic">${icon("calendar")}</span><div class="col"><b>${t("apToday",{n:list.length})}</b><span class="sub">${esc(t("apNext",{x:apName(next), t:next.time}))}</span></div></button>`;
}

/* ===================== 3. offline outbox ===================== */
const OUTBOX_COLS = ["invoices","vouchers","parties","appointments","expenses","income","attendance","payments"];
const obKey = () => "outbox_"+CID;
const obList = () => lsGet(obKey(), []);
const netDown = e => !navigator.onLine || /fetch|network|load failed|timeout|offline/i.test(String((e && (e.message||e.details)) || e || ""));
function outboxTake(col, id, data, err){
  if(!CID || !OUTBOX_COLS.includes(col) || !netDown(err)) return false;
  const q = obList().filter(x=>!(x.col===col && x.id===id)); q.push({col, id, data}); lsSet(obKey(), q.slice(-500));
  toast(t("obSaved")); obBadge(); return true;
}
let obBusy = false;
async function outboxFlush(){
  if(obBusy || !CID || !navigator.onLine) return; const q = obList(); if(!q.length){ obBadge(); return; }
  obBusy = true; let sent = 0;
  try{
    const { error } = await sb.from("records").upsert(q.map(x=>({company_id:CID, col:x.col, id:x.id, data:x.data})), {onConflict:"company_id,col,id"});
    if(!error){ sent = q.length; const rest = obList().filter(x=>!q.some(y=>y.col===x.col && y.id===x.id && JSON.stringify(y.data)===JSON.stringify(x.data))); lsSet(obKey(), rest); }
  }catch(e){} finally{ obBusy = false; }
  obBadge(); if(sent) toast(t("obSent",{n:sent}));
}
function obBadge(){
  const n = CID ? obList().length : 0; let el = document.getElementById("obBadge");
  if(!n){ if(el) el.remove(); return; }
  if(!el){ el = document.createElement("button"); el.id = "obBadge"; el.type = "button"; el.className = "ob-badge"; el.addEventListener("click", outboxFlush); document.body.appendChild(el); }
  el.textContent = t("obPending",{n});
}
/* a full reload must not hide what is still waiting on this device */
const _loadAllOb = loadAll;
loadAll = async function(){
  if(!navigator.onLine && S.ready) return false;   // keep working with what's on screen
  const ok = await _loadAllOb(); if(ok && CID) obList().forEach(x=>applyLocal(x.col, x.id, x.data)); obBadge(); return ok;
};
window.addEventListener("online", ()=>{ outboxFlush().then(()=>{ if(CID) loadAll().then(render); }); });
setInterval(()=>{ if(CID && navigator.onLine && obList().length) outboxFlush(); }, 30000);

/* ---------- entry points ---------- */
const _accountSheetM = accountSheet;
accountSheet = function(){
  _accountSheetM();
  const menu = document.querySelector("#sheetBody .menu"); if(!menu) return;
  const push = menu.querySelector('[data-act="push"]');
  const extra = `<button type="button" class="mi" data-act="appts">${icon("calendar")}${t("ap")}</button>${ROLE==="owner"?`<button type="button" class="mi" data-act="loySet">${icon("star")}${t("loy")}</button>`:""}`;
  if(push) push.insertAdjacentHTML("afterend", extra); else menu.insertAdjacentHTML("afterbegin", extra);
};
const _viewPartySheetM = viewPartySheet;
viewPartySheet = function(id){
  _viewPartySheetM(id); const p = partyById(id); if(!p || !LOY().on || p.kind==="supplier") return;
  const pts = loyPoints(id), owe = document.querySelector("#sheetBody .owe");
  if(owe) owe.insertAdjacentHTML("afterend", `<div class="loy-line">${icon("star")}<span>${t("loyBal",{n:`<b class="num">${fmt(pts)}</b>`, v:money(pts*LOY().value)})}</span></div>`);
};
const _viewInvSheetM = viewInvSheet;
viewInvSheet = function(id){
  _viewInvSheetM(id); const x = invById(id); if(!x) return; const n = loyEarnedOn(x);
  if(n>0){ const tot = document.querySelector("#sheetBody .total"); if(tot) tot.insertAdjacentHTML("afterend", `<div class="loy-line">${icon("star")}<span>${t("loyEarned",{n:fmt(n)})}${x.redeem?" · "+t("loyUsed",{v:money(num(x.discount))}):""}</span></div>`); }
};
Object.assign(A, {
  loySet: () => { closeSheet(); loySheet(); },
  loyRedeem: id => { if(!POS) return; POS.redeem = Number(id)||0; posRender(); },
  appts: () => { closeSheet(); apSheet(today()); },
  apDay: id => apSheet(addDays(S.apDate||today(), Number(id))),
  apNew: () => { closeSheet(); apForm(null); },
  apEdit: id => { const a = S.appointments.find(x=>x.id===id); if(a){ closeSheet(); apForm(a); } },
  apWa: id => { const a = S.appointments.find(x=>x.id===id); if(!a) return;
    openWaText(apPhone(a), t("apWa",{p:apName(a), co:COMPANY.name||"", d:fdate(a.date), t:a.time, s:a.svc?` (${a.svc})`:""})); },
  apDone: async id => { const a = S.appointments.find(x=>x.id===id); if(!a) return;
    if(!await save("appointments", id, {...strip(a), status:"done"}, true)) return;
    let pid = a.partyId; if(!pid){ pid = newId(); await save("parties", pid, {name:a.name, phone:a.phone||"", kind:"customer", openBal:0, createdAt:Date.now()}, true); await save("appointments", id, {...strip(S.appointments.find(x=>x.id===id)), partyId:pid}, true); }
    closeSheet(); invForm(null, {type:"sale", partyId:pid, lines:[{name:a.svc||t("ap"), qty:1, price:num(a.price)||"", tax:taxRate()}], notes:a.note||""}); },
  apNoShow: async id => { const a = S.appointments.find(x=>x.id===id); if(a && await save("appointments", id, {...strip(a), status:"noshow"}, true)) apSheet(a.date); },
});
document.addEventListener("change", e=>{
  // picking a customer fills the name and phone, so the reminder knows where to go
  if(e.target.id==="f_partyId" && document.getElementById("f_svc")){ const p = partyById(e.target.value); if(p){ const n = document.getElementById("f_name"), ph = document.getElementById("f_phone"); if(n) n.value = p.name; if(ph && p.phone) ph.value = p.phone; } }
  if(e.target.id==="posCust" && POS){ POS.redeem = 0; posRender(); }
});
