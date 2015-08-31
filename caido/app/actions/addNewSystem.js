import {getNewSystemPath} from '../utils'

function addNewSystem ({systemsPath}, state, output) {
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

export default addNewSystem
