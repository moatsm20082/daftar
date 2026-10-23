/* =====================================================================
   Point of sale (cashier screen), team roles & permissions,
   activity log, full Excel workbook export.
   ===================================================================== */
Object.assign(L, {
  pos:["نقطة بيع","Point of sale"], posSub:["كاشير سريع للمحل","Quick cashier for the shop"], posCart:["السلة","Cart"], posEmpty:["اضغط على صنف ليضاف","Tap an item to add it"],
  posPay:["ادفع {x}","Charge {x}"], posWalkIn:["زبون نقدي","Walk-in customer"], posDone:["تمّ البيع · {n}","Sale done · {n}"], posReceipt:["اطبع الإيصال","Print receipt"],
  posNew:["بيع جديد","New sale"], posSearch:["ابحث عن صنف…","Search items…"], posNoItems:["ضيف أصناف بأسعار من المخزون أو الفواتير أول.","Add items with prices from Stock or Invoices first."],
  posChange:["الباقي للزبون","Change"], posGiven:["المبلغ المستلم","Cash given"], posCustomer:["الزبون","Customer"],
  // roles
  roleManager:["مدير (كل شي)","Manager (everything)"], roleAccountant:["محاسب","Accountant"], roleCashier:["كاشير","Cashier"], roleViewer:["مشاهدة بس","View only"],
  roleMemberL:["عضو (كل شي)","Member (everything)"], roleHint:["المدير والمحاسب بيقدروا يعدّلوا كل الحسابات. الكاشير بيعمل فواتير بيع وقبض بس. المشاهدة بتشوف بدون ما تعدّل.","Managers and accountants can edit everything. A cashier only makes sales and receipts. View-only can look but not change."],
  pickRole:["شو صلاحيته؟","What can they do?"], roleSaved:["تغيّرت الصلاحية","Role changed"], noPerm:["صلاحيتك ما بتسمح بهاد","Your role doesn't allow this"],
  activity:["سجل النشاط","Activity log"], actIns:["أضاف","added"], actUpd:["عدّل","edited"], actDel:["حذف","deleted"], noActivity:["ما في نشاط لسا.","No activity yet."],
  exportXls:["صدّر كل شي Excel (شيت لكل قسم)","Export everything to Excel (one sheet per section)"],
  colNames:["{}",""],
});

/* ----- point of sale ----- */
let POS = null;
function walkInId(){ const p = S.parties.find(x=>x.walkIn); return p ? p.id : null; }
async function ensureWalkIn(){ let id = walkInId(); if(id) return id; id = newId(); return (await save("parties", id, {name:t("posWalkIn"), kind:"customer", walkIn:true, openBal:0, createdAt:Date.now()}, true)) ? id : null; }
function posOpen(){
  const items = S.items.filter(i=>num(i.price)>0);
  if(!items.length){ toast(t("posNoItems")); return; }
  POS = POS && POS.lines.length ? POS : {lines:[], q:"", partyId:""};
  posRender();
}
function posRender(){
  const q = (POS.q||"").toLowerCase(), items = S.items.filter(i=>num(i.price)>0 && (!q || String(i.name).toLowerCase().includes(q) || String(i.sku||"").toLowerCase()===q || String(i.barcode||"")===q)).sort((a,b)=>String(a.name).localeCompare(String(b.name))).slice(0,60);
  const c = invCalc({lines:POS.lines, incTax:ST().incTax});
  const custs = partyOptions("sale", POS.partyId).filter(([id])=>!(partyById(id)||{}).walkIn);
  openSheet({title:t("pos"), noSave:true, html:`
    <div class="inlinepick"><input type="search" id="posq" class="whoq" placeholder="${esc(t("posSearch"))}" value="${esc(POS.q||"")}" autocomplete="off"><button type="button" class="btn sm" data-act="bcCam" data-id="pos" aria-label="${esc(t("bcScan"))}">${icon("scan")}</button></div>
    <div class="posgrid">${items.map(i=>{ const n = stocked(i) ? qtyOf(i.id) : null; return `<button type="button" class="postile" data-act="posAdd" data-id="${esc(i.id)}"><b>${esc(i.name)}</b><span>${money(num(i.price))}</span>${n!==null?`<small class="${n<=0?"negv":""}">${t("onHand")}: ${fmt(n)}${i.unit?" "+esc(i.unit):""}</small>`:""}</button>`; }).join("")}</div>
    <span class="label">${t("posCart")}</span>
    <div class="list">${POS.lines.length ? POS.lines.map((l,i)=>`<div class="row static"><div class="m"><b>${esc(l.name)}</b><span class="sub">${money(num(l.price))}</span></div>
      <div class="qty"><button type="button" class="iconbtn sm" data-act="posQty" data-id="${i}" data-d="-1" aria-label="-">${icon("minus")}</button><b class="num">${fmt(l.qty)}</b><button type="button" class="iconbtn sm" data-act="posQty" data-id="${i}" data-d="1" aria-label="+">${icon("plus")}</button></div></div>`).join("") : `<span class="hint">${t("posEmpty")}</span>`}</div>
    ${custs.length?`<div class="field"><label for="posCust">${t("posCustomer")}</label><select id="posCust"><option value="">${esc(t("posWalkIn"))}</option>${custs.map(([v,l])=>`<option value="${esc(v)}" ${v===POS.partyId?"selected":""}>${esc(l)}</option>`).join("")}</select></div>`:""}
    <div class="kv"><div><span>${t("taxTotal")}</span><b>${money(c.tax)}</b></div></div><div class="total"><span class="label">${t("grandTotal")}</span><b>${money(c.total)}</b></div>
    <div class="field"><label for="posGiven">${t("posGiven")}</label><input id="posGiven" inputmode="decimal" placeholder="${fmt(c.total)}"><span class="hint" id="posChange"></span></div>
    ${POS.lines.length?`<div class="grid2"><button type="button" class="btn primary big" data-act="posPay" data-id="cash">${icon("wallet")}${t("cash")} · ${fmt(c.total)}</button><button type="button" class="btn big" data-act="posPay" data-id="card">${t("card")}</button><button type="button" class="btn" data-act="posPay" data-id="transfer">${t("transfer")}</button><button type="button" class="btn ghost" data-act="posClear">${t("posNew")}</button></div>`:""}`});
  const qi = document.getElementById("posq"); if(qi && POS.focusQ){ qi.focus(); try{ qi.setSelectionRange(qi.value.length, qi.value.length); }catch(_){} }
}
async function posPay(method, el){
  if(!POS || !POS.lines.length) return; if(el) el.disabled = true;
  const pid = POS.partyId || await ensureWalkIn(); if(!pid){ if(el) el.disabled = false; return; }
  const data = {type:"sale", no:nextNo("invoices","S"), partyId:pid, date:today(), dueDate:today(), lines:POS.lines.map(l=>({name:l.name, itemId:l.itemId, qty:l.qty, price:l.price, tax:l.tax, disc:0})), incTax:ST().incTax, ...(typeof loyRedeemFor==="function" ? loyRedeemFor(POS) : {discount:0}), notes:"", pos:true, given:num((document.getElementById("posGiven")||{}).value), createdAt:Date.now()};
  data.total = invCalc(data).total; const id = newId();
  if(!await save("invoices", id, data, true)){ if(el) el.disabled = false; return; }
  await saveVoucher({type:"receipt", partyId:pid, amount:data.total, date:data.date, invoiceId:id, method}, true);
  stockWarn(data); POS = {lines:[], q:"", partyId:""}; render();
  openSheet({title:t("posDone",{n:data.no}), noSave:true, html:`<div class="owe">${MARK}<span class="label">${t("grandTotal")}</span><b>${money(data.total)}</b></div>
    <div class="grid2"><button type="button" class="btn" data-act="posPrint" data-id="${esc(id)}">${icon("file")}${t("posReceipt")}</button><button type="button" class="btn primary" data-act="pos">${icon("plus")}${t("posNew")}</button></div>`});
}
/* ----- roles: what each person may change (the database enforces the same rules) ----- */
const CASHIER_COLS = ["invoices","vouchers","parties","items","cheques","appointments"];
const canWrite = col => !ROLE || ROLE==="owner" || ROLE==="member" || ROLE==="manager" || ROLE==="accountant" || (ROLE==="cashier" && CASHIER_COLS.includes(col));
const canDelete = col => !ROLE || ["owner","member","manager","accountant"].includes(ROLE);
const ROLE_L = {owner:"roleOwner", member:"roleMemberL", manager:"roleManager", accountant:"roleAccountant", cashier:"roleCashier", viewer:"roleViewer"};
const _save0 = save, _remove0 = remove;
save = async function(col,id,data,quiet){ if(!canWrite(col)){ toast(t("noPerm")); return false; } return _save0(col,id,data,quiet); };
remove = async function(col,id){ if(!canDelete(col)){ toast(t("noPerm")); return false; } return _remove0(col,id); };
async function setRole(uid, role){
  const { error } = window.DEMO_TEAM ? {error:null} : await sb.rpc("set_member_role", {p_user:uid, p_role:role});
  if(error){ toast(t("eGeneric")); return; } toast(t("roleSaved")); teamSheet();
}
async function activitySheet(){
  openSheet({title:t("activity"), noSave:true, html:`<div id="actBox"><span class="hint">${t("loading")}</span></div>`});
  const { data, error } = window.DEMO_TEAM ? {data:[], error:null} : await sb.rpc("company_activity", {p_limit:200});
  const box = document.getElementById("actBox"); if(!box) return;
  if(error){ box.innerHTML = `<span class="hint">${t("eGeneric")}</span>`; return; }
  const rows = Array.isArray(data) ? data : [];
  box.innerHTML = rows.length ? `<div class="list">${rows.map(r=>`<div class="row static"><div class="m"><b>${esc(r.email||"")}</b><span class="sub">${t(r.op==="INSERT"?"actIns":r.op==="DELETE"?"actDel":"actUpd")} · ${esc(r.col)} · <span class="ltr">${esc(String(r.at||"").slice(0,16).replace("T"," "))}</span></span></div></div>`).join("")}</div>` : `<span class="hint">${t("noActivity")}</span>`;
}

/* ----- one Excel workbook with a sheet per section (SpreadsheetML: opens in Excel, no library needed) ----- */
function exportWorkbook(){
  const x = v => String(v??"").replace(/[<>&"]/g, c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
  const sheet = (name, rows) => `<Worksheet ss:Name="${x(name).slice(0,31)}"><Table>${rows.map((r,i)=>`<Row>${r.map(v=>typeof v==="number"&&isFinite(v)?`<Cell${i?"":' ss:StyleID="h"'}><Data ss:Type="Number">${r2(v)}</Data></Cell>`:`<Cell${i?"":' ss:StyleID="h"'}><Data ss:Type="String">${x(v)}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet>`;
  const pn = id => (partyById(id)||{}).name||"", un = id => (unitById(id)||{}).name||"";
  const sh = [];
  sh.push(sheet(t("bkInv"), [[t("invNoS"),t("date"),"",t("pName"),t("subTotal"),t("taxTotal"),t("grandTotal"),t("paidL"),t("remainingL")], ...S.invoices.filter(i=>!i.void).map(i=>{ const c = invCalc(i), p = invPaid(i); return [i.no, i.date, t(INV_T[i.type]), pn(i.partyId), c.net, c.tax, c.total, p, r2(c.total-p)]; })]));
  sh.push(sheet(t("bkParties"), [[t("pName"),t("pKind"),t("pPhone"),t("pTaxNo"),t("stBal")], ...S.parties.filter(p=>!p.archived).map(p=>[p.name, t(p.kind==="supplier"?"pSupplier":p.kind==="both"?"pBoth":"pCustomer"), p.phone||"", p.taxNo||"", partyBal(p.id)])]));
  sh.push(sheet(t("bkStock"), [[t("itemName"),t("itemSku"),t("onHand"),t("avgCost"),t("stValue"),t("itemPrice")], ...S.items.map(i=>[i.name, i.sku||"", stocked(i)?qtyOf(i.id):"", avgCostOf(i.id), stocked(i)?r2(qtyOf(i.id)*avgCostOf(i.id)):"", num(i.price)])]));
  sh.push(sheet(t("vReceipt")+" / "+t("vPayment"), [[t("invNoS"),t("date"),"",t("pName"),t("vAmount"),t("vMethod")], ...S.vouchers.map(v=>[v.no, v.date, t(v.type==="receipt"?"vReceipt":"vPayment")+(v.void?" ("+t("chBounced")+")":""), pn(v.partyId), num(v.amount), t(v.method||"cash")])]));
  sh.push(sheet(t("bkCheques"), [[t("chNo"),t("chBank"),t("chDue"),t("pName"),t("vAmount"),t("status")], ...S.cheques.map(c=>[c.no, c.bank||"", c.dueDate, pn(c.partyId), num(c.amount), t(CH_ST[c.status]||"chPending")])]));
  sh.push(sheet(t("expenses"), [[t("date"),t("onWhat"),t("desc"),tv("forUnit"),t("vAmount")], ...S.expenses.map(e=>[e.date, catLabel(e.category), e.item||"", un(e.unitId), num(e.amount)])]));
  sh.push(sheet(t("income"), [[t("date"),t("fromWhat"),t("note"),tv("forUnit"),t("vAmount")], ...S.income.map(e=>[e.date, catLabel(e.category), e.note||"", un(e.unitId), num(e.amount)])]));
  const a = monthStartOf(today()), b = monthEnd(a);
  sh.push(sheet(t("salaries"), [[t("hrWho"),t("hrGross"),t("hrSSEmp"),t("hrIncTax"),t("hrAdv"),t("hrPaidAlready"),t("hrLeft")], ...S.staff.filter(s=>s.active!==false).map(s=>{ const k = account(s,a,b); return [s.name, k.earned, k.ssE, k.tax, k.adv, k.paid, k.remaining]; })]));
  const B = balances(null, today()), C = chart();
  sh.push(sheet(t("glTB"), [[t("glCode"),t("glAcc"),t("glDebit"),t("glCredit"),t("glBal")], ...[...C.keys()].sort().filter(k=>B[k].dr||B[k].cr).map(k=>[k, B[k].acc.name, B[k].dr, B[k].cr, B[k].net])]));
  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="h"><Font ss:Bold="1"/></Style></Styles>${sh.join("")}</Workbook>`;
  const el = document.createElement("a"); el.href = URL.createObjectURL(new Blob([xml],{type:"application/vnd.ms-excel"})); el.download = `daftar-${today()}.xls`; el.click(); setTimeout(()=>URL.revokeObjectURL(el.href), 4000);
}

Object.assign(A, {
  pos: () => { closeSheet(); posOpen(); },
  posAdd: id => { const i = S.items.find(x=>x.id===id); if(!i) return; const l = POS.lines.find(x=>x.itemId===id); if(l) l.qty += 1; else POS.lines.push({itemId:i.id, name:i.name, qty:1, price:num(i.price), tax:num(i.tax ?? taxRate())}); POS.focusQ = false; posRender(); },
  posQty: (id, el) => { const l = POS.lines[Number(id)]; if(!l) return; l.qty += Number(el.dataset.d); if(l.qty<=0) POS.lines.splice(Number(id),1); posRender(); },
  posClear: () => { POS = {lines:[], q:"", partyId:""}; posRender(); },
  posPay: (id, el) => posPay(id, el),
  posPrint: id => { const x = invById(id); if(x){ closeSheet(); printDoc(receiptHtml(x)); } },
  setRole: (id, el) => setRole(id, el.dataset.r), activity: () => { closeSheet(); activitySheet(); },
  exportXls: () => { closeSheet(); exportWorkbook(); },
});
document.addEventListener("input", e=>{
  if(e.target.id==="posq" && POS){ POS.q = e.target.value; POS.focusQ = true; posRender(); }
  if(e.target.id==="posGiven" && POS){ const c = invCalc({lines:POS.lines, incTax:ST().incTax}), g = num(e.target.value), el = document.getElementById("posChange"); if(el) el.innerHTML = g>c.total ? `${t("posChange")}: <b>${money(g-c.total)}</b>` : ""; }
});
document.addEventListener("change", e=>{ if(e.target.id==="posCust" && POS){ POS.partyId = e.target.value; } });
