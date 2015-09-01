import {outputSynced} from 'sync/actions'
import * as a from './actions'

export default {
  clickedAddNewCue: [a.addNewCue, [outputSynced]],
  clickedRemoveCue: [a.removeCue, [outputSynced]],
  changedCueName: [a.setCueName, [outputSynced]],

  liveCueChanged: [a.setLiveCue, [outputSynced]],
  clickedToggleExpandCue: [a.invertExpandCue],
  clickedGoButton: [a.advanceCue, [outputSynced]]
}
