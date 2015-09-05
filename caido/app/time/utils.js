import moment from 'moment'

const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSSSSSSSZZ'

export const NOW_STRING = 'time.Now()'

export function parse (timeString) {
  return moment(timeString, FORMAT)
}

export function stringify () {
  return moment().format(FORMAT)
}
