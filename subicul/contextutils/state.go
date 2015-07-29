package contextutils

import (
	"sync"

	"github.com/Sirupsen/logrus"
	"github.com/lucibus/subicul/parse"
	"golang.org/x/net/context"
)

const globalKey = "global"

// global just holds the state. The reason why we need a wrapper struct,
// is so that even if the memory address of the state changes, all contexts
// can still access the new one, because the memory address of the `global`
// doesnt change
type global struct {
	state      *parse.State
	stateBytes []byte
	sync.Mutex
}

func getGlobal(ctx context.Context) *global {
	g, ok := ctx.Value(globalKey).(*global)
	if ok != true {
		log := GetLogger(ctx, "contextutils.state")
		log.WithFields(logrus.Fields{
			"ctx":       ctx,
			"globalKey": globalKey,
		}).Fatal("cant get global key for state")
		return &global{}
	}
	return g
}

// GetState returns the current state from the context. If none is set,
// an error will be logged and nil will be returned.
func GetState(ctx context.Context) *parse.State {
	g := getGlobal(ctx)
	g.Lock()
	defer g.Unlock()
	return g.state
}

// GetStateBytes returns the bytes that make up the JSON of the current state.
// if none is set, an error will be logged and nil will be returned
func GetStateBytes(ctx context.Context) []byte {

	g := getGlobal(ctx)
	g.Lock()
	defer g.Unlock()
	return g.stateBytes
}

// WithState returns a new context with the updated state
func WithState(ctx context.Context, stateBytes []byte) (context.Context, error) {
	state, err := parse.Parse(stateBytes)
	return context.WithValue(ctx, globalKey, &global{state: state, stateBytes: stateBytes}), err
}

// SetStateBytes mutates the a value in the context to change the state value
func SetStateBytes(ctx context.Context, stateBytes []byte) error {
	g := getGlobal(ctx)
	state, err := parse.Parse(stateBytes)
	if err != nil {
		return err
	}
	g.Lock()
	g.state = state
	g.stateBytes = stateBytes
	g.Unlock()
	return nil
}
