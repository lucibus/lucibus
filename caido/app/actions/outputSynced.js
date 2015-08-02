import Storage from '../Storage'

export default function outputSynced (args, state, promise) {
  Storage.store(state.get('synced'))
  promise.resolve()
}
