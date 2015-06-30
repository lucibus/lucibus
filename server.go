package main

import (
	"golang.org/x/net/context"

	"github.com/Sirupsen/logrus"
	lige "github.com/lucibus/lige/output"
	"github.com/lucibus/subicul/contextutils"
	"github.com/lucibus/subicul/output"
	"github.com/lucibus/subicul/websocketserver"
)

// InitialState is the json the server sends to the client when it first
// starts up
var InitialStateBytes = []byte(`
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

func onOpen(ctx context.Context, reply, broadcast func([]byte)) {
	sb := contextutils.GetStateBytes(ctx)
	reply(sb)
}

func onRecieve(ctx context.Context, message []byte, reply, broadcast func([]byte)) {
	err := contextutils.SetStateBytes(ctx, message)
	if err != nil {
		log := contextutils.GetLogger(ctx, "server.onRecieve")
		log.WithFields(logrus.Fields{"err": err, "message": message}).Error("Recieved invalid state")

		// since we got a bad state, we will just send our current state
		// back to this client, so it doesn't try to send this bad state again
		sb := contextutils.GetStateBytes(ctx)
		reply(sb)
		return
	}
	broadcast(message)
}

// CreateServer starts up a new server and populates the initial state.
// To stop it, call the returned cancel function.
func CreateServer(port int, od lige.OutputDevice) (context.CancelFunc, error) {
	ctxWithState, err := contextutils.WithState(context.Background(), InitialStateBytes)
	if err != nil {
		return nil, err
	}
	ctx, cancelFunc := context.WithCancel(
		contextutils.WithOutputDevice(
			contextutils.WithLogger(
				ctxWithState,
				logrus.New(),
			),
			od,
		),
	)
	websocketServerErr := websocketserver.CreateWebsocketServer(
		ctx,
		port,
		onOpen,
		onRecieve,
	)
	if websocketServerErr != nil {
		return cancelFunc, websocketServerErr
	}

	go output.Output(ctx)
	return cancelFunc, nil
}
