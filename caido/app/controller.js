import Controller from 'cerebral-react-baobab'
import {newSystem} from 'utils'

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
//  asynchronous: false
}

export default Controller(state, defaultArgs, baobabOptions)
