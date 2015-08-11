import React from 'react'

import App from './containers/App'
import controller from './controller'
import Storage from './Storage'

import addSystem from './actions/addSystem.js'
import moveSystem from './actions/moveSystem.js'
import outputSynced from './actions/outputSynced.js'
import selectSystem from './actions/selectSystem.js'
import setSynced from './actions/setSynced.js'
import setSystemLevel from './actions/setSystemLevel.js'
import setControllerValue from './actions/setControllerValue.js'
import setControllerTerms from './actions/setControllerTerms.js'
import popControllerEnterTerm from './actions/popControllerEnterTerm'
import getControllerSystem from './actions/getControllerSystem'

var noop = (input, state, output) => output(input)

// ACTIONS
controller.signal('gotWebsocketMessage', setSynced)
controller.signal('draggedSystem', moveSystem, [outputSynced])
controller.signal('clickedSystem', selectSystem)
controller.signal('movedInspector', setSystemLevel, [outputSynced])
controller.signal('levelChanged', setSystemLevel, [outputSynced])

controller.signal('controllerChanged',
  popControllerEnterTerm, {
    found: [getControllerSystem, addSystem, [outputSynced]],
    notFound: [noop]
  }, setControllerTerms
)
controller.signal('controllerSearched', setControllerValue)

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
