import addNewSystem from './actions/addNewSystem.js'
import moveSystem from './actions/moveSystem.js'
import outputSynced from './actions/outputSynced.js'
import setSynced from './actions/setSynced.js'
import setSystemLevel from './actions/setSystemLevel.js'
import setSystemAddress from './actions/setSystemAddress.js'
import removeSystem from './actions/removeSystem.js'

export default controller => {
  controller.signal('gotWebsocketMessage', setSynced)

  controller.signal('draggedSystem', moveSystem, [outputSynced])

  controller.signal('levelChanged', setSystemLevel, {
    inSynced: [[outputSynced]],
    inLocal: []
  })
  controller.signal('queryChanged', setSystemAddress, {
    inSynced: [[outputSynced]],
    inLocal: []
  })

  controller.signal('clickedAddNewSystem', addNewSystem, [outputSynced])
  controller.signal('clickedDeleteSystem', removeSystem, [outputSynced])
}
