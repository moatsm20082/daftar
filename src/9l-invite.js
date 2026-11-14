
/* =====================================================================
   v19 invite contest: "invite a friend and win".
   - Every business has a 6-letter invite code. Sharing opens WhatsApp with a ready
     message (link + code).
   - A new business is credited to whoever invited it: automatically from the link
     (?ref=CODE, same device), or by typing the code in its first 14 days.
   - A referral only counts once the new business confirmed its email and recorded
     3 things (server decides, see v19-invite.sql), so fake sign-ups don't count.
   ===================================================================== */
Object.assign(L, {
  ivTitle:["تحدّي دفتر 🏆","The Daftar challenge 🏆"],
  ivSub:["ادعِ أصحاب المحلات والمشاريع يسجّلوا بدفتر. اللي بيجيب أكثر شركات بيربح {p1}، والثاني بيربح {p2}.","Invite business owners to Daftar. Whoever brings the most businesses wins {p1}; second place wins {p2}."],
  ivEnds:["التحدي بيخلص {d}","The challenge ends {d}"],
  ivCount:["دعواتك المحسوبة: {v}","Your counted invites: {v}"], ivRank:["ترتيبك: {r} من {n}","Your rank: {r} of {n}"],
  ivPending:["{x} سجّلوا من دعوتك وبيستنّوا يكمّلوا","{x} signed up from your invite and still need to finish"],
  ivNone:["لسا ما حدا سجّل من دعوتك. ابعتها لأول واحد هلأ!","Nobody has joined from your invite yet. Send it to someone now!"],
  ivSend:["ادعِ على واتساب","Invite on WhatsApp"], ivMore:["التفاصيل","Details"],
  ivYourCode:["كود دعوتك","Your invite code"], ivCopy:["انسخ الكود","Copy code"], ivCopyLink:["انسخ الرابط","Copy link"],
  ivHow:["كيف بتنحسب الدعوة؟","How does an invite count?"],
  ivRule1:["صاحبك بيسجّل من رابطك، أو بيكتب كودك بعد ما يسجّل.","Your friend signs up from your link, or types your code after signing up."],
  ivRule2:["بتنحسب لما يأكّد إيميله ويسجّل 3 حركات (مصروف، دخل، فاتورة…).","It counts once they confirm their email and record 3 things (expense, income, invoice…)."],
  ivRule3:["الحسابات الوهمية ما بتنحسب. اللي بيجيب أكثر شركات حقيقية بيربح.","Fake accounts don't count. The most real businesses wins."],
  ivPrizes:["الجوائز","Prizes"], ivFirst:["الأول","1st"], ivSecond:["الثاني","2nd"],
  ivReferrer:["دلّك على دفتر: {x}","Invited you to Daftar: {x}"],
  ivClaimQ:["حدا دلّك على دفتر؟","Did someone invite you to Daftar?"], ivClaimBtn:["اكتب كوده","Enter their code"],
  ivClaimT:["كود الدعوة","Invite code"], ivClaimL:["اكتب كود صاحبك (6 حروف وأرقام)","Type your friend's code (6 letters and numbers)"],
  ivClaimSave:["أكّد","Confirm"], ivClaimed:["تمام! انحسبت دعوة لـ {x} 🎉","Done! Counted as {x}'s invite 🎉"],
  ivErrNotFound:["الكود مش صحيح. تأكّد منه وجرّب مرة ثانية.","That code isn't right. Check it and try again."],
  ivErrAlready:["إنت مسجّل أصلاً من دعوة.","You're already linked to an invite."], ivErrLate:["الكود بينكتب بأول 14 يوم بس.","Codes can only be entered in your first 14 days."],
  ivErrSelf:["ما بتقدر تكتب كودك إنت.","You can't use your own code."],
  ivMsg:["جرّبت تطبيق دفتر لحسابات الشغل، مجاني وعربي 👌 بيحسبلك المصاريف والربح والديون والرواتب من التلفون.\n\nنزّله من هون: {link}\n\nولما تسجّل، اكتب كود الدعوة: {code}",
         "I've been using Daftar for my business accounts. It's free and simple 👌 expenses, profit, debts and payroll from your phone.\n\nGet it here: {link}\n\nWhen you sign up, enter invite code: {code}"],
  madeWith:["اتعمل بدفتر، تطبيق حسابات مجاني","Made with Daftar, the free accounting app"],
  sentWith:["أُرسلت من دفتر، تطبيق حسابات مجاني · daftarapp.co","Sent with Daftar, the free accounting app · daftarapp.co"],
});
if(!ICON.copy) ICON.copy = '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>';
if(!ICON.trophy) ICON.trophy = '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>';

/* the code from an invite link is remembered on this device until it's used */
(function(){
  try{
    const u = new URL(location.href), r = (u.searchParams.get("ref")||"").replace(/[^A-Za-z0-9]/g,"").toUpperCase();
    if(r.length===6){ localStorage.setItem("dref", r); u.searchParams.delete("ref"); history.replaceState(null, "", u.pathname + (u.search||"") + u.hash); }
  }catch(e){}
})();

let IVS = null, invBusy = false, invFor = null;
async function invLoad(force){
  if(window.DEMO_MODE || !sb || !CID || invBusy) return;
  if(!force && IVS && invFor===CID) return;
  invBusy = true;
  try{
    const { data, error } = await sb.rpc("my_invite");
    if(!error && data){ IVS = data; invFor = CID; await invAutoClaim(); if(S.screen==="app" && S.view==="home" && overlaysClosed()) render(); }
  }catch(e){} finally { invBusy = false; }
}
async function invAutoClaim(){
  let r = null; try{ r = localStorage.getItem("dref"); }catch(e){}
  if(!r || !IVS) return;
  if(!IVS.can_claim || r===IVS.code){ try{ localStorage.removeItem("dref"); }catch(e){} return; }
  const { data } = await sb.rpc("claim_referrer", {p_code:r});
  try{ localStorage.removeItem("dref"); }catch(e){}
  if(data && data.ok){ IVS.referrer = data.name; IVS.can_claim = false; toast(t("ivClaimed",{x:data.name})); }
}
setInterval(()=>{ if(S.screen==="app" && S.ready && CID && (!IVS || invFor!==CID)) invLoad(); if(!CID){ IVS = null; invFor = null; } }, 2000);

const invLink = () => `${SITE}/app/?ref=${IVS.code}`;
const ivDate = d => { try{ return new Date(d).toLocaleDateString(LANG==="en"?"en-GB":"ar-JO-u-nu-latn", {day:"numeric", month:"long"}); }catch(e){ return ""; } };

function inviteHomeCard(){
  if(!IVS || !IVS.active) return "";
  const v = IVS.valid||0, pend = Math.max(0,(IVS.invited||0)-v);
  const stat = v ? `<b>${t("ivCount",{v})}</b>${IVS.rank?` · <span>${t("ivRank",{r:IVS.rank, n:IVS.participants})}</span>`:""}`
                 : `<span class="sub">${t("ivNone")}</span>`;
  const claim = IVS.can_claim && !IVS.referrer ? `<button type="button" class="linkbtn iv-claim" data-act="invClaim">${t("ivClaimQ")} <u>${t("ivClaimBtn")}</u></button>` : "";
  return `<div class="panel iv-card">
    <div class="iv-head"><span class="iv-ic">${icon("trophy")}</span><div class="col"><b class="iv-t">${t("ivTitle")}</b><span class="sub">${t("ivSub",{p1:esc(IVS.prize1||""), p2:esc(IVS.prize2||"")})}</span></div></div>
    <div class="iv-stat"><div>${stat}</div>${pend?`<span class="sub">${t("ivPending",{x:pend})}</span>`:""}</div>
    <div class="two"><button type="button" class="btn primary" data-act="invSend">${icon("send")}${t("ivSend")}</button><button type="button" class="btn" data-act="invInfo">${t("ivMore")}</button></div>
    ${claim}<span class="sub iv-ends">${t("ivEnds",{d:ivDate(IVS.ends)})}</span></div>`;
}

/* the home page shows the card right under the greeting */
{ const _viewHome = viewHome; viewHome = function(){
    const h = _viewHome.apply(this, arguments), card = inviteHomeCard();
    if(!card) return h;
    const i = h.indexOf('<div class="phead">'); if(i<0) return card + h;
    const j = h.indexOf("</div></div>", i); return j<0 ? card + h : h.slice(0, j+12) + card + h.slice(j+12);
  }; }

Object.assign(A, {
  invSend: () => { if(!IVS) return; try{ (window.dtrack||function(){})("invite_send"); }catch(e){} openWa(t("ivMsg",{link:invLink(), code:IVS.code})); },
  invCopyCode: (_, el) => IVS && copyText(IVS.code, el),
  invCopyLink: (_, el) => IVS && copyText(invLink(), el),
  invInfo: () => {
    if(!IVS) return;
    const pend = Math.max(0,(IVS.invited||0)-(IVS.valid||0));
    openSheet({ title:t("ivTitle"), noSave:true, html:`<div class="iv-sheet">
      <div class="iv-code"><span class="sub">${t("ivYourCode")}</span><b dir="ltr">${esc(IVS.code)}</b>
        <div class="two"><button type="button" class="btn" data-act="invCopyCode">${icon("copy")}${t("ivCopy")}</button><button type="button" class="btn" data-act="invCopyLink">${icon("copy")}${t("ivCopyLink")}</button></div></div>
      <button type="button" class="btn primary big" data-act="invSend">${icon("send")}${t("ivSend")}</button>
      <div class="iv-stat"><div>${IVS.valid?`<b>${t("ivCount",{v:IVS.valid})}</b>${IVS.rank?` · ${t("ivRank",{r:IVS.rank, n:IVS.participants})}`:""}`:`<span class="sub">${t("ivNone")}</span>`}</div>${pend?`<span class="sub">${t("ivPending",{x:pend})}</span>`:""}</div>
      <div><b>${t("ivPrizes")}</b><ul class="iv-list"><li>${t("ivFirst")}: ${esc(IVS.prize1||"")}</li><li>${t("ivSecond")}: ${esc(IVS.prize2||"")}</li></ul></div>
      <div><b>${t("ivHow")}</b><ul class="iv-list"><li>${t("ivRule1")}</li><li>${t("ivRule2")}</li><li>${t("ivRule3")}</li></ul></div>
      <span class="sub">${t("ivEnds",{d:ivDate(IVS.ends)})}</span>
      ${IVS.referrer?`<span class="sub">${t("ivReferrer",{x:esc(IVS.referrer)})}</span>`:""}
      ${IVS.can_claim && !IVS.referrer?`<button type="button" class="linkbtn iv-claim" data-act="invClaim">${t("ivClaimQ")} <u>${t("ivClaimBtn")}</u></button>`:""}</div>` });
  },
  invClaim: () => {
    openSheet({ title:t("ivClaimT"), saveLabel:t("ivClaimSave"),
      fields:[{name:"code", label:t("ivClaimL"), type:"text", required:true}],
      submit: async v => {
        const c = String(v.code||"").replace(/[^A-Za-z0-9]/g,"").toUpperCase();
        if(c.length!==6){ toast(t("ivErrNotFound")); return false; }
        const { data, error } = await sb.rpc("claim_referrer", {p_code:c});
        if(error || !data){ toast(t("eGeneric")); return false; }
        if(!data.ok){ toast(t({already:"ivErrAlready", too_late:"ivErrLate", self:"ivErrSelf"}[data.err]||"ivErrNotFound")); return data.err==="already"; }
        toast(t("ivClaimed",{x:data.name})); IVS.referrer = data.name; IVS.can_claim = false; invLoad(true); render(); return true;
      } });
    setTimeout(()=>{ const i = document.querySelector('#sheetBody [name="code"]'); if(i){ i.setAttribute("autocapitalize","characters"); i.setAttribute("dir","ltr"); i.setAttribute("maxlength","8"); i.focus(); } }, 90);
  },
});
