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
      'uuid': 'live'
      // '$system': [
      //   ['local', 'selected', 'uuid'],
      //   ['synced', 'live', 'systems'],
      //   ['synced', 'live'],
      //   (uuid, systems, live) => {
      //     if (uuid === 'live') {
      //       console.log(live)
      //       return live
      //     }
      //     return systems.find(s => s.uuid === uuid)
      //   }
      // ]
    }
  }
}

const defaultArgs = {}

const baobabOptions = {
  autoCommit: false
}

export default Controller(state, defaultArgs, baobabOptions)
