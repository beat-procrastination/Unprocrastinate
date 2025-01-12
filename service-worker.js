//Name des Caches
const CACHE_NAME = 'static-v1';
const urlsToCache = [
  '/Unprocrastinate/index.html',
  '/Unprocrastinate/style.css',
  '/Unprocrastinate/script.js',
  '/Unprocrastinate/settings.json',
  '/Unprocrastinate/service-worker.js',
  '/Unprocrastinate/icons/favicon.svg',
  '/Unprocrastinate/icons/favicon.ico',
  '/Unprocrastinate/icons/appleTouch-icon.png',
  '/Unprocrastinate/icons/512x512.png',
  '/Unprocrastinate/icons/192x192.png',
  '/Unprocrastinate/icons/96x96.png',
  '/Unprocrastinate/bilder/screenshotHandy.png',
  '/Unprocrastinate/bilder/screenshotDeskop.png',
  '/Unprocrastinate/bilder/dji_fly_20231126_112932_353_1700997032135_photo_optimized.jpg',
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
            icon: '/Unprocrastinate/icons/192x192.png',
            vibrate: [200, 100, 200], 
            requireInteraction: true,
        });
    }
});