/* When Daftar is opened as the installed app (laptop or phone), skip the website and go straight to the app.
   Chrome on a laptop moves the current tab into the new app window right after installing, so we also
   watch for that switch and jump to the sign-in screen. */
(function () {
  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  var installed = function () { return mq("(display-mode: standalone)") || mq("(display-mode: window-controls-overlay)") || mq("(display-mode: minimal-ui)") || mq("(display-mode: fullscreen)") || navigator.standalone === true; };
  var go = function () { if (location.pathname.indexOf("/app/") !== 0) location.replace("/app/"); };
  if (installed()) { go(); return; }
  ["(display-mode: standalone)", "(display-mode: window-controls-overlay)", "(display-mode: minimal-ui)"].forEach(function (q) {
    try { window.matchMedia(q).addEventListener("change", function (e) { if (e.matches) go(); }); } catch (e) {}
  });
  window.addEventListener("appinstalled", function () { var n = 0, t = setInterval(function () { if (installed()) { clearInterval(t); go(); } else if (++n > 20) clearInterval(t); }, 250); });
})();
