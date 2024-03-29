import { isValid } from "../utils/parser"

export function TimerObj(monster, options) {
  const objKeys = ["id", "utcMSEC", "editMSEC"]
  return BuildObj(monster, options, objKeys)
}

export function BuildObj(source = {}, options = {}, objKeys = []) {
  let newObj = {}
  objKeys.forEach(key => newObj[key] = assignValue(key, source, options))
  return newObj
}

export function assignValue(key, source = {}, options = {}, initail = null) {
  let value = key in options ? options[key] : source[key]
  if (!isValid(value)) value = initail
  return value
}

export function SearchFields(isEnglish) {
  return ["roId", isEnglish ? "en_name" : "name", "location", "mapCode"]
}