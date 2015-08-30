function removeCue ({cuePath}, state) {
  state.unset(cuePath)
}

removeCue.input = {
  cuePath: Array
}

export default removeCue
