/* =====================================================================
   Inventory: warehouses, stock from invoices, adjustments, transfers,
   stock counts, average cost, low-stock alerts.
   ===================================================================== */
Object.assign(L, {
  bkStock:["المخزون","Stock"], stores:["المستودعات","Warehouses"], storeMain:["المستودع الرئيسي","Main warehouse"], storeNew:["مستودع جديد","New warehouse"], storeName:["اسم المستودع","Warehouse name"],
  allStores:["كل المستودعات","All warehouses"], onHand:["الكمية","On hand"], stValue:["قيمة المخزون","Stock value"], avgCost:["متوسط التكلفة","Average cost"], lowStock:["قرب يخلص","Low"],
  minQty:["حد التنبيه","Alert below"], openQty:["الكمية الافتتاحية","Opening quantity"], isService:["نوعه","Type"], kProduct:["منتج بمخزون","Stocked product"], kService:["خدمة (بدون مخزون)","Service (no stock)"],
  smNew:["حركة مخزون","Stock movement"], smType:["شو صار؟","What happened?"], smIn:["زيادة","Add"], smOut:["نقص / تالف","Remove / damaged"], smMove:["نقل لمستودع ثاني","Transfer"], smCount:["جرد","Stock count"],
  smQty:["الكمية","Quantity"], smActual:["الكمية الفعلية بالمستودع","Actual quantity counted"], smTo:["لوين؟","To which warehouse?"], smFrom:["من أي مستودع؟","From which warehouse?"],
  smSaved:["انحفظت حركة المخزون","Stock movement saved"], eItem:["اختار الصنف","Pick an item"], eStores:["اختار مستودعين مختلفين","Pick two different warehouses"],
  movements:["الحركات","Movements"], noStock:["ما في أصناف بمخزون لسا. ضيف صنف، أو اعمل فاتورة شراء وبتنضاف الأصناف لحالها.","No stocked items yet. Add an item, or record a purchase bill and items are added for you."],
  aLowStock:["أصناف قربت تخلص: {n}","Items running low: {n}"], wNoStock:["انتبه: {x} ما بيكفي بالمستودع (موجود {n})","Heads up: not enough {x} in stock ({n} left)"],
  invStore:["من أي مستودع؟","Which warehouse?"], smCountDiff:["الفرق: {x}","Difference: {x}"], mvInv:["فاتورة","Invoice"], mvAdj:["تعديل","Adjustment"], mvTr:["نقل","Transfer"], mvOpen:["افتتاحي","Opening"],
});
["stores","stockmoves"].forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

const MAIN_STORE = "main";
const storeList = () => [{id:MAIN_STORE, name:t("storeMain")}, ...S.stores.filter(s=>!s.archived && s.id!==MAIN_STORE).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0))];
const storeName = id => (storeList().find(s=>s.id===id) || {name:t("storeMain")}).name;
const itemByName = n => { const k = String(n||"").trim().toLowerCase(); return k ? S.items.find(i=>String(i.name).trim().toLowerCase()===k) : null; };
const itemOf = l => (l.itemId && S.items.find(i=>i.id===l.itemId)) || itemByName(l.name);
const stocked = i => i && !i.service;
const invStockSign = tp => tp==="sale" ? -1 : tp==="saleReturn" ? 1 : tp==="purchase" ? 1 : tp==="purchaseReturn" ? -1 : 0;
/* every stock movement, from invoices, manual moves and opening quantities */
function stockMoves(itemId){
  const out = [];
  const it = S.items.find(i=>i.id===itemId);
  if(it && num(it.openQty)) out.push({date:it.openDate||"0000-00-00", store:MAIN_STORE, qty:num(it.openQty), kind:"open", cost:num(it.cost)});
  liveInv().forEach(x=>{ const sg = invStockSign(x.type); if(!sg) return; const c = invCalc(x);
    c.rows.forEach(l=>{ const i = itemOf(l); if(!i || i.id!==itemId || !stocked(i)) return;
      out.push({date:x.date, store:x.storeId||MAIN_STORE, qty:sg*num(l.qty), kind:"inv", ref:x, unit: num(l.qty) ? l.netA/num(l.qty) : 0}); }); });
  S.stockmoves.filter(m=>m.itemId===itemId).forEach(m=>{
    if(m.type==="transfer"){ out.push({date:m.date, store:m.storeId||MAIN_STORE, qty:-num(m.qty), kind:"tr", ref:m}); out.push({date:m.date, store:m.toStoreId||MAIN_STORE, qty:num(m.qty), kind:"tr", ref:m}); }
    else out.push({date:m.date, store:m.storeId||MAIN_STORE, qty:num(m.qty), kind:"adj", ref:m});
  });
  return out.sort((a,b)=>(a.date||"").localeCompare(b.date||""));
}
function qtyOf(itemId, storeId){ return r2(sum(stockMoves(itemId).filter(m=>!storeId || m.store===storeId), m=>m.qty)); }
function avgCostOf(itemId){
  const it = S.items.find(i=>i.id===itemId); if(!it) return 0;
  let q = num(it.openQty), v = num(it.openQty)*num(it.cost);
  liveInv().filter(x=>x.type==="purchase").forEach(x=>invCalc(x).rows.forEach(l=>{ const i = itemOf(l); if(i && i.id===itemId){ q += num(l.qty); v += l.netA; } }));
  return q>0 ? v/q : num(it.cost);
}
const lowItems = () => S.items.filter(i=>stocked(i) && num(i.minQty)>0 && qtyOf(i.id)<=num(i.minQty));

/* ----- stock page ----- */
function viewStock(){
  const st = S.sstore || "", q = (S.sq||"").trim().toLowerCase();
  const items = S.items.filter(stocked).filter(i=>!q || [i.name,i.sku].some(v=>String(v||"").toLowerCase().includes(q))).map(i=>{ const n = qtyOf(i.id, st||null), c = avgCostOf(i.id); return {i, n, c, v:n*c}; })
    .sort((a,b)=>String(a.i.name).localeCompare(String(b.i.name)));
  const stores = storeList();
  let h = `<div class="kpis three"><div class="kpi"><span class="label">${t("stValue")}</span><b>${money(sum(items,x=>Math.max(0,x.v)))}</b></div><div class="kpi"><span class="label">${t("items")}</span><b class="num">${items.length}</b></div><div class="kpi ${lowItems().length?"neg":""}"><span class="label">${t("lowStock")}</span><b class="num">${lowItems().length}</b></div></div>`;
  h += `<div class="chiprow">${[["",t("allStores")],...stores.map(s=>[s.id,s.name])].map(([k,l])=>`<button class="chipbtn" data-act="sstore" data-id="${esc(k)}" aria-pressed="${st===k}">${esc(l)}</button>`).join("")}<button class="chipbtn add" data-act="storesSheet">${icon("gear")}${t("stores")}</button></div>`;
  h += `<div class="two"><button class="btn" data-act="newItem">${icon("plus")}${t("itemNew")}</button><button class="btn" data-act="smNew">${icon("route")}${t("smNew")}</button></div>`;
  h += `<div class="panel"><div class="searchrow"><input id="sq" type="search" placeholder="${esc(t("qSearchName"))}" value="${esc(S.sq||"")}" autocomplete="off"></div>`;
  if(!items.length) return h + `<span class="hint">${t("noStock")}</span></div>`;
  return h + `<div class="list">${items.map(({i,n,c,v})=>{ const low = num(i.minQty)>0 && qtyOf(i.id)<=num(i.minQty);
    return `<button class="row" data-act="viewItem" data-id="${esc(i.id)}"><span class="tx-ic">${icon("tag")}</span><div class="m"><b>${esc(i.name)}</b><span class="sub">${i.sku?esc(i.sku)+" · ":""}${t("avgCost")} ${fmt(c)}${low?` · <span class="negv">${t("lowStock")}</span>`:""}</span></div>
      <div class="col end"><b class="${n<0?"negv":""}"><span class="num">${fmt(n)}</span> ${esc(i.unit||"")}</b><span class="sub">${money(Math.max(0,v))}</span></div></button>`; }).join("")}</div></div>`;
}
function itemSheet(id){
  const i = S.items.find(x=>x.id===id); if(!i) return;
  const mv = stockMoves(id), c = avgCostOf(id);
  openSheet({title:i.name, noSave:true, html:`
    <div class="kv">${storeList().map(s=>`<div><span>${esc(s.name)}</span><b class="num">${fmt(qtyOf(id,s.id))} ${esc(i.unit||"")}</b></div>`).join("")}
      <div><span>${t("avgCost")}</span><b>${money(c)}</b></div><div><span>${t("itemPrice")}</span><b>${money(num(i.price))}</b></div></div>
    <div class="total"><span class="label">${t("onHand")}</span><b>${fmt(qtyOf(id))} ${esc(i.unit||"")} · ${money(qtyOf(id)*c)}</b></div>
    <div class="grid2"><button type="button" class="btn primary" data-act="smNew" data-id="${esc(id)}">${icon("route")}${t("smNew")}</button><button type="button" class="btn" data-act="editItem" data-id="${esc(id)}">${icon("gear")}${t("edit")}</button></div>
    <span class="label">${t("movements")}</span>
    <div class="list">${mv.slice(-40).reverse().map(m=>`<div class="row static"><div class="m"><b>${m.kind==="inv"?esc(t(INV_T[m.ref.type])+" "+(m.ref.no||"")):m.kind==="tr"?t("mvTr"):m.kind==="open"?t("mvOpen"):esc(m.ref.note||t("mvAdj"))}</b><span class="sub">${m.date&&m.date!=="0000-00-00"?fdate(m.date)+" · ":""}${esc(storeName(m.store))}</span></div><b class="${m.qty<0?"negv":"pos"}">${m.qty>0?"+":""}${fmt(m.qty)}</b></div>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div>`});
}
function stockMoveForm(itemId){
  const stores = storeList(), items = S.items.filter(stocked).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  if(!items.length){ toast(t("noStock")); return; }
  openSheet({title:t("smNew"), saveLabel:t("record"),
    fields:[{name:"itemId",label:t("lnItem"),type:"select",options:[["",""],...items.map(i=>[i.id,i.name])],value:itemId||""},
      {name:"type",label:t("smType"),type:"chips",options:[["in",t("smIn")],["out",t("smOut")],["count",t("smCount")],...(stores.length>1?[["transfer",t("smMove")]]:[])],value:"in"},
      {name:"qty",label:t("smQty"),type:"money",big:true,value:"",hint:""},
      ...(stores.length>1?[{name:"storeId",label:t("smFrom"),type:"select",options:stores.map(s=>[s.id,s.name]),value:S.sstore||MAIN_STORE},{name:"toStoreId",label:t("smTo"),type:"select",options:stores.map(s=>[s.id,s.name]),value:(stores[1]||{}).id||MAIN_STORE}]:[])],
    more:[{name:"date",label:t("date"),type:"date",value:today()},{name:"note",label:t("note"),value:"",max:120}],
    submit: async v=>{
      const it = S.items.find(i=>i.id===v.itemId); if(!it){ toast(t("eItem")); return false; }
      const store = v.storeId || MAIN_STORE, q = num(v.qty), date = validDate(v.date)?v.date:today();
      let data;
      if(v.type==="transfer"){ if(q<=0){ toast(t("eAmount")); return false; } if(v.toStoreId===store){ toast(t("eStores")); return false; }
        data = {type:"transfer", itemId:it.id, qty:q, storeId:store, toStoreId:v.toStoreId||MAIN_STORE}; }
      else if(v.type==="count"){ const now = qtyOf(it.id, store), d = r2(q - now); if(!d){ closeSheet(); toast(t("smSaved")); return true; } data = {type:"count", itemId:it.id, qty:d, storeId:store, counted:q}; }
      else { if(q<=0){ toast(t("eAmount")); return false; } data = {type:"adjust", itemId:it.id, qty: v.type==="out" ? -q : q, storeId:store}; }
      const ok = await save("stockmoves", null, {...data, date, note:(v.note||"").slice(0,120), createdAt:Date.now()});
      if(ok) toast(t("smSaved")); return ok;
    }});
  smHint();
}
function smHint(){
  const el = document.getElementById("f_qty_hint"); if(!el) return;
  const tp = (document.querySelector('#sheetBody [name="type"]:checked')||{}).value, it = (document.getElementById("f_itemId")||{}).value, st = (document.getElementById("f_storeId")||{}).value || MAIN_STORE;
  const lab = document.querySelector('label[for="f_qty"]'); if(lab) lab.textContent = tp==="count" ? t("smActual") : t("smQty");
  const to = document.getElementById("f_toStoreId"); if(to) to.closest(".field").hidden = tp!=="transfer";
  if(!it){ el.innerHTML = ""; return; }
  const now = qtyOf(it, st), q = num((document.getElementById("f_qty")||{}).value);
  el.innerHTML = `${t("onHand")}: <b class="num">${fmt(now)}</b>${tp==="count" && (document.getElementById("f_qty")||{}).value!=="" ? " · "+t("smCountDiff",{x:`<span class="num">${(q-now>0?"+":"")+fmt(q-now)}</span>`}) : ""}`;
}
function storesSheet(){
  openSheet({title:t("stores"), saveLabel:t("add"), html:`<div class="list">${storeList().map(s=>`<div class="row static"><span class="tx-ic">${icon("building")}</span><div class="m"><b>${esc(s.name)}</b><span class="sub">${t("stValue")} ${money(sum(S.items.filter(stocked),i=>Math.max(0,qtyOf(i.id,s.id))*avgCostOf(i.id)))}</span></div></div>`).join("")}</div>`,
    fields:[{name:"name",label:t("storeNew"),value:"",max:60,ph:t("storeName")}],
    submit: async v=>{ if(!v.name){ toast(t("ePartyName")); return false; } if(await save("stores", null, {name:v.name.slice(0,60), createdAt:Date.now()}, true)){ toast(t("added",{x:v.name})); setTimeout(storesSheet,30); return true; } return false; }});
}
function stockWarn(inv){
  if(inv.type!=="sale" && inv.type!=="purchaseReturn") return;
  for(const l of inv.lines||[]){ const i = itemOf(l); if(!stocked(i)) continue; const n = qtyOf(i.id, inv.storeId||MAIN_STORE);
    if(n < 0){ toast(t("wNoStock",{x:i.name, n:fmt(n + num(l.qty))})); return; } }
}

Object.assign(A, {
  sstore: id => { S.sstore = id; render(); },
  viewItem: id => itemSheet(id), smNew: id => { closeSheet(); stockMoveForm(id||""); }, storesSheet: () => storesSheet(),
});
document.addEventListener("input", e=>{ if(e.target.id==="f_qty" && document.querySelector('#sheetBody [name="toStoreId"], #sheetBody [name="type"][value="count"]')) smHint();
  if(e.target.id==="sq"){ S.sq = e.target.value; const pos = e.target.selectionStart; render(); const el = document.getElementById("sq"); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } } });
document.addEventListener("change", e=>{ if(["type","itemId","storeId"].includes(e.target.name) && document.querySelector('#sheetBody [name="type"][value="count"]')) smHint(); });
