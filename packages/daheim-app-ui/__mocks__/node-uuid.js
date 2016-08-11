
let counter = 0
function ts () {
  let str = counter.toString(16)
  while (str.length < 12) {
    str = '0' + str
  }
  return str
}

module.exports = {
  v1: () => {
    counter++
    return `00000000-0000-1111-0000-${ts()}`
  },
  v4: () => {
    counter++
    return `00000000-0000-4444-0000-${ts()}`
  },
  reset: () => {
    counter = 0
  }
}
