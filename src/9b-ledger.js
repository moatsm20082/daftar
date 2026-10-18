/* =====================================================================
   General ledger: chart of accounts, journal entries built automatically
   from everything in the app (double entry), manual journals,
   trial balance, income statement, balance sheet, account ledger.
   ===================================================================== */
Object.assign(L, {
  bkGl:["المحاسبة","Accounting"], glTree:["شجرة الحسابات","Chart of accounts"], glJournal:["القيود","Journal"], glTB:["ميزان المراجعة","Trial balance"], glIS:["قائمة الدخل","Income statement"], glBS:["الميزانية","Balance sheet"],
  glNewJ:["قيد يدوي","Manual entry"], glAcc:["الحساب","Account"], glDebit:["مدين","Debit"], glCredit:["دائن","Credit"], glTotal:["المجموع","Total"], glBal:["الرصيد","Balance"],
  glUnbal:["القيد مش موزون: المدين {d} والدائن {c}","Entry doesn't balance: debit {d}, credit {c}"], glSaved:["انحفظ القيد","Entry saved"], glLines2:["لازم سطرين عالأقل بمبالغ","At least two lines with amounts"],
  glNewAcc:["حساب جديد","New account"], glAccName:["اسم الحساب","Account name"], glParent:["تحت أي حساب؟","Under which account?"], glCode:["الرقم","Code"],
  glAssets:["الأصول","Assets"], glLiab:["الخصوم","Liabilities"], glEquity:["حقوق الملكية","Equity"], glRev:["الإيرادات","Revenue"], glExp:["المصاريف","Expenses"],
  glNetProfit:["صافي الربح","Net profit"], glNetLoss:["صافي الخسارة","Net loss"], glCurProfit:["أرباح الفترة","Profit for the period"], glLE:["الخصوم وحقوق الملكية","Liabilities & equity"],
  glBalanced:["الميزانية موزونة","Balanced"], glAuto:["تلقائي","Auto"], glManual:["يدوي","Manual"], glAsOf:["لغاية {d}","As of {d}"], glFromTo:["من {a} لـ {b}","{a} to {b}"],
  glHint:["كل حركة بتسجّلها (فاتورة، قبض، صرف، مصروف، راتب، شيك) بتعمل قيدها هون لحالها، فما بتحتاج تعرف محاسبة. القيد اليدوي للحالات الخاصة بس.","Every move you record (invoice, receipt, payment, expense, wage, cheque) posts its own entry here, so no accounting knowledge needed. Manual entries are for special cases only."],
  glExport:["صدّر الميزان Excel","Export trial balance (Excel)"], glLedgerOf:["حركة حساب: {x}","Ledger: {x}"], glOpening:["رصيد افتتاحي","Opening balance"],
  // default accounts
  a1:["الأصول","Assets"], a11:["الصندوق (كاش)","Cash"], a12:["البنك","Bank"], a13:["ذمم الزباين","Accounts receivable"], a14:["المخزون","Inventory"], a15:["شيكات برسم التحصيل","Cheques to collect"], a16:["ضريبة المشتريات (مدخلات)","Input tax"], a17:["سلف الموظفين","Staff advances"],
  a2:["الخصوم","Liabilities"], a21:["ذمم الموردين","Accounts payable"], a22:["شيكات آجلة الدفع","Post-dated cheques payable"], a23:["ضريبة المبيعات المستحقة","Sales tax payable"], a24:["رواتب مستحقة","Wages payable"], a25:["الضمان الاجتماعي المستحق","Social security payable"], a26:["ضريبة دخل مقتطعة","Income tax withheld"],
  a3:["حقوق الملكية","Equity"], a31:["رأس المال","Capital"], a32:["جاري الشركاء","Owners' drawings"], a33:["أرصدة افتتاحية","Opening balances"],
  a4:["الإيرادات","Revenue"], a41:["المبيعات","Sales"], a42:["مردودات المبيعات","Sales returns"], a43:["إيرادات المشاريع والخدمات","Project & service income"],
  a5:["المصاريف","Expenses"], a51:["تكلفة البضاعة المباعة","Cost of goods sold"], a52:["الرواتب والأجور","Wages & salaries"], a53:["مصاريف التشغيل","Operating expenses"], a54:["عمولات التطبيقات","App commissions"], a55:["فروقات جرد المخزون","Stock count differences"], a56:["حصة الشركة بالضمان","Employer social security"], a57:["مشتريات خدمات ومواد","Purchased services & supplies"],
});
["journals","accounts"].forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

const ACC_BASE = [["1",null,"A"],["11","1"],["12","1"],["13","1"],["14","1"],["15","1"],["16","1"],["17","1"],
  ["2",null,"L"],["21","2"],["22","2"],["23","2"],["24","2"],["25","2"],["26","2"],
  ["3",null,"E"],["31","3"],["32","3"],["33","3"],
  ["4",null,"R"],["41","4"],["42","4"],["43","4"],
  ["5",null,"X"],["51","5"],["52","5"],["53","5"],["54","5"],["55","5"],["56","5"],["57","5"]];
/* the full chart: base accounts + one sub-account per expense category + the user's own accounts */
function chart(){
  const m = new Map();
  ACC_BASE.forEach(([code,parent])=>m.set(code, {code, parent, name:t("a"+code), base:true}));
  const cats = new Set(S.expenses.map(x=>x.category).filter(Boolean)); let n = 1;
  [...cats].sort().forEach(c=>{ const code = "53"+String(n++).padStart(2,"0"); m.set(code, {code, parent:"53", name:catLabel(c), cat:c}); });
  S.accounts.filter(a=>!a.archived).forEach(a=>m.set(a.code, {code:a.code, parent:a.parent, name:a.name, id:a.id, custom:true}));
  return m;
}
const accRoot = code => String(code)[0];
const accSide = code => ["1","5"].includes(accRoot(code)) ? 1 : -1;   // normal debit balance for assets & expenses
const catAcc = (C, cat) => { for(const a of C.values()) if(a.cat===cat) return a.code; return "53"; };
const payAcc = m => m==="cash" || !m ? "11" : "12";
/* every journal entry, derived from the data (never stored), plus manual ones */
function journal(){
  const C = chart(), out = [];
  const E = (date, ref, txt, lines, auto=true) => { const ls = lines.filter(l=>Math.abs(l[1])>0.004); if(ls.length) out.push({date, ref, txt, auto, lines:ls.map(([acc,amt,note])=>({acc, dr:amt>0?r2(amt):0, cr:amt<0?r2(-amt):0, note}))}); };
  // party opening balances
  S.parties.forEach(p=>{ const b = num(p.openBal); if(b) E(p.openDate||"0000-01-01", p, `${t("glOpening")} · ${p.name}`, b>0 ? [["13",b],["33",-b]] : [["33",-b],["21",b]]); });
  // stock opening
  S.items.forEach(i=>{ const v = num(i.openQty)*num(i.cost); if(v && !i.service) E(i.openDate||"0000-01-01", i, `${t("glOpening")} · ${i.name}`, [["14",v],["33",-v]]); });
  // invoices
  liveInv().forEach(x=>{ const c = invCalc(x), p = (partyById(x.partyId)||{}).name||"", txt = `${t(INV_T[x.type])} ${x.no||""} · ${p}`;
    let stockCost = 0, stockBuy = 0, other = 0;
    c.rows.forEach(l=>{ const i = itemOf(l); if(stocked(i)){ stockCost += num(l.qty)*avgCostOf(i.id); stockBuy += l.netA; } else other += l.netA; });
    if(x.type==="sale") E(x.date, x, txt, [["13",c.total],["41",-c.net],["23",-c.tax],["51",stockCost],["14",-stockCost]]);
    else if(x.type==="saleReturn") E(x.date, x, txt, [["42",c.net],["23",c.tax],["13",-c.total],["14",stockCost],["51",-stockCost]]);
    else if(x.type==="purchase") E(x.date, x, txt, [["14",stockBuy],["57",other],["16",c.tax],["21",-c.total]]);
    else if(x.type==="purchaseReturn") E(x.date, x, txt, [["21",c.total],["14",-stockBuy],["57",-other],["16",-c.tax]]);
  });
  // receipts & payments, cheques
  liveVouch().forEach(v=>{ const p = (partyById(v.partyId)||{}).name||"", a = num(v.amount), ch = S.cheques.find(c=>c.voucherId===v.id);
    const txt = `${t(v.type==="receipt"?"vReceipt":"vPayment")} ${v.no||""} · ${p}`;
    if(v.type==="receipt") E(v.date, v, txt, [[v.method==="cheque"?"15":payAcc(v.method), a],["13",-a]]);
    else E(v.date, v, txt, [["21",a],[v.method==="cheque"?"22":payAcc(v.method), -a]]);
    if(ch && ch.status==="cleared") E(ch.statusAt||ch.dueDate||v.date, ch, `${t("cheque")} ${ch.no||""} · ${t("chCleared")}`, ch.dir==="in" ? [["12",a],["15",-a]] : [["22",a],["12",-a]]);
  });
  // project expenses & income, app commissions
  S.expenses.forEach(x=>{ const a = num(x.amount); E(x.date, x, `${catLabel(x.category)}${x.item?" · "+x.item:""}`, [[catAcc(C,x.category), a],[payAcc(x.payBy), -a]]); });
  S.income.forEach(x=>{ const a = num(x.amount), cm = commOf(x); E(x.date, x, `${catLabel(x.category)}${x.note?" · "+x.note:""}`, [[payAcc(x.payBy), a-cm],["54",cm],["43",-a]]); });
  // wages earned (by attendance) and paid
  const ssOn = typeof ssEmpRate==="function";
  const wageDay = (date, ref, s, w) => { const ee = ssOn && s && s.ss ? w*ssEmpRate() : 0, er = ssOn && s && s.ss ? w*ssErRate() : 0, tx = s && num(s.taxMonthly) ? num(s.taxMonthly)/workDaysMonth(date) : 0;
    E(date, ref, `${t("a52")} · ${(s||{}).name||""}`, [["52",w],["24",-(w-ee-tx)],["25",-ee],["26",-tx],["56",er],["25",-er]]); };
  S.attendance.filter(came).forEach(x=>wageDay(x.date, x, staffById(x.staffId), dayPay(x).total));
  S.leaves.filter(l=>l.type!=="unpaid").forEach(l=>{ const s = staffById(l.staffId); if(!s) return; for(let d=l.from; d<=l.to; d=addDays(d,1)){ if(!isOff(d) && !attOf(s.id,d)) wageDay(d, l, s, dayRate(s,d)); } });
  S.payments.forEach(x=>{ const a = num(x.amount); E(x.date, x, `${x.kind==="salary"?t("fromSalary"):t("advance")} · ${(staffById(x.staffId)||{}).name||""}`, [["24",a],[payAcc(x.payBy), -a]]); });
  // stock adjustments & counts (transfers don't change value)
  S.stockmoves.filter(m=>m.type!=="transfer").forEach(m=>{ const v = num(m.qty)*avgCostOf(m.itemId); E(m.date, m, `${m.type==="count"?t("smCount"):t("mvAdj")} · ${(S.items.find(i=>i.id===m.itemId)||{}).name||""}`, [["14",v],["55",-v]]); });
  // manual
  S.journals.forEach(j=>out.push({date:j.date, ref:j, txt:j.note||t("glManual"), auto:false, no:j.no, lines:(j.lines||[]).map(l=>({acc:l.acc, dr:r2(num(l.dr)), cr:r2(num(l.cr)), note:l.note||""}))}));
  return out.sort((a,b)=>(a.date||"").localeCompare(b.date||""));
}
/* balances by account for a date range (b = up to, a = from; balance sheet uses only b) */
function balances(a, b){
  const C = chart(), bal = {}; C.forEach((_,k)=>bal[k]={dr:0,cr:0});
  journal().filter(e=>(!a || e.date>=a) && (!b || e.date<=b)).forEach(e=>e.lines.forEach(l=>{ if(!bal[l.acc]) bal[l.acc] = {dr:0,cr:0}; bal[l.acc].dr += l.dr; bal[l.acc].cr += l.cr; }));
  // roll up into parents
  const kids = code => [...C.values()].filter(x=>x.parent===code).map(x=>x.code);
  const roll = code => { const k = kids(code); if(!k.length) return bal[code]||{dr:0,cr:0}; const s = {dr:(bal[code]||{}).dr||0, cr:(bal[code]||{}).cr||0}; k.forEach(c=>{ const x = roll(c); s.dr += x.dr; s.cr += x.cr; }); return s; };
  const out = {}; C.forEach((acc,k)=>{ const x = roll(k); out[k] = {acc, dr:r2(x.dr), cr:r2(x.cr), net:r2((x.dr-x.cr)*accSide(k))}; });
  return out;
}

/* ----- the accounting page ----- */
function viewLedger(){
  const g = S.gtab || "is";
  if(!S.gend) S.gend = today(); if(!S.gstart) S.gstart = `${today().slice(0,4)}-01-01`;
  let h = `<div class="chiprow">${[["is",t("glIS")],["bs",t("glBS")],["tb",t("glTB")],["j",t("glJournal")],["tree",t("glTree")]].map(([k,l])=>`<button class="chipbtn" data-act="gtab" data-id="${k}" aria-pressed="${g===k}">${l}</button>`).join("")}</div>`;
  h += `<div class="panel daterow"><label>${LANG==="en"?"From":"من"}<input type="date" id="gstart" value="${esc(S.gstart)}"></label><label>${LANG==="en"?"To":"لـ"}<input type="date" id="gend" value="${esc(S.gend)}"></label></div>`;
  if(g==="tree") return h + viewTree();
  if(g==="j") return h + viewJournal();
  if(g==="tb") return h + viewTB();
  if(g==="bs") return h + viewBS();
  return h + viewIS();
}
const accRow = (k, b, lvl=1, strong=false) => `<button class="row arow lvl${lvl}" data-act="accLedger" data-id="${esc(k)}"><div class="m"><b class="${strong?"":"wn"}"><span class="num code">${esc(k)}</span> ${esc(b.acc.name)}</b></div><b class="${b.net<0?"negv":""}">${money(b.net)}</b></button>`;
function viewIS(){
  const B = balances(S.gstart, S.gend), C = chart();
  const kids = p => [...C.values()].filter(a=>a.parent===p).map(a=>a.code).filter(k=>B[k] && (B[k].dr||B[k].cr));
  const rev = B["4"].net, exp = B["5"].net, np = r2(rev-exp);
  return `<div class="panel"><span class="label">${t("glIS")} · ${t("glFromTo",{a:fdate(S.gstart),b:fdate(S.gend)})}</span>
    <div class="list">${accRow("4",B["4"],0,true)}${kids("4").map(k=>accRow(k,B[k])).join("")}</div>
    <div class="list">${accRow("5",B["5"],0,true)}${kids("5").map(k=>accRow(k,B[k])+[...C.values()].filter(a=>a.parent===k && B[a.code] && (B[a.code].dr||B[a.code].cr)).map(a=>accRow(a.code,B[a.code],2)).join("")).join("")}</div>
    <div class="total"><span class="label">${np<0?t("glNetLoss"):t("glNetProfit")}</span><b class="${np<0?"negv":"pos"}">${money(Math.abs(np))}</b></div></div>`;
}
function viewBS(){
  const B = balances(null, S.gend), C = chart();
  const kids = p => [...C.values()].filter(a=>a.parent===p).map(a=>a.code).filter(k=>B[k] && (B[k].dr||B[k].cr));
  const profit = r2(B["4"].net - B["5"].net), A = B["1"].net, Lb = B["2"].net, Eq = r2(B["3"].net + profit), ok = Math.abs(A-(Lb+Eq))<0.02;
  return `<div class="panel"><span class="label">${t("glBS")} · ${t("glAsOf",{d:fdate(S.gend)})}</span>
    <div class="list">${accRow("1",B["1"],0,true)}${kids("1").map(k=>accRow(k,B[k])).join("")}</div>
    <div class="total"><span class="label">${t("glAssets")}</span><b>${money(A)}</b></div>
    <div class="list">${accRow("2",B["2"],0,true)}${kids("2").map(k=>accRow(k,B[k])).join("")}</div>
    <div class="list">${accRow("3",B["3"],0,true)}${kids("3").map(k=>accRow(k,B[k])).join("")}<div class="row static"><div class="m"><b class="wn">${t("glCurProfit")}</b></div><b class="${profit<0?"negv":""}">${money(profit)}</b></div></div>
    <div class="total"><span class="label">${t("glLE")}</span><b>${money(Lb+Eq)}</b></div>
    <span class="pill ${ok?"good":"bad"} self-start">${ok?icon("check")+t("glBalanced"):t("glUnbal",{d:fmt(A),c:fmt(Lb+Eq)})}</span></div>`;
}
function viewTB(){
  const B = balances(S.gstart, S.gend), C = chart();
  const leaf = [...C.values()].filter(a=>![...C.values()].some(x=>x.parent===a.code)).map(a=>a.code).filter(k=>B[k].dr||B[k].cr).sort();
  const td = sum(leaf,k=>B[k].dr), tc = sum(leaf,k=>B[k].cr);
  return `<div class="panel"><span class="label">${t("glTB")} · ${t("glFromTo",{a:fdate(S.gstart),b:fdate(S.gend)})}</span>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("glCode")}</th><th>${t("glAcc")}</th><th>${t("glDebit")}</th><th>${t("glCredit")}</th></tr></thead><tbody>
    ${leaf.map(k=>`<tr data-act="accLedger" data-id="${esc(k)}"><td class="num">${esc(k)}</td><td>${esc(B[k].acc.name)}</td><td class="num">${B[k].dr?fmt(B[k].dr):""}</td><td class="num">${B[k].cr?fmt(B[k].cr):""}</td></tr>`).join("")}
    </tbody><tfoot><tr><td></td><td>${t("glTotal")}</td><td class="num">${fmt(td)}</td><td class="num">${fmt(tc)}</td></tr></tfoot></table></div>
    <span class="pill ${Math.abs(td-tc)<0.02?"good":"bad"} self-start">${Math.abs(td-tc)<0.02?icon("check")+t("glBalanced"):t("glUnbal",{d:fmt(td),c:fmt(tc)})}</span>
    <button class="btn ghost sm self-start" data-act="exportTB">${icon("wallet")}${t("glExport")}</button></div>`;
}
function viewJournal(){
  const J = journal().filter(e=>e.date>=S.gstart && e.date<=S.gend).reverse(), C = chart();
  return `<span class="hint">${t("glHint")}</span><button class="btn primary self-start" data-act="newJournal">${icon("plus")}${t("glNewJ")}</button>
    <div class="panel"><div class="list">${J.slice(0,150).map(e=>`<${e.auto?"div":"button type=\"button\""} class="row jrow ${e.auto?"static":""}" ${e.auto?"":`data-act="editJournal" data-id="${esc(e.ref.id)}"`}><div class="m"><b>${esc(e.txt)}</b><span class="sub">${fdate(e.date)} · ${e.auto?t("glAuto"):t("glManual")}</span>
      <div class="jl">${e.lines.map(l=>`<span>${l.dr?"":"&nbsp;&nbsp;&nbsp;"}${esc((C.get(l.acc)||{name:l.acc}).name)}</span><span class="num">${l.dr?fmt(l.dr):""}</span><span class="num">${l.cr?fmt(l.cr):""}</span>`).join("")}</div></div></${e.auto?"div":"button"}>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div></div>`;
}
function viewTree(){
  const C = chart(), B = balances(null, null);
  const walk = (p, lvl) => [...C.values()].filter(a=>a.parent===p).sort((a,b)=>a.code.localeCompare(b.code)).map(a=>accRow(a.code, B[a.code], lvl, lvl===0) + walk(a.code, lvl+1)).join("");
  return `<button class="btn self-start" data-act="newAcc">${icon("plus")}${t("glNewAcc")}</button><div class="panel"><div class="list">${walk(null,0)}</div></div>`;
}
function accLedgerSheet(code){
  const C = chart(), acc = C.get(code); if(!acc) return;
  const codes = new Set([code]); let grew = true; while(grew){ grew = false; C.forEach(a=>{ if(a.parent && codes.has(a.parent) && !codes.has(a.code)){ codes.add(a.code); grew = true; } }); }
  let bal = 0; const rows = [];
  journal().filter(e=>!S.gend || e.date<=S.gend).forEach(e=>e.lines.filter(l=>codes.has(l.acc)).forEach(l=>{ bal += (l.dr-l.cr)*accSide(code); rows.push({e, l, bal}); }));
  openSheet({title:t("glLedgerOf",{x:acc.name}), noSave:true, html:`<div class="total"><span class="label">${t("glBal")}</span><b>${money(bal)}</b></div>
    <div class="list">${rows.slice(-120).reverse().map(({e,l,bal})=>`<div class="row static"><div class="m"><b>${esc(e.txt)}</b><span class="sub">${e.date>"0001"?fdate(e.date):t("glOpening")} · ${t("glBal")} ${fmt(bal)}</span></div><b class="${l.cr?"negv":""}">${l.dr?"+ "+fmt(l.dr):"− "+fmt(l.cr)}</b></div>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div>`});
}
let JL = [];
function journalForm(j){
  const C = chart(), opts = [...C.values()].filter(a=>![...C.values()].some(x=>x.parent===a.code)).sort((a,b)=>a.code.localeCompare(b.code)).map(a=>[a.code, `${a.code} · ${a.name}`]);
  JL = j ? (j.lines||[]).map(l=>({...l})) : [{acc:"",dr:"",cr:""},{acc:"",dr:"",cr:""}];
  const row = (l,i) => `<div class="ln jln" data-i="${i}"><select data-f="acc">${[["",""],...opts].map(([v,lab])=>`<option value="${esc(v)}" ${v===l.acc?"selected":""}>${esc(lab)}</option>`).join("")}</select>
    <div class="ln-nums j"><label><span>${t("glDebit")}</span><input data-f="dr" inputmode="decimal" value="${esc(l.dr||"")}"></label><label><span>${t("glCredit")}</span><input data-f="cr" inputmode="decimal" value="${esc(l.cr||"")}"></label></div></div>`;
  window.__jrow = row;
  openSheet({title: j ? t("glManual") : t("glNewJ"), saveLabel: j?t("save"):t("record"),
    top:`<div id="jLines" class="invlines">${JL.map(row).join("")}</div><button type="button" class="btn dashed sm" data-act="addJLine">${icon("plus")}${t("addLine")}</button><div class="preview" id="jTot"></div>`,
    fields:[{name:"note",label:t("note"),value:j?.note||"",max:160},{name:"date",label:t("date"),type:"date",value:j?.date||today()}],
    del: j ? {label:t("del"), run:()=>remove("journals", j.id)} : null,
    submit: async v=>{
      const ls = readJ().filter(l=>l.acc && (l.dr||l.cr));
      if(ls.length<2){ toast(t("glLines2")); return false; }
      const d = r2(sum(ls,l=>l.dr)), c = r2(sum(ls,l=>l.cr)); if(Math.abs(d-c)>0.004){ toast(t("glUnbal",{d:fmt(d),c:fmt(c)})); return false; }
      const ok = await save("journals", j?.id, {...(j?strip(j):{createdAt:Date.now()}), date:validDate(v.date)?v.date:today(), note:(v.note||"").slice(0,160), lines:ls});
      if(ok) toast(t("glSaved")); return ok;
    }});
  jTot();
}
function readJ(){ const out = []; document.querySelectorAll("#jLines .jln").forEach(r=>{ const g = f => (r.querySelector(`[data-f="${f}"]`)||{}).value||""; out.push({acc:g("acc"), dr:r2(num(g("dr"))), cr:r2(num(g("cr")))}); }); return out; }
function jTot(){ const el = document.getElementById("jTot"); if(!el) return; const ls = readJ(), d = sum(ls,l=>l.dr), c = sum(ls,l=>l.cr);
  el.innerHTML = `${t("glDebit")} <b class="num">${fmt(d)}</b> · ${t("glCredit")} <b class="num">${fmt(c)}</b> ${Math.abs(d-c)<0.005 && d ? `<span class="pill good">${icon("check")}${t("glBalanced")}</span>` : ""}`; }
function accForm(){
  const C = chart(), parents = [...C.values()].filter(a=>a.code.length<=2).map(a=>[a.code, `${a.code} · ${a.name}`]);
  openSheet({title:t("glNewAcc"), saveLabel:t("add"),
    fields:[{name:"name",label:t("glAccName"),value:"",max:80},{name:"parent",label:t("glParent"),type:"select",options:parents,value:"53"}],
    submit: async v=>{ if(!v.name){ toast(t("ePartyName")); return false; }
      const sib = [...C.keys()].filter(k=>k.startsWith(v.parent) && k.length===v.parent.length+2).map(k=>parseInt(k.slice(v.parent.length))||0);
      const code = v.parent + String(Math.max(50, ...sib)+1).padStart(2,"0");
      return save("accounts", null, {code, parent:v.parent, name:v.name.slice(0,80), createdAt:Date.now()}); }});
}
function exportTB(){
  const B = balances(S.gstart, S.gend), C = chart();
  const rows = [[t("glCode"),t("glAcc"),t("glDebit"),t("glCredit"),t("glBal")]];
  [...C.keys()].sort().forEach(k=>{ if(B[k].dr||B[k].cr) rows.push([k, B[k].acc.name, B[k].dr, B[k].cr, B[k].net]); });
  downloadCsv(rows, `daftar-trial-balance-${S.gend}.csv`);
}
function downloadCsv(rows, name){
  const csv = "﻿" + rows.map(r=>r.map(v=>{ const s = String(v??""); return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download = name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}

Object.assign(A, {
  gtab: id => { S.gtab = id; render(); }, accLedger: id => accLedgerSheet(id),
  newJournal: () => journalForm(null), editJournal: id => journalForm(S.journals.find(j=>j.id===id)),
  addJLine: () => { const box = document.getElementById("jLines"); if(!box) return; const ls = readJ(); ls.push({acc:"",dr:"",cr:""}); box.innerHTML = ls.map(window.__jrow).join(""); jTot(); },
  newAcc: () => accForm(), exportTB: () => exportTB(),
});
document.addEventListener("input", e=>{ if(e.target.closest && e.target.closest("#jLines")) jTot(); });
document.addEventListener("change", e=>{ if(e.target.id==="gstart"||e.target.id==="gend"){ if(validDate(e.target.value)){ S[e.target.id] = e.target.value; render(); } } if(e.target.closest && e.target.closest("#jLines")) jTot(); });
