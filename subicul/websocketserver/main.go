package websocketserver

import (
	"golang.org/x/net/context"

	"github.com/Sirupsen/logrus"
	lige "github.com/lucibus/lige/output"
	"github.com/lucibus/lucibus/subicul/contextutils"
	"github.com/lucibus/lucibus/subicul/output"
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

func stateServerOnOpen(ctx context.Context, reply, broadcast func([]byte)) {
	sb := contextutils.GetStateBytes(ctx)
	reply(sb)
}

func stateServerOnRecieve(ctx context.Context, message []byte, reply, broadcast func([]byte)) {
	err := contextutils.SetStateBytes(ctx, message)
	if err != nil {
		log := contextutils.GetLogger(ctx, "server.onRecieve")
		log.WithFields(logrus.Fields{"err": err, "message": message}).Error("Recieved invalid state")
	} else {
		broadcast(message)
	}
}

// MakeStateServer starts up a new server and populates the initial state.
func MakeStateServer(ctx context.Context, port int, od lige.OutputDevice) error {
	ctxWithState, err := contextutils.WithState(ctx, InitialStateBytes)
	if err != nil {
		return err
	}
	ctx = contextutils.WithOutputDevice(
		contextutils.WithLogger(ctxWithState, logrus.New()),
		od,
	)
	websocketServerErr := CreateWebsocketServer(
		ctx,
		port,
		stateServerOnOpen,
		stateServerOnRecieve,
	)
	if websocketServerErr != nil {
		return websocketServerErr
	}

	go output.Output(ctx)
	return nil
}
