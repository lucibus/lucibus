package parse

type Cues []Cue

type Cue struct {
	Name    string  `json:"name"`
	UUID    string  `json:"uuid"`
	Systems Systems `json:"systems"`
}

func (c *Cue) Output(st *State) (Output, error) {
	return c.Systems.Output(st)
}

func (cs *Cues) Find(UUID string) *Cue {
	for _, c := range *cs {
		if c.UUID == UUID {
			return &c
		}
	}
	return nil
}
