/* =====================================================================
   Phone notifications: evening "today at a glance" (attendance, money in
   and out, bank, tomorrow's cheques), morning "due today", and news from
   the Daftar team. Sending happens on the server (Edge Function "push");
   the app only subscribes this device and keeps its choices.
   ===================================================================== */
Object.assign(L, {
  pushT:["الإشعارات","Notifications"], pushSub:["خلّي دفتر يحكيلك كل يوم شو صار وشو عليك، على تلفونك.","Let Daftar tell you every day what happened and what's due, on your phone."],
  pushOn:["شغّل الإشعارات","Turn on notifications"], pushOff:["وقّف الإشعارات على هالجهاز","Turn off on this device"], pushTest:["ابعتلي إشعار تجربة","Send me a test"],
  pushIsOn:["الإشعارات شغالة على هالجهاز","Notifications are on for this device"], pushIsOff:["الإشعارات مطفية على هالجهاز","Notifications are off on this device"],
  pushBlocked:["المتصفح مانع الإشعارات لدفتر. افتح إعدادات المتصفح ← الإشعارات، واسمح لـ daftarapp.co.","Your browser blocks Daftar's notifications. Open browser settings → Notifications and allow daftarapp.co."],
  pushNoSupport:["هالمتصفح ما بيدعم الإشعارات. جرّب Chrome على أندرويد، أو Safari على آيفون بعد ما تضيف دفتر عالشاشة الرئيسية.","This browser doesn't support notifications. Try Chrome on Android, or Safari on iPhone after adding Daftar to the home screen."],
  pushIos:["على الآيفون: افتح دفتر بـ Safari، اضغط زر المشاركة ← «إضافة إلى الشاشة الرئيسية»، وافتحه من الأيقونة، وبعدها شغّل الإشعارات من هون.","On iPhone: open Daftar in Safari, tap Share → Add to Home Screen, open it from the icon, then turn notifications on here."],
  pushEvening:["ملخص اليوم (الساعة 9 بالليل)","Today's summary (9 pm)"], pushEveningS:["مين داوم، شو دخل وطلع، شو انسحب من البنك، وشيكات بكرة","Who came, money in and out, bank, tomorrow's cheques"],
  pushMorning:["شو عليك اليوم (الساعة 8 الصبح)","Due today (8 am)"], pushMorningS:["شيكات وفواتير مستحقة، وموعد الضمان","Cheques and invoices due, social security date"],
  pushNews:["أخبار وميزات جديدة من دفتر","News and new features from Daftar"],
  pushRoleNote:["الملخصات المالية بتوصل لصاحب الشركة والمدير والمحاسب بس.","Money summaries go only to the owner, managers and accountants."],
  pushSaved:["تمام، الإشعارات شغالة","Done, notifications are on"], pushStopped:["وقفت الإشعارات على هالجهاز","Notifications stopped on this device"], pushSent:["انبعت. إذا ما وصل خلال دقيقة، تأكد إنه الإشعارات مسموحة لدفتر.","Sent. If it doesn't arrive in a minute, check that Daftar's notifications are allowed."],
  pushFail:["ما زبط، جرّب كمان مرة","That didn't work, try again"], pushAsk:["بدك يوصلك ملخص يومك على التلفون؟","Want today's summary on your phone?"], pushAskS:["مين داوم، شو دخل وطلع، وشو مستحق بكرة. كل مسا.","Who came, money in and out, and what's due tomorrow. Every evening."],
  pushLater:["مش هلأ","Not now"],
});
ICON.bell = '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>';

const pushOk = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && !!(window.APP_CONFIG||{}).VAPID_PUBLIC_KEY;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone===true;
const b64u = s => { const p = "=".repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g,"+").replace(/_/g,"/")); return Uint8Array.from(b, c=>c.charCodeAt(0)); };
async function pushReg(){ const r = await navigator.serviceWorker.getRegistration(); return r || navigator.serviceWorker.ready; }
async function pushCurrent(){ try{ if(!pushOk()) return null; const r = await pushReg(); return r ? await r.pushManager.getSubscription() : null; }catch(e){ return null; } }

async function pushEnable(prefs){
  if(!pushOk()) { toast(t("pushNoSupport")); return false; }
  const perm = Notification.permission==="granted" ? "granted" : await Notification.requestPermission();
  if(perm!=="granted"){ toast(t("pushBlocked")); return false; }
  try{
    const r = await pushReg();
    let sub = await r.pushManager.getSubscription();
    if(!sub) sub = await r.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64u(APP_CONFIG.VAPID_PUBLIC_KEY)});
    const j = sub.toJSON(), p = prefs || {morning:true, evening:true, news:true};
    const { error } = await sb.rpc("push_subscribe", {p_endpoint:j.endpoint, p_p256dh:j.keys.p256dh, p_auth:j.keys.auth, p_lang:LANG, p_morning:!!p.morning, p_evening:!!p.evening, p_news:!!p.news});
    if(error) throw error;
    lsSet("pushAsked", 1); return true;
  }catch(e){ toast(t("pushFail")); return false; }
}
async function pushDisable(){
  const sub = await pushCurrent(); if(!sub) return true;
  try{ await sb.rpc("push_unsubscribe", {p_endpoint:sub.endpoint}); }catch(e){}
  try{ await sub.unsubscribe(); }catch(e){}
  return true;
}
/* keep the server copy fresh after login (new company, new language, rotated keys) */
async function pushResync(){
  try{ if(!pushOk() || Notification.permission!=="granted") return; const sub = await pushCurrent(); if(!sub) return;
    const j = sub.toJSON(), { data } = await sb.rpc("push_mine", {p_endpoint:j.endpoint}); const p = data || {morning:true, evening:true, news:true};
    await sb.rpc("push_subscribe", {p_endpoint:j.endpoint, p_p256dh:j.keys.p256dh, p_auth:j.keys.auth, p_lang:LANG, p_morning:p.morning!==false, p_evening:p.evening!==false, p_news:p.news!==false}); }catch(e){}
}

async function pushSheet(){
  const sub = await pushCurrent(), on = !!sub && pushOk() && Notification.permission==="granted";
  let prefs = {morning:true, evening:true, news:true};
  if(on){ try{ const { data } = await sb.rpc("push_mine", {p_endpoint:sub.endpoint}); if(data) prefs = data; }catch(e){} }
  const blocked = pushOk() && Notification.permission==="denied";
  const ios = isIOS() && !isStandalone();
  const money = ["owner","member","manager","accountant"].includes(ROLE);
  const state = !pushOk() ? `<div class="alert warn">${icon("alert")}<span>${ios?t("pushIos"):t("pushNoSupport")}</span></div>`
    : blocked ? `<div class="alert bad">${icon("alert")}<span>${t("pushBlocked")}</span></div>`
    : `<div class="alert ${on?"good":"info"}">${icon(on?"check":"bell")}<span>${on?t("pushIsOn"):t("pushIsOff")}</span></div>`;
  const opts = [["evening","pushEvening","pushEveningS"],["morning","pushMorning","pushMorningS"],["news","pushNews",""]].filter(o=>money || o[0]==="news");
  openSheet({title:t("pushT"), noSave:true, html:`<p class="sub">${t("pushSub")}</p>${state}
    ${pushOk() && !blocked ? `<div class="checks">${opts.map(([k,l,s])=>`<label class="check"><input type="checkbox" name="p_${k}" ${prefs[k]!==false?"checked":""}><span><b>${t(l)}</b>${s?`<small class="sub">${t(s)}</small>`:""}</span></label>`).join("")}</div>
    ${money?"":`<p class="sub">${t("pushRoleNote")}</p>`}
    <div class="grid2"><button type="button" class="btn primary" data-act="pushSave">${icon("bell")}${t("pushOn")}</button>
    ${on?`<button type="button" class="btn" data-act="pushTest">${icon("send")}${t("pushTest")}</button><button type="button" class="btn ghost" data-act="pushStop">${t("pushOff")}</button>`:""}</div>` : ""}`});
}
const pushPrefsFromSheet = () => { const g = k => { const el = document.querySelector(`#sheetBody [name="p_${k}"]`); return el ? el.checked : (k==="news"); }; return {morning:g("morning"), evening:g("evening"), news:g("news")}; };

/* gentle one-time card on home for owners & managers */
function pushHomeCard(){
  if(!pushOk() || Notification.permission!=="default" || lsGet("pushAsked",0) || !["owner","manager","accountant","member"].includes(ROLE)) return "";
  if(!(S.staff.length || S.invoices.length || S.cheques.length || S.expenses.length)) return "";
  return `<div class="panel grow push-card"><span class="tx-ic">${icon("bell")}</span><div class="col"><b>${t("pushAsk")}</b><span class="sub">${t("pushAskS")}</span></div>
    <div class="row-btns"><button class="btn sm primary" data-act="pushQuick">${t("pushOn")}</button><button class="btn sm ghost" data-act="pushLater">${t("pushLater")}</button></div></div>`;
}

Object.assign(A, {
  push: () => { closeSheet(); pushSheet(); },
  pushSave: async () => { const ok = await pushEnable(pushPrefsFromSheet()); if(ok){ toast(t("pushSaved")); closeSheet(); pushSheet(); } },
  pushQuick: async () => { const ok = await pushEnable(); lsSet("pushAsked", 1); if(ok) toast(t("pushSaved")); render(); },
  pushLater: () => { lsSet("pushAsked", 1); render(); },
  pushStop: async () => { await pushDisable(); toast(t("pushStopped")); closeSheet(); pushSheet(); },
  pushTest: async () => { try{ const { error } = await sb.functions.invoke("push", {body:{mode:"test"}}); toast(error ? t("pushFail") : t("pushSent")); }catch(e){ toast(t("pushFail")); } },
});
