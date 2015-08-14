function removeSystem (args, state) {
  var {systemPath} = args
  state.splice(systemPath, [systemPath.pop(), 1])
}

removeSystem.input = {
  systemPath: Array
}

export default removeSystem
