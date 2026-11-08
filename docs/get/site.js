/* Daftar public site: the nav, device-aware download help, videos, and the assistant (loaded on demand). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const EN = document.documentElement.lang === "en", L = (ar, en) => (EN ? en : ar);
  /* the app opens in the language the visitor chose here */
  try { if (EN) localStorage.setItem("lang", "en"); } catch (e) {}
  document.querySelectorAll("[data-lang]").forEach((a) => a.addEventListener("click", () => { try { localStorage.setItem("lang", a.dataset.lang); } catch (e) {} }));
  const T = (e) => { try { (window.dtrack || function () {})(e); } catch (x) {} };
  const ua = navigator.userAgent || "";
  const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1), isAndroid = /Android/.test(ua);
  const toast = (msg) => { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); };

  /* nav turns solid once the hero is behind us */
  const nav = $("#nav"), hero = $(".hero");
  if (nav && hero && "IntersectionObserver" in window) new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" }).observe(hero);

  /* the visitor's own device comes first */
  const os = isIos ? "ios" : isAndroid ? "android" : "pc";
  const mine = $(`.get__btn[data-os="${os}"]`); if (mine) { mine.classList.add("mine"); mine.parentNode.prepend(mine); }
  const card = $(os === "ios" ? "#osIos" : os === "android" ? "#osAndroid" : "#osPc"); if (card) { card.classList.add("mine"); card.parentNode.prepend(card); }

  /* videos in a modal (nothing downloads until someone presses play) */
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
  

  /* install */
  const info = window.dtrackInfo || { inApp: /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|Snapchat|WhatsApp/i.test(ua), browser: "" };
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) $("#installed").hidden = false;
  if (info.inApp) {
    const names = EN ? { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", snapchat: "Snapchat", whatsapp: "WhatsApp" } : { instagram: "إنستغرام", facebook: "فيسبوك", tiktok: "تيك توك", snapchat: "سناب شات", whatsapp: "واتساب" };
    $("#inapp").hidden = false; $("#inappName").textContent = names[info.browser] || L("تطبيق", "an app");
    if (isAndroid) { const a = $("#openChrome"); a.hidden = false; a.href = "intent://" + location.host + location.pathname + "#Intent;scheme=https;package=com.android.chrome;end";
      $("#inappHow").textContent = L("من هون ما بينزل التطبيق. اضغط «افتح بـ Chrome»، أو ⋮ فوق واختار «فتح في Chrome».", "The app can't be installed from here. Tap “Open in Chrome”, or ⋮ at the top and choose “Open in Chrome”."); }
    else if (isIos) $("#inappHow").textContent = L("من هون ما بينزل التطبيق. اضغط ⋯ أو زر المشاركة فوق واختار «فتح في Safari».", "The app can't be installed from here. Tap ⋯ or Share at the top and choose “Open in Safari”.");
    const bar = document.createElement("div"); bar.className = "inapp-bar"; bar.innerHTML = L('<span>عشان تنزّل دفتر، افتح الصفحة بالمتصفح</span><a href="#download">كيف؟</a>', '<span>To install Daftar, open this page in your browser</span><a href="#download">How?</a>'); document.body.appendChild(bar);
  }
  $("#copyLink").addEventListener("click", async () => { T("copy_link"); const url = location.origin + location.pathname; try { await navigator.clipboard.writeText(url); toast(L("انتسخ الرابط، الصقه بالمتصفح", "Link copied. Paste it in your browser.")); } catch (e) { toast(url); } });
  let deferred = null; const ib = $$(".installBtn");
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; ib.forEach((b) => (b.hidden = false)); });
  ib.forEach((b) => b.addEventListener("click", async () => { T("install_click"); if (!deferred) return; deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; ib.forEach((x) => (x.hidden = true)); }));
  window.addEventListener("appinstalled", () => { T("installed"); $("#installed").hidden = false; ib.forEach((b) => (b.hidden = true)); });
  $$("[data-track]").forEach((a) => a.addEventListener("click", () => T(a.dataset.track)));

  /* iPhone: a guided "Add to Home Screen" with an arrow pointing at Safari's own button */
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const iosSafari = isIos && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) && !info.inApp;
  const iPad = isIos && !/iPhone|iPod/.test(ua);
  const sv = +((/Version\/(\d+)/.exec(ua) || [])[1] || 0), compact = sv >= 26 && !iPad;
  const sysAr = /^ar/i.test(navigator.language || "");
  const SH = '<svg viewBox="0 0 24 24"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
  let ig = null, igFocus = null;
  function guideHTML() {
    const step1 = compact
      ? `<li><b>${L("اضغط <q>⋯</q> تحت جنب الرابط، وبعدين <q>مشاركة</q>", "Tap <q>⋯</q> next to the address at the bottom, then <q>Share</q>")}</b><div class="ig__m ig__bar"><i>‹</i><span class="url">daftarapp.co</span><i class="ig__hot">⋯</i></div></li>`
      : iPad
      ? `<li><b>${L("اضغط زر المشاركة فوق جنب الرابط", "Tap the Share button next to the address at the top")}</b><div class="ig__m ig__bar"><span class="url">daftarapp.co</span><i class="ig__hot">${SH}</i><i>+</i></div></li>`
      : `<li><b>${L("اضغط زر المشاركة تحت", "Tap the Share button at the bottom")}</b><div class="ig__m ig__bar"><i>‹</i><i>›</i><i class="ig__hot">${SH}</i><i>□</i><i>⧉</i></div></li>`;
    const body = iosSafari ? `<ol class="ig__steps">${step1}
      <li><b>${L("انزل شوي واختار <q>إضافة إلى الشاشة الرئيسية</q>", "Scroll down a little and choose <q>Add to Home Screen</q>")}</b><div class="ig__m ig__rows"><span class="ig__hot">${L("إضافة إلى الشاشة الرئيسية", "Add to Home Screen")} ${PLUS}</span><span>${L("إضافة إشارة مرجعية", "Add Bookmark")}</span></div></li>
      <li><b>${L("اضغط <q>إضافة</q> فوق، وخلص!", "Tap <q>Add</q> at the top. Done!")}</b><div class="ig__m"><div class="ig__head"><em>${L("إلغاء", "Cancel")}</em><span>${L("إضافة إلى الشاشة الرئيسية", "Add to Home Screen")}</span><em class="ig__hot">${L("إضافة", "Add")}</em></div></div></li></ol>`
      : `<p class="ig__s">${L("على الآيفون دفتر بينزل من <b>Safari</b> بس. انسخ الرابط وافتحه بـ Safari، وبيطلعلك الشرح.", "On iPhone, Daftar installs from <b>Safari</b> only. Copy the link, open it in Safari, and you'll see the steps.")}</p>`;
    return `<div class="ig__back" data-igclose></div>
      <div class="ig__sheet" role="dialog" aria-modal="true" aria-labelledby="igT"><button class="ig__x" type="button" data-igclose aria-label="${L("سكّر", "Close")}">✕</button>
        <h2 class="ig__t" id="igT">${L("نزّل دفتر على الآيفون", "Get Daftar on your iPhone")}</h2>${iosSafari ? `<p class="ig__s">${L("٣ كبسات، وبيصير عندك أيقونة مثل أي تطبيق.", "Three taps, and it sits on your home screen like any app.")}</p>` : ""}${body}
        <div class="ig__foot">${iosSafari ? `<button class="btn ig__done" type="button" data-igclose>${L("تمام، فهمت", "Got it")}</button>` : `<button class="btn ig__done" type="button" id="igCopy">${L("انسخ الرابط", "Copy link")}</button>`}<button class="btn btn--ghost" type="button" id="igVid">${L("شوف فيديو", "Watch video")}</button></div></div>
      ${iosSafari ? `<div class="ig__arrow" aria-hidden="true"><span>${L("من هون", "Here")}</span><svg viewBox="0 0 44 52"><path d="M22 4v40M8 30l14 14 14-14"/></svg></div>` : ""}`;
  }
  function openGuide() {
    if (!ig) {
      ig = document.createElement("div"); ig.className = "ig" + (iPad ? " ig--top" : compact ? (sysAr ? " ig--left" : " ig--right") : ""); ig.hidden = true; ig.innerHTML = guideHTML(); document.body.appendChild(ig);
      $$("[data-igclose]", ig).forEach((b) => b.addEventListener("click", closeGuide));
      $("#igVid", ig).addEventListener("click", () => { closeGuide(); openVid("iphone"); });
      const c = $("#igCopy", ig); if (c) c.addEventListener("click", async () => { const url = location.origin + location.pathname; try { await navigator.clipboard.writeText(url); toast(L("انتسخ الرابط، الصقه بـ Safari", "Link copied. Paste it in Safari.")); } catch (e) { toast(url); } });
    }
    igFocus = document.activeElement; ig.hidden = false; document.body.classList.add("ig-open"); document.body.style.overflow = "hidden"; $(".ig__x", ig).focus(); T("ios_guide");
  }
  function closeGuide() { if (!ig || ig.hidden) return; ig.hidden = true; document.body.classList.remove("ig-open"); document.body.style.overflow = ""; if (igFocus && igFocus.focus) igFocus.focus(); }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeGuide(); });
  if (isIos && !standalone) {
    const hijack = (el) => el && el.addEventListener("click", (e) => { e.preventDefault(); openGuide(); });
    hijack($('.get__btn[data-os="ios"]')); const o = $("#osIos .btn--light"); if (o) { o.textContent = L("وريني كيف أنزّله", "Show me how"); o.removeAttribute("href"); o.setAttribute("role", "button"); hijack(o); }
    if (!info.inApp) { const pill = document.createElement("button"); pill.type = "button"; pill.className = "ig-pill"; pill.innerHTML = SH.replace("<svg", '<svg aria-hidden="true"') + L("نزّل دفتر على الآيفون", "Get Daftar on iPhone"); pill.addEventListener("click", openGuide); document.body.appendChild(pill); document.body.classList.add("has-igpill");
      const dl = $("#download"); if (dl && "IntersectionObserver" in window) new IntersectionObserver(([e]) => pill.classList.toggle("gone", e.isIntersecting)).observe(dl); }
  }

  { const m = /^#(how-)?(iphone|android|pc|move)$/.exec(location.hash); if (m) setTimeout(() => { if (m[2] === "iphone" && isIos && !standalone) return openGuide(); const s = $(m[2] === "move" ? "#move" : "#download"); if (s) s.scrollIntoView(); openVid(m[2]); }, 300); }

  /* things the owner fills in later (site-data.json): WhatsApp number and real customer reviews; plus a live company count */
  const fmt = (n) => n.toLocaleString(EN ? "en-US" : "ar-JO-u-nu-latn");
  fetch("/get/site-data.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (!d) return;
    const num = String(d.whatsapp || "").replace(/\D/g, "");
    if (num.length >= 9) { const url = "https://wa.me/" + num; $("#waLink").href = url; $("#waBox").hidden = false; const f = $("#waFoot"); if (f) { f.href = url; f.hidden = false; } }
    const revs = (Array.isArray(d.reviews) ? d.reviews : []).filter((r) => r && (EN ? r.text_en || r.text : r.text) && r.name).slice(0, 6);
    if (revs.length) {
      const list = $("#revList");
      revs.forEach((r) => { const f = document.createElement("figure"); f.className = "rev"; const q = document.createElement("blockquote"); q.textContent = EN ? r.text_en || r.text : r.text;
        const c = document.createElement("figcaption"); const b = document.createElement("b"); b.textContent = r.name; c.appendChild(b); const biz = EN ? r.biz_en || r.biz : r.biz; if (biz) { const sp = document.createElement("span"); sp.textContent = biz; c.appendChild(sp); }
        f.append(q, c); list.appendChild(f); });
      $("#reviews").hidden = false;
    }
    const C = window.APP_CONFIG || {}, min = Math.max(1, +d.minCount || 25);
    if (C.SUPABASE_URL && C.SUPABASE_ANON_KEY && !/YOUR-/.test(C.SUPABASE_URL))
      fetch(C.SUPABASE_URL + "/rest/v1/rpc/public_stats", { method: "POST", headers: { apikey: C.SUPABASE_ANON_KEY, Authorization: "Bearer " + C.SUPABASE_ANON_KEY, "Content-Type": "application/json" }, body: "{}" })
        .then((r) => (r.ok ? r.json() : null)).then((j) => { const n = j && +j.companies; if (n >= min) { const p = $("#proof"); p.textContent = L(`أكثر من ${fmt(n)} شركة بتستخدم دفتر`, `Used by ${fmt(n)}+ companies`); p.hidden = false; } }).catch(() => {});
  }).catch(() => {});

  /* Android app file: shown once the first build has been published */
  fetch("/download/android.json", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => {
    if (!j || !j.bytes) return; $("#apkBox").hidden = false; $("#apkSize").textContent = "· " + (j.bytes / 1048576).toFixed(1) + " MB";
  }).catch(() => {});

  /* the assistant: its code and answers load only when someone opens it */
  const ask = $("#askBtn"); let loading = null;
  function loadChat() {
    if (window.DaftarChat) return Promise.resolve();
    const load = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    if (!loading) loading = (EN ? load("/get/chat-en.js?v=1") : Promise.resolve()).then(() => load("/get/chat.js?v=3"));
    return loading;
  }
  ask.addEventListener("click", () => { loadChat().then(() => { window.DaftarChat.open(ask); T("chat_open"); }).catch(() => toast(L("ما قدرنا نفتح المساعد. راسلنا على hello@daftarapp.co", "Couldn't open the assistant. Email hello@daftarapp.co"))); });
})();
