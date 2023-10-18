import moment from 'moment-timezone'
import { trimStr } from '../utils/parser'

export const SECOND     = 1000   // 1 second = 1000 milliseconds
export const HALF_SECOND= SECOND/2
export const MINUTE     = SECOND * 60
export const HOUR       = MINUTE * 60
export const DAY        = HOUR * 24
export const TIME_FORMAT= /^(\d{1,2}\D)?(\d{1,2}\D)?(\d{1,2})$/

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

export function getDateTime(ms) {
  if (ms) return moment(ms).format("YYYY-MM-DD HH:mm:ss")
  else return ""
}

export function parseToMSEC(str) {
  let time = [0, 0, 0]

  str = trimStr(str)
  const nums = str.match(/([0-9])+/g)
  if (nums) {
    if (nums.length == 1) { //is minutes
      time.splice(1, 1, nums[0])
    } else {
      time = time.concat(nums)
      time = time.slice(time.length - 3)
    }
  }

  const hours = parseInt(time[0]) * HOUR
  const minutes = parseInt(time[1]) * MINUTE
  const seconds = parseInt(time[2]) * SECOND

  return hours + minutes + seconds
}

export function isLessOrEqual(x, y) {
  return parseInt(x / SECOND) <= parseInt(y / SECOND)
}