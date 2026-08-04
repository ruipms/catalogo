const cacheName = "catalogo-cache-v1";
const filesToCache = [
  "/",
  "/index.html",
  "/styles/style.css",
  "/categorias/sai-sempre.html",
  "/categorias/doces.html",
  "/categorias/expendedores.html",
  "/categorias/eletronicos-infantis.html",
  "/categorias/diversao.html"
];

// Instala o service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

// Ativa e limpa caches antigos
self.addEventListener("activate", event => {
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

// Intercepta pedidos e serve do cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
