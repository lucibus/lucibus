function setPatchItemAddress ({oldAddress, newAddress}, state) {
  var tags = state.get(['synced', 'patch', oldAddress])
  state.unset(['synced', 'patch', oldAddress])
  state.set(['synced', 'patch', newAddress], tags)
}

setPatchItemAddress.input = {
  oldAddress: Number,
  newAddress: Number
}

export default setPatchItemAddress
