/* NestLearn service worker v2 — network-first for HTML/JS/CSS/data (the v1
   cache-first handler kept serving the old app.js after deploys, and mixed
   old JS with new CSS); cache-first only for immutable fonts/icons. */
const VERSION = 'nestlearn-shell-v2';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'data/lessons.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon.png',
  'fonts/Vazirmatn-Regular.woff2',
  'fonts/Vazirmatn-Medium.woff2',
  'fonts/Vazirmatn-SemiBold.woff2',
  'fonts/Vazirmatn-Bold.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var immutable = /\.(woff2|png|ico)$/.test(url.pathname);
  if (immutable) {
    // fonts/icons never change: cache-first is fine
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((cached) => {
        var network = fetch(e.request).then((res) => {
          if (res.ok && url.origin === self.location.origin) {
            var copy = res.clone();
            caches.open(VERSION).then((c) => c.put(e.request, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }
  // pages, scripts, styles, data: network first, cache only when offline
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok && url.origin === self.location.origin) {
        var copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
