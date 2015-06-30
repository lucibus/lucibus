// modified from https://github.com/gorilla/websocket/blob/a3ec486e6a7a41858210b0fc5d7b5df593b3c4a3/examples/chat/conn.go

// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found at https://github.com/gorilla/websocket/blob/a3ec486e6a7a41858210b0fc5d7b5df593b3c4a3/LICENSE

package websocketserver

import (
	"time"

	"golang.org/x/net/context"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second
	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// connection is an middleman between the websocket connection and the hub.
type connection struct {
	ctx context.Context
	// the place to send all send requests
	h *hub
	// The websocket connection.
	ws *websocket.Conn
	// Buffered channel of outbound messages.
	send chan []byte

	onRecieve onRecieve
	onOpen    onOpen
}

// Sends some bytes out over this connection
func (c *connection) reply(b []byte) {
	c.send <- b
}

// Sends bytes out to all other connections
func (c *connection) broadcast(b []byte) {
	select {
	case c.h.broadcast <- &message{b, c}:
	default:
	}
}

// readPump pumps messages from the websocket connection to the hub.
func (c *connection) readPump() {
	defer func() {
		select {
		case c.h.unregister <- c:
		default:
		}
		c.ws.Close()
	}()
	c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, messageData, err := c.ws.ReadMessage()
		if err != nil {
			break
		}
		c.onRecieve(c.ctx, messageData, c.reply, c.broadcast)
	}
}

// write writes a message with the given message type and payload.
func (c *connection) write(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// writePump pumps messages from the hub to the websocket connection.
func (c *connection) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func makeConnection(ctx context.Context, h *hub, ws *websocket.Conn, onOpen onOpen, onRecieve onRecieve) {
	c := &connection{send: make(chan []byte, 256), h: h, ws: ws, ctx: ctx, onOpen: onOpen, onRecieve: onRecieve}
	h.register <- c
	go c.writePump()
	onOpen(ctx, c.reply, c.broadcast)
	c.readPump()
	return
}
