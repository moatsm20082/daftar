/* =====================================================================
   Cash radar: day-by-day cash forecast from what is already in Daftar.
   Inflows: received cheques, unpaid sales invoices, usual daily income.
   Outflows: issued cheques, unpaid bills, wages (by pay period), social
   security (15th of next month), income tax withheld, sales tax (2-month
   periods, 30 days after), usual daily expenses.
   Two lines: "expected" (everything) and "safe" (only sure money).
   ===================================================================== */
Object.assign(L, {
  bkRadar:["السيولة","Cash radar"], rdTitle:["رادار السيولة","Cash radar"],
  rdSub:["هل رح يكفي معك مصاري؟ دفتر بيحسبها من الشيكات والفواتير والرواتب والضمان والضريبة.","Will your cash last? Worked out from cheques, invoices, wages, social security and tax."],
  rdNow:["معك هلأ (كاش وبنك)","Cash & bank now"], rdIn:["داخل","Coming in"], rdOut:["طالع","Going out"], rdLow:["أقل رصيد","Lowest point"],
  rdDays:["{n} يوم","{n} days"], rdFix:["صحّح","Correct"], rdFixT:["قدّيش معك فعلياً اليوم؟","How much do you actually have today?"],
  rdFixHint:["اجمع الكاش اللي معك ورصيد البنك. دفتر بيكمّل من هون وبيضيف كل حركة بعد اليوم.","Add your cash and bank balance. Daftar continues from here and adds every move after today."],
  rdMin:["أقل رصيد بدك تضل فوقه","Minimum balance to keep"], rdMinHint:["إذا الرصيد المتوقع نزل تحته بنبّهك.","You'll be warned if the forecast drops below it."],
  rdAvg:["احسب المصاريف والمداخيل المعتادة","Include usual daily income & expenses"], rdSettings:["إعدادات الرادار","Radar settings"],
  rdGood:["وضعك منيح. الرصيد ما بينزل تحت {m} خلال {n} يوم.","You're fine. Cash stays above {m} for the next {n} days."],
  rdWarn:["انتبه: إذا ما حصّلت فلوسك من الزباين، رصيدك بينزل لـ {x} بتاريخ {d}.","Careful: if customers don't pay, cash drops to {x} on {d}."],
  rdBad:["رح ينقصك {x} بتاريخ {d}.","You'll be short {x} on {d}."],
  rdExpected:["المتوقع","Expected"], rdSafe:["لو ما حصّلت من الزباين","If customers don't pay"],
  rdFix1:["كيف بتمرق؟","How to get through"], rdCollect:["حصّل من {x}","Collect from {x}"], rdCollectS:["عليه {a}","Owes {a}"],
  rdDeposit:["أودع الشيكات المستحقة ({n})","Deposit cheques already due ({n})"], rdPostpone:["اطلب تأجيل فاتورة {x}","Ask to postpone {x}'s bill"],
  rdPostS:["{a} · مستحقة {d}","{a} · due {d}"], rdCovered:["هيك بتغطي النقص.","That covers the gap."], rdNotCovered:["حتى مع هيك بيضل ناقص {x}. فكّر بتمويل أو تأجيل دفعات.","Still {x} short. Consider financing or delaying payments."],
  rdNext:["الجاي","Coming up"], rdNone:["ما في حركات مستحقة بهالفترة.","Nothing due in this period."],
  rdEmpty:["سجّل شيكاتك وفواتيرك ورواتب الشغيلة، ودفتر بيرسملك وين رايحة مصاريك بالأيام الجاية.","Record your cheques, invoices and team, and Daftar shows where your cash is heading."],
  evChIn:["شيك من {x}","Cheque from {x}"], evChOut:["شيك لـ {x}","Cheque to {x}"], evInv:["فاتورة {n} · {x}","Invoice {n} · {x}"], evInvLate:["فاتورة متأخرة {n} · {x}","Overdue invoice {n} · {x}"],
  evBill:["فاتورة مورّد {n} · {x}","Bill {n} · {x}"], evWages:["رواتب الشغيلة","Wages"], evSS:["اشتراكات الضمان عن {m}","Social security for {m}"],
  evTax:["ضريبة الدخل المقتطعة عن {m}","Income tax withheld for {m}"], evVat:["ضريبة المبيعات عن {m}","Sales tax for {m}"], evAvg:["المصاريف والمداخيل المعتادة","Usual daily income & expenses"],
  rdHome:["السيولة لـ {n} يوم","Cash for {n} days"], rdHomeLow:["أقل رصيد {x} بتاريخ {d}","Lowest {x} on {d}"], rdOpen:["افتح الرادار","Open radar"],
  aRadar:["رادار السيولة: رح ينقصك {x} بتاريخ {d}","Cash radar: {x} short on {d}"],
});
ICON.radar = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18.5 5.5"/><circle cx="12" cy="12" r="1.2"/>';

const rdSet = () => { const s = (COMPANY&&COMPANY.settings)||{}; return {min:num(s.cashMin)||0, now:s.cashNow&&validDate(s.cashNow.date)?s.cashNow:null, avg:s.radarAvg!==false}; };
const isCashAcc = a => /^1[12]/.test(String(a));
const ymOf = d => d.slice(0,7);
const mName = d => `${MONTHS[LANG][parseD(d).getMonth()]} ${d.slice(0,4)}`;

/* cash + bank on a date, from the ledger, shifted by the owner's correction if there is one */
function cashOn(J, d){ let s = 0; J.forEach(e=>{ if(e.date<=d) e.lines.forEach(l=>{ if(isCashAcc(l.acc)) s += l.dr-l.cr; }); }); return s; }
function cashNow(J){
  const led = cashOn(J, today()), c = rdSet().now;
  if(c && c.date<=today()) return r2(num(c.amount) + led - (c.base!==undefined ? num(c.base) : cashOn(J, c.date)));
  return r2(led);
}

/* every expected movement in the next H days */
function radarEvents(H, J){
  const t0 = today(), end = addDays(t0, H), ev = [];
  const push = (date, amt, kind, label, sure, act, id) => { if(Math.abs(amt)<0.005) return; const d = date<t0 ? t0 : date; if(d<=end) ev.push({date:d, amt:r2(amt), kind, label, sure, act, id}); };
  const pn = id => (partyById(id)||{}).name || "";
  // cheques not yet cleared
  S.cheques.forEach(c=>{
    if(c.dir==="in" && (c.status==="pending"||c.status==="deposited")) push(c.dueDate||t0, num(c.amount), "chIn", t("evChIn",{x:pn(c.partyId)}), true, "viewCheque", c.id);
    if(c.dir==="out" && (c.status==="pending"||c.status==="handed")) push(c.dueDate||t0, -num(c.amount), "chOut", t("evChOut",{x:pn(c.partyId)}), true, "viewCheque", c.id);
  });
  // unpaid invoices (money already promised by a cheque is counted above, through its voucher)
  liveInv().forEach(x=>{
    if(x.type!=="sale" && x.type!=="purchase") return;
    const left = r2(invCalc(x).total - invPaid(x)); if(left<=0.005) return;
    const due = x.dueDate || x.date || t0;
    if(x.type==="sale"){ const late = due<t0; push(late ? addDays(t0,7) : due, left, "inv", t(late?"evInvLate":"evInv",{n:x.no||"",x:pn(x.partyId)}), false, "viewInv", x.id); }
    else push(due, -left, "bill", t("evBill",{n:x.supNo||x.no||"",x:pn(x.partyId)}), true, "viewInv", x.id);
  });
  // wages, social security and income tax: what is owed now + what the team will earn
  const team = S.staff.filter(s=>s.active!==false && num(s.rate)>0);
  if(team.length){
    const ssOn = typeof ssEmpRate==="function", ee = ssOn?ssEmpRate():0, er = ssOn?ssErRate():0;
    const ps = periodStartFor(t0), pe0 = S.period==="month" ? monthEnd(ps) : addDays(ps,6);
    let owed = sum(team, s=>Math.max(0, account(s, ps, t0).remaining));
    const ssM = {}, taxM = {};
    // what was already earned this month and last month (for SS / tax due dates)
    const lm = addMonths(monthStartOf(t0), -1);
    J.forEach(e=>{ if(e.date>=lm && e.date<=t0) e.lines.forEach(l=>{ const m = ymOf(e.date); if(l.acc==="25") ssM[m] = (ssM[m]||0) + l.cr - l.dr; if(l.acc==="26") taxM[m] = (taxM[m]||0) + l.cr - l.dr; }); });
    // pay periods inside the horizon
    let pEnd = pe0, acc = owed, d = addDays(t0,1);
    const accrue = day => { let net = 0; team.forEach(s=>{ if(isOff(day)) return; const w = dayRate(s, day), e1 = s.ss ? w*ee : 0, tx = num(s.taxMonthly) ? num(s.taxMonthly)/workDaysMonth(day) : 0;
      net += w - e1 - tx; const m = ymOf(day); if(s.ss) ssM[m] = (ssM[m]||0) + w*(ee+er); if(tx) taxM[m] = (taxM[m]||0) + tx; }); return net; };
    while(pEnd<=end){
      for(; d<=pEnd; d=addDays(d,1)) acc += accrue(d);
      push(pEnd, -acc, "wages", t("evWages"), true, "go", "team");
      acc = 0; pEnd = S.period==="month" ? monthEnd(addMonths(pEnd,1)) : addDays(pEnd,7);
    }
    for(; d<=end; d=addDays(d,1)) accrue(d);   // keeps SS / tax months complete
    Object.keys(ssM).forEach(m=>{ const due = `${addMonths(m+"-01",1).slice(0,7)}-15`; if(due>=t0) push(due, -ssM[m], "ss", t("evSS",{m:mName(m+"-01")}), true); });
    Object.keys(taxM).forEach(m=>{ const due = monthEnd(addMonths(m+"-01",1)); if(due>=t0) push(due, -taxM[m], "tax", t("evTax",{m:mName(m+"-01")}), true); });
  }
  // sales tax: 2-month periods (Jan–Feb, Mar–Apr…), paid within 30 days after the period ends
  const taxed = liveInv().filter(x=>x.type!=="quote");
  if(taxed.some(x=>invCalc(x).tax>0)){
    const y = Number(t0.slice(0,4)), m0 = parseD(t0).getMonth();
    const startCur = iso(new Date(y, m0 - (m0%2), 1));
    [addMonths(startCur,-2), startCur, addMonths(startCur,2)].forEach(a=>{
      const b = monthEnd(addMonths(a,1)), due = addDays(b,30); if(due<t0 || a>t0) return;
      let out = 0; taxed.filter(x=>x.date>=a && x.date<=b).forEach(x=>{ const tx = invCalc(x).tax; out += x.type==="sale" ? tx : x.type==="saleReturn" ? -tx : x.type==="purchase" ? -tx : tx; });
      if(out>0.005) push(due, -out, "vat", t("evVat",{m:`${mName(a)} – ${mName(b)}`}), true);
    });
  }
  // usual daily income & expenses (last 60 days), if there is enough history
  if(rdSet().avg){
    const a = addDays(t0,-60), exps = S.expenses.filter(x=>x.date>=a && x.date<=t0), incs = S.income.filter(x=>x.date>=a && x.date<=t0);
    const first = [...exps, ...incs].map(x=>x.date).sort()[0];
    const span = first ? Math.round((parseD(t0)-parseD(first))/864e5)+1 : 0;
    if(span>=14){
      // only steady flows count: lumpy money (a contractor's progress payment) isn't a daily habit
      const steady = arr => new Set(arr.map(x=>x.date)).size >= 8;
      const ex = steady(exps) ? sum(exps, x=>num(x.amount))/span : 0, ic = steady(incs) ? sum(incs, x=>num(x.amount)-commOf(x))/span : 0;
      for(let d=addDays(t0,1); d<=end; d=addDays(d,1)){ if(ex) push(d, -ex, "avgOut", t("evAvg"), true); if(ic) push(d, ic, "avgIn", t("evAvg"), false); }
    }
  }
  return ev.sort((x,y)=>x.date.localeCompare(y.date) || x.amt-y.amt);
}

/* the forecast: start balance, two running lines, lowest points */
function radar(H=30){
  const J = journal(), start = cashNow(J), ev = radarEvents(H, J), t0 = today();
  const days = []; let e = start, s = start, i = 0;
  for(let n=0; n<=H; n++){ const d = addDays(t0,n);
    while(i<ev.length && ev[i].date===d){ e += ev[i].amt; if(ev[i].sure) s += ev[i].amt; i++; }
    days.push({d, e:r2(e), s:r2(s)}); }
  const lowE = days.reduce((m,x)=>x.e<m.e?x:m, days[0]), lowS = days.reduce((m,x)=>x.s<m.s?x:m, days[0]);
  const inn = sum(ev.filter(x=>x.amt>0), x=>x.amt), out = -sum(ev.filter(x=>x.amt<0), x=>x.amt);
  const min = rdSet().min, firstBadE = days.find(x=>x.e<min-0.005), firstBadS = days.find(x=>x.s<min-0.005);
  const state = firstBadE ? "bad" : firstBadS ? "warn" : "good";
  return {H, start, ev, days, lowE, lowS, inn:r2(inn), out:r2(out), min, state, firstBadE, firstBadS};
}
const radarHasData = () => S.cheques.length || S.invoices.length || S.staff.some(s=>s.active!==false && num(s.rate)>0) || S.expenses.length || S.income.length;

/* ways to get through a shortfall */
function radarFixes(R){
  const low = R.state==="bad" ? R.lowE : R.lowS, gap = r2(R.min - low.s);   // plan for the safe line
  if(gap<=0.005) return null;
  const out = []; let cover = 0;
  // cheques already due but still in the drawer
  const drawer = S.cheques.filter(c=>c.dir==="in" && c.status==="pending" && (c.dueDate||"")<=today());
  if(drawer.length){ const a = sum(drawer,c=>num(c.amount)); out.push({ic:"bank", b:t("rdDeposit",{n:`<span class="num">${drawer.length}</span>`}), s:money(a), act:"btab", id:"cheques"}); }
  // biggest balances owed to us
  S.parties.filter(p=>!p.archived).map(p=>({p, b:partyBal(p.id)})).filter(x=>x.b>0.005).sort((a,b)=>b.b-a.b).slice(0,6).forEach(x=>{
    if(cover>=gap) return; cover += x.b; out.push({ic:"wallet", b:t("rdCollect",{x:esc(x.p.name)}), s:t("rdCollectS",{a:money(x.b)}), act:"viewParty", id:x.p.id}); });
  // supplier bills due before the low point
  R.ev.filter(x=>x.kind==="bill" && x.date<=low.d).sort((a,b)=>a.amt-b.amt).slice(0,3).forEach(x=>{
    const inv = invById(x.id); if(cover>=gap || !inv) return; cover += -x.amt;
    out.push({ic:"file", b:t("rdPostpone",{x:esc((partyById(inv.partyId)||{}).name||"")}), s:t("rdPostS",{a:money(-x.amt), d:fdate(x.date)}), act:"viewInv", id:x.id}); });
  return {gap, out, covered:cover>=gap, left:r2(gap-cover)};
}

/* ----- chart (inline SVG, left→right in time) ----- */
function radarChart(R){
  const W = 640, Hh = 210, P = {l:8, r:8, t:16, b:26};
  const vals = R.days.flatMap(x=>[x.e, x.s]).concat([R.min, 0]), lo = Math.min(...vals), hi = Math.max(...vals), span = (hi-lo) || 1;
  const X = i => P.l + i*(W-P.l-P.r)/Math.max(1,R.days.length-1), Y = v => P.t + (hi-v)*(Hh-P.t-P.b)/span;
  const line = k => R.days.map((x,i)=>`${X(i).toFixed(1)},${Y(x[k]).toFixed(1)}`).join(" ");
  const iE = R.days.indexOf(R.lowE), mid = Math.floor((R.days.length-1)/2);
  const area = `${X(0)},${Y(lo)} ${line("e")} ${X(R.days.length-1)},${Y(lo)}`;
  const minY = Y(R.min);
  return `<figure class="rdchart" aria-label="${esc(t("rdTitle"))}"><svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" role="img">
    <polygon class="rd-area" points="${area}"/>
    ${lo<R.min ? `<rect class="rd-danger" x="${P.l}" y="${minY}" width="${W-P.l-P.r}" height="${Math.max(0,Y(lo)-minY)}"/>` : ""}
    <line class="rd-zero" x1="${P.l}" x2="${W-P.r}" y1="${minY}" y2="${minY}"/>
    <polyline class="rd-safe" points="${line("s")}"/><polyline class="rd-exp" points="${line("e")}"/>
    <circle class="rd-dot ${R.lowE.e<R.min?"bad":""}" cx="${X(iE)}" cy="${Y(R.lowE.e)}" r="5"/>
  </svg><div class="rd-x"><span>${fdate(R.days[0].d)}</span><span>${fdate(R.days[mid].d)}</span><span>${fdate(R.days[R.days.length-1].d)}</span></div>
  <figcaption class="rd-key"><span><i class="k-exp"></i>${t("rdExpected")}</span><span><i class="k-safe"></i>${t("rdSafe")}</span></figcaption></figure>`;
}

/* ----- the page ----- */
function viewRadar(){
  const H = S.rdH || 30, R = radar(H);
  let h = `<div class="panel rd-head"><div class="col"><b>${t("rdTitle")}</b><span class="sub">${t("rdSub")}</span></div><button class="btn sm ghost" data-act="rdSettings">${icon("gear")}${t("rdSettings")}</button></div>`;
  h += `<div class="chiprow">${[14,30,60,90].map(n=>`<button class="chipbtn" data-act="rdH" data-id="${n}" aria-pressed="${H===n}">${t("rdDays",{n:`<span class="num">${n}</span>`})}</button>`).join("")}</div>`;
  if(!radarHasData()) return h + `<div class="panel empty">${icon("radar","big")}<span>${t("rdEmpty")}</span></div>`;
  const msg = R.state==="good" ? t("rdGood",{m:money(R.min), n:`<span class="num">${H}</span>`})
    : R.state==="warn" ? t("rdWarn",{x:money(R.lowS.s), d:fdate(R.firstBadS.d)}) : t("rdBad",{x:money(R.min-R.lowE.e), d:fdate(R.firstBadE.d)});
  h += `<div class="alert ${R.state}">${icon(R.state==="good"?"check":"alert")}<span>${msg}</span></div>`;
  h += `<div class="kpis"><div class="kpi"><span class="label">${t("rdNow")}</span><b>${money(R.start)}</b><button class="linkbtn" data-act="rdFix">${t("rdFix")}</button></div>
    <div class="kpi"><span class="label">${t("rdIn")}</span><b class="pos">${money(R.inn)}</b></div><div class="kpi"><span class="label">${t("rdOut")}</span><b>${money(R.out)}</b></div>
    <div class="kpi ${R.lowE.e<R.min?"neg":""}"><span class="label">${t("rdLow")}</span><b class="${R.lowE.e<0?"negv":""}">${money(R.lowE.e)}</b><span class="sub">${fdate(R.lowE.d)}</span></div></div>`;
  h += `<div class="panel">${radarChart(R)}</div>`;
  const fx = R.state!=="good" ? radarFixes(R) : null;
  if(fx && fx.out.length) h += `<div class="panel"><span class="label">${t("rdFix1")}</span><div class="list">${fx.out.map(o=>`<button class="row" data-act="${o.act}" data-id="${esc(o.id)}"><span class="tx-ic">${icon(o.ic)}</span><div class="m"><b>${o.b}</b><span class="sub">${o.s}</span></div></button>`).join("")}</div>
    <p class="sub rd-note">${fx.covered ? t("rdCovered") : t("rdNotCovered",{x:money(fx.left)})}</p></div>`;
  // timeline (daily averages folded into one line per week to keep it readable)
  const big = R.ev.filter(x=>x.kind!=="avgIn" && x.kind!=="avgOut");
  const avg = sum(R.ev.filter(x=>x.kind==="avgIn"||x.kind==="avgOut"), x=>x.amt);
  let run = R.start; const bal = {}; R.days.forEach(x=>bal[x.d]=x.e);
  h += `<div class="panel"><span class="label">${t("rdNext")}</span>${big.length?`<div class="list">${big.map(x=>{ run += x.amt; return `<button class="row" ${x.act?`data-act="${x.act}" data-id="${esc(x.id||"")}"`:""}><span class="tx-ic ${x.amt>0?"inc":"exp"}">${icon(x.kind==="chIn"||x.kind==="chOut"?"bank":x.kind==="wages"?"users":x.kind==="inv"||x.kind==="bill"?"file":"wallet")}</span><div class="m"><b>${esc(x.label)}</b><span class="sub">${fdate(x.date)}${x.sure?"":` · <span class="due">${t("rdExpected")}</span>`}</span></div><div class="col end"><b class="${x.amt<0?"negv":"pos"}">${x.amt>0?"+":"−"}${money(Math.abs(x.amt))}</b><span class="sub">${money(bal[x.date])}</span></div></button>`; }).join("")}</div>`:`<p class="sub">${t("rdNone")}</p>`}
    ${Math.abs(avg)>0.5?`<p class="sub rd-note">${t("evAvg")}: ${avg>0?"+":"−"}${money(Math.abs(avg))}</p>`:""}</div>`;
  return h;
}

/* small card on the home page */
function radarHomeCard(){
  if(!radarHasData()) return "";
  const R = radar(30);
  return `<button class="panel rd-card ${R.state}" data-act="rdOpen"><span class="tx-ic">${icon("radar")}</span><div class="m"><span class="label">${t("rdHome",{n:`<span class="num">30</span>`})}</span>
    <b>${t("rdHomeLow",{x:money(R.lowE.e), d:fdate(R.lowE.d)})}</b></div>${spark(R)}</button>`;
}
function spark(R){
  const W = 96, Hh = 32, v = R.days.map(x=>x.e), lo = Math.min(...v, R.min), hi = Math.max(...v), sp = (hi-lo)||1;
  return `<svg class="rd-spark" viewBox="0 0 ${W} ${Hh}" aria-hidden="true"><polyline points="${v.map((y,i)=>`${(i*W/Math.max(1,v.length-1)).toFixed(1)},${(2+(hi-y)*(Hh-4)/sp).toFixed(1)}`).join(" ")}"/></svg>`;
}
function radarAlert(){
  if(!radarHasData()) return null; const R = radar(30);
  return R.state==="bad" ? ["bad","radar", t("aRadar",{x:money(R.min-R.lowE.e), d:fdate(R.firstBadE.d)})] : null;
}

function radarSettingsSheet(){
  const s = rdSet();
  openSheet({title:t("rdSettings"),
    fields:[{name:"cashMin",label:t("rdMin"),type:"money",value:String(s.min||0),hint:t("rdMinHint")},
      {name:"avg",label:t("rdAvg"),type:"chips",options:[["1",LANG==="en"?"Yes":"آه"],["0",LANG==="en"?"No":"لا"]],value:s.avg?"1":"0"}],
    submit: async v=>applySettings({settings:{...(COMPANY.settings||{}), cashMin:Math.max(0,num(v.cashMin)), radarAvg:v.avg!=="0"}})});
}
function radarFixSheet(){
  const J = journal(), cur = cashNow(J);
  openSheet({title:t("rdFixT"),
    fields:[{name:"amount",label:t("rdNow"),type:"money",value:String(cur),hint:t("rdFixHint")}],
    submit: async v=>{ if(String(v.amount).trim()===""||!isFinite(num(v.amount))){ toast(t("eAmount")); return false; }
      return applySettings({settings:{...(COMPANY.settings||{}), cashNow:{amount:r2(num(v.amount)), date:today(), base:r2(cashOn(journal(), today()))}}}); }});
}

Object.assign(A, {
  rdH: id => { S.rdH = Number(id)||30; render(); },
  rdOpen: () => { S.view = "money"; S.btab = "radar"; scrollTo(0,0); render(); },
  rdSettings: () => radarSettingsSheet(),
  rdFix: () => radarFixSheet(),
});
