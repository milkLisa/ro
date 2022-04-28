export const SECOND = 1000   // 1 second = 1000 milliseconds
export const MINUTE = SECOND * 60
export const HOUR   = MINUTE * 60
export const DAY    = HOUR * 24

export function padZero(len, x) {
  x = x.toString().replace("-", "")
  return x.length < len ? x.padStart(len, "0") : x
}

export function getFormatedTime(ms) {
  const hours = parseInt(ms / HOUR)
  const minutes = parseInt((ms % HOUR) / MINUTE)
  const seconds = parseInt((ms % HOUR % MINUTE) / SECOND)

  return padZero(2, hours) + ":" + padZero(2, minutes) + ":" + padZero(2, seconds)
}