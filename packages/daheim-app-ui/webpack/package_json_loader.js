module.exports = function (source, map) {
  this.cacheable && this.cacheable()
  var original = JSON.parse(source)
  var value = {version: original.version}
  return JSON.stringify(value, undefined, '\t')
}
