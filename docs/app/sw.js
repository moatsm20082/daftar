// Service worker: يخلّي التطبيق يفتح بسرعة وينزل على الشاشة.
// بيخزّن ملفات الموقع بس — أبداً ما بيخزّن بيانات الشركات (طلبات Supabase بتروح للنت دايماً).
const CACHE = "daftar-app-v3";
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
