import {newCue} from '../utils'

function addNewCue (args, state) {
  var newCuePath = ['local', 'newCue']
  var cue = state.get(newCuePath)
  state.push(['synced', 'cues'], cue)
  state.set(newCuePath, newCue())
}

export default addNewCue
