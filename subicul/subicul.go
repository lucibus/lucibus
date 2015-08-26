package subicul

import (
	"net/http"
	"sync"

	log "github.com/Sirupsen/logrus"
	"github.com/lucibus/lucibus/subicul/parse"
	"github.com/olahol/melody"
)

// state is the current global state
var state *parse.State
var stateMutex = &sync.RWMutex{}

func createOnConnect(m *melody.Melody) func(*melody.Session) {
	return func(s *melody.Session) {
		stateMutex.RLock()
		defer stateMutex.RUnlock()
		sb, err := state.ToJSON()
		if err == nil {
			log.WithFields(log.Fields{
				"message": string(sb),
			}).Info("Sending initial message")
			s.Write(sb)
		} else {
			log.WithFields(log.Fields{
				"package": "websocketserver.main.stateServerOnOpen",
				"err":     err,
				"state":   string(sb),
			}).Error("Cant turn state into JSON")
		}
	}
}

func createOnMessage(m *melody.Melody) func(*melody.Session, []byte) {
	return func(s *melody.Session, msg []byte) {
		tmpState, err := parse.Parse(msg)
		if err != nil {
			log.WithFields(log.Fields{
				"package": "subicul.stateServerOnRecieve",
				"err":     err,
				"message": string(msg),
			}).Error("Recieved invalid state")
			return
		}
		msg, err = tmpState.ToJSON()
		if err != nil {
			log.WithFields(log.Fields{
				"package": "subicul.stateServerOnRecieve",
				"err":     err,
				"message": string(msg),
			}).Error("Cant turn state into JSON")
			return
		}
		log.WithFields(log.Fields{
			"message": string(msg),
		}).Info("Got message")
		stateMutex.Lock()
		state = tmpState
		stateMutex.Unlock()
		m.BroadcastOthers(msg, s)
	}
}

var handleFunc func(http.ResponseWriter, *http.Request)

func HandleFunc() func(http.ResponseWriter, *http.Request) {
	if handleFunc == nil {
		m := melody.New()
		m.HandleMessage(createOnMessage(m))
		m.HandleConnect(createOnConnect(m))
		m.Upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		handleFunc = m.HandleRequest
	}
	return handleFunc
}

func ResetState() (err error) {
	tmpState, err := parse.MakeState()
	if err != nil {
		return
	}
	stateMutex.Lock()
	state = tmpState
	stateMutex.Unlock()
	return
}
