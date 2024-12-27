//Name des Caches
const CACHE_NAME = 'static-v1';
const offlineAssets = [
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
const uniqueOfflineAssets = [...new Set(offlineAssets)];

// 1. Install-Event - Dateien in den Cache legen
self.addEventListener('install', event => {
    console.log('Service Worker Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log('Service Worker Caching all files');
          return cache.addAll(uniqueOfflineAssets);
        }).catch(error => {
          console.error('Service Worker Caching failed:', error);
        })
      );      
});

// Fetch event: Always serve from cache
self.addEventListener('fetch', event => {
  event.respondWith(
      caches.match(event.request).then(response => {
          return response || new Response('Resource not found in cache');
      })
  );
});

// Activate event: Cleanup old caches if necessary
self.addEventListener('activate', event => {
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return Promise.all(
              cacheNames.map(cacheName => {
                  if (cacheName !== CACHE_NAME) {
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
  console.log('Service Worker activated and old caches cleared');
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