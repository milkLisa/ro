importScripts("/offline/monstersPreload.js")

const cacheName = "timer-cache-v1"
const CacheNames = [cacheName]

let cacheFiles = new Set([
  "/manifest.json",
  "/static/icons/mvp.png",
  "/static/icons/mini.png",
  "/static/icons/loading.gif",
  "/static/images/egg.png"
])

const noCacheFiles = [
  "/static/audio/default1.mp3",
  "/static/audio/default2.mp3"
]

self.addEventListener("install", event => {
  console.log("[Service Worker] Install")
  self.skipWaiting()
  const preCache = async () => {
    monsters.forEach(monster => cacheFiles.add(`/static/images/${monster.image}`))
    const cache = await caches.open(cacheName)
    return cache.addAll([...cacheFiles])
  }
  event.waitUntil(preCache())
})

self.addEventListener("activate", event => {
  console.log("[Service Worker] Activate Event")
  self.clients.claim()
  const clearCache = async () => {
    const keys = await caches.keys()
    keys.forEach(async (k) => {
      if (!CacheNames.includes(k)) {
        await caches.delete(k)
      }
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
    return event.respondWith(cacheFirstStrategy(event.request))
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

const cacheFirstStrategy = async (request) => {
  return await caches.match(request)
    .then(res => res ? res : fetchRequestAndCache(request))
    .catch(ex => fetchRequestAndCache(request))
}

const fetchRequestAndCache = async (request) => {
  const networkResponse = await fetch(request)
  const clonedResponse = networkResponse.clone()

  if (request.method == "GET") {
    const cache = await caches.open(cacheName)
    cache.put(request, networkResponse)
  }
  return clonedResponse
}