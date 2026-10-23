/* Daftar public site: tabs, the hero ledger, videos, install help, and the assistant (loaded on demand). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const T = (e) => { try { (window.dtrack || function () {})(e); } catch (x) {} };
  const ua = navigator.userAgent || "";
  const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1), isAndroid = /Android/.test(ua);
  const toast = (msg) => { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); };

  /* ---------- tabs (WAI-ARIA, arrow keys move between tabs) ---------- */
  function tabs(list) {
    const ts = $$('[role="tab"]', list);
    const pick = (tab, focus) => {
      ts.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute("aria-controls")); if (p) p.hidden = !on; });
      if (focus) tab.focus();
    };
    ts.forEach((t, i) => {
      t.addEventListener("click", () => pick(t));
      t.addEventListener("keydown", (e) => {
        const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;   // right-to-left: left arrow goes to the next tab
        if (step) { e.preventDefault(); pick(ts[(i + step + ts.length) % ts.length], true); }
        else if (e.key === "Home") { e.preventDefault(); pick(ts[0], true); } else if (e.key === "End") { e.preventDefault(); pick(ts[ts.length - 1], true); }
      });
    });
    return pick;
  }
  const lists = $$('[role="tablist"]'), pickers = lists.map(tabs);
  // open the install steps for this visitor's device
  const installTabs = pickers[1]; if (installTabs) installTabs($(isIos ? "#t-ios" : isAndroid ? "#t-and" : "#t-pc"));

  /* ---------- the hero ledger: write a line, see the balance and the radar react ---------- */
  const rows = $("#ledgerRows"), balEl = $("#ledgerBal"), warn = $("#ledgerWarn"), shortEl = $("#ledgerShort");
  const fmt = (n) => Math.round(Math.abs(n)).toLocaleString("en-US");
  const OPEN = 1700;
  const dateEl = $("#ledgerDate");
  if (dateEl) { try { dateEl.textContent = new Date().toLocaleDateString("ar-JO-u-nu-latn", { weekday: "long", day: "numeric", month: "numeric" }); } catch (e) {} }
  function recalc() {
    let cash = OPEN, later = 0;
    $$("li", rows).forEach((li) => { const v = Number(li.dataset.v); if (li.dataset.k === "ch") later += v; else cash += v; });
    balEl.textContent = (cash < 0 ? "− " : "") + fmt(cash); balEl.classList.toggle("neg", cash < 0);
    const after = cash + later;
    warn.hidden = after >= 0; if (after < 0) shortEl.textContent = fmt(after) + " دينار";
  }
  // seed values from the printed rows
  $$("li", rows).forEach((li) => { const s = li.querySelector(".l-a").textContent.replace(/[^\d−+]/g, ""); li.dataset.v = (/−/.test(s) ? -1 : 1) * Number(s.replace(/[^\d]/g, "")); });
  recalc();
  const toEn = (s) => s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/٫/g, ".");
  const IN = /(قبضت|استلمت|وصلني|اجاني|إجاني|دخل|بعت|بيع|مبيع|حصّلت|حصلت|ربحت|received|sold|got)/;
  const CH = /شيك|cheque|check/;
  function write(text) {
    const raw = toEn(String(text || "").trim()); if (!raw) return;
    const m = raw.match(/\d+(?:\.\d+)?/); if (!m) { toast("اكتب المبلغ، مثلاً: دفعت 40 بنزين"); return; }
    const amt = Math.min(1e7, Number(m[0])); if (!amt) return;
    const kind = CH.test(raw) ? "ch" : IN.test(raw) ? "in" : "out";
    const label = raw.replace(m[0], "").replace(/\s+(ب|بـ)\s*$/, "").replace(/\s{2,}/g, " ").trim().slice(0, 48) || (kind === "in" ? "دخل" : "مصروف");
    const li = document.createElement("li"); li.dataset.k = kind; li.dataset.v = (kind === "in" ? 1 : -1) * amt; li.className = "new";
    li.innerHTML = '<span class="l-t"></span><span class="l-a"></span>';
    li.firstChild.textContent = label; li.lastChild.textContent = (kind === "in" ? "+ " : "− ") + amt.toLocaleString("en-US", { maximumFractionDigits: 2 });
    rows.appendChild(li); while (rows.children.length > 7) rows.removeChild(rows.firstElementChild);
    recalc(); T("demo_line");
  }
  const form = $("#ledgerTry"), input = $("#ledgerIn");
  if (form) form.addEventListener("submit", (e) => { e.preventDefault(); write(input.value); input.value = ""; });
  $$("[data-eg]").forEach((b) => b.addEventListener("click", () => write(b.dataset.eg)));

  /* ---------- videos in a modal (nothing downloads until someone presses play) ---------- */
  const VIDS = { film: ["daftar", false], move: ["how-move", false], android: ["how-android", true], iphone: ["how-iphone", true], pc: ["how-pc", false] };
  const modal = $("#vidModal"), box = $("#vidBox"), vid = $("#vidEl"); let lastFocus = null;
  function openVid(k) {
    const v = VIDS[k]; if (!v) return; lastFocus = document.activeElement;
    box.classList.toggle("tall", v[1]); vid.poster = k === "film" ? "/get/media/poster.jpg" : `/get/media/${v[0]}.jpg`; vid.src = `/get/media/${v[0]}.mp4`;
    modal.hidden = false; document.body.style.overflow = "hidden"; $(".modal__x", modal).focus(); vid.play().catch(() => {}); T("video_play");
  }
  function closeVid() { vid.pause(); vid.removeAttribute("src"); vid.load(); modal.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  $$("[data-video]").forEach((b) => b.addEventListener("click", () => openVid(b.dataset.video)));
  $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeVid));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeVid(); });
  { const m = /^#(how-)?(iphone|android|pc|move)$/.exec(location.hash); if (m) setTimeout(() => { const s = $(m[2] === "move" ? "#move" : "#install"); if (s) s.scrollIntoView(); openVid(m[2]); }, 300); }

  /* ---------- install ---------- */
  const info = window.dtrackInfo || { inApp: /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|Snapchat|WhatsApp/i.test(ua), browser: "" };
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) $("#installed").hidden = false;
  if (info.inApp) {
    const names = { instagram: "إنستغرام", facebook: "فيسبوك", tiktok: "تيك توك", snapchat: "سناب شات", whatsapp: "واتساب" };
    $("#inapp").hidden = false; $("#inappName").textContent = names[info.browser] || "تطبيق";
    if (isAndroid) { const a = $("#openChrome"); a.hidden = false; a.href = "intent://" + location.host + location.pathname + "#Intent;scheme=https;package=com.android.chrome;end";
      $("#inappHow").textContent = "هالمتصفح ما بيسمح بالتثبيت. اضغط «افتح بـ Chrome»، أو ⋮ فوق واختار «فتح في Chrome»."; }
    else if (isIos) $("#inappHow").textContent = "هالمتصفح ما بيسمح بالتثبيت. اضغط ⋯ أو زر المشاركة فوق واختار «فتح في Safari»، أو انسخ الرابط والصقه بـ Safari.";
    const bar = document.createElement("div"); bar.className = "inapp-bar"; bar.innerHTML = '<span>عشان تنزّل دفتر، افتح الصفحة بالمتصفح</span><a href="#install">كيف؟</a>'; document.body.appendChild(bar);
  }
  $("#copyLink").addEventListener("click", async () => { T("copy_link"); const url = location.origin + location.pathname; try { await navigator.clipboard.writeText(url); toast("انتسخ الرابط، الصقه بالمتصفح"); } catch (e) { toast(url); } });
  let deferred = null; const ib = $$(".installBtn");
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; ib.forEach((b) => (b.hidden = false)); });
  ib.forEach((b) => b.addEventListener("click", async () => { T("install_click"); if (!deferred) return; deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; ib.forEach((x) => (x.hidden = true)); }));
  window.addEventListener("appinstalled", () => { T("installed"); $("#installed").hidden = false; ib.forEach((b) => (b.hidden = true)); });
  $$("[data-track]").forEach((a) => a.addEventListener("click", () => T(a.dataset.track)));

  /* ---------- the assistant: its code and answers load only when someone opens it ---------- */
  const ask = $("#askBtn"); let loading = null;
  function loadChat() {
    if (window.DaftarChat) return Promise.resolve();
    if (!loading) loading = new Promise((ok, no) => { const s = document.createElement("script"); s.src = "/get/chat.js?v=1"; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    return loading;
  }
  ask.addEventListener("click", () => { ask.setAttribute("aria-busy", "true"); loadChat().then(() => { ask.removeAttribute("aria-busy"); window.DaftarChat.open(ask); T("chat_open"); }).catch(() => toast("ما قدرنا نفتح المساعد. راسلنا على hello@daftarapp.co")); });
  // warm it up when the visitor is idle, so the first answer is instant
  (window.requestIdleCallback || ((f) => setTimeout(f, 3000)))(() => { if (document.visibilityState === "visible") loadChat().catch(() => {}); });
})();
