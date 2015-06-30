package parse

import (
	"encoding/json"
	"fmt"
	"strconv"

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

type PatchItem struct {
	Tags        []string
	FixtureType string
	Address     int
}

type Patch []PatchItem

func (p Patch) Filter(pi PatchItem) (o Output) {
	// first we wanna see if there are only adresses passed in.
	// if so, we just return that address

	if len(pi.Tags) == 0 && len(pi.FixtureType) == 0 {
		return Output{pi.Address: Full}
	}
	o = Output{}
	for _, pit := range p {
		includesTags := subset(pi.Tags, pit.Tags)
		includesFixtureType := len(pi.FixtureType) == 0 || pi.FixtureType == pit.FixtureType
		includesAddress := pi.Address == 0 || pi.Address == pit.Address
		if includesTags && includesFixtureType && includesAddress {
			o[pit.Address] = Full
		}
	}
	return o

}

type CombinedSystem struct {
	Level   Level
	Systems []struct {
		Type       string
		Level      Level
		ID         int `json:"id"`
		Specifiers PatchItem
	}
}

// Output gives you the total address outputs for this system, by merging all
// the outputs of the subsystems at their correct levels
func (cs *CombinedSystem) Output(s State) (o Output, e error) {
	// the systems in the current state are ordered with the highest presedence
	// first. so we want to iterate through them in reverse
	// (from http://stackoverflow.com/a/13191474/907060), so that the lowest
	// presedence comes first
	o = Output{}
	for i := len(cs.Systems) - 1; i >= 0; i-- {
		sq := cs.Systems[i]
		var co Output
		switch sq.Type {
		case "filter":
			co = s.Patch.Filter(sq.Specifiers)
		case "look":
			co, e = s.Looks.Find(sq.ID, s)
		}
		if e != nil {
			return
		}
		co.MultiplyBy(sq.Level)
		if e = o.AddOnTop(co); e != nil {
			return
		}
	}
	return
}

// we point to a reference of the struct instead of the actual struct
// so that we can deference it later (http://stackoverflow.com/a/13101613/907060)
type Looks map[string]*struct {
	CombinedSystem
	Name string
}

func (l Looks) Find(ID int, s State) (o Output, e error) {
	IDString := strconv.Itoa(ID)
	o, e = l[IDString].Output(s)
	return
}

type Cues map[string]*struct {
	CombinedSystem
	Name string
}

func (c Cues) Find(ID int, s State) (o Output, e error) {
	IDString := strconv.Itoa(ID)
	o, e = c[IDString].Output(s)
	return
}

type Live struct {
	CombinedSystem
	Cue struct {
		Level Level
		ID    int `json:"id"`
	}
}

func (l *Live) Output(s State) (o Output, e error) {
	var systemsO Output
	if systemsO, e = l.CombinedSystem.Output(s); e != nil {
		return
	}
	if l.Cue.Level != 0 {
		if o, e = s.Cues.Find(l.Cue.ID, s); e != nil {
			return
		}
		o.MultiplyBy(l.Cue.Level)
		o.AddOnTop(systemsO)
	} else {
		o = systemsO
	}

	return

}

type State struct {
	Patch Patch
	Live  Live
	Looks Looks
	Cues  Cues
}

func (s *State) Output() (o Output, e error) {
	if o, e = s.Live.Output(*s); e != nil {
		return
	}
	o.MultiplyBy(s.Live.Level)
	return
}

// Parse takes a state json and returns the state for it
func Parse(b []byte) (*State, error) {
	var s State
	return &s, json.Unmarshal(b, &s)
}

func ParseAndOutput(b []byte) (Output, error) {
	s, err := Parse(b)
	if err != nil {
		return nil, err
	}
	return s.Output()
}
