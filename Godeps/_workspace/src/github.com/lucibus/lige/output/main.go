package output

type State map[int]byte

func (s *State) Keys() (keys []int) {
	for k := range *s {
		keys = append(keys, k)
	}
	return
}

type OutputDevice interface {
	Set(State) error
}
