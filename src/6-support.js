/* ===== support: write to the Daftar team, see their replies ===== */
const chatEl = document.getElementById("chat");
function openChat(mode){ S.chat.open = true; S.chat.mode = mode || (S.chat.unread ? "tickets" : "new"); S.chat.tid = null; chatEl.hidden = false; renderChat();
  if(CID) loadMyTickets(); }
function closeChat(){ S.chat.open = false; chatEl.hidden = true; if(S.screen==="app") render(); }
function md(s){ // tiny, safe formatting: escape first, then **bold** and line breaks
  return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^(\d+)\.\s/gm,'<span class="num">$1.</span> ').replace(/\n/g,"<br>"); }
function renderChat(){
  if(!S.chat.open) return;
  const c = S.chat, signed = !!CID;
  let body;
  if(!signed) body = humanPane();
  else if(c.tid || c.mode==="tickets") body = ticketsPane();
  else body = newTicketPane();
  chatEl.innerHTML = `<div class="chat-back" data-act="closeChat"></div><section class="chat-panel" role="dialog" aria-label="${t("supTitle")}">
    <header class="chat-head"><span class="chat-logo">${MARK}</span><div class="col"><b>${t("supTitle")}</b><span class="sub">${t("supSubHuman")}</span></div><button class="iconbtn" data-act="closeChat" aria-label="${t("close")}">${icon("x")}</button></header>
    ${signed?`<div class="seg two-seg chat-tabs"><button data-act="chatMode" data-id="new" aria-pressed="${c.mode!=="tickets"}">${t("newMsg")}</button><button data-act="chatMode" data-id="tickets" aria-pressed="${c.mode==="tickets"}">${t("myTickets")}${c.unread?'<i class="dot"></i>':""}</button></div>`:""}
    ${body}</section>`;
  const m = document.getElementById("msgs"); if(m) m.scrollTop = m.scrollHeight;
}
function newTicketPane(){
  return `<form class="human" id="newTicketForm" novalidate><b>${t("supAsk")}</b><span class="sub">${t("supAskSub")}</span>
    <div class="sugg flat">${["sq1","sq2","sq3","sq4"].map(k=>`<button type="button" class="chip-btn" data-act="supTopic" data-id="${k}">${t(k)}</button>`).join("")}</div>
    <div class="field"><label for="nt_msg">${t("yourMsg")}</label><textarea id="nt_msg" name="msg" rows="5" maxlength="1500"></textarea></div>
    <button class="btn primary" type="submit">${icon("send")}${t("sendTeam")}</button><span class="hint">${t("supReplyTime")}</span></form>`;
}
function msgBubble(m){
  const who = m.role==="user" ? "me" : m.role==="support" ? "team" : "ai";
  return `<div class="bubble ${who}">${m.role==="support"?`<span class="who-l">${t("team")}</span>`:""}${m.text?md(m.text):""}</div>`;
}
function humanPane(){
  return `<form class="human" id="humanForm" novalidate><b>${t("humanForm")}</b>
    <div class="field"><label for="h_name">${t("yourName")}</label><input id="h_name" name="name" maxlength="80"></div>
    <div class="field"><label for="h_contact">${t("contactField")}</label><input id="h_contact" name="contact" maxlength="120" dir="ltr"></div>
    <div class="field"><label for="h_msg">${t("yourMsg")}</label><textarea id="h_msg" name="msg" rows="4" maxlength="1500"></textarea></div>
    <button class="btn primary" type="submit">${t("sendTeam")}</button><span class="hint">${t("supReplyTime")}</span></form>`;
}
function ticketsPane(){
  const c = S.chat;
  if(c.tid){ const tk = (c.tickets||[]).find(x=>x.id===c.tid); if(!tk) { c.tid = null; return ticketsPane(); }
    return `<div class="msgs" id="msgs"><div class="t-head"><button class="linkbtn" data-act="ticketBack">${icon(LANG==="en"?"chevE":"chevS")}${t("back")}</button><span class="pill ${tk.status==="answered"?"good":tk.status==="closed"?"":"warn"}">${t("tStatus_"+tk.status)}</span></div>
      ${(tk.messages||[]).map(m=>msgBubble({role:m.role==="ai"?"assistant":m.role, text:m.text})).join("")}</div>
      ${tk.status!=="closed"?`<form class="composer" id="ticketForm"><textarea id="ticketInput" rows="1" maxlength="1500" placeholder="${esc(t("replyPh"))}"></textarea><button class="send" type="submit" aria-label="${t("send")}">${icon("send")}</button></form>`:""}`; }
  if(!c.tickets) return `<div class="msgs"><div class="empty">${t("loading")}</div></div>`;
  if(!c.tickets.length) return `<div class="msgs"><div class="empty">${icon("chat","big")}<span>${t("noTickets")}</span><button class="btn" data-act="chatMode" data-id="new">${t("newMsg")}</button></div></div>`;
  return `<div class="msgs"><div class="list">${c.tickets.map(tk=>`<button class="row" data-act="openTicket" data-id="${esc(tk.id)}"><div class="m"><b>${esc(tk.subject||"—")}</b><span class="sub">${fdate(String(tk.updated_at).slice(0,10))}</span></div><span class="pill ${tk.status==="answered"?"good":tk.status==="closed"?"":"warn"}">${t("tStatus_"+tk.status)}</span></button>`).join("")}</div></div>`;
}
async function loadMyTickets(){
  if(!sb || !USER) return;
  const { data } = await sb.from("support_tickets").select("id,status,subject,messages,updated_at").order("updated_at",{ascending:false}).limit(30);
  S.chat.tickets = data || [];
  const seen = lsGet("ticketsSeen_"+USER.id, "");
  S.chat.unread = S.chat.tickets.some(x=>x.status==="answered" && String(x.updated_at) > seen);
  if(S.chat.open) renderChat();
}
async function checkTickets(){ const was = S.chat.unread; await loadMyTickets(); if(S.chat.unread && !was){ toast(t("newReply")); if(overlaysClosed()) render(); } }
function markTicketsSeen(){ if(USER){ lsSet("ticketsSeen_"+USER.id, new Date().toISOString()); S.chat.unread = false; } }

document.addEventListener("submit", async e=>{
  if(e.target.id==="newTicketForm"){ e.preventDefault(); const i = document.getElementById("nt_msg"), v = i.value.trim(); if(v.length<3){ toast(t("yourMsg")); return; }
    const b = e.target.querySelector('[type="submit"]'); b.disabled = true;
    const { error } = await sb.rpc("open_ticket", {p_subject:v.slice(0,150), p_messages:[{role:"user", text:v.slice(0,1500)}]});
    b.disabled = false;
    if(error){ toast(/too many/i.test(error.message||"") ? t("eTooMany") : t("eGeneric")); return; }
    toast(t("humanSent")); await loadMyTickets(); S.chat.mode = "tickets"; S.chat.tid = (S.chat.tickets&&S.chat.tickets[0]||{}).id || null; renderChat(); }
  if(e.target.id==="ticketForm"){ e.preventDefault(); const i = document.getElementById("ticketInput"), v = i.value.trim(); if(!v) return;
    const { error } = await sb.rpc("ticket_reply", {p_id:S.chat.tid, p_text:v.slice(0,1500)}); if(error){ toast(t("eGeneric")); return; } i.value = ""; await loadMyTickets(); }
  if(e.target.id==="humanForm"){ e.preventDefault(); const f = new FormData(e.target), name = String(f.get("name")||"").trim(), contact = String(f.get("contact")||"").trim(), msg = String(f.get("msg")||"").trim();
    if(contact.length<5){ toast(t("eContact")); return; } if(msg.length<3){ toast(t("yourMsg")); return; }
    const { error } = await sb.rpc("open_public_ticket", {p_name:name, p_contact:contact, p_message:msg});
    if(error){ toast(/too many/i.test(error.message||"") ? t("eTooMany") : t("eGeneric")); return; }
    e.target.reset(); toast(t("humanSentAnon")); }
});
document.addEventListener("keydown", e=>{ if(e.target.id==="ticketInput" && e.key==="Enter" && !e.shiftKey){ e.preventDefault(); e.target.form.requestSubmit(); } });
document.addEventListener("input", e=>{ if(e.target.id==="ticketInput"){ e.target.style.height = "auto"; e.target.style.height = Math.min(140, e.target.scrollHeight)+"px"; } });
