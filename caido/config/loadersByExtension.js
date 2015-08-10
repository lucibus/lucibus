var path = require('path')

function useLoader (exts) {
  return function (absPath) {
    var ext = path.extname(absPath.split('?')[0]).slice(1)
    var matches = exts.indexOf(ext) !== -1
    // console.log(absPath, ext, matches)
    return matches
  }
}

module.exports = function loadersByExtension (obj) {
  var loaders = []
  Object.keys(obj).forEach(function (key) {
    var exts = key.split('|')
    var value = obj[key]
    var entry = {
      extensions: exts,
      test: useLoader(exts)
    }
    if (Array.isArray(value)) {
      entry.loaders = value
    } else if (typeof value === 'string') {
      entry.loader = value
    } else {
      Object.keys(value).forEach(function (valueKey) {
        entry[valueKey] = value[valueKey]
      })
    }
    loaders.push(entry)
  })
  return loaders
}
