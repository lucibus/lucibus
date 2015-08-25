// import sampleSynced from './sampleSynced.json'
import 'script!mock-socket/dist/mock-socket.js'
import queryString from 'query-string'

var qSParsed = queryString.parse(location.search)
var mockWebSocketQS = JSON.parse(qSParsed['mock_websocket'] || 'false')
var shouldMockWebSocket = mockWebSocketQS || !window.caidoConfig || window.caidoConfig.shouldMockWebSocket

if (shouldMockWebSocket) {
  window.WebSocket = window.MockSocket
  console.log('Starting debug websocket server')
  var mockServer = new window.MockServer('ws://' + window.location.hostname + ':8080')
  mockServer.on('connection', function (server) {
    // server.send(JSON.stringify(sampleSynced))
  })

  mockServer.on('message', message => {
    window.caidoConfig.lastMessage = message
    console.log('Sent websocket message: %s', message)
  })
}
