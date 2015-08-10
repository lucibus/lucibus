function setSystemLevel (args, state) {
  var {uuid, level} = args

  if (uuid === 'live') {
    state.set(['synced', 'live', 'level'], level)
    return
  }

  var systems = state.get(['synced', 'live', 'systems'])
  var index = systems.findIndex(s => s.uuid === uuid)

  state.set(['synced', 'live', 'systems', index, 'level'], level)
}

setSystemLevel.input = {
  uuid: String,
  level: Number
}

export default setSystemLevel
