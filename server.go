package main

import (
	"log"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
)

type Server struct {
	State    []byte
	port     int
	listener *net.TCPListener
	// use map as a set https://groups.google.com/forum/#!msg/golang-nuts/lb4xLHq7wug/MhrSLkyS4F8J
	conns map[*websocket.Conn]struct{}
}

func CreateServer(port int) Server {
	return Server{
		State: []byte(`{}`),
		port:  port,
		conns: map[*websocket.Conn]struct{}{},
	}
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	s.conns[conn] = struct{}{}
	defer func() {
		delete(s.conns, conn)
	}()

	// send current state when anyone connects
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
		log.Println("Error in serving:", http.Serve(l, s))
	}()
	return nil
}

func (s *Server) Stop() error {
	if s.listener != nil {
		return s.listener.Close()

	}
	return nil
}
