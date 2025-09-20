const CACHE = 'drums-v1';
const PRECACHE_URLS = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.wasm',
  'https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/hand_landmarker.task'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (req.method === 'GET' && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
      }
      return res;
    }))
  );
});
