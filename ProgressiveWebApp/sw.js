// This is a Service Worker for demo purposes
// It's using the Cache-first technique with Stale-while-revalidate
// Every resource is updated in the cache; so if you make changes
// double reload your webapp

var urls = ["./", "info.html", "calc.js", "styles.css",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
    "https://unpkg.com/pwacompat"];

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open("calculator").then(function(cache) {
        return cache.addAll(urls);
    }));
});

// Stale while revalidate cache pattern
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Even if the response is in the cache, we fetch it
                // and update the cache for future usage
                var fetchPromise = fetch(event.request).then(
                    function(networkResponse) {
                        caches.open("calculator").then(function(cache) {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    })
                    .catch(function() {
                        console.log("We couldn't fetch a resource. Maybe offline?")
                    });
                // We use the currently cached version if it's there
                return response || fetchPromise;
            })
        );
    }); 

