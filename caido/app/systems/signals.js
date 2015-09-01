import {outputSynced} from 'sync/actions'
import * as a from './actions'

export default {
  draggedSystem: [a.moveSystem, [outputSynced]],

  levelChanged: [a.setSystemLevel, {
    inSynced: [[outputSynced]],
    inLocal: []
  }],
  queryChanged: [a.setSystemQuery, {
    inSynced: [[outputSynced]],
    inLocal: []
  }],

  needNewSystem: [a.createNewSystem],

  clickedAddNewSystem: [a.addNewSystem, a.createNewSystem, [outputSynced]],
  clickedDeleteSystem: [a.removeSystem, [outputSynced]]
}
