class Storage {
  constructor(url) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = function(event) {
      this.onUpdateCallback(
        // for some reasont the JSON returned by the server is triple escaped?
        // will have to look into this...
        JSON.parse(event.data)
      );
    }.bind(this);
  }

  store(data) {
    this.socket.send(JSON.stringify(data));
  }

  onUpdate(callback) {
    this.onUpdateCallback = callback;
  }
}

export default new Storage("ws://localhost:9001");

