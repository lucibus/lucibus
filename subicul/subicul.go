package subicul

import (
	"sync"

	"golang.org/x/net/context"

	"github.com/Sirupsen/logrus"
	log "github.com/Sirupsen/logrus"
	"github.com/lucibus/dmx"
	"github.com/lucibus/lucibus/subicul/parse"
	"github.com/lucibus/lucibus/subicul/websocketserver"
)

// state is the current global state
var state *parse.State
var stateMutex = &sync.RWMutex{}

func stateServerOnOpen(ctx context.Context, reply, broadcast func([]byte)) {
	stateMutex.RLock()
	defer stateMutex.RUnlock()
	sb, err := state.ToJSON()
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
	tmpState, err := parse.Parse(message)
	if err != nil {
		log.WithFields(logrus.Fields{
			"package": "websocketserver.main.stateServerOnRecieve",
			"err":     err,
			"message": message,
		}).Error("Recieved invalid state")
		return
	}
	message, err = state.ToJSON()
	if err != nil {
		log.WithFields(logrus.Fields{
			"package": "websocketserver.main.stateServerOnRecieve",
			"err":     err,
			"message": message,
		}).Error("Cant turn state into JSON")
		return
	}
	stateMutex.Lock()
	state = tmpState
	stateMutex.Unlock()
	broadcast(message)

}

// MakeStateServer starts up a new server and populates the initial state.
func MakeStateServer(ctx context.Context, port int, o dmx.Adaptor) (err error) {

	tmpState, err := parse.MakeState()
	if err != nil {
		return
	}
	stateMutex.Lock()
	state = tmpState
	stateMutex.Unlock()
	err = websocketserver.Create(
		ctx,
		port,
		stateServerOnOpen,
		stateServerOnRecieve,
	)
	if err != nil {
		return
	}

	go Output(ctx, o)
	return
}
