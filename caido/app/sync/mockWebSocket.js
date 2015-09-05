import 'script!mock-socket/dist/mock-socket.js'
import queryString from 'query-string'

import {NOW_STRING, stringify} from 'time/utils'

var qSParsed = queryString.parse(location.search)
var mockWebSocketQS = JSON.parse(qSParsed['mock_websocket'] || 'false')
var shouldMockWebSocket = mockWebSocketQS || !window.caidoConfig || window.caidoConfig.shouldMockWebSocket

if (shouldMockWebSocket) {
  window.WebSocket = window.MockSocket
  console.log('Starting debug websocket server')
  var mockServer = new window.MockServer('ws://' + window.location.hostname + ':8080')
  mockServer.on('connection', function (server) {
  })

  mockServer.on('message', message => {
    window.caidoConfig.lastMessage = message
    console.log('Would have sent websocket message: %s', message)
    if (message.indexOf(NOW_STRING) !== -1) {
      var newState = message.replace(NOW_STRING, stringify())
      mockServer.send(newState)
      console.log('Would have gotten back: %s', newState)
    }
  })
}
