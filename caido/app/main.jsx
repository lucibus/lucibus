import React from 'react'

// must be imported before `Storage` so that it mocks the websocket
import './debug_'

import App from './containers/App'
import controller from './controller'
import Storage from './Storage'

import addSystem from './actions/addSystem.js'
import createAddressOneSystem from './actions/createAddressOneSystem.js'
import moveSystem from './actions/moveSystem.js'
import outputSynced from './actions/outputSynced.js'
import setSynced from './actions/setSynced.js'

// ACTIONS
controller.signal('gotWebsocketMessage', setSynced)
controller.signal('clickedAddAddressOne', createAddressOneSystem, addSystem, [outputSynced])
controller.signal('draggedSystem', moveSystem, [outputSynced])

Storage.onMessage(controller.signals.gotWebsocketMessage)

React.render(
  controller.injectInto(App),
  document.getElementById('content')
)
