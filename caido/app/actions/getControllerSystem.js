export default function getControllerSystem (args, state, output) {
  var system = state.get(['local', 'controller', '$system'])
  output({system})
}

getControllerSystem.output = {
  system: Object
}

export default getControllerSystem
