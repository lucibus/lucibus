package parse

import (
	"encoding/json"

	"github.com/xeipuuv/gojsonschema"
)

// State contains everything that makes up the current show and stage
type State struct {
	Patch Patch `json:"patch"`
	Live  Live  `json:"live"`
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
	schema, err := getSchema()
	if err != nil {
		return nil, err
	}
	result, err := gojsonschema.Validate(schema, gojsonschema.NewStringLoader(string(b)))
	if err != nil {
		return nil, err
	}
	if !result.Valid() {
		return nil, &SchemaError{result.Errors()}
	}
	var s State
	return &s, json.Unmarshal(b, &s)
}

// MakeState returns the inital state from the `InitialBytes`
func MakeState() (*State, error) {
	return Parse(InitialBytes)
}

// ParseAndOutput will simply combines Output() with Parse().
func ParseAndOutput(b []byte) (Output, error) {
	s, err := Parse(b)
	if err != nil {
		return nil, err
	}
	return s.Output()
}
