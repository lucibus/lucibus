function setSystemAddress (args, state) {
  var {systemPath, address} = args
  state.set(systemPath.concat(['address']), address)
}

setSystemAddress.input = {
  systemPath: Array,
  address: Number
}

export default setSystemAddress
