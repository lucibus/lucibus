function setSystemLevel (args, state, outputs) {
  var {systemPath, level} = args
  state.set(systemPath.concat(['level']), level)
  if (systemPath[0] === 'synced') {
    outputs.inSynced()
  } else {
    outputs.inLocal()
  }
}

setSystemLevel.input = {
  systemPath: Array,
  level: Number
}

setSystemLevel.outputs = ['inSynced', 'inLocal']

export default setSystemLevel
