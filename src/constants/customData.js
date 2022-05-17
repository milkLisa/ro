export function TimerObj(monster, options) {
  const objKeys = ["id", "utcMSEC", "editMSEC"]
  return BuildObj(monster, options, objKeys)
}

export function SettingsObj(settings, options) {
  const objKeys = ["id", "showName", "showLocation", 
  "showDateTime", "remindBefore", "continueAfter"]
  return BuildObj(settings, options, objKeys)
}

export function BuildObj(source = {}, options = {}, objKeys = []) {
  let newObj = {}

  objKeys.forEach(key => {
    newObj[key] = (key in options ? options[key] : source[key]) || null
  })

  return newObj
}