// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/Erinnerungen.html',
                '/HallofShame.html',
                '/TimeBlocking.html',
                '/Timer.html',
                '/styles.css',
                '/script.js',
                '/manifest.json',
                '/icon-192x192.png',
                '/icon-512x512.png'
            ]);
        })
    );
});
