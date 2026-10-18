// The app moved to /app/. This old worker (from when the app lived at the site root) removes itself and its cache.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => { e.waitUntil((async () => {
  for (const k of await caches.keys()) if (!k.startsWith("daftar-app-")) await caches.delete(k);
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: "window" })) c.navigate(c.url);
})()); });
