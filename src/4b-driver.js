/* ===== taxi & delivery: a driver's shift, trip by trip =====
   A "car" folder. Each trip is an income record {trip:true, category:<platform>, payBy:cash|card, tip, km, time}.
   A shift {startTime, endTime, startKm, endKm} per car per day gives km and hours, so the driver sees
   what he really keeps: per trip, per hour, per km — after fuel and the apps' commission.
   Cash trips: the driver holds the app's commission (he owes it). Card/app trips: the app owes him. */
const shiftOf = (uid, d) => S.shifts.find(x=>x.unitId===uid && x.date===d);
const nowHM = () => { const d = new Date(); return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); };
function tabShift(u){
  const d = S.date, isToday = d===today(), x = driverDay(u.id, d), sh = shiftOf(u.id, d);
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  let h = `<div class="daybar"><button class="iconbtn" data-act="day" data-id="-1" aria-label="${t("prevDay")}">${icon(prev)}</button>
    <div class="d"><b>${isToday?t("today")+" · ":""}${fdate(d)}</b>${isToday?"":`<button class="linkbtn" data-act="day" data-id="0">${t("backToday")}</button>`}</div>
    <button class="iconbtn" data-act="day" data-id="1" aria-label="${t("nextDay")}">${icon(next)}</button></div>`;
  // the big number: what you keep today
  h += `<div class="owe drv">${MARK}<span class="label">${isToday?t("drvKeepToday"):t("drvKeepDay")}</span><b class="${x.net<0?"negv":""}">${money(x.net)}</b>
    <span class="sub">${t("drvTripsN",{n:`<span class="num">${x.n}</span>`})}${x.hours?` · ${hrsTxt(x.hours)}`:""}${x.km?` · <span class="num">${fmt(x.km)}</span> ${t("km")}`:""}</span></div>`;
  // shift
  const kmRun = sh && num(sh.endKm) && num(sh.startKm) ? num(sh.endKm)-num(sh.startKm) : 0;
  const shiftLine = !sh || !sh.startTime ? t("drvNoShift") : [t("drvStarted",{x:t12(sh.startTime)}) + (sh.endTime ? " · "+t("drvEnded",{x:t12(sh.endTime)}) : ""),
    sh.startKm ? `${t("odo")}: <span class="num" dir="ltr">${fmt(num(sh.startKm))}${sh.endKm?" → "+fmt(num(sh.endKm)):""}</span>${kmRun?` (<span class="num">${fmt(kmRun)}</span> ${t("km")})`:""}` : ""].filter(Boolean).join("<br>");
  h += `<div class="panel"><div class="whead"><b>${icon("clock")}${t("drvShift")}</b><span class="sub">${shiftLine}</span></div>
    <div class="two">${!sh||!sh.startTime ? `<button class="btn primary" data-act="shiftStart">${icon("bolt")}${t("drvStart")}</button>` : !sh.endTime ? `<button class="btn" data-act="shiftEnd">${icon("check")}${t("drvEnd")}</button>` : `<span class="pill good self-start">${icon("check")}${t("drvDone")}</span>`}
    <button class="btn ghost" data-act="shiftEdit">${icon("gear")}${t("drvEditShift")}</button></div></div>`;
  // add a trip: one big button + platform shortcuts
  const pls = KP(u).platforms || [];
  h += `<div class="panel"><div class="whead"><b>${t("drvAddTrip")}</b></div><button class="btn primary big" data-act="newTrip">${icon("route")}${t("newTrip")}</button>
    <div class="chips-row">${pls.slice(0,6).map(p=>`<button class="chip-btn" data-act="tripOn" data-id="${esc(p[0])}">${esc(cat(p))}</button>`).join("")}</div></div>`;
  // numbers
  if(x.n || x.spend){
    h += `<div class="panel"><span class="label">${t("drvBreak")}</span><div class="kv">
      <div><span>${t("drvFares")}</span><b>${money(x.gross)}</b></div>
      ${x.tips?`<div><span>${t("drvTips")}</span><b class="pos">+ ${money(x.tips)}</b></div>`:""}
      ${x.comm?`<div><span>${t("drvComm")}</span><b class="negv">− ${money(x.comm)}</b></div>`:""}
      ${x.otherInc?`<div><span>${t("drvOtherInc")}</span><b class="pos">+ ${money(x.otherInc)}</b></div>`:""}
      <div><span>${t("drvSpend")}${x.fuel?` (${t("drvFuel")} ${fmt(x.fuel)})`:""}</span><b class="negv">− ${money(x.spend)}</b></div></div>
      <div class="total"><span class="label">${t("drvNet")}</span><b class="${x.net<0?"negv":"pos"}">${money(x.net)}</b></div>
      <div class="kpis three mini"><div class="kpi"><span class="label">${t("drvPerTrip")}</span><b>${money(x.perTrip)}</b></div><div class="kpi"><span class="label">${t("drvPerHour")}</span><b>${x.hours?money(x.perHour):"—"}</b></div><div class="kpi"><span class="label">${t("drvPerKm")}</span><b>${x.km?money(x.perKm):"—"}</b></div></div></div>`;
    if(x.comm) h += `<div class="panel"><span class="label">${t("drvCashApps")}</span><div class="kv">
      <div><span>${t("drvCashIn")}</span><b>${money(x.cash)}</b></div><div><span>${t("drvOwedApps")}</span><b class="negv">${money(x.owedToApps)}</b></div>
      <div><span>${t("drvAppsOwe")}</span><b class="pos">${money(Math.max(0,x.appsOweYou))}</b></div></div><span class="hint">${t("drvCashHint")}</span></div>`;
    const pk = Object.keys(x.byPl);
    if(pk.length>1) h += `<div class="panel"><span class="label">${t("drvByApp")}</span>${pk.sort((a,b)=>x.byPl[b].amt-x.byPl[a].amt).map(k=>`<div class="cat"><span>${esc(catLabel(k))} · <span class="num">${x.byPl[k].n}</span></span><b>${money(x.byPl[k].amt)}</b><div class="bar"><span style="width:${x.byPl[k].amt/Math.max(1,...pk.map(q=>x.byPl[q].amt))*100}%"></span></div></div>`).join("")}</div>`;
  }
  // today's list: trips + expenses
  const ex = S.expenses.filter(e=>e.unitId===u.id && e.date===d), other = S.income.filter(i=>i.unitId===u.id && i.date===d && !i.trip);
  const rows = [...x.trips.map(r=>["trip",r]), ...other.map(r=>["inc",r]), ...ex.map(r=>["exp",r])].sort((a,b)=>String(b[1].time||"").localeCompare(String(a[1].time||"")) || (b[1].createdAt||0)-(a[1].createdAt||0));
  h += `<div class="panel"><div class="whead"><b>${t("drvLog")}</b></div>${rows.length?`<div class="list">${rows.map(([k,r])=>k==="trip"?tripRow(r):txRow(k,r,false)).join("")}</div>`:`<span class="hint">${t("drvNoTrips")}</span>`}
    ${u.status!=="closed"?`<div class="two"><button class="btn" data-act="drvFuel">${icon("minus")}${t("drvAddFuel")}</button><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button></div>`:""}</div>`;
  return h;
}
function tripRow(x){
  const c = commOf(x);
  return `<button class="row" data-act="editTrip" data-id="${esc(x.id)}"><span class="tx-ic inc">${icon("route")}</span><div class="m"><b>${esc(catLabel(x.category))}${x.time?` · ${t12(x.time)}`:""}</b>
    <span class="sub">${[x.payBy==="cash"?t("cash"):t("drvApp"), num(x.tip)?t("drvTipX",{x:fmt(num(x.tip))}):"", num(x.km)?`<span class="num">${fmt(num(x.km))}</span> ${t("km")}`:"", c?t("drvCommX",{x:fmt(c)}):"", x.note?esc(x.note):"", Array.isArray(x.files)&&x.files.length?icon("clip"):""].filter(Boolean).join(" · ")}</span></div>
    <b class="pos">+ ${money(num(x.amount))}</b></button>`;
}
function tripForm(x, preset={}){
  const u = unitById(x?.unitId || preset.unitId || (S.view==="unit"?S.uid:"")) || activeUnits().find(v=>KP(v).driver); if(!u){ toast(t("drvNoCar")); return; }
  const pls = (KP(u).platforms||[]).map(p=>[p[0], esc(cat(p))]);
  const last = lsGet("lastPlatform_"+u.id, pls[0] && pls[0][0]);
  FILES.begin(x?.files);
  openSheet({title: x ? t("drvEditTrip") : t("newTrip"), saveLabel: x ? t("save") : t("record"),
    fields:[{name:"amount",label:t("drvFare"),type:"money",big:true,value:x ? num(x.amount)-num(x.tip) : ""},
      {name:"category",label:t("drvApp"),type:"chips",options:pls,value:x?.category || preset.platform || last},
      {name:"payBy",label:t("drvPaidHow"),type:"chips",options:[["cash",t("cash")],["card",t("drvCardApp")]],value:x?.payBy || lsGet("lastPay_"+u.id,"cash")}],
    more:[{name:"tip",label:t("drvTip"),type:"money",value:x?.tip||""},{name:"km",label:t("drvTripKm"),type:"money",value:x?.km||""},
      {name:"time",label:t("time"),type:"time",value:x?.time || nowHM()},{name:"date",label:t("date"),type:"date",value:x?.date || (S.view==="unit"?S.date:today())},
      {name:"note",label:t("drvWhere"),value:x?.note,max:120}],
    html: FILES.field(),
    del: x ? {label:t("del"), run:async()=>{ const ok = await remove("income",x.id); if(ok) FILES.purge(x.files); return ok; }} : null,
    submit: async v=>{
      const fare = num(v.amount), tip = Math.max(0,num(v.tip)); if(fare<=0){ toast(t("eAmount")); return false; }
      const files = await FILES.commit(); if(files===null) return false;
      lsSet("lastPlatform_"+u.id, v.category); lsSet("lastPay_"+u.id, v.payBy);
      const ok = await save("income", x?.id, {...(x?strip(x):{createdAt:Date.now()}), trip:true, unitId:u.id, category:pls.some(p=>p[0]===v.category)?v.category:(pls[0]||["أخرى"])[0],
        amount:fare+tip, tip, km:Math.max(0,num(v.km)), payBy:v.payBy==="card"?"card":"cash", time:mins(v.time)!=null?v.time:nowHM(), date:validDate(v.date)?v.date:today(), note:(v.note||"").slice(0,120), files});
      if(ok){ FILES.done(); if(!x) toast(t("drvSaved",{x:moneyTxt(fare+tip)})); }
      return ok;
    }});
}
function shiftForm(u, mode){
  const d = S.date, sh = shiftOf(u.id, d) || {};
  const lastKm = S.shifts.filter(x=>x.unitId===u.id && num(x.endKm)>0 && x.date<=d).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const fields = mode==="start" ? [{name:"startKm",label:t("odoStart"),type:"money",big:true,value:sh.startKm || (lastKm?lastKm.endKm:""),hint:t("odoHint")},{name:"startTime",label:t("drvStartAt"),type:"time",value:sh.startTime||nowHM()}]
    : mode==="end" ? [{name:"endKm",label:t("odoEnd"),type:"money",big:true,value:sh.endKm||"",hint:sh.startKm?t("odoFrom",{x:fmt(num(sh.startKm))}):""},{name:"endTime",label:t("drvEndAt"),type:"time",value:sh.endTime||nowHM()}]
    : [{name:"startTime",label:t("drvStartAt"),type:"time",value:sh.startTime||""},{name:"endTime",label:t("drvEndAt"),type:"time",value:sh.endTime||""},{name:"startKm",label:t("odoStart"),type:"money",value:sh.startKm||""},{name:"endKm",label:t("odoEnd"),type:"money",value:sh.endKm||""}];
  openSheet({title: mode==="start"?t("drvStart"):mode==="end"?t("drvEnd"):t("drvEditShift"), fields,
    del: sh.unitId && mode==="edit" ? {label:t("del"), run:()=>remove("shifts", d+"_"+u.id)} : null,
    submit: async v=>{
      const data = {...sh, unitId:u.id, date:d};
      ["startTime","endTime"].forEach(k=>{ if(k in v) data[k] = mins(v[k])!=null ? v[k] : ""; });
      ["startKm","endKm"].forEach(k=>{ if(k in v) data[k] = v[k]==="" ? "" : Math.max(0,num(v[k])); });
      if(num(data.endKm) && num(data.startKm) && num(data.endKm)<num(data.startKm)){ toast(t("odoBad")); return false; }
      delete data.id; return save("shifts", d+"_"+u.id, data);
    }});
}
/* month view for a car: per platform, per km, per hour */
function driverMonth(u){
  const a = monthStartOf(S.date||today()), b = monthEnd(a), x = driverDay(u.id, a, b);
  if(!x.n && !x.spend) return "";
  return `<div class="panel"><span class="label">${t("drvMonth")} · ${monthName(a)}</span><div class="kv">
    <div><span>${t("drvTripsN",{n:`<span class="num">${x.n}</span>`})}</span><b>${money(x.gross+x.tips)}</b></div>
    ${x.comm?`<div><span>${t("drvComm")}</span><b class="negv">− ${money(x.comm)}</b></div>`:""}
    <div><span>${t("drvSpend")}</span><b class="negv">− ${money(x.spend)}</b></div>
    ${x.km?`<div><span>${t("km")}</span><b class="num">${fmt(x.km)}</b></div>`:""}${x.hours?`<div><span>${t("drvHours")}</span><b>${hrsTxt(x.hours)}</b></div>`:""}</div>
    <div class="total"><span class="label">${t("drvNet")}</span><b class="${x.net<0?"negv":"pos"}">${money(x.net)}</b></div>
    <div class="kpis three mini"><div class="kpi"><span class="label">${t("drvPerTrip")}</span><b>${money(x.perTrip)}</b></div><div class="kpi"><span class="label">${t("drvPerHour")}</span><b>${x.hours?money(x.perHour):"—"}</b></div><div class="kpi"><span class="label">${t("drvPerKm")}</span><b>${x.km?money(x.perKm):"—"}</b></div></div></div>`;
}
