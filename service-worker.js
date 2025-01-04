//Name des Caches
const CACHE_NAME = 'static-v1';
const urlsToCache = [
  '/Niklas-Nils-new/index.html',
  '/Niklas-Nils-new/style.css',
  '/Niklas-Nils-new/script.js',
  '/Niklas-Nils-new/settings.json',
  '/Niklas-Nils-new/service-worker.js',
  '/Niklas-Nils-new/icons/favicon.svg',
  '/Niklas-Nils-new/icons/favicon.ico',
  '/Niklas-Nils-new/icons/apple-touch-icon.png',
  '/Niklas-Nils-new/icons/512x512.png',
  '/Niklas-Nils-new/icons/192x192.png',
  '/Niklas-Nils-new/icons/96x96.png',
  '/Niklas-Nils-new/bilder/screenshotHandy.png',
  '/Niklas-Nils-new/bilder/screenshotDeskop.png',
  '/Niklas-Nils-new/bilder/dji_fly_20231126_112932_353_1700997032135_photo_optimized.jpg',
];

// Entferne Duplikate
const uniqueUrlsToCache = [...new Set(urlsToCache)];

// 1. Install-Event - Dateien in den Cache legen
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
          console.log('[Service Worker] Caching all files');
          return Promise.all(
              uniqueUrlsToCache.map(url => {
                  return fetch(url)
                      .then(response => {
                          if (!response.ok) {
                              // Log the failed response status
                              throw new Error(`Failed to fetch: ${url} - ${response.status} ${response.statusText}`);
                          }
                          return cache.add(url);
                      })
                      .catch(error => {
                          console.error('[Service Worker] Caching failed for:', url, error);
                      });
              })
          );
      }).catch(error => {
          console.error('[Service Worker] Caching failed:', error);
      })
  );
});

// 2. Fetch-Event - Dateien aus dem Cache abrufen
self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetching', event.request.url);
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          return cachedResponse || fetch(event.request).catch(() => {
            // Optionally, return a fallback page or asset
          });
        })
      );      
});

// 3. Aktivierungs-Event - Alten Cache entfernen
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cache => {
              if (cache !== CACHE_NAME) {
                console.log('[Service Worker] Deleting old cache:', cache);
                return caches.delete(cache).catch(error => {
                  console.error('[Service Worker] Failed to delete cache:', error);
                });
              }
            })
          );
        })
      );      
}); 

// 4. Benachrichtigungen empfangen und anzeigen
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'show-notification') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: '/Niklas-Nils-new/icons/192x192.png',
            vibrate: [200, 100, 200], 
            requireInteraction: true,
        });
    }
});