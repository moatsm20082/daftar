
/* =====================================================================
   v24 new look, same Daftar.
   - The bottom bar: home, projects, a big + in the middle, money, team.
   - Home starts with this month's profit, four big buttons (expense, income, snap,
     talk), today at a glance, and the latest movements.
   - Everything else keeps working exactly as before; only the look changes (style.css).
   ===================================================================== */
Object.assign(L, {
  dsProfitM:["ربح هالشهر","Profit this month"], dsLossM:["خسارة هالشهر","Loss this month"],
  dsIn:["دخل","In"], dsOut:["طلع","Out"], dsWages:["رواتب","Wages"],
  dsExp:["مصروف","Expense"], dsInc:["دخل","Income"], dsSnap:["صوّر","Snap"], dsTalk:["احكي","Talk"],
  dsToday:["اليوم","Today"], dsTodayIn:["دخل اليوم","In today"], dsTodayOut:["طلع اليوم","Out today"], dsCame:["داوم","Came"],
  dsRecent:["آخر الحركات","Latest"], dsAll:["الكل","All"], dsNoRecent:["لسا ما سجّلت إشي. ابلش بمصروف أو احكي لدفتر.","Nothing yet. Start with an expense, or just talk to Daftar."],
  dsAdd:["ضيف","Add"], dsAdv:["سلفة","Advance"], dsVch:["سند","Voucher"], dsInv:["فاتورة","Invoice"],
});

/* ---------- shell: bottom bar with a big + in the middle ---------- */
shell = function(body){
  const cur = S.view==="unit" ? "units" : S.view;
  const it = (k, ic, l) => `<button class="nav-i ${cur===k?"on":""}" data-act="go" data-id="${k}" ${cur===k?'aria-current="page"':""}>${icon(ic)}<span>${esc(l)}</span></button>`;
  const [h, u, tm, m] = [["home","home",t("navHome")],["units","folder",tv("navUnits")],["team","users",t("navTeam")],["money","wallet",t("navMoney")]];
  const center = activeUnits().length ? "quick" : "newUnit";
  const side = [h,u,tm,m].map(x=>it(...x)).join("");
  const sup = `<button class="nav-i" data-act="support">${icon("chat")}<span>${t("navSupport")}</span>${S.chat.unread?'<i class="dot"></i>':""}</button>`;
  return `<div class="shell ds">
    <aside class="side"><div class="side-brand">${MARK}<div><b>${esc(t("appName"))}</b><span>${esc(COMPANY&&COMPANY.name||"")}</span></div></div>
      <button class="btn primary side-add" data-act="${center}">${icon("plus")}${t("dsAdd")}</button>
      <nav class="side-nav" aria-label="${t("navHome")}">${side}${sup}</nav>
      <div class="side-foot"><button class="btn ghost sm" data-act="lang">${icon("globe")}${t("otherLang")}</button><button class="btn ghost sm" data-act="account">${icon("gear")}${t("account")}</button></div></aside>
    <main class="main"><header class="topbar"><div class="tb-brand">${MARK}<b>${esc(COMPANY&&COMPANY.name||t("appName"))}</b></div>
      <div class="tbtns"><button class="iconbtn" data-act="support" aria-label="${t("navSupport")}">${icon("chat")}${S.chat.unread?'<i class="dot"></i>':""}</button><button class="iconbtn" data-act="lang" aria-label="${t("language")}">${icon("globe")}</button><button class="iconbtn" data-act="account" aria-label="${t("account")}">${icon("gear")}</button></div></header>
      <div class="wrap">${body}</div></main>
    <nav class="bottom-nav ds-nav" aria-label="${t("navHome")}">${it(...h)}${it(...u)}<button class="nav-c" data-act="${center}" aria-label="${t("whatAdd")}"><span>${icon("plus")}</span></button>${it(...m)}${it(...tm)}</nav></div>`;
};

/* ---------- home ---------- */
function dsRecent(){
  const rows = [];
  const unitN = id => { const u = unitById(id); return u && activeUnits().length>1 ? " · "+esc(u.name) : ""; };
  (S.expenses||[]).forEach(x=>rows.push({at:x.createdAt||0, date:x.date, ic:"minus", cls:"out", t:x.item || catLabel(x.category), s:fdate(x.date)+unitN(x.unitId), a:-num(x.amount)}));
  (S.income||[]).forEach(x=>rows.push({at:x.createdAt||0, date:x.date, ic:"plus", cls:"in", t:x.note || catLabel(x.category), s:fdate(x.date)+unitN(x.unitId), a:num(x.amount)}));
  (S.payments||[]).forEach(x=>{ const s = staffById(x.staffId); rows.push({at:x.createdAt||0, date:x.date, ic:"wallet", cls:"out", t:`${t(x.kind==="salary"?"fromSalary":"dsAdv")} · ${s?s.name:""}`, s:fdate(x.date), a:-num(x.amount)}); });
  (S.vouchers||[]).filter(v=>!v.void).forEach(v=>{ const p = partyById(v.partyId); rows.push({at:v.createdAt||0, date:v.date, ic:v.type==="receipt"?"plus":"minus", cls:v.type==="receipt"?"in":"out", t:`${t(v.type==="receipt"?"vReceipt":"vPayment")} · ${p?p.name:""}`, s:fdate(v.date)+(v.method==="cheque"?" · "+esc(t("cheque")):""), a:(v.type==="receipt"?1:-1)*num(v.amount)}); });
  rows.sort((a,b)=> (b.date||"").localeCompare(a.date||"") || b.at-a.at);
  return rows.slice(0,6);
}
function dsHomeTop(){
  const ms = monthStartOf(today()), m = companyTotals(ms, monthEnd(ms)), td = today(), d = companyTotals(td, td);
  const st = S.staff.filter(s=>s.active!==false), came = st.filter(s=>{ const a = attOf(s.id, td); return a && a.status==="present"; }).length;
  const neg = m.profit < 0;
  const act = (k, ic, l, a, id) => `<button type="button" class="ds-act ds-${k}" data-act="${a}" ${id?`data-id="${id}"`:""}><span class="ds-ai">${icon(ic)}</span><b>${esc(l)}</b></button>`;
  const recent = dsRecent();
  return `<button type="button" class="ds-hero ${neg?"neg":""}" data-act="go" data-id="money">
      <span class="ds-hl">${neg?t("dsLossM"):t("dsProfitM")} · ${monthName(ms)}</span>
      <b class="ds-hv">${money(Math.abs(m.profit))}</b>
      <span class="ds-hs"><span><i class="ds-dot in"></i>${t("dsIn")} ${money(m.inc)}</span><span><i class="ds-dot out"></i>${t("dsOut")} ${money(m.exp+m.lab)}</span></span>
    </button>
    <div class="ds-acts">${act("exp","minus",t("dsExp"),"q","exp")}${act("inc","plus",t("dsInc"),"q","inc")}${act("snap","camera",t("dsSnap"),"snap")}${act("talk","mic",t("dsTalk"),"vxOpen")}</div>
    <div class="ds-today">
      <div><span class="label">${t("dsTodayIn")}</span><b class="pos">${money(d.inc)}</b></div>
      <div><span class="label">${t("dsTodayOut")}</span><b>${money(d.exp+d.lab)}</b></div>
      ${st.length?`<button type="button" data-act="q" data-id="att"><span class="label">${t("dsCame")}</span><b><span class="num">${came}</span><span class="sub"> / <span class="num">${st.length}</span></span></b></button>`:""}
    </div>
    <div class="panel ds-recent"><div class="ds-rh"><b>${t("dsRecent")}</b><button type="button" class="linkbtn" data-act="go" data-id="money">${t("dsAll")}</button></div>
      ${recent.length ? `<div class="list">${recent.map(r=>`<div class="row ds-r"><span class="ds-ri ${r.cls}">${icon(r.ic)}</span><div class="m"><b>${esc(r.t||"")}</b><span class="sub">${r.s||""}</span></div><b class="ds-ra ${r.cls}">${r.a<0?"−":"+"}${money(Math.abs(r.a))}</b></div>`).join("")}</div>` : `<span class="sub">${t("dsNoRecent")}</span>`}
    </div>`;
}
Object.assign(A, { vxOpen: () => { closeSheet(); if(typeof vxOpen==="function") vxOpen(); } });
{ const _home = viewHome; viewHome = function(){
    let h = _home.apply(this, arguments);
    if(!S.ready || !activeUnits().length) return h;                 // first steps keep their own guided layout
    h = h.replace(/<div class="qgrid home-q">[\s\S]*?<\/div>/, "");
    h = h.replace(/<div class="kpis">(?:\s*<div class="kpi[^"]*">[\s\S]*?<\/div>)+\s*<\/div>/, "");
    const i = h.indexOf('<div class="phead">'), e = i<0 ? -1 : h.indexOf("</div>", h.indexOf("</div>", i)+6);
    const top = dsHomeTop();
    return e<0 ? top + h : h.slice(0, e+6) + top + h.slice(e+6);
  }; }
window.addEventListener("scroll", () => { const tb = document.querySelector(".topbar"); if(tb) tb.classList.toggle("scrolled", scrollY > 4); }, {passive:true});
