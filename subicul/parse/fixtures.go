package parse

import (
	"path"
	"strings"

	"github.com/lucibus/lucibus/subicul/parse/api"
)

func getValid(name string) ([]byte, error) {
	path := path.Join("valid", name)
	return api.Asset(path)
}

// ValidState returns a valid schema from `../api/valid`
func ValidState(name string) ([]byte, error) {
	return getValid(name + ".state.json")
}

// Fixture is a fixture imported from ../api/valid. It is used for testing.
type Fixture struct {
	State  []byte
	Output *Output
	Name   string
}

// GetFixture return a fixture from ../api/vali
func GetFixture(name string) (f Fixture, err error) {
	f = Fixture{Name: name}
	f.State, err = ValidState(f.Name)
	if err != nil {
		return
	}
	var oj []byte
	oj, err = getValid(name + ".output.json")
	if err != nil {
		return
	}
	f.Output, err = OutputFromJSON(oj)
	return
}

// GetFixtures returns all the fixture from ../api/valid
func GetFixtures() (fs []*Fixture, err error) {
	allValid, err := api.AssetDir("valid")
	if err != nil {
		return
	}
	fs = []*Fixture{}
	for _, fileName := range allValid {
		if strings.HasSuffix(fileName, ".output.json") {
			name := strings.TrimSuffix(fileName, ".output.json")
			var f Fixture
			f, err = GetFixture(name)
			if err != nil {
				return
			}
			fs = append(fs, &f)
		}
	}
	return
}
