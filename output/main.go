package output

import (
	"github.com/Sirupsen/logrus"
	lige "github.com/lucibus/lige/output"
	"github.com/lucibus/subicul/contextutils"
	"github.com/lucibus/subicul/parse"
	"golang.org/x/net/context"
)

// Output will continuiously get the State from the context and try to output
// it to an output device
func Output(ctx context.Context) {
	logI := contextutils.GetLogger(ctx).WithField("package", "output")
	od := contextutils.GetOutputDevice(ctx)
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		stateBytes := contextutils.GetState(ctx)
		o, err := parse.Parse(stateBytes)
		if err != nil {
			logI.WithFields(logrus.Fields{
				"err":        err,
				"stateBytes": stateBytes,
			}).Error("can't parse state")
			continue
		}
		err = od.Set(lige.State(o))
		if err != nil {
			logI.WithFields(logrus.Fields{
				"output device": od,
				"err":           err,
				"output":        o,
			}).Error("can't output dimmers")
		}

	}
}
