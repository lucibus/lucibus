import {defaults} from 'lodash'
import Controller from 'cerebral-react-baobab'

const state = {
  'synced': {
    'live': {
      'level': 1,
      'systems': []
    }
  },
  'local': {
    'newSystem': {},
    '$newSystemValid': [
      ['local', 'newSystem'],
      system => system.hasOwnProperty('level') && system.hasOwnProperty('address')
    ]
  }
}

const defaultArgs = {}

const baobabOptions = {
//  asynchronous: false
}

export default Controller(state, defaultArgs, baobabOptions)
