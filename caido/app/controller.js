import Controller from 'cerebral'
import Model from 'cerebral-baobab'
import _ from 'lodash'

import {newPatchItem, newCue} from './utils'

import signals from './signals'
import schema from './schema'

const state = {
  'synced': {
    'patch': {},
    'cues': [],
    'live': {
      'level': 1,
      'cue': '',
      'systems': []
    }
  },
  'local': {
    'page': 'live',
    '$liveCueIndex': [
      ['synced', 'live', 'cue'],
      ['synced', 'cues'],
      (uuid, cues = []) => _.findIndex(cues, {uuid})
    ],
    '$allTags': [
      ['synced', 'patch'],
      patch => _.uniq(_.flatten(_.values(patch)))
    ],
    'newPatchItem': newPatchItem(),
    '$newPatchItemValid': [
      ['local', 'newPatchItem'],
      patchItem => patchItem.address !== null && patchItem.tags.length > 0
    ],
    '$allCueNames': [
      ['synced', 'cues'],
      (cues = []) => cues.map(p => p.name)
    ],
    'newCue': newCue(),
    '$newCueValid': [
      ['local', 'newCue'],
      ['local', '$allCueNames'],
      (cue, allCueNames) => (cue.name || '').length > 0 && !_.includes(allCueNames, cue.name)
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
    'cueExpanded': {},
    'newSystems': {}
  }
}

const baobabOptions = {
  asynchronous: false,
  validate: (previousState, newState, affectedPaths) => {
    console.log('validating', newState)
    var valid = schema(newState.synced)
    if (!valid) {
      console.error('Invalid schema', newState, schema.errors)
      return new Error(schema.errors)
    }
    return true
  }
}

const model = Model(state, baobabOptions)

// Any services you want each action to receive.
const services = {}

var controller = Controller(model, services)
signals(controller)

export default controller
