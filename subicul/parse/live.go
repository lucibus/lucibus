package parse

import "github.com/guregu/null"

// Live holds everything that is currently up on stage atm
type Live struct {
	Level   Level       `json:"level"`
	Cue     null.String `json:"cue"`
	Systems Systems     `json:"systems"`
}

// Output returns the Output of this `Live`.
func (l *Live) Output(st *State) (o Output, e error) {
	o = Output{}

	if !l.Cue.IsZero() {

		c := st.Cues.Find(*(l.Cue.Ptr()))
		if c != nil {
			o, e = c.Output(st)
			if e != nil {
				return
			}
		}
	}
	sO, e := l.Systems.Output(st)
	if e != nil {
		return o, e
	}
	o.AddOnTop(sO)
	o.MultiplyBy(l.Level)
	return
}
