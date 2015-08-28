function setSystemQuery (args, state, outputs) {
  var {systemPath, query} = args
  state.set(systemPath.concat(['query']), query)
  if (systemPath[0] === 'synced') {
    outputs.inSynced()
  } else {
    outputs.inLocal()
  }
}

setSystemQuery.outputs = ['inSynced', 'inLocal']

setSystemQuery.input = {
  systemPath: Array,
  query: Array
}

export default setSystemQuery
