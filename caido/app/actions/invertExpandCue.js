function invertExpandCue ({expandedCuePath}, state) {
  var isExpanded = state.get(expandedCuePath) || false
  state.set(expandedCuePath, !isExpanded)
}

invertExpandCue.input = {
  expandedCuePath: Array
}

export default invertExpandCue
