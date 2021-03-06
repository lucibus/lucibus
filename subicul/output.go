package subicul

import (
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/lucibus/dmx"
	"golang.org/x/net/context"
)

// Output will continuiously get the State from the context and try to output
// it to an output device
func Output(ctx context.Context, a dmx.Adaptor) {
	err := a.Connect()
	if err != nil {
		log.WithFields(log.Fields{
			"err":     err,
			"adaptor": a,
		}).Error("cant connect to adaptor")
	}
	defer a.Finalize()
	for {
		select {
		case <-ctx.Done():
			close(ctx.Value("IsDone").(chan interface{}))
			return
		// case <-time.After(time.Millisecond):
		default:
		}
		stateMutex.RLock()
		o, err := state.Output(time.Now())
		stateMutex.RUnlock()
		// fmt.Println(state, o)
		if err != nil {
			log.WithFields(log.Fields{
				"package": "output",
				"err":     err,
				"state":   state,
			}).Error("can't get output for state")
			continue
		}
		select {
		case <-ctx.Done():
			close(ctx.Value("IsDone").(chan interface{}))
			return
		default:
			err := a.OutputDMX(o, 512)
			// fmt.Println(o)
			if err != nil {
				log.WithFields(log.Fields{
					"package":     "output",
					"DMX adaptor": a,
					"err":         err,
					"output":      o,
				}).Error("can't output dimmers")
			}

		}
	}
}
