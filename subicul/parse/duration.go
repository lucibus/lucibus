package parse

import "time"

// Duration is the number of MS in a duration
type Duration int

// Unmarshal converts a int of ms into a go duration
func (d Duration) Unmarshal() time.Duration {
	return time.Duration(int(time.Millisecond) * int(d))
}

// DurationMarshall converst a go Duration into an int
func DurationMarshall(t time.Duration) Duration {
	return Duration(int(t) / int(time.Millisecond))
}
