package parse

import "time"

// LiveCue is the current cue that is up
type LiveCue struct {
	UUID    string  `json:"uuid,omitempty"`
	Time    Time    `json:"time,omitempty"`
	Percent float32 `json:"percent,omitempty"`
}

// Output will figure out what the output of the current cue is.
//
// It will use the `Time` or `Percent` to figure out how much of the transition
// from the previous has happened
//
// If there is a `Time` it will use this as the time started for the
// current cue, looking at the duration of the current cue as the transition.
// time. Then with the `now` time it can figure out how far the transition is
// along
//
// Otherwise, it will look at the `Percent` to show how long the transition is
// along
//
// If this is the first cue, it will transition from a blank output to it
func (lc *LiveCue) Output(st *State, now time.Time) (Output, error) {
	c, prevC := st.Cues.Find(lc.UUID)
	if c == nil {
		return Output{}, nil
	}
	curOutput, err := c.Output(st)
	if err != nil {
		return nil, err
	}
	var prevOutput Output
	if prevC == nil {
		prevOutput = Output{}
	} else {
		prevOutput, err = prevC.Output(st)
		if err != nil {
			return nil, err
		}
	}

	var percent float32
	if lc.Time == "" {
		percent = lc.Percent
	} else {
		startTime, err := lc.Time.Unmarshal()
		if err != nil {
			return nil, err
		}
		elapsed := now.Sub(startTime)
		duration := c.Duration.Unmarshal()
		percent = float32(elapsed) / float32(duration)
		if percent > 1 {
			percent = 1
		}
	}
	return prevOutput.TransitionTo(curOutput, percent), nil
}
