importScripts("/offline/monstersPreload.js")

const cacheName = "timer-cache-v1"
const CacheNames = [cacheName]

let cacheFiles = [
  "/manifest.json",
  "/static/icons/mvp.png",
  "/static/icons/mini.png"
]

monsters.forEach(mon => 
  cacheFiles.push(`/static/images/${mon.image}`)
)

const noCacheFiles = [
  "/static/audio/default1.mp3",
  "/static/audio/default2.mp3"
]

self.addEventListener("install", event => {
  console.log("[Service Worker] Install")
  self.skipWaiting()
  const preCache = async () => {
    const cache = await caches.open(cacheName)
    return cache.addAll(cacheFiles)
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
  const url = event.request.url
  const requestUrl = new URL(url)
  const requestPath = requestUrl.pathname
  if (url.indexOf("analytics") > -1 ||
      requestPath.indexOf("/api/") > -1 ||
      noCacheFiles.indexOf(requestPath) > -1) {
    return event.respondWith(networkFetch(event.request))
  } else {
    console.log("[Service Worker] Fetch url: ", url)
    return event.respondWith(networkFirstStrategy(event.request))
  }
})

const networkFetch = async (request) => {
  try {
    return await fetch(request)
  } catch (ex) {
    return new Response(undefined, {
      "status": 304, "statusText": ex.message
    })
  }
}

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

  if (request.method !== "HEAD") {
    const cache = await caches.open(cacheName)
    cache.put(request, networkResponse)
  }
  return clonedResponse
}