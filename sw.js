const CACHE = 'job-plan-v2';
const ASSETS = ['/job-plan/', '/job-plan/index.html', '/job-plan/itu-pa-calculator.html', '/job-plan/trauma-pa-calculator.html', '/job-plan/icon.svg', '/job-plan/manifest.json', '/job-plan/manifest-itu.json', '/job-plan/manifest-trauma.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network-first for same-origin pages so updates show up; fall back to cache when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request))
  );
});
