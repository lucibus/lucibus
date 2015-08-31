function setLiveCue ({uuid}, state) {
  state.set(['synced', 'live', 'cue'], uuid)
}

setLiveCue.input = {
  uuid: String
}

export default setLiveCue
