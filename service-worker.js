// Name of the cache
const cacheName = 'firebase-cache';

// Install event
let audioList = [];

self.addEventListener('message', (event) => {
    // Update the audioList variable when a message is received
    if (event.data && event.data.audioList) {
        audioList = event.data.audioList;
    }
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            // Fetch each audio file and add the response to the cache
            const fetchAndCacheAudioFile = url => fetch(url).then(response => cache.put(url, response)).catch(error => {
                console.error('Fetching failed:', error);
                throw error;
            });
            return Promise.all(audioList.map(fetchAndCacheAudioFile));
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Check if the request is for an audio file
    if (event.request.url.includes('/audio')) {
        event.respondWith(
            caches.open(cacheName).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        // Cache hit - return response
                        return response;
                    } else {
                        // Cache miss - fetch from the network and cache the response
                        return fetch(event.request, { mode: 'no-cors' }).then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        });
                    }
                });
            })
        );
    } else {
        // For non-audio requests, serve as usual
        event.respondWith(fetch(event.request, { mode: 'no-cors' }));
    }
});
// Check the cache when the Service Worker is activated
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.open('firebase-cache').then((cache) => {
            return cache.keys().then((requests) => {
                return Promise.all(
                    requests.map(request =>
                        cache.match(request).then(response =>
                            response.blob().then(blob => blob.size)
                        )
                    )
                ).then(sizes => {
                    const totalSize = sizes.reduce((total, size) => total + size, 0);
                    console.log(`Total cache size: ${totalSize} bytes`);
                });
            });
        })
    );
});