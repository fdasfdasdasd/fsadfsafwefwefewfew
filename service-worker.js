
const CACHE_NAME = 'zohaib-tracker-v2';

// Since we are using CDNs, we will use a runtime caching strategy.
// This Service Worker intercepts network requests. 
// If the file is in the cache, it serves it (Offline Mode).
// If not, it fetches it from the internet and saves it to the cache for next time.

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim any clients immediately, so the user doesn't need to refresh twice.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response if found
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If both cache and network fail (offline and not cached), show nothing or a fallback.
        // For this app, if they installed it, the cache should have the files.
      });
    })
  );
});
