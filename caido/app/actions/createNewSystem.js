import {newSystem} from '../utils'

function createNewSystem ({newSystemPath}, state) {
  state.set(newSystemPath, newSystem())
}

createNewSystem.input = {
  newSystemPath: Array
}

export default createNewSystem
