package parse

type Cues []Cue

type Cue struct {
	Name     string   `json:"name"`
	UUID     string   `json:"uuid"`
	Systems  Systems  `json:"systems"`
	Duration Duration `json:"duration"`
}

func (c *Cue) Output(st *State) (Output, error) {
	return c.Systems.Output(st)
}

// Find returns the current cue and the one before it. If None is before it
// it returns null
func (cs *Cues) Find(UUID string) (c, prevC *Cue) {
	for i, c := range *cs {
		if c.UUID == UUID {
			return &c, prevC
		}
		prevC = &(*cs)[i]
	}
	return nil, nil
}
