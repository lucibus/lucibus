// Package contextutils provides helper functions for getting and setting values
// from a context.Context.
package contextutils

import (
	"github.com/Sirupsen/logrus"
	"golang.org/x/net/context"
)

const logKey = "logging"

// GetLogger returns the current logger from the context. If none is set,
// an error will be logged and a default logger will be returned.
// It also sets the "module" key.
func GetLogger(ctx context.Context, module string) *logrus.Entry {
	logger, ok := ctx.Value(logKey).(*logrus.Logger)
	if ok != true {
		logrus.WithFields(logrus.Fields{
			"ctx": ctx,
			"key": logKey,
		}).Error("context: cant get logger")
		logger = &logrus.Logger{}
	}

	return logger.WithField("module", module)
}

// WithLogger returns a new context with the logger valyue set
func WithLogger(ctx context.Context, logger *logrus.Logger) context.Context {
	return context.WithValue(ctx, logKey, logger)
}
