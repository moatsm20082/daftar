// Admin console: support alerts only. Caches nothing (the console always loads fresh).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const url = typeof d.url === "string" && /^\/[A-Za-z0-9/_\-.?=&#]*$/.test(d.url) ? d.url : self.registration.scope;
  e.waitUntil(self.registration.showNotification(String(d.title || "دفتر · الدعم").slice(0, 120), {
    body: String(d.body || "").slice(0, 900), icon: "/app/icons/icon-192.png", badge: "/app/icons/favicon-32.png",
    tag: String(d.tag || "support").slice(0, 60), renotify: true, requireInteraction: false, data: { url }, dir: "rtl", lang: "ar" }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || self.registration.scope, self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.startsWith(self.registration.scope) && "focus" in w) { w.navigate(url).catch(() => {}); return w.focus(); }
    return self.clients.openWindow(url);
  }));
});
