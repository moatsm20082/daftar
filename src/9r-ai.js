
/* =====================================================================
   v24 Daftar sees and does more.
   - «صوّر»: a photo of a receipt, a supplier bill, a sales invoice or a cheque → Daftar
     reads it and opens the right form already filled in, with the photo attached.
     Nothing is saved until the owner taps save.
   - The voice understands customers and suppliers: «قبضت من أبو أحمد مية»,
     «دفعت لأبو خالد ميتين»، «بعت لأبو أحمد بمية على الحساب», a cheque by voice,
     and questions like «شو صار اليوم؟» and «مين إلي عنده مصاري؟».
   ===================================================================== */
Object.assign(L, {
  phT:["صوّر ودفتر بيقرأ","Snap it, Daftar reads it"], phSub:["فاتورة، وصل، فاتورة مورّد أو شيك. دفتر بيقرأها وبيعبّيلك كل إشي، وإنت بتأكد.","A receipt, a supplier bill or a cheque. Daftar reads it and fills everything in; you confirm."],
  phCam:["صوّر هلأ","Take a photo"], phGal:["اختار من الصور","Choose a photo"], phReading:["عم بقرأ الصورة…","Reading the photo…"],
  phOther:["ما عرفت شو هاي الصورة. صوّر فاتورة أو وصل أو شيك، وخلي الكتابة واضحة.","I couldn't tell what this is. Snap a receipt, bill or cheque with the text clear."],
  phFail:["ما زبطت قراءة الصورة. جرّب صورة أوضح، أو عبّي الفورم بإيدك.","Couldn't read the photo. Try a clearer one, or fill the form yourself."],
  phDemo:["بالنسخة التجريبية الصور ما بتنقرأ. اعمل حساب ببلاش وجرّبها.","Photos aren't read in the demo. Create a free account to try it."],
  phNoUnit:["أول إشي اعمل {unit}، وبعدها صوّر.","Create a {unit} first, then snap."],
  phOnCheque:["على الشيك: {x}","On the cheque: {x}"], phCheck:["تأكد من الأرقام قبل ما تحفظ.","Check the numbers before saving."],
  phTile:["صوّر","Snap"], phTileSub:["فاتورة أو شيك","Bill or cheque"],
  vxRec:["قبض","Received"], vxPayP:["دفع","Paid"], vxSale:["فاتورة بيع","Sale"], vxNewParty:["جديد","new"], vxNoParty:["مين؟","Who?"],
  vxChq:["شيك","cheque"], vxSummary:["ملخص","Summary"], vxOwedMe:["إلك عند الناس","Owed to you"], vxIOwe:["عليك للموردين","You owe"],
  vxSumTxt:["{p}: دخلك {i}، مصاريفك {e}، {r} {x}.","{p}: in {i}, out {e}, {r} {x}."],
  vxOwedTxt:["إلك عند الناس {x}{w}.","People owe you {x}{w}."], vxIOweTxt:["عليك للموردين {x}{w}.","You owe suppliers {x}{w}."], vxTop:[" — أكثرهم {n}"," — most: {n}"],
});

/* ---------- the voice knows your customers and suppliers ---------- */
{ const _ctx = vxContext; vxContext = function(){ const c = _ctx.apply(this, arguments);
    c.parties = (S.parties||[]).filter(p=>!p.archived && !p.walkIn).slice(0,150).map(p=>({id:p.id, name:p.name}));
    c.company = (COMPANY && COMPANY.name) || "";
    return c; }; }
function vxParty(a, side){
  const ps = (S.parties||[]).filter(p=>!p.archived && !p.walkIn), want = vxNorm(a.party);
  return ps.find(p=>p.id===a.party_id) || (want ? ps.find(p=>vxNorm(p.name)===want) || ps.find(p=>{ const n = vxNorm(p.name); return n && (n.includes(want) || want.includes(n)); }) : null);
}
async function vxEnsureParty(p, name, side){
  if(p) return p.id; if(!name) return null;
  const id = newId(); const ok = await save("parties", id, {name:String(name).slice(0,100), kind:side==="sale"?"customer":"supplier", openBal:0, createdAt:Date.now(), voice:true}, true);
  return ok ? id : null;
}
function vxMonthEnd(){ return monthEnd(monthStartOf(today())); }
{ const _row = vxRow; vxRow = function(a){
    if(!a || typeof a!=="object") return null;
    const amt = Math.round(num(a.amount)*1000)/1000, date = vxDate(a.date);
    if(a.type==="receipt" || a.type==="payment"){
      const side = a.type==="receipt" ? "sale" : "purchase", p = vxParty(a, side), name = p ? p.name : String(a.party||"").trim().slice(0,100);
      const method = ["cash","cheque","transfer","card"].includes(a.method) ? a.method : "cash";
      const due = /^\d{4}-\d{2}-\d{2}$/.test(a.due_date||"") ? a.due_date : (method==="cheque" ? date : "");
      const ok = !!name && amt>0;
      return { kind:a.type, on:ok, ok, tag:t(a.type==="receipt"?"vxRec":"vxPayP"),
        label:`${esc(name||t("vxNoParty"))}${p||!name?"":` <span class="sub">(${t("vxNewParty")})</span>`} · <b class="num">${esc(moneyTxt(amt))}</b>${method==="cheque"?` · ${t("vxChq")}${a.cheque_no?` <span class="num">${esc(String(a.cheque_no).slice(0,30))}</span>`:""}`:""}${vxDateTxt(date)}`,
        note: !name ? t("vxNoParty") : amt>0 ? "" : t("vxNoAmount"),
        run: async () => { const pid = await vxEnsureParty(p, name, side); if(!pid) return false;
          return saveVoucher({type:a.type==="receipt"?"receipt":"payment", partyId:pid, amount:amt, date, method, chNo:String(a.cheque_no||"").slice(0,30), chBank:"", chDue:due, note:t("vxVoiceNote")}, true); } };
    }
    if(a.type==="sale"){
      const p = vxParty(a, "sale"), name = p ? p.name : String(a.party||"").trim().slice(0,100);
      const qty = num(a.qty)>0 ? Math.round(num(a.qty)*1000)/1000 : 1, price = num(a.price)>0 ? num(a.price) : (qty>0 ? amt/qty : amt);
      const total = Math.round(qty*price*1000)/1000, desc = String(a.desc||a.item||"").trim().slice(0,120) || t("vxSale");
      const ok = !!name && total>0;
      return { kind:"sale", on:ok, ok, tag:t("vxSale"),
        label:`${esc(name||t("vxNoParty"))}${p||!name?"":` <span class="sub">(${t("vxNewParty")})</span>`} · ${esc(desc)} · <b class="num">${esc(moneyTxt(total))}</b>${vxDateTxt(date)}`,
        note: !name ? t("vxNoParty") : total>0 ? "" : t("vxNoAmount"),
        run: async () => { const pid = await vxEnsureParty(p, name, "sale"); if(!pid) return false;
          const it = typeof itemByName==="function" ? itemByName(desc) : null;
          const data = {createdAt:Date.now(), no:nextNo("invoices", INV_PFX.sale), type:"sale", partyId:pid, date, dueDate:date,
            lines:[{...(it?{itemId:it.id}:{}), name:desc, qty, price:Math.round(price*1000)/1000, tax:0, disc:0}], storeId:MAIN_STORE, incTax:false, discount:0, notes:"", supInvNo:"", unitId:"", srcId:"", voice:true};
          data.total = invCalc(data).total;
          return save("invoices", null, data, true); } };
    }
    if(a.type==="ask" && ["summary","owed_to_me","i_owe"].includes(a.metric)){
      const m = a.metric;
      if(m==="summary"){
        const td = today(), per = a.period || "today";
        const [x, y] = per==="today" ? [td, td] : per==="week" ? [iso(new Date(parseD(td).getTime()-6*864e5)), td] : per==="last_month" ? [addMonths(monthStartOf(td),-1), monthEnd(addMonths(monthStartOf(td),-1))] : [monthStartOf(td), td];
        const T = companyTotals(x, y), pl = t({today:"vxToday", week:"vxWeek", month:"vxMonth", last_month:"vxLastMonth"}[per]||"vxToday");
        const answer = t("vxSumTxt",{p:pl, i:moneyTxt(Math.round(T.inc)), e:moneyTxt(Math.round(T.exp+T.lab)), r:T.profit<0?t("loss"):t("profit"), x:moneyTxt(Math.round(Math.abs(T.profit)))});
        return { kind:"ask", on:false, ok:true, tag:t("vxSummary"), label:`<b class="num">${esc(moneyTxt(Math.round(T.profit)))}</b> · ${esc(pl)}`, answer };
      }
      const want = m==="owed_to_me" ? ["customer","both"] : ["supplier","both"];
      const list = (S.parties||[]).filter(p=>!p.archived && want.includes(p.kind||"customer")).map(p=>[p, partyBal(p.id)]).filter(([,b])=> m==="owed_to_me" ? b>0.005 : b<-0.005);
      const tot = list.reduce((s,[,b])=>s+Math.abs(b), 0), top = list.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]))[0];
      const w = top ? t("vxTop",{n:`${top[0].name} ${moneyTxt(Math.round(Math.abs(top[1])))}`}) : "";
      const answer = t(m==="owed_to_me"?"vxOwedTxt":"vxIOweTxt",{x:moneyTxt(Math.round(tot)), w});
      return { kind:"ask", on:false, ok:true, tag:t(m==="owed_to_me"?"vxOwedMe":"vxIOwe"), label:`<b class="num">${esc(moneyTxt(Math.round(tot)))}</b>`, answer };
    }
    return _row.apply(this, arguments);
  }; }
Object.assign(L, { vxVoiceNote:["بالصوت","by voice"] });

/* ---------- «صوّر» ---------- */
function phPickSheet(){
  openSheet({ title:t("phT"), noSave:true, html:`<div class="ph-pick"><p class="sub">${t("phSub")}</p>
    <label class="btn primary big">${icon("camera")}${t("phCam")}<input type="file" id="phCam" accept="image/*" capture="environment" hidden></label>
    <label class="btn big">${icon("file")}${t("phGal")}<input type="file" id="phGal" accept="image/*" hidden></label></div>` });
}
document.addEventListener("change", e => { const el = e.target; if(el && (el.id==="phCam" || el.id==="phGal") && el.files && el.files[0]) phGo(el.files[0]); });
async function phGo(file){
  if(window.DEMO_MODE){ closeSheet(); toast(t("phDemo")); return; }
  const blob = await shrinkImage(file);
  if(!blob){ toast(t("attImgFail")); return; }
  const url = URL.createObjectURL(blob);
  openSheet({ title:t("phReading"), noSave:true, html:`<div class="ph-read"><img src="${url}" alt=""><span class="ph-scan"></span></div>` });
  let j = null;
  try{
    (window.dtrack||function(){})("photo_read");
    const b64 = await new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(String(f.result).split(",")[1]||""); f.onerror = rej; f.readAsDataURL(blob); });
    const ctl = new AbortController(); const to = setTimeout(()=>ctl.abort(), 45000);
    const r = await vxCall({ mode:"photo", image:b64, ctx:vxContext() }, ctl.signal); clearTimeout(to);
    j = await r.json().catch(()=>null);
    if(!r.ok){ closeSheet(); toast(j && j.err==="limit" ? t("vxLimit") : t("phFail")); return; }
  }catch(e){ closeSheet(); toast(t("phFail")); return; }
  closeSheet();
  await phOpen(j || {}, blob);
}
function phAttach(blob){
  try{ FILES.add.push({blob, type:"image/jpeg", name:"photo-"+today()+".jpg", size:blob.size, url:URL.createObjectURL(blob)}); FILES.refresh(); }catch(e){}
}
async function phOpen(j, blob){
  const k = j.kind;
  if(k==="cheque" && j.cheque){
    const c = j.cheque, type = c.dir==="out" ? "payment" : "receipt", who = c.dir==="out" ? c.payee : (c.drawer || c.payee);
    const p = vxParty({party:who||j.merchant}, type==="receipt"?"sale":"purchase");
    voucherForm(null, {type, amount:c.amount ?? j.total, partyId:p ? p.id : ""});
    setTimeout(()=>{
      const m = document.querySelector('#sheetBody [name="method"][value="cheque"]'); if(m){ m.checked = true; }
      if(typeof chFieldsVis==="function") chFieldsVis();
      const set = (n, v) => { const el = document.getElementById("f_"+n); if(el && v) el.value = v; };
      set("chNo", c.number); set("chDue", c.due_date); set("chBank", c.bank);
      const top = document.getElementById("sheetBody");
      if(top) top.insertAdjacentHTML("afterbegin", `<div class="alert info ph-note">${icon("camera")}<span>${esc(j.reply||"")}${who && !p ? " · "+esc(t("phOnCheque",{x:who})) : ""}<br><span class="sub">${t("phCheck")}</span></span></div>`);
    }, 60);
    return;
  }
  if(k==="receipt" || k==="supplier_invoice" || k==="sales_invoice"){
    if(!activeUnits().length){ if(typeof ensureFirstUnit==="function") await ensureFirstUnit(); }
    if(!activeUnits().length){ toast(tv("phNoUnit")); return; }
    const inc = k==="sales_invoice";
    const items = (j.items||[]).slice(0,4).map(x=>x.name).join("، ");
    const note = [j.merchant, items].filter(Boolean).join(" · ").slice(0,160);
    moneyForm(inc?"inc":"exp", null, {amount:j.total, note, supplier:inc?"":j.merchant, date:j.date && j.date<=today() ? j.date : today(), category:inc?undefined:j.category});
    setTimeout(()=>{
      phAttach(blob);
      const inv = document.getElementById("f_invNo"); if(inv && j.invoice_no) inv.value = j.invoice_no;
      const top = document.getElementById("sheetBody");
      if(top) top.insertAdjacentHTML("afterbegin", `<div class="alert info ph-note">${icon("camera")}<span>${esc(j.reply||"")}<br><span class="sub">${t("phCheck")}</span></span></div>`);
    }, 60);
    return;
  }
  toast(t("phOther"));
}
Object.assign(A, {
  snap: () => { closeSheet(); phPickSheet(); },
});
/* the quick menu and the voice screen get «صوّر» */
const phTile = () => `<button type="button" class="qtile q-snap" data-act="snap">${icon("camera")}<b>${esc(t("phTile"))}</b><span>${esc(t("phTileSub"))}</span></button>`;
quickSheet = function(){ openSheet({title:t("whatAdd"), noSave:true, html:`<div class="qgrid">${phTile()}${quickTiles()}</div>`}); };
{ const _q = A.q; A.q = function(id){ if(id==="snap"){ closeSheet(); phPickSheet(); return; } return _q.apply(this, arguments); }; }
{ const _r = vxRender; vxRender = function(){ _r.apply(this, arguments);
    const w = document.getElementById("vx"); if(!w || !VX.open || window.DEMO_MODE) return;
    const box = w.querySelector(".vx-tr"); if(!box || box.querySelector('[data-vx="snap"]')) return;
    box.insertAdjacentHTML("afterbegin", `<button type="button" class="iconbtn vx-snap" data-vx="snap" aria-label="${t("phTile")}">${icon("camera")}</button>`);
  }; }
{ const _a = vxAct; vxAct = function(a, el){ if(a==="snap"){ vxClose(); setTimeout(phPickSheet, 80); return; } return _a.apply(this, arguments); }; }
