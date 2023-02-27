const ltrim = (str, chr) => {
  const rgxtrim = !chr ? new RegExp('^\\s+') : new RegExp(`^${chr}+`)
  return str.replace(rgxtrim, '')
}

const correctRouteName = url => {
  const newUrl = ltrim(url, '\\/')
  return `/${newUrl}`
}

const dateToYMD = date => {
  var strArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  var d = date.getDate()
  var m = strArray[date.getMonth()]
  var y = date.getFullYear()
  return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ' ' + y
}

const scheduleTime = (date, time) => {
  return '3:30PM - 6:30PM'
}

export { correctRouteName, dateToYMD, scheduleTime }
