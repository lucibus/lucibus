function removeSystem ({systemPath}, state) {
  state.unset(systemPath)
}

removeSystem.input = {
  systemPath: Array
}

export default removeSystem
