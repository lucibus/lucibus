package parse

import "time"

// Live holds everything that is currently up on stage atm
type Live struct {
	Level   Level   `json:"level"`
	LiveCue LiveCue `json:"cue"`
	Systems Systems `json:"systems"`
}

// Output returns the Output of this `Live`.It combines the LiveCue
// output with the output of the systems and levels them all with Level
func (l *Live) Output(st *State, now time.Time) (o Output, e error) {
	o = Output{}
	o, e = l.LiveCue.Output(st, now)
	if e != nil {
		return
	}
	sO, e := l.Systems.Output(st)
	if e != nil {
		return o, e
	}
	o.AddOnTop(sO)
	o.MultiplyBy(l.Level)
	return
}
