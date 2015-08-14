function setSystemAddress (args, state, outputs) {
  var {systemPath, address} = args
  state.set(systemPath.concat(['address']), address)
  if (systemPath[0] === 'synced') {
    outputs.inSynced()
  } else {
    outputs.inLocal()
  }
}

setSystemAddress.outputs = ['inSynced', 'inLocal']

setSystemAddress.input = {
  systemPath: Array,
  address: Number
}

export default setSystemAddress
