import Storage from './Storage'

export function outputSynced (args, state, output) {
  Storage.store(state.get('synced'))
  output()
}

export function setSynced (args, state) {
  var {synced} = args
  state.set('synced', synced)
}

setSynced.input = {
  synced: Object
}
