export default function setControllerValue (args, state) {
  var {value} = args
  state.set(['local', 'controller', 'input'], value)
}

// setControllerValue.input = {
//   value: String
// }

export default setControllerValue

