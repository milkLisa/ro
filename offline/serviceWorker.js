const cacheName = "timer-cache-v1"
const CacheNames = [cacheName]

const appShellFiles=[
  //"/"
]

const freshFileNames = [
  //"manifest.json"
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

self.addEventListener("activate", event => {
    console.log("[Service Worker] Activate Event")
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

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url)
  const requestPath = requestUrl.pathname
  const fileName = requestPath.substring(requestPath.lastIndexOf("/") + 1)
  if (freshFileNames.indexOf(fileName) > -1 ||
      requestPath.indexOf("/api/") > -1) {
    return event.respondWith(fetch(event.request))
  } else {
    console.log("[Service Worker] Fetch url: ", event.request.url)
    return event.respondWith(networkFirstStrategy(event.request))
  }
})

const networkFirstStrategy = async (request) => {
  try {
    return await fetchRequestAndCache(request)
  } catch (ex) {
    return await caches.match(request)
  }
}

const fetchRequestAndCache = async (request) => {
  const networkResponse = await fetch(request)
  const clonedResponse = networkResponse.clone()
  const cache = await caches.open(cacheName)
  cache.put(request, networkResponse)
  return clonedResponse
}