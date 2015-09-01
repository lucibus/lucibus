import {uuid} from 'common/utils'

export function newCue () {
  return {
    uuid: uuid(),
    name: '',
    systems: []
  }
}

export function getCueExpandedPath (cuePath) {
  return ['local', 'cueExpanded', JSON.stringify(cuePath)]
}
