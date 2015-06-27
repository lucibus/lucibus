class Storage {

  // When we get a message from the server, we shouldn't send that message
  // back to the server, even though it does update our tree. So we only
  // actually wanna store, if the server wasnt the one making the update.
  // So we keep track of how many updates the server has sent, that
  // we haven't been told to update yet.

  justSetFromBackend = 0

  constructor(url) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = function(event) {
      this.justSetFromBackend++;

      this.onMessageCallback(
        JSON.parse(event.data)
      );
    }.bind(this);
  }

  store(data) {
    if (this.justSetFromBackend === 0) {
      this.socket.send(JSON.stringify(data));
    } else {
      this.justSetFromBackend--;
    }
  }

  // onMessage sets the callback for whenener a websocket message is recieved
  onMessage(callback) {
    this.onMessageCallback = callback;
  }
}

export default new Storage("ws://localhost:9001");

