// Package websocketserver provides a way to start a TCP WebsocketServer at a certain point
// that serves websocket connections at its base path. It provides a way
// of openeing and closing that WebsocketServer, as well a hook to add the function
// does the processing for the websockets
package websocketserver

import (
	"net"
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/lucibus/subicul/contextutils"

	"golang.org/x/net/context"
)

// onOpen is called when a websocket connection is opened
type onOpen func(ctx context.Context, reply, broadcast func([]byte))

// onRecieve is called when the websocket connection recieves a text message
type onRecieve func(ctx context.Context, message []byte, reply, broadcast func([]byte))

// CreateWebsocketServer starts a TCP server that responds to websocket requests.
// The `WebsocketServerWebsockets` function is
// called whenever there is an incoming websockets connection.
// A simpler server that just echoed back every incoming request would have a
// `serveWebsockets` function like this this:
//
// func serveWebsockets(ctx context.Context, conn websocket.Conn, conns WebsocketServer.Conns) {
// 	for {
//		select {
//		case <- ctx.Done():
//			return
//		default:
//		}
// 		messageType, p, err := conn.ReadMessage()
// 		if err != nil {
// 			return
// 		}
// 		if err = conn.WriteMessage(messageType, p); err != nil {
// 			return
// 		}
// 	}
// }
//
// The `ctx` will be passed into each ServeWebsockets call.
// To stop the server send something on the ctx.Done channel.
// When it returns, the connection will be closed.
func CreateWebsocketServer(
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
		log:       *contextutils.GetLogger(ctx, "websocketserver"),
		hub:       makeHub(),
	}

	go s.hub.run(ctx)
	// start up the server
	go func() {
		err := http.Serve(l, s)
		if err != nil {
			s.log.WithField("err", err).Error("http.Serve errored")
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
	log       logrus.Entry
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
		s.log.WithField("err", err).Error("Cant upgrade connection")
		return
	}
	makeConnection(s.ctx, s.hub, wsConn, s.onOpen, s.onRecieve)
}

func (s *websocketServer) cancel() {
	var err error
	// close the listener
	err = s.listener.Close()
	if err != nil {
		s.log.WithField("err", err).Error("listener didn't close properly")
	}
}
