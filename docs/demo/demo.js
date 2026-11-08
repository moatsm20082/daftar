/* Daftar try-it demo: fills a sample company on first visit and shows a "this is a demo" bar. */
(function () {
  "use strict";
  const AR = typeof LANG === "undefined" || LANG !== "en";
  const tx = (ar, en) => (AR ? ar : en);
  const SEEDED = "daftar_try_seeded";
  const seeded = () => { try { return localStorage.getItem(SEEDED) === "1"; } catch (e) { return false; } };

  /* the bar on top */
  const bar = document.createElement("div");
  bar.className = "demo-bar"; bar.setAttribute("role", "note");
  bar.innerHTML = `<span>${tx("هاي نسخة تجريبية ببيانات وهمية. جرّب براحتك.", "This is a demo with sample data. Try anything.")}</span>
    <span class="demo-bar__a"><button type="button" id="demoReset">${tx("من جديد", "Start over")}</button><a href="${AR ? "/" : "/en/"}#download">${tx("نزّل دفتر", "Get Daftar")}</a></span>`;
  document.body.prepend(bar);
  document.getElementById("demoReset").addEventListener("click", () => {
    try { localStorage.removeItem("daftar_try_v1"); localStorage.removeItem(SEEDED); } catch (e) {}
    location.reload();
  });

  /* a cover while the sample company is being filled */
  let cover = null;
  if (!seeded()) {
    cover = document.createElement("div"); cover.className = "demo-cover";
    cover.innerHTML = `<div><b>${tx("بنجهّزلك شركة تجريبية…", "Setting up a sample company…")}</b><span>${tx("ثواني بس", "Just a few seconds")}</span></div>`;
    document.body.appendChild(cover);
  }
  const done = () => { if (cover) { cover.remove(); cover = null; } };

  const wait = (ok, ms = 12000) => new Promise((res, rej) => { const t0 = Date.now(); (function tick() { let v = false; try { v = ok(); } catch (e) {} if (v) return res(); if (Date.now() - t0 > ms) return rej(new Error("timeout")); setTimeout(tick, 80); })(); });

  async function seed() {
    const d = (n) => addDays(today(), n), P = PRE(), ex = P.exp.map((x) => x[0]), inc = P.inc[0][0];
    await applySettings({ settings: { ...COMPANY.settings, taxNo: "012345678", address: tx("عمّان، شارع المدينة المنورة", "Madina Munawara St, Amman") } });
    const units = [["u1", tx("فيلا عبدون", "Abdoun Villa"), tx("أبو سامر", "Abu Samer"), 180000], ["u2", tx("عمارة خلدا", "Khalda Building"), tx("شركة الريان", "Al Rayyan Co."), 420000]];
    for (const [id, name, client, budget] of units) await save("units", id, { name, kind: "contracting", client, budget, status: "active", startDate: d(-60), createdAt: Date.now() }, true);
    const team = [["s1", tx("أحمد الخطيب", "Ahmad Khatib"), tx("فورمن", "Foreman"), 25, "day", "u1", true], ["s2", tx("محمد عودة", "Mohammad Odeh"), tx("حداد", "Steel fixer"), 20, "day", "u1", false], ["s3", tx("خالد يوسف", "Khaled Yousef"), tx("نجار", "Carpenter"), 20, "day", "u1", false], ["s4", tx("سامي حداد", "Sami Haddad"), tx("كهربائي", "Electrician"), 22, "day", "u2", false], ["s5", tx("عمر النابلسي", "Omar Nabulsi"), tx("عامل", "Labourer"), 15, "day", "u2", false], ["s6", tx("ليلى منصور", "Layla Mansour"), tx("محاسبة", "Accountant"), 650, "month", "u2", true]];
    for (const [id, name, role, rate, rt, unitId, ss] of team) await save("staff", id, { name, role, rate, rateType: rt, otRate: 0, unitId, active: true, ss, ssNo: ss ? "9" + id.slice(1) + "8812345" : "", startDate: d(-400), createdAt: Date.now() }, true);
    for (let n = -13; n <= 0; n++) { const day = d(n); if (isOff(day)) continue;
      for (const [id, , , , , unitId] of team) { const s = staffById(id), absent = (id === "s3" && n === 0) || (id === "s5" && n === -3);
        await save("attendance", day + "_" + id, { staffId: id, date: day, unitId, status: absent ? "absent" : "present", in: absent ? "" : ST().shiftIn, out: absent ? "" : ST().shiftOut, dayRate: dayRate(s, day), otRate: otRate(s, day), updatedAt: Date.now() }, true); } }
    await save("payments", "pa1", { staffId: "s2", unitId: "u1", kind: "advance", amount: 25, date: d(-2), note: "", payBy: "cash", createdAt: Date.now() }, true);
    const exps = [["u1", ex[0], 6300, -9, tx("حديد 12 ملم", "Rebar 12 mm"), tx("حديد الشرق", "East Steel"), "transfer"], ["u1", ex[1] || ex[0], 1450, -6, tx("إسمنت 100 كيس", "Cement, 100 bags"), tx("مصنع الرشادية", "Rashadiya Plant"), "cash"], ["u2", ex[2] || ex[0], 900, -4, tx("أجار جرّافة", "Loader rental"), tx("أبو علي", "Abu Ali"), "cash"], ["u2", ex[3] || ex[0], 240, -1, tx("ديزل", "Diesel"), tx("محطة المناصير", "Manaseer station"), "card"]];
    let i = 0; for (const [unitId, category, amount, n, item, supplier, payBy] of exps) await save("expenses", "e" + i++, { unitId, category, amount, date: d(n), item, supplier, payBy, files: [], createdAt: Date.now() + i }, true);
    await save("income", "in1", { unitId: "u1", category: inc, amount: 20000, date: d(-8), note: tx("دفعة ثانية", "Second payment"), payBy: "transfer", files: [], createdAt: Date.now() }, true);
    await save("income", "in2", { unitId: "u2", category: inc, amount: 15000, date: d(-20), note: tx("دفعة أولى", "First payment"), payBy: "transfer", files: [], createdAt: Date.now() }, true);
    const parties = [["c1", tx("أبو سامر", "Abu Samer"), "customer", "0791234567"], ["c2", tx("شركة الريان للاستثمار", "Al Rayyan Investment"), "customer", "0797654321"], ["c3", tx("مكتب الهندسة الحديثة", "Modern Engineering Office"), "customer", ""], ["v1", tx("حديد الشرق", "East Steel"), "supplier", "0781112223"], ["v2", tx("مصنع الرشادية", "Rashadiya Plant"), "supplier", ""], ["v3", tx("مؤسسة البلاط الذهبي", "Golden Tiles"), "supplier", ""]];
    for (const [id, name, kind, phone] of parties) await save("parties", id, { name, kind, phone, openBal: 0, createdAt: Date.now() }, true);
    const items = [["it1", tx("إسمنت", "Cement"), tx("كيس", "bag"), 5.5, 4.2, 400, 100], ["it2", tx("حديد 12 ملم", "Rebar 12 mm"), tx("طن", "ton"), 690, 610, 12, 4], ["it3", tx("بلاط بورسلان", "Porcelain tile"), tx("متر", "m²"), 14, 9.5, 300, 80], ["it4", tx("رمل", "Sand"), tx("متر مكعب", "m³"), 18, 12, 20, 10], ["it5", tx("أجرة تركيب", "Installation"), tx("متر", "m²"), 4, 0, 0, 0]];
    for (const [id, name, unit, price, cost, openQty, minQty] of items) await save("items", id, { name, unit, price, cost, openQty, minQty, service: id === "it5", openDate: d(-60), createdAt: Date.now() }, true);
    const inv = (id, type, no, partyId, n, due, lines, unitId) => save("invoices", id, { type, no, partyId, date: d(n), dueDate: d(due), lines: lines.map(([itemId, qty, price]) => ({ itemId, name: S.items.find((x) => x.id === itemId).name, qty, price, tax: 16, disc: 0 })), incTax: false, unitId, createdAt: Date.now() }, true);
    await inv("i1", "sale", "S-0001", "c1", -40, -10, [["it3", 120, 14], ["it5", 120, 4]], "u1");
    await inv("i2", "sale", "S-0002", "c2", -12, 18, [["it1", 150, 5.5], ["it4", 10, 18]], "u2");
    await inv("i3", "sale", "S-0003", "c3", -3, 27, [["it2", 2, 690]], "u2");
    await inv("i4", "sale", "S-0004", "c1", 0, 30, [["it3", 40, 14]], "u1");
    await inv("p1", "purchase", "P-0001", "v1", -15, 6, [["it2", 6, 610]], "u1");
    await inv("p2", "purchase", "P-0002", "v2", -5, 9, [["it1", 300, 4.2]], "u1");
    await inv("p3", "purchase", "P-0003", "v3", -2, 25, [["it3", 160, 9.5]], "u2");
    await inv("q1", "quote", "Q-0001", "c3", -1, 14, [["it3", 400, 13.5], ["it5", 400, 4]], "u2");
    const vou = (id, type, no, partyId, invoiceId, amount, n, method) => save("vouchers", id, { type, no, partyId, invoiceId, amount, date: d(n), method, createdAt: Date.now() }, true);
    await vou("r1", "receipt", "RV-0001", "c1", "i1", 1000, -20, "cash");
    await vou("r2", "receipt", "RV-0002", "c2", "i2", 500, -6, "cheque");
    await vou("r3", "receipt", "RV-0003", "c3", "i3", 800, -1, "cheque");
    await vou("y1", "payment", "PV-0001", "v1", "p1", 2000, -10, "cheque");
    await vou("y2", "payment", "PV-0002", "v2", "p2", 500, -4, "transfer");
    const bank = (a, e) => tx(a, e);
    await save("cheques", "k1", { dir: "in", status: "pending", amount: 500, dueDate: d(4), partyId: "c2", bank: bank("البنك العربي", "Arab Bank"), no: "100234", voucherId: "r2", createdAt: Date.now() }, true);
    await save("cheques", "k2", { dir: "in", status: "pending", amount: 800, dueDate: d(12), partyId: "c3", bank: bank("بنك الإسكان", "Housing Bank"), no: "558812", voucherId: "r3", createdAt: Date.now() }, true);
    await save("cheques", "k3", { dir: "out", status: "handed", amount: 2000, dueDate: d(9), partyId: "v1", bank: bank("بنك الاتحاد", "Bank al Etihad"), no: "000781", voucherId: "y1", createdAt: Date.now() }, true);
    await save("journals", "j0", { no: "J-0001", date: d(-60), note: tx("رأس المال والأرصدة الافتتاحية", "Capital and opening balances"), lines: [{ acc: "11", dr: 2000, cr: 0 }, { acc: "31", dr: 0, cr: 2000 }], createdAt: Date.now() }, true);
  }

  (async function run() {
    try {
      await wait(() => S.screen === "onboard" || (S.screen === "app" && S.ready));
      if (S.screen === "onboard") { S.obType = "contracting"; S.obCur = "JOD"; await A.obDone(null, {}); }
      await wait(() => S.screen === "app" && S.ready);
      if (!seeded()) { await seed(); try { localStorage.setItem(SEEDED, "1"); } catch (e) {} closeSheet(); S.view = "home"; render(); const t = document.getElementById("toast"); if (t) t.hidden = true; }
    } catch (e) {
      console.warn("demo", e);
    } finally { done(); }
  })();
})();
