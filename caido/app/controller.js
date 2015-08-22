import Controller from 'cerebral-react-baobab'

import {newSystem} from './utils'

import signals from './signals'
import schema from './schema'

const state = {
  'synced': {
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

const defaultArgs = {}

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

var controller = Controller(state, defaultArgs, baobabOptions)

signals(controller)

export default controller
