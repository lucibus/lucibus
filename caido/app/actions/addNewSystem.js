import UUID from 'uuid-js'
import {assign} from 'lodash'

function addNewSystem (args, state) {
  var systemPath = ['local', 'newSystem']
  var system = state.get(systemPath)
  const uuid = UUID.create().toString()
  state.push(['synced', 'live', 'systems'],
    assign({}, {'uuid': uuid}, system)
  )

  state.set(systemPath, {})
}

export default addNewSystem
