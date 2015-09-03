package parse

import (
	"encoding/json"
	"time"
)

// Time is how times are stored in the JSON
type Time string

// TimeLongForm is the format for storing time in the JSON
const TimeLongForm = "2006-01-02 15:04:05.000000000-0700"

// Unmarshal converts a string of time into a go time
func (t *Time) Unmarshal() (time.Time, error) {
	return time.Parse(TimeLongForm, string(*t))
}

// TimeMarshall converst a go time to a string
func TimeMarshall(t time.Time) Time {
	return Time(t.Format(TimeLongForm))
}

// TimeFromJSON takes a JSON of a string
func TimeFromJSON(b []byte) (t Time, err error) {
	var tj string
	err = json.Unmarshal(b, &tj)
	if err != nil {
		return
	}
	return Time(tj), nil
}
