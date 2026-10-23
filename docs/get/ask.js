/* Adds the "ask about Daftar" button to any page and loads the assistant when it's pressed. */
(function () {
  "use strict";
  if (document.getElementById("askBtn")) return;
  const css = document.createElement("style");
  css.textContent = ".ask{position:fixed;bottom:18px;inset-inline-end:18px;z-index:30;display:flex;align-items:center;gap:8px;min-height:52px;padding:0 18px;border-radius:26px;border:0;background:var(--brand,var(--accent,#3D6BFF));color:#fff;font:700 15px var(--body,var(--f-body,system-ui));box-shadow:0 12px 30px -10px rgba(0,41,163,.6);cursor:pointer}.ask svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round}.ask[aria-expanded=true]{display:none}@media (max-width:480px){.ask span{display:none}.ask{width:56px;padding:0;justify-content:center;border-radius:50%}}";
  document.head.appendChild(css);
  const b = document.createElement("button"); b.className = "ask"; b.id = "askBtn"; b.type = "button"; b.setAttribute("aria-haspopup", "dialog"); b.setAttribute("aria-controls", "chat"); b.setAttribute("aria-label", "اسأل عن دفتر");
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg><span>اسأل عن دفتر</span>';
  document.body.appendChild(b);
  let loading = null;
  b.addEventListener("click", () => {
    if (!loading) loading = window.DaftarChat ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement("script"); s.src = "/get/chat.js?v=1"; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    loading.then(() => window.DaftarChat.open(b)).catch(() => { loading = null; });
  });
})();
