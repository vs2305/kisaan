/* Kisan Suraksha — offline cache.
   Everything the app needs (HTML, CSS, JS, SVG icons) lives inside the one
   page file, so caching just that page is enough for full offline use. */
const CACHE = 'kisan-suraksha-v1';
const APP_URL = self.registration.scope; // the folder this file was registered from

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.add(APP_URL))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(APP_URL));
    })
  );
});
