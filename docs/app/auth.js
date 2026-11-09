/* Back from Google. The sign-in tokens are in the address (#…). We hand the refresh token to the
   app through a one-time code it is waiting on, then clear the address. On iPhone this page opens
   in a separate window, so the app (still open behind it) picks the sign-in up by itself. */
(function () {
  "use strict";
  const C = window.APP_CONFIG || {};
  const en = (navigator.language || "").slice(0, 2) === "en" && (function () { try { return localStorage.getItem("lang") === "en"; } catch (e) { return false; } })();
  const T = en
    ? { ok: "Signed in", back: "Go back to the Daftar app now. It will open signed in.", open: "Open Daftar", bad: "Sign-in didn't finish", badSub: "Go back to the app and try again." }
    : { ok: "تمام، دخلت", back: "ارجع هلأ لتطبيق دفتر، رح يفتح وإنت داخل.", open: "افتح دفتر", bad: "ما كمل الدخول", badSub: "ارجع للتطبيق وجرّب مرة ثانية." };
  if (en) { document.documentElement.lang = "en"; document.documentElement.dir = "ltr"; }
  const box = document.getElementById("box");
  const show = (good, title, sub, link) => {
    box.className = "card " + (good ? "ok" : "err");
    box.innerHTML = "";
    const ic = document.createElement("div"); ic.className = "ic"; ic.textContent = good ? "✓" : "!";
    const h = document.createElement("h1"); h.textContent = title;
    const p = document.createElement("p"); p.textContent = sub;
    box.append(ic, h, p);
    if (link) { const a = document.createElement("a"); a.className = "btn"; a.href = "/app/"; a.textContent = T.open; box.append(a); }
  };
  const hash = new URLSearchParams(location.hash.slice(1)), q = new URLSearchParams(location.search);
  const n = q.get("n") || "", rt = hash.get("refresh_token") || "";
  try { history.replaceState(null, "", location.pathname); } catch (e) {}   // never leave tokens in the address or history
  if (!rt || !/^[A-Za-z0-9_-]{40,100}$/.test(n)) { show(false, T.bad, T.badSub, true); return; }
  fetch(C.SUPABASE_URL + "/rest/v1/rpc/oauth_handoff_put", {
    method: "POST", headers: { "content-type": "application/json", apikey: C.SUPABASE_ANON_KEY, authorization: "Bearer " + C.SUPABASE_ANON_KEY },
    body: JSON.stringify({ p_nonce: n, p_token: rt }),
  }).then((r) => {
    if (!r.ok) throw new Error("put " + r.status);
    let same = false; try { same = localStorage.getItem("oauthNonce") === JSON.stringify(n) || localStorage.getItem("oauthNonce") === n; } catch (e) {}
    if (same) { location.replace("/app/"); return; }          // same window as the app: just go back in
    show(true, T.ok, T.back, true);
    try { setTimeout(() => window.close(), 1500); } catch (e) {}
  }).catch(() => show(false, T.bad, T.badSub, true));
})();
