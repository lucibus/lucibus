package contextutils

import (
	"github.com/Sirupsen/logrus"
	lige "github.com/lucibus/lige/output"
	"golang.org/x/net/context"
)

const outputKey = "outputDevice"

// GetOutputDevice returns the current OutputDevice from the context. If none is set,
// an error will be logged.
func GetOutputDevice(ctx context.Context) lige.OutputDevice {
	od, ok := ctx.Value(outputKey).(lige.OutputDevice)
	if ok != true {
		log := GetLogger(ctx, "contextutils.output")
		log.WithFields(logrus.Fields{
			"ctx": ctx,
			"key": outputKey,
		}).Error("cant get OutputDevice")
		return nil
	}
	return od
}

// WithOutputDevice returns a new context with the OutputDevice value set
func WithOutputDevice(ctx context.Context, OutputDevice lige.OutputDevice) context.Context {
	return context.WithValue(ctx, outputKey, OutputDevice)
}
