
/* =====================================================================
   v21 feels like an app, every page has its own buttons.
   - The team page leads with "add a worker" (and an advance), never hidden behind +.
   - The + button does what makes sense on each page (team: add a worker; projects:
     new project), and its label says so.
   - Native touches: pages slide in, taps press in, sheets have a grab handle and
     close with a swipe down, light haptics on Android.
   ===================================================================== */
Object.assign(L, {
  nvAddWorker:["ضيف موظف","Add worker"], nvNoTeam:["ما في {staffs} لهلأ","No {staffs} yet"], nvAdvance:["سلفة","Advance"], nvPickUnit:["على أي {unit}؟","Which {unit}?"],
  nvTeamEmpty:["ضيف أول موظف، وبعدها بتسجّل دوامه وسلفه وراتبه من هون.","Add your first worker, then record their days, advances and pay from here."],
  nvNoUnitFirst:["أول إشي اعمل {unit}، وبعدها ضيف الموظفين.","Create a {unit} first, then add workers."],
});

/* put buttons in a page's header without touching how the page is built */
function nvHeadActions(h, html){
  const i = h.indexOf('<div class="phead">'); if(i<0) return h;
  const c = h.indexOf('<div class="col">', i); const e = c<0 ? -1 : h.indexOf("</div>", c);
  if(e<0) return h;
  return h.slice(0, e+6) + html + h.slice(e+6);
}
function nvTeamAdd(){
  const us = activeUnits();
  if(!us.length){ toast(tv("nvNoUnitFirst")); A.newUnit && A.newUnit(); return; }
  if(us.length===1){ S.uid = us[0].id; staffForm(); return; }
  openSheet({ title:tv("nvPickUnit"), noSave:true, html:`<div class="list">${us.map(u=>`<button type="button" class="row" data-act="nvTeamAddIn" data-id="${esc(u.id)}"><span class="tx-ic">${icon(KP(u).icon)}</span><div class="m"><b>${esc(u.name)}</b><span class="sub">${unitStaff(u.id).length} · ${esc(term("staff",true))}</span></div>${icon(LANG==="en"?"chevE":"chevS")}</button>`).join("")}</div>` });
}
Object.assign(A, {
  nvTeamAdd: () => nvTeamAdd(),
  nvTeamAddIn: id => { closeSheet(); S.uid = id; setTimeout(()=>staffForm(), 60); },
});

{ const _viewTeam = viewTeam; viewTeam = function(){
    let h = _viewTeam.apply(this, arguments);
    const has = S.staff.some(s=>s.active!==false);
    h = nvHeadActions(h, `<div class="hbtns">${has?`<button class="btn" data-act="q" data-id="adv">${icon("wallet")}${t("nvAdvance")}</button>`:""}<button class="btn primary" data-act="nvTeamAdd">${icon("plus")}${t("nvAddWorker")}</button></div>`);
    if(!has) h = h.replace(/<div class="panel empty">([\s\S]*?)<\/div>$/, `<div class="panel empty">${icon("users","big")}<b>${tv("nvNoTeam")}</b><span>${t("nvTeamEmpty")}</span><button class="btn primary" data-act="nvTeamAdd">${icon("plus")}${t("nvAddWorker")}</button></div>`);
    return h;
  }; }

/* the + button follows the page */
function nvFab(){
  const fab = document.getElementById("fab"); if(!fab) return;
  const v = S.view, map = { team:["nvTeamAdd", t("nvAddWorker"), "users"], units:["newUnit", tv("newUnit").replace(/^\+\s*/,""), "plus"] };
  const m = map[v];
  fab.dataset.act = m ? m[0] : "quick";
  fab.setAttribute("aria-label", m ? m[1] : t("whatAdd"));
  fab.classList.toggle("ctx", !!m);
  if(!activeUnits().length && S.screen==="app" && S.ready && (v==="units" || v==="home")){ fab.hidden = false; fab.dataset.act = "newUnit"; fab.setAttribute("aria-label", tv("newUnit").replace(/^\+\s*/,"")); }
}

/* pages slide in when you move between them */
let nvLastView = null;
{ const _render = render; render = function(){
    const r = _render.apply(this, arguments);
    try{
      nvFab();
      const key = S.screen + ":" + S.view + ":" + (S.view==="unit" ? S.uid : "");
      if(key!==nvLastView){ const w = document.querySelector("#app .wrap"); if(w && nvLastView!==null){ w.classList.remove("vin"); void w.offsetWidth; w.classList.add("vin"); } nvLastView = key; }
    }catch(e){}
    return r;
  }; }

/* sheets: grab handle + swipe down to close */
(function(){
  const panel = document.getElementById("sheetForm"); if(!panel) return;
  let y0 = null, dy = 0, drag = false;
  panel.addEventListener("touchstart", e => { if(panel.scrollTop>0 || e.touches.length!==1) { y0 = null; return; } const r = panel.getBoundingClientRect(); y0 = e.touches[0].clientY; drag = (y0 - r.top) < 90; dy = 0; }, {passive:true});
  panel.addEventListener("touchmove", e => { if(y0===null || !drag) return; dy = Math.max(0, e.touches[0].clientY - y0); panel.style.transform = dy ? `translateY(${dy}px)` : ""; panel.style.transition = "none"; }, {passive:true});
  panel.addEventListener("touchend", () => { if(y0===null) return; panel.style.transition = ""; if(drag && dy>110){ panel.style.transform = ""; closeSheet(); } else panel.style.transform = ""; y0 = null; drag = false; dy = 0; });
})();

/* a light tap feel on Android when a main button is pressed */
document.addEventListener("click", e => { const b = e.target.closest(".btn.primary, .nav-i, .fab, .vx-fab, .qtile"); if(b) try{ navigator.vibrate && navigator.vibrate(6); }catch(x){} }, true);
