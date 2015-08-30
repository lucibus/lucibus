function advanceCue (inputs, state) {
  var nextCueUuid = state.get('local', '$nextCueUuid')
  state.set(['synced', 'live', 'cue'], nextCueUuid)
}

export default advanceCue
