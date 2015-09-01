import {newCue} from './utils'

export function addNewCue (args, state) {
  var newCuePath = ['local', 'newCue']
  var cue = state.get(newCuePath)
  state.push(['synced', 'cues'], cue)
  state.set(newCuePath, newCue())
}

export function advanceCue (inputs, state) {
  var nextCueUuid = state.get('local', '$nextCueUuid')
  state.set(['synced', 'live', 'cue'], nextCueUuid)
}

export function invertExpandCue ({expandedCuePath}, state) {
  var isExpanded = state.get(expandedCuePath) || false
  state.set(expandedCuePath, !isExpanded)
}

invertExpandCue.input = {
  expandedCuePath: Array
}

export function removeCue ({cuePath}, state) {
  state.unset(cuePath)
}

removeCue.input = {
  cuePath: Array
}

export function setCueName ({cuePath, name}, state) {
  state.set(cuePath.concat(['name']), name)
}

setCueName.input = {
  cuePath: Array,
  name: String
}

export function setLiveCue ({uuid}, state) {
  state.set(['synced', 'live', 'cue'], uuid)
}

setLiveCue.input = {
  uuid: String
}
