import { openDB } from 'idb'

const DB_NAME = "ro"
const STORE_NAMES = ["monsters", "timers", "settings"]

const REQ_OPTIONS = {
  cache       : "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials : "omit", // include, same-origin, *omit
  headers     : { "content-type": "application/json" },
  mode        : "same-origin", // no-cors, cors, *same-origin
  referrer    : "no-referrer", // *client, no-referrer
}

export async function query(urls) {
  if (typeof urls === "string") {
    return fetchApi(urls, {
      method: "GET",
      ...REQ_OPTIONS
    })
  } else {
    return new Promise(async (resolve, reject) => {
      let data = {}
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        const apiName = url.substring(url.lastIndexOf("/") + 1)
        await fetchApi(url, {
          method: "GET",
          ...REQ_OPTIONS
        }).then(result => data[apiName] = result)

        if (i == urls.length - 1) resolve(data)
      }
    })
  }
}

export async function add(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data), // must match "Content-Type" header
    method: "POST",
    ...REQ_OPTIONS
  })
}

export async function renew(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data), // must match "Content-Type" header
    method: "PUT",
    ...REQ_OPTIONS
  })
}

export async function update(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data),
    method: "PATCH",
    ...REQ_OPTIONS
  })
}

export async function del(url, data) {
  return fetchApi(url, {
    body: JSON.stringify(data),
    method: "DELETE",
    ...REQ_OPTIONS
  })
}

const fetchApi = async (url, options) => {
  const apiName = url.substring(url.lastIndexOf("/") + 1)
  console.log("Fetch API: ", apiName)

  let isDBSupport = true
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      STORE_NAMES.forEach(name => {
        db.createObjectStore(name, { keyPath: "id" })
      })
    }
  }).catch(err => {
    isDBSupport = false
    console.log("IndexedDB Error: ", err.message)
  })

  // Firefox private browsing is not support IndexedDB
  if (!isDBSupport) {
    return await fetchFromNetwork(url, options)
  } 

  try {
    return (options.method == "GET")
      ? (await fetchFromIdb(db, apiName))
      : (await updateToIdb(db, apiName, options))
  } catch (ex) {
    console.log("Fetch API from network failed: ", url, ex)
    return await fetchApiAndStore(db, apiName, url, options)
  }
}

const fetchFromNetwork = async (url, options) => {
  try {
    return await fetch(url, options).then(res => res.json())
  } catch (ex) {
    return null
  }
}

const fetchApiAndStore = async (db, apiName, url, options) => {
  const resJson = await fetchFromNetwork(url, options)

  if (resJson && resJson.length) {
    const tx = db.transaction(apiName, "readwrite")
    const store = tx.objectStore(apiName)

    // Api CRUD都回覆完整陣列, 所以直接清空store重建資料
    store.clear()
    resJson.forEach(obj => store.put(obj))
    tx.done
  }

  return resJson
}

const fetchFromIdb = async (db, apiName) => {
  const tx = db.transaction(apiName, "readwrite")
  const arr = await tx.objectStore(apiName).getAll()
  tx.done

  if (arr.length > 0) {
    return arr
  } else {
    throw "No data"
  }
}

const updateToIdb = async (db, apiName, options) => {
  const tx = db.transaction(apiName, "readwrite")
  const store = tx.objectStore(apiName)
  const json = JSON.parse(options.body)

  switch(options.method) {
    case "PUT":   //array of all
      store.clear()
    case "POST":  //array of new
      json.forEach(obj => store.put(obj))
      break
    default:      //an object
      store.put(json)
  }
  
  const newArr = await store.getAll()
  tx.done

  return newArr
}