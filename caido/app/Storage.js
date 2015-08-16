import './mockWebSocket'
import controller from './controller'

class Storage {

  constructor () {
    this.socket = new window.WebSocket('ws://' + window.location.hostname + ':8080')

    this.socket.onmessage = event => {
      controller.signals.gotWebsocketMessage({
        synced: JSON.parse(event.data)
      })
    }
  }

  store (data) {
    this.socket.send(JSON.stringify(data))
  }
}

export default new Storage()
