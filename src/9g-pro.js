/* =====================================================================
   Shop & growth tools:
   1. Barcodes: USB/Bluetooth scanners, phone camera, printable labels
   2. Receipts sized for 80 mm / 58 mm thermal printers
   3. Import items, customers, suppliers and staff from Excel or CSV
   4. Installments on sale invoices
   5. Expiry dates (pharmacies, food) with early warnings
   6. Monthly recurring expenses, income and invoices
   ===================================================================== */
Object.assign(L, {
  // barcode
  bcLabel:["الباركود","Barcode"], bcScan:["امسح بالكاميرا","Scan with camera"], bcHint:["امسح الباركود بالقارئ أو الكاميرا، أو اكتبه.","Scan with a reader or the camera, or type it."],
  bcDup:["هاد الباركود مستخدم لصنف ثاني","This barcode is already used by another item"], bcUnknown:["باركود مش معروف: {x}","Unknown barcode: {x}"], bcAddNew:["ضيفه صنف جديد","Add as a new item"],
  bcFound:["{x} · انضاف","{x} · added"], bcCamErr:["ما قدرنا نفتح الكاميرا. اسمح لدفتر يستخدمها من إعدادات المتصفح.","Couldn't open the camera. Allow camera access in your browser settings."],
  bcAim:["وجّه الكاميرا على الباركود","Point the camera at the barcode"], bcGen:["اعمل باركود","Generate"],
  labels:["طباعة ملصقات باركود","Print barcode labels"], labelsSub:["اختار الأصناف وعدد الملصقات لكل واحد.","Pick items and how many labels for each."], labelSize:["حجم الملصق","Label size"],
  lbl4025:["40×25 مم (طابعة ملصقات)","40×25 mm (label printer)"], lbl5030:["50×30 مم (طابعة ملصقات)","50×30 mm (label printer)"], lblA4:["ورق A4 (24 ملصق)","A4 sheet (24 labels)"],
  lblGo:["اطبع الملصقات","Print labels"], lblNone:["اختار صنف واحد على الأقل","Pick at least one item"], lblPrice:["اطبع السعر","Show price"], lblNoCode:["{n} أصناف ما إلها باركود، رح نعملها باركود داخلي.","{n} items have no barcode; we'll give them an in-store code."],
  // receipt
  setPaper:["ورق الطباعة","Printing paper"], paperA4:["A4 عادي","A4"], paper80:["وصل حراري 80 مم","Thermal 80 mm"], paper58:["وصل حراري 58 مم","Thermal 58 mm"],
  paperHint:["إذا عندك طابعة وصولات، اختار عرضها وبتطلع الفواتير والوصولات على مقاسها.","If you have a receipt printer, pick its width and invoices print to fit."],
  rcCashier:["الكاشير","Cashier"], rcGiven:["المدفوع","Paid"], rcItems:["{n} صنف","{n} items"],
  // import
  imp:["استيراد من Excel","Import from Excel"], impSub:["جاي من برنامج ثاني؟ نزّل الأصناف أو الزباين أو الموظفين من ملف Excel أو CSV بدقيقة.","Coming from another program? Bring in items, customers or staff from an Excel or CSV file in a minute."],
  impWhat:["شو بدك تستورد؟","What are you importing?"], impItems:["أصناف","Items"], impCust:["زباين","Customers"], impSupp:["موردين","Suppliers"], impStaff:["موظفين","Staff"],
  impTpl:["نزّل نموذج جاهز","Download a template"], impPick:["اختار الملف (xlsx أو csv)","Choose the file (xlsx or csv)"], impRead:["عم نقرأ الملف…","Reading the file…"],
  impBad:["ما قدرنا نقرأ هالملف. احفظه من Excel كـ xlsx أو CSV وجرّب.","We couldn't read this file. Save it from Excel as xlsx or CSV and try again."],
  impNoName:["ما لقينا عمود الاسم. خلّي أول سطر فيه عناوين، وواحد منها «الاسم».","No name column found. Put headings in the first row, one of them \"Name\"."],
  impPrev:["لقينا {n} سطر جديد · {d} مكرر رح نتجاهله","Found {n} new rows · {d} duplicates will be skipped"], impGo:["استورد {n}","Import {n}"], impDone:["تمّ استيراد {n}","Imported {n}"],
  impCols:["الأعمدة اللي فهمناها: {x}","Columns we understood: {x}"], impMax:["الحد {n} سطر بالمرة الوحدة","Up to {n} rows at a time"], impNone:["ما في أسطر جديدة","No new rows"],
  // installments
  instOpt:["أقساط","Installments"], instN:["عدد الأقساط (شهري)","Number of monthly installments"], instFirst:["أول قسط بتاريخ","First installment on"], instDown:["الدفعة الأولى","Down payment"],
  instT:["الأقساط","Installments"], instK:["القسط {k}","Installment {k}"], instNext:["القسط الجاي: {x} بتاريخ {d}","Next installment: {x} on {d}"], instAllPaid:["خلصت كل الأقساط","All installments paid"],
  instLateN:["{n} قسط متأخر","{n} late"], instRemind:["ذكّر الزبون واتساب","Remind on WhatsApp"], instPay:["سجّل دفعة قسط","Record an installment"],
  instWa:["مرحبا {p}،\nتذكير بقسط رقم {k} من فاتورة {n} بقيمة {x}، مستحق بتاريخ {d}.\nالمتبقي من الفاتورة: {r}.\nشكراً لك، {co}","Hello {p},\nA reminder that installment {k} of invoice {n}, {x}, is due on {d}.\nRemaining on the invoice: {r}.\nThank you, {co}"],
  aInstDue:["أقساط مستحقة هالأسبوع: {n} · {x}","Installments due this week: {n} · {x}"], evInst:["قسط {k} · {n} · {x}","Installment {k} · {n} · {x}"], evInstLate:["قسط متأخر {k} · {n} · {x}","Late installment {k} · {n} · {x}"],
  stLate:["متأخر","Late"], stUp:["جاي","Upcoming"],
  // expiry
  lnExp:["تاريخ الانتهاء (اختياري)","Expiry date (optional)"], openExp:["تاريخ انتهاء الكمية الافتتاحية","Expiry of the opening quantity"],
  expT:["قرب ينتهي","Expiring soon"], expGone:["منتهي","Expired"], expIn:["بعد {n} يوم","in {n} days"], aExp:["أصناف منتهية أو قربت تنتهي: {n}","Items expired or expiring soon: {n}"],
  expNone:["ما في أصناف قربت تنتهي خلال 60 يوم.","Nothing expires in the next 60 days."],
  // recurring
  recT:["المتكرر كل شهر","Monthly recurring"], recMake:["كرّرها كل شهر","Repeat every month"], recOn:["متكررة كل شهر","Repeats monthly"], recStop:["وقّف التكرار","Stop repeating"],
  recDay:["يوم الشهر","Day of the month"], recSaved:["تمام، رح تنسجل لحالها يوم {d} من كل شهر","Done, it will be recorded on day {d} of every month"], recStopped:["وقف التكرار","Stopped"],
  recNone:["ما في اشي متكرر. افتح أي مصروف (مثل الإيجار أو الإنترنت) أو فاتورة، واضغط «كرّرها كل شهر».","Nothing recurring yet. Open any expense (rent, internet…) or invoice and tap \"Repeat every month\"."],
  recRan:["انسجل لحاله: {n} من المتكرر الشهري","Recorded automatically: {n} monthly items"], recNext:["الجاي: {d}","Next: {d}"], recKExp:["مصروف","Expense"], recKInc:["دخل","Income"], recKInv:["فاتورة","Invoice"],
  recNeedDb:["ميزة التكرار بدها تحديث بسيط بقاعدة البيانات. احكي مع الدعم.","Recurring needs a small database update. Contact support."],
});
ICON.scan = '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 9v6M10 9v6M13 9v6M16 9v6"/>';
ICON.upload = '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 1 1 1h14a1 1 0 0 1 1-1v-3"/>';
ICON.repeat = '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>';
if(!COLS.includes("recurring")){ COLS.push("recurring"); S.recurring = S.recurring || []; }

/* small shared helpers */
const sheetOpen = () => !document.getElementById("sheet").hidden;
const sheetTitle = () => document.getElementById("sheetTitle").textContent;
/* same day next month(s), clamped to the month's length: 31 Jan + 1 → 28/29 Feb */
function addMonthsKeep(d, n){ const x = parseD(d), y = x.getFullYear(), m = x.getMonth()+n, last = new Date(y, m+1, 0).getDate(); return iso(new Date(y, m, Math.min(x.getDate(), last))); }

/* =====================================================================
   1. BARCODES
   ===================================================================== */
const normBc = c => String(c||"").replace(/[\s‎‏]/g,"").slice(0,48);
const itemByCode = code => { const k = normBc(code); if(!k) return null; return S.items.find(i=>i.barcode===k) || S.items.find(i=>i.sku && normBc(i.sku)===k) || null; };

/* the barcode field on the item form: input + camera button */
function barcodeField(i){
  return `<div class="field"><label for="f_barcode">${t("bcLabel")}</label><div class="inlinepick"><input id="f_barcode" name="barcode" inputmode="text" autocomplete="off" maxlength="48" value="${esc(i?.barcode||"")}" placeholder="${esc(t("bcHint"))}" class="ltr">
    <button type="button" class="btn sm" data-act="bcCam" data-id="field" aria-label="${esc(t("bcScan"))}">${icon("scan")}</button>${i?.barcode?"":`<button type="button" class="btn sm" data-act="bcGen">${t("bcGen")}</button>`}</div></div>`;
}
/* an in-store code: 2 + 11 digits + EAN check digit (the "2" range is reserved for in-store use) */
function genCode(){
  for(;;){ const d = "2" + String(Math.floor(Math.random()*1e11)).padStart(11,"0");
    const sm = d.split("").reduce((a,c,i)=>a + Number(c)*(i%2?3:1), 0), code = d + ((10 - sm%10)%10);
    if(!S.items.some(i=>i.barcode===code)) return code; }
}

/* what a scanned code means depends on the screen that's open */
function bcHandle(raw){
  const code = normBc(raw); if(code.length<3) return;
  const fld = document.getElementById("f_barcode");
  if(fld && sheetOpen()){ fld.value = code; fld.dispatchEvent(new Event("input",{bubbles:true})); beep(); return; }
  const it = itemByCode(code);
  if(POS && sheetOpen() && sheetTitle()===t("pos")){
    if(it && num(it.price)>0){ A.posAdd(it.id); beep(); toast(t("bcFound",{x:it.name})); } else bcUnknown(code);
    return; }
  if(INV && sheetOpen() && document.getElementById("invLines")){
    if(!it){ bcUnknown(code); return; }
    const box = document.getElementById("invLines"), ls = readLines().filter(l=>l.name);
    const hit = ls.find(l=>l.name===it.name);
    if(hit) hit.qty = num(hit.qty)+1;
    else ls.push({name:it.name, qty:1, price: isSaleSide(INV.type) ? num(it.price) : (num(it.cost)||num(it.price)), tax:num(it.tax ?? taxRate())});
    box.innerHTML = ls.map(lineRow).join(""); invTotals(); beep(); toast(t("bcFound",{x:it.name})); return; }
  if(sheetOpen()) return;   // some other form: don't jump away from it
  if(it){ beep(); if(typeof itemSheet==="function") itemSheet(it.id); return; }
  bcUnknown(code);
}
function bcUnknown(code){
  toast(t("bcUnknown",{x:code}));
  const box = document.getElementById("toast"); if(!box || !canWrite("items")) return;
  box.innerHTML = `${esc(t("bcUnknown",{x:code}))} <button type="button" class="linkbtn" data-act="bcNew" data-id="${esc(code)}">${t("bcAddNew")}</button>`;
}
/* a short beep + buzz so the cashier knows the scan landed */
function beep(){
  try{ navigator.vibrate && navigator.vibrate(30); }catch(e){}
  try{ const C = window.AudioContext || window.webkitAudioContext; if(!C) return; const ac = beep.ac || (beep.ac = new C()), o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = 1450; g.gain.value = .06; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .07); }catch(e){}
}

/* keyboard-wedge scanners (USB / Bluetooth) type the code very fast and press Enter */
const WEDGE = {buf:"", last:0};
document.addEventListener("keydown", e=>{
  if(e.ctrlKey || e.metaKey || e.altKey) return;
  const el = e.target, typing = el && (el.tagName==="INPUT" || el.tagName==="TEXTAREA" || el.tagName==="SELECT" || el.isContentEditable);
  // inside the POS search box or the barcode field, Enter means "this is a code"
  if(e.key==="Enter" && el && (el.id==="posq" || el.id==="f_barcode")){
    e.preventDefault(); const v = el.value.trim(); if(!v) return;
    if(el.id==="posq"){ const it = itemByCode(v); if(it){ el.value = ""; POS.q = ""; bcHandle(v); } else if(POS){ const m = S.items.filter(i=>num(i.price)>0 && String(i.name).toLowerCase().includes(v.toLowerCase())); if(m.length===1){ el.value=""; POS.q=""; A.posAdd(m[0].id); } else bcUnknown(v); } }
    else beep();
    return; }
  if(typing) return;
  const now = performance.now();
  if(e.key==="Enter"){ const b = WEDGE.buf; WEDGE.buf = ""; if(b.length>=4 && now-WEDGE.last<120){ e.preventDefault(); bcHandle(b); } return; }
  if(e.key.length!==1){ return; }
  if(now-WEDGE.last>120) WEDGE.buf = "";
  WEDGE.buf += e.key; WEDGE.last = now;
}, true);

/* ----- camera scanning: the browser's own detector when it has one, otherwise a bundled reader ----- */
const BC_FORMATS = ["ean_13","ean_8","upc_a","upc_e","code_128","code_39","code_93","itf","codabar","qr_code","data_matrix"];
let bcLib = null;
function loadScript(src){ return new Promise((ok, no)=>{ const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
async function bcDetector(){
  if("BarcodeDetector" in window){ try{ const f = await window.BarcodeDetector.getSupportedFormats(); const use = BC_FORMATS.filter(x=>f.includes(x)); if(use.includes("ean_13") && use.includes("code_128")) return new window.BarcodeDetector({formats:use}); }catch(e){} }
  if(!bcLib){ await loadScript("vendor/barcode.js"); bcLib = window.BarcodeDetectionAPI;
    bcLib.prepareZXingModule({overrides:{locateFile:(p, pre)=> p.endsWith(".wasm") ? new URL("vendor/zxing_reader.wasm", location.href).href : pre + p}}); }
  return new bcLib.BarcodeDetector({formats:BC_FORMATS});
}
const CAM = {stream:null, timer:null, busy:false};
async function bcCamera(onCode){
  let det;
  try{ det = await bcDetector(); }catch(e){ toast(t("eGeneric")); return; }
  let stream;
  try{ stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}, width:{ideal:1280}}, audio:false}); }
  catch(e){ toast(t("bcCamErr")); return; }
  bcCamClose();
  CAM.stream = stream;
  const ov = document.createElement("div"); ov.id = "camOv"; ov.className = "cam-ov"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label", t("bcScan"));
  ov.innerHTML = `<video playsinline muted autoplay></video><div class="cam-frame"></div><p class="cam-tip">${esc(t("bcAim"))}</p><button type="button" class="btn cam-x" data-act="bcCamClose">${icon("x")}${t("cancel")}</button>`;
  document.body.appendChild(ov);
  const v = ov.querySelector("video"); v.srcObject = stream; try{ await v.play(); }catch(e){}
  CAM.timer = setInterval(async ()=>{
    if(CAM.busy || v.readyState<2) return; CAM.busy = true;
    try{ const r = await det.detect(v); const hit = r && r.find(x=>x.rawValue);
      if(hit){ bcCamClose(); onCode(hit.rawValue); } }catch(e){} finally{ CAM.busy = false; }
  }, 220);
}
function bcCamClose(){
  clearInterval(CAM.timer); CAM.timer = null;
  if(CAM.stream){ CAM.stream.getTracks().forEach(tr=>tr.stop()); CAM.stream = null; }
  const ov = document.getElementById("camOv"); if(ov) ov.remove();
}

/* ----- Code 128 (set B) as SVG: every scanner reads it, no fonts or libraries needed ----- */
const C128 = "212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112".split(" ");
function code128Svg(text, h){
  const s = String(text).replace(/[^\x20-\x7e]/g,"");
  const vals = [104, ...[...s].map(c=>c.charCodeAt(0)-32)];
  const chk = vals.reduce((a,v,i)=>a + v*(i||1), 0) % 103;
  const pat = [...vals, chk].map(v=>C128[v]).join("") + C128[106];
  let x = 10, bars = "";
  [...pat].forEach((w,i)=>{ const n = Number(w); if(i%2===0) bars += `<rect x="${x}" y="0" width="${n}" height="${h}"/>`; x += n; });
  return `<svg class="bc" viewBox="0 0 ${x+10} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s)}"><rect width="100%" height="100%" fill="#fff"/><g fill="#000">${bars}</g></svg>`;
}

/* ----- labels ----- */
function labelsSheet(pre){
  const items = S.items.filter(i=>!i.archived).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  if(!items.length){ toast(t("noItems")); return; }
  const picked = new Set(pre ? [pre] : []);
  openSheet({title:t("labels"), saveLabel:t("lblGo"),
    html:`<p class="sub">${t("labelsSub")}</p>
      <div class="field"><span class="flabel">${t("labelSize")}</span><div class="chips">${[["4025",t("lbl4025")],["5030",t("lbl5030")],["a4",t("lblA4")]].map(([v,l],i)=>`<label><input type="radio" name="lsize" value="${v}" ${(lsGet("lblSize","4025")===v)?"checked":""}><span>${l}</span></label>`).join("")}</div></div>
      <label class="check"><input type="checkbox" name="lprice" value="1" ${lsGet("lblPrice",1)?"checked":""}><span><b>${t("lblPrice")}</b></span></label>
      <div class="list lbl-pick">${items.map(i=>`<label class="row static lbl-row"><input type="checkbox" name="lpick" value="${esc(i.id)}" ${picked.has(i.id)?"checked":""}><div class="m"><b>${esc(i.name)}</b><span class="sub ltr">${esc(i.barcode||"—")}</span></div><input class="lbl-n" data-n="${esc(i.id)}" inputmode="numeric" value="1" aria-label="#"></label>`).join("")}</div>`,
    submit: async v=>{
      const ids = v.lpick || []; if(!ids.length){ toast(t("lblNone")); return false; }
      lsSet("lblSize", v.lsize||"4025"); lsSet("lblPrice", (v.lprice||[]).length?1:0);
      const counts = {}; document.querySelectorAll("#sheetBody .lbl-n").forEach(el=>counts[el.dataset.n] = Math.max(0, Math.min(500, parseInt(toEn(el.value))||0)));
      // give items without a code an in-store one, so the label can be scanned back
      for(const id of ids){ const it = S.items.find(i=>i.id===id); if(it && !it.barcode){ const code = genCode(); await save("items", it.id, {...strip(it), barcode:code}, true); } }
      const list = []; ids.forEach(id=>{ const it = S.items.find(i=>i.id===id); for(let k=0; k<(counts[id]??1); k++) if(it) list.push(it); });
      if(!list.length){ toast(t("lblNone")); return false; }
      printLabels(list, v.lsize||"4025", (v.lprice||[]).length>0); return true;
    }});
}
function printLabels(list, size, withPrice){
  const one = it => `<div class="lbl"><b>${esc(String(it.name).slice(0,34))}</b>${code128Svg(it.barcode, 60)}<span class="ltr">${esc(it.barcode)}</span>${withPrice&&num(it.price)?`<i>${esc(moneyTxt(num(it.price)))}</i>`:""}</div>`;
  const page = size==="a4" ? "A4" : size==="5030" ? "50mm 30mm" : "40mm 25mm";
  printDoc(`<style>@page{size:${page};margin:${size==="a4"?"8mm":"0"}}</style><div class="labels sz-${size}">${list.map(one).join("")}</div>`);
}

/* =====================================================================
   2. THERMAL RECEIPTS
   ===================================================================== */
function receiptHtml(x){
  const c = invCalc(x), p = partyById(x.partyId), s = ST(), paid = invPaid(x), vs = liveVouch().filter(v=>v.invoiceId===x.id);
  return `<div class="doc rcpt w${s.paper==="58"?"58":"80"}">
    <h1>${esc(COMPANY.name||"")}</h1>${s.address?`<div>${esc(s.address)}</div>`:""}${COMPANY.phone?`<div class="ltr">${esc(COMPANY.phone)}</div>`:""}${s.taxNo?`<div>${t("taxNoL")}: <span class="ltr">${esc(s.taxNo)}</span></div>`:""}
    <hr><div class="rl"><span>${esc(t(INV_T[x.type]))}</span><span class="ltr">${esc(x.no||"")}</span></div><div class="rl"><span>${t("date")}</span><span class="ltr">${esc(x.date)}${x.createdAt?" "+new Date(x.createdAt).toTimeString().slice(0,5):""}</span></div>
    ${p && !p.walkIn ? `<div class="rl"><span>${t("posCustomer")}</span><span>${esc(p.name)}</span></div>`:""}<hr>
    ${c.rows.map(l=>`<div class="ri"><b>${esc(l.name)}</b><div class="rl"><span class="ltr">${fmt(num(l.qty))} × ${fmt(num(l.price))}</span><span>${fmt(l.netA+l.taxA)}</span></div></div>`).join("")}<hr>
    <div class="rl"><span>${t("rcItems",{n:c.rows.length})}</span><span></span></div>
    ${c.discount?`<div class="rl"><span>${t("discountL")}</span><span>− ${fmt(c.discount)}</span></div>`:""}
    <div class="rl"><span>${t("taxTotal")}</span><span>${fmt(c.tax)}</span></div><div class="rl g"><span>${t("grandTotal")}</span><span>${esc(moneyTxt(c.total))}</span></div>
    ${paid>0.005?`<div class="rl"><span>${t("rcGiven")}${vs[0]?" · "+esc(t(vs[0].method||"cash")):""}</span><span>${fmt(paid)}</span></div>`:""}
    ${x.given && num(x.given)>c.total?`<div class="rl"><span>${t("posChange")}</span><span>${fmt(num(x.given)-c.total)}</span></div>`:""}
    <hr><div>${esc(s.invFoot||t("thanksInv"))}</div><small>daftarapp.co</small></div>`;
}
/* the page size has to be set on the whole document while printing */
function printSized(html){
  const s = ST(); if(s.paper==="a4") return printDoc(html);
  printDoc(`<style>@page{size:${s.paper}mm auto;margin:2mm}</style>` + html);
}
Object.assign(A, {
  posPrint: id => { const x = invById(id); if(x){ closeSheet(); printSized(receiptHtml(x)); } },
  printInv: id => { const x = invById(id); if(!x) return; closeSheet(); if(ST().paper!=="a4" && !isDraft(x.type)) printSized(receiptHtml(x)); else printDoc(invDocHtml(x)); },
});

/* =====================================================================
   3. IMPORT FROM EXCEL / CSV
   ===================================================================== */
/* A tiny .xlsx reader: an xlsx file is a zip of XML files. We read the zip's
   directory, inflate with the browser's own DecompressionStream, and read the
   first sheet's cells. No third-party parser, so nothing to keep patched. */
async function unzipEntries(buf){
  const dv = new DataView(buf), u8 = new Uint8Array(buf);
  let e = -1; for(let i = buf.byteLength-22; i>=Math.max(0, buf.byteLength-66000); i--) if(dv.getUint32(i, true)===0x06054b50){ e = i; break; }
  if(e<0) throw new Error("zip");
  const n = dv.getUint16(e+10, true); let p = dv.getUint32(e+16, true); const out = {};
  const td = new TextDecoder();
  for(let k=0; k<n; k++){
    if(dv.getUint32(p, true)!==0x02014b50) throw new Error("zip");
    const method = dv.getUint16(p+10, true), csize = dv.getUint32(p+20, true), nl = dv.getUint16(p+28, true), xl = dv.getUint16(p+30, true), cl = dv.getUint16(p+32, true), lo = dv.getUint32(p+42, true);
    const name = td.decode(u8.subarray(p+46, p+46+nl));
    out[name] = {method, csize, lo}; p += 46+nl+xl+cl;
  }
  const read = async name => {
    const f = out[name]; if(!f) return null;
    const lnl = dv.getUint16(f.lo+26, true), lxl = dv.getUint16(f.lo+28, true), start = f.lo+30+lnl+lxl, data = u8.subarray(start, start+f.csize);
    if(f.method===0) return td.decode(data);
    if(f.method!==8 || typeof DecompressionStream==="undefined") throw new Error("zip");
    const ds = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return await new Response(ds).text();
  };
  return {names:Object.keys(out), read};
}
async function readXlsx(buf){
  const z = await unzipEntries(buf), xml = s => new DOMParser().parseFromString(s, "application/xml");
  const wb = xml(await z.read("xl/workbook.xml") || ""), rels = xml(await z.read("xl/_rels/workbook.xml.rels") || "");
  const sh = wb.getElementsByTagName("sheet")[0]; if(!sh) throw new Error("sheet");
  const rid = sh.getAttribute("r:id") || sh.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id");
  let target = "worksheets/sheet1.xml";
  [...rels.getElementsByTagName("Relationship")].forEach(r=>{ if(r.getAttribute("Id")===rid) target = r.getAttribute("Target"); });
  const path = target.startsWith("/") ? target.slice(1) : "xl/" + target.replace(/^\.\//,"");
  const ssx = await z.read("xl/sharedStrings.xml"), shared = ssx ? [...xml(ssx).getElementsByTagName("si")].map(si=>[...si.getElementsByTagName("t")].map(x=>x.textContent).join("")) : [];
  const doc = xml(await z.read(path) || ""), rows = [];
  const colIx = ref => { const m = /^([A-Z]+)/.exec(ref||""); if(!m) return -1; return [...m[1]].reduce((a,c)=>a*26 + c.charCodeAt(0)-64, 0) - 1; };
  [...doc.getElementsByTagName("row")].forEach(r=>{
    const row = []; let auto = 0;
    [...r.getElementsByTagName("c")].forEach(c=>{
      const ix = c.hasAttribute("r") ? colIx(c.getAttribute("r")) : auto; auto = ix+1;
      const tp = c.getAttribute("t"), v = c.getElementsByTagName("v")[0], is = c.getElementsByTagName("is")[0];
      let val = tp==="s" ? (shared[Number(v && v.textContent)] ?? "") : tp==="inlineStr" ? (is ? [...is.getElementsByTagName("t")].map(x=>x.textContent).join("") : "") : (v ? v.textContent : "");
      if(ix>=0 && ix<200) row[ix] = String(val).trim();
    });
    if(row.some(x=>x)) rows.push([...row].map(x=>x??""));
  });
  return rows;
}
/* CSV with quotes; the separator is whichever of , ; tab appears most in the first line */
function readCsv(text){
  text = text.replace(/^﻿/,"");
  const first = text.split(/\r?\n/)[0] || "", sep = [",",";","\t"].sort((a,b)=>first.split(b).length-first.split(a).length)[0];
  const rows = []; let row = [], cell = "", q = false;
  for(let i=0;i<text.length;i++){ const ch = text[i];
    if(q){ if(ch==='"'){ if(text[i+1]==='"'){ cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if(ch==='"') q = true; else if(ch===sep){ row.push(cell.trim()); cell = ""; } else if(ch==="\n"||ch==="\r"){ if(ch==="\r"&&text[i+1]==="\n") i++; row.push(cell.trim()); cell = ""; if(row.some(x=>x)) rows.push(row); row = []; } else cell += ch; }
  row.push(cell.trim()); if(row.some(x=>x)) rows.push(row);
  return rows;
}
/* each field and the headings people write for it (Arabic, English, and what other programs export) */
const IMP = {
  items:{col:"items", f:{name:["الاسم","اسم الصنف","الصنف","المنتج","اسم المنتج","name","item","product","item name"], price:["سعر البيع","السعر","price","sale price","selling price"],
    cost:["التكلفة","سعر الشراء","الكلفة","cost","purchase price","buy price"], barcode:["الباركود","باركود","barcode","ean","upc"], sku:["الكود","رمز الصنف","sku","code","item code"],
    unit:["الوحدة","unit","uom"], openQty:["الكمية","الكمية الافتتاحية","الرصيد","qty","quantity","stock","on hand"], minQty:["حد التنبيه","حد الطلب","min","reorder"], tax:["الضريبة","نسبة الضريبة","tax","vat","tax %"]},
    tpl:[["الاسم","سعر البيع","التكلفة","الباركود","الوحدة","الكمية","الضريبة"],["سكر 1 كيلو","1.2","0.95","6251234567890","كيس","40","16"]]},
  customers:{col:"parties", f:{name:["الاسم","اسم الزبون","الزبون","العميل","اسم العميل","name","customer","client"], phone:["الهاتف","التلفون","الموبايل","رقم الهاتف","phone","mobile","tel"],
    taxNo:["الرقم الضريبي","tax no","tax number","vat no","trn"], address:["العنوان","address","city"], openBal:["الرصيد","الرصيد الافتتاحي","balance","opening balance"]},
    tpl:[["الاسم","الهاتف","الرقم الضريبي","العنوان","الرصيد"],["محل أبو سامر","0791234567","","عمّان","120"]]},
  staff:{col:"staff", f:{name:["الاسم","اسم الموظف","الموظف","العامل","name","employee"], phone:["الهاتف","التلفون","الموبايل","phone","mobile"], role:["الوظيفة","المسمى","role","job","title"],
    rate:["الراتب","الأجر","اليومية","salary","wage","rate"], rateType:["نوع الأجر","يومي/شهري","pay type","type"], ssNo:["رقم الضمان","social security","ss no"]},
    tpl:[["الاسم","الهاتف","الوظيفة","الراتب","نوع الأجر"],["أحمد علي","0791234567","فني","450","شهري"],["محمد سالم","0781234567","عامل","18","يومي"]]},
};
IMP.suppliers = {...IMP.customers, tpl:[["الاسم","الهاتف","الرقم الضريبي","العنوان","الرصيد"],["مستودعات النور","0791234567","123456789","الزرقاء","0"]]};
const normH = h => String(h||"").toLowerCase().replace(/[ً-ْـ]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[\s_\-:()%]+/g," ").trim();
function mapCols(head, spec){
  const m = {}; const H = head.map(normH);
  Object.entries(spec.f).forEach(([k, names])=>{ const ns = names.map(normH); let i = H.findIndex(h=>ns.includes(h)); if(i<0) i = H.findIndex(h=>h && ns.some(n=>n.length>2 && (h.includes(n) || n.includes(h)))); if(i>=0 && !Object.values(m).includes(i)) m[k] = i; });
  return m;
}
const IMP_MAX = 3000;
let IMPS = null;
function importSheet(kind){
  kind = IMP[kind] ? kind : (IMPS && IMPS.kind) || "items"; IMPS = {kind, rows:null};
  if(!canWrite(IMP[kind].col)){ toast(t("noPerm")); return; }
  openSheet({title:t("imp"), saveLabel:t("impNone"),
    html:`<p class="sub">${t("impSub")}</p>
      <div class="field"><span class="flabel">${t("impWhat")}</span><div class="chips">${[["items",t("impItems")],["customers",t("impCust")],["suppliers",t("impSupp")],["staff",t("impStaff")]].map(([v,l])=>`<label><input type="radio" name="ikind" value="${v}" ${v===kind?"checked":""}><span>${l}</span></label>`).join("")}</div></div>
      <button type="button" class="btn sm" data-act="impTpl">${icon("file")}${t("impTpl")}</button>
      <div class="field"><label for="impFile">${t("impPick")}</label><input id="impFile" type="file" accept=".xlsx,.csv,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></div>
      <div id="impOut"></div>`,
    submit: ()=>importRun()});
  document.getElementById("sheetSave").disabled = true;
}
async function importRead(file){
  const out = document.getElementById("impOut"); if(!out) return;
  out.innerHTML = `<span class="hint">${t("impRead")}</span>`; document.getElementById("sheetSave").disabled = true;
  let rows;
  try{
    if(file.size > 8*1024*1024) throw new Error("big");
    const buf = await file.arrayBuffer(), u = new Uint8Array(buf);
    rows = (u[0]===0x50 && u[1]===0x4b) ? await readXlsx(buf) : readCsv(new TextDecoder(/�/.test(new TextDecoder().decode(u.subarray(0,4000))) ? "windows-1256" : "utf-8").decode(u));
  }catch(e){ out.innerHTML = `<div class="alert bad">${icon("alert")}<span>${t("impBad")}</span></div>`; return; }
  const spec = IMP[IMPS.kind], hi = rows.findIndex(r=>r.filter(Boolean).length>=1);
  const head = rows[hi] || [], map = mapCols(head, spec);
  if(map.name==null){ out.innerHTML = `<div class="alert bad">${icon("alert")}<span>${t("impNoName")}</span></div>`; return; }
  const body = rows.slice(hi+1).filter(r=>String(r[map.name]||"").trim()).slice(0, IMP_MAX);
  const recs = body.map(r=>importRecord(IMPS.kind, r, map)).filter(Boolean);
  // skip what's already there (same name, or same barcode for items) and duplicates inside the file
  const have = new Set((S[spec.col]||[]).filter(x=>IMPS.kind==="staff" ? x.active!==false : !x.archived).map(x=>normH(x.name)));
  const codes = new Set(S.items.map(i=>i.barcode).filter(Boolean)), fresh = [];
  recs.forEach(r=>{ const k = normH(r.name); if(have.has(k) || (r.barcode && codes.has(r.barcode))) return; have.add(k); if(r.barcode) codes.add(r.barcode); fresh.push(r); });
  IMPS.rows = fresh;
  const labels = Object.keys(map).map(k=>head[map[k]]).filter(Boolean).map(esc).join("، ");
  out.innerHTML = `<div class="alert ${fresh.length?"good":"warn"}">${icon(fresh.length?"check":"alert")}<span>${t("impPrev",{n:`<b class="num">${fresh.length}</b>`, d:`<span class="num">${recs.length-fresh.length}</span>`})}</span></div>
    <span class="hint">${t("impCols",{x:labels})}${rows.length-hi-1>IMP_MAX?" · "+t("impMax",{n:IMP_MAX}):""}</span>
    ${fresh.length?`<div class="list">${fresh.slice(0,6).map(r=>`<div class="row static"><div class="m"><b>${esc(r.name)}</b><span class="sub">${esc(impSummary(IMPS.kind, r))}</span></div></div>`).join("")}</div>`:""}`;
  const sv = document.getElementById("sheetSave"); sv.disabled = !fresh.length; sv.textContent = fresh.length ? t("impGo",{n:fresh.length}) : t("impNone");
}
function importRecord(kind, r, m){
  const g = k => m[k]!=null ? String(r[m[k]]??"").trim() : "", n = k => num(toEn(g(k)).replace(/[^\d.\-]/g,""));
  const name = g("name").slice(0, kind==="items"?120:100); if(!name) return null;
  const now = Date.now();
  if(kind==="items"){ const tx = g("tax")==="" ? taxRate() : Math.max(0, Math.min(50, n("tax") <= 1 && g("tax").includes(".") ? n("tax")*100 : n("tax")));
    return {name, price:n("price"), cost:n("cost"), barcode:normBc(toEn(g("barcode"))), sku:g("sku").slice(0,40), unit:g("unit").slice(0,20), openQty:n("openQty"), minQty:n("minQty"), tax:tx, service:false, openDate:today(), createdAt:now}; }
  if(kind==="staff"){ const rt = normH(g("rateType")), rate = n("rate");
    const rateType = /يوم|day|daily/.test(rt) ? "day" : /اسبوع|week/.test(rt) ? "week" : /شهر|month/.test(rt) ? "month" : (rate && rate<60 ? "day" : "month");
    return {name, phone:g("phone").slice(0,30), role:g("role").slice(0,60), rate, rateType, otRate:0, ssNo:g("ssNo").slice(0,30), ss:!!g("ssNo"), active:true, startDate:today(), unitId:(activeUnits()[0]||{}).id||"", createdAt:now}; }
  return {name, kind:kind==="suppliers"?"supplier":"customer", phone:g("phone").slice(0,30), taxNo:g("taxNo").slice(0,30), address:g("address").slice(0,120), openBal:n("openBal"), limit:0, createdAt:now};
}
const impSummary = (kind, r) => kind==="items" ? [r.price?t("itemPrice")+" "+fmt(r.price):"", r.barcode, r.openQty?t("onHand")+" "+fmt(r.openQty):""].filter(Boolean).join(" · ")
  : kind==="staff" ? [r.role, r.rate?fmt(r.rate)+" "+t(r.rateType==="day"?"daily":r.rateType==="week"?"weekly":"monthly"):""].filter(Boolean).join(" · ")
  : [r.phone, r.address].filter(Boolean).join(" · ");
async function importRun(){
  if(!IMPS || !IMPS.rows || !IMPS.rows.length) return false;
  const col = IMP[IMPS.kind].col, rows = IMPS.rows.map(d=>({company_id:CID, col, id:newId(), data:d}));
  if(col==="staff" && !rows[0].data.unitId){ toast(tv("noUnitsSub")); return false; }
  const sv = document.getElementById("sheetSave");
  for(let i=0; i<rows.length; i+=200){
    if(sv) sv.textContent = `${Math.min(i+200, rows.length)} / ${rows.length}`;
    const { error } = await sb.from("records").upsert(rows.slice(i, i+200), {onConflict:"company_id,col,id"});
    if(error){ toast(errMsg(error)); await loadAll(); render(); return false; }
    rows.slice(i, i+200).forEach(r=>applyLocal(col, r.id, r.data));
  }
  toast(t("impDone",{n:rows.length})); IMPS = null; render(); return true;
}
function impTemplate(){
  const spec = IMP[(IMPS&&IMPS.kind)||"items"], q = v => /[",;\n]/.test(v) ? `"${String(v).replace(/"/g,'""')}"` : v;
  const csv = "﻿" + spec.tpl.map(r=>r.map(q).join(",")).join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download = `daftar-${(IMPS&&IMPS.kind)||"items"}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}

/* =====================================================================
   4. INSTALLMENTS
   ===================================================================== */
function instFields(x){
  const n = x?.inst?.n || 6, first = x?.inst?.first || addMonthsKeep(today(), 1);
  return [{name:"instN",label:t("instN"),type:"chips",options:[2,3,4,6,10,12,18,24,36].map(k=>[String(k),String(k)]),value:String(n)},
    {name:"instFirst",label:t("instFirst"),type:"date",value:first}];
}
function instVis(){
  const on = (document.querySelector('#sheetBody [name="due"]:checked')||{}).value==="inst";
  ["instN","instFirst"].forEach(n=>{ const el = document.querySelector(`#sheetBody [name="${n}"]`); const f = el && el.closest(".field"); if(f) f.hidden = !on; });
  const pl = document.querySelector('label[for="f_paidNow"]'); if(pl){ pl.dataset.base = pl.dataset.base || pl.textContent; pl.textContent = on ? t("instDown") : pl.dataset.base; }
}
function instApply(data, v, x){
  if(v.due!=="inst" || data.type!=="sale"){ delete data.inst; return; }
  const n = Math.max(2, Math.min(60, parseInt(v.instN)||6)), first = validDate(v.instFirst) ? v.instFirst : addMonthsKeep(data.date, 1);
  const down = x?.inst ? Math.min(num(x.inst.down), data.total) : Math.min(Math.max(0, num(v.paidNow)), data.total);
  data.inst = {n, first, down:r2(down)};
  data.dueDate = addMonthsKeep(first, n-1);
}
/* the schedule, with what's been paid spread over it oldest first */
function instRows(x){
  if(!x || !x.inst) return [];
  const total = invCalc(x).total, down = Math.min(num(x.inst.down), total), base = r2(total-down), n = Math.max(1, x.inst.n|0);
  const each = Math.floor(base/n*100)/100;
  let pool = Math.max(0, r2(invPaid(x) - down)); const t0 = today();
  return Array.from({length:n}, (_, i)=>{
    const amount = i===n-1 ? r2(base - each*(n-1)) : each, date = addMonthsKeep(x.inst.first, i);
    const paid = r2(Math.min(pool, amount)); pool = r2(pool - paid); const left = r2(amount - paid);
    return {k:i+1, date, amount, paid, left, state: left<=0.005 ? "paid" : date<t0 ? "late" : daysTo(date)<=7 ? "due" : "up"};
  });
}
const instLate = x => instRows(x).some(r=>r.state==="late");
const _invState0 = invState;
invState = function(inv){ const st = _invState0(inv); if(inv.inst && inv.type==="sale" && st!=="paid" && !isDraft(inv.type)) return instLate(inv) ? "overdue" : invPaid(inv)>0.005 ? "partial" : "unpaid"; return st; };
function instBlock(x){
  const rows = instRows(x), next = rows.find(r=>r.left>0.005), late = rows.filter(r=>r.state==="late").length;
  const pill = r => `<span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":r.state==="due"?"warn":""}">${t({paid:"stPaid",late:"stLate",due:"stUnpaid",up:"stUp"}[r.state])}</span>`;
  return `<div class="panel inst"><div class="inst-h"><b>${t("instT")} · <span class="num">${x.inst.n}</span></b>${late?`<span class="pill bad">${t("instLateN",{n:late})}</span>`:""}</div>
    ${num(x.inst.down)?`<div class="kv"><div><span>${t("instDown")}</span><b>${money(num(x.inst.down))}</b></div></div>`:""}
    <span class="sub">${next ? t("instNext",{x:money(next.left), d:fdate(next.date)}) : t("instAllPaid")}</span>
    <div class="list">${rows.map(r=>`<div class="row static"><div class="m"><b>${t("instK",{k:r.k})}</b><span class="sub">${fdate(r.date)}${r.paid>0.005&&r.left>0.005?` · ${t("paidL")} ${fmt(r.paid)}`:""}</span></div><div class="col end"><b>${money(r.amount)}</b>${pill(r)}</div></div>`).join("")}</div>
    ${next?`<div class="grid2"><button type="button" class="btn primary" data-act="instPay" data-id="${esc(x.id)}">${icon("wallet")}${t("instPay")}</button><button type="button" class="btn" data-act="instWa" data-id="${esc(x.id)}">${icon("send")}${t("instRemind")}</button></div>`:""}</div>`;
}
function instWaText(x){
  const rows = instRows(x), r = rows.find(z=>z.left>0.005); if(!r) return "";
  const p = partyById(x.partyId)||{};
  return t("instWa",{p:p.name||"", k:r.k, n:x.no||"", x:moneyTxt(r.left), d:dmy(r.date), r:moneyTxt(r2(invCalc(x).total-invPaid(x))), co:COMPANY.name||""});
}
const _bookAlerts0 = bookAlerts;
bookAlerts = function(){
  const out = _bookAlerts0();
  const due = []; S.invoices.filter(x=>!x.void && x.inst && x.type==="sale").forEach(x=>instRows(x).forEach(r=>{ if(r.left>0.005 && daysTo(r.date)>=0 && daysTo(r.date)<=7) due.push(r); }));
  if(due.length) out.push(["warn","calendar", t("aInstDue",{n:`<span class="num">${due.length}</span>`, x:money(sum(due,r=>r.left))})]);
  const ex = expiringSoon(30); if(ex.length) out.push([ex.some(b=>b.days<0)?"bad":"warn","alert", t("aExp",{n:`<span class="num">${ex.length}</span>`}) + ": " + ex.slice(0,3).map(b=>esc(b.item.name)).join("، ")]);
  return out;
};

/* =====================================================================
   5. EXPIRY DATES
   Stock comes in batches (opening quantity, purchase lines) that may carry an
   expiry date. We assume the shop sells the earliest expiry first, so what's
   left on the shelf is the latest batches.
   ===================================================================== */
function batchesOf(it){
  const b = [];
  if(num(it.openQty)>0 && it.openExp) b.push({exp:it.openExp, qty:num(it.openQty)});
  liveInv().filter(x=>x.type==="purchase").forEach(x=>(x.lines||[]).forEach(l=>{ if(l.exp && num(l.qty)>0){ const i = itemOf(l); if(i && i.id===it.id) b.push({exp:l.exp, qty:num(l.qty)}); } }));
  if(!b.length) return [];
  let left = Math.max(0, qtyOf(it.id));
  return b.sort((a,c)=>c.exp.localeCompare(a.exp)).map(x=>{ const q = Math.min(x.qty, left); left -= q; return {...x, left:r2(q)}; }).filter(x=>x.left>0);
}
function expiringSoon(days){
  const out = [];
  S.items.filter(stocked).forEach(it=>batchesOf(it).forEach(b=>{ const d = daysTo(b.exp); if(d<=days) out.push({item:it, exp:b.exp, qty:b.left, days:d}); }));
  return out.sort((a,b)=>a.exp.localeCompare(b.exp));
}
function expiryPanel(){
  const list = expiringSoon(60); if(!list.length) return "";
  return `<div class="panel exp-panel"><b>${icon("alert")} ${t("expT")}</b><div class="list">${list.slice(0,30).map(b=>`<button class="row" data-act="viewItem" data-id="${esc(b.item.id)}"><div class="m"><b>${esc(b.item.name)}</b><span class="sub">${fdate(b.exp)}</span></div>
    <div class="col end"><b class="num">${fmt(b.qty)} ${esc(b.item.unit||"")}</b><span class="pill ${b.days<0?"bad":b.days<=14?"warn":""}">${b.days<0?t("expGone"):t("expIn",{n:b.days})}</span></div></button>`).join("")}</div></div>`;
}
const _viewStock0 = viewStock;
viewStock = function(){
  const h = _viewStock0(), tools = `<div class="two"><button class="btn" data-act="labels">${icon("scan")}${t("labels")}</button><button class="btn" data-act="move">${icon("upload")}${t("mv")}</button></div>`;
  const i = h.indexOf('<div class="panel">');
  return i>=0 ? h.slice(0,i) + tools + expiryPanel() + h.slice(i) : h + tools;
};
const _itemSheet0 = itemSheet;
itemSheet = function(id){
  _itemSheet0(id); const it = S.items.find(i=>i.id===id); if(!it) return;
  const bs = batchesOf(it), body = document.getElementById("sheetBody");
  const extra = `${it.barcode?`<div class="bc-show">${code128Svg(it.barcode, 46)}<span class="ltr">${esc(it.barcode)}</span></div>`:""}
    ${bs.length?`<div class="kv">${bs.map(b=>`<div><span>${t("lnExp").replace(/\s*\(.*\)/,"")} ${esc(dmy(b.exp))}</span><b class="num ${daysTo(b.exp)<0?"negv":""}">${fmt(b.left)}</b></div>`).join("")}</div>`:""}
    <button type="button" class="btn sm" data-act="labels" data-id="${esc(id)}">${icon("scan")}${t("labels")}</button>`;
  const kv = body && body.querySelector(".total"); if(kv) kv.insertAdjacentHTML("afterend", extra);
};

/* =====================================================================
   6. RECURRING (monthly)
   A template remembers an expense, income or invoice. Every month on its day
   a copy is recorded. The copy's id is built from the template and the month,
   so two phones running this at the same time can't record it twice.
   ===================================================================== */
const recOf = srcId => S.recurring.find(r=>r.srcId===srcId && r.active!==false);
function recurBtn(kind, id){
  if(!canWrite("recurring")) return "";
  const r = recOf(id);
  return r ? `<button type="button" class="btn ghost" data-act="recStop" data-id="${esc(r.id)}">${icon("repeat")}${t("recOn")} · ${t("recStop")}</button>`
    : `<button type="button" class="btn ghost" data-act="recMake" data-id="${esc(id)}" data-k="${kind}">${icon("repeat")}${t("recMake")}</button>`;
}
function recSrc(kind, id){ return kind==="inv" ? invById(id) : kind==="exp" ? S.expenses.find(x=>x.id===id) : S.income.find(x=>x.id===id); }
function recMake(kind, id){
  const x = recSrc(kind, id); if(!x) return;
  const day = Math.min(28, Math.max(1, parseD(x.date||today()).getDate()));
  openSheet({title:t("recMake"), saveLabel:t("save"),
    fields:[{name:"day",label:t("recDay"),type:"number",value:day,min:1,maxv:28}],
    submit: async v=>{
      const d = Math.min(28, Math.max(1, parseInt(v.day)||day));
      const snap = strip(x); ["no","files","createdAt","demo","void","srcId","inst"].forEach(k=>delete snap[k]);
      const ok = await save("recurring", newId(), {kind, srcId:id, day:d, start:addMonths(monthStartOf(x.date||today()),1).slice(0,7), data:snap, active:true, createdAt:Date.now()}, true);
      if(!ok){ toast(t("recNeedDb")); return false; }
      toast(t("recSaved",{d})); render(); return true; }});
}
let recBusy = false;
async function recurRun(){
  if(recBusy || !CID || !S.recurring.length || !canWrite("recurring")) return; recBusy = true;
  let made = 0;
  try{
    const t0 = today(), cur = t0.slice(0,7);
    for(const r of S.recurring.filter(r=>r.active!==false && r.data)){
      const col = r.kind==="inv" ? "invoices" : r.kind==="exp" ? "expenses" : "income";
      if(!canWrite(col)) continue;
      // catch up at most three months back
      let ym = r.start > addMonths(cur+"-01",-2).slice(0,7) ? r.start : addMonths(cur+"-01",-2).slice(0,7);
      for(; ym<=cur; ym = addMonths(ym+"-01",1).slice(0,7)){
        const date = `${ym}-${String(r.day).padStart(2,"0")}`; if(date>t0) break;
        const id = `rc-${r.id}-${ym}`; if(S[col].some(x=>x.id===id)) continue;
        let data = {...r.data, date, createdAt:Date.now(), recId:r.id};
        if(col==="invoices"){ const span = r.data.dueDate && r.data.date ? Math.max(0, daysTo(r.data.dueDate)-daysTo(r.data.date)) : 0;
          data = {...data, no:nextNo("invoices", INV_PFX[r.data.type]||"S"), dueDate:addDays(date, span)}; data.total = invCalc(data).total; }
        if(col!=="invoices" && !unitById(data.unitId)) continue;
        if(await save(col, id, data, true)) made++;
      }
    }
  } finally { recBusy = false; }
  if(made){ toast(t("recRan",{n:made})); render(); }
}
function recurSheet(){
  const list = S.recurring.filter(r=>r.active!==false);
  const lab = r => r.kind==="inv" ? `${t("recKInv")} · ${esc((partyById(r.data.partyId)||{}).name||"")}` : `${t(r.kind==="exp"?"recKExp":"recKInc")} · ${esc(catLabel(r.data.category||""))}${r.data.item?" · "+esc(r.data.item):""}`;
  const amt = r => r.kind==="inv" ? invCalc(r.data).total : num(r.data.amount);
  const next = r => { const t0 = today(), d = t0.slice(0,8)+String(r.day).padStart(2,"0"); return d>=t0 ? d : addMonthsKeep(d, 1); };
  openSheet({title:t("recT"), noSave:true, html: list.length ? `<div class="list">${list.map(r=>`<div class="row static"><span class="tx-ic">${icon("repeat")}</span><div class="m"><b>${lab(r)}</b><span class="sub">${t("recNext",{d:fdate(next(r))})}</span></div>
      <div class="col end"><b>${money(amt(r))}</b>${canWrite("recurring")?`<button type="button" class="linkbtn" data-act="recStop" data-id="${esc(r.id)}">${t("recStop")}</button>`:""}</div></div>`).join("")}</div>` : `<span class="hint">${t("recNone")}</span>`});
}
/* run after every full load (login, coming back to the app) */
const _loadAll0 = loadAll;
loadAll = async function(){ const ok = await _loadAll0(); if(ok) setTimeout(recurRun, 700); return ok; };
/* "repeat monthly" also on expense and income forms */
const _moneyForm0 = moneyForm;
moneyForm = function(kind, x, preset){ _moneyForm0(kind, x, preset); if(x){ const b = recurBtn(kind==="exp"?"exp":"inc", x.id); if(b) document.getElementById("sheetBody").insertAdjacentHTML("beforeend", `<div class="grid2">${b}</div>`); } };

/* ----- actions ----- */
Object.assign(A, {
  bcCam: id => bcCamera(code=>{ if(id==="pos" && POS){ const it = itemByCode(code); if(it && num(it.price)>0){ A.posAdd(it.id); beep(); toast(t("bcFound",{x:it.name})); } else bcUnknown(code); } else bcHandle(code); }),
  bcCamClose: () => bcCamClose(),
  bcGen: () => { const el = document.getElementById("f_barcode"); if(el){ el.value = genCode(); } },
  bcNew: id => { document.getElementById("toast").hidden = true; closeSheet(); itemForm(null); setTimeout(()=>{ const el = document.getElementById("f_barcode"); if(el) el.value = id; const n = document.getElementById("f_name"); if(n) n.focus(); }, 60); },
  scan: () => bcCamera(bcHandle),
  labels: id => { closeSheet(); labelsSheet(id||null); },
  imp: id => { closeSheet(); importSheet(id); },
  impKind: id => { if(IMPS){ IMPS.kind = id; IMPS.rows = null; } const o = document.getElementById("impOut"); if(o) o.innerHTML = ""; const f = document.getElementById("impFile"); if(f) f.value = ""; document.getElementById("sheetSave").disabled = true; },
  impTpl: () => impTemplate(),
  instPay: id => { const x = invById(id); if(!x) return; const r = instRows(x).find(z=>z.left>0.005); closeSheet(); voucherForm(null, {type:"receipt", partyId:x.partyId, invoiceId:x.id, amount:String(r ? r.left : r2(invCalc(x).total-invPaid(x)))}); },
  instWa: id => { const x = invById(id); if(x) openWaText((partyById(x.partyId)||{}).phone, instWaText(x)); },
  recMake: (id, el) => { closeSheet(); recMake(el.dataset.k, id); },
  recStop: async id => { const r = S.recurring.find(x=>x.id===id); if(!r) return; if(await save("recurring", id, {...strip(r), active:false}, true)){ toast(t("recStopped")); closeSheet(); render(); } },
  recurring: () => { closeSheet(); recurSheet(); },
});
document.addEventListener("change", e=>{
  if(e.target.id==="impFile" && e.target.files && e.target.files[0]) importRead(e.target.files[0]);
  if(e.target.name==="due") instVis();
  if(e.target.name==="ikind") A.impKind(e.target.value);
});
