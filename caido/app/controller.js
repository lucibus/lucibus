import Controller from 'cerebral'
import Model from 'cerebral-baobab'

import {newSystem} from './utils'

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
    'newSystem': newSystem(),
    '$newSystemValid': [
      ['local', 'newSystem'],
      system => system.hasOwnProperty('level') && system.hasOwnProperty('address')
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
