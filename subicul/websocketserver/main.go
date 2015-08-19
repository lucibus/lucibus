package websocketserver

import (
	"golang.org/x/net/context"

	"github.com/Sirupsen/logrus"
	log "github.com/Sirupsen/logrus"
	"github.com/lucibus/dmx"
	"github.com/lucibus/lucibus/subicul/contextutils"
	"github.com/lucibus/lucibus/subicul/output"
)

// InitialState is the json the server sends to the client when it first
// starts up
var InitialStateBytes = []byte(`
{
	"live": {
		"level": 1,
		"systems": []
	}
}`)

func stateServerOnOpen(ctx context.Context, reply, broadcast func([]byte)) {
	sb, err := contextutils.GetStateBytes(ctx)
	if err == nil {
		reply(sb)
	} else {
		log.WithFields(logrus.Fields{
			"package":     "websocketserver.main.stateServerOnOpen",
			"err":         err,
			"state bytes": sb,
		}).Error("Cant turn state into JSON")
	}
}

func stateServerOnRecieve(ctx context.Context, message []byte, reply, broadcast func([]byte)) {
	err := contextutils.SetStateBytes(ctx, message)
	if err != nil {
		log.WithFields(logrus.Fields{
			"package": "websocketserver.main.stateServerOnRecieve",
			"err":     err,
			"message": message,
		}).Error("Recieved invalid state")
	} else {
		broadcast(message)
	}
}

// MakeStateServer starts up a new server and populates the initial state.
func MakeStateServer(ctx context.Context, port int, a dmx.Adaptor) error {
	ctxWithState, err := contextutils.WithState(ctx, InitialStateBytes)
	if err != nil {
		return err
	}
	ctx = contextutils.WithDMXAdaptor(ctxWithState, a)

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
