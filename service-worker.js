// Name des Caches
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
                              throw new Error(`Failed to fetch: ${url} - ${response.status} ${response.statusText}`); //Logge den Error. 
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

// 4. Benachrichtigungen empfangen und anzeigen (Service Worker)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'show-notification') {
      // Feature-Check für Safari/iOS hinzufügen
      if (self.registration && typeof self.registration.showNotification === 'function') {
          self.registration.showNotification(event.data.title, {
              body: event.data.body,
              icon: '/Unprocrastinate/icons/192x192.png',
              vibrate: [200, 100, 200],
              requireInteraction: true,
              renotify: true,
              priority: 'high',
              data: {
                url:'https://beat-procrastination.github.io/Unprocrastinate/'
              }
          });
      } 
      else {
          // Fallback für Browser ohne Service-Worker-Notifications
          console.warn('Service-Worker-Benachrichtigungen werden nicht unterstützt');
          
          // Optional: Direkte Notification-API als Fallback (funktioniert in Safari nur nach Nutzerinteraktion)
          if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(event.data.title, {
                  body: event.data.body,
                  icon: '/Unprocrastinate/icons/192x192.png'
              });
          }}
      }
});

// 5. Benachrichtigungs-Klick-Event
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clients => {
            const appClient = clients.find(c => c.url.includes('https://beat-procrastination.github.io/Unprocrastinate/'));
      
            if (appClient) {
                return appClient.focus();
            } else {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});