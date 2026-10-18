/* ===== growth: bring your team in, tell another business owner ===== */
const SITE = "https://daftarapp.co";
async function copyText(txt, el){
  try{ await navigator.clipboard.writeText(txt); if(el){ const o = el.innerHTML; el.innerHTML = `${icon("check")}${t("copied")}`; setTimeout(()=>{ if(el.isConnected) el.innerHTML = o; }, 1800); } else toast(t("copied")); }
  catch(e){ toast(t("copyFail")); }
}
function openWa(text){ const a = document.createElement("a"); a.href = "https://wa.me/?text=" + encodeURIComponent(text); a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
/* the owner's team: who's in, and a code to add someone (foreman, accountant, partner) */
async function teamSheet(){
  if(ROLE!=="owner"){ toast(t("onlyOwner")); return; }
  openSheet({title:t("teamAccess"), noSave:true, html:`<p class="sub">${t("teamIntro")}</p><div id="teamBox"><span class="hint">${t("loading")}</span></div>`});
  const { data, error } = window.DEMO_TEAM ? await window.DEMO_TEAM.list() : await sb.rpc("company_members");
  const box = document.getElementById("teamBox"); if(!box) return;
  if(error){ box.innerHTML = `<div class="alert warn">${icon("alert")}<span>${t("eGeneric")}</span></div>`; return; }
  const list = Array.isArray(data) ? data : [];
  const roles = ["manager","accountant","cashier","viewer"];
  box.innerHTML = `<div class="list">${list.map(m=>`<div class="row static memrow"><span class="avatar">${esc(initials(m.email))}</span><div class="m"><b class="ltr">${esc(m.email||"")}</b><span class="sub">${t(ROLE_L[m.role]||"roleMember")}</span>
      ${m.role==="owner"?"":`<div class="chiprow">${roles.map(r=>`<button type="button" class="chipbtn sm" data-act="setRole" data-id="${esc(m.user_id)}" data-r="${r}" aria-pressed="${m.role===r||(r==="manager"&&m.role==="member")}">${t(ROLE_L[r])}</button>`).join("")}</div>`}</div>
      ${m.role==="owner"?"":`<button type="button" class="btn sm ghost" data-act="rmMember" data-id="${esc(m.user_id)}">${t("remove")}</button>`}</div>`).join("")}</div><span class="hint">${t("roleHint")}</span>
    <div id="inviteBox">${S.lastInvite ? inviteCard(S.lastInvite) : `<button type="button" class="btn primary big" data-act="newInvite">${icon("plus")}${t("addPerson")}</button>`}</div>
    <span class="hint">${t("teamRules")}</span>`;
}
function inviteCard(code){
  const link = `${SITE}/app/?invite=${code}`;
  return `<div class="invite"><span class="label">${t("inviteCode")}</span><b class="code-big ltr">${esc(code.slice(0,4))}-${esc(code.slice(4))}</b>
    <span class="sub">${t("inviteValid")}</span>
    <div class="two"><button type="button" class="btn primary" data-act="sendInvite">${icon("send")}${t("sendWa")}</button><button type="button" class="btn" data-act="copyText" data-text="${esc(link)}">${icon("link")}${t("copyLink")}</button></div></div>`;
}
async function makeInvite(){
  const { data, error } = window.DEMO_TEAM ? await window.DEMO_TEAM.invite() : await sb.rpc("create_invite");
  if(error || !data || !data.code){ toast(/too many/i.test(String(error&&error.message)) ? t("eTooMany") : t("eGeneric")); return; }
  S.lastInvite = data.code; const box = document.getElementById("inviteBox"); if(box) box.innerHTML = inviteCard(data.code);
}
function sendInvite(){
  const c = S.lastInvite; if(!c) return;
  openWa(t("inviteMsg", {co:COMPANY&&COMPANY.name||"", code:`${c.slice(0,4)}-${c.slice(4)}`, link:`${SITE}/app/?invite=${c}`}));
}
/* word of mouth: one tap to tell another business owner */
async function shareApp(){
  const url = `${SITE}/get/?from=share`, text = t("shareMsg");
  if(navigator.share){ try{ await navigator.share({title:t("appName"), text, url}); if(window.dtrack) window.dtrack("copy_link"); return; }catch(e){ if(e && e.name==="AbortError") return; } }
  openWa(text + "\n" + url);
}

/* "try it with an example": a filled folder in one tap, so a new owner sees the point in seconds; removable in one tap */
const DEMO_COLS = ["units","staff","attendance","payments","expenses","income"];
const hasDemo = () => DEMO_COLS.some(c=>S[c].some(x=>x.demo));
async function demoLoad(el){
  if(el) el.disabled = true;
  const p = PRE(), uid = "demo-u-"+newId().slice(0,8), d0 = today();
  const days = [-2,-1,0].map(n=>addDays(d0,n)).filter(d=>!isOff(d) || d===d0);
  const ok = await save("units", uid, {demo:true, name:t("demoUnit",{x:p.unit[LI()][0]}), kind:ST().type, client:p.client?t("demoClient"):"", budget:p.budget?12000:0,
    status:"active", createdAt:Date.now(), startDate:addDays(d0,-2)}, true);
  if(!ok){ if(el) el.disabled = false; return; }
  const rt = p.pay==="day" ? "day" : p.pay==="week" ? "week" : "month", rate = rt==="day" ? 15 : rt==="week" ? 90 : 450;
  const people = [t("demoP1"), t("demoP2"), t("demoP3")];
  for(let i=0;i<people.length;i++){
    const sid = "demo-s"+i+"-"+uid.slice(7);
    await save("staff", sid, {demo:true, name:people[i], rateType:rt, rate, otRate:0, unitId:uid, active:true, createdAt:Date.now()+i, startDate:addDays(d0,-2)}, true);
    for(const d of days){ const s = staffById(sid), absent = i===2 && d===days[0];
      await save("attendance", d+"_"+sid, {demo:true, staffId:sid, date:d, unitId:uid, status:absent?"absent":"present", in:absent?"":ST().shiftIn, out:absent?"":(i===0?"19:00":ST().shiftOut), dayRate:dayRate(s,d), otRate:otRate(s,d), updatedAt:Date.now()}, true); }
  }
  await save("payments", "demo-p-"+uid.slice(7), {demo:true, staffId:"demo-s1-"+uid.slice(7), unitId:uid, kind:"advance", amount:20, date:d0, note:"", createdAt:Date.now()}, true);
  const ex = p.exp.slice(0,3), amts = [640, 120, 35];
  for(let i=0;i<ex.length;i++) await save("expenses", "demo-e"+i+"-"+uid.slice(7), {demo:true, unitId:uid, category:ex[i][0], amount:amts[i], date:days[Math.min(i,days.length-1)], item:"", supplier:"", payBy:"cash", files:[], createdAt:Date.now()+i}, true);
  await save("income", "demo-i-"+uid.slice(7), {demo:true, unitId:uid, category:p.inc[0][0], amount:2000, date:days[0], note:"", payBy:"transfer", files:[], createdAt:Date.now()}, true);
  S.uid = uid; S.view = "unit"; S.tab = "today"; S.date = d0; render(); toast(t("demoDone"));
}
async function demoClear(el){
  if(el && !armed(el, t("sure"))) return;
  for(const c of DEMO_COLS) for(const x of S[c].filter(r=>r.demo)) await remove(c, x.id);
  S.view = "home"; render(); toast(t("demoGone"));
}
