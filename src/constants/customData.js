export function TimerObj(monster, options = {}) {
  return {
    id: monster.id,
    utcMSEC: ("utcMSEC" in options ? options.utcMSEC : monster.utcMSEC) || null,
    editMSEC: ("editMSEC" in options ? options.editMSEC : monster.editMSEC) || null
  }
}