import config from './config'
import './mockWebSocket'

class Storage {

  constructor (url) {
    this.socket = new config.WebSocket(url)

    this.socket.onmessage = event => {
      this.onMessageCallback(
        JSON.parse(event.data)
      )
    }
  }

  store (data) {
    this.socket.send(JSON.stringify(data))
  }

  // onMessage sets the callback for whenener a websocket message is recieved
  onMessage (callback) {
    this.onMessageCallback = callback
  }
}

export default new Storage(config.webSocketOrigin)

