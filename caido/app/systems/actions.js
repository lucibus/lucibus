import {getNewSystemPath, newSystem} from './utils'

export function addNewSystem ({systemsPath}, state, output) {
  var newSystemPath = getNewSystemPath(systemsPath)

  var system = state.get(newSystemPath)
  state.unshift(systemsPath, system)
  output({newSystemPath})
}

addNewSystem.input = {
  systemsPath: Array
}

addNewSystem.output = {
  newSystemPath: Array
}

export function createNewSystem ({newSystemPath}, state) {
  state.set(newSystemPath, newSystem())
}

createNewSystem.input = {
  newSystemPath: Array
}

export function moveSystem (args, state) {
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

export function removeSystem ({systemPath}, state) {
  state.unset(systemPath)
}

removeSystem.input = {
  systemPath: Array
}

export function setSystemLevel (args, state, outputs) {
  var {systemPath, level} = args
  state.set(systemPath.concat(['level']), level)
  if (systemPath[0] === 'synced') {
    outputs.inSynced()
  } else {
    outputs.inLocal()
  }
}

setSystemLevel.input = {
  systemPath: Array,
  level: Number
}

setSystemLevel.outputs = ['inSynced', 'inLocal']

export function setSystemQuery (args, state, outputs) {
  var {systemPath, query} = args
  state.set(systemPath.concat(['query']), query)
  if (systemPath[0] === 'synced') {
    outputs.inSynced()
  } else {
    outputs.inLocal()
  }
}

setSystemQuery.outputs = ['inSynced', 'inLocal']

setSystemQuery.input = {
  systemPath: Array,
  query: Array
}

