package contextutils

import (
	"github.com/Sirupsen/logrus"
	"golang.org/x/net/context"
)

const globalKey = "global"

// State holds all the current information to make up the show + live
// i.e. the patch, cues, etc.
type State []byte

// global just holds the state. The reason why we need a wrapper struct,
// is so that even if the memory address of the state changes, all contexts
// can still access the new one, because the memory address of the `global`
// doesnt change
type global struct {
	state State
}

func getGlobal(ctx context.Context) *global {
	g, ok := ctx.Value(globalKey).(*global)
	if ok != true {
		logrus.WithFields(logrus.Fields{
			"ctx":       ctx,
			"globalKey": globalKey,
		}).Fatal("context: cant get global key for state")
		return &global{}
	}
	return g
}

// GetState returns the current state from the context. If none is set,
// an error will be logged and nil will be returned.
func GetState(ctx context.Context) State {
	return getGlobal(ctx).state
}

// WithState returns a new context with the updated state
func WithState(ctx context.Context, state State) context.Context {
	return context.WithValue(ctx, globalKey, &global{state})
}

// SetState mutates the a value in the context to change the state value
func SetState(ctx context.Context, state State) {
	g := getGlobal(ctx)
	g.state = state
}
