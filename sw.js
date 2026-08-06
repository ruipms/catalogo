const cacheName = "catalogo doces";
const filesToCache = [
  "/catalogo/",
  "/catalogo/index.html",
  "/catalogo/styles/style.css",
  "/catalogo/categorias/sai-sempre.html",
  "/catalogo/categorias/doces.html",
  "/catalogo/categorias/expendedores.html",
  "/catalogo/categorias/eletronicos-infantis.html",
  "/catalogo/categorias/diversao.html"
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
