// Package websocketserver provides a way to start a TCP WebsocketServer at a certain point
// that serves websocket connections at its base path. It provides a way
// of openeing and closing that WebsocketServer, as well a hook to add the function
// does the processing for the websockets
package websocketserver

import (
	"net"
	"net/http"

	"github.com/Sirupsen/logrus"
	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"

	"golang.org/x/net/context"
)

// onOpen is called when a websocket connection is opened
type onOpen func(ctx context.Context, reply, broadcast func([]byte))

// onRecieve is called when the websocket connection recieves a text message
type onRecieve func(ctx context.Context, message []byte, reply, broadcast func([]byte))

// Create starts a TCP server that responds to websocket requests.
func Create(
	ctx context.Context,
	port int,
	onOpen onOpen,
	onRecieve onRecieve,
) error {
	l, err := net.ListenTCP("tcp", &net.TCPAddr{Port: port})
	if err != nil {
		return err
	}
	s := websocketServer{
		onOpen:    onOpen,
		onRecieve: onRecieve,
		listener:  l,
		ctx:       ctx,
		hub:       makeHub(),
	}

	go s.hub.run(ctx)
	// start up the server
	go func() {
		err := http.Serve(l, s)
		if err != nil {
			log.WithFields(logrus.Fields{
				"package": "websocketserver.websocketserver",
				"err":     err,
			}).Error("http.Serve errored")
		}
	}()
	go func() {
		select {
		case <-ctx.Done():
			s.cancel()
		}
	}()
	return nil
}

type websocketServer struct {
	onOpen    onOpen
	onRecieve onRecieve
	listener  *net.TCPListener
	ctx       context.Context
	hub       *hub
}

// ServeHTTP is called for every client that connects. It will upgrade the
// connection to websockets.
func (s websocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// checking for GET logic is from https://github.com/gorilla/websocket/blob/a3ec486e6a7a41858210b0fc5d7b5df593b3c4a3/examples/chat/conn.go#L93-L96
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", 405)
		return
	}
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	wsConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.WithField("err", err).Error("Cant upgrade connection")
		return
	}
	makeConnection(s.ctx, s.hub, wsConn, s.onOpen, s.onRecieve)
}

func (s *websocketServer) cancel() {
	var err error
	// close the listener
	err = s.listener.Close()
	if err != nil {
		log.WithField("err", err).Error("listener didn't close properly")
	}
}
