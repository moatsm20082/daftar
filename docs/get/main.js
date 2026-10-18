/* Daftar download site — motion + install logic. GSAP + ScrollTrigger + ScrollToPlugin (vendor/). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 860px)").matches;
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, window.ScrollToPlugin || {});

  /* ---------- word split for reveal headings (keeps Arabic words whole) ---------- */
  function splitWords(el) {
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
            else { const s = document.createElement("span"); s.className = "w"; s.textContent = p; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
  }
  $$(".reveal-text").forEach(splitWords);

  /* ---------- preloader: real loading of key images + fonts, 12s cap ---------- */
  const bar = $("#preloaderBar"), pct = $("#preloaderPct");
  const critical = ["/get/media/home.webp", "/get/media/radar-full.webp", "/get/media/invoice.webp", "/get/media/today.webp", "/get/media/cheques.webp"];
  let done = 0; const total = critical.length + 1;
  let shown = 0, target = 0, finished = false;
  const bump = () => { done++; target = Math.round((done / total) * 100); };
  critical.forEach(src => { const i = new Image(); i.onload = i.onerror = bump; i.src = src; });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
  const tick = () => {
    shown += Math.max(1, (target - shown) * 0.18);
    if (shown > target) shown = target;
    pct.textContent = Math.round(shown); bar.style.width = shown + "%";
    if (shown >= 100) return finish();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => { target = 100; }, 12000);

  function finish() {
    if (finished) return; finished = true;
    const pre = $("#preloader");
    const go = () => { pre.remove(); document.body.classList.remove("is-loading"); heroIntro(); if (hasGsap) ScrollTrigger.refresh(); };
    if (!hasGsap || reduce) { pre.style.transition = "opacity .4s"; pre.style.opacity = 0; setTimeout(go, 400); return; }
    gsap.timeline({ onComplete: go })
      .to(".preloader__inner > *", { y: -24, opacity: 0, stagger: 0.06, duration: 0.45, ease: "power3.in" })
      .to(pre, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1");
  }

  function heroIntro() {
    if (!hasGsap || reduce) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".hero__tag", { opacity: 1, duration: 0.8 })
      .to(".hero__line > span", { y: 0, duration: 1.1, stagger: 0.12 }, "-=0.6")
      .to(".hero__sub", { opacity: 1, duration: 0.9 }, "-=0.6")
      .to(".hero__ctas", { opacity: 1, duration: 0.9 }, "-=0.7")
      .to(".hero__scroll", { opacity: 1, duration: 0.8 }, "-=0.5")
      .from("#heroPhone", { y: 120, rotateY: -40, opacity: 0, duration: 1.6, ease: "power4.out" }, 0.1)
      .from(".float", { y: 40, opacity: 0, scale: 0.9, stagger: 0.12, duration: 1 }, 0.6);
  }

  /* ---------- canvas helpers ---------- */
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function fitCanvas(c) { const r = c.getBoundingClientRect(); c.width = Math.max(1, r.width * DPR); c.height = Math.max(1, r.height * DPR); return [c.width, c.height]; }

  /* hero: perspective ledger grid flying forward with drifting figures, scrubbed by scroll */
  const hc = $("#heroCanvas"), hx = hc.getContext("2d");
  const FIG = ["6,300", "1,850", "+ 20,000", "45", "162", "− 95", "3,900", "29,016", "08:00", "17:00", "✓", "25", "980", "214", "5/6"];
  const pts = Array.from({ length: mobile ? 26 : 46 }, (_, i) => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), t: FIG[i % FIG.length] }));
  let heroP = 0;
  function drawHero(time) {
    const [w, h] = [hc.width, hc.height]; if (!w) return;
    hx.clearRect(0, 0, w, h);
    const cx = w * (mobile ? 0.5 : 0.32), hor = h * 0.42, travel = heroP * 3 + time * 0.00004;
    // floor grid
    hx.lineWidth = 1 * DPR;
    for (let i = -14; i <= 14; i++) {
      hx.strokeStyle = `rgba(127,160,255,${0.05 + (i === 0 ? 0.05 : 0)})`;
      hx.beginPath(); hx.moveTo(cx + i * w * 0.012, hor); hx.lineTo(cx + i * w * 0.22, h); hx.stroke();
    }
    for (let k = 0; k < 18; k++) {
      const z = ((k / 18) + travel) % 1, y = hor + (h - hor) * Math.pow(z, 2.2);
      hx.strokeStyle = `rgba(127,160,255,${0.02 + z * 0.1})`; hx.beginPath(); hx.moveTo(0, y); hx.lineTo(w, y); hx.stroke();
    }
    // figures
    hx.textAlign = "center"; hx.textBaseline = "middle";
    pts.forEach(p => {
      const z = (p.z + travel * 0.6) % 1, s = 0.25 + z * 1.6;
      const x = cx + p.x * w * 0.6 * s, y = h * 0.42 + p.y * h * 0.5 * s;
      const a = Math.sin(z * Math.PI) * 0.2;
      hx.font = `800 ${Math.round(11 * s * DPR)}px Alexandria, sans-serif`;
      hx.fillStyle = `rgba(160,185,255,${a})`; hx.fillText(p.t, x, y);
    });
  }
  /* idea: faint ruled ledger lines with running totals */
  const lc = $("#ledgerCanvas"), lx = lc.getContext("2d");
  function drawLedger(time) {
    const [w, h] = [lc.width, lc.height]; if (!w) return;
    lx.clearRect(0, 0, w, h);
    const gap = 46 * DPR, off = (time * 0.012 * DPR) % gap;
    lx.font = `600 ${12 * DPR}px Alexandria, sans-serif`; lx.textAlign = "left";
    for (let y = -gap + off, r = 0; y < h + gap; y += gap, r++) {
      lx.strokeStyle = "rgba(127,160,255,.08)"; lx.lineWidth = DPR; lx.beginPath(); lx.moveTo(0, y); lx.lineTo(w, y); lx.stroke();
      lx.fillStyle = "rgba(127,160,255,.14)"; lx.fillText(String((r * 137 + 450) % 9000).replace(/\B(?=(\d{3})+(?!\d))/g, ","), w * 0.06, y - gap / 2);
    }
    lx.strokeStyle = "rgba(206,17,38,.12)"; lx.beginPath(); lx.moveTo(w * 0.16, 0); lx.lineTo(w * 0.16, h); lx.stroke();
  }
  /* break: tiled wall of real app screens */
  const cc = $("#cinCanvas"), cx2 = cc.getContext("2d");
  const wallImgs = ["home", "radar-full", "invoice", "cheques", "stock"].map(n => { const i = new Image(); i.src = `/get/media/${n}.webp`; i.onload = () => drawWall(); return i; });
  function drawWall() {
    const [w, h] = fitCanvas(cc); cx2.fillStyle = "#0A1330"; cx2.fillRect(0, 0, w, h);
    const tw = Math.max(140 * DPR, w / 7), th = tw * 844 / 390, g = 22 * DPR;
    cx2.save(); cx2.translate(w / 2, h / 2); cx2.rotate(-0.12);
    for (let r = -3; r <= 3; r++) for (let c = -5; c <= 5; c++) {
      const im = wallImgs[(r * 3 + c + 50) % 5]; if (!im.complete || !im.naturalWidth) continue;
      const x = c * (tw + g) - tw / 2, y = r * (th + g) - th / 2 + (c % 2 ? th * 0.18 : 0);
      cx2.save(); cx2.beginPath(); if (cx2.roundRect) cx2.roundRect(x, y, tw, th, 22 * DPR); else cx2.rect(x, y, tw, th); cx2.clip();
      cx2.globalAlpha = 0.85; cx2.drawImage(im, x, y, tw, th); cx2.restore();
    }
    cx2.restore();
  }
  let heroOn = true, ledgerOn = false;
  function resize() { fitCanvas(hc); fitCanvas(lc); drawWall(); }
  window.addEventListener("resize", () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 150); });
  resize();
  function loop(time) {
    if (heroOn) drawHero(reduce ? 0 : time);
    if (ledgerOn) drawLedger(reduce ? 0 : time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- download logic (works with or without GSAP) ---------- */
  const T = window.dtrack || function () {};
  const info = window.dtrackInfo || {};
  const ua = navigator.userAgent || "";
  const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const mark = id => { $$(".os").forEach(c => c.classList.remove("mine")); const c = $(id); if (c) c.classList.add("mine"); };
  mark(isIos ? "#osIos" : isAndroid ? "#osAndroid" : "#osPc");
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) $("#installed").hidden = false;
  const toast = msg => { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); };

  // in-app browsers (Instagram, Facebook, TikTok...) can't install: tell people how to get out
  if (info.inApp) {
    const names = { instagram: "إنستغرام", facebook: "فيسبوك", tiktok: "تيك توك", snapchat: "سناب شات", whatsapp: "واتساب" };
    $("#inapp").hidden = false; $("#inappName").textContent = names[info.browser] || "تطبيق";
    if (isAndroid) {
      const a = $("#openChrome"); a.hidden = false;
      a.href = "intent://" + location.host + location.pathname + "#Intent;scheme=https;package=com.android.chrome;end";
      $("#inappHow").textContent = "هالمتصفح ما بيسمح بالتثبيت. اضغط \"افتح بـ Chrome\"، أو ⋮ فوق واختار \"فتح في Chrome\".";
    } else if (isIos) {
      $("#inappHow").textContent = "هالمتصفح ما بيسمح بالتثبيت. اضغط ⋯ أو زر المشاركة فوق واختار \"فتح في Safari\"، أو انسخ الرابط والصقه بـ Safari.";
    }
    const bar = document.createElement("div"); bar.className = "inapp-bar";
    bar.innerHTML = '<span>عشان تنزّل دفتر، افتح الصفحة بالمتصفح</span><a href="#download">كيف؟</a>';
    document.body.appendChild(bar);
  }
  $("#copyLink").addEventListener("click", async () => {
    T("copy_link");
    const url = location.origin + location.pathname;
    try { await navigator.clipboard.writeText(url); toast("انتسخ الرابط ✓ الصقه بالمتصفح"); }
    catch (e) { window.prompt ? window.prompt("انسخ الرابط:", url) : toast(url); }
  });

  let deferred = null;
  const installBtns = $$(".installBtn");
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; installBtns.forEach(b => b.hidden = false); });
  installBtns.forEach(b => b.addEventListener("click", async () => {
    T("install_click");
    if (!deferred) return; deferred.prompt();
    try { await deferred.userChoice; } catch (e) {}
    deferred = null; installBtns.forEach(x => x.hidden = true);
  }));
  window.addEventListener("appinstalled", () => { T("installed"); $("#installed").hidden = false; installBtns.forEach(b => b.hidden = true); });
  $$("[data-track]").forEach(a => a.addEventListener("click", () => T(a.dataset.track)));
  $$(".store").forEach(a => a.addEventListener("click", () => T("store_click")));
  // Marketing page: the installable app has its own service worker under /app/.


  /* install tutorial videos */
  const hm = $("#howModal"), hv = $("#howVideo"), hb = $("#howBox");
  const openHow = k => {
    if (!hm) return; const tall = k !== "pc";
    hb.classList.toggle("tall", tall); hv.poster = `/get/media/how-${k}.jpg`; hv.src = `/get/media/how-${k}.mp4`;
    hm.hidden = false; document.body.style.overflow = "hidden"; hv.play().catch(() => {}); T("video_play");
  };
  const closeHow = () => { hv.pause(); hv.removeAttribute("src"); hv.load(); hm.hidden = true; document.body.style.overflow = ""; };
  $$("[data-how]").forEach(b => b.addEventListener("click", () => openHow(b.dataset.how)));
  $$("[data-close]", hm || document).forEach(b => b.addEventListener("click", closeHow));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && hm && !hm.hidden) closeHow(); });
  { const m = /^#how-(iphone|android|pc)$/.exec(location.hash); if (m) setTimeout(() => { const d = $("#download"); if (d) d.scrollIntoView(); openHow(m[1]); }, 600); }

  // nav + store buttons: smooth scroll, and spotlight the chosen OS card
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href"); const t = id.length > 1 && $(id); if (!t) return;
    e.preventDefault();
    if (hasGsap && !reduce) gsap.to(window, { duration: 1.2, scrollTo: { y: t, offsetY: 20 }, ease: "power3.inOut" });
    else t.scrollIntoView();
    const os = a.dataset.os; if (os) mark(os === "ios" ? "#osIos" : "#osAndroid");
  }));

  /* film */
  const video = $("#filmVideo"), frame = $("#filmFrame");
  $("#filmPlay").addEventListener("click", () => { T("video_play"); video.controls = true; video.play().catch(() => {}); frame.classList.add("playing"); });
  video.addEventListener("ended", () => { video.controls = false; frame.classList.remove("playing"); video.currentTime = 0; video.load(); });

  /* counters */
  function countUp(el) {
    const end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduce || !hasGsap) { el.textContent = end + suf; return; }
    const o = { v: 0 }; gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => el.textContent = Math.round(o.v) + suf });
  }

  /* services: active item at viewport centre (IntersectionObserver, no GSAP needed) */
  const svcs = $$(".svc"), num = $("#svcNum"), shots = $$("#svcScreen img");
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    svcs.forEach(s => s.classList.toggle("active", s === en.target));
    const i = +en.target.dataset.i; num.textContent = String(i + 1).padStart(2, "0");
    shots.forEach(im => im.classList.toggle("on", +im.dataset.i === i));
  }), { rootMargin: "-48% 0px -48% 0px" });
  svcs.forEach(s => io.observe(s));
  svcs[0].classList.add("active");

  if (!hasGsap || reduce) {
    $$(".stat__n").forEach(countUp);
    $$(".reveal-text .w").forEach(w => w.style.opacity = 1);
    lc.style.opacity = 0.6; ledgerOn = true;
    return;
  }

  /* ---------- scroll choreography ---------- */
  const phone = $("#heroPhone");
  gsap.set(phone, { rotateY: mobile ? -14 : 24, rotateX: 10, transformPerspective: 1400 });
  const floats = $$(".float");
  gsap.timeline({ scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom bottom", scrub: true, pin: ".hero__pin", pinSpacing: false,
      onUpdate: s => { heroP = s.progress; }, onToggle: s => { heroOn = s.isActive || s.progress < 1; } } })
    .to("#heroContent", { y: -140, scale: 0.92, opacity: 0, ease: "none" }, 0)
    .to(".hero__scroll", { opacity: 0, ease: "none", duration: 0.2 }, 0)
    .to(phone, { rotateY: mobile ? 8 : -10, rotateX: 0, scale: lowEnd ? 1 : (mobile ? 1.12 : 1.18), x: mobile ? 0 : "8vw", y: mobile ? "-18vh" : 0, ease: "none" }, 0)
    .to(".hero__glow", { opacity: 0.45, ease: "none" }, 0);
  floats.forEach(f => gsap.to(f, { y: -260 * (+f.dataset.depth), x: (f.classList.contains("f2") || f.classList.contains("f4") ? -1 : 1) * 60 * (+f.dataset.depth), opacity: 0, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "60% top", scrub: true } }));

  // clip-path transition
  const vt = gsap.timeline({ scrollTrigger: { trigger: "#vt", start: "top top", end: "bottom bottom", scrub: 0.6 } });
  vt.to("#vtFrame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 1 }, 0)
    .to("#vtWall", { scale: lowEnd ? 1.1 : 1, rotate: -2, xPercent: 6, ease: "none", duration: 1.6 }, 0)
    .to(".vt-word", { opacity: 1, y: 0, stagger: 0.18, duration: 0.35, ease: "power3.out" }, 0.55)
    .to(".vt-dot", { opacity: 1, scale: 1, stagger: 0.18, duration: 0.25, ease: "back.out(3)" }, 0.65)
    .to([".vt-word", ".vt-dot"], { opacity: 0, y: -60, stagger: 0.06, duration: 0.3, ease: "power2.in" }, 1.35)
    .to("#vtFrame", { clipPath: "inset(6% 5% 6% 5% round 28px)", ease: "none", duration: 0.35 }, 1.4);

  // idea
  ScrollTrigger.create({ trigger: "#idea", start: "top bottom", end: "bottom top", onToggle: s => { ledgerOn = s.isActive; } });
  gsap.to("#ledgerCanvas", { opacity: 0.7, ease: "none", scrollTrigger: { trigger: "#idea", start: "top 80%", end: "top 20%", scrub: true } });
  $$(".reveal-text").forEach(el => gsap.to($$(".w", el), { opacity: 1, stagger: 0.08, ease: "none",
    scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: 0.6 } }));
  $$(".reveal-up").forEach(el => gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
  $$(".stat__n").forEach(el => ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => countUp(el) }));

  // film
  gsap.to("#filmFrame", { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: "#film", start: "top 85%", end: "center 60%", scrub: true } });

  // cinematic break
  const cnt = $("#cinCount");
  gsap.timeline({ scrollTrigger: { trigger: "#break", start: "top top", end: "bottom bottom", scrub: 0.6,
      onUpdate: s => { cnt.textContent = String(Math.min(100, Math.round(s.progress * 100 / 0.6))).padStart(2, "0"); } } })
    .to("#cinFrame", { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 0.6 }, 0)
    .to("#cinCanvas", { scale: lowEnd ? 1.2 : 1, ease: "none", duration: 0.8 }, 0)
    .to(".cin-line", { opacity: 1, y: 0, stagger: 0.12, duration: 0.25, ease: "power3.out" }, 0.35)
    .to(".cin-line", { opacity: 0, y: -80, stagger: 0.08, duration: 0.2, ease: "power2.in" }, 0.85);

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
