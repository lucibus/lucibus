package main

import (
	"log"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
)

// Server holds information for the websockets connection as well as the JSON
// state for the lights.
type Server struct {
	// State is a chunk of JSON as bytes, which is the current state of the
	// lighting system. It is updated by connected clients and then
	// parsed and rendered out continuiously
	State    []byte
	port     int
	listener *net.TCPListener
	// use map as a set https://groups.google.com/forum/#!msg/golang-nuts/lb4xLHq7wug/MhrSLkyS4F8J
	// conns holds all the current websocket connections. This is used
	// to send updates to clients when the state changes
	conns map[*websocket.Conn]struct{}
}

// CreateServer initializes a server with a default State
func CreateServer(port int) Server {
	return Server{
		State: []byte(`{}`),
		port:  port,
		conns: map[*websocket.Conn]struct{}{},
	}
}

// ServeHTTP is called for every client that connects. It will upgrade the
// connection to websockets. Then it will send the initial state and recieve
// any updated states. It will also send updated states back to this client
// if another client send an update to the server.
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// start tracking this connection. We are using a map data structure to store
	// the list of clients. so it doesn't matter what the value is that we set
	// the connection to, we only care about the key
	s.conns[conn] = struct{}{}
	defer func() {
		// after there is some error in the connection, remove this client from
		// the list of clients we maintain
		delete(s.conns, conn)
	}()

	// send current state when first connected
	if err = conn.WriteMessage(websocket.TextMessage, s.State); err != nil {
		log.Println(err)
		return
	}

	for {
		messageType, p, err := conn.ReadMessage()
		if messageType != websocket.TextMessage {
			log.Println("someone tried to send a binary websocket")
		}
		if err != nil {
			log.Println(err)
			return
		}
		s.State = p
		// now send the state out to everyone else
		for otherConn := range s.conns {
			if otherConn != conn {
				if err = otherConn.WriteMessage(websocket.TextMessage, s.State); err != nil {
					log.Println(err)
				}
			}
		}

	}
}

func (s *Server) Serve() error {
	l, err := net.ListenTCP("tcp", &net.TCPAddr{Port: s.port})
	if err != nil {
		return err
	}
	s.listener = l
	go func() {
		if err := http.Serve(l, s); err != nil {
			log.Println("Error in serving:", err)
		}
	}()
	return nil
}

func (s *Server) Stop() error {
	if s.listener != nil {
		return s.listener.Close()

	}
	return nil
}
