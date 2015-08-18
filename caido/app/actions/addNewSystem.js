import {newSystem} from '../utils'

function addNewSystem (args, state) {
  var systemPath = ['local', 'newSystem']
  var system = state.get(systemPath)
  state.unshift(['synced', 'live', 'systems'], system)
  state.set(systemPath, newSystem())
}

export default addNewSystem
