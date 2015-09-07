import {uuid} from 'common/utils'

export function newCue () {
  return {
    uuid: uuid(),
    name: '',
    duration: 0,
    systems: []
  }
}

export function getCueExpandedPath (cuePath) {
  return ['local', 'cues', 'expanded', JSON.stringify(cuePath)]
}
