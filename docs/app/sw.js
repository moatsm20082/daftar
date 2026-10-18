// Service worker: يخلّي التطبيق يفتح بسرعة وينزل على الشاشة.
// بيخزّن ملفات الموقع بس — أبداً ما بيخزّن بيانات الشركات (طلبات Supabase بتروح للنت دايماً).
const CACHE = "daftar-app-v4";
const SHELL = ["./", "index.html", "privacy.html", "style.css", "app.js", "config.js", "vendor/supabase.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "fonts/plex-arabic-400.woff2", "fonts/plex-arabic-500.woff2", "fonts/plex-arabic-700.woff2", "fonts/alexandria-arabic-600-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return;   // Supabase وغيره: مباشرة للنت
  // network-first حتى التحديثات توصل فوراً، والكاش للفتح بدون نت
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});

// إشعارات: بتيجي من سيرفر دفتر بس (مشفّرة بمفتاح هالجهاز)
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const url = typeof d.url === "string" && /^\/[A-Za-z0-9/_\-.?=&#]*$/.test(d.url) ? d.url : "/app/";
  const en = d.lang === "en";
  e.waitUntil(self.registration.showNotification(String(d.title || (en ? "Daftar" : "دفتر")).slice(0, 120), {
    body: String(d.body || "").slice(0, 900), icon: "icons/icon-192.png", badge: "icons/favicon-32.png",
    tag: String(d.tag || "daftar").slice(0, 40), renotify: true, data: { url }, dir: en ? "ltr" : "rtl", lang: en ? "en" : "ar"
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "/app/", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.startsWith(self.location.origin + "/app/") && "focus" in w) return w.focus();
    return self.clients.openWindow(url);
  }));
});
