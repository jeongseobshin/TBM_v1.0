const CACHE = 'tbm-mgmt-v18';
const ASSETS = ['./','./index.html','./tbm_app.js','./app-config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 서버 함수/API, 비-GET, 타 출처 요청은 서비스워커가 절대 가로채지 않음(항상 네트워크)
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/.netlify/')) return;
  // 정적 자산만 캐시. 실패해도 HTML로 대체하지 않음(그래야 JSON 응답이 오염되지 않음)
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      }
      return res;
    }))
  );
});
