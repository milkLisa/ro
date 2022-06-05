import { isValid } from "../utils/parser"

export function TimerObj(monster, options) {
  const objKeys = ["id", "utcMSEC", "editMSEC"]
  return BuildObj(monster, options, objKeys)
}

export function SettingsObj(settings, options) {
  const objKeys = ["id", "showName", "showLocation", 
  "showDateTime", "remindBefore", "continueAfter", 
  "remindAudio", "playSeconds"]
  return BuildObj(settings, options, objKeys)
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