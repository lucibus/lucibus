import _ from 'lodash'

import {newCue} from './utils'

export default {
  local: {
    '$liveCueIndex': [
      ['synced', 'live', 'cue'],
      ['synced', 'cues'],
      (uuid, cues = []) => _.findIndex(cues, {uuid})
    ],
    '$allCueNames': [
      ['synced', 'cues'],
      (cues = []) => cues.map(p => p.name)
    ],
    'newCue': newCue(),
    '$newCueValid': [
      ['local', 'newCue'],
      ['local', '$allCueNames'],
      (cue, allCueNames) => cue && (cue.name || '').length > 0 && !_.includes(allCueNames, cue.name)
    ],
    '$nextCueIndex': [
      ['local', '$liveCueIndex'],
      liveCueIndex => liveCueIndex === -1 ? -1 : liveCueIndex + 1
    ],
    '$hasNextCue': [
      ['local', '$nextCueIndex'],
      ['synced', 'cues'],
      (nextCueIndex, cues) => {
        if (nextCueIndex === -1) {
          return false
        }
        var lastIndex = cues.length - 1
        return nextCueIndex <= lastIndex
      }
    ],
    '$nextCueUuid': [
      ['local', '$nextCueIndex'],
      ['synced', 'cues'],
      (nextCueIndex, cues = []) => (cues[nextCueIndex] || {}).uuid
    ],
    'cueExpanded': {}
  }
}
