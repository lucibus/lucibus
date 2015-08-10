import Storage from '../Storage'

function outputSynced (args, state, output) {
  Storage.store(state.get('synced'))
  output()
}

export default outputSynced
