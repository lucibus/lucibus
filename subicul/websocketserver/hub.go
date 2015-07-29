// modified from https://github.com/gorilla/websocket/blob/a3ec486e6a7a41858210b0fc5d7b5df593b3c4a3/examples/chat/hub.go

// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found at https://github.com/gorilla/websocket/blob/a3ec486e6a7a41858210b0fc5d7b5df593b3c4a3/LICENSE

package websocketserver

import (
	"github.com/lucibus/lucibus/subicul/contextutils"
	"golang.org/x/net/context"
)

// message is an outbound message from one connection to all other connections
type message struct {
	data   []byte
	sender *connection
}

// hub maintains the set of active connections and broadcasts messages to the
// connections.
type hub struct {
	// Registered connections.
	connections map[*connection]struct{}

	// Inbound messages from the connections.
	broadcast chan *message

	// Register requests from the connections.
	register chan *connection

	// Unregister requests from connections.
	unregister chan *connection
}

func makeHub() *hub {
	return &hub{
		connections: make(map[*connection]struct{}),
		broadcast:   make(chan *message),
		register:    make(chan *connection),
		unregister:  make(chan *connection),
	}
}

func (h *hub) run(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			for c := range h.connections {
				close(c.send)
				err := c.ws.Close()
				if err != nil {
					log := contextutils.GetLogger(ctx, "websocketserver.hub")
					log.WithField("err", err).Error("connection didn't close properly")
				}
			}
			return
		case c := <-h.register:
			h.connections[c] = struct{}{}
		case c := <-h.unregister:
			if _, ok := h.connections[c]; ok {
				delete(h.connections, c)
				close(c.send)
			}
		case m := <-h.broadcast:
			for c := range h.connections {
				if c != m.sender {
					select {
					case c.send <- m.data:
					default:
						close(c.send)
						delete(h.connections, c)
					}
				}

			}
		}
	}
}
