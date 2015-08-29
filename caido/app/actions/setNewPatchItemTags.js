function setNewPatchItemTags ({tagsJSON}, state) {
  var tags = JSON.parse(tagsJSON)
  state.set(['local', 'newPatchItem', 'tags'], tags)
}

setNewPatchItemTags.input = {
  tagsJSON: String
}

export default setNewPatchItemTags
