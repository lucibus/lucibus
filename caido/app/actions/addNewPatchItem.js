import {newPatchItem} from '../utils'

function addNewPatchItem (args, state) {
  var newPatchItemPath = ['local', 'newPatchItem']
  var {address, tags} = state.get(newPatchItemPath)
  state.set(['synced', 'patch', address], tags)
  state.set(newPatchItemPath, newPatchItem())
}

export default addNewPatchItem
