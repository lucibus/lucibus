package parse

import (
	"fmt"

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
