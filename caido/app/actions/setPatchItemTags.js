function setPatchItemTags ({address, tagsJSON}, state, outputs) {
  var tags = JSON.parse(tagsJSON)
  state.set(['synced', 'patch', address], tags)
}

setPatchItemTags.input = {
  address: Number,
  tagsJSON: String
}

export default setPatchItemTags
