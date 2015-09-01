export default function * getFiles (regex) {
  var req = require.context('.', true, regex)
  for (var module of req.keys()) {
    yield req(module)
  }
}
