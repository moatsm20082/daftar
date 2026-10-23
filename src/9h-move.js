/* =====================================================================
   Moving in from another program.
   Drop every Excel/CSV file the old program exported (items, customers,
   suppliers, staff, sales, purchases, expenses). Each file's kind is guessed
   from its headings and name, shown as a plan the owner can correct, then
   everything is brought in at once.

   Two ways to bring old invoices:
   - archive (default): kept for reference and search; they don't touch
     balances, stock or the books, because the opening balances and current
     quantities from the other files already include them.
   - count: they become real invoices (unpaid part = what the customer owes).
     Their lines never move stock; the current quantities came from the items file.
   ===================================================================== */
Object.assign(L, {
  mv:["انقل من برنامج ثاني","Move from another program"], mvSub:["جيب كل بياناتك من البرنامج القديم بدقائق: الأصناف والكميات، الزباين والموردين وأرصدتهم، الموظفين، الفواتير، والمصاريف.","Bring everything from your old program in minutes: items and quantities, customers and suppliers with balances, staff, invoices and expenses."],
  mvFrom:["من وين جاي؟","Where are you coming from?"], mvOther:["برنامج ثاني","Another program"], mvDesk:["برنامج على الكمبيوتر","Desktop program"], mvXls:["Excel أو دفتر ورق","Excel or a paper book"],
  mvGuide:["صدّر من برنامجك القديم كل قائمة لحالها كـ Excel: الأصناف، العملاء، الموردين، الموظفين، فواتير المبيعات، فواتير المشتريات، والمصاريف. بمعظم البرامج بتلاقي فوق كل قائمة زر «تصدير» أو Export. بعدها اختارهم كلهم هون مرة وحدة.",
    "Export each list from your old program to Excel: items, customers, suppliers, staff, sales invoices, purchase invoices and expenses. Most programs have an \"Export\" button above each list. Then pick them all here at once."],
  mvGuideXls:["إذا حساباتك على Excel أو بدفتر ورق: نزّل النماذج الجاهزة، عبّيها، وارجع اختارها هون.","If your books are in Excel or on paper: download the ready templates, fill them in, and pick them here."],
  mvTpls:["النماذج الجاهزة","Ready templates"], mvPick:["اختار الملفات (بتقدر تختار أكثر من ملف)","Choose the files (you can pick several)"],
  mvPlan:["هيك فهمنا ملفاتك. إذا في نوع غلط غيّره:","Here's how we read your files. Fix any wrong type:"], mvRows:["{n} سطر","{n} rows"], mvNew:["{n} جديد","{n} new"],
  mvSkip:["تجاهل هالملف","Skip this file"], mvUnknown:["ما عرفنا شو هاد الملف","We couldn't tell what this file is"],
  kItems:["أصناف وكميات","Items & stock"], kCust:["زباين وأرصدتهم","Customers & balances"], kSupp:["موردين وأرصدتهم","Suppliers & balances"], kStaff:["موظفين","Staff"],
  kSales:["فواتير مبيعات","Sales invoices"], kPurch:["فواتير مشتريات","Purchase invoices"], kExp:["مصاريف","Expenses"],
  mvMode:["الفواتير القديمة","Old invoices"], mvArch:["للأرشيف بس (أنصح فيها)","For reference only (recommended)"], mvCount:["احسبها بالأرصدة","Count them in balances"],
  mvArchHint:["بتضل موجودة وبتقدر تدوّر عليها، بس ما بتغيّر الأرصدة ولا المخزون، لأنه أرصدة الزباين والكميات بملفاتهم بتشملها.","They stay searchable but don't change balances or stock, because the customers' balances and item quantities already include them."],
  mvCountHint:["الباقي من كل فاتورة بيصير على الزبون أو للمورد. استخدمها إذا ما رح تنقل أرصدة الزباين والموردين.","What's left on each invoice becomes owed. Use this only if you're not moving customer and supplier balances."],
  mvNoPaid:["ملف «{x}» ما فيه عمود للمدفوع، فرح نعتبر فواتيره مش مدفوعة.","\"{x}\" has no paid column, so its invoices will count as unpaid."],
  mvGo:["انقل كل شي","Move everything"], mvWorking:["عم ننقل… {x}","Moving… {x}"], mvDone:["خلص النقل","Move complete"],
  mvSummary:["انضاف: {x}","Added: {x}"], mvAgain:["بتقدر تعيد اختيار نفس الملفات، والمكرر بنتجاهله.","You can pick the same files again; duplicates are skipped."],
  mvVideo:["شوف كيف بالفيديو","Watch how"], stArch:["أرشيف","Archive"], movedNote:["منقول من البرنامج القديم","Moved from the old program"], mvUnitName:["الشركة","Company"],
  mvAsk:["جاي من برنامج ثاني؟","Coming from another program?"], mvAskS:["انقل أصنافك وزباينك وموظفينك وفواتيرك بدقائق، بدون ما تدخّلهم من جديد.","Bring your items, customers, staff and invoices in minutes, no retyping."], mvStart:["انقل بياناتي","Move my data"],
  mvNeedFiles:["اختار ملف واحد على الأقل","Choose at least one file"], mvSuppSign:["رصيد المورد الموجب يعني إله علينا.","A positive supplier balance means we owe them."],
});

/* the extra kinds next to items / customers / suppliers / staff */
IMP.sales = {col:"invoices", inv:"sale", f:{
  no:["رقم الفاتوره","رقم الفاتورة","رقم","الرقم","invoice no","invoice number","invoice #","number","no","#","ref","reference"],
  date:["التاريخ","تاريخ الفاتوره","تاريخ الفاتورة","تاريخ الاصدار","date","invoice date","issue date"],
  party:["العميل","الزبون","اسم العميل","اسم الزبون","customer","client","customer name","client name","contact","bill to"],
  item:["الصنف","المنتج","البند","اسم الصنف","item","product","item name","product name","line item"],
  desc:["الوصف","البيان","description","details","memo"],
  qty:["الكميه","الكمية","qty","quantity"], price:["السعر","سعر الوحده","سعر الوحدة","unit price","price","rate"],
  tax:["نسبه الضريبه","نسبة الضريبة","الضريبه %","tax rate","vat rate","tax %"],
  total:["الاجمالي","الإجمالي","المجموع","الاجمالي شامل الضريبه","الإجمالي شامل الضريبة","total","grand total","total amount","amount","invoice total"],
  paid:["المدفوع","المبلغ المدفوع","المحصل","paid","amount paid","paid amount"],
  due:["تاريخ الاستحقاق","الاستحقاق","due date","due"]},
  tpl:[["رقم الفاتورة","التاريخ","العميل","الصنف","الكمية","السعر","الإجمالي","المدفوع"],["1001","2026-09-14","محل أبو سامر","سكر 1 كيلو","10","1.2","12","12"],["1002","2026-09-20","شركة النور","أرز 5 كيلو","4","6.5","26","0"]]};
IMP.purchases = {...IMP.sales, inv:"purchase", f:{...IMP.sales.f, party:["المورد","اسم المورد","المورّد","supplier","vendor","supplier name","vendor name","contact"]},
  tpl:[["رقم الفاتورة","التاريخ","المورد","الصنف","الكمية","السعر","الإجمالي","المدفوع"],["A-55","2026-09-02","مستودعات النور","سكر 1 كيلو","100","0.95","95","95"]]};
IMP.expenses = {col:"expenses", f:{
  date:["التاريخ","date"], amount:["المبلغ","القيمه","القيمة","المصروف","amount","value","total"],
  cat:["البند","الحساب","التصنيف","النوع","نوع المصروف","category","account","type","expense type"],
  desc:["الوصف","البيان","ملاحظات","description","memo","notes","details"], supplier:["المورد","الجهه","الجهة","المحل","supplier","vendor","payee"]},
  tpl:[["التاريخ","البند","الوصف","المبلغ"],["2026-09-01","إيجار","إيجار المحل لشهر 9","350"],["2026-09-05","كهرباء","فاتورة الكهرباء","62.5"]]};
IMP.suppliers.f = {...IMP.customers.f, name:["الاسم","اسم المورد","المورد","المورّد","الشركه","الشركة","name","supplier","vendor","supplier name","vendor name","company"]};
const MV_KINDS = [["items","kItems"],["customers","kCust"],["suppliers","kSupp"],["staff","kStaff"],["sales","kSales"],["purchases","kPurch"],["expenses","kExp"]];
const MV_NAME_HINT = {items:/item|product|stock|inventor|sku|صنف|اصناف|أصناف|منتج|مخزون|بضاع|مواد/i, customers:/customer|client|عميل|عملاء|زبون|زبائن|زباين/i, suppliers:/supplier|vendor|مورد|موردين|مورّد/i,
  staff:/employee|staff|payroll|موظف|موظفين|عمال|رواتب|الموارد/i, sales:/sale|invoice|مبيع|فواتير|فاتوره|فاتورة/i, purchases:/purchase|bill|مشتري|شراء/i, expenses:/expense|مصروف|مصاريف|نفقات|المصروفات/i};
/* what makes each kind recognisable (weights for the headings we found) */
const MV_W = {items:{name:2,price:2,cost:2,barcode:3,openQty:2,unit:1,sku:1}, customers:{name:2,phone:2,taxNo:1,address:1,openBal:2}, suppliers:{name:2,phone:2,taxNo:1,address:1,openBal:2},
  staff:{name:2,rate:3,role:2,rateType:3,ssNo:3}, sales:{no:3,date:2,party:3,total:2,paid:2,item:1,qty:1,price:1}, purchases:{no:3,date:2,party:3,total:2,paid:2,item:1,qty:1,price:1}, expenses:{date:2,amount:3,cat:3,desc:1,supplier:1}};
function mvGuess(head, fname){
  const H = head.map(normH), sc = {};
  Object.keys(MV_W).forEach(k=>{ const m = mapCols(head, IMP[k]); let s = 0; Object.keys(m).forEach(f=>s += MV_W[k][f]||0);
    if(["items","customers","suppliers","staff"].includes(k) && m.name==null) s = 0;
    if((k==="sales"||k==="purchases") && (m.party==null || (m.total==null && m.price==null))) s = 0;
    if(k==="expenses" && (m.amount==null || m.date==null)) s = 0;
    if(MV_NAME_HINT[k].test(fname)) s += 4;
    sc[k] = s; });
  // the party heading tells sales from purchases
  const supH = H.some(h=>/مورد|supplier|vendor/.test(h)), cusH = H.some(h=>/عميل|زبون|customer|client/.test(h));
  if(sc.sales && supH && !cusH) sc.purchases += 3; if(sc.purchases && cusH && !supH) sc.sales += 3;
  if(sc.customers && sc.suppliers && !MV_NAME_HINT.suppliers.test(fname)) sc.suppliers -= 1;
  const best = Object.entries(sc).sort((a,b)=>b[1]-a[1])[0];
  return best && best[1]>=4 ? best[0] : "";
}
/* dates: 2026-09-14, 14/09/2026, 14-9-26, Excel serials (45730) */
function mvDate(v){
  const s = toEn(String(v||"")).trim(); if(!s) return "";
  if(/^\d{5}(\.\d+)?$/.test(s)){ const d = new Date(Date.UTC(1899,11,30) + Math.floor(Number(s))*864e5); return d.toISOString().slice(0,10); }
  let m = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/.exec(s); if(m) return `${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
  m = /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/.exec(s);
  if(m){ let d = +m[1], mo = +m[2], y = +m[3]; if(y<100) y += 2000; if(mo>12 && d<=12){ const x = d; d = mo; mo = x; }   // a US-style date
    if(mo>=1 && mo<=12 && d>=1 && d<=31) return `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  const p = Date.parse(s); return isFinite(p) ? new Date(p).toISOString().slice(0,10) : "";
}
const mvNum = v => num(toEn(String(v??"")).replace(/[٬,\s]/g,"").replace(/٫/g,".").replace(/[^\d.\-]/g,""));

/* ---------------- reading the files into a plan ---------------- */
let MV = null;
async function mvReadFile(file){
  const buf = await file.arrayBuffer(), u = new Uint8Array(buf);
  return (u[0]===0x50 && u[1]===0x4b) ? await readXlsx(buf) : readCsv(new TextDecoder(/�/.test(new TextDecoder().decode(u.subarray(0,4000))) ? "windows-1256" : "utf-8").decode(u));
}
async function mvAddFiles(files){
  for(const f of files){
    if(f.size > 8*1024*1024){ MV.files.push({name:f.name, err:true}); continue; }
    let rows; try{ rows = await mvReadFile(f); }catch(e){ MV.files.push({name:f.name, err:true}); continue; }
    const hi = rows.findIndex(r=>r.filter(Boolean).length>=2), head = rows[hi] || [];
    MV.files.push({name:f.name, head, body:rows.slice(hi+1).slice(0, IMP_MAX), kind:mvGuess(head, f.name)});
  }
  mvRender();
}
/* what a file would add, without saving anything */
function mvPreview(fl){
  if(!fl.kind || !IMP[fl.kind]) return {n:0, recs:[]};
  const spec = IMP[fl.kind], map = mapCols(fl.head, spec);
  if(fl.kind==="sales" || fl.kind==="purchases") return mvInvoices(fl, map);
  if(fl.kind==="expenses") return mvExpenses(fl, map);
  if(map.name==null) return {n:0, recs:[]};
  const recs = fl.body.filter(r=>String(r[map.name]||"").trim()).map(r=>importRecord(fl.kind, r, map)).filter(Boolean);
  if(fl.kind==="suppliers") recs.forEach(r=>{ r.openBal = -r.openBal; });   // a supplier's balance is what we owe them
  const have = new Set((S[spec.col]||[]).filter(x=>fl.kind==="staff" ? x.active!==false : !x.archived).map(x=>normH(x.name)));
  const codes = new Set(S.items.map(i=>i.barcode).filter(Boolean)), fresh = [];
  recs.forEach(r=>{ const k = normH(r.name); if(have.has(k) || (r.barcode && codes.has(r.barcode))) return; have.add(k); if(r.barcode) codes.add(r.barcode); fresh.push(r); });
  return {n:fresh.length, recs:fresh, map};
}
function mvInvoices(fl, map){
  const groups = new Map(), g = (r,k) => map[k]!=null ? String(r[map[k]]??"").trim() : "";
  fl.body.forEach((r, i)=>{ const party = g(r,"party"); if(!party) return; const no = g(r,"no") || `#${i+1}`; if(!groups.has(no)) groups.set(no, []); groups.get(no).push(r); });
  const type = IMP[fl.kind].inv, seen = new Set(S.invoices.filter(x=>x.extNo).map(x=>x.type+"|"+x.extNo)), recs = [];
  groups.forEach((rows, no)=>{
    if(seen.has(type+"|"+no)) return;
    const first = rows[0], date = mvDate(g(first,"date")) || today();
    let lines = rows.map(r=>({name:(g(r,"item")||g(r,"desc")).slice(0,120), qty:mvNum(g(r,"qty"))||1, price:mvNum(g(r,"price")), tax:Math.min(50, mvNum(g(r,"tax"))), disc:0, nostock:true})).filter(l=>l.name && l.price>0);
    // an invoice spread over several rows either repeats its total/paid on each row, or gives one per line
    const per = k => { if(map[k]==null) return 0; const v = rows.map(r=>mvNum(g(r,k))); return v.every(x=>x===v[0]) ? v[0] : sum(v, x=>x); };
    const fileTotal = per("total"), paid = per("paid"), calc = invCalc({lines, incTax:false}).total;
    // the file's own total wins: if the lines don't add up to it, keep one line carrying the total
    if(!lines.length || (fileTotal && Math.abs(calc-fileTotal) > Math.max(0.05, fileTotal*0.002))){
      const tot = fileTotal || calc; if(!(tot>0)) return;
      lines = [{name:(lines.length ? lines.map(l=>l.name).slice(0,4).join("، ") : t("movedNote")).slice(0,120), qty:1, price:r2(tot), tax:0, disc:0, nostock:true}];
    }
    recs.push({type, no, date, due:mvDate(g(first,"due")) || date, party:g(first,"party").slice(0,100), lines, paid:r2(paid)});
  });
  return {n:recs.length, recs, map, noPaid: map.paid==null};
}
function mvExpenses(fl, map){
  const g = (r,k) => map[k]!=null ? String(r[map[k]]??"").trim() : "";
  const seen = new Set(S.expenses.filter(x=>x.extKey).map(x=>x.extKey)), recs = [];
  fl.body.forEach(r=>{ const amount = mvNum(g(r,"amount")), date = mvDate(g(r,"date")); if(!(amount>0) || !date) return;
    const key = [date, amount, g(r,"cat"), g(r,"desc")].join("|"); if(seen.has(key)) return; seen.add(key);
    recs.push({date, amount, cat:g(r,"cat").slice(0,40), desc:g(r,"desc").slice(0,160), supplier:g(r,"supplier").slice(0,80), key}); });
  return {n:recs.length, recs, map};
}

/* ---------------- the wizard ---------------- */
function moveSheet(){
  if(!canWrite("items")){ toast(t("noPerm")); return; }
  MV = {from:MV?.from||"other", files:[], mode:"hist", busy:false};
  openSheet({title:t("mv"), saveLabel:t("mvGo"), html:`<div id="mvBox"></div>`, submit: ()=>mvRun()});
  mvRender();
}
function mvRender(){
  const box = document.getElementById("mvBox"); if(!box || !MV) return;
  const plans = MV.files.map(fl=>({fl, p: fl.err ? {n:0} : mvPreview(fl)}));
  const hasInv = plans.some(x=>x.fl.kind==="sales"||x.fl.kind==="purchases"), total = sum(plans, x=>x.p.n||0);
  box.innerHTML = `<p class="sub">${t("mvSub")}</p>
    <button type="button" class="btn sm" data-act="mvVideo">${icon("camera")}${t("mvVideo")}</button>
    <div class="field"><span class="flabel">${t("mvFrom")}</span><div class="chips">${[["other",t("mvOther")],["desk",t("mvDesk")],["xls",t("mvXls")]].map(([v,l])=>`<label><input type="radio" name="mvfrom" value="${v}" ${MV.from===v?"checked":""}><span>${l}</span></label>`).join("")}</div>
      <span class="hint">${MV.from==="xls" ? t("mvGuideXls") : t("mvGuide")}</span></div>
    ${MV.from==="xls" ? `<div class="field"><span class="flabel">${t("mvTpls")}</span><div class="chips">${MV_KINDS.map(([k,l])=>`<button type="button" class="btn sm" data-act="mvTpl" data-id="${k}">${icon("file")}${t(l)}</button>`).join("")}</div></div>` : ""}
    <div class="field"><label for="mvFiles">${t("mvPick")}</label><input id="mvFiles" type="file" multiple accept=".xlsx,.csv,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></div>
    ${plans.length ? `<span class="flabel">${t("mvPlan")}</span><div class="list mv-plan">${plans.map(({fl,p},i)=>`<div class="row static mv-row"><span class="tx-ic">${icon(fl.err?"alert":"file")}</span>
      <div class="m"><b class="ltr-auto">${esc(fl.name)}</b><span class="sub">${fl.err ? t("impBad") : !fl.kind ? t("mvUnknown") : t("mvRows",{n:fl.body.length})+" · "+t("mvNew",{n:p.n})}</span></div>
      ${fl.err?"":`<select class="mv-kind" data-i="${i}" aria-label="${esc(fl.name)}"><option value="">${t("mvSkip")}</option>${MV_KINDS.map(([k,l])=>`<option value="${k}" ${fl.kind===k?"selected":""}>${t(l)}</option>`).join("")}</select>`}</div>`).join("")}</div>
      ${plans.some(x=>x.fl.kind==="suppliers")?`<span class="hint">${t("mvSuppSign")}</span>`:""}` : ""}
    ${hasInv ? `<div class="field"><span class="flabel">${t("mvMode")}</span><div class="chips">${[["hist",t("mvArch")],["count",t("mvCount")]].map(([v,l])=>`<label><input type="radio" name="mvmode" value="${v}" ${MV.mode===v?"checked":""}><span>${l}</span></label>`).join("")}</div>
      <span class="hint">${MV.mode==="hist" ? t("mvArchHint") : t("mvCountHint")}</span>
      ${MV.mode==="count" ? plans.filter(x=>x.p.noPaid).map(x=>`<div class="alert warn">${icon("alert")}<span>${esc(t("mvNoPaid",{x:x.fl.name}))}</span></div>`).join("") : ""}</div>` : ""}
    <div id="mvOut"></div>`;
  const sv = document.getElementById("sheetSave"); if(sv && !MV.busy){ sv.disabled = !total; sv.textContent = total ? `${t("mvGo")} · ${total}` : t("mvGo"); }
}
async function bulkSave(col, list){
  const rows = list.map(d=>({company_id:CID, col, id:d.__id || newId(), data:(({__id, ...x})=>x)(d)}));
  for(let i=0; i<rows.length; i+=200){
    const { error } = await sb.from("records").upsert(rows.slice(i, i+200), {onConflict:"company_id,col,id"});
    if(error) throw error;
    rows.slice(i, i+200).forEach(r=>applyLocal(col, r.id, r.data));
  }
  return rows.map(r=>r.id);
}
async function mvRun(){
  if(!MV || MV.busy) return false;
  const plans = MV.files.filter(fl=>!fl.err && fl.kind).map(fl=>({fl, p:mvPreview(fl)})).filter(x=>x.p.n);
  if(!plans.length){ toast(t("mvNeedFiles")); return false; }
  MV.busy = true; const sv = document.getElementById("sheetSave"); sv.disabled = true;
  const say = x => { sv.textContent = t("mvWorking",{x}); }, done = {};
  const order = ["items","customers","suppliers","staff","sales","purchases","expenses"];
  plans.sort((a,b)=>order.indexOf(a.fl.kind)-order.indexOf(b.fl.kind));
  try{
    for(const {fl, p} of plans){
      const k = fl.kind, lab = t(MV_KINDS.find(x=>x[0]===k)[1]); say(lab);
      if(k==="staff" && !activeUnits().length) await mvEnsureUnit();
      if(["items","customers","suppliers","staff"].includes(k)){
        const recs = k==="staff" ? p.recs.map(r=>({...r, unitId:r.unitId || (activeUnits()[0]||{}).id || ""})) : p.recs;
        await bulkSave(IMP[k].col, recs); done[lab] = (done[lab]||0) + recs.length; continue; }
      if(k==="expenses"){ const uid = (activeUnits()[0] || await mvEnsureUnit() || {}).id, u = unitById(uid), cats = unitCats(u, "exp").map(c=>c[0]);
        const pick = c => { const n = normH(c); return cats.find(x=>normH(catLabel(x))===n) || cats.find(x=>n && (normH(catLabel(x)).includes(n) || n.includes(normH(catLabel(x))))) || cats[cats.length-1]; };
        await bulkSave("expenses", p.recs.map(r=>({unitId:uid, category:pick(r.cat), amount:r.amount, date:r.date, item:(r.desc || r.cat).slice(0,160), supplier:r.supplier, payBy:"cash", files:[], extKey:r.key, moved:true, createdAt:Date.now()})));
        done[lab] = (done[lab]||0) + p.recs.length; continue; }
      // invoices: make sure every customer / supplier exists first
      const side = k==="sales" ? "customer" : "supplier", newParties = [];
      const byName = new Map(S.parties.filter(x=>!x.archived).map(x=>[normH(x.name), x.id]));
      p.recs.forEach(r=>{ const n = normH(r.party); if(!byName.has(n)){ const id = newId(); byName.set(n, id); newParties.push({__id:id, name:r.party, kind:side, phone:"", openBal:0, limit:0, createdAt:Date.now()}); } });
      if(newParties.length) await bulkSave("parties", newParties);
      const invs = [], vouchers = [], hist = MV.mode!=="count";
      p.recs.forEach(r=>{ const id = newId(), data = {__id:id, type:r.type, no:String(r.no).slice(0,40), extNo:r.no, partyId:byName.get(normH(r.party)), date:r.date, dueDate:r.due<r.date?r.date:r.due, lines:r.lines, storeId:MAIN_STORE, incTax:false, discount:0, notes:t("movedNote"), moved:true, hist, createdAt:Date.now()};
        data.total = invCalc(data).total; invs.push(data);
        const paid = Math.min(r.paid, data.total);
        if(!hist && paid>0.005) vouchers.push({type:r.type==="sale"?"receipt":"payment", partyId:data.partyId, amount:r2(paid), date:r.date, method:"cash", invoiceId:id, note:t("movedNote"), moved:true}); });
      await bulkSave("invoices", invs);
      if(vouchers.length){ const pre = {receipt:"RV", payment:"PV"}, base = {};
        ["receipt","payment"].forEach(tp=>{ const all = S.vouchers.map(v=>String(v.no||"")).filter(n=>n.startsWith(pre[tp]+"-")).map(n=>parseInt(n.slice(3))||0); base[tp] = all.length ? Math.max(...all) : 0; });
        await bulkSave("vouchers", vouchers.map(v=>({...v, no:`${pre[v.type]}-${String(++base[v.type]).padStart(4,"0")}`, createdAt:Date.now()}))); }
      done[lab] = (done[lab]||0) + invs.length;
    }
  }catch(e){ MV.busy = false; toast(errMsg(e)); await loadAll(); render(); mvRender(); return false; }
  MV.busy = false; render();
  const txt = Object.entries(done).map(([k,v])=>`${k} ${v}`).join("، ");
  openSheet({title:t("mvDone"), noSave:true, html:`<div class="alert good">${icon("check")}<span>${esc(t("mvSummary",{x:txt}))}</span></div><span class="hint">${t("mvAgain")}</span>
    <div class="grid2"><button type="button" class="btn primary" data-act="mvGoto" data-id="stock">${t("bkStock")}</button><button type="button" class="btn" data-act="mvGoto" data-id="parties">${t("bkParties")}</button></div>`});
  return false;
}
async function mvEnsureUnit(){
  if(activeUnits().length) return activeUnits()[0];
  const id = newId(); await save("units", id, {name:COMPANY.name || t("mvUnitName"), kind:ST().type, status:"active", startDate:today(), createdAt:Date.now()}, true);
  return unitById(id);
}

/* a one-time card for a fresh company: "coming from another program?" */
function moveHomeCard(){
  if(lsGet("mvHide_"+CID, 0) || !canWrite("items") || S.items.length || S.parties.filter(p=>!p.walkIn).length || S.invoices.length) return "";
  return `<div class="panel grow push-card"><span class="tx-ic">${icon("upload")}</span><div class="col"><b>${t("mvAsk")}</b><span class="sub">${t("mvAskS")}</span></div>
    <div class="row-btns"><button class="btn sm primary" data-act="move">${t("mvStart")}</button><button class="btn sm ghost" data-act="mvHide">${t("pushLater")}</button></div></div>`;
}
Object.assign(A, {
  mvHide: () => { lsSet("mvHide_"+CID, 1); render(); },
  move: () => { closeSheet(); moveSheet(); },
  mvGoto: id => { closeSheet(); S.view = "money"; S.btab = id; scrollTo(0,0); render(); },
  mvTpl: id => { IMPS = {kind:id}; impTemplate(); },
  mvVideo: () => { const a = document.createElement("a"); a.href = "/#move"; a.target = "_blank"; a.rel = "noopener"; a.click(); },
});
document.addEventListener("change", async e=>{
  if(!MV) return;
  if(e.target.id==="mvFiles" && e.target.files && e.target.files.length){ const fs = [...e.target.files]; e.target.value = ""; await mvAddFiles(fs); }
  else if(e.target.classList && e.target.classList.contains("mv-kind")){ const fl = MV.files[+e.target.dataset.i]; if(fl){ fl.kind = e.target.value; mvRender(); } }
  else if(e.target.name==="mvmode"){ MV.mode = e.target.value; mvRender(); }
  else if(e.target.name==="mvfrom"){ MV.from = e.target.value; mvRender(); }
});
