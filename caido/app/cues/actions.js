import {NOW_STRING} from 'time/utils'
import {newCue} from './utils'

export function addNewCue (args, state) {
  var newCuePath = ['local', 'cues', 'new']
  var cue = state.get(newCuePath)
  state.push(['synced', 'cues'], cue)
  state.set(newCuePath, newCue())
}

export function advanceCue (inputs, state) {
  var uuid = state.get('local', 'cues', 'live', 'next', '$uuid')
  state.set(['synced', 'live', 'cue'], {uuid, time: NOW_STRING})
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

export function setCueDuration ({cuePath, duration}, state) {
  state.set(cuePath.concat(['duration']), duration)
}

setCueDuration.input = {
  cuePath: Array,
  duration: Number
}

export function setLiveCue ({uuid}, state) {
  state.set(['synced', 'live', 'cue'], {uuid, percent: 1})
}

setLiveCue.input = {
  uuid: String
}

export function setLiveCuePercent ({percent}, state) {
  var uuid = state.get(['synced', 'live', 'cue', 'uuid'])
  state.set(['synced', 'live', 'cue'], {uuid, percent})
}

setLiveCuePercent.input = {
  percent: Number
}
