const objKeys = ["id", "utcMSEC", "editMSEC", "intervalId"]

export function TimerObj(monster, options = {}) {
  let newObj = {}

  objKeys.forEach(key => {
    newObj[key] = (key in options ? options[key] : monster[key]) || null
  })

  return newObj
}