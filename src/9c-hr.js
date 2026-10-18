/* =====================================================================
   HR & payroll (Jordan defaults): social security shares, income tax
   withholding, leaves, payslips, monthly social-security sheet.
   ===================================================================== */
Object.assign(L, {
  hrSS:["مشترك بالضمان","Social security"], hrSSNo:["رقم الضمان","SS number"], hrTax:["ضريبة دخل شهرية تنقطع","Monthly income tax withheld"], hrTaxEst:["احسبها تقريبياً","Estimate it"],
  hrTaxHint:["تقدير على أساس إعفاء 9,000 للشخص{f} وشرائح 5% لـ 25%. راجع محاسبك.","Estimate using the 9,000 personal exemption{f} and 5%–25% brackets. Check with your accountant."], hrFam:[" و9,000 للعائلة"," + 9,000 family"],
  hrFamily:["إله عائلة (معيل)","Supports a family"], yes:["آه","Yes"], no:["لا","No"],
  hrLeave:["إجازة","Leave"], hrLeaves:["الإجازات","Leaves"], hrLeaveNew:["سجّل إجازة","Record leave"], hrLeaveType:["نوع الإجازة","Leave type"], lvAnnual:["سنوية (مدفوعة)","Annual (paid)"], lvSick:["مرضية (مدفوعة)","Sick (paid)"], lvUnpaid:["بدون راتب","Unpaid"],
  hrFrom:["من","From"], hrTo:["لـ","To"], hrLeaveBal:["رصيد الإجازة السنوية {y}: باقي {n} من {t} يوم","{y} annual leave: {n} of {t} days left"], hrWho:["الموظف","Employee"], eLeaveDates:["تأكد من التواريخ","Check the dates"],
  hrPayslip:["قسيمة راتب","Payslip"], hrSSSheet:["كشف الضمان الشهري","Monthly SS sheet"], hrGross:["إجمالي المستحق","Gross earned"], hrBase:["الراتب حسب الدوام","Pay for days worked"], hrLeavePay:["إجازات مدفوعة","Paid leave"],
  hrDed:["الاقتطاعات","Deductions"], hrSSEmp:["الضمان (حصة الموظف)","Social security (employee)"], hrSSEr:["الضمان (حصة الشركة)","Social security (employer)"], hrIncTax:["ضريبة الدخل","Income tax"], hrAdv:["السلف","Advances"],
  hrNet:["الصافي","Net pay"], hrPaidAlready:["انصرف","Already paid"], hrLeft:["الباقي إله","Still owed"], hrSSTotal:["المجموع للضمان","Total to pay SS"], hrWage:["الأجر","Wage"],
  setSSEmp:["حصة الموظف بالضمان %","Employee SS %"], setSSEr:["حصة الشركة بالضمان %","Employer SS %"], setSSCap:["سقف الأجر الخاضع للضمان (شهري)","SS wage ceiling (monthly)"],
  hrSSHint:["النسب الافتراضية 7.5% للموظف و14.25% للشركة. غيّرها إذا نشاطك إله نسبة ثانية.","Defaults: 7.5% employee and 14.25% employer. Change them if your activity has a different rate."],
  ssLine:["الضمان {p}%","SS {p}%"], taxLine:["ضريبة الدخل","Income tax"],
});
["leaves"].forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

const ssEmpRate = () => { const s = (COMPANY&&COMPANY.settings)||{}; return (s.ssEmp===undefined||s.ssEmp===""||s.ssEmp===null ? 7.5 : Math.max(0,Math.min(30,Number(s.ssEmp)||0)))/100; };
const ssErRate = () => { const s = (COMPANY&&COMPANY.settings)||{}; return (s.ssEr===undefined||s.ssEr===""||s.ssEr===null ? 14.25 : Math.max(0,Math.min(40,Number(s.ssEr)||0)))/100; };
const ssCap = () => { const s = (COMPANY&&COMPANY.settings)||{}; return num(s.ssCap) || 3733; };
/* Jordan personal income tax, yearly (5/10/15/20/25%, 30% above 1M) */
function jordanTaxYear(annual, family){
  let x = Math.max(0, annual - 9000 - (family?9000:0)), tax = 0;
  const br = [[5000,.05],[5000,.10],[5000,.15],[5000,.20],[980000,.25],[Infinity,.30]];
  for(const [w,r] of br){ const p = Math.min(x, w); tax += p*r; x -= p; if(x<=0) break; }
  return r2(tax);
}
const monthlyWage = s => s.rateType==="month" ? num(s.rate) : s.rateType==="week" ? num(s.rate)*52/12 : num(s.rate)*workDaysMonth(today());
/* paid leave days inside a range (weekends don't count) */
function leaveDays(sid, a, b, paidOnly=true){
  let n = 0;
  S.leaves.filter(l=>l.staffId===sid && (!paidOnly || l.type!=="unpaid")).forEach(l=>{ for(let d=l.from; d<=l.to; d=addDays(d,1)){ if(inRange(d,a,b) && !isOff(d) && !attOf(sid,d)) n++; if(d>="9999") break; } });
  return n;
}
function annualLeaveLeft(s){
  const y = today().slice(0,4), tot = s.startDate && (parseD(today())-parseD(s.startDate))/(365.25*864e5) >= 5 ? 21 : 14;
  let used = 0; S.leaves.filter(l=>l.staffId===s.id && l.type==="annual").forEach(l=>{ for(let d=l.from; d<=l.to; d=addDays(d,1)){ if(d.startsWith(y) && !isOff(d)) used++; } });
  return {y, tot, used, left:tot-used};
}
/* extra payroll lines on top of the existing staff account */
function payrollExtra(s, a, b, k){
  return {lv:k.lvN, lvPay:k.lvPay, gross:r2(k.earned), ssE:k.ssE, ssR:k.ssR, tax:k.tax, net:r2(k.earned-k.ssE-k.tax), left:r2(k.remaining)};
}

/* ----- forms ----- */
function leaveForm(sid){
  const ss = S.staff.filter(x=>x.active!==false).sort((a,b)=>String(a.name).localeCompare(String(b.name))); if(!ss.length){ toast(tv("noTeam")); return; }
  const s0 = staffById(sid) || ss[0], lb = annualLeaveLeft(s0);
  openSheet({title:t("hrLeaveNew"), saveLabel:t("record"),
    fields:[{name:"staffId",label:t("hrWho"),type:"select",options:ss.map(x=>[x.id,x.name]),value:s0.id},
      {name:"type",label:t("hrLeaveType"),type:"chips",options:[["annual",t("lvAnnual")],["sick",t("lvSick")],["unpaid",t("lvUnpaid")]],value:"annual",hint:t("hrLeaveBal",{y:lb.y,n:`<span class="num">${lb.left}</span>`,t:`<span class="num">${lb.tot}</span>`})},
      {name:"from",label:t("hrFrom"),type:"date",value:today()},{name:"to",label:t("hrTo"),type:"date",value:today()}],
    more:[{name:"note",label:t("note"),value:"",max:120}],
    submit: async v=>{ if(!validDate(v.from)||!validDate(v.to)||v.to<v.from || (parseD(v.to)-parseD(v.from))/864e5>120){ toast(t("eLeaveDates")); return false; }
      return save("leaves", null, {staffId:v.staffId, type:["annual","sick","unpaid"].includes(v.type)?v.type:"annual", from:v.from, to:v.to, note:(v.note||"").slice(0,120), createdAt:Date.now()}); }});
}
function payslipHtml(s, a, b){
  const k = account(s, a, b), x = payrollExtra(s, a, b, k), u = unitById(s.unitId);
  const row = (l, v, neg) => `<tr><td>${l}</td><td>${neg?"− ":""}${moneyTxt(v)}</td></tr>`;
  return `<div class="doc"><div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1>${ST().taxNo?`<div>${t("taxNoL")}: ${esc(ST().taxNo)}</div>`:""}</div><div class="doc-t"><h2>${t("hrPayslip")}</h2><div>${esc(a)} → ${esc(b)}</div></div></div>
    <div class="doc-to"><b>${esc(s.name)}</b>${s.role?` · ${esc(s.role)}`:""}${u?` · ${esc(u.name)}`:""}${s.ssNo?` · ${t("hrSSNo")}: ${esc(s.ssNo)}`:""}</div>
    <table class="doc-sum wide">${row(`${t("hrBase")} (${k.days} ${t("daysW")})`, k.base)}${k.ot?row(t("otLine",{x:hrsTxt(k.otH)}).replace(/<[^>]+>/g,""), k.ot):""}${x.lvPay?row(`${t("hrLeavePay")} (${x.lv})`, x.lvPay):""}
      <tr class="g"><td>${t("hrGross")}</td><td>${moneyTxt(x.gross)}</td></tr>
      ${x.ssE?row(t("hrSSEmp"), x.ssE, true):""}${x.tax?row(t("hrIncTax"), x.tax, true):""}
      <tr class="g"><td>${t("hrNet")}</td><td>${moneyTxt(x.net)}</td></tr>
      ${k.adv?row(t("hrAdv"), k.adv, true):""}${k.paid?row(t("hrPaidAlready"), k.paid, true):""}
      <tr class="g"><td>${t("hrLeft")}</td><td>${moneyTxt(Math.max(0,x.left))}</td></tr>
      ${x.ssR?`<tr><td><small>${t("hrSSEr")}</small></td><td><small>${moneyTxt(x.ssR)}</small></td></tr>`:""}</table>
    <div class="doc-foot"><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}
function ssSheetHtml(a, b){
  const ss = S.staff.filter(x=>x.ss).map(s=>{ const k = account(s,a,b), x = payrollExtra(s,a,b,k); return {s, w:x.gross, e:x.ssE, r:x.ssR}; });
  return `<div class="doc"><div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1></div><div class="doc-t"><h2>${t("hrSSSheet")}</h2><div>${esc(a)} → ${esc(b)}</div></div></div>
    <table class="doc-tb"><thead><tr><th>#</th><th>${t("hrWho")}</th><th>${t("hrSSNo")}</th><th>${t("hrWage")}</th><th>${t("hrSSEmp")}</th><th>${t("hrSSEr")}</th><th>${t("glTotal")}</th></tr></thead>
    <tbody>${ss.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.s.name)}</td><td>${esc(x.s.ssNo||"")}</td><td>${fmt(x.w)}</td><td>${fmt(x.e)}</td><td>${fmt(x.r)}</td><td>${fmt(x.e+x.r)}</td></tr>`).join("")}</tbody></table>
    <table class="doc-sum"><tr class="g"><td>${t("hrSSTotal")}</td><td>${moneyTxt(sum(ss,x=>x.e+x.r))}</td></tr></table><div class="doc-foot"><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}

Object.assign(A, {
  leave: id => { closeSheet(); leaveForm(id); },
  payslip: id => { const s = staffById(id); if(s) printDoc(payslipHtml(s, S.pstart, periodEnd())); },
  ssSheet: () => { const a = S.period==="month" ? S.pstart : monthStartOf(S.pstart); printDoc(ssSheetHtml(a, monthEnd(a))); },
  taxEst: () => { const r = num((document.getElementById("f_rate")||{}).value), tp = (document.querySelector('#sheetBody [name="rateType"]:checked')||{}).value||"month";
    const fam = (document.querySelector('#sheetBody [name="family"]:checked')||{}).value==="1";
    const m = tp==="month" ? r : tp==="week" ? r*52/12 : r*workDaysMonth(today()); const el = document.getElementById("f_taxMonthly"); if(el) el.value = String(r2(jordanTaxYear(m*12, fam)/12)); },
});
