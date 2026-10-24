const PREFIX='lexi-music-safari-startup-';
const CACHE=PREFIX+'v1';
const SHELL=["./", "./index.html", "/music-player/index.html?mode=safari-v3", "/music-player/styles.css?v=20", "/music-player/audio-storage-player.js?v=1", "/music-player/metadata.js?v=1", "/music-player/app-player.js?v=4", "/music-player/player-settings.js?v=1", "/music-player/playlist-enhancements.js?v=7", "/music-player/now-playing-fullscreen-v3.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const request=e.request,url=new URL(request.url),scope=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==scope.origin)return;
 const navigation=request.mode==='navigate'&&url.pathname.startsWith(scope.pathname);
 const resource=SHELL.find(asset=>new URL(asset,scope).pathname===url.pathname);
 if(!navigation&&!resource)return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const saved=await cache.match(navigation?'./index.html':resource);
  if(saved)return saved;
  return fetch(request);
 })());
});
