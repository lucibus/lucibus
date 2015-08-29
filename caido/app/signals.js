import addNewSystem from './actions/addNewSystem.js'
import moveSystem from './actions/moveSystem.js'
import outputSynced from './actions/outputSynced.js'
import setSynced from './actions/setSynced.js'
import setSystemLevel from './actions/setSystemLevel.js'
import setSystemQuery from './actions/setSystemQuery.js'
import removeSystem from './actions/removeSystem.js'
import addNewPatchItem from './actions/addNewPatchItem.js'
import setNewPatchItemAddress from './actions/setNewPatchItemAddress.js'
import setNewPatchItemTags from './actions/setNewPatchItemTags.js'
import setPatchItemAddress from './actions/setPatchItemAddress.js'
import setPatchItemTags from './actions/setPatchItemTags.js'

export default controller => {
  controller.signal('gotWebsocketMessage', setSynced)

  controller.signal('draggedSystem', moveSystem, [outputSynced])

  controller.signal('levelChanged', setSystemLevel, {
    inSynced: [[outputSynced]],
    inLocal: []
  })
  controller.signal('queryChanged', setSystemQuery, {
    inSynced: [[outputSynced]],
    inLocal: []
  })

  controller.signal('clickedAddNewSystem', addNewSystem, [outputSynced])
  controller.signal('clickedDeleteSystem', removeSystem, [outputSynced])

  controller.signal('clickedAddNewPatchItem', addNewPatchItem, [outputSynced])
  controller.signal('changedNewPatchItemAddress', setNewPatchItemAddress)
  controller.signal('changedNewPatchItemTags', setNewPatchItemTags)
  controller.signal('changedPatchItemAddress', setPatchItemAddress)
  controller.signal('changedPatchItemTags', setPatchItemTags)
}
