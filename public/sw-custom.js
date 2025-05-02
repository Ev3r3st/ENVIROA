self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((k) => {
            if (!k.startsWith("workbox-") /* && k !== CUSTOM_CACHE_NAME */) {
              console.log("Deleting old cache:", k);
              return caches.delete(k);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log("Claiming clients...");
        return self.clients.claim();
      })
  );
});