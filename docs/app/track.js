/* إحصائيات مجهولة: رقم عشوائي للجهاز بس، بدون IP أو أي معلومة شخصية. */
(function () {
  "use strict";
  var C = window.APP_CONFIG || {};
  if (!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY || /YOUR-/.test(C.SUPABASE_URL)) { window.dtrack = function () {}; return; }
  var ua = navigator.userAgent || "";
  var vid;
  try { vid = localStorage.getItem("dvid"); } catch (e) {}
  if (!vid || !/^[a-z0-9]{8,40}$/.test(vid)) {
    vid = Array.from((window.crypto || {}).getRandomValues ? crypto.getRandomValues(new Uint8Array(12)) : [Date.now() % 256]).map(function (b) { return (b % 36).toString(36); }).join("") + Date.now().toString(36);
    try { localStorage.setItem("dvid", vid); } catch (e) {}
  }
  var os = /Android/i.test(ua) ? "android" : (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) ? "ios" : /Windows/i.test(ua) ? "windows" : /Mac OS X/i.test(ua) ? "mac" : /Linux/i.test(ua) ? "linux" : "other";
  var br = /Instagram/i.test(ua) ? "instagram" : /FBAN|FBAV|FB_IAB/i.test(ua) ? "facebook" : /musical_ly|BytedanceWebview|TikTok/i.test(ua) ? "tiktok" : /Snapchat/i.test(ua) ? "snapchat" : /WhatsApp/i.test(ua) ? "whatsapp"
    : /SamsungBrowser/i.test(ua) ? "samsung" : /Edg\//.test(ua) ? "edge" : /Firefox|FxiOS/.test(ua) ? "firefox" : /Chrome|CriOS/.test(ua) ? "chrome" : /Safari/.test(ua) ? "safari" : "other";
  var ref = "direct";
  try { if (document.referrer) { var h = new URL(document.referrer).hostname; if (h !== location.hostname) ref = h.replace(/^www\./, "").replace(/^l\./, "").replace(/^lm\./, "").replace(/^m\./, ""); } } catch (e) {}
  try { var u = new URLSearchParams(location.search).get("from") || new URLSearchParams(location.search).get("utm_source"); if (u) ref = u.toLowerCase().slice(0, 40); } catch (e) {}
  var page = /\/get\/?/.test(location.pathname) ? "get" : "app";
  window.dtrack = function (type) {
    try {
      fetch(C.SUPABASE_URL + "/rest/v1/rpc/log_site_event", {
        method: "POST", keepalive: true,
        headers: { "Content-Type": "application/json", apikey: C.SUPABASE_ANON_KEY, Authorization: "Bearer " + C.SUPABASE_ANON_KEY },
        body: JSON.stringify({ p_type: type, p_vid: vid, p_os: os, p_browser: br, p_ref: ref, p_page: page })
      }).catch(function () {});
    } catch (e) {}
  };
  window.dtrackInfo = { os: os, browser: br, inApp: /instagram|facebook|tiktok|snapchat|whatsapp/.test(br) };
  var standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (page === "app") {
    if (standalone) { var k; try { k = localStorage.getItem("dinst"); } catch (e) {} if (!k) { window.dtrack("app_open_installed"); try { localStorage.setItem("dinst", "1"); } catch (e) {} } }
  } else {
    var s; try { s = sessionStorage.getItem("dvis"); } catch (e) {}
    if (!s) { window.dtrack("visit"); try { sessionStorage.setItem("dvis", "1"); } catch (e) {} }
  }
})();
