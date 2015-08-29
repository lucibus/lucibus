import Controller from 'cerebral'
import Model from 'cerebral-baobab'
import _ from 'lodash'

import {newSystem, newPatchItem} from './utils'

import signals from './signals'
import schema from './schema'

const state = {
  'synced': {
    'patch': {},
    'live': {
      'level': 1,
      'systems': []
    }
  },
  'local': {
    '$allTags': [
      ['synced', 'patch'],
      patch => _.uniq(_.flatten(_.values(patch)))
    ],
    'newPatchItem': newPatchItem(),
    '$newPatchItemValid': [
      ['local', 'newPatchItem'],
      patchItem => patchItem.address !== null && patchItem.tags.length > 0
    ],
    'newSystem': newSystem(),
    '$newSystemValid': [
      ['local', 'newSystem'],
      system => (system.query || []).length > 0 && system.hasOwnProperty('level')
    ]
  }
}

const baobabOptions = {
  asynchronous: false,
  validate: (previousState, newState, affectedPaths) => {
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
