function moveSystem (args, state) {
  var {uuid, newIndex} = args

  var systems = state.get(['synced', 'live', 'systems'])
  var oldIndex = systems.findIndex(s => s.uuid === uuid)
  var system = systems[oldIndex]

  state.splice(['synced', 'live', 'systems'], [
    [oldIndex, 1],
    [newIndex, 0, [system]]
  ])
}

moveSystem.input = {
  uuid: String,
  newIndex: Number
}

export default moveSystem
