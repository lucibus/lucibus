import {outputSynced} from 'sync/actions'
import * as a from './actions'

export default {
  clickedAddNewPatchItem: [a.addNewPatchItem, [outputSynced]],
  changedNewPatchItemAddress: [a.setNewPatchItemAddress],
  changedNewPatchItemTags: [a.setNewPatchItemTags],
  changedPatchItemAddress: [a.setPatchItemAddress, [outputSynced]],
  changedPatchItemTags: [a.setPatchItemTags, [outputSynced]]
}
