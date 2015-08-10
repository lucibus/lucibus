import React from 'react'

import App from './containers/App'
import controller from './controller'
import Storage from './Storage'

import addSystem from './actions/addSystem.js'
import createAddressOneSystem from './actions/createAddressOneSystem.js'
import moveSystem from './actions/moveSystem.js'
import outputSynced from './actions/outputSynced.js'
import selectSystem from './actions/selectSystem.js'
import setSynced from './actions/setSynced.js'
import changeSystemLevel from './actions/changeSystemLevel.js'

// ACTIONS
controller.signal('gotWebsocketMessage', setSynced)
controller.signal('clickedAddAddressOne', createAddressOneSystem, addSystem, [outputSynced])
controller.signal('draggedSystem', moveSystem, [outputSynced])
controller.signal('clickedSystem', selectSystem)
controller.signal('movedInspector', changeSystemLevel, [outputSynced])

Storage.onMessage(controller.signals.gotWebsocketMessage)

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
