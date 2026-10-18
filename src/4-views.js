/* ===== render ===== */
function setLang(l){ LANG = l==="en" ? "en" : "ar"; try{ localStorage.setItem("lang", LANG); }catch(e){} applyDir(); render(); if(S.chat.open) renderChat(); }
function applyDir(){ document.documentElement.lang = LANG; document.documentElement.dir = LANG==="en" ? "ltr" : "rtl"; document.title = t("appName");
  document.getElementById("sheetCancel").textContent = t("cancel"); }
function render(){
  applyDir();
  const fab = document.getElementById("fab");
  if(S.screen!=="app"){ fab.hidden = true; app.innerHTML = authView(); return; }
  const inUnit = S.view==="unit" && unitById(S.uid);
  if(S.view==="unit" && !inUnit) S.view = "units";
  fab.hidden = !S.ready || !activeUnits().length || (inUnit && unitById(S.uid).status==="closed");
  fab.setAttribute("aria-label", t("whatAdd"));
  const body = !S.ready ? `<div class="panel empty"><b>${t("loadingBook")}</b></div>` :
    S.view==="unit" ? viewUnit() : S.view==="units" ? viewUnits() : S.view==="team" ? viewTeam() : S.view==="money" ? viewBooks() : viewHome();
  app.innerHTML = shell(body);
}
function navItems(){
  return [["home","home",t("navHome")],["units","folder",tv("navUnits")],["team","users",t("navTeam")],["money","wallet",t("navMoney")]];
}
function shell(body){
  const cur = S.view==="unit" ? "units" : S.view;
  const items = navItems().map(([k,ic,l])=>`<button class="nav-i ${cur===k?"on":""}" data-act="go" data-id="${k}" ${cur===k?'aria-current="page"':""}>${icon(ic)}<span>${esc(l)}</span></button>`).join("");
  const sup = `<button class="nav-i" data-act="support">${icon("chat")}<span>${t("navSupport")}</span>${S.chat.unread?'<i class="dot"></i>':""}</button>`;
  return `<div class="shell">
    <aside class="side"><div class="side-brand">${MARK}<div><b>${esc(t("appName"))}</b><span>${esc(COMPANY&&COMPANY.name||"")}</span></div></div>
      <nav class="side-nav" aria-label="${t("navHome")}">${items}${sup}</nav>
      <div class="side-foot"><button class="btn ghost sm" data-act="lang">${icon("globe")}${t("otherLang")}</button><button class="btn ghost sm" data-act="account">${icon("gear")}${t("account")}</button></div></aside>
    <main class="main"><header class="topbar"><div class="tb-brand">${MARK}<b>${esc(COMPANY&&COMPANY.name||t("appName"))}</b></div>
      <div class="tbtns"><button class="iconbtn" data-act="lang" aria-label="${t("language")}">${icon("globe")}</button><button class="iconbtn" data-act="support" aria-label="${t("navSupport")}">${icon("chat")}${S.chat.unread?'<i class="dot"></i>':""}</button><button class="iconbtn" data-act="account" aria-label="${t("account")}">${icon("gear")}</button></div></header>
      <div class="wrap">${body}</div></main>
    <nav class="bottom-nav" aria-label="${t("navHome")}">${items}${sup}</nav></div>`;
}
const pageHead = (title, sub, actions="") => `<div class="phead"><div class="col"><h1>${title}</h1>${sub?`<span class="sub">${sub}</span>`:""}</div>${actions}</div>`;

/* ----- home / dashboard ----- */
function viewHome(){
  const ms = monthStartOf(today()), m = companyTotals(ms, monthEnd(ms));
  let h = pageHead(t("hello",{x:esc(COMPANY&&COMPANY.name||"")}), `${esc(PRE().name[LI()])} · ${monthName(ms)}`);
  const hasUnit = S.units.length>0, hasStaff = S.staff.length>0, hasAtt = S.attendance.length>0, hasMoney = S.expenses.length+S.income.length>0;
  const hasBooks = S.invoices.length>0 || S.vouchers.length>0;
  if(!hasBooks && !(hasUnit && hasStaff && (hasAtt||hasMoney))){
    const steps = [[hasUnit, tv("ob1"), "newUnit"], [hasStaff, tv("ob2"), hasUnit?"openFirst":"newUnit"], [hasAtt||hasMoney, tv("ob3"), hasUnit?"openFirst":"newUnit"]];
    return h + (hasUnit ? "" : `<div class="panel demo-cta"><div class="col"><b>${t("demoT")}</b><span class="sub">${t("demoS")}</span></div><button class="btn primary" data-act="demoLoad">${icon("bolt")}${t("demoBtn")}</button></div>`)
      + `<div class="panel start"><b class="start-t">${t("obStart")}</b><span class="sub">${t("obStartSub")}</span>
      <ol class="steps">${steps.map(([done,txt,act],i)=>`<li class="${done?"done":""}"><span class="step-n">${done?icon("check"):`<span class="num">${i+1}</span>`}</span><span class="step-t">${txt}</span>${done?"":`<button class="btn sm ${steps.findIndex(x=>!x[0])===i?"primary":""}" data-act="${act}">${t("doIt")}</button>`}</li>`).join("")}</ol></div>`
      + (hasUnit ? `<div class="qgrid home-q">${quickTiles()}</div><div class="folders">${activeUnits().slice(0,4).map(folder).join("")}</div>` : "");
  }
  if(hasDemo()) h += `<div class="alert info demo-bar">${icon("bolt")}<span>${t("demoOn")}</span><button class="btn sm" data-act="demoClear">${t("demoClear")}</button></div>`;
  h += `<div class="qgrid home-q">${quickTiles()}</div>`;
  h += `<div class="kpis">
    <div class="kpi"><span class="label">${t("income")}</span><b class="pos">${money(m.inc)}</b></div>
    <div class="kpi"><span class="label">${t("expenses")}</span><b>${money(m.exp)}</b></div>
    <div class="kpi"><span class="label">${t("salaries")}</span><b>${money(m.lab)}</b></div>
    <div class="kpi hero ${m.profit<0?"neg":""}"><span class="label">${m.profit<0?t("loss"):t("profit")} · ${t("thisMonth")}</span><b>${money(Math.abs(m.profit))}</b></div></div>`;
  if(typeof radarHomeCard==="function") h += radarHomeCard();
  if(typeof pushHomeCard==="function") h += pushHomeCard();
  // trend
  const months = [...Array(6)].map((_,i)=>addMonths(ms,i-5));
  const vals = months.map(x=>companyTotals(x, monthEnd(x)).profit), mx = Math.max(1,...vals.map(Math.abs));
  h += `<div class="panel"><span class="label">${t("last6")}</span><div class="trend">${months.map((x,i)=>`<div class="tcol"><span class="num v ${vals[i]<0?"negv":""}">${fmt(vals[i])}</span><div class="tbar"><i class="${vals[i]<0?"neg":""}" style="height:${Math.max(3,Math.abs(vals[i])/mx*100)}%"></i></div><span class="m">${MONTHS[LANG][parseD(x).getMonth()]}</span></div>`).join("")}</div></div>`;
  // attention
  const items = [];
  activeUnits().forEach(u=>{
    const x = unitTotals(u.id), b = num(u.budget), r = recurState(u);
    if(b && x.cost/b>=0.8) items.push(["warn","alert",t("aOver80",{u:esc(u.name),p:`<span class="num">${Math.round(x.cost/b*100)}</span>`})]);
    if(r && r.state==="late") items.push(["bad","clock",`${esc(u.name)}: ${esc(r.label)} — ${t("late_")} (${t("partPaid",{a:fmt(r.got),b:moneyTxt(r.amount)})})`]);
    if(KP(u).contract && b && b-x.inc>0.005 && u.client) items.push(["info","wallet",t("aClient",{u:esc(u.name),c:esc(u.client),x:money(b-x.inc)})]);
    if(!isOff(today()) && unitStaff(u.id).length && !unitStaff(u.id).some(s=>attOf(s.id,today()))) items.push(["info","users",t("aUnmarked",{u:esc(u.name)})]);
  });
  const ps = periodStartFor(today()), pe = S.period==="month" ? monthEnd(ps) : addDays(ps,6);
  const owed = sum(S.staff.filter(s=>s.active!==false), s=>Math.max(0,account(s,ps,pe).remaining));
  if(owed>0.005) items.push(["info","users",t("aOwed",{x:money(owed),p:S.period==="month"?t("monthW"):t("weekW")})]);
  items.unshift(...bookAlerts());
  h += `<div class="panel"><span class="label">${t("attention")}</span>${items.length?`<div class="alerts">${items.slice(0,8).map(([k,ic,txt])=>`<div class="alert ${k}">${icon(ic)}<span>${txt}</span></div>`).join("")}</div>`:`<div class="alert good">${icon("check")}<span>${t("allGood")}</span></div>`}</div>`;
  // recurring dues
  { const rs = activeUnits().map(u=>[u,recurState(u)]).filter(x=>x[1]);
    if(rs.length) h += `<div class="panel"><span class="label">${t("dueMonth",{label:esc(rs[0][1].label)})}</span><div class="list">${rs.map(([u,r])=>`<button class="row" data-act="openUnit" data-id="${esc(u.id)}"><div class="m"><b>${esc(u.name)}</b><span class="sub">${u.client?esc(u.client)+" · ":""}${t("partPaid",{a:fmt(r.got),b:moneyTxt(r.amount)})}</span></div><span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":"warn"}">${r.state==="paid"?t("paid"):r.state==="late"?t("late_"):t("dueOn",{d:`<span class="num">${r.day}</span>`})}</span></button>`).join("")}</div></div>`; }
  h += `<div class="sec-head"><b>${esc(tv("activeUnits"))}</b><button class="btn primary sm" data-act="newUnit">${icon("plus")}${esc(tv("newUnit").replace(/^\+\s*/,""))}</button></div>`;
  const act = activeUnits();
  h += act.length ? `<div class="folders">${act.slice(0,6).map(folder).join("")}</div>` : `<div class="panel empty"><b>${tv("noUnits")}</b><span>${tv("noUnitsSub")}</span></div>`;
  if(ROLE==="owner" && S.staff.length>=2) h += `<div class="panel grow"><div class="col"><b>${t("growTeamT")}</b><span class="sub">${t("growTeamS")}</span></div><button class="btn sm" data-act="team">${icon("users")}${t("addPerson")}</button></div>`;
  h += `<div class="panel grow"><div class="col"><b>${t("growShareT")}</b><span class="sub">${t("growShareS")}</span></div><button class="btn sm" data-act="shareApp">${icon("send")}${t("shareBtn")}</button></div>`;
  return h;
}
function viewUnits(){
  const act = activeUnits(), done = S.units.filter(u=>u.status==="closed").sort((a,b)=>(b.closedAt||"").localeCompare(a.closedAt||""));
  let h = pageHead(esc(cap(term("unit",true))), "", `<button class="btn primary" data-act="newUnit">${icon("plus")}${esc(tv("newUnit").replace(/^\+\s*/,""))}</button>`);
  if(!act.length && !done.length) return h + `<div class="panel empty">${icon("folder","big")}<b>${tv("noUnits")}</b><span>${tv("noUnitsSub")}</span></div>`;
  if(act.length) h += `<div class="folders">${act.map(folder).join("")}</div>`;
  if(done.length) h += `<details class="panel"><summary>${esc(tv("finishedUnits"))} (<span class="num">${done.length}</span>)</summary><div class="folders">${done.map(folder).join("")}</div></details>`;
  return h;
}
function folder(u){
  const x = unitTotals(u.id), n = unitStaff(u.id).length, r = recurState(u), b = num(u.budget);
  const pct = b ? Math.min(100, Math.round(x.cost/b*100)) : 0;
  return `<button class="folder ${u.status==="closed"?"closed":""}" data-act="openUnit" data-id="${esc(u.id)}">
    <div class="f-top"><span class="f-ic">${icon(KP(u).icon)}</span><div class="col"><h3>${esc(u.name)}</h3><span class="sub">${[u.client,u.location].filter(Boolean).map(esc).join(" · ")||"&nbsp;"}</span></div>
    ${r?`<span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":"warn"}">${r.state==="paid"?t("paid"):r.state==="late"?t("late_"):esc(r.label)}</span>`:""}</div>
    <div class="f-stats"><div><span class="label">${u.status==="closed"?t("cost"):t("costSoFar")}</span><b>${money(x.cost)}</b></div>
      <div><span class="label">${x.profit<0?t("loss"):t("profit")}</span><b class="${x.profit<0?"negv":x.inc?"pos":""}">${money(Math.abs(x.profit))}</b></div>
      <div><span class="label">${esc(cap(term("staff",true)))}</span><b class="num">${n}</b></div></div>
    ${b?`<div class="meter"><i class="${pct>=100?"over":pct>=80?"warn":""}" style="width:${pct}%"></i></div>`:""}</button>`;
}

/* ----- one unit ----- */
function viewUnit(){
  const u = unitById(S.uid);
  const meta = [unitKind(u)!==ST().type ? esc(KP(u).name[LI()]) : "", u.client ? `${esc(KP(u).client?KP(u).client[LI()]:"")}: ${esc(u.client)}` : "", u.location ? esc(u.location) : ""].filter(Boolean).join(" · ");
  let h = `<button class="back" data-act="go" data-id="units">${icon(LANG==="en"?"chevE":"chevS")}${esc(cap(term("unit",true)))}</button>
  ${pageHead(esc(u.name), meta, `<button class="btn ghost sm" data-act="editUnit">${icon("gear")}${t("edit")}</button>`)}`;
  const drv = !!KP(u).driver, hasStaff = unitStaff(u.id).length>0;
  const tabs = drv ? [["today",t("tabShift")],["money",t("tabMoney")],["summary",t("tabSummary")],...(hasStaff?[["team",t("tabStaffDay")],["account",t("tabAccount")]]:[])]
    : [["today",t("tabToday")],["account",t("tabAccount")],["money",t("tabMoney")],["summary",t("tabSummary")]];
  if(!tabs.some(x=>x[0]===S.tab)) S.tab = "today";
  h += `<div class="tabs ${tabs.length>4?"five":""}" role="tablist">${tabs.map(([k,l])=>`<button role="tab" data-act="tab" data-id="${k}" aria-selected="${S.tab===k}">${esc(l)}</button>`).join("")}</div>`;
  return h + (S.tab==="money" ? tabMoney(u) : S.tab==="summary" ? tabSummary(u) : S.tab==="account" ? tabAccount(unitStaff(u.id)) : S.tab==="team" ? tabToday(u) : drv ? tabShift(u) : tabToday(u));
}
function tabToday(u){
  const ss = unitStaff(u.id), d = S.date, isToday = d===today();
  const recs = ss.map(s=>[s, attOf(s.id,d)]);
  const present = recs.filter(([s,a])=>came(a) && a.unitId===u.id);
  const absentN = recs.filter(([s,a])=>a && a.status==="absent").length;
  const owe = sum(present,([s,a])=>dayPay(a).total), marked = recs.filter(([s,a])=>a).length;
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  let h = `<div class="daybar"><button class="iconbtn" data-act="day" data-id="-1" aria-label="${t("prevDay")}">${icon(prev)}</button>
    <div class="d"><b>${isToday?t("today")+" · ":""}${fdate(d)}</b>${isToday?"":`<button class="linkbtn" data-act="day" data-id="0">${t("backToday")}</button>`}</div>
    <button class="iconbtn" data-act="day" data-id="1" aria-label="${t("nextDay")}">${icon(next)}</button></div>`;
  if(isOff(d)) h += `<div class="alert warn">${icon("calendar")}<span>${t("weekendDay")}</span></div>`;
  h += `<div class="owe">${MARK}<span class="label">${isToday?tv("oweToday"):tv("oweDay")}</span><b>${money(owe)}</b>
    <span class="sub">${t("cameOf",{a:`<span class="num">${present.length}</span>`,b:`<span class="num">${ss.length}</span>`})}${absentN?" · "+t("absentDed",{n:`<span class="num">${absentN}</span>`}):""}</span></div>`;
  if(!ss.length){
    h += `<div class="panel empty">${icon("users","big")}<b>${tv("noStaff")}</b><span>${tv("noStaffSub")}</span><button class="btn primary" data-act="addStaff">${tv("addStaff")}</button></div>`;
  } else {
    h += `<div class="sec-head"><b>${esc(cap(term("staff",true)))} <span class="sub num">${present.length}/${ss.length}</span></b>${marked<ss.length && !isOff(d)?`<button class="btn primary sm" data-act="allCame">${icon("check")}${t("allCame")}</button>`:""}</div>`;
    h += `<div class="cards">${recs.map(([s,a])=>staffCard(s,a)).join("")}</div>`;
    h += `<button class="btn dashed" data-act="addStaff">${icon("plus")}${tv("addStaff").replace(/^\+\s*/,"")}</button>`;
  }
  const exT = S.expenses.filter(x=>x.unitId===u.id && x.date===d), inT = S.income.filter(x=>x.unitId===u.id && x.date===d);
  h += `<div class="panel"><div class="whead"><b>${isToday?t("todayMoney"):t("dayMoney")}</b>${exT.length||inT.length?`<span class="sub">${t("spent")} ${money(sum(exT,x=>num(x.amount)))}${inT.length?` · ${t("received")} <span class="pos">${money(sum(inT,x=>num(x.amount)))}</span>`:""}</span>`:""}</div>
    ${exT.length||inT.length?`<div class="list">${[...exT.map(x=>["exp",x]),...inT.map(x=>["inc",x])].map(([k,x])=>txRow(k,x,false)).join("")}</div>`:`<span class="hint">${t("noMoneyToday")}</span>`}
    ${u.status!=="closed"?`<div class="two"><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button><button class="btn" data-act="newInc">${icon("plus")}${t("incomeOne")}</button></div>`:""}</div>`;
  return h;
}
function staffCard(s,a){
  const st = a ? (came(a) ? "present" : "absent") : "";
  const tp = S.payments.filter(x=>x.staffId===s.id && x.date===S.date);
  const dr = dayRate(s, S.date);
  let body = "";
  if(st==="present"){
    const pay = dayPay(a), x = timeCalc(a.in||ST().shiftIn, a.out||ST().shiftOut);
    body = `<div class="wline"><span class="sub">${icon("clock")}${t("fromTo",{a:t12(a.in||ST().shiftIn),b:t12(a.out||ST().shiftOut)})}</span><b class="pos">${money(pay.total)}</b></div>
      ${x.late||x.ot||x.early?`<div class="chips-row">${x.late?`<span class="pill warn">${t("late",{x:hrsTxt(x.late)})}</span>`:""}${x.early?`<span class="pill warn">${t("early",{x:hrsTxt(x.early)})}</span>`:""}${x.ot?`<span class="pill good">${t("ot",{x:hrsTxt(x.ot)})} +${fmt(pay.ot)}</span>`:""}</div>`:""}`;
  } else if(st==="absent") body = `<div class="wline"><span class="negv strong">${t("absentNote",{x:money(dr)})}</span></div>`;
  return `<div class="wcard ${st}">
    <div class="whead"><div class="who"><span class="avatar">${esc(initials(s.name))}</span><div class="col"><b>${esc(s.name)}</b><span class="sub">${s.role?esc(s.role)+" · ":""}${t("dailyIs",{x:money(dr)})}</span></div></div>
      <button class="iconbtn sm" data-act="editStaff" data-id="${esc(s.id)}" aria-label="${t("edit")}">${icon("gear")}</button></div>
    <div class="yesno"><button class="y ${st==="present"?"on":""}" data-act="mark" data-id="${esc(s.id)}" data-s="present" aria-pressed="${st==="present"}">${icon("check")}${t("came")}</button><button class="n ${st==="absent"?"on":""}" data-act="mark" data-id="${esc(s.id)}" data-s="absent" aria-pressed="${st==="absent"}">${icon("x")}${t("absent")}</button></div>
    ${body}
    <div class="wfoot"><button class="btn sm" data-act="advance" data-id="${esc(s.id)}">${icon("plus")}${t("addAdvance")}</button>${st==="present"?`<button class="btn sm ghost" data-act="times" data-id="${esc(s.id)}">${icon("clock")}${t("changeTimes")}</button>`:""}
      ${tp.map(x=>`<button class="pill ${x.kind==="salary"?"good":"warn"} btnlike" data-act="editPay" data-id="${esc(x.id)}">${x.kind==="salary"?t("tookSal",{x:money(num(x.amount))}):t("tookAdv",{x:money(num(x.amount))})}</button>`).join("")}</div>
  </div>`;
}
function periodBar(){
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE", a = S.pstart, b = periodEnd();
  return `<div class="seg two-seg" role="group"><button data-act="period" data-id="week" aria-pressed="${S.period==="week"}">${t("week")}</button><button data-act="period" data-id="month" aria-pressed="${S.period==="month"}">${t("month")}</button></div>
  <div class="daybar"><button class="iconbtn" data-act="pnav" data-id="-1">${icon(prev)}</button><div class="d"><b>${S.period==="month"?monthName(a):t("periodFromTo",{a:fdate(a),b:fdate(lastWorkDay(a,b))})}</b></div><button class="iconbtn" data-act="pnav" data-id="1">${icon(next)}</button></div>`;
}
function accountCard(s,k){
  const lines = [[t("workedDays",{n:`<span class="num">${k.days}</span>`,days:k.days===1?t("dayW"):t("daysW"),r:fmt(k.days?k.base/k.days:dayRate(s,S.pstart))}), k.base, ""]];
  if(k.ot) lines.push([t("otLine",{x:hrsTxt(k.otH)}), k.ot, "+"]);
  if(k.lvPay) lines.push([`${t("hrLeavePay")} (<span class="num">${k.lvN}</span>)`, k.lvPay, "+"]);
  if(k.ssE) lines.push([t("hrSSEmp"), k.ssE, "-"]);
  if(k.tax) lines.push([t("hrIncTax"), k.tax, "-"]);
  k.pp.forEach(x=>lines.push([x.kind==="salary"?t("paidLine",{d:fdate(x.date)}):t("advLine",{d:fdate(x.date)}), num(x.amount), "-", x.id]));
  const r = k.remaining, u = unitById(s.unitId);
  return `<div class="panel"><div class="whead"><div class="who"><span class="avatar">${esc(initials(s.name))}</span><div class="col"><b>${esc(s.name)}</b><span class="sub">${S.view==="team"&&u?esc(u.name)+" · ":""}${k.absentN?t("absentN",{n:`<span class="num">${k.absentN}</span>`})+" · ":""}${k.lateH?t("late",{x:hrsTxt(k.lateH)}):""}</span></div></div></div>
    <div class="kv">${lines.map(([l,v,sg,id])=>`<div ${id?`data-act="editPay" data-id="${esc(id)}" class="clickable"`:""}><span>${l}</span><b class="${sg==="-"?"negv":sg==="+"?"pos":""}">${sg==="-"?"− ":sg==="+"?"+ ":""}${money(v)}</b></div>`).join("")}</div>
    <div class="total"><span class="label">${r<-0.005?t("overpaid"):t("leftFor")}</span><b class="${r>0.005?"due":r<-0.005?"negv":"pos"}">${money(Math.abs(r))}</b></div>
    <div class="two">${r>0.005?`<button class="btn primary" data-act="payRest" data-id="${esc(s.id)}">${t("payRest",{x:fmt(r)})}</button>`:k.earned>0?`<span class="pill good self-start">${icon("check")}${t("settled")}</span>`:"<span></span>"}<button class="btn" data-act="shareWa" data-id="${esc(s.id)}">${icon("send")}${t("waStatement")}</button></div>
    <div class="two"><button class="btn ghost sm" data-act="payslip" data-id="${esc(s.id)}">${icon("file")}${t("hrPayslip")}</button><button class="btn ghost sm" data-act="leave" data-id="${esc(s.id)}">${icon("calendar")}${t("hrLeave")}</button></div></div>`;
}
function tabAccount(ss){
  let h = periodBar();
  if(!ss.length) return h + `<div class="panel empty"><span>${tv("noStaffShort")}</span></div>`;
  const all = ss.map(s=>[s, account(s,S.pstart,periodEnd())]);
  h += `<div class="panel"><div class="kv"><div><span>${t("earnedAll")}</span><b>${money(sum(all,x=>x[1].earned))}</b></div><div><span>${t("tookAll")}</span><b>${money(sum(all,x=>x[1].adv+x[1].paid))}</b></div></div>
    <div class="total"><span class="label">${t("leftAll")}</span><b class="due">${money(sum(all,x=>Math.max(0,x[1].remaining)))}</b></div></div>`;
  return h + all.map(([s,k])=>accountCard(s,k)).join("") + `<button class="btn ghost" data-act="exportPayroll">${icon("wallet")}${t("exportPayroll")}</button>`;
}
function txRow(k,x,showUnit,showDate=showUnit){
  if(k==="inc" && x.trip && !showUnit) return tripRow(x);
  const u = showUnit && unitById(x.unitId), act = k==="exp"?"editExp":k==="inc"?"editInc":"editPay";
  const title = k==="pay" ? `${esc((staffById(x.staffId)||{}).name||"")} · ${x.kind==="salary"?t("fromSalary"):t("advance")}` : esc(catLabel(x.category)) + (x.trip ? ` · ${t("drvTrip")}` : "");
  const sub = [k!=="pay"&&(x.item||x.note)?esc(x.item||x.note):"", x.supplier?esc(x.supplier):"", u?esc(u.name):"", showDate?fdate(x.date):"", x.time?t12(x.time):"", x.payBy&&x.payBy!=="cash"?esc(t(x.payBy)):"", Array.isArray(x.files)&&x.files.length?`${icon("clip")}<span class="num">${x.files.length}</span>`:""].filter(Boolean).join(" · ");
  return `<button class="row" data-act="${act}" data-id="${esc(x.id)}"><span class="tx-ic ${k}">${icon(k==="inc"?"plus":k==="pay"?"users":"minus")}</span><div class="m"><b>${title}</b>${sub?`<span class="sub">${sub}</span>`:""}</div><b class="${k==="inc"?"pos":""}">${k==="inc"?"+":"−"} ${money(num(x.amount))}</b></button>`;
}
function tabMoney(u){
  const ex = S.expenses.filter(x=>x.unitId===u.id).sort(byDateDesc), inc = S.income.filter(x=>x.unitId===u.id).sort(byDateDesc);
  return `<div class="two"><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button><button class="btn" data-act="newInc">${icon("plus")}${t("incomeOne")}</button></div>
  <div class="panel"><div class="total flat"><span class="label">${t("allExpenses")}</span><b>${money(sum(ex,x=>num(x.amount)))}</b></div>
    ${ex.length?`<div class="list">${ex.map(x=>txRow("exp",x,false,true)).join("")}</div>`:`<span class="hint">${t("noExpenses")}</span>`}</div>
  <div class="panel"><div class="total flat"><span class="label">${t("allIncome")}</span><b class="pos">${money(sum(inc,x=>num(x.amount)))}</b></div>
    ${inc.length?`<div class="list">${inc.map(x=>txRow("inc",x,false,true)).join("")}</div>`:`<span class="hint">${t("noIncome")}</span>`}</div>`;
}
function tabSummary(u){
  const x = unitTotals(u.id), budget = num(u.budget), closed = u.status==="closed", B = KP(u).budget, Bl = B ? B[LI()] : t("budgetLeft");
  const cats = {}; if(x.comm) cats[t("drvComm")] = x.comm; S.expenses.filter(e=>e.unitId===u.id).forEach(e=>{ const k = catLabel(e.category); cats[k]=(cats[k]||0)+num(e.amount); });
  const ck = Object.keys(cats).sort((a,b)=>cats[b]-cats[a]), mx = Math.max(1,...Object.values(cats));
  const pct = budget ? Math.round(x.cost/budget*100) : 0, r = recurState(u);
  let h = (KP(u).driver ? driverMonth(u) : "") + `<div class="panel"><div class="kv"><div><span>${t("expMat")}</span><b>${money(x.exp-x.comm)}</b></div>${x.comm?`<div><span>${t("drvComm")}</span><b>${money(x.comm)}</b></div>`:""}<div><span>${tv("labor")}</span><b>${money(x.lab)}</b></div></div>
    <div class="total"><span class="label">${closed?t("totalCost"):t("totalCostSoFar")}</span><b>${money(x.cost)}</b></div>
    <div class="kv"><div><span>${t("incomeAll")}</span><b class="pos">${money(x.inc)}</b></div></div>
    <div class="total"><span class="label">${x.profit<0?t("loss"):(closed?t("profit"):t("netSoFar"))}</span><b class="${x.profit<0?"negv":"pos"}">${money(Math.abs(x.profit))}</b></div></div>`;
  if(B) h += `<div class="panel"><span class="label">${esc(B[LI()])}</span>${budget?`<div class="kv"><div><span>${esc(B[LI()])}</span><b>${money(budget)}</b></div>
      <div><span>${t("budgetLeft",{b:esc(Bl)})}</span><b class="${budget-x.cost<0?"negv":""}">${money(budget-x.cost)}</b></div>
      ${KP(u).contract?`<div><span>${t("clientOwes",{c:esc(u.client||(KP(u).client?KP(u).client[LI()]:""))})}</span><b class="due">${money(Math.max(0,budget-x.inc))}</b></div>`:""}</div>
      <div class="meter"><i style="width:${Math.min(100,pct)}%" class="${pct>=100?"over":pct>=80?"warn":""}"></i></div>${pct>=80?`<div class="alert warn">${icon("alert")}<span>${t("budgetWarn",{p:`<span class="num">${pct}</span>`,b:esc(Bl)})}</span></div>`:""}`
      :`<span class="hint">${t("budgetHint",{b:esc(Bl)})}</span>`}</div>`;
  if(r) h += `<div class="panel"><span class="label">${esc(r.label)} · ${monthName(today())}</span><div class="kv"><div><span>${t("recurDueDay",{d:`<span class="num">${r.day}</span>`})}</span><b>${money(r.amount)}</b></div><div><span>${t("received")}</span><b class="pos">${money(r.got)}</b></div></div>
    <span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":"warn"} self-start">${r.state==="paid"?t("paid"):r.state==="late"?t("late_"):t("dueOn",{d:`<span class="num">${r.day}</span>`})}</span></div>`;
  if(ck.length) h += `<div class="panel"><span class="label">${t("byCat")}</span>${ck.map(k=>`<div class="cat"><span>${esc(k)}</span><b>${money(cats[k])}</b><div class="bar"><span style="width:${cats[k]/mx*100}%"></span></div></div>`).join("")}</div>`;
  if(u.client || S.income.some(i=>i.unitId===u.id)) h += `<button class="btn" data-act="shareClient" data-id="${esc(u.id)}">${icon("send")}${t("cstSend",{x:esc(u.client||(KP(u).client?KP(u).client[LI()]:t("client")))})}</button>`;
  h += `<div class="two"><button class="btn" data-act="printReport">${icon("book")}${t("printReport")}</button>${closed ? `<button class="btn" data-act="reopen">${t("reopen")}</button>` : `<button class="btn danger" data-act="closeUnit">${t("closeUnit")}</button>`}</div>`;
  h += `<div class="print-only print-foot">${esc(COMPANY&&COMPANY.name||"")} · ${esc(u.name)} · ${fdate(today())} · ${t("madeWith")}</div>`;
  return h;
}

/* ----- team ----- */
function viewTeam(){
  const ss = S.staff.filter(s=>s.active!==false).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  let h = pageHead(t("navTeam"), tv("teamSub"));
  if(!ss.length) return h + `<div class="panel empty">${icon("users","big")}<span>${tv("noTeam")}</span></div>`;
  h += periodBar();
  const all = ss.map(s=>[s, account(s,S.pstart,periodEnd())]);
  h += `<div class="two"><button class="btn" data-act="leave">${icon("calendar")}${t("hrLeaveNew")}</button>${ss.some(x=>x.ss)?`<button class="btn" data-act="ssSheet">${icon("file")}${t("hrSSSheet")}</button>`:"<span></span>"}</div>`;
  h += `<div class="kpis three"><div class="kpi"><span class="label">${t("earnedAll")}</span><b>${money(sum(all,x=>x[1].earned))}</b></div><div class="kpi"><span class="label">${t("tookAll")}</span><b>${money(sum(all,x=>x[1].adv+x[1].paid))}</b></div><div class="kpi hero"><span class="label">${t("leftAll")}</span><b>${money(sum(all,x=>Math.max(0,x[1].remaining)))}</b></div></div>`;
  return h + all.map(([s,k])=>accountCard(s,k)).join("");
}

/* ----- money ----- */
function viewMoney(){
  if(!S.mmonth) S.mmonth = monthStartOf(today());
  const q = (S.mq||"").trim().toLowerCase();
  const a = S.mmonth, b = monthEnd(a), f = S.mfilter, prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  const m = companyTotals(a,b);
  const ex = S.expenses.filter(x=>inRange(x.date,a,b)).map(x=>["exp",x]), inc = S.income.filter(x=>inRange(x.date,a,b)).map(x=>["inc",x]), pay = S.payments.filter(x=>inRange(x.date,a,b)).map(x=>["pay",x]);
  const matches = ([k,x]) => !q || [catLabel(x.category||""), x.item, x.note, x.supplier, x.invNo, (staffById(x.staffId)||{}).name, (unitById(x.unitId)||{}).name, String(x.amount)].some(v=>String(v||"").toLowerCase().includes(q));
  const list = (f==="exp"?ex:f==="inc"?inc:f==="pay"?pay:[...ex,...inc,...pay]).filter(matches).sort((x,y)=>byDateDesc(x[1],y[1]));
  let h = pageHead(t("navMoney"), "", `<div class="hbtns"><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button><button class="btn primary" data-act="newInc">${icon("plus")}${t("incomeOne")}</button></div>`);
  h += `<div class="daybar"><button class="iconbtn" data-act="mnav" data-id="-1">${icon(prev)}</button><div class="d"><b>${monthName(a)}</b></div><button class="iconbtn" data-act="mnav" data-id="1">${icon(next)}</button></div>`;
  h += `<div class="kpis"><div class="kpi"><span class="label">${t("income")}</span><b class="pos">${money(m.inc)}</b></div><div class="kpi"><span class="label">${t("expenses")}</span><b>${money(m.exp)}</b></div><div class="kpi"><span class="label">${t("salaries")}</span><b>${money(m.lab)}</b></div><div class="kpi hero ${m.profit<0?"neg":""}"><span class="label">${m.profit<0?t("loss"):t("profit")}</span><b>${money(Math.abs(m.profit))}</b></div></div>`;
  h += `<div class="seg four" role="group">${[["all",t("fAll")],["exp",t("fExp")],["inc",t("fInc")],["pay",t("fPay")]].map(([k,l])=>`<button data-act="mfilter" data-id="${k}" aria-pressed="${f===k}">${l}</button>`).join("")}</div>`;
  h += `<div class="panel"><div class="searchrow"><input id="mq" type="search" placeholder="${esc(t("searchPh"))}" value="${esc(S.mq||"")}" autocomplete="off"><button class="btn sm" data-act="exportMonth">${icon("wallet")}${t("export")}</button></div>
    ${list.length?`<div class="list">${list.map(([k,x])=>txRow(k,x,true)).join("")}</div>`:`<span class="hint">${t("noTx")}</span>`}</div>`;
  return h;
}
