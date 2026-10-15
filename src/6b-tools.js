/* ===== exports, sharing ===== */
function downloadCsv(name, rows){
  const cell = v => { const s = String(v ?? ""); return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; };
  const csv = "﻿" + rows.map(r=>r.map(cell).join(",")).join("\r\n");   // BOM so Excel reads Arabic correctly
  if(window.DEMO_MODE && window.claude && window.claude.use){ window.claude.use("downloads").then(d=>d ? d.save({filename:name, data:new Blob([csv],{type:"text/csv"})}).then(()=>toast(t("exported"))).catch(()=>{}) : toast(t("eGeneric"))); return; }
  const url = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000); toast(t("exported"));
}
const safeName = s => String(s||"").replace(/[\\/:*?"<>|]+/g,"").trim().slice(0,40) || "daftar";
function exportMoney(all){
  const a = all ? "0000-01-01" : (S.mmonth||monthStartOf(today())), b = all ? "9999-12-31" : monthEnd(a);
  const rows = [[t("date"), t("colType"), cap(term("unit")), t("colWhat"), t("colDesc"), t("colAmount"), t("currency")]];
  const cur = ST().currency, uname = id => (unitById(id)||{}).name || "";
  const items = [
    ...S.expenses.filter(x=>inRange(x.date,a,b)).map(x=>[x.date, t("expense"), uname(x.unitId), catLabel(x.category), x.item||"", -num(x.amount)]),
    ...S.income.filter(x=>inRange(x.date,a,b)).map(x=>[x.date, t("incomeOne"), uname(x.unitId), catLabel(x.category), x.note||"", num(x.amount)]),
    ...S.payments.filter(x=>inRange(x.date,a,b)).map(x=>[x.date, x.kind==="salary"?t("fromSalary"):t("advance"), uname(x.unitId), (staffById(x.staffId)||{}).name||"", x.note||"", -num(x.amount)]),
  ].sort((x,y)=>String(y[0]).localeCompare(String(x[0])));
  items.forEach(r=>rows.push([...r, cur]));
  downloadCsv(`${safeName(COMPANY&&COMPANY.name)}-${all?"all":a.slice(0,7)}.csv`, rows);
}
function exportPayroll(){
  const a = S.pstart, b = periodEnd(), list = S.view==="unit" ? unitStaff(S.uid) : S.staff.filter(s=>s.active!==false);
  const rows = [[t("staffName"), cap(term("unit")), t("colDays"), t("colAbsent"), t("colBase"), t("colOt"), t("advance"), t("fromSalary"), t("leftFor"), t("currency")]];
  list.forEach(s=>{ const k = account(s,a,b); rows.push([s.name, (unitById(s.unitId)||{}).name||"", k.days, k.absentN, fmt(k.base), fmt(k.ot), fmt(k.adv), fmt(k.paid), fmt(k.remaining), ST().currency]); });
  downloadCsv(`${safeName(COMPANY&&COMPANY.name)}-${t("tabAccount")}-${a}.csv`, rows);
}
function statementText(s){
  const a = S.pstart, b = periodEnd(), k = account(s,a,b), cur = curName();
  const L1 = [`${t("waHead",{x:s.name})}`, `${S.period==="month"?monthName(a).replace(/<[^>]+>/g,""):`${a} → ${lastWorkDay(a,b)}`}`, ""];
  L1.push(`${t("waDays",{n:k.days, days:k.days===1?t("dayW"):t("daysW"), r:fmt(k.days?k.base/k.days:dayRate(s,a))})} = ${fmt(k.base)} ${cur}`);
  if(k.ot) L1.push(`${t("otLine",{x:hrsTxt(k.otH).replace(/<[^>]+>/g,"")})}: +${fmt(k.ot)} ${cur}`);
  k.pp.forEach(x=>L1.push(`${x.kind==="salary"?t("fromSalary"):t("advance")} (${x.date}): −${fmt(num(x.amount))} ${cur}`));
  if(k.absentN) L1.push(t("absentN",{n:k.absentN}));
  L1.push("", `${k.remaining<-0.005?t("overpaid"):t("leftFor")}: ${fmt(Math.abs(k.remaining))} ${cur}`, `— ${COMPANY&&COMPANY.name||""}`, "", t("sentWith"));
  return L1.join("\n");
}
function waPhone(raw){
  const DIAL = {JOD:"962",SAR:"966",AED:"971",KWD:"965",QAR:"974",BHD:"973",OMR:"968",EGP:"20",IQD:"964",LBP:"961",SYP:"963",MAD:"212",TND:"216",DZD:"213",LYD:"218",SDG:"249",YER:"967",TRY:"90",GBP:"44"};
  let phone = String(raw||"").trim(); const plus = phone.startsWith("+"); phone = phone.replace(/[^0-9]/g,"");
  if(phone.startsWith("00")) phone = phone.slice(2); else if(!plus && phone.startsWith("0") && DIAL[ST().currency]) phone = DIAL[ST().currency] + phone.slice(1);
  return phone;
}
function openWaTo(phone, text){ const a = document.createElement("a"); a.href = `https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(text)}`; a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
function shareStatement(sid){ const s = staffById(sid); if(!s) return; openWaTo(s.phone, statementText(s)); }
/* the client's statement: what the job is worth, what they paid and when, what's left */
function clientStatementText(u){
  const cur = curName(), x = unitTotals(u.id), budget = num(u.budget), B = KP(u).budget;
  const pays = S.income.filter(i=>i.unitId===u.id).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  const L1 = [t("cstHead",{x:u.name}), u.client ? t("cstTo",{x:u.client}) : "", fdate(today()).replace(/<[^>]+>/g,""), ""];
  if(budget && B) L1.push(`${B[LI()]}: ${fmt(budget)} ${cur}`);
  if(pays.length){ L1.push(t("cstPaid")); pays.forEach(i=>L1.push(`• ${i.date}: ${fmt(num(i.amount))} ${cur}${i.note?" ("+i.note+")":""}`)); }
  L1.push("", `${t("cstTotalPaid")}: ${fmt(x.inc)} ${cur}`);
  if(budget) L1.push(`${t("cstLeft")}: ${fmt(Math.max(0,budget-x.inc))} ${cur}`);
  L1.push("", `— ${COMPANY&&COMPANY.name||""}`, "", t("sentWith"));
  return L1.filter((l,i,a)=>l!=="" || a[i-1]!=="").join("\n");
}
function shareClient(uid){ const u = unitById(uid); if(!u) return; openWaTo(u.clientPhone, clientStatementText(u)); }
