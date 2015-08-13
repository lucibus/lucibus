function setSystemLevel (args, state) {
  var {systemPath, level} = args
  state.set(systemPath.concat(['level']), level)
}

setSystemLevel.input = {
  systemPath: Array,
  level: Number
}

export default setSystemLevel
