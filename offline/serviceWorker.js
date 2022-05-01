const cacheName="timer-cache-v1"
const CacheNames=[
  cacheName,
]

const appShellFiles=[
  "/"
]

self.addEventListener("install", event => {
  console.log("[Service Worker] Install")
  self.skipWaiting()
  const preCache = async () => {
    const cache = await caches.open(cacheName)
    return cache.addAll(appShellFiles)
  }
  event.waitUntil(preCache())
})

self.addEventListener("fetch", event => {
  console.log("[Service Worker] Fetch url: ", event.request.url)
  return event.respondWith(networkFirstStrategy(event.request))
})

self.addEventListener("activate", (event) => {
    console.log("[Service Worker] From SW: Activate Event")
    self.clients.claim()
    const clearCache = async () => {
        const keys = await caches.keys()
        keys.forEach(async (k) => {
            if (CacheNames.includes(k)) {
                return
            }
            await caches.delete(k)
        })
    }
    event.waitUntil(clearCache())
})

const cacheFirstStrategy = async (request) => {
  const cacheResponse = await caches.match(request)
  return cacheResponse || fetchRequestandCache(request)
}

const networkFirstStrategy = async (request) => {
  try {
    return await fetchRequestandCache(request)
  } catch (ex) {
    console.log(`[Catch] Fetch ${ request.url } : ${ ex.message }`)
    return await caches.match(request)
  }
}

const fetchRequestandCache = async (request) => {
  const networkResponse = await fetch(request)
  const clonedResponse = networkResponse.clone()
  const cache = await caches.open(cacheName)
  cache.put(request, networkResponse)
  return clonedResponse
}