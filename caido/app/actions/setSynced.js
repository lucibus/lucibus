function setSynced (args, state) {
  var {synced} = args
  state.set('synced', synced)
}

setSynced.input = {
  synced: Object
}

export default setSynced
