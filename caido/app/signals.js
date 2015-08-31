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
import setPage from './actions/setPage.js'
import createNewSystem from './actions/createNewSystem.js'
import addNewCue from './actions/addNewCue.js'
import removeCue from './actions/removeCue.js'
import setCueName from './actions/setCueName.js'
import setLiveCue from './actions/setLiveCue.js'
import invertExpandCue from './actions/invertExpandCue.js'
import advanceCue from './actions/advanceCue.js'

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

  controller.signal('needNewSystem', createNewSystem)

  controller.signal('clickedAddNewSystem', addNewSystem, createNewSystem, [outputSynced])
  controller.signal('clickedDeleteSystem', removeSystem, [outputSynced])

  controller.signal('clickedAddNewPatchItem', addNewPatchItem, [outputSynced])
  controller.signal('changedNewPatchItemAddress', setNewPatchItemAddress)
  controller.signal('changedNewPatchItemTags', setNewPatchItemTags)
  controller.signal('changedPatchItemAddress', setPatchItemAddress, [outputSynced])
  controller.signal('changedPatchItemTags', setPatchItemTags, [outputSynced])

  controller.signal('clickedNav', setPage)

  controller.signal('clickedAddNewCue', addNewCue, [outputSynced])
  controller.signal('clickedRemoveCue', removeCue, [outputSynced])
  controller.signal('changedCueName', setCueName, [outputSynced])

  controller.signal('liveCueChanged', setLiveCue, [outputSynced])
  controller.signal('clickedToggleExpandCue', invertExpandCue)

  controller.signal('clickedGoButton', advanceCue, [outputSynced])

}
