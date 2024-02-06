// Name of the cache
const cacheName = 'firebase-cache';

self.addEventListener('fetch', (event) => {
    // Check if the request is for a file from Firebase storage
    if (event.request.url.includes('firebasestorage.googleapis.com')) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    // Cache miss - fetch from the network
                    return fetch(event.request).then((response) => {
                        // Cache the response
                        return caches.open(cacheName).then((cache) => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    });
                })
        );
    } else {
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
    }
});