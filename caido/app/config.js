import queryString from 'query-string'
import 'script!mock-socket'

var qSParsed = queryString.parse(location.search)

var mockWebSocket = JSON.parse(qSParsed['mock_websocket'] || 'false')

export default {
  mockWebSocket: mockWebSocket,
  webSocketOrigin: 'ws://' + window.location.hostname + ':8080',
  WebSocket: mockWebSocket ? window.MockSocket : window.WebSocket
}
