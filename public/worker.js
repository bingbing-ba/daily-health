importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDyTgXGnB_DYnxC_6l2dfpie-eG7YrS7sg",
  authDomain: "daily-health-e6043.firebaseapp.com",
  databaseURL: "https://daily-health-e6043.firebaseio.com",
  projectId: "daily-health-e6043",
  storageBucket: "daily-health-e6043.appspot.com",
  messagingSenderId: "86351689997",
  appId: "1:86351689997:web:aab10a409ad41496fed844",
  measurementId: "G-S637PK27PP"
}
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

const CACHE_NAME = 'daily-health'
const urlsToCache = ['/']

self.addEventListener('install', (event) => {
  self.skipWaiting()
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
