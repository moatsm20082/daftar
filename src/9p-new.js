
/* =====================================================================
   v23 «شو الجديد بدفتر»: once after an update, people who already use
   Daftar see what changed, with a button to try the voice right away.
   New sign-ups don't see it (everything is new to them).
   ===================================================================== */
Object.assign(L, {
  nwTitle:["شو الجديد بدفتر","What's new in Daftar"],
  nwVoiceT:["احكي مع دفتر","Talk to Daftar"], nwVoice:["احكيله شو صرفت أو قبضت أو شو ضل عندك، بيرد عليك بصوت وبيسجّل بعد ما تأكد.","Say what you spent, received or have left. It answers out loud and saves after you confirm."],
  nwTeamT:["الموظفين أسهل","Easier team page"], nwTeam:["ضيف موظف أو سلفة من نفس الصفحة بكبسة.","Add a worker or an advance right from the page."],
  nwInvT:["تحدّي الدعوات","Invite challenge"], nwInv:["ادعِ أصحاب الشغل، واللي بيدعي أكثر بيربح.","Invite other business owners; whoever invites the most wins."],
  nwSafeT:["بياناتك محمية","Your data is safe"], nwSafe:["نسخة احتياطية مشفّرة من كل البيانات كل ليلة.","An encrypted backup of all data every night."],
  nwGoogleT:["دخول بجوجل","Sign in with Google"], nwGoogle:["سجّل دخولك بحساب جوجل بدون كلمة سر.","Sign in with your Google account, no password."],
  nwSnapT:["صوّر ودفتر بيقرأ","Snap it, Daftar reads it"], nwSnap:["صوّر فاتورة أو وصل أو شيك، ودفتر بيعبّيلك كل إشي.","Snap a receipt, bill or cheque and Daftar fills it in."],
  nwLookT:["شكل جديد","A new look"], nwLook:["رئيسية جديدة، وزر + بالنص لكل إشي.","A new home and a + in the middle for everything."],
  nwVoice2T:["الصوت بيفهم زباينك","Voice knows your customers"], nwVoice2:["«قبضت من أبو أحمد مية»، «شو صار اليوم؟» وأكثر.","\"Got 100 from Abu Ahmad\", \"How was today?\" and more."],
  nwBellT:["إشعارات بوقتها","Timely notifications"], nwBell:["ملخص كل يوم، وتنبيه لما الدعم يرد عليك.","A daily summary, and a heads-up when support replies."],
  nwTry:["جرّب «صوّر» هلأ","Try «Snap» now"], nwOk:["تمام","Got it"],
  nwBatchT:["صوّر كذا ورقة، وكشف البنك","Many papers, and bank statements"], nwBatch:["صوّر لحد 10 وصولات مرة وحدة، أو صورة كشف البنك، وبتسجّلهم كلهم بكبسة.","Snap up to 10 receipts at once, or your bank statement, and save them all in one tap."],
  nwRemindT:["ذكّر الزبون بلطف","Polite reminders"], nwRemind:["زبون عليه مصاري؟ رسالة واتساب مهذبة جاهزة بكبسة، وكمان لما يرجع شيك.","A customer owes you? A polite WhatsApp message in one tap, also when a cheque bounces."],
  nwCashT:["سكّر الصندوق","Close the till"], nwCash:["عدّ الكاش آخر اليوم، ودفتر بيقلك إذا في نقص أو زيادة.","Count the cash at the end of the day; Daftar tells you if it's short or over."],
  nwWeekT:["أسبوعك بالصوت","Your week, read out"], nwWeek:["كل خميس دفتر بيحكيلك أسبوعك، وبينبهك إذا صرفت أكثر من العادي. واسأله: «كم دفعت لأبو خالد؟»","Every Thursday Daftar reads you your week and flags unusual spending. Ask it: \"How much did I pay Abu Khaled?\""],
});
const NW_VER = "27";
function nwSeen(){ try{ return localStorage.getItem("dnew")===NW_VER; }catch(e){ return true; } }
function nwMark(){ try{ localStorage.setItem("dnew", NW_VER); }catch(e){} }
function nwShow(){
  const live = Date.now() < Date.parse("2026-12-01T00:00:00+03:00");
  const it = (ic, k) => `<div class="nw-i"><span class="nw-ic">${icon(ic)}</span><div><b>${t(k+"T")}</b><span>${t(k)}</span></div></div>`;
  openSheet({ title:t("nwTitle"), noSave:true, html:`<div class="nw">
    ${it("grid","nwBatch")}${it("send","nwRemind")}${it("wallet","nwCash")}${it("mic","nwWeek")}${live?it("trophy","nwInv"):""}
    <div class="nw-act"><button type="button" class="btn primary" data-act="nwTry">${icon("camera")}${t("nwTry")}</button><button type="button" class="btn" data-act="nwOk">${t("nwOk")}</button></div></div>` });
  nwMark();
}
Object.assign(A, {
  nwOk: () => closeSheet(),
  nwTry: () => { closeSheet(); setTimeout(()=>{ if(A.snap) A.snap(); else if(typeof vxOpen==="function") vxOpen(); }, 120); },
});
/* who sees it: an owner with real data from before, in the app, with nothing else open */
(function(){
  let tries = 0;
  const iv = setInterval(() => {
    if(++tries > 240 || nwSeen()){ clearInterval(iv); return; }
    if(typeof S==="undefined" || S.screen!=="app" || !S.ready || window.DEMO_MODE) return;
    const sh = document.getElementById("sheet"), vx = document.getElementById("vx");
    if((sh && !sh.hidden) || (vx && !vx.hidden) || (typeof pushGateEl!=="undefined" && pushGateEl && !pushGateEl.hidden)) return;
    const used = activeUnits().length + (S.staff||[]).length + (S.expenses||[]).length + (S.income||[]).length;
    clearInterval(iv);
    if(used >= 3) setTimeout(nwShow, 900); else nwMark();   // brand-new accounts: nothing to announce
  }, 1000);
})();
