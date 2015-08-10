function selectSystem (args, state) {
  var {uuid} = args

  state.set(['local', 'selected', 'uuid'], uuid)
}

selectSystem.input = {
  uuid: String
}

export default selectSystem
