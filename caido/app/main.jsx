import React from 'react'

import App from './containers/App'
import controller from './controller'
import Storage from './Storage'

import addNewSystem from './actions/addNewSystem.js'
import moveSystem from './actions/moveSystem.js'
import outputSynced from './actions/outputSynced.js'
import setSynced from './actions/setSynced.js'
import setSystemLevel from './actions/setSystemLevel.js'
import setSystemAddress from './actions/setSystemAddress.js'
import removeSystem from './actions/removeSystem.js'

// ACTIONS
controller.signal('gotWebsocketMessage', setSynced)

controller.signal('draggedSystem', moveSystem, [outputSynced])

controller.signal('levelChanged', setSystemLevel, [outputSynced])
controller.signal('queryChanged', setSystemAddress, [outputSynced])
controller.signal('clickedAddNewSystem', addNewSystem, [outputSynced])
controller.signal('clickedDeleteSystem', removeSystem, [outputSynced])

Storage.onMessage(synced => controller.signals.gotWebsocketMessage({synced}))

var rootInstance = React.render(
  controller.injectInto(App),
  document.getElementById('content')
)

// from https://christianalfoni.github.io/react-webpack-cookbook/Hot-loading-components.html

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance]
    }
  })
}
