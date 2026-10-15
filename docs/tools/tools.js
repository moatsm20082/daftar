/* Daftar free tools: overtime, salary, driver profit, daily accounts. Pure client-side; nothing is sent anywhere. */
(function(){
"use strict";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const toEn = s => String(s ?? "").replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[٫،,]/g, ".");
const n = id => { const el = typeof id === "string" ? document.getElementById(id) : id; const v = parseFloat(toEn(el && el.value)); return isFinite(v) ? v : 0; };
const f = (x, d = 2) => (Math.round((x || 0) * 10 ** d) / 10 ** d).toLocaleString("en-US", { maximumFractionDigits: d });
const radio = name => (document.querySelector(`input[name="${name}"]:checked`) || {}).value;
const put = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
const cur = () => ($("#cur") && $("#cur").value) || "دينار";
function on(sel, fn){ $$(sel).forEach(el => el.addEventListener("input", fn)); $$(sel).forEach(el => el.addEventListener("change", fn)); fn(); }

/* ---- overtime (Jordan labour law: art. 56 normal hours, art. 59: ≥125% / ≥150%) ---- */
if ($("#ot")) on("#ot input, #ot select", () => {
  const type = radio("otType"), w = n("otWage"), hrs = n("otHours") || 8, days = n("otDays") || 30;
  const daily = type === "month" ? w / days : type === "week" ? w / (n("otWeekDays") || 6) : w;
  const hourly = daily / hrs, r1 = n("otRate1") / 100 || 1.25, r2 = n("otRate2") / 100 || 1.5;
  const a = n("otH1") * hourly * r1, b = n("otH2") * hourly * r2;
  put("oDaily", f(daily, 3)); put("oHourly", f(hourly, 3)); put("oH1", f(a, 3)); put("oH2", f(b, 3)); put("oTotal", f(a + b, 3));
  $$(".cur").forEach(x => x.textContent = cur());
  $("#otWeekRow").hidden = type !== "week"; $("#otDaysRow").hidden = type !== "month";
});

/* ---- salary: days worked, absences, overtime, advances ---- */
if ($("#sal")) on("#sal input, #sal select", () => {
  const type = radio("sType"), w = n("sWage"), wd = n("sWorkDays") || (type === "week" ? 6 : 26);
  const daily = type === "day" ? w : w / wd;
  const worked = n("sWorked"), absent = n("sAbsent");
  const base = type === "day" ? daily * worked : Math.max(0, w - daily * absent);
  const ot = n("sOt"), adv = n("sAdv"), ded = n("sDed");
  const net = base + ot - adv - ded;
  put("rDaily", f(daily, 3)); put("rBase", f(base, 3)); put("rOt", f(ot, 3)); put("rAdv", f(adv + ded, 3)); put("rNet", f(net, 3));
  $("#rNet").classList.toggle("neg", net < 0);
  $("#sWorkedRow").hidden = type !== "day"; $("#sAbsentRow").hidden = type === "day"; $("#sWorkDaysRow").hidden = type === "day";
  $$(".cur").forEach(x => x.textContent = cur());
});

/* ---- ride-hailing / delivery driver profit ---- */
if ($("#drv")) on("#drv input, #drv select", () => {
  const fares = n("dFares"), tips = n("dTips"), trips = n("dTrips"), comm = n("dComm") / 100;
  const km = n("dKm"), l100 = n("dL100"), lp = n("dLitre"), fuelDirect = n("dFuel");
  const fuel = fuelDirect || (km && l100 && lp ? km * l100 / 100 * lp : 0);
  const other = n("dOther"), hours = n("dHours");
  const commission = fares * comm, net = fares + tips - commission - fuel - other;
  put("xComm", f(commission, 3)); put("xFuel", f(fuel, 3)); put("xNet", f(net, 3));
  put("xHour", hours ? f(net / hours, 3) : "—"); put("xKm", km ? f(net / km, 3) : "—"); put("xTrip", trips ? f((fares + tips) / trips, 3) : "—");
  put("xFuelPct", fares ? f(fuel / fares * 100, 1) + "%" : "—");
  $("#xNet").classList.toggle("neg", net < 0);
  $$(".cur").forEach(x => x.textContent = cur());
});

/* ---- daily accounts: a small ledger kept only in this browser ---- */
if ($("#led")) {
  const KEY = "daftar_daily_accounts_v1";
  const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : null; } catch (e) { return null; } };
  const store = rows => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) {} };
  const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  let rows = load() || [{ d: today(), t: "", i: "", o: "" }, { d: today(), t: "", i: "", o: "" }, { d: today(), t: "", i: "", o: "" }];
  const body = $("#ledBody");
  function draw(){
    body.innerHTML = "";
    rows.forEach((r, k) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><input type="date" data-k="${k}" data-f="d"></td><td><input data-k="${k}" data-f="t" maxlength="80" placeholder="البيان: شو صار؟" aria-label="البيان"></td>
        <td class="amt"><input inputmode="decimal" data-k="${k}" data-f="i" placeholder="داخل +" aria-label="داخل"></td><td class="amt"><input inputmode="decimal" data-k="${k}" data-f="o" placeholder="طالع −" aria-label="طالع"></td>
        <td class="act"><button class="x" type="button" data-del="${k}" aria-label="احذف السطر">×</button></td>`;
      tr.querySelectorAll("input").forEach(inp => { inp.value = r[inp.dataset.f] || ""; });   // set as values: never parsed as HTML
      body.appendChild(tr);
    });
    total();
  }
  function total(){
    const i = rows.reduce((s, r) => s + n({ value: r.i }), 0), o = rows.reduce((s, r) => s + n({ value: r.o }), 0);
    put("lIn", f(i, 3)); put("lOut", f(o, 3)); put("lBal", f(i - o, 3)); $("#lBal").classList.toggle("neg", i - o < 0);
  }
  body.addEventListener("input", e => { const el = e.target; if (!el.dataset.f) return; rows[+el.dataset.k][el.dataset.f] = el.value.slice(0, 80); store(rows); total(); });
  body.addEventListener("click", e => { const k = e.target.dataset && e.target.dataset.del; if (k == null) return; rows.splice(+k, 1); if (!rows.length) rows.push({ d: today(), t: "", i: "", o: "" }); store(rows); draw(); });
  $("#ledAdd").addEventListener("click", () => { rows.push({ d: today(), t: "", i: "", o: "" }); store(rows); draw(); const last = body.querySelector("tr:last-child input[data-f=t]"); if (last) last.focus(); });
  $("#ledPrint").addEventListener("click", () => window.print());
  $("#ledCsv").addEventListener("click", () => {
    const cell = v => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = "﻿" + [["التاريخ", "البيان", "داخل", "طالع"], ...rows.map(r => [r.d, r.t, r.i, r.o])].map(r => r.map(cell).join(",")).join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = "حسابات-يومية.csv"; document.body.appendChild(a); a.click(); a.remove();
  });
  $("#ledClear").addEventListener("click", e => { if (e.target.dataset.armed !== "1") { e.target.dataset.armed = "1"; e.target.textContent = "متأكد؟ اكبس مرة ثانية"; return; } rows = [{ d: today(), t: "", i: "", o: "" }]; store(rows); draw(); e.target.dataset.armed = ""; e.target.textContent = "امسح الكل"; });
  draw();
}
})();
