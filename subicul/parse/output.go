package parse

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/imdario/mergo"
)

// Full is the highest level of dimmer we can output
const Full byte = 255

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

func transition(firstLevel, nextLevel byte, percent float32) byte {
	difference := int(nextLevel) - int(firstLevel)
	return byte(float32(firstLevel) + percent*float32(difference))
}

// TransitionTo will blend the two outputs together, using `percent` to know
// how far along they are. It will use a linear blend.
func (o Output) TransitionTo(next Output, percent float32) Output {
	combined := Output{}
	for address, firstLevel := range o {
		nextLevel := next[address]
		combined[address] = transition(firstLevel, nextLevel, percent)
	}
	for address, nextLevel := range next {
		firstLevel := o[address]
		combined[address] = transition(firstLevel, nextLevel, percent)
	}
	return combined
}

// OutputFromJSON takes a JSON mapping of strings to numbers and returns an output
func OutputFromJSON(b []byte) (o *Output, err error) {
	var oj map[string]int
	err = json.Unmarshal(b, &oj)
	if err != nil {
		return
	}
	o = &(Output{})
	for addressString, levelInt := range oj {
		var address int
		address, err = strconv.Atoi(addressString)
		if err != nil {
			return
		}
		level := byte(levelInt)
		(*o)[address] = level
	}
	return
}
