import {newPatchItem} from './utils'

export function addNewPatchItem (args, state) {
  var newPatchItemPath = ['local', 'newPatchItem']
  var {address, tags} = state.get(newPatchItemPath)
  state.set(['synced', 'patch', address], tags)
  state.set(newPatchItemPath, newPatchItem())
}

export function setNewPatchItemAddress ({address}, state) {
  state.set(['local', 'newPatchItem', 'address'], address)
}

setNewPatchItemAddress.input = {
  address: Number
}

export function setNewPatchItemTags ({tagsJSON}, state) {
  var tags = JSON.parse(tagsJSON)
  state.set(['local', 'newPatchItem', 'tags'], tags)
}

setNewPatchItemTags.input = {
  tagsJSON: String
}

export function setPatchItemAddress ({oldAddress, newAddress}, state) {
  var tags = state.get(['synced', 'patch', oldAddress])
  state.unset(['synced', 'patch', oldAddress])
  state.set(['synced', 'patch', newAddress], tags)
}

setPatchItemAddress.input = {
  oldAddress: Number,
  newAddress: Number
}

export function setPatchItemTags ({address, tagsJSON}, state, outputs) {
  var tags = JSON.parse(tagsJSON)
  state.set(['synced', 'patch', address], tags)
}

setPatchItemTags.input = {
  address: Number,
  tagsJSON: String
}

