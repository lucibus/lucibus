package output

import (
	"github.com/Sirupsen/logrus"
	"github.com/lucibus/lucibus/subicul/contextutils"
	"golang.org/x/net/context"
)

// Output will continuiously get the State from the context and try to output
// it to an output device
func Output(ctx context.Context) {
	log := contextutils.GetLogger(ctx, "output")
	a := *contextutils.GetDMXAdaptor(ctx)
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
		err = a.OutputDMX(o, 512)
		if err != nil {
			log.WithFields(logrus.Fields{
				"DMX adaptor": a,
				"err":         err,
				"output":      o,
			}).Error("can't output dimmers")
		}

	}
}
