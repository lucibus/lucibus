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
    'controller': {
      'input': '',
      'terms': [],
      '$system': [
        ['local', 'controller', 'terms'],
        terms => defaults({}, ...terms)
      ]
    }
  }
}

const defaultArgs = {}

const baobabOptions = {
//  asynchronous: false
}

export default Controller(state, defaultArgs, baobabOptions)
