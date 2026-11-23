// 每日發病 PWA 離線快取；不儲存或上傳吐槽文字。
const CACHE="daily-comic-shell-v2";
const RUNTIME="daily-comic-runtime-v2";
const SHELL=["./","./index.html","./styles.css","./app.js","./data/comics.json","./data/quips.json","./manifest.webmanifest","./assets/app-icon.svg","./assets/apple-touch-icon.png"];
self.addEventListener("install",e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
 e.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==RUNTIME).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener("fetch",e=>{
 const req=e.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return; // 個人輸入絕不從 SW 傳送到外站
 if(req.mode==="navigate"||/\.(json|js|css|html)$/.test(url.pathname)){
  e.respondWith(
   fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(RUNTIME).then(cache=>cache.put(req,copy)).catch(()=>{});}
    return res;
   }).catch(async()=>await caches.match(req)||await caches.match("./index.html"))
  );
 }else{
  e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
   if(res.ok){const copy=res.clone();caches.open(RUNTIME).then(cache=>cache.put(req,copy)).catch(()=>{});}
   return res;
  })));
 }
});