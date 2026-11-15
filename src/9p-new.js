
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
  nwTry:["جرّب الصوت هلأ","Try the voice now"], nwOk:["تمام","Got it"],
});
const NW_VER = "23";
function nwSeen(){ try{ return localStorage.getItem("dnew")===NW_VER; }catch(e){ return true; } }
function nwMark(){ try{ localStorage.setItem("dnew", NW_VER); }catch(e){} }
function nwShow(){
  const live = Date.now() < Date.parse("2026-12-01T00:00:00+03:00");
  const it = (ic, k) => `<div class="nw-i"><span class="nw-ic">${icon(ic)}</span><div><b>${t(k+"T")}</b><span>${t(k)}</span></div></div>`;
  openSheet({ title:t("nwTitle"), noSave:true, html:`<div class="nw">
    ${it("mic","nwVoice")}${it("users","nwTeam")}${live?it("trophy","nwInv"):""}${it("check","nwSafe")}${it("globe","nwGoogle")}
    <div class="nw-act"><button type="button" class="btn primary" data-act="nwTry">${icon("mic")}${t("nwTry")}</button><button type="button" class="btn" data-act="nwOk">${t("nwOk")}</button></div></div>` });
  nwMark();
}
Object.assign(A, {
  nwOk: () => closeSheet(),
  nwTry: () => { closeSheet(); setTimeout(()=>{ if(typeof vxOpen==="function") vxOpen(); }, 120); },
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
