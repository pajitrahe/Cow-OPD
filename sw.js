/* Service worker: keeps the app shell and libraries on the phone so the app opens without signal.
   Firestore and sign-in traffic are never intercepted; Firestore keeps its own offline cache. */
const VERSION = 'ctr-v303';
const SHELL = ['./', './index.html', './firebase-config.js', './manifest.webmanifest',
  './icons/cowopd-192.png', './icons/cowopd-512.png', './icons/cowopd-apple.png',
  './THSarabunNew.ttf', './THSarabunNew-Bold.ttf'];
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))).then(() => Promise.all(LIBS.map(u => c.add(u).catch(() => null))))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
const BYPASS = /firestore\.googleapis\.com|identitytoolkit|securetoken|googleapis\.com\/(identity|token)|\/__\/auth\//;
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || BYPASS.test(req.url)) return;
  const url = new URL(req.url);
  if (url.pathname.endsWith('/seed/seed.json')) return; // always from network
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin && (req.mode === 'navigate' || /\.(html|js|webmanifest)$/.test(url.pathname))) {
    // network first so updates arrive, cache as fallback when offline
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  // libraries, fonts, icons: cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
    return r;
  })));
});
