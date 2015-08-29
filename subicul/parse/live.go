package parse

// Live holds everything that is currently up on stage atm
type Live struct {
	Level   Level    `json:"level"`
	Systems []System `json:"systems"`
}

type System struct {
	Level Level  `json:"level"`
	Query Query  `json:"query"`
	UUID  string `json:"uuid"`
}

func (s *System) Output(st State) (o Output) {
	o = Output{}
	for _, a := range st.Patch.Filter(s.Query) {
		o[int(a)] = byte(float32(s.Level) * float32(Full))
	}
	return
}

// Output returns the Output of this `Live`.
func (l *Live) Output(st State) (o Output, e error) {
	// the systems in the current state are ordered with the highest presedence
	// first. so we want to iterate through them in reverse
	// (from http://stackoverflow.com/a/13191474/907060), so that the lowest
	// presedence comes first
	o = Output{}
	for i := len(l.Systems) - 1; i >= 0; i-- {
		s := l.Systems[i]
		co := s.Output(st)
		if e = o.AddOnTop(co); e != nil {
			return
		}
	}
	return

}
