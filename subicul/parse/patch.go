package parse

import "strconv"

// Query is used to select certain certain lights dynamically
type Query []QueryItem

// QueryItem is one selector for choosing lights
type QueryItem struct {
	Address Address `json:"address,omitempty"`
	Tag     Tag     `json:"tag,omitempty"`
}

func containsTag(as []Tag, e Tag) bool {
	for _, a := range as {
		if a == e {
			return true
		}
	}
	return false
}

// Matches checks if an address and tag is matched under this part of the query
func (qi *QueryItem) Matches(a Address, ts []Tag) bool {
	return (qi.Address != 0 && qi.Address == a) || (qi.Tag != "" && containsTag(ts, qi.Tag))
}

// Tag is a label for a certain light
type Tag string

// Patch holds the mapping of addresses to their attributes
type Patch map[string][]Tag

func (p *Patch) matchesAddress(q Query, a Address) bool {
	for _, qi := range q {
		if !qi.Matches(a, (*p)[strconv.Itoa(int(a))]) {
			return false
		}
	}
	return true
}

// Filter returns all the addresses that match a certain query
func (p *Patch) Filter(q Query) (as []Address) {
	for a := Address(1); a <= MaxAddress; a++ {
		if p.matchesAddress(q, a) {
			as = append(as, a)
		}
	}
	return
}
