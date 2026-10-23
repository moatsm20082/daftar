/* ===== auth screens (one calm card) ===== */
function authShell(title, sub, form, foot=""){
  return `<div class="auth"><div class="auth-top"><span></span><button class="btn ghost sm" data-act="lang">${t("otherLang")}</button></div>
    <div class="auth-logo">${MARK}<b>${esc(t("appName"))}</b></div>
    <div class="auth-card"><h1 class="atitle">${title}</h1>${sub?`<p class="sub">${sub}</p>`:""}
      ${S.authMsg?`<div class="msg ${S.authMsgType||""}" role="status">${esc(S.authMsg)}</div>`:""}${form}</div>
    ${foot?`<div class="auth-foot">${foot}</div>`:""}
    <button class="help-link" data-act="support">${t("helpLogin")}</button></div>`;
}
const inp = (id,label,type,attrs="") => `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${attrs}></div>`;
const pwInp = (id,label,auto) => `<div class="field"><label for="${id}">${label}</label><div class="pw"><input id="${id}" name="${id}" type="password" dir="ltr" autocomplete="${auto}" minlength="8" required><button type="button" class="pw-eye" data-act="eye" data-id="${id}" aria-label="${t("showPw")}">${t("showPw")}</button></div></div>`;
const selectF = (name,label,opts,val) => `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===val?"selected":""}>${esc(l)}</option>`).join("")}</select></div>`;
const emailInp = () => inp("email",t("email"),"email",'autocomplete="email" inputmode="email" required dir="ltr"');
function authView(){
  const scr = S.screen;
  if(scr==="loading") return `<div class="splash">${MARK}<b>${esc(t("appName"))}</b></div>`;
  if(scr==="config") return `<div class="auth"><div class="auth-card"><b>${t("configMissing")}</b><p class="sub">${t("configMissingSub")}</p></div></div>`;
  if(scr==="signup") return authShell(S.invite ? t("joinTitle") : t("signup"), S.invite ? t("joinSub",{c:`<b class="ltr">${esc(S.invite)}</b>`}) : t("signupSub"),
    `<form data-form="signup" class="aform" novalidate>${S.invite ? `<input type="hidden" name="invite" value="${esc(S.invite)}">` : inp("company",t("companyName"),"text",'autocomplete="organization" required maxlength="80"')}
     ${emailInp()}${pwInp("password",t("pw8"),"new-password")}
     <button class="btn primary big" type="submit">${t("create")}</button>
     <p class="fine">${t("agree")} <a href="privacy.html" target="_blank" rel="noopener">${t("privacy")}</a></p></form>`,
    `${t("haveAccountQ")} <button class="linkbtn" data-act="goto" data-id="login">${t("login")}</button><br>${S.invite ? `<button class="linkbtn" data-act="dropInvite">${t("noInviteNew")}</button>` : `<button class="linkbtn" data-act="haveCode">${t("haveCode")}</button>`}`);
  if(scr==="code") return authShell(t("joinTitle"), t("codeEnterSub"),
    `<form data-form="entercode" class="aform" novalidate>${inp("code",t("inviteCode"),"text",'autocomplete="off" autocapitalize="characters" maxlength="12" dir="ltr" class="otp-in" required')}<button class="btn primary big" type="submit">${t("cont")}</button></form>`,
    `<button class="linkbtn" data-act="goto" data-id="signup">${t("backLogin")}</button>`);
  if(scr==="forgot") return authShell(t("forgot"), t("forgotSub"),
    `<form data-form="forgot" class="aform" novalidate>${emailInp()}<button class="btn primary big" type="submit">${t("sendCode")}</button></form>`,
    `<button class="linkbtn" data-act="goto" data-id="login">${t("backLogin")}</button>`);
  if(scr==="sent") return authShell(t("codeTitle"), t("codeSub",{e:`<b class="ltr">${esc(S.sentTo||"")}</b>`}),
    `<form data-form="otp" class="aform" novalidate><div class="field"><label for="otp">${t("codeLabel")}</label><input id="otp" name="otp" class="otp-in" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="10" dir="ltr" required></div>
     <button class="btn primary big" type="submit">${t("codeGo")}</button></form>
     <p class="hint center">${t("codeTip")}</p>
     ${S.sentKind==="reset"?"":`<p class="hint center">${t("codeLink")}</p>`}
     <button class="btn" data-act="resend">${t("resend")}</button>`,
    `<button class="linkbtn" data-act="goto" data-id="login">${t("backLogin")}</button>`);
  if(scr==="gate") return gateView();
  if(scr==="reset") return authShell(t("newPw"), t("newPwSub"),
    `<form data-form="reset" class="aform" novalidate>${pwInp("password",t("pw8"),"new-password")}<button class="btn primary big" type="submit">${t("savePw")}</button></form>`);
  if(scr==="nocompany") return authShell(t("companyName"), t("lastStep"),
    `<form data-form="company" class="aform" novalidate>${inp("company",t("companyName"),"text",'required maxlength="80"')}<button class="btn primary big" type="submit">${t("cont")}</button></form>
     <div class="or"><span>${t("orJoin")}</span></div>
     <form data-form="joincode" class="aform" novalidate>${inp("code",t("inviteCode"),"text",'autocomplete="off" autocapitalize="characters" maxlength="12" dir="ltr" class="otp-in"')}<button class="btn big" type="submit">${t("joinBtn")}</button></form>`,
    `<button class="linkbtn" data-act="logout">${t("logout")}</button>`);
  if(scr==="onboard") return onboardView();
  return authShell(t("login"), t("loginSub"),
    `<form data-form="login" class="aform" novalidate>${emailInp()}${pwInp("password",t("password"),"current-password")}
     <button class="btn primary big" type="submit">${t("enter")}</button>
     <button type="button" class="linkbtn center" data-act="goto" data-id="forgot">${t("forgotQ")}</button></form>`,
    `${t("noAccountQ")} <button class="linkbtn" data-act="goto" data-id="signup">${t("signupShort")}</button>`);
}
/* first-run: choose your line of business */
function onboardView(){
  const sel = S.obType || "contracting";
  return `<div class="auth wide"><div class="auth-logo">${MARK}<b>${esc(t("appName"))}</b></div>
    <div class="auth-card"><h1 class="atitle">${t("obTitle")}</h1><p class="sub">${t("obSub")}</p>
    <div class="sector-grid">${TYPES.map(k=>`<button type="button" class="sector ${sel===k?"on":""}" data-act="obPick" data-id="${k}" aria-pressed="${sel===k}">${icon(P[k].icon)}<span>${esc(P[k].name[LI()])}</span></button>`).join("")}</div>
    ${selectF("obCur",t("currency"),curOptions(),S.obCur||C.DEFAULT_CURRENCY||"JOD")}
    <button class="btn primary big" data-act="obDone">${t("obGo")}</button></div></div>`;
}
function setMsg(m, type){
  S.authMsg = m; S.authMsgType = type||"err";
  const form = document.querySelector(".auth form[data-form]"); if(!form){ render(); return; }
  let el = form.parentNode.querySelector(".msg");
  if(!el){ el = document.createElement("div"); el.setAttribute("role","status"); form.parentNode.insertBefore(el, form); }
  el.className = "msg "+S.authMsgType; el.textContent = m;
}
function authError(e){ const m = String(e && e.message || "");
  if(/invalid login/i.test(m)) return t("eBadLogin");
  if(/not confirmed/i.test(m)) return t("eConfirm");
  if(/already registered|already exists/i.test(m)) return t("eExists");
  if(/rate limit|too many|security purposes/i.test(m)) return t("eRate");
  if(/error sending|smtp/i.test(m)) return t("eMailSend");
  if(/password/i.test(m) && /(weak|short|least|pwned|leaked)/i.test(m)) return t("eWeak");
  return t("eGeneric"); }
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length<=254;
const baseUrl = () => C.APP_URL || (location.origin + location.pathname);
const newSettings = v => ({type:P[v.type]?v.type:"other", currency:CUR[v.currency]?v.currency:(C.DEFAULT_CURRENCY||"JOD"), lang:LANG, weekend:LANG==="en"&&!/^ar/i.test(navigator.language||"")?[6,0]:[5], shiftIn:"08:00", shiftOut:"17:00", payPeriod:(P[v.type]||P.other).pay==="week"?"week":"month"});
const normCode = c => String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8);
function setInvite(c){ S.invite = c || null; try{ c ? sessionStorage.setItem("invite", c) : sessionStorage.removeItem("invite"); }catch(e){} }
const FORMS = {
  async login(v){
    if(!validEmail(v.email) || !v.password) return setMsg(t("eFill"));
    const { error } = await sb.auth.signInWithPassword({email:v.email, password:v.password});
    if(error && /not confirmed/i.test(error.message||"")){
      // signed up but never typed the code: take them straight to the code screen with a fresh code
      S.sentTo = v.email; S.sentKind = "signup"; S.screen = "sent"; render();
      const r = await sb.auth.resend({type:"signup", email:v.email, options:{emailRedirectTo:baseUrl()}});
      r && r.error ? setMsg(authError(r.error)) : setMsg(t("eConfirmSent"), "info"); return;
    }
    if(error) setMsg(authError(error));
  },
  async signup(v){
    const code = normCode(v.invite);
    if(!code && (!v.company || v.company.length<2)) return setMsg(t("eName"));
    if(!validEmail(v.email)) return setMsg(t("eEmail"));
    if(v.password.length<8) return setMsg(t("ePw8"));
    const { data, error } = await sb.auth.signUp({email:v.email, password:v.password,
      options:{ data: code ? {invite_code:code} : {company_name:v.company.slice(0,80), company_settings:{lang:LANG, onboarded:false}}, emailRedirectTo: baseUrl() }});
    if(error) return setMsg(authError(error));
    if(!data.session){ S.sentTo = v.email; S.sentKind = "signup"; S.screen = "sent"; S.authMsg = ""; render(); }
  },
  async forgot(v){
    if(!validEmail(v.email)) return setMsg(t("eEmail"));
    const { error } = await sb.auth.resetPasswordForEmail(v.email, {redirectTo: baseUrl()});
    if(error) return setMsg(authError(error));
    S.sentTo = v.email; S.sentKind = "reset"; S.screen = "sent"; S.authMsg = ""; render();
  },
  async otp(v){
    const token = String(v.otp||"").replace(/\D/g,"");
    if(token.length<6) return setMsg(t("codeShort"));
    const rec = S.sentKind==="reset";
    if(rec) RECOVERING = true;
    const { error } = await sb.auth.verifyOtp({email:S.sentTo, token, type: rec ? "recovery" : "signup"});
    if(error){ if(rec) RECOVERING = false; return setMsg(t("codeBad")); }
    S.authMsg = "";
    if(rec){ S.screen = "reset"; render(); return; }
    await afterLogin();
  },
  async reset(v){
    if(v.password.length<8) return setMsg(t("ePw8"));
    const { error } = await sb.auth.updateUser({password:v.password});
    if(error) return setMsg(authError(error));
    toast(t("pwChanged")); S.authMsg = ""; RECOVERING = false; history.replaceState(null,"",location.pathname);
    if(BROWSER_RESET){ try{ await sb.auth.signOut(); }catch(e){} S.gateMsg = t("pwDoneBrowser"); S.screen = "gate"; render(); return; }
    await afterLogin();
  },
  async entercode(v){ const c = normCode(v.code); if(c.length!==8) return setMsg(t("eCode")); setInvite(c); S.screen = "signup"; S.authMsg = ""; render(); },
  async joincode(v){ const c = normCode(v.code); if(c.length!==8) return setMsg(t("eCode"));
    const { error } = await sb.rpc("join_company", {p_code:c}); if(error) return setMsg(/invalid/i.test(error.message||"") ? t("eCodeBad") : t("eGeneric"));
    setInvite(null); await afterLogin(); },
  async company(v){
    if(!v.company || v.company.length<2) return setMsg(t("eName"));
    const { error } = await sb.rpc("create_company", {p_name:v.company, p_phone:null, p_settings:{lang:LANG, onboarded:false}});
    if(error) return setMsg(t("eCreateCo"));
    await afterLogin();
  }
};
document.addEventListener("submit", async e=>{
  const f = e.target.closest("form[data-form]"); if(!f) return;
  e.preventDefault();
  const v = {}; new FormData(f).forEach((val,k)=>v[k]=String(val).trim());
  const pwEl = f.querySelector('[name="password"]'); if(pwEl) v.password = pwEl.value;
  const b = f.querySelector('[type="submit"]'); b.disabled = true; S.authMsg = "";
  try{ await FORMS[f.dataset.form](v); } finally { if(b.isConnected) b.disabled = false; }
});

/* ===== install gate: on phones Daftar only runs as the installed app ===== */
let RECOVERING = false, INSTALL_EVT = null, BROWSER_RESET = false;
const UA = navigator.userAgent || "";
const IS_IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const IS_ANDROID = /Android/.test(UA);
const IN_APP_BROWSER = /Instagram|FBAN|FBAV|FB_IAB|musical_ly|BytedanceWebview|TikTok|Snapchat|WhatsApp/i.test(UA);
const IS_STANDALONE = () => window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || window.matchMedia("(display-mode: minimal-ui)").matches || navigator.standalone === true;
function needsGate(){
  if(window.Capacitor || window.DEMO_MODE || IS_STANDALONE()) return false;
  if(/type=recovery/.test(location.hash)) { BROWSER_RESET = true; return false; }
  if(!IS_IOS && !IS_ANDROID){ try{ if(sessionStorage.getItem("dweb")==="1") return false; }catch(e){} }
  return true;
}
window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); INSTALL_EVT = e; const b = document.getElementById("gateInstall"); if(b) b.hidden = false; });
window.addEventListener("appinstalled", ()=>{ if(window.dtrack) window.dtrack("installed"); });
function gateView(){
  const share = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/></svg>`;
  const iosSafari = IS_IOS && /Safari/.test(UA) && !/CriOS|FxiOS|EdgiOS/.test(UA) && !IN_APP_BROWSER;
  let steps = "";
  if(IS_IOS) steps = `${!iosSafari?`<div class="msg warn">${t("gateSafari")}</div>`:""}<ol class="gate-steps"><li>${share}<span>${t("gateIos1")}</span></li><li><span>${t("gateIos2")}</span></li><li><span>${t("gateIos3")}</span></li></ol>`;
  else steps = `<button class="btn primary big" id="gateInstall" data-act="gateInstall" ${INSTALL_EVT?"":"hidden"}>${t("gateInstall")}</button><ol class="gate-steps"><li><span>${t("gateAnd1")}</span></li><li><span>${t("gateAnd2")}</span></li></ol>`;
  return `<div class="auth"><div class="auth-top"><span></span><button class="btn ghost sm" data-act="lang">${t("otherLang")}</button></div>
    <div class="auth-logo">${MARK}<b>${esc(t("appName"))}</b></div>
    <div class="auth-card"><h1 class="atitle">${t("gateTitle")}</h1><p class="sub">${S.gateMsg || (S.gateDone?t("gateDone"):t("gateSub"))}</p>
      ${IN_APP_BROWSER?`<div class="msg warn">${t("gateInApp")}</div>`:""}${S.invite?`<div class="msg info">${t("gateKeepCode",{c:`<b class="ltr code-big">${esc(S.invite)}</b>`})}</div>`:""}${steps}
      <a class="btn big" href="../get/#how-${IS_IOS?"iphone":IS_ANDROID?"android":"pc"}">${t("gateHow")}</a></div>
    ${!IS_IOS && !IS_ANDROID ? `<div class="auth-foot"><button class="linkbtn" data-act="gateWeb">${t("gateWeb")}</button></div>` : ""}</div>`;
}

/* ===== session ===== */
let loggingIn = false;
async function afterLogin(){ if(loggingIn) return; loggingIn = true; try{ await afterLoginInner(); } finally { loggingIn = false; } }
async function afterLoginInner(){
  const { data:{ user } } = await sb.auth.getUser();
  if(!user){ S.screen = "login"; render(); return; }
  USER = user;
  let { data:mem } = await sb.from("members").select("company_id,role").maybeSingle();
  if(!mem){
    const meta = user.user_metadata || {}, code = normCode(meta.invite_code || S.invite);
    if(code){
      const j = await sb.rpc("join_company", {p_code:code});
      if(!j.error){ setInvite(null); ({ data:mem } = await sb.from("members").select("company_id,role").maybeSingle()); }
      else { S.authMsg = t("eCodeBad"); S.authMsgType = "err"; }
    }
    if(!mem && meta.company_name){
      const r = await sb.rpc("create_company", {p_name:meta.company_name, p_phone:meta.company_phone||null, p_settings:meta.company_settings||{}});
      if(!r.error) ({ data:mem } = await sb.from("members").select("company_id,role").maybeSingle());
    }
  }
  if(!mem){ S.screen = "nocompany"; render(); return; }
  CID = mem.company_id; ROLE = mem.role;
  const { data:comp } = await sb.from("companies").select("id,name,phone,settings").eq("id",CID).maybeSingle();
  COMPANY = comp || {name:"", settings:{}};
  if(COMPANY.settings && (COMPANY.settings.lang==="ar"||COMPANY.settings.lang==="en") && !lsGet("langChosen",false)) LANG = COMPANY.settings.lang;
  S.period = ST().payPeriod || PRE().pay; if(S.period!=="month") S.period = "week";
  S.date = today(); S.pstart = periodStartFor(S.date); S.view = "home";
  const st = COMPANY.settings || {};
  if(ROLE==="owner" && (st.onboarded===false || (!st.type && st.onboarded!==true))){ S.screen = "onboard"; S.obType = st.type || "contracting"; S.obCur = st.currency || C.DEFAULT_CURRENCY || "JOD"; render(); return; }
  S.screen = "app"; S.ready = false; render();
  if(await loadAll()){ subscribe(); render(); loadMyTickets(); if(typeof pushResync==="function") pushResync(); }
}
async function logout(){
  if(channel) sb.removeChannel(channel); clearInterval(refreshT);
  try{ if(typeof pushCurrent==="function"){ const ps = await pushCurrent(); if(ps) await sb.rpc("push_unsubscribe", {p_endpoint:ps.endpoint}); } }catch(e){}   // a signed-out phone gets no company news
  await sb.auth.signOut();
  CID = USER = COMPANY = ROLE = null; COLS.forEach(c=>S[c]=[]); S.ready = false; S.view = "home"; S.screen = "login"; S.authMsg = "";
  S.chat = {open:false, mode:"ai", msgs:[], busy:false, tickets:null, tid:null, unread:false}; chatEl.hidden = true;
  closeSheet(); render();
}
function accountSheet(){
  openSheet({title:t("account"), noSave:true, html:`
    <div class="acct"><span class="avatar lg">${esc(initials(COMPANY&&COMPANY.name))}</span><div class="col"><b>${esc(COMPANY&&COMPANY.name||"")}</b><span class="sub ltr">${esc(USER&&USER.email||"")}</span><span class="sub">${icon(PRE().icon)} ${esc(PRE().name[LI()])}</span></div></div>
    <div class="menu">
    ${ROLE==="owner"?`<button type="button" class="mi" data-act="settings">${icon("gear")}${t("settings")}</button><button type="button" class="mi" data-act="team">${icon("users")}${t("teamAccess")}</button>`:""}
    <button type="button" class="mi" data-act="push">${icon("bell")}${t("pushT")}</button>
    ${canWrite("items")?`<button type="button" class="mi" data-act="move">${icon("upload")}${t("mv")}</button>`:""}
    <button type="button" class="mi" data-act="recurring">${icon("repeat")}${t("recT")}</button>
    <button type="button" class="mi" data-act="shareApp">${icon("send")}${t("shareApp")}</button>
    <button type="button" class="mi" data-act="changePw">${icon("key")}${t("changePw")}</button>
    <button type="button" class="mi" data-act="support">${icon("chat")}${t("navSupport")}</button>
    <button type="button" class="mi" data-act="exportXls">${icon("wallet")}${t("exportXls")}</button>
    <button type="button" class="mi" data-act="exportAll">${icon("wallet")}${t("exportAll")}</button>
    ${ROLE==="owner"?`<button type="button" class="mi" data-act="activity">${icon("clock")}${t("activity")}</button>`:""}
    <a class="mi" href="privacy.html" target="_blank" rel="noopener">${icon("shield")}${t("privacy")}</a>
    <button type="button" class="mi" data-act="logout">${icon("logout")}${t("logout")}</button></div>
    ${ROLE==="owner"?`<button type="button" class="linkbtn danger-link" data-act="deleteAcct">${t("delAcct")}</button>`:""}`});
}
function deleteSheet(){
  openSheet({title:t("delAcct"), saveLabel:t("delForever"),
    html:`<div class="alert bad">${icon("alert")}<span>${t("delWarn")}</span></div>`,
    fields:[{name:"confirm",label:t("delType",{x:esc(COMPANY.name)}),value:"",max:80}],
    submit: async v=>{
      if(v.confirm!==COMPANY.name){ toast(t("delMismatch")); return false; }
      const { error } = await sb.rpc("delete_my_account", {p_confirm:v.confirm});
      if(error){ toast(t("eGeneric")); return false; }
      try{ await purgeAllFiles(); }catch(e){}
      try{ localStorage.removeItem("chat_"+CID); }catch(e){}
      await logout(); toast(t("delDone")); return true;
    }});
}
function changePwSheet(){
  openSheet({title:t("changePw"),
    fields:[{name:"pw1",label:t("pw8"),type:"password"},{name:"pw2",label:t("pwAgain"),type:"password"}],
    submit: async ()=>{
      const a = document.getElementById("f_pw1").value, b = document.getElementById("f_pw2").value;
      if(a.length<8){ toast(t("ePw8")); return false; } if(a!==b){ toast(t("ePwMatch")); return false; }
      const { error } = await sb.auth.updateUser({password:a}); if(error){ toast(authError(error)); return false; }
      toast(t("pwChanged")); return true;
    }});
}

document.addEventListener("input", e=>{ if(e.target.id==="f_rate") rateHint();
  if(e.target.id==="whoq"){ const q = e.target.value.trim().toLowerCase(); document.querySelectorAll("#wholist .row").forEach(r=>r.hidden = !!q && !r.dataset.n.includes(q)); }
  if(e.target.id==="mq"){ S.mq = e.target.value; const pos = e.target.selectionStart; render(); const el = document.getElementById("mq"); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } } });

/* ===== actions ===== */
function armed(el, label){ if(el.dataset.armed==="1") return true; el.dataset.orig = el.textContent; el.dataset.armed = "1"; el.classList.add("armed"); el.textContent = label;
  setTimeout(()=>{ if(el.isConnected && el.dataset.armed==="1"){ el.dataset.armed = ""; el.classList.remove("armed"); el.textContent = el.dataset.orig; } }, 4000); return false; }
const A = {
  go: id => { S.view = id; if(id==="team"||id==="units"){ S.pstart = periodStartFor(today()); } scrollTo(0,0); render(); },
  home: () => A.go("home"),
  openUnit: id => { S.uid=id; S.view="unit"; S.tab="today"; S.date = today(); S.pstart = periodStartFor(S.date); scrollTo(0,0); render(); },
  newUnit: () => unitForm(), editUnit: () => unitForm(unitById(S.uid)),
  day: id => { if(id==="0") S.date = today(); else { const n = Number(id); S.date = addDays(S.date,n); for(let i=0;i<7 && isOff(S.date) && S.date!==today();i++) S.date = addDays(S.date,n); }
    S.pstart = periodStartFor(S.date); render(); },
  period: id => { S.period = id==="month" ? "month" : "week"; S.pstart = periodStartFor(S.view==="unit"?S.date:today()); render(); },
  pnav: id => { const n = Number(id); S.pstart = S.period==="month" ? addMonths(S.pstart,n) : addDays(S.pstart,7*n); render(); },
  mnav: id => { S.mmonth = addMonths(S.mmonth||monthStartOf(today()), Number(id)); render(); },
  mfilter: id => { S.mfilter = id; render(); },
  tab: id => { S.tab=id; render(); },
  addStaff: () => staffForm(), editStaff: id => staffForm(staffById(id)),
  moveHere: async id => { const s = staffById(id); if(!s) return; if(await save("staff",s.id,{...strip(s),unitId:S.uid})){ closeSheet(); toast(t("moved",{x:s.name})); } },
  mark: (id,el) => attSave(id, S.date, el.dataset.s, null, null, S.uid),
  allCame: async (id,el) => { el.disabled = true; for(const s of unitStaff(S.uid)) if(!attOf(s.id,S.date)){ if(!await attSave(s.id,S.date,"present",null,null,S.uid)) break; } toast(t("allMarked")); },
  times: id => timesForm(id),
  advance: id => payForm(null,{staffId:id, kind:"advance"}),
  editPay: id => payForm(S.payments.find(x=>x.id===id)),
  payRest: id => { const s = staffById(id), end = periodEnd(), k = account(s,S.pstart,end);
    payForm(null,{staffId:id, kind:"salary", amount:k.remaining, date: today()>=S.pstart && today()<=end ? today() : lastWorkDay(S.pstart,end)}); },
  newExp: () => moneyForm("exp"), editExp: id => moneyForm("exp", S.expenses.find(x=>x.id===id)),
  newInc: () => moneyForm("inc"), editInc: id => { const x = S.income.find(r=>r.id===id); if(x && x.trip) tripForm(x); else moneyForm("inc", x); },
  quick: () => quickSheet(),
  q: id => { closeSheet(); if(id==="trip") tripForm(null); else if(id==="adv") pickStaff("adv"); else if(id==="att") pickUnit("att"); else moneyForm(id==="inc"?"inc":"exp"); },
  // per-folder categories
  unitCats: id => unitCatsSheet(unitById(S.uid), id==="inc"?"inc":"exp"),
  catDel: async id => { const u = unitById(S.uid), kind = S.catKind||"exp", cur = unitCats(u, kind).map(p=>p[0]); if(cur.length<=1){ toast(t("eCatLast")); return; }
    cur.splice(Number(id),1); if(await save("units", u.id, {...strip(u), [kind==="exp"?"expCats":"incCats"]:cur}, true)) unitCatsSheet(unitById(u.id), kind); },
  catReset: async id => { const u = unitById(S.uid), kind = id==="inc"?"inc":"exp", d = strip(u); delete d[kind==="exp"?"expCats":"incCats"]; if(await save("units", u.id, d, true)) unitCatsSheet(unitById(u.id), kind); },
  quickCat: (id, el) => { if(document.getElementById("qcat")) return; el.insertAdjacentHTML("afterend", `<div class="inlineadd"><input id="qcat" maxlength="40" placeholder="${esc(t("newCat"))}"><button type="button" class="btn sm primary" data-act="quickCatSave" data-id="${id}">${t("add")}</button></div>`); document.getElementById("qcat").focus(); },
  quickCatSave: async id => { const kind = id==="inc"?"inc":"exp", inp = document.getElementById("qcat"), k = catKey(inp && inp.value); if(!k){ toast(t("eCatName")); return; }
    const sel = document.querySelector('#sheetBody [name="unitId"]'), u = unitById(sel ? sel.value : S.uid); if(!u){ toast(tv("eUnitPick")); return; }
    const cur = unitCats(u, kind).map(p=>p[0]);
    if(!cur.includes(k)){ const next = [...cur.filter(x=>x!=="أخرى"), k, ...(cur.includes("أخرى")?["أخرى"]:[])].slice(0,40); if(!await save("units", u.id, {...strip(u), [kind==="exp"?"expCats":"incCats"]:next}, true)) return; }
    refreshCatChips(kind); const r = [...document.querySelectorAll('#sheetBody [name="category"]')].find(x=>x.value===k); if(r) r.checked = true; inp.closest(".inlineadd").remove(); toast(t("catAdded",{x:k})); },
  // attachments
  attView: id => FILES.view(FILES.keep[Number(id)]), attNewView: id => { const f = FILES.add[Number(id)]; if(f) lightbox(f.url, f.name); },
  attDrop: id => { const f = FILES.keep.splice(Number(id),1)[0]; if(f) FILES.drop.push(f); FILES.refresh(); },
  attDropNew: id => { const f = FILES.add.splice(Number(id),1)[0]; if(f && f.url) URL.revokeObjectURL(f.url); FILES.refresh(); },
  lbClose: () => { const lb = document.getElementById("lightbox"); if(lb){ lb.hidden = true; lb.innerHTML = ""; } },
  // taxi & delivery
  haveCode: () => { S.screen = "code"; S.authMsg = ""; render(); }, dropInvite: () => { setInvite(null); render(); },
  team: () => { closeSheet(); teamSheet(); }, newInvite: () => makeInvite(), shareApp: () => { closeSheet(); shareApp(); },
  sendInvite: () => sendInvite(), copyText: (id, el) => copyText(el.dataset.text, el),
  rmMember: async (id, el) => { if(!armed(el, t("sure"))) return; const { error } = await sb.rpc("remove_member", {p_user:id}); if(error){ toast(t("eGeneric")); return; } toast(t("memberRemoved")); teamSheet(); },
  openUnitClose: id => { closeSheet(); A.openUnit(id); }, advFor: id => { closeSheet(); payForm(null,{staffId:id, kind:"advance"}); },
  newTrip: () => tripForm(null), tripOn: id => tripForm(null, {platform:id}), editTrip: id => tripForm(S.income.find(x=>x.id===id)),
  shiftStart: () => shiftForm(unitById(S.uid), "start"), shiftEnd: () => shiftForm(unitById(S.uid), "end"), shiftEdit: () => shiftForm(unitById(S.uid), "edit"),
  drvFuel: () => moneyForm("exp", null, {category:"بنزين"}),
  closeUnit: async (id,el) => { if(!armed(el,t("sure"))) return; const u = unitById(S.uid); if(await save("units",u.id,{...strip(u),status:"closed",closedAt:today()})) toast(t("closed")); },
  reopen: async () => { const u = unitById(S.uid); await save("units",u.id,{...strip(u),status:"active",closedAt:null}); },
  closeSheet: () => closeSheet(),
  sheetDel: async (id,el) => { if(!onDelete) return; if(!armed(el,t("sure"))) return; el.disabled = true; const ok = await onDelete.run(); if(ok!==false) closeSheet(); else el.disabled = false; },
  lang: () => { lsSet("langChosen", true); setLang(LANG==="en"?"ar":"en"); },
  goto: id => { S.screen = id; S.authMsg = ""; render(); },
  logout: () => logout(), account: () => accountSheet(),
  settings: () => { closeSheet(); settingsSheet(); }, changePw: () => { closeSheet(); changePwSheet(); },

  eye: id => { const i = document.getElementById(id); if(!i) return; const show = i.type==="password"; i.type = show ? "text" : "password"; const b = document.querySelector(`[data-act="eye"][data-id="${id}"]`); if(b) b.textContent = show ? t("hidePw") : t("showPw"); },
  gateInstall: async () => { if(window.dtrack) window.dtrack("install_click"); if(!INSTALL_EVT) return; INSTALL_EVT.prompt(); try{ await INSTALL_EVT.userChoice; }catch(e){} INSTALL_EVT = null; render(); },
  gateWeb: () => { try{ sessionStorage.setItem("dweb","1"); }catch(e){} location.reload(); },
  resend: async (id, el) => { el.disabled = true;
    const r = S.sentKind==="signup" ? await sb.auth.resend({type:"signup", email:S.sentTo, options:{emailRedirectTo:baseUrl()}}) : await sb.auth.resetPasswordForEmail(S.sentTo, {redirectTo:baseUrl()});
    toast(r && r.error ? authError(r.error) : t("resent")); setTimeout(()=>{ if(el.isConnected) el.disabled = false; }, 30000); },
  obPick: id => { S.obType = id; const c = document.getElementById("obCur"); if(c) S.obCur = c.value; render(); },
  obDone: async (id, el) => { el.disabled = true; const c = document.getElementById("obCur"); S.obCur = c ? c.value : S.obCur;
    const settings = {...newSettings({type:S.obType, currency:S.obCur}), ...(COMPANY.settings||{}), type:S.obType, currency:S.obCur, payPeriod:(P[S.obType]||P.other).pay==="week"?"week":"month", onboarded:true};
    const { error } = await sb.from("companies").update({settings}).eq("id",CID);
    if(error){ el.disabled = false; toast(t("eGeneric")); return; }
    COMPANY.settings = settings; S.period = settings.payPeriod; S.pstart = periodStartFor(today());
    S.screen = "app"; S.ready = false; render(); if(await loadAll()){ subscribe(); render(); loadMyTickets(); } },
  deleteAcct: () => { closeSheet(); deleteSheet(); },
  openFirst: () => { const u = activeUnits()[0]; if(u) A.openUnit(u.id); },
  exportAll: () => { closeSheet(); exportMoney(true); },
  exportMonth: () => exportMoney(false), exportPayroll: () => exportPayroll(),
  shareWa: id => shareStatement(id), shareClient: id => shareClient(id), demoLoad: (id, el) => demoLoad(el), demoClear: (id, el) => demoClear(el), printReport: () => window.print(),
  // support
  support: () => { closeSheet(); openChat(); }, closeChat: () => closeChat(),
  supTopic: id => { const i = document.getElementById("nt_msg"); if(i){ i.value = t(id+"Text"); i.focus(); } },
  chatMode: id => { S.chat.mode = id; S.chat.tid = null; if(id==="tickets"){ markTicketsSeen(); loadMyTickets(); } renderChat(); },
  openTicket: id => { S.chat.mode = "tickets"; S.chat.tid = id; markTicketsSeen(); renderChat(); }, ticketBack: () => { S.chat.tid = null; renderChat(); },
};
document.addEventListener("click", e=>{ const el = e.target.closest("[data-act]"); if(!el) return; const f = A[el.dataset.act]; if(f){ e.preventDefault(); f(el.dataset.id, el); } });
document.addEventListener("change", e=>{
  const n = e.target.name;
  if(n==="qin"){ document.getElementById("f_in").value = e.target.value; tprev(); }
  else if(n==="qout"){ document.getElementById("f_out").value = e.target.value; tprev(); }
  else if(n==="in"||n==="out"){ ["qin","qout"].forEach(q=>document.querySelectorAll(`[name="${q}"]`).forEach(r=>r.checked = r.value===document.getElementById(q==="qin"?"f_in":"f_out").value)); tprev(); }
  else if(n==="rateType") rateHint();
  else if(n==="ukind"){ const v = vals(); const u = S.unitFormId ? unitById(S.unitFormId) : null;
    const comm = {}; Object.keys(v).filter(k=>k.startsWith("comm_")).forEach(k=>comm[k.slice(5)] = v[k]);
    unitForm(u, {name:v.name, kind:v.ukind, client:v.client, budget:v.budget, recurAmount:v.recurAmount, recurDay:v.recurDay, location:v.location, clientPhone:v.clientPhone, comm}); }
  else if(n==="unitId" && e.target.closest("#sheetBody") && document.querySelector('#sheetBody [name="category"]')){ refreshCatChips(S.mkind==="inc" ? "inc" : "exp"); }
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ const lb = document.getElementById("lightbox"); if(lb && !lb.hidden){ A.lbClose(); return; } if(!document.getElementById("sheet").hidden) closeSheet(); else if(S.chat.open) closeChat(); } });

/* ===== start ===== */
try{ const q = new URLSearchParams(location.search), c = normCode(q.get("invite")); if(c.length===8){ setInvite(c); history.replaceState(null,"",location.pathname); } else { const k = sessionStorage.getItem("invite"); if(k) S.invite = k; } }catch(e){}
// never run inside someone else's frame (clickjacking): GitHub Pages can't send X-Frame-Options, so we check here
if(window.top !== window.self && !window.DEMO_MODE){ try{ window.top.location.replace(location.href); }catch(e){ document.documentElement.innerHTML = ""; throw new Error("framed"); } }
S.date = today(); S.pstart = today();
if("serviceWorker" in navigator && location.protocol==="https:" && !window.Capacitor && !window.DEMO_MODE) navigator.serviceWorker.register("sw.js").catch(()=>{});
(async ()=>{
  applyDir();
  if(!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY || /YOUR-/.test(C.SUPABASE_URL+C.SUPABASE_ANON_KEY)){ S.screen = "config"; render(); return; }
  if(needsGate()){
    // an old e-mail link opened in the browser: don't sign the browser in, send them back to the app
    if(/access_token|type=signup|type=recovery|error_description/.test(location.hash)){ S.gateDone = true; history.replaceState(null,"",location.pathname); }
    S.screen = "gate"; render(); return;
  }
  sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:"implicit"}});
  RECOVERING = /type=recovery/.test(location.hash);
  sb.auth.onAuthStateChange((event)=>{
    if(event==="PASSWORD_RECOVERY"){ RECOVERING = true; S.screen = "reset"; S.authMsg = ""; render(); return; }
    if(event==="SIGNED_IN" && !RECOVERING && S.screen!=="app") setTimeout(afterLogin, 0);
    if(event==="SIGNED_OUT"){ if(BROWSER_RESET){ S.screen = "gate"; render(); return; } S.screen = "login"; render(); }
  });
  const { data:{ session } } = await sb.auth.getSession();
  if(RECOVERING && session){ S.screen = "reset"; render(); return; }
  if(session) await afterLogin(); else if(S.screen==="loading"){ S.screen = S.invite ? "signup" : "login"; render(); }
})();
