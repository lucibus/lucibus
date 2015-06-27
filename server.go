package main

import (
	"log"

	"golang.org/x/net/context"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	lige "github.com/lucibus/lige/output"
	"github.com/lucibus/subicul/contextutils"
	"github.com/lucibus/subicul/output"
	"github.com/lucibus/subicul/websocketserver"
)

// InitialState is the json the server sends to the client when it first
// starts up
var InitialState = []byte(`
{
	"patch": [],
	"live": {
		"level": 1,
		"systems": [],
		"cue": {}
	},
	"looks": {},
	"cues": {}
}`)

func serveWebsockets(ctx context.Context, conn *websocket.Conn, conns websocketserver.Conns) {
	s := contextutils.GetState(ctx)
	// send current state when first connected
	if err := conn.WriteMessage(websocket.TextMessage, s); err != nil {
		log.Println(err)
		return
	}

	for {
		// check if someone tried to cancel this server. If so, just return
		// and stop processing
		select {
		case <-ctx.Done():
			return
		default:
		}

		// otherwise block on trying to read a message from the server
		messageType, p, err := conn.ReadMessage()
		if messageType != websocket.TextMessage {
			log.Println("someone tried to send a binary websocket")
		}
		if err != nil {
			log.Println(err)
			return
		}
		contextutils.SetState(ctx, p)
		// once you have read one, send that out to all other connections
		for _, otherConn := range conns.List() {
			if otherConn != conn {
				if err = otherConn.WriteMessage(websocket.TextMessage, p); err != nil {
					log.Println(err)
				}
			}
		}

	}
}

// CreateServer starts up a new server and populates the initial state.
// To stop it, call the returned cancel function.
func CreateServer(port int, od lige.OutputDevice) (context.CancelFunc, error) {

	ctx, cancelFunc := context.WithCancel(
		contextutils.WithOutputDevice(
			contextutils.WithLogger(
				contextutils.WithState(context.Background(), InitialState),
				logrus.New(),
			),
			od,
		),
	)
	websocketServerErr := websocketserver.CreateWebsocketServer(
		ctx,
		port,
		serveWebsockets,
	)
	if websocketServerErr != nil {
		return cancelFunc, websocketServerErr
	}

	go output.Output(ctx)
	return cancelFunc, nil
}
