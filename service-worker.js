// Name of the cache
const cacheName = 'audio-cache';

// Files to cache
let filesToCache = [];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});