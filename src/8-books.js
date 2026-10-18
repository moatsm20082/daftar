/* =====================================================================
   Sales & purchases: customers / suppliers, items, invoices with tax,
   receipts & payments, cheques, statements, VAT & receivables reports.
   Lives under the "money" tab as sub-pages, so the bottom bar stays the same.
   ===================================================================== */
Object.assign(L, {
  bkMoves:["الحركات","Moves"], bkInv:["الفواتير","Invoices"], bkParties:["العملاء","Contacts"], bkCheques:["الشيكات","Cheques"], bkReports:["التقارير","Reports"],
  bkMoneyT:["الحسابات","Accounts"],
  // invoice types
  itSale:["فاتورة بيع","Sales invoice"], itPurchase:["فاتورة شراء","Purchase bill"], itSaleRet:["مرتجع مبيعات","Sales return"], itPurRet:["مرتجع مشتريات","Purchase return"], itQuote:["عرض سعر","Quotation"],
  itSales:["المبيعات","Sales"], itPurchases:["المشتريات","Purchases"], itQuotes:["عروض الأسعار","Quotes"], itReturns:["المرتجعات","Returns"],
  newSale:["فاتورة بيع","Sales invoice"], newPurchase:["فاتورة شراء","Purchase bill"],
  // parties
  pCustomer:["زبون","Customer"], pSupplier:["مورّد","Supplier"], pBoth:["زبون ومورّد","Both"], pCustomers:["الزباين","Customers"], pSuppliers:["الموردين","Suppliers"],
  pNew:["زبون أو مورّد جديد","New contact"], pName:["الاسم","Name"], pKind:["مين هو؟","Who is it?"], pPhone:["رقم الجوال","Mobile"], pTaxNo:["الرقم الضريبي","Tax number"],
  pAddr:["العنوان","Address"], pOpen:["رصيد افتتاحي","Opening balance"], pOpenHint:["إذا عليه مصاري قبل ما تبلش بدفتر اكتبها موجب، وإذا إلو عندك اكتبها بالسالب.","If they owed you before Daftar, enter it positive; if you owed them, negative."],
  pLimit:["سقف الدين","Credit limit"], eParty:["اختار الزبون أو المورّد","Pick a customer or supplier"], ePartyName:["اكتب الاسم","Enter a name"],
  owesUs:["عليه إلنا","Owes us"], weOwe:["إلو علينا","We owe"], settledP:["مسكّر","Settled"], noParties:["لسا ما في زباين ولا موردين.","No customers or suppliers yet."],
  noPartiesSub:["ضيفهم مرة وحدة، وبعدها كل فاتورة وكل دفعة بتنحسب على حسابهم لحالها.","Add them once and every invoice and payment lands on their account automatically."],
  statement:["كشف حساب","Statement"], stOpen:["رصيد أول المدة","Opening balance"], stBal:["الرصيد","Balance"], stDebit:["مدين","Debit"], stCredit:["دائن","Credit"],
  stShare:["ابعت الكشف واتساب","Send statement on WhatsApp"], stPrint:["اطبع الكشف","Print statement"], stAll:["كل الفترات","All time"],
  overLimit:["تعدّى سقف الدين ({x})","Over credit limit ({x})"],
  // items
  items:["الأصناف والخدمات","Items & services"], itemNew:["صنف جديد","New item"], itemName:["اسم الصنف أو الخدمة","Item or service name"], itemPrice:["سعر البيع","Sale price"], itemCost:["سعر الشراء","Cost price"],
  itemUnit:["الوحدة","Unit"], itemUnitPh:["قطعة، متر، كيلو، ساعة…","piece, metre, kg, hour…"], itemSku:["الكود (اختياري)","Code (optional)"], noItems:["ما في أصناف. بتقدر تكتب أي صنف جوّا الفاتورة وبينحفظ لحاله.","No items yet. Type any item on an invoice and it's saved for next time."],
  // invoice form
  invParty:["الزبون","Customer"], invSupplier:["المورّد","Supplier"], invDate:["تاريخ الفاتورة","Invoice date"], invDue:["الدفع","Payment"], dueCash:["نقدي","Cash"], dueDays:["بعد {n} يوم","{n} days"],
  invLines:["الأصناف","Items"], lnItem:["الصنف","Item"], lnQty:["الكمية","Qty"], lnPrice:["السعر","Price"], lnTax:["الضريبة","Tax"], lnDisc:["خصم","Disc."], addLine:["سطر جديد","Add line"],
  incTax:["الأسعار شاملة الضريبة","Prices include tax"], invDiscount:["خصم على الفاتورة","Invoice discount"], invNotes:["ملاحظات تطلع على الفاتورة","Notes printed on the invoice"],
  supInvNo:["رقم فاتورة المورّد","Supplier's bill number"], forUnitOpt:["على أي مشروع؟ (اختياري)","For which project? (optional)"],
  subTotal:["المجموع قبل الضريبة","Subtotal"], taxTotal:["الضريبة","Tax"], discountL:["الخصم","Discount"], grandTotal:["المجموع","Total"], paidNow:["انقبض هلأ","Paid now"], paidNowP:["ندفع هلأ","Paid now"],
  eLines:["ضيف صنف واحد عالأقل بسعر","Add at least one item with a price"], invSaved:["انحفظت {x} رقم {n}","{x} {n} saved"],
  taxExempt:["معفى","Exempt"],
  // invoice view
  invNoS:["رقم","No."], status:["الحالة","Status"], chWeek:["مستحق خلال أسبوع","Due within a week"], stPaid:["مدفوعة","Paid"], stPartial:["مدفوعة جزئياً","Part paid"], stUnpaid:["مش مدفوعة","Unpaid"], stOverdue:["متأخرة","Overdue"], stQuote:["عرض سعر","Quote"],
  remainingL:["الباقي","Balance due"], paidL:["المدفوع","Paid"], recordPay:["سجّل دفعة","Record payment"], printInv:["اطبع / PDF","Print / PDF"], shareInv:["ابعت واتساب","Send on WhatsApp"],
  toInvoice:["حوّله لفاتورة","Convert to invoice"], makeReturn:["اعمل مرتجع","Make a return"], dupInv:["نسخة جديدة","Duplicate"], editInv:["عدّل","Edit"],
  payments_:["الدفعات","Payments"], noInvoices:["لسا ما في فواتير.","No invoices yet."], noInvoicesSub:["اعمل أول فاتورة بدقيقة: اختار الزبون، اكتب الأصناف، والضريبة بتنحسب لحالها.","Make your first invoice in a minute: pick the customer, type the items, tax is worked out for you."],
  invSearch:["ابحث برقم الفاتورة أو الاسم…","Search by number or name…"], thanksInv:["شكراً لتعاملكم معنا","Thank you for your business"], taxNoL:["الرقم الضريبي","Tax No."], billTo:["إلى","Bill to"],
  dueOnL:["تاريخ الاستحقاق","Due date"], waInv:["{type} رقم {n}\nمن: {co}\nالتاريخ: {d}\n\n{lines}\n\nالمجموع: {t}{paid}\n\n{foot}","{type} {n}\nFrom: {co}\nDate: {d}\n\n{lines}\n\nTotal: {t}{paid}\n\n{foot}"],
  waLeft:["\nالمدفوع: {p}\nالباقي: {r}","\nPaid: {p}\nBalance due: {r}"],
  // vouchers
  vReceipt:["سند قبض","Receipt"], vPayment:["سند صرف","Payment"], vNewR:["قبضنا من زبون","Received from customer"], vNewP:["دفعنا لمورّد","Paid a supplier"],
  vAmount:["المبلغ","Amount"], vMethod:["طريقة الدفع","Method"], vForInv:["عن أي فاتورة؟","For which invoice?"], vNoInv:["على الحساب","On account"], vSaved:["انحفظ {x}: {a}","{x} saved: {a}"],
  vVoid:["ملغي (شيك راجع)","Void (bounced cheque)"],
  // cheques
  chIn:["شيكات واردة","Received cheques"], chOut:["شيكات صادرة","Issued cheques"], chNo:["رقم الشيك","Cheque no."], chBank:["البنك","Bank"], chDue:["تاريخ الاستحقاق","Due date"],
  chPending:["بالدرج","Pending"], chDeposited:["مودع بالبنك","Deposited"], chCleared:["انصرف","Cleared"], chBounced:["راجع","Bounced"], chHanded:["مسلّم للمورّد","Handed over"],
  chMarkDep:["أودعته بالبنك","Deposited"], chMarkClr:["انصرف","Cleared"], chMarkBnc:["رجع","Bounced"], noCheques:["ما في شيكات.","No cheques."],
  chBouncedToast:["انلغى القبض وارجع المبلغ على حساب {x}","Receipt voided; amount is back on {x}'s account"], chDueSoon:["شيكات مستحقة خلال أسبوع: {n} بقيمة {x}","Cheques due this week: {n} worth {x}"],
  chOverdue:["فات موعده","Past due"], chInDays:["بعد {n} يوم","in {n} days"], chToday:["اليوم","today"],
  // reports
  rSales:["المبيعات (بدون ضريبة)","Sales (excl. tax)"], rPurch:["المشتريات (بدون ضريبة)","Purchases (excl. tax)"], rGross:["مجمل الربح من الفواتير","Gross profit from invoices"],
  rTaxOut:["ضريبة على المبيعات","Output tax"], rTaxIn:["ضريبة على المشتريات","Input tax"], rTaxDue:["الضريبة المستحقة للدفع","Tax payable"], rTaxRefund:["ضريبة إلك (مسترد)","Tax refundable"],
  rRecv:["إلنا عند الناس","Receivables"], rPay:["علينا للناس","Payables"], rAging:["أعمار الديون","Receivables aging"], rTop:["أكثر الزباين شراء","Top customers"],
  rAge0:["لسا ما استحقت","Not due"], rAge30:["1-30 يوم","1-30 days"], rAge60:["31-60 يوم","31-60 days"], rAge90:["61-90 يوم","61-90 days"], rAge90p:["أكثر من 90","90+ days"],
  rTaxNote:["ضريبة المبيعات العامة بالأردن 16%. هاد الرقم للاسترشاد، راجع محاسبك قبل الإقرار.","Jordan's general sales tax is 16%. This figure is a guide; check with your accountant before filing."],
  rPeriod:["الفترة","Period"], rMonth:["الشهر","Month"], rQuarter:["شهرين (فترة الإقرار)","2 months (filing period)"], rYear:["السنة","Year"], exportInv:["صدّر الفواتير Excel","Export invoices (Excel)"],
  // settings
  setTaxNo:["الرقم الضريبي للشركة","Company tax number"], setAddr:["عنوان الشركة (يطلع على الفاتورة)","Company address (on invoices)"], setTax:["نسبة الضريبة الأساسية","Default tax rate"],
  setInvFoot:["سطر أسفل الفاتورة","Invoice footer line"], setIncTax:["أسعاري شاملة الضريبة","My prices include tax"],
  // home
  aOverdueInv:["فواتير متأخرة: {n} بقيمة {x}","Overdue invoices: {n} worth {x}"], aChequesDue:["شيكات مستحقة خلال أسبوع: {n} بقيمة {x}","Cheques due within a week: {n} worth {x}"],
  qInvSub:["فاتورة بضريبة وتنبعت واتساب","Taxed invoice, sent on WhatsApp"], qRecSub:["زبون دفعلك","A customer paid you"],
});
const BOOK_COLS = ["parties","items","invoices","vouchers","cheques"];
BOOK_COLS.forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

/* ----- numbers & helpers ----- */
const r2 = n => Math.round((n||0)*100)/100;
const INV_PFX = {sale:"S", purchase:"P", saleReturn:"SR", purchaseReturn:"PR", quote:"Q"};
const INV_T = {sale:"itSale", purchase:"itPurchase", saleReturn:"itSaleRet", purchaseReturn:"itPurRet", quote:"itQuote"};
const isSaleSide = tp => tp==="sale" || tp==="saleReturn" || tp==="quote";
const taxRate = () => ST().taxRate;
const partyById = id => S.parties.find(p=>p.id===id);
const invById = id => S.invoices.find(x=>x.id===id);
function nextNo(col, pfx){
  const all = (col==="invoices" ? S.invoices : S.vouchers).map(x=>String(x.no||"")).filter(n=>n.startsWith(pfx+"-")).map(n=>parseInt(n.slice(pfx.length+1))||0);
  return pfx+"-"+String((all.length?Math.max(...all):0)+1).padStart(4,"0");
}
/* one invoice's numbers: lines → net, tax; invoice discount spread over the lines before tax */
function invCalc(inv){
  const inc = !!inv.incTax, lines = (inv.lines||[]).filter(l=>num(l.qty)>0 && num(l.price)>=0 && String(l.name||"").trim());
  const rows = lines.map(l=>{ const g = num(l.qty)*num(l.price) - num(l.disc), rt = num(l.tax)/100; const net = inc ? g/(1+rt) : g; return {...l, gross:g, net, rt}; });
  const sumNet = sum(rows, x=>x.net), d = Math.min(Math.max(0, num(inv.discount)), sumNet), k = sumNet ? (sumNet-d)/sumNet : 1;
  rows.forEach(x=>{ x.netA = x.net*k; x.taxA = x.netA*x.rt; });
  const net = r2(sum(rows,x=>x.netA)), tax = r2(sum(rows,x=>x.taxA));
  return {rows, gross:r2(sumNet), discount:r2(d), net, tax, total:r2(net+tax)};
}
const invSign = tp => tp==="sale" ? 1 : tp==="saleReturn" ? -1 : tp==="purchase" ? -1 : tp==="purchaseReturn" ? 1 : 0;   // + means the party owes us more
const liveInv = () => S.invoices.filter(x=>x.type!=="quote" && !x.void);
const liveVouch = () => S.vouchers.filter(v=>!v.void);
function invPaid(inv){ return r2(sum(liveVouch().filter(v=>v.invoiceId===inv.id), v=>num(v.amount))); }
function invState(inv){
  if(inv.type==="quote") return "quote";
  const tot = invCalc(inv).total, p = invPaid(inv);
  if(tot<=0.005 || p>=tot-0.005) return "paid";
  if(inv.dueDate && inv.dueDate<today()) return "overdue";
  return p>0.005 ? "partial" : "unpaid";
}
const stPill = st => `<span class="pill ${st==="paid"?"good":st==="overdue"?"bad":st==="quote"?"":"warn"}">${t({paid:"stPaid",partial:"stPartial",unpaid:"stUnpaid",overdue:"stOverdue",quote:"stQuote"}[st])}</span>`;
/* party balance: + they owe us, − we owe them */
function partyLedger(pid, a, b){
  const p = partyById(pid); const rows = [];
  liveInv().filter(x=>x.partyId===pid).forEach(x=>rows.push({date:x.date, kind:"inv", ref:x, amt:invSign(x.type)*invCalc(x).total, txt:`${t(INV_T[x.type])} ${x.no||""}`}));
  liveVouch().filter(v=>v.partyId===pid).forEach(v=>rows.push({date:v.date, kind:"v", ref:v, amt:(v.type==="receipt"?-1:1)*num(v.amount), txt:`${t(v.type==="receipt"?"vReceipt":"vPayment")} ${v.no||""}${v.method==="cheque"?" · "+t("cheque"):""}`}));
  rows.sort((x,y)=>(x.date||"").localeCompare(y.date||"") || (x.ref.createdAt||0)-(y.ref.createdAt||0));
  let open = num(p && p.openBal); const before = a ? rows.filter(r=>r.date<a) : [];
  open += sum(before, r=>r.amt);
  const inr = rows.filter(r=>(!a || r.date>=a) && (!b || r.date<=b));
  let bal = open; inr.forEach(r=>{ bal += r.amt; r.bal = bal; });
  return {open:r2(open), rows:inr, bal:r2(bal)};
}
const partyBal = pid => partyLedger(pid).bal;
const balTxt = b => b>0.005 ? `<span class="due">${t("owesUs")} ${money(b)}</span>` : b<-0.005 ? `<span class="negv">${t("weOwe")} ${money(-b)}</span>` : `<span class="sub">${t("settledP")}</span>`;
const partyOptions = (side, cur) => S.parties.filter(p=>!p.archived && (p.kind==="both" || p.kind===(side==="sale"?"customer":"supplier") || p.id===cur)).sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(p=>[p.id,p.name]);
const daysTo = d => Math.round((parseD(d)-parseD(today()))/864e5);

/* ----- totals hooks used by home / projects (invoices count as income & cost, before tax) ----- */
function invNetFor(f){ let inc = 0, exp = 0;
  liveInv().filter(f).forEach(x=>{ const n = invCalc(x).net; if(x.type==="sale") inc += n; else if(x.type==="saleReturn") inc -= n; else if(x.type==="purchase") exp += n; else if(x.type==="purchaseReturn") exp -= n; });
  return {inc, exp}; }

/* ===================== the money hub ===================== */
function viewBooks(){
  const tab = S.btab || "moves";
  const tabs = [["moves",t("bkMoves")],["radar",t("bkRadar")],["invoices",t("bkInv")],["parties",t("bkParties")],["stock",t("bkStock")],["cheques",t("bkCheques")],["gl",t("bkGl")],["reports",t("bkReports")]];
  const seg = `<div class="chiprow tabsx" role="tablist">${tabs.map(([k,l])=>`<button class="chipbtn" role="tab" data-act="btab" data-id="${k}" aria-pressed="${tab===k}" aria-selected="${tab===k}">${esc(l)}</button>`).join("")}</div>`;
  if(tab==="moves"){ const m = viewMoney(), i = m.indexOf('<div class="daybar">'); return i>0 ? m.slice(0,i)+seg+m.slice(i) : seg+m; }   // the old money page, with the tabs under its header
  const body = tab==="radar" ? viewRadar() : tab==="invoices" ? viewInvoices() : tab==="parties" ? viewParties() : tab==="cheques" ? viewCheques() : tab==="stock" ? viewStock() : tab==="gl" ? viewLedger() : viewReports();
  return pageHead(t("navMoney"), "", tab==="invoices" ? `<div class="hbtns"><button class="btn" data-act="pos">${icon("bag")}${t("pos")}</button><button class="btn" data-act="newInv" data-id="purchase">${icon("minus")}${t("newPurchase")}</button><button class="btn primary" data-act="newInv" data-id="sale">${icon("plus")}${t("newSale")}</button></div>`
    : tab==="parties" ? `<button class="btn primary" data-act="newParty">${icon("plus")}${t("pNew")}</button>` : "") + seg + body;
}

/* ----- invoices list ----- */
function viewInvoices(){
  const f = S.ifilter || "sale", q = (S.iq||"").trim().toLowerCase();
  const fl = x => f==="sale" ? x.type==="sale" : f==="purchase" ? x.type==="purchase" : f==="quote" ? x.type==="quote" : (x.type==="saleReturn"||x.type==="purchaseReturn");
  const list = S.invoices.filter(x=>!x.void && fl(x)).filter(x=>!q || [x.no, x.supInvNo, (partyById(x.partyId)||{}).name, String(invCalc(x).total)].some(v=>String(v||"").toLowerCase().includes(q))).sort(byDateDesc);
  let h = `<div class="seg four" role="group">${[["sale",t("itSales")],["purchase",t("itPurchases")],["quote",t("itQuotes")],["ret",t("itReturns")]].map(([k,l])=>`<button data-act="ifilter" data-id="${k}" aria-pressed="${f===k}">${l}</button>`).join("")}</div>`;
  if(f==="sale" || f==="purchase"){
    const open = S.invoices.filter(x=>!x.void && x.type===f), due = sum(open, x=>Math.max(0, invCalc(x).total-invPaid(x))), od = open.filter(x=>invState(x)==="overdue");
    h += `<div class="kpis three"><div class="kpi"><span class="label">${f==="sale"?t("rSales"):t("rPurch")} · ${t("thisMonth")}</span><b>${money(sum(open.filter(x=>x.date>=monthStartOf(today())),x=>invCalc(x).net))}</b></div>
      <div class="kpi"><span class="label">${f==="sale"?t("rRecv"):t("rPay")}</span><b class="due">${money(due)}</b></div>
      <div class="kpi ${od.length?"neg":""}"><span class="label">${t("stOverdue")}</span><b><span class="num">${od.length}</span></b></div></div>`;
  }
  h += `<div class="panel"><div class="searchrow"><input id="iq" type="search" placeholder="${esc(t("invSearch"))}" value="${esc(S.iq||"")}" autocomplete="off"><button class="btn sm" data-act="items">${icon("tag")}${t("items")}</button></div>`;
  if(!S.invoices.length) return h + `<div class="empty">${icon("file","big")}<b>${t("noInvoices")}</b><span>${t("noInvoicesSub")}</span><button class="btn primary" data-act="newInv" data-id="sale">${icon("plus")}${t("newSale")}</button></div></div>`;
  h += list.length ? `<div class="list">${list.map(invRow).join("")}</div>` : `<span class="hint">${t("noTx")}</span>`;
  return h + `<button class="btn ghost sm self-start" data-act="exportInv">${icon("wallet")}${t("exportInv")}</button></div>`;
}
function invRow(x){
  const c = invCalc(x), p = partyById(x.partyId), st = invState(x);
  return `<button class="row" data-act="viewInv" data-id="${esc(x.id)}"><span class="tx-ic ${isSaleSide(x.type)?"inc":"exp"}">${icon("file")}</span>
    <div class="m"><b>${esc(p?p.name:"—")}</b><span class="sub"><span class="num ltr">${esc(x.no||"")}</span> · ${fdate(x.date)}${x.type!=="sale"&&x.type!=="purchase"?" · "+esc(t(INV_T[x.type])):""}</span></div>
    <div class="col end"><b class="${x.type==="sale"?"pos":""}">${money(c.total)}</b>${stPill(st)}</div></button>`;
}

/* ----- invoice form ----- */
let INV = null;   // the invoice being edited: {id?, type, lines:[...]}
function invForm(x, preset={}){
  const type = x?.type || preset.type || "sale", side = isSaleSide(type) ? "sale" : "purchase";
  INV = {id:x?.id||null, type, lines:(x?.lines || preset.lines || [{name:"",qty:1,price:"",tax:taxRate(),disc:0}]).map(l=>({...l})), from:x||null, srcId:preset.srcId||null};
  const opts = partyOptions(side, x?.partyId||preset.partyId);
  const dueSel = x?.dueDate ? String(Math.max(0, Math.round((parseD(x.dueDate)-parseD(x.date))/864e5))) : (preset.dueDays!=null ? String(preset.dueDays) : "0");
  const dueOpts = [["0",t("dueCash")],["15",t("dueDays",{n:"15"})],["30",t("dueDays",{n:"30"})],["60",t("dueDays",{n:"60"})],["90",t("dueDays",{n:"90"})]];
  if(!dueOpts.some(o=>o[0]===dueSel)) dueOpts.push([dueSel, t("dueDays",{n:dueSel})]);
  openSheet({title: x ? `${t("editInv")} · ${x.no}` : t(INV_T[type]), saveLabel: x ? t("save") : t("record"),
    top:`<div class="field"><label for="f_partyId">${side==="sale"?t("invParty"):t("invSupplier")}</label><div class="inlinepick"><select id="f_partyId" name="partyId"><option value=""></option>${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===(x?.partyId||preset.partyId)?"selected":""}>${esc(l)}</option>`).join("")}</select><button type="button" class="btn sm" data-act="quickParty" data-id="${side}">${icon("plus")}</button></div></div>
      <div class="field"><span class="flabel">${t("invLines")}</span><div id="invLines" class="invlines">${INV.lines.map(lineRow).join("")}</div><datalist id="itemsDl">${S.items.map(i=>`<option value="${esc(i.name)}"></option>`).join("")}</datalist>
      <button type="button" class="btn dashed sm" data-act="addLine">${icon("plus")}${t("addLine")}</button></div>
      <div class="preview invtot" id="invTot"></div>`,
    fields:[{name:"due",label:t("invDue"),type:"chips",options:dueOpts,value:dueSel},
      ...(x || type==="quote" ? [] : [{name:"paidNow",label:side==="sale"?t("paidNow"):t("paidNowP"),type:"money",value:preset.paidNow||"",hint:""},
        {name:"method",label:t("vMethod"),type:"chips",options:[["cash",t("cash")],["transfer",t("transfer")],["card",t("card")],["cheque",t("cheque")]],value:"cash"},
        {name:"chNo",label:t("chNo"),value:"",max:30},{name:"chDue",label:t("chDue"),type:"date",value:today()}])],
    more:[{name:"date",label:t("invDate"),type:"date",value:x?.date||today()},
      {name:"incTax",label:t("incTax"),type:"chips",options:[["0",LANG==="en"?"No":"لا"],["1",LANG==="en"?"Yes":"آه"]],value:(x ? x.incTax : (preset.incTax!=null?preset.incTax:ST().incTax)) ? "1":"0"},
      {name:"discount",label:t("invDiscount"),type:"money",value:x?.discount||""},
      ...(side==="purchase"?[{name:"supInvNo",label:t("supInvNo"),value:x?.supInvNo||"",max:40}]:[]),
      ...(storeList().length>1?[{name:"storeId",label:t("invStore"),type:"select",options:storeList().map(x=>[x.id,x.name]),value:x?.storeId||S.sstore||MAIN_STORE}]:[]),
      ...(activeUnits().length?[{name:"unitId",label:t("forUnitOpt"),type:"select",options:[["",""],...unitOptions(x?.unitId)],value:x?.unitId||preset.unitId||(S.view==="unit"?S.uid:"")}]:[]),
      ...(x || type==="quote" ? [] : [{name:"chBank",label:t("chBank"),value:"",max:40}]),
      {name:"notes",label:t("invNotes"),value:x?.notes||preset.notes||"",max:300}],
    del: x ? {label:t("del"), run:()=>delInvoice(x)} : null,
    submit: v=>saveInvoice(v)});
  invTotals(); chFieldsVis();
}
const taxOpts = cur => { const base = [taxRate(), 16, 10, 8, 4, 0].filter((v,i,a)=>a.indexOf(v)===i); if(!base.includes(num(cur))) base.push(num(cur)); return base; };
function lineRow(l, i){
  return `<div class="ln" data-i="${i}">
    <input class="ln-name" list="itemsDl" data-f="name" placeholder="${esc(t("lnItem"))}" value="${esc(l.name||"")}" maxlength="120" aria-label="${esc(t("lnItem"))}">
    <div class="ln-nums"><label><span>${t("lnQty")}</span><input data-f="qty" inputmode="decimal" value="${esc(l.qty??1)}"></label>
      <label><span>${t("lnPrice")}</span><input data-f="price" inputmode="decimal" value="${esc(l.price??"")}" placeholder="0"></label>
      <label><span>${t("lnTax")}</span><select data-f="tax">${taxOpts(l.tax).map(r=>`<option value="${r}" ${num(l.tax)===r?"selected":""}>${r?r+"%":t("taxExempt")}</option>`).join("")}</select></label>
      <button type="button" class="iconbtn sm" data-act="delLine" data-id="${i}" aria-label="${t("del")}">${icon("x")}</button></div></div>`;
}
function readLines(){
  const out = []; document.querySelectorAll("#invLines .ln").forEach(r=>{ const g = f => (r.querySelector(`[data-f="${f}"]`)||{}).value || "";
    out.push({name:g("name").trim().slice(0,120), qty:num(g("qty")), price:num(g("price")), tax:num(g("tax")), disc:0}); });
  return out;
}
function invTotals(){
  const el = document.getElementById("invTot"); if(!el || !INV) return;
  const inc = (document.querySelector('#sheetBody [name="incTax"]:checked')||{}).value==="1", disc = num((document.getElementById("f_discount")||{}).value);
  const c = invCalc({lines:readLines(), incTax:inc, discount:disc});
  el.innerHTML = `<div class="kv"><div><span>${t("subTotal")}</span><b>${money(c.gross)}</b></div>${c.discount?`<div><span>${t("discountL")}</span><b class="negv">− ${money(c.discount)}</b></div>`:""}<div><span>${t("taxTotal")}</span><b>${money(c.tax)}</b></div></div><div class="total"><span class="label">${t("grandTotal")}</span><b>${money(c.total)}</b></div>`;
  const pn = document.getElementById("f_paidNow_hint"); if(pn) pn.innerHTML = c.total ? `<button type="button" class="linkbtn" data-act="payAll" data-id="${c.total}">${t("payRest",{x:fmt(c.total)})}</button>` : "";
}
async function saveInvoice(v){
  if(!INV) return false;
  const pid = v.partyId; if(!partyById(pid)){ toast(t("eParty")); return false; }
  const lines = readLines().filter(l=>l.name && l.qty>0);
  if(!lines.length || !lines.some(l=>l.price>0)){ toast(t("eLines")); return false; }
  const type = INV.type, x = INV.from, date = validDate(v.date)?v.date:today(), dd = Math.max(0, parseInt(v.due)||0);
  const data = {...(x?strip(x):{createdAt:Date.now(), no:nextNo("invoices", INV_PFX[type])}), type, partyId:pid, date, dueDate: dd ? addDays(date, dd) : date,
    lines, storeId: storeList().some(x=>x.id===v.storeId) ? v.storeId : (x?.storeId||MAIN_STORE), incTax: v.incTax==="1", discount:num(v.discount), notes:(v.notes||"").slice(0,300), supInvNo:(v.supInvNo||"").slice(0,40), unitId: unitById(v.unitId) ? v.unitId : "", srcId: x?.srcId || INV.srcId || ""};
  data.total = invCalc(data).total;
  const id = x?.id || newId();
  if(!await save("invoices", id, data, true)) return false;
  // remember new items for next time
  for(const l of lines) if(l.price>0 && !S.items.some(i=>i.name.toLowerCase()===l.name.toLowerCase()) && S.items.length<2000)
    await save("items", null, {name:l.name, price:isSaleSide(type)?l.price:0, cost:isSaleSide(type)?0:l.price, tax:l.tax, unit:"", createdAt:Date.now()}, true);
  // link each line to its item (by name), so stock and cost follow the invoice
  const linked = lines.map(l=>{ const it = itemByName(l.name); return it ? {...l, itemId:it.id} : l; });
  if(linked.some((l,i)=>l.itemId!==lines[i].itemId)){ data.lines = linked; await save("invoices", id, data, true); }
  stockWarn(data);
  const paid = Math.min(num(v.paidNow), data.total);
  if(!x && paid>0 && type!=="quote") await saveVoucher({type: isSaleSide(type) ? (type==="saleReturn"?"payment":"receipt") : (type==="purchaseReturn"?"receipt":"payment"), partyId:pid, amount:paid, date, invoiceId:id,
    method:v.method, chNo:v.chNo, chBank:v.chBank, chDue:v.chDue, note:""}, true);
  INV = null; render(); toast(t("invSaved",{x:t(INV_T[type]), n:data.no}));
  setTimeout(()=>viewInvSheet(id), 50);
  return true;
}
async function delInvoice(x){
  for(const v of S.vouchers.filter(v=>v.invoiceId===x.id)){ const ch = S.cheques.find(c=>c.voucherId===v.id); if(ch) await remove("cheques", ch.id); await remove("vouchers", v.id); }
  return remove("invoices", x.id);
}

/* ----- invoice view ----- */
function viewInvSheet(id){
  const x = invById(id); if(!x) return;
  const c = invCalc(x), p = partyById(x.partyId), paid = invPaid(x), st = invState(x), vs = liveVouch().filter(v=>v.invoiceId===x.id);
  openSheet({title:`${t(INV_T[x.type])} ${x.no||""}`, noSave:true, html:`
    <div class="inv-head"><div class="col"><b>${esc(p?p.name:"")}</b><span class="sub">${fdate(x.date)}${x.dueDate&&x.dueDate!==x.date?` · ${t("dueOnL")}: ${fdate(x.dueDate)}`:""}</span></div>${stPill(st)}</div>
    <div class="list">${c.rows.map(l=>`<div class="row static"><div class="m"><b>${esc(l.name)}</b><span class="sub"><span class="num">${fmt(num(l.qty))}</span> × ${money(num(l.price))}${l.rt?` · ${t("lnTax")} <span class="num">${Math.round(l.rt*100)}%</span>`:""}</span></div><b>${money(l.netA+l.taxA)}</b></div>`).join("")}</div>
    <div class="kv"><div><span>${t("subTotal")}</span><b>${money(c.gross)}</b></div>${c.discount?`<div><span>${t("discountL")}</span><b>− ${money(c.discount)}</b></div>`:""}<div><span>${t("taxTotal")}</span><b>${money(c.tax)}</b></div></div>
    <div class="total"><span class="label">${t("grandTotal")}</span><b>${money(c.total)}</b></div>
    ${x.type!=="quote"?`<div class="kv"><div><span>${t("paidL")}</span><b class="pos">${money(paid)}</b></div><div><span>${t("remainingL")}</span><b class="${c.total-paid>0.005?"due":""}">${money(Math.max(0,c.total-paid))}</b></div></div>
      ${vs.length?`<div class="list">${vs.map(v=>`<button type="button" class="row" data-act="editVoucher" data-id="${esc(v.id)}"><div class="m"><b>${t(v.type==="receipt"?"vReceipt":"vPayment")} <span class="num ltr">${esc(v.no||"")}</span></b><span class="sub">${fdate(v.date)} · ${esc(t(v.method||"cash"))}</span></div><b>${money(num(v.amount))}</b></button>`).join("")}</div>`:""}`:""}
    ${x.notes?`<span class="hint">${esc(x.notes)}</span>`:""}
    <div class="grid2">
      ${x.type!=="quote" && c.total-paid>0.005 ? `<button type="button" class="btn primary" data-act="payInv" data-id="${esc(x.id)}">${icon("wallet")}${t("recordPay")}</button>`:""}
      ${x.type==="quote" ? `<button type="button" class="btn primary" data-act="quoteToInv" data-id="${esc(x.id)}">${icon("check")}${t("toInvoice")}</button>`:""}
      <button type="button" class="btn" data-act="printInv" data-id="${esc(x.id)}">${icon("file")}${t("printInv")}</button>
      <button type="button" class="btn" data-act="shareInv" data-id="${esc(x.id)}">${icon("send")}${t("shareInv")}</button>
      <button type="button" class="btn" data-act="editInv" data-id="${esc(x.id)}">${icon("gear")}${t("editInv")}</button>
      ${x.type==="sale"||x.type==="purchase"?`<button type="button" class="btn ghost" data-act="retInv" data-id="${esc(x.id)}">${t("makeReturn")}</button>`:""}
      <button type="button" class="btn ghost" data-act="dupInv" data-id="${esc(x.id)}">${t("dupInv")}</button>
    </div>`});
}
function invDocHtml(x){
  const c = invCalc(x), p = partyById(x.partyId) || {}, s = ST(), paid = invPaid(x);
  return `<div class="doc">
    <div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1>${s.address?`<div>${esc(s.address)}</div>`:""}${COMPANY.phone?`<div class="ltr">${esc(COMPANY.phone)}</div>`:""}${s.taxNo?`<div>${t("taxNoL")}: <span class="ltr">${esc(s.taxNo)}</span></div>`:""}</div>
      <div class="doc-t"><h2>${esc(t(INV_T[x.type]))}${s.taxNo&&x.type==="sale"?(LANG==="en"?" (Tax invoice)":" ضريبية"):""}</h2><div>${t("invNoS")}: <b class="ltr">${esc(x.no||"")}</b></div><div>${t("date")}: ${esc(x.date)}</div>${x.dueDate&&x.dueDate!==x.date?`<div>${t("dueOnL")}: ${esc(x.dueDate)}</div>`:""}${x.supInvNo?`<div>${t("supInvNo")}: ${esc(x.supInvNo)}</div>`:""}</div></div>
    <div class="doc-to"><span>${t("billTo")}:</span> <b>${esc(p.name||"")}</b>${p.taxNo?` · ${t("taxNoL")}: <span class="ltr">${esc(p.taxNo)}</span>`:""}${p.phone?` · <span class="ltr">${esc(p.phone)}</span>`:""}${p.address?` · ${esc(p.address)}`:""}</div>
    <table class="doc-tb"><thead><tr><th>#</th><th>${t("lnItem")}</th><th>${t("lnQty")}</th><th>${t("lnPrice")}</th><th>${t("lnTax")}</th><th>${t("grandTotal")}</th></tr></thead>
      <tbody>${c.rows.map((l,i)=>`<tr><td>${i+1}</td><td>${esc(l.name)}</td><td>${fmt(num(l.qty))}</td><td>${fmt(num(l.price))}</td><td>${l.rt?Math.round(l.rt*100)+"%":"—"}</td><td>${fmt(l.netA+l.taxA)}</td></tr>`).join("")}</tbody></table>
    <table class="doc-sum"><tr><td>${t("subTotal")}</td><td>${moneyTxt(c.gross)}</td></tr>${c.discount?`<tr><td>${t("discountL")}</td><td>− ${moneyTxt(c.discount)}</td></tr>`:""}<tr><td>${t("taxTotal")}</td><td>${moneyTxt(c.tax)}</td></tr>
      <tr class="g"><td>${t("grandTotal")}</td><td>${moneyTxt(c.total)}</td></tr>${x.type!=="quote"&&paid>0.005?`<tr><td>${t("paidL")}</td><td>${moneyTxt(paid)}</td></tr><tr><td>${t("remainingL")}</td><td>${moneyTxt(Math.max(0,c.total-paid))}</td></tr>`:""}</table>
    ${x.notes?`<p class="doc-note">${esc(x.notes)}</p>`:""}
    <div class="doc-foot">${esc(s.invFoot||t("thanksInv"))}<br><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}
function printDoc(html){
  let el = document.getElementById("printDoc"); if(!el){ el = document.createElement("div"); el.id = "printDoc"; document.body.appendChild(el); }
  el.innerHTML = html; document.body.classList.add("printing-doc");
  const done = () => { document.body.classList.remove("printing-doc"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done); setTimeout(()=>window.print(), 60); setTimeout(done, 60000);
}
function invWaText(x){
  const c = invCalc(x), paid = invPaid(x);
  const lines = c.rows.map(l=>`• ${l.name} × ${fmt(num(l.qty))} = ${moneyTxt(l.netA+l.taxA)}`).join("\n");
  const left = x.type!=="quote" && paid>0.005 ? t("waLeft",{p:moneyTxt(paid), r:moneyTxt(Math.max(0,c.total-paid))}) : "";
  return t("waInv",{type:t(INV_T[x.type]), n:x.no||"", co:COMPANY.name||"", d:x.date, lines, t:moneyTxt(c.total)+(c.tax?` (${t("taxTotal")} ${moneyTxt(c.tax)})`:""), paid:left, foot:(ST().invFoot||t("thanksInv"))+"\n"+t("madeWith")+" · daftarapp.co"});
}

/* ----- parties ----- */
function viewParties(){
  const f = S.pfilter || "customer", q = (S.pq||"").trim().toLowerCase();
  const list = S.parties.filter(p=>!p.archived && (p.kind==="both" || p.kind===f)).map(p=>[p, partyBal(p.id)])
    .filter(([p])=>!q || [p.name,p.phone,p.taxNo].some(v=>String(v||"").toLowerCase().includes(q))).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]) || String(a[0].name).localeCompare(String(b[0].name)));
  const recv = sum(S.parties, p=>Math.max(0, partyBal(p.id))), pay = sum(S.parties, p=>Math.max(0, -partyBal(p.id)));
  let h = `<div class="kpis two-k"><div class="kpi"><span class="label">${t("rRecv")}</span><b class="due">${money(recv)}</b></div><div class="kpi"><span class="label">${t("rPay")}</span><b class="negv">${money(pay)}</b></div></div>`;
  h += `<div class="seg two-seg" role="group"><button data-act="pfilter" data-id="customer" aria-pressed="${f==="customer"}">${t("pCustomers")}</button><button data-act="pfilter" data-id="supplier" aria-pressed="${f==="supplier"}">${t("pSuppliers")}</button></div>`;
  if(!S.parties.length) return h + `<div class="panel empty">${icon("users","big")}<b>${t("noParties")}</b><span>${t("noPartiesSub")}</span><button class="btn primary" data-act="newParty">${icon("plus")}${t("pNew")}</button></div>`;
  return h + `<div class="panel"><div class="searchrow"><input id="pq" type="search" placeholder="${esc(t("qSearchName"))}" value="${esc(S.pq||"")}" autocomplete="off"></div>
    ${list.length?`<div class="list">${list.map(([p,b])=>`<button class="row" data-act="viewParty" data-id="${esc(p.id)}"><span class="avatar">${esc(initials(p.name))}</span><div class="m"><b>${esc(p.name)}</b><span class="sub">${[p.phone?`<span class="ltr">${esc(p.phone)}</span>`:"", num(p.limit)&&b>num(p.limit)?`<span class="negv">${t("overLimit",{x:fmt(num(p.limit))})}</span>`:""].filter(Boolean).join(" · ")||"&nbsp;"}</span></div><div class="col end">${balTxt(b)}</div></button>`).join("")}</div>`:`<span class="hint">${t("noTx")}</span>`}</div>`;
}
function partyForm(p, preset={}, after){
  openSheet({title: p ? `${t("edit")} · ${p.name}` : t("pNew"), saveLabel: p?t("save"):t("add"),
    fields:[{name:"name",label:t("pName"),value:p?.name||preset.name||"",max:100},
      {name:"kind",label:t("pKind"),type:"chips",options:[["customer",t("pCustomer")],["supplier",t("pSupplier")],["both",t("pBoth")]],value:p?.kind||preset.kind||"customer"},
      {name:"phone",label:t("pPhone"),type:"tel",value:p?.phone||"",max:30}],
    more:[{name:"taxNo",label:t("pTaxNo"),value:p?.taxNo||"",max:30},{name:"address",label:t("pAddr"),value:p?.address||"",max:120},
      {name:"openBal",label:t("pOpen"),type:"money",value:p?.openBal||"",hint:t("pOpenHint")},{name:"limit",label:t("pLimit"),type:"money",value:p?.limit||""}],
    del: p ? {label:t("del"), run:async()=>{ const used = S.invoices.some(x=>x.partyId===p.id) || S.vouchers.some(x=>x.partyId===p.id);
      if(used){ const ok = await save("parties", p.id, {...strip(p), archived:true}); if(ok){ S.btab="parties"; render(); } return ok; } return remove("parties", p.id); }} : null,
    submit: async v=>{
      if(!v.name){ toast(t("ePartyName")); return false; }
      const raw = toEn(v.openBal||"").trim(), ob = /^-/.test(raw) ? -num(raw.replace(/^-/,"")) : num(raw);
      const data = {...(p?strip(p):{createdAt:Date.now()}), name:v.name.slice(0,100), kind:["customer","supplier","both"].includes(v.kind)?v.kind:"customer", phone:(v.phone||"").slice(0,30),
        taxNo:(v.taxNo||"").slice(0,30), address:(v.address||"").slice(0,120), openBal:ob, limit:num(v.limit)};
      const id = p?.id || newId();
      const ok = await save("parties", id, data, !!after); if(ok && after) after(id); return ok;
    }});
}
function viewPartySheet(id){
  const p = partyById(id); if(!p) return;
  const a = S.stFrom || "", L0 = partyLedger(id, a || null, null);
  const cust = p.kind!=="supplier";
  openSheet({title:p.name, noSave:true, html:`
    <div class="owe">${MARK}<span class="label">${L0.bal>=0?t("owesUs"):t("weOwe")}</span><b>${money(Math.abs(L0.bal))}</b><span class="sub">${p.phone?`<span class="ltr">${esc(p.phone)}</span>`:""}${p.taxNo?` · ${t("taxNoL")} ${esc(p.taxNo)}`:""}</span></div>
    <div class="grid2">
      ${cust?`<button type="button" class="btn primary" data-act="newInv" data-id="sale" data-p="${esc(id)}">${icon("file")}${t("newSale")}</button><button type="button" class="btn" data-act="newVoucher" data-id="receipt" data-p="${esc(id)}">${icon("plus")}${t("vNewR")}</button>`:""}
      ${p.kind!=="customer"?`<button type="button" class="btn ${cust?"":"primary"}" data-act="newInv" data-id="purchase" data-p="${esc(id)}">${icon("file")}${t("newPurchase")}</button><button type="button" class="btn" data-act="newVoucher" data-id="payment" data-p="${esc(id)}">${icon("minus")}${t("vNewP")}</button>`:""}
    </div>
    <div class="seg two-seg" role="group"><button type="button" data-act="stRange" data-id="${esc(id)}" data-r="all" aria-pressed="${!a}">${t("stAll")}</button><button type="button" data-act="stRange" data-id="${esc(id)}" data-r="month" aria-pressed="${!!a}">${t("thisMonth")}</button></div>
    <span class="label">${t("statement")}</span>
    <div class="list">${a||L0.open?`<div class="row static"><div class="m"><b>${t("stOpen")}</b></div><b>${money(L0.open)}</b></div>`:""}
      ${L0.rows.slice().reverse().map(r=>`<button type="button" class="row" data-act="${r.kind==="inv"?"viewInv":"editVoucher"}" data-id="${esc(r.ref.id)}"><div class="m"><b>${esc(r.txt)}</b><span class="sub">${fdate(r.date)} · ${t("stBal")} ${money(r.bal)}</span></div><b class="${r.amt>0?"due":"pos"}">${r.amt>0?"+":"−"} ${money(Math.abs(r.amt))}</b></button>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div>
    <div class="grid2"><button type="button" class="btn" data-act="shareSt" data-id="${esc(id)}">${icon("send")}${t("stShare")}</button><button type="button" class="btn" data-act="printSt" data-id="${esc(id)}">${icon("file")}${t("stPrint")}</button>
      <button type="button" class="btn ghost" data-act="editParty" data-id="${esc(id)}">${icon("gear")}${t("edit")}</button></div>`});
}
function stDocHtml(id){
  const p = partyById(id), a = S.stFrom || null, L0 = partyLedger(id, a, null);
  return `<div class="doc"><div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1>${ST().taxNo?`<div>${t("taxNoL")}: ${esc(ST().taxNo)}</div>`:""}</div><div class="doc-t"><h2>${t("statement")}</h2><div>${esc(p.name)}</div><div>${esc(today())}</div></div></div>
    <table class="doc-tb"><thead><tr><th>${t("date")}</th><th>${t("note")}</th><th>${t("stDebit")}</th><th>${t("stCredit")}</th><th>${t("stBal")}</th></tr></thead><tbody>
    <tr><td></td><td>${t("stOpen")}</td><td></td><td></td><td>${fmt(L0.open)}</td></tr>
    ${L0.rows.map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.txt)}</td><td>${r.amt>0?fmt(r.amt):""}</td><td>${r.amt<0?fmt(-r.amt):""}</td><td>${fmt(r.bal)}</td></tr>`).join("")}</tbody></table>
    <table class="doc-sum"><tr class="g"><td>${L0.bal>=0?t("owesUs"):t("weOwe")}</td><td>${moneyTxt(Math.abs(L0.bal))}</td></tr></table><div class="doc-foot"><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}
function stWaText(id){
  const p = partyById(id), L0 = partyLedger(id, S.stFrom||null, null);
  const last = L0.rows.slice(-12).map(r=>`${r.date}  ${r.txt}  ${r.amt>0?"+":"−"}${fmt(Math.abs(r.amt))}`).join("\n");
  return `${t("statement")} · ${p.name}\n${COMPANY.name||""}\n\n${last}\n\n${L0.bal>=0?t("owesUs"):t("weOwe")}: ${moneyTxt(Math.abs(L0.bal))}\n\n${t("madeWith")} · daftarapp.co`;
}
function openWaText(phone, text){
  const ph = typeof waPhone==="function" ? waPhone(phone||"") : "";
  const url = (ph ? `https://wa.me/${ph}?text=` : "https://wa.me/?text=") + encodeURIComponent(text);
  const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.click();
}

/* ----- vouchers (receipts / payments) ----- */
async function saveVoucher(d, quiet){
  const type = d.type==="payment" ? "payment" : "receipt", id = d.id || newId(), x = d.id ? S.vouchers.find(v=>v.id===d.id) : null;
  const method = ["cash","transfer","card","cheque"].includes(d.method) ? d.method : "cash";
  const data = {...(x?strip(x):{createdAt:Date.now(), no:nextNo("vouchers", type==="receipt"?"RV":"PV")}), type, partyId:d.partyId, amount:r2(num(d.amount)), date:validDate(d.date)?d.date:today(),
    method, invoiceId: invById(d.invoiceId) ? d.invoiceId : "", note:(d.note||"").slice(0,200)};
  if(!await save("vouchers", id, data, true)) return false;
  const ch = S.cheques.find(c=>c.voucherId===id);
  if(method==="cheque"){
    const cd = {...(ch?strip(ch):{createdAt:Date.now(), status:"pending"}), dir:type==="receipt"?"in":"out", no:String(d.chNo||ch?.no||"").slice(0,30), bank:String(d.chBank||ch?.bank||"").slice(0,40),
      dueDate:validDate(d.chDue)?d.chDue:(ch?.dueDate||data.date), amount:data.amount, partyId:data.partyId, voucherId:id};
    await save("cheques", ch?.id || null, cd, true);
  } else if(ch) await remove("cheques", ch.id);
  if(!quiet){ render(); toast(t("vSaved",{x:t(type==="receipt"?"vReceipt":"vPayment"), a:moneyTxt(data.amount)})); }
  return true;
}
function voucherForm(x, preset={}){
  const type = x?.type || preset.type || "receipt", side = type==="receipt" ? "sale" : "purchase";
  const pid = x?.partyId || preset.partyId || "";
  const opts = partyOptions(side, pid), ch = x ? S.cheques.find(c=>c.voucherId===x.id) : null;
  const openInv = pid ? S.invoices.filter(i=>!i.void && i.partyId===pid && i.type===(type==="receipt"?"sale":"purchase") && (invCalc(i).total-invPaid(i)>0.005 || i.id===x?.invoiceId)) : [];
  openSheet({title: x ? `${t(type==="receipt"?"vReceipt":"vPayment")} ${x.no||""}` : t(type==="receipt"?"vNewR":"vNewP"), saveLabel: x?t("save"):t("record"),
    top:`<div class="field"><label for="f_partyId">${side==="sale"?t("invParty"):t("invSupplier")}</label><div class="inlinepick"><select id="f_partyId" name="partyId" data-vtype="${type}"><option value=""></option>${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===pid?"selected":""}>${esc(l)}</option>`).join("")}</select><button type="button" class="btn sm" data-act="quickParty" data-id="${side}">${icon("plus")}</button></div>
      ${pid?`<span class="hint">${balTxt(partyBal(pid))}</span>`:""}</div>`,
    fields:[{name:"amount",label:t("vAmount"),type:"money",big:true,value:x?.amount ?? preset.amount ?? ""},
      {name:"method",label:t("vMethod"),type:"chips",options:[["cash",t("cash")],["transfer",t("transfer")],["card",t("card")],["cheque",t("cheque")]],value:x?.method||"cash"},
      ...(openInv.length?[{name:"invoiceId",label:t("vForInv"),type:"select",options:[["",t("vNoInv")],...openInv.map(i=>[i.id,`${i.no} · ${fmt(invCalc(i).total-invPaid(i)+(i.id===x?.invoiceId?num(x.amount):0))}`])],value:x?.invoiceId||preset.invoiceId||""}]:[]),
      {name:"chNo",label:t("chNo"),value:ch?.no||"",max:30},{name:"chDue",label:t("chDue"),type:"date",value:ch?.dueDate||today()}],
    more:[{name:"date",label:t("date"),type:"date",value:x?.date||today()},{name:"chBank",label:t("chBank"),value:ch?.bank||"",max:40},{name:"note",label:t("note"),value:x?.note||"",max:200}],
    del: x ? {label:t("del"), run:async()=>{ if(ch) await remove("cheques", ch.id); return remove("vouchers", x.id); }} : null,
    submit: async v=>{
      if(!partyById(v.partyId)){ toast(t("eParty")); return false; }
      if(num(v.amount)<=0){ toast(t("eAmount")); return false; }
      return saveVoucher({...v, type, id:x?.id});
    }});
  chFieldsVis();
}
function chFieldsVis(){
  const m = (document.querySelector('#sheetBody [name="method"]:checked')||{}).value, on = m==="cheque";
  ["chNo","chDue","chBank"].forEach(n=>{ const el = document.getElementById("f_"+n); if(!el) return; const f = el.closest(".field"); if(f && !f.closest(".morebox")) f.hidden = !on; });
}

/* ----- cheques ----- */
const CH_ST = {pending:"chPending", deposited:"chDeposited", cleared:"chCleared", bounced:"chBounced", handed:"chHanded"};
function viewCheques(){
  const dir = S.cdir || "in";
  const list = S.cheques.filter(c=>c.dir===dir).sort((a,b)=>{ const oa = a.status==="cleared"||a.status==="bounced", ob = b.status==="cleared"||b.status==="bounced"; return oa-ob || (a.dueDate||"").localeCompare(b.dueDate||""); });
  const open = list.filter(c=>c.status==="pending"||c.status==="deposited"||c.status==="handed");
  let h = `<div class="seg two-seg" role="group"><button data-act="cdir" data-id="in" aria-pressed="${dir==="in"}">${t("chIn")}</button><button data-act="cdir" data-id="out" aria-pressed="${dir==="out"}">${t("chOut")}</button></div>`;
  h += `<div class="kpis two-k"><div class="kpi"><span class="label">${t("chPending")}</span><b>${money(sum(open,c=>num(c.amount)))}</b></div><div class="kpi"><span class="label">${t("chWeek")}</span><b>${money(sum(open.filter(c=>daysTo(c.dueDate)<=7),c=>num(c.amount)))}</b></div></div>`;
  h += `<div class="two"><button class="btn" data-act="newVoucher" data-id="${dir==="in"?"receipt":"payment"}" data-cheque="1">${icon("plus")}${dir==="in"?t("vNewR"):t("vNewP")}</button></div>`;
  if(!list.length) return h + `<div class="panel empty">${icon("bank","big")}<span>${t("noCheques")}</span></div>`;
  return h + `<div class="panel"><div class="list">${list.map(c=>{ const p = partyById(c.partyId), dt = daysTo(c.dueDate), done = c.status==="cleared"||c.status==="bounced";
    const when = done ? "" : dt<0 ? `<span class="negv">${t("chOverdue")}</span>` : dt===0 ? `<span class="due">${t("chToday")}</span>` : dt<=7 ? `<span class="due">${t("chInDays",{n:`<span class="num">${dt}</span>`})}</span>` : "";
    return `<button class="row" data-act="viewCheque" data-id="${esc(c.id)}"><span class="tx-ic ${c.dir==="in"?"inc":"exp"}">${icon("bank")}</span><div class="m"><b>${esc(p?p.name:"")}</b><span class="sub">${c.no?`<span class="num ltr">#${esc(c.no)}</span> · `:""}${c.bank?esc(c.bank)+" · ":""}${fdate(c.dueDate)}${when?" · "+when:""}</span></div><div class="col end"><b>${money(num(c.amount))}</b><span class="pill ${c.status==="cleared"?"good":c.status==="bounced"?"bad":"warn"}">${t(CH_ST[c.status]||"chPending")}</span></div></button>`; }).join("")}</div></div>`;
}
function chequeSheet(id){
  const c = S.cheques.find(x=>x.id===id); if(!c) return; const p = partyById(c.partyId);
  const acts = c.dir==="in" ? [["deposited","chMarkDep"],["cleared","chMarkClr"],["bounced","chMarkBnc"],["pending","chPending"]] : [["handed","chHanded"],["cleared","chMarkClr"],["bounced","chMarkBnc"],["pending","chPending"]];
  openSheet({title:`${t("cheque")} ${c.no?"#"+c.no:""}`, noSave:true, html:`<div class="kv"><div><span>${c.dir==="in"?t("invParty"):t("invSupplier")}</span><b>${esc(p?p.name:"")}</b></div><div><span>${t("vAmount")}</span><b>${money(num(c.amount))}</b></div><div><span>${t("chDue")}</span><b>${fdate(c.dueDate)}</b></div>${c.bank?`<div><span>${t("chBank")}</span><b>${esc(c.bank)}</b></div>`:""}<div><span>${t("status")}</span><b>${t(CH_ST[c.status]||"chPending")}</b></div></div>
    <div class="grid2">${acts.filter(a=>a[0]!==c.status).map(([s,l])=>`<button type="button" class="btn ${s==="bounced"?"danger":s==="cleared"?"primary":""}" data-act="chSet" data-id="${esc(c.id)}" data-s="${s}">${t(l)}</button>`).join("")}
    ${c.voucherId?`<button type="button" class="btn ghost" data-act="editVoucher" data-id="${esc(c.voucherId)}">${icon("gear")}${t("edit")}</button>`:""}</div>`});
}
async function chSet(id, st){
  const c = S.cheques.find(x=>x.id===id); if(!c) return;
  if(!await save("cheques", c.id, {...strip(c), status:st, statusAt:today()}, true)) return;
  const v = S.vouchers.find(x=>x.id===c.voucherId);
  if(v){ const wantVoid = st==="bounced"; if(!!v.void!==wantVoid) await save("vouchers", v.id, {...strip(v), void:wantVoid}, true); }
  closeSheet(); render(); if(st==="bounced") toast(t("chBouncedToast",{x:(partyById(c.partyId)||{}).name||""}));
}

/* ----- items ----- */
function itemsSheet(){
  const list = S.items.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  openSheet({title:t("items"), noSave:true, html:`<button type="button" class="btn primary" data-act="newItem">${icon("plus")}${t("itemNew")}</button>
    ${list.length?`<div class="list">${list.map(i=>`<button type="button" class="row" data-act="editItem" data-id="${esc(i.id)}"><div class="m"><b>${esc(i.name)}</b><span class="sub">${i.sku?esc(i.sku)+" · ":""}${i.unit?esc(i.unit)+" · ":""}${t("lnTax")} <span class="num">${num(i.tax??taxRate())}%</span></span></div><div class="col end"><b>${money(num(i.price))}</b>${num(i.cost)?`<span class="sub">${t("itemCost")} ${fmt(num(i.cost))}</span>`:""}</div></button>`).join("")}</div>`:`<span class="hint">${t("noItems")}</span>`}`});
}
function itemForm(i){
  openSheet({title: i ? i.name : t("itemNew"), saveLabel: i?t("save"):t("add"),
    fields:[{name:"name",label:t("itemName"),value:i?.name||"",max:120},{name:"price",label:t("itemPrice"),type:"money",value:i?.price||""},{name:"cost",label:t("itemCost"),type:"money",value:i?.cost||""},
      {name:"tax",label:t("lnTax"),type:"chips",options:taxOpts(i?.tax??taxRate()).map(r=>[String(r), r?r+"%":t("taxExempt")]),value:String(num(i?.tax??taxRate()))}],
    more:[{name:"service",label:t("isService"),type:"chips",options:[["0",t("kProduct")],["1",t("kService")]],value:i?.service?"1":"0"},
      {name:"openQty",label:t("openQty"),type:"money",value:i?.openQty||""},{name:"minQty",label:t("minQty"),type:"money",value:i?.minQty||""},
      {name:"unit",label:t("itemUnit"),value:i?.unit||"",max:20,ph:t("itemUnitPh")},{name:"sku",label:t("itemSku"),value:i?.sku||"",max:40}],
    del: i ? {label:t("del"), run:async()=>{ const ok = await remove("items", i.id); if(ok) setTimeout(itemsSheet, 30); return ok; }} : null,
    submit: async v=>{ if(!v.name){ toast(t("ePartyName")); return false; }
      const ok = await save("items", i?.id, {...(i?strip(i):{createdAt:Date.now()}), name:v.name.slice(0,120), price:num(v.price), cost:num(v.cost), tax:num(v.tax), unit:(v.unit||"").slice(0,20), sku:(v.sku||"").slice(0,40),
        service:v.service==="1", openQty:num(v.openQty), minQty:num(v.minQty), openDate:i?.openDate||today()}, true);
      if(ok && S.btab!=="stock") setTimeout(itemsSheet, 30); return ok; }});
}

/* ----- reports ----- */
function viewReports(){
  const per = S.rper || "month"; if(!S.rstart) S.rstart = monthStartOf(today());
  let a, b;
  if(per==="month"){ a = S.rstart; b = monthEnd(a); }
  else if(per==="bi"){ const d = parseD(S.rstart), m0 = d.getMonth() - d.getMonth()%2; a = iso(new Date(d.getFullYear(), m0, 1)); b = monthEnd(addMonths(a,1)); }
  else { const y = parseD(S.rstart).getFullYear(); a = `${y}-01-01`; b = `${y}-12-31`; }
  const inP = x => inRange(x.date,a,b), invs = liveInv().filter(inP);
  const tot = tp => invs.filter(x=>x.type===tp).reduce((o,x)=>{ const c = invCalc(x); o.net += c.net; o.tax += c.tax; return o; }, {net:0,tax:0});
  const s = tot("sale"), sr = tot("saleReturn"), pu = tot("purchase"), pr = tot("purchaseReturn");
  const sales = s.net - sr.net, purch = pu.net - pr.net, tOut = s.tax - sr.tax, tIn = pu.tax - pr.tax, tDue = tOut - tIn;
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  const label = per==="year" ? `<span class="num">${parseD(a).getFullYear()}</span>` : per==="bi" ? `${MONTHS[LANG][parseD(a).getMonth()]} – ${monthName(b)}` : monthName(a);
  let h = `<div class="seg three-seg" role="group">${[["month",t("rMonth")],["bi",t("rQuarter")],["year",t("rYear")]].map(([k,l])=>`<button data-act="rper" data-id="${k}" aria-pressed="${per===k}">${l}</button>`).join("")}</div>
    <div class="daybar"><button class="iconbtn" data-act="rnav" data-id="-1">${icon(prev)}</button><div class="d"><b>${label}</b></div><button class="iconbtn" data-act="rnav" data-id="1">${icon(next)}</button></div>`;
  h += `<div class="kpis"><div class="kpi"><span class="label">${t("rSales")}</span><b class="pos">${money(sales)}</b></div><div class="kpi"><span class="label">${t("rPurch")}</span><b>${money(purch)}</b></div>
    <div class="kpi hero ${sales-purch<0?"neg":""}"><span class="label">${t("rGross")}</span><b>${money(Math.abs(sales-purch))}</b></div></div>`;
  h += `<div class="panel"><span class="label">${t("taxTotal")} · ${label}</span><div class="kv"><div><span>${t("rTaxOut")}</span><b>${money(tOut)}</b></div><div><span>${t("rTaxIn")}</span><b>− ${money(tIn)}</b></div></div>
    <div class="total"><span class="label">${tDue>=0?t("rTaxDue"):t("rTaxRefund")}</span><b class="${tDue>=0?"due":"pos"}">${money(Math.abs(tDue))}</b></div><span class="hint">${t("rTaxNote")}</span></div>`;
  // aging of what customers owe, from open sales invoices (by due date)
  const ag = [0,0,0,0,0]; S.invoices.filter(x=>!x.void && x.type==="sale").forEach(x=>{ const left = invCalc(x).total-invPaid(x); if(left<=0.005) return; const d = -daysTo(x.dueDate||x.date);
    ag[d<=0?0:d<=30?1:d<=60?2:d<=90?3:4] += left; });
  const agL = ["rAge0","rAge30","rAge60","rAge90","rAge90p"], agT = sum(ag);
  h += `<div class="panel"><span class="label">${t("rAging")}</span>${agT>0.005?agL.map((k,i)=>`<div class="cat"><span>${t(k)}</span><b class="${i>=3&&ag[i]?"negv":""}">${money(ag[i])}</b><div class="bar"><span style="width:${ag[i]/agT*100}%"></span></div></div>`).join(""):`<span class="hint">${t("allGood")}</span>`}</div>`;
  const byC = {}; invs.filter(x=>x.type==="sale").forEach(x=>{ byC[x.partyId] = (byC[x.partyId]||0) + invCalc(x).net; });
  const top = Object.entries(byC).sort((x,y)=>y[1]-x[1]).slice(0,6), mx = top.length ? top[0][1] : 1;
  if(top.length) h += `<div class="panel"><span class="label">${t("rTop")}</span>${top.map(([pid,v])=>`<div class="cat"><span>${esc((partyById(pid)||{}).name||"")}</span><b>${money(v)}</b><div class="bar"><span style="width:${v/mx*100}%"></span></div></div>`).join("")}</div>`;
  return h + `<button class="btn ghost" data-act="exportInv">${icon("wallet")}${t("exportInv")}</button>`;
}
function exportInvoices(){
  const rows = [[t("invNoS"),t("date"),LANG==="en"?"Type":"النوع",t("pName"),t("pTaxNo"),t("subTotal"),t("taxTotal"),t("grandTotal"),t("paidL"),t("remainingL"),LANG==="en"?"Status":"الحالة"]];
  S.invoices.filter(x=>!x.void).sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(x=>{ const c = invCalc(x), p = partyById(x.partyId)||{}, pd = invPaid(x);
    rows.push([x.no, x.date, t(INV_T[x.type]), p.name||"", p.taxNo||"", c.net, c.tax, c.total, x.type==="quote"?"":pd, x.type==="quote"?"":r2(c.total-pd), t({paid:"stPaid",partial:"stPartial",unpaid:"stUnpaid",overdue:"stOverdue",quote:"stQuote"}[invState(x)])]); });
  const csv = "﻿" + rows.map(r=>r.map(v=>{ const s = String(v??""); return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download = `daftar-invoices-${today()}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}

/* ----- home alerts for the books ----- */
function bookAlerts(){
  const out = [];
  const od = S.invoices.filter(x=>!x.void && x.type==="sale" && invState(x)==="overdue");
  if(od.length) out.push(["bad","file", t("aOverdueInv",{n:`<span class="num">${od.length}</span>`, x:money(sum(od,x=>invCalc(x).total-invPaid(x)))})]);
  const ch = S.cheques.filter(c=>(c.status==="pending"||c.status==="deposited"||c.status==="handed") && daysTo(c.dueDate)<=7);
  if(ch.length) out.push(["warn","bank", t("aChequesDue",{n:`<span class="num">${ch.length}</span>`, x:money(sum(ch,c=>num(c.amount)))})]);
  const low = typeof lowItems==="function" ? lowItems() : []; if(low.length) out.push(["warn","tag", t("aLowStock",{n:`<span class="num">${low.length}</span>`}) + ": " + low.slice(0,3).map(i=>esc(i.name)).join("، ")]);
  const rd = typeof radarAlert==="function" ? radarAlert() : null; if(rd) out.unshift(rd);
  return out;
}

/* ----- actions ----- */
const _q0 = A.q;
Object.assign(A, {
  q: id => { if(id==="pos"){ closeSheet(); posOpen(); return; } if(id==="inv"){ closeSheet(); A.newInv("sale"); } else if(id==="rec"){ closeSheet(); voucherForm(null, {type:"receipt"}); } else _q0(id); },
  btab: id => { S.btab = id; scrollTo(0,0); render(); },
  ifilter: id => { S.ifilter = id; render(); }, pfilter: id => { S.pfilter = id; render(); }, cdir: id => { S.cdir = id; render(); },
  rper: id => { S.rper = id; render(); },
  rnav: id => { const n = Number(id), per = S.rper||"month"; S.rstart = per==="year" ? addMonths(S.rstart, 12*n) : addMonths(S.rstart, (per==="bi"?2:1)*n); render(); },
  newInv: (id, el) => { closeSheet(); const pid = el && el.dataset.p; if(!S.parties.length){ partyForm(null, {kind:id==="purchase"?"supplier":"customer"}, nid=>setTimeout(()=>invForm(null,{type:id, partyId:nid}),30)); return; } invForm(null, {type:id||"sale", partyId:pid||""}); },
  viewInv: id => { closeSheet(); viewInvSheet(id); },
  editInv: id => { closeSheet(); invForm(invById(id)); },
  dupInv: id => { const x = invById(id); if(!x) return; closeSheet(); invForm(null, {type:x.type, partyId:x.partyId, lines:x.lines, incTax:x.incTax, notes:x.notes, unitId:x.unitId}); },
  retInv: id => { const x = invById(id); if(!x) return; closeSheet(); invForm(null, {type:x.type==="sale"?"saleReturn":"purchaseReturn", partyId:x.partyId, lines:x.lines, incTax:x.incTax, srcId:x.id, unitId:x.unitId}); },
  quoteToInv: id => { const x = invById(id); if(!x) return; closeSheet(); invForm(null, {type:"sale", partyId:x.partyId, lines:x.lines, incTax:x.incTax, notes:x.notes, srcId:x.id, unitId:x.unitId}); },
  payInv: id => { const x = invById(id); if(!x) return; closeSheet(); voucherForm(null, {type:isSaleSide(x.type)?"receipt":"payment", partyId:x.partyId, invoiceId:x.id, amount:String(r2(invCalc(x).total-invPaid(x)))}); },
  printInv: id => { const x = invById(id); if(x){ closeSheet(); printDoc(invDocHtml(x)); } },
  shareInv: id => { const x = invById(id); if(x) openWaText((partyById(x.partyId)||{}).phone, invWaText(x)); },
  addLine: () => { const box = document.getElementById("invLines"); if(!box) return; const ls = readLines(); ls.push({name:"",qty:1,price:"",tax:taxRate()}); box.innerHTML = ls.map(lineRow).join(""); const n = box.querySelectorAll(".ln-name"); if(n.length) n[n.length-1].focus(); invTotals(); },
  delLine: id => { const box = document.getElementById("invLines"); if(!box) return; const ls = readLines(); ls.splice(Number(id),1); if(!ls.length) ls.push({name:"",qty:1,price:"",tax:taxRate()}); box.innerHTML = ls.map(lineRow).join(""); invTotals(); },
  payAll: id => { const el = document.getElementById("f_paidNow"); if(el) el.value = id; },
  quickParty: (id, el) => { if(document.getElementById("qparty")) return; el.closest(".inlinepick").insertAdjacentHTML("afterend", `<div class="inlineadd"><input id="qparty" maxlength="100" placeholder="${esc(t("pName"))}"><button type="button" class="btn sm primary" data-act="quickPartySave" data-id="${id}">${t("add")}</button></div>`); document.getElementById("qparty").focus(); },
  quickPartySave: async id => { const sel = document.getElementById("f_partyId"), inp = document.getElementById("qparty"), nm = (inp && inp.value || "").trim(); if(!sel || !nm){ toast(t("ePartyName")); return; }
    const pid = newId(); if(!await save("parties", pid, {name:nm.slice(0,100), kind:id==="purchase"?"supplier":"customer", createdAt:Date.now(), openBal:0}, true)) return;
    sel.insertAdjacentHTML("beforeend", `<option value="${esc(pid)}">${esc(nm)}</option>`); sel.value = pid; inp.closest(".inlineadd").remove(); toast(t("added",{x:nm})); },
  newParty: () => partyForm(null, {kind:S.pfilter==="supplier"?"supplier":"customer"}),
  editParty: id => { closeSheet(); partyForm(partyById(id)); },
  viewParty: id => { S.stFrom = ""; viewPartySheet(id); },
  stRange: (id, el) => { S.stFrom = el.dataset.r==="month" ? monthStartOf(today()) : ""; viewPartySheet(id); },
  shareSt: id => { const p = partyById(id); if(p) openWaText(p.phone, stWaText(id)); },
  printSt: id => { if(partyById(id)){ closeSheet(); printDoc(stDocHtml(id)); } },
  newVoucher: (id, el) => { closeSheet(); voucherForm(null, {type:id==="payment"?"payment":"receipt", partyId:(el&&el.dataset.p)||""}); if(el && el.dataset.cheque){ const r = document.querySelector('#sheetBody [name="method"][value="cheque"]'); if(r){ r.checked = true; chFieldsVis(); } } },
  editVoucher: id => { const v = S.vouchers.find(x=>x.id===id); if(v){ closeSheet(); voucherForm(v); } },
  viewCheque: id => chequeSheet(id), chSet: (id, el) => chSet(id, el.dataset.s),
  items: () => itemsSheet(), newItem: () => itemForm(null), editItem: id => itemForm(S.items.find(i=>i.id===id)),
  exportInv: () => exportInvoices(),
});
document.addEventListener("input", e=>{
  if(e.target.closest && e.target.closest("#invLines")){
    if(e.target.dataset.f==="name"){ const it = S.items.find(i=>i.name===e.target.value); if(it){ const r = e.target.closest(".ln"), pr = r.querySelector('[data-f="price"]'), tx = r.querySelector('[data-f="tax"]');
      const p = INV && !isSaleSide(INV.type) ? (num(it.cost)||num(it.price)) : num(it.price); if(pr && !num(pr.value) && p) pr.value = p; if(tx && it.tax!=null) tx.value = String(num(it.tax)); } }
    invTotals(); }
  if(e.target.id==="f_discount") invTotals();
  if(e.target.id==="iq"||e.target.id==="pq"){ S[e.target.id] = e.target.value; const id = e.target.id, pos = e.target.selectionStart; render(); const el = document.getElementById(id); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } }
});
document.addEventListener("change", e=>{
  if(e.target.closest && e.target.closest("#invLines")) invTotals();
  if(e.target.name==="incTax") invTotals();
  if(e.target.name==="method") chFieldsVis();
  if(e.target.id==="f_partyId" && e.target.dataset.vtype){ const v = vals(); voucherForm(null, {type:e.target.dataset.vtype, partyId:e.target.value, amount:v.amount}); }
});
