import config from './config.js'
import sample from './sample.json'

if (config.mockWebSocket) {
  console.log('Starting debug websocket server')
  var mockServer = new window.MockServer(config.webSocketOrigin)
  mockServer.on('connection', function (server) {
    server.send(JSON.stringify(sample))
  })

  mockServer.on('message', function incoming (message) {
    console.log('Sent websocket message: %s', message)
  })
}
