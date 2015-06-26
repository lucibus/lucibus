// Package websocketserver provides a way to start a TCP WebsocketServer at a certain point
// that serves websocket connections at its base path. It provides a way
// of openeing and closing that WebsocketServer, as well a hook to add the function
// does the processing for the websockets
package websocketserver

import (
	"net"
	"net/http"
	"sync"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/lucibus/subicul/contextutils"

	"golang.org/x/net/context"
)

func createConns() Conns {
	return Conns{
		connToCancelFunc: map[*websocket.Conn]context.CancelFunc{},
		m:                &sync.Mutex{},
	}
}

// Conns is the set of current connections. It includes the current connection
// as well
type Conns struct {
	connToCancelFunc map[*websocket.Conn]context.CancelFunc
	m                *sync.Mutex
}

// Size returns the number of open connections
func (c *Conns) Size() int {
	c.m.Lock()
	defer c.m.Unlock()
	return len(c.connToCancelFunc)
}

// List returns a slice of all the connections
func (c *Conns) List() []*websocket.Conn {
	slice := []*websocket.Conn{}
	c.m.Lock()
	for conn := range c.connToCancelFunc {
		slice = append(slice, conn)
	}
	c.m.Unlock()
	return slice
}

// Has looks for the existance of the passed connection.
func (c *Conns) Has(conn *websocket.Conn) bool {
	c.m.Lock()
	_, ok := c.connToCancelFunc[conn]
	c.m.Unlock()
	return ok
}

func (c *Conns) add(conn *websocket.Conn, cf context.CancelFunc) {
	c.m.Lock()
	c.connToCancelFunc[conn] = cf
	c.m.Unlock()
}

func (c *Conns) remove(conn *websocket.Conn) {
	c.m.Lock()
	delete(c.connToCancelFunc, conn)
	c.m.Unlock()
}

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
func CreateWebsocketServer(ctx context.Context, port int, serveWebsockets func(context.Context, *websocket.Conn, Conns)) error {
	l, err := net.ListenTCP("tcp", &net.TCPAddr{Port: port})
	if err != nil {
		return err
	}
	s := websocketServer{
		serveWebsockets: serveWebsockets,
		listener:        l,
		conns:           createConns(),
		ctx:             ctx,
		logE:            contextutils.GetLogger(ctx).WithField("package", "websocketserver"),
	}

	// start up the server
	go func() {
		err := http.Serve(l, s)
		if err != nil {
			s.logE.WithField("err", err).Error("http.Serve errored")
		}
	}()
	// then start a function in the background that wait for someone to stop
	// this, which will then
	go func() {
		select {
		case <-ctx.Done():
			s.cancel()
		}
	}()
	return nil
}

type websocketServer struct {
	serveWebsockets func(context.Context, *websocket.Conn, Conns)
	listener        *net.TCPListener
	conns           Conns
	ctx             context.Context
	logE            *logrus.Entry
}

// ServeHTTP is called for every client that connects. It will upgrade the
// connection to websockets. Then it will send the initial state and recieve
// any updated states. It will also send updated states back to this client
// if another client send an update to the WebsocketServer.
func (s websocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		s.logE.WithField("err", err).Error("Cant upgrade connection")
		return
	}

	// start tracking this connection. Save its cancel function with it,
	// so we can access it if we have to propogate a cancel down the tree.
	ctx, cancelFunc := context.WithCancel(s.ctx)
	s.conns.add(conn, cancelFunc)
	defer func() {
		// after there is some error in the connection, remove this client from
		// the list of clients we maintain
		s.conns.remove(conn)
	}()

	s.serveWebsockets(ctx, conn, s.conns)
}

func (s *websocketServer) cancel() {
	// close the listener
	err := s.listener.Close()
	if err != nil {
		s.logE.WithField("err", err).Error("listener didn't close properly")
	}
	// cancel all connections
	for _, cancelFunc := range s.conns.connToCancelFunc {
		cancelFunc()
	}
}
