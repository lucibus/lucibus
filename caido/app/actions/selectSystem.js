export default function selectSystem (args, state) {
  var {uuid} = args

  state.set(['local', 'selected', 'uuid'], uuid)
}
