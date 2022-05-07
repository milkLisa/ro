import { openDB } from 'idb'

const DB_NAME = "ro"
const STORE_NAMES = ["monsters", "timers"]

const REQ_OPTIONS = {
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "omit", // include, same-origin, *omit
  headers: { "content-type": "application/json" },
  mode: "no-cors", // no-cors, cors, *same-origin
  referrer: "no-referrer", // *client, no-referrer
}

export async function queryData(url) {
  return fetchApi(url, {
    method: "GET",
    ...REQ_OPTIONS
  })
}

export async function setData(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data), // must match "Content-Type" header
    method: "PUT",
    ...REQ_OPTIONS
  })
}

export async function updateData(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data),
    method: "PATCH",
    ...REQ_OPTIONS
  })
}

export async function deleteData(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data),
    method: "DELETE",
    ...REQ_OPTIONS
  })
}

const fetchApi = async (url, options) => {
  const apiName = url.substring(url.lastIndexOf("/") + 1)
  console.log("fetchApi: ", options.method, url, apiName)

  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      STORE_NAMES.forEach(name => {
        db.createObjectStore(name, { keyPath: "id" })
      })
    }
  })

  try {
    switch(options.method) {
      case "PUT":
      case "PATCH":
        return await fetchApiToIdb(db, apiName, options)
      default:
        return await fetchApiFromIdb(db, apiName)
    }
  } catch (ex) {
    console.log("[Fetch API from network failed]", url, ex)
    return await fetchApiAndStore(db, apiName, url, options)
  }
}

const fetchApiAndStore = async (db, apiName, url, options) => {
  console.log("fetchApiAndStore: ", url)
  const resJson = await fetch(url, options).then(res => res.json())

  if (resJson) {
    const tx = db.transaction(apiName, "readwrite")
    const store = tx.objectStore(apiName)

    // 目前api CRUD都回覆完整陣列, 所以直接清空store重建資料
    store.clear()
    resJson.forEach(obj => store.put(obj))
    tx.done
  }

  return resJson
}

const fetchApiFromIdb = async (db, apiName) => {
  console.log("fetchApiFromIdb", apiName)
  const tx = db.transaction(apiName, "readwrite")
  const arr = await tx.objectStore(apiName).getAll()
  tx.done

  if (arr.length > 0) {
    return arr
  } else {
    throw "No data"
  }
}

const fetchApiToIdb = async (db, apiName, options) => {
  console.log("fetchApiToIdb", apiName)
  const tx = db.transaction(apiName, "readwrite")
  const store = tx.objectStore(apiName)
  const json = JSON.parse(options.body)

  if (options.method == "PUT") {
    store.clear()
    json.forEach(obj => store.put(obj))
  } else {
    store.put(json)
  }

  const newArr = await store.getAll()
  tx.done

  return newArr
}