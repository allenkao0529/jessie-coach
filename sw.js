// Service Worker — cache the app shell for offline access
// and enable Android "Add to Home Screen" install prompt.
var CACHE_NAME = 'jessie-coach-v1';
var ASSET_URLS = [
  '/',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600;800&family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// Install: cache the app shell
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSET_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; }).map(function(n) {
          return caches.delete(n);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(res) {
      return res || fetch(event.request);
    })
  );
});
