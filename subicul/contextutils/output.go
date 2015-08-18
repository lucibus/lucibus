package contextutils

import (
	"github.com/Sirupsen/logrus"
	log "github.com/Sirupsen/logrus"
	"github.com/lucibus/dmx"
	"golang.org/x/net/context"
)

const outputKey = "DMXAdaptor"

// GetDMXAdaptor returns the current DMXAdaptor from the context. If none is set,
// an error will be logged.
func GetDMXAdaptor(ctx context.Context) *dmx.Adaptor {
	od, ok := ctx.Value(outputKey).(*dmx.Adaptor)
	if ok != true {
		log.WithFields(logrus.Fields{
			"package": "contextutils.output",
			"ctx":     ctx,
			"key":     outputKey,
		}).Error("cant get DMXAdaptor")
		return nil
	}
	return od
}

// WithDMXAdaptor returns a new context with the DMXAdaptor value set
func WithDMXAdaptor(ctx context.Context, DMXAdaptor dmx.Adaptor) context.Context {
	DMXAdaptor.Connect()
	return context.WithValue(ctx, outputKey, &DMXAdaptor)
}
