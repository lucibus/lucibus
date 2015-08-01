import queryString from 'query-string'
import 'mock-socket/dist/mock-socket'
import sample from './sample.json'

var parsed = queryString.parse(location.search)

var debug = JSON.parse(parsed.debug || 'false')
if (debug) {
  window.WebSocket = window.MockSocket
  var mockServer = new window.MockServer('ws://localhost:9001')
  mockServer.on('connection', function (server) {
    server.send(JSON.stringify(sample))
  })

  mockServer.on('message', function incoming (message) {
     console.log('Sent websocket message: %s', message)
   })
}
