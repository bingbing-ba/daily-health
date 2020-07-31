const CACHE_NAME = 'daily-health'
const urlsToCache = ['/']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request)
    })
  )
})

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['daily-health']
  event.waitUntil(
    caches.keys().then((cacheName) => {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        return caches.delete(cacheName)
      }
    })
  )
})
