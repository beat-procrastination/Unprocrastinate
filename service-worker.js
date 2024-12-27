//Name des Caches
const CACHE_NAME = 'static-v1';
const urlsToCache = [
    '/index.html',
    '/Erinnerungen.html',
    '/HallofShame.html',
    '/TimeBlocking.html',
    '/Timer.html',
    '/style.css',
    '/script.js',
    '/settings.json',
    '/service-worker.js',
    '/icons/favicon.svg',
    '/icons/favicon.ico',
    '/icons/apple-touch-icon.png',
    '/icons/512x512.png',
    '/icons/192x192.png',
    '/icons/96x96.png',
    '/bilder/screenshotHandy.png',
    '/bilder/screenshotDeskop.png',
    '/bilder/dji_fly_20231126_112932_353_1700997032135_photo_optimized.jpg',
];

// Entferne Duplikate
const uniqueUrlsToCache = [...new Set(urlsToCache)];

// 1. Install-Event - Dateien in den Cache legen
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log('[Service Worker] Caching all files');
          return cache.addAll(uniqueUrlsToCache);
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
    console.log("f");
    if (event.data && event.data.type === 'show-notification') {
         console.log("a");
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: '/Niklas-Nils-new/icons/192x192.png',
        });
    }
});