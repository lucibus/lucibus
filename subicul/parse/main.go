package parse

import (
	"encoding/json"
	"fmt"

	"github.com/imdario/mergo"
)

// Output is a mapping for DMX output
type Output map[int]byte

// MultiplyBy will take all the output values and multiply them by some float.
// It will cap at the maximum byte size of 255, if the resault would be over
func (o Output) MultiplyBy(p Level) error {
	if p < 0 {
		return fmt.Errorf("output: cannot multiply output by negative number %g", p)
	}
	for key, value := range o {
		newValue := Level(value) * p
		if newValue > 255 {
			newValue = 255
		}
		o[key] = byte(newValue)
	}
	return nil
}

// AddOnTop takes another output and adds it at a higher priority to this output
// merging the two
func (o Output) AddOnTop(higherPriority Output) error {
	return mergo.MergeWithOverwrite(&o, higherPriority)
}

// Full is the highest level of dimmer we can output
const Full byte = 255

// Level describes what output a certain instrument, or groups of instruments
// is set to
type Level float32

// Live holds everything that is currently up on stage atm
type Live struct {
	Level   Level `json:"level"`
	Systems []struct {
		Level   Level `json:"level"`
		Address int   `json:"address"`
	} `json:"systems"`
}

// Output returns the Output of this `Live`.
func (l *Live) Output(s State) (o Output, e error) {
	// the systems in the current state are ordered with the highest presedence
	// first. so we want to iterate through them in reverse
	// (from http://stackoverflow.com/a/13191474/907060), so that the lowest
	// presedence comes first
	o = Output{}
	for i := len(l.Systems) - 1; i >= 0; i-- {
		s := l.Systems[i]
		co := Output{s.Address: Full}
		co.MultiplyBy(s.Level)
		if e = o.AddOnTop(co); e != nil {
			return
		}
	}
	return

}

// State contains everything that makes up the current show and stage
type State struct {
	Live Live `json:"live"`
}

// Output gives the DMX address to value mapping of the current state
func (s *State) Output() (o Output, e error) {
	if o, e = s.Live.Output(*s); e != nil {
		return
	}
	o.MultiplyBy(s.Live.Level)
	return
}

// ToJSON returns the JSON representation of the state
func (s *State) ToJSON() ([]byte, error) {
	return json.Marshal(s)
}

// Parse takes a state json and returns the state for it
func Parse(b []byte) (*State, error) {
	var s State
	return &s, json.Unmarshal(b, &s)
}

// ParseAndOutput will simply combines Output() with Parse().
func ParseAndOutput(b []byte) (Output, error) {
	s, err := Parse(b)
	if err != nil {
		return nil, err
	}
	return s.Output()
}
