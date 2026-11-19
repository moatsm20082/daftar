
/* =====================================================================
   v24 notifications open the right place.
   A notification carries a link: /app/?voice=1 opens «احكي مع دفتر», /app/?support=1
   opens the support messages. Works when the app was closed (the link opens it) and
   when it was already open (the service worker tells the open window).
   ===================================================================== */
let NQ_GO = null;
(function(){
  try{ const q = new URLSearchParams(location.search);
    if(q.has("voice")) NQ_GO = "voice"; else if(q.has("support")) NQ_GO = "support"; else if(q.has("snap")) NQ_GO = "snap";
    if(NQ_GO){ q.delete("voice"); q.delete("support"); q.delete("snap"); const s = q.toString(); history.replaceState(null, "", location.pathname + (s ? "?"+s : "") + location.hash); }
  }catch(e){}
})();
function nqRun(){
  if(!NQ_GO || typeof S==="undefined" || S.screen!=="app" || !S.ready) return;
  const go = NQ_GO; NQ_GO = null;
  setTimeout(()=>{
    if(go==="voice" && typeof vxOpen==="function") vxOpen();
    else if(go==="support" && typeof openChat==="function") openChat("tickets");
    else if(go==="snap" && A.snap) A.snap();
  }, 400);
}
{ const _render = render; render = function(){ const r = _render.apply(this, arguments); try{ nqRun(); }catch(e){} return r; }; }
try{ navigator.serviceWorker && navigator.serviceWorker.addEventListener("message", e => {
  const d = e.data || {}; if(d.type!=="daftar-open" || typeof d.url!=="string") return;
  try{ const q = new URL(d.url, location.origin).searchParams; NQ_GO = q.has("voice") ? "voice" : q.has("support") ? "support" : q.has("snap") ? "snap" : null;
    if(NQ_GO==="support" && typeof checkTickets==="function") checkTickets(); nqRun(); }catch(x){}
}); }catch(e){}
