
/* =====================================================================
   v26
   - «صوّر» asks one quick question before the form: is it an invoice/receipt or a
     cheque, and did you pay or receive? Daftar's guess is already selected (from the
     names on the paper); one tap on «كمّل» when it's right.
   - The + menu has «ضيف عامل». Every worker card on the team page has edit and remove.
   - Daftar talks even when the iPhone is on silent (iOS 17+ audio session).
   ===================================================================== */
Object.assign(L, {
  pcTitle:["قريت الورقة","I read it"], pcWhat:["شو هاي؟","What is it?"], pcBill:["فاتورة أو وصل","Invoice or receipt"], pcCheque:["شيك","Cheque"],
  pcDir:["شو صار؟","Which way?"], pcPaid:["دفعت أنا","I paid"], pcGot:["قبضت أنا","I received"],
  pcChqIn:["وصلني (قبض)","I received it"], pcChqOut:["كتبته أنا (دفع)","I wrote it"],
  pcGo:["كمّل","Continue"], pcPick:["اختار شو صار عشان أكمّل.","Pick which way to continue."],
  pcGuess:["هيك فهمت من الورقة، غيّر إذا غلط.","That's my reading of the paper; change it if wrong."],
  qStaff:["ضيف عامل","Add worker"], qStaffSub:["موظف جديد","New team member"],
  stEdit:["تعديل","Edit"], stRemove:["شطب","Remove"], stRemoveQ:["تشطب {x}؟","Remove {x}?"],
  stRemoveTxt:["بيختفي من الفريق والدوام. حساباته وسلفه القديمة بتضل محفوظة بالتقارير.","They leave the team and attendance. Their past pay and advances stay in your reports."],
  stRemoved:["انشطب {x}","{x} removed"], stKeep:["لا، خلّيه","No, keep"],
});

ICON.edit = ICON.edit || '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M14 6l4 4"/>';
ICON.trash = ICON.trash || '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>';

/* ---------- «صوّر»: one question before the form ---------- */
const _phOpenReal = phOpen;
phOpen = async function(j, blob){
  if(!j || !["receipt","supplier_invoice","sales_invoice","cheque"].includes(j.kind)){ return _phOpenReal(j||{}, blob); }
  PC.j = j; PC.blob = blob; PC.kind = j.kind==="cheque" ? "cheque" : "bill"; PC.dir = j.dir || (j.kind==="sales_invoice" ? "in" : j.kind==="cheque" ? ((j.cheque||{}).dir||"in") : "out");
  PC.sure = !!j.dir_sure;
  pcSheet();
};
const PC = { j:null, blob:null, kind:"bill", dir:"out", sure:false, url:"" };
function pcSheet(){
  const j = PC.j, amt = PC.kind==="cheque" ? (j.cheque && j.cheque.amount) ?? j.total : j.total;
  try{ if(PC.url) URL.revokeObjectURL(PC.url); }catch(e){} PC.url = URL.createObjectURL(PC.blob);
  const chip = (grp, val, on, label, ic) => `<button type="button" class="pc-c ${on?"on":""}" data-act="pcSet" data-id="${grp}:${val}" aria-pressed="${on}">${icon(ic)}<b>${esc(label)}</b></button>`;
  const dirs = PC.kind==="cheque" ? [["in",t("pcChqIn"),"plus"],["out",t("pcChqOut"),"minus"]] : [["out",t("pcPaid"),"minus"],["in",t("pcGot"),"plus"]];
  openSheet({ title:t("pcTitle"), noSave:true, html:`<div class="pc">
    <div class="pc-top"><img src="${PC.url}" alt=""><div><b>${esc(j.reply||"")}</b>${amt!==undefined&&amt!==null?`<span class="pc-amt num">${esc(fmt(amt))} <span class="sub">${esc(j.currency||curName())}</span></span>`:""}<span class="sub">${t("pcGuess")}</span></div></div>
    <div class="pc-g"><span class="flabel">${t("pcWhat")}</span><div class="pc-row">${chip("kind","bill",PC.kind==="bill",t("pcBill"),"file")}${chip("kind","cheque",PC.kind==="cheque",t("pcCheque"),"bank")}</div></div>
    <div class="pc-g"><span class="flabel">${t("pcDir")}</span><div class="pc-row">${dirs.map(([v,l,ic])=>chip("dir",v,PC.dir===v,l,ic)).join("")}</div></div>
    <button type="button" class="btn primary big" data-act="pcGo">${t("pcGo")}</button></div>` });
}
Object.assign(A, {
  pcSet: id => { const [g, v] = String(id).split(":"); if(g==="kind") PC.kind = v==="cheque" ? "cheque" : "bill"; if(g==="dir") PC.dir = v==="in" ? "in" : "out"; pcSheet(); },
  pcGo: async () => {
    const j = { ...PC.j };
    if(PC.kind==="cheque"){
      const c = { ...(j.cheque||{}) }; if(c.amount===undefined || c.amount===null) c.amount = j.total;
      c.dir = PC.dir; j.cheque = c; j.kind = "cheque";
    } else {
      j.kind = PC.dir==="in" ? "sales_invoice" : (j.kind==="receipt" ? "receipt" : "supplier_invoice");
      if((j.total===undefined || j.total===null) && j.cheque) j.total = j.cheque.amount;
    }
    closeSheet();
    setTimeout(()=>_phOpenReal(j, PC.blob), 80);
  },
});

/* ---------- + menu: add a worker ---------- */
{ const _qs = quickSheet; quickSheet = function(){ _qs.apply(this, arguments);
    const g = document.querySelector("#sheetBody .qgrid"); if(!g || g.querySelector(".q-staff")) return;
    const snap = g.querySelector(".q-snap");
    const b = `<button type="button" class="qtile q-staff" data-act="qStaff">${icon("users")}<b>${esc(t("qStaff"))}</b><span>${esc(t("qStaffSub"))}</span></button>`;
    if(snap) snap.insertAdjacentHTML("afterend", b); else g.insertAdjacentHTML("afterbegin", b);
  }; }
Object.assign(A, { qStaff: () => { closeSheet(); setTimeout(()=>nvTeamAdd(), 80); } });

/* ---------- team: edit and remove on every card ---------- */
{ const _card = accountCard; accountCard = function(s, k){
    let h = _card.apply(this, arguments);
    if(S.view!=="team" || !s) return h;
    const btns = `<div class="st-acts"><button type="button" class="iconbtn sm" data-act="editStaff" data-id="${esc(s.id)}" aria-label="${t("stEdit")} ${esc(s.name)}">${icon("edit")}</button><button type="button" class="iconbtn sm st-del" data-act="stRemove" data-id="${esc(s.id)}" aria-label="${t("stRemove")} ${esc(s.name)}">${icon("trash")}</button></div>`;
    return h.replace('</div></div></div>\n    <div class="kv">', `</div></div>${btns}</div>\n    <div class="kv">`);
  }; }
Object.assign(A, {
  stRemove: id => { const s = staffById(id); if(!s) return;
    openSheet({ title:t("stRemoveQ",{x:s.name}), noSave:true, html:`<p class="sub">${t("stRemoveTxt")}</p><div class="two"><button type="button" class="btn danger big" data-act="stRemoveYes" data-id="${esc(s.id)}">${icon("trash")}${t("stRemove")}</button><button type="button" class="btn big" data-act="closeSheet">${t("stKeep")}</button></div>` }); },
  stRemoveYes: async id => { const s = staffById(id); if(!s) return; const ok = await save("staff", s.id, {...strip(s), active:false}); if(ok){ closeSheet(); toast(t("stRemoved",{x:s.name})); render(); } },
});

/* ---------- sound on silent (iPhone, iOS 17+) ----------
   «playback» plays through the speaker even with the silent switch on; while the mic
   is listening we need «play-and-record», then back to «playback» to answer. */
function vxSession(type){ try{ if(navigator.audioSession && navigator.audioSession.type !== type) navigator.audioSession.type = type; }catch(e){} }
{ const _l = vxListen; vxListen = function(){ vxSession("play-and-record"); return _l.apply(this, arguments); }; }
{ const _r = vrRelease; vrRelease = function(){ const x = _r.apply(this, arguments); vxSession("playback"); return x; }; }
{ const _o = vxOpen; vxOpen = function(){ vxSession("playback"); return _o.apply(this, arguments); }; }
{ const _c = vxClose; vxClose = function(){ const x = _c.apply(this, arguments); vxSession("auto"); return x; }; }
{ const _s = vxSpeak; vxSpeak = function(){ if(!VR.stream) vxSession("playback"); return _s.apply(this, arguments); }; }
