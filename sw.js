const cacheName = "catalogo com ficheiro txt";

// Apenas ficheiros seguros para cache
const filesToCache = [
  "/catalogo/styles/style.css"
];

// Instala o SW e força ativação imediata
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

// Ativa o SW e remove caches antigos
self.addEventListener("activate", event => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      )
    )
  );
});

// Intercepta pedidos
self.addEventListener("fetch", event => {
  const request = event.request;

  // HTML → nunca usar cache
  if (request.destination === "document") {
    return event.respondWith(fetch(request));
  }

  // CSS e imagens → cache first
  event.respondWith(
    caches.match(request).then(response => {
      return (
        response ||
        fetch(request, { cache: "no-store" }).then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});
