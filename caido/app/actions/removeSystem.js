function removeSystem (args, state) {
  var {systemPath} = args
  state.unset(systemPath)
}

removeSystem.input = {
  systemPath: Array
}

export default removeSystem
