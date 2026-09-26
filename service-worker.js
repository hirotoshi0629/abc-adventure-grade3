const CACHE_NAME="abc-adventure-grade3-v18";
const CORE=[
 "./",
 "./index.html",
 "./assets/homejpg/p0.txt",
 "./assets/abc-master-home-web.jpg",
 "./assets/audio/alphabet-sprite.mp3?v=20260926-3"
];
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await Promise.all(CORE.map(async url=>{try{const r=await fetch(url,{cache:"reload"});if(r.ok)await cache.put(url,r.clone())}catch(e){}}));
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 if(event.request.mode==="navigate"){
  event.respondWith((async()=>{
   try{
    const fresh=await fetch(event.request);
    if(fresh.ok){const c=await caches.open(CACHE_NAME);c.put("./index.html",fresh.clone())}
    return fresh;
   }catch(e){
    return (await caches.match("./index.html"))||(await caches.match("./"))||Response.error();
   }
  })());
  return;
 }
 event.respondWith((async()=>{
  const cached=await caches.match(event.request,{ignoreSearch:false});
  if(cached)return cached;
  try{
   const fresh=await fetch(event.request);
   if(fresh.ok){const c=await caches.open(CACHE_NAME);c.put(event.request,fresh.clone())}
   return fresh;
  }catch(e){
   return Response.error();
  }
 })());
});