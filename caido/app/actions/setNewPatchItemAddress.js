function setPatchItemAddress ({address}, state) {
  state.set(['local', 'newPatchItem', 'address'], address)
}

setPatchItemAddress.input = {
  address: Number
}

export default setPatchItemAddress
