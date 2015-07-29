package output

import (
	"github.com/Sirupsen/logrus"
	lige "github.com/lucibus/lige/output"
	"github.com/lucibus/lucibus/subicul/contextutils"
	"golang.org/x/net/context"
)

// Output will continuiously get the State from the context and try to output
// it to an output device
func Output(ctx context.Context) {
	log := contextutils.GetLogger(ctx, "output")
	od := contextutils.GetOutputDevice(ctx)
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		s := contextutils.GetState(ctx)
		o, err := s.Output()
		if err != nil {
			log.WithFields(logrus.Fields{
				"err":   err,
				"state": s,
			}).Error("can't get output for state")
			continue
		}
		err = od.Set(lige.State(o))
		if err != nil {
			log.WithFields(logrus.Fields{
				"output device": od,
				"err":           err,
				"output":        o,
			}).Error("can't output dimmers")
		}

	}
}
