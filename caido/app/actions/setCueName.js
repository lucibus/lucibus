function setCueName ({cuePath, name}, state) {
  state.set(cuePath.concat(['name']), name)
}

setCueName.input = {
  cuePath: Array,
  name: String
}

export default setCueName
