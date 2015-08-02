import Controller from 'cerebral-react-baobab'

const state = {
  'synced': {
    'live': {
      'level': 1,
      'systems': []
    }
  },
  'local': {
    'selected': {
      'uuid': null
      // '$system': [
      //   ['local', 'selected', 'uuid'],
      //   ['synced', 'live', 'systems'],
      //   (uuid, systems) => systems.find(s => s.uuid === uuid)
      // ]
    }
  }
}

const defaultArgs = {}

const baobabOptions = {
  autoCommit: false
}

export default Controller(state, defaultArgs, baobabOptions)
